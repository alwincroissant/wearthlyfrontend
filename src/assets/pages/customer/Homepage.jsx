import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Rating,
  CircularProgress,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ScrollReveal } from "../../components/ScrollReveal";
import { ProductImagePlaceholder } from "../../components/ProductImagePlaceholder";
import { getProducts } from "../../../actions/productActions";
import { addToCart } from "../../../actions/cartActions";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API;

const brandStorySteps = [
  {
    title: "Find your everyday fit",
    desc: "Explore thoughtfully made pieces designed for office days, campus life, weekends, and everything in between.",
  },
  {
    title: "Wear what feels right",
    desc: "Discover comfortable silhouettes, mindful materials, and easy pieces that belong in your everyday rotation.",
  },
  {
    title: "Feel good doing good",
    desc: "Every Wearthly piece is part of a more thoughtful approach to fashion and a kinder relationship with the planet.",
  },
];

export const Homepage = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [carouselIndex, setCarouselIndex] = useState(0);

  const { cartItems = [] } = useSelector((state) => state.cart || {});

  // Infinite Scroll State
  const [infiniteProducts, setInfiniteProducts] = useState([]);
  const [infinitePage, setInfinitePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCatalogCount, setTotalCatalogCount] = useState(0);

  // Timeline reveal once when scrolled into view
  const financeTimelineRef = useRef(null);
  const [financeTimelineIn, setFinanceTimelineIn] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window)
  );

  useEffect(() => {
    const node = financeTimelineRef.current;
    if (
      !node ||
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFinanceTimelineIn(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Live products via Redux
  const { loading, products = [] } = useSelector(
    (state) => state.products || {}
  );

  // Fetch featured catalog pieces
  useEffect(() => {
    dispatch(
      getProducts(
        1,
        "",
        [0, 9999999],
        "",
        "",
        false,
        0,
        12,
        false,
        true
      )
    );
  }, [dispatch]);

  // Initial fetch for Infinite Scroll catalog
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${API}/products?page=1&limit=8`);
        if (isMounted && res.data) {
          const fetched = res.data.products || [];
          setInfiniteProducts(fetched);
          setTotalCatalogCount(res.data.productsCount || 0);
          setInfinitePage(1);
          setHasMore(fetched.length < (res.data.productsCount || 0));
        }
      } catch (err) {
        console.error("Failed to load catalog products", err);
      }
    };
    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch next page function for react-infinite-scroll-component
  const fetchMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = infinitePage + 1;
    try {
      const res = await axios.get(`${API}/products?page=${nextPage}&limit=8`);
      if (res.data) {
        const newItems = res.data.products || [];
        setInfiniteProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const filtered = newItems.filter((p) => !existingIds.has(p._id));
          const updated = [...prev, ...filtered];
          if (updated.length >= (res.data.productsCount || 0) || newItems.length === 0) {
            setHasMore(false);
          }
          return updated;
        });
        setInfinitePage(nextPage);
      }
    } catch (err) {
      console.error("Failed to fetch more products", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToCart = async (product) => {
    const inCart = (cartItems || [])
      .filter((i) => i.productId === product._id)
      .reduce((sum, i) => sum + (i.quantity || 1), 0);

    if (inCart >= product.stock) {
      toast.warning(
        `Quantity limit reached! You already have all ${product.stock} units of "${product.name}" in your bag.`
      );
      return;
    }

    const result = await dispatch(addToCart(product._id, 1));
    if (result && result.success === false) {
      toast.warning(result.message || `Cannot add "${product.name}": Stock limit reached!`);
    } else {
      toast.success(`Added "${product.name}" to bag!`);
    }
  };

  const featuredUnits = useMemo(() => {
    const featured = products.filter((p) => p.isFeatured && !p.isArchived);
    if (featured.length > 0) return featured;
    return products.filter((p) => !p.isArchived).slice(0, 8);
  }, [products]);

  useEffect(() => {
    if (featuredUnits.length > 0 && carouselIndex >= featuredUnits.length) {
      const timer = setTimeout(() => {
        setCarouselIndex(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [featuredUnits.length, carouselIndex]);

  const goToSlide = (index) => {
    const len = featuredUnits.length;
    if (len === 0) return;
    setCarouselIndex(((index % len) + len) % len);
  };

  const handleNavigate = (path, paramString = "") => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
    } else {
      navigate(paramString ? `/${path}?${paramString}` : `/${path}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. EDITORIAL HIGH-FASHION HERO BANNER */}
      <section
        style={{ marginTop: "calc(-1 * var(--nav-h, 56px))" }}
        className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center bg-zinc-950 overflow-hidden"
      >
        {/* Full-bleed Wearthly campaign video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-video-poster.jpg"
            aria-label="Wearthly fashion campaign"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
          >
            <source src="/mainrecordinghomepage.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Minimalist scrim for high-contrast typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/45 to-zinc-950/65" />

        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center anim-stagger">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold text-white leading-[0.95] mb-8 font-display text-balance">
              Comfort, Reimagined.
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleNavigate("shop")}
                className="h-11 px-7 rounded bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 text-xs font-extrabold uppercase tracking-[0.18em] transition-colors cursor-pointer flex items-center justify-center gap-2 btn-motion shadow-lg"
              >
                <span>Explore the collection</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <Link
                to="/about"
                className="h-11 px-6 rounded bg-transparent hover:bg-white/10 active:bg-white/20 border border-white/30 hover:border-white text-white text-xs font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer flex items-center justify-center gap-2 btn-motion"
              >
                <span>See the Wearthly Story</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MINIMALIST BRAND VALUE TICKER */}
      <section className="bg-zinc-950 border-b border-zinc-800/80 py-4 overflow-hidden relative select-none">
        <div className="marquee-track flex items-center gap-12 sm:gap-16">
          {[
            "COMFORT, REIMAGINED",
            "CLEAR PRICES",
            "MINDFUL MATERIALS",
            "EVERYDAY SILHOUETTES",
            "MADE TO BE LIVED IN",
            "KIND TO THE PLANET",
            "WEARTHLY SUPPORT",
            "COMFORT, REIMAGINED",
            "CLEAR PRICES",
            "MINDFUL MATERIALS",
            "EVERYDAY SILHOUETTES",
            "MADE TO BE LIVED IN",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 shrink-0">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-300 font-semibold">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CATALOG SPOTLIGHT CAROUSEL */}
      <ScrollReveal threshold={0.08} duration={400}>
        <section className="w-full bg-white py-14 sm:py-18 border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-zinc-900 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-800 font-bold block mb-1">
                  Spotlight Drops
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-900 font-display">
                  Featured Pieces
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-zinc-500 font-mono">
                  {featuredUnits.length} Featured Piece{featuredUnits.length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => handleNavigate("shop")}
                  className="font-bold text-zinc-900 hover:text-emerald-700 tracking-wider uppercase text-[11px] cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex justify-center">
                <CircularProgress size={32} sx={{ color: "#18181b" }} />
              </div>
            ) : featuredUnits.length > 0 ? (
              <FeaturedProductCarousel
                units={featuredUnits}
                activeIndex={carouselIndex}
                onGoTo={goToSlide}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div className="py-12 text-center text-xs text-zinc-500 border border-zinc-200 rounded-lg bg-zinc-50">
                No featured pieces match your filter.
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* 5. RIDER STORIES */}
      <ScrollReveal threshold={0.08} duration={400}>
        <section id="lookbook" className="w-full bg-zinc-950 text-white py-16 sm:py-24 border-b border-zinc-800 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Big Editorial Visual */}
              <div className="lg:col-span-7">
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-zinc-900 shadow-2xl">
                  <img
                    src="/model1.jpg"
                    alt="Wearthly model"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-zinc-300">
                    <span>Model 01 // Wearthly Archive</span>
                    <span>Wearthly 2026</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Manifesto & Mini-Gallery */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-semibold block mb-2">
                    The Wearthly Journal • Vol. 01
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight font-display">
                    Keep moving. Stay grounded.
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                  Wearthly is a place for considered style: comfortable pieces
                  that fit your rhythm, materials with a lighter footprint, and
                  a buying experience that feels clear and welcoming.
                </p>

                {/* 3 Aesthetic Thumbnail Gallery */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src="/model1.jpg"
                      alt="Wearthly model story 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src="/model2.jpg"
                      alt="Wearthly model story 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src="/model3.jpg"
                      alt="Wearthly model story 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>Read the Wearthly story</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. LIVE SHOP CATALOG WITH INFINITE SCROLL */}
      <ScrollReveal threshold={0.08} duration={400}>
        <section className="w-full bg-white py-16 sm:py-20 border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-zinc-900">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-800 font-bold block mb-1">
                  Everyday Collection
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-900 font-display">
                  Shop the Wearthly collection
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  label={`Showing ${infiniteProducts.length} of ${totalCatalogCount || infiniteProducts.length} Items`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    borderColor: "#18181b",
                    color: "#18181b",
                  }}
                />
              </div>
            </div>

            {/* Infinite Scroll Container */}
            <InfiniteScroll
              dataLength={infiniteProducts.length}
              next={fetchMoreProducts}
              hasMore={hasMore}
              loader={
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6, gap: 1.5 }}>
                  <CircularProgress size={24} sx={{ color: "#18181b" }} />
                  <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#52525b", fontWeight: 500 }}>
                    Loading more pieces...
                  </Typography>
                </Box>
              }
              endMessage={
                <Box sx={{ textAlign: "center", py: 5, color: "#71717a", fontSize: "0.8rem", borderTop: "1px dashed #e4e4e7", mt: 6 }}>
                  <p className="font-bold text-zinc-800 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs">
                    <span>You've reached the end of the collection</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">All catalog items loaded</p>
                </Box>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {infiniteProducts.map((p) => {
                  const hasImage = p.images && p.images.length > 0 && p.images[0]?.url;
                  const rating = Number(p.ratings) || 0;
                  const reviewCount = Number(p.numOfReviews) || 0;

                  return (
                    <div
                      key={p._id}
                      className="group flex flex-col justify-between bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-zinc-950 transition-all duration-200 hover:shadow-md"
                    >
                      <Link to={`/product/${p._id}`} className="block overflow-hidden relative aspect-[3/4] bg-zinc-100">
                        {hasImage ? (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <ProductImagePlaceholder
                            name={p.name}
                          />
                        )}

                        {/* Top Stock Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shadow-2xs ${
                              p.stock === 0
                                ? "bg-red-50 text-red-700 border-red-200"
                                : p.stock <= 3
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-white/90 text-zinc-800 border-zinc-200"
                            }`}
                          >
                            {p.stock === 0 ? "Sold Out" : p.stock <= 3 ? "Low Stock" : "In Stock"}
                          </span>
                        </div>
                      </Link>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <Link
                            to={`/product/${p._id}`}
                            className="block text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                          >
                            {p.name}
                          </Link>

                          {/* MUI Rating */}
                          <div className="flex items-center gap-1 pt-0.5">
                            <Rating
                              value={rating}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ fontSize: "0.75rem" }}
                            />
                            <span className="text-[10px] font-semibold text-zinc-600">
                              {rating > 0 ? rating.toFixed(1) : "New"}
                            </span>
                            {reviewCount > 0 && (
                              <span className="text-[10px] text-zinc-400">
                                ({reviewCount})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-zinc-950 font-mono">
                            ₱{Number(p.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            type="button"
                            disabled={p.stock === 0}
                            onClick={() => handleAddToCart(p)}
                            className="px-3 py-1 rounded bg-zinc-950 hover:bg-zinc-800 active:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            {p.stock === 0 ? "Out" : "+ Bag"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. HOW IT WORKS: THE ORDERING & DELIVERY TIMELINE */}
      <ScrollReveal threshold={0.08} duration={400}>
        <section className="w-full bg-[#FAF9F6] py-16 sm:py-20 border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="max-w-2xl space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-800 font-bold block">
                Seamless Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950 font-display">
                How Ordering Works
              </h2>
            </div>

            <div
              ref={financeTimelineRef}
              className={`timeline max-w-2xl ${financeTimelineIn ? "is-in" : ""}`}
            >
              {brandStorySteps.map((step, i) => (
                <div
                  key={step.title}
                  className="timeline__step relative flex gap-5 pb-8 last:pb-0"
                >
                  <span
                    className="timeline__node relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white font-mono font-bold text-sm leading-none shadow-sm"
                  >
                    0{i + 1}
                  </span>
                  {i < brandStorySteps.length - 1 && (
                    <span
                      className="timeline__connector absolute top-10 bottom-0 left-5 w-0.5 bg-zinc-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-zinc-950 tracking-wide uppercase">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-md text-xs text-zinc-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-200 text-xs">
              <div className="flex items-center gap-2 text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>
                  Complimentary nationwide shipping automatically applied on all orders above ₱2,500.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate("orders") : navigate("/orders")}
                className="h-9 px-4 rounded bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
              >
                Track Orders &rarr;
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

    </div>
  );
};

const productMeta = (item) => {
  const hasImage = Boolean(item.images?.[0]?.url);
  const rating = Number(item.ratings) || 0;
  const reviewCount = Number(item.numOfReviews) || 0;
  return { hasImage, rating, reviewCount };
};

const ProductSpotlightImage = ({ item, active = false }) => {
  const { hasImage } = productMeta(item);

  if (hasImage) {
    return (
      <div className="w-full h-64 sm:h-80 lg:h-96 bg-zinc-50 flex items-center justify-center overflow-hidden rounded-xl">
        <img
          src={item.images[0].url}
          alt={item.name}
          className={`max-h-full max-w-full object-contain object-center transition-transform duration-300 ${
            active ? "home-spotlight__hero-img scale-100" : "scale-95 opacity-80"
          }`}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-80 lg:h-96 bg-zinc-50 flex items-center justify-center overflow-hidden rounded-xl">
      <ProductImagePlaceholder
        name={item.name}
        compact
        className="h-full"
      />
    </div>
  );
};

const FeaturedProductCarousel = ({
  units,
  activeIndex,
  onGoTo,
  onAddToCart,
}) => {
  const canNavigate = units.length > 1;
  const slides = useMemo(() => {
    if (units.length < 2) return units;
    return [units[units.length - 1], ...units, units[0]];
  }, [units]);

  const [visualIndex, setVisualIndex] = useState(canNavigate ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    animatingRef.current = false;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setVisualIndex(units.length > 1 ? 1 : 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [units]);

  const go = (direction) => {
    if (!canNavigate || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setVisualIndex((current) => current + direction);
    onGoTo(activeIndex + direction);
  };

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (!canNavigate) {
      animatingRef.current = false;
      setIsAnimating(false);
      return;
    }

    if (visualIndex === 0) {
      setIsAnimating(false);
      setVisualIndex(units.length);
    } else if (visualIndex === units.length + 1) {
      setIsAnimating(false);
      setVisualIndex(1);
    } else {
      setIsAnimating(false);
    }
    animatingRef.current = false;
  };

  const current = units[activeIndex] || units[0];
  const { rating, reviewCount } = productMeta(current);
  const roundedRating = Math.round(rating);

  return (
    <div className="relative pb-10 pt-2 sm:pt-4">
      <div
        className="home-spotlight__viewport"
        style={{ "--visual-index": visualIndex }}
      >
        <div
          className={`home-spotlight__track ${isAnimating ? "is-animating" : ""}`}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, index) => {
            const isActive = index === visualIndex;
            const slideKey = `${item._id}-${index}`;

            return (
              <div
                key={slideKey}
                className={`home-spotlight__slide ${isActive ? "is-active" : ""}`}
              >
                <div className="home-spotlight__slide-inner flex flex-col items-center">
                  {isActive ? (
                    <Link
                      to={`/product/${item._id}`}
                      className="block w-full group"
                      aria-label={`View ${item.name}`}
                    >
                      <ProductSpotlightImage item={item} active />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="block w-full bg-transparent border-0 p-0 cursor-pointer"
                      onClick={() => go(index > visualIndex ? 1 : -1)}
                      aria-label={`Show ${item.name}`}
                    >
                      <ProductSpotlightImage item={item} />
                    </button>
                  )}
                  <span
                    className={`mt-3 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase line-clamp-1 ${
                      isActive ? "text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {canNavigate && (
        <>
          <button
            type="button"
            className="home-spotlight__nav absolute left-3 sm:left-6 md:left-[22%] top-[34%] sm:top-[38%] z-10 bg-white/90 shadow-md p-2 rounded-full border border-zinc-200 hover:bg-white cursor-pointer"
            onClick={() => go(-1)}
            aria-label="Previous piece"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5L8 12L15 19"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="home-spotlight__nav absolute right-3 sm:right-6 md:right-[22%] top-[34%] sm:top-[38%] z-10 bg-white/90 shadow-md p-2 rounded-full border border-zinc-200 hover:bg-white cursor-pointer"
            onClick={() => go(1)}
            aria-label="Next piece"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      <div className="max-w-xl mx-auto px-4 mt-6 flex flex-col items-center text-center gap-3">
        <Link
          to={`/product/${current._id}`}
          className="text-lg sm:text-xl font-extrabold tracking-[0.16em] uppercase text-zinc-900 hover:text-emerald-700 transition-colors"
        >
          {current.name}
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-zinc-600">
          <span className="text-lg font-bold text-zinc-950 font-mono tracking-tight">
            ₱
            {Number(current.price).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
          {rating > 0 && (
            <span className="inline-flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < roundedRating ? "text-amber-500 fill-amber-500" : "text-zinc-200 fill-zinc-200"}`}
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-zinc-500">
                {rating.toFixed(1)}
                {reviewCount > 0 ? ` (${reviewCount})` : ""}
              </span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
              current.stock === 0
                ? "bg-red-50 text-red-800 border-red-200"
                : current.stock <= 3
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                current.stock === 0 ? "bg-red-600" : "bg-emerald-700"
              }`}
            />
            {current.stock === 0 ? "Sold Out" : `${current.stock} available`}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to={`/product/${current._id}`}
            className="inline-flex items-center justify-center min-w-[14rem] !h-10 px-6 rounded bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white text-[11px] font-bold tracking-[0.14em] uppercase transition-colors"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={current.stock === 0}
            onClick={() => onAddToCart(current)}
            className="inline-flex items-center justify-center min-w-[10rem] !h-10 px-5 rounded border border-zinc-300 bg-white hover:bg-zinc-50 active:bg-zinc-100 disabled:bg-zinc-100 disabled:text-zinc-400 text-zinc-900 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer"
          >
            + Add To Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
