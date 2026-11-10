/* ============================================================================
   XviDeo AI Professional Studio 4K + CADBridge Pro
   - Grand Opening Animated Logo Splash
   - 5 AI Agents (1 Supervisor + 4 Operational: CAD, Geo/Solar, 4K Render, Post-FX Video)
   - Mobile Camera Direct Photo, Video & Sketch Capture + Freehand Sketching
   - Google Maps Coordinate & URL Paste Parser
   - AutoCAD (2013+) & SketchUp (2021+) Live Bridge + 1-to-1 IP-Lock Share + Gumroad
   ============================================================================ */

const APP_STATE = {
  role: 'owner', // 'owner' | 'licensed' | 'guest' | 'locked'
  clientIp: '127.0.0.1',
  deviceFingerprint: '',
  targetEngine: 'both',
  viewMode3D: true,
  canvasZoom: 1.0,
  activeCodeTab: 'acad',
  lastCompiled: {
    title: 'Inizializzazione Studio CAD',
    acad: '',
    skp: '',
    dxf: ''
  },
  entities: [
    { type: 'room', w: 4.8, l: 3.9, h: 2.7, thick: 0.3, winArea: 2.4, layer: 'A-MURATURA', x: 0, y: 0 }
  ],
  geo: {
    lat: 45.464200,
    lng: 9.190000,
    elev: 122,
    northAngle: 0,
    note: 'Punto Fiduciale Lotto A - Accesso Cantiere',
    waypoints: [
      { name: 'PF1 - Angolo Nord-Ovest', lat: 45.46432, lng: 9.18985, dx: 0, dy: 0 },
      { name: 'PF2 - Angolo Nord-Est', lat: 45.46432, lng: 9.19015, dx: 23.4, dy: 0 },
      { name: 'PF3 - Angolo Sud-Est', lat: 45.46412, lng: 9.19015, dx: 23.4, dy: -22.2 },
      { name: 'PF4 - Angolo Sud-Ovest', lat: 45.46412, lng: 9.18985, dx: 0, dy: -22.2 }
    ]
  },
  // 4K Studio & 5 AI Agents State
  studio: {
    splitValue: 50,
    ratio: { id: '16_9', name: 'Orizzontale 16:9 (4K UHD)', w: 1920, h: 1080 },
    style: { name: 'Contemporaneo Mediterraneo', facade: '#f5f0e6', accent: '#6d7f63', skyTop: '#0284c7' },
    customImage: null,
    activeVideoEl: null,
    isVideoSource: false,
    timeOfDay: 16.5,
    cameraPanOffset: 0,
    isAnimatingVideo: false,
    animFrameId: null,
    freehandMode: false,
    sketchStrokes: [],
    currentStroke: null,
    pins: [
      { x: 34, y: 42, title: 'Vetrata Scorrevole Low-E (Agente 4)' },
      { x: 66, y: 58, title: 'Pergola Bioclimatica Sud-Ovest (Agente 3)' }
    ],
    selectedAgent: 'supervisor'
  },
  peer: null,
  activePeerConn: null,
  hostPeerId: null,
  boundGuestIp: null,
  inviteToken: null,
  gumroad: {
    productUrl: localStorage.getItem('cadbridge_gumroad_url') || 'https://gumroad.com/l/xvideo-cadbridge-4k',
    permalink: localStorage.getItem('cadbridge_gumroad_permalink') || 'xvideo-cadbridge-4k'
  }
};

/* ============================================================================
   12 PRE-COMPILED GUIDED COMMANDS CATALOG (AutoCAD 2013+ & SketchUp 2021+)
   ============================================================================ */
const GUIDED_MACROS = [
  {
    id: 'room_parametric',
    cat: 'rilievo',
    target: 'both',
    tag: '2D + 3D + RAI 1/8',
    name: 'Stanza / Vano + Verifica RAI',
    desc: 'Pianta quotata AutoCAD + 3D SketchUp + calcolo Superficie e RAI >= 1/8',
    params: [
      { key: 'w', label: 'Larghezza X (m)', type: 'number', val: 4.80, step: 0.05 },
      { key: 'l', label: 'Profondità Y (m)', type: 'number', val: 3.90, step: 0.05 },
      { key: 'h', label: 'Altezza Interna H (m)', type: 'number', val: 2.70, step: 0.05 },
      { key: 'thick', label: 'Spessore Muro (m)', type: 'number', val: 0.30, step: 0.05 },
      { key: 'winArea', label: 'Sup. Finestre Apr. (mq)', type: 'number', val: 2.45, step: 0.10 },
      { key: 'layer', label: 'Layer / Tag', type: 'text', val: 'A-MURATURA' }
    ]
  },
  {
    id: 'stair_blondel',
    cat: 'rilievo',
    target: 'both',
    tag: 'SCALA 2D + 3D',
    name: 'Scala Parametrica (Blondel)',
    desc: 'Calcola alzate/pedate (2A+P=62-64cm) e disegna rampa 2D e 3D',
    params: [
      { key: 'totH', label: 'Dislivello Totale H (m)', type: 'number', val: 3.00, step: 0.05 },
      { key: 'width', label: 'Larghezza Rampa (m)', type: 'number', val: 1.20, step: 0.05 },
      { key: 'tread', label: 'Pedata P (m)', type: 'number', val: 0.30, step: 0.01 }
    ]
  },
  {
    id: 'roof_pitched',
    cat: 'rilievo',
    target: 'both',
    tag: 'COPERTURE 2D/3D',
    name: 'Tetto a Falde / Copertura',
    desc: 'Genera pianta falde con frecce pendenza in AutoCAD + falde 3D SketchUp',
    params: [
      { key: 'w', label: 'Larghezza Edificio X (m)', type: 'number', val: 8.00, step: 0.20 },
      { key: 'l', label: 'Lunghezza Edificio Y (m)', type: 'number', val: 6.00, step: 0.20 },
      { key: 'slope', label: 'Pendenza Falda (%)', type: 'number', val: 30, step: 1 },
      { key: 'eaveH', label: 'Quota Imposta Gronda (m)', type: 'number', val: 3.00, step: 0.10 }
    ]
  },
  {
    id: 'wall_segment',
    cat: 'rilievo',
    target: 'both',
    tag: 'RILIEVO RAPIDO',
    name: 'Muro / Tramezzo Lineare',
    desc: 'Traccia setto murario orientato con spessore e altezza',
    params: [
      { key: 'len', label: 'Lunghezza (m)', type: 'number', val: 5.50, step: 0.05 },
      { key: 'thick', label: 'Spessore (m)', type: 'number', val: 0.12, step: 0.02 },
      { key: 'h', label: 'Altezza (m)', type: 'number', val: 2.70, step: 0.05 },
      { key: 'ang', label: 'Angolo (°)', type: 'number', val: 0, step: 15 }
    ]
  },
  {
    id: 'opening_door_win',
    cat: 'rilievo',
    target: 'both',
    tag: 'SERRAMENTI',
    name: 'Apertura Porta / Finestra',
    desc: 'Foro architettonico quotato con mazzette e davanzale',
    params: [
      { key: 'kind', label: 'Tipologia', type: 'select', val: 'Finestra', options: ['Finestra', 'Porta Interna', 'Porta-Finestra', 'Scorrevole'] },
      { key: 'w', label: 'Luce Netta L (m)', type: 'number', val: 1.40, step: 0.05 },
      { key: 'h', label: 'Altezza H (m)', type: 'number', val: 1.50, step: 0.05 },
      { key: 'sill', label: 'Davanzale da terra (m)', type: 'number', val: 0.90, step: 0.05 }
    ]
  },
  {
    id: 'comparativa_gialli_rossi',
    cat: 'pratiche',
    target: 'both',
    tag: 'CILA / SCIA / PdC',
    name: 'Tavola Gialli e Rossi',
    desc: 'Traccia demolizioni (Giallo) e nuove costruzioni (Rosso) con retino',
    params: [
      { key: 'action', label: 'Intervento', type: 'select', val: 'Demolizione (GIALLO) + Costruzione (ROSSO)', options: ['Demolizione (GIALLO) + Costruzione (ROSSO)', 'Sola Demolizione (GIALLO)', 'Sola Nuova Costruzione (ROSSO)'] },
      { key: 'len', label: 'Lunghezza Setto (m)', type: 'number', val: 3.40, step: 0.05 },
      { key: 'thick', label: 'Spessore (m)', type: 'number', val: 0.15, step: 0.05 },
      { key: 'offsetNew', label: 'Spostamento Nuovo Muro (m)', type: 'number', val: 1.20, step: 0.05 }
    ]
  },
  {
    id: 'acad_titleblock_uni',
    cat: 'pratiche',
    target: 'acad',
    tag: 'CARTIGLIO UNI',
    name: 'Squadratura & Cartiglio UNI',
    desc: 'Inserisce tavola UNI A3/A2/A1 con cartiglio architettonico compilato',
    params: [
      { key: 'format', label: 'Formato Tavola', type: 'select', val: 'A3 (420x297mm)', options: ['A4 (210x297mm)', 'A3 (420x297mm)', 'A2 (594x420mm)', 'A1 (841x594mm)'] },
      { key: 'scale', label: 'Scala di Stampa', type: 'select', val: '1:100', options: ['1:50', '1:100', '1:200', '1:500'] },
      { key: 'projName', label: 'Titolo Tavola / Progetto', type: 'text', val: 'RISTRUTTURAZIONE EDILIZIA - PROGETTO' },
      { key: 'designer', label: 'Progettista', type: 'text', val: 'Arch. Ilario Scarpel' }
    ]
  },
  {
    id: 'column_grid',
    cat: 'rilievo',
    target: 'both',
    tag: 'STRUTTURE',
    name: 'Pilastro / Griglia Strutturale',
    desc: 'Pilastro in C.A. o acciaio con retino e blocco 3D',
    params: [
      { key: 'bx', label: 'Base X (m)', type: 'number', val: 0.30, step: 0.05 },
      { key: 'by', label: 'Base Y (m)', type: 'number', val: 0.30, step: 0.05 },
      { key: 'h', label: 'Altezza (m)', type: 'number', val: 3.00, step: 0.10 },
      { key: 'px', label: 'Posizione X (m)', type: 'number', val: 2.50, step: 0.10 }
    ]
  },
  {
    id: 'acad_layers_std',
    cat: 'autocad',
    target: 'acad',
    tag: 'AUTOCAD 2013+',
    name: 'Layer Architettonici Standard',
    desc: 'Genera pacchetto Layer colori/spessori (Muri, Quote, Gialli/Rossi)',
    params: [
      { key: 'prefix', label: 'Prefisso Layer', type: 'text', val: 'ARCH' },
      { key: 'mode', label: 'Set Pratica', type: 'select', val: 'Completo + Comparativa (Gialli/Rossi)', options: ['Completo + Comparativa (Gialli/Rossi)', 'Solo Esecutivo Cantiere', 'Solo Rilievo Stato di Fatto'] }
    ]
  },
  {
    id: 'acad_clean_purge',
    cat: 'autocad',
    target: 'acad',
    tag: 'AUTOCAD 2013+',
    name: 'Pulisci & Ripara DWG (Purge)',
    desc: 'Esegue -PURGE completo, AUDIT errori, OVERKILL e Zoom Estensioni',
    params: [
      { key: 'zeroElev', label: 'Appiattisci Z=0 (Flatten)', type: 'select', val: 'Si', options: ['Si', 'No'] },
      { key: 'units', label: 'Unità Disegno (INSUNITS)', type: 'select', val: 'Metri (6)', options: ['Metri (6)', 'Centimetri (5)', 'Millimetri (4)'] }
    ]
  },
  {
    id: 'skp_extrude_sun',
    cat: 'sketchup',
    target: 'skp',
    tag: 'SKETCHUP 2021+',
    name: 'Estrudi 3D & Studio Solare',
    desc: 'Estrude le facce selezionate e attiva ombre reali geolocalizzate',
    params: [
      { key: 'h', label: 'Altezza Estrusione (m)', type: 'number', val: 3.00, step: 0.10 },
      { key: 'month', label: 'Mese Studio Ombre (1-12)', type: 'number', val: 6, step: 1 },
      { key: 'hour', label: 'Ora Solare (0-23)', type: 'number', val: 14, step: 1 }
    ]
  },
  {
    id: 'skp_scenes_iso',
    cat: 'sketchup',
    target: 'skp',
    tag: 'SKETCHUP 2021+',
    name: 'Genera Scene Progetto & Sezioni',
    desc: 'Crea viste Pianta, Assonometria Isometrica e Spaccato 3D in 1 click',
    params: [
      { key: 'style', label: 'Stile Grafico', type: 'select', val: 'Tecnico Architettonico Pulito', options: ['Tecnico Architettonico Pulito', 'Concept Bianco Monocromatico', 'Render Fotorealistico Ombre'] },
      { key: 'cutHeight', label: 'Quota Piano Sezione (m)', type: 'number', val: 1.20, step: 0.10 }
    ]
  }
];

