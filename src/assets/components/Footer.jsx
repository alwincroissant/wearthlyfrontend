import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { LegalModal } from "./LegalModal";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/shop" },
  { label: "Everyday Pieces", to: "/shop" },
  { label: "Comfort Essentials", to: "/shop" },
];

const CLIENT_CARE_LINKS = [
  { label: "Shipping & Delivery", to: "/about#faq" },
  {
    label: "Care Guide",
    href: "https://www.facebook.com/photo/?fbid=122094058287366647&set=pb.61590999411219.-2207520000",
  },
  { label: "Frequently Asked Questions", to: "/about#faq" },
];

const LINK_CLASS =
  "hover:text-zinc-950 transition-colors text-left cursor-pointer text-xs";

const SOCIAL_LINKS = [
  ["Instagram", "https://instagram.com/wearthly.ph", "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Z"],
  ["Facebook", "https://facebook.com/wearthly", "M13.5 22v-8h2.75l.5-3h-3.25V9.05c0-.87.29-1.55 1.6-1.55h1.7V4.82c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.34V11H7.2v3h2.85v8h3.45Z"],
  ["TikTok", "https://tiktok.com/@wearthly.ph", "M14.4 2h3.05c.2 1.7 1.15 3.08 2.8 3.65v3.08a8.6 8.6 0 0 1-2.78-.9v6.2A5.97 5.97 0 1 1 12.3 8.1v3.2a2.78 2.78 0 1 0 2.1 2.7V2Z"],
  ["Pinterest", "https://pin.it/2iu6HHyPl", "M12 2a10 10 0 0 0-3.64 19.31c-.05-1.63-.01-3.58.41-5.2l1.18-4.99s-.3-.6-.3-1.49c0-1.4.81-2.45 1.82-2.45.86 0 1.28.65 1.28 1.43 0 .87-.55 2.17-.84 3.38-.24 1.01.5 1.83 1.49 1.83 1.79 0 3.16-1.89 3.16-4.62 0-2.42-1.74-4.11-4.23-4.11-2.88 0-4.57 2.16-4.57 4.39 0 .87.33 1.8.75 2.31.08.1.1.18.07.3l-.28 1.15c-.05.19-.15.23-.35.14-1.3-.6-2.11-2.48-2.11-3.99A10 10 0 0 0 12 2Z"],
];

export const Footer = () => {
  const [legalDocument, setLegalDocument] = useState(null);

  const closeLegal = useCallback(() => setLegalDocument(null), []);

  return (
    <footer className="border-t border-zinc-200 bg-[#D9CDBB] text-zinc-600 text-xs mt-16 selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <img src="/wearthlylogo.ico" alt="Wearthly" className="w-9 h-9 rounded-full object-cover" />
              <span className="text-sm sm:text-base font-extrabold tracking-[0.22em] text-zinc-950 uppercase">Wearthly</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-sm text-xs">
              Fashion that looks good, feels good, and does good for the planet.
            </p>
            <div className="pt-1 space-y-2 text-zinc-500 text-[11px] max-w-md">
              <p className="leading-relaxed">
                <span className="font-semibold text-zinc-800">Studio & Flagship:</span>{" "}
                <span className="text-zinc-600">#40 Guyabano St. Brgy. Katuparan, Taguig City</span>
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-zinc-800">Concierge:</span>{" "}
                <a href="mailto:wearthlycustomerservice@gmail.com" className="break-all hover:text-zinc-950 transition-colors">
                  wearthlycustomerservice@gmail.com
                </a>
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-zinc-800">Operating Hours:</span>{" "}
                <span className="text-zinc-600">Monday to Saturday, 9:00 AM – 6:00 PM PHT</span>
              </p>
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
                Follow Wearthly
              </h4>
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map(([label, href, icon]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full border border-zinc-400 flex items-center justify-center text-zinc-800 hover:bg-zinc-950 hover:text-white transition-colors"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d={icon} />
                    </svg>
                  </a>
                ))}
              </div>
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

          <div className="hidden">
            <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
              Follow Wearthly
            </h4>
            <div className="flex items-center gap-2.5">
              {[
                ["Instagram", "https://instagram.com/wearthly.ph", "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.25a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Z"],
                ["Facebook", "https://facebook.com/wearthly", "M13.5 22v-8h2.75l.5-3h-3.25V9.05c0-.87.29-1.55 1.6-1.55h1.7V4.82c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.34V11H7.2v3h2.85v8h3.45Z"],
                ["TikTok", "https://tiktok.com/@wearthly.ph", "M14.4 2h3.05c.2 1.7 1.15 3.08 2.8 3.65v3.08a8.6 8.6 0 0 1-2.78-.9v6.2A5.97 5.97 0 1 1 12.3 8.1v3.2a2.78 2.78 0 1 0 2.1 2.7V2Z"],
                ["Pinterest", "https://pin.it/2iu6HHyPl", "M12 2a10 10 0 0 0-3.64 19.31c-.05-1.63-.01-3.58.41-5.2l1.18-4.99s-.3-.6-.3-1.49c0-1.4.81-2.45 1.82-2.45.86 0 1.28.65 1.28 1.43 0 .87-.55 2.17-.84 3.38-.24 1.01.5 1.83 1.49 1.83 1.79 0 3.16-1.89 3.16-4.62 0-2.42-1.74-4.11-4.23-4.11-2.88 0-4.57 2.16-4.57 4.39 0 .87.33 1.8.75 2.31.08.1.1.18.07.3l-.28 1.15c-.05.19-.15.23-.35.14-1.3-.6-2.11-2.48-2.11-3.99 0-3.25 2.36-6.24 6.81-6.24 3.57 0 6.35 2.54 6.35 5.94 0 3.55-2.24 6.4-5.35 6.4-1.04 0-2.02-.54-2.36-1.17l-.64 2.44c-.23.89-.86 2.01-1.28 2.69A10 10 0 1 0 12 2Z"],
              ].map(([label, href, icon]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-zinc-400 flex items-center justify-center text-zinc-800 text-sm font-bold hover:bg-zinc-950 hover:text-white transition-colors"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-[0.16em] text-[11px] mb-3.5">
              Client Care
            </h4>
            <ul className="space-y-2 text-zinc-500">
              {CLIENT_CARE_LINKS.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      {item.label}
                    </a>
                  ) : item.document ? (
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
        <div className="border-t border-stone-300 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Wearthly. All rights reserved.</span>
          </div>

          <div className="flex gap-6 text-zinc-500">
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
          </div>
        </div>
      </div>

      <LegalModal documentKey={legalDocument} onClose={closeLegal} />
    </footer>
  );
};
