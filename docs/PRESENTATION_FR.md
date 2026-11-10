# Plan de Présentation : EduMinds Glasses Lite (Application Étudiant)
**Challenge :** AOTN Challenge — TSYP 14 (Thème : Éducation Durable)  
**Présentateur :** Zied Dhieb — Élève-ingénieur en 1ère année (Génie des Données et Systèmes Décisionnels, ENET’Com Sfax)  
**Périmètre :** L'application web côté étudiant (Frontend AR/VR, Ergonomie Regard, et Ingestion des Données)

---

## Structure du diaporama (12 Diapositives)

```
[1. Titre] ──> [2. Problématique] ──> [3. Solution & Périmètre] ──> [4. Parcours Étudiant]
                                                                            │
[8. Données & File] <── [7. Architecture Technique] <── [6. Boîte à Outils] <┘
       │
[9. Métriques Financières] ──> [10. Hooks Équipe] ──> [11. Choix d'Architecture] ──> [12. Conclusion]
```

---

### Diapositive 1 : Titre & Introduction
- **Titre :** EduMinds Glasses Lite — L'Expérience VR Côté Étudiant
- **Sous-titre :** Laboratoires d'électronique virtuels, économiques et durables
- **Événement :** AOTN Challenge · TSYP 14 (IEEE Student Branch ENET’Com)
- **Présentateur :** Zied Dhieb (Génie des Données & Systèmes Décisionnels)
- **Visuels :** Logos ENET'Com et IEEE SB + aperçu de l'interface en verre liquide.
- **Ce que vous dites (Script orateur) :**
  > "Bonjour à tous les membres du jury. Dans le cadre du challenge AOTN sous le thème de l'éducation durable, notre équipe a développé **EduMinds Glasses Lite**. Aujourd'hui, je vous présente l'application étudiante : une interface immersive, accessible et robuste conçue pour démocratiser les travaux pratiques d'électronique sans risque matériel."

---

### Diapositive 2 : La Problématique — Coût du matériel & Déchets électroniques
- **Le constat dans les universités :**
  - Équipements de laboratoire onéreux (oscilloscopes, alimentations stabilisées, capteurs, circuits intégrés).
  - Taux de casse élevé : les étudiants débutants grillent inévitablement des composants (LEDs, capteurs, fusibles) lors de leurs premiers TP.
  - Les contraintes budgétaires réduisent le nombre d'heures de pratique réelle pour les étudiants.
- **Impact écologique et financier :**
  - Chaque composant grillé devient un déchet électronique polluant.
  - Les coûts de remplacement et de maintenance limitent l'investissement dans de nouvelles technologies.
- **Ce que vous dites :**
  > "Chaque année, les écoles d'ingénieurs font face à un coût important de renouvellement de matériel : les étudiants débutants grillent inévitablement des composants en commettant des erreurs de câblage. Cela engendre des dépenses continues et des déchets électroniques. EduMinds transforme ces erreurs réelles en apprentissages virtuels à coût zéro."

---

### Diapositive 3 : Notre Solution & Mon Périmètre
- **Le concept global :**
  - Un casque ultra-accessible : smartphone standard + coque VR + caméra arrière en vidéo réelle (passthrough).
  - Kit de jetons physiques avec marqueurs ArUco + solveur de circuit nodal (MNA).