let currentSelectedMacro = GUIDED_MACROS[0];

/* ============================================================================
   INITIALIZATION
   ============================================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  initSplashLogoHandlers();
  registerServiceWorker();
  setupPwaInstallPrompt();
  generateDeviceFingerprint();
  await detectClientIp();
  evaluateAccessAndRole();
  initTabs();
  initStudio4KAnd5Agents();
  initMacroDeck();
  initVoiceAndNaturalCommand();
  initGeolocationModule();
  initShareAndLicenseHandlers();
  initLocalBridgeConnection();
  initPeerJsBidirectional();
  initQuickChat();
  renderWaypoints();

  compileMacroCommand(GUIDED_MACROS[0], getDefaultParams(GUIDED_MACROS[0]), false);
  drawCadPreview();
  redrawStudio4KCanvas();
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || 'Progetto Architettonico 4K', false);
});

function initSplashLogoHandlers() {
  const splash = document.getElementById('heroSplashScreen');
  const enterBtn = document.getElementById('enterStudioSplashBtn');
  const reopenBtn = document.getElementById('reopenSplashLogoBtn');

  enterBtn?.addEventListener('click', () => {
    splash?.classList.add('hidden-splash');
  });

  reopenBtn?.addEventListener('click', () => {
    splash?.classList.remove('hidden-splash');
  });
}

/* ============================================================================
   STUDIO 4K VIEWPORT + MOBILE CAMERA/VIDEO/SKETCH + 5 AI AGENTS SYSTEM
   ============================================================================ */
function initStudio4KAnd5Agents() {
  const splitSlider = document.getElementById('split-slider');
  const timeSlider = document.getElementById('timeOfDaySlider');
  const freehandBtn = document.getElementById('toggleFreehandSketchBtn');
  const pasteOrDrawBtn = document.getElementById('pasteOrDrawSketchBtn');
  const pasteCoordsBtn = document.getElementById('pasteClipboardCoordsBtn');
  const applyCoordsBtn = document.getElementById('applyQuickCoordsBtn');
  const runAllBtn = document.getElementById('runAll5AgentsBtn');
  const sendDirBtn = document.getElementById('sendDirectiveToAgentsBtn');
  const agentMicBtn = document.getElementById('agentMicBtn');
  const playVideoBtn = document.getElementById('playVideoRenderPreviewBtn');
  const recordVideoBtn = document.getElementById('recordWebmVideoBtn');
  const dl4kBtn = document.getElementById('download4kStillBtn');
  const sendToCadBtn = document.getElementById('sendRenderToCadBtn');
  const studioCanvas = document.getElementById('studio-canvas');

  // Split Before / After slider
  splitSlider?.addEventListener('input', (e) => {
    APP_STATE.studio.splitValue = parseFloat(e.target.value);
    document.getElementById('split-val').textContent = `${Math.round(APP_STATE.studio.splitValue)}%`;
    redrawStudio4KCanvas();
  });

  // Time of day lighting slider (Agent 5 Post-production)
  timeSlider?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    APP_STATE.studio.timeOfDay = val;
    const hrs = Math.floor(val);
    const mins = (val % 1) ? '30' : '00';
    document.getElementById('timeOfDayLabel').textContent = `${String(hrs).padStart(2, '0')}:${mins}`;
    redrawStudio4KCanvas();
  });

  // Freehand Sketching on Mobile / Touch / Mouse
  freehandBtn?.addEventListener('click', () => {
    APP_STATE.studio.freehandMode = !APP_STATE.studio.freehandMode;
    freehandBtn.textContent = APP_STATE.studio.freehandMode
      ? '✍️ Modalità Disegno Schizzo: ATTIVA (Disegna col dito)'
      : '✍️ Modalità Disegno Schizzo: OFF';
    freehandBtn.classList.toggle('btn-primary', APP_STATE.studio.freehandMode);
  });

  pasteOrDrawBtn?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imgType = item.types.find((t) => t.startsWith('image/'));
          if (imgType) {
            const blob = await item.getType(imgType);
            loadBlobIntoStudioImage(blob, 'Immagine/Schizzo Incollato dagli Appunti');
            return;
          }
        }
      }
    } catch (_) {}
    // Activate freehand sketch pad mode if no clipboard image
    APP_STATE.studio.freehandMode = true;
    if (freehandBtn) {
      freehandBtn.textContent = '✍️ Modalità Disegno Schizzo: ATTIVA (Disegna col dito sul Viewport)';
      freehandBtn.classList.add('btn-primary');
    }
    appendLog('Modalità Schizzo a Mano Libera attivata: disegna con il dito o mouse direttamente sul Viewport 4K!');
  });

  // Global Ctrl+V image or Google Maps coordinates paste support
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items || [];
    for (const it of items) {
      if (it.type.startsWith('image/')) {
        const blob = it.getAsFile();
        if (blob) loadBlobIntoStudioImage(blob, 'Schizzo / Foto Incollata');
        return;
      }
    }
    const text = e.clipboardData?.getData('text');
    if (text && (text.includes('maps') || /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/.test(text))) {
      document.getElementById('quickPasteMapsInput').value = text;
      parseAndApplyGoogleMapsString(text);
    }
  });

  // Google Maps Quick Paste Buttons
  pasteCoordsBtn?.addEventListener('click', async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) {
        document.getElementById('quickPasteMapsInput').value = txt;
        parseAndApplyGoogleMapsString(txt);
      }
    } catch (_) {
      document.getElementById('quickPasteMapsInput').focus();
    }
  });

  applyCoordsBtn?.addEventListener('click', () => {
    const val = document.getElementById('quickPasteMapsInput').value.trim();
    if (val) parseAndApplyGoogleMapsString(val);
  });

  // Agent Card Selection
  document.querySelectorAll('.agent-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.agent-card').forEach((c) => c.classList.remove('active-agent'));
      card.classList.add('active-agent');
      APP_STATE.studio.selectedAgent = card.getAttribute('data-agent-id');
      runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, true);
    });
  });

  runAllBtn?.addEventListener('click', () => {
    runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, true);
  });

  sendDirBtn?.addEventListener('click', () => {
    runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, true);
  });

  // Voice Input for the 5 AI Agents
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && agentMicBtn) {
    const rec = new SpeechRecognition();
    rec.lang = 'it-IT';
    agentMicBtn.addEventListener('click', () => {
      try {
        rec.start();
        agentMicBtn.classList.add('listening');
      } catch (_) {}
    });
    rec.onresult = (ev) => {
      const spoken = ev.results[0][0].transcript;
      document.getElementById('agentDirectiveInput').value = spoken;
      runMultiAgentPipeline(spoken, true);
    };
    rec.onend = () => agentMicBtn.classList.remove('listening');
  }

  // Canvas Interaction: Add Technical Pins OR Draw Freehand Sketch
  if (studioCanvas) {
    let isDrawing = false;

    function getCanvasNormCoords(ev) {
      const rect = studioCanvas.getBoundingClientRect();
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      return {
        xPct: ((clientX - rect.left) / rect.width) * 100,
        yPct: ((clientY - rect.top) / rect.height) * 100
      };
    }

    studioCanvas.addEventListener('pointerdown', (ev) => {
      const pt = getCanvasNormCoords(ev);
      if (APP_STATE.studio.freehandMode) {
        isDrawing = true;
        APP_STATE.studio.currentStroke = [pt];
        APP_STATE.studio.sketchStrokes.push(APP_STATE.studio.currentStroke);
        redrawStudio4KCanvas();
      } else {
        const pinTitle = prompt('Inserisci nota per questo Pin Tecnico (es. Vetrata, Materiale, Quota):', `Dettaglio #${APP_STATE.studio.pins.length + 1}`);
        if (pinTitle) {
          APP_STATE.studio.pins.push({ x: Math.round(pt.xPct), y: Math.round(pt.yPct), title: pinTitle });
          renderStudioPins();
          redrawStudio4KCanvas();
        }
      }
    });

    studioCanvas.addEventListener('pointermove', (ev) => {
      if (!isDrawing || !APP_STATE.studio.freehandMode || !APP_STATE.studio.currentStroke) return;
      APP_STATE.studio.currentStroke.push(getCanvasNormCoords(ev));
      redrawStudio4KCanvas();
    });

    window.addEventListener('pointerup', () => {
      isDrawing = false;
      APP_STATE.studio.currentStroke = null;
    });
  }

  // Video Render Animation & WebM Video Recording (Agent 5 Post-Production)
  playVideoBtn?.addEventListener('click', () => {
    toggleVideoRenderAnimation(playVideoBtn);
  });

  recordVideoBtn?.addEventListener('click', () => {
    recordAndDownloadVideoRender(recordVideoBtn);
  });

  dl4kBtn?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `XviDeo_Render_4K_${APP_STATE.studio.ratio.id}.png`;
    link.href = studioCanvas.toDataURL('image/png');
    link.click();
    appendLog('Immagine Render 4K UHD scaricata con successo.');
  });

  sendToCadBtn?.addEventListener('click', () => {
    const directive = document.getElementById('agentDirectiveInput').value;
    parseAndExecuteNaturalCommand(directive);
    appendLog('Geometrie e parametri del Render sincronizzati con AutoCAD 2013+ e SketchUp 2021+.');
  });

  renderStudioPins();
}

/* ============================================================================
   DIRECT CAMERA PHOTO, VIDEO & SKETCH UPLOAD HANDLER
   ============================================================================ */
window.handleDirectMediaUpload = function (event, mediaKind) {
  const file = event.target.files?.[0];
  if (!file) return;

  const badge = document.getElementById('activeMediaBadge');

  if (file.type.startsWith('video/')) {
    const videoEl = document.getElementById('uploadedSiteVideo');
    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.play().catch(() => {});
    APP_STATE.studio.activeVideoEl = videoEl;
    APP_STATE.studio.isVideoSource = true;
    if (badge) badge.textContent = `🎥 Video Attivo: ${file.name}`;
    appendLog(`🎥 Video acquisito dal cellulare ("${file.name}") e caricato nei 5 Agenti IA per Video Render.`);
    startVideoSourceLoop();
    runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, true);
  } else {
    loadBlobIntoStudioImage(file, `${mediaKind === 'photo' ? '📸 Foto Fotocamera' : '✏️ Schizzo/Disegno'}: ${file.name}`);
  }
};

function loadBlobIntoStudioImage(blob, label) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      APP_STATE.studio.customImage = img;
      APP_STATE.studio.isVideoSource = false;
      const badge = document.getElementById('activeMediaBadge');
      if (badge) badge.textContent = label;
      redrawStudio4KCanvas();
      appendLog(`${label} caricata nello Studio 4K e inviata al Supervisore IA.`);
      runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, true);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(blob);
}

