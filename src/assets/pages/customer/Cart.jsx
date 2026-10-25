import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, selectAllCartItems, selectCartItem, updateCartItemQuantity } from "../../../actions/cartActions";
import { ProductImagePlaceholder } from "../../components/ProductImagePlaceholder";
import { toast } from "react-toastify";

const fmt = (n) => `₱${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const selected = useMemo(() => cartItems.filter((item) => item.selected), [cartItems]);
  const subtotal = selected.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);

  const startCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout/shipping");
      return;
    }
    if (!selected.length) {
      toast.info("Select at least one item to continue.");
      return;
    }
    navigate("/checkout/shipping");
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-8">
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Wearthly collection</p><h1 className="text-2xl font-bold tracking-tight">Your Cart</h1></div>
          <Link to="/shop" className="text-xs text-emerald-700 hover:underline">Continue shopping</Link>
        </div>
        {!cartItems.length ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center"><h2 className="font-bold">Your cart is empty</h2><p className="text-sm text-zinc-500 mt-2">Explore Wearthly pieces made for your everyday.</p><Link to="/shop" className="inline-block mt-5 px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-sm">Browse the collection</Link></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100">
              <div className="px-4 py-3 bg-zinc-50 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={allSelected} onChange={(event) => dispatch(selectAllCartItems(event.target.checked))} className="accent-emerald-600" /> Select all items</label>
                <button type="button" onClick={() => setShowClearConfirm(true)} className="text-xs text-red-600 hover:underline">Clear cart</button>
              </div>
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="p-4 flex gap-4">
                  <input type="checkbox" checked={!!item.selected} onChange={(event) => dispatch(selectCartItem(item.cartItemId, event.target.checked))} className="mt-1 accent-emerald-600" />
                  <div className="w-20 h-20 rounded-lg bg-zinc-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ProductImagePlaceholder category={item.category} name={item.name} brand={item.brand} compact />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">{item.brand || "Wearthly"}</p>
                    <h2 className="font-bold text-sm mt-1">{item.name}</h2>
                    <p className="text-xs text-zinc-500 mt-1">Thoughtfully made for everyday wear</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button type="button" onClick={() => dispatch(updateCartItemQuantity(item.cartItemId, Math.max(1, item.quantity - 1)))} className="w-6 h-6 border rounded">−</button>
                      <span className="text-xs font-semibold">{item.quantity || 1}</span>
                      <button type="button" onClick={() => dispatch(updateCartItemQuantity(item.cartItemId, Math.min(item.inStock, (item.quantity || 1) + 1)))} className="w-6 h-6 border rounded">+</button>
                      <button type="button" onClick={() => dispatch(removeFromCart(item.cartItemId))} className="text-xs text-zinc-400 hover:text-red-600 ml-2">Remove</button>
                    </div>
                  </div>
                  <p className="font-bold text-sm">{fmt(item.price * (item.quantity || 1))}</p>
                </div>
              ))}
            </section>
            <aside className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 sticky top-6">
              <h2 className="font-bold">Order summary</h2>
              <div className="flex justify-between text-sm mt-5"><span className="text-zinc-500">Selected items</span><span>{selected.length}</span></div>
              <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t"><span>Total</span><span>{fmt(subtotal)}</span></div>
              <p className="text-[11px] text-zinc-500 mt-3">One simple transaction. Payment and fulfillment details are confirmed at checkout.</p>
              <button type="button" onClick={startCheckout} className="w-full mt-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm">Continue to checkout</button>
            </aside>
          </div>
        )}
      </main>
      {showClearConfirm && <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-xl p-6 max-w-sm w-full"><h2 className="font-bold">Clear cart?</h2><p className="text-sm text-zinc-500 mt-2">All items will be removed.</p><div className="flex gap-2 mt-5"><button type="button" onClick={() => setShowClearConfirm(false)} className="flex-1 py-2 border rounded-lg text-sm">Keep items</button><button type="button" onClick={() => { dispatch(clearCart()); setShowClearConfirm(false); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">Clear cart</button></div></div></div>}
    </div>
  );
};
