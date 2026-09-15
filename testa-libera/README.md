# Testa Libera — messa online (GitHub Pages + Firebase)

App GTD personale. I dati stanno su Firestore, legati al tuo account Google:
li vedi uguali da computer e da telefono.

## 1. Firebase (circa 10 minuti)

1. Vai su **console.firebase.google.com** → *Aggiungi progetto* → nome a piacere
   (es. `testa-libera`). Google Analytics non serve, puoi disattivarlo.
2. **Firestore**: menu *Build → Firestore Database → Crea database* →
   scegli *Modalità di produzione* → località `eur3` o `europe-west8`.
3. **Regole**: scheda *Regole*, sostituisci tutto con questo e premi *Pubblica*:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Vuol dire: ognuno legge e scrive solo la propria roba. Senza login, niente.

   **Da stringere dopo il primo accesso.** Siccome l'app e' solo tua, conviene
   chiuderla del tutto: dopo esserti loggato la prima volta, vai in
   *Authentication → Users*, copia il tuo UID e rimetti le regole cosi':

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth.uid == "IL-TUO-UID";
       }
     }
   }
   ```

   Con questa, anche se un estraneo trova il sito ed entra con un suo account
   Google, non puo' scrivere nulla: l'app gli resta inerte.
4. **Login**: *Build → Authentication → Inizia* → scheda *Sign-in method* →
   *Google* → *Abilita* → salva.
5. **Configurazione**: ingranaggio in alto a sinistra → *Impostazioni progetto* →
   in fondo, *Le tue app* → icona **Web `</>`** → registra l'app (senza Hosting) →
   copia il blocco `firebaseConfig`.
6. Apri `index.html`, cerca **INCOLLA_QUI** (è in fondo al file) e sostituisci
   quel blocco con il tuo. Sono sei righe: apiKey, authDomain, projectId,
   storageBucket, messagingSenderId, appId.

## 2. GitHub Pages (circa 5 minuti)

Questi file stanno tutti dentro la cartella `testa-libera/`: **va caricata cosi'
com'e'**, senza scompattarne il contenuto nella radice del repository. In questo
modo non tocca niente di quello che hai gia' li' dentro (altri `index.html`,
README, altre pagine) e il service worker resta confinato a questa sottocartella.

### Se usi un repository che hai gia'

1. Apri il repository → *Add file → Upload files*.
2. Trascina dentro **la cartella** `testa-libera` intera (non i singoli file):
   GitHub mantiene la struttura e crea `testa-libera/index.html` e compagnia.
3. *Commit changes*. Se Pages e' gia' attivo su quel repository, dopo un minuto
   l'app e' online a: `https://TUONOME.github.io/NOMEREPO/testa-libera/`

### Se invece parti da un repository nuovo

1. *New repository* → nome a piacere → **Public** → crea.
2. Carica la cartella `testa-libera` come sopra.
3. *Settings → Pages* → Source: **Deploy from a branch**, Branch: **main** /
   **/(root)** → *Save*.
4. Indirizzo: `https://TUONOME.github.io/NOMEREPO/testa-libera/`

> Volendo puoi anche mettere i file direttamente nella radice, ma solo se li'
> non c'e' gia' un `index.html`: verrebbe sostituito.

## 3. L'ultimo passaggio che si dimentica sempre

Torna su Firebase → *Authentication → Settings → Authorized domains* →
*Add domain* → aggiungi `TUONOME.github.io`.
Senza questo il login dà errore quando apri il sito pubblicato.

## 4. Sul telefono

Apri l'indirizzo, poi:

- **iPhone (Safari)**: tasto Condividi → *Aggiungi a Home*.
- **Android (Chrome)**: menu ⋮ → *Installa app* / *Aggiungi a schermata Home*.

Si apre a tutto schermo come un'app. Funziona anche senza rete: quello che
scrivi offline viene sincronizzato appena torna la connessione.

## Note

- Il blocco `firebaseConfig` non è un segreto: identifica il progetto, non
  autorizza nessuno. A proteggere i dati sono le regole del punto 1.3 più il login.
- Non attivare la fatturazione sul progetto: sul piano gratuito il caso peggiore
  è che l'app smetta di rispondere fino al giorno dopo, non una bolletta.
- Nel codice non c'è nessuna email: il calendario usa l'account con cui hai
  fatto accesso.
- Per aggiornare l'app in futuro: ricarichi `index.html` su GitHub e cambi il
  numero di versione dentro `sw.js` (`testa-libera-v2` → `v3`), così i telefoni
  scaricano la versione nuova invece di quella in cache.
