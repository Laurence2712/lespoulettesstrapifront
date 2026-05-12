# CLAUDE.md

## Operating Mode (STRICT + CONTEXT)

### Initialization
- Read this CLAUDE.md file **once at the start** and store all context internally.
- Do NOT ask for project context repeatedly.
- Assume you already know the project structure, components, routes, and configuration.

### File Access
- Read ONLY the file/section explicitly requested for a task.
- Do NOT scan unrelated files.
- For global changes (e.g., all buttons/components), use stored context.

### Response Style
- Default = max 5 lines, concise, bullet points allowed.
- Expand ONLY if explicitly requested.
- Never repeat the same question or context unless needed for clarification.

### Code Output
- Output ONLY the modified snippet(s) relevant to the request.
- For global changes (all buttons/components), you may show multiple snippets.
- Avoid rewriting full files unless explicitly requested.

### Token Optimization
- Minimal words, maximum clarity.
- Default mode = concise & technical.
- Use stored context for reasoning; do NOT fetch unnecessary details.

---

## Project Overview

This is the frontend for "Les Poulettes" - an e-commerce site selling handmade wax fabric accessories from Benin. Built with Remix (React SSR), TypeScript, Tailwind CSS. Strapi CMS backend and Stripe payments.

### Key Areas (for context)
- `app/routes/` → file-based routing (_index, realisations, panier, actualites…)  
- `app/components/` → NavBar, Footer, CartDrawer, BackToTop, CookieBanner, ToastProvider  
- Zustand → cart management (localStorage + expiration 24h)  
- Tailwind → colors, fonts, animations  
- Strapi → API endpoints, collections: homepages, realisations, actualites, commandes  
- Stripe → checkout flow, bank transfer, Belgian postal code validation  
- TypeScript → strict mode, path alias `~/*`, ES2022

### Development Commands
- `npm run dev` → start Remix dev server (Vite, SSR)  
- `npm run build` → production build in `build/`  
- `npm start` → serve production build locally  
- `npm run typecheck` → TypeScript type checking  
- `npm run lint` → ESLint checks

### Data Loading Pattern
- Each route exports a `loader()` function for server-side data
- Components use `useLoaderData()` hook
- External fetches use `fetchWithTimeout()` helper (8s)

### Styling (Tailwind)
- Custom colors: `benin.*`, `wax.*`  
- Fonts: `Basecoat-Light` (sans-serif), `Ogg` (serif)  
- Beige background: `#F5F1E8`  
- Animations: `slide-up`, `slide-in-right`

### Custom Hooks
- `useScrollAnimations()` → GSAP scroll animations  
- `useParallaxHero()` → hero parallax effect

### Key Components
- Navigation & Layout: `navbar.tsx`, `footer.tsx`, `root.tsx`  
- Cart & Checkout: `CartDrawer.tsx`, `panier.tsx`  
- UI Elements: `BackToTop.tsx`, `CookieBanner.tsx`, `ToastProvider.tsx`

### SEO & Metadata
- JSON-LD structured data (Organization schema)  
- Per-route `meta` functions  
- Sitemap at `/sitemap.xml`  
- Canonical URLs and robots meta tags

### Payment Flow (Stripe)
1. Add items to cart (Zustand + localStorage)  
2. Fill shipping form (Belgium only)  
3. Submit to `/api/commandes/create-checkout-session`  
4. Stripe Checkout session → redirect  
5. Success page `/paiement-reussi` clears cart  
6. Bank transfer option: `/api/commandes/create-bank-transfer-order`

### Environment Variables
**Backend:** `VITE_API_URL` / `API_URL`  
**Stripe:** `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`  
**Email/Newsletter:** `RESEND_API_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID`  
**Anti-Spam & Analytics:** `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `GA_MEASUREMENT_ID`  
**Other:** `SITE_URL` → production URL

### Notes
- Keep all project context internally for global tasks.  
- Follow Operating Mode rules for token efficiency unless explicitly overridden.  
- Always assume you know the project; do NOT ask the same questions repeatedly.  
- Use Operating Mode rules for concise answers and snippets unless user explicitly requests full explanations.