# Guide d'intégration : Application Étudiant (EduMinds)

Ce document explique aux équipes **Simulation & Pédagogie**, **Vision & AR** et **Hardware** comment s'interfacer avec l'application étudiant.

---

## 1. Vue d'ensemble

L'application étudiant gère :
1. L'arrière-plan caméra vidéo (passthrough réel).
2. L'authentification anonyme et l'enregistrement de l'élève.
3. Le choix du TP et la boîte à outils des composants en réalité virtuelle (stéréo 3D).
4. La sélection par le regard (dwell gaze de 1,5 s).
5. La journalisation automatique de toutes les actions dans la base Supabase.

---

## 2. Les Hooks d'intégration (`src/main.js`)

Toutes les interactions avec la simulation passent par 3 fonctions dans `src/main.js` :

### `startLab(lab, student)`
Appelé dès que l'élève valide le choix d'un TP avec son regard.
- **Paramètres :**
  - `lab` : `{ id: 1, code: 'led_resistor', title: 'TP 1 · LED + résistance' }`
  - `student` : `{ nickname: 'Amine', className: '1ère année' }`
- **Action attendue de votre équipe :**
  - Charger la scène de simulation correspondant à `lab.code`.

### `takeComponent(lab, component, count)`
Appelé lorsque l'élève regarde une tuile de composant dans le bandeau.
- **Paramètres :**
  - `lab` : le TP actif.
  - `component` : `{ ref: 'CMP018', name: 'LED rouge', price: 0.5, category: 'Semi-conducteurs' }`
  - `count` : nombre total d'exemplaires pris pour ce composant.
- **Action attendue de votre équipe :**
  - Faire apparaître l'objet virtuel dans la main de l'élève ou dans son inventaire de simulation.

### `stopLab(lab)`
Appelé lorsque l'élève regarde le bouton « Changer de TP » (regard maintenu 2 s).
- **Action attendue de votre équipe :**
  - Arrêter le moteur de simulation (MNA) et réinitialiser le circuit.

---

## 3. Remonter un incident / échec virtuel (`logEvent`)

Pour que le tableau de bord enseignant mesure les pannes évitées et le coût économisé, l'équipe Simulation doit appeler `logEvent` lorsqu'une erreur de manipulation survient.

Importation :
```javascript
import { logEvent } from './db.js';
```

### Types d'événements supportés :

1. **Panne provoquée par l'élève :**
   ```javascript
   logEvent('failure_caused', { failureCode: 'led_overcurrent' });
   ```
   *Codes de pannes déclarés en base :*
   - `'led_overcurrent'` : LED grillée sans résistance (associé à CMP018, coût économisé calculé automatiquement).
   - `'sensor_overvoltage'` : Capteur 3,3 V détruit par surtension (associé à CMP083).
   - `'short_circuit'` : Court-circuit direct (associé au fusible CMP068).

2. **Indice demandé / utilisé par l'élève :**
   ```javascript
   logEvent('hint_used', { payload: { hint_id: 1, step: 'calcul_resistance' } });
   ```

*Note : Les événements `lab_started`, `component_taken` et `lab_ended` sont déjà enregistrés automatiquement par l'application étudiant.*

---

## 4. Hook pour le Hand Tracking (Défilement du bandeau)

Si l'équipe Vision / Gestes détecte un balayage de la main :
- Appel vers l'instance VR :
  - `vr.swipe(1)` : page suivante (3 composants suivants).
  - `vr.swipe(-1)` : page précédente (3 composants précédents).
  - `vr.recenter()` : recentre les panneaux en face de l'élève.

---

## 5. Partage du flux caméra avec l'équipe Vision (ArUco)

Actuellement, la caméra arrière est ouverte par l'élément `<video id="cam">` dans `src/main.js`.
Au jour de l'intégration (14 novembre), l'équipe Vision pourra directement brancher son détecteur de marqueurs sur ce même flux :
```javascript
const stream = document.getElementById('cam').srcObject;
```

