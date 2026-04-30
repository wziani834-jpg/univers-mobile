# CLAUDE.md

## Projet

`Univers Mobile` est une landing page statique en français pour une boutique de réparation de téléphones.

Le dépôt contient actuellement :

- `index.html` : structure de la page
- `styles.css` : styles visuels et responsive

## Objectif du site

Le site sert à présenter :

- la marque `Univers Mobile`
- les services de réparation
- les tarifs indicatifs
- un bloc "À propos"
- un formulaire de contact

## Règles d'édition

- Préserver la structure simple du site statique.
- Éviter d'introduire une dépendance ou un framework inutile.
- Garder le design responsive.
- Conserver les ancres de navigation internes (`#services`, `#apropos`, `#contact`).
- Si du texte en français est modifié, l'enregistrer en UTF-8 et vérifier les accents.
- Ne pas casser les classes CSS existantes sans raison.

## Conventions actuelles

- HTML sémantique simple
- CSS organisé par sections visuelles
- palette bleue claire avec cartes blanches et ombres légères
- mise en page basée sur `grid` et `flex`

## Points d'attention

- Le site est actuellement statique : le formulaire n'a pas de backend connecté.
- Le logo est chargé depuis `./logo.png`; vérifier qu'il existe avant de modifier le header.
- Les CTA principaux sont `Voir les tarifs` et `Demander un devis`.

## Lancer le projet

Il n'y a pas de build.

Pour tester :

- ouvrir `index.html` dans un navigateur
- ou servir le dossier avec un petit serveur local si besoin

## Priorités si tu modifies le projet

1. Garder le site lisible sur mobile.
2. Conserver la clarté du message commercial.
3. Éviter les changements visuels trop lourds sans nécessité.
