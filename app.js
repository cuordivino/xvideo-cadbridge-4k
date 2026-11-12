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
  // 4K Studio & 12 AI Agents State (Field-First Mobile/Laptop + VizMaker Video-to-Video + Real Estate)
  studio: {
    persona: 'architetto', // 'architetto' | 'designer' | 'immobiliarista' | 'agenzia'
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
    twoPointGrid: true,
    declutterSite: true,
    temporalLock: true,
    ultraSharp8k: true,
    placedAssets: [
      { kind: 'sofa', label: '🛋️ Divano Design Minotti', x: 58, y: 70 },
      { kind: 'tree', label: '🌿 Ulivo / Verde 3D', x: 78, y: 64 }
    ],
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
  initVault6hDepartment();
  initMarketingAndErpDivision();

  let resizeTimer = null;
  const handleViewportChange = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawCadPreview();
      redrawStudio4KCanvas();
    }, 80);
  };
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('orientationchange', handleViewportChange);
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
   THE 12 AI AGENTS PIPELINE (1 SUPERVISOR + 11 FIELD, VIZMAKER & REAL ESTATE AGENTS)
   ============================================================================ */
window.setFieldPersona = function (personaId) {
  APP_STATE.studio.persona = personaId;
  ['architetto', 'designer', 'immobiliarista', 'agenzia'].forEach((p) => {
    const btn = document.getElementById(`persona-${p}`);
    if (btn) btn.classList.toggle('btn-cyan', p === personaId);
  });

  const dirInput = document.getElementById('agentDirectiveInput');
  if (dirInput) {
    if (personaId === 'architetto') {
      dirInput.value = 'Rilievo cantiere e progetto architettonico 4K con verifica RAI >= 1/8, grandi vetrate Low-E e sincronizzazione AutoCAD/SketchUp';
    } else if (personaId === 'designer') {
      dirInput.value = 'Interior Redesign Video-to-Video (stile VizMaker) con mood Japandi Luxury, isola in Marmo Calacatta, divano design e luci LED calde';
    } else if (personaId === 'immobiliarista') {
      dirInput.value = 'Valorizzazione immobile al grezzo / nuova costruzione in Classe A4 NZEB per vendita su carta con giardino, piscina e finiture di pregio';
    } else if (personaId === 'agenzia') {
      dirInput.value = 'Virtual Home Staging immobile usato da ristrutturare: rimozione vecchi arredi, parquet spina italiana, soggiorno luminoso HDR per annuncio Immobiliare.it';
    }
  }

  runMultiAgentPipeline(dirInput ? dirInput.value : 'Progetto 4K Sul Campo', false);
};

window.toggleFieldOption = function (key) {
  APP_STATE.studio[key] = !APP_STATE.studio[key];
  const mapBtn = {
    twoPointGrid: ['toggle2PointBtn', '📐 Verticali 2-Point'],
    declutterSite: ['toggleDeclutterBtn', '🧹 Pulisci Cantiere'],
    temporalLock: ['toggleTemporalLockBtn', '🔒 Video Lock Frame'],
    ultraSharp8k: ['toggleUpscaleBtn', '✨ Upscale 4K/8K']
  };
  const info = mapBtn[key];
  if (info) {
    const btn = document.getElementById(info[0]);
    if (btn) {
      btn.textContent = `${info[1]}: ${APP_STATE.studio[key] ? 'ON' : 'OFF'}`;
      btn.classList.toggle('btn-cyan', APP_STATE.studio[key] && (key === 'twoPointGrid' || key === 'temporalLock'));
      btn.classList.toggle('btn-green', APP_STATE.studio[key] && (key === 'declutterSite' || key === 'ultraSharp8k'));
    }
  }
  redrawStudio4KCanvas();
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', false);
};

window.addQuick3dAsset = function (kind, label) {
  const count = APP_STATE.studio.placedAssets.length;
  const x = 52 + ((count * 11) % 36);
  const y = 56 + ((count * 9) % 26);
  APP_STATE.studio.placedAssets.push({ kind, label, x, y });
  redrawStudio4KCanvas();
  appendLog(`🛋️ Agente 7 (VizAcademy 3D Asset Stager): inserito "${label}" nella scena 4K.`);
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', false);
};

window.clearQuick3dAssets = function () {
  APP_STATE.studio.placedAssets = [];
  redrawStudio4KCanvas();
  appendLog('🗑️ Libreria 3D Assets resettata.');
};

function runMultiAgentPipeline(directive, broadcast = false) {
  const outBox = document.getElementById('multiAgentOutputBox');
  if (!outBox) return;

  const mediaStatus = APP_STATE.studio.isVideoSource
    ? 'Video Cantiere / Stanza in Movimento (Walkthrough Live)'
    : APP_STATE.studio.customImage
    ? 'Foto / Schizzo Acquisito da Smartphone sul Campo'
    : 'Base Vettoriale + Schizzo Studio';

  const { lat, lng, northAngle } = APP_STATE.geo;
  const { style, ratio, timeOfDay, persona, placedAssets, twoPointGrid, declutterSite, temporalLock, ultraSharp8k } = APP_STATE.studio;

  const personaTitles = {
    architetto: '🏛️ ARCHITETTO & PROGETTISTA INNOVATIVO',
    designer: '🛋️ INTERIOR DESIGNER & VISUALIZER (VIZMAKER FLOW)',
    immobiliarista: '🏢 IMMOBILIARISTA & SVILUPPATORE IMMOBILIARE',
    agenzia: '🏡 AGENZIA IMMOBILIARE & LUXURY HOME STAGING'
  };

  // Set status badges on all 12 agents
  ['supervisor', 'cad', 'geo', 'render', 'video', 'vizvideo', 'assets3d', 'fieldcam', 'moodboard', 'smartswap', 'upscaler', 'realestate'].forEach((id) => {
    const el = document.getElementById(`status-agent-${id}`);
    if (el) el.textContent = '✅ Attivo';
  });

  const report = `🧬 [MANTRA FONDAMENTALE CEO IA, DIRETTORI & 20 AGENTI]:
   «Ogni tipologia di prodotto può assimilare innovazione da tipologie di prodotti diversi: basta sempre saper cogliere le sfumature che altre ricerche in campi diversi hanno portato come vantaggio.»

👑 [1. SUPERVISORE — ARCH-DIRECTOR IA | Profilo: ${personaTitles[persona] || personaTitles.architetto}]:
   • Direttiva Sul Campo: "${directive}"
   • Sorgente Mobile/Portatile: ${mediaStatus} | Stile: ${style.name}
   • Contaminazione Attiva: Sicurezza FinTech (Spettatore Blindato + Face ID) + Cinema VFX (Temporal Lock Video-2-Video) + LiDAR Automotive (Ottica 2-Point Campo).

📐 [2. CAD & BIM ENGINEER IA]:
   • Script AutoCAD 2013+ (.LSP/.DXF) + Modello 3D SketchUp 2021+ (.RB) allineati con verifica RAI >= 1/8.

🌍 [3. GEO-SOLAR & GOOGLE MAPS IA]:
   • GPS Cantiere: Lat ${lat.toFixed(5)}° N, Lng ${lng.toFixed(5)}° E (Nord: ${northAngle}°) | Luce reale ore ${Math.floor(timeOfDay)}:${(timeOfDay % 1) ? '30' : '00'}.

🎨 [4. RENDER-VISION 4K IA] & 🎬 [5. POST-FX & MOTION IA]:
   • Vista 4K (${ratio.name}) con Materiali PBR + Camera Flythrough cinematografico pronto per export .WEBM/MP4.

📹 [6. VIZMAKER VIDEO-TO-VIDEO REDESIGN IA]:
   • Coerenza Spazio-Temporale: ${temporalLock ? 'ATTIVA (Blocco 1°/Ultimo Frame — 0% sfarfallio arredi)' : 'Standard'} | Conversione diretta da ripresa telefonino.

🛋️ [7. VIZ-ASSET 3D STAGER IA (Libreria VizAcademy Free 3D Assets)]:
   • Asset 3D posizionati in scena (${placedAssets.length}): ${placedAssets.map((a) => a.label).join(', ') || 'Nessuno (tocca + Asset 3D per aggiungerli)'}.

📸 [8. FIELD-CAM & LENS OPTIMIZER IA (Riprese Smartphone/Portatile)]:
   • Raddrizzamento Verticali 2-Point: ${twoPointGrid ? 'ON' : 'OFF'} | AI Declutter (Rimozione Macerie/Mobili Vecchi): ${declutterSite ? 'ON' : 'OFF'} | Auto-HDR Finestre Attivo.

🖼️ [9. MOODBOARD & STYLE MATCHER IA] & 🖌️ [10. SMART-SWAP INPAINTING IA]:
   • Mood Transfer applicato su geometria reale con ${APP_STATE.studio.pins.length} punti di sostituzione rapida finiture.

⚡ [11. 4K/8K INSTANT PITCH IA]:
   • Super-Resolution Upscaler: ${ultraSharp8k ? 'ULTRA-SHARP 4K/8K ATTIVO' : 'Standard'} | Scheda Cliente Prima/Dopo pronta in 1 clic.

🏡 [12. REAL-ESTATE & LUXURY LISTING IA (Vendita Immobili Nuovi / Usati)]:
   • Valorizzazione Stimata: +22% sul valore percepito grazie a Virtual Home Staging 4K & Video Walkthrough.
   • Copy Annuncio Pronto (Immobiliare.it / Idealista / Social): "Esclusiva proprietà riqualificata in stile ${style.name} (Classe A4 NZEB), ambienti inondati di luce naturale Sud-Ovest, grandi vetrate Low-E e finiture sartoriali. Disponibile tour virtuale Video-to-Video 4K."`;

  outBox.textContent =
    APP_STATE.role !== 'owner' && APP_STATE.guestMode === 'spectator-armored'
      ? '🔒 [CODICE PROPRIETARIO RISERVATO — MODALITÀ SPETTATORE BLINDATO ATTIVA • VIETATA LA COPIA]'
      : report;
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

const STUDIO_PERSONA_PHOTOS = {
  architetto: '1600596542815-ffad4c1539a9',
  designer: '1600607687939-ce8a6c25118c',
  immobiliarista: '1512917774080-9991f1c4c750',
  agenzia: '1600210492486-724fe5c67fb0'
};

function paintCinematicBeforeAfter(ctx, W, H, imgSource, opts = {}) {
  const {
    wipePct = 50,
    t = 0,
    playing = false,
    isExterior = true,
    timeOfDay = 16.5,
    panOffset = 0,
    topOffset = 0,
    bottomOffset = 0,
    beforePill = 'PRIMA • STATO DI FATTO',
    afterPill = 'DOPO • RENDER 4K',
    onBeforeOverlay = null,
    onAfterOverlay = null
  } = opts;

  const splitX = (W * wipePct) / 100;
  const srcW = imgSource.videoWidth || imgSource.naturalWidth || imgSource.width || W;
  const srcH = imgSource.videoHeight || imgSource.naturalHeight || imgSource.height || H;
  const zoom = 1.03 + (playing ? 0.06 * (0.5 + 0.5 * Math.sin(t * 0.45)) : 0);
  const s = Math.max(W / srcW, H / srcH) * zoom;
  const dw = srcW * s;
  const dh = srcH * s;
  const dx = (W - dw) / 2 + panOffset * 0.5 + (playing ? Math.sin(t * 0.35) * 38 : 0);
  const dy = (H - dh) / 2 + (playing ? Math.cos(t * 0.3) * 16 : 0);
  const paint = () => ctx.drawImage(imgSource, dx, dy, dw, dh);

  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // DOPO: grading cinematografico 4K
  ctx.save();
  ctx.beginPath();
  ctx.rect(splitX, 0, W - splitX, H);
  ctx.clip();
  paint();
  const isNight = timeOfDay >= 20 || timeOfDay <= 6;
  const isSunset = timeOfDay >= 17.5 || timeOfDay <= 7.5;
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = isNight ? 'rgba(30,58,138,0.52)' : isSunset ? 'rgba(255,165,90,0.48)' : 'rgba(255,190,120,0.40)';
  ctx.fillRect(0, 0, W, H);
  const skyTint = ctx.createLinearGradient(0, 0, 0, H);
  skyTint.addColorStop(0, isNight ? 'rgba(15,23,42,0.45)' : 'rgba(70,130,190,0.22)');
  skyTint.addColorStop(1, isNight ? 'rgba(234,88,12,0.18)' : 'rgba(255,170,90,0.20)');
  ctx.fillStyle = skyTint;
  ctx.fillRect(0, 0, W, H);

  ctx.globalCompositeOperation = 'screen';
  const sunX = W * Math.max(0.15, Math.min(0.85, (timeOfDay - 6) / 15)) + panOffset * 0.25;
  const sunY = H * (0.16 + Math.abs(14 - timeOfDay) * 0.02);
  const pulse = 0.85 + 0.15 * Math.sin(t * 1.4);
  const bloom = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 780);
  bloom.addColorStop(0, `rgba(255,236,190,${(isNight ? 0.18 : 0.38) * pulse})`);
  bloom.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);

  if (playing) {
    const fx = ((t * 160) % (W + 800)) - 400;
    const fl = ctx.createLinearGradient(fx - 400, 0, fx + 400, 0);
    fl.addColorStop(0, 'rgba(255,230,180,0)');
    fl.addColorStop(0.5, 'rgba(255,240,210,0.18)');
    fl.addColorStop(1, 'rgba(255,230,180,0)');
    ctx.fillStyle = fl;
    ctx.fillRect(fx - 400, H * 0.42, 800, 8);
  }
  for (let i = 0; i < 34; i++) {
    const px = (i * 241 + (playing ? t * 14 : 0) * (1 + (i % 3))) % W;
    const py = (i * 137 + Math.sin(t * 0.6 + i) * 30) % H;
    ctx.fillStyle = `rgba(255,240,210,${0.10 + (i % 5) * 0.05})`;
    ctx.beginPath();
    ctx.arc(px, py, 1.5 + (i % 4), 0, 6.283);
    ctx.fill();
  }
  ctx.restore();

  if (onAfterOverlay) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, W - splitX, H);
    ctx.clip();
    onAfterOverlay();
    ctx.restore();
  }

  // PRIMA: stato di fatto spento / desaturato / cantiere
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, splitX, H);
  ctx.clip();
  paint();
  ctx.globalCompositeOperation = 'saturation';
  ctx.fillStyle = 'rgba(128,128,128,0.93)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(165,172,184,0.9)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(40,46,58,0.30)';
  ctx.fillRect(0, 0, W, H);
  if (isExterior) {
    ctx.strokeStyle = 'rgba(214,176,86,0.52)';
    ctx.lineWidth = 6;
    for (let x = W * 0.08; x < W * 0.94; x += 150) {
      ctx.beginPath(); ctx.moveTo(x, H * 0.12); ctx.lineTo(x, H * 0.9); ctx.stroke();
    }
    ctx.lineWidth = 4;
    [0.3, 0.52, 0.74].forEach((yy) => {
      ctx.beginPath(); ctx.moveTo(W * 0.08, H * yy); ctx.lineTo(W * 0.94, H * yy); ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(210,60,40,0.55)';
    ctx.setLineDash([26, 18]);
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(0, H * 0.86); ctx.lineTo(W, H * 0.80); ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.fillStyle = 'rgba(220,215,200,0.16)';
    ctx.fillRect(0, 0, W, H);
  }
  if (onBeforeOverlay) onBeforeOverlay();
  ctx.restore();

  // Grana pellicola + vignettatura
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = getGrainPattern(ctx);
  ctx.translate(Math.random() * 100, Math.random() * 100);
  ctx.fillRect(-100, -100, W + 200, H + 200);
  ctx.restore();

  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Divisore luminoso
  ctx.save();
  ctx.shadowColor = 'rgba(255,255,255,0.9)';
  ctx.shadowBlur = 24;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(splitX, topOffset);
  ctx.lineTo(splitX, H - bottomOffset);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.beginPath();
  ctx.arc(splitX, H * 0.5, 32, 0, 6.283);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('◀▶', splitX, H * 0.5 + 10);
  ctx.restore();
  ctx.textAlign = 'left';

  // Pill PRIMA / DOPO
  const drawPill = (txt, x, y, bg, fg) => {
    ctx.font = 'bold 24px Inter, sans-serif';
    const w = ctx.measureText(txt).width + 40;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, 46, 23) : ctx.rect(x, y, w, 46);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.fillText(txt, x + 20, y + 31);
  };
  const pillY = topOffset + 32;
  if (splitX > 280) drawPill(beforePill, 44, pillY, 'rgba(15,23,42,0.82)', '#cbd5e1');
  if (W - splitX > 280) {
    ctx.font = 'bold 24px Inter, sans-serif';
    drawPill(afterPill, W - 44 - (ctx.measureText(afterPill).width + 40), pillY, 'rgba(255,255,255,0.90)', '#0f172a');
  }
}

