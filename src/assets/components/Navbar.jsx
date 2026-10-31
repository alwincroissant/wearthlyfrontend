import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";

export const Navbar = ({ currentPage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const activePage =
    currentPage ||
    (location.pathname === "/"
      ? "home"
      : location.pathname.startsWith("/shop")
      ? "shop"
      : location.pathname.startsWith("/orders")
      ? "orders"
      : location.pathname.startsWith("/cart")
      ? "cart"
      : location.pathname.startsWith("/about")
      ? "about"
      : "");

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const cartCount = cartItems?.length || 0;


  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "JD";
  const profileTab = location.pathname.startsWith("/profile")
    ? location.pathname.split("/")[2] || "personal-info"
    : null;

  // Pages whose first section is a dark full-bleed hero. The bar blends into
  // the hero (dark, light text) at the top and turns into a flat translucent
  // light bar once the hero has scrolled past.
  const darkHeroPage = activePage === "home" || activePage === "about";
  const overDark = darkHeroPage && !isScrolled;

  // Dark-hero pages (home, about) place their hero directly under the bar, so
  // the bar goes fully transparent there and the hero shows through. Other
  // dark-hero pages keep a flat dark scrim so text stays legible.
  const headerTone = !overDark
    ? "bg-white/90 border-zinc-200"
    : activePage === "home" || activePage === "about"
    ? "bg-transparent border-transparent"
    : "bg-zinc-950/70 border-white/10";
  const subnavTone = !overDark
    ? "border-zinc-100 bg-zinc-50"
    : activePage === "home" || activePage === "about"
    ? "border-transparent bg-transparent"
    : "border-white/10 bg-zinc-950/70";

  const navIdle = overDark
    ? "text-white/75 hover:text-white hover:bg-white/10"
    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50";
  const navActive = overDark
    ? "bg-white/20 text-white font-semibold"
    : "bg-zinc-100 text-zinc-900 font-semibold";
  const chipIdle = overDark
    ? "border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900";
  const chipActive = overDark
    ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30 font-semibold"
    : "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold shadow-2xs";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Track how far the page hero has scrolled under the bar.
  useEffect(() => {
    const handleScroll = () => {
      const hero =
        document.querySelector("[data-nav-hero-end]") ||
        document.querySelector("main section");
      const navHeight = headerRef.current?.offsetHeight || 56;
      document.documentElement.style.setProperty("--nav-h", `${navHeight}px`);
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      setIsScrolled(heroBottom <= navHeight);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleNavClick = (subTab) => {
    setIsDropdownOpen(false);
    navigate(`/profile/${subTab}`);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await dispatch(logout());
    navigate("/");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      navigate("/shop");
      return;
    }
    navigate(`/shop?keyword=${encodeURIComponent(query)}`);
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-30 border-b transition-colors duration-300 ${headerTone}`}
    >
      <div className="relative max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand & Main Navigation */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 cursor-pointer focus:outline-none group"
          >
            <img
              src="/wearthlylogo.ico"
              alt="Wearthly"
              className="h-8 w-8 rounded-full object-cover transition-transform duration-150 group-hover:scale-105"
            />
            <span
              className={`whitespace-nowrap text-sm font-bold tracking-wider uppercase ${
                overDark ? "text-white" : "text-zinc-900"
              }`}
            >
              Wearthly
            </span>
          </Link>

          {/* Navigation Links (Profile moved to user dropdown as requested) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activePage === "home" ? navActive : navIdle
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activePage === "shop" ? navActive : navIdle
              }`}
            >
              Shop
            </Link>
            <Link
              to="/orders"
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activePage === "orders" ? navActive : navIdle
              }`}
            >
              My Orders
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activePage === "about" ? navActive : navIdle
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right Section: Cart Button & User Account Menu */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <form
            onSubmit={handleSearch}
            className={`flex shrink-0 items-center w-24 max-[400px]:w-20 sm:w-40 lg:w-48 xl:w-60 h-9 rounded-full border transition-colors ${
              overDark
                ? "border-white/25 bg-white/10 text-white focus-within:border-white/60 focus-within:bg-white/15"
                : "border-zinc-200 bg-white text-zinc-700 shadow-sm focus-within:border-emerald-500"
            }`}
            role="search"
          >
            <svg
              className={`ml-3.5 h-4 w-4 shrink-0 ${overDark ? "text-white/70" : "text-zinc-400"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search Wearthly products"
              className={`min-w-0 flex-1 bg-transparent px-2.5 text-xs outline-none placeholder:transition-colors ${
                overDark
                  ? "text-white placeholder:text-white/60"
                  : "text-zinc-900 placeholder:text-zinc-400"
              }`}
            />
            <button
              type="submit"
              className={`mr-1 rounded-full px-1.5 sm:px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                overDark
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Search
            </button>
          </form>

          {/* Cart Nav Button */}
          <Link
            to="/cart"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              currentPage === "cart" ? chipActive : chipIdle
            }`}
            title="Shopping Cart"
          >
            <svg
              className={`w-3.5 h-3.5 ${overDark ? "text-emerald-400" : "text-emerald-600"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${
                  overDark
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Store Management Quick Access (Admins Only) */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                currentPage === "admin" ? chipActive : chipIdle
              }`}
              title="Store Operations (Admin Dashboard)"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  overDark ? "bg-emerald-400" : "bg-emerald-600"
                }`}
              />
              <span>Operations</span>
            </Link>
          )}

          {isAuthenticated && user ? (
            /* User Account Menu with Avatar, Name & Separated Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                id="account-menu-button"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2.5 px-2 py-1 rounded-md transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 border border-transparent ${
                  overDark ? "hover:bg-white/10 hover:border-white/20" : "hover:bg-zinc-100/80 hover:border-zinc-200"
                }`}
                aria-expanded={isDropdownOpen}
                aria-controls={isDropdownOpen ? "account-menu" : undefined}
              >
                {/* Profile Picture / Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ring-1 overflow-hidden ${
                      overDark
                        ? "bg-white text-zinc-900 ring-white/40"
                        : "bg-zinc-900 text-white ring-zinc-300"
                    }`}
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="tracking-tighter">{initials}</span>
                    )}
                  </div>
                  {/* Active indicator dot placed outside circular photo, uncropped */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 z-10 pointer-events-none ${
                      overDark ? "ring-zinc-950" : "ring-white"
                    }`}
                  />
                </div>

                {/* User Name & Status */}
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold leading-tight ${
                        overDark ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {displayName}
                    </span>
                  </div>
                  <span
                    className={`block text-[10px] font-medium leading-none mt-0.5 ${
                      overDark ? "text-emerald-400" : "text-emerald-700"
                    }`}
                  >
                    {user.role === "admin" ? "Administrator" : "Customer"}
                  </span>
                </div>

                {/* Dropdown Chevron */}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen
                      ? overDark
                        ? "rotate-180 text-white"
                        : "rotate-180 text-zinc-700"
                      : overDark
                      ? "text-white/60"
                      : "text-zinc-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Account menu */}
              {isDropdownOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg animate-fadeIn"
                >
                  <div className="border-b border-emerald-100/80 bg-emerald-50/50 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-900 text-xs font-bold text-white ring-2 ring-emerald-200/70">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="tracking-tighter">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-zinc-900">
                          {displayName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-600">
                          {user.email}
                        </p>
                      </div>
                      {user.role === "admin" && (
                        <span className="shrink-0 rounded border border-emerald-200 bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-1.5">
                    {[
                      {
                        tab: "personal-info",
                        label: "Personal profile",
                        icon: (
                          <>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </>
                        ),
                      },
                      {
                        tab: "address",
                        label: "Delivery addresses",
                        icon: (
                          <>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </>
                        ),
                      },
                    ].map((item) => {
                      const isActive = profileTab === item.tab;
                      return (
                        <button
                          key={item.tab}
                          type="button"
                          onClick={() => handleNavClick(item.tab)}
                          className={`group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700 ${
                            isActive
                              ? "bg-emerald-50 text-emerald-950"
                              : "text-zinc-700 hover:bg-emerald-50/60 hover:text-emerald-950"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ring-inset transition-colors ${
                              isActive
                                ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-100 group-hover:bg-emerald-100/80"
                            }`}
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              {item.icon}
                            </svg>
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {isActive && (
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}

                    {user?.role === "admin" && (
                      <>
                        <div className="my-1.5 border-t border-zinc-100" />
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-zinc-700 transition-colors cursor-pointer hover:bg-emerald-50 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-700"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-700 text-white ring-1 ring-inset ring-emerald-800/20">
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                            </svg>
                          </span>
                          <span className="flex-1">Store management</span>
                          <svg
                            className="h-4 w-4 shrink-0 text-emerald-600/70 group-hover:text-emerald-700"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 bg-zinc-50/50 p-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-zinc-600 transition-colors cursor-pointer hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-600"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-zinc-500 ring-1 ring-inset ring-zinc-200 transition-colors group-hover:bg-red-50 group-hover:text-red-600 group-hover:ring-red-200">
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      </span>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Signed-out state: login / register links */
            <div className="flex items-center gap-2">
              <Link
                to="/register"
                className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  overDark ? "text-white/75 hover:text-white" : "text-zinc-700 hover:text-zinc-900"
                }`}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-1.5 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div
        className={`md:hidden border-t px-4 py-2 flex items-center justify-between text-xs font-medium overflow-x-auto gap-2 ${subnavTone}`}
      >
        <Link
          to="/"
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activePage === "home"
              ? overDark
                ? "bg-white/20 text-white font-semibold"
                : "bg-white text-zinc-900 font-semibold shadow-xs"
              : overDark
              ? "text-white/70"
              : "text-zinc-600"
          }`}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activePage === "shop"
              ? overDark
                ? "bg-white/20 text-white font-semibold"
                : "bg-white text-zinc-900 font-semibold shadow-xs"
              : overDark
              ? "text-white/70"
              : "text-zinc-600"
          }`}
        >
          Shop
        </Link>
        <Link
          to="/cart"
          className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
            activePage === "cart"
              ? overDark
                ? "bg-white/20 text-white font-semibold"
                : "bg-white text-zinc-900 font-semibold shadow-xs"
              : overDark
              ? "text-white/70"
              : "text-zinc-600"
          }`}
        >
          <span>Cart</span>
          {cartCount > 0 && (
            <span
              className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                overDark ? "bg-emerald-500/20 text-emerald-200" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {cartCount}
            </span>
          )}
        </Link>
        <Link
          to="/orders"
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activePage === "orders"
              ? overDark
                ? "bg-white/20 text-white font-semibold"
                : "bg-white text-zinc-900 font-semibold shadow-xs"
              : overDark
              ? "text-white/70"
              : "text-zinc-600"
          }`}
        >
          My Orders
        </Link>
        <Link
          to="/about"
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activePage === "about"
              ? overDark
                ? "bg-white/20 text-white font-semibold"
                : "bg-white text-zinc-900 font-semibold shadow-xs"
              : overDark
              ? "text-white/70"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          About
        </Link>
      </div>
    </header>
  );
};
