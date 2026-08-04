"""
enrich_learning_theories.py
===========================
Writes a highly detailed, pedagogical, and visual bilingual content for Course 36
(Théories de l'apprentissage) into both backend/db.sqlite3 and concours.db.
"""

import os
import sys
import sqlite3

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Path variables
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DJANGO = os.path.join(SCRIPT_DIR, "..", "backend", "db.sqlite3")
DB_CONCOURS = os.path.join(SCRIPT_DIR, "..", "concours.db")

# Course 36 Content - FRENCH
CONTENT_FR = """# Théories de l'apprentissage : Béhaviorisme, Constructivisme, Socio-constructivisme, Cognitivisme

## 1. Cadre Référentiel & Objectifs

L'objectif de cet axe est de permettre au candidat de maîtriser les fondements psychologiques et pédagogiques de l'apprentissage. À l'issue de cette leçon, vous devez être capable de :
*   **Définir et différencier** les 4 grandes théories de l'apprentissage.
*   **Identifier les théoriciens phares** associés à chaque courant.
*   **Comprendre le rôle** dévolu à l'apprenant, à l'enseignant, ainsi que le statut de l'erreur dans chaque modèle.
*   **Déceler les mots-clés typiques** utilisés dans les questions d'examens (CRMEF) pour repérer la bonne réponse instantanément.

---

## 2. Concepts Fondamentaux & Profils Détaillés

### A. Le Béhaviorisme (السلوكية)
Le béhaviorisme définit l'apprentissage comme une modification durable du comportement observable, résultant d'une réaction à des stimuli externes. L'esprit de l'apprenant est considéré comme une **"boîte noire"** (mécanismes internes non observables et donc ignorés).

![Schéma Béhaviorisme](/images/behaviorism.png)

#### 1. Mécanismes Clés :
*   **Stimulus $\rightarrow$ Réponse (S-R)** : L'apprentissage se fait par association d'un stimulus externe et d'une réponse comportementale.
*   **Conditionnement Classique (Pavlov)** : Association d'un stimulus neutre à un réflexe naturel (ex. cloche $\rightarrow$ nourriture $\rightarrow$ salivation).
*   **Conditionnement Opérant (Skinner)** : Renforcement du comportement par des récompenses (renforcement positif) ou évitement de punitions (renforcement négatif).

#### 2. Profil des Auteurs :
*   **Ivan Pavlov** : Découvreur du conditionnement répondant (réflexe conditionné).
*   **John B. Watson** : Fondateur officiel du béhaviorisme en psychologie.
*   **B.F. Skinner** : Théoricien du conditionnement opérant, de la boîte de Skinner et inventeur de l'**Enseignement Assisté par Ordinateur (EAO)** et de la pédagogie par objectifs.

#### 3. Statut de l'Erreur :
*   L'erreur est considérée comme un **échec**, un mauvais pli ou un manque d'attention qui doit être évité, corrigé immédiatement et sanctionné/redressé pour ne pas se fixer.

#### 4. Rôles :
*   **Apprenant** : Récepteur passif qui réagit aux stimuli (boîte noire).
*   **Enseignant** : Transmetteur, concepteur de stimuli et dispensateur de récompenses/punitions.

#### 5. Exemple Pratique :
*   L'utilisation d'exercices répétitifs (drill) où l'élève reçoit des points bonus ou des félicitations immédiates pour chaque bonne réponse.

---

### B. Le Constructivisme (البنائية)
Le constructivisme affirme que l'apprentissage est un processus actif de construction mentale. L'apprenant ne reçoit pas passivement les informations, mais bâtit sa propre connaissance en agissant sur son environnement.

![Schéma Constructivisme](/images/constructivism.png)

#### 1. Mécanismes Clés :
*   **Assimilation** : Intégration de nouvelles données ou expériences dans les structures cognitives existantes (schémas mentaux) sans les modifier.
*   **Conflit Cognitif** : Déséquilibre provoqué par une contradiction entre les connaissances antérieures de l'élève et la réalité observée. C'est le moteur de l'apprentissage.
*   **Accommodation** : Modification des schémas mentaux existants pour s'adapter à la nouvelle situation perturbante.
*   **Équilibration** : Processus d'autorégulation permettant de surmonter le conflit et d'atteindre un état cognitif supérieur.

#### 2. Profil de l'Auteur :
*   **Jean Piaget** : Biologiste et psychologue suisse, pionnier de l'épistémologie génétique. Il décrit également les stades du développement de l'enfant (sensori-moteur, préopératoire, opératoire concret, opératoire formel).

#### 3. Statut de l'Erreur :
*   L'erreur est un **outil d'apprentissage incontournable**. Elle est positive car elle révèle l'état des représentations internes de l'élève et sert de point de départ pour créer un conflit cognitif propice à la restructuration du savoir.

#### 4. Rôles :
*   **Apprenant** : Acteur central, actif, qui expérimente et restructure ses représentations.
*   **Enseignant** : Facilitateur, guide, qui conçoit des **situations-problèmes** pour bousculer les acquis des élèves.

#### 5. Exemple Pratique :
*   Poser une question provocante en classe de physique (ex. "Qu'est-ce qui tombe le plus vite : une plume ou une boule de plomb dans le vide ?") pour créer un conflit cognitif et forcer les élèves à expérimenter.

---

### C. Le Socio-constructivisme (السوسيو-بنائية)
Le socio-constructivisme prolonge le constructivisme en affirmant que l'apprentissage est intrinsèquement un processus social. Le savoir se construit dans l'interaction avec autrui (pairs, enseignants, société) et par la médiation du langage.

![Schéma Socio-constructivisme](/images/socio_constructivism.png)

#### 1. Mécanismes Clés :
*   **Conflit Socio-cognitif** : Conflit provoqué par la confrontation d'idées ou de points de vue divergents entre plusieurs élèves sur une même tâche, poussant à une résolution collective.
*   **Zone Proximale de Développement (ZPD)** : L'espace situé entre ce que l'élève peut réaliser de façon autonome (niveau actuel) et ce qu'il peut réaliser sous la direction d'un adulte ou en collaboration avec ses pairs plus avancés (niveau potentiel).
*   **Étayage (Scaffolding / Accompagnement)** : Ensemble d'aides et de guidages temporaires mis en place par l'enseignant ou un tiers pour soutenir l'élève dans sa ZPD jusqu'à ce qu'il devienne autonome.

#### 2. Profil des Auteurs :
*   **Lev Vygotsky** : Psychologue biélorusse, père de la théorie historico-culturelle et de la ZPD. Il place le langage comme l'instrument cognitif majeur.
*   **Jerome Bruner** : Psychologue américain qui formalise le concept d'**étayage** (enrôlement, réduction des degrés de liberté, maintien de l'orientation, signalisation des caractéristiques déterminantes, contrôle de la frustration, démonstration).

#### 3. Statut de l'Erreur :
*   L'erreur est un point d'appui collectif, une opportunité d'interaction, de confrontation des représentations et de négociation de sens entre apprenants.

#### 4. Rôles :
*   **Apprenant** : Co-constructeur du savoir à travers le travail collaboratif et l'interaction sociale.
*   **Enseignant** : Médiateur, tuteur, facilitateur d'interactions, qui fournit les échafaudages d'étayage.

#### 5. Exemple Pratique :
*   Faire travailler les élèves en petits groupes hétérogènes sur un projet informatique complexe, où les plus avancés soutiennent (étayent) ceux en difficulté pour franchir leur ZPD.

---

### D. Le Cognitivisme (المعرفية)
Apparu en réaction au béhaviorisme, le cognitivisme s'intéresse à ce qui se passe à l'intérieur de la **"boîte noire"** (l'esprit humain). Il compare l'esprit humain à un ordinateur : un système de traitement de l'information qui perçoit, encode, stocke et récupère les données.

![Schéma Cognitivisme](/images/cognitivism.png)

#### 1. Mécanismes Clés :
*   **Traitement de l'information** : Analyse des processus mentaux comme l'attention, la perception, la sélection et l'encodage.
*   **Structure de la Mémoire** :
    1.  *Mémoire sensorielle* (très courte durée).
    2.  *Mémoire à court terme / Mémoire de travail* (capacité limitée à 7 +/- 2 éléments).
    3.  *Mémoire à long terme* (stockage permanent des connaissances sous forme de schémas ou réseaux sémantiques).
*   **Métacognition** : La capacité d'un apprenant à analyser et réguler ses propres stratégies de pensée et d'apprentissage ("apprendre à apprendre").

#### 2. Profil des Auteurs :
*   **David Ausubel** : Théoricien de l'**apprentissage significatif** (concept d'organisateurs préalables pour lier le nouveau savoir aux anciennes structures).
*   **Robert Gagné** : Modélisateur du traitement de l'information et des 9 étapes de l'instruction.

#### 3. Statut de l'Erreur :
*   L'erreur révèle un dysfonctionnement ou une surcharge cognitive (mémoire de travail saturée) dans le processus de traitement, de stockage ou de récupération des données. Elle permet d'adapter les stratégies d'encodage.

#### 4. Rôles :
*   **Apprenant** : Processeur actif d'informations, qui structure, organise et catégorise ses connaissances en mémoire.
*   **Enseignant** : Ingénieur pédagogique, qui structure le contenu de manière claire, évite la surcharge cognitive et enseigne des méthodes de mémorisation et de métacognition.

#### 5. Exemple Pratique :
*   Présenter une leçon d'algorithmique sous forme de carte mentale (Mind Map) ou d'organigramme pour aider la mémoire de travail des élèves à encoder plus facilement l'information dans la mémoire à long terme.

---

## 3. Tableaux Comparatifs des Modèles

| Critère / Dimension | Béhaviorisme (السلوكية) | Constructivisme (البنائية) | Socio-constructivisme (السوسيو-بنائية) | Cognitivisme (المعرفية) |
| :--- | :--- | :--- | :--- | :--- |
| **Concept d'apprentissage** | Changement de comportement externe. | Construction active de schémas mentaux. | Co-construction sociale du savoir. | Traitement et stockage interne de l'info. |
| **Auteurs phares** | Skinner, Pavlov, Watson | Jean Piaget | Lev Vygotsky, Jerome Bruner | Ausubel, Robert Gagné |
| **Rôle de l'erreur** | Faiblesse ou échec à supprimer. | Indispensable, moteur du conflit cognitif. | Outil d'interaction et d'analyse collective. | Indique une surcharge ou défaut d'encodage. |
| **Rôle de l'enseignant** | Transmetteur, instructeur direct. | Guide, facilitateur, poseur de problèmes. | Médiateur, tuteur, tuteur d'étayage. | Ingénieur pédagogique, conseiller. |
| **Rôle de l'apprenant** | Récepteur passif (boîte noire). | Acteur autonome et dynamique. | Co-concepteur social actif. | Traiteur de données actif. |
| **Mots-clés de l'examen** | Stimulus, Renforcement, Récompense, Pavlov. | Assimilation, Conflit cognitif, Piaget. | ZPD, Étayage, Interaction, Vygotsky. | Mémoire, Métacognition, Encodage. |

---

## 4. Analyse des Questions & Pièges (Exemples résolus)

Voici une sélection de questions réelles pour s'entraîner à repérer les indices clés :

**💡 Question d'examen 1 (CRMEF 2023) :**
> "Le concept de Zone Proximale de Développement (ZPD) fait référence à..."
> *   A) La distance entre les aptitudes physiques et intellectuelles de l'élève.
> *   B) Le niveau actuel de l'élève sans aide extérieure.
> *   C) L'écart entre ce que l'élève fait seul et ce qu'il fait avec assistance.
> *   D) Les stades d'âge de Piaget.
> 
> **Correction** : La bonne réponse est **C**. 
> *   **Pourquoi ?** Le mot-clé ZPD pointe directement vers Lev Vygotsky et sa définition d'écart entre autonomie (développement actuel) et collaboration (développement potentiel).
> *   **Le piège** : La réponse D essaie de mélanger la théorie de Vygotsky (ZPD) avec les stades de Piaget. Restez concentrés sur les paires Auteurs/Concepts.

**💡 Question d'examen 2 (CRMEF 2024) :**
> "Le processus d'assimilation et d'accommodation est l'élément central du..."
> *   A) Béhaviorisme
> *   B) Constructivisme
> *   C) Cognitivisme
> *   D) Enseignement programmé de Skinner
> 
> **Correction** : La bonne réponse est **B**. 
> *   **Pourquoi ?** L'assimilation et l'accommodation sont les deux mécanismes de l'adaptation définis par Jean Piaget, le père du constructivisme.

---

## 5. Fiche Synthèse : Réussir l'épreuve des QCMs

Pour répondre correctement aux questions de ce module sans hésiter, utilisez cette grille de décodage des termes :

*   **Si la question parle de :** *Stimulus, Réponse, Renforcement, Comportement observable, Conditionnement, Récompenses, Punitions, EAO, Boîte noire*
    $\rightarrow$ **La réponse est : Béhaviorisme (Skinner, Pavlov, Watson).**
*   **Si la question parle de :** *Assimilation, Accommodation, Conflit cognitif, Représentations, Stades du développement, Équilibration, Piaget, Action de l'élève*
    $\rightarrow$ **La réponse est : Constructivisme (Jean Piaget).**
*   **Si la question parle de :** *ZPD (Zone Proximale de Développement), Étayage, Négociation de sens, Conflit socio-cognitif, Interaction sociale, Langage comme médiateur, Vygotsky, Bruner*
    $\rightarrow$ **La réponse est : Socio-constructivisme (Vygotsky, Bruner).**
*   **Si la question parle de :** *Traitement de l'information, Mémoire de travail (MDT), Mémoire à long terme (MLT), Métacognition, Stratégies cognitives, Apprendre à apprendre, Organisateur préalable, Ausubel*
    $\rightarrow$ **La réponse est : Cognitivisme (Ausubel, Gagné).**

## 6. Glossaire Bilingue Essentiel

*   **Béhaviorisme (سلوكية)** : Psychologie scientifique limitant l'apprentissage à l'association stimulus-réponse.
*   **Constructivisme (بنائية)** : Approche piagétienne basée sur l'action directe de l'apprenant pour bâtir sa pensée.
*   **Socio-constructivisme (سوسيو-بنائية)** : Approche vygotskienne insistant sur la dimension inter-personnelle et collaborative de l'apprentissage.
*   **Cognitivisme (معرفية)** : Courant étudiant le traitement logique de l'information cérébrale.
*   **Conflit cognitif (صراع معرفي)** : Choc interne entre acquis et nouvelle réalité.
*   **Conflit socio-cognitif (صراع سوسيو-معرفي)** : Confrontation sociale de représentations contraires forçant le consensus rationnel.
*   **ZPD (منطقة النمو القريبة)** : Zone d'apprentissage nécessitant un appui pédagogique.
*   **Étayage (سقالة / étayage)** : Tutos et postures mis en place par le maître pour aider à réussir dans la ZPD.
"""

