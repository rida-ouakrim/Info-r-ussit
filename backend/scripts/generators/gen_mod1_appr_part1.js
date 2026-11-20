/**
 * Generator for Module 1.2 : علم نفس التعلم (Psychologie de l'apprentissage — 20%)
 * 10 Leçons complètes avec structure unifiée (7 sections) en Arabe pur et Français pur.
 */

const fs = require('fs');
const path = require('path');

const lessons = [
  // Leçon 01
  {
    id: 310,
    subdomain: 'EDU_APPR',
    num: '01',
    title: "01. Définition, caractéristiques et conditions de l'apprentissage",
    title_ar: "01. مفهوم التعلم وخصائصه وشروطه وعوامله",
    content_ar: `# 01. مفهوم التعلم وخصائصه وشروطه وعوامله

## 1. أهداف التعلم
* تحديد المفهوم البيداغوجي والبسيكولوجي الدقيق للتعلّم وتمييزه عن التغيرات العارضة (التعب، النضج البيولوجي الصرف).
* استيعاب الخصائص الجوهرية لعملية التعلّم (الديمومة النسبية، القابلية للتعديل، الوظائفية).
* تعرّف الشروط الذاتية والموضوعية المتحكمة في نجاح الفعل التعليمي-التعلّمي.

---

## 2. الشرح المفصل المنظم
يُعرَّف **التعلّم (Apprentissage)** بأنه تغير شبه دائم ونسبي في البنية المعرفية أو السلوكية أو الوجدانية للفرد، ينشأ نتيجة الممارسة، والتجربة، والتفاعل النشط مع المحيط الخارجي.

### 1. الخصائص البنيوية للتعلم:
* **التغير النسبي المستمر:** لا يُعد التغير العابر الناتج عن التعب أو التخدير أو الانفعال اللحظي تعلماً؛ إذ يشترط في التعلّم الاستقرار والثبات النسبي عبر الزمن.
* **الارتباط بالممارسة والتجربة:** التعلّم مكتسب وليس فطرياً؛ فهو يتولد من خلال الاحتكاك بالمواقف والمشكلات والأنشطة المنظمة.
* **إعادة تنظيم البنية المعرفية:** التعلّم الحقيقي ليس مجرد مراكمة آلية للمعلومات، بل هو إعادة هيكلة وتعديل للتمثلات السابقة واستيعاب معارف جديدة.

### 2. شروط التعلم وعوامله الأساسية:
تنقسم شروط التعلّم الفعال إلى شروط داخلية (ذاتية) وشروط خارجية (بيداغوجية بيئية):

#### أ. الشروط الداخلية (الذاتية):
1. **النضج (Maturation):** اكتمال النمو البيولوجي والفيزيولوجي والعصبي الذي يؤهل المتعلم لاكتساب المعرفة (مثل نضج التفكير المجرد كشرط لتعلم البرهنة الهندسية).
2. **الدافعية (Motivation):** الطاقة والمحرك الداخلي الموجه نحو تحقيق هدف تعليمي محدد؛ وبدون رغبة واهتمام ينحسر الانتباه ويصعب التثبيت.
3. **الاستعداد (Aptitude / Prédisposition):** مدى جاهزية المتعلم النفسية والمعرفية لتمثل موضوع التعلم الجديد.

#### ب. الشروط الخارجية (الموضوعية والديداكتيكية):
1. **الممارسة والتكرار الهادف (Pratique guidée):** التدريب المنظم والمتدرج الذي يسمح بترسيخ المهارات ومنع النسيان.
2. **الوضعية المشكلة والتدرج البيداغوجي:** ملاءمة المهام المقترحة لمستوى المتعلم مع وضعها في سياق ذي دلالة ومعنى.
3. **التغذية الراجعة والتعزيز (Rétroaction):** إعلام المتعلم بمواطن القوة والتعثر لتصحيح المسار فورياً.

---

## 3. المفاهيم الأساسية والمصطلحات

| المصطلح بالعربية | Terme en Français | التعريف البيداغوجي الدقيق |
| :--- | :--- | :--- |
| **التعلّم** | Apprentissage | تغير شبه دائم في السلوك أو البنية الذهنية ناتج عن الممارسة والخبرة. |
| **النضج** | Maturation | نمو فيزيولوجي وعصبي مبرمج بيولوجياً يشكل شرطاً لازماً للتعلّم. |
| **الدافعية** | Motivation | حالة استثارة داخلية توجه سلوك المتعلم وتحافظ على استمراريته نحو الهدف. |
| **التغذية الراجعة** | Rétroaction / Feedback | معلومات يتلقاها المتعلم حول أدائه لتقويم ذاته وتعديل مسار اكتسابه. |

---

## 4. ملخص الدرس المركز
* التعلّم = تفاعل إيجابي نشط بين النضج البيولوجي، الدافعية الداخلية، والممارسة الهادفة في بيئة تعليمية محفزة.
* كل سلوك زائل بزوال المؤثر اللحظي (كالخوف أو الإرهاق) لا يصنف علمياً ضمن التعلّم.
* دور المدرس هو توفير الشروط الموضوعية (الوضعيات الديداكتيكية المحفزة) لاستثارة الشروط الذاتية (الدافعية والانتباه).

---

## 5. مقارنة وتمايزات دقيقة
* **التعلّم مقابل النضج:** النضج بيولوجي وتلقائي، في حين أن التعلّم بيئي ومكتسب؛ النضج يفتح الإمكانية والتعلّم يحقق الفعل.
* **التعلّم مقابل الأداء (Performance):** التعلّم صيرورة داخلية كامنة لا يمكن ملاحظتها مباشرة، أما الأداء فهو الإنجاز الخارجي الملموس والمقاس.

---

## 6. اختبار تدريبي تفاعلي QCM
**سؤال:** أي من التغيرات التالية يُعتبر تعلماً وفق علم النفس المعرفي؟
* A) إغلاق العينين بشكل فجائي وسريع عند التعرض لضوء قوي ومفاجئ.
* B) عجز المتعلم عن الجري السريع في نهاية حصة الرياضة البدنية بسبب الإعياء.
* C) قدرة التلميذ على كتابة خوارزمية فرز بعد سلسلة من التمارين وحل الوضعيات التطبيقية.
* D) التلعثم العابر في النطق الناتج عن القلق أثناء تقديم عرض شفهي مفاجئ.
* E) جميع الاختيارات السابقة لا تمثل تعلماً.

> **الإجابة الصحيحة:** **C**
> **الشرح:** الخيار A منعكس فطري لا إرادي، والخياران B و D ناتجان عن التعب والانفعال المؤقت. فقط الخيار C يمثل اكتساباً مهارياً مستقراً ناشئاً عن الممارسة والتدريب الواعي.

---

## 7. نصائح وأفخاخ المباراة (Astuces Concours)
* ⚠️ **فخ كلاسيكي:** الخلط بين الأداء والتعلّم؛ ضعف أداء التلميذ في اختبار كتابي لا يعني بالضرورة غياب التعلّم، فقد يرجع لعوامل خارجية كالضغط النفسي أو صياغة الأسئلة.
* 💡 **كلمة مفتاحية:** التعلّم الفعال = **نضج مسبق + دافعية مشتعلة + ممارسة هادفة + وضعية دالة**.`,

    content_fr: `# 01. Définition, caractéristiques et conditions de l'apprentissage

## 1. Objectifs pédagogiques
* Définir avec rigueur le concept d'apprentissage et le distinguer des modifications comportementales éphémères (fatigue, réflexes).
* Caractériser les composantes structurales de l'acte d'apprendre (durabilité relative, adaptabilité, fonctionnalité).
* Identifier et articuler les conditions intrinsèques et extrinsèques régissant l'efficacité des apprentissages scolaires.

---

## 2. Cours détaillé
L'**apprentissage (Apprentissage)** est un processus dynamique par lequel un individu acquiert, réorganise ou stabilise des connaissances, des habiletés ou des attitudes. Il se traduit par une modification relativement permanente du comportement ou des schèmes cognitifs, résultant de l'interaction active avec l'environnement.

### 1. Propriétés structurales de l'apprentissage :
* **Permanence relative :** Les variations temporaires causées par l'épuisement, l'émotivité passagère ou des facteurs physiologiques transitoires ne constituent pas un apprentissage.
* **Dépendance à la pratique et à l'exercice :** L'apprentissage n'est pas inné ; il émerge de la confrontation active à des tâches, des problèmes et des démarches guidées.
* **Réorganisation cognitive :** Apprendre ne se réduit pas à une simple accumulation de données mémorisées ; c'est une restructuration active des représentations antérieures.

### 2. Conditions indispensables à l'apprentissage :
On distingue les facteurs internes (liés à l'apprenant) des facteurs externes (didactiques et environnementaux) :

#### A. Conditions intrinsèques (Internes) :
1. **La maturation (Maturation) :** Degré de développement neurobiologique requis pour traiter l'objet d'apprentissage (exemple : abstraction formelle requise pour la démonstration logique).
2. **La motivation (Motivation) :** Force psychologique motrice qui oriente l'attention et soutient l'effort d'appropriation du savoir.
3. **Les prérequis et la disposition (Prérequis cognitifs) :** Disponibilité des schèmes antérieurs nécessaires pour greffer et assimiler la nouvelle connaissance.

#### B. Conditions extrinsèques (Pédagogiques et didactiques) :
1. **La pratique guidée et répétée :** L'entraînement contextualisé qui consolide l'empreinte mnésique et favorise le transfert.
2. **La pertinence de la situation d'apprentissage :** Proposer des situations d'apprentissage signifiantes adaptées à la zone de développement de l'élève.
3. **Le feedback régulateur (Rétroaction) :** Les retours d'information immédiats qui permettent à l'élève d'ajuster ses stratégies et de corriger ses erreurs.

---

## 3. Concepts clés et terminologie

| Terme en Français | Terme en Arabe | Définition didactique précise |
| :--- | :--- | :--- |
| **Apprentissage** | التعلّم | Modification durable du comportement ou des structures mentales issue de l'expérience. |
| **Maturation** | النضج | Évolution biologique naturelle indispensable constituant le socle des apprentissages. |
| **Motivation** | الدافعية | État psychique interne mobilisant l'énergie de l'apprenant vers l'atteinte d'un objectif. |
| **Rétroaction / Feedback** | التغذية الراجعة | Information délivrée à l'apprenant sur son travail pour réguler ses démarches. |

---

## 4. Synthèse et points clés
* Apprentissage = maturation biologique + motivation intrinsèque + pratique médiatisée dans un milieu porteur de sens.
* Une performance ponctuelle ne reflète pas toujours la réalité des acquis profonds d'un apprenant.
* La tâche de l'enseignant est d'aménager des dispositifs didactiques stimulants pour déclencher la volonté d'apprendre.

---

## 5. Tableau comparatif et nuances
* **Apprentissage vs Maturation :** La maturation est programmée et spontanée ; l'apprentissage est contextuel et acquis.
* **Apprentissage vs Performance :** L'apprentissage est une dynamique cognitive interne ; la performance est sa manifestation visible et mesurable.

---

## 6. QCM d'entraînement
**Question :** Laquelle des situations suivantes relève d'un véritable apprentissage ?
* A) Le retrait automatique de la main d'un enfant au contact d'une surface brûlante.
* B) L'incapacité temporaire à mémoriser une leçon sous l'effet d'une grande fatigue physique.
* C) La capacité d'un élève à résoudre une équation mathématique après un entraînement méthodique.
* D) La modification de l'élocution chez un adolescent sous l'influence du trac en public.
* E) Toutes les options ci-dessus décrivent des apprentissages.

> **Bonne réponse :** **C**
> **Explication :** A est un arc réflexe inné, B et D sont des états physiologiques ou émotionnels transitoires. Seule C traduit une compétence stable acquise par la pratique.

---

## 7. Astuces Concours & Pièges classiques
* ⚠️ **Piège classique :** Confondre performance et apprentissage. L'échec à un examen peut provenir du stress et non d'une absence d'apprentissage.
* 💡 **Formule clé :** L'apprentissage authentique exige l'alliance de la **maturation**, de la **motivation**, de l'**exercice** et du **feedback**.`,

    examples_ar: `### تطبيق صفي لمفهوم شروط التعلم:
في درس البرمجة، يقدم المدرس وضعية لبرمجة روبوت افتراضي. 
* **الشرط الذاتي:** يمتلك التلاميذ دافعية قوية بسبب الطابع التفاعلي للنشاط، ونضجاً منطقياً كافياً للتعامل مع الشروط المنطقية.
* **الشرط الموضوعي:** يوفر الأستاذ بيئة عمل مهيأة وتغذية راجعة فورية عند حدوث أخطاء برمجية، مما يحول المحاولة والخطأ إلى بناء تعلم مستقر.`,
    examples_fr: `### Cas pratique en classe :
Lors d'une séance d'informatique sur les boucles logiques, l'enseignant propose de programmer un robot virtuel.
* **Condition interne :** Les élèves sont motivés par le caractère ludique et disposent de la maturité cognitive requise pour la pensée séquentielle.
* **Condition externe :** L'environnement fournit des rétroactions visuelles directes qui permettent à l'élève d'auto-corriger son code immédiatement.`,
    astuces_ar: `💡 التعلم عملية داخلية، والأداء مظهر خارجي.
💡 لا تعلم حقيقي بدون دافعية وانتباه ونضج مسبق.
💡 التغذية الراجعة الفورية تمنع ترسيخ التمثلات الخاطئة.`,
    astuces_fr: `💡 L'apprentissage est un processus mental interne ; la performance en est la trace mesurable.
💡 Pas d'apprentissage effectif sans motivation, attention soutenue et prérequis stabilisés.
💡 Le feedback immédiat prévient l'ancrage d'erreurs persistantes.`
  },

  // Leçon 02
  {
    id: 311,
    subdomain: 'EDU_APPR',
    num: '02',
    title: "02. Théorie béhavioriste – Pavlov, Watson, Skinner, Thorndike",
    title_ar: "02. النظرية السلوكية والاشتراط الكلاسيكي والإجرائي",
    content_ar: `# 02. النظرية السلوكية والاشتراط الكلاسيكي والإجرائي

## 1. أهداف التعلم
* استيعاب المبادئ الإبستيمولوجية للنظرية السلوكية (Béhaviorisme) واعتبار السلوك القابل للملاحظة موضوعاً وحيداً للدراسة.
* التمييز الدقيق بين الاشتراط الكلاسيكي (Conditionnement classique) والاشتراط الإجرائي (Conditionnement opérant).
* فهم قوانين التعلم عند ثورندايك وسكينر وتطبيقاتها في التعليم المبرمج والتعزيز الصفي.

---

## 2. الشرح المفصل المنظم
ظهرت **النظرية السلوكية (Le Béhaviorisme)** في أوائل القرن العشرين على يد **جون واطسون (John Watson)** كرد فعل على منهج الاستبطان التأملي، معتبرة أن علم النفس يجب أن يقتصر على دراسة **السلوك الخارجي القابل للملاحظة والقياس التجريبي**. وتنظر السلوكية إلى الدماغ باعتباره **«علبة سوداء» (Boîte noire)** يصعب سبر أغوارها الداخلية، وتركز على ثنائية: **المثير والاستجابة (Stimulus - Réponse)**.

### 1. الاشتراط الكلاسيكي (Conditionnement classique / Pavlovien):
* رائد المفهوم: العالم الروسي **إيفان بافلوف (Ivan Pavlov)** وتجاربه الشهيرة على إفراز لعاب الكلاب.
* الآلية: ربط **مثير محايد** (صوت الجرس) بـ **مثير طبيعي/غير شرطي** (تقديم اللحم)، ليصبح المثير المحايد بعد تكرار الاقتران الزمني **مثيراً شرطياً** قادراً بمفرده على استدعاء **استجابة شرطية**.
* بيداغوجياً: يفسر الاشتراط الكلاسيكي تشكل الاتجاهات والمشاعر الانفعالية لدى المتعلمين (مثل ربط المدرسة بالخوف أو الفرح وفق طبيعة المعاملة).

### 2. التعلم بالمحاولة والخطأ (Thorndike):
صاغ **إدوارد ثورندايك (Edward Thorndike)** قوانين محورية للتعلّم بناءً على تجارب الصندوق المشكل:
* **قانون الأثر (Loi de l'effet):** السلوك الذي يتبعه أثر مرضي (مكافأة) يميل إلى التكرار والترسخ، في حين أن السلوك المتبوع بأثر غير مريح يميل إلى التلاشي والاندثار.
* **قانون التمرين والاستعمال (Loi de l'exercice):** الروابط العصبية بين المثير والاستجابة تقوى بالاستعمال المستمر وتضعف بالإهمال.

### 3. الاشتراط الإجرائي (Conditionnement opérant / Skinnerien):
* رائد الاتجاه: **بورهوس فريدريك سكينر (B. F. Skinner)**.
* المبدأ الأساسي: الكائن الحي لا ينتظر مثيراً خارجياً ليتفاعل معه فحسب، بل يصدر سلوكات إجرائية حرة، ويتحدد تكرار السلوك أو انطفاؤه بنوع **النتيجة اللاحقة** التي تعقبه.
* **التعزيز الإيجابي (Renforcement positif):** إضافة مثير مرغوب فيه (ثناء، نقطة جيدة) لزيادة احتمال تكرار السلوك الإيجابي.
* **التعزيز السلبي (Renforcement négatif):** إزالة أو سحب مثير غير مرغوب فيه (إعفاء من واجب إضافي عند الانضباط) لتثبيت السلوك الإيجابي.
* **العقاب الإيجابي (Punition positive):** تسليط مثير غير محبب (توبيخ) للحد من سلوك غير مرغوب.
* **العقاب السلبي (Punition négative):** حرمان من امتياز محبب (حرمان من الاستراحة أو نشاط محبب) لإخماد السلوك غير اللائق.
* **التعليم المبرمج (Enseignement programmé):** تجزيء المحتوى الدراسي إلى خطوات صغيرة متسلسلة خطياً، مع تعزيز فوري لاستجابات المتعلم.

---

## 3. المفاهيم الأساسية والمصطلحات

| المصطلح بالعربية | Terme en Français | التعريف البيداغوجي |
| :--- | :--- | :--- |
| **الاشتراط الكلاسيكي** | Conditionnement classique | إحداث استجابة انعكاسية عبر اقتران مثير محايد بمثير طبيعي. |
| **الاشتراط الإجرائي** | Conditionnement opérant | تعديل احتمالية حدوث السلوك بناءً على نتائجه من تعزيز أو عقاب. |
| **التعزيز الإيجابي** | Renforcement positif | تقديم حافز سار بعد السلوك يؤدي إلى تقويته وزيادة تكراره. |
| **التعزيز السلبي** | Renforcement négatif | تخليص الفرد من منبه مؤلم أو مزعج كعائد لإصداره سلوكاً مرغوباً. |
| **العلبة السوداء** | Boîte noire | المفهوم السلوكي الذي يرفض تفسير التعلم بالعمليات الذهنية غير المرئية. |

---

## 4. ملخص الدرس المركز
* السلوكية تعرّف التعلّم بأنه تغير في السلوك الخارجي ناتج عن الاقتران الشرطي (مثير - استجابة) أو تدعيم النتائج (تعزيز).
* سكينر هو مؤسس التعليم المبرمج الذي ألهم تدريس الأهداف السلوكية الإجرائية (Pédagogie par objectifs).
* التعزيز أكثر فاعلية واستدامة في تعديل السلوك الصفي مقارنة بالعقاب الزجري.

---

## 5. مقارنة وتمايزات دقيقة
* **الاشتراط الكلاسيكي مقابل الإجرائي:** في الكلاسيكي، المتعلم سلبي يستجيب للمثير الخارجي؛ في الإجرائي، المتعلم نشط يبادر بالسلوك وتتحكم النتائج اللاحقة في تثبيته.
* **التعزيز السلبي مقابل العقاب:** التعزيز السلبي يهدف إلى **زيادة** السلوك الإيجابي (بسحب المزعج)، بينما العقاب يهدف إلى **خفض** السلوك غير المرغوب أو القضاء عليه.

---

## 6. اختبار تدريبي تفاعلي QCM
**سؤال:** ما هو الإجراء البيداغوجي الذي يمثل «تعزيزاً سلبياً» (Renforcement négatif) وفق نموذج سكينر؟
* A) منح التلميذ المتفوق كتاباً هدية تقديراً لجهده.
* B) إعفاء التلميذ الذي سلم واجبه المنزلي في موعده المحدد من الحضور لحصة استدراكية مسائية.
* C) توجيه لوم وتوبيخ صفي لتلميذ تأخر عن الدرس مراراً.
* D) حرمان تلميذ مشاغب من حصة الألعاب الرياضية المحببة لديه.
* E) جميع الاختيارات السابقة تمثل عقاباً إيجابياً.

> **الإجابة الصحيحة:** **B**
> **الشرح:** التعزيز السلبي هو رفع أو إزالة عنصر غير مرغوب فيه (الحصة الاستدراكية الشاقة) كمكافأة للسلوك الإيجابي (تسليم الواجب في الوقت)، بهدف تشجيع استمرارية هذا السلوك.

---

## 7. نصائح وأفخاخ المباراة (Astuces Concours)
* ⚠️ **الفخ الأعظم في علوم التربية:** الاعتقاد بأن التعزيز السلبي يعني العقاب! تذكر دائماً: كلمة «تعزيز» تعني دوماً تقوية السلوك، و«سلبي» تعني سحب أو إزالة شيء مزعج.
* 💡 **الربط السريع للرواد:**
  * بافلوف = المثير الشرطي والانعكاس الكلاسيكي.
  * ثورندايك = قانون الأثر والمحاولة والخطأ.
  * واطسون = مؤسس السلوكية التجريبية الصارمة.
  * سكينر = الاشتراط الإجرائي والتعليم المبرمج والتعزيز.`,

    content_fr: `# 02. Théorie béhavioriste – Pavlov, Watson, Skinner, Thorndike

## 1. Objectifs pédagogiques
* Cerner les fondements épistémologiques du béhaviorisme (rejet de l'introspection, focalisation sur les comportements observables).
* Différencier rigoureusement conditionnement classique (répondant) et conditionnement opérant.
* Analyser les lois de Thorndike et Skinner et mesurer leur influence sur l'enseignement programmé et la gestion de classe.

---

## 2. Cours détaillé
Né au début du XXe siècle sous l'impulsion de **John B. Watson**, le **béhaviorisme (comportementalisme)** postule que la psychologie scientifique doit se borner à l'étude des faits observables et mesurables. Pour les béhavioristes, l'esprit humain est une **« boîte noire » (Boîte noire)** dont le fonctionnement interne n'a pas à être modélisé pour expliquer les apprentissages ; seul importe le lien unissant les **stimuli (S)** de l'environnement aux **réponses (R)** de l'organisme.

### 1. Le conditionnement classique ou répondant (Ivan Pavlov) :
* Expériences princeps sur le réflexe salivaire du chien.
* **Processus :** Association répétée d'un **stimulus neutre** (son de cloche) à un **stimulus inconditionnel** (nourriture). À terme, le stimulus neutre devient un **stimulus conditionnel** capable de provoquer isolément la **réponse conditionnelle**.
* **Impact scolaire :** Explique la genèse des conditionnements affectifs (angoisse scolaire, aversion pour une discipline associées à des expériences pénibles).

### 2. L'apprentissage par essais et erreurs (Edward Thorndike) :
* **Loi de l'effet (Loi de l'effet) :** Tout comportement suivi d'un état de satisfaction pour l'organisme a tendance à se reproduire, tandis qu'un comportement suivi d'un désagrément tend à disparaître.
* **Loi de l'exercice :** Les connexions synaptiques entre stimulus et réponse se fortifient par la répétition fréquente et s'affaiblissent en cas de désuétude.

### 3. Le conditionnement opérant (B. F. Skinner) :
Skinner dépasse le modèle passif pavlovien : le sujet opère activement sur son environnement et ce sont les **conséquences** de son acte qui déterminent sa probabilité d'occurrence future.

* **Renforcement positif :** Présentation d'un stimulus agréable (encouragement, note, récompense) qui augmente la fréquence du comportement cible.
* **Renforcement négatif :** Retrait d'un stimulus aversif ou déplaisant (levée d'une corvée) consécutif à une conduite souhaitée, ce qui en renforce l'apparition.
* **Punition positive :** Application d'un stimulus désagréable (remarque, avertissement) pour réduire un comportement indésirable.
* **Punition négative :** Suppression d'un privilège plaisant (retrait d'un temps de jeu) pour éteindre une conduite inadaptée.
* **L'enseignement programmé :** Découpage linéaire et progressif des savoirs en micromodules avec validation immédiate et renforcement systématique du succès.

---

## 3. Concepts clés et terminologie

| Terme en Français | Terme en Arabe | Définition didactique |
| :--- | :--- | :--- |
| **Conditionnement classique** | الاشتراط الكلاسيكي | Apprentissage par association temporelle entre stimulus neutre et stimulus inconditionnel. |
| **Conditionnement opérant** | الاشتراط الإجرائي | Modification du comportement par le biais des conséquences (renforcements ou punitions). |
| **Renforcement positif** | التعزيز الإيجابي | Ajout d'une gratification après un comportement pour accroître sa fréquence. |
| **Renforcement négatif** | التعزيز السلبي | Suppression d'un élément désagréable pour encourager le maintien du comportement adéquat. |
| **Boîte noire** | العلبة السوداء | Conception métaphorique récusant l'étude des états mentaux non directement mesurables. |

---

## 4. Synthèse et points clés
* Le béhaviorisme définit l'apprentissage comme une modification durable des comportements observables soumise aux contingences de renforcement.
* Skinner est le père de l'enseignement programmé, précurseur direct de la pédagogie par objectifs (PPO).
* Le renforcement s'avère pédagogiquement plus constructif et pérenne que les mécanismes coercitifs de punition.

---

## 5. Tableau comparatif et nuances
* **Conditionnement pavlovien vs skinnérien :** Dans le premier, le sujet subit le stimulus ; dans le second, le sujet produit l'action et réagit à ses conséquences.
* **Renforcement négatif vs Punition :** Le renforcement négatif vise à **consolider** un comportement souhaité ; la punition vise à **faire disparaître** un comportement néfaste.

---

## 6. QCM d'entraînement
**Question :** Laquelle des interventions suivantes illustre un « renforcement négatif » selon Skinner ?
* A) Attribuer un diplôme d'honneur à un élève ayant obtenu d'excellents résultats.
* B) Dispenser un élève sérieux d'une tâche rébarbative parce qu'il a rendu ses travaux à temps.
* C) Donner une retenue le mercredi après-midi à un élève perturbateur.
* D) Confisquer le téléphone portable d'un élève pris en flagrant délit en classe.
* E) Toutes les options précédentes correspondent à des punitions positives.

> **Bonne réponse :** **B**
> **Explication :** Le renforcement négatif consiste à soustraire une contrainte désagréable (tâche pénible) pour valoriser et ancrer le comportement positif (ponctualité des devoirs).

---

## 7. Astuces Concours & Pièges classiques
* ⚠️ **Le piège fatal des QCM :** Assimiler renforcement négatif à punition. Retenez : « renforcement » augmente toujours le comportement, « négatif » signifie qu'on retire quelque chose de déplaisant.
* 💡 **Mémento des auteurs majeurs :**
  * Pavlov = Salivation, réflexe conditionné.
  * Thorndike = Loi de l'effet, labyrinthes.
  * Watson = Béhaviorisme radical, expérience du petit Albert.
  * Skinner = Conditionnement opérant, boîte de Skinner, enseignement programmé.`,

    examples_ar: `### تطبيق صفي لسلوكية سكينر في إدارة القسم:
يقسم أستاذ الإعلاميات درساً عملياً حول لغة بايثون إلى وحدات بالغة الصغر (Micro-tâches).
* ينجز التلميذ التعليمة الأولى، وبمجرد نجاحه يتلقى إشعاراً أخضر فورياً (التعزيز الإيجابي).
* هذا التعزيز الفوري يرفع من ثقة التلميذ ويدفعه للانتقال السلس إلى الخطوة الموالية دون ارتباك.`,
    examples_fr: `### Cas concret d'application en classe :
Lors d'une séance d'informatique, le professeur applique l'enseignement programmé pour apprendre la syntaxe Python.
* L'élève complète une commande basique ; dès que la syntaxe est correcte, un message de réussite s'affiche immédiatement (renforcement positif).
* Ce feedback immédiat élimine l'angoisse de l'échec et valide l'acquisition avant de passer à l'étape suivante.`,
    astuces_ar: `💡 التعزيز الإيجابي = إضافة مثير مرغوب (جائزة).
💡 التعزيز السلبي = حذف مثير مؤلم أو مزعج (رفع عقوبة سابقة).
💡 العقاب الإيجابي = تسليط مثير مزعج (توبيخ).
💡 العقاب السلبي = حرمان من مثير مرغوب (منع من الاستراحة).`,
    astuces_fr: `💡 Renforcement positif = ajout d'une récompense valorisante.
💡 Renforcement négatif = suppression d'une contrainte désagréable.
💡 Punition positive = application d'une mesure répressive (blâme).
💡 Punition négative = suppression d'un privilège apprécié (privation de récréation).`
  }
];

// Write file helper
console.log('Generating Mod 1.2 initial part...');
module.exports = { initialLessons: lessons };
