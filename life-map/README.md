# LIFE MAP

> Your life. Your journey. Your map.

Application mobile iOS / Android (Expo + React Native + TypeScript) qui transforme les expériences vécues en une carte personnelle.

**État actuel : prototype navigable en _mode démo_** — toutes les données restent sur l'appareil. La connexion Supabase (comptes, synchronisation, sécurité côté serveur) est la prochaine étape.

---

## Démarrer en 3 minutes

Prérequis : Node.js 20+ et l'app **Expo Go** sur ton téléphone (App Store / Play Store).

```bash
cd life-map
npm install
npm start          # affiche un QR code
```

Scanne le QR code avec l'appareil photo (iPhone) ou avec Expo Go (Android). L'app s'ouvre directement, sans aucune clé à configurer.

| Commande | Rôle |
| --- | --- |
| `npm start` | Lance le serveur de développement (QR code) |
| `npm run ios` / `npm run android` | Ouvre sur un simulateur |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | Vérification ESLint |
| `npm test` | Tests unitaires et de composants (Jest) |
| `npm run check` | Les trois vérifications d'un coup |

> Le mode web (`npm run web`) n'est qu'un aperçu : la carte y est remplacée par une liste, car la carte native n'existe que sur iOS/Android.

---

## Ce qui fonctionne aujourd'hui (mode démo)

