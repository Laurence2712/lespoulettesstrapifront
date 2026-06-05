import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { getSession, isAuthenticated, sessionStorage } from "~/sessions.server";

export const meta: MetaFunction = () => [
  { title: "Accès privé — Les Poulettes" },
  { name: "robots", content: "noindex, nofollow" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  if (await isAuthenticated(request)) {
    return redirect("/");
  }
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword || password !== sitePassword) {
    return json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const session = await getSession(request);
  session.set("authenticated", true);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export default function PasswordPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-10 text-center">
        <img
          src="/assets/logo_t_poulettes.png"
          alt="Les Poulettes"
          className="h-24 mx-auto mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h1 className="font-serif text-3xl text-gray-800 tracking-wide">
          Les Poulettes
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-sans">
          Accessoires en tissu wax • Fait main au Bénin
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-center text-lg font-semibold text-gray-700 mb-1">
          Accès privé
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Ce site est en accès restreint. Veuillez entrer le mot de passe.
        </p>

        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:border-transparent text-gray-800 bg-[#FAFAF8] transition"
            />
          </div>

          {actionData?.error && (
            <p className="text-sm text-red-500 text-center">
              {actionData.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-[#D4A843] hover:bg-[#C49833] text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-60"
          >
            {isSubmitting ? "Vérification…" : "Accéder au site"}
          </button>
        </Form>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} Les Poulettes • Tous droits réservés
      </p>
    </div>
  );
}
