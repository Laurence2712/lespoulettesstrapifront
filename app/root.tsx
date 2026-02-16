import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useEffect } from "react";

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

<body className="font-inter bg-beige text-gray-900 flex flex-col min-h-screen overflow-x-hidden">        {/* Barre de navigation */}
        <NavBar />

        {/* Contenu principal */}
        <main className="flex-grow">{children}</main>

        {/* Pied de page global */}
        <Footer />

        {/* Scripts Remix */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const checkExpiration = useCartStore((state) => state.checkExpiration);

  useEffect(() => {
    // Vérifier l'expiration du panier au chargement de la page
    checkExpiration();
    
    // Vérifier l'expiration toutes les 5 minutes (optionnel)
    const interval = setInterval(() => {
      checkExpiration();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [checkExpiration]);

  return <Outlet />;
}