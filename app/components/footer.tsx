import { Link } from "@remix-run/react";
import { useScrollAnimations } from "../hooks/useScrollAnimations";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const scrollRef = useScrollAnimations();

  return (
    <footer ref={scrollRef} className="bg-black text-white py-12 sm:py-16">
      <div className="anim-stagger px-4 sm:px-6 md:px-[60px] lg:px-[120px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12" data-stagger="0.1">

        {/* Colonne 1 : Logo */}
        <div>
          <Link to="/">
            <img
              src="/assets/logo_t_poulettes_white.png"
              alt="Les Poulettes"
              className="h-[80px] sm:h-[100px] md:h-[120px] w-auto"
            />
          </Link>
          <p className="font-basecoat text-gray-400 text-sm sm:text-base mt-4 leading-relaxed">
            Accessoires made in Bénin, éco-trendy et faits main.
          </p>
        </div>

        {/* Colonne 2 : Navigation */}
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 uppercase font-basecoat tracking-wider">Navigation</h3>
          <ul className="space-y-3 text-gray-400 font-basecoat text-sm sm:text-base">
            <li>
              <Link to="/realisations" className="hover:text-yellow-400 transition">
                Créations
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
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 uppercase font-basecoat tracking-wider">Contact</h3>
          <ul className="space-y-4 text-gray-400 text-sm sm:text-base font-basecoat">
            <li>
              <a
                href="mailto:lespoulettes.benin@gmail.com"
                className="flex items-center gap-3 hover:text-yellow-400 transition"
              >
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="break-all">lespoulettes.benin@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/2290162007580"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-yellow-400 transition"
              >
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>+229 01 62 00 75 80</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Réseaux sociaux */}
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-5 uppercase font-basecoat tracking-wider">Suivez-nous</h3>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/lespoulettescouture"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-yellow-400 flex items-center justify-center transition-all duration-300 group"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/lespoulettes.benin/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-yellow-400 flex items-center justify-center transition-all duration-300 group"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/2290162007580"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-gray-800 hover:bg-yellow-400 flex items-center justify-center transition-all duration-300 group"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Ligne du bas */}
      <div className="anim-fade-up border-t border-gray-800 mt-10 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-500 text-sm sm:text-base font-basecoat px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <p>© {currentYear} Les Poulettes. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
