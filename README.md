# Nos 2 ans ❤️ — livre d'amour interactif en 3D

Un vrai livre en 3D, en HTML / CSS / JavaScript pur (aucune dépendance, aucun build).

## Lancer
Ouvrir `index.html` dans un navigateur, ou publier le dossier tel quel (GitHub Pages, Netlify…).

## Fonctionnalités
- Couverture bordeaux en cuir, dorure et titre « Nos 2 ans ❤️ ».
- Clic / toucher : le livre s'ouvre (animation 3D, ombres, reflets, épaisseur des pages).
- Page de garde sombre avec **cœur rouge en papier plié, en relief**, suspendu à un fil, qui tourne doucement.
- 18 pages (roses à baisers rouge à lèvres + feuilles lignées, ou pages blanches) en écriture manuscrite.
- Tourner les pages : tap, boutons, flèches du clavier, ou **glisser** pour suivre la page avec le doigt / la souris.
- Ouvrir / fermer le livre à tout moment (bouton « Fermer » : les pages se referment en cascade).
- Double page sur ordinateur et paysage, une page à la fois sur téléphone en portrait.
- Bruitage de pages synthétisé (désactivable).

## Modifier les textes
Bouton ✎ : touche un titre ou un texte pour l'écrire. Tout est enregistré automatiquement dans le navigateur
(`localStorage`). « Réinitialiser » remet les textes d'origine.
Les textes par défaut se changent aussi dans `script.js` (tableau `PAGES`, au début du fichier).
