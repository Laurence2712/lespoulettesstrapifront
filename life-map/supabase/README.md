# Backend Supabase — LIFE MAP

Tout le backend tient dans une migration SQL : `migrations/20261001000000_init.sql`.
La sécurité est appliquée **par la base de données** (Row Level Security). L'app n'utilise que la clé publique `anon` + le jeton de l'utilisateur connecté : elle ne peut jamais obtenir une ligne que la base refuse.

## Mettre en ligne (une seule fois, ~10 minutes)

1. Crée un projet sur [supabase.com](https://supabase.com) (région Europe, ex. Frankfurt).
2. **SQL Editor** → colle le contenu de `migrations/20261001000000_init.sql` → *Run*.
   (Ou, avec la CLI : `npx supabase link --project-ref <ref>` puis `npx supabase db push`.)
3. **Authentication → Sign In / Providers → Email** : activé, « Confirm email » activé.
4. **Authentication → URL Configuration** :
   - *Site URL* : `lifemap://`
   - *Redirect URLs* : ajoute `lifemap://**` et, pour tester avec Expo Go, `exp://**`
5. **Project Settings → API** : copie *Project URL* et la clé *anon public* dans `life-map/.env.local` :
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
6. Relance `npm start`. L'app passe automatiquement du mode démo au mode connecté.

⚠️ Ne mets **jamais** la clé `service_role` dans l'app ni dans le dépôt.

Pour la production, configure un envoi d'e-mails dédié (Authentication → Emails → SMTP, ex. Resend ou Brevo) : le service d'e-mail intégré de Supabase est limité à quelques messages par heure.

## Schéma

| Table | Contenu | Points clés |
| --- | --- | --- |
| `profiles` | nom, identifiant, bio, avatar, profil trouvable, visibilité par défaut | Créé automatiquement à l'inscription. Identifiant unique `[a-z0-9._]{3,24}`. |
| `experiences` | titre, note, catégorie, date, lieu, latitude/longitude, visibilité | Privé par défaut. Date non future, coordonnées valides et par paire. |
| `experience_media` | photos d'une expérience (chemin dans le stockage, dimensions, ordre) | 6 photos max. Chemin obligatoirement `<propriétaire>/<expérience>/…`. |
| `friendships` | demande `pending` → `accepted` | Une seule relation par paire. Seul le destinataire accepte. |
| `reactions` | une réaction par personne et par expérience (`love`, `wow`, `inspired`) | |
| `comments` | 1 à 500 caractères | Non modifiables ; supprimables par l'auteur ou le propriétaire de l'expérience. |
| `notifications` | demande d'ami, acceptation, réaction, commentaire | Créées uniquement par des déclencheurs serveur (impossible à falsifier). |

Stockage : deux compartiments **privés** — `experience-media` (10 Mo, images) et `avatars` (2 Mo). Les photos ne sont accessibles qu'à travers des liens signés valables 1 h, et seulement si l'expérience est visible pour la personne qui demande.

## Règles d'accès (RLS)

| Qui | Expérience privée | Amis | Publique |
| --- | --- | --- | --- |
| Propriétaire | ✅ lire / modifier / supprimer | ✅ | ✅ |
| Ami **accepté** | ❌ | ✅ lire, réagir, commenter | ✅ |
| Demande en attente | ❌ | ❌ | ✅ |
| Autre utilisateur connecté | ❌ | ❌ | ✅ |
| Visiteur non connecté | ❌ | ❌ | ❌ |

Autres garanties : personne ne peut créer, modifier ou supprimer au nom d'un autre ; le propriétaire d'une expérience ne peut pas être changé ; un profil masqué n'est visible que des amis ; retirer un ami lui retire immédiatement l'accès au contenu « Amis ».

**Suppression de compte (RGPD)** : l'app supprime d'abord les fichiers de l'utilisateur via l'API Storage, puis appelle `delete_my_account()`, qui supprime le compte et, en cascade, toutes ses données.

## Tests

`supabase/tests/rls.test.sql` contient **68 vérifications** (matrice de visibilité, tentatives de fraude, stockage, notifications, suppression de compte). Elles tournent sur un PostgreSQL ordinaire grâce à `supabase/tests/supabase_shim.sql`, qui reproduit les schémas `auth` et `storage` de Supabase :

```bash
npm run test:db      # nécessite PostgreSQL installé localement (psql, createdb)
```

La suite a été validée en « test de mutation » : en affaiblissant volontairement la règle « Amis », elle échoue bien.

Limite : le shim imite Supabase mais n'est pas Supabase. Après la mise en ligne, refais un test manuel avec deux comptes (voir la liste de vérification du README principal).
