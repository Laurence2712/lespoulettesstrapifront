import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={handleLinkClick}>
            <img
              src="/assets/logo_t_poulettes.png"
              alt="Les Poulettes"
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Accueil
            </Link>
            <Link
              to="/realisations"
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Réalisations
            </Link>
            <Link
              to="/actualites"
              className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-sm lg:text-base"
            >
              Actualités
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
            </Link>
          </div>

          {/* Burger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile - CENTRÉ */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 mb-4 p-6 absolute top-full left-4 right-4">
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-base"
              >
                Accueil
              </Link>
              <Link
                to="/realisations"
                onClick={handleLinkClick}
                className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-base"
              >
                Réalisations
              </Link>
              <Link
                to="/actualites"
                onClick={handleLinkClick}
                className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-base"
              >
                Actualités
              </Link>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className="font-basecoat font-semibold text-black hover:text-yellow-400 transition text-base"
              >
                Contact
              </Link>
              <Link
                to="/panier"
                onClick={handleLinkClick}
                className="font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-semibold transition transform hover:scale-105 text-base"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Panier
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}