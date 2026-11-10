# TaskBoard (Web) — Classroom Task Management

Teacher task dey, student PDF jomа dey, teacher marks dey. Static web app — kono server/build lage na.

## Netlify te deploy
1. https://app.netlify.com/drop e jan
2. Ei `taskboard` folder ta (jar bhitore `index.html` ache) drag & drop korun
3. Done — link pawa jabe

## Local e chalate
`index.html` double-click korun, athoba `npx serve .`

## Files
- `index.html` — page structure
- `style.css` — Classroom-style design
- `app.js` — app logic (login, tasks, submissions, grading, Bangla/English)
- `storage.js` — data layer (localStorage + IndexedDB)

## Gurutwopurno
Data **browser e** save hoy (localStorage + IndexedDB). Mane teacher r student ek-i
browser/device e use korle kaj korbe; alada phone/computer er moddhe data share hobe na.
Sob device theke ek data lagle `storage.js` ta Firebase/Supabase/Netlify Blobs diye replace korte hobe —
baki code change lagbe na (`window.boardAPI` interface ek-i thakbe).
