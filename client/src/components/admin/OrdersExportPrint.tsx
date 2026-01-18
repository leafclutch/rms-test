import React from "react";
import type { Order } from "../../types/order";

type Props = {
  orders: Order[];
};

const OrdersExportPrint: React.FC<Props> = ({ orders }) => {

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Order ID", "Table", "Customer", "Status", "Total Amount"];
    const rows = orders.map(o => [
      o.id,
      o.tableNumber,
      o.customerName,
      o.status,
      o.totalAmount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableHtml = `
      <html>
        <head>
          <title>Print Orders</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f3f3f3; }
          </style>
        </head>
        <body>
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td>${o.id}</td>
                  <td>${o.tableNumber}</td>
                  <td>${o.customerName}</td>
                  <td>${o.status}</td>
                  <td>${o.totalAmount}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={handleExportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
      >
        Export CSV
      </button>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        Print
      </button>
    </div>
  );
};

export default OrdersExportPrint;
