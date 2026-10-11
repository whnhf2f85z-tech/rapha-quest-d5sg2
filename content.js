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
    'Il y a une fontaine à moins de 50 pas de la porte. (À REMPLACER)',
    'Depuis la boutique, on voit presque l’Hôtel de ville. (À REMPLACER)',
    'Le nom de la boutique commence par un B. (À REMPLACER)',
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
    // 8 photos carrées (~400 px). À REMPLACER.
    images: [
      'assets/photos/memory-1.jpg',
      'assets/photos/memory-2.svg',
      'assets/photos/memory-3.svg',
      'assets/photos/memory-4.svg',
      'assets/photos/memory-5.svg',
      'assets/photos/memory-6.svg',
      'assets/photos/memory-7.svg',
      'assets/photos/memory-8.svg',
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
  //  Le site ne vérifie pas la grille. Prends une grille à solution unique et
  //  note toi-même le bon chiffre de la case étoilée : c'est celui que ton
  //  énigme utilise (avec cette grille, c'est 5).
  // --------------------------------------------------------------------------
  sudoku: {
    puzzle: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    highlight: { row: 5, col: 5 },
    text: {
      title: 'Sudoku',
      instruction: 'Un classique. Personne ne te dira si c’est juste. Et garde un œil sur la case étoilée.',
      pencil: 'Notes',
      erase: 'Effacer',
      cellLabel: 'Ligne {r}, colonne {c}',
      starLabel: 'case étoilée',
      finish: 'J’ai fini',
      filled: 'Grille remplie. Retiens bien le chiffre de la case étoilée : tu en auras besoin.',
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
    image: 'assets/photos/place.svg', // À REMPLACER par ta photo
    imageAlt: 'Photo d’un endroit où nous étions ensemble',
    lat: 47.3701, // À REMPLACER : l'endroit exact de la photo
    lng: 8.544,
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
    formspreeEndpoint: '',
    leaEmail: 'lea@example.com', // À REMPLACER par ton adresse
    emailSubject: 'Raphaëlle a choisi sa demi-journée',
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
    disabled: ['2026-10-24-matin'],
    text: {
      title: 'Ta demi-journée',
      instruction:
        'Choisis une matinée ou un après-midi entre le 21 et le 27 octobre. Rassure-toi : ça ne prend qu’une demi-heure.',
      morning: 'Matin',
      afternoon: 'Après-midi',
      morningLong: 'le matin',
      afternoonLong: 'l’après-midi',
      taken: 'Déjà pris. Désolée.',
      confirm: '{Day}, {part}. C’est noté dans le marbre ?',
      send: 'Oui, envoyer',
      change: 'Changer',
      sending: 'Envoi…',
      sent: 'Envoyé. Léa est prévenue.',
      failed: 'L’envoi n’a pas marché. Envoie-le-moi par e-mail, ça revient au même :',
      mailButton: 'Envoyer par e-mail',
      mailBody: 'Coucou Léa, je choisis le {day}, {part}. Raphaëlle',
      continueAnyway: 'C’est fait, on continue',
      locked: 'Ton choix : {day}, {part}. Pour changer, écris-moi directement.',
    },
  },

  // --------------------------------------------------------------------------
  //  10. Le grand final
  //  accepted : fabriqué avec tools/hash.html (le hash du nom + la carte chiffrée).
  //  Réponses d'exemple : voir README. N'écris JAMAIS le vrai nom ni l'adresse
  //  dans ce fichier, même en commentaire : tout le monde peut le lire.
  // --------------------------------------------------------------------------
  final: {
    shop: { lat: 47.373, lng: 8.541 }, // À REMPLACER : la porte de la boutique
    radiusMeters: 200,
    map: { lat: 46.6, lng: 2.4, zoom: 6 }, // vue de départ : la France entière, pour ne rien dévoiler
    accepted: [
      {
        hash: '3f2ff815a286d3e436213d1e1f6ad72258d17388427b83184c862d3ba51d2613',
        card: 'sojDx2PhcFJm9XeT5XCFOQ==.+tRtetlPL7QAg6+7.QXqWG41yn/KA1S1jD7rU85IBf0aA9vzbKNjUw/i1GxhFXAADxWZskieftn4ansont1qyOuR0A8KlX2w+FOtmVInyM2u2q4AQmGXSQ8dAcKDcECOF5fSF3DHHQV5rCIsLeJYRowUEIXhT1NJrn3ajleaEGYcBiZz2dU8be5PUSr3qjUUZJA+vuY4VBKGkI49Eejba7OkK+a7+hTzsvfWUt7ePH+tzoH0YR/XiGCwMz8os48014fxj1YMaJbRvWKUg9kEOl9iPL/DFxk5Ig7mB6wq8qNWvm19oiZOxTPgEP7nHAL49XzVyjs5pLY/qSgI00Gw5nocaHO0FoFKuDPuhMLpWZ2EWexFVPE5nPqgIV4qk3+62fSTSR/oMNGHl3K/MKJ9GlUxveEnPj9I92KUsgjl/nJ7ignAJ4ogKpJqu4lLQxnRsKsvcZVzLvVOkhXPAY95hW3jrRBt9fc/C+8lwzO+xd+zNII2xRBVEbQrijSB1EKHH6zaQAfUuubrJEEHWNDz0Sbum',
      },
      {
        hash: 'b77ad2edf199a4b4479347afaf387d435a12480d0dc5b8e042c4c8991587d080',
        card: 'ocE8kQMyI9KME7OUI652GQ==.gna2jjyXTj7FnFuj.c1nB+u2okvAs2fdt388t3nqajO9fde92+ZIh5m+Qc57+QX7JkzUM6lh+qLouPyigzycTHtc1sRCsn22L18lWhGngWcdyCC78e6Y4tzQLhl5YBQwb1A1pDR5mHwoNPYxx5uKQZ1EZLEbjZbOYGEmSTNnBPuOTHbi47mx7sieqLflOqiQCr3UspxVo6N82j4fbqFqWkthNBub+uhFOzX/8K7q9PIn5vA59Byx9O1EankjR9tTN7PoiryBlVyh8SNtBP1ileQf8QybxavI4rui0kF+ohbfgqRr5dyZTDbuOQ4GP9W6xiz/Yw6wTPRu5KamzhVIG5xnZ7p6KqE6KlBsx9QWIYkCV425DQl1q8M5vvfZj7F1JMolCA0pUgcGt1Zy7hUgM9h4IHtVzsnIEcl/A6HLyqcohshH/ymi5e5W1dAGMPyygaFvh/ph3OEyRTlAl2IwWH6/YUzZ1ktUBh1HCjrLYBlmRdS1lFDpWa5zVlaum1uPsWwkay+BRWBj/gb9WnmfKhyux',
      },
    ],
    nudges: [
      'Relis l’indice sur le logo. (À REMPLACER)',
      'Le nom tient en un seul mot… ou presque. (À REMPLACER)',
      'B comme… (À REMPLACER)',
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
      rendezvous: 'Rendez-vous {day}, {part}.',
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
      'Ici, ton petit mot personnel. Quelques lignes, pas plus : l’essentiel est déjà dans la boutique. (À REMPLACER)',
    signature: '— Léa',
    photo: 'assets/photos/birthday.svg', // facultatif : '' pour ne rien afficher
    video: '', // facultatif, ex. 'assets/photos/video.mp4' (remplace la photo)
    reopenCard: 'Revoir l’invitation',
  },
};
