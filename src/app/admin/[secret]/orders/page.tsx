"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar,
  X,
  RefreshCw,
  TrendingUp,
  Clock,
  PackageCheck,
  CheckCircle,
  Truck
} from "lucide-react";

interface OrderItem {
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  trackingUpdates: any[];
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Edit form state
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setEditPaymentStatus(order.paymentStatus);
    setEditTrackingNumber(order.trackingNumber || "");
  };

  const handleCloseEdit = () => {
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: editStatus,
          paymentStatus: editPaymentStatus,
          trackingNumber: editTrackingNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local orders state
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? data.order : o))
        );
        setSelectedOrder(data.order);
        alert("Order updated successfully!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to update order");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during updating.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber && order.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingDetails.name.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingDetails.email.toLowerCase().includes(search.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 border-green-200 text-green-700";
      case "Shipped":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Processing":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "Pending":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Cancelled":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  // Calculate metrics
  const pendingCount = orders.filter(o => o.orderStatus === "Pending").length;
  const processingCount = orders.filter(o => o.orderStatus === "Processing").length;
  const shippedCount = orders.filter(o => o.orderStatus === "Shipped").length;
  const totalRevenue = orders
    .filter(o => o.orderStatus !== "Cancelled" && o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner */}
      <div>
        <h1 className="font-serif text-[28px] md:text-[32px] font-medium text-[#0f3a2a] tracking-tight flex items-center gap-3">
          Manage Orders
          <ShoppingBag className="h-6 w-6 text-[#8b926d]" />
        </h1>
        <p className="text-[13px] text-slate-500 max-w-xl leading-relaxed mt-1">
          Review customer checkouts, dispatch items, write tracking numbers, and update shipping logs.
        </p>
      </div>

      {/* Mini Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Dispatch</p>
              <h4 className="mt-2 text-[24px] font-bold text-slate-800 font-sans">{pendingCount + processingCount}</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Pending or processing studio items</p>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Transit</p>
              <h4 className="mt-2 text-[24px] font-bold text-slate-800 font-sans">{shippedCount}</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Currently with shipping partners</p>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue Collected</p>
              <h4 className="mt-2 text-[24px] font-bold text-[#073623] font-sans">₹{totalRevenue.toFixed(2)}</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#073623]/10 text-[#073623] shadow-sm border border-[#073623]/25">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Excludes cancelled and unpaid COD</p>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
              <h4 className="mt-2 text-[24px] font-bold text-slate-800 font-sans">{orders.length}</h4>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 shadow-sm border border-slate-200">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">All recorded customer purchases</p>
        </div>

      </div>

      {/* FILTER & TABLE SECTION */}
      <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-6">
        
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, name, email, tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f3a2a] bg-slate-50 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-black/[0.08] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0f3a2a] bg-slate-50"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button 
              onClick={fetchOrders}
              className="p-2 border border-black/[0.08] rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 font-medium">
            <div className="w-8 h-8 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading orders list...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 border border-dashed border-black/[0.08] rounded-xl bg-slate-50">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-350 mb-3" />
            <p className="text-sm font-semibold">No orders match the criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-black/5">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                      {order.orderNumber || order._id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900">{order.shippingDetails.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{order.shippingDetails.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-sans text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 font-sans">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>
                        <span className="font-medium">{order.paymentMethod}</span>
                        <span className={`block text-[10px] font-semibold uppercase mt-0.5 ${
                          order.paymentStatus === "Paid" ? "text-green-650" : "text-orange-600"
                        }`}>{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(order)}
                        className="p-2 border border-black/[0.06] rounded bg-white hover:bg-slate-50 text-[#073623] hover:text-[#0c4a31] transition-all inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* EDIT MODAL DIALOG */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseEdit} />
          
          {/* Modal Panel */}
          <div className="bg-[#F1EFE7] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-black/10 shadow-2xl relative z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={handleCloseEdit}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-full hover:bg-black/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-medium text-[#0f3a2a] mb-6 border-b border-black/10 pb-3 flex flex-wrap items-baseline gap-2">
              <span>Order Details</span>
              <span className="text-xs font-mono font-normal text-slate-500">({selectedOrder.orderNumber || selectedOrder._id})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Client address & Info */}
              <div className="space-y-4">
                <div className="bg-white/60 border border-black/[0.04] p-4 rounded-xl space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Client Information
                  </h3>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-800">{selectedOrder.shippingDetails.name}</p>
                    <p className="mt-1">📞 {selectedOrder.shippingDetails.phone}</p>
                    <p>✉️ {selectedOrder.shippingDetails.email}</p>
                  </div>
                </div>

                <div className="bg-white/60 border border-black/[0.04] p-4 rounded-xl space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Destination
                  </h3>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p>{selectedOrder.shippingDetails.address}</p>
                    <p className="font-semibold mt-0.5">{selectedOrder.shippingDetails.city}, {selectedOrder.shippingDetails.state} - {selectedOrder.shippingDetails.postalCode}</p>
                  </div>
                </div>

                <div className="bg-white/60 border border-black/[0.04] p-4 rounded-xl space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Items List ({selectedOrder.items.length})
                  </h3>
                  <div className="divide-y divide-black/5 text-xs max-h-[160px] overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
                        <span className="text-slate-650 pr-4">
                          {item.name} <span className="font-bold text-[#b13d33] uppercase">({item.size})</span> × {item.quantity}
                        </span>
                        <span className="font-semibold text-slate-800 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/5 pt-2 flex justify-between font-bold text-xs text-[#0f3a2a]">
                    <span>Total Bill</span>
                    <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Update forms */}
              <form onSubmit={handleUpdateOrder} className="bg-white p-6 rounded-xl border border-black/[0.04] space-y-4">
                <h3 className="text-[11px] font-bold text-[#0f3a2a] uppercase tracking-widest border-b border-black/5 pb-2">
                  Update Settings
                </h3>

                <div>
                  <label htmlFor="editStatus" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Order Status
                  </label>
                  <select
                    id="editStatus"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-xs focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none"
                  >
                    <option value="Pending">Pending (Placed)</option>
                    <option value="Processing">Processing (Weaving)</option>
                    <option value="Shipped">Shipped (In Transit)</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="editPaymentStatus" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Payment Status
                  </label>
                  <select
                    id="editPaymentStatus"
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-xs focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="editTracking" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Courier Tracking Reference
                  </label>
                  <input
                    type="text"
                    id="editTracking"
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    placeholder="Enter tracking ID/URL"
                    className="w-full rounded-lg border border-black/[0.08] px-3 py-2 text-xs focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none font-sans text-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 leading-normal block mt-1 font-medium">
                    Required when shifting order status to &apos;Shipped&apos; so customers can track transit.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3 bg-[#0F3A2A] hover:bg-[#134A31] disabled:bg-[#0F3A2A]/50 text-white text-[11px] font-bold tracking-widest uppercase rounded shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    "Save & Log update"
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
