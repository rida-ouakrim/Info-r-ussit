-- ==============================================================================
-- MISE À JOUR SÉCURISÉE DU CONCOURS SPÉCIALITÉ 2023 (80 QUESTIONS COMPLÈTES)
-- AUCUNE PERTE DE DONNÉES : Uniquement des UPDATE ciblés et 1 INSERT sécurisé
-- ==============================================================================

BEGIN;

-- 1. Réassigner les 7 questions SQL/BD de 2023 vers DEV (DEV_SI_BD)
UPDATE exams_question
SET domain_id = 'DEV',
    subdomain_id = 'DEV_SI_BD',
    course_id = 2
WHERE exam_year = 2023
  AND source_type = 'past_exam'
  AND question_number IN ('Q20', 'Q23', 'Q26', 'Q27', 'Q28', 'Q29', 'Q30')
  AND (domain_id = 'CONCOURS_ETAT' OR domain_id IS NULL OR domain_id != 'DIDACTIQUE');

-- 2. Réassigner la question Q77 (Clé primaire) vers LOG (LOG_OFFICE)
UPDATE exams_question
SET domain_id = 'LOG',
    subdomain_id = 'LOG_OFFICE',
    course_id = 17
WHERE exam_year = 2023
  AND source_type = 'past_exam'
  AND question_number = 'Q77'
  AND (domain_id = 'CONCOURS_ETAT' OR domain_id IS NULL);

-- 3. Réaffecter les questions intruses de Didactique vers DIDACTIQUE
UPDATE exams_question
SET domain_id = 'DIDACTIQUE',
    subdomain_id = 'DID_CONCEPTS'
WHERE exam_year = 2023
  AND question_text ILIKE '%Parmi ces options, il existe une qui ne représente pas un concept fondamental%';

UPDATE exams_question
SET domain_id = 'DIDACTIQUE',
    subdomain_id = 'DID_CONCEPTS'
WHERE exam_year = 2023
  AND question_text ILIKE '%La pensée informatique ou computationnelle fait référence%';

UPDATE exams_question
SET domain_id = 'DIDACTIQUE',
    subdomain_id = 'DID_APPROCHES'
WHERE exam_year = 2023
  AND question_text ILIKE '%Le programme proposé contient une anomalie%';

UPDATE exams_question
SET domain_id = 'DIDACTIQUE',
    subdomain_id = 'DID_APPROCHES'
WHERE exam_year = 2023
  AND question_text ILIKE '%L''anomalie du programme proposé influence sur%';

-- 4. Insérer la question Q50 si elle n'existe pas déjà
INSERT INTO exams_question (
    source_type,
    exam_year,
    question_number,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    option_e,
    correct_option,
    explanation,
    astuce,
    reference_text,
    domain_id,
    subdomain_id,
    course_id,
    created_at
)
SELECT
    'past_exam',
    2023,
    'Q50',
    'Le nombre de bits qui compose une adresse IP version 6 (IPv6) est :',
    '32 bits',
    '64 bits',
    '128 bits',
    '256 bits',
    NULL,
    'C',
    'Une adresse IP version 6 (IPv6) est codée sur 128 bits (soit 16 octets), généralement représentée sous forme de huit groupes de quatre chiffres hexadécimaux séparés par des deux-points (:). Cela offre un espace d''adressage de 2^128 adresses.',
    'IPv4 = 32 bits (4 octets) ; IPv6 = 128 bits (16 octets). Retenez que 128 = 4 × 32.',
    NULL,
    'SYS_RES',
    'SYS_NET',
    13,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM exams_question
    WHERE exam_year = 2023
      AND question_number = 'Q50'
      AND domain_id = 'SYS_RES'
);

COMMIT;

-- Vérification immédiate du total pour le Concours Spécialité 2023
SELECT count(*) AS total_questions_specialite_2023
FROM exams_question
WHERE exam_year = 2023
  AND source_type = 'past_exam'
  AND domain_id IN ('DEV', 'SYS_RES', 'LOG');
