# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend for "Les Poulettes" - an e-commerce website selling handmade wax fabric accessories from Benin. Built with Remix (React framework with SSR), TypeScript, and Tailwind CSS. The application connects to a Strapi headless CMS backend for content management and uses Stripe for payment processing.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Remix dev server with Vite. The app will be available at http://localhost:5173 (or the next available port).

### Build for Production
```bash
npm run build
```
Creates optimized production build in the `build/` directory.

### Run Production Build Locally
```bash
npm start
```
Serves the production build using `remix-serve`.

### Type Checking
```bash
npm run typecheck
```
Run TypeScript compiler to check for type errors without emitting files.

### Linting
```bash
npm run lint
```
Run ESLint on the codebase. ESLint config is in [.eslintrc.cjs](.eslintrc.cjs).

## Architecture

### Backend Integration (Strapi CMS)

The app fetches content from a Strapi backend. API configuration is centralized in [app/config/api.ts](app/config/api.ts):

- `API_URL` is determined from environment variables (`VITE_API_URL` or `API_URL`) with a fallback to production URL
- All API endpoints are defined in the `apiEndpoints` object
- Image URLs are resolved using `getImageUrl()` helper which handles both relative and absolute paths

**Strapi Collections Used:**
- `homepages` - Homepage content and hero images
- `realisations` - Product catalog (with images, prices, stock)
- `actualites` - Blog posts/news articles
- `commandes` - Orders and payment processing

### State Management (Zustand)

Shopping cart state is managed with Zustand in [app/store/cartStore.ts](app/store/cartStore.ts):

- Cart items persist to localStorage with the key `cart-storage`
- Cart expires after 24 hours of inactivity (checked on mount and every 5 minutes)
- Stock limits are enforced when adding/updating items
- Cart expiration is checked in [app/root.tsx](app/root.tsx) on app mount

### Routing (File-Based)

Remix uses file-based routing in the `app/routes/` directory:
- `_index.tsx` - Homepage
- `realisations.tsx` - Product catalog page
- `realisations_.$id.tsx` - Individual product detail page (dynamic route)
- `panier.tsx` - Shopping cart page with Stripe checkout
- `actualites.tsx` - Blog/news listing
- `contact.tsx` - Contact page
- `$.tsx` - Catch-all route for 404s (splat route)

### Data Loading Pattern

Routes follow the Remix loader pattern:
1. Export a `loader` function that runs on the server
2. Use `useLoaderData()` hook in component to access data
3. Export a `meta` function for SEO tags
4. Routes with external API calls use `fetchWithTimeout()` helper for reliability

Example from [app/routes/_index.tsx](app/routes/_index.tsx:68-74):
```typescript
export async function loader() {
  const [homepageRes, realisationsRes] = await Promise.all([
    fetchWithTimeout(apiEndpoints.homepages, 8000),
    fetchWithTimeout(apiEndpoints.realisations, 8000),
  ]);
  // ... process and return data
}
```

### Styling with Tailwind

Tailwind configuration in [tailwind.config.ts](tailwind.config.ts) includes:
- Custom color palette inspired by Benin flag and wax fabrics (`benin.*` and `wax.*` colors)
- Custom fonts: `Basecoat-Light` (sans-serif) and `Ogg` (serif), defined in `public/fonts/`
- Beige background color (`#F5F1E8`) used throughout the site
- Custom animations: `slide-up` and `slide-in-right`

### Custom Hooks

[app/hooks/useScrollAnimations.ts](app/hooks/useScrollAnimations.ts) provides GSAP-based scroll animations:
- `useScrollAnimations()` - Animates elements on scroll with IntersectionObserver
- `useParallaxHero()` - Creates parallax effect for hero sections

## Environment Variables

Required environment variables (see [.env.example](.env.example)):

**Backend:**
- `VITE_API_URL` / `API_URL` - Strapi backend URL

**Stripe Payments:**
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key (client-side)
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature secret

**Email & Newsletter:**
- `RESEND_API_KEY` - For transactional emails
- `BREVO_API_KEY` - Newsletter service (formerly Sendinblue)
- `BREVO_LIST_ID` - Newsletter list ID

**Anti-Spam & Analytics:**
- `RECAPTCHA_SITE_KEY` - Google reCAPTCHA v3 public key
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA v3 secret key
- `GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID

**Other:**
- `SITE_URL` - Production site URL (https://lespoulettes.be)

## Key Components

**Navigation & Layout:**
- [app/components/navbar.tsx](app/components/navbar.tsx) - Main navigation with cart indicator
- [app/components/footer.tsx](app/components/footer.tsx) - Footer with newsletter form
- [app/root.tsx](app/root.tsx) - Root layout with NavBar, Footer, and global providers

**Cart & Checkout:**
- [app/components/CartDrawer.tsx](app/components/CartDrawer.tsx) - Sliding cart panel
- [app/routes/panier.tsx](app/routes/panier.tsx) - Full cart page with Stripe integration and Belgian postal code lookup

**UI Elements:**
- [app/components/BackToTop.tsx](app/components/BackToTop.tsx) - Scroll-to-top button
- [app/components/CookieBanner.tsx](app/components/CookieBanner.tsx) - Cookie consent banner
- [app/components/ToastProvider.tsx](app/components/ToastProvider.tsx) - Toast notification system

## SEO & Metadata

The site implements comprehensive SEO:
- JSON-LD structured data for Organization schema (in [app/root.tsx](app/root.tsx:92-111))
- Per-route `meta` functions for title, description, and Open Graph tags
- Sitemap generated at `/sitemap.xml` ([app/routes/sitemap[.]xml.tsx](app/routes/sitemap[.]xml.tsx))
- Robots meta tags and canonical URLs

## Payment Flow (Stripe)

1. User adds items to cart (stored in Zustand + localStorage)
2. On cart page, user fills shipping form (Belgium only)
3. Form submits to Strapi endpoint `/api/commandes/create-checkout-session`
4. Strapi creates Stripe Checkout session and returns URL
5. User is redirected to Stripe Checkout
6. After payment, Stripe redirects to `/paiement-reussi` success page
7. Cart is cleared on success page load

Bank transfer option also available via `/api/commandes/create-bank-transfer-order`.

## TypeScript Configuration

- Strict mode enabled
- Path alias: `~/*` maps to `./app/*`
- Target: ES2022
- Module resolution: Bundler (for Vite)
- See [tsconfig.json](tsconfig.json) for full config

## Important Notes

- **Node Version:** The project requires Node.js >=18.0.0 <21 (see [package.json](package.json:50-52))
- **Deployment:** Configured for Vercel with `vercel-build` script
- **Cart Persistence:** Cart data expires after 24 hours of inactivity
- **Belgian Market:** Postal code validation is specific to Belgium (see [app/routes/panier.tsx](app/routes/panier.tsx:48))
- **Strapi Document IDs:** Recent Strapi versions use `documentId` instead of numeric IDs
- **API Timeouts:** All Strapi API calls use 8-second timeout to prevent hanging requests
