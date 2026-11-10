# EduMinds app (login, camera, TP choice)

    npm install
    npm run dev        # open http://localhost:5173 (laptop webcam works)

Flow: login (phone in hand) -> "put the phone in the headset" countdown -> floating glass TP list,
chosen by looking at a button for 1.5 s (on a laptop: drag the mouse to look around).
The handoff to the simulation is `startLab(lab, student)` in `src/main.js`.

Mobile app (Android, Capacitor), after `npm run build`:

    npm i @capacitor/core @capacitor/cli @capacitor/android
    npx cap init EduMinds com.eduminds.app --web-dir=dist
    npx cap add android && npx cap sync && npx cap open android
