import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "../store/cartStore";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();


    const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = getTotalItems();

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
          {/* Conteneur gauche : Logo + Bouton Catégories */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative">
            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <img
                src="/assets/logo_t_poulettes.png"
                alt="Les Poulettes"
                className="h-[80px] sm:h-[90px] md:h-[100px] w-auto"
              />
            </Link>

            {/* Bouton Menu "Catégories" - Style Etsy */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 focus:outline-none hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black"
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
              <span className="font-basecoat font-semibold text-black text-xs sm:text-sm md:text-base">
                Catégories
              </span>
            </button>

            {/* Menu déroulant "Catégories" - Desktop & Mobile */}
            {menuOpen && (
              <div className="bg-white shadow-lg rounded-lg mt-2 p-4 absolute top-full left-0 sm:left-auto sm:right-0 w-64 z-50">
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
                    className="font-basecoat font-medium text-black hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base"
                  >
                    Nos Créations
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
                    className="font-basecoat font-medium text-black hover:bg-gray-100 px-4 py-3 rounded-lg transition text-base"
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
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Créations
            </Link>
            <Link
              to="/actualites"
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Archives
            </Link>
            <Link
              to="/contact"
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Contact
            </Link>
            <Link
              to="/panier"
              className="font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-sm lg:text-base"
            >
             <ShoppingCartIcon className="w-5 h-5" />
              <span className="hidden lg:inline">Panier</span>
              {/* ← AJOUTER : Badge compteur */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Bouton Panier - Mobile uniquement */}
          <Link
            to="/panier"
            className="md:hidden font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded-lg font-semibold transition transform hover:scale-105 text-sm"
          >
           <ShoppingCartIcon className="w-5 h-5" />
            {/* ← AJOUTER : Badge compteur mobile */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}