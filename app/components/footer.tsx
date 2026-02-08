import { Link } from "@remix-run/react";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Colonne 1 : Logo + description */}
        <div>
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/logo_t_poulettes_white.png"
              alt="Les Poulettes"
              className="h-[100px] w-auto"
            />
          </Link>
        
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
  <a
    href="mailto:lespoulettes.benin@gmail.com"
    className="break-all hover:underline"
  >
    lespoulettes.benin@gmail.com
  </a>
</li>
            
           <li className="flex items-start space-x-2">
  <svg 
    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
<p>
  <a
    href="https://wa.me/2290162007580"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    +229 01 62 00 75 80
  </a>
</p>
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