import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders, updateOrderStatus } from "../../../actions/orderActions";

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const { loading, orders = [], error } = useSelector((state) => state.adminOrders);
  useEffect(() => { dispatch(getAdminOrders()); }, [dispatch]);
  const setStatus = (id, orderStatus) => dispatch(updateOrderStatus(id, { orderStatus })).then(() => dispatch(getAdminOrders()));

  return <div className="p-4 sm:p-6 space-y-5"><div><h1 className="text-xl font-bold">Orders</h1><p className="text-xs text-zinc-500 mt-1">Manage Wearthly direct transactions and fulfillment status.</p></div>{error && <p className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</p>}{loading ? <p className="text-sm text-zinc-500">Loading orders...</p> : <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-zinc-50 border-b"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id} className="border-b last:border-0"><td className="p-4 font-semibold">{order.orderNumber}</td><td className="p-4">{order.user?.firstName} {order.user?.lastName}</td><td className="p-4">₱{Number(order.totalPrice || 0).toLocaleString()}</td><td className="p-4 capitalize">{order.orderStatus?.replaceAll("_", " ")}</td><td className="p-4"><select value={order.orderStatus} onChange={(event) => setStatus(order._id, event.target.value)} className="border rounded px-2 py-1"><option value="pending">Pending</option><option value="processing">Processing</option><option value="ready_for_pickup">Ready for pickup</option><option value="shipped">Shipped</option><option value="completed">Completed</option><option value="canceled">Canceled</option></select></td></tr>)}</tbody></table>{!orders.length && <p className="p-6 text-center text-sm text-zinc-500">No orders yet.</p>}</div>}</div>;
};
