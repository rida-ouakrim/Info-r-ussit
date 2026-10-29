-- ==============================================================
-- MISE À JOUR AFFICHAGE CODE CONCOURS SPÉCIALITÉ 2023
-- Corrige Q8, Q9, Q13, Q18, Q25 et texte d'appui Q27-Q30
-- ==============================================================
BEGIN;

-- Correction Question Q8 (pk=352)
UPDATE exams_question SET question_text = '```alg
proc1()
  Entier i, j, L, T[40][40]
  Afficher("Entrer le nombre de lignes ou de colonnes (L=C): ")
  Lire(L)
  Pour i <- 0 à L-1
    Pour j <- 0 à L-1
      Lire(T[i][j])
    Fin pour
  Fin pour
Fin
```

La procédure `proc1` permet :' WHERE id = 352 OR (exam_year = 2023 AND question_number = 'Q8' AND source_type = 'past_exam');

-- Correction Question Q9 (pk=353)
UPDATE exams_question SET question_text = '```alg
f (n :entier)
  Si n = 0 alors
    retourner 1
  Sinon
    retourner n * f(n-1)
fin
```

Pour n = 4, la fonction f retourne :' WHERE id = 353 OR (exam_year = 2023 AND question_number = 'Q9' AND source_type = 'past_exam');

-- Correction Question Q13 (pk=357)
UPDATE exams_question SET question_text = 'Que retourne la fonction F définie ci-dessous ?

```alg
Fonction F(tab)
  m <- tab[0]
  Pour chaque élément x du tableau tab
    Si x < m Alors
      m <- x
  Fin Pour
  Retourner m
Fin
```' WHERE id = 357 OR (exam_year = 2023 AND question_number = 'Q13' AND source_type = 'past_exam');

-- Correction Question Q18 (pk=362)
UPDATE exams_question SET question_text = 'Quelle ligne du code suivant contient une erreur de syntaxe ?

```c
1  void f(unsigned int n) {
2    int i; j = 1;
3    for (i=1; i<n; i++) {
4      j = j * i;
5    }
6    printf("Resultat : %d -> %d\n", n, j);
7  }
```' WHERE id = 362 OR (exam_year = 2023 AND question_number = 'Q18' AND source_type = 'past_exam');

-- Correction Question Q25 (pk=369)
UPDATE exams_question SET question_text = 'Que fait ce code ?

```php
<?php
$db = mysql_connect(''localhost'', ''mabase'', ''mot-de-passe'');
mysql_select_db(''mabase'', $db);
$req = mysql_query(''SELECT * FROM matable'');
$res = mysql_numrows($req);
echo ".$res";
mysql_close($db);
?>
```' WHERE id = 369 OR (exam_year = 2023 AND question_number = 'Q25' AND source_type = 'past_exam');

-- Ajout Document d'appui Q27 (pk=371)
UPDATE exams_question SET reference_text = '**Schéma relationnel :**
- `candidat` (**Code_candidat**, Nom, prenom)
- `participe` (**#Code_candidat**, **#Code_concours**)
- `concours` (**Code_concours**, Date)' WHERE id = 371 OR (exam_year = 2023 AND question_number = 'Q27' AND source_type = 'past_exam');

-- Ajout Document d'appui Q28 (pk=372)
UPDATE exams_question SET reference_text = '**Schéma relationnel :**
- `candidat` (**Code_candidat**, Nom, prenom)
- `participe` (**#Code_candidat**, **#Code_concours**)
- `concours` (**Code_concours**, Date)' WHERE id = 372 OR (exam_year = 2023 AND question_number = 'Q28' AND source_type = 'past_exam');

-- Ajout Document d'appui Q29 (pk=373)
UPDATE exams_question SET reference_text = '**Schéma relationnel :**
- `candidat` (**Code_candidat**, Nom, prenom)
- `participe` (**#Code_candidat**, **#Code_concours**)
- `concours` (**Code_concours**, Date)' WHERE id = 373 OR (exam_year = 2023 AND question_number = 'Q29' AND source_type = 'past_exam');

-- Ajout Document d'appui Q30 (pk=374)
UPDATE exams_question SET reference_text = '**Schéma relationnel :**
- `candidat` (**Code_candidat**, Nom, prenom)
- `participe` (**#Code_candidat**, **#Code_concours**)
- `concours` (**Code_concours**, Date)' WHERE id = 374 OR (exam_year = 2023 AND question_number = 'Q30' AND source_type = 'past_exam');

COMMIT;