# Course 36 Content - ARABIC
CONTENT_AR = """# نظريات التعلم : السلوكية، البنائية، السوسيو-بنائية، المعرفية

## 1. الإطار المرجعي والأهداف

يهدف هذا المحور إلى تمكين المترشح من التحكم في الأسس السيكولوجية والتربوية للتعلم. عند نهاية هذا الدرس، يجب أن تكون قادراً على:
*   **التعريف الدقيق والتمييز** بين نظريات التعلم الأربع الكبرى.
*   **تحديد المنظرين الرئيسيين** المرتبطين بكل تيار.
*   **فهم الأدوار المنوطة** بالمتعلم، والمدرس، بالإضافة إلى تمثل مكانة الخطأ في كل نموذج.
*   **كشف الكلمات المفتاحية** المستخدمة في أسئلة الامتحانات (CRMEF) لتحديد الإجابة الصحيحة بشكل فوري.

---

## 2. المفاهيم الأساسية والتعريفات المفصلة لكل نظرية

### أ. النظرية السلوكية (Béhaviorisme)
تُعرّف السلوكية التعلم بأنه تعديل مستمر وشبه دائم في السلوك القابل للملاحظة والقياس، ناتج عن الاستجابة لمثيرات خارجية. يُعتبر العقل البشري في هذا التيار بمثابة **"صندوق أسود"** (أي أن العمليات الداخلية غير قابلة للملاحظة وبالتالي يتم تجاهلها).

![شرح السلوكية](/images/behaviorism.png)

#### 1. الآليات الأساسية :
*   **مثير $\rightarrow$ استجابة (S-R)** : يحدث التعلم من خلال ربط المثير الخارجي بالاستجابة السلوكية للمتعلم.
*   **الإشراط الكلاسيكي (Pavlov)** : ربط مثير محايد باستجابة طبيعية (مثال: جرس $\rightarrow$ طعام $\rightarrow$ سيلان اللعاب).
*   **الإشراط الإجرائي (Skinner)** : تعزيز السلوك عن طريق المكافآت (تعزيز إيجابي) أو تفادي العقاب (تعزيز سلبي).

#### 2. أبرز المنظرين :
*   **إيفان بافلوف (Ivan Pavlov)** : مكتشف الإشراط الاستجابي (المنعكس الشرطي).
*   **جون واطسون (John Watson)** : المؤسس الفعلي للتيار السلوكي في علم النفس.
*   **ب. ف. سكينر (B.F. Skinner)** : واضع أسس الإشراط الإجرائي، ومخترع **التعليم المبرمج بواسطة الحاسوب** والتدريس بالأهداف.

#### 3. نظرة السلوكية إلى الخطأ :
*   يُعتبر الخطأ بمثابة **سلوك سلبي وفشل** يجب تجنبه وقمع حدوثه وتصحيحه فوراً حتى لا يترسخ في ذهن المتعلم كعادة سلوكية خاطئة.

#### 4. الأدوار :
*   **المتعلم** : متلقٍ سلبي يستجيب للمثيرات الخارجية (صندوق أسود).
*   **المدرس** : ملقن، ومصمم للمثيرات والتعزيزات (الجوائز/العقوبات).

#### 5. مثال عملي :
*   استخدام تمارين التكرار والحفظ الآلي (Drill) حيث يتلقى المتعلم نقطة إضافية أو ثناء فورياً عند كل إجابة صحيحة.

---

### ب. النظرية البنائية (Constructivisme)
تؤكد النظرية البنائية أن التعلم هو سيرورة نشطة لبناء المعنى. لا يتلقى المتعلم المعلومات بشكل سلبي، بل يبني معرفته بنفسه من خلال التفاعل المباشر مع محيطه وموضوع التعلم.

![شرح البنائية](/images/constructivism.png)

#### 1. الآليات الأساسية :
*   **الاستيعاب (Assimilation)** : إدماج المعطيات أو التجارب الجديدة في البنيات المعرفية الحالية للمتعلم (الخطاطات الذهنية) دون تغيير هذه البنيات.
*   **الصراع المعرفي (Conflit Cognitif)** : حالة من عدم التوازن تحدث نتيجة وجود تعارض بين معارف المتعلم السابقة والواقع الجديد الذي يواجهه. وهو المحرك الأساسي للتعلم.
*   **التلاؤم (Accommodation)** : تعديل وتغيير الخطاطات الذهنية الحالية لتتوافق مع الوضعية الجديدة التي سببت عدم التوازن.
*   **التوازن (Equilibration)** : عملية ضبط ذاتي تمكن المتعلم من تجاوز الصراع المعرفي والوصول إلى مستوى معرفي أعلى وأكثر تطوراً.

#### 2. أبرز المنظرين :
*   **جان بياجي (Jean Piaget)** : عالم نفس سويسري ورائد علم النفس التطوري. وصف أيضاً مراحل النمو المعرفي لدى الطفل (المرحلة الحس حركية، ما قبل العمليات، العمليات المادية، والعمليات المجردة).

#### 3. نظرة البنائية إلى الخطأ :
*   يُعتبر الخطأ **أداة أساسية وشرطاً ضرورياً للتعلم**. الخطأ إيجابي لأنه يكشف عن طبيعة تمثلات المتعلم الداخلية ويعتبر نقطة انطلاق لخلق صراع معرفي يؤدي إلى إعادة بناء المعرفة.

#### 4. الأدوار :
*   **المتعلم** : الفاعل الأساسي والنشط الذي يجرب، يحلل ويعيد بناء تمثلاته.
*   **المدرس** : موجه وميسر، وظيفته إعداد **وضعيات-مشكلة** تحفز الصراع المعرفي لدى المتعلمين.

#### 5. مثال عملي :
*   طرح سؤال محير في الفصل (مثال: "أيهما يسقط أسرع في الفراغ: ريشة أم كرة من الرصاص؟") لخلخلة معارف المتعلمين السابقة ودفعهم للبحث والتجريب.

---

### ج. النظرية السوسيو-بنائية (Socio-constructivisme)
تعتبر السوسيو-بنائية امتداداً للبنائية، حيث تؤكد أن التعلم لا يتم بشكل فردي معزول، بل هو عملية اجتماعية بالأساس. يتم بناء المعرفة عبر التفاعل والتفاوض مع الآخرين (الأقران، المدرس، المجتمع) ومن خلال وساطة اللغة.

![شرح السوسيو بنائية](/images/socio_constructivism.png)

#### 1. الآليات الأساسية :
*   **الصراع السوسيو-معرفي (Conflit Socio-cognitif)** : صراع وتعارض يحدث نتيجة مواجهة وجهات نظر مختلفة ومتباينة بين المتعلمين أثناء إنجاز مهمة مشتركة، مما يدفعهم للتفاوض للوصول إلى حل جماعي.
*   **منطقة النمو القريبة (ZPD)** : الفضاء الفاصل بين ما يستطيع المتعلم إنجازه بمفرده وبشكل مستقل (مستوى التطور الفعلي)، وما يستطيع إنجازه بمساعدة وتوجيه من طرف شخص أكثر خبرة (مستوى التطور المحتمل).
*   **ال étayage (الدعم والوساطة)** : مجموع التدخلات المساعدة والمؤقتة التي يقدمها المدرس أو الأقران لمساندة المتعلم داخل منطقة النمو القريبة حتى يصل إلى مرحلة الاستقلالية.

#### 2. أبرز المنظرين :
*   **ليف فيغوتسكي (Lev Vygotsky)** : عالم نفس روسي، ومؤسس النظرية التاريخية الثقافية ومفهوم ZPD. يعتبر اللغة الأداة المعرفية الأولى.
*   **جيروم برونر (Jerome Bruner)** : صاغ مفهوم **ال étayage** (الانخراط، تبسيط المهمة، الحفاظ على الهدف، إبراز الملامح الأساسية، التحكم في الإحباط).

#### 3. نظرة السوسيو-بنائية إلى الخطأ :
*   الخطأ فرصة للتفاعل والمواجهة بين تمثلات المتعلمين، وسياق للتفاوض حول المعنى ومراجعة الأفكار بشكل جماعي.

#### 4. الأدوار :
*   **المتعلم** : مشارك نشط يبني المعرفة بالتعاون والتفاعل مع جماعة الفصل.
*   **المدرس** : وسيط، ومنظم للتفاعلات الاجتماعية، ومقدم للدعم والوساطة التربوية.

#### 5. مثال عملي :
*   تقسيم الفصل إلى مجموعات عمل لإنجاز مشروع برمجي، حيث يتعاون المتعلمون ويتناقشون، ويقوم المتفوقون بمساعدة زملائهم المتعثرين لتجاوز الصعوبات المعرفية.

---

### د. النظرية المعرفية (Cognitivisme)
ظهرت المعرفية كرد فعل على السلوكية، حيث ركزت اهتمامها على دراسة ما يجري داخل **"الصندوق الأسود"** (العقل البشري). تشبّه المعرفية العقل البشري بجهاز الحاسوب كمنظومة لمعالجة المعلومات (استقبال، ترميز، تخزين، واسترجاع).

![شرح المعرفية](/images/cognitivism.png)

#### 1. الآليات الأساسية :
*   **معالجة المعلومات** : دراسة العمليات الذهنية مثل الانتباه، الإدراك، الانتقاء، والترميز.
*   **بنية الذاكرة** :
    1.  *الذاكرة الحسية* (فترة زمنية قصيرة جداً).
    2.  *الذاكرة قصيرة المدى / الذاكرة العاملة* (ذات سعة محدودة لتخزين 7 عناصر تقريباً).
    3.  *الذاكرة طويلة المدى* (تخزين دائم ومستمر للمعلومات على شكل خطاطات وشبكات دلالية).
*   **ميتا-معرفة (Métacognition)** : وعي المتعلم بسيرورات تفكيره وقدرته على تنظيم ومراقبة استراتيجيات تعلمه الذاتية ("تعلم كيف تتعلم").

#### 2. أبرز المنظرين :
*   **ديفيد أوزوبيل (David Ausubel)** : صاحب نظرية **التعلم ذي المعنى** ومفهوم المنظمات التمهيدية لربط المعرفة الجديدة بالبنية المعرفية السابقة.
*   **روبرت غانييه (Robert Gagné)** : واضع مراحل معالجة المعلومات وخطوات التدريس التسع.

#### 3. نظرة المعرفية إلى الخطأ :
*   الخطأ مؤشر على وجود خلل أو عبء معرفي زائد (سعة الذاكرة العاملة ممتلئة) في معالجة البيانات أو تخزينها أو استرجاعها، ويستدعي تعديل استراتيجيات الترميز.

#### 4. الأدوار :
*   **المتعلم** : معالج نشط للمعلومات يقوم بتنظيم وتصنيف معارفه داخل الذاكرة.
*   **المدرس** : مهندس بيداغوجي، يرتب المادة الدراسية لتفادي التعب الذهني للمتعلم، ويدرب على مهارات التذكر والميتا-معرفة.

#### 5. مثال عملي :
*   تقديم خريطة ذهنية (Mind Map) أو خطاطة شجرية قبل بداية الدرس لمساعدة المتعلمين على تنظيم الأفكار وربطها في ذاكرتهم طويلة المدى.

---

## 3. جداول مقارنة بين النظريات

| معيار المقارنة | السلوكية (Béhaviorisme) | البنائية (Constructivisme) | السوسيو-بنائية (Socio-constructivisme) | المعرفية (Cognitivisme) |
| :--- | :--- | :--- | :--- | :--- |
| **مفهوم التعلم** | تغيير في السلوك الخارجي. | بناء نشط للخطاطات الذهنية. | بناء اجتماعي وتفاعلي للمعرفة. | معالجة وتخزين داخلي للمعلومات. |
| **أبرز المنظرين** | Skinner, Pavlov, Watson | Jean Piaget | Lev Vygotsky, Jerome Bruner | Ausubel, Robert Gagné |
| **موقع الخطأ** | فشل وسلوك سلبي يجب تجنبه. | إيجابي ومحرك للصراع المعرفي. | أداة تفاعلية للمواجهة والمناقشة. | دليل على خلل في معالجة المعلومات. |
| **دور المدرس** | ملقن ومصدر المثيرات والجوائز. | موجه ومعد للوضعيات المشكلة. | وسيط ومقدم للدعم والوساطة (ال سكايب). | مهندس معرفي ومسهل لترميز المعلومات. |
| **دور المتعلم** | متلق سلبي (مستجيب للمثير). | فاعل نشط ومستقل في التجريب. | مشارك نشط ومساهم في العمل الجماعي. | معالج نشط ومنظم للمعلومات بالذاكرة. |
| **الكلمات الدالة في الامتحان** | مثير، استجابة، تعزيز، عقاب، بافلوف. | استيعاب، تلاؤم، صراع معرفي، تمثلات، بياجي. | ZPD، وساطة، étayage، تفاعل، فيغوتسكي. | ذاكرة، ميتا-معرفة، معالجة، أوزوبيل. |

---

## 4. تحليل أسئلة الامتحان وفخاخ لجنة التحكيم

فيما يلي تحليل لبعض الأسئلة الحقيقية من المباريات السابقة لمساعدتك على فك الرموز :

**💡 السؤال الأول (امتحان 2023) :**
> "تشير منطقة النمو القريبة (ZPD) إلى..."
> *   أ) الفارق البدني والعقلي لدى المتعلم.
> *   ب) مستوى التطور الحالي للمتعلم دون أي مساعدة.
> *   ج) الفارق بين ما ينجزه المتعلم بمفرده وما يستطيع إنجازه بمساعدة الآخرين.
> *   د) مراحل النمو المعرفي الأربعة عند بياجي.
> 
> **التحليل** : الجواب الصحيح هو **ج**. 
> *   **لماذا؟** لأن مفهوم ZPD يحيل مباشرة على Lev Vygotsky ويعرَّف بالفارق بين الأداء المستقل (النمو الحالي) والأداء بمساعدة (النمو المحتمل).
> *   **الفخ** : الخيار (د) يحاول الخلط بين فيغوتسكي وبياجي. تذكر دائماً ربط المفاهيم بأصحابها.

**💡 السؤال الثاني (امتحان 2024) :**
> "عمليتا الاستيعاب والتلاؤم هما الآليتان المركزيتان في..."
> *   أ) النظرية السلوكية
> *   ب) النظرية البنائية
> *   ج) النظرية المعرفية
> *   د) التعليم المبرمج عند سكينر
> 
> **التحليل** : الجواب الصحيح هو **ب**. 
> *   **لماذا؟** لأن الاستيعاب (Assimilation) والتلاؤم (Accommodation) هما آليتا التكيف المعرفي حسب جان بياجي رائد النظرية البنائية.

---

## 5. مفتاح الذهب لإجابة QCMs الامتحانات

استعمل هذه Grille de décodage السريعة لتحديد النظرية بمجرد قراءة السؤال :

*   **إذا وجد في السؤال :** *مثير، استجابة، تعزيز، عقاب، سلوك ملاحظ، مكافأة، إشراط إجرائي، سكينر، بافلوف*
    $\rightarrow$ **الجواب هو : النظرية السلوكية (Béhaviorisme).**
*   **إذا وجد في السؤال :** *استيعاب، تلاؤم، صراع معرفي، تمثلات، توازن، بياجي، فعل المتعلم، تكيّف*
    $\rightarrow$ **الجواب هو : النظرية البنائية (Constructivisme).**
*   **إذا وجد في السؤال :** *ZPD (منطقة النمو القريبة)، étayage (الدعم)، تفاوض معرفي، صراع سوسيو-معرفي، تفاعل اجتماعي، لغة، فيغوتسكي، برونر*
    $\rightarrow$ **الجواب هو : النظرية السوسيو-بنائية (Socio-constructivisme).**
*   **إذا وجد في السؤال :** *معالجة المعلومات، ذاكرة عاملة، ذاكرة طويلة المدى، انتباه، ترميز، ميتا-معرفة (ما وراء المعرفة)، تعلم ذي معنى، أوزوبيل*
    $\rightarrow$ **الجواب هو : النظرية المعرفية (Cognitivisme).**

## 6. مصطلحات أساسية ثنائية اللغة

*   **سلوكية (Béhaviorisme)** : علم النفس الذي يركز فقط على السلوكيات الخارجية كردود أفعال.
*   **بنائية (Constructivisme)** : نظرية بياجي التي تجعل الفعل المباشر للمتعلم أساس التعلم والتكيف.
*   **سوسيو-بنائية (Socio-constructivisme)** : نظرية فيغوتسكي التي تدمج البعد الاجتماعي والتفاعلي كشرط لبناء المعرفة.
*   **معرفية (Cognitivisme)** : تيار سيكولوجي يبحث في العمليات الذهنية ومعالجة البيانات في الدماغ.
*   **صراع معرفي (Conflit cognitif)** : خلل مؤقت يحدث للمتعلم عند اصطدام تمثلاته السابقة بوضعية جديدة.
*   **صراع سوسيو-معرفي (Conflit socio-cognitif)** : صراع يحدث بين متعلمين يحملون تصورات مختلفة، يؤدي لتطوير بنياتهم العقلية.
*   **ZPD (منطقة النمو القريبة)** : الفضاء التعليمي الذي ينجح فيه المتعلم بفضل الوساطة التربوية.
*   **Étayage (الدعم / السقالة)** : المساعدات البيداغوجية المؤقتة التي يقدمها المعلم للمتعلم لتمكينه من تجاوز الصعوبات.
"""

