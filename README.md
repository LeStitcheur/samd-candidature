# SAMD — Alynia RP

Dossier de candidature d’Aménadiel Belladonna à la direction du SAMD.
Site développé avec React et Vite, en JavaScript.

## Lancer le site

Avec Node.js 22.12 ou plus récent :

```sh
npm install
npm run dev
```

Le site est accessible sur http://127.0.0.1:8080.

## Modifier le contenu

Les textes sont dans `src/content.js` et `src/App.jsx`, les styles dans
`src/styles.css` et les images dans `public/assets/`.

## Publier

```sh
npm run deploy
```

La commande compile le site, enregistre les modifications dans Git et les envoie
sur GitHub. Vercel publie ensuite le site si le dépôt y est connecté.
Pour compiler sans publier : `npm run build`.

## Avatar Discord

Renseigner `DISCORD_USER_ID` et `DISCORD_BOT_TOKEN` dans les variables
d’environnement du projet Vercel, puis redéployer. Pour travailler en local,
copier `.env.example` vers `.env.local`, compléter les valeurs et redémarrer Vite.
Ne pas ajouter le jeton dans le code.

Projet RP non affilié à Rockstar Games. Les crédits des visuels et de la carte
figurent en bas du site.
