/**
 * Configuration des 12 Stations du Parcours du Héros
 * Basé sur le monomythe de Joseph Campbell
 */

export interface Exercise {
  level: 'explorateur' | 'chercheur' | 'plongeur';
  title: string;
  description: string;
  questions: string[];
  duration: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Station {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  phase: 'depart' | 'initiation' | 'retour';
  phaseName: string;
  description: string;
  objectives: string[];
  pedagogicalContent?: {
    why: string;      // Pourquoi c'est important (4MAT)
    what: string;     // Qu'est-ce que c'est (4MAT)
    how: string;      // Comment faire (4MAT)
    whatIf: string;   // Et si / Application (4MAT)
  };
  exercises: Exercise[];
  quiz?: QuizQuestion[];
  audioScript?: string;
  videoScript?: string;
  duration: string;
  color: string;
}

export const stations: Station[] = [
  // ==========================================
  // PHASE 1 : LE DÉPART
  // ==========================================
  {
    id: 1,
    emoji: '🚧',
    title: 'Le Monde Ordinaire',
    subtitle: 'Reconnaître ton point de départ',
    phase: 'depart',
    phaseName: 'Phase 1 : Le Départ',
    description: 'Reconnaître ton point de départ et identifier ce qui ne fonctionne plus dans ta vie professionnelle actuelle.',
    objectives: [
      'Identifier précisément ton monde ordinaire professionnel actuel',
      'Comprendre pourquoi cette reconnaissance est le premier pas du voyage',
      'Repérer les signaux qui t\'appellent vers le changement',
      'Cartographier ta zone de confort et ses limites'
    ],
    pedagogicalContent: {
      why: `**Le Problème : La Prison Dorée**

Tu es probablement dans une de ces situations :

**Situation A : Le piège du confort**
Tu as un job. Peut-être même un "bon" job selon les critères externes. Salaire correct. Sécurité. Prestige social.
Mais au fond... tu t'ennuies. Tu te sens étouffé. Tu as l'impression de passer à côté de quelque chose.

**Situation B : L'entre-deux paralysant**
Tu es en recherche d'emploi. Tu postules. Tu attends. Tu recommences.
Mais tu ne sais même pas vraiment ce que tu cherches.

**Situation C : Le déni du changement**
Tu sens qu'il est temps de bouger. Depuis des mois. Peut-être même des années.
Mais tu restes. Par peur. Par confort. Par inertie.

**L'Impact**
Ce malaise a des conséquences sur ton énergie, ta confiance, tes relations, ton potentiel.

**La Vision**
Mais imagine que tu prennes conscience de ton monde ordinaire. Ce malaise que tu ressens ? Ce n'est pas une faiblesse. C'est un SIGNAL.
Reconnaître ton monde ordinaire, c'est déjà commencer à en sortir.`,

      what: `**Les 5 Niveaux Logiques de ton Monde Ordinaire**

Ton monde ordinaire s'étend sur plusieurs dimensions (modèle Robert Dilts, PNL) :

**1. Environnement 🌍** - Ton contexte externe
Où travailles-tu ? Avec qui ? Dans quel secteur ? Quelles contraintes ?
*Question clé : "OÙ et AVEC QUI je passe mes journées ?"*

**2. Comportements 🏃** - Tes actions quotidiennes
Qu'est-ce que tu FAIS concrètement ? Quelle routine ? Quel rythme ?
*Question clé : "QUE FAIS-JE au quotidien ?"*

**3. Capacités 💪** - Tes compétences mobilisées
Quelles compétences utilises-tu vraiment ? Lesquelles sont en friche ?
*Question clé : "QUELLES capacités j'utilise (ou pas) ?"*

**4. Croyances & Valeurs 💎** - Tes convictions
Quelles sont tes croyances sur ce job ? Quelles valeurs sont honorées/trahies ?
*Question clé : "En quoi je CROIS et qu'est-ce qui COMPTE vraiment ?"*

**5. Identité 🎭** - Qui tu es
Comment te définisses-tu ? Cette identité est-elle choisie ou héritée ?
*Question clé : "QUI suis-je dans ce monde ordinaire ?"*

**Les 5 Signaux I.C.A.R.E.**

**Signal Identité** - "Je ne suis pas/plus cette personne"
Tu ne te reconnais plus dans ton rôle, ton titre, ton statut.

**Signal Capacités** - "Je tourne en sous-régime"
Syndrome de l'imposteur ou sentiment de sous-exploitation.

**Signal Appartenance** - "Je ne suis pas à ma place"
Tu te sens étranger dans ton environnement professionnel.

**Signal Risque** - "J'ai trop à perdre"
Tu restes par peur des risques liés au changement.

**Signal Estime** - "Je ne mérite pas mieux"
Tu as intériorisé ton monde ordinaire et ne te crois plus capable d'autre chose.`,

      how: `**3 Exercices Pratiques**

**Exercice 1 : Cartographie des 5 Niveaux (15 min)**
Dessine 5 cercles concentriques. De l'extérieur vers l'intérieur :
1. Environnement (où, avec qui)
2. Comportements (3 activités principales)
3. Capacités (utilisées vs en friche)
4. Croyances & Valeurs (honorées vs trahies)
5. Identité (comment je me définis vs qui je suis vraiment)

Entoure en rouge les zones de dissonance.

**Exercice 2 : Signal I.C.A.R.E. Dominant (10 min)**
Note chaque signal de 0 à 10 :
- Signal Identité : __/10
- Signal Capacités : __/10
- Signal Appartenance : __/10
- Signal Risque : __/10
- Signal Estime : __/10

Ton signal dominant = score le plus élevé.

**Exercice 3 : La Phrase Synthèse (5 min)**
"Mon monde ordinaire, c'est __ (rôle), où je fais __ (comportements),
en mobilisant __ mais pas __.
Je ressens un signal de __ qui se manifeste par __."`,

      whatIf: `**Et si ton Monde Ordinaire était parfait... pour quelqu'un d'autre ?**

Ton monde ordinaire n'est pas "mauvais". Il est juste mauvais pour TOI.
Il y a quelqu'un qui rêverait d'avoir ton job, parce que ça correspond à LEUR identité.

Ce n'est pas une question de "mieux" ou "moins bien".
C'est une question d'**alignement**.

**Et si reconnaître ton Monde Ordinaire était un acte de gratitude ?**

Avant de partir, reconnais ce que ton monde ordinaire t'a apporté :
- Compétences apprises
- Sécurité financière
- Rencontres importantes
- Révélation de ce que tu NE veux PAS

**Rituel** : Écris 3 choses pour lesquelles tu es reconnaissant envers ton monde ordinaire actuel.

**Prochaine étape**
Un appel va arriver. Un signal qui te dit : "Il est temps."
Direction : Station 2 - L'Appel à l'Aventure.`
    },
    exercises: [
      {
        level: 'explorateur',
        title: 'Cartographie Express',
        description: 'Dessine rapidement ta situation professionnelle actuelle',
        questions: [
          'Quelle est ta situation professionnelle actuelle en une phrase ?',
          'Qu\'est-ce qui ne fonctionne plus pour toi ?',
          'Quel est le signe le plus évident que tu dois changer ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Analyse Approfondie',
        description: 'Explore en détail les différentes facettes de ton monde ordinaire',
        questions: [
          'Décris ta journée type actuelle - qu\'est-ce qui te satisfait et qu\'est-ce qui te pèse ?',
          'Quels sont les 3 moments où tu te sens le moins aligné avec toi-même ?',
          'Comment ton entourage professionnel décrirait-il ta situation ?',
          'Quelles compétences utilises-tu actuellement et lesquelles sont sous-exploitées ?',
          'Si rien ne change dans 5 ans, comment te sentiras-tu ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Introspection Profonde',
        description: 'Plonge dans les racines de ton insatisfaction professionnelle',
        questions: [
          'Raconte l\'histoire de ton parcours professionnel jusqu\'à aujourd\'hui - quels ont été les moments clés ?',
          'Quelles croyances limitantes maintiennent ta situation actuelle ?',
          'Quelle part de toi as-tu dû mettre de côté pour fonctionner dans ce monde ordinaire ?',
          'Quel est le prix émotionnel, physique et relationnel de rester dans cette situation ?',
          'Si tu devais écrire une lettre à ton futur toi dans 10 ans, que dirais-tu de ta situation actuelle ?',
          'Quels rêves professionnels as-tu abandonnés et pourquoi ?',
          'Comment cette situation reflète-t-elle des schémas répétitifs dans ta vie ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-gray-600 to-slate-700'
  },
  {
    id: 2,
    emoji: '📯',
    title: 'L\'Appel à l\'Aventure',
    subtitle: 'Entendre le signal du changement',
    phase: 'depart',
    phaseName: 'Phase 1 : Le Départ',
    description: 'Entendre le signal que quelque chose doit changer dans ta vie professionnelle.',
    objectives: [
      'Reconnaître le signal qui t\'appelle au changement',
      'Comprendre les 4 types d\'appels à l\'aventure',
      'Distinguer un vrai appel d\'une fausse alerte',
      'Formuler ton appel en une phrase claire',
      'Créer un plan d\'exploration sur 90 jours'
    ],
    pedagogicalContent: {
      why: `### Le Problème : Le Signal Ignoré

La plupart des gens reçoivent des appels. Tout le temps. Des signaux qui leur disent : "Hé, il y a mieux pour toi. Il y a autre chose."

Mais tu sais quoi ? **La plupart les ignorent.**

Peut-être que toi aussi, tu as déjà ignoré un appel :

**Le message LinkedIn** d'un recruteur que tu as laissé sans réponse.

**La conversation** avec un ami qui a changé de vie et qui t'a inspiré... mais tu as vite oublié.

**Cet article** que tu as lu un dimanche et qui t'a bouleversé... mais le lundi, tu étais déjà retourné à ta routine.

### Les 3 Façons d'Ignorer un Appel

**Façon 1 : Le Sourd Volontaire**

Tu entends le signal. Clairement. Mais tu fais semblant de ne pas l'entendre.

Tu montes le volume de ta routine. Tu te remplis de distractions. Tu évites les conversations qui pourraient raviver cet appel.

Le problème ? Le signal devient de plus en plus fort. Jusqu'à ce qu'il se transforme en crise. Licenciement. Burn-out. Rupture.

**Façon 2 : Le Sceptique Analytique**

Tu entends le signal. Mais tu le sur-analyses.

*"Est-ce vraiment le bon moment ? Il faudrait que j'aie d'abord X, Y, Z. Statistiquement, les chances de succès sont... Je vais faire une liste des pour et des contre."*

Tu passes des mois à analyser. À peser. À hésiter.

Et pendant ce temps, l'opportunité passe. La porte se ferme.

Et tu restes avec ce goût amer de "Et si...?"

**Façon 3 : Le Confuseur Chronique**

Tu entends PLUSIEURS signaux. Contradictoires. En même temps.

Un appel vers l'entrepreneuriat. Un autre vers un master. Un troisième vers l'expatriation.

Tu ne sais plus lequel écouter. Alors tu ne réponds à aucun.

Paralysie par excès de choix.

### L'Impact Émotionnel

Le coût de l'ignorance d'un appel authentique :

**Sur ton énergie** : Cette sensation persistante que tu passes à côté de quelque chose.

**Sur ton estime** : Tu commences à te voir comme quelqu'un qui "n'ose pas".

**Sur ton parcours** : Chaque appel ignoré est une bifurcation non prise. Une version de toi qui n'existera jamais.

**Sur ton âme** : Le sentiment de trahir ton potentiel.

### La Vision Transformée

Mais imagine que tu reconnaisses le signal. Que tu le prennes au sérieux. Que tu explores.

Tu ne dis pas oui immédiatement à tout. Mais tu dis **oui à l'investigation**. À l'exploration. À l'ouverture.

Tous les héros reçoivent un appel :

- **Luke Skywalker** reçoit le message de Leia. Il pourrait l'ignorer. Continuer à nettoyer des condensateurs sur Tatooine. Mais il choisit d'écouter.
- **Frodon** apprend que l'anneau est l'Anneau Unique. Il pourrait le jeter dans la rivière. Retourner à ses livres. Mais il choisit de répondre.
- **Harry Potter** reçoit sa lettre de Poudlard. Il pourrait rester sous l'escalier. Mais il choisit le mystère.

C'est le moment du choix. Le moment où tu décides si tu restes dans ton monde ordinaire... ou si tu franchis le seuil.

### Lien avec la Station 1 : Ton Signal I.C.A.R.E. Influence Ton Appel

Tu te souviens de ton signal dominant identifié en Station 1 ? (Identité, Capacités, Appartenance, Risque, Estime)

**Voici comment il influence le TYPE d'appel que tu reçois :**

**Si ton signal est Identité** 🎭 → Tu reçois probablement un **Appel-Révélation**
- Une conversation, un livre, un événement qui te fait réaliser : "Ce n'est pas moi. Je suis autre chose."
- C'est souvent un déclic identitaire brutal.

**Si ton signal est Capacités** 💪 → Tu reçois probablement un **Appel-Insatisfaction**
- Ce sentiment progressif de tourner en sous-régime, de ne pas utiliser tes vrais talents.
- "Je vaux plus que ça. Je peux faire mieux."

**Si ton signal est Appartenance** 🌍 → Tu reçois probablement un **Appel-Opportunité** ou **Appel-Révélation**
- Une porte qui s'ouvre vers un environnement où tu te sentirais enfin à ta place.
- Ou une prise de conscience : "Je ne suis pas fait pour ce monde-là."

**Si ton signal est Risque** ⚠️ → Tu reçois probablement un **Appel-Crise**
- Un événement externe qui te force à bouger, parce que tu n'aurais jamais bougé volontairement.
- Le licenciement qui devient une libération.

**Si ton signal est Estime** 🪞 → Tu reçois probablement un **Appel-Opportunité** que tu vas... ignorer
- Quelqu'un croit en toi plus que toi-même.
- Mais tu te dis : "Je ne mérite pas ça. C'est trop pour moi."

**Comprendre ce lien est crucial** : ton appel n'arrive pas au hasard. Il répond à ton signal.`,

      what: `### Les 4 Types d'Appels à l'Aventure

Il existe quatre types d'appels à l'aventure professionnelle. Quatre archétypes.

Chacun arrive par un chemin différent. Chacun demande une réponse différente.

### Type 1 : L'Appel-Crise 🌩️

**Le Coup de Tonnerre**

C'est un événement externe qui te force au changement.

**Exemples** : Licenciement. Restructuration. Fermeture de ton département. Problème de santé. Déménagement forcé.

**Caractéristiques** :
- Soudain et brutal
- Non choisi
- Génère anxiété et peur
- Force à agir

**Réponse appropriée** :

Deux attitudes possibles :
- **La victime** : "Pourquoi moi ? C'est injuste. Ma vie est finie."
- **Le héros** : "OK. Ça fait mal. Mais c'était peut-être le signal dont j'avais besoin pour changer enfin."

L'Appel-Crise est un accélérateur de transformation. Douloureux, mais puissant.

### Type 2 : L'Appel-Opportunité 🚪

**La Porte Ouverte**

Une porte qui s'ouvre de manière inattendue.

**Exemples** : Un message d'un recruteur sur LinkedIn. Une proposition de partenariat. Une offre dans une boîte que tu admires. Une recommandation d'un ancien collègue.

**Caractéristiques** :
- Externe mais positif
- Apparaît comme un cadeau
- Fenêtre de temps limitée
- Génère excitation... et peur
- Nécessite du discernement

**Questions à te poser** :
- Est-ce aligné avec mon identité profonde ?
- Est-ce que je vais VERS quelque chose... ou est-ce que je FUIS mon monde ordinaire ?

L'Appel-Opportunité est un test de clarté. Il révèle si tu sais qui tu es.

### Type 3 : L'Appel-Insatisfaction 💭

**La Voix Intérieure**

Un sentiment progressif que quelque chose ne va pas.

**Exemples** : "Je ne me reconnais plus dans ce que je fais." "Chaque lundi, je dois me forcer." "Je sais que je vaux plus que ça."

**Caractéristiques** :
- Progressif et cumulatif
- Interne et subtil
- S'intensifie avec le temps
- Génère mélancolie et frustration
- Appelle à l'introspection

**Vérité** : L'insatisfaction chronique n'est pas de l'ingratitude. C'est ton âme qui te dit : "Il y a mieux pour toi. Tu n'es pas à ta place."

C'est peut-être le signal le plus authentique. Parce qu'il vient de l'intérieur.

### Type 4 : L'Appel-Révélation ⚡

**Le Déclic Soudain**

Un moment de clarté totale qui change ta perception.

**Exemples** : Une conversation qui te bouleverse. Un livre qui te fait voir autrement. Un voyage qui t'ouvre les yeux. Un événement de vie. Un burn-out qui te force à repenser tout.

**Caractéristiques** :
- Soudain et puissant
- Crée clarté immédiate
- Change ta vision du monde
- Génère émerveillement et certitude
- Appelle à l'action rapide

**Sagesse** : Respecte l'intensité de la révélation. Mais laisse-toi quelques semaines pour intégrer.

Si après un mois, la clarté est toujours là... c'est un vrai appel.

### Les 5 Critères d'un Vrai Appel

Comment distinguer un vrai appel d'une impulsion passagère ? D'une fuite déguisée ? D'un fantasme irréaliste ?

Il y a cinq critères. Cinq caractéristiques d'un appel authentique.

**Si ton signal a les cinq, c'est un vrai appel. Ne l'ignore pas.**

### Critère 1 : La Persistance ⏰

Un vrai appel ne disparaît pas. Il revient. Encore et encore. Mois après mois.

Ce n'est pas une impulsion d'un dimanche soir déprimé. C'est une présence constante. Un murmure qui ne s'arrête jamais.

**Test** : Depuis combien de temps ce signal est-il présent ?
- Moins d'1 mois → Peut-être une impulsion
- 3-6 mois → Signal sérieux
- Plus d'1 an → C'est un vrai appel que tu ignores

### Critère 2 : La Cohérence Valeurs 💎

Cet appel est-il aligné avec ton identité profonde ?

Relis ton archétype de la Station 1. Ton monde ordinaire. Tes forces naturelles.

**Test** : Cet appel est-il cohérent avec ton identité profonde ?
- Si tu es un **Créateur** et que l'appel te pousse vers un poste ultra-structuré sans autonomie... c'est probablement pas un vrai appel. C'est peut-être une fuite.
- Si tu es un **Protecteur** et que l'appel te pousse vers un métier de soin... cohérent.

### Critère 3 : Le Mix Peur + Excitation 🎭

Un vrai appel génère une ambivalence fascinante : **tu as peur ET tu es excité**.

Si tu es JUSTE excité sans peur → peut-être un fantasme.

Si tu as JUSTE peur sans excitation → peut-être une obligation sociale.

**Test** : Imagine que dans cinq ans, tu n'as pas répondu à cet appel. Que ressens-tu ?
- "Bof, j'aurai autre chose"... pas un vrai appel.
- "Je vais le regretter toute ma vie"... vrai appel.

### Critère 4 : La Clarté de Direction 🧭

Tu ne sais pas forcément COMMENT tu vas y arriver.

Mais tu sais OÙ tu veux aller.

Tu peux compléter la phrase : "Je suis appelé vers..."

**Test** : Peux-tu formuler une direction claire ?
- ✅ "Je suis appelé vers l'entrepreneuriat social dans l'éducation"
- ❌ "Je suis appelé vers... quelque chose de différent"

### Critère 5 : Le Coût du Non 💔

Si tu ignores cet appel, quel sera le coût ?

**Test** : Visualisation

Ferme les yeux. Imagine que tu es dans 5 ans. Tu n'as PAS répondu à cet appel.

Que ressens-tu ?
- "Je vais le regretter toute ma vie" → Vrai appel
- "Bof, j'aurai autre chose" → Pas un vrai appel`,

      how: `### Reconnaître TON Signal

**Exercice 1 : Liste Flash (5 minutes)**

Au cours des 6 derniers mois, qu'est-ce qui t'a fait penser "Hmm, intéressant..." ?

Écris TOUT. Ne filtre pas :
- ✉️ Un message LinkedIn
- 💬 Une conversation inspirante
- 📖 Un livre bouleversant
- 🎙️ Un podcast marquant
- 💼 Une offre d'emploi attirante
- 💭 Un sentiment récurrent

Objectif : Minimum 5 signaux.

**Parmi ces signaux, lequel revient le plus souvent ?**

Celui qui persiste. Celui que tu ne peux pas complètement ignorer.

### Valider l'Authenticité

**Exercice 2 : Test des 5 Critères (20 minutes)**

Passe ton signal au filtre des 5 critères :

1. ⏰ **Persistance** : Depuis combien de mois ?
2. 💎 **Cohérence Valeurs** : Aligné avec ton archétype ?
3. 🎭 **Mix Peur + Excitation** : Les deux à la fois ?
4. 🧭 **Clarté Direction** : Tu sais OÙ aller ?
5. 💔 **Coût du Non** : Regret profond si tu ignores ?

**Score** : ___/5

**Interprétation** :
- **5/5** : C'est un vrai appel. Ne l'ignore pas.
- **4/5** : Signal fort qui mérite investigation
- **3/5** : Explore les critères négatifs
- **0-2/5** : Probablement pas un vrai appel

### Le Plan d'Exploration 90 Jours

Tu as identifié ton appel. Qu'est-ce que tu fais maintenant ?

**Tu ne démissionnes pas demain. Tu EXPLORES. Pendant 90 jours.**

### Mois 1 : APPRENDRE 📚

**Objectif** : Comprendre le terrain sans engagement.

**Actions** :
1. Trouve 3 ressources sur ce domaine (livres, podcasts, articles)
2. Identifie 5 personnes qui font ce métier déjà
3. Écris 10 questions que tu te poses
4. Crée une veille (Google Alerts, Feedly)

**Critère de succès** : À la fin du mois, tu comprends le contexte général.

### Mois 2 : CONNECTER 🤝

**Objectif** : Entrer dans l'écosystème.

**Actions** :
1. Contacte 3 personnes pour des informational interviews
2. Va à 2 événements du secteur (meetups, conférences)
3. Rejoins 1 communauté en ligne (Slack, Discord, groupe Facebook)

**Critère de succès** : À la fin du mois, tu as rencontré des humains de ce domaine. Tu as senti la culture.

### Mois 3 : EXPÉRIMENTER 🧪

**Objectif** : Tester concrètement, même à petite échelle.

**Actions** :
1. Lance un mini-projet (side project, bénévolat, test freelance, formation courte)
2. Demande à 3 personnes de ton entourage leur ressenti
3. Réponds à la question ultime : "Est-ce que cet appel résonne encore plus fort qu'au jour 1 ?"

**Critère de succès** :
- Si **OUI** → C'est un vrai appel. Passe à l'action. Direction Station 5.
- Si **NON** → Ce n'était pas le bon appel. Ou pas le bon moment. Retourne à l'étape 1.

**90 jours. C'est tout ce que tu as à investir pour savoir.**`,

      whatIf: `### Cas Complexes

**Et si j'ai plusieurs appels simultanés ?**

Si tu as plusieurs signaux qui passent tous les 5 critères, choisis celui avec :
- Le plus fort Coût du Non
- La plus grande Persistance
- Le plus de Peur + Excitation

OU lance 3 plans d'exploration 90 jours en parallèle (mais c'est intense).

**Et si mon appel est flou ?**

C'est normal au début. Commence par explorer la DIRECTION générale.

Exemple : "Je suis appelé vers aider les gens" → Explore coaching, psychologie, formation, médiation.

La clarté viendra en explorant.

**Et si j'ai peur de me tromper ?**

Tu ne te trompes pas en explorant. Tu te trompes en ignorant.

Le plan 90 jours est un investissement minimal pour une décision majeure.

**Et si mon entourage ne comprend pas ?**

Les vrais appels sont souvent incompris. Parce qu'ils sont personnels.

Tu n'as pas besoin de l'approbation de tous pour explorer.

### Prochaine Étape

Maintenant que tu as identifié ton appel...

Tu vas probablement avoir envie de le **refuser**.

C'est normal. C'est humain. C'est la Station 3.

Direction : **Station 3 - Le Refus de l'Appel**`
    },
    exercises: [
      {
        level: 'explorateur',
        title: 'Les Signaux',
        description: 'Identifie les signaux qui t\'appellent au changement',
        questions: [
          'Quel événement récent t\'a fait réaliser qu\'un changement est nécessaire ?',
          'Qu\'est-ce qui t\'attire vers un nouveau chemin professionnel ?',
          'Si tu devais suivre ton intuition, vers quoi te guiderait-elle ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Décoder l\'Appel',
        description: 'Analyse les différentes formes que prend ton appel à l\'aventure',
        questions: [
          'Quels sont les 3 signaux (émotionnels, physiques, circonstanciels) qui te disent de changer ?',
          'Quelle opportunité ou rencontre récente a éveillé ton désir de transformation ?',
          'Qu\'est-ce qui te fascine dans ce nouveau chemin possible ?',
          'Quelles conversations récentes ont planté des graines de changement ?',
          'Si tu écoutes vraiment ton cœur, vers quel domaine professionnel es-tu appelé ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'La Voix Profonde',
        description: 'Explore la nature profonde de ton appel et ses origines',
        questions: [
          'Retrace l\'histoire de cet appel - depuis combien de temps résonne-t-il en toi ?',
          'Quelle partie de toi répond à cet appel et pourquoi maintenant ?',
          'Comment cet appel est-il lié à tes valeurs les plus profondes ?',
          'Quels rêves d\'enfance ou d\'adolescence résonnent avec cet appel ?',
          'Si ton "moi idéal" dans 10 ans te parlait aujourd\'hui, que te dirait-il sur cet appel ?',
          'Quelles synchronicités ou "coïncidences" ont jalonné ce chemin vers l\'appel ?',
          'Comment cet appel s\'inscrit-il dans le sens plus large de ta vie ?'
        ],
        duration: '30 min'
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Quel est le VRAI problème de la Station 2 : L\'Appel à l\'Aventure ?',
        options: [
          'A) Ne pas recevoir d\'appel du tout',
          'B) Recevoir trop d\'appels simultanément',
          'C) Recevoir des appels mais les ignorer (Sourd, Sceptique, Confuseur)',
          'D) Ne pas savoir comment répondre à un appel'
        ],
        correctAnswer: 2,
        explanation: 'C) Recevoir des appels mais les ignorer - Le problème n\'est pas l\'absence de signaux. Tu reçois des appels. Le problème, c\'est que tu les ignores de 3 façons : Le Sourd Volontaire (tu fais semblant de ne pas entendre), Le Sceptique Analytique (tu sur-analyses et tu hésites indéfiniment), Le Confuseur Chronique (tu es paralysé par trop d\'options). L\'appel est là. C\'est toi qui ne réponds pas.'
      },
      {
        id: 'q2',
        question: 'Quel est le lien entre ton Signal I.C.A.R.E. (Station 1) et le TYPE d\'appel que tu reçois (Station 2) ?',
        options: [
          'A) Il n\'y a pas de lien - les deux sont indépendants',
          'B) Ton signal I.C.A.R.E. dominant influence directement le TYPE d\'appel que tu vas recevoir',
          'C) L\'appel détermine ton signal I.C.A.R.E.',
          'D) Les deux sont identiques'
        ],
        correctAnswer: 1,
        explanation: 'B) Ton signal I.C.A.R.E. dominant influence le type d\'appel - Exemples : Signal Identité → Appel-Révélation (déclic identitaire brutal). Signal Capacités → Appel-Insatisfaction (sous-régime progressif). Signal Risque → Appel-Crise (événement forcé). Ton appel n\'arrive pas au hasard. Il répond à ton signal.'
      },
      {
        id: 'q3',
        question: 'Parmi ces 4 exemples, lequel est un Appel-Crise ?',
        options: [
          'A) Tu lis un livre qui bouleverse ta vision de ta carrière',
          'B) Un recruteur te contacte sur LinkedIn pour une opportunité',
          'C) Tu te fais licencier suite à une restructuration',
          'D) Depuis 6 mois, tu ressens un malaise croissant dans ton job'
        ],
        correctAnswer: 2,
        explanation: 'C) Licenciement suite à restructuration - L\'Appel-Crise est un événement externe, brutal, subi (licenciement, problème de santé, etc.). A) est un Appel-Révélation (déclic soudain). B) est un Appel-Opportunité (porte qui s\'ouvre). D) est un Appel-Insatisfaction (sentiment progressif).'
      },
      {
        id: 'q4',
        question: 'Marie reçoit un message d\'un ancien collègue qui lui propose de rejoindre une startup. Elle est excitée... mais aussi terrorisée. Salaire moins élevé, risque d\'échec. Quel critère d\'un VRAI appel est présent ici ?',
        options: [
          'A) La Persistance',
          'B) Le Mix Peur + Excitation',
          'C) La Cohérence Valeurs',
          'D) La Clarté de Direction'
        ],
        correctAnswer: 1,
        explanation: 'B) Le Mix Peur + Excitation - Marie ressent les DEUX : l\'excitation de l\'opportunité ET la peur du risque. C\'est le signe d\'un vrai appel. Si c\'était JUSTE de l\'excitation → fantasme. Si c\'était JUSTE de la peur → obligation sociale. Les vrais appels génèrent cette ambivalence fascinante.'
      },
      {
        id: 'q5',
        question: 'Julien hésite depuis 8 mois entre devenir coach ou se lancer dans l\'immobilier. Il lit des livres sur les deux, mais ne passe jamais à l\'action. Quelle erreur fait-il ?',
        options: [
          'A) Il devrait choisir celui qui paie le mieux',
          'B) Il est en mode "Sceptique Analytique" - il sur-analyse au lieu de tester',
          'C) Il devrait ignorer les deux appels et attendre un troisième',
          'D) Il devrait démissionner immédiatement pour se consacrer à l\'un des deux'
        ],
        correctAnswer: 1,
        explanation: 'B) Il est en mode "Sceptique Analytique" - Julien sur-analyse. Il lit, il pèse, il hésite... mais il ne TESTE pas. Le remède : lancer un Plan d\'Exploration 90 jours sur l\'un des deux appels. Tester concrètement. L\'action apporte plus de clarté que la réflexion.'
      },
      {
        id: 'q6',
        question: 'Vrai ou Faux : Un vrai appel doit être approuvé par ton entourage pour être authentique.',
        options: [
          'A) Vrai',
          'B) Faux'
        ],
        correctAnswer: 1,
        explanation: 'FAUX - Les vrais appels sont souvent incompris par l\'entourage. Parce qu\'ils sont PERSONNELS. Ton appel répond à TON identité, TES valeurs, TON signal I.C.A.R.E. L\'approbation sociale n\'est PAS un critère d\'authenticité. Les 5 vrais critères sont : Persistance, Cohérence Valeurs, Mix Peur+Excitation, Clarté de Direction, Coût du Non.'
      },
      {
        id: 'q7',
        question: 'Quel est le critère n°1 pour distinguer un vrai appel d\'une impulsion passagère ?',
        options: [
          'A) L\'intensité émotionnelle immédiate',
          'B) La Persistance (le signal revient encore et encore, mois après mois)',
          'C) L\'approbation de ton entourage',
          'D) Le potentiel de revenus'
        ],
        correctAnswer: 1,
        explanation: 'B) La Persistance - Un vrai appel ne disparaît pas. Il revient. Encore et encore. Ce n\'est pas une impulsion d\'un dimanche soir déprimé. Test : Moins d\'1 mois → impulsion possible. 3-6 mois → signal sérieux. Plus d\'1 an → vrai appel que tu ignores.'
      },
      {
        id: 'q8',
        question: 'Sophie sent un appel vers la photographie depuis 14 mois. Mais elle se dit "Je suis Protectrice (archétype Station 1), pas Créatrice. Ça ne colle pas." Quel critère doit-elle réévaluer ?',
        options: [
          'A) La Persistance',
          'B) Le Mix Peur + Excitation',
          'C) La Cohérence Valeurs (alignement avec son identité profonde)',
          'D) Le Coût du Non'
        ],
        correctAnswer: 2,
        explanation: 'C) La Cohérence Valeurs - Sophie doit vérifier si cet appel est cohérent avec son archétype et ses valeurs. Attention : elle peut être Protectrice ET photographe (ex: photographie documentaire sociale, portraits de personnes vulnérables). Mais si l\'appel la pousse vers quelque chose qui trahit son identité... c\'est peut-être une fuite déguisée. Ou alors, son archétype dominant évolue.'
      },
      {
        id: 'q9',
        question: 'Maxime a un appel vers l\'entrepreneuriat. Score 5/5 critères. Mais il a 3 enfants, un crédit immobilier, et son appel nécessiterait de quitter son CDI. Que faire ?',
        options: [
          'A) Abandonner l\'appel - le timing est impossible',
          'B) Démissionner immédiatement malgré les risques',
          'C) Lancer un Plan d\'Exploration 90 jours pour tester l\'appel SANS tout sacrifier (side project, weekends, soirées)',
          'D) Attendre 10 ans que les conditions soient parfaites'
        ],
        correctAnswer: 2,
        explanation: 'C) Lancer un Plan 90 jours sans tout sacrifier - Un appel authentique ne signifie pas "tout ou rien immédiatement". Maxime peut : Tester son idée en side project le soir/weekend (Mois 3 : Expérimenter). Rencontrer des entrepreneurs (Mois 2 : Connecter). Se former en ligne (Mois 1 : Apprendre). Après 90 jours, il saura si l\'appel résonne encore. Alors il pourra prendre une décision éclairée (transition progressive, mi-temps, etc.).'
      },
      {
        id: 'q10',
        question: 'Dans le Plan d\'Exploration 90 jours, quelle est la bonne séquence des 3 mois ?',
        options: [
          'A) Expérimenter → Apprendre → Connecter',
          'B) Connecter → Expérimenter → Apprendre',
          'C) Apprendre → Connecter → Expérimenter',
          'D) Apprendre → Expérimenter → Connecter'
        ],
        correctAnswer: 2,
        explanation: 'C) Apprendre → Connecter → Expérimenter - La séquence logique est : Mois 1 : APPRENDRE (comprendre le terrain, lire, rechercher). Mois 2 : CONNECTER (parler aux gens qui font déjà ce métier). Mois 3 : EXPÉRIMENTER (tester concrètement par des actions). Cette progression du théorique vers le concret permet de valider progressivement l\'authenticité de l\'appel.'
      },
      {
        id: 'q11',
        question: 'Thomas lance son Plan d\'Exploration 90 jours pour devenir développeur web. Mois 1 (Apprendre) : il suit 3 tutoriels en ligne et lit 2 livres. Mois 2 (Connecter) : il contacte 5 développeurs sur LinkedIn mais aucun ne répond. Il abandonne. Quelle est son erreur principale ?',
        options: [
          'A) Il aurait dû commencer par expérimenter directement',
          'B) Il n\'a pas persévéré dans la phase Connecter (5 contacts, c\'est insuffisant)',
          'C) Il aurait dû attendre 6 mois au lieu de 90 jours',
          'D) Son appel n\'était pas authentique dès le départ'
        ],
        correctAnswer: 1,
        explanation: 'B) Il n\'a pas persévéré dans la phase Connecter (5 contacts, c\'est insuffisant) - La règle d\'or du networking : 5 contacts = trop peu. Vise 15-20 contacts minimum. Utilise plusieurs canaux (LinkedIn, événements, communautés en ligne). Personnalise tes messages. Ne pas recevoir de réponses après 5 tentatives n\'est PAS un signal que l\'appel n\'est pas authentique, c\'est juste une question de volume et de méthode.'
      },
      {
        id: 'q12',
        question: 'Quelles sont les 3 actions concrètes du Mois 3 (EXPÉRIMENTER) du Plan d\'Exploration 90 jours ? (Note: Sélectionne les réponses A, C, et E)',
        options: [
          'A) Créer un petit projet personnel lié au domaine',
          'B) Démissionner pour se consacrer à plein temps',
          'C) Offrir 2-3 services gratuits pour tester',
          'D) S\'inscrire à une formation certifiante longue',
          'E) Documenter ton expérience (blog, journal)',
          'F) Attendre que les opportunités viennent à toi'
        ],
        correctAnswer: 0,
        explanation: 'A, C, et E sont corrects - Les 3 actions concrètes du Mois 3 : 1) Projet perso : Crée quelque chose de concret, même petit. 2) Services gratuits : Offre 2-3 prestations gratuites pour tester la réalité du métier. 3) Documentation : Tiens un journal de bord de ton expérience. Démissionner (B) est prématuré. Une formation longue (D) vient APRÈS validation de l\'appel. Attendre passivement (F) n\'est pas expérimenter.'
      },
      {
        id: 'q13',
        question: 'À la fin des 90 jours d\'exploration, si ton appel ne résonne plus aussi fort qu\'au début, cela signifie que tu as échoué et perdu ton temps.',
        options: [
          'A) Vrai',
          'B) Faux'
        ],
        correctAnswer: 1,
        explanation: 'FAUX - Si après 90 jours d\'exploration concrète ton appel ne résonne plus, ce n\'est PAS un échec. C\'est une victoire d\'information. Tu as appris quelque chose d\'essentiel : ce n\'était pas le bon appel, ou pas le bon moment. Tu as économisé des années de fausse route. Retourne à l\'étape 1, cherche un autre signal. 90 jours investis pour éviter 5 ans de mauvaise direction = excellent ROI.'
      },
      {
        id: 'q14',
        question: 'Quelle est la question ultime à te poser au bout des 90 jours d\'exploration ?',
        options: [
          'A) "Ai-je gagné de l\'argent avec cette exploration ?"',
          'B) "Est-ce que mon entourage approuve maintenant ?"',
          'C) "Est-ce que cet appel résonne encore plus fort qu\'au jour 1 ?"',
          'D) "Suis-je devenu expert dans ce domaine ?"'
        ],
        correctAnswer: 2,
        explanation: 'C) "Est-ce que cet appel résonne encore plus fort qu\'au jour 1 ?" - C\'est LA question décisive. Après 90 jours d\'apprentissage, de connexions et d\'expérimentation : Si OUI → C\'est un vrai appel authentique. Passe à l\'action concrète (Station 5 : Franchir le Seuil). Si NON → Ce n\'était pas le bon appel. Retourne à l\'observation des signaux. L\'argent (A), l\'approbation sociale (B) et l\'expertise (D) ne sont pas les bons critères à 90 jours.'
      },
      {
        id: 'q15',
        question: 'Léa, 42 ans, ressent depuis 8 mois un signal vers le métier de photographe de mariage (Appel-Insatisfaction progressif). Elle valide 5/5 critères. Elle lance son Plan 90 jours. Mois 1 : formation en ligne photo. Mois 2 : elle rencontre 12 photographes. Mois 3 : elle photographie gratuitement 2 mariages d\'amis. Bilan à J+90 : "J\'ai adoré l\'acte photographique, mais le stress de ne rien rater, les horaires (12h debout), la pression des clients... ça me mine. Mon appel était peut-être la photo, mais pas les mariages." Que devrait faire Léa ?',
        options: [
          'A) Abandonner complètement l\'idée de la photographie',
          'B) Continuer les mariages en espérant s\'y habituer',
          'C) Affiner son appel : explorer d\'autres niches photo (portraits, produits, reportage)',
          'D) Considérer que son test a échoué et retourner à son emploi sans rien changer'
        ],
        correctAnswer: 2,
        explanation: 'C) Affiner son appel : explorer d\'autres niches photo (portraits, produits, reportage) - Léa a fait une découverte précieuse : elle aime la PHOTO, mais pas le contexte MARIAGE. C\'est une maturation de l\'appel, pas un échec. Son vrai appel est peut-être : Photo de portraits en studio (moins de stress), Photo de produits e-commerce (créativité sans pression humaine), Photo documentaire/reportage (autre rythme). Elle doit lancer un nouveau cycle 90 jours sur une niche photographique différente. Les appels peuvent muter et s\'affiner. C\'est normal et sain.'
      },
      {
        id: 'q16',
        question: 'David ressent simultanément 3 appels différents : (1) Créer une startup tech, (2) Devenir coach sportif, (3) Partir vivre 6 mois en Asie. Les 3 résonnent fort. Il est paralysé. Quelle est la meilleure stratégie ?',
        options: [
          'A) Choisir celui qui paie le mieux à court terme',
          'B) Choisir celui que son entourage préfère',
          'C) Tester les 3 en parallèle pendant 90 jours',
          'D) Faire le Plan 90 jours sur UN seul appel d\'abord (celui qui a le score 5 critères le plus élevé), puis tester les autres séquentiellement'
        ],
        correctAnswer: 3,
        explanation: 'D) Faire le Plan 90 jours sur UN seul appel d\'abord, puis tester les autres séquentiellement - Tester 3 appels en parallèle (C) dilue ton attention et ton énergie. Aucun ne recevra l\'exploration approfondie nécessaire. Stratégie recommandée : 1) Passe les 3 appels au filtre des 5 critères. 2) Classe-les par score. 3) Teste le #1 pendant 90 jours. 4) Selon le résultat, teste le #2. 5) Puis le #3. Certains appels vont s\'estomper pendant que tu en explores un autre. C\'est normal. Les vrais appels authentiques persistent même quand tu les mets de côté temporairement.'
      },
      {
        id: 'q17',
        question: 'Sarah, 35 ans, mère de 2 enfants, entend un appel clair vers la reconversion en psychologie (5/5 critères). Mais : 5 ans d\'études nécessaires, revenus bloqués pendant ce temps, crédit immobilier en cours. Elle pense : "Mon appel est authentique, mais le timing est impossible. Je dois attendre 10 ans." A-t-elle raison ?',
        options: [
          'A) Oui, elle doit attendre que les conditions soient parfaites',
          'B) Non, elle peut explorer des voies alternatives (formation progressive, psycho du travail avec cursus plus court, coaching certifié, etc.)',
          'C) Non, elle doit démissionner et se lancer immédiatement malgré les risques',
          'D) Son appel n\'est pas authentique si elle n\'est pas prête à tout sacrifier'
        ],
        correctAnswer: 1,
        explanation: 'B) Non, elle peut explorer des voies alternatives (formation progressive, cursus plus court, coaching certifié) - Un appel authentique ne signifie pas "tout ou rien immédiatement". Sarah peut : Explorer la psychologie du travail (master plus court, souvent compatible temps partiel), Se former au coaching certifié (6-12 mois) qui utilise des outils psychologiques, Faire un DU de psychologie en cours du soir sur 2-3 ans, Travailler dans des associations d\'aide psychologique pour tester le terrain, Faire une VAE si elle a de l\'expérience pertinente. L\'appel vers "la psychologie" peut se manifester par 15 chemins différents. Le Plan 90 jours doit justement explorer ces alternatives réalistes. Attendre 10 ans (A) = ignorer l\'appel. Tout sacrifier (C) = irresponsable. L\'option D est toxique : un vrai appel cherche des solutions créatives, pas des sacrifices aveugles.'
      }
    ],
    duration: '20 min',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 3,
    emoji: '🚫',
    title: 'Le Refus de l\'Appel',
    subtitle: 'Comprendre tes résistances',
    phase: 'depart',
    phaseName: 'Phase 1 : Le Départ',
    description: 'Comprendre tes résistances et les dépasser pour avancer.',
    objectives: [
      'Identifier tes peurs et résistances au changement',
      'Comprendre d\'où viennent ces blocages',
      'Reconnaître les excuses que tu te donnes',
      'Transformer tes résistances en leviers d\'action'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Les Freins',
        description: 'Liste tes principales résistances au changement',
        questions: [
          'Quelle est ta plus grande peur face à ce changement ?',
          'Quelle excuse te donnes-tu le plus souvent pour ne pas agir ?',
          'Qu\'est-ce qui te retient vraiment ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Anatomie de la Résistance',
        description: 'Analyse en détail tes mécanismes de résistance',
        questions: [
          'Liste 5 raisons pour lesquelles tu ne peux pas changer maintenant - sont-elles vraies ?',
          'Quelles peurs concrètes (financières, sociales, identitaires) te paralysent ?',
          'Qui dans ton entourage pourrait désapprouver ce changement et pourquoi cela t\'affecte ?',
          'Quel "confort" devrais-tu abandonner pour répondre à l\'appel ?',
          'Comment te protèges-tu du changement (procrastination, sabotage, rationalisation) ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Les Racines de la Peur',
        description: 'Explore les origines profondes de tes résistances',
        questions: [
          'D\'où viennent ces peurs - quelle expérience passée les a ancrées en toi ?',
          'Quelle croyance sur toi-même te fait penser que tu n\'es pas capable de changer ?',
          'Si tu refuses cet appel, quelle version de toi vas-tu trahir ?',
          'Quel est le coût réel (émotionnel, spirituel, vital) de ne PAS changer ?',
          'Quelle conversation difficile évites-tu d\'avoir (avec toi-même ou les autres) ?',
          'Comment tes résistances reproduisent-elles des schémas familiaux ou culturels ?',
          'Si tu savais que tu ne peux pas échouer, que ferais-tu différemment ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 4,
    emoji: '🧙',
    title: 'La Rencontre avec le Mentor',
    subtitle: 'Trouver tes guides',
    phase: 'depart',
    phaseName: 'Phase 1 : Le Départ',
    description: 'Trouver et utiliser les guides qui peuvent t\'aider dans ta transformation.',
    objectives: [
      'Identifier qui peut t\'accompagner dans ta transformation',
      'Reconnaître les différentes formes de mentorat',
      'Apprendre à demander de l\'aide',
      'Intégrer les enseignements de tes mentors'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Qui Peut M\'Aider ?',
        description: 'Identifie tes sources de soutien et de guidance',
        questions: [
          'Qui admires-tu dans le domaine professionnel qui t\'intéresse ?',
          'Qui dans ton entourage a déjà réussi une transformation similaire ?',
          'Quelle ressource (livre, podcast, formation) pourrait te guider ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Carte des Mentors',
        description: 'Crée une carte complète de tes ressources de mentorat',
        questions: [
          'Liste 3 personnes qui pourraient te mentorer directement - comment les approcher ?',
          'Quels mentors "virtuels" (auteurs, leaders, créateurs de contenu) t\'inspirent ?',
          'Quelles communautés ou réseaux professionnels peuvent t\'apporter du soutien ?',
          'Quelle formation ou accompagnement pourrait accélérer ta transformation ?',
          'Qui dans ton passé t\'a déjà donné des conseils que tu n\'as pas suivis ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Le Mentor Intérieur',
        description: 'Explore toutes les formes de guidance disponibles',
        questions: [
          'Raconte une situation où quelqu\'un t\'a aidé à voir les choses différemment - qu\'as-tu appris ?',
          'Si tu pouvais avoir 3 mentors (vivants ou morts) pour t\'accompagner, qui choisirais-tu et pourquoi ?',
          'Quelle sagesse intérieure possèdes-tu déjà mais que tu n\'écoutes pas ?',
          'Comment peux-tu devenir ton propre mentor - que te conseillerais-tu ?',
          'Quelles résistances as-tu à demander de l\'aide et d\'où viennent-elles ?',
          'Quelle expérience difficile du passé contient un enseignement pour ton présent ?',
          'Si tu imaginais un "conseil des sages" pour te guider, qui y inviterais-tu ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-purple-600 to-indigo-700'
  },
  {
    id: 5,
    emoji: '🚪',
    title: 'Le Franchissement du Seuil',
    subtitle: 'Passer à l\'action',
    phase: 'depart',
    phaseName: 'Phase 1 : Le Départ',
    description: 'Passer à l\'action et quitter définitivement ton ancien monde.',
    objectives: [
      'Prendre la décision d\'agir concrètement',
      'Identifier la première action à poser',
      'S\'engager publiquement dans ta transformation',
      'Célébrer ce moment de passage'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Le Premier Pas',
        description: 'Définis ta première action concrète',
        questions: [
          'Quelle est la première action concrète que tu peux faire cette semaine ?',
          'À qui vas-tu annoncer ta décision de changement ?',
          'Comment vas-tu célébrer ce franchissement de seuil ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Le Plan d\'Action',
        description: 'Construis ton plan de franchissement du seuil',
        questions: [
          'Quelles 3 actions concrètes marqueront ton engagement dans cette transformation ?',
          'Quelle date limite te fixes-tu pour franchir ce seuil de façon irrévocable ?',
          'Qu\'est-ce qui doit changer dans ton quotidien dès maintenant ?',
          'Comment vas-tu gérer les réactions de ton entourage ?',
          'Quel système de support vas-tu mettre en place pour tenir ton engagement ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'L\'Engagement Total',
        description: 'Prends un engagement profond et irrévocable',
        questions: [
          'Rédige ton "contrat sacré" avec toi-même - à quoi t\'engages-tu exactement ?',
          'Quelle partie de ton ancienne identité dois-tu laisser derrière toi ?',
          'Comment vas-tu ritualiser ce passage pour qu\'il devienne inoubliable ?',
          'Si tu écrivais une lettre à ton "futur moi" dans 1 an, que lui dirais-tu sur ce moment ?',
          'Quelles peurs subsistent encore et comment vas-tu les traverser ?',
          'Quel symbole ou objet peut représenter ce franchissement de seuil ?',
          'Comment ton engagement d\'aujourd\'hui transforme-t-il le sens de ton parcours ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-emerald-600 to-teal-700'
  },

  // ==========================================
  // PHASE 2 : L'INITIATION
  // ==========================================
  {
    id: 6,
    emoji: '⚔️',
    title: 'Les Épreuves, Alliés et Ennemis',
    subtitle: 'Naviguer les premiers défis',
    phase: 'initiation',
    phaseName: 'Phase 2 : L\'Initiation',
    description: 'Naviguer les premiers défis et identifier qui t\'aide ou te freine.',
    objectives: [
      'Reconnaître les obstacles sur ton chemin',
      'Identifier tes véritables alliés',
      'Comprendre qui ou quoi te freine',
      'Développer ta stratégie de navigation'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Alliés vs Obstacles',
        description: 'Cartographie rapide de ton environnement',
        questions: [
          'Quel est ton plus grand obstacle actuel ?',
          'Qui t\'aide vraiment dans ta transformation ?',
          'Quelle ressource ou compétence te manque le plus ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Stratégie de Navigation',
        description: 'Analyse détaillée de ton terrain de jeu',
        questions: [
          'Liste 3 épreuves concrètes que tu rencontres déjà dans ta transformation',
          'Qui sont tes 3 plus grands alliés et comment peuvent-ils t\'aider davantage ?',
          'Qui ou quoi joue le rôle d\'"ennemi" (personnes, circonstances, croyances) ?',
          'Quelles compétences dois-tu développer pour surmonter ces épreuves ?',
          'Comment peux-tu transformer un obstacle en opportunité ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Le Champ de Bataille Intérieur',
        description: 'Explore les dynamiques profondes du combat',
        questions: [
          'Raconte ta première "défaite" ou difficulté - qu\'as-tu appris ?',
          'Quelles parties de toi sont tes meilleurs alliés et lesquelles te sabotent ?',
          'Comment tes "ennemis" extérieurs reflètent-ils tes conflits intérieurs ?',
          'Quelle est la différence entre les obstacles réels et ceux que tu t\'inventes ?',
          'Si chaque épreuve était un enseignant, que cherche-t-elle à te révéler ?',
          'Comment peux-tu développer ta résilience face aux inévitables échecs ?',
          'Quelle nouvelle identité est en train d\'émerger à travers ces épreuves ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-red-700 to-orange-800'
  },
  {
    id: 7,
    emoji: '🗻',
    title: 'L\'Approche de la Caverne',
    subtitle: 'Se préparer à l\'épreuve majeure',
    phase: 'initiation',
    phaseName: 'Phase 2 : L\'Initiation',
    description: 'Te préparer mentalement et stratégiquement avant l\'épreuve majeure.',
    objectives: [
      'Identifier ton épreuve majeure à venir',
      'Te préparer mentalement et émotionnellement',
      'Rassembler tes ressources',
      'Développer ta stratégie d\'approche'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'La Grande Épreuve',
        description: 'Identifie ce qui t\'attend',
        questions: [
          'Quelle est la plus grande épreuve qui t\'attend dans ta transformation ?',
          'Qu\'est-ce qui te fait le plus peur dans cette épreuve ?',
          'De quoi as-tu besoin pour être prêt(e) ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Préparation Stratégique',
        description: 'Construis ton plan de préparation',
        questions: [
          'Décris précisément l\'épreuve majeure qui se profile (entretien crucial, changement majeur, etc.)',
          'Quelles sont tes 3 plus grandes peurs face à cette épreuve ?',
          'Quelles ressources (compétences, personnes, outils) dois-tu rassembler ?',
          'Comment peux-tu te préparer mentalement et émotionnellement ?',
          'Quel est ton plan B si les choses ne se passent pas comme prévu ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'La Descente Consciente',
        description: 'Prépare-toi en profondeur pour la transformation',
        questions: [
          'Pourquoi cette épreuve est-elle absolument nécessaire à ta transformation ?',
          'Quelle version de toi doit "mourir" pour que tu puisses traverser cette épreuve ?',
          'Comment cette épreuve s\'inscrit-elle dans les schémas récurrents de ta vie ?',
          'Si tu devais traverser cette épreuve avec courage et grâce, comment t\'y prendrais-tu ?',
          'Quelle sagesse intérieure possèdes-tu déjà pour affronter cela ?',
          'Comment peux-tu transformer cette peur en force motrice ?',
          'Quel rituel ou pratique peut t\'aider à entrer dans cette épreuve avec présence ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-slate-700 to-gray-800'
  },
  {
    id: 8,
    emoji: '🔥',
    title: 'L\'Épreuve Suprême',
    subtitle: 'Affronter ta plus grande peur',
    phase: 'initiation',
    phaseName: 'Phase 2 : L\'Initiation',
    description: 'Affronter ta plus grande peur et traverser le moment décisif.',
    objectives: [
      'Traverser ton moment de transformation majeur',
      'Affronter ta peur la plus profonde',
      'Découvrir ta force véritable',
      'Mourir à ton ancienne identité pour renaître'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Face au Feu',
        description: 'Confronte directement ton épreuve',
        questions: [
          'Qu\'est-ce que tu dois affronter maintenant ?',
          'Quelle est la première étape pour traverser cette épreuve ?',
          'Quelle force en toi peut t\'aider à tenir bon ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'La Traversée',
        description: 'Navigue consciemment ton épreuve suprême',
        questions: [
          'Raconte ce qui se passe pendant que tu traverses cette épreuve - quelles émotions ?',
          'Qu\'est-ce qui est en train de "mourir" en toi et qu\'est-ce qui naît ?',
          'Quelle vérité sur toi-même découvres-tu dans cette épreuve ?',
          'Comment tes peurs se transforment-elles quand tu les affrontes ?',
          'Qui es-tu en train de devenir à travers cette épreuve ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Mort et Renaissance',
        description: 'Traverse consciemment ta transformation profonde',
        questions: [
          'Décris le moment exact où tu as senti que quelque chose en toi mourait - comment était-ce ?',
          'Quelle croyance fondamentale sur toi-même s\'est effondrée ?',
          'Comment cette épreuve révèle-t-elle qui tu es vraiment, au-delà de tes peurs ?',
          'Quelle nouvelle identité émerge de l\'autre côté de cette épreuve ?',
          'Si tu devais donner un sens sacré à cette épreuve, quel serait-il ?',
          'Comment cette transformation change-t-elle ta relation à toi-même et au monde ?',
          'Quelle sagesse essentielle as-tu gagnée en traversant ce feu ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-orange-700 to-red-900'
  },
  {
    id: 9,
    emoji: '🏆',
    title: 'La Récompense',
    subtitle: 'Récolter les fruits de ta transformation',
    phase: 'initiation',
    phaseName: 'Phase 2 : L\'Initiation',
    description: 'Récolter les fruits de ta transformation et intégrer ton nouveau moi.',
    objectives: [
      'Reconnaître ce que tu as gagné',
      'Intégrer ta nouvelle identité',
      'Célébrer ta victoire',
      'Comprendre ce qui a changé en toi'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Le Trésor',
        description: 'Identifie ce que tu as gagné',
        questions: [
          'Qu\'as-tu gagné en traversant cette épreuve ?',
          'Comment te sens-tu différent(e) maintenant ?',
          'Quelle nouvelle capacité as-tu découverte en toi ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Intégration de la Victoire',
        description: 'Analyse et intègre ta transformation',
        questions: [
          'Liste 3 choses concrètes que tu as gagnées (compétences, insights, confiance)',
          'Comment ta vision de toi-même a-t-elle changé ?',
          'Quelles nouvelles possibilités s\'ouvrent maintenant à toi ?',
          'Comment vas-tu ancrer cette transformation dans ta vie quotidienne ?',
          'Que dirais-tu à quelqu\'un qui s\'apprête à traverser la même épreuve ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Le Nouveau Moi',
        description: 'Explore en profondeur ta nouvelle identité',
        questions: [
          'Qui es-tu devenu(e) à travers cette transformation - décris cette nouvelle version de toi',
          'Quelle "récompense" invisible as-tu reçue (sagesse, force intérieure, clarté) ?',
          'Comment cette victoire modifie-t-elle le récit que tu te racontes sur toi-même ?',
          'Quelle ancienne limite as-tu transcendée et comment cela change-t-il tout ?',
          'Si tu devais symboliser ta récompense par un objet ou une image, ce serait quoi ?',
          'Comment peux-tu honorer et célébrer cette victoire de façon significative ?',
          'Quel est le cadeau le plus précieux que cette épreuve t\'a offert ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-yellow-600 to-amber-700'
  },

  // ==========================================
  // PHASE 3 : LE RETOUR
  // ==========================================
  {
    id: 10,
    emoji: '🚶',
    title: 'Le Chemin du Retour',
    subtitle: 'Revenir avec ta nouvelle identité',
    phase: 'retour',
    phaseName: 'Phase 3 : Le Retour',
    description: 'Revenir vers ton monde avec ta nouvelle identité et gérer les résistances.',
    objectives: [
      'Intégrer ta transformation dans ton quotidien',
      'Gérer les résistances de ton environnement',
      'Maintenir ta nouvelle identité',
      'Planifier ton nouveau parcours professionnel'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Le Retour au Quotidien',
        description: 'Ramène ta transformation dans ta vie',
        questions: [
          'Comment vas-tu intégrer ta nouvelle identité dans ton quotidien ?',
          'Quelle résistance anticipes-tu de ton entourage ?',
          'Quelle est ta première action concrète dans ton nouveau parcours ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Stratégie d\'Intégration',
        description: 'Planifie ton retour et ton nouveau départ',
        questions: [
          'Quels changements concrets vas-tu apporter à ta vie professionnelle ?',
          'Comment vas-tu communiquer ta transformation à ton entourage ?',
          'Quelles nouvelles habitudes vas-tu mettre en place pour maintenir ce changement ?',
          'Comment vas-tu gérer ceux qui préfèrent ton "ancien moi" ?',
          'Quel est ton plan d\'action pour les 3 prochains mois ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'L\'Intégration Profonde',
        description: 'Ancre ta transformation dans tous les aspects de ta vie',
        questions: [
          'Comment ton nouveau moi va-t-il transformer toutes tes relations (travail, famille, amis) ?',
          'Quelles parties de ton ancienne vie sont encore compatibles avec ton nouveau moi ?',
          'Comment vas-tu naviguer le décalage entre qui tu es devenu et comment les autres te voient ?',
          'Quel système de support vas-tu créer pour ne pas retomber dans tes anciens schémas ?',
          'Si tu devais réécrire ton CV/profil LinkedIn avec cette nouvelle identité, que dirais-tu ?',
          'Comment ta transformation peut-elle servir les autres ?',
          'Quel engagement prends-tu envers ton nouveau moi pour les 12 prochains mois ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-sky-600 to-blue-700'
  },
  {
    id: 11,
    emoji: '🦋',
    title: 'La Résurrection',
    subtitle: 'Prouver ta transformation',
    phase: 'retour',
    phaseName: 'Phase 3 : Le Retour',
    description: 'Prouver publiquement ta transformation face aux témoins.',
    objectives: [
      'Démontrer ta transformation de façon visible',
      'Passer le test final de ton nouveau moi',
      'T\'affirmer dans ta nouvelle identité',
      'Inspirer les autres par ton exemple'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Le Test Public',
        description: 'Identifie comment tu vas prouver ta transformation',
        questions: [
          'Quelle action publique va démontrer ta transformation ?',
          'Qui sera témoin de ton nouveau moi ?',
          'Comment vas-tu célébrer cette résurrection ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'L\'Affirmation Publique',
        description: 'Planifie ta démonstration de transformation',
        questions: [
          'Quelle action concrète et visible vas-tu poser pour affirmer ton nouveau moi ?',
          'Comment vas-tu partager ton histoire de transformation ?',
          'Quel "test" final te permettra de prouver que tu as vraiment changé ?',
          'Comment vas-tu gérer les doutes ou critiques possibles ?',
          'De quelle façon peux-tu inspirer les autres par ton parcours ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'La Naissance Publique',
        description: 'Incarne pleinement ta transformation devant témoins',
        questions: [
          'Raconte comment tu vas "renaître" publiquement - quelle sera cette démonstration ?',
          'Quelle peur finale dois-tu encore affronter pour t\'affirmer complètement ?',
          'Comment ton nouveau moi va-t-il réagir face aux situations qui auraient déstabilisé l\'ancien ?',
          'Si tu devais faire un "discours" sur ta transformation, que dirais-tu ?',
          'Comment ta résurrection inspire-t-elle une nouvelle mission ou un nouveau but ?',
          'Quel héritage veux-tu laisser à travers cette transformation ?',
          'Comment cette renaissance change-t-elle fondamentalement ta relation au monde ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-cyan-600 to-teal-700'
  },
  {
    id: 12,
    emoji: '💎',
    title: 'Le Retour avec l\'Élixir',
    subtitle: 'Partager ton parcours',
    phase: 'retour',
    phaseName: 'Phase 3 : Le Retour',
    description: 'Partager ton parcours et devenir le guide pour les autres.',
    objectives: [
      'Synthétiser ton apprentissage complet',
      'Identifier ton "élixir" unique',
      'Planifier comment aider les autres',
      'Célébrer ton parcours de transformation'
    ],
    exercises: [
      {
        level: 'explorateur',
        title: 'Ton Élixir',
        description: 'Identifie ce que tu ramènes de ton voyage',
        questions: [
          'Quel est ton "élixir" - le cadeau que tu ramènes de ton voyage ?',
          'Comment vas-tu partager ce que tu as appris ?',
          'Qui peux-tu aider maintenant avec ton expérience ?'
        ],
        duration: '5 min'
      },
      {
        level: 'chercheur',
        title: 'Le Don aux Autres',
        description: 'Planifie comment partager ton élixir',
        questions: [
          'Quelle est la leçon la plus importante que tu as apprise dans ce parcours ?',
          'Comment peux-tu utiliser ton expérience pour aider d\'autres chercheurs d\'emploi ?',
          'Quel conseil donnerais-tu à quelqu\'un qui commence ce voyage ?',
          'Comment vas-tu continuer à grandir et évoluer ?',
          'Quelle sera ta prochaine aventure professionnelle ?'
        ],
        duration: '15 min'
      },
      {
        level: 'plongeur',
        title: 'Le Héros Devient Guide',
        description: 'Intègre ta sagesse et deviens mentor pour les autres',
        questions: [
          'Raconte l\'histoire complète de ton voyage - du monde ordinaire à aujourd\'hui',
          'Quelle sagesse unique as-tu gagnée que personne d\'autre ne pourrait avoir exactement de la même façon ?',
          'Comment ton "élixir" peut-il transformer la vie des autres chercheurs d\'emploi ?',
          'Si tu devais créer un guide ou un rituel pour les futurs voyageurs, ce serait quoi ?',
          'Comment cette transformation s\'inscrit-elle dans le sens plus large de ta vie ?',
          'Quel est ton engagement pour continuer à grandir et ne pas retomber dans l\'ancien monde ?',
          'Comment peux-tu honorer ce voyage et tous ceux qui t\'ont aidé en chemin ?',
          'Quel est ton prochain appel à l\'aventure ?'
        ],
        duration: '30 min'
      }
    ],
    duration: '20 min',
    color: 'from-violet-600 to-purple-700'
  }
];

/**
 * Récupère une station par son ID
 */
export const getStationById = (id: number): Station | undefined => {
  return stations.find(station => station.id === id);
};

/**
 * Récupère toutes les stations d'une phase
 */
export const getStationsByPhase = (phase: 'depart' | 'initiation' | 'retour'): Station[] => {
  return stations.filter(station => station.phase === phase);
};

/**
 * Récupère les exercices d'une station pour un niveau donné
 */
export const getExerciseForLevel = (
  stationId: number,
  level: 'explorateur' | 'chercheur' | 'plongeur'
): Exercise | undefined => {
  const station = getStationById(stationId);
  return station?.exercises.find(ex => ex.level === level);
};
