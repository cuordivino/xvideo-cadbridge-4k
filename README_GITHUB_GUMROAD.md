# CADBridge Pro — AutoCAD (2013+) & SketchUp (2021+) Universal Controller

Applicazione Web Progressiva (PWA) responsiva e installabile su **iPhone, Android, Tablet, PC e Terminale**, progettata per guidare e incrementare **AutoCAD (dalla versione 2013 in su)** e **SketchUp (dalla versione 2021 in su)** tramite:
- **Comandi Precompilati & Guidati** (Stanze parametriche 2D/3D, Murature, Aperture, Layer Architettonici standard, Pulizia DWG, Studio Solare 3D).
- **Controllo Vocale & Testo Naturale** (Dettatura vocale o scritta tradotta istantaneamente in codice AutoLISP `.lsp` per AutoCAD 2013+ e Ruby `.rb` per SketchUp 2021+).
- **Geolocalizzazione Google Maps & Rilievo GPS** (Acquisizione coordinate reali dal cellulare, conversione metrica CAD, orientamento Nord/Ombre e generazione poligonale del lotto).
- **Condivisione Diretta 1-a-1 Vincolata a IP (Senza Pagamento per il tuo Ospite)**:
  - Tu (Proprietario) generi un **link diretto monouso** per una singola connessione bidirezionale 1-a-1.
  - Il ricevente viene **bloccato sul suo singolo indirizzo IP / terminale**: può usare l'app con te in modo bidirezionale e gratuito, ma **non può modificare l'app, né generare link, né condividerla con altri**.
- **Monetizzazione su Gumroad**:
  - Chiunque apra il sito senza il tuo link di invito diretto vede il **Paywall Gumroad** dove può acquistare la licenza e inserire la propria **License Key**.

---

## 1. Pubblicazione su GitHub Pages (Sito + App Aggiornabile su iPhone e Android)

1. Crea una nuova repository su GitHub (es. `cadbridge-pro`) e carica tutti i file di questa cartella.
2. Vai su **Settings &rarr; Pages** della repository GitHub e imposta `Branch: main` (root `/`).
3. Il tuo sito/app sarà attivo su `https://tuo-utente.github.io/cadbridge-pro/`.
4. **Installazione come App nativa:**
   - **Su iPhone (Safari):** Apri il link &rarr; Tocca **Condividi** &rarr; **Aggiungi alla schermata Home**.
   - **Su Android (Chrome):** Apri il link &rarr; Tocca **📲 Installa App**.
   - **Su PC:** Clicca l'icona di installazione nella barra degli indirizzi di Chrome/Edge.
5. Ogni modifica caricata su GitHub aggiornerà automaticamente l'app su tutti i dispositivi grazie al Service Worker (`sw.js`).

---

## 2. Configurazione Vendita su Gumroad

1. Crea un prodotto su [Gumroad](https://gumroad.com) e attiva l'opzione **"Generate a unique license key per sale"**.
2. Nella scheda **🔗 Link 1-a-1 IP-Lock & Gumroad** dell'app, inserisci il tuo URL prodotto Gumroad e il Permalink per la verifica automatica delle License Key tramite API Gumroad.
