# SAMD — Alynia RP

Site de candidature d’**Aménadiel Belladonna** à la reprise du SAMD. Projet **React + Vite**, en JavaScript, intégralement à la racine du dépôt.

L’ancienne version autonome est conservée dans `.archive/samd-vanilla/` (ignorée par Git). Le dossier `site/` n’existe plus et n’est plus utilisé.

## Démarrer

Node.js 22.12+ ou 24 recommandé.

```sh
npm install
npm run dev
```

Ouvrir **http://127.0.0.1:8080**. Vite actualise automatiquement le site pendant les modifications.

```sh
npm run build
npm run preview
```

Le build statique est généré dans `dist/`, publiable sur un hébergement statique. Arrêter le serveur de développement avant de lancer `preview`, qui utilise le même port.

## Structure

- `src/App.jsx` : chapitres React, navigation, profils, organigramme, engagements et horizons.
- `src/components/Tabs.jsx` : onglets avec navigation au clavier.
- `src/components/PillboxMap.jsx` : scène Three.js, repère de l’hôpital, caméra et contrôles.
- `src/content.js` : informations RP/HRP, hiérarchie, changements et objectifs.
- `src/styles.css` : design, palette et responsive. Fond principal **#292929**, bordeaux **#830705**.
- `public/assets/samd-logo.png` : logo fourni, utilisé dans l’en-tête, le pied de page et comme favicon.
- `public/assets/amenadiel.png` : illustration fournie du personnage, utilisée sans modification.
- `public/map/` : données locales de relief GTA V et licence MIT.
- `scripts/prepare-terrain.mjs` : script facultatif de régénération du relief.

## Carte 3D ciblée sur Pillbox Hill

La carte est rendue localement en **Three.js**, sans iframe Sketchfab ni clé API. Elle charge seulement lorsque sa section approche de l’écran. La caméra et le repère visent l’accueil de Pillbox : **X 308.36, Y −595.25, Z 43.28**, coordonnées de référence de [QBCore](https://github.com/qbcore-framework/qb-ambulancejob/blob/main/config.lua).

Le relief représente une zone de **2,2 × 2,2 km**, reconstruite à partir des altitudes publiques de GTA V, échantillonnées tous les 5 mètres. Les bâtiments sont donc simplifiés, sans intérieurs ni textures du mapping Alynia RP. Le repère reste rattaché aux coordonnées de l’hôpital pendant la rotation et le zoom. Le bouton de recentrage rétablit la caméra initiale ; une vue du dessus est également disponible.

Commandes : glisser pour tourner, clic droit pour déplacer, molette/pincement pour zoomer, boutons pour zoomer, tourner et recentrer. Les commandes principales sont accessibles au clavier. En cas d’indisponibilité WebGL, un message localisé et les coordonnées sont affichés ; la capture de l’hôpital reste accessible.

Les données embarquées font environ **389 Ko**. Il n’est pas nécessaire de télécharger la carte complète ni de lancer le script de préparation pour utiliser le projet. Pour les régénérer :

```sh
node scripts/prepare-terrain.mjs
```

Ce script récupère une tranche d’environ 74 Mo du fichier source avec une requête HTTP Range, puis en extrait le relief local. La licence est conservée dans `public/map/LICENSE.txt`.

## Contenu

Le dossier couvre l’entreprise, la présentation RP d’Aménadiel, la présentation HRP d’Alex, la hiérarchie, la localisation, la philosophie, les changements proposés, les trois horizons d’objectifs et l’évolution vers Océanic.

Les textes sont des propositions pour la candidature. L’expérience EMS sur Alynia RP, le précédent mandat de direction et les disponibilités proviennent des informations fournies. Aucun âge ni événement biographique non communiqué n’est inventé. Le passage vers Océanic est présenté comme une évolution à préparer et à valider avec le staff.

## Crédits

- Portrait d’Aménadiel et logo SAMD : fichiers fournis par le porteur du projet.
- Vue de Los Santos : GTA V / Rockstar Games, via [HDQWalls](https://hdqwalls.com/los-santos-gta-v-city-view-wallpaper).
- Capture de Pillbox Hill : GTA V / Rockstar Games, via [GTA Wiki](https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center), [miroir utilisé](https://lastlandrp.wixsite.com/lastland/lsmc).
- Altitudes : [Andreas1331/ragemp-gtav-heightmap](https://github.com/Andreas1331/ragemp-gtav-heightmap), Copyright (c) 2022 -Andreas, licence MIT.
- Icônes : Lucide. Polices : Inter et Inter Tight, chargées depuis Google Fonts avec polices système de secours.

Les crédits sont aussi accessibles dans le pied de page. Le dossier est une création RP fictive, sans affiliation à Rockstar Games. Les captures du jeu ne sont pas présentées comme étant sous licence libre.

## Vérification

Le build de production se vérifie avec `npm run build`. Vérifier également dans le navigateur les onglets RP/HRP, les grades, les engagements, les horizons, le menu mobile, la capture agrandie et les commandes de la carte.

## Publication GitHub → Vercel

Dépôt prévu : `LeStitcheur/samd-candidature` (privé). À connecter une seule fois à Vercel via **Add New → Project → Import Git Repository**, avec `main` comme branche de production et la racine `./`. `vercel.json` configure Vite, `npm ci`, le build et le dossier `dist`.

```sh
npm run deploy
# Avec un message de commit personnalisé :
npm run deploy -- "Mise à jour du dossier SAMD"
```

La commande s’écrit **sans `/` devant npm**. Elle vérifie la branche et le dépôt, compile le site, inclut les modifications non ignorées dans un commit, puis pousse sur GitHub. Une erreur de build empêche le commit et l’envoi. Un push rejeté n’est jamais forcé : corriger le problème Git puis relancer. Git doit être installé, l’identité de commit configurée et l’authentification GitHub disponible sur le poste.

Après connexion initiale, Vercel déploie automatiquement chaque nouveau commit de `main`. Le succès du push ne garantit pas celui du build distant : vérifier le statut dans Vercel. Sans changement ni commit en attente, aucun nouveau déploiement n’est déclenché. Aucun token Vercel n’est enregistré dans le projet.

Texture satellite : [Trusted-Studios/mapStyles](https://github.com/Trusted-Studios/mapStyles), tuiles `styleSatelite/5/{x}/{y}.jpg`, colonnes 12–18, lignes 20–25. Projection GTA : x = (0.02072 × X + 117.3) × 32, y = (−0.0205 × Y + 172.8) × 32. La texture est projetée sur le relief ; les façades restent simplifiées.


### Relief détaillé de Pillbox

Le kilomètre carré autour de Pillbox dispose d’un maillage à 2 mètres, raccordé au relief extérieur à 5 mètres. Les altitudes sont conservées à leur échelle réelle. Les façades procédurales ont été retirées. Ce maillage d’altitudes avec texture satellite reste une reconstruction approximative : il ne contient ni les façades exactes, ni les surplombs, ni les modèles 3D du jeu. Une reproduction fidèle exige les modèles et leurs textures. Les données détaillées ajoutent environ 502 Ko ; les ombres statiques sont calculées une seule fois.

Régénération facultative : `node scripts/prepare-terrain.mjs --detail`.
