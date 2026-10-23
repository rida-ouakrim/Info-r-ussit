/**
 * Cours Complet Java & Programmation Orientée Objet — inforéussite.online
 * 16 Modules • 23 Leçons Complètes • Préparation Concours & Entretiens Techniques
 */

export const javaLessons = [

  // ═══════════════════════════════════════════════════════
  // MODULE 1 — INTRODUCTION À JAVA & ÉCOSYSTÈME (L1-L3)
  // ═══════════════════════════════════════════════════════
  {
    num: 1,
    moduleId: 'java_mod_1',
    moduleTitle: 'Module 1 — Introduction à Java',
    title: "Histoire, Philosophie et Cycle d'Exécution de Java",
    duration: '25 min',
    content: `# Module 1 — Introduction à Java & Écosystème
# Leçon 1 : Histoire, Philosophie et Cycle d'Exécution de Java

---

## A. Introduction intuitive : La Tour de Babel Informatique

Avant Java, un programme compilé sur Windows Intel ne pouvait pas s'exécuter sur Linux ARM sans recompilation complète. Java résout ce problème en introduisant **le Bytecode**, une langue intermédiaire universelle.

> **"Write Once, Run Anywhere" — James Gosling (Sun Microsystems, 1995)**

---

## B. Historique et Genèse

- **1991** : James Gosling crée le langage **Oak** pour des appareils électroniques embarqués chez Sun Microsystems.
- **1995** : Renommé **Java**, il explose avec l'essor du Web grâce aux Applets sécurisées.
- **2010** : Rachat de Sun Microsystems par **Oracle Corporation**.
- **Aujourd'hui** : Versions LTS tous les 2 ans. Notre référence : **Java 17 LTS**.

---

## C. Les 10 Caractéristiques Officielles de Java (Questions de Concours)

| Caractéristique | Signification |
| :--- | :--- |
| **Simple** | Syntaxe proche du C++, sans pointeurs arithmétiques manuels ni héritage multiple de classes |
| **Orienté Objet** | Tout code appartient à une classe |
| **Robuste** | Typage fort, Garbage Collector, gestion obligatoire des exceptions |
| **Sécurisé** | Exécution sous contrôle strict de la JVM, bac à sable (sandbox) |
| **Neutre/Portable** | Bytecode indépendant de l'architecture processeur |
| **Interprété + JIT** | Démarrage rapide par interpréteur, puis optimisation par compilateur JIT |
| **Multithread** | Support natif de la concurrence |
| **Distribué** | Support natif TCP/IP, RMI |
| **Dynamique** | Chargement des classes à la demande (ClassLoader) |
| **Performant** | Grâce au compilateur JIT HotSpot |

---

## D. Le Cycle Complet d'Exécution d'un Programme Java

\`\`\`
   Fichier Source         Compilation       Bytecode           JVM             Exécution
  [Bonjour.java]  ──[javac]──>  [Bonjour.class]  ──[java]──>  [Résultat]
  (Code humain)              (Code portable)                 (Machine locale)
\`\`\`

### Étape 1 : Compilation avec javac
Le compilateur \`javac\` transforme le code source lisible par l'humain en **bytecode binaire portable** (instructions pour une machine virtuelle idéale, pas pour un processeur réel).

### Étape 2 : Exécution par la JVM
La **JVM (Java Virtual Machine)** lit le bytecode et l'exécute sur la machine locale réelle grâce à son moteur d'exécution hybride.

---

## E. Anatomie de la JVM — Les 3 Sous-systèmes Clés

### 1. Le ClassLoader (Chargeur de Classes)
Charge les fichiers \`.class\` en mémoire RAM en 3 phases :
- **Loading** : Recherche et charge le binaire \`.class\`
- **Linking** : Vérifie (Verification), alloue (Preparation), résout les références symboliques (Resolution)
- **Initialization** : Exécute les blocs statiques et initialise les variables statiques

### 2. Le Bytecode Verifier (Gardien de Sécurité)
Contrôle avant chaque exécution que :
- Le bytecode n'est pas corrompu ou falsifié
- Aucune opération mémoire illégale n'est tentée
- La pile d'exécution ne déborde pas

### 3. L'Execution Engine — Le Trio Gagnant

\`\`\`
Execution Engine {
  Interpréteur      → Exécute bytecode instruction par instruction (démarrage rapide)
  Compilateur JIT   → Détecte les "HotSpots" et compile en code machine natif (ultra-rapide)
  Garbage Collector → Libère automatiquement la mémoire des objets orphelins
}
\`\`\`

> [!TIP]
> Le **JIT (Just-In-Time)** est la raison pour laquelle Java moderne atteint des performances proches du C++ après une phase de "chauffe". Les programmes Java longs finissent souvent par tourner aussi vite que du C++ compilé.

---

## F. Comparatif Essentiel : Java vs C/C++ vs Python vs JavaScript

| Critère | C/C++ | Java | Python | JavaScript |
| :--- | :--- | :--- | :--- | :--- |
| **Typage** | Statique | Statique fort | Dynamique | Dynamique faible |
| **Exécution** | Compilation native | Hybride (Bytecode + JIT) | Interprété | Interprété + JIT (V8) |
| **Mémoire** | Manuelle (malloc/free) | **Automatique (GC)** | Automatique | Automatique |
| **Pointeurs** | Oui (arithmétique) | **Non** (références sécurisées) | Non | Non |
| **Portabilité** | Nulle (OS/CPU spécifique) | **Totale** (.class universel) | Source portable | Source portable |
| **Confusion fréquente** | — | ≠ JavaScript | — | ≠ Java |

---

## G. Différence JDK / JRE / JVM

![Schéma hiérarchique : JDK contient le JRE, qui contient la JVM](/images/jdk_jre_jvm_hierarchy.jpg)

\`\`\`
JDK (Java Development Kit)
├── Outils de développement : javac, jdb, javadoc, jar, javap
└── JRE (Java Runtime Environment)
    ├── Bibliothèques standards : java.lang, java.util, java.io...
    └── JVM (Java Virtual Machine)
        ├── ClassLoader
        ├── Bytecode Verifier
        └── Execution Engine (Interpréteur + JIT + Garbage Collector)
\`\`\`

> [!IMPORTANT]
> **Règle concours :**
> - Pour **compiler** un programme Java → besoin du **JDK** (et donc de \`javac\`)
> - Pour **exécuter** un programme Java → besoin du **JRE** (ou du JDK)
> - La **JVM** est spécifique à chaque système d'exploitation — c'est elle qui assure la portabilité du bytecode

---

## H. Erreurs et Pièges Classiques

### ❌ Piège 1 : Confondre Java et JavaScript
Java et JavaScript n'ont **aucun lien technique**. JavaScript a été renommé ainsi en 1995 pour des raisons marketing. Java est compilé, statiquement typé, tourne sur JVM. JavaScript est un langage de script dynamique pour navigateurs web.

### ❌ Piège 2 : Croire que Java est purement interprété
Java est **hybride** : compilé en bytecode par \`javac\`, puis interprété/JIT-compilé par la JVM.

### ❌ Piège 3 : La commande java avec extension .class
\`\`\`bash
java MonProgramme         # ✓ CORRECT — nom de la classe sans extension
java MonProgramme.class   # ✗ ERREUR — ClassNotFoundException: MonProgramme/class
\`\`\`

### ❌ Piège 4 : Croire que la JVM est portable
Le **bytecode** est portable. La **JVM** ne l'est pas — elle est propre à chaque OS/CPU.`,
    examples: `# Exemples du Chapitre 1

## Exemple 1 — Premier programme et commandes

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Bonjour depuis Java 17 !");
    }
}
\`\`\`

**Commandes en terminal :**
\`\`\`bash
javac HelloWorld.java   # Compilation → produit HelloWorld.class
java HelloWorld         # Exécution   → JAMAIS d'extension .class !
\`\`\`

**Sortie console :**
\`\`\`text
Bonjour depuis Java 17 !
\`\`\`

---

## Exemple 2 — Observation du Bytecode avec javap

\`\`\`java
public class Calcul {
    public static int additionner(int a, int b) {
        return a + b;
    }
}
\`\`\`

Commande \`javap -c Calcul\` révèle :
\`\`\`text
public static int additionner(int, int);
  Code:
     0: iload_0        // Charge a sur la pile
     1: iload_1        // Charge b sur la pile
     2: iadd           // Additionne les deux entiers
     3: ireturn        // Retourne le résultat
\`\`\`

Ces 4 opcodes d'1 octet chacun s'exécutent identiquement sur Intel x86, ARM ou Apple Silicon.`,
    astuces: `⚡ **Fiche Réflexe Concours — Leçon 1**

1. **Règle du nom de fichier** : Si la classe est \`public class MonApp\`, le fichier DOIT s'appeler \`MonApp.java\` (respect strict de la casse).

2. **Commandes magiques** :
   - \`javac Fichier.java\` → compile et crée \`Fichier.class\`
   - \`java NomClasse\` → exécute (sans extension !)
   - \`javap -c NomClasse\` → désassemble le bytecode

3. **Nouveauté Java 11+** : On peut exécuter directement un fichier source en une seule commande :
   \`\`\`bash
   java HelloWorld.java  # Compilation + Exécution en mémoire (sans créer .class)
   \`\`\`

4. **Mémo JDK/JRE/JVM** : D > R > V (JDK contient JRE qui contient JVM)

5. **Java ≠ JavaScript** — Question classique à piège !`,
    quiz: [
      {
        id: 1001,
        question_number: 'Q1',
        question_text: "Quel composant de l'écosystème Java est responsable de transformer le code source (.java) en bytecode (.class) ?",
        option_a: "La JVM (Java Virtual Machine)",
        option_b: "Le compilateur javac",
        option_c: "Le ClassLoader",
        option_d: "Le compilateur JIT",
        correct_option: 'B',
        explanation: "C'est l'outil `javac` (Java Compiler) qui effectue la phase de compilation hors ligne. La JVM, le ClassLoader et le JIT n'interviennent que lors de la phase d'exécution.",
        astuce: "Le 'c' de javac = Compiler. La JVM n'exécute que le résultat."
      },
      {
        id: 1002,
        question_number: 'Q2',
        question_text: "Quelle affirmation sur la portabilité de Java est EXACTE ?",
        option_a: "Le bytecode est spécifique à chaque système d'exploitation.",
        option_b: "La JVM est identique pour tous les systèmes d'exploitation.",
        option_c: "Le bytecode est universel, mais la JVM est spécifique à chaque OS.",
        option_d: "Java doit être recompilé sur chaque machine cible.",
        correct_option: 'C',
        explanation: "Le bytecode (.class) est 100% universel et portable. En revanche, la JVM est spécifique à chaque OS — c'est elle qui fait le pont avec le matériel local.",
        astuce: "Ce qui est portable = Bytecode. Ce qui n'est pas portable = JVM (adaptateur OS)."
      },
      {
        id: 1003,
        question_number: 'Q3',
        question_text: "Quelle commande permet d'exécuter correctement un programme dont la classe s'appelle `MonProgramme` ?",
        option_a: "java MonProgramme.java",
        option_b: "java MonProgramme.class",
        option_c: "javac MonProgramme",
        option_d: "java MonProgramme",
        correct_option: 'D',
        explanation: "La commande `java` attend le nom de la classe (MonProgramme) sans aucune extension de fichier. Ajouter .class cause une ClassNotFoundException.",
        astuce: "javac prend .java | java ne prend PAS d'extension."
      },
      {
        id: 1004,
        question_number: 'Q4',
        question_text: "Quel composant de la JVM convertit dynamiquement le bytecode fréquemment exécuté en code machine natif pour accélérer l'exécution ?",
        option_a: "Le Garbage Collector",
        option_b: "Le Compilateur JIT (Just-In-Time)",
        option_c: "Le Bytecode Verifier",
        option_d: "Le Bootstrap ClassLoader",
        correct_option: 'B',
        explanation: "Le compilateur JIT (HotSpot) surveille l'exécution et compile les 'points chauds' directement en instructions machine natives pour des performances maximales.",
        astuce: "JIT = Just-In-Time = Juste à temps. Il optimise le code chaud en temps réel."
      },
      {
        id: 1005,
        question_number: 'Q5',
        question_text: "Quelle relation d'inclusion décrit correctement l'architecture Java ?",
        option_a: "JVM ⊃ JRE ⊃ JDK",
        option_b: "JRE ⊃ JDK ⊃ JVM",
        option_c: "JDK ⊃ JRE ⊃ JVM",
        option_d: "JDK ⊃ JVM ⊃ JRE",
        correct_option: 'C',
        explanation: "JDK = JRE + outils de développement (javac, jdb...). JRE = JVM + bibliothèques standards. Donc JDK ⊃ JRE ⊃ JVM.",
        astuce: "Mémo alphabétique inversé : D > R > V = JDK contient JRE contient JVM."
      }
    ]
  },

  {
    num: 2,
    moduleId: 'java_mod_1',
    moduleTitle: 'Module 1 — Introduction à Java',
    title: "JDK, JRE et JVM : Rôles, Installation et Premier Programme",
    duration: '20 min',
    content: `# Module 1 — Leçon 2 : JDK, JRE et JVM — Rôles Détaillés et Premier Programme

---

## A. Les Outils du JDK en Détail

Le **JDK (Java Development Kit)** contient plusieurs outils essentiels que tout développeur doit connaître :

| Outil | Rôle |
| :--- | :--- |
| **javac** | Compilateur Java — traduit \`.java\` en \`.class\` |
| **java** | Lanceur JVM — exécute le bytecode \`.class\` |
| **javap** | Désassembleur — affiche le bytecode lisible |
| **javadoc** | Générateur de documentation HTML |
| **jar** | Archiveur — crée des fichiers \`.jar\` (Java Archive) |
| **jdb** | Débogueur Java |
| **jshell** | REPL Java (depuis Java 9) — testez du code sans créer de fichier |

---

## B. Installation et Configuration

### Installation du JDK 17 LTS

**Sur Ubuntu/Debian :**
\`\`\`bash
sudo apt update
sudo apt install openjdk-17-jdk
java --version   # Vérifie l'installation
javac --version  # Vérifie le compilateur
\`\`\`

**Sur Windows :**
- Télécharger depuis : https://adoptium.net/ (Temurin — distribution OpenJDK fiable)
- Installer et configurer \`JAVA_HOME\` dans les variables d'environnement

### Variables d'Environnement Indispensables

\`\`\`bash
JAVA_HOME = /usr/lib/jvm/java-17-openjdk-amd64   # Dossier racine du JDK
PATH = $PATH:$JAVA_HOME/bin                        # Ajoute les outils javac, java, etc.
\`\`\`

---

## C. Anatomie Complète d'un Programme Java Minimal

\`\`\`java
public class Bonjour {                              // Déclaration de la classe
    public static void main(String[] args) {        // Point d'entrée obligatoire
        System.out.println("Bienvenue en Java !");  // Instruction
    }                                               // Fin de la méthode main
}                                                   // Fin de la classe
\`\`\`

### Décryptage mot par mot de \`public static void main(String[] args)\` — Question N°1 des Concours

| Mot-clé | Rôle | Si absent |
| :--- | :--- | :--- |
| **public** | La JVM (externe) peut appeler cette méthode | Erreur : Main method not found |
| **static** | Appelée sans instancier la classe au préalable | Erreur : Main method is not static |
| **void** | Ne retourne aucune valeur à la JVM | Erreur de compilation |
| **main** | Nom conventionnel du point d'entrée | La JVM ne sait pas où démarrer |
| **String[] args** | Tableau des arguments de ligne de commande | Erreur si signature incorrecte |

---

## D. Affichage Console — System.out

\`\`\`java
System.out.println("Bonjour");    // Affiche + SAUTE une ligne
System.out.print("Bonjour");      // Affiche SANS sauter de ligne
System.out.printf("Âge : %d%n", 25);  // Affichage formaté (comme printf en C)

// Concaténation avec l'opérateur +
int score = 18;
System.out.println("Score : " + score + "/20");  // Score : 18/20
\`\`\`

---

## E. Saisie Clavier avec Scanner

\`\`\`java
import java.util.Scanner;   // Import obligatoire

public class Saisie {
    public static void main(String[] args) {
        Scanner clavier = new Scanner(System.in);  // Crée un lecteur clavier
        
        System.out.print("Entrez votre nom : ");
        String nom = clavier.nextLine();           // Lit une ligne de texte
        
        System.out.print("Entrez votre âge : ");
        int age = clavier.nextInt();               // Lit un entier
        
        System.out.println("Bonjour " + nom + ", vous avez " + age + " ans.");
        
        clavier.close();  // Bonne pratique : fermer le Scanner
    }
}
\`\`\`

### Méthodes de Scanner les plus utilisées

| Méthode | Type lu |
| :--- | :--- |
| \`nextLine()\` | Toute la ligne (String) |
| \`next()\` | Un mot (String) |
| \`nextInt()\` | Entier (int) |
| \`nextDouble()\` | Décimal (double) |
| \`nextBoolean()\` | Booléen (boolean) |

---

## F. Sensibilité à la Casse et Conventions de Nommage

Java est **strictement sensible à la casse** (case-sensitive) :
\`\`\`java
int age = 25;      // Variable 'age'
int Age = 30;      // Variable différente 'Age'
int AGE = 35;      // Variable différente 'AGE'
\`\`\`

### Conventions de Nommage Java (Standard Industriel)

| Élément | Convention | Exemple |
| :--- | :--- | :--- |
| **Classe** | PascalCase | \`CompteBancaire\`, \`EtudiantMaster\` |
| **Méthode** | camelCase | \`calculerSalaire()\`, \`getNom()\` |
| **Variable** | camelCase | \`montantTotal\`, \`nombreEtudiants\` |
| **Constante** | SCREAMING_SNAKE_CASE | \`TAUX_TVA\`, \`PI\` |
| **Package** | tout en minuscules | \`com.inforeussit.java\` |

---

## G. Erreurs Fréquentes

### Erreur 1 : Nom de classe ≠ Nom de fichier
\`\`\`java
// Fichier s'appelle : MonCode.java
public class Bonjour {  // ✗ ERREUR : class Bonjour is public, 
    // should be declared in a file named Bonjour.java
}

public class MonCode {  // ✓ CORRECT
}
\`\`\`

### Erreur 2 : Oubli des accolades ou points-virgules
\`\`\`java
System.out.println("Bonjour")   // ✗ ERREUR : point-virgule manquant
System.out.println("Bonjour");  // ✓ CORRECT

if (x > 0)
    System.out.println("positif");  // ✓ Valide (1 seule instruction)
    System.out.println("suite");    // ✗ Cette ligne n'est pas dans le if !
\`\`\``,
    examples: `# Exemples — Leçon 2

## Exemple 1 : Programme avec saisie et affichage

\`\`\`java
import java.util.Scanner;

public class CalculateurAge {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Année de naissance : ");
        int anneeNaissance = sc.nextInt();
        
        int agActuel = 2024 - anneeNaissance;
        System.out.println("Vous avez environ " + agActuel + " ans.");
        
        sc.close();
    }
}
\`\`\`

## Exemple 2 : JShell — Test rapide sans fichier (Java 9+)

\`\`\`bash
$ jshell
jshell> int x = 42;
x ==> 42
jshell> System.out.println("x vaut : " + x);
x vaut : 42
jshell> /exit
\`\`\`

JShell est idéal pour tester des expressions Java rapidement sans créer de fichier \`.java\`.`,
    astuces: `⚡ **Astuces et Pièges — Leçon 2**

1. **JAVA_HOME** doit pointer vers le JDK (pas le JRE !) pour que \`javac\` soit trouvé.

2. **Méthode main** : La signature exacte est \`public static void main(String[] args)\`. Java 21 autorise aussi \`void main()\` sans \`public static\` (preview feature), mais **en concours, utilisez toujours la signature complète**.

3. **Scanner et nextLine()** après nextInt() : Un problème classique ! Après un \`nextInt()\`, il faut appeler \`nextLine()\` en plus pour "vider" le saut de ligne résiduel avant de lire une chaîne.

4. **System.err** vs **System.out** : \`System.err.println()\` affiche sur le flux d'erreur standard (en rouge dans la console), à distinguer de \`System.out\`.`,
    quiz: [
      {
        id: 1101,
        question_number: 'Q1',
        question_text: "Quelle est la signature correcte de la méthode point d'entrée d'un programme Java standard ?",
        option_a: "public void main(String args)",
        option_b: "public static void main(String[] args)",
        option_c: "static void main()",
        option_d: "private static void main(String[] args)",
        correct_option: 'B',
        explanation: "La signature standard est exactement `public static void main(String[] args)`. `public` : accessible par la JVM. `static` : sans instanciation. `void` : retourne rien. `String[] args` : arguments ligne de commande.",
        astuce: "Mémo : 'Public Static Void Main String args' — jamais de deviation en concours !"
      },
      {
        id: 1102,
        question_number: 'Q2',
        question_text: "Quelle méthode de System.out passe à la ligne après l'affichage ?",
        option_a: "System.out.print()",
        option_b: "System.out.printf()",
        option_c: "System.out.println()",
        option_d: "System.out.write()",
        correct_option: 'C',
        explanation: "println() affiche le texte ET ajoute un saut de ligne (\\n) à la fin. print() affiche sans sauter de ligne. printf() formate comme en C.",
        astuce: "ln dans println = LinefeedN = saut de ligne."
      },
      {
        id: 1103,
        question_number: 'Q3',
        question_text: "Selon les conventions de nommage Java, comment doit s'appeler une classe représentant un compte bancaire ?",
        option_a: "comptebancaire",
        option_b: "compte_bancaire",
        option_c: "CompteBancaire",
        option_d: "COMPTE_BANCAIRE",
        correct_option: 'C',
        explanation: "Les classes Java utilisent la convention PascalCase (chaque mot commence par une majuscule). COMPTE_BANCAIRE est pour les constantes, camelCase pour les méthodes/variables.",
        astuce: "Classe = PascalCase | méthode/variable = camelCase | constante = SCREAMING_SNAKE_CASE"
      }
    ]
  },

  {
    num: 3,
    moduleId: 'java_mod_2',
    moduleTitle: 'Module 2 — Structure et Syntaxe',
    title: "Commentaires, Structure d'une Classe et Erreurs de Compilation",
    duration: '15 min',
    content: `# Module 1 — Leçon 3 : Commentaires, Structure et Erreurs

---

## A. Commentaires en Java

\`\`\`java
// Commentaire sur une seule ligne (de // jusqu'à la fin de la ligne)

/* Commentaire
   multiligne */

/**
 * Commentaire Javadoc — génère la documentation HTML automatiquement
 * @param nom Le nom de la personne
 * @return Le message de bienvenue
 */
public String saluer(String nom) {
    return "Bonjour " + nom;
}
\`\`\`

---

## B. Structure Complète d'une Classe Java

\`\`\`java
// 1. Déclaration du package (si applicable)
package com.inforeussit.java;

// 2. Imports des classes externes nécessaires
import java.util.Scanner;
import java.util.ArrayList;

// 3. Déclaration de la classe
public class MaClasse {

    // 4. Attributs (variables d'instance) — état de l'objet
    private String nom;
    private int age;
    public static final double VERSION = 1.0;  // Constante

    // 5. Constructeur(s)
    public MaClasse(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    // 6. Méthodes — comportement de l'objet
    public String getNom() {
        return nom;
    }

    public int getAge() {
        return age;
    }

    // 7. Point d'entrée (dans la classe principale)
    public static void main(String[] args) {
        MaClasse obj = new MaClasse("Alice", 22);
        System.out.println(obj.getNom() + " a " + obj.getAge() + " ans.");
    }
}
\`\`\`

---

## C. Erreurs de Compilation vs Erreurs d'Exécution

| Type d'erreur | Moment de détection | Exemple |
| :--- | :--- | :--- |
| **Erreur de compilation** | Lors de \`javac\` | Point-virgule manquant, type incorrect |
| **Erreur d'exécution (Exception)** | Lors de \`java\` | Division par zéro, NullPointerException |
| **Erreur logique** | Jamais (le programme tourne mais donne un mauvais résultat) | Boucle infinie, calcul erroné |

### Exemples d'Erreurs de Compilation
\`\`\`java
int x = "bonjour";    // ✗ incompatible types: String cannot be converted to int
System.out.println()  // ✗ ';' expected
int 2variable = 0;    // ✗ not a statement (identificateur invalide)
\`\`\`

### Exemples d'Erreurs d'Exécution
\`\`\`java
int x = 10 / 0;           // ArithmeticException: / by zero
String s = null;
s.length();               // NullPointerException
int[] t = new int[5];
t[10] = 1;                // ArrayIndexOutOfBoundsException
\`\`\`

---

## D. Identificateurs — Règles Obligatoires

Un identificateur (nom de variable, classe, méthode) en Java :

✓ Peut contenir : lettres, chiffres, \`_\` (underscore), \`$\`
✓ Ne peut PAS commencer par un chiffre
✓ Ne peut PAS être un mot-clé Java (\`class\`, \`if\`, \`return\`, etc.)
✓ Est sensible à la casse (\`nom\` ≠ \`Nom\` ≠ \`NOM\`)

\`\`\`java
int age25 = 25;       // ✓ Valide
int _compteur = 0;    // ✓ Valide (mais déconseillé)
int $prix = 100;      // ✓ Valide (mais réservé aux outils)
int 2valeur = 5;      // ✗ INVALIDE — commence par un chiffre
int if = 1;           // ✗ INVALIDE — mot-clé réservé
\`\`\``,
    examples: `# Exemples — Leçon 3

## Exemple : Lecture d'un message d'erreur de compilation

\`\`\`java
public class Test {
    public static void main(String[] args) {
        int x = 10
        System.out.println(x);
    }
}
\`\`\`

**Message d'erreur javac :**
\`\`\`text
Test.java:3: error: ';' expected
        int x = 10
                  ^
1 error
\`\`\`

**Lecture du message :** Fichier \`Test.java\`, ligne 3, caractère 19 — point-virgule manquant.`,
    astuces: `⚡ **Astuces — Leçon 3**

1. Un **identificateur Java** peut commencer par \`$\` ou \`_\` mais c'est déconseillé par convention.

2. **Mots-clés réservés courants** : \`abstract\`, \`boolean\`, \`break\`, \`byte\`, \`case\`, \`catch\`, \`char\`, \`class\`, \`continue\`, \`default\`, \`do\`, \`double\`, \`else\`, \`enum\`, \`extends\`, \`final\`, \`finally\`, \`float\`, \`for\`, \`if\`, \`implements\`, \`import\`, \`instanceof\`, \`int\`, \`interface\`, \`long\`, \`new\`, \`null\`, \`package\`, \`private\`, \`protected\`, \`public\`, \`return\`, \`short\`, \`static\`, \`super\`, \`switch\`, \`this\`, \`throw\`, \`throws\`, \`try\`, \`void\`, \`while\`

3. **Javadoc** : Le triple slash \`/**\` génère de la documentation HTML avec \`javadoc MaClasse.java\`.`,
    quiz: [
      {
        id: 1201,
        question_number: 'Q1',
        question_text: "Lequel de ces identificateurs est INVALIDE en Java ?",
        option_a: "_compteur",
        option_b: "$prix",
        option_c: "3eme",
        option_d: "nomComplet",
        correct_option: 'C',
        explanation: "`3eme` est invalide car un identificateur Java ne peut pas commencer par un chiffre. `_compteur`, `$prix` et `nomComplet` sont tous valides (même si les deux premiers sont déconseillés).",
        astuce: "Un identif Java : commence par lettre, _ ou $ — jamais par un chiffre !"
      },
      {
        id: 1202,
        question_number: 'Q2',
        question_text: "Quelle erreur se produit lorsque l'on accède à l'index 10 d'un tableau de taille 5 ?",
        option_a: "Erreur de compilation",
        option_b: "ArrayIndexOutOfBoundsException",
        option_c: "NullPointerException",
        option_d: "ArithmeticException",
        correct_option: 'B',
        explanation: "L'accès hors limites d'un tableau provoque une ArrayIndexOutOfBoundsException à l'exécution (pas à la compilation, car Java ne peut pas toujours vérifier les indices avant d'exécuter).",
        astuce: "Out Of Bounds = en dehors des limites d'un tableau."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 2 — VARIABLES, TYPES ET OPÉRATEURS (L4-L7)
  // ═══════════════════════════════════════════════════════
  {
    num: 4,
    moduleId: 'java_mod_3',
    moduleTitle: 'Module 3 — Variables et Types de Données',
    title: "Types Primitifs, Variables et Valeurs par Défaut",
    duration: '30 min',
    content: `# Module 2 — Leçon 4 : Types Primitifs, Variables et Valeurs par Défaut

---

## A. Les 8 Types Primitifs de Java

En Java, les **types primitifs** sont les seuls types qui ne sont pas des objets. Ils ont une taille **fixe et universelle** sur toutes les machines.

| Type | Taille | Plage de valeurs | Valeur par défaut (champs) | Exemple |
| :--- | :--- | :--- | :--- | :--- |
| **byte** | 8 bits | -128 à 127 | 0 | \`byte b = 100;\` |
| **short** | 16 bits | -32 768 à 32 767 | 0 | \`short s = 30000;\` |
| **int** | 32 bits | -2 147 483 648 à 2 147 483 647 | 0 | \`int i = 42;\` |
| **long** | 64 bits | -9.2×10¹⁸ à 9.2×10¹⁸ | 0L | \`long l = 10000000000L;\` |
| **float** | 32 bits | ~±3.4×10³⁸ (7 chiffres significatifs) | 0.0f | \`float f = 3.14f;\` |
| **double** | 64 bits | ~±1.8×10³⁰⁸ (15 chiffres significatifs) | 0.0 | \`double d = 3.14159;\` |
| **char** | 16 bits (Unicode) | '\\u0000' à '\\uFFFF' | '\\u0000' | \`char c = 'A';\` |
| **boolean** | 1 bit logique | true / false | false | \`boolean ok = true;\` |

> [!IMPORTANT]
> **Règle clé concours :** Les types primitifs en Java ont une taille **strictement identique** sur toutes les machines. Contrairement au C/C++ où \`int\` peut faire 16 ou 32 bits selon la plateforme.

---

## B. Déclaration, Initialisation et Affectation

\`\`\`java
// Déclaration simple
int age;

// Déclaration + initialisation
int age = 25;

// Déclaration de plusieurs variables du même type
int x = 5, y = 10, z = 15;

// Constante (final = la valeur ne peut plus changer après initialisation)
final double PI = 3.14159265358979;
PI = 3.14;  // ✗ ERREUR de compilation : cannot assign a value to final variable PI
\`\`\`

---

## C. Variables Locales vs Champs (Attributs)

| Caractéristique | Variable locale | Champ (attribut) |
| :--- | :--- | :--- |
| **Déclarée dans** | Corps d'une méthode | Corps d'une classe |
| **Valeur par défaut** | **Aucune** — doit être explicitement initialisée | Automatique (0, 0.0, false, null) |
| **Durée de vie** | Jusqu'à la fin du bloc \`{}\` | Tant que l'objet existe |
| **Accès depuis** | Seule la méthode contenante | Toute la classe |

\`\`\`java
public class Demo {
    int champEntier;       // Champ : valeur par défaut = 0
    boolean champBool;     // Champ : valeur par défaut = false
    String champRef;       // Champ : valeur par défaut = null

    public void methode() {
        int localA;        // Variable locale NON initialisée
        System.out.println(localA);  // ✗ ERREUR : variable localA might not have been initialized
        
        int localB = 5;    // Variable locale initialisée ✓
        System.out.println(localB);  // ✓ Affiche : 5
    }
}
\`\`\`

---

## D. Inférence de Type avec \`var\` (Java 10+)

Depuis Java 10, le compilateur peut inférer le type d'une variable locale avec le mot-clé \`var\` :

\`\`\`java
var age = 25;                   // Le compilateur infère : int age = 25
var message = "Bonjour";        // Le compilateur infère : String message = "Bonjour"
var prix = 9.99;                // Le compilateur infère : double prix = 9.99

// Restrictions de var :
var x;                          // ✗ ERREUR : cannot infer type for local variable x
var liste = null;               // ✗ ERREUR : variable initializer is 'null'
private var attribut = 10;      // ✗ ERREUR : var ne peut pas être utilisé pour les champs
\`\`\`

> [!NOTE]
> \`var\` n'est pas un type dynamique (comme en JavaScript) ! Le compilateur détermine le type une fois pour toutes et il ne peut plus changer. \`var\` est uniquement pour les variables locales.

---

## E. Littéraux et Suffixes

\`\`\`java
// Littéraux entiers
int decimal  = 255;         // Notation décimale
int hexadec  = 0xFF;        // Hexadécimal (= 255)
int octal    = 0377;        // Octal (= 255)
int binaire  = 0b11111111;  // Binaire Java 7+ (= 255)
long grand   = 10_000_000L; // Underscore pour lisibilité Java 7+, suffixe L obligatoire

// Littéraux flottants
float f1  = 3.14f;    // suffixe f ou F obligatoire pour float
double d1 = 3.14;     // Par défaut, un décimal est un double
double d2 = 3.14d;    // Suffixe d ou D optionnel

// Littéraux caractères
char c1 = 'A';        // Caractère simple
char c2 = '\\n';       // Séquence d'échappement (saut de ligne)
char c3 = '\\u0041';   // Code Unicode de 'A'

// Littéral chaîne (String — attention : n'est PAS un type primitif !)
String s = "Bonjour";
\`\`\``,
    examples: `# Exemples — Leçon 4

## Exemple 1 : Débordement numérique (Overflow)

\`\`\`java
public class Overflow {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;  // 2 147 483 647
        System.out.println("Max int : " + max);
        System.out.println("Max + 1 : " + (max + 1));  // Débordement !
    }
}
\`\`\`

**Sortie :**
\`\`\`text
Max int : 2147483647
Max + 1 : -2147483648
\`\`\`

**Explication :** Un \`int\` de 32 bits ne peut pas dépasser 2 147 483 647. Si on ajoute 1, le résultat "déborde" en revenant à la valeur minimale (-2 147 483 648). Java ne lance PAS d'exception pour ce cas.

---

## Exemple 2 : Valeurs par défaut des champs

\`\`\`java
public class DefaultValues {
    int i;        // 0
    double d;     // 0.0
    boolean b;    // false
    char c;       // '\\u0000' (caractère nul)
    String s;     // null
    
    public void afficher() {
        System.out.println("int : " + i);
        System.out.println("double : " + d);
        System.out.println("boolean : " + b);
        System.out.println("char : '" + c + "'");
        System.out.println("String : " + s);
    }
    
    public static void main(String[] args) {
        new DefaultValues().afficher();
    }
}
\`\`\`

**Sortie :**
\`\`\`text
int : 0
double : 0.0
boolean : false
char : ''
String : null
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 4**

1. **long nécessite le suffixe L** : \`long l = 10000000000L;\` — sans L, Java interprétera 10000000000 comme un int et donnera une erreur de compilation (trop grand pour int).

2. **float nécessite le suffixe f** : \`float f = 3.14f;\` — sans f, Java interprète 3.14 comme un double et refuse de l'affecter implicitement à un float.

3. **Les variables locales n'ont pas de valeur par défaut !** C'est un piège classique aux QCM.

4. **int vs Integer** : \`int\` est un type primitif (stocké directement en mémoire). \`Integer\` est sa classe wrapper (un objet). Les collections Java acceptent uniquement des objets, donc nécessitent \`Integer\`, pas \`int\`.`,
    quiz: [
      {
        id: 1301,
        question_number: 'Q1',
        question_text: "Quelle est la taille d'un type `int` en Java ?",
        option_a: "Dépend du système d'exploitation (16 ou 32 bits)",
        option_b: "Toujours 32 bits sur toutes les plateformes",
        option_c: "Toujours 64 bits",
        option_d: "8 bits",
        correct_option: 'B',
        explanation: "En Java, un `int` fait TOUJOURS exactement 32 bits, quelle que soit la plateforme (Windows, Linux, Android, ARM, x86...). C'est une garantie fondamentale de Java.",
        astuce: "Java garantit des tailles fixes pour tous ses types primitifs — contrairement au C/C++."
      },
      {
        id: 1302,
        question_number: 'Q2',
        question_text: "Quelle est la valeur par défaut d'un champ de type `boolean` en Java ?",
        option_a: "null",
        option_b: "0",
        option_c: "false",
        option_d: "Aucune — doit être initialisé manuellement",
        correct_option: 'C',
        explanation: "Les champs (attributs d'instance) ont des valeurs par défaut en Java : boolean → false, int/byte/short/long → 0, float/double → 0.0, char → '\\u0000', références (objets) → null.",
        astuce: "Seules les variables locales (dans les méthodes) n'ont PAS de valeur par défaut."
      },
      {
        id: 1303,
        question_number: 'Q3',
        question_text: "Quel suffixe est obligatoire pour déclarer un littéral de type `long` ?",
        option_a: "l ou L",
        option_b: "d ou D",
        option_c: "f ou F",
        option_d: "Aucun suffixe n'est nécessaire",
        correct_option: 'A',
        explanation: "Sans le suffixe L, Java interprète tout littéral entier comme un `int`. Si la valeur dépasse Integer.MAX_VALUE (2147483647), une erreur de compilation se produit.",
        astuce: "Mémo : L pour Long, f pour float — les deux types qui nécessitent un suffixe obligatoire."
      }
    ]
  },

  {
    num: 5,
    moduleId: 'java_mod_4',
    moduleTitle: 'Module 4 — Opérateurs',
    title: "Conversions, Casting et Opérateurs Java",
    duration: '25 min',
    content: `# Module 2 — Leçon 5 : Conversions, Casting et Opérateurs

---

## A. Conversions Implicites (Widening)

Java effectue automatiquement les conversions **vers un type plus large** (sans perte d'information) :

\`\`\`
byte → short → int → long → float → double
                              char ↗
\`\`\`

\`\`\`java
int i = 42;
long l = i;      // Conversion implicite int → long ✓ (automatique)
double d = i;    // Conversion implicite int → double ✓

double prix = 9.99;
int entier = prix;  // ✗ ERREUR : possible lossy conversion from double to int
\`\`\`

---

## B. Casting Explicite (Narrowing)

Pour convertir **vers un type plus petit** (avec risque de perte), on doit forcer explicitement :

\`\`\`java
double d = 9.99;
int i = (int) d;         // Cast explicite → i = 9 (la partie décimale est TRONQUÉE, pas arrondie !)

long l = 1000L;
byte b = (byte) l;       // b = -24 (débordement ! 1000 > 127)

float f = 3.14f;
int j = (int) f;         // j = 3 (troncature)

// Cast de char ↔ int (utile !)
char c = 'A';
int code = c;            // code = 65 (code ASCII/Unicode de 'A')
char lettre = (char) 66; // lettre = 'B'
\`\`\`

---

## C. Opérateurs Arithmétiques

\`\`\`java
int a = 17, b = 5;

System.out.println(a + b);   // 22 (addition)
System.out.println(a - b);   // 12 (soustraction)
System.out.println(a * b);   // 85 (multiplication)
System.out.println(a / b);   // 3  (division ENTIÈRE — la partie décimale est perdue !)
System.out.println(a % b);   // 2  (modulo — reste de la division)

// Division flottante
System.out.println((double) a / b);  // 3.4 (cast nécessaire)
System.out.println(17.0 / 5);        // 3.4 (17.0 est un double, donc division flottante)
\`\`\`

---

## D. Opérateurs de Comparaison

\`\`\`java
int x = 5, y = 10;

System.out.println(x == y);   // false (égalité)
System.out.println(x != y);   // true  (différence)
System.out.println(x < y);    // true  (inférieur)
System.out.println(x > y);    // false (supérieur)
System.out.println(x <= y);   // true  (inférieur ou égal)
System.out.println(x >= y);   // false (supérieur ou égal)
\`\`\`

---

## E. Opérateurs Logiques et Court-Circuit

\`\`\`java
boolean a = true, b = false;

// ET logique
System.out.println(a && b);   // false — && = court-circuit (n'évalue b que si a est true)
System.out.println(a & b);    // false — & = évalue TOUJOURS les deux membres

// OU logique
System.out.println(a || b);   // true  — || = court-circuit (n'évalue b que si a est false)
System.out.println(a | b);    // true  — | = évalue TOUJOURS les deux membres

// NON logique
System.out.println(!a);       // false
\`\`\`

> [!TIP]
> **Intérêt du court-circuit** : Éviter des erreurs de null !
> \`\`\`java
> String s = null;
> if (s != null && s.length() > 0) {  // ✓ Safe : si s est null, length() n'est jamais appelé
>     System.out.println("Non vide");
> }
> \`\`\`

---

## F. Incrémentation et Décrémentation — Le Piège Classique

\`\`\`java
int i = 5;

// Pré-incrémentation : incremente D'ABORD, puis retourne la valeur
int a = ++i;   // i devient 6, a = 6

// Post-incrémentation : retourne la valeur D'ABORD, puis incremente
i = 5;
int b = i++;   // b = 5 (valeur AVANT incrémentation), puis i devient 6

// Même logique pour -- (décrémentation)
i = 10;
int c = --i;   // i devient 9, c = 9
int d = i--;   // d = 9, puis i devient 8
\`\`\`

---

## G. Opérateurs d'Affectation Composée

\`\`\`java
int x = 10;
x += 5;   // x = x + 5 = 15
x -= 3;   // x = x - 3 = 12
x *= 2;   // x = x * 2 = 24
x /= 4;   // x = x / 4 = 6
x %= 4;   // x = x % 4 = 2
\`\`\`

---

## H. Opérateur Ternaire

\`\`\`java
// Syntaxe : condition ? valeurSiVrai : valeurSiFaux
int age = 20;
String statut = (age >= 18) ? "Majeur" : "Mineur";
System.out.println(statut);  // Majeur

// Équivalent au if/else :
// if (age >= 18) statut = "Majeur"; else statut = "Mineur";
\`\`\`

---

## I. Priorité des Opérateurs

Ordre décroissant (du plus prioritaire au moins prioritaire) :

1. \`++\` \`--\` (post), \`()\`, \`[]\` (accès)
2. \`++\` \`--\` (pré), \`!\`, \`~\`, \`+\` \`-\` (unaires), \`(type)\` (cast)
3. \`*\` \`/\` \`%\`
4. \`+\` \`-\`
5. \`<\` \`>\` \`<=\` \`>=\` \`instanceof\`
6. \`==\` \`!=\`
7. \`&&\`
8. \`||\`
9. \`? :\` (ternaire)
10. \`=\` \`+=\` \`-=\` etc.`,
    examples: `# Exemples — Leçon 5

## Exemple 1 : Analyse complète de pré/post incrémentation

\`\`\`java
public class Incrementation {
    public static void main(String[] args) {
        int i = 5;
        System.out.println(i++);  // Affiche 5 (puis i devient 6)
        System.out.println(i);    // Affiche 6
        System.out.println(++i);  // i devient 7, affiche 7
        System.out.println(i);    // Affiche 7
    }
}
\`\`\`

**Sortie exacte :**
\`\`\`text
5
6
7
7
\`\`\`

## Exemple 2 : Calcul priorité des opérateurs

\`\`\`java
int result = 2 + 3 * 4 - 1;  // 2 + (3*4) - 1 = 2 + 12 - 1 = 13
System.out.println(result);   // 13

int result2 = (2 + 3) * (4 - 1);  // 5 * 3 = 15
System.out.println(result2);       // 15
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 5**

1. **Division entière** : \`7 / 2 = 3\` (pas 3.5) — c'est le piège N°1 ! Pour avoir 3.5, écrire \`7.0 / 2\` ou \`(double) 7 / 2\`.

2. **Cast de double vers int = troncature** (pas arrondi). \`(int) 9.99\` = 9, pas 10.

3. **Short-circuit && et ||** : Crucial pour éviter NullPointerException. Toujours écrire \`obj != null && obj.methode()\`.

4. **\`i++\` vs \`++i\`** : En isolation (\`i++;\` sur sa propre ligne), les deux font exactement la même chose. La différence n'existe que quand l'expression est utilisée dans un calcul ou une affectation.`,
    quiz: [
      {
        id: 1401,
        question_number: 'Q1',
        question_text: "Que retourne l'expression `(int) 9.99` en Java ?",
        option_a: "10",
        option_b: "9",
        option_c: "9.99",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "Le cast `(int)` tronque la partie décimale (il ne fait pas d'arrondi). Donc `(int) 9.99` retourne 9. Pour arrondir, utiliser `Math.round(9.99)` qui retournerait 10.",
        astuce: "Cast vers int = troncature (coupe la partie décimale). Math.round() = arrondi."
      },
      {
        id: 1402,
        question_number: 'Q2',
        question_text: "Que retourne l'expression `7 / 2` en Java (avec a et b de type int) ?",
        option_a: "3.5",
        option_b: "3",
        option_c: "4",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "La division entre deux entiers en Java est une division entière (euclidienne). `7 / 2 = 3` et non 3.5. Pour avoir 3.5, il faut écrire `7.0 / 2` ou `(double) 7 / 2`.",
        astuce: "int/int = int (division entière). Pour division décimale, forcer un opérande en double."
      },
      {
        id: 1403,
        question_number: 'Q3',
        question_text: "Quel est le résultat de l'expression `int i = 5; System.out.println(i++);` ?",
        option_a: "6",
        option_b: "5",
        option_c: "4",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "L'opérateur `i++` (post-incrémentation) retourne la valeur actuelle de i (5) AVANT de l'incrémenter. Donc println affiche 5. Ensuite i vaut 6.",
        astuce: "Post-incrémentation (i++) : retourne d'abord, incrémente ensuite."
      }
    ]
  },

  {
    num: 6,
    moduleId: 'java_mod_5',
    moduleTitle: 'Module 5 — Conditions et Boucles',
    title: "Conditions : if, else, switch et Opérateur Ternaire",
    duration: '25 min',
    content: `# Module 2 — Leçon 6 : Structures Conditionnelles

---

## A. La Structure if / else if / else

\`\`\`java
int note = 14;

if (note >= 16) {
    System.out.println("Mention Très Bien");
} else if (note >= 14) {
    System.out.println("Mention Bien");   // Exécuté → note = 14
} else if (note >= 12) {
    System.out.println("Mention Assez Bien");
} else if (note >= 10) {
    System.out.println("Admis");
} else {
    System.out.println("Ajourné");
}
\`\`\`

### Règle des Accolades Optionnelles

\`\`\`java
// Sans accolades : DANGLING ELSE — Piège classique !
int x = 5;
if (x > 3)
    if (x > 7)
        System.out.println("Très grand");
else                           // Ce else appartient au DEUXIÈME if (x > 7), pas au premier !
    System.out.println("Pas grand");   // Affiché si x <= 7 mais x > 3

// Solution : toujours utiliser des accolades
if (x > 3) {
    if (x > 7) {
        System.out.println("Très grand");
    }
} else {
    System.out.println("Petit");  // Maintenant ce else est pour le premier if
}
\`\`\`

---

## B. L'Instruction switch

### Switch classique (Java 1 à 13)

\`\`\`java
int jour = 3;
String nomJour;

switch (jour) {
    case 1:
        nomJour = "Lundi";
        break;          // CRUCIAL : sans break, l'exécution "tombe" dans le case suivant !
    case 2:
        nomJour = "Mardi";
        break;
    case 3:
        nomJour = "Mercredi";
        break;
    case 4:
    case 5:             // Regroupement de cases
        nomJour = "Jeudi ou Vendredi";
        break;
    default:            // Cas par défaut (facultatif mais recommandé)
        nomJour = "Weekend";
}
System.out.println(nomJour);  // Mercredi
\`\`\`

### ⚠️ Le Fall-through (Chute entre cases) — Piège Majeur de Concours

\`\`\`java
int x = 2;
switch (x) {
    case 1:
        System.out.println("Un");
    case 2:
        System.out.println("Deux");   // Exécuté (x == 2)
    case 3:
        System.out.println("Trois");  // Aussi exécuté ! (pas de break !)
    default:
        System.out.println("Autre");  // Aussi exécuté !
}
// Sortie : Deux / Trois / Autre
\`\`\`

### Switch Expression (Java 14+) — Syntaxe moderne

\`\`\`java
int jour = 3;
String nom = switch (jour) {
    case 1 -> "Lundi";
    case 2 -> "Mardi";
    case 3 -> "Mercredi";
    case 4, 5 -> "Jeudi ou Vendredi";
    default -> "Weekend";
};  // Pas de fall-through, pas de break nécessaire
System.out.println(nom);  // Mercredi
\`\`\`

---

## C. Types Acceptés dans un switch

| Version Java | Types acceptés |
| :--- | :--- |
| Avant Java 7 | \`byte\`, \`short\`, \`int\`, \`char\` |
| Java 7+ | + \`String\`, \`Byte\`, \`Short\`, \`Integer\`, \`Character\` |
| Java 14+ | + toutes les classes grâce aux switch expressions et patterns |

> [!IMPORTANT]
> \`long\`, \`float\`, \`double\`, \`boolean\` et les objets généraux **ne peuvent pas** être utilisés dans un switch.`,
    examples: `# Exemples — Leçon 6

## Exemple 1 : Switch avec String (Java 7+)

\`\`\`java
String saison = "été";

switch (saison) {
    case "printemps":
        System.out.println("Fleurs");
        break;
    case "été":
        System.out.println("Vacances");  // Affiché
        break;
    case "automne":
        System.out.println("Feuilles");
        break;
    case "hiver":
        System.out.println("Neige");
        break;
    default:
        System.out.println("Saison inconnue");
}
\`\`\`

## Exemple 2 : Analyse de switch sans break (Concours)

\`\`\`java
int x = 2, y = 5;
switch (x < y) {   // Attention : boolean utilisé dans switch !
    // Cela COMPILE ? Oui en Java moderne avec switch expressions
    // Mais switch classique avec boolean → Erreur
}
\`\`\`

**Vrai code concours (Q43 style) :**
\`\`\`java
int x = 2, y = 5;
switch (x) {
    case 0: System.out.print("0");
    case 1: System.out.print("1");
    case 2: System.out.print("2");  // Point d'entrée (x == 2)
    case 3: System.out.print("3");  // Fall-through !
    default: System.out.print("D"); // Fall-through !
}
// Sortie : 23D
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 6**

1. **Fall-through** : Sans \`break\`, l'exécution continue dans les cases suivants — question classique de concours !

2. **switch avec boolean** : \`boolean\` **ne peut pas** être utilisé comme expression d'un switch classique.

3. **Dangling else** : Quand les \`if\` s'imbriquent sans accolades, le \`else\` appartient toujours au \`if\` le plus proche. Mettre toujours des accolades !

4. **switch expression** (Java 14+) : La flèche \`->\` remplace les \`case:\` + \`break\`. Pas de fall-through possible. La valeur peut être assignée directement.`,
    quiz: [
      {
        id: 1501,
        question_number: 'Q1',
        question_text: "Que se passe-t-il si on oublie le `break` dans un case d'un switch classique ?",
        option_a: "Erreur de compilation",
        option_b: "Le programme s'arrête après ce case",
        option_c: "L'exécution continue dans le case suivant (fall-through)",
        option_d: "Rien de particulier",
        correct_option: 'C',
        explanation: "Sans break, Java continue d'exécuter le code des cases suivants (fall-through), même si leur condition ne correspond pas. C'est un comportement prévu par le langage, mais source d'erreurs fréquentes.",
        astuce: "Switch sans break = cascade d'exécution (fall-through) jusqu'au prochain break ou la fin."
      },
      {
        id: 1502,
        question_number: 'Q2',
        question_text: "Lequel de ces types NE PEUT PAS être utilisé comme expression dans un switch classique (avant Java 14) ?",
        option_a: "String",
        option_b: "char",
        option_c: "double",
        option_d: "int",
        correct_option: 'C',
        explanation: "`double`, `float`, `long` et `boolean` ne peuvent pas être utilisés comme expression d'un switch classique. String est autorisé depuis Java 7.",
        astuce: "switch accepte : byte/short/int/char + leurs wrappers + String + enum. Pas float/double/long/boolean."
      }
    ]
  },

  {
    num: 7,
    moduleId: 'java_mod_5',
    moduleTitle: 'Module 5 — Conditions et Boucles',
    title: "Boucles : for, while, do-while, break et continue",
    duration: '30 min',
    content: `# Module 2 — Leçon 7 : Boucles et Structures Répétitives

---

## A. La Boucle for

\`\`\`java
// Syntaxe générale
for (initialisation; condition; mise_à_jour) {
    corps;
}

// Exemple : afficher 1 à 5
for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");  // 1 2 3 4 5
}

// for à rebours
for (int i = 5; i >= 1; i--) {
    System.out.print(i + " ");  // 5 4 3 2 1
}

// for avec plusieurs variables
for (int i = 0, j = 10; i < j; i++, j--) {
    System.out.println("i=" + i + " j=" + j);
}
\`\`\`

---

## B. La Boucle for-each (Enhanced for)

Parcours simplifié de tableaux et collections :

\`\`\`java
int[] notes = {12, 15, 8, 18, 10};

// for-each
for (int note : notes) {
    System.out.print(note + " ");  // 12 15 8 18 10
}

// Calcul de somme avec for-each
int somme = 0;
for (int note : notes) {
    somme += note;
}
System.out.println("Somme : " + somme);  // 63

// Limitation : for-each ne permet PAS de modifier les éléments d'un tableau
for (int note : notes) {
    note *= 2;  // Modifie la variable locale 'note', PAS le tableau !
}
// Le tableau est inchangé
\`\`\`

---

## C. La Boucle while

Utiliser \`while\` quand on ne sait pas à l'avance combien de tours sont nécessaires.

\`\`\`java
// while : la condition est vérifiée AVANT chaque itération
int i = 1;
while (i <= 5) {
    System.out.print(i + " ");  // 1 2 3 4 5
    i++;
}

// Exemple : deviner un nombre
Scanner sc = new Scanner(System.in);
int secret = 42;
int tentative = -1;
while (tentative != secret) {
    System.out.print("Devinez : ");
    tentative = sc.nextInt();
}
System.out.println("Bravo !");
\`\`\`

---

## D. La Boucle do-while

La condition est vérifiée **APRÈS** la première exécution — garantit au moins 1 itération.

\`\`\`java
int i = 1;
do {
    System.out.print(i + " ");  // 1 2 3 4 5
    i++;
} while (i <= 5);

// Différence clé :
int x = 10;
while (x < 5) {               // Condition fausse → corps jamais exécuté
    System.out.println("while");
}

do {
    System.out.println("do-while");  // Exécuté une fois malgré la condition fausse !
} while (x < 5);
\`\`\`

---

## E. break et continue

\`\`\`java
// break : sortie immédiate de la boucle
for (int i = 1; i <= 10; i++) {
    if (i == 5) break;              // Sort quand i == 5
    System.out.print(i + " ");      // 1 2 3 4
}

// continue : passe à l'itération suivante (saute le reste du corps)
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;      // Saute les pairs
    System.out.print(i + " ");     // 1 3 5 7 9
}

// Labels pour break dans des boucles imbriquées
boucleExterne:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break boucleExterne;  // Sort des deux boucles
        System.out.println(i + "," + j);
    }
}
// Affiche : 0,0 / 0,1 / 0,2 / 1,0
\`\`\`

---

## F. Boucles Infinies — Causes et Solutions

\`\`\`java
// Boucle infinie intentionnelle
while (true) {
    // ... traitements
    if (conditionArret) break;  // sortie obligatoire quelque part !
}

// Boucle infinie accidentelle — cause fréquente : oubli de mise à jour
int i = 0;
while (i < 10) {
    System.out.println(i);
    // OUBLI de i++ → boucle infinie !
}
\`\`\``,
    examples: `# Exemples — Leçon 7

## Exemple 1 : Tables de multiplication

\`\`\`java
public class Tables {
    public static void main(String[] args) {
        for (int table = 2; table <= 4; table++) {
            System.out.println("--- Table de " + table + " ---");
            for (int i = 1; i <= 10; i++) {
                System.out.println(table + " x " + i + " = " + (table * i));
            }
        }
    }
}
\`\`\`

## Exemple 2 : Trace d'exécution (question de concours)

\`\`\`java
int i = 10;
while (i > 0) {
    printf("%i \\n", i--);  // Attention : printf n'existe pas en Java !
}
// Version Java correcte :
int j = 10;
while (j > 0) {
    System.out.println(j--);
}
// Sortie : 10 9 8 7 6 5 4 3 2 1
// j-- retourne la valeur actuelle AVANT décrémentation
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 7**

1. **for-each ne peut pas modifier** les éléments d'un tableau (la variable du for-each est une copie locale).

2. **while vs do-while** : Si la boucle doit toujours s'exécuter au moins une fois → utiliser do-while (ex : menu de jeu, saisie avec validation).

3. **Traces d'exécution** : Pratiquer le traçage manuel pour les QCM — créer un tableau avec la valeur de chaque variable à chaque itération.`,
    quiz: [
      {
        id: 1601,
        question_number: 'Q1',
        question_text: "Quelle est la différence principale entre `while` et `do-while` ?",
        option_a: "while est plus rapide que do-while",
        option_b: "do-while garantit au moins une exécution du corps, même si la condition est fausse dès le départ",
        option_c: "while peut avoir des boucles infinies, do-while non",
        option_d: "Aucune différence",
        correct_option: 'B',
        explanation: "Dans une boucle while, la condition est vérifiée AVANT d'entrer dans le corps. Dans do-while, le corps est exécuté UNE FOIS avant de vérifier la condition pour la première fois.",
        astuce: "do-while = 'Fais d'abord, vérifie ensuite'. Garantit au moins 1 passage."
      },
      {
        id: 1602,
        question_number: 'Q2',
        question_text: "Que fait l'instruction `continue` dans une boucle ?",
        option_a: "Arrête complètement la boucle",
        option_b: "Passe directement à l'itération suivante en sautant le reste du corps",
        option_c: "Sort de la méthode",
        option_d: "Reprend la boucle depuis le début",
        correct_option: 'B',
        explanation: "`continue` saute le reste du corps de la boucle pour l'itération courante et passe directement à la condition (while) ou à la mise à jour (for).",
        astuce: "break = sortir de la boucle | continue = passer à l'itération suivante."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 3 — TABLEAUX ET CHAÎNES (L8-L10)
  // ═══════════════════════════════════════════════════════
  {
    num: 8,
    moduleId: 'java_mod_6',
    moduleTitle: 'Module 6 — Tableaux et Chaînes de Caractères',
    title: "Tableaux : Déclaration, Initialisation et Manipulation",
    duration: '25 min',
    content: `# Module 3 — Leçon 8 : Tableaux Java

---

## A. Déclaration et Création d'un Tableau

\`\`\`java
// Deux syntaxes de déclaration (préférer la première)
int[] tableau;          // ✓ Préféré (le type est 'int[]')
int tableau2[];         // ✓ Valide mais déconseillé (héritage du C)

// Création avec new
int[] t = new int[5];   // Tableau de 5 entiers, initialisés à 0 par défaut
// Valeurs par défaut : int/long/byte/short → 0, double/float → 0.0, boolean → false, objet → null

// Initialisation directe avec valeurs
int[] notes = {15, 12, 18, 9, 14};  // Tableau de 5 éléments

// Déclaration + création + initialisation
String[] prenoms = new String[]{"Alice", "Bob", "Claire"};
\`\`\`

---

## B. Accès aux Éléments et Propriété length

\`\`\`java
int[] t = {10, 20, 30, 40, 50};

// Accès par index (base 0)
System.out.println(t[0]);  // 10 (premier élément)
System.out.println(t[4]);  // 50 (dernier élément)
System.out.println(t[5]);  // ✗ ArrayIndexOutOfBoundsException !

// Propriété length (nombre d'éléments, pas un index !)
System.out.println(t.length);   // 5

// Modification
t[2] = 99;
System.out.println(t[2]);  // 99

// Dernier élément toujours à t[t.length - 1]
System.out.println(t[t.length - 1]);  // 50
\`\`\`

---

## C. Tableaux Multidimensionnels

\`\`\`java
// Tableau 2D (matrice)
int[][] matrice = new int[3][4];  // 3 lignes, 4 colonnes

// Initialisation directe
int[][] grille = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Accès : grille[ligne][colonne]
System.out.println(grille[1][2]);  // 6 (ligne 1, colonne 2)

// Tableaux irréguliers (jagged arrays)
int[][] irregulier = new int[3][];
irregulier[0] = new int[2];  // 2 colonnes pour la ligne 0
irregulier[1] = new int[4];  // 4 colonnes pour la ligne 1
irregulier[2] = new int[1];  // 1 colonne pour la ligne 2
\`\`\`

---

## D. Parcours avec for et for-each

\`\`\`java
int[] t = {15, 8, 22, 4, 17};

// for classique — permet accès à l'index et modification
for (int i = 0; i < t.length; i++) {
    System.out.println("t[" + i + "] = " + t[i]);
}

// for-each — plus lisible mais sans index et sans modification
for (int val : t) {
    System.out.print(val + " ");
}

// Calculs utiles
int somme = 0, min = t[0], max = t[0];
for (int val : t) {
    somme += val;
    if (val < min) min = val;
    if (val > max) max = val;
}
System.out.println("Somme=" + somme + " Min=" + min + " Max=" + max);
// Somme=66 Min=4 Max=22
\`\`\`

---

## E. La Classe Arrays — Utilitaires Essentiels

\`\`\`java
import java.util.Arrays;

int[] t = {5, 2, 8, 1, 9, 3};

Arrays.sort(t);                    // Tri croissant : {1, 2, 3, 5, 8, 9}
System.out.println(Arrays.toString(t));  // [1, 2, 3, 5, 8, 9]

int idx = Arrays.binarySearch(t, 8);  // Recherche binaire (tableau trié) → index 4
System.out.println("Index de 8 : " + idx);  // 4

int[] copie = Arrays.copyOf(t, t.length);  // Copie du tableau
Arrays.fill(t, 0);                          // Remplit tout le tableau avec 0

boolean egal = Arrays.equals(t, copie);    // Compare deux tableaux
System.out.println("Égaux ? " + egal);    // false (t est maintenant tout à 0)
\`\`\``,
    examples: `# Exemples — Leçon 8

## Exemple : Recherche du maximum dans un tableau

\`\`\`java
public class TableauMax {
    public static void main(String[] args) {
        int[] notes = {12, 8, 15, 19, 11, 7, 14};
        
        int max = notes[0];
        int indexMax = 0;
        
        for (int i = 1; i < notes.length; i++) {
            if (notes[i] > max) {
                max = notes[i];
                indexMax = i;
            }
        }
        System.out.println("Note max : " + max + " à l'index " + indexMax);
        // Note max : 19 à l'index 3
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 8**

1. **Les tableaux Java ont une taille FIXE** après création avec \`new\`. Pour des tailles dynamiques, utiliser \`ArrayList\`.

2. **\`length\` (sans parenthèses)** pour les tableaux. \`length()\` (avec parenthèses) pour les Strings. Erreur classique !

3. **Copie de tableau** : \`int[] copie = tableau;\` copie seulement la **référence** ! Pour une vraie copie, utiliser \`Arrays.copyOf()\` ou le constructeur.`,
    quiz: [
      {
        id: 1701,
        question_number: 'Q1',
        question_text: "Quel est l'index du dernier élément d'un tableau `int[] t = new int[10]` ?",
        option_a: "10",
        option_b: "9",
        option_c: "11",
        option_d: "Dépend",
        correct_option: 'B',
        explanation: "Les tableaux Java sont indexés de 0 à `length - 1`. Un tableau de taille 10 a des indices de 0 à 9. Accéder à `t[10]` lancerait une ArrayIndexOutOfBoundsException.",
        astuce: "Premier élément = index 0. Dernier élément = index length-1."
      },
      {
        id: 1702,
        question_number: 'Q2',
        question_text: "Que vaut `t[0]` pour le tableau `int[] t = new int[5];` (sans initialisation explicite) ?",
        option_a: "Valeur indéfinie",
        option_b: "null",
        option_c: "0",
        option_d: "Erreur de compilation",
        correct_option: 'C',
        explanation: "En Java, un tableau de `int` créé avec `new` est automatiquement initialisé avec la valeur par défaut du type, qui est 0 pour int.",
        astuce: "Tableaux Java : toujours initialisés à la valeur par défaut du type (0, false, null...)."
      }
    ]
  },

  {
    num: 9,
    moduleId: 'java_mod_6',
    moduleTitle: 'Module 6 — Tableaux et Chaînes de Caractères',
    title: "La Classe String : Immutabilité, Comparaison et Méthodes",
    duration: '30 min',
    content: `# Module 3 — Leçon 9 : La Classe String

---

## A. String n'est pas un type primitif !

En Java, \`String\` est une **classe** (et non un type primitif), mais bénéficie d'un traitement spécial :

\`\`\`java
String s1 = "Bonjour";              // Littéral (stocké dans le String Pool)
String s2 = new String("Bonjour");  // Nouvel objet heap (éviter cette syntaxe)
\`\`\`

---

## B. L'Immutabilité des Strings — Concept Fondamental

Une fois créée, une \`String\` **ne peut jamais être modifiée**. Toute opération qui "modifie" une String crée en réalité un nouvel objet.

\`\`\`java
String s = "Bonjour";
s = s + " Monde";  // Crée un NOUVEL objet String "Bonjour Monde"
                   // L'objet "Bonjour" devient orphelin (Garbage Collected)
System.out.println(s);  // Bonjour Monde
\`\`\`

---

## C. == vs equals() pour les Strings — Piège N°1 des QCM

\`\`\`java
String a = "Bonjour";
String b = "Bonjour";
String c = new String("Bonjour");

// == compare les RÉFÉRENCES (adresses mémoire)
System.out.println(a == b);      // true  (même objet du String Pool !)
System.out.println(a == c);      // false (objets différents en mémoire)
System.out.println(b == c);      // false

// equals() compare le CONTENU (ce qu'on veut presque toujours)
System.out.println(a.equals(b));  // true
System.out.println(a.equals(c));  // true

// equalsIgnoreCase() — ignore la casse
System.out.println("Java".equalsIgnoreCase("java"));  // true
\`\`\`

> [!IMPORTANT]
> **Règle d'Or :** Pour comparer des Strings, **toujours** utiliser \`equals()\` (ou \`equalsIgnoreCase()\`), **jamais** \`==\`.

---

## D. Méthodes Indispensables de String

\`\`\`java
String s = "  Bonjour le Monde  ";

// Longueur
s.length();                    // 20 (inclut les espaces)

// Accès aux caractères
s.charAt(2);                   // 'B' (index 2)
s.indexOf('o');                // 4 (première occurrence)
s.lastIndexOf('o');            // 14 (dernière occurrence)

// Sous-chaînes
s.substring(2);                // "Bonjour le Monde  "
s.substring(2, 9);             // "Bonjour" (de l'index 2 inclus à 9 exclu)

// Tests
s.contains("Monde");           // true
s.startsWith("  Bon");         // true
s.endsWith("de  ");            // true
s.isEmpty();                   // false
"".isEmpty();                  // true
"   ".isBlank();               // true (Java 11+)

// Transformations — retournent un NOUVEL objet String !
s.trim();                      // "Bonjour le Monde" (supprime espaces début/fin)
s.strip();                     // "Bonjour le Monde" (Java 11+ — gère Unicode)
s.toUpperCase();               // "  BONJOUR LE MONDE  "
s.toLowerCase();               // "  bonjour le monde  "
s.replace('o', '0');           // "  B0nj0ur le M0nde  "
s.replace("Monde", "Java");    // "  Bonjour le Java  "

// Division et jonction
String[] mots = "a,b,c,d".split(",");  // ["a", "b", "c", "d"]
String joint = String.join("-", "a", "b", "c");  // "a-b-c"

// Conversion
String.valueOf(42);            // "42"
int n = Integer.parseInt("42");  // 42 (String → int)
\`\`\`

---

## E. La Concaténation et ses Subtilités

\`\`\`java
// L'opérateur + avec des types mixtes
System.out.println("Résultat : " + 3 + 4);   // "Résultat : 34" (concaténation !)
System.out.println("Résultat : " + (3 + 4)); // "Résultat : 7" (addition d'abord)
System.out.println(3 + 4 + " est la somme"); // "7 est la somme" (addition puis concat)

// Explication : + est évalué de gauche à droite
// "Résultat : " + 3 = "Résultat : 3" (String + int = String)
// "Résultat : 3" + 4 = "Résultat : 34"
\`\`\`

---

## F. StringBuilder — Pour les Modifications Efficaces

\`\`\`java
// ✗ Inefficace en boucle : crée des milliers d'objets String temporaires
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;  // Crée un nouvel objet String à chaque itération !
}

// ✓ Efficace : StringBuilder modifie son contenu en place
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result2 = sb.toString();

// Méthodes de StringBuilder
StringBuilder sb2 = new StringBuilder("Java");
sb2.append(" 17");              // Java 17
sb2.insert(4, " LTS");         // Java LTS 17
sb2.delete(4, 8);              // Java 17
sb2.reverse();                  // 71 avaJ
sb2.replace(0, 2, "XX");       // XX avaJ
System.out.println(sb2.length()); // Longueur actuelle
\`\`\``,
    examples: `# Exemples — Leçon 9

## Exemple : Inverser une chaîne manuellement

\`\`\`java
public class InverserString {
    public static void main(String[] args) {
        String original = "Bonjour";
        StringBuilder sb = new StringBuilder(original);
        String inverse = sb.reverse().toString();
        System.out.println(inverse);  // ruojnoB
        
        // Alternative sans StringBuilder
        String inverse2 = "";
        for (int i = original.length() - 1; i >= 0; i--) {
            inverse2 += original.charAt(i);
        }
        System.out.println(inverse2);  // ruojnoB
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 9**

1. **== vs equals()** : C'est LE piège N°1 sur les Strings. En concours : \`new String("x") == "x"\` → **false** !

2. **String immutable** : Toute méthode qui "transforme" une String (toUpperCase, trim, replace...) retourne un NOUVEL objet. L'original est inchangé.

3. **String Pool** : Les littéraux String sont mis en cache. \`"abc" == "abc"\` est souvent \`true\` (même objet du pool), mais \`new String("abc") == "abc"\` est toujours \`false\`.

4. **null.equals()** vs \`equals(null)\` : Appeler \`s.equals("test")\` si s est null → NullPointerException. Écrire plutôt \`"test".equals(s)\` ou \`Objects.equals(s, "test")\`.`,
    quiz: [
      {
        id: 1801,
        question_number: 'Q1',
        question_text: "Que retourne l'expression `\"Maroc\" == new String(\"Maroc\")` ?",
        option_a: "true",
        option_b: "false",
        option_c: "Erreur de compilation",
        option_d: "Dépend de la JVM",
        correct_option: 'B',
        explanation: "`==` compare les références (adresses mémoire). Le littéral `\"Maroc\"` est dans le String Pool. `new String(\"Maroc\")` crée un nouvel objet sur le tas (heap). Donc deux adresses différentes → false.",
        astuce: "Pour comparer le CONTENU de deux Strings, utiliser TOUJOURS .equals(), jamais ==."
      },
      {
        id: 1802,
        question_number: 'Q2',
        question_text: "Que retourne `\"Bonjour\".substring(3, 6)` ?",
        option_a: "\"jou\"",
        option_b: "\"our\"",
        option_c: "\"njo\"",
        option_d: "\"jour\"",
        correct_option: 'C',
        explanation: "substring(3, 6) extrait les caractères de l'index 3 (inclus) à l'index 6 (exclu). \"Bonjour\" : B=0, o=1, n=2, j=3, o=4, u=5, r=6. Donc indices 3,4,5 → 'j','o','u' → \"jou\".",
        astuce: "substring(start, end) : de start INCLUS à end EXCLU."
      }
    ]
  },

  {
    num: 10,
    moduleId: 'java_mod_7',
    moduleTitle: 'Module 7 — Méthodes et Paramètres',
    title: "Méthodes Java : Déclaration, Surcharge et Récursivité",
    duration: '30 min',
    content: `# Module 3 — Leçon 10 : Méthodes et Paramètres

---

## A. Déclaration d'une Méthode

\`\`\`java
// modificateur(s)  type_retour  nom(paramètres)  { corps }
public static int additionner(int a, int b) {
    return a + b;
}

// Méthode sans valeur de retour
public void afficherBonjour(String nom) {
    System.out.println("Bonjour " + nom + " !");
    // Pas de return nécessaire (ou return; pour sortir tôt)
}

// Méthode sans paramètre
public double obtenirPI() {
    return 3.14159;
}
\`\`\`

---

## B. Passage des Arguments en Java — Passage par Valeur

En Java, **tout est passé par valeur** — mais les objets passent leur référence par valeur.

\`\`\`java
// Cas 1 : Types primitifs — la méthode reçoit une COPIE
public static void doubler(int x) {
    x *= 2;  // Modifie la copie locale, pas l'original !
}

public static void main(String[] args) {
    int a = 5;
    doubler(a);
    System.out.println(a);  // 5 (inchangé !)
}

// Cas 2 : Objets — la méthode reçoit une copie de la RÉFÉRENCE
public static void modifier(int[] tableau) {
    tableau[0] = 99;  // Modifie l'objet réel via la référence !
}

public static void main(String[] args) {
    int[] t = {1, 2, 3};
    modifier(t);
    System.out.println(t[0]);  // 99 (modifié !)
}

// Cas 3 : Réassignation d'objet — ne modifie pas l'original
public static void reassigner(int[] tableau) {
    tableau = new int[]{99, 88, 77};  // Modifie la copie locale de la référence
}

public static void main(String[] args) {
    int[] t = {1, 2, 3};
    reassigner(t);
    System.out.println(t[0]);  // 1 (inchangé ! La réassignation locale n'affecte pas t)
}
\`\`\`

---

## C. Surcharge des Méthodes (Overloading)

Plusieurs méthodes avec le **même nom** mais des **paramètres différents** :

\`\`\`java
public class Calculateur {
    // Surcharge : même nom, paramètres différents
    public int additionner(int a, int b) {
        return a + b;
    }
    
    public double additionner(double a, double b) {
        return a + b;
    }
    
    public int additionner(int a, int b, int c) {
        return a + b + c;
    }
    
    // ✗ PAS une surcharge — seul le type de retour diffère :
    // public double additionner(int a, int b) { ... }  // ERREUR !
}
\`\`\`

> [!NOTE]
> La surcharge est résolue **à la compilation** selon le type des arguments. C'est du **polymorphisme statique**.

---

## D. Portée des Variables (Scope)

\`\`\`java
public class Portee {
    int champ = 10;    // Portée : toute la classe
    
    public void methode() {
        int locale = 20;  // Portée : jusqu'à la fin de methode()
        
        {
            int bloc = 30;  // Portée : jusqu'à la fin de ce bloc
            System.out.println(champ + " " + locale + " " + bloc);  // 10 20 30
        }
        // System.out.println(bloc);  // ✗ ERREUR : bloc n'existe plus
        System.out.println(champ + " " + locale);  // 10 20
    }
    // System.out.println(locale);  // ✗ ERREUR : locale n'existe plus
}
\`\`\`

---

## E. Récursivité

Une méthode est **récursive** si elle s'appelle elle-même.

\`\`\`java
// Factorielle : n! = n × (n-1)!
public static long factorielle(int n) {
    if (n <= 1) return 1;     // Cas d'arrêt — OBLIGATOIRE !
    return n * factorielle(n - 1);  // Appel récursif
}
// factorielle(5) = 5 × 4! = 5 × 4 × 3! = 5 × 4 × 3 × 2 × 1 = 120

// Fibonacci
public static int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
// fibonacci(6) = 8 (0,1,1,2,3,5,8)
\`\`\`

> [!WARNING]
> **Sans cas d'arrêt**, la récursion infinie provoque un **StackOverflowError** (la pile d'appels déborde).`,
    examples: `# Exemples — Leçon 10

## Exemple : Méthode avec plusieurs return

\`\`\`java
public static String appreciation(int note) {
    if (note < 0 || note > 20) {
        return "Note invalide";  // return anticipé
    }
    if (note < 10) return "Insuffisant";
    if (note < 12) return "Passable";
    if (note < 14) return "Assez Bien";
    if (note < 16) return "Bien";
    return "Très Bien";  // return final
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 10**

1. **Java passe tout par valeur** — y compris les références d'objets. On peut modifier le contenu d'un objet passé en paramètre, mais pas réassigner la variable.

2. **Surcharge** : Java distingue les méthodes surchargées par le type et le nombre de paramètres, PAS par le type de retour.

3. **Récursivité** : Toujours avoir un cas d'arrêt. Toujours vérifier que la récursion converge vers ce cas.`,
    quiz: [
      {
        id: 1901,
        question_number: 'Q1',
        question_text: "Que vaut `a` après l'appel de `doubler(a)` si `doubler(int x) { x *= 2; }` et `a = 5` ?",
        option_a: "10",
        option_b: "5",
        option_c: "Dépend de la JVM",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "Java passe les types primitifs par valeur. La méthode reçoit une copie de a. Modifier x ne modifie pas a. Donc a reste 5 après l'appel.",
        astuce: "Types primitifs = passage par valeur (copie). Objets = passage de référence par valeur."
      },
      {
        id: 1902,
        question_number: 'Q2',
        question_text: "Quelle erreur provoque une récursion sans cas d'arrêt ?",
        option_a: "ArithmeticException",
        option_b: "NullPointerException",
        option_c: "StackOverflowError",
        option_d: "OutOfMemoryError",
        correct_option: 'C',
        explanation: "Chaque appel de méthode empile un cadre sur la pile d'appels (call stack). Sans cas d'arrêt, la pile déborde et lance un StackOverflowError.",
        astuce: "Récursion infinie → Stack Overflow (pile d'appels déborde)."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 4 — CLASSES ET OBJETS (L11-L13)
  // ═══════════════════════════════════════════════════════
  {
    num: 11,
    moduleId: 'java_mod_8',
    moduleTitle: 'Module 8 — Classes et Objets',
    title: "Introduction à la POO : Classes, Objets et Instanciation",
    duration: '30 min',
    content: `# Module 4 — Leçon 11 : Introduction à la Programmation Orientée Objet

---

## A. Qu'est-ce que la POO ?

La **Programmation Orientée Objet (POO)** est un paradigme de programmation qui organise le code autour d'**objets** — des entités qui combinent **données** (attributs) et **comportements** (méthodes).

### Les 4 Piliers de la POO

| Pilier | Définition | Analogie |
| :--- | :--- | :--- |
| **Encapsulation** | Protéger les données et contrôler l'accès | Boîte noire avec des boutons de contrôle |
| **Héritage** | Réutiliser et spécialiser une classe existante | Enfant qui hérite des traits de ses parents |
| **Polymorphisme** | Même nom, comportements différents | Un "crier()" différent selon l'animal |
| **Abstraction** | Masquer les détails, exposer l'essentiel | Conduire sans connaître le moteur |

---

## B. La Classe — Le Plan de Construction

Une **classe** est le **modèle** (blueprint) qui définit la structure et le comportement d'objets.

\`\`\`java
public class Etudiant {
    // ── ATTRIBUTS (Variables d'instance) — État ──
    String nom;
    int age;
    double moyenne;
    
    // ── MÉTHODES — Comportement ──
    public void sePrésenter() {
        System.out.println("Je m'appelle " + nom + ", j'ai " + age + " ans.");
    }
    
    public boolean estAdmis() {
        return moyenne >= 10.0;
    }
}
\`\`\`

---

## C. L'Objet — Une Instance Concrète

Un **objet** est une **instance** de classe créée avec l'opérateur \`new\` :

\`\`\`java
public class Main {
    public static void main(String[] args) {
        // Création d'objets (instanciation)
        Etudiant e1 = new Etudiant();  // Appel du constructeur par défaut
        Etudiant e2 = new Etudiant();
        
        // Attribution des valeurs aux attributs
        e1.nom = "Alice";
        e1.age = 21;
        e1.moyenne = 13.5;
        
        e2.nom = "Bob";
        e2.age = 23;
        e2.moyenne = 8.0;
        
        // Appel des méthodes
        e1.sePrésenter();  // Je m'appelle Alice, j'ai 21 ans.
        e2.sePrésenter();  // Je m'appelle Bob, j'ai 23 ans.
        
        System.out.println(e1.nom + " admis ? " + e1.estAdmis());  // Alice admis ? true
        System.out.println(e2.nom + " admis ? " + e2.estAdmis());  // Bob admis ? false
    }
}
\`\`\`

---

## D. Références d'Objets et null

\`\`\`java
Etudiant e = new Etudiant();  // e est une RÉFÉRENCE vers l'objet en mémoire
e.nom = "Alice";

Etudiant e2 = e;  // e2 pointe vers le MÊME objet (pas une copie !)
e2.nom = "Bob";

System.out.println(e.nom);   // Bob ! (e et e2 partagent le même objet)
System.out.println(e2.nom);  // Bob

// null : référence vers aucun objet
Etudiant e3 = null;
e3.sePrésenter();  // ✗ NullPointerException : e3 ne pointe vers aucun objet !

// Toujours vérifier avant d'utiliser
if (e3 != null) {
    e3.sePrésenter();  // Safe
}
\`\`\`

---

## E. Modèle Mémoire Simplifié

\`\`\`
Stack (pile)          Heap (tas)
─────────────         ──────────────────────────
e1 → ─────────────→  [Etudiant { nom:"Alice", age:21, moyenne:13.5 }]
e2 → ─────────────→  [Etudiant { nom:"Bob",   age:23, moyenne:8.0  }]
─────────────         ──────────────────────────
\`\`\`

Les **variables de référence** (\`e1\`, \`e2\`) sont sur la pile (Stack).  
Les **objets** eux-mêmes sont sur le tas (Heap).`,
    examples: `# Exemples — Leçon 11

## Exemple : Classe CompteBancaire

\`\`\`java
public class CompteBancaire {
    String titulaire;
    double solde;
    
    public void deposer(double montant) {
        if (montant > 0) solde += montant;
    }
    
    public boolean retirer(double montant) {
        if (montant > 0 && montant <= solde) {
            solde -= montant;
            return true;
        }
        return false;
    }
    
    public void afficherSolde() {
        System.out.println(titulaire + " : " + solde + " DH");
    }
}

// Utilisation
public class Main {
    public static void main(String[] args) {
        CompteBancaire c = new CompteBancaire();
        c.titulaire = "Ahmed";
        c.solde = 1000.0;
        
        c.deposer(500);
        c.retirer(200);
        c.afficherSolde();  // Ahmed : 1300.0 DH
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 11**

1. **Classe ≠ Objet** : La classe est le plan (blueprint), l'objet est la maison construite à partir de ce plan. On peut créer des milliers d'objets à partir d'une seule classe.

2. **null ≠ 0** : null signifie "aucun objet référencé". Appeler une méthode sur null → NullPointerException.

3. **Affectation de référence** : \`e2 = e1\` ne crée pas une copie — les deux variables pointent vers le même objet !`,
    quiz: [
      {
        id: 2001,
        question_number: 'Q1',
        question_text: "Que représente une classe en Java ?",
        option_a: "Un objet créé en mémoire",
        option_b: "Un plan de construction (blueprint) définissant attributs et méthodes",
        option_c: "Une méthode statique",
        option_d: "Un type primitif",
        correct_option: 'B',
        explanation: "Une classe est un modèle (blueprint) qui définit la structure (attributs) et le comportement (méthodes) de ses instances (objets). La classe elle-même n'est pas un objet.",
        astuce: "Classe = Plan | Objet = Instance créée à partir du plan."
      },
      {
        id: 2002,
        question_number: 'Q2',
        question_text: "Qu'arrive-t-il si on appelle une méthode sur une variable de référence valant `null` ?",
        option_a: "La méthode est exécutée normalement",
        option_b: "NullPointerException est lancée à l'exécution",
        option_c: "Erreur de compilation",
        option_d: "La valeur 0 est retournée",
        correct_option: 'B',
        explanation: "Une variable null ne pointe vers aucun objet. Tenter d'appeler une méthode via une référence null provoque une NullPointerException à l'exécution.",
        astuce: "Vérifier null avant d'utiliser : `if (obj != null) { obj.methode(); }`"
      }
    ]
  },

  {
    num: 12,
    moduleId: 'java_mod_9',
    moduleTitle: 'Module 9 — Constructeurs, this et static',
    title: "Constructeurs, this() et Ordre d'Initialisation",
    duration: '35 min',
    content: `# Module 4 — Leçon 12 : Constructeurs, this et static

---

## A. Le Constructeur

Un **constructeur** est une méthode spéciale appelée automatiquement lors de l'instanciation (\`new\`). Il initialise l'objet.

\`\`\`java
public class Etudiant {
    String nom;
    int age;
    
    // Constructeur sans paramètre (défaut si aucun constructeur n'est déclaré)
    public Etudiant() {
        nom = "Inconnu";
        age = 0;
    }
    
    // Constructeur avec paramètres
    public Etudiant(String nom, int age) {
        this.nom = nom;   // this.nom = attribut, nom = paramètre
        this.age = age;
    }
    
    // Constructeur copie
    public Etudiant(Etudiant autre) {
        this.nom = autre.nom;
        this.age = autre.age;
    }
}
\`\`\`

### Règles des Constructeurs

| Règle | Détail |
| :--- | :--- |
| **Nom** | Identique à la classe (sensible à la casse) |
| **Retour** | Aucun type de retour (pas même \`void\`) |
| **Constructeur par défaut** | Fourni implicitement UNIQUEMENT si aucun constructeur n'est déclaré |
| **Surcharge** | Plusieurs constructeurs avec des paramètres différents ✓ |

---

## B. La Référence \`this\`

\`this\` représente l'objet courant sur lequel la méthode est appelée.

\`\`\`java
public class Voiture {
    String marque;
    int vitesse;
    
    // Usage 1 : lever l'ambiguïté entre attribut et paramètre
    public Voiture(String marque, int vitesse) {
        this.marque = marque;    // this.marque = attribut
        this.vitesse = vitesse;  // vitesse = paramètre
    }
    
    // Usage 2 : appeler un autre constructeur (DOIT être la première instruction !)
    public Voiture(String marque) {
        this(marque, 0);  // Appel du constructeur Voiture(String, int)
    }
    
    // Usage 3 : retourner l'objet courant (chaînage)
    public Voiture accélérer(int delta) {
        this.vitesse += delta;
        return this;  // Retourne l'objet lui-même pour le chaînage
    }
    
    // Chaînage de méthodes
    // voiture.accélérer(10).accélérer(20).accélérer(5);
}
\`\`\`

---

## C. Membres \`static\` — Appartiennent à la Classe

Un membre \`static\` appartient à la **classe entière**, pas à une instance particulière.

\`\`\`java
public class Compteur {
    private String nom;
    private static int nombreInstances = 0;  // Partagé entre toutes les instances !
    
    public Compteur(String nom) {
        this.nom = nom;
        nombreInstances++;  // Incrémenté pour chaque nouvel objet
    }
    
    // Méthode statique : ne peut accéder QU'aux membres statiques
    public static int getNombreInstances() {
        return nombreInstances;
        // return this.nom;  // ✗ ERREUR : 'this' n'existe pas dans une méthode statique
    }
}

// Utilisation
Compteur c1 = new Compteur("A");
Compteur c2 = new Compteur("B");
Compteur c3 = new Compteur("C");

System.out.println(Compteur.getNombreInstances());  // 3
// Appel via la classe (pas via un objet) pour les méthodes statiques
\`\`\`

---

## D. Ordre d'Initialisation — Piège de Concours

\`\`\`java
public class OrdrInit {
    // 1. Variables statiques (dans l'ordre de déclaration)
    static int a = 1;
    
    // 2. Blocs statiques (dans l'ordre d'apparition)
    static {
        System.out.println("Bloc statique 1 : a=" + a);  // a=1
        a = 2;
    }
    
    // 3. Variables d'instance (dans l'ordre de déclaration)
    int b = 10;
    
    // 4. Blocs d'initialisation d'instance (dans l'ordre d'apparition)
    {
        System.out.println("Bloc instance : b=" + b);  // b=10
        b = 20;
    }
    
    // 5. Constructeur
    public OrdrInit() {
        System.out.println("Constructeur : b=" + b);  // b=20
    }
    
    public static void main(String[] args) {
        // Chargement de la classe → blocs statiques (une seule fois)
        System.out.println("Création obj1 :");
        OrdrInit obj1 = new OrdrInit();  // Bloc instance + Constructeur
        
        System.out.println("Création obj2 :");
        OrdrInit obj2 = new OrdrInit();  // Bloc instance + Constructeur (pas le bloc statique !)
    }
}
\`\`\`

**Sortie :**
\`\`\`text
Bloc statique 1 : a=1
Création obj1 :
Bloc instance : b=10
Constructeur : b=20
Création obj2 :
Bloc instance : b=10
Constructeur : b=20
\`\`\``,
    examples: `# Exemples — Leçon 12

## Exemple Concours : Output de constructeurs en chaîne

\`\`\`java
class B {
    public B() {
        System.out.print("Salut");
    }
    public B(int i) {
        this();
        System.out.println("Bonjour" + i);
    }
}

public class Main {
    public static void main(String[] args) {
        B monB = new B(2003);
    }
}
\`\`\`

**Trace d'exécution :**
1. \`new B(2003)\` → appelle \`B(int i)\`
2. Première instruction de \`B(int i)\` : \`this()\` → appelle \`B()\`
3. \`B()\` affiche : \`Salut\`
4. Retour dans \`B(int i)\` → affiche : \`Bonjour2003\` (avec retour à la ligne)

**Sortie :**
\`\`\`text
SalutBonjour2003
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 12**

1. **this() doit être la première instruction** du constructeur. Sinon : erreur de compilation.

2. **Constructeur par défaut** : Disparaît dès qu'on déclare le moindre constructeur ! Si on veut conserver un constructeur sans paramètre, il faut l'écrire explicitement.

3. **Méthode statique vs méthode d'instance** : Une méthode statique ne peut pas utiliser \`this\`, ni accéder aux attributs d'instance directement.

4. **Attribut static = partagé** entre toutes les instances (ex: compteur global, constantes).`,
    quiz: [
      {
        id: 2101,
        question_number: 'Q1',
        question_text: "Si une classe déclare un constructeur avec paramètres mais pas de constructeur sans paramètres, que se passe-t-il si on tente `new MaClasse()` ?",
        option_a: "L'objet est créé avec des valeurs par défaut",
        option_b: "Erreur de compilation : no suitable constructor found",
        option_c: "NullPointerException à l'exécution",
        option_d: "Java utilise le constructeur avec paramètres avec des valeurs null/0",
        correct_option: 'B',
        explanation: "Le constructeur par défaut (sans paramètres) n'est fourni implicitement QUE si aucun constructeur n'est déclaré. Si on déclare un constructeur avec paramètres, le constructeur sans paramètres disparaît.",
        astuce: "Constructeur par défaut : fourni par Java UNIQUEMENT si on n'écrit aucun constructeur."
      },
      {
        id: 2102,
        question_number: 'Q2',
        question_text: "Un membre `static` d'une classe Java appartient à :",
        option_a: "Chaque instance séparément",
        option_b: "La classe entière (partagé entre toutes les instances)",
        option_c: "La méthode qui le déclare",
        option_d: "Le package",
        correct_option: 'B',
        explanation: "Un membre statique appartient à la classe et est partagé par toutes les instances. Il existe même sans aucune instance créée. Il s'accède via le nom de la classe : `MaClasse.membreStatic`.",
        astuce: "static = appartient à la classe. Sans static = appartient à chaque instance."
      }
    ]
  },

  {
    num: 13,
    moduleId: 'java_mod_10',
    moduleTitle: 'Module 10 — Encapsulation et Accès',
    title: "Encapsulation : Visibilité, Getters/Setters et final",
    duration: '25 min',
    content: `# Module 4 — Leçon 13 : Encapsulation et Modificateurs d'Accès

---

## A. Le Principe d'Encapsulation

L'**encapsulation** consiste à :
1. **Protéger** les attributs en les déclarant \`private\`
2. **Contrôler** l'accès via des méthodes publiques (getters/setters)

\`\`\`java
public class CompteBancaire {
    private String titulaire;    // Protégé : personne ne peut accéder directement
    private double solde;        // Protégé : impossible de mettre un solde négatif sans contrôle
    
    // Getter : retourne la valeur
    public String getTitulaire() {
        return titulaire;
    }
    
    // Setter : modifie la valeur avec validation
    public void setSolde(double solde) {
        if (solde >= 0) {
            this.solde = solde;
        } else {
            System.out.println("Erreur : solde négatif interdit !");
        }
    }
    
    public double getSolde() {
        return solde;
    }
}
\`\`\`

---

## B. Les 4 Modificateurs de Visibilité

| Modificateur | Même classe | Même package | Sous-classe | Partout |
| :--- | :---: | :---: | :---: | :---: |
| \`private\` | ✓ | ✗ | ✗ | ✗ |
| (défaut/package) | ✓ | ✓ | ✗ | ✗ |
| \`protected\` | ✓ | ✓ | ✓ | ✗ |
| \`public\` | ✓ | ✓ | ✓ | ✓ |

---

## C. Le Modificateur \`final\`

\`\`\`java
// final sur une variable : sa valeur ne peut plus changer après initialisation
final int MAX_TENTATIVES = 3;
MAX_TENTATIVES = 5;  // ✗ ERREUR : cannot assign a value to final variable

// final sur une méthode : ne peut pas être redéfinie dans une sous-classe
public final void méthodeInterditeDeRédéfinition() { }

// final sur une classe : ne peut pas être étendue (héritée)
public final class String { }  // Voilà pourquoi String ne peut pas être héritée !

// Constantes de classe (public static final) — convention SCREAMING_SNAKE_CASE
public class Math {
    public static final double PI = 3.14159265358979;
}
\`\`\`

---

## D. Différence final / finally / finalize

| Mot-clé | Nature | Utilisation |
| :--- | :--- | :--- |
| \`final\` | Modificateur | Variable constante, méthode non-redéfinissable, classe non-héritable |
| \`finally\` | Bloc try | Bloc exécuté toujours après try/catch, même si exception |
| \`finalize()\` | Méthode | Appelée par le GC avant de détruire l'objet (déprécié depuis Java 9) |

---

## E. Packages et Imports

\`\`\`java
// Déclaration de package (première ligne du fichier)
package com.inforeussit.java;

// Import d'une classe spécifique
import java.util.Scanner;
import java.util.ArrayList;

// Import de toutes les classes d'un package (déconseillé)
import java.util.*;

// Utilisation sans import (nom complet qualifié)
java.util.Scanner sc = new java.util.Scanner(System.in);
\`\`\``,
    examples: `# Exemples — Leçon 13

## Exemple : Classe avec encapsulation complète

\`\`\`java
public class Etudiant {
    private String nom;
    private int age;
    private double moyenne;
    
    public Etudiant(String nom, int age, double moyenne) {
        setNom(nom);
        setAge(age);
        setMoyenne(moyenne);
    }
    
    public String getNom() { return nom; }
    public int getAge() { return age; }
    public double getMoyenne() { return moyenne; }
    
    public void setNom(String nom) {
        if (nom != null && !nom.isBlank()) this.nom = nom;
    }
    
    public void setAge(int age) {
        if (age > 0 && age < 150) this.age = age;
    }
    
    public void setMoyenne(double moyenne) {
        if (moyenne >= 0 && moyenne <= 20) this.moyenne = moyenne;
    }
    
    @Override
    public String toString() {
        return nom + " (âge:" + age + ", moy:" + moyenne + ")";
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 13**

1. **Convention** : Déclarer les attributs \`private\`, fournir des getters/setters publics avec validation. C'est la base de l'encapsulation.

2. **final vs finally vs finalize** : Question classique de concours ! Les 3 mots sont totalement différents.

3. **Classe String est final** : C'est pourquoi on ne peut pas hériter de String. C'est délibéré pour garantir l'immutabilité.`,
    quiz: [
      {
        id: 2201,
        question_number: 'Q1',
        question_text: "Un membre déclaré `protected` est accessible depuis :",
        option_a: "La même classe uniquement",
        option_b: "La même classe et le même package uniquement",
        option_c: "La même classe, le même package et les sous-classes",
        option_d: "Partout",
        correct_option: 'C',
        explanation: "`protected` autorise l'accès depuis la même classe, les classes du même package ET les sous-classes (même dans un package différent).",
        astuce: "private < défaut < protected < public (ordre croissant de visibilité)."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 5 — HÉRITAGE (L14-L16)
  // ═══════════════════════════════════════════════════════
  {
    num: 14,
    moduleId: 'java_mod_11',
    moduleTitle: 'Module 11 — Héritage',
    title: "Héritage : extends, super() et Ordre de Construction",
    duration: '35 min',
    content: `# Module 5 — Leçon 14 : L'Héritage en Java

---

## A. Principe de l'Héritage

L'**héritage** permet à une classe (enfant/sous-classe) de récupérer automatiquement tous les membres **non-privés** d'une autre classe (parent/superclasse).

\`\`\`java
// Classe parent
public class Animal {
    String nom;
    int age;
    
    public Animal(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
    
    public void manger() {
        System.out.println(nom + " mange.");
    }
    
    public void crier() {
        System.out.println(nom + " fait un son.");
    }
}

// Classe enfant — hérite de Animal
public class Chien extends Animal {
    String race;
    
    public Chien(String nom, int age, String race) {
        super(nom, age);  // DOIT appeler le constructeur parent EN PREMIER
        this.race = race;
    }
    
    // Redéfinition (Override) de crier()
    @Override
    public void crier() {
        System.out.println(nom + " aboie : Ouaf !");
    }
    
    // Nouvelle méthode propre à Chien
    public void rapporterBalle() {
        System.out.println(nom + " rapporte la balle !");
    }
}
\`\`\`

---

## B. L'Appel super() — Règles Strictes

\`\`\`java
public class Forme {
    double couleur;
    public Forme(double couleur) { this.couleur = couleur; }
}

public class Cercle extends Forme {
    double rayon;
    
    public Cercle(double rayon, double couleur) {
        super(couleur);  // OBLIGATOIRE si parent n'a pas de constructeur par défaut
                         // DOIT être la PREMIÈRE instruction du constructeur
        this.rayon = rayon;
    }
}
\`\`\`

> [!IMPORTANT]
> Si la classe parent n'a **pas** de constructeur sans paramètres, la sous-classe **DOIT** appeler \`super(...)\` explicitement — sinon erreur de compilation.

---

## C. Ordre de Construction dans une Hiérarchie

\`\`\`java
class A {
    A() { System.out.println("Constructeur A"); }
}

class B extends A {
    B() {
        // super() implicite inséré ici par le compilateur → appelle A()
        System.out.println("Constructeur B");
    }
}

class C extends B {
    C() {
        // super() implicite → appelle B()
        System.out.println("Constructeur C");
    }
}

new C();  // Sortie : Constructeur A / Constructeur B / Constructeur C
\`\`\`

**Règle :** La construction part toujours du **parent le plus haut** vers l'enfant le plus bas.

---

## D. Ce qui est Hérité — Ce qui ne l'est pas

| Élément | Hérité ? |
| :--- | :--- |
| Attributs \`public\` et \`protected\` | ✓ Oui |
| Méthodes \`public\` et \`protected\` | ✓ Oui |
| Éléments \`package-private\` (même package) | ✓ Oui |
| Attributs et méthodes \`private\` | ✗ Non (mais accessibles via getters/setters hérités) |
| Constructeurs | ✗ Non (seulement via \`super()\`) |
| Membres \`static\` | ✓ Partagés mais PAS "hérités" au sens POO |

---

## E. Héritage Simple — Limite de Java

Java autorise **uniquement l'héritage simple** (une classe ne peut étendre qu'une seule autre classe).

\`\`\`java
class A { }
class B extends A { }     // ✓ Valide
class C extends A, B { }  // ✗ ERREUR : Java n'autorise pas l'héritage multiple
\`\`\`

**Solution :** Les interfaces (Module 6) permettent de compenser cette limitation.`,
    examples: `# Exemples — Leçon 14

## Exemple : Hiérarchie Personne / Etudiant / Enseignant

\`\`\`java
public class Personne {
    protected String nom;
    protected String email;
    
    public Personne(String nom, String email) {
        this.nom = nom;
        this.email = email;
    }
    
    public void sePrésenter() {
        System.out.println("Je m'appelle " + nom);
    }
}

public class Etudiant extends Personne {
    private int numEtudiant;
    private double moyenne;
    
    public Etudiant(String nom, String email, int numEtudiant) {
        super(nom, email);
        this.numEtudiant = numEtudiant;
        this.moyenne = 0.0;
    }
    
    @Override
    public void sePrésenter() {
        super.sePrésenter();  // Appelle sePrésenter() de Personne
        System.out.println("N° étudiant : " + numEtudiant);
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 14**

1. **super() en premier** : L'appel à super() dans un constructeur doit toujours être la toute première instruction. Sinon : erreur de compilation.

2. **Ordre de construction** : Toujours de l'ancêtre le plus ancien vers l'enfant. A→B→C si C extends B extends A.

3. **Java = héritage simple** : Une classe étend exactement 0 ou 1 classe (et toutes étendent implicitement Object si non spécifié).`,
    quiz: [
      {
        id: 2301,
        question_number: 'Q1',
        question_text: "Si la classe parent n'a pas de constructeur sans paramètre, que doit faire obligatoirement le constructeur de la sous-classe ?",
        option_a: "Appeler this() comme première instruction",
        option_b: "Appeler super() avec les arguments requis comme première instruction",
        option_c: "Rien de spécial",
        option_d: "Déclarer un attribut final",
        correct_option: 'B',
        explanation: "Si le parent n'a pas de constructeur par défaut, la sous-classe doit impérativement appeler super() avec les bons arguments comme première instruction de son constructeur.",
        astuce: "super() = appel du constructeur parent. Doit être la 1ère instruction. Obligatoire si parent n'a pas de constructeur vide."
      },
      {
        id: 2302,
        question_number: 'Q2',
        question_text: "Sachant que C extends B et B extends A, dans quel ordre s'exécutent les constructeurs pour `new C()` ?",
        option_a: "C, B, A",
        option_b: "A, C, B",
        option_c: "A, B, C",
        option_d: "B, A, C",
        correct_option: 'C',
        explanation: "La construction va de l'ancêtre le plus haut vers l'enfant : d'abord A (ancêtre commun), puis B, puis C.",
        astuce: "Construction hiérarchique : ancêtre → parent → enfant (du haut vers le bas)."
      }
    ]
  },

  {
    num: 15,
    moduleId: 'java_mod_12',
    moduleTitle: 'Module 12 — Polymorphisme et Méthodes',
    title: "Polymorphisme : Liaison Dynamique, Upcasting et @Override",
    duration: '35 min',
    content: `# Module 5 — Leçon 15 : Polymorphisme et Méthodes

---

## A. Le Polymorphisme de Sous-type

Le **polymorphisme** permet d'utiliser un objet d'une sous-classe via une référence de la superclasse.

\`\`\`java
class Animal {
    public void crier() { System.out.println("..."); }
}

class Chien extends Animal {
    @Override
    public void crier() { System.out.println("Ouaf !"); }
}

class Chat extends Animal {
    @Override
    public void crier() { System.out.println("Miaou !"); }
}

// Polymorphisme en action
Animal a1 = new Chien();  // Type déclaré : Animal | Type réel : Chien
Animal a2 = new Chat();   // Type déclaré : Animal | Type réel : Chat

a1.crier();  // "Ouaf !" — méthode de Chien (type RÉEL, pas déclaré)
a2.crier();  // "Miaou !" — méthode de Chat

// Tableau polymorphique
Animal[] animaux = { new Chien(), new Chat(), new Chien() };
for (Animal a : animaux) {
    a.crier();  // Chaque objet répond selon son type réel
}
\`\`\`

---

## B. La Liaison Dynamique (Late Binding)

Java résout les appels de méthodes d'instance **à l'exécution** (pas à la compilation) selon le **type réel** de l'objet, pas son type déclaré.

\`\`\`java
Animal a = new Chien();  // Type déclaré : Animal | Type réel : Chien
a.crier();               // Java appelle Chien.crier(), PAS Animal.crier()
                         // Liaison dynamique = résolution au runtime selon le type réel
\`\`\`

---

## C. Upcasting et Downcasting

\`\`\`java
// UPCASTING (implicite) : sous-classe → superclasse
Animal a = new Chien();  // Automatique, toujours sûr

// DOWNCASTING (explicite) : superclasse → sous-classe
Chien chien = (Chien) a;  // Manuel — risqué si l'objet réel n'est pas un Chien

// instanceof : vérification avant downcasting
if (a instanceof Chien) {
    Chien c = (Chien) a;
    c.rapporterBalle();  // Méthode propre à Chien
}

// ClassCastException si le downcasting est incorrect
Animal a2 = new Chat();
Chien c2 = (Chien) a2;  // ✗ ClassCastException au runtime ! Chat n'est pas un Chien
\`\`\`

---

## D. Surcharge vs Redéfinition — La Distinction Fondamentale

| Critère | Surcharge (Overloading) | Redéfinition (Overriding) |
| :--- | :--- | :--- |
| **Classe** | Même classe | Sous-classe et superclasse |
| **Nom** | Identique | Identique |
| **Paramètres** | Différents (obligatoire) | Identiques (obligatoire) |
| **Type retour** | Peut différer | Même type ou sous-type (depuis Java 5) |
| **Résolution** | **À la compilation** (statique) | **À l'exécution** (dynamique) |
| **Annotation** | Aucune | \`@Override\` recommandé |

\`\`\`java
public class Calculateur {
    // SURCHARGE (Overloading) dans la même classe
    public int calculer(int a, int b) { return a + b; }
    public double calculer(double a, double b) { return a + b; }
    public int calculer(int a, int b, int c) { return a + b + c; }
}

public class CalculateurAvancé extends Calculateur {
    // REDÉFINITION (Overriding) — même signature
    @Override
    public int calculer(int a, int b) {
        System.out.println("Version avancée");
        return super.calculer(a, b) * 2;  // Appelle la version parent
    }
}
\`\`\`

---

## E. @Override — L'Annotation Protectrice

\`@Override\` demande au compilateur de vérifier qu'on redéfinit bien une méthode existante :

\`\`\`java
public class A {
    public void afficher() { }
}

public class B extends A {
    @Override
    public void afficher() { }    // ✓ Redéfinit bien A.afficher()
    
    @Override
    public void aficher() { }     // ✗ ERREUR : 'aficher' n'existe pas dans A (typo détectée !)
}
\`\`\`

---

## F. Ce qui ne peut PAS être redéfini

| Modificateur | Peut être redéfini ? |
| :--- | :--- |
| \`final\` | ✗ Non — erreur de compilation |
| \`private\` | ✗ Non — invisible depuis la sous-classe |
| \`static\` | ✗ Non — masquage (hiding), pas redéfinition |
| \`public\` | ✓ Oui |
| \`protected\` | ✓ Oui |`,
    examples: `# Exemples — Leçon 15

## Exemple Concours : Trace d'exécution polymorphique

\`\`\`java
class Base {
    int x = 10;
    public int getX() { return x; }
    public void afficher() { System.out.println("Base: x=" + x); }
}

class Dérivé extends Base {
    int x = 20;  // Masque l'attribut de Base (shadowing)
    @Override
    public void afficher() { System.out.println("Dérivé: x=" + x); }
}

public class Main {
    public static void main(String[] args) {
        Base b = new Dérivé();
        b.afficher();         // "Dérivé: x=20" (liaison dynamique sur méthode)
        System.out.println(b.x);  // 10 ! (les attributs utilisent le type DÉCLARÉ)
    }
}
\`\`\`

**Points clés :**
- Méthodes d'instance : liaison dynamique → type RÉEL (Dérivé)
- Attributs : liaison statique → type DÉCLARÉ (Base)`,
    astuces: `⚡ **Astuces — Leçon 15**

1. **Méthodes → type réel. Attributs → type déclaré** : La liaison dynamique s'applique aux méthodes d'instance, PAS aux attributs.

2. **@Override est optionnel mais vital** : Sans lui, une faute de frappe dans le nom de la méthode redéfinie créera une nouvelle méthode silencieuse sans erreur.

3. **instanceof avant downcast** : Toujours vérifier avec instanceof avant de caster vers un sous-type pour éviter ClassCastException.`,
    quiz: [
      {
        id: 2401,
        question_number: 'Q1',
        question_text: "Pour `Animal a = new Chien();`, `a.crier()` appelle la méthode de :",
        option_a: "Animal",
        option_b: "Chien",
        option_c: "La JVM choisit aléatoirement",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "La liaison dynamique (late binding) résout les méthodes d'instance selon le type RÉEL à l'exécution. L'objet réel est un Chien, donc Chien.crier() est appelée.",
        astuce: "Liaison dynamique = méthode du type RÉEL (pas du type déclaré)."
      },
      {
        id: 2402,
        question_number: 'Q2',
        question_text: "Quelle est la différence entre surcharge et redéfinition ?",
        option_a: "Aucune différence, c'est la même chose",
        option_b: "La surcharge est dans la même classe avec des paramètres différents, la redéfinition est dans une sous-classe avec les mêmes paramètres",
        option_c: "La redéfinition est dans la même classe, la surcharge dans une sous-classe",
        option_d: "La surcharge ne nécessite pas le même nom",
        correct_option: 'B',
        explanation: "Surcharge (overloading) : même classe, même nom, DIFFÉRENTS paramètres, résolue à la compilation. Redéfinition (overriding) : sous-classe, même nom, MÊMES paramètres, résolue à l'exécution.",
        astuce: "Surcharge → compile-time, même classe. Redéfinition → runtime, hiérarchie."
      }
    ]
  },

  {
    num: 16,
    moduleId: 'java_mod_13',
    moduleTitle: 'Module 13 — Abstraction et Interfaces',
    title: "Abstraction : Classes Abstraites et Interfaces",
    duration: '35 min',
    content: `# Module 5 — Leçon 16 : Abstraction — Classes Abstraites et Interfaces

---

## A. Classes Abstraites

Une **classe abstraite** est une classe incomplète qui ne peut pas être instanciée directement. Elle peut contenir des méthodes abstraites (sans corps) et des méthodes concrètes (avec corps).

\`\`\`java
public abstract class Forme {
    private String couleur;
    
    public Forme(String couleur) {
        this.couleur = couleur;
    }
    
    // Méthode abstraite — DOIT être redéfinie dans les sous-classes
    public abstract double calculerAire();
    public abstract double calculerPérimètre();
    
    // Méthode concrète — héritée directement
    public void afficher() {
        System.out.println("Forme " + couleur + " : aire=" + calculerAire());
    }
}

public class Cercle extends Forme {
    private double rayon;
    
    public Cercle(double rayon, String couleur) {
        super(couleur);
        this.rayon = rayon;
    }
    
    @Override
    public double calculerAire() { return Math.PI * rayon * rayon; }
    
    @Override
    public double calculerPérimètre() { return 2 * Math.PI * rayon; }
}

// Forme f = new Forme("rouge");  // ✗ ERREUR : Forme est abstraite !
Forme f = new Cercle(5.0, "rouge");  // ✓ Référence abstraite, objet concret
\`\`\`

---

## B. Interfaces

Une **interface** est un contrat qui définit des comportements que les classes peuvent implémenter.

\`\`\`java
public interface Payable {
    // Les constantes sont implicitement public static final
    double TAUX_TVA = 0.20;
    
    // Les méthodes abstraites sont implicitement public abstract
    double calculerMontant();
    String getDescription();
    
    // Méthode default (Java 8+) — comportement par défaut modifiable
    default double calculerMontantTTC() {
        return calculerMontant() * (1 + TAUX_TVA);
    }
    
    // Méthode statique (Java 8+) — utilitaire de l'interface
    static boolean estValide(double montant) {
        return montant > 0;
    }
}

public class Facture implements Payable {
    private double montantHT;
    private String description;
    
    public Facture(double montantHT, String description) {
        this.montantHT = montantHT;
        this.description = description;
    }
    
    @Override
    public double calculerMontant() { return montantHT; }
    
    @Override
    public String getDescription() { return description; }
}
\`\`\`

---

## C. Implémentation Multiple d'Interfaces

\`\`\`java
// Java permet d'implémenter plusieurs interfaces (impossible avec extends)
public class ProduitNumérique implements Payable, Comparable<ProduitNumérique>, Cloneable {
    // Doit implémenter toutes les méthodes abstraites des 3 interfaces
    @Override
    public double calculerMontant() { return 29.99; }
    
    @Override
    public String getDescription() { return "E-book Java"; }
    
    @Override
    public int compareTo(ProduitNumérique autre) {
        return Double.compare(this.calculerMontant(), autre.calculerMontant());
    }
}
\`\`\`

---

## D. Classe Abstraite vs Interface — Comparatif Concours

| Critère | Classe Abstraite | Interface |
| :--- | :--- | :--- |
| **Mot-clé** | \`abstract class\` | \`interface\` |
| **Instanciation** | Impossible | Impossible |
| **Héritage/Implem** | Une seule (\`extends\`) | Plusieurs (\`implements\`) |
| **Méthodes abstraites** | Optionnelles (0 à toutes) | Toutes par défaut (sauf default/static) |
| **Méthodes concrètes** | ✓ Oui | ✓ \`default\` et \`static\` (Java 8+) |
| **Attributs** | Peut avoir n'importe lesquels | Constantes uniquement (public static final) |
| **Constructeur** | ✓ Oui | ✗ Non |
| **Modificateurs** | Tous (public/private/protected) | Implicitement public |

---

## E. Quand Utiliser Quoi ?

- **Classe abstraite** : Relation "est-un" forte avec code partagé + état (attributs d'instance)
- **Interface** : Capacités/comportements multiples (contrats) sans lien hiérarchique fort`,
    examples: `# Exemples — Leçon 16

## Exemple : Interface pour le paiement

\`\`\`java
interface Imprimable {
    void imprimer();
    
    default void prévisualiser() {
        System.out.println("--- PRÉVISUALISATION ---");
        imprimer();
        System.out.println("--- FIN PRÉVISUALISATION ---");
    }
}

interface Sauvegardable {
    void sauvegarder(String chemin);
}

class Document implements Imprimable, Sauvegardable {
    private String contenu;
    
    public Document(String contenu) { this.contenu = contenu; }
    
    @Override
    public void imprimer() { System.out.println(contenu); }
    
    @Override
    public void sauvegarder(String chemin) { System.out.println("Sauvegardé dans " + chemin); }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 16**

1. **Classe abstraite avec 0 méthode abstraite** : C'est légal ! Une classe peut être déclarée abstract sans méthodes abstraites pour empêcher son instanciation.

2. **Méthode default** : Si deux interfaces ont la même méthode default, la classe qui les implémente DOIT redéfinir cette méthode pour résoudre le conflit.

3. **Interface ≠ classe abstraite** : Une interface ne peut pas avoir de constructeur ni d'attributs d'instance (seulement des constantes public static final).`,
    quiz: [
      {
        id: 2501,
        question_number: 'Q1',
        question_text: "Combien d'interfaces une classe Java peut-elle implémenter ?",
        option_a: "Une seule",
        option_b: "Deux maximum",
        option_c: "Un nombre illimité",
        option_d: "Aucune — les classes ne peuvent pas implémenter des interfaces",
        correct_option: 'C',
        explanation: "Une classe Java peut implémenter un nombre illimité d'interfaces. C'est la façon dont Java compense l'absence d'héritage multiple de classes.",
        astuce: "extends = 1 seule classe | implements = autant d'interfaces que voulu."
      },
      {
        id: 2502,
        question_number: 'Q2',
        question_text: "Les attributs déclarés dans une interface Java sont implicitement :",
        option_a: "private instance",
        option_b: "public static final (constantes)",
        option_c: "protected",
        option_d: "public instance",
        correct_option: 'B',
        explanation: "Tous les attributs déclarés dans une interface sont implicitement `public static final` — ce sont des constantes de classe. On ne peut pas y déclarer des attributs d'instance.",
        astuce: "Interface = contrat. Pas d'état. Attributs = constantes public static final."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 6 — CLASSES FONDAMENTALES ET EXCEPTIONS (L17-L19)
  // ═══════════════════════════════════════════════════════
  {
    num: 17,
    moduleId: 'java_mod_14',
    moduleTitle: 'Module 14 — Classes Fondamentales et Exceptions',
    title: "La Classe Object : toString(), equals() et hashCode()",
    duration: '25 min',
    content: `# Module 6 — Leçon 17 : La Classe Object — Ancêtre de Toutes les Classes

---

## A. La Classe Object

En Java, **toute classe hérite implicitement de \`java.lang.Object\`** si aucun \`extends\` n'est spécifié. Object est l'ancêtre commun de toutes les classes.

Méthodes importantes héritées de Object :

| Méthode | Comportement par défaut | Ce qu'on redéfinit généralement |
| :--- | :--- | :--- |
| \`toString()\` | Retourne \`NomClasse@adresseHex\` | Description lisible de l'objet |
| \`equals(Object)\` | Compare les références (\`==\`) | Comparaison de contenu |
| \`hashCode()\` | Code de hachage basé sur l'adresse | Basé sur les mêmes champs qu'equals |
| \`getClass()\` | Retourne l'objet Class de la classe | Rarement redéfini |
| \`clone()\` | Crée une copie superficielle | Si on veut supporter le clonage |

---

## B. Redéfinir toString()

\`\`\`java
public class Etudiant {
    private String nom;
    private int age;
    private double moyenne;
    
    public Etudiant(String nom, int age, double moyenne) {
        this.nom = nom; this.age = age; this.moyenne = moyenne;
    }
    
    // Sans toString() :
    // System.out.println(e) → Etudiant@7ef88735 (inutile)
    
    @Override
    public String toString() {
        return "Etudiant{nom='" + nom + "', age=" + age + ", moyenne=" + moyenne + "}";
    }
}

Etudiant e = new Etudiant("Alice", 21, 15.5);
System.out.println(e);  // Etudiant{nom='Alice', age=21, moyenne=15.5}
\`\`\`

---

## C. Redéfinir equals() et hashCode()

\`\`\`java
public class Etudiant {
    private String nom;
    private int age;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;              // Même référence → égaux
        if (obj == null) return false;             // null → pas égaux
        if (getClass() != obj.getClass()) return false;  // Classe différente → pas égaux
        
        Etudiant autre = (Etudiant) obj;           // Cast sûr après les vérifications
        return this.age == autre.age && 
               (this.nom == null ? autre.nom == null : this.nom.equals(autre.nom));
    }
    
    @Override
    public int hashCode() {
        // Contrat : si equals() retourne true → hashCode() doit retourner la même valeur
        int result = 31;
        result = 31 * result + age;
        result = 31 * result + (nom != null ? nom.hashCode() : 0);
        return result;
    }
}
\`\`\`

> [!IMPORTANT]
> **Contrat equals/hashCode :** Si deux objets sont égaux selon \`equals()\`, ils DOIVENT avoir le même \`hashCode()\`. Violer ce contrat cause des comportements imprévisibles dans les collections (\`HashMap\`, \`HashSet\`).

---

## D. instanceof et Identité

\`\`\`java
Animal a = new Chien();

System.out.println(a instanceof Chien);   // true (type réel)
System.out.println(a instanceof Animal);  // true (ancêtre)
System.out.println(a instanceof Object); // true (tout objet est un Object)
System.out.println(a instanceof Chat);   // false

// Pattern Matching instanceof (Java 16+)
if (a instanceof Chien c) {  // Déclare et caste automatiquement
    c.rapporterBalle();
}

// Identité vs Égalité
Etudiant e1 = new Etudiant("Alice", 21, 15.5);
Etudiant e2 = new Etudiant("Alice", 21, 15.5);
Etudiant e3 = e1;

System.out.println(e1 == e2);         // false (références différentes)
System.out.println(e1 == e3);         // true (même référence)
System.out.println(e1.equals(e2));    // true (si equals() bien redéfini)
\`\`\``,
    examples: `# Exemples — Leçon 17

## Exemple : Enum avec méthodes

\`\`\`java
public enum Saison {
    PRINTEMPS("Fleurs"), ETE("Chaleur"), AUTOMNE("Feuilles"), HIVER("Neige");
    
    private final String description;
    
    Saison(String description) { this.description = description; }
    
    public String getDescription() { return description; }
}

// Utilisation
Saison s = Saison.ETE;
System.out.println(s.getDescription());  // Chaleur
System.out.println(s.name());            // ETE
System.out.println(s.ordinal());         // 1

for (Saison saison : Saison.values()) {
    System.out.println(saison + " : " + saison.getDescription());
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 17**

1. **Toujours redéfinir hashCode() quand on redéfinit equals()** : Le contrat equals/hashCode est fondamental pour utiliser correctement HashMap, HashSet, etc.

2. **String.equals() vs ==** : String redéfinit equals() pour comparer le contenu. C'est pourquoi \`"abc".equals("abc")\` est true même pour des objets différents.

3. **instanceof null = false** : \`null instanceof Object\` → false. Pas d'exception, juste false.`,
    quiz: [
      {
        id: 2601,
        question_number: 'Q1',
        question_text: "Que retourne toString() par défaut (sans redéfinition) pour un objet Java ?",
        option_a: "null",
        option_b: "Le nom de la classe et l'adresse hexadécimale (ex: MaClasse@7ef88735)",
        option_c: "Les valeurs de tous les attributs",
        option_d: "Une chaîne vide",
        correct_option: 'B',
        explanation: "La méthode toString() héritée de Object retourne une chaîne de la forme 'NomClasse@hashCodeHex'. C'est pourquoi il est recommandé de la redéfinir pour avoir un affichage lisible.",
        astuce: "Redéfinir toString() pour tout objet que vous affichez avec System.out.println()."
      }
    ]
  },

  {
    num: 18,
    moduleId: 'java_mod_14',
    moduleTitle: 'Module 14 — Classes Fondamentales et Exceptions',
    title: "Gestion des Exceptions : try, catch, finally et throws",
    duration: '35 min',
    content: `# Module 6 — Leçon 18 : Gestion des Exceptions

---

## A. Qu'est-ce qu'une Exception ?

Une **exception** est un événement anormal survenant pendant l'exécution qui interrompt le flux normal du programme.

### Hiérarchie des Throwable

\`\`\`
Throwable
├── Error (Graves erreurs JVM — ne pas attraper)
│   ├── StackOverflowError
│   ├── OutOfMemoryError
│   └── ...
└── Exception
    ├── Checked Exceptions (à gérer obligatoirement)
    │   ├── IOException
    │   ├── SQLException
    │   └── ...
    └── RuntimeException (Unchecked — facultatif à gérer)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        ├── ClassCastException
        ├── ArithmeticException
        └── IllegalArgumentException
\`\`\`

---

## B. Checked vs Unchecked Exceptions

| Type | Vérification | Exemples | Obligatoire de gérer |
| :--- | :--- | :--- | :--- |
| **Checked** | À la compilation | IOException, SQLException | ✓ Oui — try/catch ou throws |
| **Unchecked** | À l'exécution | NullPointerException, ArrayIndexOutOfBoundsException | ✗ Non (mais conseillé) |

---

## C. try / catch / finally

\`\`\`java
public static int diviser(int a, int b) {
    try {
        // Bloc à surveiller
        System.out.println("Avant division");
        int result = a / b;    // Lance ArithmeticException si b == 0
        System.out.println("Résultat : " + result);
        return result;
    } catch (ArithmeticException e) {
        // Traitement de l'exception
        System.out.println("Erreur : division par zéro !");
        System.out.println("Message : " + e.getMessage());  // / by zero
        return -1;
    } catch (Exception e) {
        // Attrape tout autre type d'exception (catch général en dernier)
        System.out.println("Erreur inattendue : " + e.getMessage());
        return -2;
    } finally {
        // TOUJOURS exécuté, même si exception, même si return
        System.out.println("Bloc finally : nettoyage");
    }
}
\`\`\`

---

## D. throw et throws

\`\`\`java
// throws : déclare que la méthode peut lancer une exception (checked)
public void lireFichier(String chemin) throws IOException {
    // Le code peut lancer IOException sans la gérer ici
    // L'appelant doit gérer l'exception
}

// throw : lance explicitement une exception
public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new IllegalArgumentException("Âge invalide : " + age);
    }
    this.age = age;
}

// Exceptions personnalisées
public class SoldeInsuffisantException extends Exception {
    private double montantManquant;
    
    public SoldeInsuffisantException(double montantManquant) {
        super("Solde insuffisant. Manque : " + montantManquant + " DH");
        this.montantManquant = montantManquant;
    }
    
    public double getMontantManquant() { return montantManquant; }
}
\`\`\`

---

## E. try-with-resources (Java 7+)

\`\`\`java
// Ferme automatiquement les ressources (Closeable/AutoCloseable)
try (Scanner sc = new Scanner(System.in);
     PrintWriter writer = new PrintWriter("output.txt")) {
    // Utilisation des ressources
    // Fermées automatiquement même si exception
} catch (IOException e) {
    e.printStackTrace();
}
// Équivalent sans try-with-resources (verbeux et risqué)
Scanner sc = null;
try {
    sc = new Scanner(System.in);
    // ...
} finally {
    if (sc != null) sc.close();  // Que se passe-t-il si close() lance aussi une exception ?
}
\`\`\`

---

## F. Comportement de finally avec return

\`\`\`java
public static int test() {
    try {
        return 1;        // "Prévu" de retourner 1...
    } finally {
        return 2;        // ...mais finally écrase le return du try !
    }
}
System.out.println(test());  // 2 ! (le finally s'exécute avant le return du try)
\`\`\``,
    examples: `# Exemples — Leçon 18

## Exemple : Gestion de saisie robuste

\`\`\`java
import java.util.Scanner;
import java.util.InputMismatchException;

public class SaisieRobuste {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int nombre = -1;
        
        while (nombre < 0) {
            try {
                System.out.print("Entrez un nombre positif : ");
                nombre = sc.nextInt();
                if (nombre < 0) {
                    System.out.println("Le nombre doit être positif !");
                    nombre = -1;
                }
            } catch (InputMismatchException e) {
                System.out.println("Erreur : veuillez entrer un entier.");
                sc.nextLine();  // Vider le buffer
            }
        }
        System.out.println("Vous avez entré : " + nombre);
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 18**

1. **finally est TOUJOURS exécuté** : Même si on fait \`return\` dans try, le finally s'exécute. Exception : si \`System.exit()\` est appelé.

2. **Ordre des catch** : Du plus spécifique au plus général. Mettre \`catch (Exception e)\` avant \`catch (IOException e)\` → erreur de compilation (code inaccessible).

3. **throw vs throws** : \`throw\` lance une exception. \`throws\` déclare dans la signature qu'une méthode peut propager une checked exception.`,
    quiz: [
      {
        id: 2701,
        question_number: 'Q1',
        question_text: "Quelle est la différence entre une Checked Exception et une Unchecked Exception ?",
        option_a: "Une checked exception est plus grave qu'une unchecked",
        option_b: "Une checked exception doit être gérée (try/catch) ou déclarée (throws) à la compilation, une unchecked non",
        option_c: "Une unchecked exception nécessite try/catch obligatoirement",
        option_d: "Il n'y a aucune différence",
        correct_option: 'B',
        explanation: "Les checked exceptions (IOException, SQLException...) doivent être gérées ou déclarées avec throws sinon la compilation échoue. Les unchecked (RuntimeException et ses sous-classes) ne nécessitent pas de gestion obligatoire.",
        astuce: "Checked = vérifié par compilateur = obligatoire. Unchecked = runtime = facultatif."
      },
      {
        id: 2702,
        question_number: 'Q2',
        question_text: "Le bloc `finally` est-il toujours exécuté ?",
        option_a: "Non, seulement si une exception se produit",
        option_b: "Non, seulement si aucune exception ne se produit",
        option_c: "Oui, toujours (même en cas de return dans try)",
        option_d: "Oui, sauf si une exception est lancée",
        correct_option: 'C',
        explanation: "Le bloc finally s'exécute toujours, qu'il y ait une exception ou non, et même si un return est dans le try. Exception : si System.exit() est appelé ou si la JVM plante.",
        astuce: "finally = toujours exécuté = idéal pour libérer des ressources."
      }
    ]
  },

  {
    num: 19,
    moduleId: 'java_mod_15',
    moduleTitle: 'Module 15 — Génériques et Collections',
    title: "Collections Java : ArrayList, HashMap et Parcours",
    duration: '35 min',
    content: `# Module 6 — Leçon 19 : Collections Java et Génériques

---

## A. Pourquoi les Collections ?

Les tableaux ont une **taille fixe**. Les collections offrent une **taille dynamique** et des opérations avancées.

---

## B. Hiérarchie des Collections

\`\`\`
Collection<E>
├── List<E> (ordre préservé, doublons autorisés)
│   ├── ArrayList<E>  — accès rapide par index
│   └── LinkedList<E> — insertion/suppression rapides
├── Set<E> (pas de doublons)
│   ├── HashSet<E>   — pas d'ordre garanti
│   └── TreeSet<E>   — ordre naturel trié
└── Queue<E> (file FIFO)

Map<K,V> (clé-valeur, clés uniques)
├── HashMap<K,V>  — pas d'ordre garanti
└── TreeMap<K,V>  — trié par clé
\`\`\`

---

## C. ArrayList — La Plus Utilisée

\`\`\`java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// Déclaration avec type générique
ArrayList<String> prénoms = new ArrayList<>();  // Java 7+ : diamond operator <>

// Ajout
prénoms.add("Alice");
prénoms.add("Bob");
prénoms.add(1, "Charlie");  // Insert à l'index 1

// Accès
System.out.println(prénoms.get(0));    // Alice
System.out.println(prénoms.size());   // 3

// Modification et suppression
prénoms.set(0, "Alex");           // Remplace à l'index 0
prénoms.remove("Bob");            // Supprime par valeur
prénoms.remove(0);                // Supprime par index

// Recherche
System.out.println(prénoms.contains("Alice"));  // false (supprimée)
System.out.println(prénoms.indexOf("Charlie")); // 0

// Parcours
for (String p : prénoms) {
    System.out.println(p);
}

// Tri
Collections.sort(prénoms);  // Tri alphabétique
\`\`\`

---

## D. HashMap — Clé-Valeur

\`\`\`java
import java.util.HashMap;

HashMap<String, Integer> notes = new HashMap<>();

// Ajout
notes.put("Alice", 15);
notes.put("Bob", 12);
notes.put("Alice", 18);  // Remplace la valeur de "Alice" !

// Accès
System.out.println(notes.get("Alice"));        // 18
System.out.println(notes.get("Inconnu"));      // null
System.out.println(notes.getOrDefault("Inconnu", 0));  // 0

// Vérification
System.out.println(notes.containsKey("Bob"));  // true
System.out.println(notes.containsValue(12));   // true
System.out.println(notes.size());              // 2

// Parcours
for (String nom : notes.keySet()) {
    System.out.println(nom + " : " + notes.get(nom));
}

for (Map.Entry<String, Integer> entrée : notes.entrySet()) {
    System.out.println(entrée.getKey() + " → " + entrée.getValue());
}

// Suppression
notes.remove("Bob");
\`\`\`

---

## E. Génériques — Type Safety

\`\`\`java
// Sans génériques (avant Java 5) — dangereux !
ArrayList liste = new ArrayList();
liste.add("Bonjour");
liste.add(42);  // Mélange de types !
String s = (String) liste.get(0);  // Cast nécessaire — risque ClassCastException

// Avec génériques — sûr et clair
ArrayList<String> listeSûre = new ArrayList<>();
listeSûre.add("Bonjour");
listeSûre.add(42);  // ✗ ERREUR DE COMPILATION : incompatible types
String s2 = listeSûre.get(0);  // Pas de cast nécessaire !
\`\`\`

---

## F. Expressions Lambda et Streams (Introduction)

\`\`\`java
import java.util.*;
import java.util.stream.*;

List<Integer> nombres = Arrays.asList(5, 2, 8, 1, 9, 3, 7, 4, 6);

// Tri avec lambda
nombres.sort((a, b) -> a - b);  // Tri croissant

// Stream — pipeline de traitement
List<Integer> résultat = nombres.stream()
    .filter(n -> n > 4)          // Garde les > 4
    .map(n -> n * 2)             // Multiplie par 2
    .sorted()                    // Trie
    .collect(Collectors.toList()); // Collecte en liste

System.out.println(résultat);   // [10, 12, 14, 16, 18]

// forEach avec lambda
nombres.forEach(n -> System.out.print(n + " "));
\`\`\``,
    examples: `# Exemples — Leçon 19

## Exemple : Annuaire avec HashMap

\`\`\`java
import java.util.*;

public class Annuaire {
    private HashMap<String, String> contacts = new HashMap<>();
    
    public void ajouter(String nom, String téléphone) {
        contacts.put(nom, téléphone);
    }
    
    public String rechercher(String nom) {
        return contacts.getOrDefault(nom, "Contact non trouvé");
    }
    
    public void afficherTous() {
        contacts.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .forEach(e -> System.out.println(e.getKey() + " : " + e.getValue()));
    }
    
    public static void main(String[] args) {
        Annuaire ann = new Annuaire();
        ann.ajouter("Alice", "06-12-34-56-78");
        ann.ajouter("Bob", "07-89-01-23-45");
        System.out.println(ann.rechercher("Alice"));
        ann.afficherTous();
    }
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 19**

1. **ArrayList vs LinkedList** : ArrayList = accès rapide par index (O(1)). LinkedList = insertion/suppression rapides en milieu de liste (O(1) si on a déjà l'itérateur).

2. **HashMap ne garantit pas l'ordre** : Pour un ordre d'insertion préservé, utiliser LinkedHashMap. Pour un ordre trié par clé, utiliser TreeMap.

3. **Collections.unmodifiableList()** : Crée une vue non-modifiable d'une liste (utile pour retourner des collections depuis des méthodes).`,
    quiz: [
      {
        id: 2801,
        question_number: 'Q1',
        question_text: "Que retourne `map.get(\"clé\")` si la clé n'existe pas dans un HashMap ?",
        option_a: "0",
        option_b: "\"\"",
        option_c: "null",
        option_d: "KeyNotFoundException",
        correct_option: 'C',
        explanation: "HashMap.get() retourne null si la clé n'existe pas (pas d'exception). Pour éviter de traiter null, utiliser getOrDefault(clé, valeurParDéfaut).",
        astuce: "HashMap.get() inexistant = null. Utiliser getOrDefault() pour une valeur de remplacement."
      },
      {
        id: 2802,
        question_number: 'Q2',
        question_text: "Quelle collection interdit les doublons et ne garantit pas d'ordre ?",
        option_a: "ArrayList",
        option_b: "LinkedList",
        option_c: "HashSet",
        option_d: "HashMap",
        correct_option: 'C',
        explanation: "HashSet implémente l'interface Set qui interdit les doublons. HashMap est une collection clé-valeur (pas Set). ArrayList et LinkedList autorisent les doublons.",
        astuce: "Set = sans doublons. List = avec doublons. HashSet = Set non ordonné."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════
  // MODULE 7 — SYNTHÈSE, UML ET CONCOURS (L20-L22)
  // ═══════════════════════════════════════════════════════
{
    num: 20,
    moduleId: 'java_mod_15',
    moduleTitle: 'Module 15 — Génériques, Collections et Streams',
    title: "Expressions Lambda, Streams API et Interfaces Fonctionnelles",
    duration: '35 min',
    content: `# Module 15 — Leçon 20 : Expressions Lambda, Streams API et Interfaces Fonctionnelles

---

## A. La Révolution Java 8 : Vers la Programmation Fonctionnelle

Depuis Java 8 (2014), Java a introduit le paradigme **fonctionnel** sans abandonner l'orienté objet. L'objectif est d'écrire un code plus concis, lisible et expressif, notamment pour manipuler des collections de données.

> **Paradigme impératif (Avant Java 8)** : *Comment* faire (boucles explicites, variables temporaires, mutations).  
> **Paradigme déclaratif / fonctionnel (Java 8+)** : *Quoi* faire (filtrer, transformer, agréger).

---

## B. Les Interfaces Fonctionnelles & @FunctionalInterface

Une **interface fonctionnelle** est une interface qui ne contient **qu'une seule méthode abstraite** (SAM : *Single Abstract Method*). Elle peut en revanche contenir plusieurs méthodes \`default\` ou \`static\`.

L'annotation \`@FunctionalInterface\` est optionnelle mais fortement recommandée car le compilateur signale une erreur si l'interface possède zéro ou plus d'une méthode abstraite.

\`\`\`java
@FunctionalInterface
public interface Calculateur {
    int calculer(int a, int b); // Unique méthode abstraite
}
\`\`\`

### Les 4 Interfaces Fonctionnelles Clés du Package java.util.function (Questions de Concours)

| Interface | Méthode abstraite | Rôle | Exemple d'utilisation |
| :--- | :--- | :--- | :--- |
| **Predicate&lt;T&gt;** | \`boolean test(T t)\` | Évalue une condition booléenne | \`filter(p -> p.getAge() >= 18)\` |
| **Function&lt;T, R&gt;** | \`R apply(T t)\` | Transforme un élément de type T en R | \`map(e -> e.getNom())\` |
| **Consumer&lt;T&gt;** | \`void accept(T t)\` | Consomme/traite un élément (sans retour) | \`forEach(System.out::println)\` |
| **Supplier&lt;T&gt;** | \`T get()\` | Fournit/génère une valeur | \`Optional.orElseGet(() -> defaultVal)\` |
| **UnaryOperator&lt;T&gt;** | \`T apply(T t)\` | Spécialisation de Function où entrée = sortie | \`x -> x * 2\` |
| **BinaryOperator&lt;T&gt;** | \`T apply(T t1, T t2)\` | Réduction binaire de deux éléments de même type | \`(a, b) -> a + b\` |

---

## C. Syntaxe des Expressions Lambda et Références de Méthodes

Une **expression lambda** est une fonction anonyme (sans nom) qui implémente directement l'unique méthode d'une interface fonctionnelle.

### 1. Syntaxe générale : \`(paramètres) -> { corps }\`

\`\`\`java
// Forme complète
Calculateur add = (int a, int b) -> { return a + b; };

// Forme simplifiée : types inférés, parenthèses optionnelles si 1 seul paramètre, return implicite
Calculateur mult = (a, b) -> a * b;
Predicate<String> estVide = s -> s.isEmpty();
Consumer<String> afficheur = msg -> System.out.println(msg);
\`\`\`

### 2. Références de Méthodes (Method References) : Syntaxe \`::\`

Lorsque le corps d'une lambda se contente d'appeler une méthode existante, on peut la remplacer par une référence de méthode :

| Type | Syntaxe lambda équivalente | Référence de méthode |
| :--- | :--- | :--- |
| **Méthode statique** | \`s -> Integer.parseInt(s)\` | \`Integer::parseInt\` |
| **Méthode d'instance sur objet existant** | \`x -> System.out.println(x)\` | \`System.out::println\` |
| **Méthode d'instance sur élément arbitraire** | \`s -> s.toUpperCase()\` | \`String::toUpperCase\` |
| **Constructeur** | \`() -> new ArrayList<>()\` | \`ArrayList::new\` |

---

## D. L'API Stream : Anatomie d'un Pipeline

Un **Stream** n'est **pas une structure de données**. Il ne stocke aucun élément en mémoire RAM. C'est un **canal de transmission (pipeline)** qui transporte des données depuis une source (Collection, tableau, I/O) à travers des opérations de transformation.

\`\`\`
   Source              Opérations Intermédiaires              Opération Terminale
 [Collection] ──> [.filter(...)] ──> [.map(...)] ──> [.sorted()] ──> [.collect(...)]
                      (Paresseuses / Lazy)                        (Déclenche l'exécution)
\`\`\`

> [!IMPORTANT]
> **Règle fondamentale des Streams :**
> 1. Les opérations intermédiaires sont **paresseuses (lazy)** : rien n'est calculé tant que l'opération terminale n'est pas invoquée.
> 2. Un Stream est **à usage unique** : une fois l'opération terminale exécutée, le Stream est fermé et consommé. Tenter de le réutiliser lève \`IllegalStateException\`.

---

## E. Opérations Intermédiaires Usuelles (Retournent un nouveau Stream)

| Méthode | Rôle | Exemple |
| :--- | :--- | :--- |
| \`filter(Predicate<T>)\` | Conserve les éléments validant la condition | \`.filter(x -> x % 2 == 0)\` |
| \`map(Function<T, R>)\` | Transforme chaque élément en un autre type/valeur | \`.map(String::toUpperCase)\` |
| \`flatMap(Function<T, Stream<R>>)\` | Aplatit des structures imbriquées (Stream de Streams) | \`.flatMap(List::stream)\` |
| \`distinct()\` | Élimine les doublons (utilise \`equals()\`) | \`.distinct()\` |
| \`sorted()\` / \`sorted(Comparator)\` | Trie les éléments | \`.sorted(Comparator.reverseOrder())\` |
| \`limit(long n)\` | Ne conserve que les $n$ premiers éléments | \`.limit(5)\` |
| \`skip(long n)\` | Ignore les $n$ premiers éléments | \`.skip(2)\` |

---

## F. Opérations Terminales Usuelles (Produisent un résultat ou un effet)

| Méthode | Résultat | Description |
| :--- | :--- | :--- |
| \`collect(Collector)\` | Collection / Map | Rassemble les éléments dans une \`List\`, \`Set\`, ou \`Map\` |
| \`forEach(Consumer)\` | void | Applique une action sur chaque élément |
| \`count()\` | long | Nombre d'éléments traités |
| \`reduce(BinaryOperator)\` | Optional&lt;T&gt; | Réduit les éléments en une seule valeur (somme, produit) |
| \`findFirst()\` / \`findAny()\` | Optional&lt;T&gt; | Récupère le premier élément trouvé |
| \`anyMatch(Predicate)\` | boolean | Vrai si au moins un élément valide la condition |
| \`allMatch(Predicate)\` | boolean | Vrai si TOUS les éléments valident la condition |
| \`noneMatch(Predicate)\` | boolean | Vrai si AUCUN élément ne valide la condition |

---

## G. La Classe Optional&lt;T&gt; — Le Remède contre NullPointerException

La classe \`java.util.Optional<T>\` est un conteneur qui peut soit contenir une valeur non-nulle, soit être vide (\`Optional.empty()\`). Elle force le développeur à gérer explicitement l'absence de valeur.

\`\`\`java
Optional<String> opt = Optional.ofNullable(nom);

// 1. Vérification classique
if (opt.isPresent()) {
    System.out.println(opt.get());
}

// 2. Approche fonctionnelle élégante (recommandée)
opt.ifPresent(System.out::println);

// 3. Fournir une valeur de secours si absent
String resultat = opt.orElse("Anonyme");
String calculé = opt.orElseGet(() -> genererNomParDefaut());

// 4. Lancer une exception si absent
String valide = opt.orElseThrow(() -> new IllegalArgumentException("Nom manquant"));
\`\`\`

---

## H. Erreurs et Pièges Classiques en Concours

### ❌ Piège 1 : Réutilisation d'un Stream déjà consommé
\`\`\`java
Stream<String> s = List.of("A", "B").stream();
s.forEach(System.out::print);
long count = s.count(); // ✗ ERREUR D'EXÉCUTION : IllegalStateException: stream has already been operated upon or closed
\`\`\`

### ❌ Piège 2 : Variables capturées non "effectively final"
Une lambda ne peut accéder aux variables locales de la méthode englobante que si celles-ci sont **finales** ou **effectivement finales** (non réaffectées après déclaration) :
\`\`\`java
int facteur = 2;
facteur = 3; // Réaffectation !
Runnable r = () -> System.out.println(facteur); // ✗ ERREUR : local variables referenced from a lambda expression must be final or effectively final
\`\`\`

### ❌ Piège 3 : Confondre map() et flatMap()
- \`map()\` : Transforme un élément en un élément (ex : mot $\rightarrow$ longueur).
- \`flatMap()\` : Transforme un élément en un Stream de sous-éléments et fusionne tous les sous-streams en un seul flux plat.`,
    examples: `# Exemples — Leçon 20

## Exemple 1 : Pipeline de traitement d'employés

\`\`\`java
import java.util.*;
import java.util.stream.Collectors;

class Employe {
    private String nom;
    private String departement;
    private double salaire;

    public Employe(String nom, String departement, double salaire) {
        this.nom = nom;
        this.departement = departement;
        this.salaire = salaire;
    }

    public String getNom() { return nom; }
    public String getDepartement() { return departement; }
    public double getSalaire() { return salaire; }
}

public class TestStreams {
    public static void main(String[] args) {
        List<Employe> employes = List.of(
            new Employe("Alice", "IT", 45000),
            new Employe("Bob", "RH", 32000),
            new Employe("Charlie", "IT", 52000),
            new Employe("David", "Comptabilité", 38000),
            new Employe("Emma", "IT", 49000)
        );

        // 1. Filtrer les employés IT avec salaire > 46000 et récupérer leurs noms en majuscules triés
        List<String> topIt = employes.stream()
            .filter(e -> "IT".equals(e.getDepartement()))
            .filter(e -> e.getSalaire() > 46000)
            .map(Employe::getNom)
            .map(String::toUpperCase)
            .sorted()
            .collect(Collectors.toList());

        System.out.println("Top IT : " + topIt); // [CHARLIE, EMMA]

        // 2. Calcul du salaire moyen dans le département IT
        double salaireMoyenIT = employes.stream()
            .filter(e -> "IT".equals(e.getDepartement()))
            .mapToDouble(Employe::getSalaire)
            .average()
            .orElse(0.0);

        System.out.printf("Salaire moyen IT : %.2f €%n", salaireMoyenIT); // 48666.67 €
    }
}
\`\`\`

---

## Exemple 2 : Collectors.groupingBy (Question récurrente en concours)

\`\`\`java
// Regrouper les employés par département : Map<String, List<Employe>>
Map<String, List<Employe>> parDept = employes.stream()
    .collect(Collectors.groupingBy(Employe::getDepartement));

parDept.forEach((dept, liste) -> {
    System.out.println(dept + " (" + liste.size() + " employés)");
});
\`\`\``,
    astuces: `⚡ **Fiche Réflexe Concours — Leçon 20**

1. **Mémo des 4 interfaces fonctionnelles de base** :
   - **Predicate** = \`test(x)\` $\rightarrow$ \`boolean\`
   - **Function** = \`apply(x)\` $\rightarrow$ \`resultat\`
   - **Consumer** = \`accept(x)\` $\rightarrow$ \`void\`
   - **Supplier** = \`get()\` $\rightarrow$ \`valeur\`

2. **Règle d'or Stream** : Pas d'opération terminale = **aucune exécution** (paresse). Un Stream ne peut être lu qu'**une seule fois**.

3. **Optional.get() sans vérification préalable** : Proscrit ! Lève \`NoSuchElementException\` si vide. Préférer \`orElse()\` ou \`ifPresent()\`.

4. **Variables locales dans les lambdas** : Doivent être \`final\` ou \`effectively final\` (ne jamais les réaffecter).`,
    quiz: [
      {
        id: 2851,
        question_number: 'Q1',
        question_text: "Quelle interface fonctionnelle standard prend un argument de type T et retourne un boolean ?",
        option_a: "Function<T, Boolean>",
        option_b: "Predicate<T>",
        option_c: "Consumer<T>",
        option_d: "Supplier<T>",
        correct_option: 'B',
        explanation: "L'interface standard Predicate<T> possède la méthode `boolean test(T t)`. Function<T, Boolean> retourne un objet Boolean wrapper, mais l'interface dédiée et idiomatique pour les tests logiques est Predicate.",
        astuce: "Predicate = prédicat logique = test de condition retournant true ou false."
      },
      {
        id: 2852,
        question_number: 'Q2',
        question_text: "Que se passe-t-il si l'on exécute le code : `Stream<Integer> s = List.of(1,2,3).stream(); s.count(); s.findFirst();` ?",
        option_a: "findFirst() retourne Optional[1]",
        option_b: "findFirst() retourne null",
        option_c: "Une exception IllegalStateException est levée car le stream a déjà été consommé",
        option_d: "Le programme compile mais produit une boucle infinie",
        correct_option: 'C',
        explanation: "Un Stream Java ne peut être traversé qu'une seule fois. L'opération terminale `count()` a consommé et fermé le stream. Tout appel ultérieur à une opération terminale sur ce même stream lève java.lang.IllegalStateException.",
        astuce: "Stream = tuyau à usage unique. Une opération terminale = stream fermé définitivement."
      },
      {
        id: 2853,
        question_number: 'Q3',
        question_text: "Laquelle de ces opérations sur un Stream est une opération terminale ?",
        option_a: "filter()",
        option_b: "map()",
        option_c: "sorted()",
        option_d: "reduce()",
        correct_option: 'D',
        explanation: "filter, map et sorted sont des opérations intermédiaires (lazy, retournant un nouveau Stream). reduce est une opération terminale qui déclenche le traitement et agrège les éléments.",
        astuce: "Opérations intermédiaires retournent un Stream. Opérations terminales retournent autre chose (void, collection, valeur, boolean, Optional)."
      },
      {
        id: 2854,
        question_number: 'Q4',
        question_text: "Quelle méthode de la classe Optional permet de retourner une valeur alternative sans lever d'exception si l'Optional est vide ?",
        option_a: "get()",
        option_b: "orElse()",
        option_c: "orElseThrow()",
        option_d: "expect()",
        correct_option: 'B',
        explanation: "`orElse(valeurParDefaut)` retourne la valeur contenue si elle est présente, ou la valeur de remplacement passée en paramètre si l'Optional est vide. `get()` lèverait NoSuchElementException.",
        astuce: "orElse = 'sinon utilise cette valeur par défaut'."
      },
      {
        id: 2855,
        question_number: 'Q5',
        question_text: "Pourquoi le compilateur refuse-t-il : `int x = 10; x++; Runnable r = () -> System.out.println(x);` ?",
        option_a: "Runnable ne supporte pas System.out.println",
        option_b: "La variable x n'est pas effectivement finale car elle a été incrémentée après initialisation",
        option_c: "On ne peut pas capturer de variables primitives dans une lambda",
        option_d: "Il faut typer explicitement le paramètre de la lambda",
        correct_option: 'B',
        explanation: "Les lambdas ne peuvent capturer que des variables locales 'final' ou 'effectively final' (qui ne changent jamais de valeur après initialisation). Le fait de faire `x++` brise cette règle.",
        astuce: "Règle absolue : toute variable locale capturée par une lambda doit rester constante (effectively final)."
      }
    ]
  },

  {
    num: 21,
    moduleId: 'java_mod_16',
    moduleTitle: 'Module 16 — Synthèse, UML et Préparation aux Concours',
    title: "UML, Principes SOLID et Bonnes Pratiques Java",
    duration: '25 min',
    content: `# Module 16 — Leçon 21 : UML, Principes SOLID et Bonnes Pratiques

---

## A. Diagrammes de Classes UML

Un **diagramme de classes UML** modélise la structure statique d'un système.

### Notation Simplifiée

\`\`\`
+--------------------------+
|    CompteBancaire        |  ← Nom de la classe
+--------------------------+
| - titulaire: String      |  ← Attributs
| - solde: double          |  - = private, + = public, # = protected
| - static nbComptes: int  |
+--------------------------+
| + getTitulaire(): String |  ← Méthodes
| + déposer(m: double)     |
| + getSolde(): double     |
+--------------------------+
\`\`\`

### Types de Relations UML

| Relation | Symbole | Signification |
| :--- | :--- | :--- |
| **Association** | ────── | "A utilise B" |
| **Agrégation** | ──────◇ | "A contient B (B peut exister sans A)" |
| **Composition** | ──────◆ | "A est composé de B (B n'existe pas sans A)" |
| **Héritage** | ──────▷ | "A extends B" |
| **Implémentation** | - - - -▷ | "A implements B" |

---

## B. Les 5 Principes SOLID (Introduction)

| Lettre | Principe | En pratique |
| :--- | :--- | :--- |
| **S** | Single Responsibility | Une classe = une responsabilité |
| **O** | Open/Closed | Ouvert à l'extension, fermé à la modification |
| **L** | Liskov Substitution | Sous-classe utilisable partout où parent est attendu |
| **I** | Interface Segregation | Petites interfaces spécialisées plutôt que grandes |
| **D** | Dependency Inversion | Dépendre des abstractions, pas des implémentations |

---

## C. Bonnes Pratiques de Programmation Java

\`\`\`java
// ✓ Préférer les types d'interface pour les déclarations
List<String> liste = new ArrayList<>();         // ✓ (pas ArrayList<String>)
Map<String, Integer> carte = new HashMap<>();   // ✓

// ✓ Utiliser equals() côté constante pour éviter NPE
if ("Java".equals(variable)) { }  // ✓ Pas de NPE si variable est null
if (variable.equals("Java")) { }  // ✗ NPE si variable est null

// ✓ Fermer les ressources avec try-with-resources
try (Scanner sc = new Scanner(System.in)) { }

// ✓ Valider les paramètres en entrée de méthode
public void setAge(int age) {
    if (age < 0 || age > 150)
        throw new IllegalArgumentException("Âge invalide : " + age);
    this.age = age;
}

// ✓ Utiliser StringBuilder pour construire des chaînes en boucle
StringBuilder sb = new StringBuilder();
for (String mot : mots) sb.append(mot).append(" ");

// ✓ Préférer for-each quand l'index n'est pas nécessaire
for (String s : liste) { }  // ✓ Plus lisible qu'un for classique ici
\`\`\`

---

## D. Débogage — Lecture des Stack Traces

\`\`\`text
Exception in thread "main" java.lang.NullPointerException
    at com.inforeussit.Main.calculer(Main.java:25)    ← Ligne 25 de Main.java
    at com.inforeussit.Main.main(Main.java:10)         ← Appelé depuis ligne 10
\`\`\`

**Lecture :** Toujours commencer par **le bas de la stack trace** pour trouver l'appel initial, puis remonter vers la **première ligne** qui indique l'exception réelle.`,
    examples: `# Exemples — Leçon 20

## Exemple : Refactorisation SOLID

\`\`\`java
// ✗ AVANT : Classe avec trop de responsabilités (violation SRP)
class EtudiantMauvais {
    String nom;
    void afficherDetails() { }
    void sauvegarderEnBase() { }  // Responsabilité base de données
    void envoyerEmail() { }       // Responsabilité email
}

// ✓ APRÈS : Séparation des responsabilités
class Etudiant {
    private String nom;
    public String getNom() { return nom; }
    // Seulement les données et comportements de l'étudiant
}

class EtudiantRepository {
    void sauvegarder(Etudiant e) { }  // Responsabilité : persistance
}

class EmailService {
    void envoyerConfirmation(Etudiant e) { }  // Responsabilité : email
}
\`\`\``,
    astuces: `⚡ **Astuces — Leçon 20**

1. **SOLID ne s'applique pas mécaniquement** : Sur de petits programmes, certains principes semblent surcommenter. Mais sur de grands systèmes, ils évitent des refactorisations coûteuses.

2. **UML en concours** : Savoir lire un diagramme de classes (noms, visibilités, relations) et en créer un simple.

3. **Stack traces** : Toujours lire de bas en haut. Le bas = l'origine de l'appel. Le haut = l'endroit exact de l'exception.`,
    quiz: [
      {
        id: 2901,
        question_number: 'Q1',
        question_text: "Que signifie le principe S (Single Responsibility) des principes SOLID ?",
        option_a: "Une méthode ne doit avoir qu'un seul paramètre",
        option_b: "Une classe ne doit avoir qu'une seule raison de changer (une seule responsabilité)",
        option_c: "Un programme ne doit avoir qu'une seule classe",
        option_d: "Chaque variable doit être déclarée une seule fois",
        correct_option: 'B',
        explanation: "Le principe de Responsabilité Unique stipule qu'une classe ne doit avoir qu'une seule responsabilité (une seule raison de changer). Cela facilite la maintenance et les tests.",
        astuce: "SRP : 1 classe = 1 responsabilité = 1 raison de changer."
      }
    ]
  },

  {
    num: 22,
    moduleId: 'java_mod_16',
    moduleTitle: 'Module 16 — Synthèse, UML et Préparation aux Concours',
    title: "QCM Synthèse : Analyse de Code et Pièges des Concours",
    duration: '40 min',
    content: `# Module 16 — Leçon 22 : Synthèse — Analyse de Programmes et QCM Concours

---

## A. Méthodologie pour Analyser du Code Java

Quand on vous demande "Que va afficher ce programme ?", suivez ces étapes :

1. **Repérer les types** de chaque variable
2. **Tracer l'ordre d'exécution** (constructeurs, blocs statiques, blocs instance)
3. **Vérifier la liaison dynamique** (type réel vs type déclaré pour les méthodes)
4. **Vérifier les attributs** (type déclaré — pas de liaison dynamique)
5. **Simuler les opérateurs** (pré/post incrémentation, division entière...)

---

## B. Questions "Que va afficher ce programme ?" — Exercices Types

### Programme 1 : Constructeurs en Chaîne

\`\`\`java
class D {
    public int x;
    public D() { x = 3; }
    public D(int a) { this(); x = x + a; }
    public D(int a, int b) { this(b); x = x - a; }
}

D a = new D(5, 6);
System.out.println(a.x);
\`\`\`

**Trace d'exécution :**
1. \`new D(5, 6)\` → appelle \`D(int a=5, int b=6)\`
2. Première instruction : \`this(b)\` = \`this(6)\` → appelle \`D(int a=6)\`
3. Première instruction de D(6) : \`this()\` → appelle \`D()\`
4. \`D()\` : \`x = 3\` ← x = 3
5. Retour dans D(6) : \`x = x + a = 3 + 6 = 9\` ← x = 9
6. Retour dans D(5,6) : \`x = x - a = 9 - 5 = 4\` ← x = 4
**Réponse : 4**

---

### Programme 2 : Polymorphisme et Attributs

\`\`\`java
class Parent {
    int x = 10;
    public int getX() { return x; }
    public void afficher() { System.out.println("Parent: x=" + x); }
}

class Enfant extends Parent {
    int x = 20;  // Masque Parent.x
    @Override
    public void afficher() { System.out.println("Enfant: x=" + x); }
}

Parent p = new Enfant();
p.afficher();              // ?
System.out.println(p.x);  // ?
System.out.println(p.getX()); // ?
\`\`\`

**Réponses :**
- \`p.afficher()\` → "Enfant: x=20" (liaison dynamique sur méthode → type réel = Enfant)
- \`p.x\` → 10 (les attributs utilisent le type DÉCLARÉ = Parent)
- \`p.getX()\` → 10 (getX() retourne \`this.x\` de Parent = 10, car getX() n'est pas redéfini dans Enfant)

---

### Programme 3 : Switch sans break

\`\`\`java
int i = 1;
switch (i) {
    case 0: System.out.print("Zéro");
    case 1: System.out.print("Un");   // Point d'entrée
    case 2: System.out.print("Deux"); // Fall-through
    default: System.out.print("Def"); // Fall-through
}
\`\`\`
**Réponse : "UnDeuxDef"** (fall-through sans break)

---

### Programme 4 : Strings et Pool

\`\`\`java
String a = "Java";
String b = "Java";
String c = new String("Java");

System.out.println(a == b);         // true (même objet du pool)
System.out.println(a == c);         // false (c est un nouvel objet)
System.out.println(a.equals(c));    // true (même contenu)
\`\`\`

---

### Programme 5 : Ordre d'Initialisation

\`\`\`java
class Test {
    static int s = 1;
    int i = 2;
    
    static { System.out.print(s + " "); s = 10; }
    { System.out.print(i + " "); i = 20; }
    Test() { System.out.print(i + " "); }
    
    public static void main(String[] args) {
        new Test();
        new Test();
    }
}
\`\`\`

**Réponse : "1 2 20 2 20 "**
- Bloc statique (1 fois) : s=1 → affiche "1", s devient 10
- 1er new Test() : bloc instance (i=2 → affiche "2", i=20), constructeur (affiche "20")
- 2e new Test() : bloc instance (i=2 → affiche "2", i=20), constructeur (affiche "20")`,
    examples: `# Exemples QCM — Leçon 21

## Exercice : Traçage d'une boucle

\`\`\`java
int S = 0;
for (int i = 1; i <= 5; i++) {
    if (i % 2 != 0) S += i;
}
System.out.println(S);
\`\`\`

**Trace :**
- i=1: 1%2=1 ≠ 0 → S = 0+1 = 1
- i=2: 2%2=0 → skip
- i=3: 3%2=1 ≠ 0 → S = 1+3 = 4
- i=4: 4%2=0 → skip
- i=5: 5%2=1 ≠ 0 → S = 4+5 = 9

**Réponse : 9** (somme des entiers impairs de 1 à 5)`,
    astuces: `⚡ **Astuces Concours — Leçon 21**

1. **Méthodes → type réel. Attributs → type déclaré** : La règle la plus importante du polymorphisme.

2. **Ordre d'exécution** : Blocs statiques (une seule fois) → blocs instance (chaque new) → constructeur.

3. **this() dans constructeur** : Doit être PREMIÈRE instruction. super() aussi. On ne peut pas avoir les deux.

4. **Pour les boucles** : Tracer un tableau avec les valeurs de chaque variable à chaque itération.

5. **String : == compare adresses, equals() compare contenu**.`,
    quiz: [
      {
        id: 3001,
        question_number: 'Q1',
        question_text: "Que retourne le programme : `int i=5; System.out.print(i++); System.out.print(++i);` ?",
        option_a: "5 6",
        option_b: "5 7",
        option_c: "6 7",
        option_d: "6 8",
        correct_option: 'B',
        explanation: "`i++` retourne 5 (valeur avant), puis i devient 6. `++i` incrémente d'abord i de 6 à 7, puis retourne 7.",
        astuce: "i++=valeur actuelle puis +1. ++i= +1 puis valeur."
      },
      {
        id: 3002,
        question_number: 'Q2',
        question_text: "Que retourne `\"Hello\".substring(1, 3)` ?",
        option_a: "\"He\"",
        option_b: "\"el\"",
        option_c: "\"ell\"",
        option_d: "\"llo\"",
        correct_option: 'B',
        explanation: "substring(1, 3) extrait de l'index 1 inclus à l'index 3 exclu. \"Hello\" : H=0, e=1, l=2, l=3, o=4. Indices 1,2 = 'e','l' → \"el\".",
        astuce: "substring(start, end) : start INCLUS, end EXCLU."
      },
      {
        id: 3003,
        question_number: 'Q3',
        question_text: "Que va afficher le code : `class A { void m() { System.out.print(\"A\"); } } class B extends A { void m() { System.out.print(\"B\"); } } A obj = new B(); obj.m();` ?",
        option_a: "A",
        option_b: "B",
        option_c: "AB",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "Liaison dynamique : l'appel à m() est résolu au runtime selon le type RÉEL de l'objet. Même si la variable est déclarée de type A, l'objet réel est un B → B.m() est appelée → affiche 'B'.",
        astuce: "Type déclaré = A, type réel = B. Méthode appelée = méthode du type RÉEL."
      },
      {
        id: 3004,
        question_number: 'Q4',
        question_text: "Que vaut `x` après : `int x=5; int y = x++; x += y;` ?",
        option_a: "10",
        option_b: "11",
        option_c: "5",
        option_d: "15",
        correct_option: 'B',
        explanation: "`x++` : y reçoit 5 (valeur avant), x devient 6. Puis `x += y` : x = 6 + 5 = 11.",
        astuce: "Tracer étape par étape : x=5 → y=5, x=6 → x=6+5=11."
      },
      {
        id: 3005,
        question_number: 'Q5',
        question_text: "Que retourne : `int[] t = {1,2,3,4,5}; System.out.println(t.length);` ?",
        option_a: "4",
        option_b: "5",
        option_c: "Erreur : length() nécessite des parenthèses",
        option_d: "Erreur : la propriété length n'existe pas",
        correct_option: 'B',
        explanation: "`length` (sans parenthèses) est une propriété (champ final) des tableaux Java, pas une méthode. Elle vaut le nombre d'éléments. Pour String, c'est `length()` (méthode, avec parenthèses).",
        astuce: "Tableau : .length (sans parenthèses) | String : .length() (avec parenthèses)."
      }
    ]
  },

  {
    num: 23,
    moduleId: 'java_mod_16',
    moduleTitle: 'Module 16 — Synthèse, UML et Préparation aux Concours',
    title: "Simulation de Concours : 30 Questions Complètes",
    duration: '60 min',
    content: `# Module 16 — Leçon 23 : Simulation de Concours Java

---

## A. Instructions

Cette simulation couvre l'ensemble du cours Java.  
Temps conseillé : **60 minutes** pour les 30 questions.  
Passez à la section QCM ci-dessous pour les questions.

---

## B. Rappel des Règles Essentielles

### Types et Variables
- **8 types primitifs** : byte, short, int, long, float, double, char, boolean
- **int** : 32 bits, plage -2 147 483 648 à 2 147 483 647
- **Variables locales** : pas de valeur par défaut (doit être initialisée)
- **Champs** : valeur par défaut (0, 0.0, false, null)

### Opérateurs Pièges
- \`17 / 5 = 3\` (division entière)
- \`i++\` : retourne valeur puis incrémente. \`++i\` : incrémente puis retourne valeur
- \`"a" + 1 + 2 = "a12"\` (concaténation de gauche à droite)
- \`1 + 2 + "a" = "3a"\` (addition d'abord, puis concaténation)

### POO et Héritage
- **Liaison dynamique** : méthodes → type réel. Attributs → type déclaré
- **Ordre constructeurs** : Parent → Enfant (super() implicite ou explicite)
- **@Override** : protection contre les fautes de frappe
- **abstract class** : ne peut pas être instanciée, peut avoir des membres concrets

### Collections et Strings
- \`String.equals()\` pour comparer le contenu (jamais ==)
- \`ArrayList.get()\` → accès par index
- \`HashMap.get(clé inexistante)\` → null
- \`substring(i, j)\` : index i inclus, j exclu

---

## C. Fiche de Révision Rapide

| Notion | À retenir |
| :--- | :--- |
| **JDK ⊃ JRE ⊃ JVM** | D>R>V |
| **javac compile, java exécute** | JAMAIS java MonFichier.class |
| **this()** | Doit être 1ère instruction du constructeur |
| **super()** | Doit être 1ère instruction du constructeur |
| **Méthodes final** | Ne peuvent pas être redéfinies |
| **Classes final** | Ne peuvent pas être héritées (ex: String) |
| **Checked Exception** | Doit être gérée ou déclarée (throws) |
| **finally** | Toujours exécuté |
| **int/int** | Division entière |
| **null instanceof X** | Toujours false |`,
    examples: `# Exemples Synthèse — Leçon 22

## Exemple Complet : Programme avec POO

\`\`\`java
abstract class Véhicule {
    private String marque;
    protected int vitesseMax;
    
    public Véhicule(String marque, int vitesseMax) {
        this.marque = marque;
        this.vitesseMax = vitesseMax;
    }
    
    public abstract String getType();
    
    @Override
    public String toString() {
        return getType() + " " + marque + " (vmax=" + vitesseMax + ")";
    }
}

class Voiture extends Véhicule {
    private int nbPortes;
    
    public Voiture(String marque, int vmax, int nbPortes) {
        super(marque, vmax);
        this.nbPortes = nbPortes;
    }
    
    @Override
    public String getType() { return "Voiture"; }
}

// Test
Véhicule v = new Voiture("Toyota", 180, 5);
System.out.println(v);  // Voiture Toyota (vmax=180)
System.out.println(v instanceof Voiture);   // true
System.out.println(v instanceof Véhicule);  // true
\`\`\``,
    astuces: `⚡ **Derniers Conseils Concours**

1. **Lisez l'énoncé entier** avant de répondre — les pièges sont souvent dans les détails.

2. **Élimination** : Si vous hésitez, éliminez les réponses clairement fausses.

3. **Traces obligatoires** : Pour les questions "Que va afficher ce code ?", simulez l'exécution ligne par ligne.

4. **Méfiez-vous des fall-through** dans les switch sans break.

5. **Méfiez-vous des casting** : \`(int) 9.9 = 9\` (troncature, pas arrondi).

6. **Méfiez-vous des priorités** : \`"" + 1 + 2 = "12"\` mais \`1 + 2 + "" = "3"\`.`,
    quiz: [
      {
        id: 3101,
        question_number: 'Q1',
        question_text: "Que vaut `(int) 9.9` en Java ?",
        option_a: "10",
        option_b: "9",
        option_c: "9.9",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "Le cast `(int)` effectue une TRONCATURE (coupe la partie décimale), pas un arrondi. 9.9 → 9.",
        astuce: "Cast vers int = troncature. Math.round(9.9) = 10 (arrondi)."
      },
      {
        id: 3102,
        question_number: 'Q2',
        question_text: "Que retourne `null instanceof Object` ?",
        option_a: "true",
        option_b: "false",
        option_c: "NullPointerException",
        option_d: "Erreur de compilation",
        correct_option: 'B',
        explanation: "`instanceof` retourne toujours false si le membre gauche est null, sans lancer d'exception. C'est un comportement garanti par la spécification Java.",
        astuce: "`null instanceof N'importe_quoi` = toujours false. Pas d'exception."
      },
      {
        id: 3103,
        question_number: 'Q3',
        question_text: "Peut-on instancier une classe abstraite avec `new` ?",
        option_a: "Oui, si elle a un constructeur public",
        option_b: "Non, jamais directement",
        option_c: "Oui, si elle n'a pas de méthodes abstraites",
        option_d: "Oui, via une classe anonyme uniquement",
        correct_option: 'B',
        explanation: "Une classe abstraite ne peut JAMAIS être instanciée directement avec new. On peut créer une instance d'une sous-classe concrète et l'affecter à une variable du type abstrait.",
        astuce: "abstract class = non instanciable. Instancier la sous-classe concrète."
      },
      {
        id: 3104,
        question_number: 'Q4',
        question_text: "Que vaut l'expression `\"1\" + 2 + 3` en Java ?",
        option_a: "\"6\"",
        option_b: "6",
        option_c: "\"123\"",
        option_d: "\"15\"",
        correct_option: 'C',
        explanation: "L'opérateur + est évalué de gauche à droite. `\"1\" + 2` = \"12\" (concaténation, car le premier opérande est une String). Puis `\"12\" + 3` = \"123\".",
        astuce: "+ avec String = concaténation. Évaluation de gauche à droite. Parenthèses pour forcer l'addition."
      },
      {
        id: 3105,
        question_number: 'Q5',
        question_text: "Que vaut `1 + 2 + \"3\"` en Java ?",
        option_a: "\"123\"",
        option_b: "\"33\"",
        option_c: "6",
        option_d: "\"6\"",
        correct_option: 'B',
        explanation: "`1 + 2` = 3 (addition de deux int). Puis `3 + \"3\"` = \"33\" (concaténation int+String). Résultat final : String \"33\".",
        astuce: "1+2 = 3 (int+int = int), puis 3+\"3\" = \"33\" (int+String = String)."
      },
      {
        id: 3106,
        question_number: 'Q6',
        question_text: "Quelle méthode doit OBLIGATOIREMENT être redéfinie dans une sous-classe concrète d'une classe abstraite ?",
        option_a: "Toutes les méthodes héritées",
        option_b: "Toutes les méthodes abstraites déclarées dans la classe abstraite",
        option_c: "Seulement les méthodes marquées @Override",
        option_d: "Aucune méthode",
        correct_option: 'B',
        explanation: "Une sous-classe concrète (non-abstraite) doit redéfinir TOUTES les méthodes abstraites héritées. Sinon, elle doit elle-même être déclarée abstract.",
        astuce: "Classe abstraite non complétée dans la sous-classe → la sous-classe doit aussi être abstract."
      },
      {
        id: 3107,
        question_number: 'Q7',
        question_text: "Quelle instruction est INCORRECTE pour comparer deux Strings en Java ?",
        option_a: "s1.equals(s2)",
        option_b: "s1.equalsIgnoreCase(s2)",
        option_c: "s1 == s2",
        option_d: "s1.compareTo(s2) == 0",
        correct_option: 'C',
        explanation: "`==` compare les RÉFÉRENCES (adresses mémoire), pas le contenu. Deux Strings avec le même contenu peuvent être des objets différents, donc `==` peut retourner false même pour des contenus identiques.",
        astuce: "Comparer Strings : toujours .equals(). Jamais ==."
      },
      {
        id: 3108,
        question_number: 'Q8',
        question_text: "Que se passe-t-il si on redéfinit equals() sans redéfinir hashCode() ?",
        option_a: "Erreur de compilation",
        option_b: "NullPointerException à l'exécution",
        option_c: "Comportement imprévisible dans les collections basées sur le hachage (HashMap, HashSet)",
        option_d: "Rien de particulier",
        correct_option: 'C',
        explanation: "Le contrat equals/hashCode exige que si deux objets sont égaux selon equals(), ils aient le même hashCode(). Violer ce contrat cause des comportements incorrects dans HashMap et HashSet.",
        astuce: "Redéfinir equals() → TOUJOURS redéfinir hashCode() aussi."
      },
      {
        id: 3109,
        question_number: 'Q9',
        question_text: "Le compilateur Java refuse : `float f = 3.14;`. Pourquoi ?",
        option_a: "3.14 n'est pas un nombre valide en Java",
        option_b: "Par défaut, le littéral 3.14 est de type double, qui ne peut pas être converti implicitement en float (plus petit)",
        option_c: "float n'accepte que les entiers",
        option_d: "Il faut utiliser double, pas float",
        correct_option: 'B',
        explanation: "Sans suffixe, tout littéral décimal est de type `double` en Java. Affecter un double à un float est une conversion restrictive (narrowing) qui nécessite un cast explicite. Solution : `float f = 3.14f;`",
        astuce: "Littéral décimal = double par défaut. Pour float, ajouter le suffixe f : `3.14f`."
      },
      {
        id: 3110,
        question_number: 'Q10',
        question_text: "Quelle est la particularité de la méthode `main` pour qu'elle soit le point d'entrée d'un programme Java ?",
        option_a: "Elle doit être private",
        option_b: "Elle doit retourner int",
        option_c: "Elle doit être public, static, void et accepter String[] en paramètre",
        option_d: "Elle peut avoir n'importe quelle signature",
        correct_option: 'C',
        explanation: "La JVM recherche exactement `public static void main(String[] args)`. public : accessible par la JVM. static : appelable sans instance. void : ne retourne rien. String[] args : arguments de ligne de commande.",
        astuce: "main exacte : public static void main(String[] args) — aucune variation acceptée par la JVM."
      }
    ]
  }
];
