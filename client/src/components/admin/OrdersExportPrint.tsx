import React from "react";
import type { Order } from "../../types/order";

type Props = {
  orders: Order[];
};

const OrdersExportPrint: React.FC<Props> = ({ orders }) => {

  // Export CSV
  const handleExportCSV = () => {
    const filteredOrders = orders.filter(o => o.paymentMethod !== 'CREDIT');
    const headers = ["Order ID", "Table", "Customer", "Status", "Payment Method", "Total Amount"];

    const summary = filteredOrders.reduce((acc, o) => {
        const cash = Number(o.cashAmount || 0);
        const online = Number(o.onlineAmount || 0);
        acc.cash += cash;
        acc.online += online;
        acc.total += (cash + online);
        return acc;
    }, { cash: 0, online: 0, total: 0 });

    const totalOrders = filteredOrders.length;

    const rows = filteredOrders.map(o => [
        o.id.slice(0, 8).toUpperCase(),
        o.tableNumber?.startsWith('WALKIN') ? 'Walk-in' : (o.tableNumber || '-'),
        o.customerName || (o.tableNumber?.startsWith('WALKIN') ? 'Walk-in' : '-'),
        o.status.toUpperCase(),
        o.paymentMethod || '-',
        o.totalAmount,
    ]);

    rows.push([]);
    rows.push(["Sales Summary"]);
    rows.push(["Total Orders", totalOrders]);
    rows.push(["Total Sales", summary.total.toFixed(2)]);
    rows.push(["Cash Amount", summary.cash.toFixed(2)]);
    rows.push(["Online Amount", summary.online.toFixed(2)]);

    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  // Print
  const handlePrint = () => {
    const filteredOrders = orders.filter(o => o.paymentMethod !== 'CREDIT');

    // Calculate Summary (Cash and Online Only, ignoring Credit)
    const summary = filteredOrders.reduce((acc, o) => {
      if (o.paymentMethod === 'CASH') {
        const amt = Number(o.totalAmount || 0);
        acc.cash += amt;
        acc.total += amt;
      } else if (o.paymentMethod === 'ONLINE') {
        const amt = Number(o.totalAmount || 0);
        acc.online += amt;
        acc.total += amt;
      } else if (o.paymentMethod === 'MIXED') {
        const cash = Number(o.cashAmount || 0);
        const online = Number(o.onlineAmount || 0);
        acc.cash += cash;
        acc.online += online;
        acc.total += (cash + online);
      }
      return acc;
    }, { cash: 0, online: 0, total: 0 });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableHtml = `
      <html>
        <head>
          <title>Sales Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { margin: 0; font-size: 28px; text-transform: uppercase; }
            .date { color: #666; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f8f8; color: #000; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 15px 10px; border-bottom: 2px solid #ddd; text-align: left; }
            td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .amount { font-weight: bold; text-align: right; }
            .summary-container { margin-top: 50px; display: flex; justify-content: flex-end; }
            .summary-card { border: 2px solid #000; padding: 25px; min-width: 320px; background: #fff; }
            .summary-title { margin-top: 0; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .summary-item { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .summary-item span:first-child { color: #666; }
            .summary-item span:last-child { font-weight: bold; }
            .total-received { border-top: 2px solid #000; margin-top: 15px; padding-top: 15px; display: flex; justify-content: space-between; font-weight: 900; font-size: 20px; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Sales Report</h1>
              <div class="date">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold;">Collection Mode</div>
              <div style="color: #10b981;">CASH & ONLINE ONLY</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Table / Source</th>
                <th>Customer Name</th>
                <th>Payment Mode</th>
                <th style="text-align: right;">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(o => {
      const isWalkIn = o.tableNumber?.startsWith('WALKIN');
      const tableDisplay = isWalkIn ? 'Walk-in' : (o.tableNumber || '-');
      const customerDisplay = o.customerName || (isWalkIn ? 'Walk-in' : '-');

      return `
                <tr>
                  <td style="font-family: monospace;">${o.id.slice(0, 8).toUpperCase()}</td>
                  <td>${tableDisplay}</td>
                  <td>${customerDisplay}</td>
                  <td><span style="background: #f0fdf4; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${o.paymentMethod}</span></td>
                  <td class="amount">Rs. ${Number(o.totalAmount).toLocaleString()}</td>
                </tr>`;
    }).join("")}
            </tbody>
          </table>

          <div class="summary-container">
            <div class="summary-card">
              <h3 class="summary-title">Accounting Summary</h3>
              <div class="summary-item">
                <span>Total Cash Collected:</span>
                <span>Rs. ${summary.cash.toLocaleString()}</span>
              </div>
              <div class="summary-item">
                <span>Total Online Received:</span>
                <span>Rs. ${summary.online.toLocaleString()}</span>
              </div>
              <div class="total-received">
                  <span>Total Received:</span>
                  <span>Rs. ${summary.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; text-align: center; color: #999; font-size: 10px; border-top: 1px dashed #ccc; padding-top: 20px;">
            End of Report • Generated via RMS Dashboard
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={handleExportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
      >
        Export CSV
      </button>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
      >
        Print Report
      </button>
    </div>
  );
};

export default OrdersExportPrint;
