# Presentation Plan: EduMinds Glasses Lite (Student-Side App)
**Challenge:** AOTN Challenge — TSYP 14 (Theme: Sustainable Education)  
**Presenter:** Zied Dhieb — First-Year Engineering Student (Data Engineering & Decision Systems, ENET’Com Sfax)  
**Focus:** The Student-Facing Web Application (AR/VR Frontend, Gaze UX, and Data Ingestion)

---

## Slide Overview (12 Slides Deck)

```
[1. Title] ──> [2. Problem] ──> [3. Solution & Scope] ──> [4. Student Flow]
                                                                  │
[8. Data & Queue] <── [7. Tech Architecture] <── [6. Toolbox] <───┘
       │
[9. Financial Impact] ──> [10. Team Hooks] ──> [11. Architectural Decisions] ──> [12. Conclusion]
```

---

### Slide 1: Title & Introduction
- **Title:** EduMinds Glasses Lite — Student-Side VR Experience
- **Subtitle:** Affordable, Sustainable AR/VR Labs for Electronics Education
- **Event:** AOTN Challenge · TSYP 14 (IEEE Student Branch ENET’Com)
- **Presenter:** Zied Dhieb (Data Engineering & Decision Systems)
- **Visuals:** ENET'Com logo + IEEE Student Branch logo + EduMinds liquid-glass card preview.
- **What to say (Speaker Note):**
  > "Bonjour à tous. Dans le cadre du challenge AOTN au TSYP 14 sous le thème de l’éducation durable, nous avons conçu **EduMinds Glasses Lite**. Aujourd'hui, je vous présente l'application côté étudiant : une interface immersive, accessible et robuste conçue pour démocratiser les travaux pratiques d'électronique."

---

### Slide 2: The Problem — Equipment Cost & E-Waste
- **The Challenge in Universities:**
  - High equipment costs (oscilloscopes, power supplies, sensors, ICs).
  - High failure rate: beginner students burn components (LEDs, sensors, fuses) during early labs.
  - Budget constraints restrict practical lab hours for students in developing institutions.
- **Environmental & Financial Impact:**
  - Burnt components turn into electronic waste.
  - Maintenance and replacement costs create bottlenecks in educational institutions.
- **What to say:**
  > "Chaque année, les écoles d'ingénieurs et universités font face à un coût énorme de remplacement de matériel : les étudiants débutants grillent inévitablement des LED, des capteurs ou des fusibles en manipulant des circuits. Cela coûte cher et crée des déchets électroniques. EduMinds transforme ces erreurs réelles en apprentissages virtuels à coût zéro."

---

### Slide 3: Our Solution & My Project Scope
- **The Global Concept:**
  - An ultra-low-cost headset: standard smartphone + VR plastic shell + rear camera video passthrough.
  - Physical token kit with ArUco markers + custom solver engine (MNA).
- **My Precise Scope (The Student App):**
  - **Video Passthrough:** Fullscreen rear camera feed keeping the student grounded in reality.
  - **Student Authentication:** Anonymous, instant sign-in (no passwords to forget).
  - **VR Stereo UI & Gaze Selection:** 100% hands-free interaction inside the headset.
  - **Component Toolbox Strip:** Interactive component selection.
  - **Resilient Data Queue:** Ingesting every action into Supabase for learning analytics and teacher metrics.
- **What to say:**
  > "Au lieu d'acheter des casques VR à plus de 1000 dollars, notre solution utilise le smartphone déjà présent dans la poche de l'étudiant. Mon rôle au sein de l'équipe a été de concevoir l'intégralité de l'application étudiant : le flux vidéo réel, l'interface stéréo 3D sans contact, le sélecteur de TP et la remontée en temps réel des données d'apprentissage."

---

### Slide 4: Student Journey (The User Flow)
- **Step 1: Desktop Login (Phone in Hand)**
  - Liquid-glass modal card. Enter nickname & class using native keyboard.
- **Step 2: Headset Handoff (8-second countdown)**
  - Countdown screen with "Je suis prêt" bypass.
  - System locks landscape orientation and triggers fullscreen.
- **Step 3: Immersive Stereo VR (Inside the Headset)**
  - Screen splits into stereoscopic 3D (`StereoEffect`).
  - Real room visible through the camera; UI panels float 2.5 meters in front of the student.
