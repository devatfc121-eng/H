import React from 'react';
import {
  X,
  Package,
  Calendar,
  Phone,
  Building,
  User,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Share2,
  Send,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onEditOrder: (order: Order) => void;
  adminWhatsappNumber: string;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
  onEditOrder,
  adminWhatsappNumber,
}) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Dispatched':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  const steps: OrderStatus[] = ['Pending', 'Processing', 'Dispatched', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsappUpdate = () => {
    let msg = `📦 *BIOPHAR ORDER STATUS UPDATE*\n`;
    msg += `═══════════════════════\n`;
    msg += `📄 *Order ID:* ${order.orderNumber}\n`;
    msg += `👤 *Customer:* ${order.customerName}\n`;
    msg += `🏥 *Clinic / Store:* ${order.customerClinic}\n`;
    msg += `🚦 *Current Status:* ${order.status.toUpperCase()}\n`;
    msg += `💰 *Total Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}\n`;
    if (order.trackingNumber) {
      msg += `🚚 *Carrier:* ${order.transportCarrier || 'Express Cargo'}\n`;
      msg += `📍 *Tracking / LR No:* ${order.trackingNumber}\n`;
    }
    if (order.notes) {
      msg += `📝 *Notes:* ${order.notes}\n`;
    }
    msg += `═══════════════════════\n`;
    msg += `Biophar Lifesciences Pvt. Ltd.`;

    const encoded = encodeURIComponent(msg);
    let targetPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (targetPhone.length === 10) targetPhone = '91' + targetPhone;
    if (targetPhone) {
      window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {order.orderNumber}
                </h2>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Booked on {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Print Order Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pipeline Stepper (for active non-cancelled orders) */}
        {order.status !== 'Cancelled' ? (
          <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 print:hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Pipeline Stage:
            </span>
            <div className="grid grid-cols-4 gap-1.5 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <button
                    key={step}
                    onClick={() => onStatusChange(order.id, step)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-sky-600 text-white font-black shadow-xs ring-2 ring-sky-300'
                        : isPassed
                        ? 'bg-sky-100 text-sky-800 font-bold'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-tight">
                      {step}
                    </span>
                    {isPassed && <span className="text-[9px] mt-0.5">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="my-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>This order is marked as Cancelled.</span>
          </div>
        )}

        {/* Customer & Doctor Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Customer / Chemist Info
            </span>
            <h4 className="text-sm font-bold text-slate-900">{order.customerName}</h4>
            <p className="text-xs text-slate-600 mt-0.5">{order.customerClinic}</p>
            <p className="text-xs font-bold text-sky-700 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {order.customerPhone}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Prescribing Doctor Mapping
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {order.doctorName || 'Direct Chemist Booking'}
            </h4>
            {order.doctorSpeciality && (
              <span className="inline-block text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded mt-1">
                {order.doctorSpeciality}
              </span>
            )}
            {order.trackingNumber && (
              <p className="text-xs text-slate-600 mt-1.5 font-medium">
                <strong>Tracking:</strong> {order.transportCarrier}: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>

        {/* Ordered Medicines Table */}
        <div className="my-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Ordered Formulations & Samples ({order.items.length} items):
          </span>
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Medicine Product</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5">
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.packaging} • {item.form}
                      </p>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.type === 'Sample Request'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {item.type === 'Sample Request' ? 'SAMPLE' : 'ORDER'}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="p-2.5 text-right text-slate-600">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-right font-black text-slate-900">
                      {item.type === 'Sample Request' ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${(item.price * item.quantity).toLocaleString('en-IN')}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total and Notes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-sky-50/70 border border-sky-100 rounded-2xl my-3">
          <div>
            {order.notes && (
              <p className="text-xs text-slate-700">
                <strong>Dispatch Notes:</strong> {order.notes}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-slate-500 block">Total Order Value:</span>
            <span className="text-xl font-black text-sky-800 font-['Cabinet_Grotesk',sans-serif]">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Quick Status Changers & Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 print:hidden">
          {/* Status quick select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Change Status:</span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWhatsappUpdate}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Update</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEditOrder(order);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
