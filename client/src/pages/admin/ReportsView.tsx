import React, { useState, useEffect } from 'react';
import {
  Download,
  ChefHat,
  Coffee,
  Cigarette,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useOrderStore } from '../../store/useOrderStore';

// Keep existing DEPARTMENTS as requested (Static for now as we don't have category data in orders yet)
const DEPARTMENTS = [
  { id: 'KITCHEN', name: 'Kitchen', icon: ChefHat, color: 'orange' },
  { id: 'DRINK', name: 'Drink', icon: Coffee, color: 'blue' },
  { id: 'BAKERY', name: 'Bakery', icon: Coffee, color: 'amber' },
  { id: 'HUKKA', name: 'Hookah', icon: Cigarette, color: 'purple' },
];

const ReportsView: React.FC = () => {
  const {
    fetchHistory,
    historyOrders,
    historyDebtSettlements,
    isLoading
  } = useOrderStore();

  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);


  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const ordersForSummary = (historyOrders || []).filter(order => {
    const dateObj = new Date(order.updatedAt || order.createdAt || Date.now());
    const orderDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    return !filterDate || orderDate === filterDate;
  });

  const salesSummary = ordersForSummary.reduce((acc, order) => {
    let cash = Number(order.cashAmount || 0);
    let online = Number(order.onlineAmount || 0);
    let credit = Number(order.creditAmount || 0);

    if (credit > 0 && !order.customerId) {
      cash += credit;
      credit = 0;
    }

    acc.cash += cash;
    acc.online += online;
    acc.credit += credit;

    if (order.paymentMethod !== 'CREDIT' || !order.customerId) {
      acc.total += (cash + online);
    }

    acc.count += 1;
    return acc;
  }, { total: 0, cash: 0, online: 0, credit: 0, debtSettle: 0, count: 0 });

  (historyDebtSettlements || []).forEach(settlement => {
    try {
      const dateObj = new Date(settlement.createdAt);
      if (isNaN(dateObj.getTime())) return;
      const settleDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      if (settleDate === filterDate) {
        salesSummary.debtSettle += Number(settlement.amount);
      }
    } catch (e) { console.error("Filter settle date error", e); }
  });

  // Calculate Real Department Sales
  const deptStats = ordersForSummary.reduce((acc: any, order) => {
    const orderItems = order.items || [];
    const orderTotal = Number(order.totalAmount || 0);

    let orderCash = Number(order.cashAmount || 0);
    let orderOnline = Number(order.onlineAmount || 0);
    let orderCredit = Number(order.creditAmount || 0);

    // If generic walk-in credit, it's actually cash (logic from summary)
    if (orderCredit > 0 && !order.customerId) {
      orderCash += orderCredit;
      orderCredit = 0;
    }

    orderItems.forEach((item: any) => {
      const dept = item.menuItem?.department || 'KITCHEN';
      if (!acc[dept]) {
        acc[dept] = { revenue: 0, items: 0, cash: 0, online: 0, credit: 0 };
      }

      const itemPrice = Number(item.priceSnapshot || 0);
      const itemTotal = itemPrice * item.quantity;

      acc[dept].revenue += itemTotal;
      acc[dept].items += item.quantity;

      // Proportional Revenue split logic
      if (orderTotal > 0) {
        const ratio = itemTotal / orderTotal;
        acc[dept].cash += orderCash * ratio;
        acc[dept].online += orderOnline * ratio;
        acc[dept].credit += orderCredit * ratio;
      }
    });

    return acc;
  }, {});

  const getColorClasses = (color: string) => {
    const colors: any = {
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
    };
    return colors[color] || colors.orange;
  };

  const handleExport = () => {
    const headers = [
      'Department',
      'TotalItems',
      'Revenue',
      'Cash',
      'Online',
      'Credit',
      'TotalPaidSales'
    ];

    const rows = DEPARTMENTS.map(dept => {
      const stats = deptStats[dept.id] || { revenue: 0, items: 0, cash: 0, online: 0, credit: 0 };
      const totalPaid = stats.cash + stats.online;

      return [
        dept.name,
        stats.items,
        Math.round(stats.revenue),
        Math.round(stats.cash),
        Math.round(stats.online),
        Math.round(stats.credit),
        Math.round(totalPaid)
      ].join(',');
    });

    // Add Overall Summary
    const summaryRow = [
      'TOTAL SALES',
      ordersForSummary.reduce((acc, o) => acc + (o.items?.reduce((a, i) => a + i.quantity, 0) || 0), 0),
      Math.round(salesSummary.total + salesSummary.credit),
      Math.round(salesSummary.cash),
      Math.round(salesSummary.online),
      Math.round(salesSummary.credit),
      Math.round(salesSummary.total)
    ].join(',');

    const csvContent = [headers.join(','), ...rows, '', summaryRow].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `department_sales_report_${filterDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sales Reports</h1>
            <p className="text-gray-600">Overview for <span className="font-semibold">{filterDate}</span></p>
          </div>
          <Button variant="outline" icon={<Download className="w-5 h-5" />} onClick={handleExport}>
            Export CSV
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="h-10 w-10 border-b-2 border-orange-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-orange-500 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Total Revenue (Paid)</p>
                  <Wallet className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Rs. {salesSummary.total.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{salesSummary.count} orders</p>
              </Card>

              <Card className="border-l-4 border-green-500 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Cash Sales</p>
                  <Banknote className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Rs. {salesSummary.cash.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${salesSummary.total ? (salesSummary.cash / salesSummary.total) * 100 : 0}%` }}></div>
                </div>
              </Card>

              <Card className="border-l-4 border-blue-500 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Online Sales</p>
                  <Smartphone className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Rs. {salesSummary.online.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${salesSummary.total ? (salesSummary.online / salesSummary.total) * 100 : 0}%` }}></div>
                </div>
              </Card>

              <Card className="border-l-4 border-red-500 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Credit</p>
                  <CreditCard className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Rs. {salesSummary.credit.toLocaleString()}</p>
                {salesSummary.debtSettle > 0 && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    + Rs. {salesSummary.debtSettle.toLocaleString()} collected
                  </p>
                )}
              </Card>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Department Sales</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {DEPARTMENTS.map((dept) => {
                  const Icon = dept.icon;
                  const c = getColorClasses(dept.color);
                  const stats = deptStats[dept.id] || { revenue: 0, items: 0 };

                  return (
                    <Card key={dept.id} className={`border-l-4 ${c.border} shadow-sm overflow-hidden relative`}>
                      <div className="flex items-center gap-3 mb-3 relative z-10">
                        <div className={`${c.bg} p-2 rounded-lg`}>
                          <Icon className={`${c.text} w-5 h-5`} />
                        </div>
                        <h3 className="font-bold text-gray-700">{dept.name}</h3>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="text-sm text-gray-500">Department Revenue</p>
                        <p className={`text-2xl font-bold ${c.text}`}>
                          Rs. {Math.round(stats.revenue).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                          <p className="text-xs text-gray-400">Total Items Paid</p>
                          <p className="text-sm font-bold text-gray-600">{stats.items}</p>
                        </div>
                      </div>

                      {/* Subtile background decoration */}
                      <div className={`absolute -right-4 -bottom-4 opacity-5 ${c.text}`}>
                        <Icon className="w-20 h-20" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div >
  );
};

export default ReportsView;
