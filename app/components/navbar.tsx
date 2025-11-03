import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? "bg-black bg-opacity-90 text-white" : "bg-transparent text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[90px]">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/logo_t_poulettes.png"
            alt="Les Poulettes"
            className="h-[100px] w-auto"
          />
        </Link>

        {/* Menu desktop */}
        <ul
          className={`hidden md:flex space-x-8 uppercase font-semibold text-lg transition-colors duration-500 ${
            scrolled ? "text-white" : "text-black"
          }`}
        >
          <li>
            <Link
              to="apropos"
              className="font-basecoat hover:text-yellow-400 transition"
            >
              A propos
            </Link>
          </li>
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
        </ul>

        {/* Panier + Burger */}
        <div className="flex items-center space-x-4">
          <Link
            to="/panier"
            className={`relative p-2 hover:text-yellow-400 transition ${
              scrolled ? "text-white" : "text-black"
            }`}
          >
            <ShoppingCartIcon className="w-6 h-6" />
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
                  scrolled ? "text-white" : "text-black"
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
