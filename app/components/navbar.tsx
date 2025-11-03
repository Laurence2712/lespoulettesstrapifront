import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? "bg-black bg-opacity-70" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/logo_t_poulettes.png"
            alt="Les Poulettes"
            className="h-[100px] w-auto"
          />
        </Link>

        {/* Menu */}
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

        {/* Panier */}
        <Link
          to="/panier"
          className={`relative p-2 hover:text-yellow-400 transition ${
            scrolled ? "text-white" : "text-black"
          }`}
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