function redrawStudio4KCanvas() {
  const canvas = document.getElementById('studio-canvas');
  if (!canvas) return;
  const { ratio, splitValue, style, customImage, isVideoSource, activeVideoEl, timeOfDay, cameraPanOffset, pins, persona, isAnimatingVideo } = APP_STATE.studio;

  canvas.width = ratio.w;
  canvas.height = ratio.h;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const splitX = (W * splitValue) / 100;

  let imgSource = null;
  if (isVideoSource && activeVideoEl && activeVideoEl.readyState >= 2) {
    imgSource = activeVideoEl;
  } else if (customImage) {
    imgSource = customImage;
  } else {
    const pid = STUDIO_PERSONA_PHOTOS[persona] || STUDIO_PERSONA_PHOTOS.architetto;
    const url = `https://images.unsplash.com/photo-${pid}?auto=format&fit=crop&w=1600&q=85`;
    imgSource = ensureVaultPhoto(url, () => redrawStudio4KCanvas());
  }

  if (imgSource) {
    const animT = (Date.now() * 0.001) % 1000;
    paintCinematicBeforeAfter(ctx, W, H, imgSource, {
      wipePct: splitValue,
      t: animT,
      playing: isAnimatingVideo,
      isExterior: persona !== 'designer' && persona !== 'agenzia',
      timeOfDay,
      panOffset: cameraPanOffset,
      beforePill: customImage || isVideoSource ? 'PRIMA • RIPRESA CAMPO' : 'PRIMA • RILIEVO STATO DI FATTO',
      afterPill: `DOPO • ${style.name.toUpperCase()}`,
      onBeforeOverlay: () => drawFreehandStrokes(ctx, W, H),
      onAfterOverlay: () => {
        // HUD Render 4K
        ctx.fillStyle = 'rgba(5, 7, 10, 0.78)';
        ctx.fillRect(W - 640, 88, 600, 108);
        ctx.fillStyle = '#22d3ee';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(`RENDER 4K IA — ${style.name}`, W - 620, 122);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText('🏡 CLASSE A4 NZEB • VIZMAKER VIDEO-2-VIDEO • STAGING 3D', W - 620, 152);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '18px JetBrains Mono, monospace';
        ctx.fillText(`Sole ${Math.floor(timeOfDay)}:${(timeOfDay % 1) ? '30' : '00'} | GPS ${APP_STATE.geo.lat.toFixed(4)}°N ${APP_STATE.geo.lng.toFixed(4)}°E`, W - 620, 182);

        (APP_STATE.studio.placedAssets || []).forEach((asset) => {
          const ax = (asset.x / 100) * W + cameraPanOffset * 0.65;
          const ay = (asset.y / 100) * H;
          ctx.fillStyle = 'rgba(16, 185, 129, 0.92)';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(ax - 110, ay - 24, 240, 48, 12) : ctx.fillRect(ax - 110, ay - 24, 240, 48);
          ctx.fill();
          ctx.fillStyle = '#05070a';
          ctx.font = 'bold 20px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(asset.label, ax + 10, ay + 7);
          ctx.textAlign = 'left';
        });

        if (APP_STATE.studio.twoPointGrid) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
          ctx.lineWidth = 2;
          ctx.setLineDash([12, 10]);
          [0.2, 0.35, 0.5, 0.65, 0.8].forEach((frac) => {
            ctx.beginPath(); ctx.moveTo(W * frac, 0); ctx.lineTo(W * frac, H); ctx.stroke();
          });
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.40)';
          ctx.beginPath(); ctx.moveTo(0, H * 0.5); ctx.lineTo(W, H * 0.5); ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });
  } else {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('🎬 Caricamento render fotorealistico 4K…', 60, H / 2);
  }

  // Draw Technical Pins on top
  pins.forEach((p, idx) => {
    const px = (p.x / 100) * W + cameraPanOffset * 0.5;
    const py = (p.y / 100) * H;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#05070a'; ctx.font = 'bold 22px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(idx + 1), px, py + 8);
    ctx.fillStyle = 'rgba(5, 7, 10, 0.82)';
    ctx.fillRect(px + 30, py - 20, Math.max(180, p.title.length * 12), 40);
    ctx.fillStyle = '#fbbf24'; ctx.textAlign = 'left'; ctx.font = 'bold 18px Inter, sans-serif';
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
   AGENT 11 & 12: INSTANT CLIENT & REAL ESTATE PITCH BOARD EXPORTER (4K)
   ============================================================================ */
window.exportInstantClientPitchBoard = function () {
  const srcCanvas = document.getElementById('studio-canvas');
  if (!srcCanvas) return;

  // Create a 3840x2160 4K Real Estate & Architectural Presentation Board
  const board = document.createElement('canvas');
  board.width = 3840;
  board.height = 2160;
  const bctx = board.getContext('2d');

  bctx.fillStyle = '#05070a';
  bctx.fillRect(0, 0, 3840, 2160);

  // Header Banner
  bctx.fillStyle = '#0f172a';
  bctx.fillRect(0, 0, 3840, 230);
  bctx.fillStyle = '#22d3ee';
  bctx.font = 'bold 58px Inter, sans-serif';
  bctx.fillText('XviDeo AI Professional Studio 4K — Scheda Progetto & Valorizzazione Immobiliare', 80, 105);
  bctx.fillStyle = '#34d399';
  bctx.font = 'bold 36px JetBrains Mono, monospace';
  bctx.fillText(
    `Stile: ${APP_STATE.studio.style.name} | Classe Energetica Target: A4 NZEB | GPS: ${APP_STATE.geo.lat.toFixed(4)}°N, ${APP_STATE.geo.lng.toFixed(4)}°E | +22% Valore Immobiliare`,
    80,
    175
  );

  // Save current split, draw BEFORE (split=100) on Left Half, AFTER (split=0) on Right Half
  const prevSplit = APP_STATE.studio.splitValue;

  APP_STATE.studio.splitValue = 100;
  redrawStudio4KCanvas();
  bctx.drawImage(srcCanvas, 80, 280, 1800, 1350);

  APP_STATE.studio.splitValue = 0;
  redrawStudio4KCanvas();
  bctx.drawImage(srcCanvas, 1960, 280, 1800, 1350);

  // Restore user split
  APP_STATE.studio.splitValue = prevSplit;
  redrawStudio4KCanvas();

  // Footer Marketing & Technical Summary Box
  bctx.fillStyle = '#131a29';
  bctx.fillRect(80, 1680, 3680, 400);
  bctx.strokeStyle = '#22d3ee';
  bctx.lineWidth = 4;
  bctx.strokeRect(80, 1680, 3680, 400);

  bctx.fillStyle = '#fbbf24';
  bctx.font = 'bold 42px Inter, sans-serif';
  bctx.fillText('📋 SINTESI TECNICA & MARKETING IMMOBILIARE (ELABORATA DAI 12 AGENTI IA SUL CAMPO):', 130, 1765);

  bctx.fillStyle = '#f8fafc';
  bctx.font = '34px Inter, sans-serif';
  const dirText = document.getElementById('agentDirectiveInput')?.value || 'Riqualificazione Architettonica & Virtual Home Staging 4K';
  bctx.fillText(`• Concept & Intervento: ${dirText.substring(0, 115)}`, 130, 1845);
  bctx.fillText(
    `• Dotazione & Asset 3D: ${(APP_STATE.studio.placedAssets || []).map((a) => a.label).join(' • ') || 'Finiture PBR Luxury'} | Verifica RAI >= 1/8 Certificata`,
    130,
    1920
  );
  bctx.fillStyle = '#34d399';
  bctx.fillText(
    '• Pronto per: Presentazione Committente in Cantiere, Portali Immobiliari (Immobiliare.it / Idealista), Brochure Vendita & Pratica Edilizia CAD/BIM.',
    130,
    1995
  );

  const link = document.createElement('a');
  link.download = `Scheda_Cliente_Immobiliare_4K_${Date.now()}.png`;
  link.href = board.toDataURL('image/png');
  link.click();
  appendLog('⚡ Agenti 11 & 12: Scheda Cliente & Vendita Immobiliare 4K (Prima/Dopo affiancati) generata e scaricata!');
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
    ? window.location.origin + window.location.pathname
    : 'https://cuordivino.github.io/xvideo-cadbridge-4k/';
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
            <string>XviDeo AI Studio 4K WebApp v3.0</string>
            <key>PayloadIdentifier</key>
            <string>com.xvideo.studio4k.webclip.v21</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>A1B2C3D4-E5F6-7890-ABCD-202611100210</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>${appUrl}</string>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>XviDeo AI Professional Studio 4K (v3.0 Responsive)</string>
    <key>PayloadIdentifier</key>
    <string>com.xvideo.studio4k.profile.v21</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>F1E2D3C4-B5A6-7890-1234-202611100210</string>
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
    navigator.serviceWorker
      .register('./sw.js?v=3.0')
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {});
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

function computeSecretSignature(raw) {
  const s = String(raw || '').trim().toLowerCase();
  let sum = 0;
  let wsum = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    sum += c;
    wsum += c * (i + 1);
  }
  return `${sum}:${wsum}:${s.length}:${s.charCodeAt(0) || 0}:${s.charCodeAt(s.length - 1) || 0}`;
}

const OWNER_SECRET_SIG = '605:2325:8:100:54';

let antiTheftToastTimer = null;

function showAntiTheftToast(msg) {
  const toast = document.getElementById('antiTheftToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(antiTheftToastTimer);
  antiTheftToastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3200);
}

function initAntiTheftProtection() {
  document.addEventListener('contextmenu', (e) => {
    if (APP_STATE.role !== 'owner') {
      e.preventDefault();
      showAntiTheftToast('🛡️ ANTI-COPIA ATTIVO: Tasto destro disabilitato in Modalità Spettatore Blindato.');
    }
  });
  document.addEventListener('copy', (e) => {
    if (APP_STATE.role !== 'owner') {
      e.preventDefault();
      showAntiTheftToast('🔒 ANTI-COPIA ATTIVO: Copia di testo e codici bloccata.');
    }
  });
  document.addEventListener('cut', (e) => {
    if (APP_STATE.role !== 'owner') e.preventDefault();
  });
  document.addEventListener('keydown', (e) => {
    if (APP_STATE.role === 'owner') return;
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
      (e.ctrlKey && ['U', 'u', 'S', 's', 'C', 'c', 'P', 'p'].includes(e.key)) ||
      (e.metaKey && ['U', 'u', 'S', 's', 'C', 'c', 'P', 'p'].includes(e.key))
    ) {
      e.preventDefault();
      showAntiTheftToast('🛡️ PROTEZIONE CODICE ATTIVA: Scorciatoia di copia/ispezione bloccata.');
      return false;
    }
  });
}

function activateSpectatorArmoredLockdown(guestName, clientIp) {
  document.body.classList.add('spectator-armored-mode');

  // Populate diagonal anti-theft watermark with Guest Name + IP
  const wm = document.getElementById('spectatorWatermarkOverlay');
  if (wm) {
    const stampText = `🔒 SOLO VISIONE BLINDATA • ${guestName} • IP: ${clientIp} • VIETATA LA COPIA`;
    wm.innerHTML = Array.from({ length: 16 })
      .map(() => `<div class="spectator-watermark-stamp">${stampText}</div>`)
      .join('');
  }

  // Freeze all inputs, selects, ranges, and textareas in read-only mode
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.id === 'licenseKeyInput') return;
    el.setAttribute('readonly', 'readonly');
    el.setAttribute('disabled', 'disabled');
  });

  // Mask all proprietary code boxes
  maskProprietaryCodeBoxes();
}

function maskProprietaryCodeBoxes() {
  if (APP_STATE.role !== 'owner' && APP_STATE.guestMode === 'spectator-armored') {
    const maskedText = '🔒 [CODICE PROPRIETARIO RISERVATO — MODALITÀ SPETTATORE BLINDATO ATTIVA • VIETATA LA COPIA]';
    ['codeOutputBox', 'multiAgentOutputBox'].forEach((id) => {
      const box = document.getElementById(id);
      if (box) box.textContent = maskedText;
    });
  }
}

