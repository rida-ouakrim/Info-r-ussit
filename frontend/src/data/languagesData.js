/**
 * languagesData.js
 * 100 academic/teaching vocabulary words + 50 short Nano & Banana stories.
 * Words are organized into 34 days (3 words/day) to fill the planner calendar.
 */

// ───────────────────────────────────────────────────────────────────────────────
// VOCABULARY — 100 words with definition, example, conjugation note, and category
// ───────────────────────────────────────────────────────────────────────────────
export const VOCABULARY = [
  // DAY 1
  { id: 1, day: 1, word: "acquérir", type: "verbe", definition: "Obtenir quelque chose par un effort ou un apprentissage.", example: "L'élève acquiert de nouvelles compétences chaque jour.", conjugation: "J'acquiers, tu acquiers, il acquiert, nous acquérons, vous acquérez, ils acquièrent.", tip: "Ne pas confondre avec 'à quérir' — 'acquérir' s'écrit avec 'ck' phonétiquement.", color: "blue" },
  { id: 2, day: 1, word: "rigueur", type: "nom féminin", definition: "Exactitude, sérieux et précision dans le travail.", example: "La rigueur est une qualité indispensable à tout bon enseignant.", conjugation: null, tip: "Féminin. On dit 'la rigueur' et non 'le rigueur'.", color: "purple" },
  { id: 3, day: 1, word: "pertinent(e)", type: "adjectif", definition: "Qui convient exactement à la situation, juste et adapté.", example: "Votre remarque est très pertinente.", conjugation: "Masculin: pertinent / Féminin: pertinente / Pluriel: pertinents, pertinentes.", tip: "Astuce : 'pertinent' rime avec 'évident' — tous les deux désignent quelque chose de juste.", color: "orange" },

  // DAY 2
  { id: 4, day: 2, word: "élaborer", type: "verbe", definition: "Préparer soigneusement et en détail quelque chose.", example: "Le professeur a élaboré un programme de révision complet.", conjugation: "J'élabore, tu élabores, il élabore, nous élaborons, vous élaborez, ils élaborent.", tip: "Le préfixe 'é-' vient du latin. Verbe du 1er groupe, conjugaison régulière.", color: "blue" },
  { id: 5, day: 2, word: "cohérence", type: "nom féminin", definition: "Le fait d'être logique et harmonieux dans ses idées ou actions.", example: "La cohérence entre les objectifs et les activités est essentielle.", conjugation: null, tip: "Féminin. L'adjectif correspondant est 'cohérent(e)'.", color: "purple" },
  { id: 6, day: 2, word: "susciter", type: "verbe", definition: "Provoquer, faire naître un sentiment ou une réaction.", example: "Ce cours a suscité beaucoup d'intérêt chez les élèves.", conjugation: "Je suscite, tu suscites, il suscite, nous suscitons, vous suscitez, ils suscitent.", tip: "Verbe régulier du 1er groupe. Synonymes : provoquer, engendrer, créer.", color: "orange" },

  // DAY 3
  { id: 7, day: 3, word: "transmettre", type: "verbe", definition: "Faire passer un savoir, une information d'une personne à une autre.", example: "Transmettre le savoir avec passion est le cœur du métier.", conjugation: "Je transmets, tu transmets, il transmet, nous transmettons, vous transmettez, ils transmettent.", tip: "Verbe du 3e groupe, irrégulier. Même famille que 'mettre'.", color: "blue" },
  { id: 8, day: 3, word: "précision", type: "nom féminin", definition: "Exactitude et clarté dans l'expression ou l'exécution.", example: "Parlez avec précision pour être bien compris de vos élèves.", conjugation: null, tip: "Féminin. L'adjectif correspondant est 'précis(e)'. Pluriel : des précisions.", color: "purple" },
  { id: 9, day: 3, word: "valoriser", type: "verbe", definition: "Mettre en valeur, reconnaître les efforts et les qualités.", example: "Il faut valoriser les efforts de chaque élève, pas seulement les résultats.", conjugation: "Je valorise, tu valorises, il valorise, nous valorisons, vous valorisez, ils valorisent.", tip: "Verbe régulier du 1er groupe. Synonymes : encourager, souligner, reconnaître.", color: "orange" },

  // DAY 4
  { id: 10, day: 4, word: "démarche", type: "nom féminin", definition: "Façon d'aborder un problème ou d'organiser son travail.", example: "Adoptez une démarche progressive pour introduire les nouveaux concepts.", conjugation: null, tip: "Féminin. On dit 'la démarche pédagogique' ou 'une démarche scientifique'.", color: "blue" },
  { id: 11, day: 4, word: "formuler", type: "verbe", definition: "Exprimer clairement une idée, une demande ou une règle.", example: "Le professeur a formulé sa question de manière claire et précise.", conjugation: "Je formule, tu formules, il formule, nous formulons, vous formulez, ils formulent.", tip: "Verbe du 1er groupe. Synonyme : énoncer, exprimer, rédiger.", color: "purple" },
  { id: 12, day: 4, word: "aptitude", type: "nom féminin", definition: "Capacité naturelle ou acquise à réaliser quelque chose.", example: "Cet étudiant montre de grandes aptitudes pour l'enseignement.", conjugation: null, tip: "Féminin. Pluriel : des aptitudes. Synonymes : compétence, talent, capacité.", color: "orange" },

  // DAY 5
  { id: 13, day: 5, word: "progressif(ve)", type: "adjectif", definition: "Qui avance par étapes successives, de façon graduelle.", example: "Une introduction progressive facilite la compréhension des concepts difficiles.", conjugation: "Masculin: progressif / Féminin: progressive / Pluriel: progressifs, progressives.", tip: "Pensez à bien prononcer le 'f' au masculin et le 'v' au féminin.", color: "blue" },
  { id: 14, day: 5, word: "solliciter", type: "verbe", definition: "Demander quelque chose à quelqu'un, faire appel à.", example: "N'hésitez pas à solliciter l'aide de vos collègues.", conjugation: "Je sollicite, tu sollicites, il sollicite, nous sollicitons, vous sollicitez, ils sollicitent.", tip: "Verbe régulier du 1er groupe. Synonymes : demander, requérir, interpeller.", color: "purple" },
  { id: 15, day: 5, word: "mettre en œuvre", type: "expression verbale", definition: "Réaliser concrètement, appliquer dans la pratique.", example: "Il est temps de mettre en œuvre la stratégie pédagogique planifiée.", conjugation: "Je mets en œuvre, nous mettons en œuvre (comme 'mettre').", tip: "Attention à l'orthographe de 'œuvre' — c'est la ligature 'œ'.", color: "orange" },

  // DAY 6
  { id: 16, day: 6, word: "comprendre", type: "verbe", definition: "Saisir le sens, la signification de quelque chose.", example: "Comprendre avant de mémoriser est la clé de la réussite.", conjugation: "Je comprends, tu comprends, il comprend, nous comprenons, vous comprenez, ils comprennent.", tip: "Verbe du 3e groupe. Pas de 's' à la 3e personne du singulier au présent.", color: "blue" },
  { id: 17, day: 6, word: "synthèse", type: "nom féminin", definition: "Résumé qui réunit les éléments essentiels d'un sujet.", example: "Faites une synthèse des points importants à la fin du cours.", conjugation: null, tip: "Féminin. Attention à l'accent grave sur le 'è'. L'adjectif est 'synthétique'.", color: "purple" },
  { id: 18, day: 6, word: "distinguer", type: "verbe", definition: "Reconnaître la différence entre des choses similaires.", example: "Il est important de distinguer les faits des opinions.", conjugation: "Je distingue, tu distingues, il distingue, nous distinguons, vous distinguez, ils distinguent.", tip: "Verbe du 1er groupe. Synonymes : différencier, discriminer, séparer.", color: "orange" },

  // DAY 7
  { id: 19, day: 7, word: "structurer", type: "verbe", definition: "Organiser de façon logique et cohérente.", example: "Un bon enseignant sait structurer ses explications.", conjugation: "Je structure, tu structures, il structure, nous structurons, vous structurez, ils structurent.", tip: "Verbe régulier du 1er groupe. Synonymes : organiser, ordonner, agencer.", color: "blue" },
  { id: 20, day: 7, word: "autonomie", type: "nom féminin", definition: "Capacité à agir et à apprendre de façon indépendante.", example: "Favoriser l'autonomie des élèves est un objectif pédagogique majeur.", conjugation: null, tip: "Féminin. L'adjectif est 'autonome'. On dit 'développer l'autonomie'.", color: "purple" },
  { id: 21, day: 7, word: "concis(e)", type: "adjectif", definition: "Bref, mais complet ; qui exprime l'essentiel sans superflu.", example: "Soyez concis dans vos explications orales.", conjugation: "Masculin: concis / Féminin: concise. Pluriel: concis, concises.", tip: "Synonymes : bref, succinct, laconique. Antonyme : prolixe, verbeux.", color: "orange" },

  // DAY 8
  { id: 22, day: 8, word: "interagir", type: "verbe", definition: "Agir mutuellement, avoir des échanges avec autrui.", example: "Les élèves doivent interagir entre eux pour mieux apprendre.", conjugation: "J'interagis, tu interagis, il interagit, nous interagissons, vous interagissez, ils interagissent.", tip: "Verbe du 2e groupe. Même terminaison que 'finir'.", color: "blue" },
  { id: 23, day: 8, word: "lacune", type: "nom féminin", definition: "Manque, insuffisance dans un domaine de connaissance.", example: "Identifier les lacunes de ses élèves permet d'y remédier.", conjugation: null, tip: "Féminin. Pluriel : des lacunes. Synonymes : manque, déficit, faiblesse.", color: "purple" },
  { id: 24, day: 8, word: "rigoureux(se)", type: "adjectif", definition: "Qui fait preuve de rigueur, de précision et de sérieux.", example: "Un professeur rigoureux prépare ses cours avec soin.", conjugation: "Masculin: rigoureux / Féminin: rigoureuse. Pluriel: rigoureux, rigoureuses.", tip: "La terminaison 'eux/euse' est typique des adjectifs masculin/féminin.", color: "orange" },

  // DAY 9
  { id: 25, day: 9, word: "consolider", type: "verbe", definition: "Renforcer ce qui existe déjà, rendre plus solide.", example: "Ces exercices permettent de consolider les acquis.", conjugation: "Je consolide, tu consolides, il consolide, nous consolidons, vous consolidez, ils consolident.", tip: "Verbe régulier du 1er groupe. Synonymes : renforcer, stabiliser, affermir.", color: "blue" },
  { id: 26, day: 9, word: "exigence", type: "nom féminin", definition: "Ce qui est requis, le niveau de qualité attendu.", example: "Le niveau d'exigence pour le concours est très élevé.", conjugation: null, tip: "Féminin. L'adjectif est 'exigeant(e)'. Pluriel : les exigences.", color: "purple" },
  { id: 27, day: 9, word: "manifeste", type: "adjectif", definition: "Évident, visible, qui ne peut être nié.", example: "Son progrès est manifeste depuis le début de l'année.", conjugation: "Invariable en genre. Pluriel : manifestes.", tip: "Synonymes : évident, flagrant, indéniable. Ne pas confondre avec le nom 'un manifeste'.", color: "orange" },

  // DAY 10
  { id: 28, day: 10, word: "animer", type: "verbe", definition: "Diriger une activité, donner de la vie à un groupe.", example: "Savoir animer une séance de cours est une compétence clé.", conjugation: "J'anime, tu animes, il anime, nous animons, vous animez, ils animent.", tip: "Verbe du 1er groupe. Synonymes : dynamiser, conduire, diriger.", color: "blue" },
  { id: 29, day: 10, word: "séquence", type: "nom féminin", definition: "Suite ordonnée d'activités pédagogiques avec un objectif.", example: "La séquence pédagogique se divise en plusieurs séances.", conjugation: null, tip: "Féminin. Pluriel : des séquences. Différent de 'séance' (une seule session).", color: "purple" },
  { id: 30, day: 10, word: "efficace", type: "adjectif", definition: "Qui produit les résultats attendus avec peu de moyens.", example: "Cette méthode d'apprentissage est très efficace.", conjugation: "Invariable en genre. Pluriel : efficaces.", tip: "Synonymes : performant, opérationnel, efficient. Ne pas confondre avec 'efficacité' (nom).", color: "orange" },

  // DAY 11
  { id: 31, day: 11, word: "identifier", type: "verbe", definition: "Reconnaître et nommer précisément quelque chose.", example: "Identifier les besoins des élèves est la première étape.", conjugation: "J'identifie, tu identifies, il identifie, nous identifions, vous identifiez, ils identifient.", tip: "Verbe du 1er groupe. Synonymes : repérer, reconnaître, désigner.", color: "blue" },
  { id: 32, day: 11, word: "modalité", type: "nom féminin", definition: "Manière, forme particulière d'organiser ou de faire quelque chose.", example: "Les modalités d'évaluation doivent être expliquées aux élèves.", conjugation: null, tip: "Féminin. Pluriel : les modalités. Souvent utilisé au pluriel.", color: "purple" },
  { id: 33, day: 11, word: "pertinent(e)", type: "adjectif", definition: "Qui est juste, approprié et bien adapté à la situation.", example: "Posez des questions pertinentes pendant le cours.", conjugation: "Masculin: pertinent / Féminin: pertinente / Pluriel: pertinents, pertinentes.", tip: "Synonymes : approprié, adapté, judicieux.", color: "orange" },

  // DAY 12
  { id: 34, day: 12, word: "motiver", type: "verbe", definition: "Inciter à l'action, donner envie d'apprendre et de s'améliorer.", example: "Un bon professeur sait motiver même les élèves les plus réticents.", conjugation: "Je motive, tu motives, il motive, nous motivons, vous motivez, ils motivent.", tip: "Verbe du 1er groupe. Synonymes : encourager, inciter, stimuler.", color: "blue" },
  { id: 35, day: 12, word: "contexte", type: "nom masculin", definition: "Ensemble des circonstances dans lesquelles se produit un fait.", example: "Il faut toujours replacer un concept dans son contexte.", conjugation: null, tip: "Masculin. On dit 'dans ce contexte' ou 'hors contexte'.", color: "purple" },
  { id: 36, day: 12, word: "analytique", type: "adjectif", definition: "Qui procède par analyse, qui décompose pour mieux comprendre.", example: "L'esprit analytique est essentiel pour résoudre des problèmes complexes.", conjugation: "Invariable en genre. Pluriel : analytiques.", tip: "Synonymes : logique, méthodique, rigoureux.", color: "orange" },

  // DAY 13
  { id: 37, day: 13, word: "renforcer", type: "verbe", definition: "Rendre plus fort, accentuer, solidifier.", example: "Ces exercices renforcent la maîtrise du vocabulaire.", conjugation: "Je renforce, tu renforces, il renforce, nous renforçons, vous renforcez, ils renforcent.", tip: "Attention à la cédille : 'renforçons' — nécessaire devant 'o'.", color: "blue" },
  { id: 38, day: 13, word: "initiative", type: "nom féminin", definition: "Action de commencer quelque chose, prise de décision spontanée.", example: "Prendre des initiatives est valorisé dans l'enseignement.", conjugation: null, tip: "Féminin. On dit 'prendre l'initiative' ou 'avoir de l'initiative'.", color: "purple" },
  { id: 39, day: 13, word: "approprié(e)", type: "adjectif", definition: "Qui convient parfaitement à la situation, au contexte.", example: "Utilisez un vocabulaire approprié selon le niveau de vos élèves.", conjugation: "Masculin: approprié / Féminin: appropriée / Pluriel: appropriés, appropriées.", tip: "Synonymes : adapté, pertinent, convenable.", color: "orange" },

  // DAY 14
  { id: 40, day: 14, word: "approfondir", type: "verbe", definition: "Étudier plus en détail, aller plus loin dans la compréhension.", example: "Il faut approfondir sa connaissance de la grammaire.", conjugation: "J'approfondis, tu approfondis, il approfondit, nous approfondissons, vous approfondissez, ils approfondissent.", tip: "Verbe du 2e groupe. Même conjugaison que 'finir'.", color: "blue" },
  { id: 41, day: 14, word: "illustration", type: "nom féminin", definition: "Exemple concret ou image utilisée pour expliquer un concept.", example: "Une bonne illustration rend les abstractions compréhensibles.", conjugation: null, tip: "Féminin. Pluriel : des illustrations. L'adjectif est 'illustratif'.", color: "purple" },
  { id: 42, day: 14, word: "pertinent(e)", type: "adjectif", definition: "Qui est à propos, juste, bien adapté.", example: "Votre observation est tout à fait pertinente.", conjugation: "Masculin: pertinent / Féminin: pertinente.", tip: "L'adverbe correspondant est 'pertinemment'.", color: "orange" },

  // DAY 15
  { id: 43, day: 15, word: "aborder", type: "verbe", definition: "Commencer à traiter un sujet, l'introduire.", example: "Nous allons aborder le thème de la conjugaison.", conjugation: "J'aborde, tu abordes, il aborde, nous abordons, vous abordez, ils abordent.", tip: "Verbe du 1er groupe. Synonymes : introduire, entamer, traiter.", color: "blue" },
  { id: 44, day: 15, word: "précision", type: "nom féminin", definition: "Caractère de ce qui est exact, net et clair.", example: "La précision du vocabulaire est cruciale à l'oral.", conjugation: null, tip: "Féminin. L'adjectif est 'précis(e)'. On peut aussi dire 'avec précision'.", color: "purple" },
  { id: 45, day: 15, word: "exhaustif(ve)", type: "adjectif", definition: "Qui traite un sujet dans tous ses aspects, complet.", example: "Cette liste n'est pas exhaustive mais couvre les points essentiels.", conjugation: "Masculin: exhaustif / Féminin: exhaustive / Pluriel: exhaustifs, exhaustives.", tip: "Synonymes : complet, intégral, total. Attention au 'f'/'v' masculin/féminin.", color: "orange" },

  // DAY 16
  { id: 46, day: 16, word: "mémoriser", type: "verbe", definition: "Fixer dans la mémoire, retenir durablement.", example: "La répétition aide à mémoriser le vocabulaire.", conjugation: "Je mémorise, tu mémorises, il mémorise, nous mémorisons, vous mémorisez, ils mémorisent.", tip: "Verbe du 1er groupe. Synonymes : retenir, apprendre par cœur, fixer.", color: "blue" },
  { id: 47, day: 16, word: "explication", type: "nom féminin", definition: "Développement destiné à faire comprendre quelque chose.", example: "Votre explication était très claire et accessible.", conjugation: null, tip: "Féminin. Pluriel : des explications. Le verbe associé est 'expliquer'.", color: "purple" },
  { id: 48, day: 16, word: "fondamental(e)", type: "adjectif", definition: "Qui est à la base, essentiel, primordial.", example: "La conjugaison est une compétence fondamentale en français.", conjugation: "Masculin: fondamental / Féminin: fondamentale / Pluriel masculin: fondamentaux.", tip: "Attention au pluriel masculin : fondamentaux (et non fondamentals).", color: "orange" },

  // DAY 17
  { id: 49, day: 17, word: "impliquer", type: "verbe", definition: "Engager, faire participer activement.", example: "Impliquer les élèves dans leur apprentissage augmente leur motivation.", conjugation: "J'implique, tu impliques, il implique, nous impliquons, vous impliquez, ils impliquent.", tip: "Verbe du 1er groupe. Synonymes : engager, inclure, faire participer.", color: "blue" },
  { id: 50, day: 17, word: "nuance", type: "nom féminin", definition: "Différence subtile entre des choses proches.", example: "Il y a une nuance importante entre 'savoir' et 'connaître'.", conjugation: null, tip: "Féminin. L'adjectif est 'nuancé(e)'. Le verbe est 'nuancer'.", color: "purple" },

  // DAY 18-34: (continuing with more words...)
  { id: 51, day: 18, word: "stimuler", type: "verbe", definition: "Exciter, activer, encourager quelque chose ou quelqu'un.", example: "Des activités variées stimulent l'attention des élèves.", conjugation: "Je stimule, tu stimules, il stimule, nous stimulons, vous stimulez, ils stimulent.", tip: "Verbe du 1er groupe. Synonymes : activer, dynamiser, encourager.", color: "blue" },
  { id: 52, day: 18, word: "observable", type: "adjectif", definition: "Qui peut être constaté, mesuré ou vu.", example: "Le progrès doit être observable et mesurable.", conjugation: "Invariable en genre. Pluriel : observables.", tip: "Synonymes : visible, perceptible, constatable.", color: "purple" },
  { id: 53, day: 18, word: "interaction", type: "nom féminin", definition: "Action réciproque entre deux ou plusieurs personnes.", example: "Les interactions entre élèves favorisent l'apprentissage coopératif.", conjugation: null, tip: "Féminin. Pluriel : des interactions. Le verbe associé est 'interagir'.", color: "orange" },

  { id: 54, day: 19, word: "parvenir", type: "verbe", definition: "Réussir à atteindre un but malgré les obstacles.", example: "Avec du travail, vous parviendrez à maîtriser ces règles.", conjugation: "Je parviens, tu parviens, il parvient, nous parvenons, vous parvenez, ils parviennent.", tip: "Verbe du 3e groupe, irrégulier. Même conjugaison que 'venir'.", color: "blue" },
  { id: 55, day: 19, word: "concentration", type: "nom féminin", definition: "Fait de focaliser toute son attention sur une tâche.", example: "La concentration est indispensable pour apprendre efficacement.", conjugation: null, tip: "Féminin. Le verbe associé est 'se concentrer'.", color: "purple" },
  { id: 56, day: 19, word: "logique", type: "adjectif/nom", definition: "Qui suit une progression rationnelle, cohérente.", example: "Adoptez une démarche logique pour résoudre tout problème.", conjugation: "Invariable en genre. Pluriel : logiques.", tip: "Peut être adjectif ou nom féminin. 'La logique' (nom) / 'un raisonnement logique' (adjectif).", color: "orange" },

  { id: 57, day: 20, word: "illustrer", type: "verbe", definition: "Expliquer ou rendre plus clair par un exemple ou une image.", example: "Illustrez chaque règle avec un exemple concret.", conjugation: "J'illustre, tu illustres, il illustre, nous illustrons, vous illustrez, ils illustrent.", tip: "Verbe du 1er groupe. Synonymes : montrer, exemplifier, démontrer.", color: "blue" },
  { id: 58, day: 20, word: "compétence", type: "nom féminin", definition: "Savoir-faire acquis par l'expérience ou la formation.", example: "Développer les compétences orales est un enjeu majeur.", conjugation: null, tip: "Féminin. L'adjectif est 'compétent(e)'. Ne pas confondre avec 'aptitude'.", color: "purple" },
  { id: 59, day: 20, word: "précis(e)", type: "adjectif", definition: "Exact, net, sans ambiguïté.", example: "Donnez des consignes précises pour éviter les malentendus.", conjugation: "Masculin: précis / Féminin: précise / Pluriel: précis, précises.", tip: "Le 's' final du masculin ne se prononce pas. Au féminin, le 'se' se prononce.", color: "orange" },

  { id: 60, day: 21, word: "démontrer", type: "verbe", definition: "Prouver par des arguments ou des exemples concrets.", example: "Le professeur a démontré la règle avec plusieurs exemples.", conjugation: "Je démontre, tu démontres, il démontre, nous démontrons, vous démontrez, ils démontrent.", tip: "Verbe du 1er groupe. Synonymes : prouver, justifier, montrer.", color: "blue" },
  { id: 61, day: 21, word: "objectif", type: "nom masculin / adjectif", definition: "But à atteindre / Qui n'est pas influencé par les émotions.", example: "L'objectif de cette séance est de maîtriser l'accord du participe.", conjugation: null, tip: "Masculin en tant que nom. L'adjectif : objectif/objective. Pluriel : objectifs/objectives.", color: "purple" },
  { id: 62, day: 21, word: "résumer", type: "verbe", definition: "Présenter l'essentiel de façon brève.", example: "Résumez le cours en quelques phrases clés.", conjugation: "Je résume, tu résumes, il résume, nous résumons, vous résumez, ils résument.", tip: "Verbe du 1er groupe. Synonymes : synthétiser, condenser, récapituler.", color: "orange" },

  { id: 63, day: 22, word: "maîtriser", type: "verbe", definition: "Contrôler parfaitement, avoir une totale compétence sur.", example: "Maîtriser la grammaire est essentiel pour enseigner le français.", conjugation: "Je maîtrise, tu maîtrises, il maîtrise, nous maîtrisons, vous maîtrisez, ils maîtrisent.", tip: "Attention à l'accent circumflex sur le 'î' de maîtrise.", color: "blue" },
  { id: 64, day: 22, word: "pratique", type: "nom féminin / adjectif", definition: "Qui s'applique concrètement / Application concrète d'une théorie.", example: "La pratique régulière est plus efficace que la théorie seule.", conjugation: "Adjectif invariable en genre. Pluriel : pratiques.", tip: "Ne pas confondre 'la pratique' (nom féminin) et 'pratique' (adjectif invariable).", color: "purple" },
  { id: 65, day: 22, word: "clair(e)", type: "adjectif", definition: "Facile à comprendre, sans ambiguïté.", example: "Utilisez un langage clair et accessible.", conjugation: "Masculin: clair / Féminin: claire / Pluriel: clairs, claires.", tip: "L'adverbe est 'clairement'. Synonymes : limpide, explicite, transparent.", color: "orange" },

  { id: 66, day: 23, word: "réfléchir", type: "verbe", definition: "Penser profondément avant d'agir ou de répondre.", example: "Réfléchissez avant de répondre à une question difficile.", conjugation: "Je réfléchis, tu réfléchis, il réfléchit, nous réfléchissons, vous réfléchissez, ils réfléchissent.", tip: "Verbe du 2e groupe. Participe passé : réfléchi(e).", color: "blue" },
  { id: 67, day: 23, word: "dynamique", type: "adjectif / nom féminin", definition: "Plein d'énergie et d'initiative / Force qui anime un groupe.", example: "Un cours dynamique capte l'attention des élèves.", conjugation: "Adjectif : invariable en genre. Pluriel : dynamiques.", tip: "Synonymes (adjectif): actif, énergique, animé.", color: "purple" },
  { id: 68, day: 23, word: "adapter", type: "verbe", definition: "Modifier pour rendre approprié à une situation ou un besoin.", example: "Il faut adapter son discours au niveau de l'auditoire.", conjugation: "J'adapte, tu adaptes, il adapte, nous adaptons, vous adaptez, ils adaptent.", tip: "Verbe du 1er groupe. Synonymes : ajuster, modifier, régler.", color: "orange" },

  { id: 69, day: 24, word: "analyser", type: "verbe", definition: "Étudier en détail les différentes parties d'un tout.", example: "Analysez les erreurs pour mieux comprendre vos lacunes.", conjugation: "J'analyse, tu analyses, il analyse, nous analysons, vous analysez, ils analysent.", tip: "Verbe du 1er groupe. Le nom correspondant est 'une analyse' (féminin).", color: "blue" },
  { id: 70, day: 24, word: "méthode", type: "nom féminin", definition: "Ensemble de procédés pour atteindre un objectif.", example: "Choisir la bonne méthode d'enseignement est crucial.", conjugation: null, tip: "Féminin. Pluriel : des méthodes. L'adjectif est 'méthodique'.", color: "purple" },
  { id: 71, day: 24, word: "global(e)", type: "adjectif", definition: "Qui prend en compte l'ensemble, le tout.", example: "Adoptez une vision globale avant d'entrer dans les détails.", conjugation: "Masculin: global / Féminin: globale / Pluriel masculin: globaux / Pluriel féminin: globales.", tip: "Attention au pluriel masculin : globaux (et non globals).", color: "orange" },

  { id: 72, day: 25, word: "encourager", type: "verbe", definition: "Inspirer de la confiance, stimuler à continuer.", example: "Encouragez vos élèves même quand ils font des erreurs.", conjugation: "J'encourage, tu encourages, il encourage, nous encourageons, vous encouragez, ils encouragent.", tip: "Attention : 'nous encourageons' — le 'e' est nécessaire après 'gg' devant 'o'.", color: "blue" },
  { id: 73, day: 25, word: "application", type: "nom féminin", definition: "Mise en pratique d'une règle ou d'un concept.", example: "L'application de la règle demande de la pratique.", conjugation: null, tip: "Féminin. Pluriel : des applications. Le verbe est 'appliquer'.", color: "purple" },
  { id: 74, day: 25, word: "rigide", type: "adjectif", definition: "Trop strict, sans souplesse.", example: "Un enseignement rigide peut décourager les élèves.", conjugation: "Invariable en genre. Pluriel : rigides.", tip: "Antonymes : souple, flexible, adaptable. Synonymes : inflexible, strict.", color: "orange" },

  { id: 75, day: 26, word: "observer", type: "verbe", definition: "Regarder attentivement pour analyser ou comprendre.", example: "Observez comment vos élèves réagissent à vos explications.", conjugation: "J'observe, tu observes, il observe, nous observons, vous observez, ils observent.", tip: "Verbe du 1er groupe. Le nom est 'une observation' (féminin).", color: "blue" },
  { id: 76, day: 26, word: "feedback", type: "nom masculin", definition: "Retour d'information sur une performance ou un travail.", example: "Donnez un feedback constructif à vos élèves.", conjugation: null, tip: "Anglicisme accepté. En français : rétroaction ou retour. Masculin.", color: "purple" },
  { id: 77, day: 26, word: "constructif(ve)", type: "adjectif", definition: "Qui aide à progresser, qui apporte quelque chose de positif.", example: "Une critique constructive aide à s'améliorer.", conjugation: "Masculin: constructif / Féminin: constructive / Pluriel: constructifs, constructives.", tip: "Antonymes : destructif, négatif. Attention au 'f'/'v' masculin/féminin.", color: "orange" },

  { id: 78, day: 27, word: "progresser", type: "verbe", definition: "Avancer, s'améliorer de façon graduelle.", example: "Vous allez progresser à condition de pratiquer régulièrement.", conjugation: "Je progresse, tu progresses, il progresse, nous progressons, vous progressez, ils progressent.", tip: "Verbe du 1er groupe. Le nom est 'une progression' (féminin).", color: "blue" },
  { id: 79, day: 27, word: "bienveillance", type: "nom féminin", definition: "Disposition favorable, gentillesse envers autrui.", example: "La bienveillance de l'enseignant crée un climat de confiance.", conjugation: null, tip: "Féminin. L'adjectif est 'bienveillant(e)'. Antonyme : malveillance.", color: "purple" },
  { id: 80, day: 27, word: "compréhensible", type: "adjectif", definition: "Qui peut être facilement compris.", example: "Vos explications sont claires et compréhensibles.", conjugation: "Invariable en genre. Pluriel : compréhensibles.", tip: "Synonymes : intelligible, clair, accessible. Antonyme : incompréhensible.", color: "orange" },

  { id: 81, day: 28, word: "expliciter", type: "verbe", definition: "Rendre explicite, formuler clairement ce qui était implicite.", example: "Expliciter les attentes évite les malentendus.", conjugation: "J'explicite, tu explicites, il explicite, nous explicitons, vous explicitez, ils explicitent.", tip: "Ne pas confondre avec 'expliquer'. Expliciter = rendre visible ce qui était sous-entendu.", color: "blue" },
  { id: 82, day: 28, word: "diversité", type: "nom féminin", definition: "Variété, pluralité de profils, d'idées ou de méthodes.", example: "La diversité des méthodes pédagogiques enrichit l'enseignement.", conjugation: null, tip: "Féminin. L'adjectif est 'diversifié(e)'. Pluriel : les diversités.", color: "purple" },
  { id: 83, day: 28, word: "accessible", type: "adjectif", definition: "Que l'on peut atteindre ou comprendre facilement.", example: "Rendez votre cours accessible à tous les niveaux.", conjugation: "Invariable en genre. Pluriel : accessibles.", tip: "Synonymes : abordable, compréhensible, à portée.", color: "orange" },

  { id: 84, day: 29, word: "cibler", type: "verbe", definition: "Viser précisément un objectif ou un public.", example: "Ciblez les lacunes spécifiques de chaque élève.", conjugation: "Je cible, tu cibles, il cible, nous ciblons, vous ciblez, ils ciblent.", tip: "Verbe du 1er groupe. Le nom est 'une cible' (féminin).", color: "blue" },
  { id: 85, day: 29, word: "implication", type: "nom féminin", definition: "Engagement profond, participation active.", example: "L'implication des élèves dans leur apprentissage est essentielle.", conjugation: null, tip: "Féminin. Le verbe est 'impliquer'. Pluriel : des implications.", color: "purple" },
  { id: 86, day: 29, word: "actif(ve)", type: "adjectif", definition: "Qui participe, qui agit, qui est en mouvement.", example: "Favorisez un apprentissage actif plutôt que passif.", conjugation: "Masculin: actif / Féminin: active / Pluriel: actifs, actives.", tip: "Antonyme : passif/passive. Même règle 'f'/'v' masculin/féminin.", color: "orange" },

  { id: 87, day: 30, word: "incarner", type: "verbe", definition: "Représenter, personnifier concrètement une valeur ou un rôle.", example: "Un bon professeur incarne les valeurs qu'il enseigne.", conjugation: "J'incarne, tu incarnes, il incarne, nous incarnons, vous incarnez, ils incarnent.", tip: "Verbe du 1er groupe. Synonymes : représenter, symboliser, personnifier.", color: "blue" },
  { id: 88, day: 30, word: "patience", type: "nom féminin", definition: "Capacité à attendre sans s'énerver, à persévérer.", example: "La patience est une qualité indispensable pour enseigner.", conjugation: null, tip: "Féminin. L'adjectif est 'patient(e)'. Antonyme : impatience.", color: "purple" },
  { id: 89, day: 30, word: "cohérent(e)", type: "adjectif", definition: "Qui est logique, sans contradiction.", example: "Votre argumentation est cohérente et bien structurée.", conjugation: "Masculin: cohérent / Féminin: cohérente / Pluriel: cohérents, cohérentes.", tip: "Le nom est 'la cohérence' (féminin). Synonymes : logique, consistant.", color: "orange" },

  { id: 90, day: 31, word: "finalité", type: "nom féminin", definition: "But ultime, raison d'être d'une action.", example: "La finalité de l'éducation est de former des citoyens responsables.", conjugation: null, tip: "Féminin. Synonymes : but, objectif, dessein. Pluriel : des finalités.", color: "blue" },
  { id: 91, day: 31, word: "formaliser", type: "verbe", definition: "Donner une forme officielle, structurer par écrit.", example: "Formalisez vos objectifs pédagogiques en début de séance.", conjugation: "Je formalise, tu formalises, il formalise, nous formalisons, vous formalisez, ils formalisent.", tip: "Verbe du 1er groupe. Le nom est 'une formalisation' (féminin).", color: "purple" },
  { id: 92, day: 31, word: "investissement", type: "nom masculin", definition: "Effort ou ressource mis au service d'un objectif.", example: "L'investissement personnel dans l'apprentissage porte toujours ses fruits.", conjugation: null, tip: "Masculin. Pluriel : des investissements. Le verbe est 's'investir'.", color: "orange" },

  { id: 93, day: 32, word: "partager", type: "verbe", definition: "Donner une partie de quelque chose, transmettre à d'autres.", example: "Partagez vos connaissances avec vos collègues et vos élèves.", conjugation: "Je partage, tu partages, il partage, nous partageons, vous partagez, ils partagent.", tip: "Attention : 'nous partageons' — le 'e' est nécessaire après 'g' devant 'o'.", color: "blue" },
  { id: 94, day: 32, word: "qualité", type: "nom féminin", definition: "Caractère positif, excellence d'une chose ou d'une personne.", example: "La qualité de l'enseignement dépend de la préparation.", conjugation: null, tip: "Féminin. Pluriel : des qualités. Antonyme : défaut.", color: "purple" },
  { id: 95, day: 32, word: "simultané(e)", type: "adjectif", definition: "Qui se produit en même temps.", example: "La gestion simultanée de plusieurs activités demande de l'organisation.", conjugation: "Masculin: simultané / Féminin: simultanée / Pluriel: simultanés, simultanées.", tip: "L'adverbe est 'simultanément'. Synonymes : concurrent, concomitant.", color: "orange" },

  { id: 96, day: 33, word: "explorer", type: "verbe", definition: "Aller à la découverte, investiguer un domaine.", example: "Encouragez vos élèves à explorer de nouvelles façons d'apprendre.", conjugation: "J'explore, tu explores, il explore, nous explorons, vous explorez, ils explorent.", tip: "Verbe du 1er groupe. Le nom est 'une exploration' (féminin).", color: "blue" },
  { id: 97, day: 33, word: "nuancé(e)", type: "adjectif", definition: "Qui tient compte des différences subtiles, ni tout blanc ni tout noir.", example: "Votre analyse est nuancée et montre une vraie réflexion.", conjugation: "Masculin: nuancé / Féminin: nuancée / Pluriel: nuancés, nuancées.", tip: "Le nom est 'la nuance'. Synonymes : subtil, modéré, pondéré.", color: "purple" },
  { id: 98, day: 33, word: "persévérer", type: "verbe", definition: "Continuer malgré les difficultés, ne pas abandonner.", example: "Persévérez dans votre apprentissage, les résultats viendront.", conjugation: "Je persévère, tu persévères, il persévère, nous persévérons, vous persévérez, ils persévèrent.", tip: "Attention aux accents : persévère (accent grave) mais persévérons (accent aigu).", color: "orange" },

  { id: 99, day: 34, word: "excellence", type: "nom féminin", definition: "Qualité supérieure, niveau très élevé de compétence.", example: "Viser l'excellence ne signifie pas être parfait, mais progresser sans cesse.", conjugation: null, tip: "Féminin. L'adjectif est 'excellent(e)'. On dit 'viser l'excellence'.", color: "blue" },
  { id: 100, day: 34, word: "persévérance", type: "nom féminin", definition: "Qualité de celui qui continue malgré les obstacles.", example: "La persévérance est la clé du succès dans tout apprentissage.", conjugation: null, tip: "Féminin. Le verbe est 'persévérer'. Synonymes : ténacité, constance, détermination.", color: "purple" },
];

