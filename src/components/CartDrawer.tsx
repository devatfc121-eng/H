import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Send,
  CheckCircle2,
  Phone,
  Edit2,
  Building,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  Share2,
  ListOrdered,
} from 'lucide-react';
import { CartItem, Doctor, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  doctors: Doctor[];
  adminWhatsappNumber: string;
  onUpdateAdminWhatsapp: (newNumber: string) => void;
  onSaveOrderToPipeline?: (newOrder: Order) => void;
  onViewOrdersPipeline?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  doctors = [],
  adminWhatsappNumber,
  onUpdateAdminWhatsapp,
  onSaveOrderToPipeline,
  onViewOrdersPipeline,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors?.[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerClinic, setCustomerClinic] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  // Editing WhatsApp Number state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(adminWhatsappNumber);

  useEffect(() => {
    setTempPhoneNumber(adminWhatsappNumber);
  }, [adminWhatsappNumber]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.type === 'Order' ? item.product.mrp * item.quantity : 0),
    0
  );

  const sampleCount = cartItems.filter((i) => i.type === 'Sample Request').length;
  const orderCount = cartItems.filter((i) => i.type === 'Order').length;
  const selectedDoctor = (doctors || []).find((d) => d.id === selectedDoctorId) || doctors?.[0] || null;

  // Format phone number for WhatsApp wa.me link (strip +, spaces, dashes)
  const cleanPhone = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      clean = '91' + clean; // Default to India country code 91 if 10 digits
    }
    return clean;
  };

  const generateOrderMessage = () => {
    let msg = `🏥 *BIOPHAR LIFESCIENCES - NEW PURCHASE ORDER / INDENT*\n`;
    msg += `═══════════════════════\n`;
    msg += `📅 *Date & Time:* ${new Date().toLocaleString('en-IN')}\n`;

    if (customerName.trim()) {
      msg += `👤 *Customer / Chemist:* ${customerName.trim()}\n`;
    }
    if (customerClinic.trim()) {
      msg += `🏢 *Clinic / Medical Store:* ${customerClinic.trim()}\n`;
    }
    if (customerPhone.trim()) {
      msg += `📞 *Customer Contact:* ${customerPhone.trim()}\n`;
    }
    if (selectedDoctor && (!customerName || selectedDoctor.name !== customerName)) {
      msg += `👨‍⚕️ *Doctor Mapping:* ${selectedDoctor.name} (${selectedDoctor.qualification} - ${selectedDoctor.speciality})\n`;
      msg += `📍 *Clinic / Location:* ${selectedDoctor.clinic}, ${selectedDoctor.city}\n`;
    }

    msg += `═══════════════════════\n`;
    msg += `📦 *ORDERED MEDICINES & SAMPLES (${cartItems.length} items):*\n\n`;

    cartItems.forEach((item, index) => {
      const typeBadge = item.type === 'Sample Request' ? '🎁 [SAMPLE]' : '🛒 [ORDER]';
      msg += `${index + 1}. *${item.product.name}* (${item.product.form})\n`;
      msg += `   • Comp: ${item.product.composition.substring(0, 70)}...\n`;
      msg += `   • Pack: ${item.product.packaging}\n`;
      msg += `   • Qty: *${item.quantity}* | Type: ${typeBadge}\n`;
      if (item.type === 'Order') {
        const itemTotal = item.product.mrp * item.quantity;
        msg += `   • MRP: ₹${item.product.mrp} | Total: *₹${itemTotal.toLocaleString('en-IN')}*\n`;
      } else {
        msg += `   • Rate: Complimentary Doctor Sample\n`;
      }
      msg += `\n`;
    });

    msg += `═══════════════════════\n`;
    if (totalAmount > 0) {
      msg += `💰 *TOTAL ORDER MRP VALUE:* ₹${totalAmount.toLocaleString('en-IN')}\n`;
      msg += `*(GST & Trade Scheme terms as per Biophar Lifesciences standard policy)*\n`;
    } else {
      msg += `🎁 *REQUISITION TYPE:* Physician Complimentary Sample Kit\n`;
    }

    if (orderNotes.trim()) {
      msg += `\n📝 *Notes / Dispatch Request:* ${orderNotes.trim()}\n`;
    }

    msg += `\n⚡ _Sent directly from Biophar Lifesciences App to Shivam Baranwal_`;
    return msg;
  };

  const handleSendDirectToAdmin = () => {
    const text = generateOrderMessage();
    const phone = cleanPhone(adminWhatsappNumber);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    // Automatically record to representative Order pipeline as Pending
    if (onSaveOrderToPipeline) {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `BIO-ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim() || selectedDoctor?.name || 'Customer Requisition',
        customerClinic: customerClinic.trim() || selectedDoctor?.clinic || 'Clinic',
        customerPhone: customerPhone.trim() || selectedDoctor?.phone || '',
        doctorName: selectedDoctor?.name,
        doctorSpeciality: selectedDoctor?.speciality,
        status: 'Pending',
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          packSize: item.product.packSize,
          packaging: item.product.packaging,
          form: item.product.form,
          price: item.product.mrp,
          quantity: item.quantity,
          type: item.type,
        })),
        totalAmount,
        notes: orderNotes.trim() || undefined,
      };
      onSaveOrderToPipeline(newOrder);
    }

    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 4000);
  };

  const handleShareToAnyContact = () => {
    const text = generateOrderMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSavePhoneNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPhoneNumber.trim()) return;
    onUpdateAdminWhatsapp(tempPhoneNumber.trim());
    setIsEditingPhone(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Doctor Bag & Purchase Order
              </h3>
              <span className="text-xs text-slate-500">
                {cartItems.length} items ({sampleCount} samples, {orderCount} orders)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Direct Integration Notification Banner */}
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Direct WhatsApp Order Target:
              </span>
              <span className="text-xs font-bold text-emerald-950 truncate block">
                Shivam Baranwal ({adminWhatsappNumber || 'Number Not Set'})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingPhone(!isEditingPhone)}
            className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
          >
            <Edit2 className="w-3 h-3" />
            <span>{isEditingPhone ? 'Cancel' : 'Change Number'}</span>
          </button>
        </div>

        {/* Edit Phone Number Form */}
        {isEditingPhone && (
          <form
            onSubmit={handleSavePhoneNumber}
            className="p-4 bg-emerald-100/60 border-b border-emerald-200 space-y-2 animate-in fade-in"
          >
            <label className="text-[11px] font-black uppercase text-emerald-900 block">
              Apna WhatsApp Number Set Karein (Orders Direct Ispe Aayenge):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tempPhoneNumber}
                  onChange={(e) => setTempPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210 ya 9876543210"
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-emerald-400 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-emerald-800">
              * Country code (e.g. 91) ke saath ya 10 digit ka mobile number daalein.
            </p>
          </form>
        )}

        {/* Doctor & Chemist Order Requisition Info Form */}
        {cartItems.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">
              Requisition Details (Doctor / Chemist):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Doctor / Chemist Ka Naam"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="Hospital / Shop & City"
                value={customerClinic}
                onChange={(e) => setCustomerClinic(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            {doctors.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 shrink-0">Select Dr:</span>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    const doc = doctors.find((d) => d.id === e.target.value);
                    if (doc && !customerName) {
                      setCustomerName(doc.name);
                      setCustomerClinic(`${doc.clinic}, ${doc.city}`);
                    }
                  }}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
                >
                  <option value="">-- Quick Choose Registered Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.speciality}) - {doc.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold text-slate-600">Your bag is empty</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Add products from the catalog to request doctor samples or place order indents.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.type}`}
                className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        item.type === 'Sample Request'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {item.type === 'Sample Request' ? 'SAMPLE' : 'ORDER'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {item.product.packaging} • {item.product.form}
                  </p>
                  <p className="text-xs font-black text-slate-800 mt-0.5">
                    {item.type === 'Sample Request' ? (
                      <span className="text-emerald-600 font-bold">Complimentary Doctor Sample</span>
                    ) : (
                      `₹${(item.product.mrp * item.quantity).toLocaleString('en-IN')} (MRP ₹${item.product.mrp})`
                    )}
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                      title="Kam karein"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-slate-900 w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                      title="Badhayein"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Optional order notes */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Dispatch / Order Notes (Optional):
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Urgent dispatch, Include promotional brochures & visual aids"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Footer with WhatsApp Order Button */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
            {totalAmount > 0 && (
              <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                <span>Total Requisition Value:</span>
                <span className="text-lg font-black text-sky-600 font-['Cabinet_Grotesk',sans-serif]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Direct Order to Shivam's WhatsApp */}
            <div className="space-y-2">
              <button
                id="btn-direct-order-whatsapp"
                onClick={handleSendDirectToAdmin}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white" />
                </div>
                <span>Direct WhatsApp Order to Shivam ({adminWhatsappNumber})</span>
              </button>

              {onViewOrdersPipeline && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewOrdersPipeline();
                  }}
                  className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-sky-200 transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Track Status in Orders Pipeline (Pending / Dispatched)</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors"
                >
                  Clear Bag
                </button>

                <button
                  type="button"
                  onClick={handleShareToAnyContact}
                  className="flex-1 py-2 px-3 rounded-xl border border-emerald-300 hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Forward / Share to Other Contact</span>
                </button>
              </div>
            </div>

            {orderSent && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-black text-emerald-800 animate-in fade-in flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Order invoice WhatsApp par direct Shivam ko bhej diya gaya!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
