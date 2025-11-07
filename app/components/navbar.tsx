import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { CartUtils } from "../utils/cart";

export default function NavBar() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mettre à jour le compteur du panier
  useEffect(() => {
    const updateCartCount = () => {
      const cart = CartUtils.getCart();
      setCartCount(CartUtils.getItemCount(cart));
    };

    updateCartCount();

    // Écouter les changements du localStorage
    window.addEventListener('storage', updateCartCount);
    // Écouter un événement personnalisé pour les changements locaux
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Déterminer les classes en fonction de la page
  const navClasses = isHomepage
    ? "bg-transparent text-white" // Homepage : toujours blanc
    : scrolled
      ? "bg-black bg-opacity-90 text-white" // Autres pages avec scroll : blanc
      : "bg-transparent text-black"; // Autres pages sans scroll : noir

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${navClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[90px]">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={
              isHomepage || scrolled
                ? "/assets/logo_t_poulettes_white.png"
                : "/assets/logo_t_poulettes.png"
            }
            alt="Les Poulettes"
            className="h-[100px] w-auto transition-opacity duration-500"
          />
        </Link>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-8 uppercase font-semibold text-lg transition-colors duration-500">
         
          <li>
            <Link
              to="realisations"
              className="font-basecoat hover:text-yellow-400 transition"
            >
              Réalisations
            </Link>
          </li>
          <li>
            <Link
              to="actualites"
              className="font-basecoat hover:text-yellow-400 transition"
            >
              Actualités
            </Link>
          </li>
             <li>
            <Link
              to="contact"
              className="font-basecoat hover:text-yellow-400 transition"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Panier + Burger */}
        <div className="flex items-center space-x-4">
          <Link
            to="/panier"
            className={`relative p-2 hover:text-yellow-400 transition ${
              isHomepage || scrolled ? "text-white" : "text-black"
            }`}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Burger menu mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <Bars3Icon
                className={`w-6 h-6 transition-colors duration-300 ${
                  isHomepage || scrolled ? "text-white" : "text-black"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 text-white absolute top-[90px] left-0 w-full flex flex-col items-center space-y-6 py-6 uppercase font-semibold text-lg transition-all duration-300">
          <Link to="apropos" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            A propos
          </Link>
          <Link to="realisations" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            Réalisations
          </Link>
          <Link to="actualites" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            Actualités
          </Link>
        </div>
      )}
    </nav>
  );
}
