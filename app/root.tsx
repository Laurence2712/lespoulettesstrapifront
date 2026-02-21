import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import CookieBanner from "./components/CookieBanner";
import BackToTop from "./components/BackToTop";
import { ToastProvider } from "./components/ToastProvider";
import { useCartStore } from "./store/cartStore";
import "./tailwind.css";

export async function loader() {
  return json({
    gaId: process.env.GA_MEASUREMENT_ID || "",
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || "",
  });
}

export const meta: MetaFunction = () => [
  { title: "Les Poulettes — Accessoires wax fait main au Bénin" },
  {
    name: "description",
    content:
      "Les Poulettes, marque d'accessoires éco-responsables faits main au Bénin. Trousses, sacs et housses en tissu wax authentique.",
  },
  {
    name: "keywords",
    content:
      "Les Poulettes, accessoires wax, tissu wax, fait main, Bénin, Afrique, éco-responsable, trousse, sac, housse, artisanat",
  },
  { name: "robots", content: "index, follow" },
  { name: "theme-color", content: "#F5F1E8" },
  { property: "og:site_name", content: "Les Poulettes" },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "fr_FR" },
  {
    property: "og:title",
    content: "Les Poulettes — Accessoires wax fait main au Bénin",
  },
  {
    property: "og:description",
    content:
      "Accessoires éco-responsables faits main au Bénin. Trousses, sacs et housses en tissu wax authentique.",
  },
  { property: "og:image", content: "/assets/logo_t_poulettes.png" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@lespoulettes" },
  {
    name: "twitter:title",
    content: "Les Poulettes — Accessoires wax fait main au Bénin",
  },
  {
    name: "twitter:description",
    content:
      "Accessoires éco-responsables faits main au Bénin. Trousses, sacs et housses en tissu wax authentique.",
  },
  { name: "twitter:image", content: "/assets/logo_t_poulettes.png" },
];

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
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

// JSON-LD Organisation — référence le site sur toutes les pages
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Les Poulettes",
  url: "https://lespoulettes.be",
  logo: "https://lespoulettes.be/assets/logo_t_poulettes.png",
  description:
    "Marque d'accessoires éco-responsables faits main au Bénin. Trousses, sacs et housses en tissu wax authentique.",
  email: "lespoulettes.benin@gmail.com",
  telephone: "+2290162007580",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BJ",
    addressLocality: "Cotonou",
  },
  sameAs: [
    "https://www.facebook.com/lespoulettescouture",
    "https://www.instagram.com/lespoulettes.benin/",
  ],
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-inter bg-beige text-gray-900 flex flex-col min-h-screen overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Aller au contenu principal
        </a>
        <NavBar />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
        <CookieBanner />
        <BackToTop />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { gaId, recaptchaSiteKey } = useLoaderData<typeof loader>();
  const checkExpiration = useCartStore((state) => state.checkExpiration);
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  useEffect(() => {
    checkExpiration();
    const interval = setInterval(() => {
      checkExpiration();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkExpiration]);

  // reCAPTCHA v3 — injecté dynamiquement côté client
  useEffect(() => {
    if (!recaptchaSiteKey || typeof window === "undefined") return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  // Google Analytics 4 — injecté dynamiquement côté client
  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", gaId, { anonymize_ip: true });
  }, [gaId]);

  return (
    <ToastProvider>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center gap-3 shadow-md">
          <span className="text-black font-basecoat font-bold text-sm uppercase tracking-widest">Chargement</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-black/70" style={{ animation: 'dot 1.2s ease-in-out infinite' }} />
            <span className="w-2 h-2 rounded-full bg-black/70" style={{ animation: 'dot 1.2s ease-in-out 0.2s infinite' }} />
            <span className="w-2 h-2 rounded-full bg-black/70" style={{ animation: 'dot 1.2s ease-in-out 0.4s infinite' }} />
          </div>
        </div>
      )}
      <style>{`
        @keyframes dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Outlet />
    </ToastProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let details = "";

  if (isRouteErrorResponse(error)) {
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
            <img
              src="/assets/logo_t_poulettes.png"
              alt="Les Poulettes"
              width={120}
              height={64}
              className="mx-auto mb-8 h-16 w-auto"
            />
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
              className="inline-block border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black font-basecoat font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition hover:scale-105"
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
