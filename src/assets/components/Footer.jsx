import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { LegalModal } from "./LegalModal";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop" },
  { label: "Everyday Pieces", to: "/shop" },
  { label: "Mindful Materials", to: "/about" },
  { label: "Comfort Essentials", to: "/shop" },
];

const CLIENT_CARE_LINKS = [
  { label: "Order Tracking", to: "/orders" },
  { label: "Shipping & Delivery", to: "/about#faq" },
  { label: "Returns & Exchanges", document: "refunds" },
  { label: "Size & Fit Guide", to: "/about#faq" },
  { label: "Care Guide", to: "/about#faq" },
  { label: "Frequently Asked Questions", to: "/about#faq" },
];

const BRAND_LINKS = [
  { label: "About Wearthly", to: "/about" },
  { label: "Wearthly Edit", to: "/#lookbook" },
  { label: "Our Story", to: "/about" },
  { label: "Store Locations", to: "/about#contact" },
  { label: "Privacy Policy", document: "privacy" },
  { label: "Terms of Service", document: "terms" },
];

const LINK_CLASS =
  "hover:text-zinc-950 transition-colors text-left cursor-pointer text-xs";

export const Footer = () => {
  const [legalDocument, setLegalDocument] = useState(null);

  const closeLegal = useCallback(() => setLegalDocument(null), []);

  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 text-xs mt-16 selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <img src="/logowearthly.png" alt="Wearthly" className="w-9 h-9 rounded-full object-cover" />
              <span className="text-sm sm:text-base font-extrabold tracking-[0.22em] text-zinc-950 uppercase">Wearthly</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-sm text-xs">
              Fashion that looks good, feels good, and does good for the planet.
            </p>
            <div className="pt-2 space-y-1.5 text-zinc-500 text-[11px]">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-zinc-800">Studio & Flagship:</span>
                <span className="text-zinc-600">Philippines</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-zinc-800">Concierge:</span>
                <a href="mailto:support@wearthly.ph" className="hover:text-zinc-950 transition-colors">
                  support@wearthly.ph
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-zinc-800">Operating Hours:</span>
                <span className="text-zinc-600">Monday to Saturday, 9:00 AM – 6:00 PM PHT</span>
              </p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-zinc-500">
              {SHOP_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className={LINK_CLASS}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
              Client Care
            </h4>
            <ul className="space-y-2 text-zinc-500">
              {CLIENT_CARE_LINKS.map((item) => (
                <li key={item.label}>
                  {item.document ? (
                    <button
                      type="button"
                      onClick={() => setLegalDocument(item.document)}
                      aria-haspopup="dialog"
                      className={LINK_CLASS}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.to} className={LINK_CLASS}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* The Brand */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
              The Brand
            </h4>
            <ul className="space-y-2 text-zinc-500">
              {BRAND_LINKS.map((item) => (
                <li key={item.label}>
                  {item.document ? (
                    <button
                      type="button"
                      onClick={() => setLegalDocument(item.document)}
                      aria-haspopup="dialog"
                      className={LINK_CLASS}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link to={item.to} className={LINK_CLASS}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Sub-Footer */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Wearthly. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5 text-zinc-500">
            <button
              type="button"
              onClick={() => setLegalDocument("terms")}
              aria-haspopup="dialog"
              className={LINK_CLASS}
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setLegalDocument("privacy")}
              aria-haspopup="dialog"
              className={LINK_CLASS}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalDocument("refunds")}
              aria-haspopup="dialog"
              className={LINK_CLASS}
            >
              Returns & Exchanges
            </button>
          </div>
        </div>
      </div>

      <LegalModal documentKey={legalDocument} onClose={closeLegal} />
    </footer>
  );
};
