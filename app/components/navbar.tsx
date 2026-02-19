import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "../store/cartStore";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;

  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Avoid hydration mismatch: only render client-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Fermer le menu quand on clique sur un lien
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-beige shadow-md'
    }`}>
      <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">

          {/* Conteneur gauche : Logo + Bouton Menu */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative">

            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <img
                src={isTransparent ? "/assets/logo_t_poulettes_white.png" : "/assets/logo_t_poulettes.png"}
                alt="Les Poulettes"
                className={`h-12 sm:h-14 md:h-20 w-auto transition-transform duration-500 ease-in-out transform ${
                  scrolled ? 'scale-90' : 'scale-100'
                }`}
              />
            </Link>

            {/* Bouton Menu hamburger — masqué sur desktop */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden group flex items-center gap-1.5 sm:gap-2 focus:outline-none px-2 sm:px-3 py-2 rounded-lg transition`}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className={`w-6 h-6 transition-colors duration-300 ${
                  isTransparent ? 'text-white' : 'text-black'
                } group-hover:text-yellow-500`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Menu déroulant mobile */}
            {menuOpen && (
              <div id="mobile-menu" className="bg-beige shadow-lg rounded-lg mt-2 p-4 absolute top-full left-0 w-64 z-50">
                <div className="flex flex-col space-y-1">
                  <Link
                    to="/#qui-sommes-nous"
                    onClick={handleLinkClick}
                    className="font-basecoat font-medium text-black hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base"
                  >
                    Qui sommes-nous
                  </Link>
                  <Link
                    to="/realisations"
                    onClick={handleLinkClick}
                    className={`font-basecoat font-medium hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base ${
                      isActive('/realisations') ? 'text-yellow-600 bg-yellow-50' : 'text-black'
                    }`}
                  >
                    Nos créations
                  </Link>
                  <Link
                    to="/#ou-nous-trouver"
                    onClick={handleLinkClick}
                    className="font-basecoat font-medium text-black hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base"
                  >
                    Où nous trouver
                  </Link>
                  <Link
                    to="/contact"
                    onClick={handleLinkClick}
                    className={`font-basecoat font-medium hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base ${
                      isActive('/contact') ? 'text-yellow-600 bg-yellow-50' : 'text-black'
                    }`}
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/realisations"
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base ${
                isActive('/realisations')
                  ? 'text-yellow-400'
                  : isTransparent ? 'text-white' : 'text-black'
              }`}
            >
              Créations
            </Link>
            <Link
              to="/actualites"
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base ${
                isActive('/actualites')
                  ? 'text-yellow-400'
                  : isTransparent ? 'text-white' : 'text-black'
              }`}
            >
              Actualités
            </Link>
            <Link
              to="/contact"
              className={`font-basecoat font-bold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base ${
                isActive('/contact')
                  ? 'text-yellow-400'
                  : isTransparent ? 'text-white' : 'text-black'
              }`}
            >
              Contact
            </Link>
            <Link
              to="/panier"
              className="relative font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-base lg:text-lg"
            >
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              {totalItems > 0 && (
                <span key={totalItems} className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Bouton Panier - Mobile uniquement */}
          <Link
            to="/panier"
            className="relative md:hidden font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-base"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {totalItems > 0 && (
              <span key={totalItems} className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}
