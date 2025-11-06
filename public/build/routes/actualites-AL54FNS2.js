import {
  gsapWithCSS
} from "/build/_shared/chunk-UIXCWLH5.js";
import {
  Link
} from "/build/_shared/chunk-SGY5SM6K.js";
import "/build/_shared/chunk-PLT55Z5M.js";
import {
  createHotContext
} from "/build/_shared/chunk-KR4X6VAU.js";
import "/build/_shared/chunk-JR22VO6P.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-F4KNNEUR.js";
import {
  require_react
} from "/build/_shared/chunk-2Z2JGDFU.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/routes/actualites.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/actualites.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/actualites.tsx"
  );
  import.meta.hot.lastModified = "1762173406313.1514";
}
function ActualitesPage() {
  _s();
  const [actualites, setActualites] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    async function fetchActualites() {
      try {
        const response = await fetch("http://localhost:1337/api/actualites?populate=*");
        if (!response.ok)
          throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const actualitesData = data.data.map((item) => ({
            id: item.id,
            title: item.Title || "Titre indisponible",
            content: item.content || "",
            image_url: item.image?.formats?.large?.url ? `http://localhost:1337${item.image.formats.large.url}` : item.image?.url ? `http://localhost:1337${item.image.url}` : "",
            date: item.publishedAt || item.date || ""
          }));
          setActualites(actualitesData);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des actualit\xE9s");
      } finally {
        setLoading(false);
      }
    }
    fetchActualites();
  }, []);
  (0, import_react.useEffect)(() => {
    if (actualites.length > 0) {
      gsapWithCSS.from(".actu-card", {
        opacity: 1,
        y: 50,
        stagger: {
          amount: 0.5
        },
        duration: 0.8,
        ease: "power3.out"
      });
    }
  }, [actualites]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-16 px-4 max-w-7xl mt-[70px]", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "mb-8 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-yellow-600 hover:text-yellow-800 font-medium", children: "Accueil" }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 75,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mx-2 text-gray-400", children: "/" }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 78,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Actualit\xE9s" }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 79,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 74,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl md:text-5xl text-center mb-12 text-gray-900 tracking-wide", children: "Toutes les actualit\xE9s" }, void 0, false, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-center text-xl", children: "Chargement..." }, void 0, false, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 86,
      columnNumber: 19
    }, this),
    error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-red-500 text-center", children: error }, void 0, false, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 87,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex flex-col gap-16", children: actualites.map((actu, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `flex flex-col md:flex-row items-center gap-8 actu-card bg-white rounded-xl shadow-lg overflow-hidden p-6 transform transition hover:scale-[1.02]`, children: [
      index % 2 === 0 && actu.image_url && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:w-1/2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: actu.image_url, alt: actu.title, className: "w-full h-80 object-cover rounded-lg shadow-md" }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 93,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 92,
        columnNumber: 51
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:w-1/2 flex flex-col justify-center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-ogg text-gray-500 mb-2 italic", children: actu.date ? new Date(actu.date).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }) : "Date inconnue" }, void 0, false, {
          fileName: "app/routes/actualites.tsx",
          lineNumber: 97,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "font-basecoat text-2xl md:text-3xl font-bold text-black mb-4", children: actu.title }, void 0, false, {
          fileName: "app/routes/actualites.tsx",
          lineNumber: 104,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-basecoat text-gray-800 text-lg whitespace-pre-line leading-relaxed", children: actu.content }, void 0, false, {
          fileName: "app/routes/actualites.tsx",
          lineNumber: 107,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 96,
        columnNumber: 13
      }, this),
      index % 2 !== 0 && actu.image_url && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "md:w-1/2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: actu.image_url, alt: actu.title, className: "w-full h-80 object-cover rounded-lg shadow-md" }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 113,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/actualites.tsx",
        lineNumber: 112,
        columnNumber: 51
      }, this)
    ] }, actu.id, true, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 90,
      columnNumber: 42
    }, this)) }, void 0, false, {
      fileName: "app/routes/actualites.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/actualites.tsx",
    lineNumber: 72,
    columnNumber: 10
  }, this);
}
_s(ActualitesPage, "8v+c2lxXN8GMvBWKZhYH7L/7OMg=");
_c = ActualitesPage;
var _c;
$RefreshReg$(_c, "ActualitesPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ActualitesPage as default
};
//# sourceMappingURL=/build/routes/actualites-AL54FNS2.js.map