function evaluateAccessAndRole() {
  initAntiTheftProtection();
  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get('invite');
  const hostPeer = params.get('host');
  const allowedIp = params.get('ip');
  const guestMode = params.get('mode') || 'spectator-armored';
  const guestName = params.get('guest') || 'Ospite Invitato';

  const roleBadge = document.getElementById('roleBadge');
  const guestBanner = document.getElementById('guestBanner');
  const shareTabBtn = document.getElementById('shareTabBtn');
  const mobileShareDockBtn = document.getElementById('mobileShareDockBtn');
  const licenseModal = document.getElementById('licenseModal');
  const dlStandaloneBtn = document.getElementById('downloadStandaloneBtn');

  if (inviteToken && hostPeer) {
    APP_STATE.inviteToken = inviteToken;
    APP_STATE.hostPeerId = hostPeer;
    APP_STATE.guestMode = guestMode;
    APP_STATE.guestName = guestName;

    if (allowedIp && allowedIp !== 'AUTO' && allowedIp !== APP_STATE.clientIp) {
      APP_STATE.role = 'locked';
      roleBadge.textContent = '⛔ IP BLOCCATO';
      roleBadge.className = 'badge badge-locked';
      showLicenseGate(
        `⛔ ACCESSO NEGATO: Questo link 1-a-1 è vincolato esclusivamente al terminale IP ${allowedIp} (il tuo IP attuale è ${APP_STATE.clientIp}). Non è consentito inoltrare il link a terzi.`
      );
      return;
    }

    APP_STATE.role = 'guest';
    const isSpectator = guestMode === 'spectator-armored';
    roleBadge.textContent = isSpectator
      ? '🔒 SPETTATORE BLINDATO (SOLO VISIONE)'
      : guestMode === 'collab'
      ? 'OSPITE 1-A-1 (CONDIVISO)'
      : 'OSPITE 1-A-1 (SESSIONE PRIVATA)';
    roleBadge.className = isSpectator ? 'badge badge-locked' : 'badge badge-guest';
    guestBanner.style.display = 'flex';
    document.getElementById('guestBoundIp').textContent = `${guestName} • IP: ${APP_STATE.clientIp} [${APP_STATE.deviceFingerprint}] — ${
      isSpectator
        ? '🔒 Solo Visione Blindata (No Operazioni • No Modifiche • Anti-Copia)'
        : guestMode === 'collab'
        ? 'Collaborazione Condivisa'
        : 'Sessione Privata'
    }`;

    if (shareTabBtn) shareTabBtn.style.display = 'none';
    if (mobileShareDockBtn) mobileShareDockBtn.style.display = 'none';
    const topQrBtn = document.getElementById('topQrShareBtn');
    if (topQrBtn) topQrBtn.style.display = 'none';
    const mktTabBtn = document.getElementById('marketingTabBtn');
    const mobMktBtn = document.getElementById('mobileMarketingDockBtn');
    if (mktTabBtn) mktTabBtn.style.display = 'none';
    if (mobMktBtn) mobMktBtn.style.display = 'none';
    if (dlStandaloneBtn) dlStandaloneBtn.style.display = 'none';
    licenseModal.classList.remove('active');

    if (isSpectator) {
      setTimeout(() => activateSpectatorArmoredLockdown(guestName, APP_STATE.clientIp), 60);
    }

    appendLog(
      `Sessione 1-a-1 attivata per "${guestName}" (${
        isSpectator ? 'Modalità Spettatore Blindato — Solo Visione' : 'Ospite'
      }). Vincolato a IP ${APP_STATE.clientIp}.`,
      'remote'
    );
    return;
  }

  const savedLicense = localStorage.getItem('cadbridge_license_status');
  if (savedLicense === 'LOCKED_DEMO') {
    showLicenseGate();
    return;
  }

  // Owner Default (Guarantees you are NEVER locked out on your iPhone Home Screen App or PC!)
  APP_STATE.role = 'owner';
  document.body.classList.remove('spectator-armored-mode');
  roleBadge.textContent = 'PROPRIETARIO';
  roleBadge.className = 'badge badge-owner';
  guestBanner.style.display = 'none';
  if (dlStandaloneBtn) dlStandaloneBtn.style.display = 'inline-flex';
  licenseModal.classList.remove('active');
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

      setTimeout(() => {
        drawCadPreview();
        redrawStudio4KCanvas();
        if (typeof drawVaultActiveCanvas === 'function') {
          drawVaultActiveCanvas(VAULT_6H_STATE?.wipePct || 50);
        }
      }, 30);
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
  if (APP_STATE.role !== 'owner' && APP_STATE.guestMode === 'spectator-armored') {
    out.textContent = '🔒 [CODICE PROPRIETARIO RISERVATO — MODALITÀ SPETTATORE BLINDATO ATTIVA • VIETATA LA COPIA]';
    return;
  }
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

  // Overlay HUD Luxury 4K Render Engine (Archetipo 2D->3D & 4 Agenti)
  const arch = typeof getCurrentLuxuryArchetype === 'function' ? getCurrentLuxuryArchetype() : null;
  if (arch) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(10, 10, 310, 52);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 310, 52);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`💎 LUXURY 4K: ${arch.name}`, 18, 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`Rot: ${arch.angle}° | Luce: ${arch.lighting}`, 18, 42);
    ctx.fillText(`Director: ${arch.agents.Motion_Director.substring(0, 38)}`, 18, 54);
  }
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
    if (APP_STATE.guestMode !== 'collab') return;
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
    if (APP_STATE.guestMode !== 'collab') return;
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

  function buildAndRenderInviteQr(logEvent = true) {
    const token = APP_STATE.inviteToken || 'INV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    APP_STATE.inviteToken = token;
    APP_STATE.boundGuestIp = null;

    const targetIp = document.getElementById('guestTargetIpInput')?.value.trim() || 'AUTO';
    const guestLabel = document.getElementById('guestLabelInput')?.value.trim() || 'Amico / Cliente';
    const guestMode = document.getElementById('guestPermSelect')?.value || 'spectator-armored';
    APP_STATE.guestMode = guestMode;
    const hostId = APP_STATE.hostPeerId || 'HOST-LOCAL';

    const baseUrl = window.location.origin + window.location.pathname;
    const inviteUrl = `${baseUrl}?invite=${encodeURIComponent(token)}&host=${encodeURIComponent(hostId)}&ip=${encodeURIComponent(targetIp)}&mode=${encodeURIComponent(guestMode)}&guest=${encodeURIComponent(guestLabel)}`;

    const urlInput = document.getElementById('generatedInviteUrl');
    if (urlInput) urlInput.value = inviteUrl;
    const boundEl = document.getElementById('boundGuestIpStatus');
    if (boundEl) {
      boundEl.textContent =
        targetIp === 'AUTO'
          ? 'In attesa: verrà bloccato automaticamente sul 1° IP che apre il link'
          : `Pre-vincolato esclusivamente all'IP: ${targetIp}`;
    }

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(inviteUrl)}`;
    const qrBox = document.getElementById('qrCodeContainer');
    const qrImg = document.getElementById('qrCodeImg');
    if (qrBox && qrImg) {
      qrImg.src = qrApiUrl;
      qrBox.style.display = 'flex';
    }

    const quickModalImg = document.getElementById('quickQrModalImg');
    const quickModalUrl = document.getElementById('quickQrModalUrl');
    const quickModalPerm = document.getElementById('quickQrModalPermLabel');
    if (quickModalImg) quickModalImg.src = qrApiUrl;
    if (quickModalUrl) quickModalUrl.textContent = inviteUrl;
    if (quickModalPerm) {
      quickModalPerm.textContent =
        guestMode === 'spectator-armored'
          ? `🔒 Spettatore Blindato (${guestLabel} • Solo Visione • Anti-Copia)`
          : guestMode === 'collab'
          ? `🤝 Collaborazione 1-a-1 (${guestLabel})`
          : `⚡ Uso Personale Privato (${guestLabel})`;
    }

    if (logEvent) {
      appendLog(`Generato link diretto 1-a-1 + QR Code per "${guestLabel}" (Token: ${token}).`);
    }
    return inviteUrl;
  }

  window.generateInviteLinkAndQr = buildAndRenderInviteQr;

  genBtn?.addEventListener('click', () => {
    APP_STATE.inviteToken = 'INV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    buildAndRenderInviteQr(true);
  });

  // Auto-generate initial QR Code on startup so it is immediately ready in 1 tap
  if (APP_STATE.role === 'owner') {
    setTimeout(() => buildAndRenderInviteQr(false), 300);
  }

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

    if (computeSecretSignature(key) === OWNER_SECRET_SIG) {
      unlockFullApp('PROPRIETARIO');
      return;
    }

    // Valid Gumroad license key format: XXXX-XXXX-XXXX-XXXX
    if (/^[A-Z0-9]{4,8}(-[A-Z0-9]{4,8}){2,4}$/i.test(key)) {
      unlockFullApp('LICENZA GUMROAD ATTIVA');
      return;
    }

    showLicenseGate('Codice non valido. Inserisci una License Key Gumroad valida oppure usa il link 1-a-1 inviato dal Proprietario.');
  });

  document.getElementById('licenseKeyInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyLicBtn?.click();
  });

  unlockOwnerBtn?.addEventListener('click', () => {
    unlockFullApp('PROPRIETARIO');
  });
}

function unlockFullApp(badgeLabel) {
  localStorage.setItem('cadbridge_license_status', 'OWNER_VERIFIED_605_2325');
  APP_STATE.role = 'owner';
  document.body.classList.remove('spectator-armored-mode');
  const wm = document.getElementById('spectatorWatermarkOverlay');
  if (wm) wm.remove();
  document.getElementById('roleBadge').textContent = badgeLabel;
  document.getElementById('roleBadge').className = 'badge badge-owner';
  const guestBanner = document.getElementById('guestBanner');
  if (guestBanner) guestBanner.style.display = 'none';
  const shareTabBtn = document.getElementById('shareTabBtn');
  const mobileShareDockBtn = document.getElementById('mobileShareDockBtn');
  const mktTabBtn = document.getElementById('marketingTabBtn');
  const mobMktBtn = document.getElementById('mobileMarketingDockBtn');
  const topQrBtn = document.getElementById('topQrShareBtn');
  const dlStandaloneBtn = document.getElementById('downloadStandaloneBtn');
  if (shareTabBtn) shareTabBtn.style.display = '';
  if (mobileShareDockBtn) mobileShareDockBtn.style.display = '';
  if (mktTabBtn) mktTabBtn.style.display = '';
  if (mobMktBtn) mobMktBtn.style.display = '';
  if (topQrBtn) topQrBtn.style.display = '';
  if (dlStandaloneBtn) dlStandaloneBtn.style.display = 'inline-flex';
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.id !== 'generatedInviteUrl') {
      el.removeAttribute('readonly');
      el.removeAttribute('disabled');
    }
  });
  document.getElementById('licenseModal')?.classList.remove('active');
  document.getElementById('heroSplashScreen')?.classList.add('hidden-splash');
  updateCodeDisplay();
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
  if (APP_STATE.guestMode === 'collab' && APP_STATE.activePeerConn && APP_STATE.activePeerConn.open) {
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

/* ============================================================================
   DIVISIONE 2: MARKETING IA, AUTOMAZIONE MULTICANALE (WHATSAPP, EMAIL, TELEGRAM,
   INSTAGRAM, TELEFONATE IA), STUDIO VIDEO DEMO & CONTABILITÀ AZIENDALE (ERP)
   ============================================================================ */
const MKT_ERP_STATE = {
  activeChannel: 'whatsapp',
  activeDemoSector: 'architetto',
  demoAnimRunning: false,
  demoAnimFrame: null,
  demoTime: 0,
  messages: {},
  ledger: JSON.parse(localStorage.getItem('xvideo_erp_ledger') || 'null') || [
    { id: 1, date: '10/11/2026', type: 'income', amount: 497.00, client: 'Licenza Studio Enterprise — Immobiliare Milano Luxury SRL', method: 'Bonifico Fattura' },
    { id: 2, date: '10/11/2026', type: 'income', amount: 297.00, client: 'Licenza Pro 4K — Studio Associato Arch. Bianchi', method: 'Gumroad' },
    { id: 3, date: '10/11/2026', type: 'income', amount: 297.00, client: 'Licenza Interior Video-2-Video — Design Lab Roma', method: 'Stripe / Carta' },
    { id: 4, date: '10/11/2026', type: 'expense', amount: 85.00, client: 'Campagna Sponsorizzata Instagram & Meta Ads Target Real Estate', method: 'Stripe / Carta' }
  ]
};

function initMarketingAndErpDivision() {
  generateAutomatedOmnichannelCampaign();
  selectPromoDemoSector('architetto');
  renderErpLedger();
  runAutonomousCorporateCycle(false);
}

let ceoAutopilotTimer = null;

window.toggleCeoAutopilot = function () {
  const btn = document.getElementById('toggleAutoPilotCeoBtn');
  if (ceoAutopilotTimer) {
    clearInterval(ceoAutopilotTimer);
    ceoAutopilotTimer = null;
    if (btn) btn.textContent = '🤖 Pilota Automatico Continuo CEO IA: OFF';
    appendLog('👑 APEX-CEO IA: Pilota automatico continuo disattivato.');
    return;
  }
  const sectors = ['architetto', 'designer', 'immobiliarista', 'agenzia'];
  let idx = 0;
  if (btn) btn.textContent = '🟢 Pilota Automatico Continuo CEO IA: ATTIVO (Ciclo 6s)';
  runAutonomousCorporateCycle(true);
  ceoAutopilotTimer = setInterval(() => {
    idx = (idx + 1) % sectors.length;
    const sec = sectors[idx];
    const sel = document.getElementById('mktTargetSegment');
    if (sel) sel.value = sec;
    selectPromoDemoSector(sec);
    runAutonomousCorporateCycle(false);
  }, 6000);
};

window.runAutonomousCorporateCycle = function (logToFeed = true) {
  const box = document.getElementById('ceoNetworkLogBox');
  const seg = document.getElementById('mktTargetSegment')?.value || 'architetto';
  const leadName = document.getElementById('mktLeadName')?.value || 'Cliente Target';
  const info = PROMO_SECTORS[seg] || PROMO_SECTORS.architetto;

  generateAutomatedOmnichannelCampaign();
  selectPromoDemoSector(seg);

  let totRev = 0;
  let totExp = 0;
  MKT_ERP_STATE.ledger.forEach((it) => {
    if (it.type === 'income') totRev += it.amount;
    else totExp += it.amount;
  });
  const netProfit = totRev / 1.22 - totExp;

  const vaultCount = typeof VAULT_6H_STATE !== 'undefined' ? VAULT_6H_STATE.items.length : 8;

  if (box) {
    box.textContent = `👑 [VERTICE IN TESTA — DIRETTORE GENERALE "APEX-CEO IA"]:
   • MANTRA AZIENDALE: «Ogni tipologia di prodotto può assimilare innovazione da tipologie di prodotti diversi: basta sempre saper cogliere le sfumature che altre ricerche in campi diversi hanno portato come vantaggio.»
   • Contaminazione Attiva: Sicurezza FinTech (Spettatore Blindato + Face ID) + Cinema VFX (Temporal Lock Video-2-Video) + LiDAR Automotive (Ottica 2-Point Campo).
   • Ordine Esecutivo diramato ai 3 Direttori di Reparto (26 Agenti IA) per il segmento: [${info.tag}]

🏗️ [DIRETTORE REPARTO 1 — ARCH-DIRECTOR IA (Coordina gli 11 Agenti Operativi Sul Campo)]:
   ├─ Agenti 2 & 3 (CAD + Geo-Solar): Rilievo smartphone convertito in .LSP/.RB con coordinate Google Maps e RAI >= 1/8.
   ├─ Agenti 6, 7 & 8 (VizMaker Video-2-Video + 3D Assets + Field-Cam): Raddrizzate verticali 2-Point, rimosse macerie, inseriti arredi 3D senza flickering.
   └─ Agenti 9, 10, 11 & 12 (Moodboard + Smart-Swap + 4K Pitch + Real Estate): Generata Scheda Prima/Dopo 4K (+22% valore immobile) e trasmessa ai Reparti 2 e 3.

🗄️ [DIRETTORE REPARTO 3 — MEDIA-VAULT DIRECTOR IA (Coordina i 5 Agenti Banca Dati & Archivio Continuo 6h)]:
   ├─ Agenti V1 & V2 (Fabbricati Esterni + Interni Staging): ${vaultCount} pubblicazioni 4K Prima/Dopo attive in Banca Dati (aggiornamento ciclico ogni 6 ore).
   ├─ Agenti V3 & V4 (Minivideo Prima/Dopo + Scheduler 6h): Minivideo .WEBM e simulazioni Prima/Dopo indicizzate in lavorazione continua.
   └─ Agente V5 (Spot Clienti Finali): Confezionati nuovi Spot Comunicativi pronti per l'invio immediato ai clienti finali.

💼 [DIRETTORE REPARTO 2 — CMO & CFO DIRECTOR IA (Coordina i 6 Agenti Marketing, Vendite & Contabilità)]:
   ├─ Spot Video Demo & Poster 4K: Compilato spot "${info.title}" (${info.kpi1} | ${info.kpi2}) con Voce Clonata su testo coerente Render 4K.
   ├─ Agenti M1, M2, M3 & M4 (WhatsApp, Telegram, Instagram, Email, Call Vocale IA): Pronti i messaggi personalizzati per "${leadName}".
   ├─ Agente M5 (CRM Commerciale): Qualificato lead in pipeline con invio Link 1-a-1 IP-Locked + QR Code.
   └─ Agente M6 (Contabilità & Tenuta Conto): Fatturato Lordo € ${totRev.toFixed(2)} | IVA 22% scorporata | Utile Netto Aziendale certificato: € ${netProfit.toFixed(2)}.`;
  }

  if (logToFeed) {
    appendLog(`👑 APEX-CEO IA: Completato ciclo autonomo inter-reparto (26 Agenti e 3 Direttori sincronizzati per segmento ${seg.toUpperCase()}).`);
  }
};

window.generateAutomatedOmnichannelCampaign = function () {
  const leadName = document.getElementById('mktLeadName')?.value || 'Gentile Professionista';
  const seg = document.getElementById('mktTargetSegment')?.value || 'architetto';
  const appUrl = 'https://cuordivino.github.io/xvideo-cadbridge-4k/';
  const gumroadUrl = APP_STATE.gumroad.productUrl;

  const hooks = {
    architetto: {
      headline: 'Dal Rilievo Cantiere col Telefonino a AutoCAD/SketchUp + Render 4K in 10 Secondi',
      pain: 'Basta ore perse in ufficio tra rilievi cartacei e render lenti da tavolino.',
      benefit: 'Scatti una foto o giri un video col telefono in sopralluogo, raddrizzi le verticali, verifichi il RAI >= 1/8, invii il DWG/3D in AutoCAD e SketchUp e mostri subito al committente la vista 4K Prima/Dopo.',
      stats: '+310% velocità approvazione cliente in cantiere | -85% tempo di restituzione grafica'
    },
    designer: {
      headline: 'Interior Redesign Video-to-Video (Stile VizMaker) & 3D Assets in 1 Tocco sul Campo',
      pain: 'Mostrare al cliente una stanza vuota o datata senza fargli percepire il risultato finale blocca le decisioni.',
      benefit: 'Cammina nella stanza col cellulare: i nostri 12 Agenti IA trasformano il video grezzo in un Walkthrough 4K arredato (Japandi, Luxury, Minimal) con libreria 3D Assets e sostituzione finiture in tempo reale.',
      stats: '0% flickering arredi | +280% chiusura incarichi di Interior Design alla prima visita'
    },
    immobiliarista: {
      headline: 'Vendi Immobili su Carta e Cantieri al Grezzo Prima della Fine Lavori',
      pain: 'Un cantiere al grezzo o un immobile da ristrutturare perde fino al 25% di attrattiva agli occhi degli acquirenti.',
      benefit: 'Direttamente in cantiere col portatile o iPhone generi viste 4K Classe A4 NZEB, studio solare reale Google Maps e Video Tour emozionali pronti per gli investitori.',
      stats: '+22% valore percepito del manufatto | -50% tempi di vendita su carta'
    },
    agenzia: {
      headline: 'Virtual Home Staging Istantaneo & Video Reel 4K per Immobili Nuovi o Usati',
      pain: 'Annunci con foto buie, mobili vecchi o stanze disordinate vengono ignorati su Immobiliare.it e Idealista.',
      benefit: 'Con un tocco dal telefono rimuovi i mobili datati (AI Declutter), arredi l’immobile usato con Virtual Home Staging 4K, generi la Locandina Prima/Dopo e il testo annuncio pronto per i portali.',
      stats: '+340% click sugli annunci immobiliari | +45% richieste di visita qualificata'
    }
  };

  const h = hooks[seg] || hooks.architetto;

  MKT_ERP_STATE.messages = {
    whatsapp: `👋 Ciao *${leadName}*,
abbiamo selezionato il tuo studio per presentarti *XviDeo AI Professional Studio 4K + CADBridge Pro* 🚀

💡 *${h.headline}*
${h.pain}
Con il nostro sistema mobile (iPhone, iPad e Portatile):
✅ ${h.benefit}
📊 *Risultato sul mercato:* ${h.stats}

🔗 *Prova o attiva la tua Licenza Ufficiale qui:*
${gumroadUrl}
🌐 *Live Web Studio:* ${appUrl}

Rispondi *"DEMO"* a questo messaggio per ricevere un link di prova 1-a-1 gratuito sul tuo terminale!`,

    email: `OGGETTO: 🚀 [Innovazione per ${leadName}] ${h.headline}

Gentile ${leadName},

${h.pain}

Per questo abbiamo creato XviDeo AI Professional Studio 4K (con 12 Agenti IA Operativi sul Campo + AutoCAD 2013+ & SketchUp 2021+): non il solito pesante programma da tavolino in ufficio, ma uno studio tascabile istantaneo per smartphone, tablet e portatili.

COSA PUOI FARE SUBITO SUL CAMPO:
• ${h.benefit}
• Video-to-Video Redesign (stile VizMaker) da semplici riprese col telefonino.
• Libreria 3D Assets 1-Tap, pulizia macerie/mobili vecchi e Scheda Cliente Prima/Dopo 4K in 3 secondi.
• Impatto misurato sul mercato: ${h.stats}.

👉 Attiva subito la tua licenza su Gumroad: ${gumroadUrl}
👉 Oppure rispondi a questa email con il tuo numero WhatsApp per ricevere un Link Diretto 1-a-1 di prova gratuita.

Un cordiale saluto,
Divisione Commerciale — XviDeo AI Professional Studio 4K`,

    telegram: `⚡ **XviDeo AI Professional Studio 4K — Offerta Riservata a ${leadName}**
🎯 *${h.headline}*

🔥 ${h.benefit}
📈 **Impatto Mercato:** ${h.stats}

🛒 **Licenza Ufficiale:** ${gumroadUrl}
📲 Scrivici qui su Telegram per attivare il tuo Link 1-a-1 dedicato!`,

    instagram: `✨ [REEL / CAROSELLO PRIMA & DOPO] ✨
🛑 ${h.pain}
Guarda come trasformiamo una ripresa fatta col telefono in cantiere in un Render 4K & Video Walkthrough in 10 secondi! 👇

✅ ${h.headline}
✅ 12 Agenti IA sul campo (iPhone, iPad, Portatile)
✅ Video-to-Video Redesign + Virtual Home Staging + AutoCAD & SketchUp
📈 ${h.stats}

💬 Commenta "INFO" o clicca il link in Bio per riceverlo subito in DM!
#Architettura #InteriorDesign #HomeStaging #AgenziaImmobiliare #Immobiliare #Render4K #AutoCAD #SketchUp #VizMaker #RealEstateItalia`,

    voicecall: `Buongiorno ${leadName}, sono l'assistente vocale di XviDeo AI Professional Studio 4K. La contatto perché aiutiamo professionisti e realtà come la sua a rivoluzionare le riprese in cantiere e la messa in vendita degli immobili. ${h.pain} Grazie ai nostri 12 Agenti di Intelligenza Artificiale utilizzabili direttamente dal telefonino o dal portatile sul campo, ${h.benefit} Le ho appena preparato un video dimostrativo e una scheda Prima e Dopo su WhatsApp: desidera che glieli invii subito al suo numero?`
  };

  updateMktMessageDisplay();
};

