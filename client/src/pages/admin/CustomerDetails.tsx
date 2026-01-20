import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, FileText, History as HistoryIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useCreditStore } from '../../store/useCreditStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomerById, getCreditHistory, fetchCustomerDetails } = useCreditStore();

  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const customer = id ? getCustomerById(id) : null;
  const creditHistory = id ? getCreditHistory(id) : [];

  // Fetch detailed history on mount
  React.useEffect(() => {
    if (id) {
      fetchCustomerDetails(id);
    }
  }, [id, fetchCustomerDetails]);

  // Date formatter
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  if (!customer) {
    return (
      <div className="p-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Customer not found</p>
            <Button onClick={() => navigate('/admin/credit')}>
              Back to Credit Ledger
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/credit')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Credit Ledger
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-1">{customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Credit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-red-500 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Outstanding</p>
          <p className="text-3xl font-black text-red-600">
            Rs. {(customer.totalCredit || 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HistoryIcon className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>

        {creditHistory.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-20 h-20 mx-auto mb-4 opacity-10" />
            <p className="text-lg">No transactions recorded yet</p>
            <p className="text-sm">Credit transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {creditHistory.map((transaction) => {
              const isExpanded = expandedTxn === transaction.id;
              const hasBill = transaction.order && transaction.order.items.length > 0;

              return (
                <div
                  key={transaction.id}
                  className={`border rounded-xl overflow-hidden ${transaction.type === 'debt'
                    ? 'border-red-100 bg-white'
                    : 'border-green-100 bg-white'
                    }`}
                >
                  <div
                    onClick={() => hasBill && setExpandedTxn(isExpanded ? null : transaction.id)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${hasBill ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${transaction.type === 'debt'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-green-50 text-green-600'
                        }`}>
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {transaction.type === 'debt' ? 'Credit Added (Debt)' : 'Debt Settled (Payment)'}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <span className="font-medium">Date:</span> {formatDate(transaction.timestamp)}
                          </p>
                          {transaction.orderId && (
                            <p className="text-sm text-indigo-600 font-medium tracking-tight">
                              Order #{transaction.orderId.slice(0, 8).toUpperCase()}
                            </p>
                          )}
                        </div>
                        {transaction.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100 italic">
                            "{transaction.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-left sm:text-right">
                      <div>
                        <p className={`text-2xl font-black ${transaction.type === 'debt' ? 'text-red-600' : 'text-green-600'
                          }`}>
                          {transaction.type === 'debt' ? '+' : '-'} Rs. {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          Balance: Rs. {transaction.balance.toLocaleString()}
                        </p>
                      </div>
                      {hasBill && (
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Details (Bill) - Accordion Content */}
                  {isExpanded && hasBill && (
                    <div className="px-4 pb-5 sm:px-5 border-t border-dashed pt-4 animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bill Details</p>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          Items Breakdown
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-200">
                              <th className="pb-2 font-bold uppercase text-[10px]">Description</th>
                              <th className="pb-2 font-bold uppercase text-[10px] text-right">Qty</th>
                              <th className="pb-2 font-bold uppercase text-[10px] text-right">Rate</th>
                              <th className="pb-2 font-bold uppercase text-[10px] text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {transaction.order?.items.map((item: any) => (
                              <tr key={item.id}>
                                <td className="py-2.5 font-medium text-gray-800">{item.menuItem.name}</td>
                                <td className="py-2.5 text-right text-gray-600">{item.quantity}</td>
                                <td className="py-2.5 text-right text-gray-600">Rs. {item.menuItem.price}</td>
                                <td className="py-2.5 text-right font-bold text-gray-900">
                                  Rs. {(item.quantity * item.menuItem.price).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200">
                              <td colSpan={3} className="pt-3 text-right font-bold text-gray-500">Total Bill:</td>
                              <td className="pt-3 text-right font-black text-gray-900 text-base">
                                Rs. {transaction.amount.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

    </div>
  );
};

export default CustomerDetails