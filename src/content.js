// Les informations du dossier se personnalisent ici, sans modifier la mise en page.
export const candidature = {
  serveur: "Alynia RP",
  patron: {
    nomRP: "Aménadiel Belladonna",
    ageRP: null,
    parcoursRP:
      "Aménadiel Belladonna présente sa candidature à la direction du SAMD avec une ambition : construire un service médical présent, exigeant et profondément humain. Avec un passé de médecin réputé en Sicile, son projet place l’accompagnement des équipes et la qualité des soins au centre de la vie de l’hôpital.",
    motivationRP:
      "Je souhaite faire du SAMD un lieu où chaque intervention a du sens, où chaque soignant trouve sa place et où chaque patient devient le point de départ d’une histoire.",
    pseudoHRP: "Alex | LeStitcheurFou",
    ageHRP: null,
    experienceHRP:
      "Une solide expérience du RP EMS sur Alynia RP, avec un précédent passage à la direction de l’hôpital. Je connais les attentes du métier, les contraintes d’une équipe et l’importance de faire vivre le RP médical au quotidien.",
    disponibilitesHRP: "Tous les jours, tous les soirs",
    motivationHRP:
      "Porter un projet collectif durable, proposer des scènes médicales de qualité et donner aux joueurs l’envie de s’investir dans le service public.",
  },
  hopital: {
    nom: "Pillbox Hill Medical Center",
    quartier: "Pillbox Hill · Los Santos",
    adresse: "Elgin Avenue / Strawberry Avenue",
    provisoire: false,
    lien: "https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center",
    screenshot: "/assets/hospital.png",
    screenshotSource: "https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center",
    carte3DSource: "https://github.com/Andreas1331/ragemp-gtav-heightmap",
    evolution: "Océanic",
  },
};

export const hierarchie = [
  {
    grade: "Directeur",
    nom: "Aménadiel Belladonna",
    niveau: "01",
    mission:
      "Diriger le SAMD, porter sa vision et garantir le bon fonctionnement général de l’hôpital.",
    responsabilites: [
      "Définir les orientations et les priorités du SAMD.",
      "Superviser l’ensemble des pôles médicaux et administratifs.",
      "Garantir un cadre de travail équitable et une gestion transparente.",
      "Représenter le SAMD auprès des institutions et du staff du serveur.",
    ],
  },
  {
    grade: "Conseil administratif",
    nom: "Camila Marazel & Eric Lod",
    niveau: "02",
    mission:
      "Assister la direction et assurer la coordination entre les différents pôles du SAMD.",
    responsabilites: [
      "Accompagner le directeur dans les décisions majeures.",
      "Superviser et accompagner les DRH et RH.",
      "Relayer les décisions de la direction auprès des équipes.",
      "Assurer la continuité de la direction en cas d’absence.",
    ],
  },
  {
    grade: "DRH & RH",
    nom: "Trixie Balladonna",
    niveau: "03",
    mission:
      "Gérer les ressources humaines, accompagner les équipes et assurer le suivi du personnel du SAMD.",
    responsabilites: [
      "Gérer les recrutements, intégrations et évolutions internes.",
      "Assurer le suivi administratif et professionnel du personnel.",
      "Coordonner les prises de service et les besoins en effectifs.",
      "Identifier les besoins des équipes et proposer des améliorations.",
    ],
  },
  {
    grade: "Professeur",
    nom: "Diego Diaz",
    niveau: "04",
    mission:
      "Assurer la formation, l’accompagnement et l’évolution des membres du personnel médical.",
    responsabilites: [
      "Organiser et dispenser les formations médicales.",
      "Accompagner les soignants dans leur progression.",
      "Évaluer les connaissances et les compétences du personnel.",
      "Participer à l’élaboration et à l’amélioration des protocoles médicaux.",
    ],
  },
  {
    grade: "Spécialiste",
    nom: "Généraliste : Océane Leal / Psychiatre : / Gynécologue : Enea Diaz",
    niveau: "05",
    mission:
      "Apporter une expertise médicale avancée dans une spécialité et assurer le suivi des patients nécessitant une prise en charge spécifique.",
    responsabilites: [
      "Assurer les consultations relevant de sa spécialité.",
      "Établir des diagnostics et proposer des prises en charge adaptées.",
      "Conseiller et accompagner les autres membres du personnel médical.",
      "Participer au développement de sa spécialité au sein du SAMD.",
    ],
  },
  {
    grade: "Médecin",
    nom: "Praticien autonome chargé du diagnostic, des soins et du suivi médical des patients.",
    niveau: "06",
    mission:
      "Assurer la prise en charge médicale complète des patients, de l’examen au suivi des soins.",
    responsabilites: [
      "Examiner les patients et établir un diagnostic.",
      "Prescrire et réaliser les soins adaptés à leur état.",
      "Assurer les consultations et le suivi médical.",
      "Coordonner la prise en charge avec les autres professionnels de santé.",
    ],
  },
  {
    grade: "Chirurgien",
    nom: "Médecin spécialisé dans la réalisation et le suivi des interventions chirurgicales.",
    niveau: "07",
    mission:
      "Prendre en charge les patients nécessitant une intervention chirurgicale et assurer leur suivi opératoire.",
    responsabilites: [
      "Évaluer la nécessité et les conditions d’une intervention.",
      "Réaliser les opérations chirurgicales selon les protocoles du SAMD.",
      "Assurer le suivi préopératoire et postopératoire.",
      "Collaborer avec les médecins et infirmiers lors des interventions.",
    ],
  },
  {
    grade: "Interne",
    nom: "Médecin en formation exerçant sous la supervision du personnel médical confirmé.",
    niveau: "08",
    mission:
      "Développer ses compétences médicales progressivement tout en participant activement à la prise en charge des patients.",
    responsabilites: [
      "Participer aux consultations et interventions sous supervision.",
      "Réaliser les premiers examens et soins autorisés.",
      "Suivre les formations et validations nécessaires à son évolution.",
      "Assister les médecins, chirurgiens et spécialistes dans leurs missions.",
    ],
  },
  {
    grade: "Infirmier",
    nom: "Soignant chargé des soins infirmiers, de la surveillance et de l’accompagnement des patients.",
    niveau: "09",
    mission:
      "Assurer les soins courants, la surveillance des patients et assister l’équipe médicale dans leur prise en charge.",
    responsabilites: [
      "Réaliser les soins infirmiers et surveiller l’état des patients.",
      "Préparer le matériel nécessaire aux consultations et interventions.",
      "Assister les médecins et chirurgiens lors des prises en charge.",
      "Assurer les transmissions médicales et le suivi des patients hospitalisés.",
    ],
  },
  {
    grade: "Ambulancier",
    nom: "Premier intervenant chargé du secours, de la stabilisation et du transport des patients.",
    niveau: "10",
    mission:
      "Intervenir rapidement sur le terrain, apporter les premiers secours et assurer le transport sécurisé des patients.",
    responsabilites: [
      "Répondre aux appels d’urgence et se rendre sur les lieux d’intervention.",
      "Évaluer rapidement l’état des victimes et effectuer les premiers secours.",
      "Stabiliser et préparer les patients avant leur transport.",
      "Assurer le transport vers l’hôpital et transmettre les informations à l’équipe médicale.",
    ],
  },
];