// ───────────────────────────────────────────────────────────────────────────────
// STORIES — 50 short Nano & Banana stories
// Each story uses 2 vocabulary words (highlighted with colored spans)
// ───────────────────────────────────────────────────────────────────────────────
export const STORIES = [
  {
    id: 1,
    title: "La Première Journée de Nano à l'École",
    wordIds: [1, 2],
    words: ["acquérir", "rigueur"],
    text: [
      { type: "text", content: "Ce matin, Nano arrive dans sa nouvelle classe avec un grand sourire. Il sait qu'il va " },
      { type: "word", content: "acquérir", color: "blue", meaning: "obtenir par l'effort" },
      { type: "text", content: " de nouvelles connaissances. Banana, son meilleur ami, lui chuchote : « La " },
      { type: "word", content: "rigueur", color: "purple", meaning: "précision et sérieux" },
      { type: "text", content: " est la clé du succès. Fais attention à chaque détail ! » Nano hoche la tête et ouvre son cahier avec détermination. Il est prêt pour cette belle aventure." },
    ],
    moral: "🍌 La leçon de Nano : Pour apprendre, il faut y mettre du cœur ET du sérieux !"
  },
  {
    id: 2,
    title: "Banana Prépare Son Premier Cours",
    wordIds: [4, 5],
    words: ["élaborer", "cohérence"],
    text: [
      { type: "text", content: "Banana passe toute la nuit à " },
      { type: "word", content: "élaborer", color: "blue", meaning: "préparer soigneusement" },
      { type: "text", content: " son plan de cours. Il veut que chaque activité suive un fil logique. « La " },
      { type: "word", content: "cohérence", color: "purple", meaning: "logique et harmonie" },
      { type: "text", content: " entre mes objectifs et mes exercices est essentielle ! » dit-il. Au matin, son cours est parfait. Ses élèves suivent avec attention et comprennent tout parfaitement." },
    ],
    moral: "🍌 La leçon de Banana : Un cours bien préparé est un cours à moitié réussi !"
  },
  {
    id: 3,
    title: "Nano Explique les Fractions",
    wordIds: [7, 8],
    words: ["transmettre", "précision"],
    text: [
      { type: "text", content: "Nano doit " },
      { type: "word", content: "transmettre", color: "blue", meaning: "faire passer un savoir" },
      { type: "text", content: " la notion de fractions à ses élèves. Il parle avec " },
      { type: "word", content: "précision", color: "purple", meaning: "exactitude et clarté" },
      { type: "text", content: " : « Un demi, c'est une pizza coupée en deux parts égales ! » Les élèves comprennent immédiatement. Banana applaudit depuis le fond de la classe." },
    ],
    moral: "🍌 La leçon de Nano : Une bonne image vaut mieux qu'un long discours !"
  },
  {
    id: 4,
    title: "Banana Récompense les Efforts",
    wordIds: [9, 10],
    words: ["valoriser", "démarche"],
    text: [
      { type: "text", content: "Banana observe la " },
      { type: "word", content: "démarche", color: "blue", meaning: "façon d'organiser le travail" },
      { type: "text", content: " de travail de ses élèves avec attention. Même quand un élève fait une erreur, il prend le temps de " },
      { type: "word", content: "valoriser", color: "orange", meaning: "reconnaître les efforts" },
      { type: "text", content: " ses efforts : « Tu as essayé, c'est déjà formidable ! Voici comment progresser. » L'élève repart avec le sourire et la tête pleine de confiance." },
    ],
    moral: "🍌 La leçon de Banana : Valoriser l'effort transforme les erreurs en progrès !"
  },
  {
    id: 5,
    title: "Nano Apprend à Poser les Bonnes Questions",
    wordIds: [11, 12],
    words: ["formuler", "aptitude"],
    text: [
      { type: "text", content: "Nano a une grande " },
      { type: "word", content: "aptitude", color: "orange", meaning: "capacité naturelle" },
      { type: "text", content: " pour comprendre rapidement, mais il a du mal à " },
      { type: "word", content: "formuler", color: "purple", meaning: "exprimer clairement" },
      { type: "text", content: " ses questions. Banana lui montre : « Au lieu de dire 'Je comprends pas', dis plutôt : 'Pouvez-vous expliquer à nouveau la partie sur les verbes irreguliers ?' » Nano essaie et voit la différence immédiatement !" },
    ],
    moral: "🍌 La leçon de Nano : Une question bien formulée mérite une meilleure réponse !"
  },
  {
    id: 6,
    title: "La Leçon Difficile de Banana",
    wordIds: [13, 14],
    words: ["progressif(ve)", "solliciter"],
    text: [
      { type: "text", content: "Banana introduit les algorithmes de façon " },
      { type: "word", content: "progressive", color: "blue", meaning: "étape par étape" },
      { type: "text", content: ". D'abord les bases, puis les concepts avancés. Quand un élève est perdu, il " },
      { type: "word", content: "sollicite", color: "purple", meaning: "demande de l'aide" },
      { type: "text", content: " l'aide de Banana sans hésiter. Banana sourit : « Très bien ! Demander de l'aide, c'est déjà comprendre qu'on peut progresser. »" },
    ],
    moral: "🍌 La leçon de Banana : Avancer lentement mais sûrement, c'est toujours avancer !"
  },
  {
    id: 7,
    title: "Nano Met en Pratique",
    wordIds: [15, 16],
    words: ["mettre en œuvre", "comprendre"],
    text: [
      { type: "text", content: "Nano veut " },
      { type: "word", content: "mettre en œuvre", color: "orange", meaning: "appliquer concrètement" },
      { type: "text", content: " tout ce qu'il a appris. Mais d'abord, il doit vraiment " },
      { type: "word", content: "comprendre", color: "blue", meaning: "saisir le sens profond" },
      { type: "text", content: " la règle, pas juste la mémoriser. « Je vais relire trois fois jusqu'à ce que ça soit clair ! » dit-il. Et quand il commence à pratiquer, tout coule naturellement." },
    ],
    moral: "🍌 La leçon de Nano : Comprendre d'abord, mémoriser ensuite !"
  },
  {
    id: 8,
    title: "Banana Fait une Synthèse",
    wordIds: [17, 18],
    words: ["synthèse", "distinguer"],
    text: [
      { type: "text", content: "À la fin du cours, Banana fait une " },
      { type: "word", content: "synthèse", color: "purple", meaning: "résumé des points clés" },
      { type: "text", content: " claire au tableau. Il apprend aussi à ses élèves à " },
      { type: "word", content: "distinguer", color: "orange", meaning: "reconnaître les différences" },
      { type: "text", content: " l'essentiel de l'accessoire. « Retenez les deux points clés, le reste viendra naturellement. » Les élèves repartent avec une vision nette du cours." },
    ],
    moral: "🍌 La leçon de Banana : Un bon résumé vaut mieux que dix pages de notes !"
  },
  {
    id: 9,
    title: "Nano Structure son Discours",
    wordIds: [19, 20],
    words: ["structurer", "autonomie"],
    text: [
      { type: "text", content: "Nano apprend à " },
      { type: "word", content: "structurer", color: "blue", meaning: "organiser logiquement" },
      { type: "text", content: " ses explications : introduction, développement, conclusion. Banana lui dit : « Tu développes aussi l' " },
      { type: "word", content: "autonomie", color: "purple", meaning: "capacité à agir seul" },
      { type: "text", content: " de tes élèves quand tu les laisses découvrir par eux-mêmes ! » Nano essaie et voit ses élèves résoudre des problèmes seuls avec fierté." },
    ],
    moral: "🍌 La leçon de Nano : Un élève autonome est un élève qui a vraiment appris !"
  },
  {
    id: 10,
    title: "Banana l'Encourageant",
    wordIds: [21, 22],
    words: ["concis(e)", "interagir"],
    text: [
      { type: "text", content: "Banana parle de façon " },
      { type: "word", content: "concise", color: "orange", meaning: "bref mais complet" },
      { type: "text", content: " : pas de mots inutiles, juste l'essentiel. Il encourage aussi ses élèves à " },
      { type: "word", content: "interagir", color: "blue", meaning: "échanger entre eux" },
      { type: "text", content: " entre eux. « Discutez avec votre voisin ! Expliquez-vous mutuellement. » La classe devient vivante et chaleureuse. Nano observe avec admiration." },
    ],
    moral: "🍌 La leçon de Banana : Quand les élèves se parlent, ils apprennent deux fois plus !"
  },
  {
    id: 11,
    title: "Nano Identifie les Lacunes",
    wordIds: [23, 24],
    words: ["lacune", "rigoureux(se)"],
    text: [
      { type: "text", content: "Nano découvre que certains élèves ont une " },
      { type: "word", content: "lacune", color: "purple", meaning: "manque de connaissance" },
      { type: "text", content: " importante en conjugaison. Il devient alors " },
      { type: "word", content: "rigoureux", color: "blue", meaning: "précis et sérieux" },
      { type: "text", content: " dans sa révision : il prépare des exercices ciblés, vérifie chaque réponse, et donne un retour personnalisé. Après une semaine, les progrès sont visibles !" },
    ],
    moral: "🍌 La leçon de Nano : Identifier le problème est la première étape de la solution !"
  },
  {
    id: 12,
    title: "Banana Consolide les Bases",
    wordIds: [25, 26],
    words: ["consolider", "exigence"],
    text: [
      { type: "text", content: "Banana décide de " },
      { type: "word", content: "consolider", color: "blue", meaning: "renforcer les acquis" },
      { type: "text", content: " les bases avant d'avancer. Il maintient un haut niveau d'" },
      { type: "word", content: "exigence", color: "purple", meaning: "qualité attendue" },
      { type: "text", content: " tout en restant bienveillant : « Je crois en vous. C'est justement parce que je sais que vous pouvez mieux faire que je vous demande plus. »" },
    ],
    moral: "🍌 La leçon de Banana : L'exigence bienveillante, c'est croire en le potentiel de chacun !"
  },
  {
    id: 13,
    title: "Nano le Détective des Mots",
    wordIds: [28, 29],
    words: ["animer", "séquence"],
    text: [
      { type: "text", content: "Nano doit " },
      { type: "word", content: "animer", color: "blue", meaning: "diriger avec énergie" },
      { type: "text", content: " une " },
      { type: "word", content: "séquence", color: "purple", meaning: "suite d'activités pédagogiques" },
      { type: "text", content: " de trois séances sur les homophones. Il prépare des jeux, des défis et des histoires. La classe est captivée ! Banana dit : « Nano, tu es né pour enseigner ! »" },
    ],
    moral: "🍌 La leçon de Nano : Quand on aime ce qu'on fait, les élèves le ressentent !"
  },
  {
    id: 14,
    title: "Banana Cherche l'Efficacité",
    wordIds: [30, 31],
    words: ["efficace", "identifier"],
    text: [
      { type: "text", content: "Banana essaie plusieurs méthodes pour trouver la plus " },
      { type: "word", content: "efficace", color: "orange", meaning: "qui produit les meilleurs résultats" },
      { type: "text", content: ". Il doit d'abord " },
      { type: "word", content: "identifier", color: "blue", meaning: "reconnaître précisément" },
      { type: "text", content: " les difficultés de chaque élève. Il prend des notes, pose des questions, observe. Puis il adapte sa méthode. En une semaine, la classe progresse de façon spectaculaire !" },
    ],
    moral: "🍌 La leçon de Banana : Connaître son public, c'est déjà la moitié du chemin !"
  },
  {
    id: 15,
    title: "Nano et les Modalités d'Évaluation",
    wordIds: [32, 34],
    words: ["modalité", "motiver"],
    text: [
      { type: "text", content: "Nano explique les " },
      { type: "word", content: "modalités", color: "purple", meaning: "formes d'organisation" },
      { type: "text", content: " de l'évaluation à ses élèves. Il veut aussi les " },
      { type: "word", content: "motiver", color: "orange", meaning: "donner envie de s'améliorer" },
      { type: "text", content: " : « Ce n'est pas une punition, c'est une occasion de voir vos progrès ! » Les élèves, rassurés, abordent le test avec sérénité." },
    ],
    moral: "🍌 La leçon de Nano : Une évaluation bien expliquée, c'est une évaluation moins stressante !"
  },
  {
    id: 16,
    title: "Banana Contextualise",
    wordIds: [35, 36],
    words: ["contexte", "analytique"],
    text: [
      { type: "text", content: "Banana replace toujours chaque concept dans son " },
      { type: "word", content: "contexte", color: "blue", meaning: "ensemble des circonstances" },
      { type: "text", content: ". Il adopte une approche " },
      { type: "word", content: "analytique", color: "purple", meaning: "qui décompose pour comprendre" },
      { type: "text", content: " : il décompose le problème en petites parties avant de les réassembler. Nano regarde et pense : « Je dois absolument apprendre à faire ça ! »" },
    ],
    moral: "🍌 La leçon de Banana : Pour comprendre le tout, commence par les parties !"
  },
  {
    id: 17,
    title: "Nano Renforce son Vocabulaire",
    wordIds: [37, 38],
    words: ["renforcer", "initiative"],
    text: [
      { type: "text", content: "Nano décide de " },
      { type: "word", content: "renforcer", color: "blue", meaning: "rendre plus solide" },
      { type: "text", content: " son vocabulaire en prenant des initiatives. Sur sa propre " },
      { type: "word", content: "initiative", color: "purple", meaning: "action spontanée et autonome" },
      { type: "text", content: ", il crée des fiches de vocabulaire avec des illustrations. Banana est impressionné : « C'est exactement ce qu'il faut faire ! Tu es en train de devenir un vrai enseignant. »" },
    ],
    moral: "🍌 La leçon de Nano : La meilleure méthode est souvent celle qu'on invente soi-même !"
  },
  {
    id: 18,
    title: "Banana et les Verbes Irréguliers",
    wordIds: [40, 41],
    words: ["approfondir", "illustration"],
    text: [
      { type: "text", content: "Banana veut " },
      { type: "word", content: "approfondir", color: "blue", meaning: "étudier plus en détail" },
      { type: "text", content: " la leçon sur les verbes irréguliers. Il utilise des " },
      { type: "word", content: "illustrations", color: "purple", meaning: "exemples visuels concrets" },
      { type: "text", content: " amusantes pour chaque verbe : « Aller = une banane qui court vite ! » Les élèves rient et retiennent facilement. Nano prend des notes enthousiastes." },
    ],
    moral: "🍌 La leçon de Banana : Une bonne image reste gravée dans la mémoire !"
  },
  {
    id: 19,
    title: "Nano Aborde un Nouveau Sujet",
    wordIds: [43, 44],
    words: ["aborder", "précision"],
    text: [
      { type: "text", content: "Nano doit " },
      { type: "word", content: "aborder", color: "blue", meaning: "commencer à traiter" },
      { type: "text", content: " le chapitre sur les accords avec " },
      { type: "word", content: "précision", color: "purple", meaning: "clarté et exactitude" },
      { type: "text", content: ". Il commence par une mise en situation : « Imaginez que les mots sont une équipe de foot — ils doivent tous porter le même maillot ! » La classe éclate de rire et comprend immédiatement." },
    ],
    moral: "🍌 La leçon de Nano : Une bonne analogie transforme le difficile en simple !"
  },
  {
    id: 20,
    title: "Banana Mémorise les Règles",
    wordIds: [46, 47],
    words: ["mémoriser", "explication"],
    text: [
      { type: "text", content: "Banana enseigne une technique pour " },
      { type: "word", content: "mémoriser", color: "blue", meaning: "retenir durablement" },
      { type: "text", content: " les règles : des acronymes, des rimes, des histoires. Il donne une " },
      { type: "word", content: "explication", color: "purple", meaning: "développement pour faire comprendre" },
      { type: "text", content: " pour chaque règle. Nano adopte cette méthode immédiatement. Le soir, il s'endort en murmurant ses règles de grammaire avec un sourire." },
    ],
    moral: "🍌 La leçon de Banana : Ce qu'on retient avec plaisir, on ne l'oublie jamais !"
  },
  {
    id: 21,
    title: "Nano Implique ses Élèves",
    wordIds: [49, 50],
    words: ["impliquer", "nuance"],
    text: [
      { type: "text", content: "Nano cherche des façons d'" },
      { type: "word", content: "impliquer", color: "blue", meaning: "faire participer activement" },
      { type: "text", content: " tous ses élèves. Il leur apprend aussi à voir les " },
      { type: "word", content: "nuances", color: "purple", meaning: "différences subtiles" },
      { type: "text", content: " dans la langue : « Ce n'est pas 'correct ou faux', c'est parfois 'plutôt mieux' ! » Les élèves développent un sens critique fin et apprennent à nuancer leurs réponses." },
    ],
    moral: "🍌 La leçon de Nano : La nuance, c'est la marque d'une vraie intelligence !"
  },
  {
    id: 22,
    title: "Banana Stimule la Curiosité",
    wordIds: [51, 52],
    words: ["stimuler", "observable"],
    text: [
      { type: "text", content: "Banana cherche à " },
      { type: "word", content: "stimuler", color: "blue", meaning: "activer et encourager" },
      { type: "text", content: " la curiosité de ses élèves. Il leur propose des défis " },
      { type: "word", content: "observables", color: "purple", meaning: "qui peuvent être constatés" },
      { type: "text", content: " : « Comptez combien de fois vous entendez le son 'on' dans cette chanson ! » Les élèves sont tout ouïe, actifs et enthousiastes." },
    ],
    moral: "🍌 La leçon de Banana : La curiosité est le moteur de tout apprentissage !"
  },
  {
    id: 23,
    title: "Nano Parvient à Ses Fins",
    wordIds: [54, 55],
    words: ["parvenir", "concentration"],
    text: [
      { type: "text", content: "Nano met toute sa " },
      { type: "word", content: "concentration", color: "purple", meaning: "attention focalisée" },
      { type: "text", content: " pour " },
      { type: "word", content: "parvenir", color: "blue", meaning: "réussir à atteindre" },
      { type: "text", content: " à maîtriser le subjonctif — la bête noire de tous les apprenants. Après deux semaines de pratique intensive, il y arrive ! Banana l'applaudit chaleureusement." },
    ],
    moral: "🍌 La leçon de Nano : La concentration plus la persévérance = le succès assuré !"
  },
  {
    id: 24,
    title: "Banana Illustre avec Logique",
    wordIds: [57, 56],
    words: ["illustrer", "logique"],
    text: [
      { type: "text", content: "Banana utilise une démarche " },
      { type: "word", content: "logique", color: "orange", meaning: "rationnelle et cohérente" },
      { type: "text", content: " pour " },
      { type: "word", content: "illustrer", color: "blue", meaning: "rendre plus clair par un exemple" },
      { type: "text", content: " chaque règle grammaticale. « D'abord la règle, puis l'exemple, puis l'exercice. Toujours dans le même ordre ! » Les élèves savent exactement à quoi s'attendre." },
    ],
    moral: "🍌 La leçon de Banana : Une structure logique rassure et facilite l'apprentissage !"
  },
  {
    id: 25,
    title: "Nano Développe les Compétences Orales",
    wordIds: [58, 59],
    words: ["compétence", "précis(e)"],
    text: [
      { type: "text", content: "Nano travaille sur une " },
      { type: "word", content: "compétence", color: "purple", meaning: "savoir-faire acquis" },
      { type: "text", content: " fondamentale : parler de façon " },
      { type: "word", content: "précise", color: "orange", meaning: "exacte et sans ambiguïté" },
      { type: "text", content: " à l'oral. Il s'entraîne devant un miroir, chronométre ses interventions et note ses hésitations. Banana l'écoute et lui donne des retours bienveillants." },
    ],
    moral: "🍌 La leçon de Nano : S'entraîner seul d'abord pour briller en public !"
  },
  {
    id: 26,
    title: "Banana Démontre par l'Exemple",
    wordIds: [60, 61],
    words: ["démontrer", "objectif"],
    text: [
      { type: "text", content: "Banana aime " },
      { type: "word", content: "démontrer", color: "blue", meaning: "prouver par des exemples" },
      { type: "text", content: " plutôt que simplement affirmer. Il fixe un " },
      { type: "word", content: "objectif", color: "purple", meaning: "but précis à atteindre" },
      { type: "text", content: " clair pour chaque séance et le communique dès le début : « À la fin de ce cours, vous saurez conjuguer 'être' et 'avoir' parfaitement. » Les élèves savent où ils vont." },
    ],
    moral: "🍌 La leçon de Banana : Un objectif clair donne du sens à chaque exercice !"
  },
  {
    id: 27,
    title: "Nano Résume Brillamment",
    wordIds: [62, 63],
    words: ["résumer", "maîtriser"],
    text: [
      { type: "text", content: "À la fin du cours, Nano sait parfaitement " },
      { type: "word", content: "résumer", color: "blue", meaning: "présenter l'essentiel brièvement" },
      { type: "text", content: " en trois points clés. C'est la preuve qu'il commence à " },
      { type: "word", content: "maîtriser", color: "orange", meaning: "contrôler parfaitement" },
      { type: "text", content: " la matière. Banana lui dit : « Celui qui sait expliquer simplement, a vraiment compris ! » Nano range son cahier avec fierté." },
    ],
    moral: "🍌 La leçon de Nano : Si tu peux l'expliquer clairement, tu le maîtrises vraiment !"
  },
  {
    id: 28,
    title: "Banana Encourage la Pratique",
    wordIds: [64, 65],
    words: ["pratique", "clair(e)"],
    text: [
      { type: "text", content: "Banana dit à ses élèves : « La théorie sans " },
      { type: "word", content: "pratique", color: "purple", meaning: "application concrète" },
      { type: "text", content: " n'est qu'une illusion. » Ses consignes sont toujours " },
      { type: "word", content: "claires", color: "orange", meaning: "faciles à comprendre" },
      { type: "text", content: " et précises. Les élèves savent exactement quoi faire et comment le faire. Nano observe : « Je veux être un prof comme Banana ! »" },
    ],
    moral: "🍌 La leçon de Banana : Pratique + clarté = progression rapide et durable !"
  },
  {
    id: 29,
    title: "Nano Réfléchit Avant d'Agir",
    wordIds: [66, 67],
    words: ["réfléchir", "dynamique"],
    text: [
      { type: "text", content: "Nano apprend à " },
      { type: "word", content: "réfléchir", color: "blue", meaning: "penser profondément" },
      { type: "text", content: " avant de répondre. Mais il reste " },
      { type: "word", content: "dynamique", color: "purple", meaning: "plein d'énergie" },
      { type: "text", content: " : il lève la main avec enthousiasme dès qu'il a trouvé la réponse. Banana sourit : « L'équilibre entre la réflexion et l'action, c'est ça la vraie intelligence ! »" },
    ],
    moral: "🍌 La leçon de Nano : Prends le temps de réfléchir, mais n'attends pas la perfection !"
  },
  {
    id: 30,
    title: "Banana Adapte son Discours",
    wordIds: [68, 69],
    words: ["adapter", "analyser"],
    text: [
      { type: "text", content: "Banana sait toujours " },
      { type: "word", content: "adapter", color: "blue", meaning: "modifier pour mieux convenir" },
      { type: "text", content: " son discours. Il " },
      { type: "word", content: "analyse", color: "orange", meaning: "étudie en détail" },
      { type: "text", content: " les réactions de ses élèves pour ajuster son niveau de langue. « Si je vois des fronts plissés, je simplifie. Si je vois des bâillements, j'accélère ! »" },
    ],
    moral: "🍌 La leçon de Banana : Lire son public en temps réel, c'est l'art du grand enseignant !"
  },
  {
    id: 31,
    title: "Nano Choisit la Bonne Méthode",
    wordIds: [70, 71],
    words: ["méthode", "global(e)"],
    text: [
      { type: "text", content: "Nano teste différentes " },
      { type: "word", content: "méthodes", color: "purple", meaning: "façons d'atteindre un objectif" },
      { type: "text", content: " d'apprentissage. Il adopte une vision " },
      { type: "word", content: "globale", color: "orange", meaning: "qui prend en compte l'ensemble" },
      { type: "text", content: " : comprendre le chapitre en entier avant de rentrer dans les détails. Banana approuve : « Vue d'ensemble, puis zoom sur les détails. C'est la méthode des experts ! »" },
    ],
    moral: "🍌 La leçon de Nano : Commence toujours par voir la forêt avant de regarder les arbres !"
  },
  {
    id: 32,
    title: "Banana Encourage sans Relâche",
    wordIds: [72, 73],
    words: ["encourager", "application"],
    text: [
      { type: "text", content: "Banana ne manque jamais d'" },
      { type: "word", content: "encourager", color: "blue", meaning: "inspirer et soutenir" },
      { type: "text", content: " ses élèves, même lors de l'" },
      { type: "word", content: "application", color: "purple", meaning: "mise en pratique" },
      { type: "text", content: " des exercices les plus difficiles. « Chaque erreur est un pas vers la réussite ! » Nano, touché, note cette phrase dans son carnet. Il la dit souvent à ses propres élèves par la suite." },
    ],
    moral: "🍌 La leçon de Banana : Les mots d'encouragement ont un pouvoir immense !"
  },
  {
    id: 33,
    title: "Nano Observe Attentivement",
    wordIds: [75, 76],
    words: ["observer", "feedback"],
    text: [
      { type: "text", content: "Nano aime " },
      { type: "word", content: "observer", color: "blue", meaning: "regarder attentivement" },
      { type: "text", content: " ses élèves pendant les exercices. Il leur donne ensuite un " },
      { type: "word", content: "feedback", color: "purple", meaning: "retour d'information" },
      { type: "text", content: " détaillé et bienveillant. « Bravo pour l'effort ! Mais attention à l'accord du participe. Regarde : voici comment corriger. » Les élèves progressent à chaque séance." },
    ],
    moral: "🍌 La leçon de Nano : Observer sans juger, corriger sans décourager !"
  },
  {
    id: 34,
    title: "Banana Donne une Critique Constructive",
    wordIds: [77, 78],
    words: ["constructif(ve)", "progresser"],
    text: [
      { type: "text", content: "Banana donne toujours des retours " },
      { type: "word", content: "constructifs", color: "orange", meaning: "qui aident à avancer" },
      { type: "text", content: ". Son but est d'aider chaque élève à " },
      { type: "word", content: "progresser", color: "blue", meaning: "s'améliorer graduellement" },
      { type: "text", content: ". « Ce n'est pas 'tu as tort', c'est 'voici comment tu peux t'améliorer'. » Nano apprend à changer son discours de la même façon." },
    ],
    moral: "🍌 La leçon de Banana : Une critique bien formulée est un cadeau précieux !"
  },
  {
    id: 35,
    title: "Nano et la Bienveillance",
    wordIds: [79, 80],
    words: ["bienveillance", "compréhensible"],
    text: [
      { type: "text", content: "Nano crée un climat de " },
      { type: "word", content: "bienveillance", color: "purple", meaning: "gentillesse et soutien" },
      { type: "text", content: " dans sa classe. Ses explications sont toujours " },
      { type: "word", content: "compréhensibles", color: "orange", meaning: "faciles à saisir" },
      { type: "text", content: " par tous. Un élève timide lève la main pour la première fois. Nano lui sourit et dit : « Excellent ! Ta question est très pertinente. » L'élève rayonne de fierté." },
    ],
    moral: "🍌 La leçon de Nano : Un professeur bienveillant ouvre les portes que la peur avait fermées !"
  },
  {
    id: 36,
    title: "Banana Rend les Choses Accessibles",
    wordIds: [83, 84],
    words: ["accessible", "cibler"],
    text: [
      { type: "text", content: "Banana veut rendre le français " },
      { type: "word", content: "accessible", color: "blue", meaning: "facile à comprendre" },
      { type: "text", content: " à tous ses élèves. Il " },
      { type: "word", content: "cible", color: "orange", meaning: "vise précisément" },
      { type: "text", content: " les difficultés spécifiques de chacun plutôt que de donner un cours générique. « Je ne donne pas le même cours à tout le monde — je donne le bon cours à chacun ! »" },
    ],
    moral: "🍌 La leçon de Banana : La différenciation pédagogique, c'est la vraie justice !"
  },
  {
    id: 37,
    title: "Nano et l'Implication des Élèves",
    wordIds: [85, 86],
    words: ["implication", "actif(ve)"],
    text: [
      { type: "text", content: "Nano mesure l'" },
      { type: "word", content: "implication", color: "purple", meaning: "engagement et participation" },
      { type: "text", content: " de ses élèves. Il veut des apprenants " },
      { type: "word", content: "actifs", color: "orange", meaning: "qui participent et agissent" },
      { type: "text", content: " plutôt que passifs. Il crée des situations où les élèves FONT plutôt que regardent. Banana lui dit : « C'est ça la pédagogie active ! Tu as tout compris. »" },
    ],
    moral: "🍌 La leçon de Nano : Apprendre en faisant, c'est apprendre pour de vrai !"
  },
  {
    id: 38,
    title: "Banana Incarne ses Valeurs",
    wordIds: [87, 88],
    words: ["incarner", "patience"],
    text: [
      { type: "text", content: "Banana " },
      { type: "word", content: "incarne", color: "blue", meaning: "représente concrètement" },
      { type: "text", content: " les valeurs qu'il enseigne. Sa " },
      { type: "word", content: "patience", color: "purple", meaning: "capacité à attendre sans s'énerver" },
      { type: "text", content: " est légendaire. Même après la dixième explication du même point, il sourit toujours. Nano pense : « C'est ça qu'il faut que j'apprenne aussi. »" },
    ],
    moral: "🍌 La leçon de Banana : On n'enseigne pas ce qu'on sait, on enseigne ce qu'on est !"
  },
  {
    id: 39,
    title: "Nano Partage son Savoir",
    wordIds: [93, 94],
    words: ["partager", "qualité"],
    text: [
      { type: "text", content: "Nano décide de " },
      { type: "word", content: "partager", color: "blue", meaning: "donner une partie à d'autres" },
      { type: "text", content: " ses fiches de révision avec ses collègues. La " },
      { type: "word", content: "qualité", color: "purple", meaning: "excellence et soin" },
      { type: "text", content: " de ses documents impressionne tout le monde. Banana lui dit : « Savoir partager son savoir, c'est la plus grande qualité d'un enseignant ! »" },
    ],
    moral: "🍌 La leçon de Nano : Le savoir partagé est un savoir multiplié !"
  },
  {
    id: 40,
    title: "Banana Persévère",
    wordIds: [98, 99],
    words: ["persévérer", "excellence"],
    text: [
      { type: "text", content: "Banana vise toujours l'" },
      { type: "word", content: "excellence", color: "blue", meaning: "qualité supérieure" },
      { type: "text", content: " et sait qu'il faut " },
      { type: "word", content: "persévérer", color: "orange", meaning: "continuer malgré les obstacles" },
      { type: "text", content: " pour y arriver. Un jour difficile, il dit à Nano : « Je n'ai pas réussi aujourd'hui, mais j'ai appris ce qui ne marche pas. Demain sera meilleur ! » Et le lendemain est toujours meilleur." },
    ],
    moral: "🍌 La leçon de Banana : L'excellence n'est pas un état — c'est un voyage quotidien !"
  },
  {
    id: 41,
    title: "Nano et la Persévérance",
    wordIds: [100, 96],
    words: ["persévérance", "explorer"],
    text: [
      { type: "text", content: "Nano comprend que la " },
      { type: "word", content: "persévérance", color: "purple", meaning: "qualité de celui qui ne lâche pas" },
      { type: "text", content: " est sa plus grande force. Il n'a pas peur d'" },
      { type: "word", content: "explorer", color: "blue", meaning: "aller à la découverte" },
      { type: "text", content: " de nouvelles méthodes. Chaque jour, il essaie quelque chose de nouveau. Certains jours, ça marche. D'autres non. Mais il ne s'arrête jamais." },
    ],
    moral: "🍌 La leçon de Nano : Celui qui explore avec persévérance finit toujours par trouver !"
  },
  {
    id: 42,
    title: "Banana Explicite ses Intentions",
    wordIds: [81, 82],
    words: ["expliciter", "diversité"],
    text: [
      { type: "text", content: "Banana prend le temps d'" },
      { type: "word", content: "expliciter", color: "blue", meaning: "rendre clair ce qui est implicite" },
      { type: "text", content: " ses attentes. Il valorise aussi la " },
      { type: "word", content: "diversité", color: "purple", meaning: "variété des approches et des profils" },
      { type: "text", content: " dans sa classe : « Chacun apprend différemment et c'est une richesse ! » Nano réalise que la diversité est une force et non un obstacle." },
    ],
    moral: "🍌 La leçon de Banana : La diversité est la richesse de toute communauté apprenante !"
  },
  {
    id: 43,
    title: "Nano Découvre les Nuances",
    wordIds: [97, 95],
    words: ["nuancé(e)", "simultané(e)"],
    text: [
      { type: "text", content: "Nano apprend à avoir un regard " },
      { type: "word", content: "nuancé", color: "purple", meaning: "subtil, ni tout blanc ni tout noir" },
      { type: "text", content: " sur les erreurs de ses élèves. Il gère " },
      { type: "word", content: "simultanément", color: "orange", meaning: "en même temps" },
      { type: "text", content: " plusieurs groupes d'élèves avec des besoins différents. C'est difficile mais Banana l'aide : « Tu développes le don de la multiplicité ! »" },
    ],
    moral: "🍌 La leçon de Nano : Voir la complexité et y répondre avec souplesse, c'est le vrai talent !"
  },
  {
    id: 44,
    title: "Banana Investit dans l'Avenir",
    wordIds: [92, 90],
    words: ["investissement", "finalité"],
    text: [
      { type: "text", content: "Banana voit son travail d'enseignant comme un " },
      { type: "word", content: "investissement", color: "blue", meaning: "effort pour un bénéfice futur" },
      { type: "text", content: " sur le long terme. La " },
      { type: "word", content: "finalité", color: "purple", meaning: "le but ultime" },
      { type: "text", content: " n'est pas le diplôme — c'est de former des êtres humains accomplis. Nano est ému : « C'est pour ça que j'ai choisi ce métier. »" },
    ],
    moral: "🍌 La leçon de Banana : Enseigner, c'est planter des graines dont on ne verra pas toujours les fleurs !"
  },
  {
    id: 45,
    title: "Nano Formalise ses Objectifs",
    wordIds: [91, 89],
    words: ["formaliser", "cohérent(e)"],
    text: [
      { type: "text", content: "Nano décide de " },
      { type: "word", content: "formaliser", color: "blue", meaning: "mettre en forme officielle" },
      { type: "text", content: " ses objectifs de progression. Chaque objectif est " },
      { type: "word", content: "cohérent", color: "orange", meaning: "logique et sans contradiction" },
      { type: "text", content: " avec le précédent. Banana vérifie son plan et dit : « Tu es en train de construire une trajectoire de développement professionnelle. Bravo ! »" },
    ],
    moral: "🍌 La leçon de Nano : Un plan clair est le meilleur allié de la réussite !"
  },
  {
    id: 46,
    title: "Banana Stimule les Interactions",
    wordIds: [53, 63],
    words: ["interaction", "maîtriser"],
    text: [
      { type: "text", content: "Banana favorise les " },
      { type: "word", content: "interactions", color: "blue", meaning: "échanges mutuels" },
      { type: "text", content: " entre élèves pour les aider à " },
      { type: "word", content: "maîtriser", color: "orange", meaning: "parfaitement contrôler" },
      { type: "text", content: " les concepts. Il organise des débats courts, des jeux de rôles, des binômes. La classe devient une communauté d'apprentissage vivante et efficace." },
    ],
    moral: "🍌 La leçon de Banana : Ensemble, on maîtrise mieux qu'en solo !"
  },
  {
    id: 47,
    title: "Nano Développe la Bienveillance",
    wordIds: [79, 72],
    words: ["bienveillance", "encourager"],
    text: [
      { type: "text", content: "Nano cultive la " },
      { type: "word", content: "bienveillance", color: "purple", meaning: "disposition favorable envers autrui" },
      { type: "text", content: " chaque jour. Il cherche toujours à " },
      { type: "word", content: "encourager", color: "blue", meaning: "inspirer à continuer" },
      { type: "text", content: " ses élèves plutôt qu'à les décourager. Même les jours difficiles, il trouve quelque chose de positif à dire. C'est son super pouvoir !" },
    ],
    moral: "🍌 La leçon de Nano : Un mot gentil peut changer toute la journée d'un élève !"
  },
  {
    id: 48,
    title: "Banana Consolide et Renforce",
    wordIds: [25, 37],
    words: ["consolider", "renforcer"],
    text: [
      { type: "text", content: "Banana consacre toujours les dernières minutes du cours à " },
      { type: "word", content: "consolider", color: "blue", meaning: "rendre plus solide" },
      { type: "text", content: " et " },
      { type: "word", content: "renforcer", color: "purple", meaning: "intensifier les acquis" },
      { type: "text", content: " les apprentissages du jour. Il pose des questions rapides, fait des mini-jeux, distribue des petits défis. Les élèves partent le sourire aux lèvres et les idées bien ancrées." },
    ],
    moral: "🍌 La leçon de Banana : Finir en beauté, c'est ce qu'on retient le mieux !"
  },
  {
    id: 49,
    title: "Nano Atteint son Objectif",
    wordIds: [54, 78],
    words: ["parvenir", "progresser"],
    text: [
      { type: "text", content: "Nano " },
      { type: "word", content: "parvient", color: "blue", meaning: "réussit à atteindre son but" },
      { type: "text", content: " enfin à maîtriser la grammaire avancée ! Il a mis trois mois pour " },
      { type: "word", content: "progresser", color: "orange", meaning: "s'améliorer graduellement" },
      { type: "text", content: " à ce niveau. Banana lui offre une médaille en chocolat : « Tu l'as mérité ! Maintenant tu peux enseigner avec confiance. »" },
    ],
    moral: "🍌 La leçon de Nano : Chaque progrès, même petit, mérite d'être célébré !"
  },
  {
    id: 50,
    title: "Nano et Banana Fêtent leur Progression",
    wordIds: [99, 100],
    words: ["excellence", "persévérance"],
    text: [
      { type: "text", content: "Au terme de leur voyage, Nano et Banana célèbrent ensemble. Ils ont atteint l'" },
      { type: "word", content: "excellence", color: "blue", meaning: "qualité supérieure" },
      { type: "text", content: " grâce à leur " },
      { type: "word", content: "persévérance", color: "purple", meaning: "détermination sans faille" },
      { type: "text", content: " quotidienne. « Nous avons prouvé qu'il n'y a pas de secret, dit Banana. Juste du travail, de la passion et de la bienveillance. » Nano sourit et dit : « Et beaucoup d'histoires de bananes ! »" },
    ],
    moral: "🍌 La leçon de Nano & Banana : Le voyage de l'apprentissage ne finit jamais — et c'est ça sa magie !"
  }
];