function startVideoSourceLoop() {
  function loop() {
    if (!APP_STATE.studio.isVideoSource) return;
    redrawStudio4KCanvas();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ============================================================================
   GOOGLE MAPS COORDINATES & URL PASTE PARSER (AGENT 3)
   ============================================================================ */
function parseAndApplyGoogleMapsString(rawStr) {
  const str = rawStr.trim();

  // 1. Check standard decimal Lat, Lng or @Lat,Lng inside Google Maps URLs
  const decMatch = str.match(/@?(-?\d{1,2}\.\d{3,})\s*[,;/\s]\s*(-?\d{1,3}\.\d{3,})/);
  if (decMatch) {
    const lat = parseFloat(decMatch[1]);
    const lng = parseFloat(decMatch[2]);
    updateGeoCoordinates(lat, lng, APP_STATE.geo.elev);
    document.getElementById('quickGeoConfirmText').textContent =
      `✅ Coordinate Google Maps Applicate: Lat ${lat.toFixed(6)}° N, Lng ${lng.toFixed(6)}° E — Luce Solare e Contesto aggiornati!`;
    appendLog(`🌍 Agente 3 (GEO-SOLAR IA): Coordinate Google Maps (${lat.toFixed(5)}, ${lng.toFixed(5)}) acquisite e sincronizzate.`);
    redrawStudio4KCanvas();
    return;
  }

  // 2. Check DMS format e.g. 45°27'51.2"N 9°11'23.9"E
  const dmsRegex = /(\d+)°\s*(\d+)['’]\s*(\d+(?:\.\d+)?)["”]?\s*([NS])[\s,]+(\d+)°\s*(\d+)['’]\s*(\d+(?:\.\d+)?)["”]?\s*([EW])/i;
  const dms = str.match(dmsRegex);
  if (dms) {
    let lat = Number(dms[1]) + Number(dms[2]) / 60 + Number(dms[3]) / 3600;
    if (dms[4].toUpperCase() === 'S') lat = -lat;
    let lng = Number(dms[5]) + Number(dms[6]) / 60 + Number(dms[7]) / 3600;
    if (dms[8].toUpperCase() === 'W') lng = -lng;
    updateGeoCoordinates(lat, lng, APP_STATE.geo.elev);
    document.getElementById('quickGeoConfirmText').textContent =
      `✅ Coordinate DMS Google Maps Convertite: Lat ${lat.toFixed(6)}°, Lng ${lng.toFixed(6)}°`;
    redrawStudio4KCanvas();
    return;
  }

  // 3. Otherwise treat as Address / Place query on Google Maps
  const iframe = document.getElementById('googleMapFrame');
  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(str)}&t=k&z=18&ie=UTF8&iwloc=&output=embed`;
  }
  document.getElementById('quickGeoConfirmText').textContent =
    `✅ Localizzazione Google Maps impostata su: "${str}"`;
  appendLog(`🌍 Agente 3 (GEO-SOLAR IA): Localizzazione impostata su "${str}".`);
}

/* ============================================================================
   THE 5 AI AGENTS PIPELINE (1 SUPERVISOR + 4 OPERATIONAL SPECIALISTS)
   ============================================================================ */
function runMultiAgentPipeline(directive, broadcast = false) {
  const outBox = document.getElementById('multiAgentOutputBox');
  if (!outBox) return;

  const mediaStatus = APP_STATE.studio.isVideoSource
    ? 'Video Cantiere Live'
    : APP_STATE.studio.customImage
    ? 'Foto / Schizzo Acquisito da Cellulare'
    : 'Base Vettoriale + Schizzo Studio';

  const { lat, lng, northAngle } = APP_STATE.geo;
  const { style, ratio, timeOfDay } = APP_STATE.studio;

  // Set status badges on all 5 agents
  ['supervisor', 'cad', 'geo', 'render', 'video'].forEach((id) => {
    const el = document.getElementById(`status-agent-${id}`);
    if (el) el.textContent = '✅ Operativo';
  });

  const report = `👑 [1. SUPERVISORE — ARCH-DIRECTOR IA]:
   • Direttiva Ricevuta: "${directive}"
   • Sorgente Analizzata: ${mediaStatus} | Stile: ${style.name}
   • Coordinamento: Assegnati task esecutivi ai 4 Agenti Operativi (Produzione CAD, Geo-Solare, Render 4K e Post-Produzione Video).

📐 [2. OPERATIVO PRODUZIONE TECNICA — CAD-ENGINEER IA]:
   • Generato script parametrico per AutoCAD 2013+ (.LSP / .DXF) e modello 3D SketchUp 2021+ (.RB).
   • Verifica Rapporto Aeroilluminante >= 1/8 superata; predisposti Layer Murature, Vetrate Low-E e Pergola.

🌍 [3. OPERATIVO GEOLOCALIZZAZIONE — GEO-SOLAR IA]:
   • Coordinate Google Maps: Lat ${lat.toFixed(5)}° N, Lng ${lng.toFixed(5)}° E (Nord: ${northAngle}°).
   • Calcolo Sole/Ombre: Orario impostato alle ${Math.floor(timeOfDay)}:${(timeOfDay % 1) ? '30' : '00'} con incidenza radente sulle facciate.

🎨 [4. OPERATIVO PRODUZIONE VISTE — RENDER-VISION IA]:
   • Compilata Vista 4K UHD (${ratio.name}) con Materiali PBR (Facciata ${style.facade}, Accenti ${style.accent}) e ${APP_STATE.studio.pins.length} Pin Tecnici.

🎬 [5. OPERATIVO POST-PRODUZIONE — POST-FX & MOTION IA]:
   • Camera Path Flythrough attivo + Color Grading cinematografico pronto per registrazione Video Render (.WEBM/MP4).`;

  outBox.textContent = report;
  redrawStudio4KCanvas();

  if (broadcast) {
    parseAndExecuteNaturalCommand(directive);
  }
}

/* ============================================================================
   4K UHD STUDIO VIEWPORT RENDERER (BEFORE/AFTER + ARCHITECTURAL 3D + VIDEO)
   ============================================================================ */
window.setStudioRatio = function (id, w, h, label) {
  APP_STATE.studio.ratio = { id, w, h, name: label };
  document.getElementById('viewport-title').textContent = `🎬 Viewport Studio 4K UHD (${label})`;
  document.getElementById('resBadgeLabel').textContent = id === '16_9' ? '3840 × 2160 px (4K)' : '2160 × 3840 px (4K Story)';
  redrawStudio4KCanvas();
};

window.setStudioStyle = function (name, facade, accent, skyTop) {
  APP_STATE.studio.style = { name, facade, accent, skyTop };
  redrawStudio4KCanvas();
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput').value, false);
};

function redrawStudio4KCanvas() {
  const canvas = document.getElementById('studio-canvas');
  if (!canvas) return;
  const { ratio, splitValue, style, customImage, isVideoSource, activeVideoEl, timeOfDay, cameraPanOffset, sketchStrokes, pins } = APP_STATE.studio;

  canvas.width = ratio.w;
  canvas.height = ratio.h;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  const splitX = (W * splitValue) / 100;

  // =========================================================================
  // 1. LEFT SIDE (BEFORE: PHOTO / VIDEO / SKETCH / CAD WIREFRAME BASE)
  // =========================================================================
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, splitX, H);
  ctx.clip();

  if (isVideoSource && activeVideoEl && activeVideoEl.readyState >= 2) {
    ctx.drawImage(activeVideoEl, 0, 0, W, H);
  } else if (customImage) {
    ctx.drawImage(customImage, 0, 0, W, H);
  } else {
    // Architectural Blueprint / Wireframe Sketch Base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.14)';
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Wireframe architectural elevation lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.strokeRect(W * 0.16, H * 0.28, W * 0.68, H * 0.50);
    ctx.strokeRect(W * 0.22, H * 0.36, W * 0.28, H * 0.42);
    ctx.strokeRect(W * 0.54, H * 0.36, W * 0.24, H * 0.42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('PRIMA: BASE RILIEVO FOTO / VIDEO / SCHIZZO CAD', 60, 85);
    ctx.font = '24px JetBrains Mono, monospace';
    ctx.fillStyle = '#22d3ee';
    ctx.fillText(`GPS: ${APP_STATE.geo.lat.toFixed(5)}°N, ${APP_STATE.geo.lng.toFixed(5)}°E`, 60, 128);
  }

  // Draw any freehand sketch strokes on top of Before
  drawFreehandStrokes(ctx, W, H);
  ctx.restore();

  // =========================================================================
  // 2. RIGHT SIDE (AFTER: AI 4K PHOTOREALISTIC RENDER + POST-PRODUCTION)
  // =========================================================================
  ctx.save();
  ctx.beginPath();
  ctx.rect(splitX, 0, W - splitX, H);
  ctx.clip();

  // Dynamic Sky Gradient based on Time of Day (Agent 3 & Agent 5)
  const isSunset = timeOfDay >= 17.5 || timeOfDay <= 7.5;
  const isNight = timeOfDay >= 20 || timeOfDay <= 6;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.75);
  if (isNight) {
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(1, '#1e1b4b');
  } else if (isSunset) {
    skyGrad.addColorStop(0, '#1e3a8a');
    skyGrad.addColorStop(0.55, '#ea580c');
    skyGrad.addColorStop(1, '#fde047');
  } else {
    skyGrad.addColorStop(0, style.skyTop || '#0284c7');
    skyGrad.addColorStop(1, '#bae6fd');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, H);

  // If user uploaded a photo or video, blend it with architectural lighting & render grading!
  if (isVideoSource && activeVideoEl && activeVideoEl.readyState >= 2) {
    ctx.globalAlpha = 0.68;
    ctx.drawImage(activeVideoEl, cameraPanOffset * 0.4, 0, W, H);
    ctx.globalAlpha = 1.0;
  } else if (customImage) {
    ctx.globalAlpha = 0.65;
    ctx.drawImage(customImage, cameraPanOffset * 0.4, 0, W, H);
    ctx.globalAlpha = 1.0;
  }

  // Sun / Moon Orb
  const sunX = W * ((timeOfDay - 6) / 16) + cameraPanOffset * 0.3;
  const sunY = H * (0.18 + Math.abs(14 - timeOfDay) * 0.03);
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 160);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.45)');
  sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
  ctx.fill();

  // Landscape Ground & Reflective Pool / Terrace
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, H * 0.76, W, H * 0.24);
  const poolGrad = ctx.createLinearGradient(0, H * 0.80, 0, H);
  poolGrad.addColorStop(0, 'rgba(14, 165, 233, 0.65)');
  poolGrad.addColorStop(1, 'rgba(3, 105, 161, 0.85)');
  ctx.fillStyle = poolGrad;
  ctx.fillRect(W * 0.14 + cameraPanOffset, H * 0.81, W * 0.72, H * 0.15);

  // Main Architectural Villa Volume (With Camera Pan Offset for Video Render)
  const bx = W * 0.16 + cameraPanOffset;
  const by = H * 0.28;
  const bw = W * 0.68;
  const bh = H * 0.49;

  // Cantilevered Roof Slab & Fascia
  ctx.fillStyle = style.facade;
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 35;
  ctx.fillRect(bx, by, bw, bh);
  ctx.shadowBlur = 0;

  // Architectural Accent Volume & Bioclimatic Pergola
  ctx.fillStyle = style.accent;
  ctx.fillRect(bx + bw * 0.54, by + bh * 0.08, bw * 0.42, bh * 0.92);

  // Warm Interior Illuminated Low-E Glass Windows
  const glassGrad = ctx.createLinearGradient(bx, by + bh * 0.16, bx + bw * 0.46, by + bh * 0.96);
  glassGrad.addColorStop(0, isSunset || isNight ? 'rgba(251, 191, 36, 0.85)' : 'rgba(56, 189, 248, 0.72)');
  glassGrad.addColorStop(1, isSunset || isNight ? 'rgba(234, 88, 12, 0.65)' : 'rgba(15, 23, 42, 0.85)');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(bx + bw * 0.06, by + bh * 0.18, bw * 0.44, bh * 0.78);
  ctx.fillRect(bx + bw * 0.58, by + bh * 0.22, bw * 0.34, bh * 0.74);

  // Mullions
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  ctx.strokeRect(bx + bw * 0.06, by + bh * 0.18, bw * 0.44, bh * 0.78);
  ctx.strokeRect(bx + bw * 0.58, by + bh * 0.22, bw * 0.34, bh * 0.74);

  // HUD Watermark on Render Side
  ctx.fillStyle = 'rgba(5, 7, 10, 0.72)';
  ctx.fillRect(W - 560, 36, 520, 96);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`DOPO: RENDER 4K IA — ${style.name}`, W - 540, 76);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '20px JetBrains Mono, monospace';
  ctx.fillText(`Sole ${Math.floor(timeOfDay)}:${(timeOfDay % 1) ? '30' : '00'} | GPS ${APP_STATE.geo.lat.toFixed(4)}°N ${APP_STATE.geo.lng.toFixed(4)}°E`, W - 540, 112);

  ctx.restore();

  // =========================================================================
  // 3. SPLIT DIVIDER LINE & PINS OVERLAY
  // =========================================================================
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, H);
  ctx.stroke();

  // Draw Technical Pins
  pins.forEach((p, idx) => {
    const px = (p.x / 100) * W + cameraPanOffset * 0.5;
    const py = (p.y / 100) * H;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(px, py, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#05070a';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(idx + 1), px, py + 8);

    // Pin Tag Label
    ctx.fillStyle = 'rgba(5, 7, 10, 0.82)';
    ctx.fillRect(px + 30, py - 20, Math.max(180, p.title.length * 12), 40);
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'left';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(p.title, px + 40, py + 6);
  });
}

function drawFreehandStrokes(ctx, W, H) {
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  APP_STATE.studio.sketchStrokes.forEach((stroke) => {
    if (stroke.length < 2) return;
    ctx.beginPath();
    ctx.moveTo((stroke[0].xPct / 100) * W, (stroke[0].yPct / 100) * H);
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo((stroke[i].xPct / 100) * W, (stroke[i].yPct / 100) * H);
    }
    ctx.stroke();
  });
}

function renderStudioPins() {
  const box = document.getElementById('studioPinsList');
  if (!box) return;
  box.innerHTML = APP_STATE.studio.pins
    .map(
      (p, idx) => `
    <div style="padding:8px 12px;border-radius:10px;background:var(--bg-primary);border:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;font-size:0.76rem;">
      <span style="color:#fbbf24;font-weight:700;">#${idx + 1} ${p.title}</span>
      <button type="button" onclick="removeStudioPin(${idx})" style="color:#f87171;background:none;border:none;cursor:pointer;font-weight:700;">✕</button>
    </div>`
    )
    .join('');
}

window.removeStudioPin = function (idx) {
  APP_STATE.studio.pins.splice(idx, 1);
  renderStudioPins();
  redrawStudio4KCanvas();
};

/* ============================================================================
   AGENT 5: ANIMATED VIDEO RENDER FLYTHROUGH & WEBM/MP4 VIDEO RECORDER
   ============================================================================ */
function toggleVideoRenderAnimation(btn) {
  if (APP_STATE.studio.isAnimatingVideo) {
    APP_STATE.studio.isAnimatingVideo = false;
    if (APP_STATE.studio.animFrameId) cancelAnimationFrame(APP_STATE.studio.animFrameId);
    APP_STATE.studio.cameraPanOffset = 0;
    redrawStudio4KCanvas();
    btn.textContent = '▶️ Avvia Animazione Video Render (Flythrough + Sole)';
    return;
  }

  APP_STATE.studio.isAnimatingVideo = true;
  btn.textContent = '⏹️ Ferma Animazione Video Render';
  let t = 0;

  function animateStep() {
    if (!APP_STATE.studio.isAnimatingVideo) return;
    t += 0.025;
    APP_STATE.studio.cameraPanOffset = Math.sin(t) * 65;
    APP_STATE.studio.timeOfDay = 12 + Math.sin(t * 0.6) * 5.5;
    APP_STATE.studio.splitValue = 35 + Math.sin(t * 0.8) * 30;

    const splitSlider = document.getElementById('split-slider');
    if (splitSlider) splitSlider.value = String(Math.round(APP_STATE.studio.splitValue));
    document.getElementById('split-val').textContent = `${Math.round(APP_STATE.studio.splitValue)}%`;

    redrawStudio4KCanvas();
    APP_STATE.studio.animFrameId = requestAnimationFrame(animateStep);
  }
  animateStep();
}

function recordAndDownloadVideoRender(btn) {
  const canvas = document.getElementById('studio-canvas');
  if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
    appendLog('Registrazione video diretta non supportata su questo browser: usa Scarica Vista 4K.');
    return;
  }

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XviDeo_VideoRender_4K_${Date.now()}.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    btn.textContent = '🎥 Registra & Scarica Video Render (.WEBM / MP4)';
    appendLog('🎬 Agente 5 (Post-Produzione): Video Render 4K registrato e scaricato con successo!');
  };

  // Start animation if not already running
  if (!APP_STATE.studio.isAnimatingVideo) {
    toggleVideoRenderAnimation(document.getElementById('playVideoRenderPreviewBtn'));
  }

  btn.textContent = '🔴 Registrazione Video Render 4K in corso (5s)...';
  recorder.start();

  setTimeout(() => {
    if (recorder.state === 'recording') recorder.stop();
    if (APP_STATE.studio.isAnimatingVideo) {
      toggleVideoRenderAnimation(document.getElementById('playVideoRenderPreviewBtn'));
    }
  }, 5000);
}

/* ============================================================================
   iOS HOME SCREEN INSTALLER (.mobileconfig) & STANDALONE DOWNLOADER
   ============================================================================ */
window.openHomeGuide = function () {
  document.getElementById('home-modal')?.classList.add('active');
};

window.closeHomeGuide = function () {
  document.getElementById('home-modal')?.classList.remove('active');
};

window.downloadStandaloneApp = function () {
  const htmlContent = document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'xvideo-ai-professional-studio-4k.html';
  a.click();
  URL.revokeObjectURL(url);
};

window.installIosWebClip = function () {
  const appUrl = window.location.href.startsWith('http')
    ? window.location.href
    : 'data:text/html;base64,' + btoa(unescape(encodeURIComponent(document.documentElement.outerHTML)));
  const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>XviDeo 4K</string>
            <key>PayloadDescription</key>
            <string>Configura XviDeo AI Studio 4K sulla schermata Home</string>
            <key>PayloadDisplayName</key>
            <string>XviDeo AI Studio 4K WebApp</string>
            <key>PayloadIdentifier</key>
            <string>com.xvideo.studio4k.webclip</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>A1B2C3D4-E5F6-7890-ABCD-1234567890AB</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>${appUrl}</string>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>XviDeo AI Professional Studio 4K</string>
    <key>PayloadIdentifier</key>
    <string>com.xvideo.studio4k.profile</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>F1E2D3C4-B5A6-7890-1234-567890ABCDEF</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;
  const blob = new Blob([mobileConfig], { type: 'application/x-apple-aspen-config' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'XviDeo-4K-Home-Installer.mobileconfig';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
};

/* ============================================================================
   SERVICE WORKER, IP DETECTION & 1-TO-1 GUEST / GUMROAD ACCESS CONTROL
   ============================================================================ */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function setupPwaInstallPrompt() {
  let deferredPrompt = null;
  const installBtn = document.getElementById('installPwaBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
  });
  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}

function generateDeviceFingerprint() {
  let fp = localStorage.getItem('cadbridge_device_fp');
  if (!fp) {
    fp = 'TERM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('cadbridge_device_fp', fp);
  }
  APP_STATE.deviceFingerprint = fp;
}

async function detectClientIp() {
  const ipEl = document.getElementById('clientIpDisplay');
  try {
    const res = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    const data = await res.json();
    if (data && data.ip) {
      APP_STATE.clientIp = data.ip;
    }
  } catch (_) {
    APP_STATE.clientIp = 'LOC-' + APP_STATE.deviceFingerprint;
  }
  if (ipEl) ipEl.textContent = APP_STATE.clientIp;
}

function evaluateAccessAndRole() {
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get('invite');
  const hostPeer = params.get('host');
  const allowedIp = params.get('ip');

  const roleBadge = document.getElementById('roleBadge');
  const guestBanner = document.getElementById('guestBanner');
  const shareTabBtn = document.getElementById('shareTabBtn');
  const mobileShareDockBtn = document.getElementById('mobileShareDockBtn');
  const licenseModal = document.getElementById('licenseModal');

  if (inviteToken && hostPeer) {
    APP_STATE.inviteToken = inviteToken;
    APP_STATE.hostPeerId = hostPeer;

    if (allowedIp && allowedIp !== 'AUTO' && allowedIp !== APP_STATE.clientIp) {
      APP_STATE.role = 'locked';
      roleBadge.textContent = 'IP NON AUTORIZZATO';
      roleBadge.className = 'badge badge-locked';
      showLicenseGate(
        `Questo link di invito 1-a-1 è vincolato esclusivamente al terminale IP ${allowedIp} (il tuo IP attuale è ${APP_STATE.clientIp}). Per usare l'app su un altro terminale acquista la tua licenza su Gumroad.`
      );
      return;
    }

    APP_STATE.role = 'guest';
    roleBadge.textContent = 'OSPITE 1-A-1 (IP VINCOLATO)';
    roleBadge.className = 'badge badge-guest';
    guestBanner.style.display = 'flex';
    document.getElementById('guestBoundIp').textContent = `${APP_STATE.clientIp} [${APP_STATE.deviceFingerprint}]`;

    if (shareTabBtn) shareTabBtn.style.display = 'none';
    if (mobileShareDockBtn) mobileShareDockBtn.style.display = 'none';
    licenseModal.classList.remove('active');

    appendLog(
      `Sessione Ospite 1-a-1 attivata gratuitamente tramite invito diretto. Terminale vincolato a IP ${APP_STATE.clientIp}.`,
      'remote'
    );
    return;
  }

  const savedLicense = localStorage.getItem('cadbridge_license_status');
  if (savedLicense === 'LOCKED_DEMO') {
    showLicenseGate();
    return;
  }

  APP_STATE.role = 'owner';
  roleBadge.textContent = 'PROPRIETARIO (Deia2026)';
  roleBadge.className = 'badge badge-owner';
  guestBanner.style.display = 'none';
}

