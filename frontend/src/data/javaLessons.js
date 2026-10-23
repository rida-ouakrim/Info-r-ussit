/**
 * Cours Complet Java & Programmation Orientée Objet - inforéussite.online
 * Module 1 : Introduction à Java
 * Chapitre 1 : Histoire, Philosophie et Cycle d'Exécution de Java (Du Code Source au Bytecode et à la JVM)
 */

export const javaLessons = [
  {
    num: 1,
    moduleId: "java_mod_1",
    moduleTitle: "Module 1 — Introduction à Java & Écosystème",
    chapterNum: 1,
    title: "Histoire, Philosophie et Cycle d'Exécution de Java (Bytecode & JVM)",
    duration: "25 min",
    level: "Débutant à Intermédiaire",
    prerequisites: "Aucun prérequis en programmation orientée objet n'est nécessaire. Une culture informatique de base suffit.",
    objectives: [
      "Comprendre la genèse et les motivations architecturales qui ont donné naissance au langage Java.",
      "Maîtriser le principe fondamental « Write Once, Run Anywhere » (WORA) et son fonctionnement réel.",
      "Distinguer avec précision la compilation native (C/C++), l'interprétation pure (Python/JS) et l'approche hybride de Java.",
      "Décortiquer le cycle complet : du fichier source .java au bytecode .class jusqu'à l'exécution par la JVM.",
      "Identifier le rôle des composants internes de la JVM (ClassLoader, Bytecode Verifier, JIT Compiler, Garbage Collector).",
      "Résoudre avec certitude les questions de concours portant sur l'architecture, la portabilité et le bytecode."
    ],

    // SECTION PRINCIPALE DU COURS (Format Markdown interactif inforéussite)
    content: `# Module 1 : Introduction à Java
# Chapitre 1 : Histoire, Philosophie et Cycle d'Exécution de Java (Bytecode & JVM)

---

## A. Présentation du chapitre
* **Niveau :** Débutant à Intermédiaire
* **Durée estimée :** 25 minutes
* **Prérequis :** Notions générales sur les fichiers et le fonctionnement d'un ordinateur.
* **Objectifs :** Comprendre l'architecture d'exécution de Java, la portabilité via le bytecode, le rôle de la JVM et maîtriser les pièges classiques des concours sur la compilation et l'exécution.

---

## B. Introduction intuitive : Le problème universel de la « Tour de Babel » informatique

Imaginez que vous écriviez un livre en français. Pour qu'un lecteur japonais, allemand ou brésilien puisse le lire, deux approches traditionnelles s'offraient historiquement en informatique :

1. **La traduction intégrale préalable (Compilation native comme en C ou C++) :** 
   Vous embauchez un traducteur pour chaque pays afin de réécrire complètement le livre en japonais pour Tokyo, en allemand pour Berlin, etc. 
   * *Avantage :* Le lecteur local lit directement sa langue natale à vitesse maximale.
   * *Inconvénient majeur :* Si vous modifiez une seule phrase, vous devez refaire traduire et redistribuer autant de versions différentes qu'il y a de pays. Si un nouveau pays apparaît, votre livre ne peut pas y être lu sans une nouvelle traduction complète.

2. **L'interprète simultané (Interprétation pure comme les débuts de Python ou JavaScript) :**
   Vous voyagez avec un interprète humain qui traduit vos phrases à voix haute au fur et à mesure que vous parlez.
   * *Avantage :* Vous n'avez qu'un seul manuscrit original.
   * *Inconvénient :* L'exécution est considérablement ralentie, car chaque mot doit être analysé et traduit en temps réel, mot à mot.

### L'idée de génie de Java : L'Esperanto Informatique (Le Bytecode)
Dans les années 1990, l'équipe de James Gosling chez Sun Microsystems s'est posé une question fondamentale :  
*« Pourquoi traduire directement dans le dialecte physique de chaque processeur (Intel x86, ARM, PowerPC, SPARC) ? Créons une langue intermédiaire universelle et standardisée, compréhensible par un processeur virtuel idéal. »*

Cette langue intermédiaire s'appelle le **Bytecode**.  
Chaque système d'exploitation n'a plus besoin que d'un seul exécuteur universel : la **JVM (Java Virtual Machine)**.  
C'est ainsi qu'est née la devise légendaire de Java :  
> **« Write Once, Run Anywhere » (WORA) — Écrire une fois, exécuter partout.**

---

## C. Explication détaillée des concepts fondamentaux

### 1. Historique et genèse du projet
* **1991 (Le projet « Green ») :** James Gosling, Mike Sheridan et Patrick Naughton cherchent à concevoir un langage pour les appareils électroniques grand public (télécommandes interactives, téléviseurs connectés). Le langage s'appelle d'abord **Oak** (d'après le chêne devant la fenêtre de Gosling).
* **1995 (Naissance officielle de Java) :** Rebaptisé **Java** (en référence au café consommé par les développeurs), le langage explose avec l'essor du Web grâce aux *Applets*, permettant pour la première fois d'exécuter du code interactif sécurisé dans un navigateur web.
* **2010 :** Rachat de Sun Microsystems par **Oracle Corporation**, qui supervise désormais les spécifications et le développement du langage.
* **Aujourd'hui (Java moderne) :** Java publie une nouvelle version tous les 6 mois, avec des versions **LTS (Long-Term Support)** tous les deux ans (Java 8, Java 11, Java 17, Java 21). Notre cours utilise **Java 17 LTS** comme référence principale.

---

### 2. Les caractéristiques majeures de Java (Livre Blanc de Sun)
Dans les concours informatiques, on interroge fréquemment les candidats sur les 11 qualificatifs officiels du livre blanc de Java :

1. **Simple :** Syntaxe proche du C++, mais épurée des concepts sources d'erreurs majeures : suppression de l'arithmétique des pointeurs, élimination de l'héritage multiple de classes, et disparition de l'instruction \`goto\`.
2. **Orienté Objet :** Presque tout en Java est modélisé sous forme de classes et d'objets (à l'exception des 8 types primitifs pour des raisons de performance).
3. **Distribué :** Conçu nativement pour communiquer sur les réseaux TCP/IP (sockets, RMI, HTTP).
4. **Robuste :** Gestion stricte des types à la compilation, élimination des fuites de mémoire grâce au **Garbage Collector**, et gestion obligatoire des situations exceptionnelles.
5. **Sécurisé :** Exécution sous le contrôle strict de la JVM, bac à sable (sandbox) et absence d'accès direct non sécurisé à la mémoire physique.
6. **Neutre vis-à-vis de l'architecture :** Le compilateur génère un format binaire indépendant de la puce processeur : le **bytecode**.
7. **Portable :** Non seulement le bytecode est portable, mais les types primitifs ont une taille et un comportement strictement identiques sur toutes les machines (par exemple, un \`int\` fait exactement 32 bits en complément à 2, que vous soyez sous Windows 64 bits, Linux ARM ou macOS).
8. **Interprété et Compilé Just-in-Time (JIT) :** La JVM interprète le bytecode, mais les morceaux de code exécutés très souvent (« Hot Spots ») sont compilés à la volée en code machine ultra-rapide par le compilateur **JIT**.
9. **Multithread :** Support natif de l'exécution concurrente de plusieurs tâches au sein d'un même programme.
10. **Dynamique :** Les classes ne sont chargées en mémoire que lorsqu'elles sont réellement nécessaires, permettant des mises à jour dynamiques de modules sans recompiler tout le système.

---

### 3. Le cycle de vie complet : Du code source à l'exécution

Pour exécuter un programme Java, le parcours se divise rigoureusement en deux phases distinctes :

\`\`\`
[Fichier Source: Bonjour.java]
            │
            ▼ (Commande: javac Bonjour.java)
  ┌───────────────────┐
  │ Compilateur javac │  <-- Phase 1 : Compilation (Hors ligne)
  └───────────────────┘
            │
            ▼
[Fichier Bytecode: Bonjour.class] (Format binaire indépendant de l'OS)
            │
            ▼ (Commande: java Bonjour)
  ┌──────────────────────────────────────────────┐
  │        Machine Virtuelle Java (JVM)          │  <-- Phase 2 : Exécution (En mémoire)
  │                                              │
  │  1. ClassLoader (Chargement des classes)     │
  │  2. Bytecode Verifier (Contrôle de sécurité) │
  │  3. Execution Engine (Moteur d'exécution)    │
  │     ├── Interpréteur                         │
  │     ├── Compilateur JIT (HotSpot)            │
  │     └── Garbage Collector                    │
  └──────────────────────────────────────────────┘
            │
            ▼
   Système d'exploitation & Processeur hôte (Windows, Linux, macOS...)
\`\`\`

#### Illustration pédagogique 1 : Fonctionnement du cycle d'exécution
![Schéma du cycle d'exécution Java : Code Source, Compilateur javac, Bytecode, JVM et Exécution](/images/java_execution_flow.jpg)

*Légende : Le cycle en 5 étapes reliant le code source lisible par l'humain (.java) au résultat final sur l'écran grâce au compilateur javac et à la JVM.*

---

### 4. Anatomie détaillée des composants internes de la JVM

La **JVM** n'est pas un simple interpréteur bête et méchant. C'est une machine informatique virtuelle complète qui intègre trois sous-systèmes cruciaux :

#### A. Le ClassLoader (Chargeur de classes)
Il charge dynamiquement les fichiers \`.class\` en mémoire RAM quand le programme en a besoin. Il fonctionne selon une hiérarchie stricte en 3 phases :
1. **Loading (Chargement) :** Recherche le binaire du fichier \`.class\` sur le disque et crée sa représentation en mémoire.
2. **Linking (Liaison) :** 
   - *Verification :* Vérifie que le bytecode respecte la spécification du langage Java et ne corrompt pas la mémoire.
   - *Preparation :* Alloue la mémoire pour les variables statiques et leur assigne les valeurs par défaut.
   - *Resolution :* Remplace les références symboliques du code par des adresses mémoire directes.
3. **Initialization (Initialisation) :** Exécute les blocs statiques et assigne les véritables valeurs initiales aux variables statiques.

#### B. Le Bytecode Verifier (Vérificateur de Bytecode)
C'est le garde du corps de Java. Avant d'exécuter la moindre instruction, il s'assure que :
- Le fichier n'a pas été falsifié par un attaquant.
- Les pointeurs ne sont pas manipulés illégalement.
- La pile d'exécution ne subit ni débordement (*overflow*) ni sous-dépassement (*underflow*).
- Les conversions de types sont strictement valides.

#### C. L'Execution Engine (Moteur d'Exécution)
Il combine trois moteurs d'une efficacité redoutable :
1. **L'Interpréteur :** Lit chaque instruction de bytecode une par une et l'exécute immédiatement. C'est très rapide au démarrage du programme.
2. **Le Compilateur JIT (Just-In-Time) :** Surveille le programme en cours d'exécution. Dès qu'une boucle ou une méthode est appelée des milliers de fois (un « point chaud » ou *HotSpot*), le JIT compile directement ce morceau de bytecode en **instructions machines natives du processeur**. Aux exécutions suivantes, le processeur exécute le code à la même vitesse que du C++ compilé !
3. **Le Garbage Collector (Ramasse-miettes) :** Surveille la mémoire dynamique (le *Heap*). Dès qu'un objet créé n'est plus référencé par aucune variable du programme, le Garbage Collector détruit automatiquement cet objet et libère la mémoire RAM, empêchant les redoutables fuites de mémoire (*memory leaks*).

---

## D. Comparatif approfondi : Java vs C/C++ vs Python vs JavaScript

Dans les concours administratifs et les entretiens techniques, les questions comparatives sont récurrentes. Voici le comparatif officiel :

| Critère | C / C++ | Java (17 LTS) | Python | JavaScript (Node.js / V8) |
| :--- | :--- | :--- | :--- | :--- |
| **Paradigme dominant** | Procédural / Multi-paradigme | Orienté Objet strict | Multi-paradigme | Multi-paradigme / Prototypé |
| **Typage** | Statique | Statique fort | Dynamique fort | Dynamique faible |
| **Mode d'exécution** | Compilation native directe | Compilé en Bytecode + Exécuté JVM (JIT) | Interprété (Bytecode interne CPython) | Interprété + Compilé JIT (Moteur V8) |
| **Gestion mémoire** | Manuelle (\`malloc\`, \`free\`, \`new\`, \`delete\`) | Automatique (**Garbage Collector**) | Automatique (Comptage de réf. + GC) | Automatique (Garbage Collector) |
| **Arithmétique de pointeurs**| Oui (accès direct adresses) | **Non** (Strictement interdite) | Non | Non |
| **Portabilité du binaire** | Nulle (1 binaire par couple OS/CPU)| **Totale** (\`.class\` universel) | Fichiers sources portables | Fichiers sources portables |
| **Vitesse d'exécution** | Maximale | Très élevée (après chauffe JIT) | Modérée à lente | Élevée (JIT V8) |
| **Domaines de prédilection** | Systèmes d'exploitation, jeux, embarqué | **Grands systèmes d'entreprise, banques, Android** | Data Science, IA, Scripts, Web rapide | Web Frontend, APIs légères |

---

## E. Différence fondamentale entre JDK, JRE et JVM

C'est **la question N°1 posée dans les QCM de concours** :

#### Illustration pédagogique 6 : Architecture imbriquée JDK / JRE / JVM
![Schéma hiérarchique : JDK contient le JRE, qui contient la JVM](/images/jdk_jre_jvm_hierarchy.jpg)

*Légende : Le JDK (outils développeur + JRE) englobe le JRE (bibliothèques + JVM), qui englobe la JVM (moteur d'exécution).*

### Les 3 niveaux d'emboîtement :
1. **JVM (Java Virtual Machine) :** C'est le moteur pur. Elle ne sait faire qu'une chose : charger et exécuter du bytecode. Elle est dépendante du système d'exploitation (il existe une JVM spécifique pour Windows x64, une pour Linux ARM, une pour macOS Apple Silicon).
2. **JRE (Java Runtime Environment) = JVM + Bibliothèques standards (\`java.lang\`, \`java.util\`, etc.) :** C'est l'environnement minimal requis pour un **utilisateur** qui souhaite simplement lancer une application Java existante sur son ordinateur sans écrire de code.
3. **JDK (Java Development Kit) = JRE + Outils de développement :** C'est la boîte à outils complète destinée aux **développeurs**. Elle contient le compilateur (\`javac\`), le débogueur (\`jdb\`), le générateur de documentation (\`javadoc\`), et l'archiveur (\`jar\`).

> [!IMPORTANT]
> **Règle Concours :**
> - On a besoin du **JDK** pour **compiler** (\`javac\`).
> - On a besoin uniquement du **JRE** (ou de la JVM) pour **exécuter** (\`java\`).
> - Le code source (\`.java\`) et le bytecode (\`.class\`) sont **indépendants** de la machine.
> - La JVM et le JDK sont **spécifiques** à chaque système d'exploitation.

---

## F. Erreurs classiques et pièges de concours

### Piège 1 : Confondre Java et JavaScript
* **Vérité :** Java et JavaScript n'ont absolument aucun lien technique de parenté. 
* JavaScript s'appelait à l'origine *Mocha*, puis *LiveScript*, et a été rebaptisé *JavaScript* par Netscape en 1995 pour des raisons purement publicitaires en profitant de la popularité fulgurante de Java. 
* Java est compilé, typé statiquement et tourne sur la JVM ; JavaScript est un langage de script dynamique principalement conçu pour les navigateurs web.

### Piège 2 : Croire que Java est purement interprété
* De nombreux QCM piègent les candidats avec la question : *« Le langage Java est-il un langage compilé ou interprété ? »*
* **Bonne réponse :** C'est un langage **hybride (à la fois compilé et interprété)**. Il est **compilé** en bytecode par \`javac\`, puis ce bytecode est **interprété et compilé à la volée (JIT)** par la JVM.

### Piège 3 : La taille des types primitifs
* En C/C++, la taille d'un entier \`int\` ou d'un pointeur dépend du compilateur et de l'architecture matérielle (16 bits, 32 bits, 64 bits).
* **En Java, la taille des types est immuable et universelle :** un \`byte\` fait 8 bits, un \`short\` 16 bits, un \`int\` 32 bits, un \`long\` 64 bits, partout et pour toujours.

### Piège 4 : Absence totale de pointeurs ?
* *« Y a-t-il des pointeurs en Java ? »*
* En interne, Java manipule intensivement des adresses mémoire qu'on appelle des **références d'objets**. En revanche, le langage interdit formellement **l'arithmétique des pointeurs** (impossible d'écrire \`ptr++\` ou d'accéder à l'adresse brute d'une variable comme en C avec \`&var\`).
`,

    // EXEMPLES PRATIQUES COMPLETS ET COMMENTÉS
    examples: `# Exemples Pratiques du Chapitre 1

## Exemple 1 : Le programme minimal « Hello World »

Voici le code Java complet et autonome :

\`\`\`java
public class HelloWorld {
    // Méthode principale : point d'entrée obligatoire du programme
    public static void main(String[] args) {
        // Affiche une ligne de texte sur la console standard
        System.out.println("Bonjour le monde depuis Java 17 !");
    }
}
\`\`\`

### Étapes d'exécution en ligne de commande :
1. Enregistrement du fichier sous le nom exact : \`HelloWorld.java\`
2. Compilation dans le terminal :
   \`\`\`bash
   javac HelloWorld.java
   \`\`\`
   *Résultat :* Création d'un fichier binaire \`HelloWorld.class\` dans le dossier.
3. Exécution avec la JVM :
   \`\`\`bash
   java HelloWorld
   \`\`\`
   *(Remarquez qu'on ne met JAMAIS l'extension .class lors de l'appel à java)*

### Résultat dans la console :
\`\`\`text
Bonjour le monde depuis Java 17 !
\`\`\`

---

## Exemple 2 : Observation concrète du Bytecode avec javap (Niveau Intermédiaire)

Pour prouver que le fichier \`.class\` n'est pas du code machine x86 mais des opcodes virtuels de la JVM, Java fournit un outil de désassemblage nommé \`javap\`.

Considérons cette méthode simple :
\`\`\`java
public class Calcul {
    public static int additionner(int a, int b) {
        return a + b;
    }
}
\`\`\`

Après avoir compilé avec \`javac Calcul.java\`, exécutons :
\`\`\`bash
javap -c Calcul
\`\`\`

### Sortie affichée par le désassembleur de Bytecode :
\`\`\`text
public static int additionner(int, int);
  Code:
     0: iload_0        // Charge le premier paramètre entier sur la pile
     1: iload_1        // Charge le deuxième paramètre entier sur la pile
     2: iadd           // Dépile les deux entiers, les additionne et empile le résultat
     3: ireturn        // Retourne l'entier situé au sommet de la pile
\`\`\`

### Justification pédagogique :
* La JVM fonctionne comme une **machine à pile (Stack-based Virtual Machine)**.
* Des instructions comme \`iload_0\`, \`iadd\` et \`ireturn\` mesurent exactement 1 octet (d'où le nom de **bytecode**).
* Ce code de 4 octets s'exécutera à l'identique sur un processeur Intel Core i9, un processeur AMD Ryzen, ou une puce ARM Apple Silicon M3 !

---

## Exemple 3 : Exemple type Concours — Détection d'erreurs de commande et de casse

Observez attentivement la commande suivante tapée par un candidat lors d'un concours :

\`\`\`bash
# Situation : le fichier s'appelle 'Test.java' et contient 'public class Test { ... }'
javac Test.java
java Test.class
\`\`\`

### Que se passe-t-il exactement ?
1. La ligne \`javac Test.java\` réussit et produit \`Test.class\`.
2. La ligne \`java Test.class\` **échoue avec une erreur d'exécution** :
   \`\`\`text
   Error: Could not find or load main class Test.class
   Caused by: java.lang.ClassNotFoundException: Test/class
   \`\`\`

### Explication du piège :
La commande \`java\` attend le **nom complet de la classe** (Fully Qualified Class Name), et **non le nom du fichier disque**. En écrivant \`Test.class\`, la JVM pense que vous lui demandez de charger une classe interne \`class\` située dans le package \`Test\`.  
La commande correcte est impérativement :  
\`\`\`bash
java Test
\`\`\`
`,

    // ASTUCES, PIÈGES ET CONSEILS DE CONCOURS
    astuces: `⚡ **Fiche réflexe pour les Concours & Entretiens :**

1. **La règle du nom de fichier :**  
   Si une classe est déclarée \`public\` (ex: \`public class MonProgramme\`), le fichier source **DOIT obligatoirement** s'appeler \`MonProgramme.java\` (avec le même respect strict des majuscules/minuscules). Si la classe n'est pas publique, le fichier peut porter un autre nom, mais cela reste déconseillé.

2. **L'exécution avec \`java\` :**  
   - \`javac Programme.java\` ➔ nécessite l'extension \`.java\`.
   - \`java Programme\` ➔ **JAMAIS d'extension \`.class\`** !

3. **Portabilité et JVM :**  
   - Le code source est portable : **VRAI**.
   - Le bytecode est portable : **VRAI**.
   - La JVM est portable : **FAUX** ! La JVM est propre à chaque système d'exploitation. C'est la JVM qui absorbe les spécificités de la machine pour rendre le bytecode portable.

4. **Garbage Collection :**  
   En Java, la mémoire allouée aux objets n'est jamais libérée manuellement. C'est le ramasse-miettes (*Garbage Collector*) qui s'en charge en tâche de fond. L'appel \`System.gc()\` n'est qu'une **suggestion** faite à la JVM et ne garantit pas une exécution immédiate.

5. **Nouveauté Java 11+ (Très utile en test) :**  
   Depuis Java 11, on peut exécuter directement un fichier source unique sans le compiler manuellement au préalable avec la commande :
   \`\`\`bash
   java HelloWorld.java
   \`\`\`
   La JVM compile alors le fichier en mémoire vive et l'exécute à la volée sans créer de fichier \`.class\` sur le disque !`,

    // EXERCICES D'APPLICATION & TRAÇAGE
    exercises: [
      {
        id: "ex1",
        title: "Exercice 1 : Trajet d'un code source Java",
        question: "Remettez dans l'ordre chronologique les 6 étapes suivantes qui permettent à un programme Java de s'exécuter :\n" +
                  "A. Le compilateur JIT compile les méthodes fréquemment exécutées en code machine natif.\n" +
                  "B. Le développeur rédige le code dans un fichier nommé Calcul.java.\n" +
                  "C. Le ClassLoader charge le fichier Calcul.class en mémoire RAM.\n" +
                  "D. Le compilateur javac transforme le code en bytecode.\n" +
                  "E. L'interpréteur de la JVM commence à lire et exécuter les premières instructions de bytecode.\n" +
                  "F. Le Bytecode Verifier s'assure que le fichier .class ne viole aucune règle de sécurité mémoire."
      },
      {
        id: "ex2",
        title: "Exercice 2 : Détection d'erreurs d'environnement",
        question: "Un candidat sur sa machine Linux tape les deux commandes suivantes :\n" +
                  "```bash\n$ javac MonProgramme.java\nbash: javac: command not found\n$ java -version\nopenjdk version \"17.0.2\" ...\n```\n" +
                  "Expliquez techniquement pourquoi la commande `java` fonctionne parfaitement alors que `javac` renvoie une erreur. Que doit installer ou configurer le candidat ?"
      },
      {
        id: "ex3",
        title: "Exercice 3 : Traçage de compatibilité d'architecture",
        question: "Une entreprise compile un fichier `Application.java` sur un serveur équipé de Windows 11 et d'un processeur Intel x86_64 avec la commande `javac Application.java`.\n" +
                  "Le fichier `Application.class` généré est ensuite transféré par réseau sur un nano-ordinateur Raspberry Pi 4 équipé de Linux (architecture processeur ARM64).\n" +
                  "Le programme fonctionnera-t-il sur le Raspberry Pi ? Doit-on recompiler le code ? Justifiez en détaillant les rôles respectifs du bytecode et de la JVM."
      }
    ],

    // CORRIGÉS DÉTAILLÉS DES EXERCICES
    exercisesSolutions: `# Solutions Détaillées des Exercices du Chapitre 1

### Corrigé Exercice 1 :
* **Ordre chronologique exact :** **B ➔ D ➔ C ➔ F ➔ E ➔ A**
* **Raisonnement étape par étape :**
  1. **B :** Création du fichier source \`Calcul.java\`.
  2. **D :** Compilation préalable hors ligne par \`javac\` produisant \`Calcul.class\`.
  3. **C :** Lancement de \`java Calcul\` : le **ClassLoader** charge le bytecode en mémoire.
  4. **F :** Le **Bytecode Verifier** valide la sécurité du binaire avant toute exécution.
  5. **E :** L'**Interpréteur** commence l'exécution séquentielle immédiate des opcodes.
  6. **A :** Le **JIT (Just-In-Time)** détecte les portions répétitives et les compile en code machine natif pour accélérer l'exécution.
* **Règle générale :** En Java, la vérification de sécurité a toujours lieu *après* le chargement de la classe et *avant* l'exécution des instructions.

---

### Corrigé Exercice 2 :
* **Diagnostic technique :**
  La machine possède le **JRE** (Java Runtime Environment), ce qui lui permet de lancer la JVM via la commande \`java\`, mais elle ne possède pas le **JDK** (Java Development Kit), qui fournit le compilateur \`javac\`.
* **Solution :**
  Le candidat doit installer le paquet complet du JDK (ex: \`sudo apt install openjdk-17-jdk\`) et s'assurer que le chemin d'accès vers le sous-dossier \`bin\` du JDK est bien inclus dans sa variable d'environnement système \`PATH\`.
* **Règle générale :** Le JRE suffit pour faire tourner une application ; le JDK est strictement obligatoire pour compiler du code source.

---

### Corrigé Exercice 3 :
* **Réponse :** Oui, le programme fonctionnera parfaitement et **il ne faut surtout pas le recompiler**.
* **Justification :**
  Le compilateur \`javac\` sur Windows n'a pas produit de code binaire x86, mais du **bytecode standardisé indépendant de la machine**. Dès lors que le Raspberry Pi dispose d'une JVM compatible installée pour son système (Linux ARM64), cette JVM sera capable de lire, interpréter et exécuter ce même fichier \`Application.class\`.
* **Règle générale :** C'est l'essence même du principe « Write Once, Run Anywhere » (WORA).`,

    // QCM DE CONCOURS RIGOUROUX ET SANS AMBIGUÏTÉ (5 questions minimum)
    quiz: [
      {
        id: 101,
        question_number: "Q1",
        question_text: "En Java, quel composant est directement responsable de la transformation du fichier de code source (.java) en bytecode (.class) ?",
        option_a: "La Machine Virtuelle Java (JVM)",
        option_b: "Le compilateur javac",
        option_c: "Le ClassLoader",
        option_d: "Le compilateur Just-In-Time (JIT)",
        correct_option: "B",
        explanation: "C'est l'outil `javac` (Java Compiler) qui traduit le texte source humain (.java) en bytecode standardisé (.class). La JVM et le ClassLoader n'interviennent que lors de la phase d'exécution ultérieure.",
        astuce: "Pensez au 'c' de javac qui signifie 'Compiler'. La JVM n'exécute que le résultat produit par javac."
      },
      {
        id: 102,
        question_number: "Q2",
        question_text: "Laquelle des affirmations suivantes concernant la portabilité de Java est EXACTE ?",
        option_a: "Le bytecode est spécifique à chaque système d'exploitation.",
        option_b: "La Machine Virtuelle Java (JVM) est strictement identique pour tous les systèmes d'exploitation.",
        option_c: "Le bytecode est indépendant du système, mais chaque système d'exploitation nécessite une JVM qui lui est propre.",
        option_d: "Java nécessite une recompilation complète du code source sur chaque nouvelle machine cible.",
        correct_option: "C",
        explanation: "Le bytecode (.class) est 100% universel et identique partout. En revanche, le programme exécutable qui le fait tourner (la JVM) doit être adapté au système hôte (une JVM Windows ne fonctionne pas sous Linux).",
        astuce: "Ce qui est portable = le Bytecode. Ce qui n'est pas portable = la JVM (qui fait le pont avec l'OS local)."
      },
      {
        id: 103,
        question_number: "Q3",
        question_text: "Quelle commande permet d'exécuter correctement un programme dont la classe compilée s'intitule `Concours` et est située dans le dossier courant ?",
        option_a: "java Concours.java",
        option_b: "java Concours.class",
        option_c: "javac Concours",
        option_d: "java Concours",
        correct_option: "D",
        explanation: "La commande d'exécution `java` attend en paramètre le nom de la classe (`Concours`) et JAMAIS son nom de fichier avec extension (`Concours.class`). L'utilisation de l'extension .class provoque une erreur ClassNotFoundException.",
        astuce: "Règle d'or : 'javac' prend le nom du fichier avec .java, 'java' prend le nom de la classe SANS extension."
      },
      {
        id: 104,
        question_number: "Q4",
        question_text: "Quel sous-système de la JVM a pour rôle de convertir dynamiquement à l'exécution les portions de bytecode fréquemment appelées en instructions machine natives ?",
        option_a: "Le Garbage Collector",
        option_b: "Le Compilateur JIT (Just-In-Time)",
        option_c: "Le Bytecode Verifier",
        option_d: "Le Bootstrap ClassLoader",
        correct_option: "B",
        explanation: "Le compilateur JIT (Just-In-Time) surveille l'exécution du bytecode. Lorsqu'il détecte des 'points chauds' (HotSpots), il compile ces blocs de bytecode directement en code machine natif pour accélérer radicalement l'exécution.",
        astuce: "JIT = Just-In-Time (Juste à temps). Il transforme le bytecode en code machine au fil de l'eau pendant que le programme tourne."
      },
      {
        id: 105,
        question_number: "Q5",
        question_text: "Quelle relation d'inclusion décrit précisément la structure de l'écosystème Java standard ?",
        option_a: "JVM contient JRE, qui contient JDK",
        option_b: "JRE contient JDK, qui contient JVM",
        option_c: "JDK contient JRE, qui contient JVM",
        option_d: "JDK contient JVM, qui contient JRE",
        correct_option: "C",
        explanation: "La hiérarchie imbriquée est : JDK = JRE + Outils de développement (javac, jdb, jar...). Et JRE = JVM + Bibliothèques d'exécution standard. Par conséquent, JDK ⊃ JRE ⊃ JVM.",
        astuce: "Mnémonique alphabétique inversé : D > R > V (JDK contient le JRE qui contient la JVM)."
      }
    ],

    // SYNTHÈSE DU CHAPITRE
    summary: {
      keyTakeaways: [
        "Java est un langage hybride : il est d'abord compilé par javac en un format binaire universel (le Bytecode .class), puis exécuté par la Machine Virtuelle Java (JVM).",
        "Le principe « Write Once, Run Anywhere » repose sur le fait que seul le bytecode est portable : chaque système d'exploitation possède sa propre implémentation de la JVM pour faire le pont avec le matériel.",
        "Le JDK contient les outils de développement (dont javac) et le JRE. Le JRE contient les bibliothèques d'exécution et la JVM.",
        "La JVM comprend trois moteurs majeurs : le ClassLoader (chargement), le Bytecode Verifier (sécurité mémoire) et l'Execution Engine (Interpréteur + Compilateur JIT + Garbage Collector).",
        "Pour compiler : javac MonFichier.java | Pour exécuter : java MonFichier (sans extension .class)."
      ],
      revisionCard: {
        title: "Fiche Révision Rapide — Chapitre 1",
        points: [
          "Créateur : James Gosling (Sun Microsystems, 1995, racheté par Oracle en 2010).",
          "Version de référence concours : Java 17 LTS.",
          "Fichier source : .java (nom identique à la classe publique).",
          "Fichier binaire : .class (Bytecode standardisé).",
          "Gestion mémoire : Automatique par le Garbage Collector (pas de pointeurs manuels).",
          "Types primitifs : Tailles strictement fixes sur toutes les plateformes (int = 32 bits)."
        ]
      },
      selfCheckQuestions: [
        "1. Quelle est la différence fondamentale entre la façon dont le C++ et le Java gèrent la portabilité ?",
        "2. Pourquoi une commande 'java Test.class' renvoie-t-elle une erreur ?",
        "3. Que fait le compilateur JIT pour augmenter la vitesse d'un programme Java en cours d'exécution ?",
        "4. Peut-on développer et compiler des programmes Java si on installe uniquement le JRE ?"
      ]
    }
  }
];