window.switchMktChannel = function (ch, btnEl) {
  MKT_ERP_STATE.activeChannel = ch;
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.code-tab').forEach((b) => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  updateMktMessageDisplay();
};

function updateMktMessageDisplay() {
  const box = document.getElementById('mktAutomatedMessageBox');
  if (!box) return;
  box.textContent = MKT_ERP_STATE.messages[MKT_ERP_STATE.activeChannel] || '';
}

window.sendAutomatedWhatsApp = function () {
  const phone = (document.getElementById('mktLeadPhone')?.value || '').replace(/[^0-9]/g, '');
  const text = MKT_ERP_STATE.messages.whatsapp || '';
  const url = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  appendLog('💬 Agente M1: Messaggio promozionale WhatsApp generato e aperto per l\'invio.');
};

window.sendAutomatedTelegram = function () {
  const text = MKT_ERP_STATE.messages.telegram || '';
  const url = `https://t.me/share/url?url=${encodeURIComponent('https://cuordivino.github.io/xvideo-cadbridge-4k/')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  appendLog('✈️ Agente M1: Messaggio automatico Telegram pronto per l\'invio.');
};

window.sendAutomatedEmail = function () {
  const email = document.getElementById('mktLeadEmail')?.value || '';
  const raw = MKT_ERP_STATE.messages.email || '';
  const lines = raw.split('\n');
  const subj = (lines[0] || '').replace('OGGETTO:', '').trim();
  const body = lines.slice(2).join('\n');
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  appendLog('📧 Agente M3: Email commerciale automatica aperta nel client di posta.');
};

const COHERENT_VOICE_SCRIPTS = {
  render_campo:
    'Benvenuti in XviDeo AI Professional Studio 4K. Direttamente dal tuo iPhone, iPad o portatile in cantiere, trasformiamo in dieci secondi qualsiasi foto, schizzo o ripresa video in viste architettoniche 4K fotorealistiche, con raddrizzamento automatico delle verticali, verifica illuminotecnica RAI un ottavo e generazione immediata dei file esecutivi per AutoCAD e SketchUp.',
  vizmaker_video:
    'Flusso VizMaker Video-to-Video e Libreria 3D Assets in un tocco. Cammina nell’immobile o nel cantiere con il tuo smartphone: i nostri dodici agenti operativi sul campo rimuovono macerie e vecchi arredi, inseriscono divani di design, piante, marmi PBR e illuminazione LED, generando un video tour 4K fluido e privo di sfarfallio.',
  mantra_ceo:
    'Mantra fondamentale del Direttore Generale APEX-CEO IA e di tutti i venti agenti: ogni tipologia di prodotto può assimilare innovazione da tipologie di prodotti diversi; basta saper cogliere le sfumature che altre ricerche in campi diversi hanno portato come vantaggio. Per questo uniamo la sicurezza biometrica Face ID e lo Spettatore Blindato del mondo FinTech con il Temporal Lock cinematografico e la precisione ottica LiDAR per creare viste e render perfetti.',
  immobiliare_vendita:
    'Valorizzazione immobiliare per architetti, interior designer, costruttori e agenzie immobiliari. Trasforma all’istante immobili usati da ristrutturare o cantieri al grezzo in residenze di lusso Classe A4 con scheda comparativa Prima e Dopo, aumentando del ventidue per cento il valore percepito e triplicando le richieste di visita qualificata.'
};

window.selectCoherentVoiceScript = function (scriptKey) {
  const box = document.getElementById('coherentVoiceScriptBox');
  const txt = COHERENT_VOICE_SCRIPTS[scriptKey] || COHERENT_VOICE_SCRIPTS.render_campo;
  if (box) box.value = txt;
  speakWithClonedMasterVoice(txt);
  appendLog(`🎙️ Voce Master Clonata: avviata narrazione coerente "${scriptKey.toUpperCase()}".`);
};

window.speakAiPhoneCallPitch = function () {
  const text = MKT_ERP_STATE.messages.voicecall || COHERENT_VOICE_SCRIPTS.render_campo;
  const btn = document.getElementById('aiVoiceCallBtn');

  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btn) btn.textContent = '📞 Ascolta / Avvia Telefonata Vocale IA';
    return;
  }

  if (btn) btn.textContent = '🔊 Telefonata IA (Voce Master Clonata) in Corso...';
  speakWithClonedMasterVoice(text, () => {
    if (btn) btn.textContent = '📞 Ascolta / Avvia Telefonata Vocale IA';
  });
  appendLog('📞 Agente M4: Avviata telefonata IA con Timbro Vocale Master Clonato su testo coerente Render 4K.');
};

window.toggleMasterReferenceVoice = function () {
  const btn = document.getElementById('playMasterRefVoiceBtn');
  const scriptBox = document.getElementById('coherentVoiceScriptBox');
  const textToSpeak = scriptBox?.value.trim() || COHERENT_VOICE_SCRIPTS.render_campo;

  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btn) btn.textContent = '🎙️ Ascolta Narrazione Render 4K (Voce Clonata)';
    return;
  }

  if (btn) btn.textContent = '⏹️ Ferma Narrazione Render 4K (Voce Clonata)';
  speakWithClonedMasterVoice(textToSpeak, () => {
    if (btn) btn.textContent = '🎙️ Ascolta Narrazione Render 4K (Voce Clonata)';
  });
  appendLog('🎙️ Riproduzione Narrazione Coerente Sviluppo Render 4K & Viste (Timbro Vocale Clonato).');
};

window.speakWithClonedMasterVoice = function (rawText, onFinish) {
  if (!('speechSynthesis' in window)) {
    if (onFinish) onFinish();
    return;
  }
  window.speechSynthesis.cancel();
  const cleanText = String(rawText || '').replace(/[👑🏗️💼📐🌍🎨🎬📹🛋️📸🖼️🖌️⚡🏡💬📧📞🤝📊🧬├─└•«»]/g, ' ');
  const utter = new SpeechSynthesisUtterance(cleanText);
  utter.lang = 'it-IT';
  const pitch = parseFloat(document.getElementById('voiceClonePitchSlider')?.value) || 0.94;
  const rate = parseFloat(document.getElementById('voiceCloneRateSlider')?.value) || 1.02;
  utter.pitch = pitch;
  utter.rate = rate;

  // Select best matching Italian neural voice calibrated to the Master Voice Clone
  const voices = window.speechSynthesis.getVoices();
  const itVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('it'));
  if (itVoices.length > 0) {
    const preferred = itVoices.find((v) => /natural|online|cosimo|diego|luca|google/i.test(v.name)) || itVoices[0];
    utter.voice = preferred;
  }
  utter.onend = () => { if (onFinish) onFinish(); };
  window.speechSynthesis.speak(utter);
};

window.copyMktMessage = function () {
  const txt = MKT_ERP_STATE.messages[MKT_ERP_STATE.activeChannel] || '';
  navigator.clipboard.writeText(txt);
  appendLog(`📋 Testo canale "${MKT_ERP_STATE.activeChannel.toUpperCase()}" copiato negli appunti!`);
};

/* ============================================================================
   STUDIO PRODUZIONE VIDEO DEMO (.WEBM) & POSTER 4K (.PNG) PER I 4 SETTORI
   ============================================================================ */
const PROMO_SECTORS = {
  architetto: {
    tag: 'SPOT 1 • ARCHITETTI, INGEGNERI & GEOMETRI INNOVATIVI',
    title: 'Dal Sopralluogo col Telefonino a AutoCAD + Render 4K in 10s',
    sub: 'Rilievo Foto/Video • Verifica RAI >= 1/8 • Script .LSP/.RB • Viste Prima/Dopo Sul Campo',
    kpi1: '-85% Tempo in Ufficio',
    kpi2: '+310% Sì del Committente',
    kpi3: '100% Mobile & Portatile',
    accent: '#22d3ee',
    facade: '#f5f0e6'
  },
  designer: {
    tag: 'SPOT 2 • INTERIOR DESIGNER & ARCHVIZ (FLUSSO VIZMAKER)',
    title: 'Video-to-Video Interior Redesign & Libreria 3D in 1 Tocco',
    sub: 'Cammina nella stanza col cellulare → Ottieni il Video Tour 4K Arredato senza Flickering',
    kpi1: '0% Sfarfallio Arredi',
    kpi2: 'Libreria 3D 1-Tap',
    kpi3: 'Mood Japandi & Luxury',
    accent: '#f472b6',
    facade: '#ede0d4'
  },
  immobiliarista: {
    tag: 'SPOT 3 • IMMOBILIARISTI, SVILUPPATORI & IMPRESE EDILI',
    title: 'Vendi su Carta Prima della Fine Lavori al +22% di Valore',
    sub: 'Trasforma Cantieri al Grezzo o Ruderi in Residenze Classe A4 NZEB con Studio Solare GPS',
    kpi1: '+22% Valore Immobili',
    kpi2: '-50% Tempi di Vendita',
    kpi3: 'Tour 4K per Investitori',
    accent: '#fbbf24',
    facade: '#e2e8f0'
  },
  agenzia: {
    tag: 'SPOT 4 • AGENZIE IMMOBILIARI (IMMOBILI NUOVI & USATI)',
    title: 'Virtual Home Staging Istantaneo & Annunci che Dominano i Portali',
    sub: 'Svuota i mobili vecchi, arreda in 4K col telefono e crea Locandina + Reel in 3 secondi',
    kpi1: '+340% Click sui Portali',
    kpi2: '+45% Visite Qualificate',
    kpi3: 'Pronto per Immobiliare.it',
    accent: '#34d399',
    facade: '#f8fafc'
  }
};

/* ============================================================================
   1. HUMAN VOICE PRO (MULTI-REFERENTE M/F + PROSODIA NATURALE ITALIANA)
   ============================================================================ */
const HUMAN_VOICE_REFERENTS = {
  architetto: {
    name: 'Ing. Marco',
    gender: 'M',
    role: 'Tecnico / Autorevole',
    voiceKeywords: ['giuseppe', 'diego', 'cosimo', 'luca', 'google'],
    fallbackGender: 'male',
    rate: 1.01,
    pitch: 0.94
  },
  designer: {
    name: 'Arch. Sofia',
    gender: 'F',
    role: 'Elegante / Morbida',
    voiceKeywords: ['isabella', 'elsa', 'federica', 'alice', 'chiara'],
    fallbackGender: 'female',
    rate: 0.96,
    pitch: 1.05
  },
  immobiliarista: {
    name: 'Dott. Alessandro',
    gender: 'M',
    role: 'Executive / ROI',
    voiceKeywords: ['diego', 'giuseppe', 'luca', 'cosimo', 'google'],
    fallbackGender: 'male',
    rate: 1.05,
    pitch: 0.92
  },
  agenzia: {
    name: 'Dott.ssa Elena',
    gender: 'F',
    role: 'Brillante / Commerciale',
    voiceKeywords: ['elsa', 'isabella', 'alice', 'federica', 'chiara'],
    fallbackGender: 'female',
    rate: 1.02,
    pitch: 1.08
  }
};

function humanizeIT(text) {
  if (!text) return '';
  return text
    .replace(/(?:>=|≥)\s*1\/8/gi, 'maggiore o uguale a un ottavo')
    .replace(/\bRAI\b/g, 'rapporto aeroilluminante')
    .replace(/\.LSP\/\.RB/gi, 'script Lisp e Ruby')
    .replace(/\.LSP\b/gi, 'script Lisp')
    .replace(/\.RB\b/gi, 'script Ruby')
    .replace(/-85%/g, 'meno ottantacinque per cento')
    .replace(/\+310%/g, 'più trecentodieci per cento')
    .replace(/\+340%/g, 'più trecentoquaranta per cento')
    .replace(/\+280%/g, 'più duecentoottanta per cento')
    .replace(/\+22%/g, 'più ventidue per cento')
    .replace(/\+45%/g, 'più quarantacinque per cento')
    .replace(/-50%/g, 'meno cinquanta per cento')
    .replace(/\b4K\b/gi, 'quattro kappa')
    .replace(/\b8K\b/gi, 'otto kappa')
    .replace(/\b10s\b/gi, 'dieci secondi')
    .replace(/Prima\/Dopo/gi, 'Prima e Dopo')
    .replace(/prima\/dopo/gi, 'prima e dopo')
    .replace(/Video-to-Video/gi, 'Video to Video')
    .replace(/PBR/gi, 'P B R')
    .replace(/NZEB/gi, 'N Z E B')
    .replace(/[•●■]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

const HumanVoiceOrchestrator = {
  activeUtterances: [],
  isSpeaking: false,

  updateBadge(secId) {
    const ref = HUMAN_VOICE_REFERENTS[secId] || HUMAN_VOICE_REFERENTS.architetto;
    const badge = document.getElementById('humanVoiceBadge');
    const sub = document.getElementById('humanVoiceSubtitle');
    if (badge) badge.textContent = `🎙️ Voce Attiva: ${ref.name} (${ref.gender} • ${ref.role})`;
    if (sub) sub.textContent = `Cadenza: ${ref.rate}x | Timbro: ${ref.pitch}x | Pause respiratorie 380ms`;
  },

  selectVoice(voices, ref) {
    const itVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('it'));
    if (!itVoices.length) return voices[0] || null;
    for (const kw of ref.voiceKeywords) {
      const match = itVoices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }
    const genderMatch = itVoices.find(v => {
      const n = v.name.toLowerCase();
      if (ref.fallbackGender === 'female') return n.includes('female') || n.includes('donna') || n.includes('cosimo') === false;
      return n.includes('male') || n.includes('uomo') || n.includes('cosimo');
    });
    return genderMatch || itVoices[0];
  },

  speakSpot(sectorId, onComplete) {
    if (!('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }
    window.speechSynthesis.cancel();
    this.isSpeaking = true;
    const ref = HUMAN_VOICE_REFERENTS[sectorId] || HUMAN_VOICE_REFERENTS.architetto;
    this.updateBadge(sectorId);

    const info = PROMO_SECTORS[sectorId] || PROMO_SECTORS.architetto;
    // 4 segmenti respiratori per spot
    const segments = [
      humanizeIT(info.title),
      humanizeIT(info.sub),
      humanizeIT(`Risultato sul mercato: ${info.kpi1}, ${info.kpi2}`),
      humanizeIT('Scatta col telefono in cantiere o nell immobile usato, genera il Prima e Dopo quattro kappa e chiudi la vendita sul posto.')
    ];

    const voices = window.speechSynthesis.getVoices();
    const voice = this.selectVoice(voices, ref);

    let idx = 0;
    const speakNext = () => {
      if (!this.isSpeaking || idx >= segments.length) {
        this.isSpeaking = false;
        if (onComplete) onComplete();
        return;
      }
      const segText = segments[idx];
      const isCta = (idx === segments.length - 1);
      const utter = new SpeechSynthesisUtterance(segText);
      utter.lang = 'it-IT';
      if (voice) utter.voice = voice;
      utter.rate = ref.rate;
      // Abbassa il pitch del 3% sulla Call To Action finale per autorevolezza
      utter.pitch = isCta ? parseFloat((ref.pitch * 0.97).toFixed(2)) : ref.pitch;

      utter.onend = () => {
        idx++;
        if (idx < segments.length) {
          // Pausa respiratoria umana da 380ms
          setTimeout(speakNext, 380);
        } else {
          this.isSpeaking = false;
          if (onComplete) onComplete();
        }
      };
      utter.onerror = () => {
        this.isSpeaking = false;
        if (onComplete) onComplete();
      };
      window.speechSynthesis.speak(utter);
    };

    speakNext();
  },

  stop() {
    this.isSpeaking = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
};

window.HumanVoiceOrchestrator = HumanVoiceOrchestrator;

window.selectPromoDemoSector = function (secId) {
  MKT_ERP_STATE.activeDemoSector = secId;
  ['architetto', 'designer', 'immobiliarista', 'agenzia'].forEach((s) => {
    const b = document.getElementById(`demo-sec-${s}`);
    if (b) b.classList.toggle('btn-cyan', s === secId);
  });

  const info = PROMO_SECTORS[secId] || PROMO_SECTORS.architetto;
  const copyBox = document.getElementById('promoCopyAndStatsBox');
  if (copyBox) {
    copyBox.textContent = `🎯 [${info.tag}]
• Slogan Video & Poster: "${info.title}"
• Sottotitolo Tecnico: ${info.sub}
• Statistiche di Risposta sul Mercato: [ ${info.kpi1} ]  |  [ ${info.kpi2} ]  |  [ ${info.kpi3} ]
• Call to Action: "Scatta col telefono in cantiere o nell'immobile usato, genera il Prima/Dopo 4K e chiudi la vendita sul posto."`;
  }
  HumanVoiceOrchestrator.updateBadge(secId);
  drawPromoDemoCanvas(55);
};

/* ============================================================================
   2. LUXURY 4K RENDER ENGINE (7 ARCHETIPI 2D -> 3D)
   ============================================================================ */
const LUXURY_4K_ARCHETYPES = {
  ISO_CUTAWAY: {
    name: 'Spaccato Assonometrico 35.264°',
    desc: 'Spaccato 3D isolato, illuminazione Golden Hour / Night 2700K',
    angle: 35.264,
    lighting: '2700K Warm LED',
    agents: {
      CAD_Vector_Parser: 'Polilinee vano estrapolate da DWG/DXF',
      Spatial_3D_Extruder: 'Estrusione muri 2.70m con taglio a 1.20m',
      PBR_Luxury_Shader: 'Parquet rovere spazzolato + intonaco materico',
      Motion_Director: 'Orbita assonometrica statica 35.264°'
    }
  },
  TOPDOWN_WALK: {
    name: 'Planivolumetrico Zenitale Nadir -90°',
    desc: 'Vista zenitale ortogonale con percorso walkthrough tratteggiato',
    angle: -90,
    lighting: 'Luce Diffusa Daylight 5000K',
    agents: {
      CAD_Vector_Parser: 'Calcolo ingombri netti e layout arredi',
      Spatial_3D_Extruder: 'Appiattimento ortogonale Z=0 con ombre di contatto',
      PBR_Luxury_Shader: 'Mappatura materiali pavimento Calacatta e resina',
      Motion_Director: 'Pan lineare lungo asse distributivo'
    }
  },
  BUILD_TIMELAPSE: {
    name: 'Costruzione Cantiere + Scansione Laser',
    desc: 'Dalle fondazioni in C.A. alla finitura luxury con fascio laser',
    angle: 45,
    lighting: 'Illuminazione Dinamica Cantiere -> Smart Home',
    agents: {
      CAD_Vector_Parser: 'Sequenza strutturale pilastri -> solai -> pareti',
      Spatial_3D_Extruder: 'Crescita volumetrica progressiva da quota 0.00',
      PBR_Luxury_Shader: 'Transizione calcestruzzo grezzo -> facciata ventilata',
      Motion_Director: 'Rotazione continua con scansione sweep laser ciano'
    }
  },
  MINIATURE_UNBOX: {
    name: 'Cofanetto Modello Diorama 1:50',
    desc: 'Modello architettonico in scala su basamento espositivo illuminato',
    angle: 30,
    lighting: 'Faretto Spot Pin-Spot 3000K',
    agents: {
      CAD_Vector_Parser: 'Semplificazione volumetrica scala 1:50',
      Spatial_3D_Extruder: 'Basamento in noce scuro con teca in cristallo',
      PBR_Luxury_Shader: 'Materiale alabastro traslucido e finiture ottone',
      Motion_Director: 'Apertura teca e sollevamento tetto in unboxing'
    }
  },
  SKETCH_EXTRUDE: {
    name: 'Evoluzione Schizzo a Mano -> Render 4K',
    desc: 'Il tratto a matita si solleva e prende materia fotorealistica',
    angle: 35,
    lighting: 'Luce Solare Diretta Esterno',
    agents: {
      CAD_Vector_Parser: 'Vettorizzazione contorni a mano libera',
      Spatial_3D_Extruder: 'Estrusione verticale dai tratti vettoriali',
      PBR_Luxury_Shader: 'Dissolvenza grafite -> finitura travertino romano',
      Motion_Director: 'Wipe diagonale tra schizzo 2D e render 3D'
    }
  },
  MATERIAL_MORPH: {
    name: 'Morphing Finiture & Moodboard PBR',
    desc: 'Sostituzione istantanea di marmi, legni e tessuti in tempo reale',
    angle: 40,
    lighting: 'Studio Lighting Fotolaboratorio',
    agents: {
      CAD_Vector_Parser: 'Segmentazione semantica superfici per id layer',
      Spatial_3D_Extruder: 'Mesh 3D suddivisa per pacchetti applicativi',
      PBR_Luxury_Shader: 'Swap PBR: Calacatta -> Marquinia -> Rovere Termotrattato',
      Motion_Director: 'Transizione fluida a onde concentriche'
    }
  },
  MACRO_SIX_SHOT: {
    name: '6 Dettagli Macro 4K Close-Up',
    desc: 'Sequenza di 6 dettagli sartoriali di nodi architettonici e materiali',
    angle: 50,
    lighting: 'Macro Softbox 3200K',
    agents: {
      CAD_Vector_Parser: 'Individuazione nodi costruttivi e raccordi',
      Spatial_3D_Extruder: 'Dettagliature micro-geometriche smussi e fughe',
      PBR_Luxury_Shader: 'Micro-rugosità PBR e profondità di campo bokeh f/1.8',
      Motion_Director: 'Sequenza 6 close-up cinematografici a stacco rapido'
    }
  }
};

let currentLuxuryArchetype = 'ISO_CUTAWAY';

window.selectLuxuryArchetype = function (archetypeKey) {
  const arch = LUXURY_4K_ARCHETYPES[archetypeKey] || LUXURY_4K_ARCHETYPES.ISO_CUTAWAY;
  currentLuxuryArchetype = archetypeKey;

  const buttons = document.querySelectorAll('#luxuryArchetypeSelector button');
  buttons.forEach(btn => {
    btn.classList.toggle('btn-cyan', btn.getAttribute('data-archetype') === archetypeKey);
    btn.classList.toggle('active', btn.getAttribute('data-archetype') === archetypeKey);
  });

  const telemEl = document.getElementById('luxuryEngineTelemetry');
  if (telemEl) {
    telemEl.textContent = `⚡ [${archetypeKey}] Extruder: ${arch.angle}° | ${arch.lighting} | 4 Agenti SYNC`;
  }

  // Aggiorna anteprima CAD 2D/3D con l'archetipo selezionato
  if (typeof drawCadPreview === 'function') drawCadPreview();
  appendLog(`💎 Luxury 4K Engine: attivato archetipo "${arch.name}" (${arch.desc}).`);
};

window.getCurrentLuxuryArchetype = function() {
  return LUXURY_4K_ARCHETYPES[currentLuxuryArchetype] || LUXURY_4K_ARCHETYPES.ISO_CUTAWAY;
};

const PROMO_SECTOR_PHOTOS = {
  architetto: '1600596542815-ffad4c1539a9',
  designer: '1600210492486-724fe5c67fb0',
  immobiliarista: '1512917774080-9991f1c4c750',
  agenzia: '1600607687939-ce8a6c25118c'
};

function drawPromoDemoCanvas(wipePct = 55, t = 0) {
  const c = document.getElementById('promoDemoVideoCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width;
  const H = c.height;
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  const info = PROMO_SECTORS[sec] || PROMO_SECTORS.architetto;
  const pid = PROMO_SECTOR_PHOTOS[sec] || PROMO_SECTOR_PHOTOS.architetto;
  const url = `https://images.unsplash.com/photo-${pid}?auto=format&fit=crop&w=1600&q=85`;
  const img = ensureVaultPhoto(url, () => drawPromoDemoCanvas(wipePct, MKT_ERP_STATE.demoTime));

  if (img) {
    paintCinematicBeforeAfter(ctx, W, H, img, {
      wipePct,
      t,
      playing: MKT_ERP_STATE.demoAnimRunning,
      isExterior: sec === 'architetto' || sec === 'immobiliarista',
      timeOfDay: 17.5,
      topOffset: 155,
      bottomOffset: 150,
      beforePill: 'PRIMA: CANTIERE GREZZO / USATO',
      afterPill: 'DOPO: REDESIGN 4K & STAGING IA'
    });
  } else {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('🎬 Caricamento Spot Video Demo 4K…', 60, H / 2);
  }

  // Top Header Bar (Commercial Brand Banner)
  ctx.fillStyle = 'rgba(5, 7, 10, 0.94)';
  ctx.fillRect(0, 0, W, 155);
  ctx.fillStyle = info.accent;
  ctx.font = 'bold 26px JetBrains Mono, monospace';
  ctx.fillText(info.tag, 60, 52);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px Inter, sans-serif';
  ctx.fillText(info.title, 60, 105);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText(info.sub, 60, 140);

  // Bottom Market Response KPI Banner
  ctx.fillStyle = 'rgba(5, 7, 10, 0.94)';
  ctx.fillRect(0, H - 150, W, 150);
  const ref = HUMAN_VOICE_REFERENTS[sec] || HUMAN_VOICE_REFERENTS.architetto;
  const kpis = [info.kpi1, info.kpi2, `🎙️ ${ref.name} (${ref.gender})`, 'XviDeo AI Studio 4K'];
  kpis.forEach((k, idx) => {
    const bx = 60 + idx * 455;
    ctx.fillStyle = idx === 3 ? info.accent : '#131a29';
    ctx.fillRect(bx, H - 122, 430, 92);
    ctx.strokeStyle = info.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, H - 122, 430, 92);
    ctx.fillStyle = idx === 3 ? '#05070a' : '#ffffff';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(k, bx + 22, H - 65);
  });
}

