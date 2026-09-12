import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Send,
  ExternalLink,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Eye,
  DollarSign,
  FileSpreadsheet,
} from 'lucide-react';
import { Order, OrderStatus, OrderSortOption, Doctor, Product } from '../types';

interface OrdersSectionProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onSelectOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string, orderNumber: string) => void;
  onCreateNewOrder: () => void;
  onOpenCart: () => void;
  cartCount: number;
  adminWhatsappNumber: string;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onStatusChange,
  onSelectOrder,
  onEditOrder,
  onDeleteOrder,
  onCreateNewOrder,
  onOpenCart,
  cartCount,
  adminWhatsappNumber,
}) => {
  // Filter states
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<OrderSortOption>('date-desc');

  // Status counters
  const statusCounts = useMemo(() => {
    const counts = {
      All: orders.length,
      Pending: 0,
      Processing: 0,
      Dispatched: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      }
    });
    return counts;
  }, [orders]);

  // Total pipeline active value (excluding cancelled)
  const activePipelineValue = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  // Filtered and Sorted Orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Status Filter
    if (selectedStatusFilter !== 'All') {
      result = result.filter((o) => o.status === selectedStatusFilter);
    }

    // 2. Search Term matching orderNumber, customer, doctor, clinic, medicine
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((o) => {
        const matchesOrderNo = o.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = o.customerName.toLowerCase().includes(q);
        const matchesClinic = o.customerClinic.toLowerCase().includes(q);
        const matchesDoctor = (o.doctorName || '').toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.toLowerCase().includes(q);
        const matchesTracking = (o.trackingNumber || '').toLowerCase().includes(q);
        const matchesItems = o.items.some((i) => i.productName.toLowerCase().includes(q));

        return (
          matchesOrderNo ||
          matchesCustomer ||
          matchesClinic ||
          matchesDoctor ||
          matchesPhone ||
          matchesTracking ||
          matchesItems
        );
      });
    }

    // 3. Sorting System
    result.sort((a, b) => {
      switch (sortOption) {
        case 'status': {
          // Status order priority: Pending -> Processing -> Dispatched -> Delivered -> Cancelled
          const priority: Record<OrderStatus, number> = {
            Pending: 1,
            Processing: 2,
            Dispatched: 3,
            Delivered: 4,
            Cancelled: 5,
          };
          return priority[a.status] - priority[b.status];
        }
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount-desc':
          return b.totalAmount - a.totalAmount;
        case 'amount-asc':
          return a.totalAmount - b.totalAmount;
        case 'customer-asc':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

    return result;
  }, [orders, selectedStatusFilter, searchTerm, sortOption]);

  const getStatusBadgeStyle = (status: OrderStatus) => {
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

  const getStatusIndicatorDot = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Dispatched':
        return 'bg-purple-500';
      case 'Delivered':
        return 'bg-emerald-500';
      case 'Cancelled':
        return 'bg-rose-500';
    }
  };

  const handleSendWhatsappStatus = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    let msg = `📦 *BIOPHAR ORDER UPDATE - ${order.orderNumber}*\n`;
    msg += `═══════════════════════\n`;
    msg += `👤 *Customer:* ${order.customerName}\n`;
    msg += `🏥 *Store/Clinic:* ${order.customerClinic}\n`;
    msg += `🚦 *Status:* ${order.status.toUpperCase()}\n`;
    msg += `💰 *Requisition Value:* ₹${order.totalAmount.toLocaleString('en-IN')}\n`;
    if (order.trackingNumber) {
      msg += `🚚 *Carrier:* ${order.transportCarrier || 'Express Cargo'}\n`;
      msg += `📍 *Tracking Docket:* ${order.trackingNumber}\n`;
    }
    msg += `═══════════════════════\n`;
    msg += `Biophar Lifesciences Pvt. Ltd.`;

    const clean = order.customerPhone.replace(/[^0-9]/g, '');
    const phone = clean.length === 10 ? '91' + clean : clean;
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-12 space-y-4">
      {/* Top Banner & KPI Pipeline Overview */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-sky-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                REPRESENTATIVE PIPELINE
              </span>
              <span className="text-xs text-sky-200 font-bold">
                Orders & Requisitions
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              Order Pipeline Management
            </h1>
            <p className="text-xs text-sky-100 font-medium max-w-xl">
              Filter by status (Pending, Processing, Dispatched, Delivered, Cancelled) to monitor booking, depot dispatch, and delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-create-order-pipeline"
              onClick={onCreateNewOrder}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Book New Order</span>
            </button>

            <button
              id="btn-open-cart-from-orders"
              onClick={onOpenCart}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-white/20 transition-all"
              title="Open current Requisition Bag"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-[10px] text-sky-200 font-bold uppercase block">
              Active Pipeline Value
            </span>
            <span className="text-base sm:text-lg font-black tracking-tight">
              ₹{activePipelineValue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-[10px] text-amber-200 font-bold uppercase block">
              Pending Confirmation
            </span>
            <span className="text-base sm:text-lg font-black text-amber-300">
              {statusCounts.Pending} Orders
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-[10px] text-purple-200 font-bold uppercase block">
              In Transit / Dispatched
            </span>
            <span className="text-base sm:text-lg font-black text-purple-200">
              {statusCounts.Dispatched} Orders
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5">
            <span className="text-[10px] text-emerald-200 font-bold uppercase block">
              Delivered & Settled
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-300">
              {statusCounts.Delivered} Orders
            </span>
          </div>
        </div>
      </div>

      {/* FILTER SYSTEM: Status Filter Tabs with Counts */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Filter By Status:
            </span>
          </div>
          {(selectedStatusFilter !== 'All' || searchTerm.trim()) && (
            <button
              onClick={() => {
                setSelectedStatusFilter('All');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Status Filter Pills Row */}
        <div className="overflow-x-auto flex items-center gap-2 pb-1 scrollbar-none">
          {[
            { id: 'All', label: 'All Orders', count: statusCounts.All, color: 'text-slate-800' },
            { id: 'Pending', label: 'Pending', count: statusCounts.Pending, color: 'text-amber-700' },
            { id: 'Processing', label: 'Processing', count: statusCounts.Processing, color: 'text-blue-700' },
            { id: 'Dispatched', label: 'Dispatched', count: statusCounts.Dispatched, color: 'text-purple-700' },
            { id: 'Delivered', label: 'Delivered', count: statusCounts.Delivered, color: 'text-emerald-700' },
            { id: 'Cancelled', label: 'Cancelled', count: statusCounts.Cancelled, color: 'text-rose-700' },
          ].map((statusTab) => {
            const isSelected = selectedStatusFilter === statusTab.id;
            return (
              <button
                id={`filter-tab-${statusTab.id.toLowerCase()}`}
                key={statusTab.id}
                onClick={() => setSelectedStatusFilter(statusTab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{statusTab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-800 border border-slate-300'
                  }`}
                >
                  {statusTab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Sort System Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, doctor, clinic, order # or medicine..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Sort:
              </span>
              <select
                id="select-order-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as OrderSortOption)}
                className="bg-transparent text-xs font-black text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="status">Pipeline Status Priority</option>
                <option value="date-desc">Newest Orders First</option>
                <option value="date-asc">Oldest Orders First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
                <option value="customer-asc">Customer: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Showing <strong>{filteredAndSortedOrders.length}</strong> orders
          {selectedStatusFilter !== 'All' ? ` in ${selectedStatusFilter}` : ''}
          {searchTerm ? ` matching "${searchTerm}"` : ''}
        </span>
        <span>
          Sorted by:{' '}
          <strong className="text-slate-800 capitalize">
            {sortOption.replace('-', ' ')}
          </strong>
        </span>
      </div>

      {/* Order Cards List */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 my-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No orders match current filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try selecting a different status filter, resetting your search keyword, or booking a new order.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedStatusFilter('All');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Clear Filters
            </button>
            <button
              onClick={onCreateNewOrder}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs"
            >
              + Book New Order Now
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedOrders.map((order) => {
            const steps: OrderStatus[] = ['Pending', 'Processing', 'Dispatched', 'Delivered'];
            const currentStepIdx = steps.indexOf(order.status);

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                onClick={() => onSelectOrder(order)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer space-y-3"
              >
                {/* Order Top Bar: Order ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: order.status === 'Pending' ? '#f59e0b' : order.status === 'Processing' ? '#3b82f6' : order.status === 'Dispatched' ? '#a855f7' : order.status === 'Delivered' ? '#10b981' : '#f43f5e' }} />
                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Customer & Doctor Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{order.customerName}</h4>
                    <p className="text-slate-500 font-medium truncate">{order.customerClinic}</p>
                    <p className="text-sky-700 font-bold mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.customerPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 font-medium">
                      Prescribed by:{' '}
                      <strong className="text-slate-800">{order.doctorName || 'Direct Requisition'}</strong>
                    </p>
                    {order.doctorSpeciality && (
                      <span className="inline-block text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded mt-0.5">
                        {order.doctorSpeciality}
                      </span>
                    )}
                    {order.trackingNumber && (
                      <p className="text-purple-700 font-bold text-[11px] mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{order.transportCarrier || 'Courier'}: {order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-700">
                      {order.items.length} items:
                    </span>
                    {order.items.slice(0, 3).map((item, i) => (
                      <span
                        key={i}
                        className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 font-medium"
                      >
                        {item.productName} ({item.quantity})
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[11px] text-slate-400 font-bold">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="text-right ml-auto">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Requisition Total
                    </span>
                    <span className="text-sm sm:text-base font-black text-sky-800 font-['Cabinet_Grotesk',sans-serif]">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Pipeline Progression Stepper (Interactive) */}
                {order.status !== 'Cancelled' && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between gap-1">
                      {steps.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;
                        return (
                          <button
                            key={step}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(order.id, step);
                            }}
                            className={`flex-1 py-1 px-1 rounded-lg text-center text-[10px] font-bold transition-all ${
                              isCurrent
                                ? 'bg-sky-600 text-white shadow-2xs ring-1 ring-sky-400'
                                : isDone
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title={`Click to mark order as ${step}`}
                          >
                            <span>{step}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Action Buttons Row */}
                <div
                  className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Quick status selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={(e) => handleSendWhatsappStatus(order, e)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Send WhatsApp update to customer/doctor"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectOrder(order)}
                      className="py-1 px-2.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditOrder(order)}
                      className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete order ${order.orderNumber}?`)) {
                          onDeleteOrder(order.id, order.orderNumber);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
