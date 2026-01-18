import { useState, useEffect } from 'react';
import { X, Printer, Receipt } from 'lucide-react';

interface menu{
  name: string;
  price: number;
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    menuItem: menu;
}

interface Order {
    id: string;
    orderNumber?: string;
    tableNumber?: string;
    customerName?: string;
    status: string;
    totalAmount?: number;
    finalAmount?: number;
    items: OrderItem[];
    createdAt?: string;
    paymentMethod?: 'cash' | 'online' | 'mixed' | 'credit';
    discountType?: 'PERCENT' | 'FIXED';
    discountValue?: number;
    finalAmountAfterDiscount?: number;
}

interface ViewOrderDetailsModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
}

const ViewOrderDetailsModal = ({ isOpen, order, onClose }: ViewOrderDetailsModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'mixed' | 'credit'>('cash');
    const [discountType, setDiscountType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [finalAmount, setFinalAmount] = useState<number>(0);

    // Normalize values when order changes
    useEffect(() => {
        if (order) {
            const baseAmount = Number(order.totalAmount ?? order.finalAmount ?? 0);
            setFinalAmount(Number(order.finalAmountAfterDiscount ?? baseAmount));
            setPaymentMethod(order.paymentMethod ?? 'cash');
            setDiscountType(order.discountType ?? 'PERCENT');
            setDiscountValue(Number(order.discountValue ?? 0));
        }
    }, [order]);

    // Recalculate final amount whenever discount changes
    useEffect(() => {
        if (!order) return;

        const baseAmount = Number(order.totalAmount ?? order.finalAmount ?? 0);
        let calculated = baseAmount;

        if (discountValue > 0) {
            if (discountType === 'PERCENT') {
                calculated = baseAmount - (baseAmount * discountValue) / 100;
            } else {
                calculated = baseAmount - discountValue;
            }
        }

        setFinalAmount(Math.max(0, calculated));
    }, [discountValue, discountType, order]);

    const handleSavePayment = async () => {
        if (!order) return;

        try {
            const response = await fetch(`/payments/${order.id}/${paymentMethod}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethod,
                    discountType,
                    discountValue,
                    finalAmountAfterDiscount: finalAmount,
                }),
            });

            if (!response.ok) throw new Error('Failed to save payment details');
            alert('Payment details saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save payment details');
        }
    };

    const handlePrint = () => {
        if (!order) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const baseAmount = Number(order.totalAmount ?? order.finalAmount ?? 0);
        const discountAmount = discountType === 'PERCENT'
            ? (baseAmount * discountValue) / 100
            : discountValue;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order #${order.orderNumber ?? order.id.slice(0, 8)}</title>
                <style>
                    body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
                    .header { text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:20px; }
                    table { width:100%; border-collapse:collapse; margin:10px 0; }
                    th, td { padding:8px; text-align:left; border-bottom:1px solid #ddd; }
                    th { background-color:#f5f5f5; font-weight:bold; }
                    .totals { margin-top:20px; text-align:right; }
                    .totals div { margin:5px 0; }
                    .final-total { font-size:1.2em; font-weight:bold; border-top:2px solid #000; padding-top:10px; margin-top:10px; }
                    .payment-info { background-color:#f9f9f9; padding:15px; border-radius:5px; margin-top:20px; }
                    .footer { text-align:center; margin-top:30px; padding-top:20px; border-top:2px solid #000; }
                    @media print { body { padding:0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Restaurant Name</h1>
                    <p>Order Receipt</p>
                </div>
                <div><strong>Order Number:</strong> ${order.orderNumber ?? order.id.slice(0,8)}<br>
                ${order.tableNumber ? `<strong>Table Number:</strong> ${order.tableNumber}<br>` : ''}
                ${order.customerName ? `<strong>Customer Name:</strong> ${order.customerName}<br>` : ''}
                <strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString()}<br>
                <strong>Status:</strong> ${order.status.toUpperCase()}</div>
                <h3>Items</h3>
                <table>
                    <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>Rs. ${Number(item.menuItem.price).toFixed(2)}</td>
                                <td>Rs. ${(Number(item.menuItem.price) * Number(item.quantity)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="totals">
                    <div><strong>Subtotal:</strong> Rs. ${baseAmount.toFixed(2)}</div>
                    ${discountValue > 0 ? `<div><strong>Discount:</strong> ${discountType === 'PERCENT' ? `${discountValue}%` : `Rs. ${discountValue}`} (-Rs. ${discountAmount.toFixed(2)})</div>` : ''}
                    <div class="final-total"><strong>Final Amount:</strong> Rs. ${finalAmount.toFixed(2)}</div>
                </div>
                <div class="payment-info">
                    <h3>Payment Info</h3>
                    <strong>Method:</strong> ${paymentMethod.toUpperCase()}<br>
                    ${paymentMethod==='credit'?'<p style="color:#d9534f;font-weight:bold;">⚠ To be added to credit ledger</p>':''}
                </div>
                <div class="footer">
                    <p>Thank you for your order!</p>
                    <p style="font-size:0.9em;color:#666;">Computer-generated receipt</p>
                </div>
                <script>window.onload=function(){window.print();}</script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    if (!isOpen || !order) return null;

    const baseAmount = Number(order.totalAmount ?? order.finalAmount ?? 0);
    const discountAmount = discountType === 'PERCENT' 
        ? (baseAmount * discountValue) / 100 
        : discountValue;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Order #{order.orderNumber ?? order.id.slice(0,8)}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        {order.tableNumber && <div><p className="text-sm text-gray-600">Table</p><p className="font-semibold">{order.tableNumber}</p></div>}
                        {order.customerName && <div><p className="text-sm text-gray-600">Customer</p><p className="font-semibold">{order.customerName}</p></div>}
                        <div><p className="text-sm text-gray-600">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                order.status==='completed'?'bg-green-100 text-green-800':
                                order.status==='preparing'?'bg-yellow-100 text-yellow-800':
                                order.status==='cancelled'?'bg-gray-100 text-gray-800':'bg-red-100 text-red-800'
                            }`}>{order.status.toUpperCase()}</span>
                        </div>
                        {order.createdAt && <div><p className="text-sm text-gray-600">Time</p>
                            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>}
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="text-lg font-bold mb-3">Order Items</h3>
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-gray-50">
                                <tr><th className="px-4 py-3 text-left">Item</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Subtotal</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">{item?.menuItem?.name}</td>
                                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">Rs. {Number(item?.menuItem?.price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-semibold">
                                            Rs. {(Number(item?.menuItem?.price) * Number(item.quantity)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment & Discount */}
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-bold">Payment Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(['cash','online','mixed','credit'] as const).map(method=>(
                                <button key={method} onClick={()=>setPaymentMethod(method)}
                                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                                        paymentMethod===method?'border-orange-600 bg-orange-50 text-orange-600':'border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <Receipt className="w-5 h-5 mx-auto mb-1"/>{method.charAt(0).toUpperCase()+method.slice(1)}
                                </button>
                            ))}
                        </div>
                        {paymentMethod==='credit' && <p className="mt-2 text-sm text-red-600 font-semibold">⚠ Will be added to credit ledger</p>}

                        {/* Discount */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold mb-2">Discount</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button onClick={()=>setDiscountType('PERCENT')} className={`p-2 rounded-lg border-2 font-semibold ${discountType==='PERCENT'?'border-orange-600 bg-orange-50 text-orange-600':'border-gray-200 hover:border-gray-300'}`}>Percentage (%)</button>
                                <button onClick={()=>setDiscountType('FIXED')} className={`p-2 rounded-lg border-2 font-semibold ${discountType==='FIXED'?'border-orange-600 bg-orange-50 text-orange-600':'border-gray-200 hover:border-gray-300'}`}>Amount (Rs.)</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" max={discountType==='PERCENT'?100:baseAmount} value={discountValue} onChange={e=>setDiscountValue(Number(e.target.value))} className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"/>
                                <span>{discountType==='PERCENT'?'%':'Rs.'}</span>
                            </div>
                            {discountValue>0 && <p className="mt-2 text-sm text-green-600 font-semibold">Discount Applied: -Rs. {discountAmount.toFixed(2)}</p>}
                        </div>

                        {/* Amount Summary */}
                        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-gray-700"><span>Subtotal:</span><span>Rs. {baseAmount.toFixed(2)}</span></div>
                            {discountValue>0 && <div className="flex justify-between text-green-600"><span>Discount:</span><span>-Rs. {discountAmount.toFixed(2)}</span></div>}
                            <div className="flex justify-between text-xl font-bold border-t-2 pt-2"><span>Final Amount:</span><span className="text-orange-600">Rs. {finalAmount.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
                    <button onClick={handleSavePayment} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Save Payment Details</button>
                    <button onClick={handlePrint} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"><Printer className="w-5 h-5"/>Print Receipt</button>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderDetailsModal;
