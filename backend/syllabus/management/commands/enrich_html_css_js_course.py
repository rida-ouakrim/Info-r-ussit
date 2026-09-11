"""
enrich_html_css_js_course.py
============================
Enriches the HTML/CSS/JavaScript course with before/after visual examples for tags,
CSS properties, and JS DOM manipulations, satisfying the user's specific request.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

HTML_CONTENT = r"""# Développeur Web Frontend : HTML5, CSS3 & JavaScript (ES6+)

## Introduction

Le développement web frontend s'appuie sur la trilogie fondamentale :
- **HTML5** : Structure et sémantique du contenu
- **CSS3** : Présentation, mise en page et styles visuels
- **JavaScript (ES6+)** : Dynamisme, interactivité et manipulation du DOM

---

## 1. HTML5 — Balises Clés et Structure Sémantique

### 1.1 Structure de base d'un document HTML5

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Site Web</title>
</head>
<body>
    <header><h1>En-tête du site</h1></header>
    <main><p>Contenu principal...</p></main>
    <footer><p>© 2026 Concours Info</p></footer>
</body>
</html>
```

### 1.2 Balises Sémantiques HTML5

L'utilisation des balises sémantiques est essentielle pour le SEO et l'accessibilité :
- `<header>` : En-tête de page ou de section
- `<nav>` : Liens de navigation
- `<main>` : Contenu principal unique de la page
- `<article>` : Contenu autonome (article de blog, actualité)
- `<section>` : Section thématique du document
- `<aside>` : Contenu secondaire lié (sidebar)
- `<footer>` : Pied de page

---

## 2. CSS3 — Styles, Flexbox & Grid

### 2.1 Le Modèle de Boîte (Box Model)

Chaque élément HTML est représenté par une boîte rectangulaire composée de :
1. **Content** : Le contenu réel (texte, image)
2. **Padding** : L'espace interne entre le contenu et la bordure
3. **Border** : La bordure autour du padding
4. **Margin** : L'espace externe séparant l'élément des autres

```css
.box {
    width: 300px;
    padding: 20px;
    border: 2px solid #3b82f6;
    margin: 15px;
    box-sizing: border-box; /* Recommandé : inclut padding et border dans width */
}
```

### 2.2 Layout Flexbox

Flexbox est idéal pour aligner des éléments sur un seul axe (ligne ou colonne).

```css
.flex-container {
    display: flex;
    justify-content: space-between; /* Alignement horizontal */
    align-items: center;            /* Alignement vertical */
    gap: 16px;                      /* Espacement entre les enfants */
}
```

---

## 3. JavaScript (ES6+) — DOM, Événements & Asynchronisme

### 3.1 Manipulation du DOM

```javascript
// Sélection d'éléments
const btn = document.querySelector('#myBtn');
const title = document.querySelector('h1');

// Modification de contenu et style
title.textContent = "Nouveau Titre !";
title.classList.add('text-active');

// Écouteur d'événement
btn.addEventListener('click', (event) => {
    alert('Bouton cliqué !');
});
```

### 3.2 Requêtes HTTP avec `fetch()` (API Asynchrone)

```javascript
async function loadData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Erreur :', error);
    }
}
```
"""

HTML_EXAMPLES = r"""# Exemples Avant / Après (Démonstrations Visuelles des Balises et Styles)

Voici la démonstration du rendu visuel de chaque balise HTML, style CSS et script JavaScript (effet avant et après application) :

---

## 1. Titres HTML (`<h1>` à `<h3>`)

### 🔴 Avant (Texte brut sans balises) :
```text
Mon Titre Principal
Mon Sous-Titre
Mon Titre de Section
```
*Rendu visuel :* Tout le texte s'affiche sur une seule ligne en taille normale sans aucun relief.

### 🟢 Après (Avec balises HTML `<h1>`, `<h2>`, `<h3>`) :
```html
<h1>Mon Titre Principal</h1>
<h2>Mon Sous-Titre</h2>
### Mon Titre de Section
```
*Rendu visuel :*
- **`<h1>`** : Affiche **Mon Titre Principal** en très gros texte (2em), gras, séparé du reste.
- **`<h2>`** : Affiche **Mon Sous-Titre** en taille moyenne-haute (1.5em), gras.
- **`<h3>`** : Affiche **Mon Titre de Section** en taille moyenne (1.17em), gras.

---

## 2. Balise de Mise en Forme (`<strong>`, `<em>`, `<mark>`)

### 🔴 Avant (Texte simple) :
```html
Attention : Ce cours est important pour l'examen.
```
*Rendu visuel :* "Attention : Ce cours est important pour l'examen." (texte plat)

### 🟢 Après (Avec mise en valeur sémantique) :
```html
<strong>Attention :</strong> Ce cours est <em>très important</em> pour <mark>l'examen</mark>.
```
*Rendu visuel :*
- **Attention :** s'affiche en **gras foncé**
- *très important* s'affiche en *italique*
- <mark>l'examen</mark> s'affiche sur **fond jaune fluorescent**

---

## 3. Mise en Page CSS Flexbox

### 🔴 Avant (Mise en page standard des bloc HTML `<div>`) :
```html
<div>Option 1</div>
<div>Option 2</div>
<div>Option 3</div>
```
*Rendu visuel :* Les 3 blocs se superposent verticalement (les uns en dessous des autres) en prenant 100% de la largeur.

### 🟢 Après (Avec CSS `display: flex; justify-content: space-between;`) :
```html
<div style="display: flex; justify-content: space-between; gap: 10px;">
    <div style="background: #e0f2fe; padding: 10px;">Option 1</div>
    <div style="background: #e0f2fe; padding: 10px;">Option 2</div>
    <div style="background: #e0f2fe; padding: 10px;">Option 3</div>
