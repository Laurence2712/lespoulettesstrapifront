import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__lp_auth",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "lespoulettes-secret-key-2024"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return true; // Pas de mot de passe configuré = accès libre
  const session = await getSession(request);
  return session.get("authenticated") === true;
}
