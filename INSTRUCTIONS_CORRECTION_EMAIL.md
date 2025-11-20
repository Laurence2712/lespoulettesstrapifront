# 🔧 Correction du problème d'envoi d'email

## Le problème
Les emails ne sont pas envoyés car le backend Strapi utilise une adresse email non vérifiée dans SendGrid.

## La solution

### 📁 Étape 1 : Copier le fichier corrigé dans votre backend

Le fichier `BACKEND_FIX_lifecycles.js` contient le code corrigé. Vous devez le copier dans votre projet backend Strapi.

**Sur votre Mac :**

```bash
# 1. Allez dans le dossier de votre backend Strapi
cd ~/path/to/lespoulettesstrapi

# 2. Créez le dossier si nécessaire
mkdir -p src/api/commande/content-types/commande

# 3. Copiez le contenu du fichier BACKEND_FIX_lifecycles.js
# dans le fichier lifecycles.js de votre backend
```

Le fichier doit être placé à cet emplacement exact :
```
lespoulettesstrapi/
└── src/
    └── api/
        └── commande/
            └── content-types/
                └── commande/
                    └── lifecycles.js  ← ICI
```

### ⚙️ Étape 2 : Vérifier la configuration SendGrid

Dans votre backend, vérifiez que le fichier `.env` contient :

```
SENDGRID_API_KEY=votre_clé_api_sendgrid
```

Et que `config/plugins.js` contient :

```javascript
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'laurencepirard27@gmail.com',
        defaultReplyTo: 'laurencepirard27@gmail.com',
      },
    },
  },
});
```

### 🚀 Étape 3 : Déployer sur Render

```bash
# Dans le dossier lespoulettesstrapi
git add .
git commit -m "Fix: Use verified SendGrid email address for order confirmations"
git push origin main
```

Render détectera automatiquement le push et redéploiera votre backend (cela prend environ 2-3 minutes).

### ✅ Étape 4 : Tester

Une fois le déploiement terminé sur Render :

1. Allez sur votre site web
2. Ajoutez un article au panier
3. Passez une commande de test
4. Vérifiez votre boîte email à **laurencewebdev@gmail.com**

### 🔍 Vérifier les logs Render

Si l'email n'arrive toujours pas, vérifiez les logs sur Render :

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service backend
3. Allez dans l'onglet "Logs"
4. Cherchez les messages :
   - `🔔 Lifecycle hook déclenché pour commande: XX`
   - `✅ Email de confirmation envoyé à ...`
   - Ou `❌ Erreur lors de l'envoi de l'email:`

## 🎯 Changement principal

**AVANT (ne fonctionnait pas) :**
```javascript
from: 'lespoulettes@votredomaine.com',  // ❌ Non vérifié dans SendGrid
```

**APRÈS (fonctionne) :**
```javascript
from: 'laurencepirard27@gmail.com',  // ✅ Vérifié dans SendGrid
```

## ℹ️ Notes importantes

- L'email `laurencepirard27@gmail.com` DOIT être vérifié dans votre compte SendGrid
- Le backend doit être redéployé pour que les changements prennent effet
- Les logs Render vous montreront si l'email a été envoyé ou non
- Si vous avez des erreurs, elles apparaîtront dans les logs avec le symbole ❌

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez que le fichier lifecycles.js a bien été copié au bon endroit
2. Vérifiez que votre clé API SendGrid est valide dans le fichier .env
3. Regardez les logs Render pour voir les messages d'erreur
4. Assurez-vous que l'email laurencepirard27@gmail.com est bien vérifié dans SendGrid
