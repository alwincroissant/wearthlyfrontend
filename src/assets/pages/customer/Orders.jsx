import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders, cancelOrder } from "../../../actions/orderActions";
import { ProductImagePlaceholder } from "../../components/ProductImagePlaceholder";
import { toast } from "react-toastify";

const fmt = (n) => `₱${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders = [], error } = useSelector((state) => state.myOrders);

  useEffect(() => { dispatch(getMyOrders()); }, [dispatch]);

  const handleCancel = async (order) => {
    const result = await dispatch(cancelOrder(order._id));
    if (result?.success) {
      toast.success("Order canceled.");
      dispatch(getMyOrders());
    } else {
      toast.error(result?.message || "Unable to cancel order.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-6"><div><p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">Wearthly account</p><h1 className="text-2xl font-bold">My Orders</h1></div><Link to="/shop" className="text-xs text-emerald-700 hover:underline">Continue shopping</Link></div>
        {loading && <div className="bg-white border rounded-xl p-8 text-center text-sm text-zinc-500">Loading orders...</div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
        {!loading && !error && !orders.length && <div className="bg-white border rounded-xl p-10 text-center"><h2 className="font-bold">No orders yet</h2><p className="text-sm text-zinc-500 mt-2">Your completed purchases will appear here.</p></div>}
        <div className="space-y-4">{orders.map((order) => <article key={order._id} className="bg-white border rounded-xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-zinc-500">Order {order.orderNumber}</p><h2 className="font-bold mt-1 capitalize">{order.orderStatus?.replaceAll("_", " ")}</h2></div><span className="font-bold">{fmt(order.totalPrice)}</span></div><div className="divide-y mt-4">{(order.orderItems || []).map((item) => <div key={`${order._id}-${item.product}`} className="py-3 flex gap-3"><div className="w-12 h-12 rounded bg-zinc-100 overflow-hidden">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ProductImagePlaceholder name={item.name} category={item.itemType} compact />}</div><div className="flex-1"><p className="text-xs font-semibold">{item.name}</p><p className="text-[11px] text-zinc-500">Qty: {item.quantity}</p></div><span className="text-xs font-semibold">{fmt(item.price * item.quantity)}</span></div>)}</div>{!["completed", "canceled", "shipped"].includes(order.orderStatus) && <button type="button" onClick={() => handleCancel(order)} className="mt-3 text-xs text-red-600 hover:underline">Cancel order</button>}</article>)}</div>
      </main>
    </div>
  );
};