- **Step 4: TP Selection & Live Experimentation**
  - TP1: LED + Résistance (Ohm's Law)
  - TP2: Diviseur de tension + Capteur 3.3V (Overvoltage protection)
  - TP3: Court-circuit (Current limits & fuse)
- **What to say:**
  > "L'ergonomie a été pensée pour la réalité du terrain : la saisie du pseudo se fait à la main sur le clavier du téléphone. Dès la validation, un compte à rebours de 8 secondes permet de glisser le téléphone dans le casque. Ensuite, la vue bascule en stéréo 3D avec les panneaux flottant devant l'élève."

---

### Slide 5: Hands-Free Interaction: Dwell Gaze UX
- **The Problem:** Once the smartphone is enclosed in the VR shell, the touchscreen cannot be touched.
- **The Solution:** Dwell-Time Gaze Selection.
  - Center reticle ring indicates where the student is looking.
  - Looking at a TP card for **1.5 seconds** automatically selects it.
  - An orange animated progress bar gives visual feedback.
  - **No validation button required:** Eliminates friction.
  - Exit protection: The "Changer de TP" button requires a **2.0-second gaze** to prevent accidental exits.
- **What to say:**
  > "Une fois le téléphone dans le casque, l'écran tactile est inaccessible. Nous avons donc implémenté une navigation par le regard (Dwell Gaze) : fixer un bouton pendant 1,5 seconde le valide automatiquement avec une jauge de progression orange. Pour éviter de quitter un TP par erreur, le bouton de sortie demande 2 secondes de regard."

---

### Slide 6: The Component Toolbox (Horizontal Carousel)
- **Design:** Floating horizontal strip positioned at natural chest height.
- **3 Tiles Visible at a Time:** Prevents visual clutter in VR.
- **Direct "Take" Action:**
  - Looking at a tile takes that component into the student's physical hand.
  - Badge counter (`×1`, `×2`) increments instantly.
  - Fires the `takeComponent(lab, comp, count)` hook for the 3D simulation team.
- **Page Scrolling:**
  - Trackpad / keyboard arrows (`←` / `→`) on laptop.
  - Touch-swipe or future hand-tracking gestures (`vr.swipe(1 | -1)`).
- **Single Source of Truth:** 110 real components loaded directly from `components.csv`.
- **What to say:**
  > "La boîte à composants se présente sous forme d'un bandeau fluide de 3 tuiles visibles. Fixer un composant l'ajoute directement dans la main virtuelle de l'élève avec un badge multiplicateur. Les données proviennent directement d'un fichier CSV centralisant 110 composants avec leurs références et prix réels."

---

### Slide 7: Technical Architecture (How We Built It)
- **Frontend Stack:**
  - **Vite 5:** Instant development and optimized production bundling (715 kB gzipped).
  - **Vanilla JavaScript (ES Modules):** Zero framework overhead, 60 FPS guaranteed on mobile webviews.
  - **Three.js (`^0.170`) + `StereoEffect`:** Dual-camera projection for stereoscopic 3D.
  - **HTML5 Canvas 2D Textures:** Dynamically rendered frosted-glass panels (`CanvasTexture`) with crisp vector text.
  - **DeviceOrientation API:** 3DOF head tracking with desktop mouse-drag fallback.
- **What to say:**
  > "Sur le plan technique, nous avons privilégié la légèreté : pas de framework lourd comme React, mais du JavaScript pur et Three.js. L'affichage stéréo est géré par StereoEffect et les textures sont générées dynamiquement en Canvas 2D avec un effet verre liquide moderne. Cela garantit un taux de rafraîchissement fluide à 60 images par seconde sur smartphone."

---

### Slide 8: Data & Decision Systems: Resilient Supabase Queue
- **The Reality of University Wi-Fi:** Campus networks are unstable and frequently drop.
- **Our Architecture: Offline-First FIFO Queue (`src/db.js`)**
  - Every event (`lab_started`, `component_taken`, `failure_caused`, `lab_ended`) is queued in `localStorage`.
  - Client-generated UUIDs ensure idempotency: retries **never duplicate rows**.
  - Events are retried every 15 seconds or on the `online` browser event.
  - Network failures pause the queue; database-level rejections drop cleanly.
- **Security:** Supabase Row Level Security (RLS) ensures students can only read and write their own rows using anonymous JWT auth.
- **What to say:**
  > "En tant qu'étudiant en ingénierie des données, la fiabilité du flux était ma priorité absolue. Le Wi-Fi universitaire étant souvent instable, nous avons créé une file d'attente locale (FIFO) persistée dans le localStorage. Même si la connexion coupe pendant le TP, aucun événement n'est perdu : dès que le réseau revient, les données sont synchronisées avec Supabase sans aucun doublon grâce à des identifiants UUID."

---

### Slide 9: Educational & Financial Impact Metrics
- **Automated KPI Views in PostgreSQL:**
  - `failures_prevented`: Calculates real money saved based on virtual failures:
    - $\text{Money Saved} = \sum (\text{Failure Count} \times \text{Unit Component Price})$
  - Examples:
    - `led_overcurrent` $\rightarrow$ Saved CMP018 (Red LED)
    - `sensor_overvoltage` $\rightarrow$ Saved CMP083 (3.3V Sensor)
    - `short_circuit` $\rightarrow$ Saved CMP068 (Fuse)
  - `common_mistakes`: Highlights which theoretical concepts require teacher intervention.
  - `student_progress`: Measures session duration, labs completed, and learning speed.
- **What to say:**
  > "Grâce aux vues SQL calculées automatiquement dans Supabase, le tableau de bord enseignant peut prouver l'impact financier exact du projet : chaque LED ou capteur virtuellement grillé est multiplié par son prix unitaire réel pour calculer le budget économisé par l'université. L'erreur devient un indicateur pédagogique sans coût financier."

---

### Slide 10: Team Integration & Modularity (Before Nov 14)
- **Loose Coupling:** The student app acts as the host container.
- **3 Simple Hooks for Partner Teams:**
  1. `startLab(lab, student)` $\rightarrow$ Simulation team initializes MNA circuit.
  2. `takeComponent(lab, component, count)` $\rightarrow$ Vision/hardware team spawns token.
  3. `stopLab(lab)` $\rightarrow$ Simulation engine cleans up.
- **Vision Integration:** Exposes the active video stream for ArUco marker detection (`cam.srcObject`).
- **Gesture Control:** Ready for hand tracking via `vr.swipe(1)` and `vr.swipe(-1)`.
- **What to say:**
  > "Pour respecter les délais serrés de la compétition, notre code est strictement modulaire. Trois hooks simples permettent aux équipes Simulation et Vision de brancher leur moteur sans toucher à notre logique d'affichage ni à la base de données."

---

### Slide 11: Summary of Key Technical Decisions (Why We Did It)

| Decision | Why We Chose It | Alternative Rejected |
| :--- | :--- | :--- |
| **Web + Capacitor** | One single codebase; instant zero-install browser test + Android APK | Pure Native Java/Kotlin (too slow to iterate) |
| **Dwell Gaze (1.5s)** | Zero physical touch needed when phone is locked in the headset shell | Bluetooth controller (adds cost & hardware setup) |
| **LocalStorage Queue** | Zero data loss on university Wi-Fi drops; duplicate-proof via UUID | Direct `fetch()` (loses events on network failure) |
| **CSV Single Source** | Easy for teachers & team to update prices & add components in Excel | Hardcoded JSON (requires code edits to change prices) |
| **Three.js StereoEffect** | Lightweight 60 FPS VR rendering on standard mobile browser | Heavy Unity / Unreal WebGL (hundreds of MBs to load) |

---

### Slide 12: Conclusion & Next Steps
- **Current Status (Validated):**
  - Build & packaging verified.
  - Supabase authentication & logging 100% operational.
  - 3 TPs ready with gaze navigation and component toolbox.
- **Milestones Ahead:**
  - **Nov 14:** Integration day with Simulation & Vision teams.
  - **Nov 21–22:** User testing with 8–10 engineering students.
  - **Nov 25:** Final AOTN Challenge live demonstration!
- **Closing Statement:**
  > "EduMinds démontre qu'avec une architecture web bien pensée, des données résilientes et un smartphone ordinaire, nous pouvons transformer chaque salle de classe en un laboratoire d'électronique durable, moderne et sans limites. Merci pour votre attention."