| Domaine | Disponible | Remarques |
| --- | --- | --- |
| Accueil / onboarding | ✅ 3 écrans + création de profil (nom, identifiant, avatar, bio) | |
| **Explore (carte)** | ✅ vraie carte (Apple Plans / Google Maps), marqueurs par catégorie, regroupement, aperçu au toucher, filtres période + catégories, « Ma carte » / « Amis & communauté », recentrage, ma position, recherche de lieux | La recherche utilise le géocodeur du téléphone (sans clé) |
| **Ajouter une expérience** | ✅ photos (jusqu'à 6), titre, catégorie, date rapide, lieu (texte, ma position, recherche, ou toucher la carte), note, visibilité | Validation, erreurs, chargement et succès gérés |
| Détail | ✅ photos, carte, réactions, commentaires, modification, suppression | Seul l'auteur peut modifier / supprimer |
| Feed | ✅ expériences des amis, réactions, commentaires, chargement progressif, tirer pour rafraîchir | Jamais d'expérience privée |
| Stats | ✅ total, lieux distincts, privées / partagées, 6 derniers mois, catégories, récap du mois | Calculées sur les vraies données |
| Profil | ✅ profil, compteurs, carte personnelle, galerie de souvenirs, profils des autres | |
| Social | ✅ recherche d'utilisateurs, demandes d'amitié, acceptation, suppression, notifications | Données de démo locales |
| Paramètres / confidentialité | ✅ thème sombre/clair/système, visibilité par défaut, suppression de toutes ses données | |

**Ce qui n'existe PAS encore** (honnêtement) :

- Comptes réels (inscription / connexion e-mail, mot de passe oublié) → Phase 3, nécessite Supabase.
- Synchronisation entre appareils, autres vrais utilisateurs : les amis actuels sont des **profils de démonstration**.
- Envoi des photos sur un serveur : elles restent sur le téléphone.
- Notifications push : seules les notifications internes à l'app existent.

---

## Choix techniques (en clair)

| Besoin | Choix | Pourquoi |
| --- | --- | --- |
| Base de l'app | **Expo SDK 57**, React Native 0.86, TypeScript strict | Un seul code pour iOS et Android, mises à jour faciles |
| Navigation | **Expo Router** (fichiers dans `src/app/`) | Chaque fichier = un écran, liens profonds gratuits |
| Carte | **react-native-maps** (Apple Plans sur iOS, Google Maps sur Android) | Fonctionne dans Expo Go **sans compte ni clé**, donc testable tout de suite. Mapbox exige un « development build » et un compte payant au-delà d'un quota ; on pourra y passer plus tard si on veut un style de carte 100 % personnalisé. |
| Formulaires | React Hook Form + Zod | Validation fiable, messages clairs |
| Données locales | Zustand + AsyncStorage | Simple ; remplacé par Supabase en Phase 3 derrière les mêmes hooks |
| Images | expo-image | Cache et transitions performantes |
| Tests | Jest (jest-expo) + Testing Library | Standard Expo |

Bibliothèques déjà installées pour la suite : `@supabase/supabase-js`, `@tanstack/react-query`, `expo-secure-store`.

---

## Organisation du code

```
life-map/
├── app.json                 Configuration Expo (nom, permissions, icônes)
├── .env.example             Variables d'environnement à copier en .env.local
└── src/
    ├── app/                 ÉCRANS (Expo Router)
    │   ├── _layout.tsx      Racine : thème, navigation, toasts
    │   ├── welcome.tsx      Onboarding
    │   ├── (tabs)/          Les 5 onglets : index (Explore), feed, add, stats, profile
    │   ├── experience/      Détail + modification
    │   ├── user/            Profil d'un autre utilisateur
    │   └── search, friends, notifications, settings, privacy
    ├── components/
    │   ├── ui/              Design system : Text, Button, Field, Chip, Card, Avatar, états vides/erreur/chargement, Toast
    │   ├── map/             Carte des expériences, sélecteur de position (+ variantes web)
    │   └── experience/      Formulaire, publication du feed, galerie, réactions
    ├── features/
    │   ├── experiences/     Types, catégories, validation, statistiques, regroupement carte, filtres, règles de visibilité, store
    │   └── settings/        Préférences (thème, visibilité par défaut)
    ├── theme/               Couleurs (Midnight, Forest, Sage, Ivory), typographie, espacements
    ├── data/demo.ts         Jeu de données de démonstration
    └── lib/                 Localisation, haptique, formatage, variables d'env
```

### Design system

- Palette : Midnight `#101B24`, Forest `#203B34`, Sage `#A4D5B9`, Ivory `#F4F2EC`. Mode sombre par défaut, clair disponible.
- Titres en serif (esprit carnet de voyage), texte en police système.
- Toutes les couleurs passent par `src/theme/tokens.ts` ; aucun écran n'utilise de couleur « en dur » hors catégories.
- Cibles tactiles ≥ 44–48 pt, libellés d'accessibilité sur les boutons, retour haptique sur les actions.

---

## Confidentialité (déjà en place)

- Nouvelle expérience = **privée par défaut**.
- Position demandée **uniquement** au toucher de « Ma position » ; jamais en arrière-plan (bloqué dans `app.json`).
- Le lieu proposé automatiquement s'arrête au quartier/ville, jamais au numéro de rue.
- Les règles d'accès (`src/features/experiences/visibility.ts`) sont testées : une expérience privée n'apparaît jamais dans le feed, la recherche, ou le profil vu par quelqu'un d'autre ; « Amis » exige une amitié **acceptée**.
- Pas de permission caméra ni micro.

⚠️ **Limite actuelle** : en mode démo, ces règles sont appliquées dans l'app. En Phase 3, elles seront imposées **par la base de données** (Row Level Security Supabase), seule garantie réelle.

Risques restants à traiter avant une bêta : suppression des métadonnées EXIF (GPS) des photos avant envoi, modération des contenus publics, signalement / blocage d'utilisateurs, limitation anti-spam des demandes d'amitié.

---

## Configuration à prévoir

| Quoi | Quand | Où |
| --- | --- | --- |
| Projet **Supabase** (URL + clé `anon`) | Phase 3 | `.env.local` → `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| Clé **Google Maps SDK Android** | Avant le premier build Android de production (pas nécessaire avec Expo Go) | Plugin `react-native-maps` dans `app.json` |
| Compte **Expo (EAS)** | Builds iOS/Android | `npx eas-cli@latest login` |
| Compte **Apple Developer** (99 $/an) et **Google Play Console** (25 $) | Bêta privée (TestFlight / test interne) | — |

Ne jamais mettre la clé `service_role` de Supabase dans l'app.

---

## Feuille de route

- [x] **Phase 1** — Architecture, Expo + TypeScript, navigation, design system
- [x] **Phase 2** — Prototype navigable des 5 onglets + écrans secondaires, données de démo
- [ ] **Phase 3** — Supabase : migrations SQL (profiles, experiences, experience_media, friendships, reactions, comments, notifications), RLS, authentification e-mail, stockage photos privé
- [ ] **Phase 4** — Brancher les écrans sur Supabase (TanStack Query), pagination serveur, gestion hors-ligne
- [ ] **Phase 5** — Tests RLS automatisés, tests de parcours, accessibilité
- [ ] **Phase 6** — EAS Build, icône et splash définitifs, fiches stores, bêta privée
