import { Link } from "@remix-run/react";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 sm:py-10 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Colonne 1 : Logo + description */}
        <div>
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/logo_t_poulettes_white.png"
              alt="Les Poulettes"
              className="h-20 sm:h-24 md:h-28 w-auto"
            />
          </Link>
          <p className="mt-3 sm:mt-4 text-gray-400 text-xs sm:text-sm leading-relaxed font-basecoat">
            Des trousses faites avec amour et passion, à la main, pour un style unique et durable.
          </p>
        </div>

        {/* Colonne 2 : Navigation */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase font-basecoat">Navigation</h3>
          <ul className="space-y-2 text-gray-400 font-basecoat text-xs sm:text-sm">
            <li>
              <Link to="/realisations" className="hover:text-yellow-400 transition">
                Réalisations
              </Link>
            </li>
            <li>
              <Link to="/actualites" className="hover:text-yellow-400 transition">
                Actualités
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yellow-400 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Contact */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase font-basecoat">Contact</h3>
          <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm font-basecoat">
            <li className="flex items-start space-x-2">
              <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span className="break-all">lespoulettes.benin@gmail.com</span>
            </li>
            
            <li className="flex items-start space-x-2">
              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>Cotonou, Benin</span>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Réseaux sociaux */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 uppercase font-basecoat">Suivez-nous</h3>
          <div className="flex space-x-4 font-basecoat">
            <a 
              href="https://www.facebook.com/lespoulettescouture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow-400 transition"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-lg sm:text-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/lespoulettes.benin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow-400 transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-lg sm:text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Ligne du bas */}
      <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-4 sm:pt-6 text-center text-gray-500 text-xs sm:text-sm font-basecoat">
        <p>© {currentYear} Les Poulettes. Tous droits réservés.</p>
      </div>
    </footer>
  );
}