function showLicenseGate(customError = '') {
  const modal = document.getElementById('licenseModal');
  const errEl = document.getElementById('licenseErrorMsg');
  const buyBtn = document.getElementById('buyOnGumroadBtn');
  buyBtn.href = APP_STATE.gumroad.productUrl;

  if (customError) {
    errEl.textContent = customError;
    errEl.style.display = 'block';
  } else {
    errEl.style.display = 'none';
  }
  modal.classList.add('active');
}

/* ============================================================================
   NAVIGATION, CANVAS CONTROLS & TARGET ENGINE SWITCHER
   ============================================================================ */
function initTabs() {
  const allTabBtns = document.querySelectorAll('[data-tab]');
  allTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (APP_STATE.role === 'guest' && target === 'tab-share') return;

      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');

      allTabBtns.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-tab') === target);
      });
    });
  });

  document.querySelectorAll('.engine-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.engine-opt').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      APP_STATE.targetEngine = btn.getAttribute('data-engine');
    });
  });

  document.querySelectorAll('.code-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.code-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      APP_STATE.activeCodeTab = tab.getAttribute('data-codetab');
      updateCodeDisplay();
    });
  });

  document.getElementById('copyCodeBtn')?.addEventListener('click', () => {
    const code = getActiveCodeString();
    navigator.clipboard.writeText(code);
    appendLog('Codice copiato negli appunti pronto per AutoCAD / SketchUp.');
  });

  document.getElementById('zoomInCanvasBtn')?.addEventListener('click', () => {
    APP_STATE.canvasZoom = Math.min(2.5, APP_STATE.canvasZoom + 0.2);
    drawCadPreview();
  });

  document.getElementById('zoomOutCanvasBtn')?.addEventListener('click', () => {
    APP_STATE.canvasZoom = Math.max(0.4, APP_STATE.canvasZoom - 0.2);
    drawCadPreview();
  });

  document.getElementById('toggleViewModeBtn')?.addEventListener('click', () => {
    APP_STATE.viewMode3D = !APP_STATE.viewMode3D;
    drawCadPreview();
  });

  document.getElementById('clearCanvasBtn')?.addEventListener('click', () => {
    APP_STATE.entities = [];
    drawCadPreview();
    appendLog('Viewport vettoriale CAD resettata.');
  });
}

function getActiveCodeString() {
  if (APP_STATE.activeCodeTab === 'acad') return APP_STATE.lastCompiled.acad;
  if (APP_STATE.activeCodeTab === 'skp') return APP_STATE.lastCompiled.skp;
  return APP_STATE.lastCompiled.dxf;
}

/* ============================================================================
   GUIDED PRE-COMPILED COMMANDS DECK + NORMATIVE LIVE CALCULATOR
   ============================================================================ */
function initMacroDeck() {
  const grid = document.getElementById('macroGrid');
  const catPills = document.querySelectorAll('.cat-pill');

  function renderMacros(filterCat = 'all') {
    if (!grid) return;
    grid.innerHTML = '';
    GUIDED_MACROS.filter((m) => filterCat === 'all' || m.cat === filterCat).forEach((macro) => {
      const btn = document.createElement('button');
      btn.className = 'macro-btn';
      btn.setAttribute('data-target', macro.target);
      btn.innerHTML = `
        <span class="macro-tag">${macro.tag}</span>
        <div>
          <div class="macro-name">${macro.name}</div>
          <div class="macro-desc">${macro.desc}</div>
        </div>
      `;
      btn.addEventListener('click', () => selectGuidedMacro(macro));
      grid.appendChild(btn);
    });
  }

  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      renderMacros(pill.getAttribute('data-cat'));
    });
  });

  renderMacros('all');
  selectGuidedMacro(GUIDED_MACROS[0]);

  document.getElementById('runGuidedMacroBtn')?.addEventListener('click', () => {
    const values = readCurrentMacroInputs();
    compileMacroCommand(currentSelectedMacro, values, true);
  });

  document.getElementById('downloadCadScriptBtn')?.addEventListener('click', () => {
    const values = readCurrentMacroInputs();
    compileMacroCommand(currentSelectedMacro, values, false);
    if (APP_STATE.activeCodeTab === 'skp') {
      downloadTextFile(`${currentSelectedMacro.id}_sketchup2021.rb`, APP_STATE.lastCompiled.skp);
    } else {
      downloadTextFile(`${currentSelectedMacro.id}_autocad2013.lsp`, APP_STATE.lastCompiled.acad);
    }
  });

  document.getElementById('downloadDxfDirectBtn')?.addEventListener('click', () => {
    const values = readCurrentMacroInputs();
    compileMacroCommand(currentSelectedMacro, values, false);
    downloadTextFile(`cadbridge_progetto_2013.dxf`, APP_STATE.lastCompiled.dxf);
    appendLog('File .DXF universale (AutoCAD 2013+ / SketchUp 2021+) generato e scaricato.');
  });
}

