# 📋 RÉCAPITULATIF PROJET - LES POULETTES

**Date de finalisation :** 30 Janvier 2026  
**Client :** Les Poulettes (Accessoires éco-responsables en wax du Bénin)  
**URL Production :** https://lespoulettes.laurencepirard.be/

---

## 🎯 OBJECTIF DU PROJET

Créer un site e-commerce professionnel et responsive pour présenter et vendre des accessoires artisanaux (trousses, sacs, housses d'ordinateur) fabriqués à la main en tissu wax du Bénin.

**Public cible :** Clients particuliers et entreprises recherchant des accessoires uniques et éco-responsables.

---

## 🏗️ ARCHITECTURE TECHNIQUE

### **Stack Technologique**

| Composant | Technologie | Hébergement | Coût |
|-----------|-------------|-------------|------|
| **Frontend** | React + Remix | Vercel | Gratuit |
| **Backend** | Strapi v4 | Render (Free Tier) | Gratuit |
| **Base de données** | PostgreSQL | Neon | Gratuit |
| **Stockage images** | Cloudinary | Plan gratuit | Gratuit |
| **Emails** | Resend API | Plan gratuit | Gratuit |
| **Uptime Monitoring** | UptimeRobot | Plan gratuit | Gratuit |

**💰 Coût total : 0€ / mois**

---

### **Frontend - React/Remix**

**Framework :** Remix v2  
**Styling :** Tailwind CSS  
**Fonts personnalisées :**
- **Ogg** (serif élégant) pour les titres
- **Basecoat** (sans-serif moderne) pour le corps de texte

**Bibliothèques utilisées :**
- `react-slick` - Carrousel de produits
- `gsap` - Animations fluides
- `@heroicons/react` - Icônes modernes
- `zustand` - Gestion d'état du panier

**Déploiement :** Vercel (déploiement automatique à chaque push Git)

---

### **Backend - Strapi CMS**

**Version :** Strapi v4  
**API :** REST API complète  
**Upload Provider :** Cloudinary (images permanentes)  
**Email Provider :** Resend (via API HTTP)

**Content Types créés :**
1. **Homepage** - Bannière et description d'accueil
2. **Réalisations** - Produits (titre, description, images, prix)
3. **Actualités** - News et événements
4. **Commandes** - Enregistrement des commandes clients

**Déploiement :** Render (Free Tier avec UptimeRobot pour éviter le sleep)

---

### **Base de données - PostgreSQL**

**Provider :** Neon (serverless PostgreSQL)  
**Région :** EU Central (Europe)  
**Connexion :** Pool SSL sécurisé

**Tables principales :**
- `homepages` - Contenu de la page d'accueil
- `realisations` - Catalogue produits
- `actualites` - Articles et actualités
- `commandes` - Historique des commandes
- `upload_files` - Métadonnées des images Cloudinary

---

### **Stockage d'images - Cloudinary**

**Cloud Name :** `dlbavta6w`  
**Formats générés automatiquement :**
- Thumbnail (156x156)
- Small (500px width)
- Medium (750px width)
- Large (1000px width)

**Avantages :**
- Optimisation automatique des images
- CDN mondial intégré
- Transformations à la volée
- Stockage permanent (pas de reset comme Render)

---

### **Emails - Resend**

**Configuration :** API HTTP (port 587 SMTP bloqué par Render)  
**Expéditeur :** `onboarding@resend.dev`  
**Reply-to :** `lespoulettes.benin@gmail.com`

**Template email de confirmation :**
- Design professionnel jaune/noir
- Détails complets de la commande
- Instructions de paiement Mobile Money
- Responsive (mobile/desktop)

**Trigger :** Envoi automatique après création d'une commande (lifecycle hook Strapi)

---

### **Monitoring - UptimeRobot**

**Problème résolu :** Render Free Tier s'endort après 15 min d'inactivité  
**Solution :** UptimeRobot ping toutes les 5 minutes  
**URL surveillée :** `https://lespoulettesstrapi.onrender.com/api/homepages`  
**Résultat :** Site actif 24/7 sans coût supplémentaire

---

## 🎨 DESIGN & UX

### **Charte graphique**

**Couleurs principales :**
- Jaune primaire : `#FACC15` (bg-yellow-400)
- Noir/Gris foncé : `#111827` (textes)
- Blanc : `#FFFFFF` (backgrounds)
- Gris clair : `#F3F4F6` (cards)

**Typographie :**
- **Titres :** Ogg (serif, light, uppercase, tracking large)
- **Textes :** Basecoat (sans-serif, weights variés)

**Style général :**
- Design épuré et élégant
- Emphasis sur les photos de produits
- Animations subtiles (GSAP)
- Hover effects sur les cards

---

### **Pages & Fonctionnalités**

#### **1. Page d'accueil (`/`)**

**Sections :**
- **Bannière hero** - Image plein écran avec CTA "Foncez !"
- **Description** - Présentation des Poulettes
- **Actualité en vedette** - Dernière news avec image
- **Carrousel produits** - Slider avec 3 produits (desktop), 2 (tablet), 1 (mobile)

**Fonctionnalités :**
- Slider automatique toutes les 3 secondes
- Responsive complet
- Animations d'apparition (GSAP)

---

#### **2. Page Réalisations (`/realisations`)**

**Layout :** Grid responsive
- Mobile : 1 colonne
- Tablet : 2 colonnes
- Desktop : 3 colonnes
- Large desktop : 4 colonnes

**Cards produits :**
- Image hauteur fixe (uniformité visuelle)
- Titre + description (line-clamp)
- Lien "Voir plus"
- Hover effect (scale + shadow)

**Animations :** GSAP stagger sur les cards

---

#### **3. Page Détail Produit (`/realisations/:id`)**

**Sections :**
- **Galerie photos** - Image principale + thumbnails cliquables
- **Informations produit** - Titre, description, prix
- **Sélecteur de quantité** - Boutons +/-
- **Bouton "Ajouter au panier"** - Avec feedback visuel

**Fonctionnalités :**
- Changement d'image au clic sur thumbnail
- Gestion de la quantité (min: 1)
- Ajout au panier avec notification
- Breadcrumb navigation

---

#### **4. Page Actualités (`/actualites`)**

**Layout :** Liste verticale avec alternance image gauche/droite

**Affichage :**
- Index pair (0, 2, 4...) : Image à gauche, texte à droite
- Index impair (1, 3, 5...) : Texte à gauche, image à droite
- Mobile : Stack vertical (image en haut)

**Animations :** GSAP fade-in avec stagger

---

#### **5. Page Contact (`/contact`)**

**Formulaire :**
- Nom, Email, Message
- Validation côté client
- Design responsive

**Carte interactive :**
- Google Maps embed
- Localisation Cotonou, Bénin

**Informations de contact :**
- Email : lespoulettes.benin@gmail.com
- Réseaux sociaux (Facebook, Instagram)

---

#### **6. Page Panier (`/panier`)**

**Fonctionnalités :**
- Liste des articles avec images
- Modification de quantité
- Suppression d'articles
- Calcul automatique du total
- Formulaire de commande

**Formulaire checkout :**
- Nom complet
- Email
- Téléphone
- Adresse de livraison
- Notes optionnelles

**Instructions de paiement :**
- Informations Mobile Money (MTN, Moov, Orange)
- QR Code à recevoir par email

**Processus :**
1. Remplir le formulaire
2. Cliquer "Envoyer la commande"
3. Commande enregistrée dans Strapi
4. Email de confirmation envoyé automatiquement

---

#### **7. Navbar**

**Menu Desktop :**
- Logo cliquable (retour accueil)
- Liens : Accueil, Réalisations, Actualités, Contact
- Icône panier avec texte

**Menu Mobile :**
- Burger menu (hamburger icon)
- Menu déroulant centré
- Auto-fermeture au clic sur lien
- Bouton panier inclus

**Style :**
- Fond blanc permanent
- Texte noir
- Fixed en haut de page
- Shadow subtile

---

#### **8. Footer**

**Colonnes :**
1. Logo + description
2. Navigation (Réalisations, Actualités, Contact)
3. Contact (Email, Localisation)
4. Réseaux sociaux (Facebook, Instagram)

**Responsive :**
- Mobile : Stack vertical
- Desktop : 4 colonnes

**Copyright :** Année dynamique

---

## 🛒 GESTION DU PANIER

**State Management :** Zustand (store global)

**Actions disponibles :**
- `addToCart(item)` - Ajouter un produit
- `removeFromCart(id)` - Supprimer un produit
- `updateQuantity(id, quantity)` - Modifier la quantité
- `clearCart()` - Vider le panier

**Persistance :** localStorage (survit au refresh)

**Structure d'un item :**
```javascript
{
  id: number,
  title: string,
  prix: number,
  quantity: number,
  image_url: string
}
```

---

## 📧 SYSTÈME D'EMAILS

### **Configuration Resend**

**API Key :** Configurée dans les variables d'environnement Render  
**Méthode :** API HTTP (pas SMTP car port bloqué)

**Variables d'environnement :**
```
EMAIL_API_KEY=re_xxx...
EMAIL_FROM=onboarding@resend.dev
EMAIL_PROVIDER=resend
```

---

### **Lifecycle Hook Strapi**

**Fichier :** `src/api/commande/content-types/commande/lifecycles.js`

**Déclencheur :** `afterCreate` (après création d'une commande)

**Fonctionnement :**
1. Commande créée via API frontend
2. Hook Strapi se déclenche automatiquement
3. Vérification `email_sent` (éviter les doublons)
4. Construction du template HTML
5. Envoi via API Resend
6. Marquage `email_sent = true`

**Protection anti-doublon :** Champ `email_sent` dans la base de données

---

### **Template Email**

**Design :**
- Header jaune avec titre
- Tableau des articles commandés
- Total en gros caractères
- Box jaune : Instructions paiement Mobile Money
- Adresse de livraison
- Notes du client (si présentes)

**Responsive :** Optimisé mobile et desktop

**Contenu dynamique :**
- Nom du client
- Numéro de commande
- Liste des produits (titre, quantité, prix unitaire, total)
- Total de la commande
- Adresse de livraison
- Notes optionnelles

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints Tailwind**

```
Mobile :    < 640px   (sm)
Tablet :    640-1024px (md)
Desktop :   > 1024px   (lg, xl)
```

**Pattern utilisé partout :**
```jsx
className="text-sm sm:text-base md:text-lg lg:text-xl"
className="px-3 sm:px-4 md:px-6 lg:px-8"
className="h-48 sm:h-56 md:h-64 lg:h-80"
```

---

### **Adaptations par device**

**Mobile (<640px) :**
- Slider : 1 produit
- Grid réalisations : 1 colonne
- Navbar : Burger menu
- Footer : Stack vertical
- Textes : tailles réduites

**Tablet (640-1024px) :**
- Slider : 2 produits
- Grid réalisations : 2 colonnes
- Navbar : Burger menu (jusqu'à 768px)
- Footer : 2 colonnes

**Desktop (>1024px) :**
- Slider : 3 produits
- Grid réalisations : 3-4 colonnes
- Navbar : Menu horizontal
- Footer : 4 colonnes

---

### **Tests effectués**

**Devices testés :**
- iPhone 12 Pro (390x844)
- iPhone 17 Pro Max (430x956)
- iPad (768x1024)
- MacBook Pro (1440x900)

**Navigateurs :**
- Chrome / Brave
- Safari
- Mode responsive DevTools

---

## 🔧 CONFIGURATION & DÉPLOIEMENT

### **Variables d'environnement**

#### **Vercel (Frontend)**
```
VITE_API_URL=https://lespoulettesstrapi.onrender.com
```

#### **Render (Backend)**
```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://neondb_owner:xxx@ep-steep-night-agf4qqwg-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
HOST=0.0.0.0
PORT=10000
NODE_ENV=production
JWT_SECRET=xxx
CLOUDINARY_NAME=dlbavta6w
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=xxx
EMAIL_API_KEY=re_xxx
EMAIL_FROM=onboarding@resend.dev
EMAIL_PROVIDER=resend
```

---

### **Déploiement automatique**

**Frontend (Vercel) :**
1. Push sur GitHub → branch `main`
2. Vercel détecte automatiquement
3. Build Remix
4. Déploiement en production
5. URL live : https://lespoulettes.laurencepirard.be/

**Backend (Render) :**
1. Push sur GitHub → branch `main`
2. Render détecte automatiquement
3. `npm install` + `npm run build`
4. `npm run start`
5. URL live : https://lespoulettesstrapi.onrender.com/

---

### **Commandes Git pour déployer**

```bash
# Frontend
cd ~/Sites/lespoulettesstrapifront
git add .
git commit -m "Description des changements"
git push

# Backend
cd ~/Sites/lespoulettesstrapi
git add .
git commit -m "Description des changements"
git push
```

**Temps de déploiement :** 
- Vercel : ~1-2 minutes
- Render : ~3-5 minutes

---

## 🚀 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ **E-commerce complet**
- Catalogue produits avec images
- Page détail produit
- Panier fonctionnel (ajout/suppression/modification)
- Formulaire de commande
- Enregistrement des commandes dans la base

### ✅ **Emails automatiques**
- Confirmation de commande par email
- Template HTML professionnel
- Instructions de paiement incluses
- Protection anti-doublon

### ✅ **CMS Strapi**
- Interface admin pour gérer le contenu
- Upload d'images avec Cloudinary
- API REST complète
- Permissions configurées

### ✅ **Design responsive**
- Mobile first
- Adapté à tous les écrans
- Slider responsive avec détection JavaScript
- Grid adaptative

### ✅ **Performance**
- Backend actif 24/7 (UptimeRobot)
- Images optimisées (Cloudinary CDN)
- Animations fluides (GSAP)
- Temps de chargement rapide

### ✅ **SEO-friendly**
- Structure sémantique HTML
- Meta tags appropriés
- URLs propres
- Breadcrumb navigation

---

## 📊 ADMIN STRAPI - MODE D'EMPLOI

### **Accès admin**

**URL :** https://lespoulettesstrapi.onrender.com/admin  
**Identifiants :** (fournis séparément)

---

### **Gérer les produits (Réalisations)**

1. **Content Manager** (menu gauche)
2. Cliquer sur **"Réalisations"**
3. **Create new entry** pour ajouter un produit

**Champs à remplir :**
- **Titre** : Nom du produit
- **Description** : Description détaillée
- **Prix** : Prix en euros (nombre décimal)
- **Images** : Uploader plusieurs photos (la première sera la principale)

4. **Save** puis **Publish**

---

### **Gérer les actualités**

1. **Content Manager** → **Actualités**
2. **Create new entry**

**Champs :**
- **Title** : Titre de l'actualité
- **content** : Texte de l'actualité
- **image** : Photo illustrative

3. **Save** puis **Publish**

---

### **Modifier la page d'accueil**

1. **Content Manager** → **Homepages**
2. Modifier l'entrée existante

**Champs :**
- **banner_image** : Image de fond de la bannière
- **description** : Texte sous la bannière

3. **Save** puis **Publish**

---

### **Consulter les commandes**

1. **Content Manager** → **Commandes**
2. Liste de toutes les commandes reçues

**Informations disponibles :**
- Nom, Email, Téléphone du client
- Adresse de livraison
- Articles commandés (JSON)
- Total de la commande
- Statut : `en_attente`, `confirmee`, `expediee`, `livree`
- Notes du client
- Email envoyé (oui/non)

**Actions possibles :**
- Voir les détails d'une commande
- Changer le statut
- Supprimer une commande

---

### **Upload d'images**

**Deux méthodes :**

**1. Via Media Library**
- **Media Library** (menu gauche)
- **Add new assets**
- Glisser-déposer les images
- Images uploadées sur Cloudinary automatiquement

**2. Directement dans un content type**
- Lors de la création/modification d'un produit
- Cliquer sur le champ image
- Upload ou sélectionner depuis la bibliothèque

**Formats générés automatiquement :**
- Thumbnail, Small, Medium, Large
- Optimisation automatique

---

## 🐛 DÉPANNAGE

### **Le site ne charge pas**

**Vérifications :**
1. Backend Strapi actif ? → https://lespoulettesstrapi.onrender.com/
2. UptimeRobot actif ? → https://uptimerobot.com/
3. Render service en ligne ? → https://dashboard.render.com/

**Solution si backend down :**
- Render Free Tier s'endort parfois malgré UptimeRobot
- Attendre 30-50 secondes pour le réveil
- Ou : Accéder à l'admin Strapi pour le réveiller manuellement

---

### **Les images ne s'affichent pas**

**Causes possibles :**
1. Images pas encore uploadées sur Cloudinary
2. URL Cloudinary incorrecte dans l'API

**Vérification :**
- Admin Strapi → Content Manager → vérifier que les images sont présentes
- Tester l'URL de l'image directement dans le navigateur

---

### **Email de confirmation non reçu**

**Vérifications :**
1. Vérifier les **spams**
2. Email correct dans le formulaire ?
3. Commande bien créée ? → Admin Strapi → Commandes
4. Champ `email_sent` = true ?

**Logs Render :**
- https://dashboard.render.com/
- Service Strapi → **Logs**
- Chercher "Email envoyé" ou erreurs

**Si problème Resend :**
- Vérifier que `EMAIL_API_KEY` est bien configurée
- Tester l'API Resend : https://resend.com/emails

---

### **Slider affiche trop/pas assez de slides**

**Solution :**
- Vider le cache du navigateur (`Cmd+Shift+R` ou `Ctrl+Shift+R`)
- Tester en navigation privée
- Le slider utilise une détection JavaScript dynamique de la largeur d'écran

---

### **Panier ne fonctionne pas**

**Causes possibles :**
1. localStorage désactivé dans le navigateur
2. JavaScript bloqué
3. State Zustand corrompu

**Solution :**
- Vider le localStorage : Console DevTools → `localStorage.clear()`
- Rafraîchir la page

---

## 📞 CONTACTS & RESSOURCES

### **Services utilisés**

**Vercel (Frontend) :**
- Dashboard : https://vercel.com/dashboard
- Docs : https://vercel.com/docs

**Render (Backend) :**
- Dashboard : https://dashboard.render.com/
- Docs : https://docs.render.com/

**Neon (Database) :**
- Dashboard : https://console.neon.tech/
- Docs : https://neon.tech/docs

**Cloudinary (Images) :**
- Dashboard : https://console.cloudinary.com/
- Docs : https://cloudinary.com/documentation

**Resend (Emails) :**
- Dashboard : https://resend.com/
- Docs : https://resend.com/docs

**UptimeRobot (Monitoring) :**
- Dashboard : https://uptimerobot.com/dashboard
- Docs : https://uptimerobot.com/api/

---

### **Repositories GitHub**

**Frontend :** https://github.com/Laurence2712/lespoulettesstrapifront  
**Backend :** https://github.com/Laurence2712/lespoulettesstrapi

---

### **Documentation technique**

**React :** https://react.dev/  
**Remix :** https://remix.run/docs  
**Strapi :** https://docs.strapi.io/  
**Tailwind CSS :** https://tailwindcss.com/docs  
**GSAP :** https://gsap.com/docs/  
**Zustand :** https://docs.pmnd.rs/zustand/

---

## 🎉 CONCLUSION

Le site **Les Poulettes** est maintenant **100% fonctionnel et production-ready** :

✅ Design professionnel et responsive  
✅ E-commerce complet (catalogue, panier, commandes)  
✅ Emails automatiques de confirmation  
✅ Backend CMS facile à gérer  
✅ Performance optimale (images CDN, uptime 24/7)  
✅ Coût d'hébergement : 0€ / mois  
✅ Déploiement automatique  

**Le site est prêt à recevoir des commandes ! 🚀**

---

## 📅 CHRONOLOGIE DU PROJET

**Phase 1 : Setup initial**
- Installation Strapi + Remix
- Configuration base de données Neon
- Setup Cloudinary pour les images

**Phase 2 : Développement frontend**
- Pages principales (Accueil, Réalisations, Actualités, Contact, Panier)
- Design responsive complet
- Gestion du panier avec Zustand

**Phase 3 : Responsive & Design**
- Correction slider mobile
- Uniformisation des fonts (Ogg + Basecoat)
- Alignement des cards réalisations
- Footer et navbar responsive

**Phase 4 : Backend & Emails**
- Configuration Strapi sur Render
- Setup UptimeRobot (uptime 24/7)
- Intégration Resend pour les emails
- Lifecycle hook pour confirmation automatique

**Phase 5 : Tests & Déploiement**
- Tests multi-devices
- Corrections finales
- Déploiement production
- Documentation complète

---

**Document créé le :** 30 Janvier 2026  
**Version :** 1.0  
**Statut du projet :** ✅ Terminé et en production

---

*Pour toute question technique ou demande d'évolution, contacter le développeur.*