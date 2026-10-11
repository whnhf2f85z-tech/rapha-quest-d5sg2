// ============================================================================
//  CONTENU DU JEU — c'est le seul fichier à modifier (plus le dossier assets/).
//  Tout ce qui est marqué « À REMPLACER » est un exemple à remplacer.
//  Les réponses ne sont jamais écrites en clair : on colle ici des « hash »
//  fabriqués avec tools/hash.html (voir README.md).
// ============================================================================

export default {
  // --------------------------------------------------------------------------
  //  Général
  // --------------------------------------------------------------------------
  playerName: 'Raphaëlle',

  common: {
    pageTitle: 'Raphaëlle — la quête',
    notebookButton: 'Carnet',
    notebookTitle: 'Carnet de piste',
    notebookIntro: 'Examine chaque indice avec attention : ensemble, ils mènent à ton cadeau. Aucun n’est là par hasard.',
    notebookLocked: 'Indice encore verrouillé',
    close: 'Fermer',
    soundOn: 'Son activé',
    soundOff: 'Son coupé',
    next: 'Continuer',
    back: 'Revenir à l’épreuve en cours',
    validate: 'Valider',
    solvedStamp: 'Validé',
    clueUnlocked: 'Nouvel indice dans ton carnet',
    readOnlyNote: 'Épreuve déjà réussie. On admire, on ne touche plus.',
    lockedStage: 'Pas encore. Chaque chose en son temps.',
    nudgeTitle: 'Coup de pouce',
    removePin: 'Retirer l’épingle',
    progressLabel: 'Progression',
    resetDone: 'Progression effacée. On repart de zéro.',
    loadError: 'Oups, une image refuse de se montrer. Recharge la page.',
  },

  // Les noms courts des 11 étapes (barre de progression)
  stageNames: [
    'Accueil',
    'Le taquin',
    'Memory',
    'Culture générale',
    'Sudoku',
    'L’énigme',
    'Le chemin le plus rapide',
    'Où est-ce ?',
    'Ta demi-journée',
    'Le grand final',
    'Joyeux anniversaire',
  ],

  // Les 6 indices sur le lieu de la boutique, dans l'ordre où ils se gagnent :
  // 1 = taquin, 2 = memory, 3 = culture générale, 4 = énigme,
  // 5 = chemin le plus rapide, 6 = où est-ce ?
  // Jamais d'indice sur ce qui est vendu !
  clues: [
    'Indice : couleurs du pays de l’aigle à deux têtes',
    'Indice : la rue commence comme Aldo. Aldo a jeté son dé : tout ce qu’il reste de lui se cache dans le nom de la rue.',
    'Indice : les pièces du taquin le faisaient sans cesse. Garde le début du verbe, ajoute un i grec, et atterris.',
    'Indice : un pour tous, tous pour un. Ici, ce sont eux les patrons.',
    'Indice : comme à l’Inter Milan, ici, on a toujours le même objectif en vue.',
    'Indice : depuis chez toi, c’est 13 minutes si tu prends le volant, 1 h 49 si tu fais confiance à tes mollets. À dos d’éléphant, je n’ai pas chronométré. Moi, je viserais les 13 minutes.',
  ],

  // --------------------------------------------------------------------------
  //  1. Accueil
  // --------------------------------------------------------------------------
  welcome: {
    kicker: 'Une quête d’anniversaire',
    title: 'Bienvenue, {name}.',
    subtitle: 'Ton cadeau ne va pas se trouver tout seul.',
    rules: '7 épreuves, 1 lieu à trouver. Aucun raccourci.',
    details:
      'Les essais sont illimités et ta progression est sauvegardée. Chaque victoire ajoute un indice dans ton carnet. Garde-le précieusement.',
    start: 'Commencer',
    resume: 'Reprendre',
  },

  // --------------------------------------------------------------------------
  //  2. Le taquin
  // --------------------------------------------------------------------------
  taquin: {
    image: 'assets/photos/puzzle.jpg', // photo carrée (~1000 px)
    size: 3, // 3 = grille 3×3, 4 = grille 4×4
    text: {
      title: 'Le taquin',
      instruction: '', // vide = pas de ligne sous le titre
      moves: '{n} coups',
      movesOne: '{n} coup', // 0 ou 1
      solved: 'Brillant. Comme prévu.',
    },
  },

  // --------------------------------------------------------------------------
  //  3. Memory
  // --------------------------------------------------------------------------
  memory: {
    // 8 photos carrées (~400 px).
    images: [
      'assets/photos/memory-1.jpg',
      'assets/photos/memory-2.jpg',
      'assets/photos/memory-3.jpg',
      'assets/photos/memory-4.jpg',
      'assets/photos/memory-5.jpg',
      'assets/photos/memory-6.jpg',
      'assets/photos/memory-7.jpg',
      'assets/photos/memory-8.jpg',
    ],
    text: {
      title: 'Memory',
      instruction: 'Retrouve les 8 paires.',
      moves: '{n} coups',
      movesOne: '{n} coup', // 0 ou 1
      pairs: '{n} / 8 paires',
      cardLabel: 'Carte {n}',
    },
    // Message final selon le nombre de coups (le premier qui correspond gagne)
    endMessages: [
      { maxMoves: 13, text: 'Mémoire d’éléphant. Élégant, l’éléphant.' },
      { maxMoves: 18, text: 'Très propre. Je soupçonne un peu de chance, mais très propre.' },
      { maxMoves: 26, text: 'Réussi. Avec du suspense, mais réussi.' },
      { maxMoves: 9999, text: 'L’essentiel, c’est d’arriver. Et tu es arrivée.' },
    ],
  },

  // --------------------------------------------------------------------------
  //  4. Culture générale
  //  answer = numéro de la bonne réponse (0 = première, 1 = deuxième, …)
  // --------------------------------------------------------------------------
  quiz: {
    questions: [
      {
        question: 'En quelle année est paru le premier album de Babar ?',
        options: ['1907', '1931', '1952', '1968'],
        answer: 1,
        fact: 'L’histoire a d’abord été inventée par Cécile de Brunhoff pour endormir ses fils. Son mari Jean l’a illustrée, puis leur fils Laurent a repris la série.',
        nudge: 'Entre les deux guerres.',
      },
      {
        question: 'Combien de temps dure la gestation d’une éléphante ?',
        options: ['9 mois', '14 mois', '22 mois', '30 mois'],
        answer: 2,
        fact: 'Près de deux ans : c’est la grossesse la plus longue de tous les mammifères terrestres.',
        nudge: 'Bien plus long que chez nous. Mais moins de deux ans et demi.',
      },
      {
        question: 'Quel est l’un des plus proches cousins vivants de l’éléphant ?',
        options: ['Le rhinocéros', 'L’hippopotame', 'Le daman', 'Le tapir'],
        answer: 2,
        fact: 'Le daman ressemble à une grosse marmotte. Avec les lamantins, c’est pourtant l’un des plus proches parents de l’éléphant.',
        nudge: 'Le plus petit et le plus inattendu de la liste.',
      },
      {
        question: 'Les défenses de l’éléphant sont en réalité…',
        options: ['Des canines', 'Des cornes', 'Des molaires', 'Des incisives'],
        answer: 3,
        fact: 'Ce sont des incisives qui poussent toute la vie de l’animal.',
        nudge: 'Ce sont bien des dents. Celles de devant.',
      },
      {
        question: 'Qu’est-ce qu’un éléphant adulte est incapable de faire ?',
        options: ['Nager', 'Sauter', 'Courir', 'Se coucher'],
        answer: 1,
        fact: 'Il nage très bien, en se servant de sa trompe comme d’un tuba. Mais ses quatre pieds ne quittent jamais le sol en même temps.',
        nudge: 'Il nage, il court, il dort couché. Il reste une possibilité.',
      },
      {
        question: 'Combien d’espèces d’éléphants existe-t-il aujourd’hui ?',
        options: ['Une', 'Deux', 'Trois', 'Cinq'],
        answer: 2,
        fact: 'L’éléphant d’Asie, l’éléphant de savane et l’éléphant de forêt d’Afrique, reconnu comme une espèce à part entière.',
        nudge: 'L’Afrique en compte plus d’une.',
      },
      {
        // Question à classement : pas de choix proposés, elle tape les pays dans l'ordre.
        // accepted = autres orthographes acceptées pour chaque place.
        // Chiffres : Botswana 131 909 (2022), Gabon 95 000 (2021), Zimbabwe 65 028 (2022), Tanzanie 60 000 (2024).
        type: 'ranking',
        question: 'Cite les 4 pays qui comptent le plus d’éléphants, du premier au quatrième.',
        answer: ['Botswana', 'Gabon', 'Zimbabwe', 'Tanzanie'],
        accepted: [[], [], [], ['Tanzania']],
        fact: 'Le Botswana en abrite environ 130 000. La surprise, c’est le Gabon : 95 000 éléphants de forêt, comptés en 2021 grâce à l’ADN de leurs crottes.',
        nudge: 'Les quatre sont en Afrique : deux au sud, un à l’est, et un caché dans la forêt équatoriale.',
      },
    ],
    text: {
      title: 'Culture générale',
      instruction: 'Sept questions sur les éléphants, zéro faute autorisée. Les éléphants comptent sur toi.',
      counter: 'Question {n} sur {total}',
      wrong: [
        'Presque. Mais presque, ça ne compte qu’à la pétanque.',
        'Audacieux. Faux, mais audacieux.',
        'Non. L’éléphant est déçu. Et il s’en souviendra.',
      ],
      right: 'Exact.',
      rankingPlaceholder: 'Pays',
      rankingLabel: 'Pays numéro {n}',
      rankingPartial: '{n} sur {total} à la bonne place.',
      nextQuestion: 'Question suivante',
      finish: 'Terminer',
    },
  },

  // --------------------------------------------------------------------------
  //  5. Sudoku
  //  81 chiffres ligne par ligne, 0 = case vide. highlight = la case étoilée
  //  (ligne et colonne de 1 à 9), elle doit être vide dans « puzzle ».
  //  Pas de chiffres en rouge pendant le jeu ; quand la grille est pleine, le
  //  bouton vérifie la solution sans dire où est l'erreur. Prends une grille à
  //  solution unique. Le chiffre de la case étoilée (5 ici) est celui de l'énigme.
  // --------------------------------------------------------------------------
  sudoku: {
    puzzle: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    // Empreinte de la solution complète (81 chiffres), fabriquée avec tools/hash.html
    // (partie « Tester une réponse »). La solution elle-même n'est jamais écrite ici.
    solutionHash: '4c5e72057519c48e1a2430cbedb7cff3a4a1d244eb28b8d865f85141f643017d',
    highlight: { row: 5, col: 5 },
    text: {
      title: 'Sudoku',
      instruction: 'Un classique. Garde un œil sur la case étoilée.',
      pencil: 'Notes',
      erase: 'Effacer',
      cellLabel: 'Ligne {r}, colonne {c}',
      starLabel: 'case étoilée',
      finish: 'J’ai fini',
      notYet: 'Pas encore. Il y a au moins une erreur quelque part. Je ne dirai pas où.',
      filled: 'Grille juste. Retiens bien le chiffre de la case étoilée : tu en auras besoin.',
    },
  },

  // --------------------------------------------------------------------------
  //  6. L'énigme — {N} s'affiche comme un blanc : c'est le chiffre de la case
  //  étoilée du sudoku, qu'elle doit reprendre de sa grille.
  //  answers : hash fabriqués avec tools/hash.html (réponses d'exemple : voir README).
  //  N'écris JAMAIS la vraie réponse dans ce fichier, même en commentaire.
  // --------------------------------------------------------------------------
  riddle: {
    question:
      'Dans une salle où chaque mot finissait par une voyelle, une seule personne avait le droit de nous corriger. Elle répondait à un nom en deux moitiés de {N} lettres. La première fut saluée, pleine de grâce, par un messager ailé ; la seconde dansa en noir pour tromper un prince. Son nom de famille ne m’intéresse pas : je veux ce qui le précède.',
    // Réponses acceptées (hash fabriqués avec tools/hash.html). Ne les écris jamais en clair ici.
    answers: [
      '29f2a4b5a27e78e422603e34bfcf1af8ee035e86c142afe570365be32bd7db74',
      'ecfe823b15cdc919b23593baf24c941255329111654ed7933dc1e66eda659807',
      '4aa46b92dc0168d17a504543c451dd37fd8a48d533f6359403ca2a6b83c4495f',
    ],
    nudges: [
      'Quelle langue ne finit presque jamais un mot sur une consonne ? Repense à nos cours en commun.',
      'Le messager s’appelait Gabriel. La danseuse en noir vient du Lac des cygnes.',
      'Deux prénoms reliés par un trait d’union, et c’était notre prof.',
    ],
    text: {
      title: 'L’énigme',
      instruction: 'Il manque un chiffre. Tu sais où le trouver. Les accents, majuscules et traits d’union, je m’en charge.',
      blankLabel: 'chiffre manquant',
      placeholder: 'Ta réponse',
      wrong: ['Non.', 'Toujours non. Mais j’admire la persévérance.', 'Tu chauffes peut-être. Ou pas.'],
    },
  },

  // --------------------------------------------------------------------------
  //  7. Le chemin le plus rapide
  //  Elle touche la carte (n'importe où dans le monde) pour choisir ses villes
  //  étapes, dans l'ordre. Le site trouve le nom de chaque ville et calcule
  //  lui-même le vrai trajet le plus rapide en voiture (OpenStreetMap, gratuit).
  //  Gagné quand elle a au moins minStops villes, toutes à moins de corridorKm
  //  de ce trajet, dans le bon ordre. Pas besoin d'écrire la réponse.
  //  Villes seulement : jamais d'adresse exacte ici, ce fichier est public.
  // --------------------------------------------------------------------------
  route: {
    start: { name: 'Amiens', lat: 49.8942, lng: 2.2957 },
    end: { name: 'Zurich', lat: 47.3769, lng: 8.5417 },
    minStops: 10,
    maxStops: 25,
    corridorKm: 15, // distance max entre une ville et le trajet le plus rapide
    text: {
      title: 'Le chemin le plus rapide',
      instruction:
        'De chez toi ({start}) à chez moi ({end}), par le chemin le plus rapide. Touche la carte pour choisir au moins {n} villes étapes, dans l’ordre. Les kilomètres comptent, la vitesse aussi.',
      startLabel: 'Départ',
      endLabel: 'Arrivée',
      stopsLabel: 'Tes étapes ({n}/{min})',
      noStops: 'Aucune étape pour l’instant. Touche une ville sur la carte.',
      looking: 'Je cherche le nom de cette ville…',
      noCity: 'Pas de ville ici. Que de l’eau, ou presque.',
      duplicate: '{city} est déjà dans ton trajet.',
      tooFewStops: 'Il faut au moins {n} villes étapes. Pas de téléportation.',
      tooManyStops: '{n} étapes maximum. C’est un trajet, pas un tour du monde.',
      remove: 'Retirer {city}',
      undo: 'Annuler la dernière étape',
      restart: 'Recommencer',
      validate: 'Vérifier mon trajet',
      computing: 'Calcul de l’itinéraire…',
      offline: 'Le GPS fait la sieste. Réessaie dans un instant.',
      offOne: 'Une de tes villes t’oblige à un détour. Les détours, c’est pour les vacances.',
      offMany: '{n} de tes villes t’obligent à un détour. Les détours, c’est pour les vacances.',
      disorder: 'Les bonnes villes, mais dans le désordre : tu fais des allers-retours.',
      right: 'Imbattable : {km} km en {time}, le trajet le plus rapide. Tu viens quand tu veux.',
    },
  },

  // --------------------------------------------------------------------------
  //  8. Où est-ce ?
  // --------------------------------------------------------------------------
  place: {
    // Une photo d'un endroit où vous étiez ensemble, n'importe où dans le monde.
    image: 'assets/photos/place.jpg',
    imageAlt: 'Photo d’un endroit où nous étions ensemble',
    lat: 48.6353, // l'endroit exact de la photo
    lng: -2.0093,
    radiusMeters: 1000,
    map: { lat: 30, lng: 10, zoom: 2 }, // la carte part du monde entier
    text: {
      title: 'Où est-ce ?',
      instruction:
        'On y était ensemble. Retrouve l’endroit exact sur la carte, n’importe où dans le monde. Un kilomètre de marge, pas un de plus.',
      noPin: 'Pose d’abord une épingle sur la carte.',
      distance: 'Raté de {km} km.',
      hotter: 'Plus chaud.',
      colder: 'Plus froid.',
      same: 'Ni plus chaud, ni plus froid.',
      right: 'Trouvé, à {meters} m près. Je savais que tu t’en souviendrais.',
    },
  },

  // --------------------------------------------------------------------------
  //  9. Ta demi-journée
  // --------------------------------------------------------------------------
  halfDay: {
    // Fabrique un formulaire gratuit sur formspree.io et colle son adresse ici,
    // ex. 'https://formspree.io/f/abcdwxyz'. Vide = c'est le bouton e-mail qui s'affiche.
    formspreeEndpoint: 'https://formspree.io/f/mjygobkr',
    leaEmail: 'lea.lurois@laposte.net',
    emailSubject: 'Raphaëlle a choisi ses demi-journées',
    days: [
      { id: '2026-10-21', short: 'Mer. 21 oct.', long: 'mercredi 21 octobre' },
      { id: '2026-10-22', short: 'Jeu. 22 oct.', long: 'jeudi 22 octobre' },
      { id: '2026-10-23', short: 'Ven. 23 oct.', long: 'vendredi 23 octobre' },
      { id: '2026-10-24', short: 'Sam. 24 oct.', long: 'samedi 24 octobre' },
      { id: '2026-10-25', short: 'Dim. 25 oct.', long: 'dimanche 25 octobre' },
      { id: '2026-10-26', short: 'Lun. 26 oct.', long: 'lundi 26 octobre' },
      { id: '2026-10-27', short: 'Mar. 27 oct.', long: 'mardi 27 octobre' },
    ],
    // Créneaux indisponibles, ex. '2026-10-24-matin' ou '2026-10-27-apres-midi'
    disabled: [],
    text: {
      title: 'Ta demi-journée',
      instruction:
        'Choisis une ou plusieurs demi-journées entre le 21 et le 27 octobre où tu pourras faire le trajet jusqu’à la destination mystère.',
      morning: 'Matin',
      afternoon: 'Après-midi',
      morningLong: 'le matin',
      afternoonLong: 'l’après-midi',
      taken: 'Déjà pris. Désolée.',
      validateNone: 'Choisis au moins une demi-journée',
      validateOne: 'Valider ce choix',
      validateMany: 'Valider ces {n} demi-journées',
      and: 'et',
      confirm: '{When}. C’est noté dans le marbre ?',
      send: 'Oui, envoyer',
      change: 'Changer',
      sending: 'Envoi…',
      sent: 'Envoyé. Léa est prévenue.',
      failed: 'L’envoi n’a pas marché. Envoie-le-moi par e-mail, ça revient au même :',
      mailButton: 'Envoyer par e-mail',
      mailIntro: 'Envoie-moi ton choix par e-mail, puis reviens ici pour continuer.',
      mailAgain: 'Rouvrir l’e-mail',
      mailBody: 'Coucou Léa, je suis disponible : {when}. Raphaëlle',
      continueAnyway: 'C’est envoyé, on continue',
      locked: 'Ton choix : {when}. Pour changer, écris-moi directement.',
    },
  },

  // --------------------------------------------------------------------------
  //  10. Le grand final
  //  accepted : fabriqué avec tools/hash.html (le hash du nom + la carte chiffrée).
  //  N'écris JAMAIS le vrai nom ni l'adresse en clair dans ce fichier,
  //  même en commentaire : tout le monde peut le lire.
  // --------------------------------------------------------------------------
  final: {
    shop: { lat: 49.86565, lng: 2.3755 }, // l’entrée du magasin
    radiusMeters: 200,
    map: { lat: 46.6, lng: 2.4, zoom: 6 }, // vue de départ : la France entière, pour ne rien dévoiler
    accepted: [
      {
        hash: 'f8b2dff342e23fdc9e58dd1a4871a2aee83ea34c4f852b3aab109c91910aa41e',
        card: 'Ive9YsDDm0yyVp25+YojVA==.rgITomrsi1HWCaNh.XiO9D9dtadKZBpX0WgEFA5sKgXVssMUMJCekbNnje7UidcFbdUyuMH+g2KoRwthAnSjpaZfUBixbkipRJtyru/D+VBZHdjTvXdDJdHzpqMeL+w32VZ2S272mZQTB2BhjkuuiJCRQXxUdOa7jyGwgLGbvflCAnE7fW0Cc7bLtHWHnvjwCdurl7jSxiMnDx2JVZfvYdflhhTOpPryDqtbb85wh2C9eUWkxMBqj4h8vTm6EQFUiqxUX7/hdLdyJIo1wdn8felGQdZOUWF7evr6VHUTc+8EjNZnpuayRH9aL2EgNXEtTsvc1AQ==',
      },
      {
        hash: '793cec325ac62d8a789dbd454cee22a0d3b0fc3eec71710da5c100baef1fbf97',
        card: 'wr523QCFwN+bjYe00WBPUA==.Q04+i8F4SSNtA2f/.mgE67Vr66K6/dcUOyHExaVGhcNxlbFfJKVzLlXatk2jblXe8p9FCUvFMlM4ef8L4oECVB7qhQ6W97nLM3wS20mmQX9Y3g+fqpDeeFSTwQKOpZ0NZF8J6C2dBawJwgIOsFPmCooYct6uHQbTx9bvLaq/U/rKLkpOMNwkq1BLbfMJ1dLL6TfT6oTLiEOLE63ezYNnW4NXd8g+svqw4EQPMS7/PTyLyLwP7r3z2cxn8t211tiJxGCsifTlLJFrI/b7hIF41QQeg9XeoG6WVya9oOHOzpiBVwgAGNTnbdubcSY5PWI4y4joe9g==',
      },
      {
        hash: 'd092c880c462f3eb4e1f6276b8c6e23524246731d4991f7d88d66a488ea40b62',
        card: 'RFQJ+Lk5vKTwIQAC8Ez5bg==.pwTUbbYijaLfCpAi.8tyIEwovop/6Tb1Z5DPeH/w0V/ePWe3sNjWfCL0DFZsaAncMJQPSdD1q0cbWEVe0qfGIVdqxxA+5npDVCt4gqWJjs8pwe7piNqP83N1AVLvgybEDrdxX1P7Pi2Ec/x3u9iWXPp0H+BbFYRxo0WNNtAe2TkAyyXw8r8nk+exzmS5xpqJKJzW4aIFIinUe2pgnG1DcrymGsWXoemcBpscvLvJ1Ia1MjCCdwIe0mV0AEj1cimQnehVzF5DAKxvK7gXJh8LFn9qhBx4jG1Od7/NOQJbopfv/eIEDgkwBgOCdQA4mXjgY9angDg==',
      },
      {
        hash: '9fc835f14d5ef1e6f73eea0ad6bdf2d08cc43e483a5cc9c03e30f1c6cd4a7ff3',
        card: 'QHmdmXaQ0ElkarpjgJiwCA==.S5EcGPF4JAbNSvoA.SrOA6oCbPevXi7OZvPNi4F9UZl0p/FJN3KY0ii4D2L3qavuR1rnAtYcCUFZ4vNFzoaxi+NXhrwrqKVZSQXyGmAl1/dYQYafMw0IPEX/MGZ38sLJYM0q0RYqb5jI5K2NZWEdIAS4xECyzoykbS2sQRdH5p+qlz5QiQ0iZvDkRgOQC1JwFsRslbfwTh/4o6AQlLksgIxrjN7B0jKPNx7f1zZ/y9rXXXdguiVT0vuVjuIU9IjoEH4khEwYcNz3aYk2SLYPv6/xsTYuh0E7N9yLHoDp4TdyfnvT03+pBj+rBsEdeZNFv/e6yKA==',
      },
      {
        hash: '0b60fe129185e1d4cc216c681b562779b2821d1ae6afb7e113660147ce1e40f6',
        card: 'UmqZE4TJsoRD1MmyLSut4Q==.Uo55bLy1a9dRs7TV.ZtlpBap+F+1nMJkp3PIgqWs/zZXkIzISdyn8hRUBYhjw65Yaa9OKw0JbEHf6RTUqqMPmDb9XjHVdsUWaoQlA+EwB6gkTdt38qdR7QVR6yP9eygKohbqcOQbBF2ZYI1EobWXNVxV1yia5OFsOqzskL0J+Q9tbyOAdtYk85wC1+vcMSFD/9Enq8Dj0q6bZQpuGxn2ZGDJDosmuND9wnavJY5DF5KnkxEcdzQl2rBkZZZ4xg05qdNBer9D6OIeSG9YyN/1o5yybMy+OS3uOryr9LOUc4joq8AHHEI7Tf4ODdf2Q5TINt4Isdw==',
      },
    ],
    nudges: [
      'Relis l’indice des mousquetaires : ce sont eux les patrons.',
      'Un logo aux couleurs de l’Albanie, et on y fait ses courses.',
      'Le nom commence comme le club de Milan qui n’est pas l’AC.',
    ],
    text: {
      title: 'Le grand final',
      instruction: 'Deux serrures. D’abord le quartier, ensuite le nom. Ton carnet est ton meilleur ami.',
      lock1Title: 'Serrure 1 — le lieu',
      lock1Instruction: 'Pose l’épingle là où tu crois que se trouve la boutique.',
      noPin: 'Pose d’abord une épingle sur la carte.',
      hotter: 'Plus chaud.',
      colder: 'Plus froid.',
      miss: 'Pas tout à fait. Cherche encore.',
      lock1Done: 'Bien vu. Tu es dans le bon pâté de maisons.',
      lock2Title: 'Serrure 2 — le nom',
      lock2Instruction: 'Comment s’appelle la boutique ?',
      placeholder: 'Nom de la boutique',
      wrong: ['Non.', 'Non plus.', 'Ce n’est pas ça, mais l’orthographe était jolie.'],
      checking: 'Vérification…',
      cardKicker: 'Invitation',
      cardTitle: 'Ton cadeau t’attend ici',
      openMaps: 'Ouvrir dans Maps',
      rendezvousOne: 'Rendez-vous {when}. Demande-moi l’heure précise.',
      rendezvousMany: 'Rendez-vous {when}. Demande-moi le jour et l’heure précise.',
      or: 'ou',
      hoursLabel: 'Horaires',
      counterLabel: 'Au comptoir, dis simplement',
      next: 'Et maintenant…',
    },
  },

  // --------------------------------------------------------------------------
  //  11. Joyeux anniversaire
  // --------------------------------------------------------------------------
  birthday: {
    title: 'Joyeux anniversaire, {name} !',
    message:
      'Très joyeux anniversaire, chère Raphaëlle ! J’espère que ce jeu de piste a été à la hauteur de tes attentes. Les réclamations sont à adresser au service client, qui sera fermé jusqu’à ton prochain anniversaire.',
    signature: '— Léa',
    photo: 'assets/photos/birthday.jpg', // facultatif : '' pour ne rien afficher
    photoCaption: 'Archive rarissime : la seule photo où je suis plus grande que toi. Elle sera encadrée.',
    video: '', // facultatif, ex. 'assets/photos/video.mp4' (remplace la photo)
    reopenCard: 'Revoir l’invitation',
  },
};
