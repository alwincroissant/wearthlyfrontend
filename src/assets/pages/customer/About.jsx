import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "../../components/ScrollReveal";

const FAQ_DATA = [
  {
    id: "faq-sizing",
    category: "Materials and Fit",
    question: "How does Wearthly approach comfort and fit?",
    answer:
      "Each Wearthly listing includes measurements and product details to help you choose a piece that fits your everyday wardrobe. Contact us if you need help comparing styles.",
  },
  {
    id: "faq-unisex",
    category: "Materials and Fit",
    question: "Are Wearthly pieces made for everyday wear?",
    answer:
      "Yes. Our pieces are designed to be comfortable, versatile, and easy to style across work, school, community, and everyday life.",
  },
  {
    id: "faq-shipping-timeline",
    category: "Shipping and Dispatch",
    question: "When will my Wearthly order arrive?",
    answer:
      "Delivery timing depends on your location and the availability of the piece. We will provide the next fulfillment step and status updates after your order is placed.",
  },
  {
    id: "faq-free-shipping",
    category: "Shipping and Dispatch",
    question: "Do you offer complimentary shipping?",
    answer:
      "Shipping options and applicable fees are shown during checkout before you confirm your order.",
  },
  {
    id: "faq-payments",
    category: "Orders and Payments",
    question: "What payment method do you accept?",
    answer:
      "Wearthly keeps checkout simple with one straightforward transaction method and clear order confirmation.",
  },
  {
    id: "faq-returns",
    category: "Returns and Exchanges",
    question: "What is your return and exchange policy?",
    answer:
      "Please contact Wearthly support as soon as possible if your order has an issue. Items should be unworn, unwashed, and returned with their original packaging.",
  },
  {
    id: "faq-garment-care",
    category: "Garment Care",
    question: "How should I care for my Wearthly pieces?",
    answer:
      "Follow the care instructions provided with each piece. In general, wash thoughtfully, avoid unnecessary heat, and give your clothing the care it needs to last.",
  },
  {
    id: "faq-drops",
    category: "Orders and Payments",
    question: "How often do new Wearthly pieces arrive?",
    answer:
      "We introduce considered pieces periodically and restock thoughtfully based on availability and community interest.",
  },
];

const CATEGORIES = [
  "All Questions",
  "Materials and Fit",
  "Shipping and Dispatch",
  "Orders and Payments",
  "Returns and Exchanges",
  "Garment Care",
];

export const About = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState("faq-sizing");

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Questions" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Page Header */}
      <section
        style={{ marginTop: "calc(-1 * var(--nav-h, 56px))" }}
        className="bg-zinc-950 text-white pt-28 pb-16 sm:pt-32 sm:pb-24 border-b border-zinc-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#52525b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.28em] font-bold text-emerald-400">
              Comfort, Reimagined.
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-[1.05]">
              About Wearthly
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              Fashion that looks good, feels good, and does good for the planet.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
              <span>Thoughtful Everyday Pieces</span>
              <span>•</span>
              <span>Mindful Material Choices</span>
              <span>•</span>
              <span>Comfort, Reimagined.</span>
            </div>
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section data-nav-hero-end className="bg-zinc-900 border-b border-zinc-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-x-8">
          <div className="space-y-1">
            <p className="text-sm font-bold text-white tracking-wide">Thoughtful Materials</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Comfortable materials and considered construction made for repeated everyday wear.
            </p>
          </div>
          <div className="space-y-1 sm:border-l sm:border-zinc-800 sm:pl-6">
            <p className="text-sm font-bold text-white tracking-wide">Made for Real Life</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Designed for office teams, corporate life, schools, NGOs, and communities across the Philippines.
            </p>
          </div>
          <div className="space-y-1 sm:border-l sm:border-zinc-800 sm:pl-6">
            <p className="text-sm font-bold text-white tracking-wide">Style with Purpose</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Versatile pieces that help you look good, feel good, and make more mindful choices.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20 flex-1 w-full">
        {/* Brand Story & Philosophy */}
        <ScrollReveal threshold={0.08} duration={400}>
          <section className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-16 items-start">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-emerald-700">
                Design Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                Comfort, Reimagined.
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Welcome to WEARTHLY. We believe style should be more than what
                you wear; it should also reflect choices that are kinder to our
                planet. Our collection is stylish, comfortable, and thoughtfully
                made for your everyday vibe.
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Each silhouette is crafted through extensive pattern drafting, bespoke fabric dyeing, and meticulous fitting trials—resulting in clothing that moves fluidly between street and formal space.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-2 border-t-2 border-zinc-900 pt-4">
                <p className="font-bold text-zinc-900 text-sm tracking-wide">Custom Textile Weights</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  We reduce fabric waste, reimagine materials, and give clothes a new purpose wherever we can.
                </p>
              </div>
              <div className="space-y-2 border-t-2 border-zinc-900 pt-4">
                <p className="font-bold text-zinc-900 text-sm tracking-wide">Global Runway Pedigree</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  We make sustainability feel practical, welcoming, and easy to bring into everyday life.
                </p>
              </div>
              <div className="space-y-2 border-t-2 border-zinc-900 pt-4">
                <p className="font-bold text-zinc-900 text-sm tracking-wide">Mindful Batching</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Limited production runs that curtail overstocking, honor ethical craftsmanship, and preserve collector uniqueness.
                </p>
              </div>
              <div className="space-y-2 border-t-2 border-zinc-900 pt-4">
                <p className="font-bold text-zinc-900 text-sm tracking-wide">Express Delivery</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Same-week dispatch throughout the Philippine archipelago and expedited global express handling.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ Section */}
        <ScrollReveal threshold={0.08} duration={400}>
          <section id="faq" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-900">
              <div className="space-y-1.5 max-w-xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-emerald-700">
                  Client Assistance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Clear answers regarding products, orders, delivery, and ownership support.
                </p>
              </div>

              {/* Search Bar for Q and A */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sizing, delivery, fabric care..."
                    className="w-full h-10 pl-9 pr-3 rounded border border-zinc-300 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                  />
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-zinc-950 text-white font-semibold"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Accordion List */}
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {filteredFaqs.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  No questions match your query. Reach our studio desk at support@wearthly.ph.
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="transition-colors hover:bg-zinc-50/50">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <div className="space-y-1 pr-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block font-semibold">
                            {faq.category}
                          </span>
                          <span className="text-sm font-bold text-zinc-900 block">
                            {faq.question}
                          </span>
                        </div>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-zinc-200 bg-white text-zinc-600 transition-transform duration-200 ${
                            isOpen ? "rotate-180 bg-zinc-100 text-zinc-900" : ""
                          }`}
                        >
                          <svg
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/40">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* Flagship Studio & Contact */}
        <section id="contact" className="bg-zinc-950 text-white p-7 sm:p-10 rounded-xl border border-zinc-800 space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-emerald-400 font-semibold block mb-1">
                Flagship &amp; Concept Space
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
                Wearthly Studio
              </h3>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center h-10 px-6 rounded bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              Shop Collections &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Location</p>
              <p className="text-sm font-bold text-white">Studio Showroom &amp; Archive</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Philippines • Customer support and community inquiries
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Concierge Hours</p>
              <p className="text-sm font-bold text-white">Monday to Saturday</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                9:00 AM – 6:00 PM PHT • Online support 24/7
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Direct Inquiries</p>
              <p className="text-sm font-bold text-white">Client Care &amp; Press</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                support@wearthly.ph
                <br />
                hello@wearthly.ph
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