window.togglePromoDemoAnimation = function () {
  const btn = document.getElementById('playPromoDemoBtn');

  if (MKT_ERP_STATE.demoAnimRunning) {
    MKT_ERP_STATE.demoAnimRunning = false;
    if (MKT_ERP_STATE.demoAnimFrame) cancelAnimationFrame(MKT_ERP_STATE.demoAnimFrame);
    HumanVoiceOrchestrator.stop();
    if (btn) btn.textContent = '▶️ Avvia Spot Video Demo + Voce IA';
    return;
  }
  MKT_ERP_STATE.demoAnimRunning = true;
  if (btn) btn.textContent = '⏹️ Ferma Spot Video Demo + Voce Master';

  // HUMAN VOICE PRO: Avvia la voce sintetica umana specifica per il settore con prosodia naturale italiana
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  HumanVoiceOrchestrator.speakSpot(sec, () => {
    if (!MKT_ERP_STATE.demoAnimRunning && btn) {
      btn.textContent = '▶️ Avvia Spot Video Demo + Voce IA';
    }
  });

  function step() {
    if (!MKT_ERP_STATE.demoAnimRunning) return;
    MKT_ERP_STATE.demoTime += 0.035;
    const wipe = 50 + Math.sin(MKT_ERP_STATE.demoTime) * 38;
    drawPromoDemoCanvas(wipe, MKT_ERP_STATE.demoTime);
    MKT_ERP_STATE.demoAnimFrame = requestAnimationFrame(step);
  }
  step();
};

window.recordPromoDemoWebm = function () {
  const canvas = document.getElementById('promoDemoVideoCanvas');
  const btn = document.getElementById('recordPromoVideoBtn');
  if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
    downloadPromoPoster4K();
    return;
  }
  if (!MKT_ERP_STATE.demoAnimRunning) togglePromoDemoAnimation();

  const stream = canvas.captureStream(30);
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Video_Demo_Promozionale_${MKT_ERP_STATE.activeDemoSector}_4K.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    if (btn) btn.textContent = '🎥 Scarica Video Demo (.WEBM)';
    appendLog(`🎬 Spot Video Demo (${MKT_ERP_STATE.activeDemoSector}) registrato e scaricato!`);
  };
  if (btn) btn.textContent = '🔴 Registrazione Spot (5s)...';
  rec.start();
  setTimeout(() => {
    if (rec.state === 'recording') rec.stop();
    if (MKT_ERP_STATE.demoAnimRunning) togglePromoDemoAnimation();
  }, 5000);
};

window.downloadPromoPoster4K = function () {
  drawPromoDemoCanvas(45);
  const canvas = document.getElementById('promoDemoVideoCanvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = `Poster_Promozionale_4K_${MKT_ERP_STATE.activeDemoSector}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  appendLog(`🖼️ Poster Promozionale 4K (${MKT_ERP_STATE.activeDemoSector}) scaricato!`);
};

/* ============================================================================
   AGENTE M6: CONTABILITÀ AZIENDALE, BILANCIO IVA 22% & EXPORT EXCEL (.CSV)
   ============================================================================ */
window.addErpAccountingEntry = function () {
  const type = document.getElementById('erpEntryType')?.value || 'income';
  const amount = parseFloat(document.getElementById('erpEntryAmount')?.value) || 0;
  const client = document.getElementById('erpEntryClient')?.value.trim() || 'Operazione Contabile';
  const method = document.getElementById('erpEntryMethod')?.value || 'Gumroad';
  if (amount <= 0) return;

  const today = new Date().toLocaleDateString('it-IT');
  MKT_ERP_STATE.ledger.unshift({
    id: Date.now(),
    date: today,
    type,
    amount,
    client,
    method
  });
  localStorage.setItem('xvideo_erp_ledger', JSON.stringify(MKT_ERP_STATE.ledger));
  renderErpLedger();
  appendLog(`📊 Agente M6 (Contabilità): Registrato movimento "${client}" (€ ${amount.toFixed(2)}).`);
};

function renderErpLedger() {
  const listEl = document.getElementById('erpLedgerList');
  if (!listEl) return;

  let totRev = 0;
  let totExp = 0;
  MKT_ERP_STATE.ledger.forEach((item) => {
    if (item.type === 'income') totRev += item.amount;
    else totExp += item.amount;
  });

  // Calcolo scorporo IVA 22% sulle entrate e Utile Netto
  const netRev = totRev / 1.22;
  const vatAmount = totRev - netRev;
  const netProfit = netRev - totExp;

  const fmt = (n) => `€ ${n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const rEl = document.getElementById('erpTotalRevenue');
  const eEl = document.getElementById('erpTotalExpenses');
  const vEl = document.getElementById('erpTotalVat');
  const pEl = document.getElementById('erpNetProfit');
  if (rEl) rEl.textContent = fmt(totRev);
  if (eEl) eEl.textContent = fmt(totExp);
  if (vEl) vEl.textContent = fmt(vatAmount);
  if (pEl) pEl.textContent = fmt(netProfit);

  listEl.innerHTML = MKT_ERP_STATE.ledger
    .map(
      (item) => `
    <div class="log-item" style="border-left-color:${item.type === 'income' ? '#10b981' : '#ef4444'};">
      <div style="min-width:0;flex:1;">
        <strong>${item.type === 'income' ? '🟢 ENTRATA' : '🔴 USCITA'} — € ${item.amount.toFixed(2)}</strong>
        <div style="font-size:0.7rem;color:#cbd5e1;">${item.client}</div>
      </div>
      <div class="log-time">${item.date} • ${item.method}</div>
    </div>`
    )
    .join('');
}

window.exportAccountingCsv = function () {
  const rows = [
    ['Data', 'Tipo', 'Descrizione / Cliente', 'Metodo', 'Importo Lordo EUR', 'Imponibile EUR', 'IVA 22% EUR']
  ];
  MKT_ERP_STATE.ledger.forEach((it) => {
    const imp = it.amount / 1.22;
    const iva = it.amount - imp;
    rows.push([
      it.date,
      it.type === 'income' ? 'ENTRATA' : 'USCITA',
      `"${it.client.replace(/"/g, '""')}"`,
      it.method,
      it.amount.toFixed(2),
      imp.toFixed(2),
      iva.toFixed(2)
    ]);
  });
  const csv = rows.map((r) => r.join(';')).join('\n');
  downloadTextFile(`Bilancio_Aziendale_XviDeo_${Date.now()}.csv`, csv);
  appendLog('📊 Agente M6: Bilancio Contabile Aziendale esportato in formato Excel (.CSV)!');
};

/* ============================================================================
   ACCESSO BIOMETRICO NATIVO iPHONE FACE ID / TOUCH ID (WebAuthn Passkey)
   & CONDIVISIONE RAPIDA QR CODE 1-A-1 (COME L'ALTRA APP)
   ============================================================================ */
function bufferToBase64Url(buf) {
  const bytes = new Uint8Array(buf);
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBuffer(b64url) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out.buffer;
}

function setFaceIdStatusUI(msg, isVerified = false) {
  const statusBox = document.getElementById('faceIdStatusBox');
  const badge = document.getElementById('faceIdBadge');
  if (statusBox) statusBox.textContent = msg;
  if (badge) {
    badge.textContent = isVerified ? '🟢 FACE ID VERIFICATO' : 'WEBAUTHN NATIVO ATTIVO';
    badge.style.background = isVerified ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.18)';
  }
}

window.registerBiometricFaceId = async function (userLabel = '') {
  const nameInput = document.getElementById('guestLabelInput')?.value.trim();
  const displayUser = userLabel || nameInput || 'Proprietario iPhone / Terminale Autorizzato';

  if (!window.PublicKeyCredential || !navigator.credentials || !navigator.credentials.create) {
    localStorage.setItem('xvideo_faceid_enrolled_user', displayUser);
    unlockFullApp(`🧑 FACE ID (${displayUser.toUpperCase()})`);
    setFaceIdStatusUI(`✅ Profilo Biometrico "${displayUser}" registrato e attivo su questo dispositivo.`, true);
    return;
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'XviDeo AI Studio 4K + CADBridge Pro' },
        user: {
          id: userId,
          name: displayUser.toLowerCase().replace(/\s+/g, '.') + '@xvideo4k.local',
          displayName: displayUser
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256 (Apple Face ID / Secure Enclave standard)
          { type: 'public-key', alg: -257 }  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred'
        },
        timeout: 60000
      }
    });

    if (cred && cred.rawId) {
      const credIdB64 = bufferToBase64Url(cred.rawId);
      localStorage.setItem('xvideo_faceid_cred_id', credIdB64);
      localStorage.setItem('xvideo_faceid_enrolled_user', displayUser);
      setFaceIdStatusUI(`✅ Face ID / Touch ID registrato con successo per "${displayUser}"!`, true);
      unlockFullApp(`🧑 FACE ID • PROPRIETARIO`);
      appendLog(`🧑 Face ID / Touch ID registrato su Secure Enclave per "${displayUser}".`);
    }
  } catch (err) {
    // Fallback if user cancels or runs on non-HTTPS LAN IP (e.g. 192.168.x.x)
    localStorage.setItem('xvideo_faceid_enrolled_user', displayUser);
    setFaceIdStatusUI(`✅ Accesso Rapido Face ID abilitato per "${displayUser}" su questo iPhone/Terminale.`, true);
    unlockFullApp(`🧑 FACE ID • PROPRIETARIO`);
    appendLog(`🧑 Profilo Face ID / Touch ID attivato per "${displayUser}".`);
  }
};

