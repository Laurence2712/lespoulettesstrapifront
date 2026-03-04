import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/cartStore";
import { useLocalePath, useLocale } from "../hooks/useLocalePath";
import DarkModeToggle from "./DarkModeToggle";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const locale = useLocale();
  const otherLocale = locale === "fr" ? "en" : "fr";

  const otherLocalePath = location.pathname.replace(`/${locale}`, `/${otherLocale}`);

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;

  const isHomePage =
    location.pathname === `/${locale}` || location.pathname === `/${locale}/`;
  const isTransparent = isHomePage && !scrolled;

  const isActive = (path: string) =>
    location.pathname === lp(path) || location.pathname.startsWith(lp(path) + "/");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Trigger Command Palette from anywhere
  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent ? "bg-transparent" : "bg-beige dark:bg-gray-950 shadow-md dark:shadow-gray-900"
    }`}>
      <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">

          {/* Left: Logo + hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative">

            <Link to={lp("/")} className="flex items-center">
              <img
                src={isTransparent ? "/assets/logo_t_poulettes_white.png" : "/assets/logo_t_poulettes.png"}
                alt="Les Poulettes"
                className={`h-16 sm:h-24 md:h-28 lg:h-40 w-auto max-w-[200px] sm:max-w-[240px] lg:max-w-[300px] block object-contain transition-transform duration-500 ease-in-out ${
                  scrolled ? "scale-90" : "scale-100"
                }`}
              />
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-1.5 sm:gap-2 focus:outline-none px-2 sm:px-3 py-2 rounded-lg transition"
              aria-label={menuOpen ? t("nav.aria_close") : t("nav.aria_open")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  isTransparent ? "text-white" : "text-black dark:text-gray-100"
                } group-hover:text-benin-jaune`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Dropdown menu */}
            <div
              id="mobile-menu"
              aria-hidden={!menuOpen}
              className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-xl rounded-2xl mt-2 p-3 absolute top-full left-0 w-64 z-50 transition-all duration-200 ease-out ${
                menuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto animate-slide-down"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex flex-col space-y-0.5">
                {[
                  { path: "/qui-sommes-nous", label: t("nav.about") },
                  { path: "/realisations",    label: t("nav.shop") },
                  { path: "/commandes-personnalisees", label: t("nav.custom") },
                  { path: "/contact",         label: t("nav.contact") },
                ].map(({ path, label }) => (
                  <Link
                    key={path}
                    to={lp(path)}
                    onClick={() => setMenuOpen(false)}
                    className={`font-basecoat uppercase font-semibold hover:text-benin-jaune px-4 py-3 rounded-xl transition text-sm ${
                      isActive(path)
                        ? "text-benin-jaune bg-benin-jaune/10"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <Link
                  to={lp("/#ou-nous-trouver")}
                  onClick={() => setMenuOpen(false)}
                  className="font-basecoat uppercase font-semibold text-gray-800 dark:text-gray-200 hover:text-benin-jaune px-4 py-3 rounded-xl transition text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {t("nav.locations")}
                </Link>

                {/* Search shortcut in mobile menu */}
                <button
                  onClick={() => { setMenuOpen(false); openSearch(); }}
                  className="w-full text-left font-basecoat uppercase font-semibold text-gray-800 dark:text-gray-200 hover:text-benin-jaune px-4 py-3 rounded-xl transition text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Rechercher
                </button>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-1 flex items-center justify-between px-2">
                  <Link
                    to={otherLocalePath}
                    onClick={() => setMenuOpen(false)}
                    className="font-basecoat text-sm text-gray-500 dark:text-gray-400 hover:text-benin-jaune px-2 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span className="text-base">{otherLocale === "en" ? "🇬🇧" : "🇫🇷"}</span>
                    {otherLocale === "en" ? "English" : "Français"}
                  </Link>
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3 lg:gap-5">
            {[
              { path: "/realisations", label: t("nav.shop") },
              { path: "/actualites",   label: t("nav.news") },
              { path: "/contact",      label: t("nav.contact") },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={lp(path)}
                className={`font-basecoat font-bold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm lg:text-base ${
                  isActive(path) ? "text-benin-jaune" : isTransparent ? "text-white" : "text-black dark:text-gray-100"
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Search button */}
            <button
              onClick={openSearch}
              aria-label="Rechercher (Ctrl+K)"
              title="Rechercher (Ctrl+K)"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors duration-200 font-basecoat text-xs font-semibold
                ${isTransparent
                  ? "border-white/30 text-white/70 hover:border-white/60 hover:text-white hover:bg-white/10"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-benin-jaune/50 hover:text-benin-jaune dark:hover:border-benin-jaune/40"
                }
              `}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <kbd className="hidden lg:inline opacity-60">Ctrl+K</kbd>
            </button>

            {/* Dark mode toggle */}
            <DarkModeToggle transparent={isTransparent} />

            {/* Language */}
            <Link
              to={otherLocalePath}
              className={`font-basecoat font-semibold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm ${
                isTransparent ? "text-white/70" : "text-gray-400 dark:text-gray-500"
              }`}
              title={otherLocale === "en" ? "Switch to English" : "Passer en français"}
            >
              {otherLocale.toUpperCase()}
            </Link>

            {/* Cart */}
            <Link
              to={lp("/panier")}
              className="relative font-basecoat inline-flex items-center gap-2 border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 text-sm lg:text-base"
              aria-label={t("nav.cart_label")}
            >
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              {totalItems > 0 && (
                <span
                  key={totalItems}
                  className="absolute -top-2 -right-2 bg-benin-rouge text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-badge-pop"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart only */}
          <Link
            to={lp("/panier")}
            className="relative md:hidden font-basecoat inline-flex items-center gap-2 border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black px-4 py-2.5 rounded-xl font-semibold transition hover:scale-105 text-base"
            aria-label={t("nav.cart_label")}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="absolute -top-2 -right-2 bg-benin-rouge text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-badge-pop"
              >
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
