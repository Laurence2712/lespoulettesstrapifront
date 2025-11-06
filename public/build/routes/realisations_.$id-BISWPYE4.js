import {
  CartUtils
} from "/build/_shared/chunk-7RPNMDWN.js";
import {
  Link,
  useNavigate,
  useParams
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

// app/routes/realisations_.$id.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/realisations_.$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/realisations_.$id.tsx"
  );
  import.meta.hot.lastModified = "1762173282284.066";
}
function RealisationDetail() {
  _s();
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [realisation, setRealisation] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [selectedImage, setSelectedImage] = (0, import_react.useState)(0);
  const [quantity, setQuantity] = (0, import_react.useState)(1);
  (0, import_react.useEffect)(() => {
    async function fetchRealisation() {
      try {
        const response = await fetch("http://localhost:1337/api/realisations?populate=*");
        if (!response.ok)
          throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const item = data.data.find((r) => r.id === parseInt(id || "0"));
        if (!item) {
          setError("R\xE9alisation introuvable");
          setLoading(false);
          return;
        }
        const imagesUrls = item.Images?.map((img) => `http://localhost:1337${img.url}`) || [];
        setRealisation({
          id: item.id,
          title: item.Titre || "Titre indisponible",
          description: item.Description || "Description indisponible",
          prix: item.Prix || "Prix sur demande",
          images: imagesUrls,
          specifications: item.Specifications || "",
          stock: item.Stock || 0
        });
        if (imagesUrls.length > 0) {
          setSelectedImage(0);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(`Erreur lors du chargement: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchRealisation();
    }
  }, [id]);
  const handleAddToCart = () => {
    if (!realisation)
      return;
    const item = {
      id: realisation.id,
      title: realisation.title,
      prix: Number(realisation.prix) || 0,
      image_url: realisation.images?.[0] || "",
      quantity
    };
    CartUtils.addToCart(item);
    navigate("/panier");
  };
  if (loading) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-16 px-4 text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xl", children: "Chargement..." }, void 0, false, {
      fileName: "app/routes/realisations_.$id.tsx",
      lineNumber: 88,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/realisations_.$id.tsx",
      lineNumber: 87,
      columnNumber: 12
    }, this);
  }
  if (error || !realisation) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-16 px-4 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-red-500 text-xl mb-4", children: error || "R\xE9alisation introuvable" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/realisations", className: "text-indigo-600 hover:text-indigo-800 font-medium", children: "\u2190 Retour aux r\xE9alisations" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 94,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/realisations_.$id.tsx",
      lineNumber: 92,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-8 px-4 max-w-7xl mt-[70px]", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "font-basecoat mb-8 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-indigo-600 hover:text-indigo-800", children: "Accueil" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 102,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mx-2", children: "/" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 103,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/realisations", className: "font-basecoat text-indigo-600 hover:text-indigo-800", children: "R\xE9alisations" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 104,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mx-2", children: "/" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: realisation.title }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 106,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/realisations_.$id.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: realisation.images.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-100 rounded-lg overflow-hidden mb-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: realisation.images[selectedImage], alt: realisation.title, className: "w-full h-96 object-cover" }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 114,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 113,
          columnNumber: 15
        }, this),
        realisation.images.length > 1 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-4 gap-2", children: realisation.images.map((img, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setSelectedImage(index), className: `border-2 rounded-md overflow-hidden transition ${selectedImage === index ? "border-yellow-400" : "border-gray-300 hover:border-gray-400"}`, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: img, alt: `${realisation.title} ${index + 1}`, className: "w-full h-20 object-cover" }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 118,
          columnNumber: 23
        }, this) }, index, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 117,
          columnNumber: 59
        }, this)) }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 116,
          columnNumber: 49
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 112,
        columnNumber: 44
      }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-200 rounded-lg h-96 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-500", children: "Aucune image disponible" }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 122,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 121,
        columnNumber: 22
      }, this) }, void 0, false, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 111,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: realisation.title }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 128,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-3xl font-bold text-yellow-600 mb-6", children: realisation.prix ? `${realisation.prix} \u20AC` : "Prix sur demande" }, void 0, false, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 129,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-b border-gray-200 py-6 mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "font-basecoat text-xl font-semibold mb-3", children: "Description" }, void 0, false, {
            fileName: "app/routes/realisations_.$id.tsx",
            lineNumber: 134,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-basecoat text-gray-700 whitespace-pre-line leading-relaxed", children: realisation.description }, void 0, false, {
            fileName: "app/routes/realisations_.$id.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "font-medium text-gray-700", children: "Quantit\xE9:" }, void 0, false, {
              fileName: "app/routes/realisations_.$id.tsx",
              lineNumber: 143,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center border border-gray-300 rounded-md", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setQuantity(Math.max(1, quantity - 1)), className: "px-4 py-2 hover:bg-gray-100 transition", disabled: quantity <= 1, children: "-" }, void 0, false, {
                fileName: "app/routes/realisations_.$id.tsx",
                lineNumber: 145,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-6 py-2 border-l border-r border-gray-300", children: quantity }, void 0, false, {
                fileName: "app/routes/realisations_.$id.tsx",
                lineNumber: 148,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setQuantity(quantity + 1), className: "px-4 py-2 hover:bg-gray-100 transition", children: "+" }, void 0, false, {
                fileName: "app/routes/realisations_.$id.tsx",
                lineNumber: 151,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/realisations_.$id.tsx",
              lineNumber: 144,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/realisations_.$id.tsx",
            lineNumber: 142,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: handleAddToCart, className: "w-full py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 bg-yellow-400 text-black hover:bg-yellow-500", children: "Ajouter au panier" }, void 0, false, {
            fileName: "app/routes/realisations_.$id.tsx",
            lineNumber: 157,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/realisations", className: "block w-full py-4 text-center border-2 border-gray-800 text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition", children: "\u2190 Continuer mes achats" }, void 0, false, {
            fileName: "app/routes/realisations_.$id.tsx",
            lineNumber: 161,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/realisations_.$id.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/realisations_.$id.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/realisations_.$id.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/realisations_.$id.tsx",
    lineNumber: 99,
    columnNumber: 10
  }, this);
}
_s(RealisationDetail, "Jp0hL8HseNZKD0CJHFW6ol7tOUg=", false, function() {
  return [useParams, useNavigate];
});
_c = RealisationDetail;
var _c;
$RefreshReg$(_c, "RealisationDetail");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  RealisationDetail as default
};
//# sourceMappingURL=/build/routes/realisations_.$id-BISWPYE4.js.map
