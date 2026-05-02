# Configuration Google Search Console

Site : https://univers-mobile.store

## Étapes à faire dans Google Search Console

1. Aller sur https://search.google.com/search-console
2. Cliquer sur `Ajouter une propriété`.
3. Choisir `Préfixe de l'URL`.
4. Entrer exactement :

```text
https://univers-mobile.store/
```

5. Choisir une méthode de validation.

Méthode recommandée si tu n'as pas accès au DNS : `Balise HTML`.

Google donnera une balise du type :

```html
<meta name="google-site-verification" content="CODE_GOOGLE_ICI" />
```

6. Envoyer cette balise au développeur pour l'ajouter dans le `<head>` de `index.html`.
7. Une fois la balise publiée sur le site, cliquer sur `Valider` dans Google Search Console.

## Soumettre le sitemap

Une fois la propriété validée :

1. Aller dans `Sitemaps`.
2. Ajouter :

```text
sitemap.xml
```

3. Valider.

URL complète du sitemap :

```text
https://univers-mobile.store/sitemap.xml
```

## À vérifier après publication

- `https://univers-mobile.store/robots.txt` doit afficher le sitemap.
- `https://univers-mobile.store/sitemap.xml` doit être accessible.
- Google Search Console ne doit pas afficher d'erreur d'indexation.
- La page d'accueil doit être demandée à l'indexation après validation.
