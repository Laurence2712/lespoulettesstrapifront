import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/cartStore";
import { useLocalePath, useLocale } from "../hooks/useLocalePath";
import DarkModeToggle, { useDarkMode } from "./DarkModeToggle";
import BagIcon from "./BagIcon";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const locale = useLocale();
  const otherLocale = locale === "fr" ? "en" : "fr";
  const otherLocalePath = location.pathname.replace(`/${locale}`, `/${otherLocale}`);

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;
  const { dark } = useDarkMode();

  const isActive = (path: string) =>
    location.pathname === lp(path) || location.pathname.startsWith(lp(path) + "/");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      if (y > lastY && y > 80) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const navLinks = [
    { path: "/qui-sommes-nous",          label: t("nav.about") },
    { path: "/realisations",             label: t("nav.shop") },
    { path: "/commandes-personnalisees", label: t("nav.custom") },
    { path: "/actualites",               label: t("nav.news") },
    { path: "/contact",                  label: t("nav.contact") },
  ];

  const isHomepage = location.pathname === lp('/') || location.pathname === `/${locale}` || location.pathname === `/${locale}/`;
  const isTransparent = isHomepage && !scrolled && !menuOpen;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-beige/50 dark:bg-gray-950/50 backdrop-blur-sm' : 'bg-beige dark:bg-gray-950'} ${scrolled ? "shadow-md dark:shadow-gray-900" : ""} ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}>
        {/* Free shipping banner — tout en haut */}
        <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-center py-1.5 px-4">
          <p className="font-basecoat text-xs text-gray-900 dark:text-gray-100 font-semibold tracking-wide">
            Livraison gratuite dès 49 € d&apos;achat en Belgique
          </p>
        </div>
        <div className="px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="relative flex items-center justify-between h-16 sm:h-18 md:h-20">

            {/* LEFT: MENU + Search */}
            <div className="flex items-center gap-4 sm:gap-5 w-1/3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? t("nav.aria_close") : t("nav.aria_open")}
                aria-expanded={menuOpen}
                className="font-basecoat font-bold uppercase tracking-widest text-xs text-gray-900 dark:text-gray-100 hover:text-benin-jaune transition-colors duration-200 flex items-center gap-2"
              >
                {menuOpen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                Menu
              </button>

              <button
                onClick={() => { setMenuOpen(false); navigate(lp("/recherche")); }}
                aria-label="Rechercher"
                className="text-gray-900 dark:text-gray-100 hover:text-benin-jaune transition-colors duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>

            {/* CENTER: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to={lp("/")}>
                <img
                  src={dark ? "/assets/logo_t_poulettes_white.png" : "/assets/logo_t_poulettes.png"}
                  alt="Les Poulettes"
                  className="h-14 sm:h-16 md:h-44 w-auto object-contain"
                />
              </Link>
            </div>

            {/* RIGHT: Cart */}
            <div className="flex items-center justify-end gap-3 w-1/3">
              <Link
                to={lp("/panier")}
                className="relative text-gray-900 dark:text-gray-100 hover:text-benin-jaune transition-colors duration-200"
                aria-label={t("nav.cart_label")}
              >
                <BagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm pointer-events-none"
        style={{
          opacity: menuOpen ? 1 : 0,
          transition: menuOpen ? 'opacity 400ms ease' : 'opacity 250ms ease',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Left drawer */}
      <div
        className="fixed top-0 left-0 h-full z-50 w-[85vw] sm:w-[420px] bg-beige dark:bg-gray-950 flex flex-col"
        style={{
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: menuOpen
            ? 'transform 480ms cubic-bezier(0.32, 0.72, 0, 1)'
            : 'transform 360ms cubic-bezier(0.32, 0.72, 0, 1)',
          boxShadow: menuOpen ? '8px 0 40px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        {/* Header: logo + close */}
        <div
          className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-gray-800"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
            transition: menuOpen ? 'opacity 300ms ease 200ms, transform 300ms ease 200ms' : 'none',
          }}
        >
          <Link to={lp("/")} onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/lespoulettesfav.svg"
              alt="Les Poulettes"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-900 dark:text-gray-100 hover:text-benin-jaune transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto">
          {[...navLinks, { path: "/#ou-nous-trouver", label: t("nav.locations") }].map(({ path, label }, i) => (
            <Link
              key={path}
              to={lp(path)}
              onClick={() => setMenuOpen(false)}
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                transition: menuOpen
                  ? `opacity 350ms ease ${260 + i * 55}ms, transform 350ms cubic-bezier(0.32,0.72,0,1) ${260 + i * 55}ms`
                  : 'none',
              }}
              className={`font-basecoat font-bold uppercase tracking-wider text-sm sm:text-base block px-6 sm:px-8 py-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200 hover:text-benin-jaune ${
                isActive(path) ? "text-benin-jaune" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom: language + dark mode */}
        <div
          className="flex items-center gap-4 px-6 sm:px-8 py-5 border-t border-gray-100 dark:border-gray-800"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
            transition: menuOpen ? 'opacity 300ms ease 500ms, transform 300ms ease 500ms' : 'none',
          }}
        >
          <Link
            to={otherLocalePath}
            onClick={() => setMenuOpen(false)}
            className="font-basecoat text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 hover:text-benin-jaune transition-colors flex items-center gap-2"
          >
            <span>{otherLocale === "en" ? "🇬🇧" : "🇫🇷"}</span>
            {otherLocale === "en" ? "English" : "Français"}
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </>
  );
}
