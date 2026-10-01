# LIFE MAP

> Your life. Your journey. Your map.

Application mobile iOS / Android (Expo + React Native + TypeScript) qui transforme les expériences vécues en une carte personnelle.

L'app fonctionne de deux façons, choisies automatiquement :

- **Mode démo** (aucune clé configurée) : données de démonstration stockées sur le téléphone, aucun compte. Idéal pour essayer.
- **Mode connecté** (clés Supabase dans `.env.local`) : vrais comptes, données en ligne, sécurité appliquée par la base de données. Mise en route : [`supabase/README.md`](supabase/README.md).

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
| `npm run test:db` | Tests de sécurité de la base (nécessite PostgreSQL local) |

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

### En mode connecté (Supabase), en plus

| Domaine | État |
| --- | --- |
| Inscription, connexion, déconnexion, mot de passe oublié (lien par e-mail), session conservée | ✅ codé, ⚠️ pas encore testé sur un vrai projet Supabase |
| Profil créé automatiquement à l'inscription, puis écran « Présente-toi » | ✅ |
| Expériences, photos, réactions, commentaires, amis, notifications enregistrés en ligne | ✅ affichage immédiat, envoi au serveur, resynchronisation en cas d'échec |
| Photos : redimensionnées et **métadonnées GPS supprimées** avant envoi, stockage privé, liens temporaires | ✅ |
| Recherche d'utilisateurs et profils d'inconnus chargés depuis le serveur | ✅ |
| Suppression réelle du compte et de toutes les données | ✅ |
| Règles de sécurité (RLS) | ✅ **68 tests automatiques** sur PostgreSQL |

**Ce qui n'existe PAS encore** (honnêtement) :

- Aucun test sur un vrai projet Supabase ni sur un téléphone : il faut tes clés (voir plus bas).
- Pas de mode hors-ligne en mode connecté : sans réseau, l'app affiche une erreur et propose de réessayer. Rien n'est conservé sur le téléphone après déconnexion (choix de confidentialité).
- Le feed charge les 100 dernières expériences partagées (pas encore de pagination serveur).
- Notifications push : seules les notifications internes à l'app existent.

---

## Choix techniques (en clair)

| Besoin | Choix | Pourquoi |
| --- | --- | --- |
| Base de l'app | **Expo SDK 57**, React Native 0.86, TypeScript strict | Un seul code pour iOS et Android, mises à jour faciles |
| Navigation | **Expo Router** (fichiers dans `src/app/`) | Chaque fichier = un écran, liens profonds gratuits |
| Carte | **react-native-maps** (Apple Plans sur iOS, Google Maps sur Android) | Fonctionne dans Expo Go **sans compte ni clé**, donc testable tout de suite. Mapbox exige un « development build » et un compte payant au-delà d'un quota ; on pourra y passer plus tard si on veut un style de carte 100 % personnalisé. |
| Formulaires | React Hook Form + Zod | Validation fiable, messages clairs |
| Données | Zustand (cache local) + Supabase | Les écrans lisent un cache unique ; en mode connecté il est rempli par le serveur et chaque action y est envoyée |
| Images | expo-image | Cache et transitions performantes |
| Tests | Jest (jest-expo) + Testing Library | Standard Expo |

Données serveur : `@supabase/supabase-js` (+ `expo-image-manipulator` pour nettoyer les photos).

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

- En mode connecté, ces règles sont imposées **par la base de données** (Row Level Security) et testées automatiquement (`npm run test:db`). Le filtre côté app n'est qu'une seconde barrière.
- Photos : métadonnées (dont GPS) supprimées avant envoi, compartiments de stockage privés, liens signés valables 1 h.
- Mots de passe : 8 caractères minimum avec lettre et chiffre ; messages d'erreur qui ne révèlent pas si un e-mail a un compte.

Risques restants à traiter avant une bêta publique : modération des contenus publics, signalement et blocage d'utilisateurs, limitation anti-spam des demandes d'amitié, politique de confidentialité / CGU rédigées, envoi d'e-mails via un SMTP dédié.

---

## Configuration à prévoir

| Quoi | Quand | Où |
| --- | --- | --- |
| Projet **Supabase** (URL + clé `anon`) | **Maintenant** — pas-à-pas dans [`supabase/README.md`](supabase/README.md) | `.env.local` → `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` |
| Clé **Google Maps SDK Android** | Avant le premier build Android de production (pas nécessaire avec Expo Go) | Plugin `react-native-maps` dans `app.json` |
| Compte **Expo (EAS)** | Builds iOS/Android | `npx eas-cli@latest login` |
| Compte **Apple Developer** (99 $/an) et **Google Play Console** (25 $) | Bêta privée (TestFlight / test interne) | — |

Ne jamais mettre la clé `service_role` de Supabase dans l'app.

---

## Feuille de route

- [x] **Phase 1** — Architecture, Expo + TypeScript, navigation, design system
- [x] **Phase 2** — Prototype navigable des 5 onglets + écrans secondaires, données de démo
- [x] **Phase 3** — Supabase : migration SQL, RLS testée (68 vérifications), authentification e-mail, stockage photos privé
- [x] **Phase 4** — Écrans branchés sur Supabase (cache local + envoi optimiste + resynchronisation) — *à valider sur un vrai projet*
- [ ] **Phase 4 bis** — pagination serveur du feed, mode hors-ligne, recherche de lieux enrichie
- [ ] **Phase 5** — Tests RLS automatisés, tests de parcours, accessibilité
- [ ] **Phase 6** — EAS Build, icône et splash définitifs, fiches stores, bêta privée

---

## Vérification manuelle après la mise en ligne de Supabase

À faire une fois avec **deux téléphones ou deux comptes** (A et B) :

1. A s'inscrit → reçoit l'e-mail → confirme → se connecte → écran « Présente-toi ».
2. A ajoute 3 expériences : une **privée**, une **amis**, une **publique** (avec photo).
3. B s'inscrit, cherche A → ne voit que la publique sur son profil.
4. B envoie une demande ; A reçoit la notification et accepte → B voit maintenant l'expérience « amis », **jamais** la privée.
5. B réagit et commente ; A reçoit les notifications.
6. A retire B de ses amis → l'expérience « amis » disparaît chez B (tirer pour rafraîchir le feed).
7. Mot de passe oublié depuis l'écran de connexion → lien reçu → nouveau mot de passe accepté.
8. A supprime son compte (Confidentialité) → retour à la connexion, ses expériences ont disparu chez B.
