import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useCartStore } from "../store/cartStore";
import { useLocalePath, useLocale } from "../hooks/useLocalePath";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const locale = useLocale();
  const otherLocale = locale === "fr" ? "en" : "fr";

  // Reconstruit l'URL courante avec l'autre locale
  const otherLocalePath = location.pathname.replace(`/${locale}`, `/${otherLocale}`);

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;

  const isHomePage =
    location.pathname === `/${locale}` || location.pathname === `/${locale}/`;
  const isTransparent = isHomePage && !scrolled;

  const isActive = (path: string) =>
    location.pathname === lp(path) || location.pathname.startsWith(lp(path) + "/");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent ? "bg-transparent" : "bg-beige shadow-md"
    }`}>
      <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">

          {/* Conteneur gauche : Logo + Bouton Menu */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative">

            {/* Logo */}
            <Link to={lp("/")} className="flex items-center" onClick={handleLinkClick}>
              <img
                src={isTransparent ? "/assets/logo_t_poulettes_white.png" : "/assets/logo_t_poulettes.png"}
                alt="Les Poulettes"
                className={`h-16 sm:h-24 md:h-28 lg:h-40 w-auto max-w-[200px] sm:max-w-[240px] lg:max-w-[300px] block object-contain transition-transform duration-500 ease-in-out ${
                  scrolled ? "scale-90" : "scale-100"
                }`}
              />
            </Link>

            {/* Bouton Menu hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-1.5 sm:gap-2 focus:outline-none px-2 sm:px-3 py-2 rounded-lg transition"
              aria-label={menuOpen ? t("nav.aria_close") : t("nav.aria_open")}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  isTransparent ? "text-white" : "text-black"
                } group-hover:text-benin-jaune`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Menu déroulant */}
            <div
              id="mobile-menu"
              aria-hidden={!menuOpen}
              className={`bg-beige shadow-lg rounded-lg mt-2 p-4 absolute top-full left-0 w-64 z-50 transition-all duration-200 ease-out ${
                menuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex flex-col space-y-1">
                <Link
                  to={lp("/qui-sommes-nous")}
                  onClick={handleLinkClick}
                  className={`font-basecoat uppercase font-medium hover:text-benin-jaune px-4 py-3 rounded-lg transition text-base ${
                    isActive("/qui-sommes-nous") ? "text-benin-jaune bg-benin-jaune/10" : "text-black"
                  }`}
                >
                  {t("nav.about")}
                </Link>
                <Link
                  to={lp("/realisations")}
                  onClick={handleLinkClick}
                  className={`font-basecoat uppercase font-medium hover:text-benin-jaune px-4 py-3 rounded-lg transition text-base ${
                    isActive("/realisations") ? "text-benin-jaune bg-benin-jaune/10" : "text-black"
                  }`}
                >
                  {t("nav.shop")}
                </Link>
                <Link
                  to={lp("/commandes-personnalisees")}
                  onClick={handleLinkClick}
                  className={`font-basecoat uppercase font-medium hover:text-benin-jaune px-4 py-3 rounded-lg transition text-base ${
                    isActive("/commandes-personnalisees") ? "text-benin-jaune bg-benin-jaune/10" : "text-black"
                  }`}
                >
                  {t("nav.custom")}
                </Link>
                <Link
                  to={lp("/#ou-nous-trouver")}
                  onClick={handleLinkClick}
                  className="font-basecoat uppercase font-medium text-black hover:text-benin-jaune px-4 py-3 rounded-lg transition text-base"
                >
                  {t("nav.locations")}
                </Link>
                <Link
                  to={lp("/contact")}
                  onClick={handleLinkClick}
                  className={`font-basecoat uppercase font-medium hover:text-benin-jaune px-4 py-3 rounded-lg transition text-base ${
                    isActive("/contact") ? "text-benin-jaune bg-benin-jaune/10" : "text-black"
                  }`}
                >
                  {t("nav.contact")}
                </Link>

                {/* Sélecteur de langue */}
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <Link
                    to={otherLocalePath}
                    onClick={handleLinkClick}
                    className="font-basecoat text-sm text-gray-500 hover:text-benin-jaune px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span className="text-base">{otherLocale === "en" ? "🇬🇧" : "🇫🇷"}</span>
                    {otherLocale === "en" ? "English" : "Français"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to={lp("/realisations")}
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm lg:text-lg ${
                isActive("/realisations") ? "text-benin-jaune" : isTransparent ? "text-white" : "text-black"
              }`}
            >
              {t("nav.shop")}
            </Link>
            <Link
              to={lp("/actualites")}
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm lg:text-lg ${
                isActive("/actualites") ? "text-benin-jaune" : isTransparent ? "text-white" : "text-black"
              }`}
            >
              {t("nav.news")}
            </Link>
            <Link
              to={lp("/contact")}
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm lg:text-lg ${
                isActive("/contact") ? "text-benin-jaune" : isTransparent ? "text-white" : "text-black"
              }`}
            >
              {t("nav.contact")}
            </Link>

            {/* Sélecteur de langue — Desktop */}
            <Link
              to={otherLocalePath}
              className={`font-basecoat font-semibold uppercase tracking-wide hover:text-benin-jaune transition-colors duration-300 text-sm lg:text-base ${
                isTransparent ? "text-white/70" : "text-gray-400"
              }`}
              title={otherLocale === "en" ? "Switch to English" : "Passer en français"}
            >
              {otherLocale.toUpperCase()}
            </Link>

            <Link
              to={lp("/panier")}
              className="relative font-basecoat inline-flex items-center gap-2 border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-base lg:text-lg"
              aria-label={t("nav.cart_label")}
            >
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              {totalItems > 0 && (
                <span key={totalItems} className="absolute -top-2 -right-2 bg-benin-rouge text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Bouton Panier - Mobile uniquement */}
          <Link
            to={lp("/panier")}
            className="relative md:hidden font-basecoat inline-flex items-center gap-2 border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-4 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-base"
            aria-label={t("nav.cart_label")}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span key={totalItems} className="absolute -top-2 -right-2 bg-benin-rouge text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