</div>
```
*Rendu visuel :* Les 3 options sont désormais alignées **horizontalement sur la même ligne**, réparties équitablement avec un bel espace entre elles.

---

## 4. Bouton Interactif avec JavaScript (DOM Event)

### 🔴 Avant (Bouton HTML statique sans JS) :
```html
<button id="likeBtn">❤️ J'aime (0)</button>
```
*Rendu visuel :* Le bouton s'affiche mais rien ne se passe quand l'utilisateur clique dessus.

### 🟢 Après (Avec écouteur d'événement JavaScript) :
```javascript
let count = 0;
const btn = document.querySelector('#likeBtn');
btn.addEventListener('click', () => {
    count++;
    btn.textContent = `❤️ J'aime (${count})`;
    btn.style.backgroundColor = '#ef4444';
    btn.style.color = '#ffffff';
});
```
*Rendu visuel :* À chaque clic, le compteur augmente instantanément (1, 2, 3...) et le bouton **devient rouge vif** avec du texte blanc !
"""

HTML_ASTUCES = r"""# Astuces & Pièges Concours — HTML, CSS & JavaScript

## ⚡ Piège 1 : `<script>` dans le `<head>` sans `defer`
Si vous placez `<script src="app.js"></script>` dans le `<head>` sans l'attribut `defer`, le script s'exécute **avant** que le HTML ne soit chargé, et `document.querySelector()` renverra `null` !
Solution : Utiliser `<script src="app.js" defer></script>`.

## ⚡ Piège 2 : `==` vs `===` en JavaScript
- `5 == "5"` vaut `true` (conversion implicite de type)
- `5 === "5"` vaut `false` (comparaison stricte de valeur ET de type)
Toujours utiliser **`===`** !

## ⚡ Piège 3 : `var` vs `let` vs `const`
- `var` : portée de fonction (function scope), sujet au hoisting (A ÉVITER).
- `let` : portée de bloc (block scope), réassignable.
- `const` : portée de bloc, **non réassignable** (mais les propriétés d'un objet/tableau const restent mutables !).

## ⚡ Piège 4 : `box-sizing: border-box`
Par défaut (`content-box`), la largeur totale d'un élément = `width + padding + border`.
Avec `box-sizing: border-box`, la largeur déclarée `width` inclut le `padding` et le `border`.

## ⚡ Piège 5 : Différence entre `display: none` et `visibility: hidden`
- `display: none` : L'élément est totalement retiré du flux (ne prend aucun espace).
- `visibility: hidden` : L'élément est invisible mais **conserve son espace réservé** sur la page.
"""


class Command(BaseCommand):
    help = 'Enrich HTML/CSS/JS course content with before/after visual examples'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='DEV_PROG_WEB').first()
        if not subdomain:
            self.stderr.write("Subdomain DEV_PROG_WEB not found!")
            return

        course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Programmation Web Frontend : HTML5, CSS3 & JavaScript ES6+ (avec illustrations)",
            defaults={
                'content': HTML_CONTENT,
                'examples': HTML_EXAMPLES,
                'astuces': HTML_ASTUCES,
            }
        )

        action = "Créé" if created else "Mis à jour"
        self.stdout.write(self.style.SUCCESS(f"[OK] Cours HTML/CSS/JS {action} ! (ID: {course.id})"))
