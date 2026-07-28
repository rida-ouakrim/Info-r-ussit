import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONCOURS_DB = os.path.join(BASE_DIR, "concours.db")
DJANGO_DB = os.path.join(BASE_DIR, "backend", "db.sqlite3")

OFFICIAL_WEB_COURSES = [
    {
        "title": "Programmation structurée en langage C",
        "content": """# Programmation structurée en langage C

## Présentation Générale
Le **Langage C** est un langage de programmation impératif, structuré et compilé à la base de l'informatique moderne et des concours d'accès au CRMEF.

Ce cours complet est découpé en **50 leçons vidéo et fiches de révision spécialisées** (style Coursera / Udemy). Sélectionnez une leçon ci-dessous pour visionner la vidéo explicative Google Drive HD et consulter les concepts associés.

---

### Aperçu du Programme :
1. **Bases & Syntaxe** : Variables, Types (`int`, `float`, `char`), Opérateurs, I/O (`printf`, `scanf`).
2. **Structures de Contrôle** : Conditionnelles (`if`, `switch`) et Boucles (`while`, `do...while`, `for`).
3. **Pointeurs & Mémoire** : Adresses (`&`), Pointers (`*`), Arithmétique des pointeurs, `sizeof()`.
4. **Allocation Dynamique** : `malloc()`, `calloc()`, `realloc()`, `free()` et prévention des fuites mémoire.
5. **Structures de Données** : `struct`, `union`, `typedef`, Listes Chaînées, Piles et Files en C.
6. **Fichiers & Modularité** : Manipulation de fichiers (`fopen`, `fread`, `fwrite`), headers `.h`.
""",
        "examples": """### Exemple de Code C Standard
```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Bienvenue dans le cours complet de Langage C (50 Leçons) !\\n");
    return 0;
}
```""",
        "astuces": """⚡ **Conseil Concours CRMEF :**
- Utilisez le sélecteur de leçons ci-dessus pour réviser chaque chapitre spécifique (ex: Pointeurs, Allocation Dynamique, Listes Chaînées).""",
        "video_url": "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing"
    },
    {
        "title": "Programmation Orientée Objet (Java/C++) : Concepts et principes",
        "content": """# Programmation Orientée Objet (POO) : Java et C++

## Concepts Fondamentaux de la POO
La Programmation Orientée Objet repose sur 4 piliers majeurs :

### 1. L'Encapsulation
Masquage des détails internes d'un objet en déclarant ses attributs `private` et en fournissant des accesseurs (`getters`) et mutateurs (`setters`).

### 2. L'Héritage (`extends` en Java, `: public` en C++)
Permet à une classe fille d'hériter des attributs et méthodes d'une classe mère.

### 3. Le Polymorphisme
Capacité d'une méthode à prendre plusieurs formes (Surcharge / Overloading et Redéfinition / Overriding avec `@Override`).

### 4. L'Abstraction
Classes abstraites (`abstract class`) et Interfaces (`interface`) définissant des contrats de comportement.
""",
        "examples": """### Exemple Java : Encapsulation et Héritage
```java
public class Animal {
    protected String nom;
    public Animal(String nom) { this.nom = nom; }
    public void emettreSon() { System.out.println("Son d'animal"); }
}

public class Chien extends Animal {
    public Chien(String nom) { super(nom); }
    @Override
    public void emettreSon() { System.out.println("Aboiement : Ouaf !"); }
}
```""",
        "astuces": """⚡ **Questions Fréquentes Concours :**
- Différence entre **surcharge (overloading)** (même nom, arguments différents dans une même classe) et **redéfinition (overriding)** (même signature dans une classe fille).
- En Java, l'héritage multiple de classes est **interdit** (utilisez les `interface`).""",
        "video_url": None
    },
    {
        "title": "Technologies Web côté client : HTML5, CSS3, JavaScript",
        "content": """# Technologies Web Côté Client (Front-End)

## 1. HTML5 (Structure)
Balises sémantiques modernes (`<header>`, `<nav>`, `<article>`, `<section>`, `<footer>`, `<canvas>`).

## 2. CSS3 (Stylisme & Responsive)
- **Flexbox** : Alignement unidimensionnel (`display: flex`).
- **CSS Grid** : Layout bidimensionnel (`display: grid`).
- **Media Queries** : Modèles d'adaptation multi-écrans (`@media (max-width: 768px)`).

## 3. JavaScript (Dynamisme & DOM)
Langage de script exécuté par le navigateur (ES6+) :
- Variables : `const`, `let` (portée bloc).
- Manipulation DOM : `document.querySelector()`, `addEventListener()`.
- Programmation Asynchrone : `Promises`, `async/await`, `fetch()`.
""",
        "examples": """### Exemple JavaScript : Événement et Modification DOM
```javascript
const btn = document.querySelector('#monBouton');
btn.addEventListener('click', async () => {
    const response = await fetch('/api/donnees/');
    const data = await response.json();
    console.log(data);
});
```""",
        "astuces": """⚡ **Règle Concours :**
- `==` compare avec conversion implicite de type (`"5" == 5` est VRAI).
- `===` compare la valeur ET le type sans conversion (`"5" === 5` est FAUX).""",
        "video_url": None
    },
    {
        "title": "Développement dynamique côté serveur : PHP et SGBD MySQL",
        "content": """# Développement Web Côté Serveur (Back-End) : PHP & MySQL

## 1. Bases de PHP
Langage de script serveur exécuté avant le rendu HTML.
Variables commençant par `$`, superglobales (`$_GET`, `$_POST`, `$_SESSION`, `$_COOKIE`).

## 2. Connexion aux Bases de Données avec PDO
Sécurisation contre les **injections SQL** grâce aux **requêtes préparées**.

## 3. Architecture MVC (Modèle - Vue - Contrôleur)
- **Modèle** : Gestion des données et requêtes SQL.
- **Vue** : Affichage de l'interface utilisateur.
- **Contrôleur** : Logique applicative et traitement des formulaires.
""",
        "examples": """### Exemple PHP PDO : Requête Préparée Sécurisée
```php
<?php
$pdo = new PDO('mysql:host=localhost;dbname=crmef', 'root', '');
$stmt = $pdo->prepare('SELECT * FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
$user = $stmt->fetch();
?>
```""",
        "astuces": """⚡ **Sécurité Concours :**
- Ne jamais concaténer directement les saisies utilisateurs dans une requête SQL (`SELECT * WHERE user = '` . $_POST['user'] . `'`) ! Utiliser toujours `prepare()` et `execute()`.""",
        "video_url": None
    }
]

for db_path in [CONCOURS_DB, DJANGO_DB]:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        table_name = "courses" if db_path == CONCOURS_DB else "syllabus_course"
        col = "subdomain_code" if db_path == CONCOURS_DB else "subdomain_id"

        cursor.execute(f"DELETE FROM {table_name} WHERE {col} = 'DEV_PROG_WEB'")

        for item in OFFICIAL_WEB_COURSES:
            if db_path == CONCOURS_DB:
                cursor.execute(f"""
                    INSERT INTO courses (subdomain_code, title, content, examples, astuces, video_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, ('DEV_PROG_WEB', item['title'], item['content'], item['examples'], item['astuces'], item['video_url']))
            else:
                cursor.execute(f"""
                    INSERT INTO syllabus_course (subdomain_id, title, content, examples, astuces, video_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, ('DEV_PROG_WEB', item['title'], item['content'], item['examples'], item['astuces'], item['video_url']))

        conn.commit()
        print(f"Restored 4 official DEV_PROG_WEB courses in: {db_path}")
        conn.close()

print("Subdomain DEV_PROG_WEB restored with all 4 official courses (C, Java/POO, HTML/CSS/JS, PHP/MySQL)!")
