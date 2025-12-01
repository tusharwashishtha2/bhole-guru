import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import html2pdf from 'html2pdf.js';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const Invoice = forwardRef(({ order }, ref) => {
    const contentRef = useRef();

    useImperativeHandle(ref, () => ({
        generatePdf: async () => {
            if (!contentRef.current) return;

            const element = contentRef.current;
            const opt = {
                margin: [10, 10],
                filename: `Invoice-${order._id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
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
        <div ref={contentRef} className="bg-white p-10 mx-auto text-gray-900 font-sans" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">INVOICE</h1>
                    <p className="text-gray-500 text-sm">Order ID: #{order._id}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-serif font-bold text-luminous-maroon mb-1">Bhole Guru</h2>
                    <p className="text-xs text-gray-500">Premium Rudraksha & Spiritual Items</p>
                    <p className="text-xs text-gray-500">support@bholeguru.com</p>
                    <p className="text-xs text-gray-500">+91 98765 43210</p>
                </div>
            </div>

            {/* Bill To & Order Info */}
            <div className="flex justify-between mb-10">
                <div className="w-1/2 pr-4">
                    <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2">Bill To</h3>
                    <p className="font-bold text-lg text-gray-800">{order.user?.name || 'Customer'}</p>
                    <div className="text-gray-600 text-sm mt-2 leading-relaxed">
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-1 font-medium">Phone: {order.shippingAddress.phone}</p>
                    </div>
                </div>
                <div className="text-right w-1/2 pl-4">
                    <div className="mb-4">
                        <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Date Issued</h3>
                        <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Payment Method</h3>
                        <p className="font-medium capitalize text-gray-800">{order.paymentMethod}</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="text-left py-3 font-bold uppercase text-xs tracking-wider text-gray-800">Item Description</th>
                            <th className="text-center py-3 font-bold uppercase text-xs tracking-wider text-gray-800">Qty</th>
                            <th className="text-right py-3 font-bold uppercase text-xs tracking-wider text-gray-800">Price</th>
                            <th className="text-right py-3 font-bold uppercase text-xs tracking-wider text-gray-800">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {order.orderItems && order.orderItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="py-4 pr-4">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                </td>
                                <td className="text-center py-4 text-gray-600">{item.qty}</td>
                                <td className="text-right py-4 text-gray-600">₹{item.price.toFixed(2)}</td>
                                <td className="text-right py-4 font-bold text-gray-800">₹{(item.qty * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2">
                    <div className="flex justify-between py-2 text-gray-600 text-sm border-b border-gray-50">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{order.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-gray-600 text-sm border-b border-gray-50">
                        <span>Shipping</span>
                        <span className="font-medium">₹{order.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-gray-600 text-sm border-b border-gray-50">
                        <span>Tax</span>
                        <span className="font-medium">₹{order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-4 border-t-2 border-gray-800 mt-2">
                        <span className="font-bold text-xl text-gray-900">Total Amount</span>
                        <span className="font-bold text-xl text-luminous-maroon">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-8 text-center">
                <p className="text-luminous-maroon font-serif font-bold text-lg mb-2">Thank you for your business!</p>
                <p className="text-gray-500 text-xs">
                    If you have any questions about this invoice, please contact<br />
                    support@bholeguru.com
                </p>
            </div>
        </div>
    );
});

export default Invoice;