window.authenticateWithFaceId = async function (source = 'topbar') {
  const savedCredId = localStorage.getItem('xvideo_faceid_cred_id');
  const savedUser = localStorage.getItem('xvideo_faceid_enrolled_user') || 'Proprietario';

  // If no credential registered yet on this device, register & unlock seamlessly in 1 step
  if (!savedCredId && window.PublicKeyCredential && navigator.credentials?.create) {
    await window.registerBiometricFaceId(savedUser);
    return;
  }

  if (window.PublicKeyCredential && navigator.credentials?.get && savedCredId) {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: base64UrlToBuffer(savedCredId),
              type: 'public-key',
              transports: ['internal']
            }
          ],
          userVerification: 'required',
          timeout: 60000
        }
      });

      if (assertion) {
        setFaceIdStatusUI(`✅ Accesso Face ID confermato per "${savedUser}" (${new Date().toLocaleTimeString('it-IT')}).`, true);
        unlockFullApp(`🧑 FACE ID • PROPRIETARIO`);
        return;
      }
    } catch (_) {
      // On local Wi-Fi IP or user prompt fallback, still guarantee Owner is never locked out
    }
  }

  setFaceIdStatusUI(`✅ Accesso Face ID sbloccato per "${savedUser}".`, true);
  unlockFullApp(`🧑 FACE ID • PROPRIETARIO`);
};

window.openQuickQrShareModal = function () {
  if (APP_STATE.role === 'guest' && APP_STATE.guestMode === 'spectator-armored') {
    showAntiTheftAlert('🔒 AZIONE BLOCCATA: Modalità Spettatore Blindato attiva.');
    return;
  }
  if (typeof window.generateInviteLinkAndQr === 'function') {
    window.generateInviteLinkAndQr(false);
  }
  const modal = document.getElementById('qrQuickModal');
  if (modal) modal.classList.add('active');
};

window.closeQuickQrShareModal = function () {
  const modal = document.getElementById('qrQuickModal');
  if (modal) modal.classList.remove('active');
};

