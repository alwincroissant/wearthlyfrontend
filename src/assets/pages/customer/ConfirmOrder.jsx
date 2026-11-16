import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { submitCheckout, resetCheckout } from "../../../actions/orderActions";
import { clearSuccessfulItems } from "../../../actions/cartActions";
import { ProductImagePlaceholder } from "../../components/ProductImagePlaceholder";
import { CheckoutStepper } from "../../components/CheckoutStepper";
import { toast } from "react-toastify";

const fmt = (n) => `₱${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], shippingInfo } = useSelector((state) => state.cart);
  const { loading, success, results, error } = useSelector((state) => state.checkout);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const notified = useRef(false);
  const selectedItems = useMemo(() => cartItems.filter((item) => item.selected), [cartItems]);
  const shippingFee = shippingInfo?.fulfillmentMethod === "delivery" ? 350 : 0;
  const itemsTotal = selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const total = itemsTotal + shippingFee;
  const requiresDeliveryAddress = true;
  const isFilled = (value) => typeof value === "string" && value.trim().length > 0;
  const missingDeliveryFields = [
    !isFilled(shippingInfo?.address) && "street address",
    !isFilled(shippingInfo?.region) && "region",
    !isFilled(shippingInfo?.province) && "province",
    !isFilled(shippingInfo?.barangay) && "barangay",
    !isFilled(shippingInfo?.city) && "city",
    !/^\d{4}$/.test(String(shippingInfo?.postalCode || "").trim()) && "4-digit postal code",
  ].filter(Boolean);
  const hasCompleteDeliveryAddress = missingDeliveryFields.length === 0;
  const missingDeliveryMessage = missingDeliveryFields.length
    ? `Missing or invalid: ${missingDeliveryFields.join(", ")}.`
    : "";

  const fullAddress = [
    shippingInfo?.address,
    shippingInfo?.barangay,
    shippingInfo?.city,
    shippingInfo?.province,
    shippingInfo?.region,
    shippingInfo?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    if (
      selectedItems.length === 0 ||
      !shippingInfo ||
      (requiresDeliveryAddress && !hasCompleteDeliveryAddress)
    ) {
      toast.warning(
        `Please complete your delivery details before continuing. ${missingDeliveryMessage}`.trim(),
      );
      navigate("/checkout/shipping", { replace: true });
    }
  }, [
    hasCompleteDeliveryAddress,
    navigate,
    requiresDeliveryAddress,
    selectedItems.length,
    shippingInfo,
    missingDeliveryMessage,
  ]);

  const placeOrder = () => {
    if (!shippingInfo || (requiresDeliveryAddress && !hasCompleteDeliveryAddress)) {
      toast.warning(
        `Please complete your delivery details before placing the order. ${missingDeliveryMessage}`.trim(),
      );
      navigate("/checkout/shipping", { replace: true });
      return;
    }
    if (!agreedTerms) {
      toast.warning("Please agree to the checkout terms.");
      return;
    }
    dispatch(
      submitCheckout({
        checkoutSessionId: `wearthly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.isVehicle ? 1 : item.quantity,
          purchaseMethod: "cash",
        })),
        shippingInfo,
        paymentMethod: "cod",
        paymentDetails: {},
      }),
    );
  };

  useEffect(() => {
    if (!success || !results || notified.current) return;
    const checkoutResults = (results?.data || results)?.results || [];
    const itemIds = checkoutResults
      .filter((item) => item.status === "success")
      .map((item) => item.productId);
    if (itemIds.length) {
      notified.current = true;
      dispatch(
        clearSuccessfulItems(
          cartItems
            .filter((item) => itemIds.includes(item.productId))
            .map((item) => item.cartItemId),
        ),
      );
      toast.success("Order placed successfully.");
    }
  }, [cartItems, dispatch, results, success]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => dispatch(resetCheckout());
  }, [dispatch, error]);

  if (success && results) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white border border-zinc-200 rounded-xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <svg
              className="w-5 h-5 text-emerald-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mt-4">Order received</h1>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
            Your Wearthly order has been recorded. We will confirm the next fulfillment step with
            you.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <span className="text-xs text-zinc-500">Payment method</span>
            <span className="text-xs font-bold text-zinc-900">COD</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Link
              to="/orders"
              className="flex-1 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
            >
              View my orders
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-sm font-semibold transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-8 px-4 sm:px-6">
      <main className="max-w-6xl mx-auto">
        <CheckoutStepper activeStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl shadow-xs divide-y divide-zinc-100 overflow-hidden">
            <div className="p-6">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">Review and place order</h1>
              <p className="text-xs text-zinc-500 mt-1">
                Check your delivery details and confirm your order.
              </p>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Delivery details
                </h2>
                <Link
                  to="/checkout/shipping"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {shippingInfo?.recipientName || "—"}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{shippingInfo?.contactNumber || "—"}</p>
                {shippingInfo?.email && (
                  <p className="text-xs text-zinc-500 mt-0.5">{shippingInfo.email}</p>
                )}
                <p className="text-xs text-zinc-600 mt-3 leading-relaxed">{fullAddress || "—"}</p>
                {shippingInfo?.deliveryNotes && (
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Note: {shippingInfo.deliveryNotes}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Payment method
              </h2>

              <label className="flex items-start gap-3 rounded-lg border border-emerald-600 bg-emerald-50/40 p-4 cursor-default">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked
                  readOnly
                  className="mt-0.5 accent-emerald-600"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-zinc-900">COD</span>
                  <span className="block text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Cash on Delivery. Pay the full amount when your order arrives.
                  </span>
                </span>
              </label>
            </div>

            <div className="p-6 bg-zinc-50">
              <label className="flex items-start gap-3 text-xs text-zinc-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(event) => setAgreedTerms(event.target.checked)}
                  className="mt-0.5 accent-emerald-600"
                />
                <span className="leading-relaxed">
                  I confirm that my order and delivery details are accurate and agree to the store
                  terms.
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <Link
                  to="/checkout/shipping"
                  className="flex-1 text-center py-2.5 border border-zinc-300 hover:bg-zinc-100 rounded-lg text-xs font-semibold text-zinc-700 transition-colors"
                >
                  Back
                </Link>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Processing..." : "Place order"}
                </button>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-6 sticky top-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="font-bold text-sm text-zinc-900">
                Order summary ({selectedItems.length}{" "}
                {selectedItems.length === 1 ? "item" : "items"})
              </h2>
              <Link to="/cart" className="text-xs font-semibold text-emerald-700 hover:underline">
                Edit cart
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto pr-1">
              {selectedItems.map((item) => (
                <div key={item.cartItemId || item.productId} className="py-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProductImagePlaceholder
                        name={item.name}
                        category={item.category}
                        compact
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.isVehicle ? 1 : item.quantity || 1}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-zinc-900 shrink-0">
                    {fmt((item.price || 0) * (item.isVehicle ? 1 : item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-900">{fmt(itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping fee</span>
                <span className="font-medium text-zinc-900">
                  {shippingFee > 0 ? fmt(shippingFee) : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Total due</span>
                <span className="text-emerald-700">{fmt(total)}</span>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2.5 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Payment method</span>
              <span className="font-bold text-zinc-900">COD</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
