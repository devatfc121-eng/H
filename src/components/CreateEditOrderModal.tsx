import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, PackageCheck, AlertCircle } from 'lucide-react';
import { Order, OrderItem, OrderStatus, Product, Doctor } from '../types';

interface CreateEditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (order: Order) => void;
  onSaveOrder?: (order: Order) => void;
  orderToEdit?: Order | null;
  products?: Product[];
  doctors?: Doctor[];
}

export const CreateEditOrderModal: React.FC<CreateEditOrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveOrder,
  orderToEdit,
  products = [],
  doctors = [],
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerClinic, setCustomerClinic] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpeciality, setDoctorSpeciality] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [notes, setNotes] = useState('');
  const [transportCarrier, setTransportCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  // Selected product to add to order
  const [selectedProductId, setSelectedProductId] = useState<string>(products?.[0]?.id || '');
  const [addQty, setAddQty] = useState<number>(5);
  const [addType, setAddType] = useState<'Order' | 'Sample Request'>('Order');

  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customerName);
      setCustomerClinic(orderToEdit.customerClinic);
      setCustomerPhone(orderToEdit.customerPhone);
      setDoctorName(orderToEdit.doctorName || '');
      setDoctorSpeciality(orderToEdit.doctorSpeciality || '');
      setStatus(orderToEdit.status);
      setNotes(orderToEdit.notes || '');
      setTransportCarrier(orderToEdit.transportCarrier || '');
      setTrackingNumber(orderToEdit.trackingNumber || '');
      setItems(orderToEdit.items || []);
    } else {
      setCustomerName('');
      setCustomerClinic('');
      setCustomerPhone('+91 ');
      setDoctorName(doctors?.[0]?.name || '');
      setDoctorSpeciality(doctors?.[0]?.speciality || '');
      setStatus('Pending');
      setNotes('');
      setTransportCarrier('');
      setTrackingNumber('');
      // seed 1 initial item if available
      if (products && products.length > 0 && products[0]) {
        setItems([
          {
            productId: products[0].id,
            productName: products[0].name,
            packSize: products[0].packSize,
            packaging: products[0].packaging,
            form: products[0].form,
            price: products[0].mrp,
            quantity: 10,
            type: 'Order',
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [orderToEdit, isOpen, products, doctors]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === prod.id && i.type === addType);
      if (existing) {
        return prev.map((i) =>
          i.productId === prod.id && i.type === addType
            ? { ...i, quantity: i.quantity + addQty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          packSize: prod.packSize,
          packaging: prod.packaging,
          form: prod.form,
          price: prod.mrp,
          quantity: addQty,
          type: addType,
        },
      ];
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemQtyChange = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
    );
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.type === 'Order' ? item.price * item.quantity : 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    const orderNumber =
      orderToEdit?.orderNumber ||
      `BIO-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const savedOrder: Order = {
      id: orderToEdit?.id || `ord-${Date.now()}`,
      orderNumber,
      createdAt: orderToEdit?.createdAt || new Date().toISOString(),
      customerName: customerName.trim(),
      customerClinic: customerClinic.trim(),
      customerPhone: customerPhone.trim(),
      doctorName: doctorName.trim() || undefined,
      doctorSpeciality: doctorSpeciality.trim() || undefined,
      status,
      items,
      totalAmount,
      notes: notes.trim() || undefined,
      transportCarrier: transportCarrier.trim() || undefined,
      trackingNumber: trackingNumber.trim() || undefined,
      dispatchDate:
        status === 'Dispatched' || status === 'Delivered'
          ? orderToEdit?.dispatchDate || new Date().toISOString()
          : undefined,
      deliveryDate:
        status === 'Delivered'
          ? orderToEdit?.deliveryDate || new Date().toISOString()
          : undefined,
    };

    const callback = onSave || onSaveOrder;
    if (callback) {
      callback(savedOrder);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {orderToEdit ? `Edit Order #${orderToEdit.orderNumber}` : 'Book / Create New Order'}
              </h3>
              <p className="text-xs text-slate-500">
                Representative pipeline booking and dispatch management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Customer & Clinic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Customer / Chemist Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sanjivani Medicos"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinic / Location Address
              </label>
              <input
                type="text"
                value={customerClinic}
                onChange={(e) => setCustomerClinic(e.target.value)}
                placeholder="e.g. Apollo Road, Sector 14"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Customer Phone Number
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Order Pipeline Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option value="Pending">Pending (Awaiting dispatch confirmation)</option>
                <option value="Processing">Processing (Packing & Invoicing)</option>
                <option value="Dispatched">Dispatched (Handed to transporter)</option>
                <option value="Delivered">Delivered (Completed & Paid)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Doctor Mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Prescribing Doctor Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Doctor Speciality
              </label>
              <input
                type="text"
                value={doctorSpeciality}
                onChange={(e) => setDoctorSpeciality(e.target.value)}
                placeholder="e.g. Orthopedic, Pediatrician"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* If Dispatched or Processing, show carrier and LR/Docket */}
          {(status === 'Dispatched' || status === 'Processing' || status === 'Delivered') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl">
              <div>
                <label className="text-xs font-bold text-purple-900 block mb-1">
                  Transporter / Logistics Partner
                </label>
                <input
                  type="text"
                  value={transportCarrier}
                  onChange={(e) => setTransportCarrier(e.target.value)}
                  placeholder="e.g. SafeXpress / DTDC"
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-purple-900 block mb-1">
                  LR Docket / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. SFX-8829103"
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Add Product Items Row */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Add Products to this Order
            </label>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 min-w-[150px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.mrp})
                  </option>
                ))}
              </select>

              <select
                value={addType}
                onChange={(e) => setAddType(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Order">Order</option>
                <option value="Sample Request">Sample</option>
              </select>

              <input
                type="number"
                min={1}
                value={addQty}
                onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center"
              />

              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-[10px] text-slate-500">
                    {item.type} • ₹{item.price} each
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleItemQtyChange(idx, Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-bold"
                  />
                  <span className="font-black text-slate-800 w-16 text-right">
                    {item.type === 'Sample Request' ? 'FREE' : `₹${item.price * item.quantity}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total & Notes */}
          <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">
            <span>Total Order Requisition:</span>
            <span className="text-base font-black text-sky-700">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Dispatch Instructions / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Urgent requirement for weekend camp"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="px-5 py-2 text-xs font-black text-white bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{orderToEdit ? 'Update Order' : 'Create Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
