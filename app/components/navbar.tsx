import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/cartStore";
import { useLocalePath, useLocale } from "../hooks/useLocalePath";
import DarkModeToggle, { useDarkMode } from "./DarkModeToggle";

const BagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1C15.159 1 17.53 3.734 17.938 7H21.5A.5.5 0 0 1 22 7.5V17.914C22 18.616 21.75 19.3 21.178 19.705 19.929 20.592 17.138 22 12 22S4.071 20.592 2.822 19.705C2.25 19.3 2 18.615 2 17.915V7.5A.5.5 0 0 1 2.5 7H6.063C6.47 3.734 8.84 1 12 1M12 3C11.334 3 10.609 3.406 10.004 4.313 9.543 5.004 9.199 5.933 9.064 7H14.936C14.8 5.932 14.457 5.004 13.997 4.313 13.39 3.406 12.666 3 12 3" />
  </svg>
);

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setSearchOpen(false); }
    };
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

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 bg-beige dark:bg-gray-950 transition-shadow duration-300 ${scrolled ? "shadow-md dark:shadow-gray-900" : ""}`}>
        <div className="px-4 sm:px-6 md:px-10">
          <div className="relative flex items-center justify-between h-16 sm:h-18 md:h-20">

            {/* LEFT: MENU + Search */}
            <div className="flex items-center gap-4 sm:gap-5 w-1/3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? t("nav.aria_close") : t("nav.aria_open")}
                aria-expanded={menuOpen}
                className="font-basecoat font-bold uppercase tracking-widest text-xs sm:text-sm text-gray-900 dark:text-gray-100 hover:text-benin-jaune transition-colors duration-200 flex items-center gap-2"
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
                onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
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
                  className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
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

      {/* Search bar drop-down */}
      <div
        className={`fixed top-16 md:top-20 left-0 w-full z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
          searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-6 md:px-10 py-4 flex items-center gap-4">
          <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            autoFocus={searchOpen}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Saisir un mot pour rechercher"
            className="flex-1 bg-transparent font-basecoat text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
          />
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Fermer la recherche"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          menuOpen ? "backdrop-blur-sm bg-black/30 pointer-events-auto" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Left drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 w-[85vw] sm:w-[420px] bg-beige dark:bg-gray-950 flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: logo + close */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-gray-800">
          <Link to={lp("/")} onClick={() => setMenuOpen(false)}>
            <img
              src={dark ? "/assets/logo_t_poulettes_white.png" : "/assets/logo_t_poulettes.png"}
              alt="Les Poulettes"
              className="h-10 sm:h-12 w-auto object-contain"
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
          {[...navLinks, { path: "/#ou-nous-trouver", label: t("nav.locations") }].map(({ path, label }) => (
            <Link
              key={path}
              to={lp(path)}
              onClick={() => setMenuOpen(false)}
              className={`font-basecoat font-bold uppercase tracking-wider text-base sm:text-lg block px-6 sm:px-8 py-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200 hover:text-benin-jaune ${
                isActive(path) ? "text-benin-jaune" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom: language + dark mode */}
        <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-t border-gray-100 dark:border-gray-800">
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
