import pptxgen from 'pptxgenjs';
import path from 'path';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
pptx.author = 'Zied Dhieb';
pptx.company = "ENET'Com Sfax - IEEE Student Branch";
pptx.title = 'EduMinds Glasses Lite — Application Étudiant';

// Color Palette
const C = {
  bg: '08183C',
  card: '0E2452',
  cardBorder: '1E3E7A',
  accent: 'F36F21',
  blue: '8CBCD8',
  white: 'FFFFFF',
  muted: 'C8D6EC',
  softBg: '143168',
};

const FONT = 'Segoe UI';

function addHeader(slide, title, category, slideNum) {
  // Category / Tag
  slide.addText(`AOTN CHALLENGE · TSYP 14  |  ${category.toUpperCase()}`, {
    x: 0.6, y: 0.35, w: 7.5, h: 0.3,
    fontSize: 9.5, fontFace: FONT, bold: true, color: C.accent,
  });

  // Slide Title
  slide.addText(title, {
    x: 0.6, y: 0.65, w: 8.8, h: 0.5,
    fontSize: 19, fontFace: FONT, bold: true, color: C.white,
  });

  // Slide Counter
  slide.addText(`${slideNum} / 12`, {
    x: 8.5, y: 0.35, w: 0.9, h: 0.3,
    fontSize: 10, fontFace: FONT, align: 'right', color: C.blue,
  });

  // Thin separator
  slide.addShape(pptx.ShapeType.line, {
    x: 0.6, y: 1.2, w: 8.8, h: 0,
    line: { color: C.cardBorder, width: 1 },
  });
}

function addCard(slide, { x, y, w, h, title, items = [], customText = null, titleColor = C.accent }) {
  // Card background
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.12,
    fill: { color: C.card },
    line: { color: C.cardBorder, width: 1 },
  });

  let curY = y + 0.15;
  if (title) {
    slide.addText(title, {
      x: x + 0.2, y: curY, w: w - 0.4, h: 0.35,
      fontSize: 12.5, fontFace: FONT, bold: true, color: titleColor,
    });
    curY += 0.35;
  }

  if (items && items.length > 0) {
    const textRuns = items.map(it => {
      if (typeof it === 'string') {
        return { text: it, options: { bullet: { code: '25B8' }, fontSize: 10.5, color: C.muted, breakLine: true } };
      }
      return [
        { text: it.bold + ' ', options: { bold: true, color: C.white, bullet: { code: '25B8' }, fontSize: 10.5 } },
        { text: it.text, options: { bold: false, color: C.muted, fontSize: 10.5, breakLine: true } }
      ];
    }).flat();

    slide.addText(textRuns, {
      x: x + 0.2, y: curY, w: w - 0.4, h: h - (curY - y) - 0.15,
      fontFace: FONT,
      lineSpacingMultiple: 1.2,
      valign: 'top',
    });
  } else if (customText) {
    slide.addText(customText, {
      x: x + 0.2, y: curY, w: w - 0.4, h: h - (curY - y) - 0.15,
      fontFace: FONT, fontSize: 10.5, color: C.muted, valign: 'top',
    });
  }
}

// =========================================================================
// SLIDE 1 : TITRE & INTRODUCTION
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  // Logos on white card
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y: 0.6, w: 4.8, h: 0.9,
    rectRadius: 0.1, fill: { color: 'FFFFFF' },
  });
  s.addImage({ path: 'public/logos/enetcom.png', x: 1.0, y: 0.72, w: 2.0, h: 0.66 });
  s.addImage({ path: 'public/logos/ieee-enetcom.png', x: 3.2, y: 0.72, w: 2.2, h: 0.66 });

  // Main Titles
  s.addText('EduMinds Glasses Lite', {
    x: 0.8, y: 1.8, w: 8.4, h: 0.7,
    fontSize: 34, fontFace: FONT, bold: true, color: C.accent,
  });
  s.addText("L'Expérience VR Côté Étudiant · Laboratoires d'Électronique Durables", {
    x: 0.8, y: 2.5, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: FONT, color: C.blue,
  });

  // Info Card
  addCard(s, {
    x: 0.8, y: 3.1, w: 8.4, h: 2.0,
    title: 'Informations du Projet & Présentateur',
    items: [
      { bold: 'Challenge :', text: 'AOTN Challenge — TSYP 14 (Thème : Éducation Durable)' },
      { bold: 'Présentateur :', text: "Zied Dhieb — 1ère année Génie des Données & Systèmes Décisionnels (ENET'Com Sfax)" },
      { bold: 'Périmètre :', text: 'Application Étudiant (Frontend Réalité Virtuelle, Ergonomie Regard & File de Données)' },
      { bold: 'Objectif :', text: 'Permettre aux universités de remplacer les pannes matérielles réelles par des TP virtuels à coût zéro.' }
    ],
  });

  s.addNotes("Bonjour à tous les membres du jury. Dans le cadre du challenge AOTN sous le thème de l'éducation durable, notre équipe a développé EduMinds Glasses Lite. Aujourd'hui, je vous présente l'application étudiante : une interface immersive, accessible et robuste conçue pour démocratiser les travaux pratiques d'électronique sans risque matériel.");
}

