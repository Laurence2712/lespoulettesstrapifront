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

// app/routes/realisations.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/realisations.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/realisations.tsx"
  );
  import.meta.hot.lastModified = "1762175339526.937";
}
function Realisations() {
  _s();
  const [realisations, setRealisations] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    async function fetchRealisations() {
      try {
        const response = await fetch("http://localhost:1337/api/realisations?populate=*");
        if (!response.ok)
          throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        if (data && data.data) {
          const realisationsData = data.data.map((realisation) => ({
            id: realisation.id,
            title: realisation.Titre || "Titre indisponible",
            image_url: realisation.Images?.[0]?.url,
            description: realisation.Description || "Description indisponible"
          }));
          setRealisations(realisationsData);
        } else {
          setError("Aucune r\xE9alisation trouv\xE9e.");
        }
      } catch (error2) {
        console.error("Erreur lors du chargement des r\xE9alisations :", error2);
        setError("Erreur lors du chargement des r\xE9alisations");
      } finally {
        setLoading(false);
      }
    }
    fetchRealisations();
  }, []);
  (0, import_react.useEffect)(() => {
    gsapWithCSS.from(".realisation-card", {
      opacity: 0,
      y: 50,
      stagger: {
        amount: 0.6,
        from: "start"
      },
      duration: 0.8,
      ease: "power3.out",
      onComplete: () => {
        gsapWithCSS.to(".realisation-card", {
          opacity: 1,
          duration: 0.1
        });
      }
    });
  }, [realisations]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-8 px-4 max-w-7xl mt-[70px]", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "font-basecoat mb-8 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-indigo-600 hover:text-indigo-800 font-medium", children: "Accueil" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 77,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mx-2 text-gray-400", children: "/" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 80,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "R\xE9alisations" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z", clipRule: "evenodd" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      "Retour"
    ] }, void 0, true, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 85,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl md:text-5xl text-center mb-12 text-gray-900 tracking-wide", children: "D\xE9couvrez les r\xE9alisations" }, void 0, false, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-center text-xl", children: "Chargement..." }, void 0, false, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 94,
      columnNumber: 19
    }, this),
    error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-red-500 text-center", children: error }, void 0, false, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 95,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6", children: realisations.map((realisation) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md overflow-hidden realisation-card hover:shadow-xl transition-shadow", style: {
      transform: "scale(1)",
      transition: "transform 0.3s"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: realisation.image_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: `http://localhost:1337${realisation.image_url}`, alt: realisation.title, className: "w-full h-48 object-cover" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 103,
        columnNumber: 40
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full h-48 bg-gray-200 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500", children: "Aucune image disponible" }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 104,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 103,
        columnNumber: 165
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 102,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-basecoat text-lg font-semibold text-gray-900", children: realisation.title }, void 0, false, {
          fileName: "app/routes/realisations.tsx",
          lineNumber: 108,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-basecoat text-gray-700 mt-2 line-clamp-3", children: realisation.description }, void 0, false, {
          fileName: "app/routes/realisations.tsx",
          lineNumber: 109,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 107,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "p-4 pt-0", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/realisations/${realisation.id}`, className: "font-basecoat inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition", children: [
        "Voir plus",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4 ml-1", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { fillRule: "evenodd", d: "M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z", clipRule: "evenodd" }, void 0, false, {
          fileName: "app/routes/realisations.tsx",
          lineNumber: 115,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "app/routes/realisations.tsx",
          lineNumber: 114,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 112,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations.tsx",
        lineNumber: 111,
        columnNumber: 13
      }, this)
    ] }, realisation.id, true, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 98,
      columnNumber: 42
    }, this)) }, void 0, false, {
      fileName: "app/routes/realisations.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/realisations.tsx",
    lineNumber: 74,
    columnNumber: 10
  }, this);
}
_s(Realisations, "mIZMrIfNygOzFdTP3TM4qpP+7mM=");
_c = Realisations;
var _c;
$RefreshReg$(_c, "Realisations");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Realisations as default
};
//# sourceMappingURL=/build/routes/realisations-KJXPHONG.js.map
