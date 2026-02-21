import { Link } from "@remix-run/react";

export function meta() {
  return [
    { title: "Page introuvable — Les Poulettes" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-beige">
      <div className="text-center max-w-md">
        <p className="font-basecoat text-8xl font-bold text-yellow-400 mb-4">404</p>
        <h1 className="font-basecoat text-2xl sm:text-3xl font-bold text-gray-900 uppercase mb-4">
          Page introuvable
        </h1>
        <p className="font-basecoat text-gray-500 mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée. Nos créatrices sont toujours là pour vous !
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="font-basecoat inline-block border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition hover:scale-105"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/realisations"
            className="font-basecoat inline-block border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition"
          >
            Nos créations
          </Link>
        </div>
      </div>
    </div>
  );
}