// =========================================================================
// SLIDE 2 : PROBLÉMATIQUE
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'La Problématique : Coût du Matériel & Déchets Électroniques', 'Problématique', 2);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'Contraintes dans les Universités',
    items: [
      { bold: 'Équipements onéreux :', text: 'Oscilloscopes, alimentations de labo et capteurs représentent des budgets lourds.' },
      { bold: 'Taux de casse élevé :', text: 'Les débutants grillent inévitablement des LED, capteurs et fusibles lors des premiers TP.' },
      { bold: 'Pratique restreinte :', text: 'Les limites budgétaires forcent à réduire le temps de manipulation pratique par étudiant.' },
      { bold: 'Peur de manipuler :', text: "L'appréhension de casser le matériel freine la curiosité et l'expérimentation." }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'Impact Écologique & Économique',
    titleColor: C.blue,
    items: [
      { bold: 'Déchets électroniques :', text: 'Composants détruits irrécupérables finissant en décharge (e-waste).' },
      { bold: 'Budgets de maintenance :', text: 'Fonds engloutis dans le remplacement plutôt que dans de nouvelles technologies.' },
      { bold: 'Opportunité EduMinds :', text: "Autoriser l'erreur pédagogique sans aucune conséquence financière ni déchet matériel." }
    ],
  });

  s.addNotes("Chaque année, les écoles d'ingénieurs font face à un coût important de renouvellement de matériel : les étudiants débutants grillent inévitablement des composants en commettant des erreurs de câblage. Cela engendre des dépenses continues et des déchets électroniques. EduMinds transforme ces erreurs réelles en apprentissages virtuels à coût zéro.");
}

// =========================================================================
// SLIDE 3 : NOTRE SOLUTION & PÉRIMÈTRE
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Notre Solution & Mon Périmètre de Développement', 'Solution & Périmètre', 3);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'Le Concept Global (Casque Low-Cost)',
    items: [
      { bold: 'Matériel accessible :', text: 'Smartphone classique dans une coque plastique VR économique (sans casque à 1000$).' },
      { bold: 'Vidéo Passthrough :', text: 'Caméra arrière projetée en plein écran pour garder la vision réelle de la table.' },
      { bold: 'Kit physique :', text: 'Jetons équipés de marqueurs ArUco + solveur de circuit nodal (MNA).' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: "Mon Périmètre (L'App Étudiant)",
    titleColor: C.blue,
    items: [
      { bold: 'Arrière-plan vidéo réel :', text: 'Caméra arrière plein écran active en permanence.' },
      { bold: 'Authentification anonyme :', text: 'Connexion instantanée sans mot de passe à retenir.' },
      { bold: 'Rendu Stéréo 3D :', text: 'Projection double œil fluide à 60 FPS (Three.js).' },
      { bold: 'Ergonomie au regard (Gaze UX) :', text: '100% sans contact physique une fois le téléphone inséré.' },
      { bold: 'Journalisation résiliente :', text: 'File d’attente locale synchronisée avec Supabase.' }
    ],
  });

  s.addNotes("Au lieu d'imposer des casques VR à plus de 1000 dollars, notre solution s'appuie sur le smartphone que chaque étudiant possède déjà. Mon rôle a été de concevoir l'intégralité de l'application étudiant : flux vidéo réel, interface 3D sans contact, sélection des TP et collecte des données d'apprentissage.");
}