// ───────────────────────────────────────────────────────────────────────────────
// LESSONS CONFIG — 4 AI-generated lesson definitions
// ───────────────────────────────────────────────────────────────────────────────
export const LESSONS_CONFIG = [
  {
    id: "lesson_conjugation",
    title: "Parler & Conjuguer sans Faute",
    subtitle: "Les verbes clés à l'oral et leurs pièges",
    icon: "🗣️",
    color: "blue",
    image: "/images/languages/banana_conjugation.png"
  },
  {
    id: "lesson_gender",
    title: "Le Masculin et le Féminin",
    subtitle: "Éviter les erreurs de genre dans la parole",
    icon: "⚥",
    color: "purple",
    image: "/images/languages/banana_gender.png"
  },
  {
    id: "lesson_structure",
    title: "Structurer ses Phrases à l'Oral",
    subtitle: "Syntaxe, prépositions et négations formelles",
    icon: "🧩",
    color: "orange",
    image: "/images/languages/banana_structure.png"
  },
  {
    id: "lesson_agreement",
    title: "L'Accord des Adjectifs et Participes",
    subtitle: "Les consonnes finales qui s'activent au féminin",
    icon: "✍️",
    color: "green",
    image: "/images/languages/banana_agreement.png"
  }
];

export const PRESTORED_LESSONS = {
  lesson_conjugation: {
    lesson_id: "lesson_conjugation",
    title: "Parler & Conjuguer sans Faute en Classe",
    intro: "En tant qu'enseignant, la précision verbale à l'oral est votre première carte de visite. Maîtriser les temps, les verbes irréguliers et les formules d'explication donne une image d'autorité bienveillante et de professionnalisme irréprochable devant vos élèves et vos collègues.",
    pedagogical_context: "Un professeur qui conjugue sans hésitation inspire confiance. Lorsqu'on explique une notion au tableau, l'attention des élèves se fixe sur votre langage. Utiliser des temps précis (présent de vérité générale, subjonctif après l'obligation, conditionnel de politesse) aide les élèves à structurer leur propre pensée.",
    rule: "1. À l'oral formel, les verbes de modalité (devoir, pouvoir, vouloir, savoir) sont TOUJOURS suivis directement de l'infinitif sans préposition (jamais 'de' ou 'à').\n2. Les verbes de mouvement (partir, aller, venir, arriver) se conjuguent au passé composé avec l'auxiliaire 'être' et s'accordent avec le sujet.\n3. Après 'SI' exprimant une condition, on utilise l'imparfait (jamais le conditionnel en 'rai').",
    word_distinctions: [
      {
        pair: "Apprendre vs Enseigner",
        difference: "Le professeur ENSEIGNE (il donne le savoir), tandis que l'élève APPREND (il reçoit et acquiert le savoir). Ne dites jamais 'Je vais vous apprendre la leçon' si vous voulez dire 'Je vais vous enseigner/expliquer la leçon'.",
        example: "Le professeur enseigne les algorithmes et l'élève apprend à les coder."
      },
      {
        pair: "Savoir vs Connaître",
        difference: "SAVOIR est suivi d'un verbe à l'infinitif ou d'une proposition (savoir faire, savoir que...). CONNAÎTRE est suivi d'un nom direct (connaître une règle, connaître un élève).",
        example: "Je connais ce chapitre et je sais résoudre ce problème."
      },
      {
        pair: "Se rappeler de (faux) vs Se souvenir de (correct)",
        difference: "On dit 'se rappeler QUELQUE CHOSE' (sans 'de') ou 'se souvenir DE quelque chose'. Dire 'Je me rappelle de ce cours' est une faute très courante à éviter !",
        example: "Je me rappelle cette leçon / Je me souviens de cette leçon."
      }
    ],
    conjugation_tables: [
      {
        verb: "TRANSMETTRE (3e groupe)",
        tense: "Présent de l'indicatif (Usage : expliquer)",
        forms: [
          "Je transmets",
          "Tu transmets",
          "Il / Elle transmet",
          "Nous transmettons",
          "Vous transmettez",
          "Ils / Elles transmettent"
        ],
        note: "Attention au 't' seul à la 3e personne du singulier : 'Il transmet' (pas de 's')."
      },
      {
        verb: "EXPLIQUER (1er groupe)",
        tense: "Subjonctif Présent (Usage : obligation)",
        forms: [
          "Que j'explique",
          "Que tu expliques",
          "Qu'il / elle explique",
          "Que nous expliquions",
          "Que vous expliquiez",
          "Qu'ils / elles expliquent"
        ],
        note: "Indispensable après 'Il faut que...' : 'Il faut que vous expliquiez clairement.'"
      },
      {
        verb: "SAVOIR (3e groupe)",
        tense: "Présent de l'indicatif (Usage : compétences)",
        forms: [
          "Je sais",
          "Tu sais",
          "Il / Elle sait",
          "Nous savons",
          "Vous savez",
          "Ils / Elles savent"
        ],
        note: "Participe passé : su. Imparfait : je savais, nous savions."
      },
      {
        verb: "DEVOIR (3e groupe)",
        tense: "Conditionnel Présent (Usage : conseil poli)",
        forms: [
          "Je devrais",
          "Tu devrais",
          "Il / Elle devrait",
          "Nous devrions",
          "Vous devriez",
          "Ils / Elles devraient"
        ],
        note: "Formulation idéale pour conseiller un élève sans être autoritaire : 'Vous devriez revoir ce point.'"
      }
    ],
    classroom_dialogues: [
      {
        situation: "Donner une consigne orale de révision en début de cours",
        dialogue: "« Chers élèves, avant de démarrer la séance, je veux que vous preniez vos cahiers. Si vous aviez des questions sur le chapitre précédent, nous les aborderons ensemble. »",
        analysis: "Utilisation parfaite du subjonctif ('preniez') après 'je veux que' et de l'imparfait ('aviez') après 'si'."
      },
      {
        situation: "Rappeler une règle de travail à un groupe d'élèves",
        dialogue: "« Pour réussir cet exercice, vous devez appliquer la démarche étape par étape. Si vous suiviez cette méthode, vous éviteriez les erreurs de syntaxe. »",
        analysis: "Emploi direct de 'devez + infinitif' et respect du couple 'Si + imparfait → conditionnel'."
      }
    ],
    examples: [
      {
        wrong: "Je dois de préparer mon cours.",
        correct: "Je dois préparer mon cours.",
        explanation: "Devoir + infinitif direct. Jamais de 'de' entre devoir et l'infinitif."
      },
      {
        wrong: "Elle a parti à l'école à 8 heures.",
        correct: "Elle est partie à l'école à 8 heures.",
        explanation: "Partir exprime un déplacement : il se conjugue obligatoirement avec 'être' et s'accorde au féminin ('partie')."
      },
      {
        wrong: "Si j'aurais du temps, je réviserais.",
        correct: "Si j'avais du temps, je réviserais.",
        explanation: "La règle d'or : les 'si' n'aiment pas les 'rai'. Après 'si' de condition, on utilise l'imparfait, jamais le conditionnel."
      },
      {
        wrong: "Je me rappelle de cette formule.",
        correct: "Je me rappelle cette formule (ou Je me souviens de cette formule).",
        explanation: "'Se rappeler' ne prend pas la préposition 'de'. On se rappelle quelque chose."
      }
    ],
    astuce: "Règle mnémonique : 'Les SI n'aiment pas les RAI !' → Si j'AVAIS (imparfait), je FERAIS (conditionnel). Et 'Je me RAPPELLE le cours' sans 'de' !",
    quiz: [
      {
        question: "Quelle est la forme correcte à l'oral formel d'un enseignant ?",
        options: ["Je peux de vous aider.", "Je peux vous aider.", "Je peux à vous aider.", "Je peux que vous aider."],
        correct: 1,
        explanation: "'Pouvoir' est suivi directement de l'infinitif sans préposition."
      },
      {
        question: "Quelle phrase exprime une différenciation correcte ?",
        options: [
          "Je vais vous apprendre la leçon d'informatique.",
          "Je vais vous enseigner la leçon d'informatique.",
          "L'élève enseigne sa leçon au professeur.",
          "Le professeur apprend le cours aux élèves."
        ],
        correct: 1,
        explanation: "Le professeur enseigne (donne le savoir), l'élève apprend (reçoit le savoir)."
      },
      {
        question: "Complétez : Si les élèves ___ plus attentifs, le cours serait plus efficace.",
        options: ["seraient", "étaient", "sont", "seront"],
        correct: 1,
        explanation: "Après 'si', on utilise l'imparfait ('étaient') suivi du conditionnel ('serait')."
      }
    ],
    motivation: "Chaque verbe bien conjugué renforce votre assurance naturelle et votre crédibilité devant vos élèves. Vous êtes sur la voie de l'excellence !"
  },

  lesson_gender: {
    lesson_id: "lesson_gender",
    title: "Le Masculin et le Féminin dans le Vocabulaire Pédagogique",
    intro: "Les hésitations de genre (un/une, le/la) sont les fautes orales les plus rapidement remarquées lors d'une présentation ou d'un cours. Maîtriser le genre exact des termes académiques et informatiques garantit un discours fluide et naturel.",
    pedagogical_context: "Un enseignant qui dit 'une grand problème' ou 'la thème' perd en crédibilité. De nombreux mots scientifiques et pédagogiques empruntés au grec ou au latin possèdent un genre fixé par leur terminaison. En les retenant par familles, vous ne ferez plus jamais de faute d'accord à l'oral.",
    rule: "1. MASCULINS : Les mots en -ème (le problème, le système, le thème, le programme) et les mots en -age (un espace, un affichage, l'apprentissage).\n2. FÉMININS : Les mots en -ion (une solution, une évaluation, la notion) et les mots en -té (la qualité, la compétence, l'égalité).\n3. PIÈGES À RETENIR : 'un espace' (masculin en informatique/maths), 'un rôle' (masculin), 'une erreur' (féminin).",
    word_distinctions: [
      {
        pair: "Un Espace vs Une Espace",
        difference: "En français général et en informatique, ESPACE est MASCULIN : 'un espace de travail', 'un grand espace'. (L'usage féminin est réservé uniquement à la typographie imprimée ancienne).",
        example: "L'enseignant réserve un espace suffisant au tableau."
      },
      {
        pair: "Un Exemple vs Une Exemple (faux)",
        difference: "EXEMPLE est toujours MASCULIN : 'un exemple concret', 'un bon exemple'. Ne dites jamais 'une exemple'.",
        example: "Voici un exemple clair pour illustrer la règle."
      },
      {
        pair: "Basé sur (anglicisme) vs Fondé sur / Axé sur (français académique)",
        difference: "Dire 'Mon cours est basé sur...' est un calque de l'anglais 'based on'. En français formel, dites : 'Mon cours est FONDÉ sur...' ou 'AXÉ sur...'.",
        example: "Cette évaluation est fondée sur les compétences officielles."
      }
    ],
    conjugation_tables: [
      {
        verb: "ÉVALUER (1er groupe)",
        tense: "Présent de l'indicatif (Usage : mesurer les acquis)",
        forms: [
          "J'évalue",
          "Tu me évalues",
          "Il / Elle évalue",
          "Nous évaluons",
          "Vous évaluez",
          "Ils / Elles évaluent"
        ],
        note: "Attention à l'accord de l'adjectif féminin associatif : 'Une évaluation formative' (féminin)."
      },
      {
        verb: "CONCEVOIR (3e groupe)",
        tense: "Présent de l'indicatif (Usage : préparer un support)",
        forms: [
          "Je conçois",
          "Tu conçois",
          "Il / Elle conçoit",
          "Nous concevons",
          "Vous concevez",
          "Ils / Elles conçoivent"
        ],
        note: "On conçoit un programme (masculin) ou une séance (féminin)."
      }
    ],
    classroom_dialogues: [
      {
        situation: "Présenter le sommaire du cours aux élèves",
        dialogue: "« Aujourd'hui, nous aborderons un thème fondamental. Nous allons étudier un nouveau système de stockage et chercher une solution efficace à ce problème. »",
        analysis: "Genre irréprochable : UN thème (masculin), UN système (masculin), UNE solution (féminin), CE problème (masculin)."
      },
      {
        situation: "Faire une remarque sur la tenue du cahier",
        dialogue: "« Veillez à laisser un espace propre entre chaque exercice afin que l'affichage des résultats soit lisible. »",
        analysis: "Utilisation correcte des masculins : UN espace, UN affichage."
      }
    ],
    examples: [
      {
        wrong: "C'est une grand problème dans le système.",
        correct: "C'est un grand problème dans le système.",
        explanation: "'Problème' et 'système' sont masculins (un problème, un système)."
      },
      {
        wrong: "J'ai trouvé un bonne solution.",
        correct: "J'ai trouvé une bonne solution.",
        explanation: "Les noms en '-ion' sont féminins : une solution, une évaluation."
      },
      {
        wrong: "Il faut garder le même espace et la même rôle.",
        correct: "Il faut garder le même espace et le même rôle.",
        explanation: "'Espace' et 'rôle' sont tous les deux masculins (un espace, un rôle)."
      },
      {
        wrong: "Mon cours est basé sur le programme.",
        correct: "Mon cours est fondé sur le programme (ou axé sur).",
        explanation: "'Basé sur' est un anglicisme à éviter en contexte académique."
      }
    ],
    astuce: "Retenez le quatuor MASCULIN des cours : Le problème, Le système, Le programme, Le thème ! Et dites 'UN espace'.",
    quiz: [
      {
        question: "Quel groupe contient UNIQUEMENT des mots masculins ?",
        options: [
          "Problème, système, programme, espace",
          "Solution, évaluation, méthode, rôle",
          "Égalité, qualité, schéma, réponse",
          "Ambiance, erreur, étape, contexte"
        ],
        correct: 0,
        explanation: "Problème, système, programme et espace sont tous les 4 masculins !"
      },
      {
        question: "Quelle formulation est recommandée en français académique ?",
        options: [
          "Ce devoir est basé sur le premier chapitre.",
          "Ce devoir est fondé sur le premier chapitre.",
          "Ce devoir est basant sur le premier chapitre.",
          "Ce devoir est basé de le premier chapitre."
        ],
        correct: 1,
        explanation: "'Fondé sur' ou 'axé sur' est préférable à l'anglicisme 'basé sur'."
      },
      {
        question: "Complétez : Le professeur présente ___ de la séance.",
        options: ["la thème", "le thème", "une thème", "les thème"],
        correct: 1,
        explanation: "'Thème' prend le suffixe grec '-ème' qui indique le masculin : le thème."
      }
    ],
    motivation: "En maîtrisant le genre des mots clés de votre discipline, vos explications deviennent naturelles, élégantes et captivantes !"
  },

  lesson_structure: {
    lesson_id: "lesson_structure",
    title: "Structurer ses Phrases & Expliquer à l'Oral",
    intro: "La clarté d'un cours repose avant tout sur l'articulation logique des phrases. Savoir relier les idées avec les bons connecteurs et utiliser la négation complète garantit que vos élèves vous comprennent sans effort.",
    pedagogical_context: "À l'oral spontané, on a tendance à abréger ses phrases ('J'ai pas compris', 'C'est à cause de que...'). En tant qu'enseignant, maintenir une syntaxe exemplaire montre la voie aux élèves et facilite la prise de notes.",
    rule: "1. NÉGATION : À l'oral d'un professeur, le 'NE' de négation est OBLIGATOIRE (Ne dites pas 'Je sais pas', mais 'Je ne sais pas').\n2. CONNECTEURS DE CAUSE : 'Grâce à' s'utilise pour une cause heureuse/positive. 'À cause de' s'utilise pour une cause négative.\n3. CONNECTEURS DE BUT : 'Afin de' + Infinitif / 'Pour que' + Subjonctif.",
    word_distinctions: [
      {
        pair: "Séance vs Séquence Pédagogique",
        difference: "Une SÉANCE est une seule unité de cours (ex: 1 heure de cours). Une SÉQUENCE est un ensemble structuré de plusieurs séances autour d'un même objectif.",
        example: "Cette séquence sur les réseaux comprend quatre séances de 2 heures."
      },
      {
        pair: "Évaluer vs Noter",
        difference: "NOTER consiste à attribuer un chiffre/note. ÉVALUER est un processus beaucoup plus large qui consiste à analyser les acquis, diagnostiquer les lacunes et guider l'élève.",
        example: "Le professeur évalue la compréhension orale tout au long de la séance sans forcément noter."
      },
      {
        pair: "Grâce à vs À cause de",
        difference: "'Grâce à' exprime un résultat positif (remerciement). 'À cause de' exprime un problème ou un élément défavorable.",
        example: "Les élèves ont réussi grâce à leur rigueur / Le cours est retardé à cause de la coupure d'électricité."
      }
    ],
    conjugation_tables: [
      {
        verb: "COMPRENDRE (3e groupe)",
        tense: "Subjonctif Présent (Usage : vérification du but)",
        forms: [
          "Que je me comprenne",
          "Que tu me me comprennes",
          "Qu'il / elle me comprenne",
          "Que nous comprenions",
          "Que vous compreniez",
          "Qu'ils / elles comprennent"
        ],
        note: "Incontournable après 'Afin que' ou 'Pour que' : 'Afin que vous compreniez le sujet.'"
      },
      {
        verb: "ORGANISER (1er groupe)",
        tense: "Présent de l'indicatif (Usage : structuration)",
        forms: [
          "J'organise",
          "Tu organises",
          "Il / Elle organise",
          "Nous organisons",
          "Vous organisez",
          "Ils / Elles organisent"
        ],
        note: "On organise une séquence (féminin) ou un travail de groupe (masculin)."
      }
    ],
    classroom_dialogues: [
      {
        situation: "Expliquer un objectif de cours aux élèves",
        dialogue: "« Nous abordons cette notion afin de vous donner les outils nécessaires. Je ne veux pas que vous appreniez par cœur sans comprendre la logique. »",
        analysis: "Syntaxe modèle : 'afin de + infinitif' et 'ne pas que + subjonctif ('appreniez')."
      },
      {
        situation: "Faire le bilan d'un travail d'équipe",
        dialogue: "« Grâce à votre collaboration, le projet est terminé dans les temps. N'oubliez pas de relire votre travail afin d'éviter les erreurs inattention. »",
        analysis: "Usage parfait de 'Grâce à' (positif) et 'afin de' (but)."
      }
    ],
    examples: [
      {
        wrong: "Je comprends pas cette méthode.",
        correct: "Je ne comprends pas cette méthode.",
        explanation: "En contexte académique et professionnel, le 'ne' de négation est indispensable."
      },
      {
        wrong: "On a réussi à cause de votre aide.",
        correct: "On a réussi grâce à votre aide.",
        explanation: "'Grâce à' s'utilise pour une cause positive. 'À cause de' s'utilise pour une cause négative."
      },
      {
        wrong: "Je vous explique pour que vous comprenez.",
        correct: "Je vous explique pour que vous compreniez.",
        explanation: "'Pour que' exige le subjonctif ('compreniez'), alors que 'afin de' prend l'infinitif ('afin de comprendre')."
      },
      {
        wrong: "Aujourd'hui nous faisons la première séquence du chapitre.",
        correct: "Aujourd'hui nous faisons la première séance de la séquence.",
        explanation: "La séance est une tranche de cours (1h), la séquence rassemble plusieurs séances."
      }
    ],
    astuce: "Règle de cause : 'Grâce à' = Merci ! 🌸 / 'À cause de' = Oups ! 🌧️ Et n'oubliez jamais le 'NE' dans 'Je ne sais pas' !",
    quiz: [
      {
        question: "Laquelle de ces phrases est correcte pour un cours formel ?",
        options: [
          "J'ai pas eu le temps de finir.",
          "Je n'ai pas eu le temps de finir.",
          "J'ai eu pas le temps de finir.",
          "Je n'ai eu le temps de pas finir."
        ],
        correct: 1,
        explanation: "La négation académique complète est : Je N'ai PAS eu."
      },
      {
        question: "Choisissez la distinction exacte entre séance et séquence :",
        options: [
          "Une séance contient plusieurs séquences.",
          "Une séquence est constituée de plusieurs séances de cours.",
          "Les deux termes désignent exactement la même chose.",
          "Une séquence dure 15 minutes seulement."
        ],
        correct: 1,
        explanation: "La séquence est l'ensemble pédagogique complet, divisé en séances individuelles."
      },
      {
        question: "Complétez : Il révise chaque soir ___ réussir son examen.",
        options: ["pour que", "afin de", "parce que", "vu que"],
        correct: 1,
        explanation: "'Afin de' est suivi directement de l'infinitif ('réussir')."
      }
    ],
    motivation: "Des phrases bien articulées rendent le savoir accessible et passionnant pour tous vos élèves !"
  },

  lesson_agreement: {
    lesson_id: "lesson_agreement",
    title: "L'Accord des Adjectifs & Participes à l'Oral",
    intro: "À l'oral, les accords féminins et pluriels ne sont pas invisibles ! Ils modifient directement la prononciation des consonnes finales (grand → grande, fait → faite, écrit → écrite). Prononcer ces consonnes avec précision est le secret d'un français oral impeccable.",
    pedagogical_context: "Lorsque vous dictez une consigne ou formulez un retour oral sur le travail d'un élève, oublier l'accord ('La remarque est important' au lieu de 'importante') s'entend immédiatement. Prononcer les consonnes finales au féminin montre une parfaite maîtrise de la langue.",
    rule: "1. CONSONNES FINALES SONORES : Au masculin, la consonne finale est souvent muette (petit, grand, écrit, pris). Au féminin, l'ajout du 'E' la rend sonore : peTIte (/t/), granDE (/d/), écriTE (/t/), priSE (/z/).\n2. ACCORD DU PARTICIPE PASSÉ : Avec l'auxiliaire ÊTRE, le participe s'accorde avec le sujet ('Elle est partie'). Avec AVOIR, il s'accorde avec le COD placé AVANT le verbe ('Les questions qu'il a posées').",
    word_distinctions: [
      {
        pair: "Inclus vs Incluse",
        difference: "Au masculin : 'Ce document est inclus' (s muet). Au féminin : 'La pièce jointe est incluse' (s prononcé /z/).",
        example: "Le corrigé est inclus dans le livre / La fiche est incluse."
      },
      {
        pair: "Acquis vs Acquise",
        difference: "Au masculin : 'Un savoir acquis' (s muet). Au féminin : 'Une compétence acquise' (s prononcé /z/).",
        example: "Cette notion est désormais acquise par l'ensemble des élèves."
      },
      {
        pair: "Pris vs Prise",
        difference: "Au masculin : 'Un cours pris en note'. Au féminin : 'La parole a été prise par le délégué'.",
        example: "La décision a été prise de façon collégiale."
      }
    ],
    conjugation_tables: [
      {
        verb: "ACQUÉRIR (3e groupe)",
        tense: "Passé Composé (Usage : validation des acquis)",
        forms: [
          "J'ai acquis",
          "Tu as acquis",
          "Il / Elle a acquis (La notion est acquise)",
          "Nous avons acquis",
          "Vous avez acquis",
          "Ils / Elles ont acquis"
        ],
        note: "Attention au féminin : la compétence est ACQUISE (/z/ sonore)."
      },
      {
        verb: "METTRE (3e groupe)",
        tense: "Passé Composé (Usage : mise en œuvre)",
        forms: [
          "J'ai mis",
          "Tu as mis",
          "Il / Elle a mis (La consigne est mise)",
          "Nous avons mis",
          "Vous avez mis",
          "Ils / Elles ont mis"
        ],
        note: "Féminin : 'La méthode a été mise en œuvre' (/z/ sonore)."
      }
    ],
    classroom_dialogues: [
      {
        situation: "Faire le bilan d'une évaluation avec la classe",
        dialogue: "« Les notions que nous avons étudiées la semaine dernière sont désormais bien acquises. La note que vous avez obtenue reflète votre travail. »",
        analysis: "Accords parfaits : 'étudiées' (accord avec le COD 'notions' placé avant) et 'acquises' (/z/ sonore)."
      },
      {
        situation: "Distribuer des consignes écrites",
        dialogue: "« L'activité est composée de trois étapes. Chaque étape validée vous donne accès à la suite. »",
        analysis: "Accord féminin sonore : 'composée' et 'validée'."
      }
    ],
    examples: [
      {
        wrong: "La séance est fini à 11 heures.",
        correct: "La séance est finie à 11 heures.",
        explanation: "'Séance' est féminin, avec l'auxiliaire être : 'finie'."
      },
      {
        wrong: "Cette explication est très grand.",
        correct: "Cette explication est très grande.",
        explanation: "'Explication' est féminin singulier : l'adjectif 'grand' devient 'grande' à l'oral (/d/ sonore)."
      },
      {
        wrong: "Les remarques que j'ai fait sont importantes.",
        correct: "Les remarques que j'ai faites sont importantes.",
        explanation: "Avec 'avoir', le participe passé s'accorde avec le COD placé AVANT ('les remarques' = féminin pluriel → 'faites')."
      },
      {
        wrong: "La fiche d'exercice est inclus.",
        correct: "La fiche d'exercice est incluse.",
        explanation: "Au féminin, 'inclus' devient 'incluse' avec le son /z/ bien audible."
      }
    ],
    astuce: "À l'oral, écoutez la consonne qui se réveille au féminin : Grand (/d/ silencieux) → GranDE (/d/ parlé) ! Inclus → IncluSE !",
    quiz: [
      {
        question: "Prononciation orale : Quel adjectif fait entendre une consonne finale au féminin ?",
        options: ["Joli → Jolie", "Vrai → Vraie", "Petit → Petite", "Bleu → Bleue"],
        correct: 2,
        explanation: "Dans 'Petite', le 't' final devient sonore (/t/), alors qu'il était muet dans 'petit'."
      },
      {
        question: "Accordez correctement : La décision a été ___ hier par le jury.",
        options: ["prendre", "pris", "prise", "prises"],
        correct: 2,
        explanation: "'La décision' (féminin singulier) avec la voix passive ('a été') → 'prise' (/z/ sonore)."
      },
      {
        question: "Choisissez la bonne phrase :",
        options: [
          "Les compétences requises sont clairement définies.",
          "Les compétences requis sont clairement défini.",
          "Les compétences requise sont clairement définie.",
          "Les compétences requises sont clairement défini."
        ],
        correct: 0,
        explanation: "'Compétences' est féminin pluriel → 'requises' (/z/) et 'définies'."
      }
    ],
    motivation: "Vous maîtrisez désormais les détails qui font la différence entre un discours ordinaire et un discours d'enseignant d'exception !"
  }
};