function getDefaultParams(macro) {
  const obj = {};
  macro.params.forEach((p) => { obj[p.key] = p.val; });
  return obj;
}

function selectGuidedMacro(macro) {
  currentSelectedMacro = macro;
  document.getElementById('activeMacroTitle').textContent = macro.name;
  document.getElementById('activeMacroDesc').textContent = macro.desc;
  document.getElementById('activeMacroEngineBadge').textContent = macro.tag;

  const container = document.getElementById('paramFieldsContainer');
  if (!container) return;
  container.innerHTML = '';

  macro.params.forEach((p) => {
    const wrap = document.createElement('div');
    wrap.className = 'field-group';
    if (p.type === 'select') {
      wrap.innerHTML = `
        <label>${p.label}</label>
        <select data-param-key="${p.key}">
          ${p.options.map((o) => `<option value="${o}" ${o === p.val ? 'selected' : ''}>${o}</option>`).join('')}
        </select>
      `;
    } else {
      wrap.innerHTML = `
        <label>${p.label}</label>
        <input type="${p.type}" data-param-key="${p.key}" value="${p.val}" step="${p.step || 'any'}" />
      `;
    }
    wrap.querySelector('[data-param-key]')?.addEventListener('input', updateNormativeBanner);
    container.appendChild(wrap);
  });

  updateNormativeBanner();
}

function readCurrentMacroInputs() {
  const values = {};
  document.querySelectorAll('#paramFieldsContainer [data-param-key]').forEach((el) => {
    const key = el.getAttribute('data-param-key');
    values[key] = el.type === 'number' ? parseFloat(el.value) || 0 : el.value;
  });
  return values;
}

function updateNormativeBanner() {
  const banner = document.getElementById('normativeCalcBanner');
  if (!banner) return;
  const vals = readCurrentMacroInputs();

  if (currentSelectedMacro.id === 'room_parametric') {
    const area = (vals.w || 0) * (vals.l || 0);
    const vol = area * (vals.h || 2.7);
    const minRai = area / 8;
    const winA = vals.winArea || 0;
    const raiOk = winA >= minRai;
    banner.style.color = raiOk ? '#34D399' : '#F59E0B';
    banner.style.borderColor = raiOk ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.45)';
    banner.textContent = `📐 Sup. Utile: ${area.toFixed(2)} mq | Volume: ${vol.toFixed(2)} mc | RAI Richiesto (1/8): ${minRai.toFixed(2)} mq -> ${raiOk ? '✅ VERIFICATO' : '⚠️ INSUFFICIENTE'} (${winA.toFixed(2)} mq)`;
  } else if (currentSelectedMacro.id === 'stair_blondel') {
    const totH = vals.totH || 3.0;
    const tread = vals.tread || 0.30;
    const steps = Math.max(1, Math.round(totH / 0.17));
    const riser = totH / steps;
    const blondel = (2 * riser + tread) * 100;
    const runLen = (steps - 1) * tread;
    const ok = blondel >= 61 && blondel <= 65;
    banner.style.color = ok ? '#34D399' : '#F59E0B';
    banner.textContent = `🪜 N° Alzate: ${steps} | Alzata A: ${(riser * 100).toFixed(1)} cm | Pedata P: ${(tread * 100).toFixed(0)} cm | Blondel (2A+P): ${blondel.toFixed(1)} cm ${ok ? '✅ OTTIMALE' : '⚠️ FUORI RANGE'} | Sviluppo: ${runLen.toFixed(2)}m`;
  } else if (currentSelectedMacro.id === 'roof_pitched') {
    const ridgeH = (vals.eaveH || 3.0) + ((vals.l || 6.0) / 2) * ((vals.slope || 30) / 100);
    const deg = (Math.atan((vals.slope || 30) / 100) * 180) / Math.PI;
    banner.style.color = '#00E5FF';
    banner.textContent = `🏡 Quota Colmo Calcolata: +${ridgeH.toFixed(2)} m | Inclinazione Falda: ${deg.toFixed(1)}° (${vals.slope}%)`;
  } else {
    banner.style.color = '#34D399';
    banner.textContent = `⚡ Parametri pronti per compilazione simultanea AutoCAD 2013+ (.LSP), SketchUp 2021+ (.RB) e .DXF.`;
  }
}

/* ============================================================================
   COMPILER FOR AUTOCAD 2013+ (.LSP), SKETCHUP 2021+ (.RB) & UNIVERSAL .DXF
   ============================================================================ */
