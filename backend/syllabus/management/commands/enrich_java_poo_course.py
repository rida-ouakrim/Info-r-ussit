"""
enrich_java_poo_course.py
=========================
Enriches the Java OOP course with complete code examples for Encapsulation,
Inheritance, Polymorphism, Abstract classes, Interfaces, and Exception Handling.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

JAVA_CONTENT = r"""# Programmation Orientée Objet (POO) en Java

## Introduction

Java est un langage entièrement orienté objet, fortement typé et compilé vers du **bytecode** exécuté par la machine virtuelle Java (**JVM**).

Les 4 piliers de la POO en Java sont :
1. **Encapsulation** (Masquage des détails d'implémentation)
2. **Héritage** (Réutilisation et extension de classes avec `extends`)
3. **Polymorphisme** (Redéfinition de méthodes avec `@Override`)
4. **Abstraction** (Classes abstraites et interfaces avec `implements`)

---

## 1. Classes, Objets et Encapsulation

L'encapsulation consiste à rendre les attributs `private` et à fournir des méthodes d'accès publiques (`getters` et `setters`).

```java
public class Etudiant {
    // Attributs privés
    private String nom;
    private double note;

    // Constructeur
    public Etudiant(String nom, double note) {
        this.nom = nom;
        setNote(note); // Utilise le setter pour la validation
    }

    // Getters et Setters avec validation
    public String getNom() {
        return nom;
    }

    public double getNote() {
        return note;
    }

    public void setNote(double note) {
        if (note >= 0 && note <= 20) {
            this.note = note;
        } else {
            throw new IllegalArgumentException("La note doit être entre 0 et 20.");
        }
    }
}
```

---

## 2. Héritage (`extends`) et Mot-clé `super`

L'héritage permet à une classe fille d'hériter des attributs et méthodes de la classe mère.

```java
// Classe Mère
public class Personne {
    protected String nom;
    protected String email;

    public Personne(String nom, String email) {
        this.nom = nom;
        this.email = email;
    }

    public void afficher() {
        System.out.println("Nom: " + nom + ", Email: " + email);
    }
}

// Classe Fille
public class Enseignant extends Personne {
    private String specialite;

    public Enseignant(String nom, String email, String specialite) {
        super(nom, email); // Appel du constructeur de la classe mère
        this.specialite = specialite;
    }

    @Override
    public void afficher() {
        super.afficher();
        System.out.println("Spécialité: " + specialite);
    }
}
```

---

## 3. Interfaces et Abstraction

Une **interface** définit un contrat que les classes implémentantes doivent respecter.

```java
// Déclaration d'interface
public interface Evaluable {
    double calculerMoyenne();
    boolean estAdmis();
}

// Implémentation
public class EtudiantInformatique implements Evaluable {
    private double noteTP;
    private double noteExamen;

    public EtudiantInformatique(double noteTP, double noteExamen) {
        this.noteTP = noteTP;
        this.noteExamen = noteExamen;
    }

    @Override
    public double calculerMoyenne() {
        return (noteTP * 0.4) + (noteExamen * 0.6);
    }

    @Override
    public boolean estAdmis() {
        return calculerMoyenne() >= 10.0;
    }
}
```

---

## 4. Gestion des Exceptions (`try-catch-finally`)

```java
try {
    int resultat = 10 / 0;
} catch (ArithmeticException e) {
    System.err.println("Erreur : Division par zéro interdite !");
} finally {
    System.out.println("Bloc toujours exécuté (nettoyage ressources).");
}
```
"""

JAVA_EXAMPLES = r"""# Exemples de Code Complémentaires Java POO

## Exemple 1 : Polymorphisme avec une Liste de Formes Géométriques

```java
import java.util.ArrayList;
import java.util.List;

// Classe abstraite
abstract class Forme {
    public abstract double calculerAire();
}

class Cercle extends Forme {
    private double rayon;
    public Cercle(double rayon) { this.rayon = rayon; }
    @Override
    public double calculerAire() { return Math.PI * rayon * rayon; }
}

class Rectangle extends Forme {
    private double largeur, hauteur;
    public Rectangle(double l, double h) { this.largeur = l; this.hauteur = h; }
    @Override
    public double calculerAire() { return largeur * hauteur; }
}

public class Main {
    public static void main(String[] args) {
        List<Forme> formes = new ArrayList<>();
        formes.add(new Cercle(5.0));
        formes.add(new Rectangle(4.0, 6.0));

        // Polymorphisme : appel de calculerAire() adapté à chaque forme
        for (Forme f : formes) {
            System.out.println("Aire = " + f.calculerAire());
        }
    }
}
```

---

## Exemple 2 : Utilisation des Collections (List, Map, Set)

```java
import java.util.HashMap;
import java.util.Map;

public class TestMap {
    public static void main(String[] args) {
        Map<String, Double> notes = new HashMap<>();
        notes.put("Java", 18.5);
        notes.put("Réseaux", 16.0);
        notes.put("SQL", 17.0);

        for (Map.Entry<String, Double> entry : notes.entrySet()) {
            System.out.println("Matière: " + entry.getKey() + " → Note: " + entry.getValue());
        }
    }
}
```
"""

JAVA_ASTUCES = r"""# Astuces & Pièges Concours — Java POO

## ⚡ Piège 1 : String `==` vs `.equals()`
- `str1 == str2` compare les **références mémoire** (l'adresse).
- `str1.equals(str2)` compare le **contenu textuel** des deux chaînes.
Toujours utiliser `.equals()` pour comparer des objets String !

## ⚡ Piège 2 : Pas d'héritage multiple de classes en Java
En Java, une classe ne peut étendre (`extends`) qu'**une seule** classe mère.
En revanche, elle peut implémenter (`implements`) **plusieurs interfaces**.

## ⚡ Piège 3 : `Overloading` (Surcharge) vs `Overriding` (Redéfinition)
- **Overloading (Surcharge) :** Même nom de méthode dans la même classe mais paramètres différents.
- **Overriding (Redéfinition) :** Même signature dans la classe fille avec annotation `@Override`.

## ⚡ Piège 4 : Modificateurs d'accès Java

| Modificateur | Même Classe | Même Package | Sous-classe | Partout |
|--------------|-------------|--------------|-------------|---------|
| `private` | Oui | Non | Non | Non |
| `default` (aucun) | Oui | Oui | Non | Non |
| `protected` | Oui | Oui | Oui | Non |
| `public` | Oui | Oui | Oui | Oui |

## ⚡ Piège 5 : Constructeur par défaut
Si vous ne définissez AUCUN constructeur, Java fournit un constructeur par défaut sans argument.
Dès que vous définissez **un constructeur personnalisé**, le constructeur par défaut disparaît !
"""


class Command(BaseCommand):
    help = 'Enrich Java POO course content in database'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='DEV_PROG_WEB').first()
        if not subdomain:
            self.stderr.write("Subdomain DEV_PROG_WEB not found!")
            return

        course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Programmation Orientée Objet : Java POO (Classes, Héritage, Polymorphisme)",
            defaults={
                'content': JAVA_CONTENT,
                'examples': JAVA_EXAMPLES,
                'astuces': JAVA_ASTUCES,
            }
        )

        action = "Créé" if created else "Mis à jour"
        self.stdout.write(self.style.SUCCESS(f"[OK] Cours Java POO {action} ! (ID: {course.id})"))
