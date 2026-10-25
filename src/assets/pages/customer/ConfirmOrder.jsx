import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitCheckout, resetCheckout } from "../../../actions/orderActions";
import { clearSuccessfulItems } from "../../../actions/cartActions";
import { ProductImagePlaceholder } from "../../components/ProductImagePlaceholder";
import { CheckoutStepper } from "../../components/CheckoutStepper";
import { toast } from "react-toastify";

const fmt = (n) => `₱${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const { cartItems = [], shippingInfo } = useSelector((state) => state.cart);
  const { loading, success, results, error } = useSelector((state) => state.checkout);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const notified = useRef(false);
  const selectedItems = useMemo(() => cartItems.filter((item) => item.selected), [cartItems]);
  const shippingFee = shippingInfo?.partsFulfillmentMethod === "delivery" ? 350 : 0;
  const total = selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) + shippingFee;

  const placeOrder = () => {
    if (!agreedTerms) {
      toast.warning("Please agree to the checkout terms.");
      return;
    }
    dispatch(submitCheckout({
      checkoutSessionId: `wearthly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      items: selectedItems.map((item) => ({ productId: item.productId, quantity: item.isVehicle ? 1 : item.quantity, purchaseMethod: "cash" })),
      shippingInfo,
      paymentMethod: "cash_on_releasing",
      paymentDetails: {},
    }));
  };

  useEffect(() => {
    if (!success || !results || notified.current) return;
    const checkoutResults = (results?.data || results)?.results || [];
    const itemIds = checkoutResults.filter((item) => item.status === "success").map((item) => item.productId);
    if (itemIds.length) {
      notified.current = true;
      dispatch(clearSuccessfulItems(cartItems.filter((item) => itemIds.includes(item.productId)).map((item) => item.cartItemId)));
      toast.success("Order placed successfully.");
    }
  }, [cartItems, dispatch, results, success]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => dispatch(resetCheckout());
  }, [dispatch, error]);

  if (success && results) {
    return <div className="min-h-screen bg-zinc-50 py-16 px-4"><div className="max-w-xl mx-auto bg-white border rounded-xl p-8 text-center"><div className="text-emerald-600 text-4xl">✓</div><h1 className="text-2xl font-bold mt-3">Order received</h1><p className="text-sm text-zinc-500 mt-2">Your Wearthly order has been recorded. We will confirm the next fulfillment step with you.</p><Link to="/orders" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm">View my orders</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <CheckoutStepper activeStep={2} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 bg-white border rounded-xl divide-y">
            <div className="p-6"><h1 className="text-xl font-bold">Review and place order</h1><p className="text-xs text-zinc-500 mt-1">One simple transaction with cash settlement at release or delivery.</p></div>
            <div className="p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Fulfillment details</h2>
              <p className="text-sm">{shippingInfo?.recipientName}</p><p className="text-sm text-zinc-500">{shippingInfo?.contactNumber} · {shippingInfo?.email}</p>
              <p className="text-sm text-zinc-500">{shippingInfo?.fulfillmentMethod === "pickup" ? shippingInfo?.branch : `${shippingInfo?.address}, ${shippingInfo?.city}`}</p>
            </div>
            <div className="p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Payment</h2>
              <div className="mt-3 p-4 rounded-lg border border-emerald-200 bg-emerald-50"><p className="font-semibold text-sm">Cash on release / delivery</p><p className="text-xs text-zinc-600 mt-1">No installment plans or external payment accounts. Settle the final amount directly with Wearthly.</p></div>
            </div>
            <div className="p-6 bg-zinc-50">
              <label className="flex items-start gap-3 text-xs text-zinc-600"><input type="checkbox" checked={agreedTerms} onChange={(event) => setAgreedTerms(event.target.checked)} className="mt-0.5 accent-emerald-600" /> I confirm that my order and fulfillment information is accurate and agree to the store terms.</label>
              <div className="flex gap-3 mt-5"><Link to="/checkout/shipping" className="flex-1 text-center py-3 border rounded-lg text-sm">Back</Link><button type="button" onClick={placeOrder} disabled={loading} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-bold text-sm disabled:opacity-60">{loading ? "Processing..." : "Place order"}</button></div>
            </div>
          </section>
          <aside className="lg:col-span-5 bg-white border rounded-xl p-6 sticky top-6"><h2 className="font-bold">Order summary</h2><div className="divide-y mt-4">{selectedItems.map((item) => <div key={item.cartItemId} className="py-3 flex gap-3"><div className="w-12 h-12 rounded bg-zinc-100 overflow-hidden">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <ProductImagePlaceholder name={item.name} category={item.category} compact />}</div><div className="flex-1"><p className="text-xs font-semibold">{item.name}</p><p className="text-[11px] text-zinc-500">Qty: {item.quantity || 1}</p></div><span className="text-xs font-semibold">{fmt(item.price * (item.quantity || 1))}</span></div>)}</div><div className="flex justify-between border-t pt-4 mt-2 font-bold"><span>Total</span><span>{fmt(total)}</span></div>{shippingFee > 0 && <p className="text-[11px] text-zinc-500 mt-2">Includes ₱350 delivery fee</p>}</aside>
        </div>
      </main>
    </div>
  );
};
