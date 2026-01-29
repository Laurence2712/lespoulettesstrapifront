import { Link } from "@remix-run/react";
import { useState } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Colonne 1 : Logo + description */}
        <div>
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/logo_t_poulettes_white.png"
              alt="Les Poulettes"
              className="h-[100px] w-auto"
            />
          </Link>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed font-basecoat">
            Des trousses faites avec amour et passion, à la main, pour un style unique et durable.
          </p>
        </div>

        {/* Colonne 2 : Navigation */}
        <div>
          <ul className="space-y-2 text-gray-400 font-basecoat">
           
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
          <h3 className="text-lg font-semibold mb-4 uppercase font-basecoat">Contact</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center space-x-2">
              <EnvelopeIcon className="w-5 h-5 text-yellow-400" />
              <span>lespoulettes.benin@gmail.com</span>
            </li>
            
            <li className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-yellow-400" />
              <span>Cotonou, Benin</span>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase font-basecoat">Suivez-nous</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/lespoulettescouture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://www.instagram.com/lespoulettes.benin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          
          </div>
        </div>
      </div>

      {/* Ligne du bas */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        <p>© {currentYear} Les Poulettes. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