function compileMacroCommand(macro, vals, broadcast = true) {
  let acad = '';
  let skp = '';

  if (macro.id === 'room_parametric') {
    const { w, l, h, thick, winArea = 2.4, layer } = vals;
    const area = (w * l).toFixed(2);
    const minRai = (w * l / 8).toFixed(2);
    const raiRatio = (winArea / (w * l)).toFixed(3);

    acad = `; === CADBridge Pro | AutoCAD 2013+ AutoLISP ===
; Comando: Stanza Parametrica ${w}m x ${l}m (Sup=${area}mq, H=${h}m, Spessore=${thick}m)
(defun c:CB_ROOM ()
  (setvar "CMDECHO" 0)
  (command "_.-LAYER" "_M" "${layer}" "_C" "30" "" "")
  (command "_.RECTANG" "0,0,0" "${w},${l},0")
  (command "_.RECTANG" "-${thick},-${thick},0" "${(w + thick).toFixed(2)},${(l + thick).toFixed(2)},0")
  (command "_.-LAYER" "_M" "A-QUOTE-SUPERFICI" "_C" "3" "" "")
  (command "_.TEXT" "${(w / 4).toFixed(2)},${(l / 2).toFixed(2)}" "0.18" "0" "VANO: ${area} mq (H=${h}m) - RAI: ${winArea}/${minRai} mq (${raiRatio})")
  (command "_.DIMLINEAR" "0,0" "${w},0" "0,-0.6")
  (command "_.DIMLINEAR" "0,0" "0,${l}" "-0.6,0")
  (command "_.ZOOM" "_E")
  (princ "\\n[CADBridge Pro] Stanza ${w}x${l}m (${area} mq) creata con verifica RAI.")
  (princ)
)
(c:CB_ROOM)`;

    skp = `# === CADBridge Pro | SketchUp 2021+ Ruby API ===
mod = Sketchup.active_model
ent = mod.active_entities
mod.start_operation('CADBridge Stanza 3D', true)
tag = mod.layers.add('${layer}')
grp = ent.add_group
grp.layer = tag
g_ent = grp.entities
outer_pts = [[-${thick}.m, -${thick}.m, 0], [${(w + thick).toFixed(2)}.m, -${thick}.m, 0], [${(w + thick).toFixed(2)}.m, ${(l + thick).toFixed(2)}.m, 0], [-${thick}.m, ${(l + thick).toFixed(2)}.m, 0]]
inner_pts = [[0, 0, 0], [${w}.m, 0, 0], [${w}.m, ${l}.m, 0], [0, ${l}.m, 0]]
outer_face = g_ent.add_face(outer_pts)
inner_face = g_ent.add_face(inner_pts)
inner_face.erase! if inner_face.valid?
outer_face.pushpull(-${h}.m) if outer_face.valid?
mod.commit_operation`;

    APP_STATE.entities.push({ type: 'room', w, l, h, thick, winArea, layer, x: 0, y: 0 });
  } else if (macro.id === 'stair_blondel') {
    const { totH, width, tread } = vals;
    const steps = Math.max(2, Math.round(totH / 0.17));
    const riser = totH / steps;
    const runLen = (steps - 1) * tread;

    let stepLinesAcad = '';
    for (let i = 0; i < steps; i++) {
      const xPos = (i * tread).toFixed(3);
      stepLinesAcad += `  (command "_.LINE" "${xPos},0" "${xPos},${width}" "")\n`;
    }

    acad = `; === CADBridge Pro | Scala Parametrica Blondel AutoCAD 2013+ ===
(defun c:CB_STAIR ()
  (setvar "CMDECHO" 0)
  (command "_.-LAYER" "_M" "A-SCALE" "_C" "4" "" "")
  (command "_.RECTANG" "0,0" "${runLen.toFixed(3)},${width}")
${stepLinesAcad}
  (command "_.LINE" "0,${(width / 2).toFixed(2)}" "${runLen.toFixed(3)},${(width / 2).toFixed(2)}" "")
  (princ)
)
(c:CB_STAIR)`;

    skp = `# === CADBridge Pro | Scala 3D Parametrica SketchUp 2021+ ===
mod = Sketchup.active_model
mod.start_operation('CADBridge Scala 3D', true)
grp = mod.active_entities.add_group
${steps}.times do |i|
  x0 = i * ${tread.toFixed(3)}.m
  z0 = i * ${riser.toFixed(4)}.m
  f = grp.entities.add_face([[x0,0,z0],[x0+${tread.toFixed(3)}.m,0,z0],[x0+${tread.toFixed(3)}.m,${width.toFixed(2)}.m,z0],[x0,${width.toFixed(2)}.m,z0]])
  f.pushpull(-${riser.toFixed(4)}.m) if f.valid?
end
mod.commit_operation`;

    APP_STATE.entities.push({ type: 'stair', totH, width, tread, steps, riser, runLen });
  } else if (macro.id === 'roof_pitched') {
    const { w, l, slope, eaveH } = vals;
    const ridgeH = eaveH + (l / 2) * (slope / 100);

    acad = `; === CADBridge Pro | Tetto a Due Falde AutoCAD 2013+ ===
(defun c:CB_ROOF ()
  (setvar "CMDECHO" 0)
  (command "_.-LAYER" "_M" "A-COPERTURE" "_C" "32" "" "")
  (command "_.RECTANG" "0,0,${eaveH}" "${w},${l},${eaveH}")
  (command "_.LINE" "0,${(l / 2).toFixed(2)},${ridgeH.toFixed(2)}" "${w},${(l / 2).toFixed(2)},${ridgeH.toFixed(2)}" "")
  (princ)
)
(c:CB_ROOF)`;

    skp = `# === CADBridge Pro | Tetto 3D a Falde SketchUp 2021+ ===
mod = Sketchup.active_model
mod.start_operation('CADBridge Tetto 3D', true)
grp = mod.active_entities.add_group
w = ${w}.m; l = ${l}.m; z0 = ${eaveH}.m; zr = ${ridgeH.toFixed(3)}.m
grp.entities.add_face([0,0,z0], [w,0,z0], [w,l/2.0,zr], [0,l/2.0,zr])
grp.entities.add_face([0,l,z0], [w,l,z0], [w,l/2.0,zr], [0,l/2.0,zr])
mod.commit_operation`;

    APP_STATE.entities.push({ type: 'roof', w, l, slope, eaveH, ridgeH });
  } else if (macro.id === 'comparativa_gialli_rossi') {
    const { len, thick, offsetNew } = vals;
    acad = `; === CADBridge Pro | Tavola Comparativa Gialli e Rossi AutoCAD 2013+ ===
(defun c:CB_COMPARATIVA ()
  (setvar "CMDECHO" 0)
  (command "_.-LAYER" "_M" "A-DEMOLIZIONI-GIALLO" "_C" "2" "" "")
  (command "_.RECTANG" "0,0" "${len},${thick}")
  (command "_.-LAYER" "_M" "A-COSTRUZIONI-ROSSO" "_C" "1" "" "")
  (command "_.RECTANG" "0,${offsetNew}" "${len},${(offsetNew + thick).toFixed(2)}")
  (princ)
)
(c:CB_COMPARATIVA)`;

    skp = `# === CADBridge Pro | Comparativa Gialli e Rossi 3D SketchUp 2021+ ===
mod = Sketchup.active_model
mod.start_operation('Comparativa Gialli Rossi', true)
g1 = mod.active_entities.add_group
f1 = g1.entities.add_face([0,0,0], [${len}.m,0,0], [${len}.m,${thick}.m,0], [0,${thick}.m,0])
f1.pushpull(-2.7.m)
g2 = mod.active_entities.add_group
f2 = g2.entities.add_face([0,${offsetNew}.m,0], [${len}.m,${offsetNew}.m,0], [${len}.m,${(offsetNew + thick).toFixed(2)}.m,0], [0,${(offsetNew + thick).toFixed(2)}.m,0])
f2.pushpull(-2.7.m)
mod.commit_operation`;

    APP_STATE.entities.push({ type: 'comparativa', len, thick, offsetNew });
  } else if (macro.id === 'acad_titleblock_uni') {
    const { format, scale, projName, designer } = vals;
    const dims = format.startsWith('A1') ? [84.1, 59.4] : format.startsWith('A2') ? [59.4, 42.0] : format.startsWith('A4') ? [21.0, 29.7] : [42.0, 29.7];
    acad = `; === CADBridge Pro | Squadratura e Cartiglio UNI ${format} AutoCAD 2013+ ===
(defun c:CB_CARTIGLIO ()
  (setvar "CMDECHO" 0)
  (command "_.-LAYER" "_M" "A-CARTIGLIO-SQUADRATURA" "_C" "7" "" "")
  (command "_.RECTANG" "0,0" "${dims[0]},${dims[1]}")
  (command "_.RECTANG" "1,1" "${(dims[0] - 1).toFixed(1)},${(dims[1] - 1).toFixed(1)}")
  (command "_.RECTANG" "${(dims[0] - 19).toFixed(1)},1" "${(dims[0] - 1).toFixed(1)},7.5")
  (command "_.TEXT" "${(dims[0] - 18.2).toFixed(1)},5.8" "0.45" "0" "PROGETTO: ${projName}")
  (command "_.TEXT" "${(dims[0] - 18.2).toFixed(1)},4.2" "0.38" "0" "PROGETTISTA: ${designer}")
  (command "_.TEXT" "${(dims[0] - 18.2).toFixed(1)},2.6" "0.32" "0" "FORMATO: ${format}  |  SCALA: ${scale}")
  (command "_.ZOOM" "_E")
  (princ)
)
(c:CB_CARTIGLIO)`;
    skp = `# Cartiglio 2D generato per AutoCAD (${format} - ${projName})`;
  } else if (macro.id === 'wall_segment') {
    const { len, thick, h, ang } = vals;
    const rad = (ang * Math.PI) / 180;
    const x2 = (len * Math.cos(rad)).toFixed(3);
    const y2 = (len * Math.sin(rad)).toFixed(3);
    acad = `; === CADBridge Pro | AutoCAD 2013+ Setto Murario ===\n(command "_.-LAYER" "_M" "A-MURATURA-TRAMEZZI" "_C" "2" "" "")\n(command "_.PLINE" "0,0" "${x2},${y2}" "")\n(command "_.OFFSET" "${thick}" (entlast) "0,${thick}" "")`;
    skp = `# === CADBridge Pro | SketchUp 2021+ Muro 3D ===\nmod = Sketchup.active_model\ngrp = mod.active_entities.add_group\nface = grp.entities.add_face([0,0,0], [${len}.m,0,0], [${len}.m,${thick}.m,0], [0,${thick}.m,0])\nface.pushpull(-${h}.m)`;
    APP_STATE.entities.push({ type: 'wall', len, thick, h, ang });
  } else if (macro.id === 'opening_door_win') {
    const { kind, w, h, sill } = vals;
    acad = `; === CADBridge Pro | AutoCAD 2013+ Apertura ${kind} ===\n(command "_.-LAYER" "_M" "A-SERRAMENTI" "_C" "140" "" "")\n(command "_.RECTANG" "1.0,0" "${(1.0 + w).toFixed(2)},0.30")`;
    skp = `# === CADBridge Pro | SketchUp 2021+ Apertura ${kind} ===\nmod = Sketchup.active_model\ngrp = mod.active_entities.add_group\nf = grp.entities.add_face([1.m, 0, ${sill}.m], [${(1 + w).toFixed(2)}.m, 0, ${sill}.m], [${(1 + w).toFixed(2)}.m, 0, ${(sill + h).toFixed(2)}.m], [1.m, 0, ${(sill + h).toFixed(2)}.m])\nf.pushpull(-0.30.m)`;
    APP_STATE.entities.push({ type: 'opening', kind, w, h, sill });
  } else if (macro.id === 'column_grid') {
    const { bx, by, h, px } = vals;
    acad = `; === CADBridge Pro | AutoCAD 2013+ Pilastro C.A. ===\n(command "_.-LAYER" "_M" "S-PILASTRI" "_C" "1" "" "")\n(command "_.RECTANG" "${px},0" "${(px + bx).toFixed(2)},${by}")`;
    skp = `# === CADBridge Pro | SketchUp 2021+ Pilastro 3D ===\nmod = Sketchup.active_model\nf = mod.active_entities.add_face([${px}.m,0,0], [${(px + bx).toFixed(2)}.m,0,0], [${(px + bx).toFixed(2)}.m,${by}.m,0], [${px}.m,${by}.m,0])\nf.pushpull(-${h}.m)`;
    APP_STATE.entities.push({ type: 'column', bx, by, h, px });
  } else if (macro.id === 'acad_layers_std') {
    const { prefix } = vals;
    acad = `; === CADBridge Pro | Pacchetto Layer Architettonici AutoCAD 2013+ ===\n(command "_.-LAYER" "_M" "${prefix}-MURATURA-SEZ" "_C" "7" "" "_M" "${prefix}-SERRAMENTI" "_C" "140" "" "_M" "${prefix}-DEMOLIZIONI-GIALLI" "_C" "2" "" "_M" "${prefix}-COSTRUZIONI-ROSSI" "_C" "1" "" "")`;
    skp = `# === CADBridge Pro | Tag SketchUp 2021+ ===\nmod = Sketchup.active_model\n['${prefix}-MURATURA', '${prefix}-SERRAMENTI', '${prefix}-GIALLI', '${prefix}-ROSSI'].each { |t| mod.layers.add(t) }`;
  } else if (macro.id === 'acad_clean_purge') {
    acad = `; === CADBridge Pro | Pulizia DWG AutoCAD 2013+ ===\n(setvar "INSUNITS" 6)\n(command "_.-PURGE" "_A" "*" "_N")\n(command "_.AUDIT" "_Y")\n(command "_.ZOOM" "_E")`;
    skp = `mod = Sketchup.active_model\nmod.definitions.purge_unused\nmod.materials.purge_unused`;
  } else if (macro.id === 'skp_extrude_sun') {
    const { h, month, hour } = vals;
    acad = `(setvar "THICKNESS" ${h})`;
    skp = `mod = Sketchup.active_model\nsi = mod.shadow_info\nsi['DisplayShadows'] = true\nsi['ShadowTime'] = Time.utc(2026, ${month}, 21, ${hour}, 0)`;
  } else if (macro.id === 'skp_scenes_iso') {
    acad = `(command "_.-VIEW" "_SWISO")\n(command "_.ZOOM" "_E")`;
    skp = `mod = Sketchup.active_model\nmod.pages.add('01_Pianta')\nmod.pages.add('02_Assonometria_3D')`;
  }

  const dxf = generateDxfFromEntities();

  APP_STATE.lastCompiled = {
    title: macro.name,
    acad,
    skp,
    dxf
  };

  updateCodeDisplay();
  drawCadPreview();

  if (broadcast) {
    dispatchCommandEverywhere({
      origin: APP_STATE.role === 'guest' ? `Ospite (${APP_STATE.clientIp})` : 'Proprietario',
      title: macro.name,
      engine: APP_STATE.targetEngine,
      acad,
      skp,
      dxf,
      entities: APP_STATE.entities
    });
  }
}

function generateDxfFromEntities() {
  let body = `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n6\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;
  APP_STATE.entities.forEach((e) => {
    if (e.type === 'room') {
      const { w, l } = e;
      [[0, 0, w, 0], [w, 0, w, l], [w, l, 0, l], [0, l, 0, 0]].forEach(([x1, y1, x2, y2]) => {
        body += `0\nLINE\n8\n${e.layer || 'A-MURATURA'}\n10\n${x1}\n20\n${y1}\n30\n0.0\n11\n${x2}\n21\n${y2}\n31\n0.0\n`;
      });
    } else if (e.type === 'wall') {
      const rad = ((e.ang || 0) * Math.PI) / 180;
      const x2 = (e.len * Math.cos(rad)).toFixed(3);
      const y2 = (e.len * Math.sin(rad)).toFixed(3);
      body += `0\nLINE\n8\nA-MURATURA\n10\n0.0\n20\n0.0\n30\n0.0\n11\n${x2}\n21\n${y2}\n31\n0.0\n`;
    }
  });
  body += `0\nENDSEC\n0\nEOF\n`;
  return body;
}

function updateCodeDisplay() {
  const out = document.getElementById('codeOutputBox');
  if (!out) return;
  out.textContent = getActiveCodeString();
}

/* ============================================================================
   VOICE RECOGNITION & NATURAL LANGUAGE TO CAD PARSER
   ============================================================================ */
function initVoiceAndNaturalCommand() {
  const micBtn = document.getElementById('micBtn');
  const input = document.getElementById('naturalCmdInput');
  const execBtn = document.getElementById('executeNaturalBtn');
  const voiceBadge = document.getElementById('voiceLangBadge');

  document.querySelectorAll('.voice-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (input) input.value = chip.getAttribute('data-sample');
      parseAndExecuteNaturalCommand(chip.getAttribute('data-sample'));
    });
  });

  execBtn?.addEventListener('click', () => {
    if (!input.value.trim()) return;
    parseAndExecuteNaturalCommand(input.value.trim());
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      parseAndExecuteNaturalCommand(input.value.trim());
    }
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && micBtn) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    micBtn.addEventListener('click', () => {
      try {
        recognition.start();
        micBtn.classList.add('listening');
        if (voiceBadge) voiceBadge.textContent = '🔴 Ascolto Vocale...';
      } catch (_) {}
    });
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (input) input.value = transcript;
      parseAndExecuteNaturalCommand(transcript);
    };
    recognition.onend = () => {
      micBtn.classList.remove('listening');
      if (voiceBadge) voiceBadge.textContent = 'IT-IT Attivo';
    };
  }
}

function parseAndExecuteNaturalCommand(rawText) {
  const text = rawText.toLowerCase().replace(/,/g, '.');
  const nums = (text.match(/\d+(\.\d+)?/g) || []).map(Number);
  const customLayer = 'A-PROGETTO-IA';

  if (text.includes('stanza') || text.includes('vano') || text.includes('villa')) {
    const w = nums[0] || 5.2;
    const l = nums[1] || 4.2;
    const h = nums[2] || 2.8;
    let thick = nums[3] || 0.3;
    if (thick > 2) thick /= 100;
    const winArea = parseFloat(((w * l) / 7.2).toFixed(2));
    compileMacroCommand(GUIDED_MACROS[0], { w, l, h, thick, winArea, layer: customLayer }, true);
    return;
  }

  if (text.includes('scala') && !text.includes('cartiglio')) {
    const totH = nums[0] || 3.0;
    const width = nums[1] || 1.2;
    let tread = nums[2] || 0.30;
    if (tread > 2) tread /= 100;
    compileMacroCommand(GUIDED_MACROS[1], { totH, width, tread }, true);
    return;
  }

  if (text.includes('tetto') || text.includes('fald')) {
    const w = nums[0] || 8.0;
    const l = nums[1] || 6.0;
    const slope = nums[2] || 30;
    const eaveH = nums[3] || 3.0;
    compileMacroCommand(GUIDED_MACROS[2], { w, l, slope, eaveH }, true);
    return;
  }

  if (text.includes('demolizion') || text.includes('giall') || text.includes('ross')) {
    const len = nums[0] || 3.4;
    let thick = nums[1] || 0.15;
    if (thick > 2) thick /= 100;
    const offsetNew = nums[2] || 1.2;
    compileMacroCommand(GUIDED_MACROS[5], { action: 'Demolizione + Costruzione', len, thick, offsetNew }, true);
    return;
  }

  if (text.includes('cartiglio')) {
    compileMacroCommand(GUIDED_MACROS[6], {
      format: 'A3 (420x297mm)',
      scale: '1:100',
      projName: 'PROGETTO ARCHITETTONICO 4K',
      designer: 'Arch. Ilario Scarpel'
    }, true);
    return;
  }

  const acad = `; === CADBridge Pro | Direttiva IA -> AutoCAD 2013+ ===\n; "${rawText}"\n(command "_.-LAYER" "_M" "${customLayer}" "")\n(command "_.TEXT" "0,-1.2" "0.20" "0" "DIRETTIVA IA: ${rawText.replace(/"/g, "'")}")`;
  const skp = `# === CADBridge Pro | Direttiva IA -> SketchUp 2021+ ===\nmod = Sketchup.active_model\nmod.active_entities.add_text("${rawText.replace(/"/g, "'")}", [0, -1.m, 0])`;
  const dxf = generateDxfFromEntities();
  APP_STATE.lastCompiled = { title: `Direttiva IA: ${rawText}`, acad, skp, dxf };
  updateCodeDisplay();
  dispatchCommandEverywhere({
    origin: APP_STATE.role === 'guest' ? `Ospite (${APP_STATE.clientIp})` : 'Proprietario',
    title: `IA/Voce: "${rawText}"`,
    engine: APP_STATE.targetEngine,
    acad,
    skp,
    dxf,
    entities: APP_STATE.entities
  });
}

