import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, updateOrderStatus } from "../../../actions/orderActions";

const API = import.meta.env.VITE_API;
const statusOptions = [
  ["pending", "Pending"],
  ["processing", "Processing"],
  ["ready_for_pickup", "Ready for pickup"],
  ["shipped", "Shipped"],
  ["completed", "Delivered"],
  ["canceled", "Canceled"],
];

const money = (value) =>
  `₱${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const statusLabel = (value) =>
  value === "completed"
    ? "Delivered"
    : String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const { loading, orders = [], error } = useSelector((state) => state.adminOrders);
  const [savingId, setSavingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const showDetails = (order) => {
    setActionError("");
    setSelectedOrder(order);
    setSelectedStatus(order.orderStatus);
  };

  const submitStatus = async () => {
    const order = selectedOrder;
    const nextStatus = selectedStatus;
    if (!order || nextStatus === order.orderStatus) return;
    if (nextStatus === order.orderStatus) return;

    setSavingId(order._id);
    setActionError("");
    const result = await dispatch(updateOrderStatus(order._id, { orderStatus: nextStatus }));
    setSavingId(null);

    if (result?.success) {
      setSelectedOrder((current) => current ? { ...current, orderStatus: nextStatus } : current);
      dispatch(getAdminOrders());
    } else {
      setActionError(result?.message || "The order status could not be updated.");
    }
  };

  const openReceipt = (orderId) => {
    window.open(`${API}/order/${orderId}/receipt?format=pdf`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Orders</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review customer information and submit fulfillment updates.
        </p>
      </div>

      {(error || actionError) && (
        <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {actionError || error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading orders...</p>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4">Order info</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr key={order._id} className="border-b last:border-0 align-top">
                    <td className="p-4 font-semibold whitespace-nowrap">{order.orderNumber}</td>
                    <td className="p-4">
                      <p>{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-zinc-500">{order.user?.email || order.shippingInfo?.email}</p>
                    </td>
                    <td className="p-4">{order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</td>
                    <td className="p-4 whitespace-nowrap">{money(order.totalPrice)}</td>
                    <td className="p-4 capitalize whitespace-nowrap">{statusLabel(order.orderStatus)}</td>
                    <td className="p-4">
                      <div className="flex gap-2 whitespace-nowrap">
                        <button type="button" onClick={() => showDetails(order)} className="border rounded px-2.5 py-1.5 font-semibold hover:bg-zinc-50">
                          View details
                        </button>
                        <button type="button" onClick={() => openReceipt(order._id)} className="border rounded px-2.5 py-1.5 font-semibold hover:bg-zinc-50">
                          PDF receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!orders.length && <p className="p-6 text-center text-sm text-zinc-500">No orders yet.</p>}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-lg">Order {selectedOrder.orderNumber}</h2>
                <p className="text-xs text-zinc-500 mt-1">{statusLabel(selectedOrder.orderStatus)}</p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-zinc-900 text-xl" aria-label="Close order details">×</button>
            </div>
            <div className="p-5 space-y-5 text-sm">
              <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-800 mb-2">Fulfillment status</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    disabled={savingId === selectedOrder._id || ["completed", "canceled"].includes(selectedOrder.orderStatus)}
                    className="border rounded px-3 py-2 bg-white flex-1"
                  >
                    {statusOptions.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={submitStatus}
                    disabled={selectedStatus === selectedOrder.orderStatus || savingId === selectedOrder._id || ["completed", "canceled"].includes(selectedOrder.orderStatus)}
                    className="rounded bg-emerald-700 px-4 py-2 text-white font-semibold disabled:opacity-40"
                  >
                    {savingId === selectedOrder._id ? "Saving..." : "Submit status"}
                  </button>
                </div>
                {["completed", "canceled"].includes(selectedOrder.orderStatus) && (
                  <p className="text-xs text-emerald-800 mt-2">This order is {selectedOrder.orderStatus === "completed" ? "delivered" : "canceled"} and can no longer be changed.</p>
                )}
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">Customer</h3>
                <p>{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                <p className="text-zinc-600">{selectedOrder.shippingInfo?.email || selectedOrder.user?.email}</p>
                <p className="text-zinc-600">{selectedOrder.shippingInfo?.contactNumber || selectedOrder.user?.contactNumber}</p>
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">Fulfillment</h3>
                <p>{selectedOrder.shippingInfo?.fulfillmentMethod === "pickup" ? "Pickup" : "Delivery"}</p>
                <p className="text-zinc-600">{selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.barangay}, {selectedOrder.shippingInfo?.city} {selectedOrder.shippingInfo?.postalCode}</p>
                {selectedOrder.shippingInfo?.branch && <p className="text-zinc-600">Branch: {selectedOrder.shippingInfo.branch}</p>}
              </section>
              <section>
                <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">Items</h3>
                <div className="divide-y border rounded-lg">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={`${item.product?._id || item.name}-${index}`} className="p-3 flex justify-between gap-4">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">{money(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-3"><span>Total</span><span>{money(selectedOrder.totalPrice)}</span></div>
              </section>
              <button type="button" onClick={() => openReceipt(selectedOrder._id)} className="w-full rounded bg-zinc-900 text-white py-2.5 font-semibold">
                Open PDF receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