// =========================================================================
// SLIDE 4 : LE PARCOURS ÉTUDIANT (USER FLOW)
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Le Parcours Utilisateur : De la Table au Casque VR', 'Parcours Utilisateur', 4);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 2.1,
    title: 'Étape 1 : Connexion au Bureau',
    items: [
      { bold: 'Téléphone en main :', text: 'Saisie rapide du pseudo & classe avec le clavier habituel.' },
      { bold: 'Zéro barrière :', text: 'Carte en verre liquide, autorisation caméra/gyro en un clic.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 2.1,
    title: 'Étape 2 : Transition vers le Casque',
    titleColor: C.blue,
    items: [
      { bold: 'Compte à rebours 8 s :', text: 'Laisse le temps d’insérer le téléphone dans le casque.' },
      { bold: 'Bouton « Je suis prêt » :', text: 'Plein écran et verrouillage paysage automatiques.' }
    ],
  });

  addCard(s, {
    x: 0.6, y: 3.7, w: 8.8, h: 1.45,
    title: 'Étape 3 & 4 : Immersion Stéréo & Les 3 Travaux Pratiques',
    titleColor: C.accent,
    items: [
      { bold: 'TP 1 · LED + Résistance :', text: 'Loi d’Ohm élémentaire — la LED brûle sans résistance de limitation.' },
      { bold: 'TP 2 · Diviseur de tension :', text: 'Potentiomètre et capteur 3,3 V — protection contre les surtensions.' },
      { bold: 'TP 3 · Court-circuit :', text: 'Détection du courant excessif et déclenchement du fusible de protection.' }
    ],
  });

  s.addNotes("L'ergonomie a été conçue pour la réalité du terrain : l'élève tape son pseudo normalement sur son téléphone. Dès la validation, un compte à rebours de 8 secondes lui laisse le temps de glisser le téléphone dans le casque. Ensuite, la vue bascule en stéréo 3D avec les travaux pratiques flottant directement devant lui.");
}

// =========================================================================
// SLIDE 5 : NAVIGATION AU REGARD (DWELL GAZE)
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Navigation Mains-Libres : Le Regard (Dwell Gaze)', 'Ergonomie Regard', 5);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'La Contrainte du Casque Fermé',
    items: [
      { bold: 'Écran tactile inaccessible :', text: 'Le téléphone est enfermé dans la coque en plastique.' },
      { bold: 'Pas de manette externe :', text: 'Évite l’achat, la recharge et l’appairage Bluetooth d’accessoires.' },
      { bold: 'Objectif ergonomique :', text: 'Permettre une sélection fluide et sans fatigue oculaire.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'Mécanisme de Dwell Gaze Conçu',
    titleColor: C.blue,
    items: [
      { bold: 'Réticule central :', text: 'Anneau 3D indiquant en temps réel le point de regard de l’élève.' },
      { bold: 'Dwell Time de 1,5 s :', text: 'Fixer une tuile remplit une jauge orange et valide sans clic.' },
      { bold: 'Zéro bouton validation :', text: 'Aucune confirmation superflue pour éliminer toute friction.' },
      { bold: 'Protection anti-sortie :', text: 'Le bouton « Changer de TP » exige 2,0 s de regard fixe.' }
    ],
  });

  s.addNotes("Dans le casque, l'écran tactile est inaccessible. Nous avons donc créé une navigation 100% au regard (Dwell Gaze) : fixer un bouton pendant 1,5 seconde le valide automatiquement, matérialisé par une jauge de progression orange. Pour éviter de quitter un TP par inadvertance, le bouton de sortie exige 2 secondes complètes de fixation.");
}