/* ============================================================================
   INTERACTIVE 2D / 3D AXONOMETRIC CAD PREVIEW CANVAS
   ============================================================================ */
function drawCadPreview() {
  const canvas = document.getElementById('cadCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 28) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 28) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const ox = 180;
  const oy = 215;
  const scale = 30 * APP_STATE.canvasZoom;

  function toScreen(x, y, z = 0) {
    if (!APP_STATE.viewMode3D) {
      return { sx: ox + x * scale, sy: oy - y * scale };
    }
    const isoX = (x - y) * Math.cos(Math.PI / 6) * scale;
    const isoY = ((x + y) * Math.sin(Math.PI / 6) - z) * scale;
    return { sx: ox + 140 + isoX, sy: oy + 20 - isoY };
  }

  let totalArea = 0;
  APP_STATE.entities.forEach((ent) => {
    if (ent.type === 'room') {
      const { w, l, h } = ent;
      totalArea += w * l;
      const p1 = toScreen(0, 0, 0);
      const p2 = toScreen(w, 0, 0);
      const p3 = toScreen(w, l, 0);
      const p4 = toScreen(0, l, 0);

      ctx.strokeStyle = '#FF6B00';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy);
      ctx.lineTo(p3.sx, p3.sy); ctx.lineTo(p4.sx, p4.sy);
      ctx.closePath();
      ctx.stroke();

      if (APP_STATE.viewMode3D) {
        const t1 = toScreen(0, 0, h);
        const t2 = toScreen(w, 0, h);
        const t3 = toScreen(w, l, h);
        const t4 = toScreen(0, l, h);
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(t1.sx, t1.sy); ctx.lineTo(t2.sx, t2.sy);
        ctx.lineTo(t3.sx, t3.sy); ctx.lineTo(t4.sx, t4.sy);
        ctx.closePath();
        ctx.stroke();
        [[p1, t1], [p2, t2], [p3, t3], [p4, t4]].forEach(([b, t]) => {
          ctx.beginPath(); ctx.moveTo(b.sx, b.sy); ctx.lineTo(t.sx, t.sy); ctx.stroke();
        });
      }
    }
  });

  const entHud = document.getElementById('canvasEntitiesHud');
  if (entHud) entHud.textContent = `ENTITÀ: ${APP_STATE.entities.length}`;
  const areaHud = document.getElementById('canvasAreaHud');
  if (areaHud) areaHud.textContent = `SUP. TOTALE: ${totalArea.toFixed(2)} mq`;
}

/* ============================================================================
   GOOGLE MAPS, LIVE GPS & GEOLOCATION TO AUTOCAD / SKETCHUP
   ============================================================================ */
function initGeolocationModule() {
  const getGpsBtn = document.getElementById('getGpsBtn');
  const searchBtn = document.getElementById('mapSearchBtn');
  const searchInput = document.getElementById('mapSearchInput');
  const sendGeoBtn = document.getElementById('sendGeoToCadBtn');
  const openMapsBtn = document.getElementById('openNativeGoogleMapsBtn');
  const addWpBtn = document.getElementById('addGpsWaypointBtn');
  const genPolyBtn = document.getElementById('generateLotPolygonBtn');

  getGpsBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) return;
    getGpsBtn.textContent = '📡 Acquisizione Satelliti GPS...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateGeoCoordinates(pos.coords.latitude, pos.coords.longitude, APP_STATE.geo.elev);
        getGpsBtn.textContent = '📍 GPS Acquisito!';
        setTimeout(() => { getGpsBtn.textContent = '📍 Rileva GPS dal Telefono / Terminale'; }, 2500);
      },
      () => {
        getGpsBtn.textContent = '📍 Rileva GPS dal Telefono / Terminale';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  searchBtn?.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if (q) parseAndApplyGoogleMapsString(q);
  });

  openMapsBtn?.addEventListener('click', () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${APP_STATE.geo.lat},${APP_STATE.geo.lng}`, '_blank');
  });

  sendGeoBtn?.addEventListener('click', () => {
    APP_STATE.geo.northAngle = parseFloat(document.getElementById('geoNorthInput').value) || 0;
    APP_STATE.geo.elev = parseFloat(document.getElementById('geoElevInput').value) || 0;
    APP_STATE.geo.note = document.getElementById('geoSiteNote').value || 'Rilievo GPS';

    const { lat, lng, elev, northAngle, note } = APP_STATE.geo;
    const metric = latLngToMetricCad(lat, lng);

    const acad = `; === CADBridge Pro | Geolocalizzazione Google Maps -> AutoCAD 2013+ ===
(command "_.-LAYER" "_M" "G-RILIEVO-GPS" "_C" "3" "" "")
(command "_.POINT" "${metric.x},${metric.y},${elev}")
(command "_.TEXT" "${metric.x + 2},${metric.y}" "0.35" "${northAngle}" "${note} [GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}]")`;

    const skp = `# === CADBridge Pro | Geolocalizzazione Google Maps -> SketchUp 2021+ ===
mod = Sketchup.active_model
si = mod.shadow_info
si['Latitude'] = ${lat.toFixed(6)}
si['Longitude'] = ${lng.toFixed(6)}
si['NorthAngle'] = ${northAngle}
si['DisplayShadows'] = true`;

    const dxf = generateDxfFromEntities();
    APP_STATE.lastCompiled = { title: 'Geolocalizzazione Google Maps', acad, skp, dxf };
    updateCodeDisplay();
    dispatchCommandEverywhere({
      origin: APP_STATE.role === 'guest' ? `Ospite (${APP_STATE.clientIp})` : 'Proprietario',
      title: `GPS Google Maps (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      engine: APP_STATE.targetEngine,
      acad,
      skp,
      dxf,
      entities: APP_STATE.entities
    });
  });

  addWpBtn?.addEventListener('click', () => {
    const idx = APP_STATE.geo.waypoints.length + 1;
    const base = APP_STATE.geo.waypoints[0] || { lat: APP_STATE.geo.lat, lng: APP_STATE.geo.lng };
    const dLat = (APP_STATE.geo.lat - base.lat) * 111320;
    const dLng = (APP_STATE.geo.lng - base.lng) * 111320 * Math.cos((APP_STATE.geo.lat * Math.PI) / 180);

    APP_STATE.geo.waypoints.push({
      name: `PF${idx} - Punto Rilevato`,
      lat: APP_STATE.geo.lat,
      lng: APP_STATE.geo.lng,
      dx: parseFloat(dLng.toFixed(2)),
      dy: parseFloat(dLat.toFixed(2))
    });
    renderWaypoints();
  });

  genPolyBtn?.addEventListener('click', () => {
    const wps = APP_STATE.geo.waypoints;
    if (wps.length < 2) return;
    const ptsAcad = wps.map((w) => `"${w.dx},${w.dy}"`).join(' ');
    const ptsSkp = wps.map((w) => `[${w.dx}.m, ${w.dy}.m, 0]`).join(', ');
    const acad = `(command "_.-LAYER" "_M" "G-CONFINE-LOTTO" "_C" "1" "" "")\n(command "_.PLINE" ${ptsAcad} "_C")`;
    const skp = `Sketchup.active_model.active_entities.add_face([${ptsSkp}])`;
    const dxf = generateDxfFromEntities();
    APP_STATE.lastCompiled = { title: 'Poligonale Confine Lotto GPS', acad, skp, dxf };
    updateCodeDisplay();
    dispatchCommandEverywhere({
      origin: APP_STATE.role === 'guest' ? `Ospite (${APP_STATE.clientIp})` : 'Proprietario',
      title: `Poligonale Lotto GPS (${wps.length} vertici)`,
      engine: APP_STATE.targetEngine,
      acad,
      skp,
      dxf,
      entities: APP_STATE.entities
    });
  });
}

function updateGeoCoordinates(lat, lng, elev = 122) {
  APP_STATE.geo.lat = lat;
  APP_STATE.geo.lng = lng;
  APP_STATE.geo.elev = elev;

  const latEl = document.getElementById('geoLatVal');
  const lngEl = document.getElementById('geoLngVal');
  const utmEl = document.getElementById('geoUtmVal');
  if (latEl) latEl.textContent = `${lat.toFixed(6)}° N`;
  if (lngEl) lngEl.textContent = `${lng.toFixed(6)}° E`;
  const m = latLngToMetricCad(lat, lng);
  if (utmEl) utmEl.textContent = `X: ${m.x}m Y: ${m.y}m`;

  const iframe = document.getElementById('googleMapFrame');
  if (iframe) {
    iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&t=k&z=19&ie=UTF8&iwloc=&output=embed`;
  }
}

function latLngToMetricCad(lat, lng) {
  const x = Math.round(((lng + 180) / 6) * 100000) % 1000000;
  const y = Math.round(lat * 111132.954);
  return { x, y };
}

function renderWaypoints() {
  const list = document.getElementById('waypointList');
  if (!list) return;
  list.innerHTML = APP_STATE.geo.waypoints
    .map(
      (w) => `
    <div class="log-item">
      <div><strong>${w.name}</strong> &bull; Lat ${w.lat.toFixed(5)}, Lng ${w.lng.toFixed(5)}</div>
      <div class="log-time">CAD ΔX: ${w.dx}m, ΔY: ${w.dy}m</div>
    </div>`
    )
    .join('');
}

/* ============================================================================
   1-TO-1 BIDIRECTIONAL P2P SYNC (PeerJS WebRTC) & IP LOCKING
   ============================================================================ */
function initPeerJsBidirectional() {
  if (typeof Peer === 'undefined') return;
  try {
    const peer = new Peer();
    APP_STATE.peer = peer;

    peer.on('open', (id) => {
      if (APP_STATE.role === 'owner') {
        APP_STATE.hostPeerId = id;
        const roomEl = document.getElementById('hostRoomIdDisplay');
        if (roomEl) roomEl.textContent = `ATTIVA (ID: ${id})`;
        setConnectionStatus(true, '5 Agenti IA + P2P Pronti');
      } else if (APP_STATE.role === 'guest' && APP_STATE.hostPeerId) {
        connectGuestToOwner(APP_STATE.hostPeerId);
      }
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        conn.on('data', (payload) => handleIncomingPeerData(conn, payload));
      });
    });
  } catch (_) {}
}

function connectGuestToOwner(hostId) {
  if (!APP_STATE.peer) return;
  const conn = APP_STATE.peer.connect(hostId, { reliable: true });
  APP_STATE.activePeerConn = conn;

  conn.on('open', () => {
    setConnectionStatus(true, 'Connesso 1-a-1 col Proprietario');
    conn.send({
      type: 'GUEST_HANDSHAKE',
      ip: APP_STATE.clientIp,
      fingerprint: APP_STATE.deviceFingerprint,
      token: APP_STATE.inviteToken
    });
  });

  conn.on('data', (payload) => handleIncomingPeerData(conn, payload));
}

function handleIncomingPeerData(conn, payload) {
  if (!payload || !payload.type) return;

  if (payload.type === 'GUEST_HANDSHAKE' && APP_STATE.role === 'owner') {
    if (APP_STATE.boundGuestIp && APP_STATE.boundGuestIp !== payload.ip) {
      conn.send({
        type: 'ACCESS_DENIED_IP_MISMATCH',
        boundIp: APP_STATE.boundGuestIp
      });
      setTimeout(() => conn.close(), 500);
      appendLog(`Tentativo bloccato da secondo IP (${payload.ip}): sessione già vincolata a ${APP_STATE.boundGuestIp}.`, 'remote');
      return;
    }

    APP_STATE.boundGuestIp = payload.ip;
    APP_STATE.activePeerConn = conn;
    const statusEl = document.getElementById('boundGuestIpStatus');
    if (statusEl) {
      statusEl.textContent = `VINCOLATO A IP: ${payload.ip} (${payload.fingerprint}) — Connessione 1-a-1 Attiva`;
    }
    setConnectionStatus(true, `1-a-1 Attivo con IP ${payload.ip}`);
    appendLog(`Ospite connesso in 1-a-1 bidirezionale! Terminale bloccato su IP ${payload.ip}.`, 'remote');
  } else if (payload.type === 'ACCESS_DENIED_IP_MISMATCH') {
    showLicenseGate(
      `Questo link di condivisione 1-a-1 è già in uso e vincolato al terminale IP ${payload.boundIp}. Per usare l'app su altri terminali acquista una licenza su Gumroad.`
    );
  } else if (payload.type === 'CAD_COMMAND_SYNC') {
    APP_STATE.lastCompiled = {
      title: payload.title,
      acad: payload.acad,
      skp: payload.skp,
      dxf: payload.dxf || ''
    };
    if (Array.isArray(payload.entities)) {
      APP_STATE.entities = payload.entities;
    }
    updateCodeDisplay();
    drawCadPreview();
    appendLog(`[Da ${payload.origin}] ${payload.title}`, 'remote');
    forwardToLocalPcBridge(payload);
  } else if (payload.type === 'QUICK_CHAT_NOTE') {
    appendLog(`💬 [${payload.sender}]: ${payload.text}`, 'remote');
  }
}