def main():
    print("🚀 Writing enriched bilingual and visual learning theories course...")
    
    # 1. Update Django database
    if os.path.exists(DB_DJANGO):
        print(f"  → Updating Django DB at {DB_DJANGO}")
        conn = sqlite3.connect(DB_DJANGO)
        c = conn.cursor()
        c.execute("""
            UPDATE syllabus_course 
            SET content_ar = ?, content_fr = ?, content = ?
            WHERE id = ?
        """, (CONTENT_AR, CONTENT_FR, CONTENT_FR, 36))
        conn.commit()
        conn.close()
        print("    ✅ Django DB updated successfully")
    else:
        print(f"  ⚠️ Django DB not found at {DB_DJANGO}")

    # 2. Update Concours database
    if os.path.exists(DB_CONCOURS):
        print(f"  → Updating Concours DB at {DB_CONCOURS}")
        conn = sqlite3.connect(DB_CONCOURS)
        c = conn.cursor()
        # Since concours.db might have content_ar/content_fr columns, let's verify if they exist
        c.execute("PRAGMA table_info(courses)")
        cols = [col[1] for col in c.fetchall()]
        if 'content_ar' in cols and 'content_fr' in cols:
            c.execute("""
                UPDATE courses 
                SET content_ar = ?, content_fr = ?, content = ?
                WHERE id = ?
            """, (CONTENT_AR, CONTENT_FR, CONTENT_FR, 36))
        else:
            c.execute("""
                UPDATE courses 
                SET content = ?
                WHERE id = ?
            """, (CONTENT_FR, 36))
        conn.commit()
        conn.close()
        print("    ✅ Concours DB updated successfully")
    else:
        print(f"  ⚠️ Concours DB not found at {DB_CONCOURS}")

    print("\n🏁 Content enrichment script complete!")

if __name__ == '__main__':
    main()