// =========================================================================
// SLIDE 6 : LA BOÎTE À OUTILS (CARROUSEL)
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'La Boîte à Outils des Composants (Carrousel 3D)', 'Boîte à Outils', 6);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'Bandeau Horizontal Paginé',
    items: [
      { bold: 'Agencement à hauteur des yeux :', text: 'Flotte à 2,5 m devant l’élève, lisible et dégagé.' },
      { bold: '3 tuiles visibles à la fois :', text: 'Évite la surcharge visuelle et préserve le champ de vision.' },
      { bold: 'Défilement fluide :', text: 'Par balayage tactile, touches fléchées ou geste de la main.' },
      { bold: '110 composants réels :', text: 'Chargés dynamiquement depuis le fichier components.csv.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'Action Directe de Prise (« Take »)',
    titleColor: C.blue,
    items: [
      { bold: 'Fixer = Prendre :', text: 'Regarder un composant 1,5 s l’ajoute dans la main virtuelle.' },
      { bold: 'Badge multiplicateur :', text: 'Compteur dynamique (×1, ×2) indiquant les quantités prises.' },
      { bold: 'Événement automatique :', text: 'Déclenche takeComponent() pour le moteur de simulation.' },
      { bold: 'Photos ou placeholders :', text: 'Affiche la photo réelle ou le badge avec référence (CMP001).' }
    ],
  });

  s.addNotes("La boîte à outils affiche 3 composants à la fois pour garder une vision claire. Regarder un composant permet de l'ajouter dans la main virtuelle de l'élève avec un compteur. Toutes les données proviennent d'un fichier CSV centralisant 110 composants électroniques réels avec leurs références et prix unitaires.");
}

// =========================================================================
// SLIDE 7 : ARCHITECTURE TECHNIQUE FRONTEND
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Architecture Technique Frontend : Légèreté & 60 FPS', 'Architecture Frontend', 7);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'Stack Logique & Performance',
    items: [
      { bold: 'Vite 5 :', text: 'Démarrage immédiat, compilation optimisée (bundle final 715 ko).' },
      { bold: 'Vanilla JavaScript :', text: 'Zéro framework lourd (React/Vue écartés pour préserver le CPU).' },
      { bold: 'Three.js (^0.170) :', text: 'Moteur 3D WebGL léger assurant 60 FPS constants sur smartphone.' },
      { bold: 'Capacitor-Ready :', text: 'Code web pur prêt à être empaqueté en APK Android installable.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'Rendu 3D Stéréo & Capteurs',
    titleColor: C.blue,
    items: [
      { bold: 'StereoEffect Three.js :', text: 'Projection stéréo double œil avec séparation oculaire réaliste.' },
      { bold: 'Textures Canvas 2D :', text: 'Panneaux en verre liquide avec typographie nette (Inter Variable).' },
      { bold: 'DeviceOrientation API :', text: 'Orientation 3DOF de la tête par gyroscope avec repli souris sur PC.' },
      { bold: 'Recentrage instantané :', text: 'Touche Espace sur PC ou tapotement pour réaligner les panneaux.' }
    ],
  });

  s.addNotes("Pour garantir une réactivité maximale sur mobile, nous avons écarté les frameworks lourds au profit de JavaScript pur et de Three.js. L'effet de verre liquide est dessiné dynamiquement dans des canvas 2D. Cette légèreté assure un rendu fluide et constant à 60 images par seconde.");
}

// =========================================================================
// SLIDE 8 : INGÉNIERIE DES DONNÉES & SUPABASE
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Ingénierie des Données : File Résiliente Supabase', 'Génie des Données', 8);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'La Contrainte du Réseau de Labo',
    items: [
      { bold: 'Wi-Fi instable :', text: 'Les réseaux universitaires subissent des coupures fréquentes.' },
      { bold: 'Risque de perte sèche :', text: 'Un appel fetch() direct sans file perdrait les actions de l’élève.' },
      { bold: 'Exigence décisionnelle :', text: 'Garantir 100% de complétude des données pour le tableau de bord.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'File FIFO Locale (Offline-First)',
    titleColor: C.blue,
    items: [
      { bold: 'Tampon localStorage :', text: 'Chaque événement est sauvegardé localement avant émission.' },
      { bold: 'Anti-doublon par UUID :', text: 'Clés générées côté client : re-tenter un envoi ne crée aucun doublon.' },
      { bold: 'Synchronisation intelligente :', text: 'Re-tentative toutes les 15 s et dès le retour du réseau (online).' },
      { bold: 'Sécurité RLS :', text: 'Politiques Row Level Security protégeant chaque session d’élève.' }
    ],
  });

  s.addNotes("En tant qu'étudiant en génie des données, la robustesse du pipeline de collecte était primordiale. Les coupures de réseau étant fréquentes dans les salles de TP, nous avons mis en place une file d'attente locale persistée. Même si la connexion est interrompue, aucun événement n'est perdu. Dès le retour du réseau, les données sont synchronisées avec Supabase sans aucun doublon grâce aux clés primaires UUID.");
}