export const engagements = [
  {
    titre: "Un recrutement qui accompagne",
    resume: "Recruter des personnalités, faire naître des vocations.",
    detail:
      "Un entretien centré sur la motivation et l'investissement, puis un parcours d’intégration en binôme. Chaque recrue aura un référent, des étapes compréhensibles et un retour avant sa validation.",
    resultat: "Des nouveaux membres guidés dès leur première prise de service.",
  },
  {
    titre: "Une formation continue",
    resume: "Apprendre ensemble, tout au long du parcours.",
    detail:
      "Des ateliers courts sur la radio, la coordination, l’accueil et la construction d’une scène médicale. Des mises en situation et des débriefings permettront de progresser sans transformer le jeu en examen permanent.",
    resultat: "Des équipes plus autonomes et des scènes plus cohérentes.",
  },
  {
    titre: "Des prises en charge qui racontent une histoire",
    resume: "Redonner de la place au patient et au suivi.",
    detail:
      "Proposer un accueil, des échanges et un suivi RP adaptés à chaque situation. Les consultations et rendez-vous permettront de prolonger les histoires, sans imposer aux joueurs des scènes trop longues ou des conséquences non consenties.",
    resultat: "Un RP médical vivant, au-delà de la simple réanimation.",
  },
  {
    titre: "Une organisation lisible",
    resume: "Savoir qui fait quoi, et comment évoluer.",
    detail:
      "Formaliser les rôles, les règles internes et les critères de progression. Mettre en place un planning souple, des transmissions utiles et un point d’équipe régulier pour ajuster l’organisation à la réalité des présences.",
    resultat: "Moins de flou, plus de confiance et de continuité.",
  },
  {
    titre: "Un hôpital ouvert sur la ville",
    resume: "Créer des rendez-vous et des liens durables.",
    detail:
      "Construire des scènes communes avec les institutions, les entreprises et les associations du serveur : prévention, journées découvertes, exercices coordonnés et événements.",
    resultat: "Un SAMD qui participe à la vie de Los Santos.",
  },
];

export const horizons = [
  {
    id: "court",
    label: "Court terme",
    periode: "Le premier mois",
    titre: "Poser des bases solides.",
    texte:
      "Écouter l’équipe, remettre de la clarté dans le fonctionnement et assurer une présence régulière à Pillbox Hill.",
    objectifs: [
      "Rencontrer les membres et identifier les besoins.",
      "Clarifier la hiérarchie, les rôles et les règles internes.",
      "Ouvrir le recrutement et lancer l’intégration en binôme.",
      "Mettre en place les premières formations et transmissions.",
      "Mettre en place les nouveaux protocoles.",
    ],
    repere:
      "Une équipe qui connaît son rôle et un accueil régulier à l’hôpital.",
  },
  {
    id: "moyen",
    label: "Moyen terme",
    periode: "De 1 à 3 mois",
    titre: "Faire vivre le collectif.",
    texte:
      "Stabiliser les effectifs, enrichir les scènes et installer des habitudes qui donnent envie de rester au SAMD.",
    objectifs: [
      "Former des référents et faire évoluer les membres investis.",
      "Développer des consultations et un suivi des patients.",
      "Organiser des événements avec les acteurs de la ville.",
      "Ajuster le service grâce aux retours de l’équipe et des citoyens.",
    ],
    repere:
      "Des soignants autonomes, des rendez-vous réguliers et des partenariats actifs.",
  },
  {
    id: "long",
    label: "Long terme",
    periode: "À partir de 3 mois",
    titre: "Préparer le prochain chapitre.",
    texte:
      "Consolider ce qui fonctionne et étudier l’évolution vers Océanic, près de la plage, avec les responsables du serveur.",
    objectifs: [
      "Évaluer la stabilité de l’équipe et les besoins réels.",
      "Construire un projet viable pour l’hôpital Océanic.",
      "Préparer la transition logistique et la continuité du service.",
      "Ouvrir de nouvelles spécialités si les effectifs le permettent.",
    ],
    repere:
      "Une évolution préparée collectivement et validée avant toute transition.",
  },
];
