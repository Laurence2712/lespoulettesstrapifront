import { Link } from "@remix-run/react";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10 sm:py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Colonne 1 : Logo + Description */}
          <div>
            <img
              src="/assets/logo_t_poulettes_white.png"
              alt="Les Poulettes"
              className="h-16 sm:h-18 md:h-20 w-auto mb-4"
            />
            <p className="font-basecoat text-gray-400 text-sm sm:text-base leading-relaxed">
              Accessoires éco-responsables en wax du Bénin
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <ul className="font-basecoat space-y-2 text-gray-400 text-sm sm:text-base">
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
            <ul className="font-basecoat space-y-3 text-gray-400 text-sm sm:text-base">
              <li className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span className="break-all">lespoulettes.benin@gmail.com</span>
              </li>
              
              <li className="flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>Cotonou, Bénin</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux sociaux */}
          <div>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/lespoulettescouture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xl sm:text-2xl"></i>
              </a>
              <a
                href="https://www.instagram.com/lespoulettes.benin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl sm:text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-6 text-center">
          <p className="font-basecoat text-gray-500 text-xs sm:text-sm">
            © {currentYear} Les Poulettes. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}