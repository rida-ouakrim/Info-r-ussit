import React from 'react';
import { FileText, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_2023_AR_TEXT = `نص الانطلاق:

تكشف الفوارق في النجاح الدراسي، بين جماعات التلاميذ، حدود مبدأ الاستحقاق، أي القدرات الفكرية والجهود والمواهِب الفردية للتلاميذ، بغض النظر عن خصائصهم الاجتماعية الموروثة، والذي يجب أن يكون أساسا لكل نظام تعليمي. فالتلاميذ ليسوا متساوين من حيث أصولهم الاجتماعية والاقتصادية والثقافية. كما أن الفقر والهشاشة ليسا معطيين خارجيين عن المدرسة، بل يؤثران بشكل مباشر في مكتسبات التلاميذ وفي استمرارهم الدراسي. إن إثارة مسألة تكافؤ الفرص التعليمية، يعني إعادة النظر في مسألة النجاح الدراسي القائم حصراً على مبدأ الاستحقاق، والتفكير من جديد في مسألة العدالة الاجتماعية في مجال التربية. وبالفعل، فالنجاح الدراسي لا يزال حتى اليوم، مرتبطاً بشكل قوي بالأصل الاجتماعي، في علاقة بأليات الإقصاء التي تفعل فعلها في المدرسة المغربية، والتي تقوض مبدأ تكافؤ الفرص، الذي يفترض أن جميع التلاميذ يتلقون نفس التربية كيفما كانت خصائصهم الفردية والأسرية. كما أن مبدأ الاستحقاق الفردي الذي يفسر النجاح أو الفشل الدراسيين، يؤدي، في الواقع، إلى إقصاء عدد كبير من التلاميذ من المدرسة.

وحتى يوصف مجتمع ديمقراطي ما بالعادل، فعليه أن يعطي الأولوية للتلاميذ الأكثر احتياجاً اجتماعياً، وذلك للحد من الفوارق في النتائج الدراسية وفي الاندماج الاجتماعي والمهني. ومعنى هذا، أنه لا يتعين على المدرسة أن تضمن تكافؤ الفرص بين التلاميذ فحسب، وإنما يتعين عليها، أيضاً، أن تعمل على ألا يكون مصير التلاميذ المحرومين رهيناً بظروفهم الاجتماعية الأصلية. وإذا كانت الاختلافات بين التلاميذ لا تعد كلها فوارق دراسية غير مقبولة وغير مشروعة، فإن الطابع الجماعي الذي يميز الولوج لأبسط الموارد التربوية، بالإضافة إلى حدة التفاوتات بين التلاميذ، كل ذلك يؤسس لوجود الفوارق الاجتماعية بالمدرسة. وعلى عكس الاستحقاق والقدرات الفردية، اللذين وضعا منذ بداية ضمن شروط تكافؤ الفرص، فإنه لا يمكن اعتبار التوزيع غير المتكافئ للموارد التربوية وفق الأصل الاجتماعي و/أو الجغرافي للتلاميذ، أو وفق جنسهم أو إعاقتهم، أمراً مشروعاً وعادلاً.

المجلس الأعلى للتربية والتكوين والبحث العلمي، مدرسة العدالة الاجتماعية، 2018، ص 7.`;

const FALLBACK_2023_FR_TEXT = `DOCUMENT DE RÉFÉRENCE (TEXTE D'APPUI - CONCOURS 2023) :

Les écarts de réussite scolaire entre groupes d'élèves révèlent les limites du principe de méritocratie — c'est-à-dire des aptitudes intellectuelles, des efforts et des talents individuels des élèves, indépendamment de leurs caractéristiques sociales héritées, qui devrait constituer le fondement de tout système éducatif. Les élèves ne sont en effet pas égaux du point de vue de leurs origines sociales, économiques et culturelles. De plus, la pauvreté et la précarité ne sont pas des données extérieures à l'école : elles influent directement sur les acquis des élèves et sur leur maintien dans le parcours scolaire. Aborder la question de l'égalité des chances éducatives implique de réexaminer la notion de réussite scolaire exclusivement fondée sur le mérite individuel et de repenser la justice sociale dans le domaine de l'éducation. En effet, la réussite scolaire demeure aujourd'hui fortement liée à l'origine sociale, en lien avec les mécanismes d'exclusion à l'œuvre au sein de l'école marocaine, lesquels compromettent le principe d'égalité des chances supposant que tous les élèves reçoivent la même éducation, quelles que soient leurs caractéristiques individuelles ou familiales. De surcroît, le principe du mérite individuel, censé expliquer le succès ou l'échec scolaires, conduit en réalité à l'exclusion d'un grand nombre d'élèves.

Pour qu'une société démocratique soit qualifiée de juste, elle doit accorder la priorité aux élèves les plus défavorisés sur le plan social, afin de réduire les disparités dans les résultats scolaires ainsi que dans l'intégration sociale et professionnelle. Cela signifie que l'école ne doit pas seulement garantir l'égalité des chances entre les élèves, mais qu'elle doit également veiller à ce que le destin des élèves défavorisés ne soit pas prisonnier de leurs conditions sociales d'origine. Si toutes les différences entre élèves ne constituent pas des inégalités scolaires inacceptables et illégitimes, le caractère collectif de l'accès aux ressources éducatives fondamentales, conjugué à l'intensité des disparités, fonde l'existence d'inégalités sociales à l'école. Contrairement au mérite et aux capacités individuelles placés dès l'origine parmi les conditions de l'égalité des chances, la distribution inégale des ressources éducatives selon l'origine sociale et/ou géographique des élèves, leur genre ou leur handicap, ne saurait être considérée comme légitime ni juste.

Source : Conseil Supérieur de l'Éducation, de la Formation et de la Recherche Scientifique, L'École de la justice sociale, 2018, p. 7.`;

const FALLBACK_2024_AR_TEXT = `نص الانطلاق:
مقابلة مع فيليب ميريو كاتب وباحث في علوم التربية

سؤال: إذا كان الجميع يعرف معنى كلمة "تربية"، فإننا عندما نتحدث عن "الطرائق التربوية"، نكون أمام نوع من الغموض لكون هذا التعبير يشمل مفاهيم عديدة متباينة. هل يمكنك توضيحها لنا؟
جواب: صحيح أن تعبير "الطريقة التربوية" يشمل وضعيات مختلفة للغاية حيث يتم الحديث عن "الطريقة الشاملة" لتعلم القراءة بالإضافة إلى "الطرق النشطة" أو "الوضعية-المشكلة". ويتم وصف المدرس بأنه يملك "طرقا جيدة" للدلالة على محافظته على الانضباط في فصله أو أنه يوظف طرق عمل فعالة. في الواقع، يعبر مفهوم الطريقة على ثلاث وضعيات مختلفة ولكنها مترابطة فيما بينها. فهو يعبر أولاً عن "تيار تربوي" يتميز بأهداف يسعى لتحقيقها وبممارسات يوصي باستخدامها لتحقيق ذلك. ثانيا، يمكن الحديث عن "طريقة" تعتمد بشكل أكثر تحديدًا على نوع من الأنشطة المتميزة بالوسائل التي تستخدمها. فعلى سبيل المثال، يمكن القول إن التدريس المسنود بواسطة الحاسوب هو طريقة تربوية. وثالثا، يمكننا الحديث عن "طريقة تربوية" للإشارة إلى نشاط محدد، ووسيلة محددة ودقيقة مرتبطة بتعليم مضمون معرفي معين.

سؤال: ما مدى نجاعة مصطلح "الطريقة التربوية"؟ وكيف يمكن التعامل معه؟ وكيف يمكن للمدرس أو المكون اختيار الطرق الملائمة؟
جواب: لقد ذكرتم، قبل قليل، أن الجميع يعرف معنى كلمة "تربية"، لست متأكدا من ذلك كليا، كما أنني غير متأكد من أن جميع الباحثين يتفقون على تعريف واحد. بالنسبة لي، التربية هي بالضبط العمل الدؤوب الذي يسير في اتجاهين: اتجاه أول يبتدئ من الغايات الأكثر تفصيلا وعمومية، واتجاه ثان يعتمد التقنيات الأكثر دقة التي تستحضر التفاصيل الدقيقة. فالفكر التربوي يطرح سؤالين يكملان بعضهما البعض: كيف يمكن تجسيد نواياي التربوية في الحياة اليومية؟ وكيف يمكن ربط أفعالي اليومية بالمرجعيات التي تخدمها ضمنيا؟ فلا ينبغي أن نعتقد أن "المشاريع التربوية" (التي تتضمن، عموما، تعبيرات جميلة مثل "تفتح الطفل" أو "تحقيق الاستقلالية") مصممة لتتحول بشكل عجيب إلى ممارسات... بل يمكننا أن نتساءل، في بعض الأحيان، عن جدوى إعلان النوايا في ظل عدم القدرة على تحقيقها.

سؤال: هل يعني ذلك أن الطرائق العملية يمكن أن تستمد من الغايات وأنه يكفي معرفة الهدف للتمكن من الوسائل على الفور؟
جواب: بالطبع لا. السمة المميزة لعلم النفس التربوي هي أن الأهداف لا تحمل في ذاتها الطرق التي يمكن أن تجسدها. لذا يجب إبداع الطرق باستمرار؛ إذ يجب التقاطها هنا وهناك عبر حمل هم مستمر حول مدى ملاءمتها مع نوايانا الحقيقية.

سؤال: لكن، أليس هذا الأمر مثبطا بالنسبة للمدرسين الشباب؟ وكيف يمكنهم إعادة ابتكار كل شيء؟ وكيف يمكنهم أن يجدوا طريقهم في هذا الكم من المسارات المطروحة حاليا في الساحة؟
جواب: قد يكون الأمر كذلك إذا كنا نتوقع ضمن منظور ميكانيكي للعملية؛ أي إذا آمنا بأن هناك طريقة واحدة جيدة تناسب هدفا محددا وتلميذا بعينه. هل بإمكاننا إذا أن نجد هذه الطريقة العجيبة؟ يتعين هنا أن نملك كمية معتبرة من المعطيات المسبقة حتى نلغي العملية، لأننا لن نكون جاهزين أبدا لتنفيذها... ستنقصنا دائما معلومات تقنية أو نفسية أو حتى ديداكتيكية. بالنسبة لي، أعتقد أن مفهوم "الطريقة الصحيحة" خطير ومستحيل اعتماده.

سؤال: ألن يستطيع المدرس تطبيق طريقة معينة بمجرد أن يحدد أهدافه ويقرر اقتراحها؟
جواب: قطعا لا، فالفيزة الأساسية للمدرس تكمن في قدرته على التعديل. في البداية، سيعتمد على ذاكرته (كل ما قد قرأه أو شهده، أو ما عاينه من تفاعل الناس مع اقتراح معين، وفقا للطريقة التي تقدم لهم بها، وانسياباً مع سنهم، وما إلى ذلك)، وسيتحاول التعمق في معرفته السابقة، أوما يمكن أن يتصوره بنفسه عن الأدوات المناسبة لأهدافه والسياق الديداكتيكي الذي يجب أن يخلقه، والذي يضع دائماً، وفقًا للمضامين الخاصة التي يتناولها، قيوداً محددة. بعد ذلك، يبدأ ببعض الأفكار حول فعالية اقتراحاته وإمكانيات تحقيقها... ولكن، لن يعرف مسبقا ما سيخلفه لدى تلاميذه؛ لأنه حتى لو كان يمتلك خبرة كبيرة، فإن الوضعيات التعليمية فريدة من نوعها ولا يوجد تشابه بين فصلين دراسيين، ولا يمكن لتلميذين أن يتفاعلا بشكل متطابق.

سؤال: في كتابك «التربية بين القول والفعل»، تقول إن المربي يجب أن يشتغل على مقاومة الفرد للخضوع للتعلم، كيف ذلك؟
جواب: أعتقد أن مفهوم "المقاومة" أساسي في العملية التربوية؛ فالآخر أي التلميذ، أو الراشد الخاضع للتكوين، كلهم يقاومون دائما رغبتي في تعليمهم بشكل مشروع، أي أنني أريد أن أقرر ما هو في صالحهم. فالخاضع للتعليم لا يرغب أبدا فيما يتم برمجته ضمن عملية التعلم، ولا يريد التعلم بالطريقة التي أعلمه بها. إنه يملك تمثلات تعترض فهم ما أريد تعليمه له، ولا يفهم طريقة تفكيري، وتجاربه مختلفة عن تجاربي ولا يسمي الأشياء بنفس المسميات التي دأبت عليها. إنه يود، بالتأكيد، أن يقرر بنفسه طريقة تعلمه، لكن "مشروعه الشخصي" يصطدم في مناسبات عديدة بالمشروع الذي أعددناه له.

المرجع: حوار منشور على موقع (https://www.meirieu.com, visité le 01/07/2024) (بتصرف)`;

const FALLBACK_2024_FR_TEXT = `DOCUMENT DE RÉFÉRENCE (TEXTE D'APPUI - CONCOURS 2024) :
ENTRETIEN AVEC PHILIPPE MEIRIEU (CHERCHEUR EN SCIENCES DE L'ÉDUCATION)

Question : Si chacun connaît le sens du mot « éducation », parler de « méthodes pédagogiques » introduit une certaine ambiguïté car l'expression recouvre des réalités variées. Pouvez-vous nous éclairer ?
Réponse : Il est vrai que l'expression « méthode pédagogique » englobe des situations très diverses : on parle aussi bien de méthode globale pour la lecture que de méthodes actives ou de situation-problème. On dit d'un enseignant qu'il a de « bonnes méthodes » pour souligner sa tenue de classe ou l'efficacité de ses démarches. En réalité, le concept de méthode renvoie à trois réalités distinctes mais articulées : premièrement, un courant pédagogique caractérisé par des finalités visées et des pratiques préconisées ; deuxièmement, une démarche centrée sur un type d'activités ou de supports spécifiques (par exemple l'enseignement assisté par ordinateur) ; troisièmement, un outil ou un dispositif précis lié à l'apprentissage d'un contenu donné.

Question : Quelle est la portée du terme « méthode pédagogique » et comment l'enseignant peut-il choisir les méthodes appropriées ?
Réponse : L'éducation est précisément ce travail exigeant d'aller-retour entre les finalités les plus générales et les techniques les plus fines. La réflexion pédagogique pose deux questions complémentaires : comment incarner mes intentions éducatives au quotidien ? Et comment relier mes actes quotidiens aux principes qui les fondent ? Il ne faut pas croire que les « projets éducatifs » se traduisent magiquement en pratiques...

Question : Les méthodes pratiques se déduisent-elles directement des finalités ?
Réponse : Absolument pas. La caractéristique de la pédagogie est que les buts ne contiennent pas en eux-mêmes les moyens de les réaliser. Il faut inventer les méthodes en permanence et s'interroger sans cesse sur leur cohérence avec nos intentions.

Question : Est-ce décourageant pour les jeunes enseignants ?
Réponse : Cela le serait dans une vision mécaniste. Mais l'idée d'une « méthode miracle » universelle est dangereuse et irréaliste. La caractéristique essentielle de l'enseignant réside dans sa capacité de régulation et d'adaptation.

Question : L'enseignant ne peut-il pas appliquer une méthode dès lors qu'il a fixé ses objectifs ?
Réponse : Pas du tout. Les situations d'apprentissage sont uniques. Il n'y a pas deux classes identiques ni deux élèves qui réagissent de la même manière.

Question : Dans votre ouvrage, vous parlez de la résistance de l'élève à l'apprentissage...
Réponse : Le concept de « résistance » est fondamental. L'apprenant résiste légitimement à la volonté de maîtrise de l'éducateur. Il possède ses propres représentations et souhaite décider par lui-même. Son projet personnel entre parfois en tension avec le projet préparé pour lui.

Source : Entretien avec Philippe Meirieu (www.meirieu.com, 2024).`;

export const isQuestionFrench = (question) => {
  if (!question) return false;
  const text = (question.question_text || '') + ' ' + (question.option_a || '') + ' ' + (question.option_b || '');
  const arabicCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return arabicCharCount <= 5;
};

export const hasReferenceText = (question) => {
  if (!question) return false;
  if (question.reference_text && question.reference_text.trim().length > 0) return true;
  
  const year = Number(question.exam_year);
  const txt = question.question_text || '';
  const num = (question.question_number || '').trim();

  if (year === 2023) {
    if (txt.includes('النص') || txt.toLowerCase().includes('texte') || ['Q61', 'Q62', 'Q63', 'Q64', 'Q65'].includes(num)) {
      return true;
    }
  }

  if (year === 2024) {
    if (txt.includes('النص') || txt.toLowerCase().includes('texte') || ['Q61', 'Q62', 'Q63', 'Q64', 'Q65', 'Q67', 'Q69', 'Q70', 'Q72', 'Q73'].includes(num)) {
      return true;
    }
  }

  return false;
};

export const getReferenceText = (question) => {
  if (!question) return '';
  const isFr = isQuestionFrench(question);

  if (question.reference_text && question.reference_text.trim().length > 0) {
    // If DB reference_text has valid language, use it
    const dbHasAr = (question.reference_text.match(/[\u0600-\u06FF]/g) || []).length > 20;
    if (isFr && dbHasAr) {
      // Fallback to translated French version
      const year = Number(question.exam_year);
      if (year === 2024) return FALLBACK_2024_FR_TEXT;
      if (year === 2023) return FALLBACK_2023_FR_TEXT;
    }
    return question.reference_text;
  }

  const year = Number(question.exam_year);
  if (year === 2024) return isFr ? FALLBACK_2024_FR_TEXT : FALLBACK_2024_AR_TEXT;
  if (year === 2023) return isFr ? FALLBACK_2023_FR_TEXT : FALLBACK_2023_AR_TEXT;
  return '';
};

const ReferenceTextModal = ({ isOpen, onClose, question }) => {
  if (!isOpen) return null;
  const isFr = isQuestionFrench(question);
  const textContent = getReferenceText(question);
  const year = question?.exam_year || 2024;

  const sourceCitation = isFr
    ? (year === 2024 
        ? 'Entretien avec Philippe Meirieu (2024)' 
        : 'Conseil Supérieur de l\'Éducation, de la Formation et de la Recherche Scientifique (2018)')
    : (year === 2024 
        ? 'مقابلة مع فيليب ميريو (Philippe Meirieu, 2024)' 
        : 'المجلس الأعلى للتربية والتكوين والبحث العلمي (2018)');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-2xl overflow-hidden text-slate-900 dark:text-white"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>
                    {isFr 
                      ? `Texte d'appui — Concours Sciences de l'Éducation ${year}`
                      : `نص الانطلاق — اختبار علوم التربية ${year}`
                    }
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isFr
                    ? "Document de référence officiel pour répondre aux questions"
                    : "النص المرجعي المعتمد للإجابة عن الأسئلة"
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className={`p-5 sm:p-8 overflow-y-auto space-y-4 text-sm sm:text-base leading-relaxed selection:bg-amber-200 dark:selection:bg-amber-900 ${
            isFr ? 'text-left dir-ltr font-sans' : 'font-arabic text-right dir-rtl'
          }`}>
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                {sourceCitation}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-extrabold">
                {isFr ? "Document officiel" : "وثيقة مرجعية"}
              </span>
            </div>

            <div className="whitespace-pre-line text-slate-800 dark:text-slate-100 leading-loose text-justify bidi-plaintext" dir={isFr ? "ltr" : "rtl"}>
              {textContent}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#03594e] hover:bg-[#02473e] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              {isFr ? "Fermer le document" : "إغلاق النص"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReferenceTextModal;