- **Mon périmètre précis (L'application étudiant) :**
  - **Vidéo passthrough :** flux vidéo réel en plein écran pour garder l'étudiant ancré dans son environnement.
  - **Authentification sans mot de passe :** connexion anonyme instantanée (aucun identifiant complexe à retenir).
  - **Interface VR stéréo & Sélection au regard :** navigation 100% sans contact une fois le téléphone dans le casque.
  - **Boîte à outils de composants :** carrousel interactif de composants réels.
  - **Journalisation résiliente :** file d'attente locale synchronisée avec Supabase pour le tableau de bord enseignant.
- **Ce que vous dites :**
  > "Au lieu d'imposer des casques VR à plus de 1000 dollars, notre solution s'appuie sur le smartphone que chaque étudiant possède déjà. Mon rôle au sein du projet a été de concevoir l'intégralité de l'application étudiant : le flux vidéo réel, l'interface stéréo 3D mains-libres, la sélection des TP et la collecte en temps réel des données d'apprentissage."

---

### Diapositive 4 : Le Parcours Utilisateur (User Flow)
- **Étape 1 : Connexion au bureau (Téléphone en main)**
  - Carte en verre liquide. Saisie fluide du pseudo et de la classe sur le clavier virtuel habituel.
- **Étape 2 : Transition vers le casque (Compte à rebours de 8 secondes)**
  - Écran d'instructions invitant à insérer le téléphone dans la coque VR.
  - Verrouillage automatique en mode paysage et bascule en plein écran.
- **Étape 3 : Immersion VR Stéréo (Dans le casque)**
  - Découpage stéréo à double vue (`StereoEffect`).
  - La pièce réelle reste visible en arrière-plan ; les panneaux 3D flottent à 2,5 mètres devant l'élève.
- **Étape 4 : Choix du TP & Début de manipulation**
  - **TP 1 :** LED + Résistance (Loi d'Ohm, la LED brûle sans résistance).
  - **TP 2 :** Diviseur de tension + Capteur 3,3 V (Protection contre les surtensions).
  - **TP 3 :** Court-circuit (Protection par fusible).
- **Ce que vous dites :**
  > "L'ergonomie a été conçue pour la réalité du terrain : l'élève tape son pseudo normalement sur son téléphone. Dès la validation, un compte à rebours de 8 secondes lui laisse le temps de glisser le téléphone dans le casque. Ensuite, la vue bascule en stéréo 3D avec les travaux pratiques flottant directement devant lui."

---

### Diapositive 5 : Navigation Mains-Libres : Le Regard (Dwell Gaze)
- **La contrainte physique :** Une fois le téléphone enfermé dans la coque VR, l'écran tactile n'est plus accessible.
- **Notre solution : La sélection au regard temporisé (Dwell Gaze)**
  - Un réticule circulaire central indique exactement le point de regard de l'élève.
  - Fixer une tuile pendant **1,5 seconde** déclenche la sélection automatiquement.
  - Une jauge orange animée fournit un retour visuel en temps réel.
  - **Aucun bouton de validation :** Zéro friction cognitive.
  - Sécurité anti-sortie : Le bouton « Changer de TP » requiert **2,0 secondes** de regard pour éviter toute sortie involontaire.
- **Ce que vous dites :**
  > "Dans le casque, l'écran tactile est inaccessible. Nous avons donc créé une navigation 100% au regard (Dwell Gaze) : fixer un bouton pendant 1,5 seconde le valide automatiquement, matérialisé par une jauge de progression orange. Pour éviter de quitter un TP par inadvertance, le bouton de sortie exige 2 secondes complètes de fixation."

---

### Diapositive 6 : La Boîte à Outils (Carrousel Horizontal)
- **Agencement ergonomique :** Bandeau horizontal flottant placé à hauteur naturelle des yeux et des mains.
- **3 tuiles visibles simultanément :** Évite la surcharge visuelle en réalité virtuelle.
- **Interaction directe de prise (« Take ») :**
  - Fixer un composant le prend pour le faire apparaître dans la main réelle de l'élève.
  - Un badge multiplicateur (`×1`, `×2`) s'incrémente instantanément.
  - Déclenche le hook `takeComponent(lab, comp, count)` pour l'équipe de simulation 3D.
- **Défilement des pages :**
  - Flèches clavier ou molette sur PC, balayage tactile ou futur hand-tracking (`vr.swipe(1 | -1)`).
- **Source unique de vérité :** 110 composants électroniques réels chargés dynamiquement depuis un fichier CSV.
- **Ce que vous dites :**
  > "La boîte à outils affiche 3 composants à la fois pour garder une vision claire. Regarder un composant permet de l'ajouter dans la main virtuelle de l'élève avec un compteur. Toutes les données proviennent d'un fichier CSV centralisant 110 composants électroniques réels avec leurs références et prix unitaires."

---

### Diapositive 7 : Architecture Technique (Comment nous l'avons fait)
- **Stack Frontend :**
  - **Vite 5 :** Démarrage instantané et compilation de production optimisée (715 ko compressés).
  - **JavaScript Pur (Vanilla ES Modules) :** Zéro surcoût de framework, 60 FPS garantis sur webview mobile.
  - **Three.js (`^0.170`) + `StereoEffect` :** Projection stéréoscopique double caméra avec gestion précise de la parallaxe.
  - **Textures Dynamiques Canvas 2D :** Panneaux en verre dépoli (`CanvasTexture`) avec typographie vectorielle nette (`Inter Variable`).
  - **DeviceOrientation API :** Suivi gyroscopique 3DOF de la tête avec bascule souris sur ordinateur.
- **Ce que vous dites :**
  > "Pour garantir une réactivité maximale sur mobile, nous avons écarté les frameworks lourds au profit de JavaScript pur et de Three.js. L'effet de verre liquide est dessiné dynamiquement dans des canvas 2D. Cette légèreté assure un rendu fluide et constant à 60 images par seconde."

---

### Diapositive 8 : Ingénierie des Données : File Résiliente Supabase
- **La réalité du terrain :** Le Wi-Fi universitaire est instable et subit des coupures fréquentes.
- **Notre architecture : File d'attente FIFO hors-ligne (`src/db.js`)**
  - Chaque événement (`lab_started`, `component_taken`, `failure_caused`, `lab_ended`) est stocké dans le `localStorage`.
  - Génération d'identifiants UUID côté client : les tentatives de réémission **ne créent aucun doublon**.
  - Réémission automatique toutes les 15 secondes et dès la détection de l'événement navigateur `online`.
  - En cas de coupure réseau, la file est conservée intacte.
- **Sécurité RLS :** Politiques Row Level Security dans Supabase garantissant que l'étudiant n'accède qu'à ses propres données via authentification anonyme.
- **Ce que vous dites :**
  > "En tant qu'étudiant en génie des données, la robustesse du pipeline de collecte était primordiale. Les coupures de réseau étant fréquentes dans les salles de TP, nous avons mis en place une file d'attente locale persistée. Même si la connexion est interrompue, aucun événement n'est perdu. Dès le retour du réseau, les données sont synchronisées avec Supabase sans aucun doublon grâce aux clés primaires UUID."

---

### Diapositive 9 : Mesure de l'Impact Éducatif & Financier
- **Vues SQL calculées automatiquement dans PostgreSQL :**
  - `failures_prevented` : Calcule les économies réelles générées par les pannes virtuelles :
    $$\text{Économies (TND)} = \sum (\text{Nombre d'erreurs} \times \text{Prix unitaire du composant})$$
  - Exemples concrets :
    - `led_overcurrent` $\rightarrow$ LED rouge préservée (CMP018)
    - `sensor_overvoltage` $\rightarrow$ Capteur analogique 3,3 V préservé (CMP083)
    - `short_circuit` $\rightarrow$ Fusible de protection préservé (CMP068)
  - `common_mistakes` : Identifie les notions théoriques mal assimilées nécessitant un rappel du professeur.
  - `student_progress` : Mesure la durée moyenne des séances et le rythme d'apprentissage.
- **Ce que vous dites :**
  > "Grâce à des vues analytiques dans PostgreSQL, nous quantifions l'impact financier exact d'EduMinds : chaque fausse manipulation est associée au composant qui aurait été détruit pour calculer la somme économisée par l'école. L'erreur n'est plus une perte financière, mais une métrique pédagogique précieuse."

---

### Diapositive 10 : Intégration Inter-Équipes & Modularité (Jalon du 14 Nov)
- **Découplage architectural :** L'application étudiant sert de conteneur d'accueil.
- **3 Hooks d'intégration (`src/main.js`) :**
  1. `startLab(lab, student)` $\rightarrow$ L'équipe Simulation initialise le solveur MNA du TP choisi.
  2. `takeComponent(lab, component, count)` $\rightarrow$ L'équipe Vision/Hardware instancie le composant virtuel.
  3. `stopLab(lab)` $\rightarrow$ L'équipe Simulation nettoie le circuit.
- **Partage du flux caméra :** Exposition directe du flux `<video id="cam">` pour la détection de marqueurs ArUco.
- **Contrôle gestuel :** Prêt pour le Hand Tracking via `vr.swipe(1)` et `vr.swipe(-1)`.
- **Ce que vous dites :**
  > "Pour travailler efficacement en équipe pluridisciplinaire, notre architecture est strictement découplée. Trois fonctions claires permettent aux équipes Simulation et Vision de brancher leurs moteurs sans modifier l'interface ni la base de données."

---

### Diapositive 11 : Synthèse des Décisions Techniques (Pourquoi ce choix ?)

| Choix Technique | Pourquoi ce choix ? | Alternative Écartée |
| :--- | :--- | :--- |
| **Web + Capacitor** | Base de code unique ; test immédiat sur navigateur + APK Android | Java / Kotlin natif (trop lourd et lent à itérer) |
| **Sélection Regard (1,5 s)** | Zéro contact physique nécessaire dans la coque VR | Manette Bluetooth (coût supplémentaire et appairage complexe) |
| **File LocalStorage** | Zéro perte de données en cas de panne Wi-Fi ; anti-doublon UUID | Requêtes `fetch()` directes (perte sèche d'événements) |
| **Source Unique CSV** | Mise à jour directe des prix et composants sur Excel par l'équipe | JSON figé dans le code (complexe à éditer pour les enseignants) |
| **Three.js StereoEffect** | 60 FPS constants sur navigateur mobile léger | Moteurs Unity / Unreal WebGL (temps de chargement de plusieurs centaines de Mo) |

---

### Diapositive 12 : Conclusion & Prochaines Échéances
- **État d'avancement (Validé et Opérationnel) :**
  - Application compilée et fluide à 60 FPS.
  - Authentification et journalisation Supabase 100% testées et sécurisées.
  - Les 3 travaux pratiques configurés avec sélection au regard et boîte à outils.
- **Calendrier vers la finale :**
  - **14 Novembre :** Journée d'intégration avec les équipes Simulation et Vision.
  - **21–22 Novembre :** Tests utilisateurs avec 8 à 10 étudiants en laboratoire.
  - **25 Novembre :** Démonstration finale du prototype au challenge AOTN !
- **Conclusion finale :**
  > "EduMinds prouve qu'avec une architecture logicielle moderne, une gestion intelligente des données et un simple smartphone, nous pouvons offrir à chaque étudiant un laboratoire d'électronique durable, économique et sans danger. Merci pour votre attention, je suis à votre disposition pour vos questions."