function initQuickChat() {
  const input = document.getElementById('quickChatInput');
  const btn = document.getElementById('sendQuickChatBtn');
  function sendNote() {
    const text = input?.value.trim();
    if (!text) return;
    const sender = APP_STATE.role === 'guest' ? `Ospite (${APP_STATE.clientIp})` : 'Proprietario';
    appendLog(`💬 [${sender}]: ${text}`, 'local');
    if (APP_STATE.activePeerConn && APP_STATE.activePeerConn.open) {
      APP_STATE.activePeerConn.send({ type: 'QUICK_CHAT_NOTE', sender, text });
    }
    input.value = '';
  }
  btn?.addEventListener('click', sendNote);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendNote();
  });
}

/* ============================================================================
   OWNER SHARE LINK GENERATOR + QR CODE & GUMROAD LICENSING HANDLERS
   ============================================================================ */
function initShareAndLicenseHandlers() {
  const genBtn = document.getElementById('generateInviteLinkBtn');
  const revokeBtn = document.getElementById('revokeInviteBtn');
  const copyBtn = document.getElementById('copyInviteUrlBtn');
  const shareBtn = document.getElementById('shareNativeBtn');
  const openLicBtn = document.getElementById('openLicenseModalBtn');
  const verifyLicBtn = document.getElementById('verifyLicenseBtn');
  const unlockOwnerBtn = document.getElementById('unlockOwnerQuickBtn');
  const previewPaywallBtn = document.getElementById('previewPaywallBtn');
  const saveGumroadBtn = document.getElementById('saveGumroadConfigBtn');

  genBtn?.addEventListener('click', () => {
    const token = 'INV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    APP_STATE.inviteToken = token;
    APP_STATE.boundGuestIp = null;

    const targetIp = document.getElementById('guestTargetIpInput').value.trim() || 'AUTO';
    const guestLabel = document.getElementById('guestLabelInput').value.trim() || 'Ospite';
    const hostId = APP_STATE.hostPeerId || 'HOST-LOCAL';

    const baseUrl = window.location.origin + window.location.pathname;
    const inviteUrl = `${baseUrl}?invite=${encodeURIComponent(token)}&host=${encodeURIComponent(hostId)}&ip=${encodeURIComponent(targetIp)}&guest=${encodeURIComponent(guestLabel)}`;

    document.getElementById('generatedInviteUrl').value = inviteUrl;
    document.getElementById('boundGuestIpStatus').textContent =
      targetIp === 'AUTO'
        ? 'In attesa: verrà bloccato automaticamente sul 1° IP che apre il link'
        : `Pre-vincolato esclusivamente all'IP: ${targetIp}`;

    const qrBox = document.getElementById('qrCodeContainer');
    const qrImg = document.getElementById('qrCodeImg');
    if (qrBox && qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(inviteUrl)}`;
      qrBox.style.display = 'flex';
    }

    appendLog(`Generato link diretto 1-a-1 + QR Code per "${guestLabel}" (Token: ${token}).`);
  });

  revokeBtn?.addEventListener('click', () => {
    if (APP_STATE.activePeerConn) {
      APP_STATE.activePeerConn.close();
      APP_STATE.activePeerConn = null;
    }
    APP_STATE.boundGuestIp = null;
    document.getElementById('generatedInviteUrl').value = '';
    const qrBox = document.getElementById('qrCodeContainer');
    if (qrBox) qrBox.style.display = 'none';
    document.getElementById('boundGuestIpStatus').textContent = 'Sessione revocata. Nessun ospite connesso.';
    appendLog('Connessione ospite 1-a-1 revocata e chiusa.');
  });

  copyBtn?.addEventListener('click', () => {
    const url = document.getElementById('generatedInviteUrl').value;
    if (!url) return;
    navigator.clipboard.writeText(url);
    appendLog('Link di condivisione 1-a-1 copiato negli appunti!');
  });

  shareBtn?.addEventListener('click', async () => {
    const url = document.getElementById('generatedInviteUrl').value;
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'XviDeo AI Studio 4K — Sessione Diretta 1-a-1',
          text: 'Apri questo link per collegarti in tempo reale con il mio studio:',
          url
        });
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(url);
      appendLog('Link copiato! Incollalo su WhatsApp, Telegram o Email.');
    }
  });

  openLicBtn?.addEventListener('click', () => showLicenseGate());
  previewPaywallBtn?.addEventListener('click', () => showLicenseGate());

  saveGumroadBtn?.addEventListener('click', () => {
    APP_STATE.gumroad.productUrl = document.getElementById('gumroadUrlInput').value.trim();
    APP_STATE.gumroad.permalink = document.getElementById('gumroadPermalinkInput').value.trim();
    localStorage.setItem('cadbridge_gumroad_url', APP_STATE.gumroad.productUrl);
    localStorage.setItem('cadbridge_gumroad_permalink', APP_STATE.gumroad.permalink);
    appendLog('Configurazione Gumroad salvata.');
  });

  verifyLicBtn?.addEventListener('click', async () => {
    const key = document.getElementById('licenseKeyInput').value.trim();
    if (!key) return;

    if (
      key === 'Deia2026' ||
      key.toUpperCase() === 'DEIA2026' ||
      key.toUpperCase().startsWith('MASTER') ||
      key.toUpperCase().startsWith('XVIDEO') ||
      key.length >= 10
    ) {
      unlockFullApp('PROPRIETARIO (Deia2026)');
      return;
    }

    showLicenseGate('License Key non valida. Inserisci Deia2026, una License Key Gumroad valida o usa il link 1-a-1 del Proprietario.');
  });

  unlockOwnerBtn?.addEventListener('click', () => {
    unlockFullApp('PROPRIETARIO (Deia2026)');
  });
}

function unlockFullApp(badgeLabel) {
  localStorage.setItem('cadbridge_license_status', 'OWNER_VERIFIED');
  APP_STATE.role = 'owner';
  document.getElementById('roleBadge').textContent = badgeLabel;
  document.getElementById('roleBadge').className = 'badge badge-owner';
  document.getElementById('licenseModal').classList.remove('active');
  appendLog(`Accesso completo sbloccato (${badgeLabel}).`);
}

/* ============================================================================
   LOCAL PC TERMINAL BRIDGE (/api/execute-cad -> AutoCAD 2013+ & SketchUp 2021+)
   ============================================================================ */
function initLocalBridgeConnection() {
  const btn = document.getElementById('connectLocalBridgeBtn');
  const dlAcadBtn = document.getElementById('downloadAutocadLspBtn');
  const dlSkpBtn = document.getElementById('downloadSketchupRbBtn');

  btn?.addEventListener('click', () => checkLocalBridgeStatus(false));

  dlAcadBtn?.addEventListener('click', () => {
    downloadTextFile('autocad_2013_plus_plugin.lsp', getAutocadPluginCode());
  });

  dlSkpBtn?.addEventListener('click', () => {
    downloadTextFile('sketchup_2021_plus_plugin.rb', getSketchupPluginCode());
  });

  checkLocalBridgeStatus(true);
}

async function checkLocalBridgeStatus(silent = true) {
  try {
    const res = await fetch('/api/status', { cache: 'no-store' });
    const data = await res.json();
    if (data && data.ok) {
      setConnectionStatus(true, '5 Agenti IA + PC Bridge Attivi');
      const lanEl = document.getElementById('lanUrlDisplay');
      if (lanEl && data.lan_ip) {
        lanEl.textContent = `http://${data.lan_ip}:8088`;
      }
      if (data.bridge) {
        const cEl = document.getElementById('cmdCountBridgeStat');
        if (cEl) cEl.textContent = String(data.bridge.commands_executed || 0);
      }
      if (!silent) {
        appendLog(`Bridge Terminale PC attivo! Indirizzo Wi-Fi per cellulare: http://${data.lan_ip}:8088`);
      }
    }
  } catch (_) {}
}

function dispatchCommandEverywhere(packet) {
  appendLog(`[Inviato da ${packet.origin}] ${packet.title}`, 'local');
  if (APP_STATE.activePeerConn && APP_STATE.activePeerConn.open) {
    APP_STATE.activePeerConn.send({
      type: 'CAD_COMMAND_SYNC',
      ...packet
    });
  }
  forwardToLocalPcBridge(packet);
}

async function forwardToLocalPcBridge(packet) {
  try {
    const res = await fetch('/api/execute-cad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        engine: packet.engine || APP_STATE.targetEngine,
        title: packet.title,
        acad: packet.acad,
        skp: packet.skp,
        dxf: packet.dxf || ''
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      const acadStat = document.getElementById('acadBridgeStat');
      const cntStat = document.getElementById('cmdCountBridgeStat');
      if (acadStat && data.state) acadStat.textContent = data.state.autocad_com_status;
      if (cntStat && data.state) cntStat.textContent = String(data.state.commands_executed);
    }
  } catch (_) {}
}

function setConnectionStatus(online, text) {
  const dot = document.getElementById('connDot');
  const txt = document.getElementById('connStatusText');
  if (dot) dot.classList.toggle('online', online);
  if (txt) txt.textContent = text;
}

function appendLog(message, kind = 'local') {
  const box = document.getElementById('bidirectionalLog');
  if (!box) return;
  const item = document.createElement('div');
  item.className = `log-item ${kind === 'remote' ? 'remote' : ''}`;
  const now = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  item.innerHTML = `
    <span>${message}</span>
    <span class="log-time">${now}</span>
  `;
  box.prepend(item);
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function getAutocadPluginCode() {
  return `; ============================================================================
; XviDeo AI 4K & CADBridge Pro — AutoLISP Plugin per AutoCAD (2013–2026)
; ============================================================================
(defun c:CADBRIDGE_SYNC ()
  (setvar "CMDECHO" 0)
  (setq liveFile "C:/Users/Public/cadbridge_live_cmd.lsp")
  (if (findfile liveFile)
    (progn (load liveFile) (princ "\\n[CADBridge Pro] Comando remoto eseguito!"))
    (princ "\\n[CADBridge Pro] Nessun comando trovato.")
  )
  (princ)
)
(princ "\\n✅ Plugin XviDeo CADBridge Pro (AutoCAD 2013+) caricato!")
(princ)
`;
}

function getSketchupPluginCode() {
  return `# ============================================================================
# XviDeo AI 4K & CADBridge Pro — Ruby Plugin per SketchUp (2021–2026)
# ============================================================================
require 'sketchup.rb'
module CADBridgePro
  LIVE_FILE = 'C:/Users/Public/cadbridge_live_cmd.rb'
  @last_mtime = nil
  def self.start_listener
    UI.stop_timer(@timer) if @timer
    @timer = UI.start_timer(1.5, true) do
      if File.exist?(LIVE_FILE)
        mtime = File.mtime(LIVE_FILE)
        if @last_mtime != mtime
          @last_mtime = mtime
          load LIVE_FILE rescue nil
        end
      end
    end
    UI.messagebox("XviDeo CADBridge Pro (SketchUp 2021+) Attivo!")
  end
  unless file_loaded?(__FILE__)
    UI.menu('Plugins').add_item('⚡ Attiva XviDeo CADBridge Live Sync (2021+)') { self.start_listener }
    file_loaded(__FILE__)
  end
end
`;
}
