import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const Invoice = forwardRef(({ order }, ref) => {
    const contentRef = useRef();

    useImperativeHandle(ref, () => ({
        generatePdf: async () => {
            if (!contentRef.current) return;

            const element = contentRef.current;
            const opt = {
                margin: 10,
                filename: `Invoice-${order._id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(opt).from(element).save();
            } catch (error) {
                console.error("PDF Generation Error:", error);
            }
        }
    }));

    if (!order) return null;

    return (
        <div ref={contentRef} className="bg-white p-8 max-w-4xl mx-auto text-gray-900 font-sans" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b pb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <p className="text-gray-500">#{order._id}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-serif font-bold text-luminous-maroon mb-1">Bhole Guru</h2>
                    <p className="text-sm text-gray-500">Premium Rudraksha & Spiritual Items</p>
                    <p className="text-sm text-gray-500">support@bholeguru.com</p>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                </div>
            </div>

            {/* Bill To & Order Info */}
            <div className="flex justify-between mb-12">
                <div>
                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">Bill To</h3>
                    <p className="font-bold text-lg">{order.user?.name || 'Customer'}</p>
                    <div className="text-gray-600 text-sm mt-1">
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-1">Date</h3>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-1">Payment Method</h3>
                        <p className="font-medium capitalize">{order.paymentMethod}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-12">
                <thead>
                    <tr className="border-b-2 border-gray-900">
                        <th className="text-left py-3 font-bold uppercase text-xs tracking-wider">Item</th>
                        <th className="text-center py-3 font-bold uppercase text-xs tracking-wider">Qty</th>
                        <th className="text-right py-3 font-bold uppercase text-xs tracking-wider">Price</th>
                        <th className="text-right py-3 font-bold uppercase text-xs tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems && order.orderItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="py-4">
                                <p className="font-bold text-gray-900">{item.name}</p>
                            </td>
                            <td className="text-center py-4 text-gray-600">{item.qty}</td>
                            <td className="text-right py-4 text-gray-600">₹{item.price.toFixed(2)}</td>
                            <td className="text-right py-4 font-medium text-gray-900">₹{(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64">
                    <div className="flex justify-between py-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-gray-600">
                        <span>Shipping</span>
                        <span>₹{order.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-gray-600">
                        <span>Tax</span>
                        <span>₹{order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-4 border-t-2 border-gray-900 mt-2">
                        <span className="font-bold text-xl">Total</span>
                        <span className="font-bold text-xl text-luminous-maroon">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-8 text-center text-gray-500 text-sm">
                <p className="mb-2">Thank you for your business!</p>
                <p>For any questions, please contact us at support@bholeguru.com</p>
            </div>
        </div>
    );
});

export default Invoice;
