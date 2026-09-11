"""
enrich_php_course.py
====================
Enriches the PHP & MySQL course with comprehensive theory, practical code examples,
and exam tips for CRMEF/Agrégation.
"""

from django.core.management.base import BaseCommand
from syllabus.models import Subdomain, Course

PHP_CONTENT = r"""# Développement Web avec PHP & MySQL

## Introduction à PHP (Hypertext Preprocessor)

PHP est un langage de script côté serveur, exécuté par le serveur web (Apache, Nginx) pour générer du HTML dynamique envoyé au navigateur client.

---

## 1. Syntaxe de Base et Types de Données

Un script PHP est délimité par les balises `<?php ... ?>`.

```php
<?php
// Variable (commence par $)
$nom = "Chiny";
$age = 28;
$prix = 99.99;
$estValide = true;

// Concaténation avec le point (.)
echo "Bonjour " . $nom . ", vous avez " . $age . " ans.";
?>
```

### Tableaux en PHP
- **Tableau indexé :** `$fruits = ["Pomme", "Banane", "Orange"];`
- **Tableau associatif :** `$etudiant = ["nom" => "Ali", "note" => 17.5];`

---

## 2. Superglobales importantes en PHP

- `$_GET` : Données transmises via l'URL (query string)
- `$_POST` : Données transmises via le corps d'une requête HTTP (formulaire)
- `$_SERVER` : Informations sur le serveur et le client (`$_SERVER['REQUEST_METHOD']`)
- `$_SESSION` : Données stockées en session serveur après `session_start()`
- `$_COOKIE` : Cookies stockés sur le client

---

## 3. Connexion à MySQL avec PDO (PHP Data Objects)

PDO est l'interface recommandée pour communiquer de manière sécurisée avec les bases de données SQL.

### Connexion PDO :
```php
<?php
$host = "localhost";
$dbname = "concours_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>
```

---

## 4. Requêtes Préparées & Sécurité (Anti-Injection SQL)

> ⚡ **CRITIQUE CONCOURS :** Toujours utiliser des requêtes préparées (`prepare()` + `execute()`) pour éviter l'injection SQL !

```php
<?php
// Requête sécurisée avec marqueurs nommés
$sql = "SELECT * FROM utilisateurs WHERE email = :email AND statut = :statut";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'email' => $_POST['email'],
    'statut' => 'actif'
]);

$user = $stmt->fetch();
?>
```

---

## 5. Gestion des Sessions et Authentification

```php
<?php
session_start(); // Toujours au début du fichier

// Connexion réussie
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_nom'] = $user['nom'];

// Vérification de connexion sur une page protégée
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Déconnexion
session_destroy();
?>
```

---

## 6. Protection contre la Faille XSS (Cross-Site Scripting)

Ne jamais afficher directement les données saisies par un utilisateur sans nettoyage :

```php
<!-- VULNÉRABLE à XSS -->
<p>Bienvenue <?php echo $_GET['name']; ?></p>

<!-- SÉCURISÉ avec htmlspecialchars -->
<p>Bienvenue <?php echo htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8'); ?></p>
```
"""

PHP_EXAMPLES = r"""# Exemples de Code Pratiques — PHP & MySQL

## Exemple 1 : Script CRUD Complet (Créer, Lire, Modifier, Supprimer)

### 1. Afficher tous les étudiants (READ)
```php
<?php
require_once 'db.php';

$stmt = $pdo->query("SELECT * FROM etudiants ORDER BY nom ASC");
$etudiants = $stmt->fetchAll();
?>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Note</th>
        <th>Action</th>
    </tr>
    <?php foreach ($etudiants as $e): ?>
    <tr>
        <td><?= htmlspecialchars($e['id']) ?></td>
        <td><?= htmlspecialchars($e['nom']) ?></td>
        <td><?= htmlspecialchars($e['note']) ?></td>
        <td>
            <a href="supprimer.php?id=<?= $e['id'] ?>" onclick="return confirm('Confirmer ?')">Supprimer</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
```

### 2. Ajouter un étudiant (CREATE)
```php
<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = trim($_POST['nom']);
    $note = filter_input(INPUT_POST, 'note', FILTER_VALIDATE_FLOAT);

    if ($nom && $note !== false) {
        $stmt = $pdo->prepare("INSERT INTO etudiants (nom, note) VALUES (:nom, :note)");
        $stmt->execute(['nom' => $nom, 'note' => $note]);
        header("Location: index.php");
        exit();
    }
}
?>
```

---

## Exemple 2 : Traitement de Formulaire de Connexion Sécurisé

```php
<?php
session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $password = $_POST['password'];

    if ($email && $password) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        // Vérification du mot de passe haché
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            header("Location: dashboard.php");
            exit();
        } else {
            $error = "Identifiants incorrects.";
        }
    }
}
?>
```
"""

PHP_ASTUCES = r"""# Astuces & Pièges Concours — PHP & MySQL

## ⚡ Piège 1 : `==` vs `===` en PHP
- `0 == "admin"` vaut `true` en PHP 7 (transtypage automatique) !
- Utilisez **toujours `===`** pour une comparaison stricte de valeur ET de type.

## ⚡ Piège 2 : `session_start()`
`session_start()` doit obligatoirement être appelé **avant tout envoi de contenu HTML** ou espace blanc au navigateur, sinon une erreur `Headers already sent` survient.

## ⚡ Piège 3 : Injection SQL vs PDO
```php
// Faux (Vulnérable) :
$pdo->query("SELECT * FROM users WHERE id = " . $_GET['id']);

// Vrai (Sécurisé) :
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);
```

## ⚡ Piège 4 : Stockage des mots de passe
Ne JAMAIS utiliser `md5()` ni `sha1()` pour les mots de passe.
Utilisez `password_hash($pass, PASSWORD_BCRYPT)` et `password_verify($pass, $hash)`.

## ⚡ Piège 5 : `include` vs `require`
- `include` génère un **Warning** si le fichier manque (le script continue).
- `require` génère une **Fatal Error** et stoppe le script.
"""


class Command(BaseCommand):
    help = 'Enrich PHP & MySQL course content in database'

    def handle(self, *args, **kwargs):
        subdomain = Subdomain.objects.filter(code='DEV_PROG_WEB').first()
        if not subdomain:
            self.stderr.write("Subdomain DEV_PROG_WEB not found!")
            return

        course, created = Course.objects.update_or_create(
            subdomain=subdomain,
            title="Développement Web Serveur : PHP & MySQL (PDO, CRUD, Sécurité)",
            defaults={
                'content': PHP_CONTENT,
                'examples': PHP_EXAMPLES,
                'astuces': PHP_ASTUCES,
            }
        )

        action = "Créé" if created else "Mis à jour"
        self.stdout.write(self.style.SUCCESS(f"[OK] Cours PHP {action} ! (ID: {course.id})"))