// =========================================================================
// SLIDE 9 : MESURE DE L'IMPACT ÉDUCATIF & FINANCIER
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Mesure de l’Impact Éducatif & Financier', 'Impact & Analytics', 9);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 3.7,
    title: 'Vues SQL Automatisées (PostgreSQL)',
    items: [
      { bold: 'failures_prevented :', text: 'Calcule en Dinars Tunisiens (TND) les composants sauvés par la VR.' },
      { bold: 'common_mistakes :', text: 'Identifie les concepts mal compris nécessitant un rappel enseignant.' },
      { bold: 'student_progress :', text: 'Mesure la vitesse d’apprentissage et l’autonomie de chaque étudiant.' },
      { bold: 'components_taken :', text: 'Statistiques sur les composants les plus manipulés par TP.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 3.7,
    title: 'Preuve Chiffrée de la Rentabilité',
    titleColor: C.blue,
    items: [
      { bold: 'Formule clé :', text: 'Économies (TND) = Σ (Nombre de Pannes × Prix Unitaire Composant)' },
      { bold: 'LED grillée sans résistance :', text: 'Associe failureCode à CMP018 (LED rouge).' },
      { bold: 'Surtension capteur 3,3 V :', text: 'Associe failureCode à CMP083 (Capteur analogique).' },
      { bold: 'Court-circuit franc :', text: 'Associe failureCode à CMP068 (Fusible de protection).' },
      { bold: 'Valorisation directe :', text: 'L’erreur devient une métrique pédagogique au lieu d’un coût.' }
    ],
  });

  s.addNotes("Grâce à des vues analytiques dans PostgreSQL, nous quantifions l'impact financier exact d'EduMinds : chaque fausse manipulation est associée au composant qui aurait été détruit pour calculer la somme économisée par l'école. L'erreur n'est plus une perte financière, mais une métrique pédagogique précieuse.");
}

// =========================================================================
// SLIDE 10 : INTÉGRATION INTER-ÉQUIPES & MODULARITÉ
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Intégration Inter-Équipes & Modularité (Jalon 14 Nov)', 'Intégration', 10);

  addCard(s, {
    x: 0.6, y: 1.45, w: 8.8, h: 2.1,
    title: 'Les 3 Hooks d’Interfaçage (src/main.js)',
    items: [
      { bold: 'startLab(lab, student) :', text: 'Appelé dès qu’un TP est validé au regard → Déclenche le solveur de circuit nodal (MNA).' },
      { bold: 'takeComponent(lab, comp, count) :', text: 'Appelé dès qu’un composant est pris → Matérialise l’objet dans la simulation 3D.' },
      { bold: 'stopLab(lab) :', text: 'Appelé lors du regard sur « Changer de TP » → Clôture proprement la session et le circuit.' }
    ],
  });

  addCard(s, {
    x: 0.6, y: 3.7, w: 4.25, h: 1.45,
    title: 'Équipe Vision & Marqueurs ArUco',
    titleColor: C.blue,
    items: [
      { bold: 'Flux caméra partagé :', text: 'Le flux cam.srcObject est accessible directement pour le traitement d’image.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 3.7, w: 4.25, h: 1.45,
    title: 'Équipe Gestes (Hand Tracking)',
    titleColor: C.accent,
    items: [
      { bold: 'Contrôle par geste :', text: 'Appel direct de vr.swipe(1) ou vr.swipe(-1) pour feuilleter les composants.' }
    ],
  });

  s.addNotes("Pour travailler efficacement en équipe pluridisciplinaire, notre architecture est strictement découplée. Trois fonctions claires permettent aux équipes Simulation et Vision de brancher leurs moteurs sans modifier l'interface ni la base de données.");
}

// =========================================================================
// SLIDE 11 : SYNTHÈSE DES DÉCISIONS TECHNIQUES
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Synthèse des Décisions Techniques (Pourquoi ce choix ?)', 'Décisions d’Architecture', 11);

  // Table with comparisons
  const tableRows = [
    [
      { text: 'Décision d’Ingénierie', options: { bold: true, color: C.white, fill: { color: C.softBg } } },
      { text: 'Pourquoi ce choix ?', options: { bold: true, color: C.accent, fill: { color: C.softBg } } },
      { text: 'Alternative écartée', options: { bold: true, color: C.blue, fill: { color: C.softBg } } },
    ],
    [
      { text: 'Web + Capacitor', options: { bold: true, color: C.white } },
      { text: 'Codebase unique, test immédiat + APK Android', options: { color: C.muted } },
      { text: 'Java/Kotlin natif (trop lourd à itérer)', options: { color: C.muted } },
    ],
    [
      { text: 'Sélection Regard (1,5 s)', options: { bold: true, color: C.white } },
      { text: 'Zéro contact physique requis dans la coque', options: { color: C.muted } },
      { text: 'Manette Bluetooth (coût matériel supplémentaire)', options: { color: C.muted } },
    ],
    [
      { text: 'File d’Attente LocalStorage', options: { bold: true, color: C.white } },
      { text: 'Zéro perte de données en cas de panne Wi-Fi', options: { color: C.muted } },
      { text: 'Requêtes directes (perte sèche des logs)', options: { color: C.muted } },
    ],
    [
      { text: 'Source Unique CSV', options: { bold: true, color: C.white } },
      { text: 'Modifiable facilement sur Excel par les profs', options: { color: C.muted } },
      { text: 'JSON figé dans le code source', options: { color: C.muted } },
    ],
    [
      { text: 'Three.js StereoEffect', options: { bold: true, color: C.white } },
      { text: '60 FPS légers sur navigateur mobile ordinaire', options: { color: C.muted } },
      { text: 'Unity WebGL (centaines de Mo à charger)', options: { color: C.muted } },
    ],
  ];

  s.addTable(tableRows, {
    x: 0.6, y: 1.45, w: 8.8, h: 3.7,
    fontFace: FONT, fontSize: 10,
    border: { pt: 1, color: C.cardBorder },
    fill: { color: C.card },
    valign: 'middle',
  });

  s.addNotes("Ce tableau récapitule nos arbitrages : chaque décision a été prise pour maximiser la fluidité, réduire les coûts matériels et fiabiliser la collecte des données.");
}

