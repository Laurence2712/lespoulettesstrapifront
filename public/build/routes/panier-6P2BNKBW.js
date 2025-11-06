import {
  CartUtils
} from "/build/_shared/chunk-7RPNMDWN.js";
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

// app/routes/panier.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/panier.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/panier.tsx"
  );
  import.meta.hot.lastModified = "1762174521082.5134";
}
function Panier() {
  _s();
  const [cart, setCart] = (0, import_react.useState)([]);
  const [showCheckout, setShowCheckout] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setCart(CartUtils.getCart());
  }, []);
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = CartUtils.updateQuantity(id, newQuantity);
    setCart(updatedCart);
  };
  const removeItem = (id) => {
    const updatedCart = CartUtils.removeFromCart(id);
    setCart(updatedCart);
  };
  const total = CartUtils.getTotal(cart);
  if (cart.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-16 px-4 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold mb-4", children: "Votre panier est vide" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mb-8", children: "D\xE9couvrez nos r\xE9alisations !" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 45,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/realisations", className: "inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition", children: "Voir nos r\xE9alisations" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 46,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 43,
      columnNumber: 12
    }, this);
  }
  if (showCheckout) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CheckoutForm, { cart, total, onBack: () => setShowCheckout(false) }, void 0, false, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 52,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-8 px-4 max-w-6xl mt-[70px]", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "mb-8 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "text-indigo-600 hover:text-indigo-800", children: "Accueil" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 56,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "mx-2", children: "/" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 57,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Panier" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 58,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold mb-8", children: "Votre panier" }, void 0, false, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "lg:col-span-2 space-y-4", children: cart.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-white rounded-lg shadow-md p-6 flex gap-4", children: [
        item.image_url && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: item.image_url, alt: item.title, className: "w-24 h-24 object-cover rounded" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 67,
          columnNumber: 34
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold", children: item.title }, void 0, false, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 69,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600 mt-1", children: [
            item.prix,
            " \u20AC l'unit\xE9"
          ] }, void 0, true, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 70,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4 mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center border border-gray-300 rounded", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => updateQuantity(item.id, item.quantity - 1), className: "px-3 py-1 hover:bg-gray-100", children: "-" }, void 0, false, {
                fileName: "app/routes/panier.tsx",
                lineNumber: 74,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "px-4 py-1 border-l border-r", children: item.quantity }, void 0, false, {
                fileName: "app/routes/panier.tsx",
                lineNumber: 77,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => updateQuantity(item.id, item.quantity + 1), className: "px-3 py-1 hover:bg-gray-100", children: "+" }, void 0, false, {
                fileName: "app/routes/panier.tsx",
                lineNumber: 78,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 73,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => removeItem(item.id), className: "text-red-600 hover:text-red-800 text-sm font-medium", children: "Supprimer" }, void 0, false, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 83,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 72,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 68,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-right", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xl font-bold", children: [
          (item.prix * item.quantity).toFixed(2),
          " \u20AC"
        ] }, void 0, true, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 90,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 89,
          columnNumber: 15
        }, this)
      ] }, item.id, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 66,
        columnNumber: 29
      }, this)) }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "lg:col-span-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-100 rounded-lg p-6 sticky top-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-2xl font-bold mb-4", children: "R\xE9sum\xE9" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 98,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-2 mb-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Sous-total" }, void 0, false, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 102,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
              total.toFixed(2),
              " \u20AC"
            ] }, void 0, true, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 103,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 101,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-sm text-gray-600", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Livraison" }, void 0, false, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 106,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\xC0 calculer" }, void 0, false, {
              fileName: "app/routes/panier.tsx",
              lineNumber: 107,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 105,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 100,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "border-t border-gray-300 pt-4 mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-between text-xl font-bold", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Total" }, void 0, false, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 113,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
            total.toFixed(2),
            " \u20AC"
          ] }, void 0, true, {
            fileName: "app/routes/panier.tsx",
            lineNumber: 114,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 112,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setShowCheckout(true), className: "w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition mb-3", children: "Commander" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 118,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/realisations", className: "block w-full text-center border-2 border-gray-800 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition", children: "\u2190 Continuer mes achats" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 122,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/panier.tsx",
    lineNumber: 54,
    columnNumber: 10
  }, this);
}
_s(Panier, "XkCyPvZTxH5bqcxtalV6Jn9Tvqc=");
_c = Panier;
function CheckoutForm({
  cart,
  total,
  onBack
}) {
  _s2();
  const [formData, setFormData] = (0, import_react.useState)({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    notes: ""
  });
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [success, setSuccess] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:1337/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            nom: formData.nom,
            email: formData.email,
            telephone: formData.telephone,
            adresse: formData.adresse,
            articles: cart,
            total,
            statut: "en_attente",
            notes: formData.notes
          }
        })
      });
      if (!response.ok)
        throw new Error("Erreur lors de l'envoi de la commande");
      CartUtils.clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-16 px-4 text-center max-w-2xl", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-green-50 border-2 border-green-500 rounded-lg p-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-6xl mb-4", children: "\u2713" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 185,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-3xl font-bold text-green-800 mb-4", children: "Commande envoy\xE9e !" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 186,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-700 mb-6", children: [
        "Nous avons bien re\xE7u votre commande. Vous recevrez un email de confirmation \xE0 ",
        formData.email,
        "."
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 187,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition", children: "Retour \xE0 l'accueil" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 190,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 184,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 183,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container mx-auto py-8 px-4 max-w-3xl mt-[70px]", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: onBack, className: "text-indigo-600 hover:text-indigo-800 mb-6 flex items-center", children: "\u2190 Retour au panier" }, void 0, false, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 197,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold mb-8", children: "Finaliser la commande" }, void 0, false, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 201,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-gray-100 rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "font-bold mb-2", children: "R\xE9capitulatif" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 204,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600 mb-4", children: [
        cart.length,
        " article(s) - Total: ",
        total.toFixed(2),
        " \u20AC"
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 205,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm", children: "Apr\xE8s validation, nous vous contacterons pour confirmer la commande et convenir du mode de paiement et de livraison." }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 206,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 203,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block font-medium mb-2", children: "Nom complet *" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", required: true, value: formData.nom, onChange: (e) => setFormData({
          ...formData,
          nom: e.target.value
        }), className: "w-full border border-gray-300 rounded-lg px-4 py-2" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 214,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block font-medium mb-2", children: "Email *" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 221,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", required: true, value: formData.email, onChange: (e) => setFormData({
          ...formData,
          email: e.target.value
        }), className: "w-full border border-gray-300 rounded-lg px-4 py-2" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 222,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 220,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block font-medium mb-2", children: "T\xE9l\xE9phone *" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 229,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "tel", required: true, value: formData.telephone, onChange: (e) => setFormData({
          ...formData,
          telephone: e.target.value
        }), className: "w-full border border-gray-300 rounded-lg px-4 py-2" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 230,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 228,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block font-medium mb-2", children: "Adresse de livraison *" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 237,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { required: true, rows: 3, value: formData.adresse, onChange: (e) => setFormData({
          ...formData,
          adresse: e.target.value
        }), className: "w-full border border-gray-300 rounded-lg px-4 py-2" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 238,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 236,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block font-medium mb-2", children: "Notes (optionnel)" }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 245,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { rows: 3, value: formData.notes, onChange: (e) => setFormData({
          ...formData,
          notes: e.target.value
        }), className: "w-full border border-gray-300 rounded-lg px-4 py-2", placeholder: "Informations compl\xE9mentaires, pr\xE9f\xE9rences de livraison..." }, void 0, false, {
          fileName: "app/routes/panier.tsx",
          lineNumber: 246,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 244,
        columnNumber: 9
      }, this),
      error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded", children: error }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 252,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: loading, className: "w-full bg-yellow-400 text-black py-4 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50", children: loading ? "Envoi en cours..." : "Envoyer la commande" }, void 0, false, {
        fileName: "app/routes/panier.tsx",
        lineNumber: 256,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/panier.tsx",
      lineNumber: 211,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/panier.tsx",
    lineNumber: 196,
    columnNumber: 10
  }, this);
}
_s2(CheckoutForm, "/f/8+HBo3+XXxNhKGg3yOw7c+w0=");
_c2 = CheckoutForm;
var _c;
var _c2;
$RefreshReg$(_c, "Panier");
$RefreshReg$(_c2, "CheckoutForm");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Panier as default
};
//# sourceMappingURL=/build/routes/panier-6P2BNKBW.js.map