// ───────────────────────────────────────────────────────────────────────────────
// DIAGNOSTIC QUIZ — 10 static MCQ focused on oral French traps
// ───────────────────────────────────────────────────────────────────────────────
export const DIAGNOSTIC_QUIZ = [
  {
    id: 1,
    question: "Laquelle de ces phrases est correcte à l'oral ?",
    options: [
      "Je dois de commencer maintenant.",
      "Je dois commencer maintenant.",
      "Je dois à commencer maintenant.",
      "Je dois que commencer maintenant."
    ],
    correct: 1,
    explanation: "Après 'devoir', on utilise directement l'infinitif sans préposition : 'Je dois commencer'. On ne dit pas 'de commencer' ni 'à commencer'.",
    astuce: "Verbes de modalité (devoir, pouvoir, vouloir, savoir) + infinitif direct, sans préposition !"
  },
  {
    id: 2,
    question: "Comment conjugue-t-on correctement 'aller' à la 1ère personne du pluriel ?",
    options: [
      "nous allons",
      "nous allez",
      "nous allions",
      "nous aillons"
    ],
    correct: 0,
    explanation: "'Aller' est irrégulier : nous ALLONS. Ne pas confondre avec le présent du subjonctif (que nous allions).",
    astuce: "Nous allons → mémorisez : 'Nous ALL-ONS à l'école tous les jours !'"
  },
  {
    id: 3,
    question: "Quel est le genre du mot 'problème' ?",
    options: [
      "Féminin : la problème",
      "Masculin : le problème",
      "Les deux genres sont corrects",
      "Neutre : problème"
    ],
    correct: 1,
    explanation: "'Problème' est masculin : UN problème, LE problème. C'est un mot piège car sa terminaison en '-ème' pourrait faire penser au féminin.",
    astuce: "Retenez : 'Mon problème est grand.' → Masculin. Autres mots piège masculins : le système, le programme, le thème."
  },
  {
    id: 4,
    question: "Laquelle de ces phrases contient une faute d'accord ?",
    options: [
      "Elle est partie hier.",
      "Il est parti hier.",
      "Elle a parti hier.",
      "Ils sont partis hier."
    ],
    correct: 2,
    explanation: "'Partir' se conjugue avec 'être' comme auxiliaire, pas 'avoir'. On dit : elle EST partie, il EST parti, ils SONT partis.",
    astuce: "Les verbes de mouvement (partir, aller, venir, arriver...) prennent l'auxiliaire ÊTRE. Pensez à la maison de 'être' !"
  },
  {
    id: 5,
    question: "Comment dit-on correctement en français formel ?",
    options: [
      "Je suis en train de comprendre pas.",
      "Je ne comprends pas.",
      "Je comprendrais pas.",
      "Je comprends pas."
    ],
    correct: 1,
    explanation: "À l'oral formel, la négation complète 'ne...pas' est obligatoire. 'Je comprends pas' est familier. La forme correcte et formelle est 'Je ne comprends pas'.",
    astuce: "Règle d'or : à l'écrit et dans un contexte professionnel, NE disparaît JAMAIS !"
  },
  {
    id: 6,
    question: "Quelle phrase utilise correctement le subjonctif ?",
    options: [
      "Il faut que tu vient.",
      "Il faut que tu viennes.",
      "Il faut que tu venais.",
      "Il faut que tu viens."
    ],
    correct: 1,
    explanation: "Après 'il faut que', on utilise le subjonctif : 'que tu VIENNES'. C'est une règle fondamentale pour tous les enseignants.",
    astuce: "Déclencher AUTOMATIQUEMENT le subjonctif après : il faut que, je veux que, je souhaite que, bien que, pour que."
  },
  {
    id: 7,
    question: "Comment s'accorde l'adjectif 'beau' au féminin singulier ?",
    options: [
      "beau",
      "bel",
      "belle",
      "beaux"
    ],
    correct: 2,
    explanation: "'Beau' devient 'belle' au féminin singulier. Il prend aussi la forme 'bel' devant un nom masculin commençant par une voyelle (un bel homme).",
    astuce: "Beau/belle/bel → mémorisez le trio. Même principe pour : vieux/vieille/vieil, nouveau/nouvelle/nouvel."
  },
  {
    id: 8,
    question: "Laquelle de ces phrases est grammaticalement correcte ?",
    options: [
      "Nous avons discuté du les résultats.",
      "Nous avons discuté des résultats.",
      "Nous avons discuté de les résultats.",
      "Nous avons discuté au les résultats."
    ],
    correct: 1,
    explanation: "'De + les' se contracte toujours en 'DES'. On ne dit jamais 'de les'. Cette contraction est obligatoire.",
    astuce: "Contractions obligatoires : DE + LES = DES / À + LES = AUX. Il n'y a aucune exception !"
  },
  {
    id: 9,
    question: "Quel verbe se conjugue de façon identique à 'finir' ?",
    options: [
      "venir",
      "ouvrir",
      "choisir",
      "faire"
    ],
    correct: 2,
    explanation: "'Choisir' appartient au 2e groupe et se conjugue comme 'finir' : je choisis, tu choisis, il choisit, nous choisissons. 'Ouvrir' et 'venir' sont irréguliers.",
    astuce: "Verbes du 2e groupe : ils ont tous le radical -ISSON- à la 1ère personne du pluriel (nous choisissons, nous finissons)."
  },
  {
    id: 10,
    question: "Quelle est la bonne façon d'exprimer un conseil formel à l'oral ?",
    options: [
      "Tu devrais de pratiquer chaque jour.",
      "Tu dois à pratiquer chaque jour.",
      "Vous devriez pratiquer chaque jour.",
      "Vous deviez pratiquer chaque jour."
    ],
    correct: 2,
    explanation: "Le conditionnel de 'devoir' exprime un conseil poli : 'Vous DEVRIEZ pratiquer'. C'est la forme la plus appropriée pour conseiller quelqu'un poliment.",
    astuce: "Conseil poli = Conditionnel de 'devoir' : je devrais, tu devrais, vous devriez. Plus formel que l'impératif !"
  }
];
