import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";

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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={handleLinkClick}>
            <img
              src="/assets/logo_t_poulettes.png"
              alt="Les Poulettes"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-basecoat font-semibold transition ${
                scrolled
                  ? "text-black hover:text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/realisations"
              className={`font-basecoat font-semibold transition ${
                scrolled
                  ? "text-black hover:text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              Réalisations
            </Link>
            <Link
              to="/actualites"
              className={`font-basecoat font-semibold transition ${
                scrolled
                  ? "text-black hover:text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              Actualités
            </Link>
            <Link
              to="/contact"
              className={`font-basecoat font-semibold transition ${
                scrolled
                  ? "text-black hover:text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/panier"
              className={`font-basecoat font-semibold transition ${
                scrolled
                  ? "text-black hover:text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              Panier
            </Link>
          </div>

          {/* Burger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none z-50"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${scrolled ? "text-black" : "text-white"}`}
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

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4 absolute top-full left-4 right-4">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="font-basecoat block py-2 font-semibold text-black hover:text-yellow-400 transition"
            >
              Accueil
            </Link>
            <Link
              to="/realisations"
              onClick={handleLinkClick}
              className="font-basecoat block py-2 font-semibold text-black hover:text-yellow-400 transition"
            >
              Réalisations
            </Link>
            <Link
              to="/actualites"
              onClick={handleLinkClick}
              className="font-basecoat block py-2 font-semibold text-black hover:text-yellow-400 transition"
            >
              Actualités
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="font-basecoat block py-2 font-semibold text-black hover:text-yellow-400 transition"
            >
              Contact
            </Link>
            <Link
              to="/panier"
              onClick={handleLinkClick}
              className="font-basecoat block py-2 font-semibold text-black hover:text-yellow-400 transition"
            >
              Panier
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}