// =========================================================================
// SLIDE 12 : CONCLUSION & FEUILLE DE ROUTE
// =========================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, 'Conclusion & Calendrier vers la Démonstration Finale', 'Conclusion', 12);

  addCard(s, {
    x: 0.6, y: 1.45, w: 4.25, h: 2.3,
    title: 'État Actuel (100% Opérationnel)',
    items: [
      { bold: 'Compilation & Rendu :', text: 'Rendu stéréo fluide à 60 FPS sans framework superflu.' },
      { bold: 'Base de données active :', text: 'Auth et journalisation Supabase testées avec succès.' },
      { bold: 'Les 3 TP configurés :', text: 'Sélection regard et boîte à outils opérationnelles.' }
    ],
  });

  addCard(s, {
    x: 5.15, y: 1.45, w: 4.25, h: 2.3,
    title: 'Calendrier des Échéances Clés',
    titleColor: C.blue,
    items: [
      { bold: '14 Novembre :', text: 'Journée d’intégration inter-équipes (Simulation & Vision).' },
      { bold: '21–22 Novembre :', text: 'Tests réels avec 8 à 10 étudiants en laboratoire.' },
      { bold: '25 Novembre :', text: 'Démonstration finale devant le jury du TSYP 14 !' }
    ],
  });

  // Callout banner
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.6, y: 3.95, w: 8.8, h: 1.2,
    rectRadius: 0.1, fill: { color: C.accent },
  });
  s.addText('EduMinds : Rendre l’apprentissage de l’électronique accessible, interactif et durable.', {
    x: 0.8, y: 4.15, w: 8.4, h: 0.4,
    fontSize: 14, fontFace: FONT, bold: true, color: '08183C', align: 'center',
  });
  s.addText('Merci pour votre attention. Place aux questions !', {
    x: 0.8, y: 4.55, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: FONT, color: 'FFFFFF', align: 'center',
  });

  s.addNotes("EduMinds prouve qu'avec une architecture logicielle moderne, une gestion intelligente des données et un simple smartphone, nous pouvons offrir à chaque étudiant un laboratoire d'électronique durable, économique et sans danger. Merci pour votre attention, je suis à votre disposition pour vos questions.");
}

// Generate the file
const outputPath = path.resolve('EduMinds_Presentation_TSYP14.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`Presentation generated successfully: ${fileName}`);
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
    process.exit(1);
  });

