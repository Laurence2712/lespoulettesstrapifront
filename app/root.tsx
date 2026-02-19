import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { useEffect } from "react";

export const meta: MetaFunction = () => [
  { title: "Les Poulettes — Accessoires wax fait main au Bénin" },
  {
    name: "description",
    content:
      "Les Poulettes, marque d'accessoires éco-responsables faits main au Bénin. Trousses, sacs et housses en tissu wax authentique.",
  },
  { property: "og:site_name", content: "Les Poulettes" },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "fr_FR" },
];

import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { useCartStore } from "./store/cartStore";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-inter bg-beige text-gray-900 flex flex-col min-h-screen overflow-x-hidden">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const checkExpiration = useCartStore((state) => state.checkExpiration);

  useEffect(() => {
    checkExpiration();
    const interval = setInterval(() => {
      checkExpiration();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkExpiration]);

  return <Outlet />;
}

// ✅ AJOUT : Gestion globale des erreurs
export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Une erreur inattendue s'est produite.";
  let details = "";

  if (isRouteErrorResponse(error)) {
    message = `Erreur ${error.status}`;
    details = error.data || "";
  } else if (error instanceof Error) {
    details = error.message;
  }

  return (
    <html lang="fr" className="overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-inter bg-beige text-gray-900 flex flex-col min-h-screen overflow-x-hidden">
        <NavBar />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center max-w-md">
            <img src="/assets/logo_t_poulettes.png" alt="Les Poulettes" className="mx-auto mb-8 h-16" />
            <h1 className="font-basecoat text-2xl font-bold text-gray-900 mb-4">
              Oups, une petite erreur !
            </h1>
            <p className="font-basecoat text-gray-600 mb-2">
              Nos créations sont toujours là, mais la page a eu un petit souci au chargement.
            </p>
            {details && (
              <p className="text-sm text-gray-400 mb-6 font-mono">{details}</p>
            )}
            <a
              href="/"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-basecoat font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition hover:scale-105"
            >
              Retour à l'accueil
            </a>
          </div>
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}