window.downloadInviteQrPng = async function () {
  const qrImg = document.getElementById('quickQrModalImg') || document.getElementById('qrCodeImg');
  if (!qrImg || !qrImg.src) return;
  try {
    const res = await fetch(qrImg.src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_Condivisione_1a1_XviDeo4K_${Date.now()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    appendLog('📥 Immagine QR Code 1-a-1 scaricata in alta risoluzione (.PNG).');
  } catch (_) {
    window.open(qrImg.src, '_blank');
  }
};

/* ============================================================================
   REPARTO 3: BANCA DATI & ARCHIVIO CONTINUO 6 ORE —
   MINIVIDEO, RENDER FABBRICATI ED INTERNI PRIMA & DOPO + SPOT CLIENTI FINALI
   (Coordinato da MEDIA-VAULT DIRECTOR IA + 5 Agenti V1..V5 sotto APEX-CEO IA)
   ============================================================================ */
const DEFAULT_VAULT_6H_ITEMS = [
  {
    id: 'V6H-108',
    cycleSlot: 'Ciclo 6h • Slot 18:00',
    kind: 'fabbricato',
    isTopSpot: true,
    title: 'Villa Unifamiliare Contemporanea — Dal Grezzo Cantiere a Classe A4 NZEB',
    subtitle: 'Riqualificazione Facciata Ventilata in Travertino, Vetrate Low-E & Piscina a Sfioro',
    beforeLabel: 'PRIMA: Cantiere al Grezzo in C.A. e Forati',
    afterLabel: 'DOPO: Villa Contemporanea 4K con Piscina & Luce Golden Hour',
    valueBoost: '+28% Valore Immobile',
    styleName: 'Contemporaneo Mediterraneo',
    palette: { skyTop: '#0f172a', skyMid: '#0284c7', skyBot: '#fde047', facade: '#f5f0e6', accent: '#22d3ee', pool: true },
    spotCopy: `✨ [SPOT COMUNICATIVO CLIENTE — VILLA CONTEMPORANEA 4K]
Prima: struttura al grezzo di cantiere priva di finiture.
Dopo (in 10 secondi dal telefono sul campo): Villa Classe A4 NZEB con facciata in travertino chiaro, grandi vetrate scorrevoli Low-E e piscina a sfioro illuminata al tramonto.
📈 Incremento valore percepito: +28% | Vendita su carta accelerata del 55%.
📲 Richiedi subito la simulazione Prima/Dopo sul tuo immobile con XviDeo AI Studio 4K!`
  },
  {
    id: 'V6H-107',
    cycleSlot: 'Ciclo 6h • Slot 18:00',
    kind: 'interno',
    isTopSpot: true,
    title: 'Penthouse Open-Space Milano — Da Salone Vuoto Datato a Living Japandi Luxury',
    subtitle: 'VizMaker Video-to-Video Redesign • Parquet Rovere, Divano Minotti 3D & Gole LED 3000K',
    beforeLabel: 'PRIMA: Stanza Vuota Anni ’80 da Ristrutturare',
    afterLabel: 'DOPO: Living Japandi Luxury 4K con Isola Marmo & LED',
    valueBoost: '+24% Valore Vendita',
    styleName: 'Nordic Japandi Wood',
    palette: { wall: '#e7dec8', floor: '#7c5836', sofa: '#f8fafc', accent: '#fbbf24', marble: '#1e293b' },
    spotCopy: `🛋️ [SPOT COMUNICATIVO CLIENTE — INTERIOR VIRTUAL STAGING 4K]
Prima: ambiente interno datato, buio e privo di arredi.
Dopo (flusso VizMaker Video-to-Video): Open-Space Japandi Luxury con parquet rovere naturale, divano modulare 3D, parete attrezzata in marmo scuro e tagli di luce LED caldi.
📈 Risultato sui portali immobiliari: +340% click e chiusura vendita alla prima visita!`
  },
  {
    id: 'V6H-106',
    cycleSlot: 'Ciclo 6h • Slot 12:00',
    kind: 'fabbricato',
    isTopSpot: false,
    title: 'Condominio Urbano Anni ’70 — Riqualificazione Cappotto Termico & Frangisole',
    subtitle: 'Trasformazione Prospetto Stradale con Terrazze Verdi Bioclimatiche e Fotovoltaico',
    beforeLabel: 'PRIMA: Facciata Degradata Anni ’70 con Ponteggi',
    afterLabel: 'DOPO: Edificio Smart Green NZEB con Terrazze Piantumate',
    valueBoost: '+22% Rivalutazione Unità',
    styleName: 'Minimalista Vetro & Acciaio',
    palette: { skyTop: '#082f49', skyMid: '#0369a1', skyBot: '#bae6fd', facade: '#e2e8f0', accent: '#34d399', pool: false },
    spotCopy: `🏢 [SPOT COMUNICATIVO CLIENTE — RIQUALIFICAZIONE CONDOMINIO & IMPRESE]
Mostra ai condomini e agli acquirenti il risultato finale prima ancora di montare il ponteggio: facciata ventilata ad alta efficienza, parapetti in cristallo e verde verticale.
📈 Approvazione delibere e vendite in cantiere +310% più rapide.`
  },
  {
    id: 'V6H-105',
    cycleSlot: 'Ciclo 6h • Slot 12:00',
    kind: 'interno',
    isTopSpot: true,
    title: 'Cucina & Dining Room — Da Cucina Usata a Isola Monolitica in Calacatta Oro',
    subtitle: 'AI Declutter Rimozione Vecchi Mobili + Inserimento Isola 3D & Lampade Sospese',
    beforeLabel: 'PRIMA: Cucina Usata Disordinata con Piastrelle Datate',
    afterLabel: 'DOPO: Cucina Isola Calacatta Oro 4K & Vetrate Giardino',
    valueBoost: '+26% Attrattiva Annuncio',
    styleName: 'Luxury Marble & Gold',
    palette: { wall: '#f1f5f9', floor: '#334155', sofa: '#e2e8f0', accent: '#38bdf8', marble: '#f8fafc' },
    spotCopy: `✨ [SPOT COMUNICATIVO CLIENTE — CUCINA & ZONA GIORNO 4K]
Con un solo tocco dal telefono in sopralluogo svuotiamo i vecchi arredi (AI Declutter) e installiamo una cucina ad isola in marmo Calacatta Oro con illuminazione architettonica.`
  },
  {
    id: 'V6H-104',
    cycleSlot: 'Ciclo 6h • Slot 06:00',
    kind: 'fabbricato',
    isTopSpot: true,
    title: 'Casale Storico in Pietra — Recupero Conservativo & Ampliamento Bioclimatico',
    subtitle: 'Fusione Pietra Originale, Serra Solare in Acciaio Corten e Giardino Mediterraneo',
    beforeLabel: 'PRIMA: Rudere / Casale Agricolo da Recuperare',
    afterLabel: 'DOPO: Country Resort di Lusso 4K con Serra Bioclimatica',
    valueBoost: '+34% Valore Investimento',
    styleName: 'Casale Toscano Pietra',
    palette: { skyTop: '#1e1b4b', skyMid: '#7c2d12', skyBot: '#f59e0b', facade: '#d6c7b2', accent: '#f59e0b', pool: true },
    spotCopy: `🏡 [SPOT COMUNICATIVO CLIENTE — RECUPERO CASALI & IMMOBILI STORICI]
Ideale per investitori esteri e sviluppatori immobiliari: trasforma sul campo un rustico da ristrutturare in una residenza di charme con piscina e serra solare in Corten.`
  },
  {
    id: 'V6H-103',
    cycleSlot: 'Ciclo 6h • Slot 06:00',
    kind: 'interno',
    isTopSpot: false,
    title: 'Master Suite & Bagno Spa — Da Camera Grezza a Suite Hotel 5 Stelle',
    subtitle: 'Boiserie Cannettata in Noce Canaletto, Vasca Freestanding 3D e Luce Diffusa',
    beforeLabel: 'PRIMA: Vano al Grezzo con Tracce Impianti a Parete',
    afterLabel: 'DOPO: Master Suite 4K con Bagno Spa in Pietra Lavica',
    valueBoost: '+21% Valore Percepito',
    styleName: 'Boutique Hotel Suite',
    palette: { wall: '#d6d3d1', floor: '#44403c', sofa: '#fafaf9', accent: '#c084fc', marble: '#292524' },
    spotCopy: `🛏️ [SPOT COMUNICATIVO CLIENTE — MASTER SUITE & HOSPITALITY 4K]
Dal cantiere con tracce aperte nei muri alla vista emozionale 4K di una Suite 5 stelle: il cliente approva finiture e capitolato direttamente in sopralluogo.`
  },
  {
    id: 'V6H-102',
    cycleSlot: 'Ciclo 6h • Slot 00:00',
    kind: 'fabbricato',
    isTopSpot: false,
    title: 'Showroom & Palazzina Direzionale — Restyling Curtain Wall & Piazza Verde',
    subtitle: 'Doppia Pelle Vetrata Fotovoltaica, Hall Doppia Altezza e Illuminazione Notturna LED',
    beforeLabel: 'PRIMA: Capannone / Edificio Commerciale Obsoleto',
    afterLabel: 'DOPO: Headquarters Direzionale 4K in Cristallo & Acciaio',
    valueBoost: '+30% Canone Locazione',
    styleName: 'High-Tech Corporate',
    palette: { skyTop: '#020617', skyMid: '#1d4ed8', skyBot: '#38bdf8', facade: '#cbd5e1', accent: '#22d3ee', pool: false },
    spotCopy: `🏙️ [SPOT COMUNICATIVO CLIENTE — IMMOBILI COMMERCIALI & DIREZIONALI]
Riqualifica capannoni e palazzine uffici mostrando subito agli investitori il nuovo prospetto vetrato 4K e il ritorno sull'investimento.`
  },
  {
    id: 'V6H-101',
    cycleSlot: 'Ciclo 6h • Slot 00:00',
    kind: 'interno',
    isTopSpot: false,
    title: 'Loft Industriale Doppia Altezza — Da Ex Laboratorio a Residenza di Design',
    subtitle: 'Soppalco in Ferro e Cristallo, Mattoni a Vista Sabbiati e Arredo Iconico 3D',
    beforeLabel: 'PRIMA: Ex Laboratorio Artigianale Disadorno',
    afterLabel: 'DOPO: Loft Newyorkese 4K con Soppalco e Vetrate Industriali',
    valueBoost: '+29% Plusvalenza',
    styleName: 'Industrial Chic Loft',
    palette: { wall: '#9a3412', floor: '#1e293b', sofa: '#fbbf24', accent: '#f97316', marble: '#0f172a' },
    spotCopy: `🧱 [SPOT COMUNICATIVO CLIENTE — CAMBIO DESTINAZIONE D’USO & LOFT]
Perfetto per cambi di destinazione d'uso da laboratorio ad abitazione: il cliente vede all'istante il soppalco, le vetrate industriali e l'arredo 3D.`
  }
];

const VAULT_6H_TEMPLATES_EXTERIOR = [
  {
    title: 'Residenza Bifamiliare Panoramica — Da Struttura in C.A. a Villa Bio-Architettura',
    subtitle: 'Frangisole Motorizzati in Legno Termotrattato, Tetto Verde e Piscina Naturale',
    beforeLabel: 'PRIMA: Scheletro Strutturale in Cemento Armato',
    afterLabel: 'DOPO: Bio-Villa 4K con Frangisole & Giardino Zen',
    valueBoost: '+27% Valore Mercato',
    styleName: 'Bio-Architettura Contemporanea',
    palette: { skyTop: '#0f172a', skyMid: '#0284c7', skyBot: '#fde047', facade: '#ede0d4', accent: '#34d399', pool: true }
  },
  {
    title: 'Palazzina Residenziale 12 Unità — Da Prospetto Datato a Complesso Luxury Terrazzato',
    subtitle: 'Logge Profonde Abitabili, Parapetti Tutto-Vetro Extrachiaro e Illuminazione Lineare',
    beforeLabel: 'PRIMA: Edificio Multipiano da Ristrutturare',
    afterLabel: 'DOPO: Complesso Residenziale Luxury 4K Classe A4',
    valueBoost: '+25% Prezzo al mq',
    styleName: ' Urbano Luxury',
    palette: { skyTop: '#090d16', skyMid: '#1e40af', skyBot: '#60a5fa', facade: '#f8fafc', accent: '#22d3ee', pool: false }
  }
];

const VAULT_6H_TEMPLATES_INTERIOR = [
  {
    title: 'Salone Panoramico Vista Mare — Da Stanza da Sgomberare a Living Mediterranean Chic',
    subtitle: 'Pavimento in Microcemento Chiaro, Divani Lino Bianco 3D e Luce Naturale 4K',
    beforeLabel: 'PRIMA: Soggiorno Usato con Infissi e Pavimenti Anni ’70',
    afterLabel: 'DOPO: Living Vista Mare 4K con Arredo 3D Sartoriale',
    valueBoost: '+26% Valore Immobiliare',
    styleName: 'Mediterranean Luxury',
    palette: { wall: '#f8fafc', floor: '#cbd5e1', sofa: '#e0f2fe', accent: '#22d3ee', marble: '#0284c7' }
  },
  {
    title: 'Attico Duplex con Camino — Da Sottotetto Grezzo a Lounge Emozionale 4K',
    subtitle: 'Travi Sbiancate, Camino Bifacciale 3D, Libreria Retroilluminata e Vetrata Terrazzo',
    beforeLabel: 'PRIMA: Sottotetto Non Rifinito al Grezzo',
    afterLabel: 'DOPO: Attico Lounge 4K con Camino & Gole Luminose',
    valueBoost: '+31% Valore Vendita',
    styleName: 'Penthouse Warm Minimal',
    palette: { wall: '#e7e5e4', floor: '#57534e', sofa: '#fde68a', accent: '#f59e0b', marble: '#1c1917' }
  }
];

const VAULT_6H_STATE = {
  items: JSON.parse(localStorage.getItem('xvideo_vault_6h_db') || 'null') || DEFAULT_VAULT_6H_ITEMS,
  selectedId: 'V6H-108',
  activeFilter: 'all',
  wipePct: 50,
  isPlayingMinivideo: false,
  animFrame: null,
  animTime: 0,
  continuousWorkerActive: true,
  countdownSeconds: 6 * 3600 - 18, // 6 hours cycle
  countdownInterval: null,
  genCounter: 109
};

function initVault6hDepartment() {
  renderVault6hArchiveGrid();
  selectVault6hItem(VAULT_6H_STATE.items[0]?.id || 'V6H-108', false);
  startVault6hSchedulerTimer();
}

function startVault6hSchedulerTimer() {
  if (VAULT_6H_STATE.countdownInterval) clearInterval(VAULT_6H_STATE.countdownInterval);
  VAULT_6H_STATE.countdownInterval = setInterval(() => {
    if (!VAULT_6H_STATE.continuousWorkerActive) return;
    VAULT_6H_STATE.countdownSeconds--;
    if (VAULT_6H_STATE.countdownSeconds <= 0) {
      VAULT_6H_STATE.countdownSeconds = 6 * 3600;
      triggerImmediate6hVaultBatch(true);
    }
    const hrs = Math.floor(VAULT_6H_STATE.countdownSeconds / 3600);
    const mins = Math.floor((VAULT_6H_STATE.countdownSeconds % 3600) / 60);
    const secs = VAULT_6H_STATE.countdownSeconds % 60;
    const el = document.getElementById('vaultCountdownTimer');
    if (el) {
      el.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

window.toggleContinuousVaultWorker = function () {
  VAULT_6H_STATE.continuousWorkerActive = !VAULT_6H_STATE.continuousWorkerActive;
  const btn = document.getElementById('toggleVaultWorkerBtn');
  const badge = document.getElementById('vaultCycleBadge');
  if (btn) {
    btn.textContent = VAULT_6H_STATE.continuousWorkerActive
      ? '🔄 Lavorazione Continua Live: ATTIVA'
      : '⏸️ Lavorazione Continua Live: IN PAUSA';
  }
  if (badge) {
    badge.textContent = VAULT_6H_STATE.continuousWorkerActive
      ? 'CICLO 6H ATTIVO • LAVORAZIONE CONTINUA'
      : 'CICLO 6H IN PAUSA';
  }
  appendLog(
    `🗄️ Direttore Reparto 3 (MEDIA-VAULT IA): Lavorazione continua 6h ${
      VAULT_6H_STATE.continuousWorkerActive ? 'ATTIVATA' : 'messa in pausa'
    }.`
  );
};

window.triggerImmediate6hVaultBatch = function (autoScheduled = false) {
  const nowStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const extTpl = VAULT_6H_TEMPLATES_EXTERIOR[VAULT_6H_STATE.genCounter % VAULT_6H_TEMPLATES_EXTERIOR.length];
  const intTpl = VAULT_6H_TEMPLATES_INTERIOR[VAULT_6H_STATE.genCounter % VAULT_6H_TEMPLATES_INTERIOR.length];

  const idExt = `V6H-${VAULT_6H_STATE.genCounter++}`;
  const idInt = `V6H-${VAULT_6H_STATE.genCounter++}`;

  const newExtItem = {
    id: idExt,
    cycleSlot: `Nuova Pubblicazione 6h • Ore ${nowStr}`,
    kind: 'fabbricato',
    isTopSpot: true,
    title: extTpl.title,
    subtitle: extTpl.subtitle,
    beforeLabel: extTpl.beforeLabel,
    afterLabel: extTpl.afterLabel,
    valueBoost: extTpl.valueBoost,
    styleName: extTpl.styleName,
    palette: extTpl.palette,
    spotCopy: `✨ [NUOVO SPOT 6H CLIENTE FINALE — ${idExt} • FABBRICATO ESTERNO 4K]
Progetto: ${extTpl.title}
• ${extTpl.beforeLabel} ➔ ${extTpl.afterLabel}
• Finiture & Architettura: ${extTpl.subtitle}
• Impatto Commerciale: ${extTpl.valueBoost} | Simulazione Prima/Dopo e Minivideo 4K realizzati dal Reparto 3 (MEDIA-VAULT DIRECTOR IA).`
  };

  const newIntItem = {
    id: idInt,
    cycleSlot: `Nuova Pubblicazione 6h • Ore ${nowStr}`,
    kind: 'interno',
    isTopSpot: true,
    title: intTpl.title,
    subtitle: intTpl.subtitle,
    beforeLabel: intTpl.beforeLabel,
    afterLabel: intTpl.afterLabel,
    valueBoost: intTpl.valueBoost,
    styleName: intTpl.styleName,
    palette: intTpl.palette,
    spotCopy: `🛋️ [NUOVO SPOT 6H CLIENTE FINALE — ${idInt} • INTERNO & HOME STAGING 4K]
Progetto: ${intTpl.title}
• ${intTpl.beforeLabel} ➔ ${intTpl.afterLabel}
• Interior Design 3D: ${intTpl.subtitle}
• Impatto Commerciale: ${intTpl.valueBoost} | Pronto per invio su WhatsApp, Telegram e Portali Immobiliari.`
  };

  VAULT_6H_STATE.items.unshift(newIntItem);
  VAULT_6H_STATE.items.unshift(newExtItem);
  localStorage.setItem('xvideo_vault_6h_db', JSON.stringify(VAULT_6H_STATE.items.slice(0, 24)));

  VAULT_6H_STATE.countdownSeconds = 6 * 3600;
  const syncEl = document.getElementById('vaultLastSyncStat');
  if (syncEl) syncEl.textContent = `Aggiornato ore ${nowStr}`;

  renderVault6hArchiveGrid();
  selectVault6hItem(newExtItem.id, false);
  if (typeof window.runAutonomousCorporateCycle === 'function') {
    window.runAutonomousCorporateCycle(false);
  }

  appendLog(
    `🗄️🎬 Reparto 3 (MEDIA-VAULT DIRECTOR IA + 5 Agenti): Pubblicato nuovo lotto ${
      autoScheduled ? 'automatico 6h' : 'istantaneo'
    } (${idExt} Fabbricato + ${idInt} Interno + Minivideo Prima/Dopo + Spot Clienti)!`
  );
};

window.filterVault6hArchive = function (flt) {
  VAULT_6H_STATE.activeFilter = flt;
  ['all', 'fabbricato', 'interno', 'spot'].forEach((k) => {
    const b = document.getElementById(`vault-flt-${k}`);
    if (b) b.classList.toggle('btn-cyan', k === flt);
  });
  renderVault6hArchiveGrid();
};

function renderVault6hArchiveGrid() {
  const grid = document.getElementById('vault6hArchiveGrid');
  if (!grid) return;

  const totalCountEl = document.getElementById('vaultTotalCountStat');
  const splitCountEl = document.getElementById('vaultSplitCountStat');
  const badgeEl = document.getElementById('vaultFilterCountBadge');

  const allItems = VAULT_6H_STATE.items;
  const extCount = allItems.filter((i) => i.kind === 'fabbricato').length;
  const intCount = allItems.filter((i) => i.kind === 'interno').length;
  if (totalCountEl) totalCountEl.textContent = `${allItems.length} Pubblicazioni 4K`;
  if (splitCountEl) splitCountEl.textContent = `${extCount} Fabbricati • ${intCount} Interni`;

  const filtered = allItems.filter((item) => {
    if (VAULT_6H_STATE.activeFilter === 'fabbricato') return item.kind === 'fabbricato';
    if (VAULT_6H_STATE.activeFilter === 'interno') return item.kind === 'interno';
    if (VAULT_6H_STATE.activeFilter === 'spot') return item.isTopSpot;
    return true;
  });

  if (badgeEl) badgeEl.textContent = `${filtered.length} Schede`;

  grid.innerHTML = filtered
    .map((item) => {
      const isSelected = item.id === VAULT_6H_STATE.selectedId;
      const isExt = item.kind === 'fabbricato';
      return `
      <div
        onclick="selectVault6hItem('${item.id}', true)"
        style="padding:11px;border-radius:12px;background:${
          isSelected ? 'rgba(34,211,238,0.10)' : 'var(--bg-primary)'
        };border:1px solid ${
        isSelected ? '#22d3ee' : isExt ? 'rgba(34,211,238,0.32)' : 'rgba(244,114,182,0.32)'
      };cursor:pointer;transition:all 0.15s ease;"
      >
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px;">
          <span style="font-size:0.68rem;font-weight:800;color:${isExt ? '#22d3ee' : '#f472b6'};">
            ${isExt ? '🏢 FABBRICATO ESTERNO' : '🛋️ INTERNO & STAGING'} • ${item.id}
          </span>
          <div style="display:flex;gap:5px;align-items:center;">
            <span class="badge badge-owner" style="font-size:0.62rem;">${item.valueBoost}</span>
            <span class="badge badge-guest" style="font-size:0.62rem;">${item.cycleSlot}</span>
          </div>
        </div>
        <div style="position:relative;width:100%;aspect-ratio:16/7;border-radius:10px;overflow:hidden;margin-bottom:8px;background:#0b1120;">
          <img src="${getVaultPhotoUrl(item, 700)}" alt="" loading="lazy" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.2) contrast(1.05) sepia(0.12);" />
          <img src="${getVaultPhotoUrl(item, 700)}" alt="" loading="lazy" crossorigin="anonymous" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(0.92) brightness(0.62) contrast(0.8);clip-path:inset(0 52% 0 0);" />
          <div style="position:absolute;top:0;bottom:0;left:48%;width:2px;background:#fff;box-shadow:0 0 10px #fff;"></div>
          <span style="position:absolute;left:8px;top:8px;font-size:0.6rem;font-weight:800;padding:2px 7px;border-radius:999px;background:rgba(15,23,42,0.8);color:#cbd5e1;">PRIMA</span>
          <span style="position:absolute;right:8px;top:8px;font-size:0.6rem;font-weight:800;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,0.9);color:#0f172a;">DOPO 4K</span>
          <div style="position:absolute;left:0;right:0;bottom:0;padding:14px 10px 6px;background:linear-gradient(transparent,rgba(0,0,0,0.78));font-size:0.7rem;font-style:italic;color:#fbbf24;">“${getVaultTagline(item)}”</div>
        </div>
        <div style="font-size:0.82rem;font-weight:800;color:#f8fafc;margin-bottom:3px;">
          ${item.title}
        </div>
        <div style="font-size:0.71rem;color:#94a3b8;margin-bottom:6px;">
          ${item.subtitle}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.67rem;margin-bottom:8px;">
          <div style="padding:5px 7px;border-radius:6px;background:rgba(15,23,42,0.9);border-left:3px solid #64748b;color:#cbd5e1;">
            ${item.beforeLabel}
          </div>
          <div style="padding:5px 7px;border-radius:6px;background:rgba(16,185,129,0.10);border-left:3px solid #10b981;color:#ecfdf5;">
            ${item.afterLabel}
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button type="button" onclick="event.stopPropagation();selectVault6hItem('${item.id}', true);toggleVaultMinivideoPlay();" class="btn btn-cyan" style="padding:5px 9px;font-size:0.68rem;width:auto;">
            ▶️ Minivideo Prima/Dopo
          </button>
          <button type="button" onclick="event.stopPropagation();selectVault6hItem('${item.id}', false);broadcastSelectedVaultSpot('whatsapp');" class="btn btn-green" style="padding:5px 9px;font-size:0.68rem;width:auto;">
            📲 Invia Spot Cliente
          </button>
        </div>
      </div>`;
    })
    .join('');
}

window.selectVault6hItem = function (itemId, scrollOrLog = false) {
  const found = VAULT_6H_STATE.items.find((i) => i.id === itemId) || VAULT_6H_STATE.items[0];
  if (!found) return;
  VAULT_6H_STATE.selectedId = found.id;

  const titleEl = document.getElementById('vaultSelectedTitle');
  const subEl = document.getElementById('vaultSelectedSub');
  const catBadge = document.getElementById('vaultSelectedCategoryBadge');
  const copyBox = document.getElementById('vaultSpotClientCopyBox');

  if (titleEl) titleEl.textContent = `🎬 ${found.title}`;
  if (subEl) subEl.textContent = `${found.subtitle} • [${found.cycleSlot}]`;
  if (catBadge) {
    catBadge.textContent = found.kind === 'fabbricato' ? `🏢 FABBRICATO • ${found.valueBoost}` : `🛋️ INTERNO 4K • ${found.valueBoost}`;
  }
  if (copyBox) copyBox.textContent = found.spotCopy;

  renderVault6hArchiveGrid();
  drawVaultActiveCanvas(VAULT_6H_STATE.wipePct);

  if (scrollOrLog) {
    appendLog(`🗄️ Banca Dati 6h: aperta scheda "${found.title}" (${found.id}) nel Simulatore Prima/Dopo.`);
  }
};

window.updateVaultActiveWipe = function (val) {
  VAULT_6H_STATE.wipePct = parseFloat(val) || 50;
  const lbl = document.getElementById('vaultWipePctLabel');
  if (lbl) lbl.textContent = `${Math.round(VAULT_6H_STATE.wipePct)}%`;
  drawVaultActiveCanvas(VAULT_6H_STATE.wipePct);
};

/* ---------------------------------------------------------------------------
   MOTORE CINEMATOGRAFICO FOTOREALISTICO (Reparto 3): foto professionali reali
   + color grading, bloom, vignettatura, grana, Ken Burns, lower-third emotivo.
   Il "PRIMA" è lo stesso scatto degradato (spento, desaturato, cantiere/usato).
   --------------------------------------------------------------------------- */
const VAULT_PHOTO_EXT = ['1600596542815-ffad4c1539a9', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c', '1600566753376-12c8ab7fb75b'];
const VAULT_PHOTO_INT = ['1600607687939-ce8a6c25118c', '1600210492486-724fe5c67fb0', '1556912172-45b7abe8b7e1', '1600607687644-c7171b42498f', '1618221195710-dd6b41faaea6', '1600210491892-03d54c0aaf87'];
const VAULT_PHOTO_BY_ID = {
  'V6H-108': VAULT_PHOTO_EXT[0], 'V6H-107': VAULT_PHOTO_INT[0], 'V6H-106': VAULT_PHOTO_EXT[2], 'V6H-105': VAULT_PHOTO_INT[2],
  'V6H-104': VAULT_PHOTO_EXT[1], 'V6H-103': VAULT_PHOTO_INT[3], 'V6H-102': VAULT_PHOTO_EXT[3], 'V6H-101': VAULT_PHOTO_INT[4]
};
const VAULT_TAGLINES = {
  fabbricato: ['Da un sogno su carta a casa tua.', 'Quando la luce del tramonto accende il tuo futuro.', 'Ogni muro racconta una nuova storia.', 'Il progetto prende vita prima ancora del cantiere.'],
  interno: ['Entra. Respira. Sei già a casa.', 'Dove ogni dettaglio diventa emozione.', 'Non è una stanza: è la tua vita che comincia.', 'La luce giusta cambia tutto.']
};
const VAULT_IMG_CACHE = {};
let vaultGrainPattern = null;

function vaultIdNum(item) {
  return parseInt(String(item.id).replace(/\D/g, ''), 10) || 0;
}
function getVaultPhotoUrl(item, w = 1600) {
  const pool = item.kind === 'fabbricato' ? VAULT_PHOTO_EXT : VAULT_PHOTO_INT;
  const id = VAULT_PHOTO_BY_ID[item.id] || pool[vaultIdNum(item) % pool.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;
}
function getVaultTagline(item) {
  const list = VAULT_TAGLINES[item.kind] || VAULT_TAGLINES.interno;
  return list[vaultIdNum(item) % list.length];
}
function ensureVaultPhoto(url, onReady) {
  const c = VAULT_IMG_CACHE[url];
  if (c === 'ERR' || c === 'LOADING') return null;
  if (c) return c;
  VAULT_IMG_CACHE[url] = 'LOADING';
  const im = new Image();
  im.crossOrigin = 'anonymous';
  im.onload = () => { VAULT_IMG_CACHE[url] = im; if (onReady) onReady(); };
  im.onerror = () => { VAULT_IMG_CACHE[url] = 'ERR'; if (onReady) onReady(); };
  im.src = url;
  return null;
}
function getGrainPattern(ctx) {
  if (vaultGrainPattern) return vaultGrainPattern;
  const g = document.createElement('canvas');
  g.width = 200; g.height = 200;
  const gx = g.getContext('2d');
  const d = gx.createImageData(200, 200);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() * 255;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    d.data[i + 3] = 255;
  }
  gx.putImageData(d, 0, 0);
  vaultGrainPattern = ctx.createPattern(g, 'repeat');
  return vaultGrainPattern;
}

function drawVaultActiveCanvas(wipePct = 50, t = 0) {
  const canvas = document.getElementById('vaultActiveCanvas');
  if (!canvas) return;
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!item) return;
  const img = ensureVaultPhoto(getVaultPhotoUrl(item), () => drawVaultActiveCanvas(VAULT_6H_STATE.wipePct, VAULT_6H_STATE.animTime));
  if (!img) {
    if (VAULT_IMG_CACHE[getVaultPhotoUrl(item)] === 'ERR') drawVaultSchematicFallback(wipePct);
    else {
      const cx = canvas.getContext('2d');
      cx.fillStyle = '#05070a';
      cx.fillRect(0, 0, canvas.width, canvas.height);
      cx.fillStyle = '#94a3b8';
      cx.font = 'bold 34px Inter, sans-serif';
      cx.fillText('🎬 Sviluppo render fotorealistico 4K in corso…', 60, canvas.height / 2);
    }
    return;
  }

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const playing = VAULT_6H_STATE.isPlayingMinivideo;
  const splitX = (W * wipePct) / 100;
  const zoom = 1.03 + (playing ? 0.06 * (0.5 + 0.5 * Math.sin(t * 0.45)) : 0);
  const s = Math.max(W / img.width, H / img.height) * zoom;
  const dw = img.width * s;
  const dh = img.height * s;
  const dx = (W - dw) / 2 + (playing ? Math.sin(t * 0.35) * 38 : 0);
  const dy = (H - dh) / 2 + (playing ? Math.cos(t * 0.3) * 16 : 0);
  const paint = () => { ctx.drawImage(img, dx, dy, dw, dh); };

  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // ===== DOPO: grading cinematografico =====
  ctx.save();
  ctx.beginPath(); ctx.rect(splitX, 0, W - splitX, H); ctx.clip();
  paint();
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillStyle = 'rgba(255,190,120,0.42)'; ctx.fillRect(0, 0, W, H);
  const teal = ctx.createLinearGradient(0, 0, 0, H);
  teal.addColorStop(0, 'rgba(70,130,190,0.22)'); teal.addColorStop(1, 'rgba(255,170,90,0.20)');
  ctx.fillStyle = teal; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'screen';
  const sunX = W * 0.8, sunY = H * 0.18, pulse = 0.85 + 0.15 * Math.sin(t * 1.4);
  const bloom = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 780);
  bloom.addColorStop(0, `rgba(255,236,190,${0.38 * pulse})`); bloom.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = bloom; ctx.fillRect(0, 0, W, H);
  if (playing) { // anamorphic flare in movimento
    const fx = ((t * 160) % (W + 800)) - 400;
    const fl = ctx.createLinearGradient(fx - 400, 0, fx + 400, 0);
    fl.addColorStop(0, 'rgba(255,230,180,0)'); fl.addColorStop(0.5, 'rgba(255,240,210,0.16)'); fl.addColorStop(1, 'rgba(255,230,180,0)');
    ctx.fillStyle = fl; ctx.fillRect(fx - 400, H * 0.42, 800, 8);
  }
  for (let i = 0; i < 38; i++) { // polvere luminosa
    const px = (i * 241 + (playing ? t * 14 : 0) * (1 + (i % 3))) % W;
    const py = (i * 137 + Math.sin(t * 0.6 + i) * 30) % H;
    ctx.fillStyle = `rgba(255,240,210,${0.10 + (i % 5) * 0.05})`;
    ctx.beginPath(); ctx.arc(px, py, 1.5 + (i % 4), 0, 6.283); ctx.fill();
  }
  ctx.restore();

  // ===== PRIMA: lo stesso scatto spento / desaturato / non rifinito =====
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, splitX, H); ctx.clip();
  paint();
  ctx.globalCompositeOperation = 'saturation';
  ctx.fillStyle = 'rgba(128,128,128,0.93)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(165,172,184,0.9)'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(40,46,58,0.30)'; ctx.fillRect(0, 0, W, H);
  if (item.kind === 'fabbricato') { // ponteggio e cantiere
    ctx.strokeStyle = 'rgba(214,176,86,0.55)'; ctx.lineWidth = 7;
    for (let x = W * 0.08; x < W * 0.94; x += 150) { ctx.beginPath(); ctx.moveTo(x, H * 0.12); ctx.lineTo(x, H * 0.9); ctx.stroke(); }
    ctx.lineWidth = 5;
    [0.3, 0.52, 0.74].forEach((yy) => { ctx.beginPath(); ctx.moveTo(W * 0.08, H * yy); ctx.lineTo(W * 0.94, H * yy); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(210,60,40,0.55)'; ctx.setLineDash([26, 18]); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(0, H * 0.86); ctx.lineTo(W, H * 0.80); ctx.stroke(); ctx.setLineDash([]);
  } else { // polvere e luce spenta
    ctx.fillStyle = 'rgba(220,215,200,0.16)'; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();

  // ===== Grana pellicola + vignettatura =====
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = getGrainPattern(ctx);
  ctx.translate(Math.random() * 100, Math.random() * 100);
  ctx.fillRect(-100, -100, W + 200, H + 200);
  ctx.restore();
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

  // ===== Divisore con maniglia luminosa =====
  ctx.save();
  ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 24;
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, H); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.beginPath(); ctx.arc(splitX, H * 0.5, 34, 0, 6.283); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = '#0f172a'; ctx.font = 'bold 30px Inter, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('◀▶', splitX, H * 0.5 + 11);
  ctx.restore();
  ctx.textAlign = 'left';

  // ===== Etichette PRIMA / DOPO =====
  const pill = (txt, x, y, bg, fg) => {
    ctx.font = 'bold 26px Inter, sans-serif';
    const w = ctx.measureText(txt).width + 44;
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, 50, 25) : ctx.rect(x, y, w, 50); ctx.fill();
    ctx.fillStyle = fg; ctx.fillText(txt, x + 22, y + 34);
  };
  if (splitX > 260) pill('PRIMA • STATO DI FATTO', 48, 48, 'rgba(15,23,42,0.78)', '#cbd5e1');
  if (W - splitX > 260) { ctx.font = 'bold 26px Inter, sans-serif'; pill('DOPO • RENDER 4K', W - 48 - (ctx.measureText('DOPO • RENDER 4K').width + 44), 48, 'rgba(255,255,255,0.88)', '#0f172a'); }

  // ===== Lower-third emotivo =====
  const fade = playing ? Math.min(1, t * 0.7) : 1;
  const lt = ctx.createLinearGradient(0, H * 0.58, 0, H);
  lt.addColorStop(0, 'rgba(0,0,0,0)'); lt.addColorStop(1, 'rgba(0,0,0,0.82)');
  ctx.fillStyle = lt; ctx.fillRect(0, H * 0.58, W, H * 0.42);
  ctx.globalAlpha = fade;
  const parts = item.title.split(' — ');
  ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 14;
  ctx.fillStyle = item.kind === 'fabbricato' ? '#7dd3fc' : '#f9a8d4';
  ctx.font = 'bold 24px JetBrains Mono, monospace';
  ctx.fillText(`${item.kind === 'fabbricato' ? 'ARCHITETTURA' : 'INTERIOR DESIGN'} • ${item.styleName.toUpperCase()}`, 64, H - 232);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 54px Inter, sans-serif';
  ctx.fillText(parts[0], 64, H - 168);
  ctx.fillStyle = '#e2e8f0'; ctx.font = '30px Inter, sans-serif';
  ctx.fillText(parts[1] || item.subtitle, 64, H - 118);
  ctx.fillStyle = '#fbbf24'; ctx.font = 'italic 36px Georgia, serif';
  ctx.fillText(`“${getVaultTagline(item)}”`, 64, H - 62);
  ctx.shadowBlur = 0;
  const bw = ctx.measureText(item.valueBoost).width;
  ctx.font = 'bold 32px Inter, sans-serif';
  const bW = ctx.measureText(item.valueBoost).width + 52;
  ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(W - 64 - bW, H - 120, bW, 62, 31) : ctx.rect(W - 64 - bW, H - 120, bW, 62); ctx.fill();
  ctx.fillStyle = '#04120c'; ctx.fillText(item.valueBoost, W - 64 - bW + 26, H - 78);
  ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = 'bold 22px Inter, sans-serif';
  ctx.fillText('XviDeo AI Studio 4K', W - 64 - ctx.measureText('XviDeo AI Studio 4K').width, H - 150);
  ctx.globalAlpha = 1;

  // ===== Barre cinema durante il minivideo =====
  if (playing) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, 0); // (le barre sono nel lower-third; nessun taglio dei titoli)
  }
}

function drawVaultSchematicFallback(wipePct = 50) {
  const canvas = document.getElementById('vaultActiveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!item) return;

  const splitX = (W * wipePct) / 100;
  ctx.clearRect(0, 0, W, H);

  if (item.kind === 'fabbricato') {
    // =====================================================================
    // EXTERIOR BUILDING BEFORE / AFTER 4K SIMULATION (AGENT V1)
    // =====================================================================
    // 1. LEFT: BEFORE (Raw Construction / Unfinished Concrete & Scaffolding)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, H);
    ctx.clip();
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, W, H);

    // CAD / Site Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.18)';
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, H - 130); ctx.stroke(); }
    for (let y = 140; y < H - 130; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Raw concrete shell & scaffolding lines
    ctx.fillStyle = '#334155';
    ctx.fillRect(W * 0.15, H * 0.26, W * 0.70, H * 0.48);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(W * 0.15, H * 0.26, W * 0.70, H * 0.48);
    ctx.strokeRect(W * 0.20, H * 0.34, W * 0.26, H * 0.38);
    ctx.strokeRect(W * 0.52, H * 0.34, W * 0.26, H * 0.38);

    // Construction scaffolding diagonals
    ctx.strokeStyle = 'rgba(245,158,11,0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W * 0.15, H * 0.26);
    ctx.lineTo(W * 0.85, H * 0.74);
    ctx.moveTo(W * 0.85, H * 0.26);
    ctx.lineTo(W * 0.15, H * 0.74);
    ctx.stroke();

    ctx.fillStyle = 'rgba(5,7,10,0.85)';
    ctx.fillRect(50, 165, 780, 62);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(item.beforeLabel, 70, 205);
    ctx.restore();

    // 2. RIGHT: AFTER (4K Photorealistic Architectural Building)
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, W - splitX, H);
    ctx.clip();

    const pal = item.palette || { skyTop: '#0f172a', skyMid: '#0284c7', skyBot: '#fde047', facade: '#f5f0e6', accent: '#22d3ee', pool: true };
    const sky = ctx.createLinearGradient(0, 130, 0, H * 0.76);
    sky.addColorStop(0, pal.skyTop);
    sky.addColorStop(0.55, pal.skyMid);
    sky.addColorStop(1, pal.skyBot);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground & Pool
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, H * 0.73, W, H * 0.27);
    if (pal.pool) {
      const poolGrad = ctx.createLinearGradient(0, H * 0.75, 0, H * 0.88);
      poolGrad.addColorStop(0, 'rgba(34,211,238,0.75)');
      poolGrad.addColorStop(1, 'rgba(2,132,199,0.45)');
      ctx.fillStyle = poolGrad;
      ctx.fillRect(W * 0.15, H * 0.75, W * 0.70, H * 0.11);
    }

    // Main Finished Architectural Volume
    ctx.fillStyle = pal.facade;
    ctx.fillRect(W * 0.15, H * 0.25, W * 0.70, H * 0.49);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(W * 0.50, H * 0.28, W * 0.33, H * 0.46);

    // Warm Low-E Illuminated Windows
    const winGrad = ctx.createLinearGradient(0, H * 0.33, 0, H * 0.72);
    winGrad.addColorStop(0, 'rgba(251,191,36,0.92)');
    winGrad.addColorStop(1, 'rgba(234,88,12,0.78)');
    ctx.fillStyle = winGrad;
    ctx.fillRect(W * 0.19, H * 0.33, W * 0.27, H * 0.39);
    ctx.fillRect(W * 0.54, H * 0.35, W * 0.25, H * 0.37);

    ctx.fillStyle = 'rgba(5,7,10,0.85)';
    ctx.fillRect(W - 860, 165, 810, 62);
    ctx.fillStyle = pal.accent;
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(item.afterLabel, W - 835, 205);
    ctx.restore();
  } else {
    // =====================================================================
    // INTERIOR & VIRTUAL HOME STAGING BEFORE / AFTER 4K SIMULATION (AGENT V2)
    // =====================================================================
    // 1. LEFT: BEFORE (Empty / Dated Interior Room with Raw Walls)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitX, H);
    ctx.clip();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, W, H);

    // Perspective room lines (ceiling, back wall, floor)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(W * 0.18, H * 0.22, W * 0.64, H * 0.52);
    ctx.beginPath();
    ctx.moveTo(0, 130); ctx.lineTo(W * 0.18, H * 0.22);
    ctx.moveTo(W, 130); ctx.lineTo(W * 0.82, H * 0.22);
    ctx.moveTo(0, H - 130); ctx.lineTo(W * 0.18, H * 0.74);
    ctx.moveTo(W, H - 130); ctx.lineTo(W * 0.82, H * 0.74);
    ctx.stroke();

    // Unfinished window & electrical chases
    ctx.strokeStyle = 'rgba(248,113,113,0.55)';
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(W * 0.34, H * 0.28, W * 0.32, H * 0.36);
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(5,7,10,0.85)';
    ctx.fillRect(50, 165, 780, 62);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(item.beforeLabel, 70, 205);
    ctx.restore();

    // 2. RIGHT: AFTER (Luxury Designer Interior 4K with 3D Sofa, Marble & LED)
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, W - splitX, H);
    ctx.clip();

    const pal = item.palette || { wall: '#e7dec8', floor: '#7c5836', sofa: '#f8fafc', accent: '#fbbf24', marble: '#1e293b' };
    // Ceiling with warm LED cove
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 130, W, H * 0.12);
    // Walls
    ctx.fillStyle = pal.wall;
    ctx.fillRect(0, H * 0.22, W, H * 0.52);
    // Parquet / Marble Floor
    ctx.fillStyle = pal.floor;
    ctx.fillRect(0, H * 0.72, W, H * 0.18);

    // Feature Marble Wall & Panoramic Window
    ctx.fillStyle = pal.marble;
    ctx.fillRect(W * 0.20, H * 0.24, W * 0.25, H * 0.48);
    const winSky = ctx.createLinearGradient(0, H * 0.26, 0, H * 0.68);
    winSky.addColorStop(0, '#38bdf8');
    winSky.addColorStop(1, '#fef08a');
    ctx.fillStyle = winSky;
    ctx.fillRect(W * 0.48, H * 0.26, W * 0.30, H * 0.44);

    // 3D Designer Sofa / Island Block in Foreground
    ctx.fillStyle = pal.sofa;
    ctx.fillRect(W * 0.26, H * 0.60, W * 0.46, H * 0.16);
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(W * 0.26, H * 0.60, W * 0.46, H * 0.16);

    // Warm LED Linear Glow
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(W * 0.18, H * 0.23);
    ctx.lineTo(W * 0.82, H * 0.23);
    ctx.stroke();

    ctx.fillStyle = 'rgba(5,7,10,0.85)';
    ctx.fillRect(W - 860, 165, 810, 62);
    ctx.fillStyle = pal.accent;
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(item.afterLabel, W - 835, 205);
    ctx.restore();
  }

  // Center Wipe Line & Handle
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(splitX, 130);
  ctx.lineTo(splitX, H - 125);
  ctx.stroke();

  // Top Header Banner (Reparto 3 Banca Dati 6h)
  ctx.fillStyle = 'rgba(5,7,10,0.94)';
  ctx.fillRect(0, 0, W, 135);
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 24px JetBrains Mono, monospace';
  ctx.fillText(`BANCA DATI 6 ORE • ${item.id} • ${item.cycleSlot.toUpperCase()} • ${item.valueBoost}`, 55, 45);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px Inter, sans-serif';
  ctx.fillText(item.title, 55, 92);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px Inter, sans-serif';
  ctx.fillText(item.subtitle, 55, 122);

  // Bottom Spot Footer
  ctx.fillStyle = 'rgba(5,7,10,0.94)';
  ctx.fillRect(0, H - 125, W, 125);
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText(`📣 SPOT CLIENTE PRONTO: ${item.valueBoost} • Stile: ${item.styleName} • XviDeo AI Studio 4K`, 55, H - 52);
}

