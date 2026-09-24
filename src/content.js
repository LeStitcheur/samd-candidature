// Les informations du dossier se personnalisent ici, sans modifier la mise en page.
export const candidature = {
  serveur: 'Alynia RP',
  patron: {
    nomRP: 'Aménadiel Belladonna',
    ageRP: null,
    parcoursRP: 'Aménadiel Belladonna présente sa candidature à la direction du SAMD avec une ambition : construire un service médical présent, exigeant et profondément humain. Son projet place l’accompagnement des équipes et la qualité des scènes au centre de la vie de l’hôpital.',
    motivationRP: 'Je souhaite faire du SAMD un lieu où chaque intervention a du sens, où chaque soignant trouve sa place et où chaque patient devient le point de départ d’une histoire.',
    pseudoHRP: 'Alex',
    ageHRP: null,
    experienceHRP: 'Une solide expérience du RP EMS sur Alynia RP, avec un précédent passage à la direction de l’hôpital. Je connais les attentes du métier, les contraintes d’une équipe et l’importance de faire vivre le médical au quotidien.',
    disponibilitesHRP: 'Tous les jours, tous les soirs',
    motivationHRP: 'Porter un projet collectif durable, proposer des scènes médicales de qualité et donner aux joueurs l’envie de s’investir dans le service public.',
  },
  hopital: {
    nom: 'Pillbox Hill Medical Center',
    quartier: 'Pillbox Hill · Los Santos',
    adresse: 'Elgin Avenue / Strawberry Avenue',
    provisoire: false,
    lien: 'https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center',
    screenshot: '/assets/hospital.png',
    screenshotSource: 'https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center',
    carte3DSource: 'https://github.com/Andreas1331/ragemp-gtav-heightmap',
    evolution: 'Océanic',
  },
};

export const hierarchie = [
  { grade: 'Direction générale', nom: 'Aménadiel Belladonna', niveau: '01', mission: 'Porter la vision, représenter le SAMD et veiller au bon fonctionnement de l’hôpital.', responsabilites: ['Fixer les priorités et suivre leur mise en œuvre.', 'Garantir un cadre de travail équitable et une gestion transparente.', 'Assurer le dialogue avec les institutions et le staff du serveur.'] },
  { grade: 'Direction adjointe', nom: 'Continuité & coordination', niveau: '02', mission: 'Faire le lien entre la direction et le terrain pour que le service reste organisé au quotidien.', responsabilites: ['Coordonner les prises de service et les besoins en effectifs.', 'Accompagner les responsables de pôle.', 'Relayer les décisions et assurer la continuité de la direction.'] },
  { grade: 'Chefs de service', nom: 'Encadrement des équipes', niveau: '03', mission: 'Animer les équipes médicales et faire progresser la qualité des prises en charge RP.', responsabilites: ['Encadrer les interventions et les retours d’expérience.', 'Organiser les formations avec les référents.', 'Évaluer les besoins et proposer des améliorations.'] },
  { grade: 'Médecins', nom: 'Expertise & suivi', niveau: '04', mission: 'Conduire des scènes médicales construites et assurer le suivi des patients.', responsabilites: ['Donner du sens au diagnostic et au parcours RP du patient.', 'Accompagner les soignants moins expérimentés.', 'Développer des consultations selon les besoins du serveur.'] },
  { grade: 'Infirmiers & ambulanciers', nom: 'Le cœur du terrain', niveau: '05', mission: 'Accueillir, intervenir et accompagner les citoyens, de l’appel à la prise en charge à l’hôpital.', responsabilites: ['Assurer les interventions selon les protocoles RP du service.', 'Coordonner les transmissions et le transport.', 'Participer à la vie quotidienne de l’hôpital.'] },
  { grade: 'Internes & stagiaires', nom: 'Apprentissage accompagné', niveau: '06', mission: 'Découvrir le métier dans un cadre progressif, avec un référent et des objectifs clairs.', responsabilites: ['Observer puis participer aux scènes en binôme.', 'Suivre le parcours d’intégration et les formations.', 'Accéder à davantage d’autonomie après validation des acquis.'] },
];

