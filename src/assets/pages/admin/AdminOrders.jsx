import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, updateOrderStatus } from "../../../actions/orderActions";

const API = import.meta.env.VITE_API;
const statusOptions = [
  ["pending", "Pending"],
  ["processing", "Processing"],
  ["ready_for_pickup", "Ready for pickup"],
  ["shipped", "Shipped"],
  ["completed", "Completed"],
  ["canceled", "Canceled"],
];
const allowedNextStatuses = {
  pending: ["pending", "processing", "canceled"],
  processing: ["processing", "ready_for_pickup", "shipped", "canceled"],
  ready_for_pickup: ["ready_for_pickup", "completed", "canceled"],
  shipped: ["shipped", "completed", "canceled"],
  completed: ["completed"],
  canceled: ["canceled"],
};

const money = (value) =>
  `₱${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

const statusLabel = (value) =>
  String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const { loading, orders = [], error } = useSelector((state) => state.adminOrders);
  const [draftStatuses, setDraftStatuses] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const pendingChanges = useMemo(
    () => Object.keys(draftStatuses).filter((id) => {
      const order = orders.find((item) => item._id === id);
      return order && draftStatuses[id] !== order.orderStatus;
    }),
    [draftStatuses, orders],
  );

  const stageStatus = (orderId, orderStatus) => {
    setActionError("");
    setDraftStatuses((current) => ({ ...current, [orderId]: orderStatus }));
  };

  const submitStatus = async (order) => {
    const nextStatus = draftStatuses[order._id] || order.orderStatus;
    if (nextStatus === order.orderStatus) return;

    setSavingId(order._id);
    setActionError("");
    const result = await dispatch(updateOrderStatus(order._id, { orderStatus: nextStatus }));
    setSavingId(null);

    if (result?.success) {
      setDraftStatuses((current) => {
        const next = { ...current };
        delete next[order._id];
        return next;
      });
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

      {pendingChanges.length > 0 && (
        <p className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs">
          You have {pendingChanges.length} staged fulfillment change{pendingChanges.length === 1 ? "" : "s"}.
          Click Submit on the corresponding order to apply it.
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
                <th className="p-4 min-w-64">Change status</th>
                <th className="p-4">Order info</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const draft = draftStatuses[order._id] || order.orderStatus;
                const hasChange = draft !== order.orderStatus;
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
                      <div className="flex items-center gap-2">
                        <select
                          value={draft}
                          onChange={(event) => stageStatus(order._id, event.target.value)}
                          disabled={savingId === order._id || ["completed", "canceled"].includes(order.orderStatus)}
                          className="border rounded px-2 py-1.5 bg-white"
                        >
                          {(allowedNextStatuses[order.orderStatus] || [order.orderStatus])
                            .map((value) => statusOptions.find(([option]) => option === value))
                            .filter(Boolean)
                            .map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => submitStatus(order)}
                          disabled={!hasChange || savingId === order._id}
                          className="rounded bg-emerald-700 px-3 py-1.5 text-white font-semibold disabled:opacity-40"
                        >
                          {savingId === order._id ? "Saving..." : "Submit"}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 whitespace-nowrap">
                        <button type="button" onClick={() => setSelectedOrder(order)} className="border rounded px-2.5 py-1.5 font-semibold hover:bg-zinc-50">
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