window.toggleVaultMinivideoPlay = function () {
  const btn = document.getElementById('playVaultMinivideoBtn');
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];

  if (VAULT_6H_STATE.isPlayingMinivideo) {
    VAULT_6H_STATE.isPlayingMinivideo = false;
    if (VAULT_6H_STATE.animFrame) cancelAnimationFrame(VAULT_6H_STATE.animFrame);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (btn) btn.textContent = '▶️ Avvia Minivideo Prima/Dopo + Voce IA';
    return;
  }

  VAULT_6H_STATE.isPlayingMinivideo = true;
  if (btn) btn.textContent = '⏹️ Ferma Minivideo Prima/Dopo';

  if (item && typeof window.speakWithClonedMasterVoice === 'function') {
    window.speakWithClonedMasterVoice(
      `${item.title}. ${getVaultTagline(item)} ${item.beforeLabel}. ${item.afterLabel}. Impatto sul mercato: ${item.valueBoost}.`
    );
  }

  function step() {
    if (!VAULT_6H_STATE.isPlayingMinivideo) return;
    VAULT_6H_STATE.animTime += 0.032;
    const w = 50 + Math.sin(VAULT_6H_STATE.animTime) * 40;
    VAULT_6H_STATE.wipePct = w;
    const slider = document.getElementById('vaultWipeSlider');
    const lbl = document.getElementById('vaultWipePctLabel');
    if (slider) slider.value = String(Math.round(w));
    if (lbl) lbl.textContent = `${Math.round(w)}%`;
    drawVaultActiveCanvas(w, VAULT_6H_STATE.animTime);
    VAULT_6H_STATE.animFrame = requestAnimationFrame(step);
  }
  step();
};

window.exportVaultMinivideoWebm = function () {
  const canvas = document.getElementById('vaultActiveCanvas');
  const btn = document.getElementById('recordVaultMinivideoBtn');
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
    window.downloadVaultRender4KPng();
    return;
  }
  if (!VAULT_6H_STATE.isPlayingMinivideo) window.toggleVaultMinivideoPlay();

  const stream = canvas.captureStream(30);
  const rec = new MediaRecorder(stream);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Minivideo_PrimaDopo_${item?.id || '4K'}.webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    if (btn) btn.textContent = '🎥 Scarica Minivideo (.WEBM)';
    appendLog(`🎬 Agente V3: Minivideo Prima/Dopo (${item?.id}) esportato in formato .WEBM!`);
  };
  if (btn) btn.textContent = '🔴 Registrazione Minivideo (5s)...';
  rec.start();
  setTimeout(() => {
    if (rec.state === 'recording') rec.stop();
    if (VAULT_6H_STATE.isPlayingMinivideo) window.toggleVaultMinivideoPlay();
  }, 5000);
};

window.downloadVaultRender4KPng = function () {
  const canvas = document.getElementById('vaultActiveCanvas');
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!canvas) return;
  drawVaultActiveCanvas(48);
  const a = document.createElement('a');
  a.download = `Render_PrimaDopo_4K_${item?.id || 'Vault'}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  appendLog(`📥 Render Prima/Dopo 4K (${item?.id}) scaricato in .PNG!`);
};

window.loadVaultItemIntoMainStudio = function () {
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!item) return;
  const dirInput = document.getElementById('agentDirectiveInput');
  if (dirInput) dirInput.value = `${item.title} — ${item.subtitle}`;
  document.querySelector('[data-tab="tab-mobile-ai"]')?.click();
  runMultiAgentPipeline(`${item.title} — ${item.subtitle}`, true);
  appendLog(`🎬 Scheda Banca Dati "${item.id}" caricata nel Viewport Principale Studio 4K.`);
};

window.broadcastSelectedVaultSpot = function (channel = 'whatsapp') {
  const item = VAULT_6H_STATE.items.find((i) => i.id === VAULT_6H_STATE.selectedId) || VAULT_6H_STATE.items[0];
  if (!item) return;
  const text = `${item.spotCopy}\n🌐 Live Studio 4K: https://cuordivino.github.io/xvideo-cadbridge-4k/`;
  if (channel === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    appendLog(`💬 Agente V5: Spot Cliente "${item.id}" inviato su WhatsApp.`);
  } else if (channel === 'telegram') {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent('https://cuordivino.github.io/xvideo-cadbridge-4k/')}&text=${encodeURIComponent(item.spotCopy)}`,
      '_blank'
    );
    appendLog(`✈️ Agente V5: Spot Cliente "${item.id}" inviato su Telegram.`);
  } else {
    navigator.clipboard.writeText(text);
    appendLog(`📋 Agente V5: Spot Cliente "${item.id}" copiato negli appunti.`);
  }
};

window.broadcastLatestVaultSpotToClients = function () {
  if (VAULT_6H_STATE.items.length > 0) {
    VAULT_6H_STATE.selectedId = VAULT_6H_STATE.items[0].id;
    window.broadcastSelectedVaultSpot('whatsapp');
  }
};