export const engagements = [
  { titre: 'Un recrutement qui accompagne', resume: 'Recruter des personnalités, faire naître des vocations.', detail: 'Un entretien centré sur la motivation et la qualité RP, puis un parcours d’intégration en binôme. Chaque recrue aura un référent, des étapes compréhensibles et un retour avant sa validation.', resultat: 'Des nouveaux membres guidés dès leur première prise de service.' },
  { titre: 'Une formation continue', resume: 'Apprendre ensemble, tout au long du parcours.', detail: 'Des ateliers courts sur la radio, la coordination, l’accueil et la construction d’une scène médicale. Des mises en situation et des débriefings permettront de progresser sans transformer le jeu en examen permanent.', resultat: 'Des équipes plus autonomes et des scènes plus cohérentes.' },
  { titre: 'Des prises en charge qui racontent une histoire', resume: 'Redonner de la place au patient et au suivi.', detail: 'Proposer un accueil, des échanges et un suivi RP adaptés à chaque situation. Les consultations et rendez-vous permettront de prolonger les histoires, sans imposer aux joueurs des scènes trop longues ou des conséquences non consenties.', resultat: 'Un RP médical vivant, au-delà de la simple réanimation.' },
  { titre: 'Une organisation lisible', resume: 'Savoir qui fait quoi, et comment évoluer.', detail: 'Formaliser les rôles, les règles internes et les critères de progression. Mettre en place un planning souple, des transmissions utiles et un point d’équipe régulier pour ajuster l’organisation à la réalité des présences.', resultat: 'Moins de flou, plus de confiance et de continuité.' },
  { titre: 'Un hôpital ouvert sur la ville', resume: 'Créer des rendez-vous et des liens durables.', detail: 'Construire des scènes communes avec les institutions, les entreprises et les associations du serveur : prévention, journées découvertes, exercices coordonnés et événements. Chaque partenariat restera compatible avec les règles d’Alynia RP.', resultat: 'Un SAMD qui participe à la vie de Los Santos.' },
];

export const horizons = [
  { id: 'court', label: 'Court terme', periode: 'Le premier mois', titre: 'Poser des bases solides.', texte: 'Écouter l’équipe, remettre de la clarté dans le fonctionnement et assurer une présence régulière à Pillbox Hill.', objectifs: ['Rencontrer les membres et identifier les besoins.', 'Clarifier la hiérarchie, les rôles et les règles internes.', 'Ouvrir le recrutement et lancer l’intégration en binôme.', 'Mettre en place les premières formations et transmissions.'], repere: 'Une équipe qui connaît son rôle et un accueil régulier à l’hôpital.' },
  { id: 'moyen', label: 'Moyen terme', periode: 'De 1 à 3 mois', titre: 'Faire vivre le collectif.', texte: 'Stabiliser les effectifs, enrichir les scènes et installer des habitudes qui donnent envie de rester au SAMD.', objectifs: ['Former des référents et faire évoluer les membres investis.', 'Développer des consultations et un suivi RP des patients.', 'Organiser des événements avec les acteurs du serveur.', 'Ajuster le service grâce aux retours de l’équipe et des citoyens.'], repere: 'Des soignants autonomes, des rendez-vous réguliers et des partenariats actifs.' },
  { id: 'long', label: 'Long terme', periode: 'À partir de 3 mois', titre: 'Préparer le prochain chapitre.', texte: 'Consolider ce qui fonctionne et étudier l’évolution vers Océanic, près de la plage, avec les responsables du serveur.', objectifs: ['Évaluer la stabilité de l’équipe et les besoins réels.', 'Construire un projet viable pour l’hôpital Océanic.', 'Préparer la transition logistique et la continuité du service.', 'Ouvrir de nouvelles spécialités si les effectifs le permettent.'], repere: 'Une évolution préparée collectivement et validée avant toute transition.' },
];
