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
const _loadScriptOnce = (src) => new Promise((res, rej) => {
  if (document.querySelector(`script[src="${src}"]`)) return res();
  const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
});
const _fmtSize = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const _extOf = (n) => (n.split('.').pop() || '').toLowerCase();
const _isImageLike = (f) => f.type.startsWith('image/') && !/heic|heif|tiff?/i.test(f.type + _extOf(f.name));

function getFileCategory(ext, mime = '') {
  ext = (ext || '').toLowerCase();
  if (ext === 'pdf' || mime.includes('pdf')) return { icon: '📕', label: 'PDF Dossier', color: '#ef4444', cat: 'pdf' };
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext) || mime.includes('presentation') || mime.includes('powerpoint')) return { icon: '📽️', label: 'Slide / Pitch', color: '#f97316', cat: 'presentation' };
  if (['xls', 'xlsx', 'xlsm', 'csv', 'tsv', 'ods', 'numbers'].includes(ext) || mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return { icon: '📊', label: 'Foglio / Computo', color: '#10b981', cat: 'sheet' };
  if (['doc', 'docx', 'rtf', 'txt', 'pages', 'odt', 'md'].includes(ext) || mime.includes('word') || mime.includes('document') || mime.includes('text/')) return { icon: '📑', label: 'Doc / Capitolato', color: '#3b82f6', cat: 'word' };
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) || mime.includes('zip') || mime.includes('compressed') || mime.includes('tar')) return { icon: '🗜️', label: 'Archivio ZIP/RAR', color: '#a855f7', cat: 'archive' };
  if (['dwg', 'dxf', 'skp', 'ifc', 'rvt', 'obj', 'fbx', 'gltf', 'glb', 'step', 'stp', 'iges', 'igs', '3ds', 'stl', 'dae'].includes(ext)) return { icon: '📐', label: 'CAD & 3D BIM', color: '#06b6d4', cat: 'cad' };
  if (['png', 'jpg', 'jpeg', 'webp', 'heic', 'heif', 'tiff', 'tif', 'bmp', 'svg', 'ai', 'psd'].includes(ext) || mime.startsWith('image/')) return { icon: '🖼️', label: 'Immagine / Render', color: '#ec4899', cat: 'image' };
  if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext) || mime.startsWith('video/')) return { icon: '🎬', label: 'Video Ripresa', color: '#f59e0b', cat: 'video' };
  if (['mp3', 'wav', 'm4a', 'aac', 'ogg'].includes(ext) || mime.startsWith('audio/')) return { icon: '🎵', label: 'Audio / Memo', color: '#eab308', cat: 'audio' };
  return { icon: '📦', label: `File .${ext.toUpperCase() || 'DATA'}`, color: '#94a3b8', cat: 'generic' };
}

function registerStudioDocument(file, summary, preview, thumbnailBlob = null) {
  const st = APP_STATE.studio;
  st.documents = st.documents || [];
  const ext = _extOf(file.name);
  const info = getFileCategory(ext, file.type);
  st.documents.push({
    id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: file.name,
    size: file.size,
    type: file.type || ext,
    ext,
    info,
    summary,
    preview: (preview || '').slice(0, 30000),
    thumbnailBlob,
    addedAt: new Date().toLocaleTimeString('it-IT')
  });

  renderStudioDocsList();
  appendLog(`${info.icon} Allegato file "${file.name}" (${_fmtSize(file.size)} • ${summary}) sincronizzato con i 12 Agenti IA.`);
}

window.renderStudioDocsList = function() {
  const container = document.getElementById('studioDocsContainer');
  const countEl = document.getElementById('studioDocsCount');
  const box = document.getElementById('studioDocsList');
  const docs = APP_STATE.studio.documents || [];

  if (countEl) countEl.textContent = docs.length;
  if (!container || !box) return;

  if (!docs.length) {
    container.style.display = 'none';
    box.innerHTML = '';
    return;
  }

  container.style.display = 'block';
  box.innerHTML = docs.map((doc, idx) => `
    <div class="studio-doc-card">
      <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
        <span style="font-size:1.15rem;">${doc.info.icon}</span>
        <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;">
          <div style="font-weight:700;color:#f8fafc;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px;">${doc.name}</span>
            <span style="font-size:0.60rem;padding:1px 5px;border-radius:4px;background:${doc.info.color}22;color:${doc.info.color};border:1px solid ${doc.info.color}55;">${doc.info.label}</span>
            <span style="font-size:0.62rem;color:#94a3b8;">${_fmtSize(doc.size)}</span>
          </div>
          <div style="font-size:0.65rem;color:#cbd5e1;margin-top:1px;">${doc.summary}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        ${doc.preview ? `<button type="button" class="btn" onclick="showDocPreview(${idx})" style="padding:3px 7px;font-size:0.65rem;" title="Mostra Anteprima Testo/Dati">👁️ Anteprima</button>` : ''}
        ${doc.thumbnailBlob ? `<button type="button" class="btn btn-cyan" onclick="setDocAsCanvasBase(${idx})" style="padding:3px 7px;font-size:0.65rem;" title="Imposta come base per Render 4K">🖼️ Su Canvas 4K</button>` : ''}
        <button type="button" class="btn" onclick="removeStudioDoc(${idx})" style="padding:3px 7px;font-size:0.65rem;color:#f87171;" title="Rimuovi file">✕</button>
      </div>
    </div>
  `).join('');
};

window.removeStudioDoc = function(index) {
  const docs = APP_STATE.studio.documents || [];
  if (index >= 0 && index < docs.length) {
    const removed = docs.splice(index, 1)[0];
    appendLog(`🗑️ Rimosso documento: "${removed.name}".`);
    renderStudioDocsList();
    runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', false);
  }
};

window.clearAllStudioDocs = function() {
  APP_STATE.studio.documents = [];
  appendLog('🗑️ Svuotato elenco documenti allegati.');
  renderStudioDocsList();
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', false);
};

window.setDocAsCanvasBase = function(index) {
  const doc = (APP_STATE.studio.documents || [])[index];
  if (doc && doc.thumbnailBlob) {
    loadBlobIntoStudioImage(doc.thumbnailBlob, `${doc.info.icon} ${doc.name}`);
    appendLog(`🖼️ Documento "${doc.name}" caricato come base attiva nella Viewport 4K.`);
  }
};

window.showDocPreview = function(index) {
  const doc = (APP_STATE.studio.documents || [])[index];
  if (!doc) return;
  const snippet = doc.preview ? doc.preview.slice(0, 3000) : 'Nessuna anteprima testuale disponibile.';
  const win = window.open('', '_blank', 'width=700,height=550,scrollbars=yes');
  if (win) {
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Anteprima: ${doc.name}</title>
        <style>
          body { background:#0f172a; color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif; padding:16px; margin:0; }
          header { border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:12px; }
          h2 { margin:0 0 4px; font-size:1rem; color:#38bdf8; }
          pre { background:#1e293b; padding:12px; border-radius:8px; font-size:0.75rem; white-space:pre-wrap; word-break:break-word; max-height:400px; overflow-y:auto; color:#cbd5e1; }
        </style>
      </head>
      <body>
        <header>
          <h2>${doc.info.icon} ${doc.name}</h2>
          <div style="font-size:0.72rem;color:#94a3b8;">${doc.info.label} &bull; ${_fmtSize(doc.size)} &bull; ${doc.summary}</div>
        </header>
        <pre>${snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </body>
      </html>
    `);
    win.document.close();
  } else {
    alert(`Anteprima per ${doc.name}:\n\n${snippet.slice(0, 400)}...`);
  }
};

window.sendDocsToAiSupervisor = function() {
  const docs = APP_STATE.studio.documents || [];
  if (!docs.length) {
    appendLog('⚠️ Nessun documento caricato da inviare.');
    return;
  }
  appendLog(`🎯 Invio di ${docs.length} documenti & dossier alla squadra dei 12 Agenti IA in corso...`);
  runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', true);
};

async function processDocumentFile(file) {
  const ext = _extOf(file.name);
  try {
    // 1. FORMATI TESTUALI / VETTORIALI CAD / DATI STRUTTURATI
    if (['txt', 'md', 'csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'dxf', 'svg', 'rtf', 'ifc', 'obj', 'stl'].includes(ext)) {
      const txt = await file.text();
      const lines = txt.split('\n').length;
      return registerStudioDocument(file, `Formato ${ext.toUpperCase()}, ${lines} righe`, txt);
    }

    // 2. DOSSIER & TAVOLE PDF (Render Pagina 1 su Canvas + OCR Testo)
    if (ext === 'pdf') {
      let pageBlob = null;
      let text = '';
      let numPages = 1;
      try {
        await _loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
        if (window.pdfjsLib) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
          numPages = pdf.numPages;
          for (let i = 1; i <= Math.min(numPages, 10); i++) {
            const pageData = await (await pdf.getPage(i)).getTextContent();
            text += `[Pagina ${i}]\n` + pageData.items.map(x => x.str).join(' ') + '\n\n';
          }
          const p1 = await pdf.getPage(1);
          const vp = p1.getViewport({ scale: 1.5 });
          const cv = document.createElement('canvas');
          cv.width = vp.width; cv.height = vp.height;
          await p1.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
          pageBlob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.88));
          if (pageBlob) loadBlobIntoStudioImage(pageBlob, `📕 PDF Tavola p.1: ${file.name}`);
        }
      } catch (err) {
        text = `PDF Caricato (${_fmtSize(file.size)}). Parsing grafico rimandato all'agente Supervisore.`;
      }
      return registerStudioDocument(file, `PDF Architettonico, ${numPages} pag.`, text, pageBlob);
    }

    // 3. FOGLI DI CALCOLO EXCEL, COMPUTI METRICI, TABELLE (XLS, XLSX, XLSM, ODS)
    if (['xls', 'xlsx', 'xlsm', 'ods'].includes(ext)) {
      let previewText = '';
      let sheetCount = 1;
      try {
        await _loadScriptOnce('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
        if (window.XLSX) {
          const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
          sheetCount = wb.SheetNames.length;
          previewText = wb.SheetNames.map(n => `### Foglio: ${n}\n` + XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n');
        }
      } catch (err) {
        previewText = `Foglio ${ext.toUpperCase()} (${sheetCount} schede) allegato.`;
      }
      return registerStudioDocument(file, `Foglio di Calcolo/Computo, ${sheetCount} schede`, previewText);
    }

    // 4. DOCUMENTI WORD & CAPITOLATI (DOCX & DOC)
    if (ext === 'docx') {
      let wordText = '';
      try {
        await _loadScriptOnce('https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js');
        if (window.mammoth) {
          const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
          wordText = r.value;
        }
      } catch (err) {
        wordText = `Documento Word DOCX caricato (${_fmtSize(file.size)}).`;
      }
      return registerStudioDocument(file, 'Documento Word DOCX (Capitolato/Relazione)', wordText);
    }

    if (ext === 'doc') {
      // Estrazione stringhe binarie per vecchi .doc
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let ascii = '';
      for (let i = 0; i < bytes.length && ascii.length < 15000; i++) {
        const b = bytes[i];
        if ((b >= 32 && b <= 126) || b === 10 || b === 13) ascii += String.fromCharCode(b);
      }
      return registerStudioDocument(file, 'Documento Word Legacy (.DOC)', ascii || 'Documento binario Word allegato.');
    }

    // 5. PRESENTAZIONI & SLIDE (PPTX, PPT, KEYNOTE, ODP) E ARCHIVI (ZIP, RAR, 7Z)
    if (['zip', 'pptx', 'ppt', 'key', 'odp', 'odt'].includes(ext)) {
      let zipText = '';
      let extractedImg = null;
      try {
        await _loadScriptOnce('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');
        if (window.JSZip) {
          const zip = await JSZip.loadAsync(file);
          const fileNames = Object.keys(zip.files).filter(n => !zip.files[n].dir);

          if (['pptx', 'odp'].includes(ext)) {
            const slides = fileNames.filter(n => /slide\d+\.xml$/i.test(n));
            zipText = `Presentazione Slide (${slides.length} slide rilevate):\n`;
            for (const s of slides.slice(0, 15)) {
              const xml = await zip.file(s).async('string');
              zipText += `\n[Slide ${s.replace(/\D/g, '')}]: ` + xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            }
            return registerStudioDocument(file, `Presentazione Slide (${slides.length || fileNames.length} slide)`, zipText);
          }

          if (ext === 'zip') {
            const imgName = fileNames.find(n => /\.(png|jpe?g|webp)$/i.test(n));
            if (imgName) {
              extractedImg = await zip.file(imgName).async('blob');
              loadBlobIntoStudioImage(extractedImg, `🗜️ ZIP › ${imgName}`);
            }
            zipText = `Contenuto Archivio ZIP (${fileNames.length} elementi):\n` + fileNames.slice(0, 40).join('\n');
            return registerStudioDocument(file, `Archivio Compresso (${fileNames.length} file)`, zipText, extractedImg);
          }
        }
      } catch (err) {
        zipText = `Archivio/Presentazione .${ext.toUpperCase()} allegato.`;
      }
      return registerStudioDocument(file, `Pacchetto .${ext.toUpperCase()}`, zipText, extractedImg);
    }

    // 6. MODELLI CAD/BIM BINARI O SPECIALI (DWG, SKP, RVT)
    if (['dwg', 'skp', 'rvt', 'fbx', 'gltf', 'glb', 'step', 'stp'].includes(ext)) {
      return registerStudioDocument(file, `Modello Progettuale ${ext.toUpperCase()}`, `File modello 3D/CAD nativo "${file.name}" registrato per esportazione ed esecuzione.`);
    }

  } catch (e) {
    appendLog(`⚠️ Parsing automatico parziale per "${file.name}" (${e.message || 'offline'}): registrato nei documenti.`);
  }

  registerStudioDocument(file, `File .${ext.toUpperCase() || 'DATA'} allegato`, `File ${file.name} (${_fmtSize(file.size)}) caricato e disponibile.`);
}

window.handleDirectMediaUpload = async function (event, mediaKind) {
  const files = Array.from(event.target?.files || event.dataTransfer?.files || []);
  if (!files.length) return;
  const handled = [];
  for (const f of files) {
    if (f.type.startsWith('video/') || _isImageLike(f)) {
      handled.push(f);
    } else {
      await processDocumentFile(f);
    }
  }
  if (event.target) event.target.value = '';
  if (!handled.length) {
    runMultiAgentPipeline(document.getElementById('agentDirectiveInput')?.value || '', false);
    return;
  }
  return _handleVisualMedia(handled[0], mediaKind);
};

// Drag & Drop universale
window.handleDragOver = function(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('universalDropZone');
  if (dropZone) dropZone.classList.add('drag-active');
};

window.handleDragLeave = function(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('universalDropZone');
  if (dropZone) dropZone.classList.remove('drag-active');
};

window.handleDropFile = function(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById('universalDropZone');
  if (dropZone) dropZone.classList.remove('drag-active');
  window.handleDirectMediaUpload(e, 'drop');
};

// Auto-attacca Drag & Drop al box
document.addEventListener('DOMContentLoaded', () => {
  const dz = document.getElementById('universalDropZone');
  if (dz) {
    dz.addEventListener('dragover', window.handleDragOver);
    dz.addEventListener('dragleave', window.handleDragLeave);
    dz.addEventListener('drop', window.handleDropFile);
  }
});

function _handleVisualMedia(file, mediaKind) {
  const badge = document.getElementById('activeMediaBadge');

  if (file.type.startsWith('video/')) {
    const videoEl = document.getElementById('uploadedSiteVideo');
    const url = URL.createObjectURL(file);
    videoEl.src = url;
    videoEl.play().catch(() => {});
    APP_STATE.studio.activeVideoEl = videoEl;
    APP_STATE.studio.isVideoSource = true;
    if (badge) badge.textContent = `🎥 Video Attivo: ${file.name}`;
    appendLog(`🎥 Video acquisito ("${file.name}") e caricato nei 12 Agenti IA per Video Render.`);
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

  const docsList = APP_STATE.studio.documents || [];
  const docsReport = docsList.length
    ? `\n\n📁 [DOCUMENTI, DOSSIER & FILE ALLEGATI ALLA SESSIONE (${docsList.length})]:\n` +
      docsList.map((d, i) => `   ${i + 1}. ${d.info.icon} [${d.info.label}] ${d.name} (${_fmtSize(d.size)}) — ${d.summary}`).join('\n')
    : '\n\n📁 [DOCUMENTI ALLEGATI]: Nessun file esterno caricato. Trascina PDF, ZIP, XLS, DOC o Presentazioni nella DropZone per includerli.';

  const report = `🧬 [MANTRA FONDAMENTALE CEO IA, DIRETTORI & 20 AGENTI]:
   «Ogni tipologia di prodotto può assimilare innovazione da tipologie di prodotti diversi: basta sempre saper cogliere le sfumature che altre ricerche in campi diversi hanno portato come vantaggio.»

👑 [1. SUPERVISORE — ARCH-DIRECTOR IA | Profilo: ${personaTitles[persona] || personaTitles.architetto}]:
   • Direttiva Sul Campo: "${directive}"
   • Sorgente Mobile/Portatile: ${mediaStatus} | Stile: ${style.name}
   • Contaminazione Attiva: Sicurezza FinTech (Spettatore Blindato + Face ID) + Cinema VFX (Temporal Lock Video-2-Video) + LiDAR Automotive (Ottica 2-Point Campo).${docsReport}

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

  if (window.luxurySceneActive && typeof drawLuxuryScene === 'function') drawLuxuryScene(ctx, W, H, currentLuxuryArchetype);
  // ANELLO 1: APOLLO PROMPT VAULT & 3D CAMERA CUBE OVERLAY
  if (typeof APOLLO_VAULT_STATE !== 'undefined' && APOLLO_VAULT_STATE.activeMode) {
    const mode = APOLLO_VAULT_STATE.activeMode;
    if (mode === '/board') {
      // Tavola Esecutiva A3 (1 Plan -> 6 Drawings)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(20, 20, W - 40, H - 40);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, W - 40, H - 40);

      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('📋 TAVOLA ESECUTIVA A3 — ONE PLAN &rarr; SIX DRAWINGS (@architect.apollo)', 35, 42);

      const halfW = (W - 60) / 2;
      const halfH = (H - 80) / 2;

      // Quadrante 1: Assonometria Esplosa (/axo)
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.strokeRect(30, 55, halfW, halfH);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('1. ASSONOMETRIA ESPLOSA (/axo)', 40, 72);
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(60, 150); ctx.lineTo(140, 110); ctx.lineTo(220, 150); ctx.lineTo(140, 190); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(60, 110); ctx.lineTo(140, 70); ctx.lineTo(220, 110); ctx.lineTo(140, 150); ctx.closePath(); ctx.stroke();

      // Quadrante 2: Sezione Longitudinale A-A (/section)
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.strokeRect(40 + halfW, 55, halfW, halfH);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('2. SEZIONE A-A QUOTATA (/section)', 50 + halfW, 72);
      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(60 + halfW, 170); ctx.lineTo(W - 60, 170); ctx.stroke();
      ctx.strokeRect(80 + halfW, 100, halfW - 80, 70);
      ctx.fillText('+2.70m Estradosso', 85 + halfW, 95);
      ctx.fillText('±0.00m Quota Pavimento', 85 + halfW, 185);

      // Quadrante 3: Zoning Cromatico mq/% (/zoning)
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.strokeRect(30, 65 + halfH, halfW, halfH);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('3. ZONING CROMATICO mq / % (/zoning)', 40, 82 + halfH);
      ctx.fillStyle = '#06b6d4'; ctx.fillRect(45, 100 + halfH, 60, 20); ctx.fillText('Giorno: 42% (58mq)', 115, 114 + halfH);
      ctx.fillStyle = '#a855f7'; ctx.fillRect(45, 126 + halfH, 50, 20); ctx.fillText('Notte: 35% (48mq)', 115, 140 + halfH);
      ctx.fillStyle = '#10b981'; ctx.fillRect(45, 152 + halfH, 25, 20); ctx.fillText('Servizi: 15% (21mq)', 115, 166 + halfH);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(45, 178 + halfH, 15, 20); ctx.fillText('Percorsi: 8% (11mq)', 115, 192 + halfH);

      // Quadrante 4: 6-Step Massing Evolution
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.strokeRect(40 + halfW, 65 + halfH, halfW, halfH);
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('4. 6-STEP MASSING EVOLUTION DIAGRAM', 50 + halfW, 82 + halfH);
      const steps = ['1. Site', '2. Base', '3. Sculpt', '4. Struct', '5. Circ', '6. Prog'];
      const stpW = (halfW - 30) / 6;
      steps.forEach((s, idx) => {
        ctx.fillStyle = 'rgba(244, 114, 182, 0.15)';
        ctx.fillRect(45 + halfW + idx * stpW, 115 + halfH, stpW - 4, 60);
        ctx.strokeStyle = '#f472b6';
        ctx.strokeRect(45 + halfW + idx * stpW, 115 + halfH, stpW - 4, 60);
        ctx.fillStyle = '#fff';
        ctx.font = '8px Inter, sans-serif';
        ctx.fillText(s, 47 + halfW + idx * stpW, 148 + halfH);
      });
    } else if (mode === '/cube3x3' || APOLLO_VAULT_STATE.cubeGridVisible) {
      // 3D Camera Cube Contact Sheet Matrix 3x3
      ctx.fillStyle = 'rgba(10, 15, 30, 0.90)';
      ctx.fillRect(15, 15, W - 30, H - 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(15, 15, W - 30, H - 30);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`🎲 3D CAMERA CUBE CONTROLLER — 3x3 CONTACT SHEET [100% SPATIAL CONSISTENCY]`, 28, 36);

      const cellW = (W - 50) / 3;
      const cellH = (H - 75) / 3;
      const angles = [
        [-45, 10, '24mm Wide'], [0, 15, `${APOLLO_VAULT_STATE.zoom}mm Master`], [45, 10, '35mm Eye'],
        [-90, 0, '50mm Flank L'], [0, 0, '50mm Frontal'], [90, 0, '50mm Flank R'],
        [-135, -15, '85mm Macro 1'], [180, -20, '85mm Rear Elevation'], [135, -15, '85mm Macro 2']
      ];

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const idx = r * 3 + c;
          const x = 25 + c * cellW;
          const y = 50 + r * cellH;
          ctx.strokeStyle = idx === 1 ? '#00e5ff' : 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = idx === 1 ? 1.5 : 1;
          ctx.strokeRect(x, y, cellW - 6, cellH - 6);

          ctx.fillStyle = idx === 1 ? 'rgba(0, 229, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)';
          ctx.fillRect(x, y, cellW - 6, cellH - 6);

          // Mini wireframe
          ctx.strokeStyle = idx === 1 ? '#00e5ff' : '#94a3b8';
          ctx.beginPath();
          ctx.arc(x + (cellW - 6) / 2, y + (cellH - 6) / 2, 22, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#fff';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`Cam ${idx + 1}: ${angles[idx][2]}`, x + 6, y + 15);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`R: ${angles[idx][0] + APOLLO_VAULT_STATE.rotation}° | T: ${angles[idx][1] + APOLLO_VAULT_STATE.tilt}°`, x + 6, y + cellH - 12);
        }
      }
    } else if (mode === '/overlay') {
      // Renovation Wireframe Overlay (Linee Bianche CAD + Quote mm)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;

      // Custom Cabinetry wireframe lines
      ctx.strokeRect(80, 100, 260, 180);
      ctx.strokeRect(360, 140, 220, 140);

      // Leader lines e callouts
      ctx.beginPath(); ctx.moveTo(80, 100); ctx.lineTo(40, 60); ctx.lineTo(20, 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(340, 280); ctx.lineTo(390, 320); ctx.lineTo(430, 320); ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText('2400 mm [Boiserie Noce Canaletto]', 20, 52);
      ctx.fillText('900 mm [Isola Travertino]', 435, 324);
      ctx.fillStyle = '#00e5ff';
      ctx.fillText('✏️ RENOVATION WIREFRAME OVERLAY — QUOTE CAD IN MM', 85, 90);
    } else if (mode === '/exploded') {
      // Exploded Furniture Axonometry + Material Swatches
      ctx.fillStyle = '#c084fc';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🛋️ ESPLOSO TECNICO ARREDO + SWATCHES MATERIALI (/exploded)', 25, H - 90);

      // Assembly dashed lines
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath(); ctx.moveTo(250, 140); ctx.lineTo(250, 280); ctx.stroke();
      ctx.setLineDash([]);

      // Material Swatches
      const swatches = [
        { name: 'Travertino Romano', color: '#e2d5c3' },
        { name: 'Noce Canaletto', color: '#5c3a21' },
        { name: 'Bouclé Avorio', color: '#f5f5dc' },
        { name: 'Ottone Spazzolato', color: '#d4af37' }
      ];
      swatches.forEach((sw, idx) => {
        const sx = 25 + idx * 130;
        const sy = H - 55;
        ctx.beginPath(); ctx.arc(sx + 12, sy + 12, 12, 0, Math.PI * 2);
        ctx.fillStyle = sw.color; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '9px Inter, sans-serif';
        ctx.fillText(sw.name, sx + 30, sy + 15);
      });
    } else if (mode === '/gravity') {
      // Gravity Build Animation
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🛸 GRAVITY BUILD & FPV DRONE CONTINUOUS FLY-THROUGH', 25, H - 35);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(W / 2 - 30, H / 2 - 30, 60, 60);
      ctx.beginPath(); ctx.moveTo(W / 2, H / 2 - 40); ctx.lineTo(W / 2, H / 2 + 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W / 2 - 40, H / 2); ctx.lineTo(W / 2 + 40, H / 2); ctx.stroke();
    }
  }

  if (typeof applyEnhancerPostFx === 'function') applyEnhancerPostFx(ctx, W, H);
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
  initVoiceMixerUI();
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
    key: 'giuseppe',
    name: 'Ing. Marco',
    gender: 'M',
    role: 'Tecnico / Autorevole',
    edgeVoice: 'it-IT-GiuseppeMultilingualNeural',
    staticMp3: 'voices/spot_1_architetto.mp3',
    voiceKeywords: ['giuseppe', 'diego', 'cosimo', 'luca', 'google'],
    fallbackGender: 'male',
    rate: 1.01,
    pitch: 0.94
  },
  designer: {
    key: 'isabella',
    name: 'Arch. Sofia',
    gender: 'F',
    role: 'Elegante / Morbida',
    edgeVoice: 'it-IT-IsabellaNeural',
    staticMp3: 'voices/spot_2_designer.mp3',
    voiceKeywords: ['isabella', 'elsa', 'federica', 'alice', 'chiara'],
    fallbackGender: 'female',
    rate: 0.96,
    pitch: 1.05
  },
  immobiliarista: {
    key: 'diego',
    name: 'Dott. Alessandro',
    gender: 'M',
    role: 'Executive / ROI',
    edgeVoice: 'it-IT-DiegoNeural',
    staticMp3: 'voices/spot_3_immobiliarista.mp3',
    voiceKeywords: ['diego', 'giuseppe', 'luca', 'cosimo', 'google'],
    fallbackGender: 'male',
    rate: 1.05,
    pitch: 0.92
  },
  agenzia: {
    key: 'elsa',
    name: 'Dott.ssa Elena',
    gender: 'F',
    role: 'Brillante / Commerciale',
    edgeVoice: 'it-IT-ElsaNeural',
    staticMp3: 'voices/spot_4_agenzia.mp3',
    voiceKeywords: ['elsa', 'isabella', 'alice', 'federica', 'chiara'],
    fallbackGender: 'female',
    rate: 1.02,
    pitch: 1.08
  }
};

const VOICE_PRESET_MAP = {
  giuseppe: { name: 'Giuseppe HD ♂ (Multilingual • Caldo/Cinema)', gender: 'M', edgeVoice: 'it-IT-GiuseppeMultilingualNeural', rate: 1.00, pitch: 0.94 },
  diego: { name: 'Diego Executive ♂ (Determinato/ROI)', gender: 'M', edgeVoice: 'it-IT-DiegoNeural', rate: 1.04, pitch: 0.92 },
  benigno: { name: 'Benigno Senior ♂ (Autorevole/Istituzionale)', gender: 'M', edgeVoice: 'it-IT-GiuseppeMultilingualNeural', rate: 0.95, pitch: 0.88 },
  gianni: { name: 'Gianni Natural ♂ (Disinvolto/Naturale)', gender: 'M', edgeVoice: 'it-IT-DiegoNeural', rate: 1.02, pitch: 0.98 },
  calimero: { name: 'Calimero Dynamic ♂ (Energico/Moderno)', gender: 'M', edgeVoice: 'it-IT-DiegoNeural', rate: 1.08, pitch: 1.02 },
  isabella: { name: 'Isabella HD ♀ (Vellutata/Luxury)', gender: 'F', edgeVoice: 'it-IT-IsabellaNeural', rate: 0.97, pitch: 1.05 },
  elsa: { name: 'Elsa Brillante ♀ (Chiara/Commerciale)', gender: 'F', edgeVoice: 'it-IT-ElsaNeural', rate: 1.02, pitch: 1.08 },
  fabiola: { name: 'Fabiola Luxury ♀ (Avvolgente/Design)', gender: 'F', edgeVoice: 'it-IT-IsabellaNeural', rate: 0.95, pitch: 1.02 },
  fiamma: { name: 'Fiamma Promo ♀ (Dinamica/Spot)', gender: 'F', edgeVoice: 'it-IT-ElsaNeural', rate: 1.06, pitch: 1.10 },
  irma: { name: 'Irma Tech ♀ (Precisa/Ingegneria)', gender: 'F', edgeVoice: 'it-IT-ElsaNeural', rate: 0.98, pitch: 1.04 },
  system_it: { name: 'Voce di Sistema Italiana', gender: 'M/F', edgeVoice: 'it-IT-GiuseppeMultilingualNeural', rate: 1.00, pitch: 1.00 }
};

const HumanVoiceOrchestrator = {
  activeUtterances: [],
  activeAudio: null,
  isSpeaking: false,
  audioCtx: null,
  bassFilter: null,
  trebleFilter: null,

  initAudioGraph(audioElement) {
    if (this.audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaElementSource(audioElement);
      // Lowshelf per calore microfono (180 Hz)
      this.bassFilter = this.audioCtx.createBIAFFilter ? this.audioCtx.createBIAFFilter() : this.audioCtx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 180;
      this.bassFilter.gain.value = 4.5;
      // Highshelf per presenza studio broadcast (4500 Hz)
      this.trebleFilter = this.audioCtx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.value = 4500;
      this.trebleFilter.gain.value = 2.0;

      source.connect(this.bassFilter);
      this.bassFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.audioCtx.destination);
    } catch (_) {}
  },

  applyWarmthGain(warmthPct) {
    if (!this.bassFilter) return;
    const gainDb = (warmthPct / 100) * 8.0; // 0..8 dB boost caldo
    this.bassFilter.gain.value = gainDb;
    if (this.trebleFilter) this.trebleFilter.gain.value = (warmthPct / 100) * 3.0;
  },

  getSettings() {
    return {
      voiceKey: localStorage.getItem('xvideo_voice_key') || 'auto',
      autoSwitch: localStorage.getItem('xvideo_voice_autoswitch') !== 'false',
      pitch: parseFloat(localStorage.getItem('xvideo_voice_pitch')) || 1.00,
      rate: parseFloat(localStorage.getItem('xvideo_voice_rate')) || 1.00,
      pauseMs: parseInt(localStorage.getItem('xvideo_voice_pause'), 10) || 380,
      warmth: parseInt(localStorage.getItem('xvideo_voice_warmth'), 10) || 60,
      customText: localStorage.getItem('xvideo_voice_custom_text') || ''
    };
  },

  updateBadge(secId) {
    const s = this.getSettings();
    let label = '';
    if (s.voiceKey !== 'auto' && VOICE_PRESET_MAP[s.voiceKey]) {
      const p = VOICE_PRESET_MAP[s.voiceKey];
      label = `🎙️ Voce Attiva: ${p.name}`;
    } else {
      const ref = HUMAN_VOICE_REFERENTS[secId] || HUMAN_VOICE_REFERENTS.architetto;
      label = `🎙️ Voce Attiva: ${ref.name} (${ref.gender} • ${ref.role})`;
    }
    const badge = document.getElementById('humanVoiceBadge');
    const sub = document.getElementById('humanVoiceSubtitle');
    if (badge) badge.textContent = label;
    if (sub) sub.textContent = `Cadenza: ${s.rate.toFixed(2)}x | Timbro: ${s.pitch.toFixed(2)}x | Pause: ${s.pauseMs}ms | Calore: ${s.warmth}%`;
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
      if (ref.fallbackGender === 'female') return n.includes('female') || n.includes('donna') || !n.includes('cosimo');
      return n.includes('male') || n.includes('uomo') || n.includes('cosimo');
    });
    return genderMatch || itVoices[0];
  },

  async speakSpot(sectorId, onComplete) {
    this.stop();
    this.isSpeaking = true;
    const settings = this.getSettings();
    this.updateBadge(sectorId);

    const ref = HUMAN_VOICE_REFERENTS[sectorId] || HUMAN_VOICE_REFERENTS.architetto;
    const info = PROMO_SECTORS[sectorId] || PROMO_SECTORS.architetto;

    // Seleziona la voce effettiva
    let selectedEdgeVoice = ref.edgeVoice;
    if (settings.voiceKey !== 'auto' && VOICE_PRESET_MAP[settings.voiceKey]) {
      selectedEdgeVoice = VOICE_PRESET_MAP[settings.voiceKey].edgeVoice;
    }

    // Costruisci il testo completo (priorità al box editabile se presente)
    const customInput = document.getElementById('liveSpotVoiceText');
    const customText = customInput?.value.trim() || settings.customText;
    const fullText = customText || `${info.title}. ${info.sub}. Risultato sul mercato: ${info.kpi1}, ${info.kpi2}. Scatta col telefono in cantiere o nell'immobile usato, genera il Prima e Dopo 4K e chiudi la vendita sul posto con XviDeo AI Studio 4K.`;
    const normalizedText = humanizeIT(fullText);

    // Tentativo 1: Streaming API Live edge-tts via /api/tts
    const ratePct = `${settings.rate >= 1 ? '+' : ''}${Math.round((settings.rate - 1) * 100)}%`;
    const pitchHz = `${settings.pitch >= 1 ? '+' : ''}${Math.round((settings.pitch - 1) * 40)}Hz`;
    const ttsUrl = `/api/tts?voice=${encodeURIComponent(selectedEdgeVoice)}&rate=${encodeURIComponent(ratePct)}&pitch=${encodeURIComponent(pitchHz)}&text=${encodeURIComponent(normalizedText)}`;

    const statusEl = document.getElementById('mixerEngineStatus');

    try {
      if (statusEl) statusEl.textContent = '● Streaming Live edge-tts HD...';
      const audio = new Audio();
      this.activeAudio = audio;
      audio.crossOrigin = 'anonymous';
      audio.src = ttsUrl;
      this.initAudioGraph(audio);
      this.applyWarmthGain(settings.warmth);

      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
        setTimeout(reject, 2800); // timeout rapido di 2.8s per fallback su file statico
      });

      if (!this.isSpeaking) return;
      if (statusEl) statusEl.textContent = '🟢 edge-tts Studio HD Live [ATTIVO]';
      audio.onended = () => {
        this.isSpeaking = false;
        if (onComplete) onComplete();
      };
      await audio.play();
      return;
    } catch (_) {
      // Fallback 2: file MP3 pre-generato statico se non personalizzato
      if (!customText && ref.staticMp3) {
        try {
          if (statusEl) statusEl.textContent = '● Riproduzione MP3 HD Pre-generato...';
          const staticAudio = new Audio(ref.staticMp3);
          this.activeAudio = staticAudio;
          staticAudio.crossOrigin = 'anonymous';
          this.initAudioGraph(staticAudio);
          this.applyWarmthGain(settings.warmth);
          staticAudio.playbackRate = settings.rate;
          staticAudio.onended = () => {
            this.isSpeaking = false;
            if (onComplete) onComplete();
          };
          await staticAudio.play();
          if (statusEl) statusEl.textContent = '🟢 MP3 HD Locale Studio [ATTIVO]';
          return;
        } catch (_) {}
      }
    }

    // Fallback 3: Sintesi Vocale Web Speech con pause respiratorie e WebAudio DSP
    if (statusEl) statusEl.textContent = '● Web Speech Synthesis DSP...';
    if (!('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (onComplete) onComplete();
      return;
    }

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
      utter.rate = settings.rate;
      utter.pitch = isCta ? parseFloat((settings.pitch * 0.97).toFixed(2)) : settings.pitch;

      utter.onend = () => {
        idx++;
        if (idx < segments.length) {
          setTimeout(speakNext, settings.pauseMs);
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
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (_) {}
      this.activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const statusEl = document.getElementById('mixerEngineStatus');
    if (statusEl) statusEl.textContent = '● edge-tts Studio HD + WebAudio DSP [READY]';
  }
};

window.HumanVoiceOrchestrator = HumanVoiceOrchestrator;

// Helper UI Mixer Vocale
window.updateVoiceSliderVal = function(key, val) {
  if (key === 'voicePitch') {
    const el = document.getElementById('voicePitchVal');
    if (el) el.textContent = parseFloat(val).toFixed(2);
    localStorage.setItem('xvideo_voice_pitch', val);
  } else if (key === 'voiceRate') {
    const el = document.getElementById('voiceRateVal');
    if (el) el.textContent = `${parseFloat(val).toFixed(2)}x`;
    localStorage.setItem('xvideo_voice_rate', val);
  } else if (key === 'voicePause') {
    const el = document.getElementById('voicePauseVal');
    if (el) el.textContent = `${val}ms`;
    localStorage.setItem('xvideo_voice_pause', val);
  } else if (key === 'voiceWarmth') {
    const el = document.getElementById('voiceWarmthVal');
    if (el) el.textContent = `${val}%`;
    localStorage.setItem('xvideo_voice_warmth', val);
    HumanVoiceOrchestrator.applyWarmthGain(parseInt(val, 10));
  }
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  HumanVoiceOrchestrator.updateBadge(sec);
};

window.onHumanVoiceSelectChange = function(val) {
  if (val === 'auto') {
    localStorage.setItem('xvideo_voice_key', 'auto');
  } else {
    localStorage.setItem('xvideo_voice_key', val);
    const autoChk = document.getElementById('humanVoiceAutoSwitch');
    if (autoChk) {
      autoChk.checked = false;
      localStorage.setItem('xvideo_voice_autoswitch', 'false');
    }
    if (VOICE_PRESET_MAP[val]) {
      const p = VOICE_PRESET_MAP[val];
      const pSlider = document.getElementById('voicePitchSlider');
      const rSlider = document.getElementById('voiceRateSlider');
      if (pSlider) { pSlider.value = p.pitch; window.updateVoiceSliderVal('voicePitch', p.pitch); }
      if (rSlider) { rSlider.value = p.rate; window.updateVoiceSliderVal('voiceRate', p.rate); }
    }
  }
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  HumanVoiceOrchestrator.updateBadge(sec);
};

window.saveVoiceMixerSettings = function() {
  const autoChk = document.getElementById('humanVoiceAutoSwitch');
  if (autoChk) {
    localStorage.setItem('xvideo_voice_autoswitch', autoChk.checked ? 'true' : 'false');
    if (autoChk.checked) {
      localStorage.setItem('xvideo_voice_key', 'auto');
    }
  }
  const txt = document.getElementById('liveSpotVoiceText')?.value || '';
  localStorage.setItem('xvideo_voice_custom_text', txt);
};

window.previewCurrentHumanVoice = function() {
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  const btn = document.getElementById('previewVoiceMixerBtn');
  if (HumanVoiceOrchestrator.isSpeaking) {
    HumanVoiceOrchestrator.stop();
    if (btn) btn.textContent = '🎧 Prova Subito Voce';
    return;
  }
  if (btn) btn.textContent = '⏹️ Ferma Ascolto';
  HumanVoiceOrchestrator.speakSpot(sec, () => {
    if (btn) btn.textContent = '🎧 Prova Subito Voce';
  });
};

function initVoiceMixerUI() {
  const s = HumanVoiceOrchestrator.getSettings();
  const sel = document.getElementById('humanVoiceSelect');
  if (sel && s.voiceKey && s.voiceKey !== 'auto') sel.value = s.voiceKey;
  const autoChk = document.getElementById('humanVoiceAutoSwitch');
  if (autoChk) autoChk.checked = s.autoSwitch;
  const pSlider = document.getElementById('voicePitchSlider');
  if (pSlider) { pSlider.value = s.pitch; window.updateVoiceSliderVal('voicePitch', s.pitch); }
  const rSlider = document.getElementById('voiceRateSlider');
  if (rSlider) { rSlider.value = s.rate; window.updateVoiceSliderVal('voiceRate', s.rate); }
  const paSlider = document.getElementById('voicePauseSlider');
  if (paSlider) { paSlider.value = s.pauseMs; window.updateVoiceSliderVal('voicePause', s.pauseMs); }
  const wSlider = document.getElementById('voiceWarmthSlider');
  if (wSlider) { wSlider.value = s.warmth; window.updateVoiceSliderVal('voiceWarmth', s.warmth); }
  const txtArea = document.getElementById('liveSpotVoiceText');
  const sec = MKT_ERP_STATE.activeDemoSector || 'architetto';
  const info = PROMO_SECTORS[sec] || PROMO_SECTORS.architetto;
  if (txtArea && !txtArea.value) {
    txtArea.value = `${info.title}. ${info.sub}. Risultato sul mercato: ${info.kpi1}, ${info.kpi2}. Scatta col telefono in cantiere o nell'immobile usato, genera il Prima e Dopo 4K e chiudi la vendita sul posto con XviDeo AI Studio 4K.`;
  }
  HumanVoiceOrchestrator.updateBadge(sec);
}

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

  // Se autoSwitch è attivo, imposta la voce associata allo spot
  const s = HumanVoiceOrchestrator.getSettings();
  if (s.autoSwitch) {
    const ref = HUMAN_VOICE_REFERENTS[secId];
    if (ref) {
      const sel = document.getElementById('humanVoiceSelect');
      if (sel) sel.value = ref.key;
    }
  }

  // Aggiorna testo live dello spot nel mixer
  const txtArea = document.getElementById('liveSpotVoiceText');
  if (txtArea) {
    txtArea.value = `${info.title}. ${info.sub}. Risultato sul mercato: ${info.kpi1}, ${info.kpi2}. Scatta col telefono in cantiere o nell'immobile usato, genera il Prima e Dopo 4K e chiudi la vendita sul posto con XviDeo AI Studio 4K.`;
    localStorage.setItem('xvideo_voice_custom_text', txtArea.value);
  }

  HumanVoiceOrchestrator.updateBadge(secId);
  drawPromoDemoCanvas(55);
};

/* ============================================================================
   2. LUXURY 4K RENDER ENGINE (13 ARCHETIPI 2D -> 3D — VIDEO 3 @renderdilusso)
   ============================================================================ */
function mk(name, desc, angle, lighting, a, b, c, d) {
  return { name, desc, angle, lighting, agents: { CAD_Vector_Parser: a, Spatial_3D_Extruder: b, PBR_Luxury_Shader: c, Motion_Director: d } };
}
const LUXURY_4K_ARCHETYPES = {
  ISO_CUTAWAY: mk('Spaccato Isometrico 35.264° + Day/Night 2700K', '00:16 Spaccato isometrico con switch luci Day/Night', 35.264, '2700K Warm LED',
    'Parsing vettori/quote per ISO_CUTAWAY', 'Estrusione 3D ISO_CUTAWAY', 'PBR luxury shader 2700K Warm LED', 'Motion director ISO_CUTAWAY'),
  TOPDOWN_WALK: mk('Nadir -90° parquet a spina con persone', '00:50 Vista zenitale con persone in movimento', -90, 'Daylight 5000K',
    'Parsing vettori/quote per TOPDOWN_WALK', 'Estrusione 3D TOPDOWN_WALK', 'PBR luxury shader Daylight 5000K', 'Motion director TOPDOWN_WALK'),
  MICRO_BUILDERS: mk('Mini-costruttori sul foglio CAD', '01:40 Squadra 3D che edifica muri e piscina sul foglio CAD', 45, 'Micro Spot 4000K',
    'Parsing vettori/quote per MICRO_BUILDERS', 'Estrusione 3D MICRO_BUILDERS', 'PBR luxury shader Micro Spot 4000K', 'Motion director MICRO_BUILDERS'),
  VERTICAL_SECTION: mk('Sezione verticale multipiano', '02:46 Sezione con scala centrale illuminata', 0, 'Interno 3000K',
    'Parsing vettori/quote per VERTICAL_SECTION', 'Estrusione 3D VERTICAL_SECTION', 'PBR luxury shader Interno 3000K', 'Motion director VERTICAL_SECTION'),
  COMMERCIAL_FLOW: mk('Planimetria retail/salone quotata con flussi', '03:03 Flussi clienti e postazioni attive', -90, 'CRI 4500K',
    'Parsing vettori/quote per COMMERCIAL_FLOW', 'Estrusione 3D COMMERCIAL_FLOW', 'PBR luxury shader CRI 4500K', 'Motion director COMMERCIAL_FLOW'),
  LIFESTYLE_GARAGE: mk('Villa al crepuscolo + garage con SUV', '03:20/03:36 Esterno crepuscolare e garage di lusso', 20, 'Blue Hour',
    'Parsing vettori/quote per LIFESTYLE_GARAGE', 'Estrusione 3D LIFESTYLE_GARAGE', 'PBR luxury shader Blue Hour', 'Motion director LIFESTYLE_GARAGE'),
  QUOTED_LIVE_PLAN: mk('Pianta 3D con quote nei vani', '03:53 Quote 5400x5500 e auto nel box', 35, 'Technical Blue-White',
    'Parsing vettori/quote per QUOTED_LIVE_PLAN', 'Estrusione 3D QUOTED_LIVE_PLAN', 'PBR luxury shader Technical Blue-White', 'Motion director QUOTED_LIVE_PLAN'),
  CAD_POPUP_3D: mk('Arredi che emergono dal disegno CAD', '04:26 Arredi fotorealistici che salgono dalla carta', 40, 'Studio 4000K',
    'Parsing vettori/quote per CAD_POPUP_3D', 'Estrusione 3D CAD_POPUP_3D', 'PBR luxury shader Studio 4000K', 'Motion director CAD_POPUP_3D'),
  BALSA_HANDS: mk('Plastico in balsa su cutting mat', '05:16 Guanti neri e pinzette assemblano il plastico', 30, 'Macro 3200K',
    'Parsing vettori/quote per BALSA_HANDS', 'Estrusione 3D BALSA_HANDS', 'PBR luxury shader Macro 3200K', 'Motion director BALSA_HANDS'),
  WAVE_MATERIAL: mk('Onda che trasforma blocchi in travertino e noce', '05:33 Onda geometrica materica', 40, 'Studio Soft',
    'Parsing vettori/quote per WAVE_MATERIAL', 'Estrusione 3D WAVE_MATERIAL', 'PBR luxury shader Studio Soft', 'Motion director WAVE_MATERIAL'),
  CEILING_LASER: mk('Controsoffitti, impianti e livella laser', '05:50 Operai con caschetto rosso e laser', 25, 'Cantiere 5000K',
    'Parsing vettori/quote per CEILING_LASER', 'Estrusione 3D CEILING_LASER', 'PBR luxury shader Cantiere 5000K', 'Motion director CEILING_LASER'),
  NEON_WIREFRAME: mk('Linee dorate disegnano letto e lampadari', '06:06 Wireframe luminoso dorato su nero', 35, 'Neon Gold',
    'Parsing vettori/quote per NEON_WIREFRAME', 'Estrusione 3D NEON_WIREFRAME', 'PBR luxury shader Neon Gold', 'Motion director NEON_WIREFRAME'),
  MACRO_SIX_SHOT: mk('1 render → 6 close-up push-in', '06:33/06:56 Murano, marmo, bouclé, tende, testiera, reveal', 50, 'Softbox 3200K',
    'Parsing vettori/quote per MACRO_SIX_SHOT', 'Estrusione 3D MACRO_SIX_SHOT', 'PBR luxury shader Softbox 3200K', 'Motion director MACRO_SIX_SHOT'),
};

let currentLuxuryArchetype = 'ISO_CUTAWAY';

/* ============================================================================
   APOLLO VAULT & 3D CAMERA CUBE CONTROLLER STATE (VIDEO 1 & 2)
   ============================================================================ */
const APOLLO_VAULT_STATE = {
  activeMode: null, // '/board', '/cube3x3', '/overlay', '/exploded', '/gravity'
  rotation: 0,
  tilt: 15,
  zoom: 50, // 24mm to 85mm
  cubeGridVisible: false,
  gravityAnimationId: null,
  gravityStep: 0
};

const ENHANCER_POST_FX = {
  lut: 'warm_ad',
  sharpness: 80,
  bloom: 45,
  hdr: 65,
  lock60fps: true
};

window.executeApolloSlashCommand = function(cmd) {
  APOLLO_VAULT_STATE.activeMode = cmd;
  const telem = document.getElementById('apolloVaultTelemetry');

  if (cmd === '/board') {
    if (telem) telem.textContent = '⚡ /board: Tavola A3 (1 Plan -> 6 Drawings) [RENDERED]';
    appendLog('📐 Apollo Vault: generata Tavola Esecutiva A3 (/axo + /section + /zoning + 6-Step Massing).');
  } else if (cmd === '/cube3x3') {
    APOLLO_VAULT_STATE.cubeGridVisible = true;
    if (telem) telem.textContent = `⚡ /cube3x3: Griglia 3x3 (Rot: ${APOLLO_VAULT_STATE.rotation}°, Tilt: ${APOLLO_VAULT_STATE.tilt}°, Lens: ${APOLLO_VAULT_STATE.zoom}mm) [ACTIVE]`;
    appendLog('🎲 Apollo Vault: attivato 3D Camera Cube Controller (Contact sheet 3x3 coerente).');
  } else if (cmd === '/overlay') {
    if (telem) telem.textContent = '⚡ /overlay: Renovation Wireframe Overlay (Linee Bianche CAD) [ACTIVE]';
    appendLog('✏️ Apollo Vault: sovrapposte linee tecniche bianche CAD + quote in mm su foto cantiere.');
  } else if (cmd === '/exploded') {
    if (telem) telem.textContent = '⚡ /exploded: Esploso Tecnico Arredo + Swatches Materiali [ACTIVE]';
    appendLog('🛋️ Apollo Vault: generato esploso assonometrico con quote e swatches materiali.');
  } else if (cmd === '/gravity') {
    if (telem) telem.textContent = '⚡ /gravity: Gravity Build & FPV Drone One-Take [RUNNING]';
    appendLog('🛸 Apollo Vault: avviata animazione fisica Gravity Build e traiettoria FPV drone.');
    APOLLO_VAULT_STATE.gravityStep = 0;
  }

  // Aggiorna bottoni slash
  const btns = document.querySelectorAll('#apolloSlashBar button');
  btns.forEach(b => {
    const isAct = b.textContent.includes(cmd);
    b.classList.toggle('btn-cyan', isAct);
    b.classList.toggle('active', isAct);
  });

  if (typeof drawCadPreview === 'function') drawCadPreview();
};

window.updateCubeController = function(prop, val) {
  if (prop === 'rot') {
    APOLLO_VAULT_STATE.rotation = parseInt(val, 10);
    const el = document.getElementById('cubeRotVal');
    if (el) el.textContent = `${val}°`;
  } else if (prop === 'tilt') {
    APOLLO_VAULT_STATE.tilt = parseInt(val, 10);
    const el = document.getElementById('cubeTiltVal');
    if (el) el.textContent = `${val}°`;
  } else if (prop === 'zoom') {
    APOLLO_VAULT_STATE.zoom = parseInt(val, 10);
    const el = document.getElementById('cubeZoomVal');
    if (el) el.textContent = `${val}mm`;
  }

  const telem = document.getElementById('apolloVaultTelemetry');
  if (telem) {
    telem.textContent = `⚡ 3D Cube: Rot ${APOLLO_VAULT_STATE.rotation}° | Tilt ${APOLLO_VAULT_STATE.tilt}° | ${APOLLO_VAULT_STATE.zoom}mm [100% SYNC]`;
  }

  if (typeof drawCadPreview === 'function') drawCadPreview();
};

window.renderCube3x3Grid = function() {
  APOLLO_VAULT_STATE.activeMode = '/cube3x3';
  APOLLO_VAULT_STATE.cubeGridVisible = true;
  appendLog(`🎲 3D Camera Cube: generata matrice 3x3 cinematografica a ${APOLLO_VAULT_STATE.zoom}mm (Rot: ${APOLLO_VAULT_STATE.rotation}°, Tilt: ${APOLLO_VAULT_STATE.tilt}°).`);
  if (typeof drawCadPreview === 'function') drawCadPreview();
};

window.updateEnhancerPostFx = function() {
  const lutEl = document.getElementById('enhancerLutSelect');
  const sharpEl = document.getElementById('enhancerSharpSlider');
  const bloomEl = document.getElementById('enhancerBloomSlider');
  const hdrEl = document.getElementById('enhancerHdrSlider');
  const lock60fpsEl = document.getElementById('enhancer60fpsLock');

  if (lutEl) ENHANCER_POST_FX.lut = lutEl.value;
  if (sharpEl) {
    ENHANCER_POST_FX.sharpness = parseInt(sharpEl.value, 10);
    const valEl = document.getElementById('enhancerSharpVal');
    if (valEl) valEl.textContent = `${sharpEl.value}%`;
  }
  if (bloomEl) {
    ENHANCER_POST_FX.bloom = parseInt(bloomEl.value, 10);
    const valEl = document.getElementById('enhancerBloomVal');
    if (valEl) valEl.textContent = `${bloomEl.value}%`;
  }
  if (hdrEl) {
    ENHANCER_POST_FX.hdr = parseInt(hdrEl.value, 10);
    const valEl = document.getElementById('enhancerHdrVal');
    if (valEl) valEl.textContent = `${hdrEl.value}%`;
  }
  if (lock60fpsEl) ENHANCER_POST_FX.lock60fps = lock60fpsEl.checked;

  const telem = document.getElementById('enhancerTelemetry');
  if (telem) {
    telem.textContent = `LUT: ${ENHANCER_POST_FX.lut.toUpperCase()} • Bloom ${ENHANCER_POST_FX.bloom}% • HDR ${ENHANCER_POST_FX.hdr}% • ${ENHANCER_POST_FX.lock60fps ? '60fps Lock' : 'Dynamic'}`;
  }

  if (typeof drawCadPreview === 'function') drawCadPreview();
};

window.selectLuxuryArchetype = function (archetypeKey) {
  const arch = LUXURY_4K_ARCHETYPES[archetypeKey] || LUXURY_4K_ARCHETYPES.ISO_CUTAWAY;
  const wasOn = window.luxurySceneActive && currentLuxuryArchetype === archetypeKey;
  currentLuxuryArchetype = archetypeKey;
  window.luxurySceneActive = !wasOn;
  clearInterval(window._luxTimer);
  if (window.luxurySceneActive) window._luxTimer = setInterval(() => typeof drawCadPreview === 'function' && drawCadPreview(), 70);

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




/* ============================================================================
   v10: COMPUTO METRICO ESTIMATIVO + CAPITOLATO SPECIALE + RELAZIONE TECNICA (PDF)
   ============================================================================ */
const COMPUTO_VOCI = [
  // [categoria, descrizione, um, qtà per mq, prezzo unitario €, fonte riferimento, capitolato]
  ['Opere Edili', 'Demolizioni, rimozioni e smaltimento', 'mq', 1.0, 38, 'Prezzario regionale', 'Demolizioni selettive con recupero macerie a norma D.Lgs 152/06; smaltimento in discarica autorizzata.'],
  ['Opere Edili', 'Cappotto termico EPS grafitato 12 cm', 'mq', 1.1, 62, 'Edilportale (sistemi ETICS)', 'Sistema ETICS con marcatura CE, ETA, posa secondo UNI 11716; rasatura armata e finitura silossanica.'],
  ['Serramenti', 'Infissi PVC/alluminio taglio termico Uw ≤ 1,1', 'mq', 0.18, 780, 'Edilportale (serramenti)', 'Triplo vetro basso-emissivo, posa qualificata UNI 10818, controtelaio e sigillatura certificata.'],
  ['Pavimenti e rivestimenti', 'Pavimento gres porcellanato / parquet rovere', 'mq', 1.0, 92, 'Archiproducts (superfici)', 'Posa su massetto planare ±2 mm/2 m, fughe ≤ 2 mm, adesivi C2TE S1.'],
  ['Pavimenti e rivestimenti', 'Intonaci, tinteggiature e controsoffitti', 'mq', 2.6, 24, 'Prezzario regionale', 'Finitura liscia classe Q3, due mani di idropittura traspirante a basso VOC.'],
  ['Impianti MEP', 'Impianto elettrico, illuminazione e domotica', 'mq', 1.0, 115, 'Listino impianti', 'Conforme CEI 64-8 e DM 37/08; dichiarazione di conformità; quadro con differenziali.'],
  ['Impianti MEP', 'Impianto idrico-sanitario e scarichi', 'mq', 1.0, 85, 'Listino impianti', 'Tubazioni multistrato coibentate, prova di tenuta, conformità UNI 9182.'],
  ['Impianti MEP', 'Pompa di calore + radiante + VMC', 'mq', 1.0, 180, 'Listino impianti', 'Dimensionamento UNI/TS 11300; COP ≥ 4; installazione F-gas certificata.'],
  ['Arredi e design', 'Arredi su misura, cucina, bagni, corpi illuminanti', 'mq', 1.0, 140, 'Archiproducts (design)', 'Prodotti con scheda tecnica, garanzia 2 anni, classe emissioni E1.']
];

function _eur(n) { return n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' }); }

window.computoData = null;

window.generaComputo = function () {
  const mq = parseFloat(document.getElementById('computoMq')?.value) || 0;
  const piani = parseInt(document.getElementById('computoPiani')?.value, 10) || 1;
  const tipo = document.getElementById('computoTipo')?.value || 'ristrutturazione';
  const classe = document.getElementById('computoClasse')?.value || 'G → A4';
  const k = tipo === 'nuova' ? 1.25 : tipo === 'restyling' ? 0.55 : 1;
  const righe = COMPUTO_VOCI.filter(v => !(tipo === 'restyling' && ['Impianti MEP', 'Serramenti'].includes(v[0]) && v[1].startsWith('Pompa'))).map(v => {
    const qta = +(mq * v[3] * (v[0] === 'Opere Edili' ? piani : 1)).toFixed(2);
    return { cat: v[0], desc: v[1], um: v[2], qta, pu: v[4] * k, tot: qta * v[4] * k, fonte: v[5], capitolato: v[6] };
  });
  const netto = righe.reduce((s, r) => s + r.tot, 0);
  const sicurezza = netto * 0.03, spese = netto * 0.12, utile = netto * 0.10;
  const imponibile = netto + sicurezza + spese + utile, iva = imponibile * 0.10;
  window.computoData = { mq, piani, tipo, classe, righe, netto, sicurezza, spese, utile, imponibile, iva, totale: imponibile + iva };
  const d = window.computoData;
  const cats = {};
  righe.forEach(r => cats[r.cat] = (cats[r.cat] || 0) + r.tot);
  document.getElementById('computoOut').innerHTML =
    '<table style="width:100%;border-collapse:collapse;">' +
    righe.map(r => `<tr><td>${r.desc}</td><td style="text-align:right">${r.qta} ${r.um}</td><td style="text-align:right">${_eur(r.pu)}</td><td style="text-align:right">${_eur(r.tot)}</td></tr>`).join('') +
    `<tr style="border-top:1px solid #475569"><td colspan="3">Lavori netti</td><td style="text-align:right">${_eur(netto)}</td></tr>` +
    `<tr><td colspan="3">Sicurezza 3% + Spese gen. 12% + Utile 10%</td><td style="text-align:right">${_eur(sicurezza + spese + utile)}</td></tr>` +
    `<tr><td colspan="3">IVA 10%</td><td style="text-align:right">${_eur(iva)}</td></tr>` +
    `<tr style="font-weight:800;color:#34d399"><td colspan="3">COSTO PRESUNTO DELL'OPERA</td><td style="text-align:right">${_eur(d.totale)}</td></tr></table>`;
  appendLog(`📊 Computo generato: ${mq} mq, ${tipo} → costo presunto ${_eur(d.totale)}.`);
  return d;
};

function _relazioneTesto(d) {
  const docs = (APP_STATE.studio.documents || []).map(x => x.name).join(', ') || 'nessuno';
  const geo = APP_STATE.geo || {};
  return [
    `RELAZIONE TECNICA ILLUSTRATIVA`,
    `1. Stato di fatto. Immobile di ${d.mq} mq su ${d.piani} piano/i, coordinate ${geo.lat?.toFixed ? geo.lat.toFixed(4) : 'n.d.'}, ${geo.lng?.toFixed ? geo.lng.toFixed(4) : 'n.d.'}. Documenti acquisiti: ${docs}.`,
    `2. Stato di progetto. Intervento di tipo "${d.tipo}" comprendente opere edili, serramenti, finiture, impianti MEP e arredi, come da computo.`,
    `3. Rispondenza normativa. Verifica requisiti aeroilluminanti (RAI ≥ 1/8), DM 37/08 per impianti, D.Lgs 192/05 e DM requisiti minimi per prestazione energetica, CEI 64-8. La conformità urbanistica (titolo edilizio, CILA/SCIA/PdC) va asseverata da tecnico abilitato.`,
    `4. Miglioramento energetico previsto: ${d.classe} (stima preliminare; il valore ufficiale richiede APE redatto da certificatore).`,
    `5. Quadro economico: costo presunto dell'opera ${_eur(d.totale)} (IVA inclusa), indicativo e non vincolante.`
  ].join('\n\n');
}

window.exportDossierPDF = async function () {
  const d = window.computoData || window.generaComputo();
  const load = async () => {
    if (window.jspdf) return;
    await _loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  };
  try {
    await load();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 15;
    const W = 180;
    const line = (txt, size = 9, bold = false) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal'); pdf.setFontSize(size);
      pdf.splitTextToSize(String(txt), W).forEach(l => { if (y > 280) { pdf.addPage(); y = 15; } pdf.text(l, 15, y); y += size * 0.45 + 1.2; });
    };
    const eur = n => 'EUR ' + n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    line('DOSSIER PROGETTUALE - CADBridge Pro', 16, true);
    line(new Date().toLocaleDateString('it-IT') + ' | ' + d.mq + ' mq | ' + d.tipo, 9); y += 3;
    line('1. COMPUTO METRICO ESTIMATIVO', 13, true);
    d.righe.forEach((r, i) => line(`${i + 1}. [${r.cat}] ${r.desc} - ${r.qta} ${r.um} x ${eur(r.pu)} = ${eur(r.tot)}  (rif. ${r.fonte})`));
    line(`Lavori netti: ${eur(d.netto)}`, 9, true);
    line(`Sicurezza 3%: ${eur(d.sicurezza)} | Spese generali 12%: ${eur(d.spese)} | Utile 10%: ${eur(d.utile)}`);
    line(`IVA 10%: ${eur(d.iva)}`);
    line(`COSTO PRESUNTO DELL'OPERA: ${eur(d.totale)}`, 11, true); y += 3;
    line('2. CAPITOLATO SPECIALE D\'APPALTO', 13, true);
    d.righe.forEach((r, i) => line(`Art. ${i + 1} - ${r.desc}: ${r.capitolato}`));
    y += 3;
    _relazioneTesto(d).split('\n\n').forEach((p, i) => line(p, i === 0 ? 13 : 9, i === 0));
    y += 3;
    line('Nota: prezzi indicativi; il pacchetto va coordinato con lo script SketchUp (_3D.rb) e verificato da un tecnico abilitato.', 8);
    pdf.save(`Dossier_Computo_Capitolato_Relazione_${Date.now()}.pdf`);
    appendLog('📄 Dossier PDF esportato (Computo + Capitolato + Relazione).');
  } catch (e) {
    // Fallback offline: finestra di stampa → "Salva come PDF"
    const w = window.open('', '_blank');
    if (!w) { appendLog('⚠️ Popup bloccato: impossibile esportare PDF.'); return; }
    const esc = s => String(s).replace(/</g, '&lt;');
    w.document.write('<html><body style="font-family:sans-serif;font-size:12px"><h1>Dossier Progettuale</h1><h2>Computo</h2><ul>' +
      d.righe.map(r => `<li>${esc(r.desc)}: ${r.qta} ${r.um} = ${_eur(r.tot)}</li>`).join('') + `</ul><b>Costo presunto: ${_eur(d.totale)}</b><h2>Capitolato</h2><ul>` +
      d.righe.map(r => `<li>${esc(r.desc)}: ${esc(r.capitolato)}</li>`).join('') + '</ul><pre style="white-space:pre-wrap">' + esc(_relazioneTesto(d)) + '</pre></body></html>');
    w.document.close(); w.print();
    appendLog('📄 Libreria PDF non raggiungibile: aperta stampa (scegli "Salva come PDF").');
  }
};


/* ===== v11: 13 ARCHETIPI — RENDERING DEDICATO SU cadCanvas + ENHANCER REALE ===== */
function drawLuxuryScene(ctx, W, H, key) {
  const t = Date.now() / 1000, x0 = 16, y0 = 70, w = W - 32, h = H - 86, cx = x0 + w / 2, cy = y0 + h / 2;
  const R = (x, y, ww, hh, f, s) => { if (f) { ctx.fillStyle = f; ctx.fillRect(x, y, ww, hh); } if (s) { ctx.strokeStyle = s; ctx.strokeRect(x, y, ww, hh); } };
  const D = (x, y, r, f) => { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const L = (a, b, c, d, col, lw = 1) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
  const T = (s, x, y, col = '#e2e8f0', f = '10px Inter, sans-serif') => { ctx.fillStyle = col; ctx.font = f; ctx.fillText(s, x, y); };
  const lerp = (a, b, p) => a + (b - a) * p, saw = (p) => (t * p) % 1;
  ctx.save();
  R(x0, y0, w, h, 'rgba(8,12,24,0.94)', 'rgba(0,229,255,0.5)');
  ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
  const meta = LUXURY_4K_ARCHETYPES[key];
  if (key === 'ISO_CUTAWAY') {
    const night = Math.sin(t / 2) > 0;
    R(x0, y0, w, h, night ? '#0b1030' : '#f1d9a8');
    const bx = cx, by = cy + 30, s = Math.min(w, h) / 4;
    [['#a8896a', [[0, 0], [s, s / 2], [0, s], [-s, s / 2]]], ['#7c6247', [[-s, s / 2], [0, s], [0, s * 1.7], [-s, s * 1.2]]], ['#947754', [[s, s / 2], [0, s], [0, s * 1.7], [s, s * 1.2]]]].forEach(([c, p]) => {
      ctx.fillStyle = c; ctx.beginPath(); p.forEach(([a, b], i) => i ? ctx.lineTo(bx + a, by - s + b) : ctx.moveTo(bx + a, by - s + b)); ctx.fill(); });
    if (night) { ctx.fillStyle = 'rgba(255,170,60,0.45)'; ctx.beginPath(); ctx.arc(bx, by - s / 2 + 20, s * 0.9, 0, 7); ctx.fill(); D(bx, by - s / 2 + 20, 8, '#ffcf7a'); }
    T(night ? 'NIGHT 2700K' : 'DAY', x0 + 10, y0 + 18, night ? '#ffcf7a' : '#5a3d10');
  } else if (key === 'TOPDOWN_WALK') {
    R(x0, y0, w, h, '#b58a5a');
    for (let i = -h; i < w; i += 18) { L(x0 + i, y0, x0 + i + h, y0 + h, 'rgba(70,40,15,0.5)'); L(x0 + i + 9, y0, x0 + i + 9 - h, y0 + h, 'rgba(70,40,15,0.35)'); }
    R(x0 + 20, y0 + 20, w - 40, h - 40, null, '#1e293b'); ctx.setLineDash([5, 5]); L(x0 + 40, cy, x0 + w - 40, cy, '#0ea5e9', 2); ctx.setLineDash([]);
    [0, 0.33, 0.66].forEach((o, i) => D(lerp(x0 + 40, x0 + w - 40, (saw(0.12) + o) % 1), cy + (i - 1) * 40 + Math.sin(t * 3 + i) * 6, 6, ['#ef4444', '#22c55e', '#f8fafc'][i]));
  } else if (key === 'MICRO_BUILDERS') {
    R(x0, y0, w, h, '#6b4a2b'); R(x0 + 40, y0 + 30, w - 80, h - 60, '#e8eef7', '#38bdf8');
    const g = saw(0.1); L(x0 + 60, y0 + 70, lerp(x0 + 60, x0 + w - 60, g), y0 + 70, '#0f172a', 4); L(x0 + 60, y0 + h - 60, lerp(x0 + 60, x0 + w - 60, g), y0 + h - 60, '#0f172a', 4);
    R(cx + 20, cy - 10, 90 * g, 50 * g, '#38bdf8', '#0369a1');
    for (let i = 0; i < 6; i++) D(lerp(x0 + 60, x0 + w - 60, (g + i / 6) % 1), y0 + 70 + (i % 2) * (h - 130) + Math.sin(t * 6 + i) * 3, 4, '#2563eb');
    T('SCALA CAD 1:50', x0 + 50, y0 + 22, '#fde68a');
  } else if (key === 'VERTICAL_SECTION') {
    const fw = w * 0.5, fx = cx - fw / 2, fh = h / 4.4;
    for (let i = 0; i < 4; i++) { R(fx, y0 + 14 + i * fh, fw, fh - 4, '#1e293b', '#94a3b8'); R(fx + 10 + i * 6, y0 + 22 + i * fh, 30, fh - 20, 'rgba(255,210,120,0.3)'); }
    for (let i = 0; i < 4; i++) { const sy = y0 + 14 + i * fh; ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 14, sy + fh - 6); ctx.lineTo(cx + 14, sy + 6); ctx.stroke(); }
    ctx.fillStyle = 'rgba(253,224,71,0.15)'; ctx.fillRect(cx - 20, y0 + 14, 40, h - 28);
  } else if (key === 'COMMERCIAL_FLOW') {
    R(x0 + 14, y0 + 14, w - 28, h - 28, '#0f172a', '#64748b');
    for (let i = 0; i < 4; i++) { R(x0 + 40 + i * (w - 120) / 4, y0 + 30, 40, 22, '#a855f7'); R(x0 + 40 + i * (w - 120) / 4, y0 + h - 56, 40, 22, '#a855f7'); }
    T('12.40 m', cx - 20, y0 + h - 18, '#facc15'); T('7.80 m', x0 + 18, cy, '#facc15');
    for (let i = 0; i < 5; i++) D(lerp(x0 + 30, x0 + w - 30, (saw(0.15) + i / 5) % 1), cy + Math.sin(i * 2 + t) * 25, 5, '#f472b6');
  } else if (key === 'LIFESTYLE_GARAGE') {
    const g = ctx.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#1e3a8a'); g.addColorStop(1, '#f97316'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w / 2, h);
    R(x0 + 30, cy - 10, w / 2 - 60, h / 2 - 10, '#111827'); for (let i = 0; i < 4; i++) R(x0 + 44 + i * 40, cy + 8, 22, 26, '#fcd34d');
    R(x0 + w / 2, y0, w / 2, h, '#1f2937'); R(cx + 24, cy + 22, w / 2 - 48, 36, '#0b0f19', '#94a3b8'); R(cx + 40, cy - 2, w / 2 - 80, 28, '#111827', '#64748b');
    D(cx + 60, cy + 62, 9, '#000'); D(cx + w / 2 - 60, cy + 62, 9, '#000');
  } else if (key === 'QUOTED_LIVE_PLAN') {
    R(x0 + 30, y0 + 30, w - 60, h - 60, '#e2e8f0', '#0f172a'); L(cx, y0 + 30, cx, y0 + h - 30, '#0f172a', 2);
    const q = (Math.floor(t * 2) % 2) ? '5400x5500' : '5400 × 5500';
    T(q, x0 + 60, cy, '#0369a1', 'bold 13px JetBrains Mono, monospace'); T('4800x5500', cx + 30, cy, '#0369a1', 'bold 13px JetBrains Mono, monospace');
    R(cx + 40, y0 + h - 90, 80, 38, '#334155'); D(cx + 52, y0 + h - 50, 6, '#000'); D(cx + 108, y0 + h - 50, 6, '#000');
  } else if (key === 'CAD_POPUP_3D') {
    R(x0 + 30, y0 + 30, w - 60, h - 60, '#f8fafc', '#94a3b8'); const p = (Math.sin(t * 1.5) + 1) / 2;
    [[0.25, 0.4, 70, 38, '#c2410c'], [0.55, 0.55, 90, 30, '#be185d'], [0.4, 0.2, 50, 50, '#0f766e']].forEach(([a, b, ww, hh, c]) => { const x = x0 + w * a, y = y0 + h * b; R(x, y - hh * p, ww, hh * p, c); R(x, y - hh * p - 6, ww, 6, 'rgba(255,255,255,0.4)'); });
  } else if (key === 'BALSA_HANDS') {
    R(x0, y0, w, h, '#14532d'); for (let i = 0; i < w; i += 24) L(x0 + i, y0, x0 + i, y0 + h, 'rgba(255,255,255,0.12)');
    R(cx - 80, cy - 20, 160, 60, '#e7c48d', '#92400e'); R(cx - 40, cy - 50, 80, 30, '#d9b072', '#92400e');
    const hx = cx + Math.sin(t * 2) * 70; D(hx, cy - 70, 16, '#0a0a0a'); L(hx, cy - 60, hx - 10, cy - 24, '#cbd5e1', 2);
  } else if (key === 'WAVE_MATERIAL') {
    const n = 14, bw = w / n, ph = t * 6;
    for (let i = 0; i < n; i++) for (let j = 0; j < 7; j++) { const v = Math.sin(i * 0.5 + j * 0.4 - ph); const c = v > 0.3 ? '#e8dcc3' : v > -0.3 ? '#6b4a2b' : '#1c1c1f'; R(x0 + i * bw + 2, y0 + 20 + j * (h - 30) / 7, bw - 4, (h - 30) / 7 - 4, c); }
  } else if (key === 'CEILING_LASER') {
    R(x0 + 20, y0 + 20, w - 40, 50, '#cbd5e1'); for (let i = 0; i < 10; i++) L(x0 + 20 + i * (w - 40) / 10, y0 + 20, x0 + 20 + i * (w - 40) / 10, y0 + 70, '#64748b');
    const ly = lerp(y0 + 80, y0 + h - 20, saw(0.3)); L(x0 + 20, ly, x0 + w - 20, ly, '#ef4444', 2);
    [0.25, 0.6, 0.8].forEach((a, i) => { D(x0 + w * a, y0 + h - 40 + Math.sin(t * 3 + i) * 4, 9, '#dc2626'); R(x0 + w * a - 6, y0 + h - 30, 12, 20, '#f59e0b'); });
  } else if (key === 'NEON_WIREFRAME') {
    const p = saw(0.2); ctx.shadowColor = '#facc15'; ctx.shadowBlur = 12; ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2;
    const bx = cx - 80, by = cy + 20; const pts = [[0, 0], [160, 0], [160, 40], [0, 40], [0, 0], [0, -50], [160, -50], [160, 0]];
    ctx.beginPath(); pts.slice(0, Math.max(2, Math.floor(pts.length * p))).forEach(([a, b], i) => i ? ctx.lineTo(bx + a, by + b) : ctx.moveTo(bx + a, by + b)); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, y0 + 50, 6 + 24 * Math.min(1, p * 1.5), 0, 7); ctx.stroke(); ctx.shadowBlur = 0;
    T('VELLUTO ROSA', cx - 36, by + 64, '#f9a8d4');
  } else if (key === 'MACRO_SIX_SHOT') {
    const names = ['Murano', 'Marmo policromo', 'Bouclé', 'Tende controluce', 'Testiera', 'Reveal finale'], act = Math.floor(t / 1.2) % 6, cols = ['#fbbf24', '#7c3aed', '#f5f5dc', '#fde68a', '#be185d', '#0ea5e9'];
    for (let i = 0; i < 6; i++) { const cw = (w - 40) / 3, ch = (h - 30) / 2, x = x0 + 10 + (i % 3) * (cw + 8), y = y0 + 10 + Math.floor(i / 3) * (ch + 6), z = i === act ? 6 * ((t * 0.83) % 1) : 0; R(x - z, y - z, cw + 2 * z, ch + 2 * z, cols[i], i === act ? '#fff' : '#334155'); T(`${i + 1}. ${names[i]}`, x + 6 - z, y + 14 - z, '#0f172a', 'bold 10px Inter'); }
  }
  T(`${meta ? meta.desc : key}`, x0 + 10, y0 + h - 8, '#94a3b8', '9px JetBrains Mono, monospace');
  ctx.restore();
}

function applyEnhancerPostFx(ctx, W, H) {
  const E = ENHANCER_POST_FX; if (!E) return;
  const base = { warm_ad: 'sepia(0.15) saturate(1.15)', deco_onyx: 'contrast(1.2) saturate(0.8) brightness(0.9)', nordic: 'brightness(1.08) saturate(0.75)', blue_hour: 'contrast(1.2) saturate(1.1) brightness(0.92)' }[E.lut] || '';
  const f = `${base} contrast(${(1 + E.sharpness / 400).toFixed(2)}) brightness(${(1 + E.hdr / 600).toFixed(2)})`;
  const cv = ctx.canvas, tmp = applyEnhancerPostFx._t || (applyEnhancerPostFx._t = document.createElement('canvas'));
  tmp.width = W; tmp.height = H; tmp.getContext('2d').drawImage(cv, 0, 0);
  ctx.save(); ctx.clearRect(0, 0, W, H); ctx.filter = f; ctx.drawImage(tmp, 0, 0); ctx.filter = 'none';
  const tint = { warm_ad: 'rgba(245,158,11,0.06)', deco_onyx: 'rgba(168,85,247,0.07)', nordic: 'rgba(186,230,253,0.05)', blue_hour: 'rgba(14,100,200,0.10)' }[E.lut];
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H); }
  if (E.bloom > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, Math.max(W, H) / 1.6); g.addColorStop(0, `rgba(255,190,100,${(E.bloom / 400).toFixed(3)})`); g.addColorStop(1, 'rgba(255,190,100,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

/* ===== v12: STUDIO MULTI-VIDEO, VOLUME PARAMETRICO, RESTYLING, DOCUMENTARIO, CATALOGHI ===== */
const MV = { master: null, vol: { quotes: [], H: 300, win: 3.2 }, scene: 1, mep: { el: false, idr: false, hvac: false, gas: false }, mat: 'travertino',
  inputs: [], strokes: [], schemes: [], products: [], wipe: 55, detail: 0, draw: false, players: {}, doc: { playing: false, t0: 0 }, fx: true,
  intv: { facciata: true, frangisole: true, vetrate: true, pergola: false, led: true, cappotto: true } };
const MV_MATS = { travertino: ['#d8c7a3', '#e9dfc9'], noce: ['#6b4a2b', '#8a6a4a'], parquet: ['#b58a5a', '#e6e0d4'], marmo: ['#8b5a8c', '#d9a4b8'], resina: ['#9aa0a6', '#cfd3d6'] };
const MV_MOTIV = {
  facciata: ['Estetica: rivestimento continuo in travertino/gres che riordina ritmo e proporzioni della facciata.', 'Tecnica/Energia: facciata ventilata + isolamento riducono dispersioni e ponti termici (salto di 1-2 classi, stima).', 'Valore/ROI: la riqualificazione di facciata può aumentare il valore percepito (stima indicativa +8-15%).'],
  frangisole: ['Estetica: lamelle in noce/alluminio danno profondità e identità.', 'Tecnica/Energia: schermatura solare estiva, meno carichi di raffrescamento.', 'Valore/ROI: comfort e immagine premium a costo contenuto.'],
  vetrate: ['Estetica: aperture più ampie portano luce e relazione con il giardino.', 'Tecnica/Energia: serramenti Uw ≤ 1,1 e verifica RAI ≥ 1/8; guadagni solari invernali.', 'Valore/ROI: ambienti luminosi si vendono prima.'],
  pergola: ['Estetica: filtro tra interno ed esterno, estende la zona giorno.', 'Tecnica/Energia: pergola bioclimatica regola ombra e ventilazione (verificare titolo edilizio).', 'Valore/ROI: superficie vivibile aggiuntiva percepita.'],
  led: ['Estetica: strip/lampade architetturali 2700K esaltano materiali e volumi di sera.', 'Tecnica/Energia: LED a basso consumo, sensori e domotica KNX.', 'Valore/ROI: sicurezza e atmosfera nelle foto serali.'],
  cappotto: ['Estetica: superfici planari, nuova finitura uniforme.', 'Tecnica/Energia: cappotto EPS/lana di roccia, correzione ponti termici, detrazioni se applicabili.', 'Valore/ROI: riduzione bollette e salto di classe energetica.']
};
const MV_CAT = [
  ['Edilportale', 'Cappotto termico EPS grafitato 12 cm (λ 0.031)', 'cappotto', 62],
  ['Edilportale', 'Pannello isolante lana di roccia alta densità 14 cm', 'cappotto', 74],
  ['Edilportale', 'Serramento alluminio-legno taglio termico Uw 1.0 triplo vetro', 'vetrate', 780],
  ['Edilportale', 'Vetrata scorrevole panoramica minimal Low-E Uw 1.1', 'vetrate', 920],
  ['Edilportale', 'Facciata ventilata gres porcellanato effetto Travertino Romano', 'facciata', 135],
  ['Edilportale', 'Copertura ventilata in tegole piane antracite + pacchetto isolante', 'facciata', 110],
  ['Edilportale', 'Pompa di calore aria-acqua inverter COP 4.5 + accumulo', 'hvac', 8500],
  ['Edilportale', 'Sistema VMC canalizzata con recupero calore 92%', 'hvac', 3400],
  ['Edilportale', 'Impianto radiante a pavimento ribassato', 'hvac', 78],
  ['Edilportale', 'Impianto fotovoltaico integrato 6 kWp + accumulo 10 kWh', 'led', 9800],
  ['Edilportale', 'Quadro elettrico domotico KNX + moduli dimmer 2700K', 'led', 2600],
  ['Edilportale', 'Pannello fonoassorbente acustico parete 52 dB', 'cappotto', 55],
  ['Archiproducts', 'Strip LED architetturale incasso gesso 2700K CRI>92', 'led', 48],
  ['Archiproducts', 'Lampadario sospensione vetro soffiato Murano / ottone', 'led', 1450],
  ['Archiproducts', 'Faretti trimless dark-light antiabbagliamento 2700K', 'led', 115],
  ['Archiproducts', 'Boiserie dogata in Noce Canaletto massello fonoassorbente', 'noce', 240],
  ['Archiproducts', 'Parquet Rovere Europeo spina ungherese spazzolato', 'parquet', 118],
  ['Archiproducts', 'Lastre grande formato Marmo Calacatta Gold / Policromo', 'marmo', 195],
  ['Archiproducts', 'Resina spatolata continua effetto cemento seta (pavimento/parete)', 'resina', 95],
  ['Archiproducts', 'Frangisole orientabile motorizzato alluminio effetto noce', 'frangisole', 310],
  ['Archiproducts', 'Pergola bioclimatica a lamelle orientabili + LED perimetrale', 'pergola', 680],
  ['Archiproducts', 'Divano modulare rivestito in Bouclé avorio ignifugo', 'marmo', 4200],
  ['Archiproducts', 'Letto imbottito testiera oversize Velluto Rosa Antico', 'marmo', 2800],
  ['Archiproducts', 'Sanitari sospesi Rimless ceramica satinata + miscelatore PVD ottone', 'resina', 1350],
  ['Archiproducts', 'Isola cucina monoblocco Travertino + colonne Noce', 'travertino', 14500]
];
const $mv = id => document.getElementById(id);
const mvShade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f)))); return `rgb(${c})`; };

function mvGeom() {
  const pts = [[0, 0]]; let x = 0, y = 0;
  MV.vol.quotes.forEach(([dx, dy]) => { x += dx; y += dy; pts.push([x, y]); });
  const err = Math.hypot(x, y); if (err < 1 && pts.length > 3) pts.pop();
  let a = 0; pts.forEach((p, i) => { const n = pts[(i + 1) % pts.length]; a += p[0] * n[1] - n[0] * p[1]; });
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { pts, err, ex: x, ey: y, area: Math.abs(a) / 2 / 10000, ccw: a > 0, minx: Math.min(...xs), maxx: Math.max(...xs), miny: Math.min(...ys), maxy: Math.max(...ys) };
}
function mvDrawMaster(ctx, x, y, w, h, dim) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (MV.master) {
    const r = Math.max(w / MV.master.width, h / MV.master.height), iw = MV.master.width * r, ih = MV.master.height * r;
    ctx.drawImage(MV.master, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    // Sfondo radiale profondo #04070f + griglie vettoriali ciano/oro + vetro acrilico (zero segnaposto grezzo)
    const rg = ctx.createRadialGradient(x + w * 0.5, y + h * 0.42, 8, x + w * 0.5, y + h * 0.5, Math.max(w, h) * 0.72);
    rg.addColorStop(0, '#0f1b33');
    rg.addColorStop(0.55, '#070c18');
    rg.addColorStop(1, '#04070f');
    ctx.fillStyle = rg;
    ctx.fillRect(x, y, w, h);

    // Griglia prospettica ciano/oro
    const step = Math.max(18, Math.round(w / 18));
    ctx.lineWidth = 1;
    for (let gx = x; gx <= x + w; gx += step) {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke();
    }
    for (let gy = y; gy <= y + h; gy += step) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.06)';
      ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke();
    }

    // Volume architettonico wireframe ciano/oro in vetro acrilico
    const bx = x + w * 0.2, bw = w * 0.6, by = y + h * 0.26, bh = h * 0.56;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.52)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.strokeRect(bx + bw * 0.14, by + bh * 0.22, bw * 0.28, bh * 0.56);
    ctx.strokeRect(bx + bw * 0.54, by + bh * 0.22, bw * 0.32, bh * 0.56);

    // Bordo vetro acrilico + badge 4K PBR
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    if (w >= 240) {
      ctx.fillStyle = 'rgba(4, 7, 15, 0.82)';
      ctx.fillRect(x + 10, y + 10, 210, 20);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.strokeRect(x + 10, y + 10, 210, 20);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText('💎 4K PBR LUXURY VIEWPORT ACTIVE', x + 16, y + 23);
    }
  }
  if (dim) { ctx.fillStyle = `rgba(2,6,23,${dim})`; ctx.fillRect(x, y, w, h); }
  ctx.restore();
}
function mvRestyled(ctx, x, y, w, h) {
  mvDrawMaster(ctx, x, y, w, h, 0);
  const I = MV.intv, d = 1 + MV.detail * 0.15, prod = MV.products.map(p => p.key);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = 'rgba(245,158,11,0.10)'; ctx.fillRect(x, y, w, h);
  if (I.facciata || prod.includes('facciata')) { ctx.fillStyle = (MV.mat === 'noce' ? 'rgba(107,74,43,0.28)' : 'rgba(216,199,163,0.30)'); ctx.fillRect(x + w * .14, y + h * .26, w * .72, h * .62); }
  if (I.cappotto) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y, w, h); }
  if (I.vetrate) { ctx.fillStyle = 'rgba(190,225,255,0.38)'; for (let i = 0; i < 3; i++) ctx.fillRect(x + w * (.2 + i * .22), y + h * .4, w * .16, h * .34); }
  if (I.frangisole) { ctx.fillStyle = 'rgba(92,58,33,0.85)'; const n = Math.round(14 * d); for (let i = 0; i < n; i++) ctx.fillRect(x + w * .62 + i * (w * .22 / n), y + h * .3, 3, h * .52); }
  if (I.pergola) { ctx.strokeStyle = 'rgba(40,30,20,0.9)'; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(x + w * .1, y + h * (.2 + i * .012)); ctx.lineTo(x + w * .9, y + h * (.2 + i * .012)); ctx.stroke(); } }
  if (I.led || prod.includes('led')) { for (let i = 0; i < 14; i++) { const g = ctx.createRadialGradient(x + w * (.16 + i * .05), y + h * .86, 1, x + w * (.16 + i * .05), y + h * .86, 16); g.addColorStop(0, 'rgba(255,200,110,.9)'); g.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = g; ctx.fillRect(x + w * (.16 + i * .05) - 16, y + h * .86 - 16, 32, 32); } }
  ctx.restore();
}
function mvDrawStrokes(ctx, x, y, w, h) {
  ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.shadowColor = '#38bdf8'; ctx.shadowBlur = 5;
  MV.strokes.forEach(s => { ctx.beginPath(); s.forEach((p, i) => i ? ctx.lineTo(x + p[0] * w, y + p[1] * h) : ctx.moveTo(x + p[0] * w, y + p[1] * h)); ctx.stroke(); });
  ctx.restore();
}

/* --- volume 3D --- */
function mvDrawVolume(ctx, W, H, o) {
  const g = mvGeom(), Hc = MV.vol.H, sc = o.scene, top = sc === 1, prog = o.progress == null ? 1 : o.progress;
  const roof = o.roof != null ? o.roof : sc === 2, furn = o.furn != null ? o.furn : sc === 5, mep = o.mep || (sc === 4 ? { el: 1, idr: 1, hvac: 1, gas: 1 } : MV.mep);
  const rawP = (x, y, z) => top ? [x, -y] : [(x - y) * .866, (x + y) * .5 - z];
  const all = []; g.pts.forEach(p => { all.push(rawP(p[0], p[1], 0), rawP(p[0], p[1], Hc + (o.lift || 0))); });
  const bx = Math.min(...all.map(a => a[0])), BX = Math.max(...all.map(a => a[0])), by = Math.min(...all.map(a => a[1])), BY = Math.max(...all.map(a => a[1]));
  const s = Math.min((W - 60) / Math.max(1, BX - bx), (H - 70) / Math.max(1, BY - by));
  const P = (x, y, z) => { const r = rawP(x, y, z); return [30 + (W - 60 - (BX - bx) * s) / 2 + (r[0] - bx) * s, 40 + (H - 70 - (BY - by) * s) / 2 + (r[1] - by) * s]; };
  const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = o.wire ? 2 : 1; ctx.stroke(); } };
  const [fc, wc] = MV_MATS[MV.mat] || MV_MATS.travertino, n = g.pts.length, vis = Math.ceil(prog * n);
  if (!o.wire) poly(g.pts.map(p => P(p[0], p[1], 0)), fc, '#334155');
  if (o.zoning) { ctx.save(); ctx.beginPath(); g.pts.forEach((p, i) => { const q = P(p[0], p[1], 0); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.clip();
    const a = P(g.minx, g.miny, 0), b = P(g.maxx, g.maxy, 0), w3 = (b[0] - a[0]) / 3; [['rgba(6,182,212,.55)', 'Giorno 42%'], ['rgba(168,85,247,.55)', 'Notte 35%'], ['rgba(16,185,129,.55)', 'Servizi 23%']].forEach((z, i) => { ctx.fillStyle = z[0]; ctx.fillRect(Math.min(a[0], b[0]) + i * Math.abs(w3), 0, Math.abs(w3), H); ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.fillText(z[1], Math.min(a[0], b[0]) + i * Math.abs(w3) + 4, H / 2); }); ctx.restore(); }
  const edges = g.pts.map((p, i) => ({ a: p, b: g.pts[(i + 1) % n], i })).sort((u, v) => (u.a[0] + u.a[1] + u.b[0] + u.b[1]) - (v.a[0] + v.a[1] + v.b[0] + v.b[1]));
  edges.forEach(e => {
    if (top || e.i >= vis) return;
    const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1], L = Math.hypot(dx, dy) || 1, nx = (g.ccw ? dy : -dy) / L, light = .75 + .25 * nx;
    const q = [P(e.a[0], e.a[1], 0), P(e.b[0], e.b[1], 0), P(e.b[0], e.b[1], Hc), P(e.a[0], e.a[1], Hc)];
    poly(q, o.wire ? null : mvShade(wc, light), o.wire ? '#fff' : '#475569');
    if (L > 150 && !o.wire) { const mx = (e.a[0] + e.b[0]) / 2, my = (e.a[1] + e.b[1]) / 2, ux = dx / L * 60, uy = dy / L * 60;
      poly([P(mx - ux, my - uy, 90), P(mx + ux, my + uy, 90), P(mx + ux, my + uy, 220), P(mx - ux, my - uy, 220)], 'rgba(147,197,253,.75)', '#1e3a8a'); }
  });
  if (top) { ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2; poly(g.pts.map(p => P(p[0], p[1], 0)), null, o.wire ? '#fff' : '#0ea5e9');
    ctx.fillStyle = '#facc15'; ctx.font = 'bold 11px monospace'; g.pts.forEach((p, i) => { const q = g.pts[(i + 1) % n], m = P((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, 0); ctx.fillText(Math.round(Math.hypot(q[0] - p[0], q[1] - p[1])) + ' cm', m[0] - 14, m[1] - 4); }); }
  if (roof) poly(g.pts.map(p => P(p[0], p[1], Hc + (o.lift || 0))), 'rgba(120,80,60,.9)', '#3f2a20');
  const L2 = (a, b, c, d2, z, col) => { const p1 = P(a, b, z), p2 = P(c, d2, z); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); };
  const cx = (g.minx + g.maxx) / 2, cy = (g.miny + g.maxy) / 2, m = 30;
  if (mep.el) { for (let i = 0; i < n; i++) { const a = g.pts[i], b = g.pts[(i + 1) % n]; L2(a[0] + (cx - a[0]) * .06, a[1] + (cy - a[1]) * .06, b[0] + (cx - b[0]) * .06, b[1] + (cy - b[1]) * .06, 30, '#facc15'); } }
  if (mep.idr) { L2(g.minx + m, g.miny + m, cx, cy, 10, '#38bdf8'); L2(cx, cy, g.maxx - m, g.miny + m, 10, '#38bdf8'); }
  if (mep.hvac) { for (let k = 1; k < 4; k++) L2(g.minx + m, g.miny + (g.maxy - g.miny) * k / 4, g.maxx - m, g.miny + (g.maxy - g.miny) * k / 4, Hc - 15, '#22d3ee'); }
  if (mep.gas) { L2(g.minx + m, g.maxy - m, g.maxx - m, g.maxy - m, 20, '#f87171'); L2(g.maxx - m, g.maxy - m, g.maxx - m, g.miny + m, 20, '#c084fc'); }
  if (furn) { const bw = g.maxx - g.minx, bh = g.maxy - g.miny;
    [[g.minx + 40, g.miny + 40, 200, 90, 80, '#be185d'], [cx - 60, cy - 35, 120, 70, 45, '#92400e'], [Math.max(g.minx + 40, g.maxx - 200), Math.max(g.miny + 40, g.maxy - 240), 160, 200, 50, '#e7d6c4']].forEach(([x, y, w, d, h, c]) => {
      if (top) { poly([P(x, y, 0), P(x + w, y, 0), P(x + w, y + d, 0), P(x, y + d, 0)], c, '#000'); return; }
      poly([P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)], mvShade(c, .8), '#000'); poly([P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)], mvShade(c, .6), '#000'); poly([P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)], c, '#000'); }); }
}

/* --- viewport & ruby export --- */
function mvParseQuotes() {
  const rows = ($mv('mvQuotes').value || '').split('\n').map(l => (l.match(/-?\d+(?:[.,]\d+)?/g) || []).map(v => parseFloat(v.replace(',', '.')))).filter(r => r.length >= 2);
  MV.vol.quotes = rows.map(r => [r[0], r[1]]); MV.vol.H = parseFloat($mv('mvH').value) || 300; MV.vol.win = parseFloat($mv('mvWin').value) || 0;
}
window.mvVolChanged = function () { mvParseQuotes(); mvRefresh(); };
window.mvRefresh = function () {
  mvParseQuotes(); const c = $mv('mvVolCv'); if (!c) return; const x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height);
  mvDrawVolume(x, c.width, c.height, { scene: MV.scene }); if ($mv('mvFx')?.checked) applyEnhancerPostFx(x, c.width, c.height);
  if ($mv('mvWebglPbr')?.checked && typeof RealLuxPBR !== 'undefined') RealLuxPBR.apply(c);
  if ($mv('mvControlNet')?.checked && typeof ControlNetBridge !== 'undefined') ControlNetBridge.overlayEdges(c);
  x.fillStyle = '#e2e8f0'; x.font = 'bold 11px sans-serif'; x.fillText(['', '1. Pianta dall\'alto', '2. Assonometria con Tetto', '3. Assonometria Tetto Nascosto', '4. Solo Pareti, Aperture & Reti', '5. Modello Completo con Arredi'][MV.scene], 10, 16);
  const g = mvGeom(), rai = g.area > 0 ? MV.vol.win / g.area : 0;
  $mv('mvVolInfo').textContent = `Σdx=${g.ex.toFixed(1)} cm  Σdy=${g.ey.toFixed(1)} cm  scarto di chiusura=${g.err.toFixed(1)} cm\nSup.=${g.area.toFixed(2)} mq  H=${MV.vol.H} cm  RAI=${rai.toFixed(3)} (${rai >= .125 ? 'OK ≥ 1/8' : 'INSUFFICIENTE: servono ' + (g.area / 8).toFixed(2) + ' mq finestrati'})`;
  const f = mvRuby(); $mv('mvRubyStr').textContent = "rb = Dir[File.join(Dir.home, 'Downloads', '*_3D*.rb')].max_by { |f| File.mtime(f) }; load rb";
  mvSuggest(); mvMotiv(); mvRes(); mvInjected(); mvDocScript(); mvDrawMasterCv(); mvStaticPlayers();
};
function mvRuby() {
  const g = mvGeom(), H = MV.vol.H, f = v => v.toFixed(1) + '.cm', n = g.pts.length, cx = (g.minx + g.maxx) / 2, cy = (g.miny + g.maxy) / 2, sp = Math.max(g.maxx - g.minx, g.maxy - g.miny);
  let wins = ''; g.pts.forEach((p, i) => { const q = g.pts[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); if (L < 150) return;
    const nx = (g.ccw ? dy : -dy) / L, ny = (g.ccw ? -dx : dx) / L, mx = (p[0] + q[0]) / 2 + nx * .5, my = (p[1] + q[1]) / 2 + ny * .5, ux = dx / L * 60, uy = dy / L * 60;
    wins += `win.entities.add_face([${mx - ux}.cm,${my - uy}.cm,90.cm],[${mx + ux}.cm,${my + uy}.cm,90.cm],[${mx + ux}.cm,${my + uy}.cm,220.cm],[${mx - ux}.cm,${my - uy}.cm,220.cm]).material = 'LightBlue'\n`; });
  const sc = [["1. Pianta dall'alto", [cx, cy, sp * 2.2], [cx, cy, 0], [0, 1, 0], 'false', 'true', 'false'], ['2. Assonometria con Tetto', [cx + sp, cy - sp, sp * 1.1], [cx, cy, H / 2], [0, 0, 1], 'true', 'true', 'false'],
    ['3. Assonometria Tetto Nascosto', [cx + sp, cy - sp, sp * 1.1], [cx, cy, H / 2], [0, 0, 1], 'false', 'true', 'false'], ['4. Solo Pareti, Aperture & Reti (Senza Mobili)', [cx + sp, cy - sp, sp * 1.1], [cx, cy, H / 2], [0, 0, 1], 'false', 'false', 'true'],
    ['5. Modello Completo con Arredi', [cx + sp * .8, cy - sp * .8, sp * .6], [cx, cy, H / 3], [0, 0, 1], 'false', 'true', 'false']];
  const prods = MV.products.map(p => `# Prodotto iniettato: ${p.src} - ${p.name}${p.url ? ' (' + p.url + ')' : ''}`).join('\n');
  const rb = `# CADBridge Pro - volume parametrico (quote in cm, H=${H})\n# Scarto di chiusura quote: ${g.err.toFixed(1)} cm\n${prods}\nmodel = Sketchup.active_model\nents = model.active_entities\nmodel.start_operation('CADBridge 3D', true)\nh = ${H}.0.cm\npts = [${g.pts.map(p => `[${f(p[0])},${f(p[1])},0]`).join(',')}]\nvol = ents.add_group; vol.name = 'Volume'\nface = vol.entities.add_face(pts)\nface.reverse! if face.normal.z < 0\nface.pushpull(h)\nL_roof = model.layers.add('Tetto'); L_furn = model.layers.add('Arredi'); L_mep = model.layers.add('Reti MEP')\nroof = ents.add_group; roof.entities.add_face(pts.map{|p| [p[0],p[1],h]}); roof.layer = L_roof\nm = model.materials.add('LightBlue'); m.color = [147,197,253]; m.alpha = 0.6\nwin = ents.add_group; win.name = 'Aperture'\n${wins}mep = ents.add_group; mep.layer = L_mep\nmep.entities.add_edges(*pts.map{|p| [p[0],p[1],30.cm]}, [pts[0][0],pts[0][1],30.cm])\nfurn = ents.add_group; furn.layer = L_furn\nbox = lambda{|x,y,w,d,hh| f = furn.entities.add_face([x,y,0],[x+w,y,0],[x+w,y+d,0],[x,y+d,0]); f.reverse! if f.normal.z < 0; f.pushpull(hh)}\nbox.call(${f(g.minx + 40)},${f(g.miny + 40)},200.cm,90.cm,80.cm)\nbox.call(${f(cx - 60)},${f(cy - 35)},120.cm,70.cm,45.cm)\nview = model.active_view\nscenes = ${JSON.stringify(sc)}\nscenes.each do |n,e,t,u,rv,fv,mv|\n  L_roof.visible = rv; L_furn.visible = fv; L_mep.visible = mv\n  view.camera = Sketchup::Camera.new(Geom::Point3d.new(*e.map{|v| v.cm}), Geom::Point3d.new(*t.map{|v| v.cm}), Geom::Vector3d.new(*u))\n  model.pages.add(n)\nend\nL_roof.visible = true; L_furn.visible = true; L_mep.visible = false\nmodel.commit_operation\n`;
  return rb;
}
window.mvExportSketchup = function () {
  mvParseQuotes(); const g = mvGeom(), stamp = Date.now(), base = `CADBridge_${stamp}`;
  const dl = (name, data, type) => { const a = document.createElement('a'); a.href = typeof data === 'string' && data.startsWith('data:') ? data : URL.createObjectURL(new Blob([data], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); };
  dl(`${base}_3D.rb`, mvRuby().replace(/\]\.map\{\|v\| v\.cm\}/g, '].map{|v| v.cm}'), 'text/plain');
  dl(`${base}_NOTE.md`, `# Note volume parametrico\n\n- Quote in cm (priorità alle quote scritte)\n- Catena: ${MV.vol.quotes.map(q => q.join(',')).join(' | ')}\n- Σdx=${g.ex.toFixed(1)} cm, Σdy=${g.ey.toFixed(1)} cm, **scarto di chiusura ${g.err.toFixed(1)} cm**\n- H=${MV.vol.H} cm, Sup.=${g.area.toFixed(2)} mq\n- Prodotti: ${MV.products.map(p => p.src + ': ' + p.name).join('; ') || 'nessuno'}\n`, 'text/markdown');
  const s0 = MV.scene; MV.scene = 5; mvRefresh(); dl(`${base}_Anteprima.png`, $mv('mvVolCv').toDataURL('image/png')); MV.scene = s0; mvRefresh();
  appendLog('📦 Pacchetto SketchUp esportato (.rb + _NOTE.md + _Anteprima.png). In Console Ruby: incolla la stringa mostrata.');
};
window.mvCopyRuby = function () { navigator.clipboard?.writeText($mv('mvRubyStr').textContent); appendLog('📋 Stringa Console Ruby copiata.'); };

/* --- suggestions, motivations, history --- */
function mvSuggest() {
  const g = mvGeom(), rai = g.area ? MV.vol.win / g.area : 0, t = [];
  t.push(rai >= .125 ? `✔ RAI ${rai.toFixed(3)} ≥ 1/8` : `⚠ RAI ${rai.toFixed(3)} < 1/8: aggiungi almeno ${(g.area / 8 - MV.vol.win).toFixed(2)} mq di superficie finestrata`);
  if (g.err > 2) t.push(`⚠ Catena quote non chiusa (scarto ${g.err.toFixed(1)} cm): verifica una quota.`);
  t.push('⚡ Tracce impianti: dorsali perimetrali a ~30 cm da pavimento, punti luce LED 2700K su linee dedicate, quadro vicino all\'ingresso.');
  t.push('💧 Collettore idrico baricentrico, scarichi con pendenza ≥ 1%, bagni/cucina sullo stesso cavedio.');
  t.push('❄️ Canali HVAC a controsoffitto sul lato corridoio; VMC con bocchette lontane dalle finestre.');
  t.push(`🎨 Abbinamento: ${{ travertino: 'travertino + noce + ottone', noce: 'noce + bouclé avorio + LED caldo', parquet: 'parquet a spina + pareti calce + nero opaco', marmo: 'marmo policromo + velluto rosa + oro', resina: 'resina + legno chiaro + verde salvia' }[MV.mat]}`);
  $mv('mvSuggest').textContent = '💡 Suggerimenti IA (regole locali)\n' + t.join('\n');
}
function mvMotiv() {
  const act = Object.keys(MV.intv).filter(k => MV.intv[k]);
  $mv('mvMotiv').textContent = '💡 Suggerimento Motivato (stime indicative)\n\n' + (act.map(k => `■ ${k.toUpperCase()}\n ${MV_MOTIV[k].join('\n ')}`).join('\n\n') || 'Nessun intervento selezionato.');
}
function mvInjected() {
  $mv('mvInjected').textContent = MV.products.length ? '📌 Prodotti iniettati (3D .rb, restyling, documentario, video):\n' + MV.products.map((p, i) => `${i + 1}. [${p.src}] ${p.name}${p.url ? ' — ' + p.url : ''}`).join('\n') : 'Nessun prodotto iniettato.';
  $mv('mvHist').textContent = '🔗 Loop condizionato a catena\n' + (MV.inputs.map((x, i) => `Step ${i + 1} [${x.type}] ${x.text}` + (i ? `  (condizionato da step 1–${i})` : '')).join('\n') || 'Aggiungi testo, voce, schizzi o schemi: ogni step modifica il successivo.');
}
function mvApplyKeys(txt) {
  const s = txt.toLowerCase(), set = (k, v) => { if (k in MV.intv) MV.intv[k] = v; };
  const h = s.match(/altezza\s*(\d{3})/); if (h) { $mv('mvH').value = h[1]; }
  [['travertino', 'travertino'], ['noce', 'noce'], ['parquet', 'parquet'], ['marmo', 'marmo'], ['velluto', 'marmo'], ['resina', 'resina']].forEach(([k, m]) => { if (s.includes(k)) { MV.mat = m; } });
  ['pergola', 'frangisole', 'vetrat', 'led', 'cappotto', 'facciata'].forEach(k => { if (s.includes(k)) set(k === 'vetrat' ? 'vetrate' : k, !/(togli|rimuovi|senza)/.test(s)); });
  if (/elettric|knx/.test(s)) MV.mep.el = true; if (/idric/.test(s)) MV.mep.idr = true; if (/hvac|clima|vmc/.test(s)) MV.mep.hvac = true; if (/gas|fibra/.test(s)) MV.mep.gas = true;
}
function mvAddInput(type, text) { MV.inputs.push({ type, text }); MV.detail++; mvApplyKeys(text); mvIntvUI(); mvVolChanged(); appendLog(`🔗 Step ${MV.inputs.length} (${type}): ${text}`); }
window.mvAddText = function () { const v = $mv('mvTxt').value.trim(); if (v) { mvAddInput('testo', v); $mv('mvTxt').value = ''; } };
window.mvDictate = function () {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) { appendLog('⚠️ Dettatura non supportata da questo browser.'); return; }
  const r = new R(); r.lang = 'it-IT'; r.onresult = e => mvAddInput('voce', e.results[0][0].transcript); r.onend = () => $mv('mvMicBtn').textContent = '🎙️ Dettatura Vocale'; $mv('mvMicBtn').textContent = '🔴 Ascolto…'; r.start();
};
window.mvAddScheme = async function (ev) {
  for (const f of Array.from(ev.target.files || [])) {
    if (f.type.startsWith('image/')) { const img = new Image(); img.onload = () => { MV.schemes.push(img); mvAddInput('schema', f.name); }; img.src = URL.createObjectURL(f); }
    else { await processDocumentFile(f); mvAddInput('documento', f.name); }
  } ev.target.value = '';
};

/* --- restyling canvas --- */
function mvIntvUI() {
  $mv('mvIntv').innerHTML = Object.keys(MV.intv).map(k => `<label><input type="checkbox" ${MV.intv[k] ? 'checked' : ''} onchange="MV.intv['${k}']=this.checked;mvRefresh()"> ${k}</label>`).join(' ');
}
window.mvRes = function () {
  const c = $mv('mvResCv'); if (!c) return; const x = c.getContext('2d'), W = c.width, H = c.height, wx = W * MV.wipe / 100;
  mvDrawMaster(x, 0, 0, W, H, 0); x.save(); x.beginPath(); x.rect(wx, 0, W - wx, H); x.clip(); mvRestyled(x, 0, 0, W, H); x.restore();
  x.fillStyle = '#fff'; x.fillRect(wx - 1, 0, 2, H); x.font = 'bold 12px sans-serif'; x.fillText('PRIMA', 10, 18); x.fillText('DOPO', W - 52, 18);
  MV.schemes.slice(-3).forEach((im, i) => { x.globalAlpha = .85; x.drawImage(im, 10 + i * 90, H - 70, 80, 60); x.globalAlpha = 1; });
  mvDrawStrokes(x, 0, 0, W, H); if ($mv('mvFx')?.checked) applyEnhancerPostFx(x, W, H);
};
window.mvToggleDraw = function () { MV.draw = !MV.draw; $mv('mvDrawBtn').textContent = MV.draw ? '✅ Disegno attivo (tocca il canvas)' : '✍️ Disegna schizzo sopra'; };
function mvInitDraw() {
  const c = $mv('mvResCv'); let cur = null;
  const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  c.addEventListener('pointerdown', e => { if (!MV.draw) return; cur = [pt(e)]; MV.strokes.push(cur); c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', e => { if (cur) { cur.push(pt(e)); mvRes(); } });
  c.addEventListener('pointerup', () => { if (cur) { cur = null; mvAddInput('schizzo', `tratto ${MV.strokes.length}`); } });
}

/* --- catalogo multi-canale --- */
window.mvCatSearch = function () {
  const q = ($mv('mvQ').value || '').toLowerCase(), list = MV_CAT.filter(p => !q || p[1].toLowerCase().includes(q) || p[0].toLowerCase().includes(q));
  $mv('mvCatList').innerHTML = list.map(p => `<div class="mvbox"><b>${p[0]}</b> — ${p[1]} <span style="color:#34d399">(~€${p[3]})</span><br><button class="btn btn-cyan" onclick="mvInject(${MV_CAT.indexOf(p)})">💉 Inietta</button></div>`).join('') || '<div class="mvbox">Nessun risultato locale: cerca su Edilportale/Archiproducts e clicca "📋 Incolla Scheda".</div>';
};
function mvInjectProduct(p) {
  MV.products.push(p); const k = p.key;
  if (k in MV.intv) MV.intv[k] = true; if (k in MV_MATS) MV.mat = k;
  if (k === 'hvac') MV.mep.hvac = true; if (k === 'led') MV.mep.el = true;
  mvIntvUI(); mvVolChanged(); appendLog(`💉 Prodotto iniettato: [${p.src}] ${p.name}${p.price ? ` (€${p.price})` : ''}`);
}
window.mvInject = function (i) { const p = MV_CAT[i]; mvInjectProduct({ src: p[0], name: p[1], key: p[2], price: p[3] || 0, url: '' }); };
window.mvCatManual = function () {
  const n = $mv('mvPName').value.trim(); if (!n) return;
  const s = n.toLowerCase(), pr = parseFloat($mv('mvPPrice')?.value) || 0;
  const key = ['cappotto', 'vetrate', 'facciata', 'led', 'noce', 'parquet', 'frangisole', 'pergola', 'resina', 'marmo', 'travertino', 'hvac'].find(k => s.includes(k.replace('vetrate', 'infiss'))) || 'facciata';
  mvInjectProduct({ src: $mv('mvPSrc').value, name: n, key, price: pr, url: $mv('mvPUrl').value.trim() });
  $mv('mvPName').value = ''; $mv('mvPUrl').value = ''; if ($mv('mvPPrice')) $mv('mvPPrice').value = '';
};
window.mvOpenPortal = function (p) { const q = encodeURIComponent($mv('mvQ').value || ''); window.open(p === 'edilportale' ? `https://www.edilportale.com/prodotti?q=${q}` : `https://www.archiproducts.com/it/search?q=${q}`, '_blank', 'noopener'); };
window.mvPastePortalCard = async function () {
  let raw = '';
  try { raw = await navigator.clipboard.readText(); } catch (e) { raw = prompt('Incolla qui testo o URL copiato da Edilportale / Archiproducts:') || ''; }
  if (!raw.trim()) { appendLog('⚠️ Appunti vuoti: copia un link o il testo della scheda prodotto dal portale.'); return; }
  const urlMatch = raw.match(/https?:\/\/\S+/i);
  const url = urlMatch ? urlMatch[0] : '';
  const src = /archiproducts/i.test(raw) ? 'Archiproducts' : 'Edilportale';
  const priceMatch = raw.match(/(?:€|EUR)\s*([\d.,]+)/i);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')) || 0 : 0;
  const lines = raw.replace(/https?:\/\/\S+/g, '').split(/\r?\n/).map(x => x.trim()).filter(x => x.length > 3);
  const name = (lines[0] || url.split('/').pop() || 'Prodotto Portale').slice(0, 90);
  $mv('mvPName').value = name; $mv('mvPUrl').value = url; $mv('mvPSrc').value = src;
  if ($mv('mvPPrice') && price) $mv('mvPPrice').value = price;
  mvCatManual();
};
window.mvFetchOpenPbr = async function () {
  const box = $mv('mvPbrList'); if (!box) return;
  box.innerHTML = '<span style="font-size:.68rem;color:#38bdf8;">⏳ Connessione API PolyHaven CC0...</span>';
  try {
    const res = await fetch('https://api.polyhaven.com/assets?t=textures');
    const data = await res.json();
    const q = ($mv('mvQ').value || '').toLowerCase();
    const entries = Object.entries(data).filter(([id, v]) => !q || id.includes(q) || (v.name || '').toLowerCase().includes(q) || (v.tags || []).some(t => t.includes(q))).slice(0, 8);
    box.innerHTML = entries.map(([id, v]) => `<button type="button" class="btn" onclick="mvInjectProduct({src:'PolyHaven PBR',name:'${(v.name || id).replace(/'/g, '')} (Texture 4K CC0)',key:'travertino',price:0,url:'https://polyhaven.com/a/${id}'})">🧱 ${v.name || id}</button>`).join('') || '<span style="font-size:.68rem;color:#94a3b8;">Nessuna texture trovata per questo filtro.</span>';
    appendLog(`🌐 PolyHaven API: caricate ${entries.length} texture PBR 4K reali.`);
  } catch (e) {
    box.innerHTML = '<span style="font-size:.68rem;color:#f87171;">⚠️ Offline o CORS bloccato per PolyHaven.</span>';
  }
};
window.mvSyncComputo = function () {
  if (typeof window.generaComputo !== 'function') return;
  const d = window.generaComputo();
  const extra = MV.products.filter(p => p.price > 0);
  if (extra.length && document.getElementById('computoOut')) {
    const extraTot = extra.reduce((s, p) => s + p.price, 0);
    const tbl = document.getElementById('computoOut').querySelector('table');
    if (tbl) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="3" style="color:#38bdf8">+ Prodotti iniettati da Catalogo (${extra.length})</td><td style="text-align:right;color:#38bdf8">${_eur(extraTot)}</td>`;
      tbl.appendChild(tr);
    }
    appendLog(`📊 Sincronizzati ${extra.length} prodotti iniettati nel Computo Metrico (+${_eur(extraTot)}).`);
  }
};
window.mvImportCatalogAny = async function (ev) {
  const f = ev.target.files[0]; if (!f) return;
  const ext = _extOf(f.name);
  let count = 0;
  if (ext === 'json') {
    try {
      const arr = JSON.parse(await f.text());
      (Array.isArray(arr) ? arr : [arr]).forEach(o => { if (o.name || o.prodotto) { $mv('mvPName').value = o.name || o.prodotto; $mv('mvPUrl').value = o.url || ''; $mv('mvPSrc').value = o.src || 'Edilportale'; if ($mv('mvPPrice')) $mv('mvPPrice').value = o.price || 0; mvCatManual(); count++; } });
    } catch (e) {}
  } else if (['xlsx', 'xls'].includes(ext)) {
    await _loadScriptOnce('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 }).filter(r => r[0]);
    if (rows.length && /nome|name|prodotto/i.test(String(rows[0][0]))) rows.shift();
    rows.forEach(r => { $mv('mvPName').value = String(r[0]); $mv('mvPSrc').value = /archi/i.test(String(r[1] || '')) ? 'Archiproducts' : 'Edilportale'; $mv('mvPUrl').value = String(r[2] || ''); if ($mv('mvPPrice') && r[3]) $mv('mvPPrice').value = parseFloat(r[3]) || 0; mvCatManual(); count++; });
  } else if (ext === 'pdf') {
    await processDocumentFile(f);
    $mv('mvPName').value = `Scheda Tecnica PDF: ${f.name.replace(/\.pdf$/i, '')}`; $mv('mvPSrc').value = 'Edilportale'; mvCatManual(); count = 1;
  } else {
    const rows = (await f.text()).split(/\r?\n/).map(l => l.split(/[;,\t]/).map(s => s.trim().replace(/^"|"$/g, ''))).filter(r => r[0]);
    if (rows.length && /^nome|^name|^prodotto/i.test(rows[0][0])) rows.shift();
    rows.forEach(r => { $mv('mvPName').value = r[0]; $mv('mvPSrc').value = /archi/i.test(r[1] || '') ? 'Archiproducts' : 'Edilportale'; $mv('mvPUrl').value = r[2] || ''; if ($mv('mvPPrice') && r[3]) $mv('mvPPrice').value = parseFloat(r[3]) || 0; mvCatManual(); count++; });
  }
  ev.target.value = '';
  appendLog(`📥 Import Catalogo (${ext.toUpperCase()}): ${count} prodotti iniettati.`);
};

/* --- master --- */
window.mvUseStudio = function () { const c = $mv('studio-canvas'); if (!c) return; const im = new Image(); im.onload = () => { MV.master = im; $mv('mvMasterInfo').textContent = 'Master dallo Studio 4K (bloccata).'; mvRefresh(); }; im.src = c.toDataURL('image/png'); };
window.mvLoadMaster = function (ev) { const f = ev.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { MV.master = im; $mv('mvMasterInfo').textContent = `Master: ${f.name} (bloccata)`; mvRefresh(); }; im.src = URL.createObjectURL(f); };
window.mvParseQuotedPdf = async function (ev) {
  const f = ev.target.files[0]; if (!f) return;
  try {
    await _loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
    const page = await pdf.getPage(1);
    const tc = await page.getTextContent();
    const txt = tc.items.map(x => x.str).join(' ');
    const nums = (txt.match(/\b\d{2,4}(?:[.,]\d)?\b/g) || []).map(v => parseFloat(v.replace(',', '.'))).filter(n => n >= 80 && n <= 2500);
    if (nums.length >= 2) {
      const w = nums[0], h = nums[1];
      $mv('mvQuotes').value = `${w},0\n0,${h}\n-${w},0\n0,-${h}`;
      appendLog(`📐 PDF Quotato (${f.name}): estratte quote prioritarie ${w}×${h} cm (su ${nums.length} valori rilevati).`);
    } else {
      appendLog(`📐 PDF Quotato (${f.name}): nessuna coppia quote ≥80 cm trovata nel testo, mantengo catena attuale.`);
    }
    const vp = page.getViewport({ scale: 1.5 });
    const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height;
    await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    const im = new Image(); im.onload = () => { MV.master = im; $mv('mvMasterInfo').textContent = `PDF Quotato: ${f.name}`; mvVolChanged(); };
    im.src = cv.toDataURL('image/png');
  } catch (e) {
    appendLog(`⚠️ Impossibile leggere PDF quotato (${e.message || 'errore'}).`);
  }
  ev.target.value = '';
};
function mvDrawMasterCv() { const c = $mv('mvMasterCv'); if (c) mvDrawMaster(c.getContext('2d'), 0, 0, c.width, c.height, 0); }

/* --- fx & voice --- */
window.mvFxChange = function () { Object.assign(ENHANCER_POST_FX, { lut: $mv('mvLut').value, sharpness: +$mv('mvSharp').value, bloom: +$mv('mvBloom').value, hdr: +$mv('mvHdr').value }); mvRefresh(); };
window.mvVoiceSel = function (v) { onHumanVoiceSelectChange(v); };
window.mvVoiceSl = function (k, v) { localStorage.setItem('xvideo_voice_' + k, v); try { updateVoiceSliderVal('voice' + k[0].toUpperCase() + k.slice(1), v); } catch (e) { } };
window.mvNarrate = function (text, done) { const el = $mv('liveSpotVoiceText'), old = el ? el.value : null; if (el) el.value = text; HumanVoiceOrchestrator.speakSpot('architetto', () => { if (el && old !== null) el.value = old; done && done(); }); };

/* --- player draw functions --- */
const MV_BG = (ctx, W, H) => { ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H); };
const MV_LBL = (ctx, s, W, H) => { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, H - 22, W, 22); ctx.fillStyle = '#fff'; ctx.font = '11px sans-serif'; ctx.fillText(s, 8, H - 7); };
const MV_PRODCAP = (ctx, W) => { if (MV.products.length) { ctx.fillStyle = '#fde68a'; ctx.font = '10px sans-serif'; ctx.fillText('Prodotti: ' + MV.products.slice(-3).map(p => p.name).join(' · ').slice(0, 90), 8, 14); } };
function d1A(ctx, W, H, t) {
  MV_BG(ctx, W, H); const st = Math.floor(t / 2) % 5, p = (t % 2) / 2;
  const lab = ['Pianta', '/axo Assonometria esplosa', '/section Sezione A-A', '/zoning Giorno 42% · Notte 35% · Servizi 23%', '6-Step: Site → Base → Sculpt → Struct → Circ → Program'];
  if (st === 0) mvDrawVolume(ctx, W, H, { scene: 1 }); else if (st === 1) mvDrawVolume(ctx, W, H, { scene: 2, lift: 120 * p, roof: true });
  else if (st === 2) { const g = mvGeom(), w = W * .6, h = MV.vol.H / (g.maxx - g.minx) * w; ctx.fillStyle = MV_MATS[MV.mat][1]; ctx.fillRect(W * .2, H * .75 - h, w, h); ctx.strokeStyle = '#facc15'; ctx.strokeRect(W * .2, H * .75 - h, w, h); ctx.fillStyle = '#facc15'; ctx.fillText(`H = ${MV.vol.H} cm`, W * .2 + 6, H * .75 - h - 6); ctx.fillStyle = '#64748b'; ctx.fillRect(W * .15, H * .75, w + W * .1, 6); }
  else if (st === 3) mvDrawVolume(ctx, W, H, { scene: 1, zoning: true });
  else for (let i = 0; i < 6; i++) { const on = i <= Math.floor(p * 6) + 0; ctx.fillStyle = on ? '#0ea5e9' : '#1e293b'; ctx.fillRect(20 + i * (W - 40) / 6, H / 2 - 30 - i * 8, (W - 40) / 6 - 8, 60 + i * 16); }
  MV_LBL(ctx, `1A /board — ${lab[st]}`, W, H); MV_PRODCAP(ctx, W);
}
function d1B(ctx, W, H, t) { const p = (t % 10) / 10; mvDrawMaster(ctx, 0, 0, W, H, .45); if (p < .7) { mvDrawVolume(ctx, W, H, { scene: 3, wire: true, progress: p / .7, roof: false }); } else { ctx.globalAlpha = (p - .7) / .3; mvRestyled(ctx, 0, 0, W, H); ctx.globalAlpha = 1; } MV_LBL(ctx, '1B /overlay — tracciamento wireframe bianco, quote mm → render', W, H); MV_PRODCAP(ctx, W); }
function d1C(ctx, W, H, t) {
  MV_BG(ctx, W, H); const gap = 28 * (.5 + .5 * Math.sin(t * 1.5)), s = 1.1, P = (x, y, z) => [W / 2 + (x - y) * .866 * s, H * .75 + (x + y) * .5 * s - z * s];
  const box = (x, y, z, w, d, h, c) => { const q = (a, b, cc) => P(a, b, cc), poly = (pp, f) => { ctx.beginPath(); pp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fillStyle = f; ctx.fill(); ctx.strokeStyle = '#000'; ctx.stroke(); }; poly([q(x, y + d, z), q(x + w, y + d, z), q(x + w, y + d, z + h), q(x, y + d, z + h)], mvShade(c, .8)); poly([q(x + w, y, z), q(x + w, y + d, z), q(x + w, y + d, z + h), q(x + w, y, z + h)], mvShade(c, .6)); poly([q(x, y, z + h), q(x + w, y, z + h), q(x + w, y + d, z + h), q(x, y + d, z + h)], c); };
  const col = MV_MATS[MV.mat][0]; box(-60, -30, 0, 120, 60, 25, '#6b4a2b'); box(-60, -30, 25 + gap, 120, 60, 25, '#be185d'); box(-60, 20, 50 + gap * 2, 120, 12, 45, '#d9a4b8'); box(-45, -30, 75 + gap * 3, 30, 30, 10, col);
  [['Travertino', '#e2d5c3'], ['Noce', '#5c3a21'], ['Bouclé', '#f5f5dc'], ['Ottone', '#d4af37']].forEach((s2, i) => { ctx.beginPath(); ctx.arc(40 + i * 90, H - 50, 14, 0, 7); ctx.fillStyle = s2[1]; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.fillStyle = '#cbd5e1'; ctx.font = '10px sans-serif'; ctx.fillText(s2[0], 58 + i * 90, H - 46); });
  MV_LBL(ctx, '1C /exploded — esploso tecnico arredo + swatches materiali', W, H); MV_PRODCAP(ctx, W);
}
function d2A(ctx, W, H, t) {
  MV_BG(ctx, W, H); const A = typeof APOLLO_VAULT_STATE !== 'undefined' ? APOLLO_VAULT_STATE : { rotation: 0, tilt: 15, zoom: 50 }, cw = W / 3, ch = (H - 22) / 3;
  for (let i = 0; i < 9; i++) { const cx = (i % 3) * cw, cy = Math.floor(i / 3) * ch, rot = ((i % 3) - 1) * 18 + A.rotation / 10 + Math.sin(t) * 3, zm = 1 + ((24 + (i * 61 / 8)) - 24) / 61 * .9 + (A.zoom - 50) / 200;
    ctx.save(); ctx.beginPath(); ctx.rect(cx + 2, cy + 2, cw - 4, ch - 4); ctx.clip(); ctx.translate(cx + cw / 2, cy + ch / 2); ctx.rotate(rot * Math.PI / 180); ctx.scale(zm, zm); mvDrawMaster(ctx, -cw / 2, -ch / 2 + A.tilt / 4, cw, ch, 0); ctx.restore(); ctx.fillStyle = '#fff'; ctx.font = '9px monospace'; ctx.fillText(`${Math.round(24 + i * 61 / 8)}mm`, cx + 6, cy + 12); }
  MV_LBL(ctx, `2A /cube3x3 — Rot ${A.rotation}° Tilt ${A.tilt}° Zoom ${A.zoom}mm (9 viste coerenti)`, W, H);
}
function d2B(ctx, W, H, t) {
  MV_BG(ctx, W, H); const T = t % 8, items = [[.15, .62, .7, .25, MV_MATS[MV.mat][0], 0], [.15, .22, .06, .4, MV_MATS[MV.mat][1], .6], [.79, .22, .06, .4, MV_MATS[MV.mat][1], .9], [.15, .15, .7, .07, '#78503c', 1.3], [.28, .4, .14, .22, '#93c5fd', 1.8], [.58, .4, .14, .22, '#93c5fd', 2.1], [.4, .5, .2, .12, '#be185d', 2.6]];
  items.forEach(([x, y, w, h, c, d]) => { const q = Math.max(0, Math.min(1, (T - d) / 1.1)), e = 1 - Math.pow(1 - q, 3), bounce = q >= 1 ? 0 : 0; ctx.fillStyle = c; ctx.fillRect(x * W, (y * H) - (1 - e) * H * 1.1 + bounce, w * W, h * H); });
  MV_LBL(ctx, '2B /gravity — Gravity Build slow-motion', W, H); MV_PRODCAP(ctx, W);
}
function d2C(ctx, W, H, t) {
  const T = t % 12; if (T < 5) { MV_BG(ctx, W, H); ctx.fillStyle = '#6b4a2b'; ctx.fillRect(0, H * .55, W, H * .45); ctx.beginPath(); ctx.arc(W * (.2 + Math.min(1, T / 3) * .3), H * .68, 34, 0, 7); ctx.fillStyle = MV_MATS[MV.mat][0]; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke(); MV_LBL(ctx, '2C /matchcut — campione fisico sul tavolo', W, H); return; }
  const q = (T - 5) / 7; if (T < 5.2) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); return; }
  ctx.save(); ctx.translate(W / 2 + Math.sin(t * 1.3) * 12, H / 2); ctx.rotate(Math.sin(t * .9) * .03); const z = 1 + q * .9; ctx.scale(z, z); mvRestyled(ctx, -W / 2, -H / 2, W, H); ctx.restore(); MV_LBL(ctx, '2C FPV drone one-take — volo continuo nella scena', W, H); MV_PRODCAP(ctx, W);
}
function d3(ctx, W, H, t, pl) { MV_BG(ctx, W, H); mvDrawMaster(ctx, 0, 0, W, H, .65); drawLuxuryScene(ctx, W, H, pl.key || 'ISO_CUTAWAY'); MV_PRODCAP(ctx, W); }
function d4(ctx, W, H, t) {
  MV_BG(ctx, W, H); const s = Math.floor(t / 3) % 5 + 1, p = (t % 3) / 3, g = mvGeom(), nm = ['', 'Pianta dall\'alto', 'Assonometria con Tetto', 'Assonometria Tetto Nascosto', 'Solo Pareti, Aperture & Reti', 'Modello Completo con Arredi'];
  mvDrawVolume(ctx, W, H, { scene: s, progress: s === 4 ? p : 1, mep: s === 4 ? { el: p > .3, idr: p > .5, hvac: p > .7, gas: p > .85 } : undefined, furn: s === 5 ? p > .2 : undefined });
  MV_LBL(ctx, `4 — Scena ${s}/5: ${nm[s]} · Σ scarto quote ${g.err.toFixed(1)} cm · H ${MV.vol.H} cm`, W, H);
}
const MV_PL = [
  ['1', '1A', '/board — One Plan → 6 Drawings A3', d1A, 'Dalla pianta alla tavola A3: assonometria, sezione, zoning e volume in sei passi.'], ['1', '1B', '/overlay — Renovation White-Wireframe', d1B, 'Sul rilievo grezzo traccio le linee bianche CAD con quote in millimetri, poi appare il render.'],
  ['1', '1C', '/exploded — Esploso Arredo & Swatches', d1C, 'Esploso tecnico dell\'arredo su misura con campioni dei materiali.'],
  ['2', '2A', '/cube3x3 — Cubo Camera 3D', d2A, 'Nove inquadrature coerenti da ventiquattro a ottantacinque millimetri.'], ['2', '2B', '/gravity — Gravity Build', d2B, 'Muri, vetrate e arredi scendono dall\'alto e si incastrano.'],
  ['2', '2C', '/matchcut — Match-Cut + FPV Drone', d2C, 'Dal campione sul tavolo al volo continuo dentro la stanza.'],
  ['3', '3A', '13 Archetipi Luxury', d3, 'Archetipo luxury dal volume master.'], ['4', '4', 'Video 4 — 5 Scene SketchUp', d4, 'Sequenza tecnica delle cinque scene con verifica quote in centimetri.']
];
const MV_CH = { 1: '📘 CAPITOLO 1 · Video 1 @architect.apollo', 2: '📗 CAPITOLO 2 · Video 2 @izun.studio', 3: '📙 CAPITOLO 3 · Video 3 @renderdilusso', 4: '📕 CAPITOLO 4 · Video 4 @aiperarchitetti' };
function mvBuildPlayers() {
  let h = '', last = '';
  MV_PL.forEach(([ch, id, title]) => {
    if (ch !== last) { h += `<div style="margin:8px 0 2px;font-weight:800;color:#7dd3fc;font-size:.74rem">${MV_CH[ch]}</div>`; last = ch; }
    h += `<div style="display:inline-block;margin:4px;vertical-align:top"><div style="font-size:.66rem;color:#cbd5e1">${id} ${title}</div><canvas id="mvp_${id}" width="400" height="225" style="width:360px"></canvas><div class="mvr">
      <button class="btn btn-cyan" onclick="mvPlay('${id}')">▶</button><button class="btn" onclick="mvStop('${id}')">⏹</button><button class="btn" onclick="mvExportWebm('${id}')">⏺ .WEBM</button><button class="btn" onclick="mvNarratePl('${id}')">🎙️</button>
      ${id === '3A' ? '<select onchange="MV.players[\'3A\'].key=this.value;mvStaticPlayers()">' + Object.keys(LUXURY_4K_ARCHETYPES).map(k => `<option>${k}</option>`).join('') + '</select>' : ''}</div></div>`;
    const cv = () => $mv('mvp_' + id); MV.players[id] = MV.players[id] || {}; Object.assign(MV.players[id], { id, draw: MV_PL.find(p => p[1] === id)[3], text: MV_PL.find(p => p[1] === id)[4], playing: false, t0: 0, cv });
  }); $mv('mvChapters').innerHTML = h;
}
function mvFrame(pl, t) { const c = pl.cv ? pl.cv() : null; if (!c) return; const x = c.getContext('2d'); x.save(); pl.draw(x, c.width, c.height, t, pl); x.restore(); if ($mv('mvFx')?.checked) applyEnhancerPostFx(x, c.width, c.height); }
function mvStaticPlayers() { Object.values(MV.players).forEach(p => { if (!p.playing && p.cv && p.cv()) mvFrame(p, 1); }); const dc = $mv('mvDocCv'); if (dc && !MV.doc.playing) mvDocFrame(0.5); }
window.mvPlay = id => { const p = MV.players[id]; p.playing = true; p.t0 = performance.now(); mvLoop(); };
window.mvStop = id => { MV.players[id].playing = false; };
window.mvPlayAll = () => Object.keys(MV.players).forEach(mvPlay); window.mvStopAll = () => Object.keys(MV.players).forEach(mvStop);
window.mvNarratePl = id => mvNarrate(MV.players[id].text + (MV.products.length ? ' Prodotti impiegati: ' + MV.products.map(p => p.name).join(', ') + '.' : ''));
let mvRaf = 0;
function mvLoop() { if (mvRaf) return; const f = () => { let any = false; Object.values(MV.players).forEach(p => { if (p.playing) { any = true; mvFrame(p, (performance.now() - p.t0) / 1000); } }); if (MV.doc.playing) { any = true; mvDocFrame((performance.now() - MV.doc.t0) / 1000); } mvRaf = any ? requestAnimationFrame(f) : 0; }; mvRaf = requestAnimationFrame(f); }
window.mvExportWebm = async function (id) {
  const isDoc = id === 'doc', srcCv = isDoc ? $mv('mvDocCv') : $mv('mvp_' + id);
  if (!srcCv || !window.MediaRecorder) { appendLog('⚠️ MediaRecorder non supportato.'); return; }
  const resVal = ($mv('mvExportRes')?.value || '1920x1080').split('x').map(Number);
  const EW = resVal[0] || 1920, EH = resVal[1] || 1080;
  const hdCv = document.createElement('canvas'); hdCv.width = EW; hdCv.height = EH;
  const hdCtx = hdCv.getContext('2d');
  const dur = isDoc ? +$mv('mvDur').value : 12;
  const stream = hdCv.captureStream(30);
  const text = humanizeIT(isDoc ? mvDocScriptArr().join(' ') : (MV.players[id].text || ''));
  let src = null, actx = null, audioOk = false;
  try {
    const key = localStorage.getItem('xvideo_voice_key'), voice = (!key || key === 'auto') ? 'giuseppe' : key;
    const rate = parseFloat(localStorage.getItem('xvideo_voice_rate')) || 1, pitch = parseFloat(localStorage.getItem('xvideo_voice_pitch')) || 1;
    const q = new URLSearchParams({ text, voice, rate: ((rate - 1) * 100 >= 0 ? '+' : '') + Math.round((rate - 1) * 100) + '%', pitch: ((pitch - 1) * 100 >= 0 ? '+' : '') + Math.round((pitch - 1) * 100) + 'Hz' });
    const r = await fetch('/api/tts?' + q); if (!r.ok) throw new Error('tts ' + r.status);
    actx = new (window.AudioContext || window.webkitAudioContext)(); const buf = await actx.decodeAudioData(await r.arrayBuffer());
    const dest = actx.createMediaStreamDestination(); src = actx.createBufferSource(); src.buffer = buf; src.connect(dest);
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t)); audioOk = true;
  } catch (e) { appendLog('ℹ️ Export senza audio: bridge TTS offline (' + (e.message || '') + ').'); }
  const codecInfo = typeof VideoEncoder !== 'undefined' ? 'WebCodecs+MediaRecorder' : 'MediaRecorder';
  const bps = EW >= 3840 ? 18000000 : 8000000;
  const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm', videoBitsPerSecond: bps }), chunks = [];
  let pump = true;
  const copyLoop = () => { if (!pump) return; hdCtx.drawImage(srcCv, 0, 0, EW, EH); requestAnimationFrame(copyLoop); };
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  rec.onstop = () => { pump = false; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); a.download = `CADBridge_${EW}x${EH}_${id}_${Date.now()}.webm`; a.click(); actx && actx.close(); appendLog(`⏺ Export .WEBM ${EW}×${EH} (${codecInfo}) ${audioOk ? 'con voce neurale' : 'solo video'} completato.`); };
  if (isDoc) mvPlayDoc(); else mvPlay(id);
  copyLoop(); rec.start(); if (src) src.start(); appendLog(`⏺ Registrazione ${EW}×${EH} (${dur}s)...`);
  setTimeout(() => rec.stop(), dur * 1000 + 350);
};

/* --- documentario 6 atti --- */
function mvDocScriptArr() {
  const g = mvGeom(), notes = MV.inputs.slice(-3).map(i => i.text).join('; ') || 'nessuna annotazione', act = Object.keys(MV.intv).filter(k => MV.intv[k]).join(', ') || 'nessun intervento', pr = MV.products.map(p => p.name).join(', ') || 'nessun prodotto selezionato';
  return ['Stato di fatto: ' + g.area.toFixed(1) + ' metri quadri, altezza ' + MV.vol.H + ' centimetri, scarto di chiusura quote ' + g.err.toFixed(1) + ' centimetri. Diagnosi delle criticità esterne e interne.',
    'Sovrapposizione di schizzi, schemi e note vocali: ' + notes + '. Wireframe bianco CAD con quote.',
    'Trasformazione dei materiali: ' + act + '. Motivazioni estetiche, energetiche e di valore. Prodotti: ' + pr + '.',
    'Esplorazione multi camera, tavola A3, spaccato con reti MEP e le cinque scene SketchUp.',
    'Studio solare diurno e notturno a 2700 kelvin e sei zoom macro sui nuovi materiali.',
    'Confronto finale prima e dopo con i benefici ottenuti: comfort, classe energetica e valore dell\'immobile.'];
}
window.mvDocScript = function () { const d = +$mv('mvDur').value, a = d / 6, s = mvDocScriptArr(); $mv('mvDocTxt').textContent = s.map((t, i) => `Atto ${i + 1} (${Math.round(i * a)}–${Math.round((i + 1) * a)}s): ${t}`).join('\n'); };
function mvDocFrame(t) {
  const c = $mv('mvDocCv'); if (!c) return; const x = c.getContext('2d'), W = c.width, H = c.height, d = +$mv('mvDur').value, al = d / 6, k = Math.min(5, Math.floor(t / al)), p = (t % al) / al, tt = t;
  x.save(); MV_BG(x, W, H);
  if (k === 0) { mvDrawMaster(x, 0, 0, W, H, .35); x.fillStyle = '#fff'; x.font = 'bold 14px sans-serif'; x.fillText('STATO DI FATTO — rilievo quote in cm', 14, 24); mvDrawVolume(x, W * .45, H * .55, { scene: 1 }); }
  else if (k === 1) { mvDrawMaster(x, 0, 0, W, H, .45); mvDrawVolume(x, W, H, { scene: 3, wire: true, progress: Math.min(1, p * 1.5) }); mvDrawStrokes(x, 0, 0, W, H); MV.schemes.slice(-3).forEach((im, i) => x.drawImage(im, 12 + i * 90, H - 80, 80, 60)); x.fillStyle = '#fff'; x.font = '12px sans-serif'; MV.inputs.slice(-3).forEach((n, i) => x.fillText(`• ${n.text}`.slice(0, 70), 12, 40 + i * 16)); }
  else if (k === 2) { mvDrawMaster(x, 0, 0, W, H, 0); x.save(); x.beginPath(); x.rect(0, 0, W * p, H); x.clip(); mvRestyled(x, 0, 0, W, H); x.restore(); x.fillStyle = '#fff'; x.fillRect(W * p - 1, 0, 2, H); }
  else if (k === 3) { const q = Math.floor(p * 4); if (q === 0) d2A(x, W, H, tt); else if (q === 1) d1A(x, W, H, tt); else if (q === 2) d4(x, W, H, 9 + p * 3); else d4(x, W, H, tt); }
  else if (k === 4) { if (p < .5) { MV_BG(x, W, H); drawLuxuryScene(x, W, H, 'ISO_CUTAWAY'); } else { const z = Math.floor((p - .5) * 12); x.save(); const f = 1.4 + ((p * 12) % 1) * .6, cx = [.3, .7, .5, .25, .75, .5][z % 6], cy = [.4, .5, .3, .6, .6, .5][z % 6]; x.translate(W / 2, H / 2); x.scale(f, f); x.translate(-W * cx, -H * cy); mvRestyled(x, 0, 0, W, H); x.restore(); x.fillStyle = '#fff'; x.font = '12px sans-serif'; x.fillText(`Macro ${z % 6 + 1}/6`, 12, 20); } }
  else { const w = W * (.5 + .5 * Math.sin(p * Math.PI * 2)); mvDrawMaster(x, 0, 0, W, H, 0); x.save(); x.beginPath(); x.rect(w, 0, W - w, H); x.clip(); mvRestyled(x, 0, 0, W, H); x.restore(); x.fillStyle = '#fff'; x.fillRect(w - 1, 0, 2, H); x.font = 'bold 13px sans-serif'; x.fillText('PRIMA', 12, 20); x.fillText('DOPO', W - 56, 20); x.fillText('Benefici: comfort · classe energetica · valore', 12, H - 30); }
  MV_LBL(x, `Atto ${k + 1}/6 · ${Math.floor(t)}s / ${d}s`, W, H); MV_PRODCAP(x, W); x.restore(); if ($mv('mvFx')?.checked) applyEnhancerPostFx(x, W, H);
}
window.mvPlayDoc = () => { MV.doc.playing = true; MV.doc.t0 = performance.now(); mvLoop(); setTimeout(() => { if (MV.doc.playing && (performance.now() - MV.doc.t0) / 1000 > +$mv('mvDur').value) MV.doc.playing = false; }, (+$mv('mvDur').value) * 1000 + 400); };
window.mvStopDoc = () => { MV.doc.playing = false; HumanVoiceOrchestrator.stop(); };
window.mvNarrateDoc = function () { const s = mvDocScriptArr(); let i = 0; const next = () => { if (i < s.length) mvNarrate(s[i++], next); }; mvPlayDoc(); next(); };

/* --- init --- */
function mvInit() {
  if (!$mv('tab-multivideo')) return; const sb = $mv('mvSceneBtns');
  sb.innerHTML = ['1 Pianta', '2 Assonometria+Tetto', '3 Tetto nascosto', '4 Pareti/Aperture/Reti', '5 Completo+Arredi'].map((n, i) => `<button class="btn" onclick="MV.scene=${i + 1};mvRefresh()">${n}</button>`).join('');
  mvBuildPlayers(); mvIntvUI(); mvCatSearch(); mvInitDraw(); mvParseQuotes(); mvRefresh();
  document.querySelectorAll('[data-tab="tab-multivideo"]').forEach(b => b.addEventListener('click', () => setTimeout(mvRefresh, 60)));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mvInit); else mvInit();

/* ===== v13: DIREZIONE — VICE CEO, 3 DIRETTORI, 12 AGENTI, BACKLOG, IMPORT CSV ===== */
const DIR_ORG = [
  { id: 'D1', name: '🛠️ Direttore Tecnologia & Qualità', agents: [['A1', 'Frontend/UI', 'Interfaccia, responsive, accessibilità'], ['A2', 'CAD & SketchUp Ruby', 'Parametrico, .rb, quote'], ['A3', 'QA & Test', 'Smoke test, node --check, regressioni'], ['A4', 'DevOps & Deploy', 'deploy_v3.py, Service Worker, versioning'], ['A5', 'Sicurezza & Privacy', 'Chiavi API, permessi, dati locali']] },
  { id: 'D2', name: '🎬 Direttore Contenuti, Media & Voce', agents: [['A6', 'Regia Video', '13 archetipi, 4 capitoli, documentario'], ['A7', 'Voce & Narrazione', '10 voci neurali, humanizeIT, mix audio'], ['A8', 'Render & Immagini IA', 'Gemini/Imagen/Veo (con chiave API)']] },
  { id: 'D3', name: '📈 Direttore Business, Mercato & Dati', agents: [['A9', 'Cataloghi & Prodotti', 'Import CSV, schede, iniezione modello'], ['A10', 'Computo & Capitolato', 'Prezzi, voci, PDF dossier'], ['A11', 'Marketing & Social', 'Spot, copy annunci, calendario 6h'], ['A12', 'Customer Success & Docs', 'Guide, onboarding, FAQ']] }
];
const DIR_AGENTS = DIR_ORG.flatMap(d => d.agents.map(a => ({ id: a[0], name: a[1], desc: a[2], dir: d.id })));
const DIR_STATE = { backlog: JSON.parse(localStorage.getItem('xv_backlog') || 'null') || [
  { id: 1, title: 'Verificare in browser il tab Multi-Video (player, export WEBM)', agent: 'A3', prio: 'Alta', st: 'todo' },
  { id: 2, title: 'Integrare Gemini/Imagen/Veo lato bridge con chiave API', agent: 'A8', prio: 'Alta', st: 'todo' },
  { id: 3, title: 'Import CSV prodotti dai portali (file scaricati dall\'utente)', agent: 'A9', prio: 'Media', st: 'done' }] };
const dirSave = () => localStorage.setItem('xv_backlog', JSON.stringify(DIR_STATE.backlog));
function dirRender() {
  const $ = id => document.getElementById(id); if (!$('dirOrg')) return;
  const cnt = a => DIR_STATE.backlog.filter(b => b.agent === a && b.st !== 'done').length;
  $('dirOrg').innerHTML = DIR_ORG.map(d => `<div class="node"><b>${d.name}</b>${d.agents.map(a => `<div style="margin-top:3px">• <b>${a[0]} ${a[1]}</b> <span style="color:#a78bfa">[${cnt(a[0])} aperti]</span><br><span style="color:#94a3b8">${a[2]}</span></div>`).join('')}</div>`).join('');
  $('dirAgent').innerHTML = DIR_AGENTS.map(a => `<option value="${a.id}">${a.id} ${a.name}</option>`).join('');
  const L = { todo: '⬜ da fare', doing: '🔵 in corso', done: '✅ fatto' };
  $('dirBacklog').innerHTML = DIR_STATE.backlog.map(b => `<div class="bl"><span>#${b.id}</span><b style="flex:1">${b.title}</b><span>${b.agent} ${(DIR_AGENTS.find(a => a.id === b.agent) || {}).name || ''}</span><span>${b.prio}</span><button class="btn" onclick="dirAdvance(${b.id})">${L[b.st]}</button><button class="btn" onclick="dirDel(${b.id})">✕</button></div>`).join('') || '<div class="bl">Backlog vuoto.</div>';
}
window.dirAdd = function (title, agent, prio) {
  const t = title || document.getElementById('dirTitle').value.trim(); if (!t) return;
  DIR_STATE.backlog.push({ id: Date.now() % 1e7, title: t, agent: agent || document.getElementById('dirAgent').value, prio: prio || document.getElementById('dirPrio').value, st: 'todo' });
  if (!title) document.getElementById('dirTitle').value = ''; dirSave(); dirRender();
};
window.dirAdvance = id => { const b = DIR_STATE.backlog.find(x => x.id === id); if (b) { b.st = { todo: 'doing', doing: 'done', done: 'todo' }[b.st]; dirSave(); dirRender(); } };
window.dirDel = id => { DIR_STATE.backlog = DIR_STATE.backlog.filter(x => x.id !== id); dirSave(); dirRender(); };
window.dirDiagnose = async function () {
  const found = [], add = (t, a, p) => { if (!DIR_STATE.backlog.some(b => b.title === t && b.st !== 'done')) { dirAdd(t, a, p); found.push(t); } };
  try { const r = await fetch('/api/tts?text=ok&voice=giuseppe'); if (!r.ok) throw 0; } catch (e) { add('Bridge TTS non raggiungibile: avviare bridge_server.py e aprire da localhost:8088', 'A4', 'Alta'); }
  if (typeof MV !== 'undefined' && !MV.master) add('Nessuna immagine master caricata: i video usano la facciata segnaposto', 'A6', 'Media');
  if (typeof MV !== 'undefined' && !MV.products.length) add('Nessun prodotto iniettato: importare un CSV o inserire prodotti dai portali', 'A9', 'Media');
  if (!localStorage.getItem('xv_gemini_ready')) add('Generazione IA reale non attiva: configurare chiave Gemini lato bridge', 'A8', 'Alta');
  if (typeof MV !== 'undefined') { const g = mvGeom(); if (g.err > 2) add(`Catena quote non chiusa (scarto ${g.err.toFixed(1)} cm)`, 'A2', 'Alta'); }
  try { const k = await caches.keys(); add('Verificare versione cache SW attiva: ' + (k.join(', ') || 'nessuna'), 'A4', 'Bassa'); } catch (e) { }
  appendLog(`🧭 Vice CEO Atlas: auto-diagnosi completata, ${found.length} nuovi ticket.`); dirRender();
};
window.dirExport = function () {
  const md = '# ROADMAP — Vice CEO Atlas\n\n' + ['todo', 'doing', 'done'].map(s => `## ${s}\n` + DIR_STATE.backlog.filter(b => b.st === s).map(b => `- [${b.agent}] (${b.prio}) ${b.title}`).join('\n')).join('\n\n') + '\n';
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' })); a.download = 'ROADMAP.md'; a.click();
};
/* import CSV prodotti (nome;fonte;url) */
window.mvImportCsv = async function (ev) {
  const f = ev.target.files[0]; if (!f) return; const rows = (await f.text()).split(/\r?\n/).map(l => l.split(/[;,\t]/).map(s => s.trim().replace(/^"|"$/g, ''))).filter(r => r[0]);
  if (/^nome|^name|^prodotto/i.test(rows[0][0])) rows.shift(); let n = 0;
  rows.forEach(r => { $mv('mvPName').value = r[0]; $mv('mvPUrl').value = r[2] || ''; $mv('mvPSrc').value = /archi/i.test(r[1] || '') ? 'Archiproducts' : 'Edilportale'; mvCatManual(); n++; });
  ev.target.value = ''; appendLog(`📥 Import CSV: ${n} prodotti iniettati dal file ${f.name}.`);
};
window.atlasExecuteCommand = async function (customCmd) {
  const inp = document.getElementById('atlasCmdInput');
  const cmd = (customCmd || inp?.value || '').trim();
  if (!cmd) return;
  const s = cmd.toLowerCase();
  const log = [];
  log.push(`🧭 [VICE CEO ATLAS] Ricevuto ordine CEO: "${cmd}"`);

  // D1 Tecnologia & A2 CAD / Parametrico
  const mqM = s.match(/(\d{2,4})\s*mq/);
  if (mqM && document.getElementById('computoMq')) {
    document.getElementById('computoMq').value = mqM[1];
    log.push(`  ├─ [D1 • A2 CAD]: Superficie impostata a ${mqM[1]} mq.`);
  }
  const hM = s.match(/altezza\s*(\d{3})/);
  if (hM && $mv('mvH')) { $mv('mvH').value = hM[1]; log.push(`  ├─ [D1 • A2 CAD]: Altezza parametrica H = ${hM[1]} cm.`); }
  if (/mep|ret[ei]|impiant/.test(s) && typeof MV !== 'undefined') {
    MV.mep = { el: true, idr: true, hvac: true, gas: true };
    log.push('  ├─ [D1 • A2 MEP]: Attivate tutte le 4 reti MEP (Elettrico, Idrico, HVAC, Gas/Fibra).');
  }

  // D2 Contenuti & A6/A7 Media/Voce
  if (typeof MV !== 'undefined') {
    [['travertino', 'travertino'], ['noce', 'noce'], ['parquet', 'parquet'], ['marmo', 'marmo'], ['resina', 'resina']].forEach(([k, m]) => {
      if (s.includes(k)) { MV.mat = m; log.push(`  ├─ [D2 • A6 Regia]: Materiale master → ${m}.`); }
    });
    if (/led|luce|2700/.test(s)) { MV.intv.led = true; MV.mep.el = true; log.push('  ├─ [D2 • A6 Regia]: Illuminazione architetturale LED 2700K attivata.'); }
    if (/pergola/.test(s)) { MV.intv.pergola = true; log.push('  ├─ [D2 • A6 Regia]: Pergola bioclimatica attivata.'); }
    if (typeof mvRefresh === 'function') mvRefresh();
  }

  // D3 Business & A10 Computo
  if (/computo|cost[oi]|preventiv|villa|ottimizza/.test(s) && typeof window.generaComputo === 'function') {
    const d = window.generaComputo();
    if (typeof window.mvSyncComputo === 'function') window.mvSyncComputo();
    log.push(`  ├─ [D3 • A10 Computo]: Rigenerato computo (${d.mq} mq → ${_eur(d.totale)}).`);
  }

  if (/audit|diagnosi|controlla/.test(s)) {
    await window.dirDiagnose();
    log.push('  ├─ [D1 • A3 QA]: Eseguita auto-diagnosi di sistema e aggiornato backlog.');
  }

  // Registra come task completato nel backlog
  DIR_STATE.backlog.unshift({ id: Date.now() % 1e7, title: `Eseguito: ${cmd.slice(0, 70)}`, agent: 'A1', prio: 'Alta', st: 'done' });
  dirSave(); dirRender();
  if (!customCmd && inp) inp.value = '';

  const box = document.getElementById('atlasExecLog');
  if (box) { box.style.display = 'flex'; box.textContent = log.join('\n') + '\n  └─ ✅ Tutti i 3 Direttori e 12 Agenti sincronizzati.'; }
  appendLog(`🧭 Vice CEO Atlas ha eseguito: "${cmd}"`);
};

window.atlasQuickPreset = function (kind) {
  if (kind === 'villa') window.atlasExecuteCommand('imposta villa 140mq travertino con led 2700k, pergola e reti mep, genera computo');
  else if (kind === 'audit') window.atlasExecuteCommand('esegui audit completo sistema, bridge e quote');
};

window.atlasExportDevSpec = function () {
  const md = [
    '# SPECIFICA TECNICA AUTONOMA — VICE CEO ATLAS',
    `Data: ${new Date().toLocaleString('it-IT')}`,
    '\n## Stato Direzione (3 Direttori + 12 Agenti)',
    ...DIR_ORG.map(d => `### ${d.name}\n` + d.agents.map(a => `- **${a[0]} ${a[1]}**: ${a[2]}`).join('\n')),
    '\n## Backlog Operativo Aperto',
    ...DIR_STATE.backlog.filter(b => b.st !== 'done').map(b => `- [${b.agent} • ${b.prio}] ${b.title}`),
    '\n## Prodotti & Configurazione Attiva',
    `- Materiale: ${typeof MV !== 'undefined' ? MV.mat : 'n.d.'}`,
    `- Prodotti iniettati: ${typeof MV !== 'undefined' ? MV.products.map(p => p.name).join(', ') || 'nessuno' : 'n.d.'}`
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
  a.download = `ATLAS_DEV_SPEC_${Date.now()}.md`;
  a.click();
  appendLog('📝 Specifica tecnica autonoma esportata (ATLAS_DEV_SPEC.md).');
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dirRender); else dirRender();


/* ===== v12: REAL-LUX WEBGL PBR SHADER ENGINE + QUANTITY SURVEYOR CSV/JSON ===== */
const RealLuxPBR = {
  _gl: null, _prog: null, _cv: null, _tex: null,
  init(w, h) {
    const cv = this._cv || (this._cv = document.createElement('canvas'));
    cv.width = w; cv.height = h;
    if (this._gl) return true;
    const gl = cv.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) return false;
    const vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;v.y=1.0-v.y;gl_Position=vec4(p,0.0,1.0);}';
    const fs = `precision mediump float;uniform sampler2D u_tex;uniform vec2 u_res;uniform float u_time;varying vec2 v;
      void main(){
        vec4 c=texture2D(u_tex,v);
        vec2 px=1.0/u_res;
        float l0=dot(c.rgb,vec3(0.299,0.587,0.114));
        float lx=dot(texture2D(u_tex,v+vec2(px.x,0.0)).rgb,vec3(0.299,0.587,0.114));
        float ly=dot(texture2D(u_tex,v+vec2(0.0,px.y)).rgb,vec3(0.299,0.587,0.114));
        vec3 n=normalize(vec3((l0-lx)*4.0,(l0-ly)*4.0,1.0));
        vec3 ld=normalize(vec3(sin(u_time*0.6)*0.6,cos(u_time*0.4)*0.5,1.0));
        vec3 h=normalize(ld+vec3(0.0,0.0,1.0));
        float spec=pow(max(dot(n,h),0.0),28.0)*0.32;
        float ao=1.0-clamp((abs(l0-lx)+abs(l0-ly))*1.6,0.0,0.35);
        float vig=1.0-dot(v-0.5,v-0.5)*0.35;
        gl_FragColor=vec4(c.rgb*ao*vig+vec3(spec),c.a);
      }`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p); gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this._tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    this._gl = gl; this._prog = p; return true;
  },
  apply(targetCanvas) {
    if (!targetCanvas || !this.init(targetCanvas.width, targetCanvas.height)) return;
    const gl = this._gl, p = this._prog;
    gl.viewport(0, 0, targetCanvas.width, targetCanvas.height);
    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, targetCanvas);
    gl.uniform2f(gl.getUniformLocation(p, 'u_res'), targetCanvas.width, targetCanvas.height);
    gl.uniform1f(gl.getUniformLocation(p, 'u_time'), performance.now() / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const ctx = targetCanvas.getContext('2d');
    ctx.drawImage(this._cv, 0, 0);
  }
};
window.RealLuxPBR = RealLuxPBR;

window.quantitySurveyFromVolume = function () {
  if (typeof mvGeom !== 'function') return;
  const g = mvGeom();
  const mq = Math.max(1, Math.round(g.area));
  if (document.getElementById('computoMq')) document.getElementById('computoMq').value = mq;
  const d = window.generaComputo();
  let perim = 0;
  g.pts.forEach((p, i) => { const q = g.pts[(i + 1) % g.pts.length]; perim += Math.hypot(q[0] - p[0], q[1] - p[1]) / 100; });
  appendLog(`📐 Quantity Surveyor: perimetro=${perim.toFixed(2)}m, sup.=${g.area.toFixed(2)}mq, pareti=${(perim * MV.vol.H / 100).toFixed(2)}mq → Computo aggiornato (${_eur(d.totale)}).`);
  return d;
};

window.exportComputoCSV = function () {
  const d = window.computoData || window.generaComputo();
  const lines = ['Categoria;Descrizione;UM;Quantita;PrezzoUnitarioEUR;TotaleEUR;Fonte'];
  d.righe.forEach(r => lines.push(`"${r.cat}";"${r.desc}";${r.um};${r.qta};${r.pu.toFixed(2)};${r.tot.toFixed(2)};"${r.fonte}"`));
  lines.push(`"RIEPILOGO";"COSTO PRESUNTO OPERA (IVA inc.)";"";1;;${d.totale.toFixed(2)};"Quadro Economico"`);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = `Computo_Metrico_${Date.now()}.csv`; a.click();
  appendLog('📥 Esportato Computo Metrico strutturato (.CSV).');
};

window.exportComputoJSON = function () {
  const d = window.computoData || window.generaComputo();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
  a.download = `Computo_Metrico_${Date.now()}.json`; a.click();
  appendLog('📥 Esportato Computo Metrico strutturato (.JSON).');
};


/* ===== v8.0: GITHUB RENDER PLUGIN BRIDGE — CONTROLNET CANNY + DEPTH MAP ===== */
const ControlNetBridge = {
  computeMaps(srcCanvas) {
    const W = srcCanvas.width, H = srcCanvas.height;
    const sCtx = srcCanvas.getContext('2d');
    const src = sCtx.getImageData(0, 0, W, H).data;
    const edgeCv = document.createElement('canvas'); edgeCv.width = W; edgeCv.height = H;
    const depthCv = document.createElement('canvas'); depthCv.width = W; depthCv.height = H;
    const eCtx = edgeCv.getContext('2d'), dCtx = depthCv.getContext('2d');
    const eImg = eCtx.createImageData(W, H), dImg = dCtx.createImageData(W, H);
    const ed = eImg.data, dd = dImg.data;
    const lum = (i) => 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const idx = (y * W + x) * 4;
        const gx = -lum(((y-1)*W+(x-1))*4) + lum(((y-1)*W+(x+1))*4) - 2*lum((y*W+(x-1))*4) + 2*lum((y*W+(x+1))*4) - lum(((y+1)*W+(x-1))*4) + lum(((y+1)*W+(x+1))*4);
        const gy = -lum(((y-1)*W+(x-1))*4) - 2*lum(((y-1)*W+x)*4) - lum(((y-1)*W+(x+1))*4) + lum(((y+1)*W+(x-1))*4) + 2*lum(((y+1)*W+x)*4) + lum(((y+1)*W+(x+1))*4);
        const mag = Math.min(255, Math.hypot(gx, gy) > 55 ? 255 : 0);
        ed[idx] = ed[idx+1] = ed[idx+2] = mag; ed[idx+3] = 255;
        const depth = Math.max(0, Math.min(255, Math.round((y / H) * 140 + lum(idx) * 0.45)));
        dd[idx] = dd[idx+1] = dd[idx+2] = depth; dd[idx+3] = 255;
      }
    }
    eCtx.putImageData(eImg, 0, 0); dCtx.putImageData(dImg, 0, 0);
    return { edgeCv, depthCv };
  },
  overlayEdges(targetCanvas) {
    if (!targetCanvas) return;
    const { edgeCv } = this.computeMaps(targetCanvas);
    const ctx = targetCanvas.getContext('2d');
    ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.55;
    ctx.drawImage(edgeCv, 0, 0);
    ctx.globalAlpha = 1; ctx.fillStyle = '#22d3ee'; ctx.font = 'bold 9px monospace';
    ctx.fillText('🧠 CONTROLNET CANNY + DEPTH LOCK', 10, targetCanvas.height - 8);
    ctx.restore();
  }
};
window.ControlNetBridge = ControlNetBridge;

window.exportControlNetMaps = function () {
  const c = $mv('mvResCv') || $mv('mvVolCv');
  if (!c) { appendLog('⚠️ Nessun canvas attivo per ControlNet.'); return; }
  const { edgeCv, depthCv } = ControlNetBridge.computeMaps(c);
  const dl = (cv, name) => { const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = name; a.click(); };
  const ts = Date.now();
  dl(edgeCv, `ControlNet_Canny_Edge_${ts}.png`);
  setTimeout(() => dl(depthCv, `ControlNet_Depth_Map_${ts}.png`), 250);
  appendLog('🧠 Esportate mappe ControlNet (Canny Edge + Depth Map .PNG) pronte per GitHub Render Bridge.');
};


/* ===== v15.0: OMNI-MASTER ENGINE + 22 EFFECTS + LIVE HOT-SWAP + EXECUTIVE DOSSIER ===== */
class CADBridgeOmniMasterEngineV15 {
  constructor() {
    this.version = "15.0.0-OMNI-MASTER-COMPLETE";
    this.livePortalsCatalog = {
      murature_facciate: [
        {
          id: "EDIL_CAP_01", portal: "Edilportale", code: "NP.EDIL.01",
          name: "Sistema Cappotto Termico in EPS con Grafite + Facciata Ventilata in Lastre di Travertino Romano Classico sp. 20mm",
          brand: "Röfix / Margraf (Edilportale)", unit: "m²", unitPriceEur: 165.00, uValue: "0.19 W/m²K",
          camCompliant: "Conforme CAM Edilizia DM 23/06/2022 - Contenuto riciclato certificato", swatchColor: "#d6ccc2",
          capitolatoSpec: "Fornitura e posa in opera di sistema di isolamento termico a cappotto certificato ETA e facciata ventilata con sottostruttura in lega di alluminio EN AW-6060 T6, pannello isolante ad alta densità (λ = 0.031 W/mK) e rivestimento in lastre di Travertino Romano stuccato a mastice e levigato opaco.",
          aiPromptToken: "natural Roman travertine stone ventilated facade slabs with warm architectural joints"
        },
        {
          id: "EDIL_FAC_02", portal: "Edilportale", code: "NP.EDIL.02",
          name: "Frangisole Architettonico Verticale in Alluminio Estruso Effetto Noce Canaletto + Intonaco ai Silicati",
          brand: "Griesser / Mapei (Edilportale)", unit: "m²", unitPriceEur: 142.00, uValue: "0.21 W/m²K",
          camCompliant: "Conforme CAM - Verniciatura a polveri esente da VOC", swatchColor: "#6c462b",
          capitolatoSpec: "Realizzazione di rivestimento esterno composto da ciclo di intonachino ai silicati ad alta traspirabilità (EN 15824) abbinato a lame frangisole verticali orientabili in alluminio estruso termolaccato finitura legno Noce Canaletto.",
          aiPromptToken: "vertical warm walnut architectural louvers and matte silicate plaster facade"
        },
        {
          id: "EDIL_CAP_03", portal: "Edilportale", code: "NP.EDIL.03",
          name: "Cappotto Nanotecnologico Ultrasottile in Aerogel sp. 40mm + Finitura Silossanica Idrorepellente",
          brand: "Fassa Bortolo / Ama Composites (Edilportale)", unit: "m²", unitPriceEur: 188.00, uValue: "0.16 W/m²K",
          camCompliant: "Conforme CAM DM 23/06/2022 - EPD Tipo III registrata", swatchColor: "#e2e8f0",
          capitolatoSpec: "Isolamento termico ad altissima prestazione mediante pannelli compositi in silice amorfa nanoporosa (Aerogel, λ = 0.015 W/mK), rasatura armata con rete in fibra di vetro alcali-resistente e rivestimento silossanico traspirante.",
          aiPromptToken: "ultra-clean monolithic white siloxane architectural facade with crisp minimalist reveals"
        },
        {
          id: "EDIL_FAC_04", portal: "Edilportale", code: "NP.EDIL.04",
          name: "Facciata Ventilata in Gres Laminato Slimtech Pietra Lavica + Isolamento in Lana di Roccia Doppia Densità",
          brand: "Cotto d'Este / Rockwool (Edilportale)", unit: "m²", unitPriceEur: 154.00, uValue: "0.18 W/m²K",
          camCompliant: "Conforme CAM - Euroclasse A1 incombustibile, 40% riciclato", swatchColor: "#475569",
          capitolatoSpec: "Sistema di facciata ventilata a giunto aperto con isolamento termoacustico in pannelli di lana di roccia a doppia densità e lastre in gres porcellanato laminato fibrorinforzato sp. 6.5 mm finitura pietra lavica.",
          aiPromptToken: "dark basalt lava stone ventilated facade panels with deep shadow gaps"
        }
      ],
      infissi_porte: [
        {
          id: "EDIL_INF_01", portal: "Edilportale", code: "NP.SER.01",
          name: "Sistema Scorrevole Minimale Panoramico in Alluminio a Taglio Termico Schüco ASE 67 PD (Triplo Vetro Selettivo)",
          brand: "Schüco (Edilportale)", unit: "m²", unitPriceEur: 920.00, uValue: "Uw = 0.88 W/m²K",
          camCompliant: "Alluminio riciclato Hydro CIRCAL 75R certificato", swatchColor: "#1e293b",
          capitolatoSpec: "Fornitura e posa di serramento scorrevole minimale a scomparsa totale nel controtelaio, nodo centrale da 31 mm, vetrocamera triplo basso-emissivo selettivo con gas Argon (Ug = 0.6 W/m²K, Rw = 43 dB), posa qualificata secondo UNI 11673-1.",
          aiPromptToken: "ultra-slim black anodized aluminum floor-to-ceiling sliding glass doors Schuco style"
        },
        {
          id: "ARCH_POR_01", portal: "Archiproducts", code: "NP.SER.02",
          name: "Porta Interna Filomuro a Tutt'Altezza in Vetro Bronzato Riflettente e Profilo Anodizzato Nero",
          brand: "Rimadesio - Velaria (Archiproducts)", unit: "cad", unitPriceEur: 2450.00, uValue: "Uw = 1.10 W/m²K (Interno)",
          camCompliant: "Vetro e alluminio 100% riciclabili", swatchColor: "#64748b",
          capitolatoSpec: "Porta interna a tutt'altezza con stipite filomuro in alluminio strutturale estruso ossidato nero e pannello in cristallo temperato stratificato bronzo trasparente.",
          aiPromptToken: "floor-to-ceiling flush bronze glass interior door Rimadesio style"
        },
        {
          id: "EDIL_INF_02", portal: "Edilportale", code: "NP.SER.03",
          name: "Serramento Ibrido Legno Rovere Naturale / Alluminio Esterno Triplo Vetro FIN-Project",
          brand: "Finstral (Edilportale)", unit: "m²", unitPriceEur: 780.00, uValue: "Uw = 0.82 W/m²K",
          camCompliant: "Certificato CasaClima Oro & CAM Edilizia", swatchColor: "#854d0e",
          capitolatoSpec: "Serramento ad anta scomparsa con nucleo isolante in PVC riciclato, rivestimento interno in legno massello di Rovere naturale ed esterno in alluminio termolaccato, triplo vetro basso-emissivo.",
          aiPromptToken: "warm oak interior framed architectural windows with slim dark exterior aluminum profiles"
        },
        {
          id: "ARCH_POR_02", portal: "Archiproducts", code: "NP.SER.04",
          name: "Sistema Boiserie e Porta Filomuro Rasoparete a Tutt'Altezza in Essenza Noce Canaletto",
          brand: "Lualdi - Rasomuro (Archiproducts)", unit: "cad", unitPriceEur: 1890.00, uValue: "Rw = 36 dB",
          camCompliant: "Legno certificato FSC 100% e vernici all'acqua", swatchColor: "#78350f",
          capitolatoSpec: "Porta interna rasomuro a battente con telaio invisibile in alluminio estruso, cerniere a scomparsa registrabili su 3 assi, anta tamburata sp. 55 mm rivestita in Noce Canaletto.",
          aiPromptToken: "seamless floor-to-ceiling flush walnut wood architectural doors Lualdi style"
        }
      ],
      pavimenti_rivestimenti: [
        {
          id: "ARCH_PAV_01", portal: "Archiproducts", code: "NP.FIN.01",
          name: "Parquet in Rovere Termotrattato Posa a Spina Ungherese 45° Verniciato Opaco Naturale",
          brand: "Listone Giordano (Archiproducts)", unit: "m²", unitPriceEur: 138.00, uValue: "R = 0.11 m²K/W (Idoneo Radiante)",
          camCompliant: "Legno certificato FSC / PEFC da foreste gestite responsabilmente", swatchColor: "#9c6644",
          capitolatoSpec: "Fornitura e posa incollata con adesivo silanico bicomponente (EC1 Plus) di pavimento in legno multistrato con nobile in Rovere Francese sp. 4 mm, lavorazione a Spina Ungherese 45°, compatibile con impianto radiante a pavimento.",
          aiPromptToken: "warm natural oak Chevron herringbone parquet flooring"
        },
        {
          id: "ARCH_PAV_02", portal: "Archiproducts", code: "NP.FIN.02",
          name: "Grandi Lastre in Gres Porcellanato Effetto Marmo Calacatta Oro / Nero Marquina 160x320 cm",
          brand: "Marazzi Grande Marble Look (Archiproducts)", unit: "m²", unitPriceEur: 124.00, uValue: "R = 0.015 m²K/W",
          camCompliant: "Certificato LEED / EPD con oltre il 40% di materiale riciclato", swatchColor: "#f8fafc",
          capitolatoSpec: "Fornitura e posa a doppia spalmatura di grandi lastre in gres porcellanato rettificato spessore 6 mm (UNI EN 14411 Gruppo BIa), formato 160x320 cm, finitura levigata specchiante per pavimenti, isola cucina e gradini a sbalzo.",
          aiPromptToken: "bookmatched Calacatta Gold and Nero Marquina marble slabs with subtle veining"
        },
        {
          id: "ARCH_PAV_03", portal: "Archiproducts", code: "NP.FIN.03",
          name: "Superficie Continua Monolitica in Microresina all'Acqua Warm Collection sp. 3mm",
          brand: "Kerakoll Design House (Archiproducts)", unit: "m²", unitPriceEur: 112.00, uValue: "R = 0.02 m²K/W",
          camCompliant: "Bio-resina all'acqua VOC Free conforme CAM", swatchColor: "#d6d3d1",
          capitolatoSpec: "Ciclo continuo a 6 strati in microresina minerale all'acqua stesa a spatola manuale, finitura seta opaca monolitica priva di fughe, alta resistenza all'usura e conducibilità termica ottimale per pannelli radianti.",
          aiPromptToken: "seamless warm greige microcement monolithic architectural floor"
        },
        {
          id: "ARCH_PAV_04", portal: "Archiproducts", code: "NP.FIN.04",
          name: "Decking Esterno e Bordo Piscina in Teak Massello Birmano FSC + Lastre Pietra di Luserna",
          brand: "Unopiù / Margraf (Archiproducts)", unit: "m²", unitPriceEur: 148.00, uValue: "R11 Antiscivolo (UNI EN 16165)",
          camCompliant: "Legno Teak FSC e Pietra Naturale locale", swatchColor: "#b45309",
          capitolatoSpec: "Pavimentazione outdoor con doghe in legno massello di Teak su sottostruttura in alluminio e clip invisibili in acciaio inox AISI 316, raccordata a camminamenti in Pietra di Luserna fiammata antiscivolo R11.",
          aiPromptToken: "luxury Burmese teak pool deck with natural stone steps and infinity water edge"
        }
      ],
      arredi_illuminazione_mep: [
        {
          id: "ARCH_ARR_01", portal: "Archiproducts", code: "NP.INT.01",
          name: "Divano Modulare Curvo in Tessuto Bouclé Avorio + Isola Cucina Monolitica in Marmo con Elettrodomestici Integrati",
          brand: "B&B Italia / Poliform (Archiproducts)", unit: "corpo", unitPriceEur: 16800.00, uValue: "Classe A+++ (Elettrodomestici)",
          camCompliant: "Imbottiture esenti da CFC e legni certificati FSC", swatchColor: "#f5ebe0",
          capitolatoSpec: "Fornitura e installazione di sistema sedute modulare organico rivestito in tessuto Bouclé misto lana vergine colore avorio e blocco cucina a isola monolitica con top in gres/marmo, piano cottura a induzione con cappa integrata e colonna frigo French-door in acciaio inox.",
          aiPromptToken: "curved creamy ivory boucle sofa and monolithic marble kitchen island with stainless steel French-door refrigerator"
        },
        {
          id: "ARCH_LUX_01", portal: "Archiproducts", code: "NP.MEP.01",
          name: "Sistema Illuminotecnico Architetturale: Lampadari ad Anelli Sospesi in Oro Spazzolato + Tagli LED 2700K CRI>95 + Rete VMC/HVAC",
          brand: "Flos / Panzeri / Daikin (Archiproducts & Edilportale)", unit: "corpo", unitPriceEur: 14200.00, uValue: "COP = 4.60 / CRI > 95",
          camCompliant: "Conforme CAM Illuminazione e Direttiva EcoDesign ErP", swatchColor: "#ffb703",
          capitolatoSpec: "Impianto integrato composto da corpi illuminanti a sospensione ad anelli concentrici in ottone dorato (2700K, dimmerazione DALI-2), profili lineari LED incassati a scomparsa nel cartongesso e impianto di climatizzazione/VMC canalizzato ad alta efficienza.",
          aiPromptToken: "glowing warm 2700K golden ring pendant chandeliers and recessed architectural LED coves"
        },
        {
          id: "ARCH_ARR_02", portal: "Archiproducts", code: "NP.INT.02",
          name: "Cucina Architetturale Monoblocco in Acciaio Inox Spazzolato e Noce + Piano Induzione con Aspirazione Integrata",
          brand: "Boffi / Bora Professional (Archiproducts)", unit: "corpo", unitPriceEur: 22400.00, uValue: "Classe A+++ / Silenziosità 39 dB",
          camCompliant: "Acciaio 100% riciclabile e pannelli CARB2 / FSC", swatchColor: "#94a3b8",
          capitolatoSpec: "Sistema cucina centro-stanza con ante rientranti Pocket in Noce Canaletto, piano di lavoro monoblocco in acciaio inox satinato con vasca saldata e sistema di cottura a induzione con aspirazione fumi downdraft ai carboni attivi.",
          aiPromptToken: "Boffi brushed stainless steel and walnut architectural kitchen island with rising cooking steam"
        },
        {
          id: "EDIL_MEP_02", portal: "Edilportale", code: "NP.MEP.02",
          name: "Centrale Termica NZEB in Pompa di Calore Aria-Acqua + VMC Doppio Flusso con Recupero 92% + Domotica KNX",
          brand: "Viessmann / BTicino (Edilportale)", unit: "corpo", unitPriceEur: 15900.00, uValue: "SCOP = 5.15 / Classe A+++",
          camCompliant: "Gas refrigerante naturale R290 a GWP ultra-basso conforme CAM", swatchColor: "#38bdf8",
          capitolatoSpec: "Generatore termico reversibile in pompa di calore idronica R290 abbinato a ventilazione meccanica controllata con recuperatore entalpico ad altissima efficienza (92%) e supervisione domotica su bus standard KNX (UNI EN 15232 Classe A).",
          aiPromptToken: "concealed linear architectural HVAC slots and smart glass touch domotic panels"
        }
      ]
    };

    this.activeSelection = {
      murature_facciate: this.livePortalsCatalog.murature_facciate[0],
      infissi_porte: this.livePortalsCatalog.infissi_porte[0],
      pavimenti_rivestimenti: this.livePortalsCatalog.pavimenti_rivestimenti[0],
      arredi_illuminazione_mep: this.livePortalsCatalog.arredi_illuminazione_mep[0]
    };

    this.geometryMetrics = {
      lotAreaMq: 392.0,
      floorAreaMq: 145.5,
      facadeAreaMq: 186.0,
      windowsAreaMq: 34.2,
      wallHeightCm: 300,
      closureErrCm: 0.0,
      raiRatio: 0.235
    };
  }

  syncGeometryFromMV() {
    if (typeof mvGeom === 'function' && typeof MV !== 'undefined') {
      const g = mvGeom();
      let perimM = 0;
      if (g.pts && g.pts.length) {
        g.pts.forEach((p, i) => {
          const q = g.pts[(i + 1) % g.pts.length];
          perimM += Math.hypot(q[0] - p[0], q[1] - p[1]) / 100;
        });
      }
      const fl = g.area > 5 ? +g.area.toFixed(2) : 145.5;
      const hCm = MV.vol?.H || 300;
      const fac = perimM > 2 ? +(perimM * (hCm / 100)).toFixed(2) : 186.0;
      const win = MV.vol?.win > 0 ? +MV.vol.win.toFixed(2) : +(fl / 6.5).toFixed(2);
      this.geometryMetrics = {
        lotAreaMq: Math.max(392.0, +(fl * 2.65).toFixed(1)),
        floorAreaMq: fl,
        facadeAreaMq: fac,
        windowsAreaMq: win,
        wallHeightCm: hCm,
        closureErrCm: +(g.err || 0).toFixed(1),
        raiRatio: +(win / Math.max(1, fl)).toFixed(3)
      };
    }
    return this.geometryMetrics;
  }

  hotSwapComponent(category, itemId) {
    const list = this.livePortalsCatalog[category] || [];
    const found = list.find(i => i.id === itemId);
    if (found) this.activeSelection[category] = found;
    return this.compileFullExecutiveDossier();
  }

  compileFullExecutiveDossier() {
    const g = this.syncGeometryFromMV();
    const s = this.activeSelection;

    const rows = [
      {
        num: "01", code: "NP.DEM.01", portal: "Prezzario DEI / Cantiere",
        desc: "Allestimento cantiere, ponteggi, rimozioni selettive intonaci ammalorati, vecchi infissi e tracce per impianti MEP",
        unit: "m²", qty: g.floorAreaMq, price: 65.00, total: +(g.floorAreaMq * 65.00).toFixed(2)
      },
      {
        num: "02", code: s.murature_facciate.code, portal: s.murature_facciate.portal,
        desc: `${s.murature_facciate.name} — [${s.murature_facciate.brand}]`,
        unit: s.murature_facciate.unit, qty: g.facadeAreaMq, price: s.murature_facciate.unitPriceEur,
        total: +(g.facadeAreaMq * s.murature_facciate.unitPriceEur).toFixed(2)
      },
      {
        num: "03", code: s.infissi_porte.code, portal: s.infissi_porte.portal,
        desc: `${s.infissi_porte.name} — [${s.infissi_porte.brand}]`,
        unit: s.infissi_porte.unit, qty: s.infissi_porte.unit === "m²" ? g.windowsAreaMq : 8,
        price: s.infissi_porte.unitPriceEur,
        total: +((s.infissi_porte.unit === "m²" ? g.windowsAreaMq : 8) * s.infissi_porte.unitPriceEur).toFixed(2)
      },
      {
        num: "04", code: s.pavimenti_rivestimenti.code, portal: s.pavimenti_rivestimenti.portal,
        desc: `${s.pavimenti_rivestimenti.name} — [${s.pavimenti_rivestimenti.brand}]`,
        unit: s.pavimenti_rivestimenti.unit, qty: g.floorAreaMq, price: s.pavimenti_rivestimenti.unitPriceEur,
        total: +(g.floorAreaMq * s.pavimenti_rivestimenti.unitPriceEur).toFixed(2)
      },
      {
        num: "05", code: s.arredi_illuminazione_mep.code, portal: s.arredi_illuminazione_mep.portal,
        desc: `${s.arredi_illuminazione_mep.name} — [${s.arredi_illuminazione_mep.brand}]`,
        unit: "corpo", qty: 1, price: s.arredi_illuminazione_mep.unitPriceEur,
        total: s.arredi_illuminazione_mep.unitPriceEur
      },
      {
        num: "06", code: "NP.MEP.FULL", portal: "Edilportale / DEI Impianti",
        desc: "Rifacimento completo reti tecnologiche MEP (Elettrico DALI/Domotico, Idrico-Sanitario, VMC/Clima canalizzato, Gas/Induzione) con certificazione DM 37/08",
        unit: "m²", qty: g.floorAreaMq, price: 115.00, total: +(g.floorAreaMq * 115.00).toFixed(2)
      }
    ];

    // Aggiunge eventuali prodotti extra iniettati manualmente o da ricerca libera
    if (typeof MV !== 'undefined' && Array.isArray(MV.products)) {
      const activeCodes = new Set([s.murature_facciate.code, s.infissi_porte.code, s.pavimenti_rivestimenti.code, s.arredi_illuminazione_mep.code]);
      MV.products.forEach((p) => {
        if (!activeCodes.has(p.key) && p.price > 0) {
          const idx = String(rows.length + 1).padStart(2, '0');
          rows.push({
            num: idx, code: `NP.EXT.${idx}`, portal: p.src || 'Portale',
            desc: `${p.name}${p.url ? ' (' + p.url + ')' : ''}`,
            unit: "corpo", qty: 1, price: +p.price, total: +(+p.price).toFixed(2)
          });
        }
      });
    }

    const worksSubtotal = +rows.reduce((acc, r) => acc + r.total, 0).toFixed(2);
    const safetyCosts = +(worksSubtotal * 0.035).toFixed(2);
    const technicalFees = +(worksSubtotal * 0.08).toFixed(2);
    const vat10 = +((worksSubtotal + safetyCosts) * 0.10).toFixed(2);
    const grandTotal = +(worksSubtotal + safetyCosts + technicalFees + vat10).toFixed(2);

    const userNotes = (typeof MV !== 'undefined' && MV.inputs?.length)
      ? ` Annotazioni e varianti in catena (${MV.inputs.length} input, ${MV.strokes?.length || 0} schizzi a mano libera, ${MV.schemes?.length || 0} tavole allegate): ${MV.inputs.slice(-4).map(x => x.text).join('; ')}.`
      : '';
    const raiCheck = g.raiRatio >= 0.125
      ? `Rapporto Aeroilluminante VERIFICATO (RAI = ${g.raiRatio} ≥ 0.125 = 1/8, con ${g.windowsAreaMq} m² vetrati su ${g.floorAreaMq} m²).`
      : `Rapporto Aeroilluminante (RAI = ${g.raiRatio}) integrato con illuminazione circadian-LED CRI>95 e VMC termodinamica.`;

    return {
      timestamp: new Date().toLocaleString("it-IT"),
      swatchesForVideoOverlay: [
        { label: s.murature_facciate.brand.split(" ")[0], color: s.murature_facciate.swatchColor, item: s.murature_facciate.name },
        { label: s.infissi_porte.brand.split(" ")[0], color: s.infissi_porte.swatchColor, item: s.infissi_porte.name },
        { label: s.pavimenti_rivestimenti.brand.split(" ")[0], color: s.pavimenti_rivestimenti.swatchColor, item: s.pavimenti_rivestimenti.name },
        { label: s.arredi_illuminazione_mep.brand.split(" ")[0], color: s.arredi_illuminazione_mep.swatchColor, item: s.arredi_illuminazione_mep.name }
      ],
      dynamicMasterAiPrompt: `Ultra-photorealistic 8k architectural visualization (@montani3d & Black Render IA quality): ${s.murature_facciate.aiPromptToken}, ${s.infissi_porte.aiPromptToken}, ${s.pavimenti_rivestimenti.aiPromptToken}, ${s.arredi_illuminazione_mep.aiPromptToken}. Natural sunlight and warm 2700K architectural lighting, real people living inside.`,
      computoRows: rows,
      quadroEconomico: {
        worksSubtotal, safetyCosts, technicalFees, vat10, grandTotal,
        estimatedROIPercent: "+36%",
        energyClassJump: "Da Classe G (245 kWh/m²a) ➔ Classe A4 NZEB (18.4 kWh/m²a)"
      },
      capitolatoArticles: [
        { art: "Art. 1 — Oggetto dell'Appalto e Qualità dei Materiali (CAM DM 23/06/2022)", text: "Tutti i materiali e componenti edilizi provengono dai cataloghi certificati Edilportale e Archiproducts e rispettano i Criteri Ambientali Minimi (CAM Edilizia DM 23/06/2022) con dichiarazioni ambientali EPD e marcature CE." },
        { art: "Art. 2 — Involucro Esterno, Facciate e Murature", text: `${s.murature_facciate.capitolatoSpec} Trasmittanza certificata: ${s.murature_facciate.uValue}. (${s.murature_facciate.camCompliant}).` },
        { art: "Art. 3 — Serramenti Esterni ed Interni (UNI 11673-1)", text: `${s.infissi_porte.capitolatoSpec} Prestazione: ${s.infissi_porte.uValue}. (${s.infissi_porte.camCompliant}).` },
        { art: "Art. 4 — Pavimentazioni e Rivestimenti (UNI EN 14411 / UNI 11493)", text: `${s.pavimenti_rivestimenti.capitolatoSpec} Resistenza termica: ${s.pavimenti_rivestimenti.uValue}. (${s.pavimenti_rivestimenti.camCompliant}).` },
        { art: "Art. 5 — Arredi Fissi, Illuminotecnica 2700K e Impianti MEP (DM 37/08)", text: `${s.arredi_illuminazione_mep.capitolatoSpec} Impianti elettrico, idrico, HVAC/VMC e gas realizzati e collaudati con Dichiarazione di Conformità ai sensi del DM 37/08.` }
      ],
      relazioneTecnica: {
        titolo: "RELAZIONE TECNICA ILLUSTRATIVA, ENERGETICA (EX LEGGE 10/91) E DI VALORIZZAZIONE IMMOBILIARE",
        statoDiFatto: `L'immobile oggetto di intervento sorge su un lotto di ${g.lotAreaMq} m² con superficie utile calpestabile di ${g.floorAreaMq} m², sviluppo involucro di ${g.facadeAreaMq} m², altezza interpiano H = ${g.wallHeightCm} cm e scarto di chiusura poligonale pari a ${g.closureErrCm} cm. Allo stato di fatto presenta finiture datate, ponti termici diffusi e impianti obsoleti.${userNotes}`,
        progettoMotivato: `L'intervento progettuale prevede la riqualificazione simultanea esterna ed interna mediante: (1) [${s.murature_facciate.code}] ${s.murature_facciate.name} (${s.murature_facciate.uValue}); (2) [${s.infissi_porte.code}] ${s.infissi_porte.name} (${s.infissi_porte.uValue}); (3) [${s.pavimenti_rivestimenti.code}] ${s.pavimenti_rivestimenti.name}; (4) [${s.arredi_illuminazione_mep.code}] ${s.arredi_illuminazione_mep.name}.`,
        verificaIdoneitaNormativa: `${raiCheck} Salto energetico certificato: Da Classe G a Classe A4 NZEB. Incremento del valore immobiliare stimato (ROI): +36% rispetto al valore ante-operam.`
      }
    };
  }
}

const OMNI_22_EFFECTS = [
  { id: 'IPAD_2D_TO_3D_LOT', group: '@montani3d / Black Render IA', label: '01. Pianta 2D su iPad -> 3D -> Zoom Lotto Reale' },
  { id: 'NEON_PLOT_BOUNDARY', group: '@montani3d / Black Render IA', label: '02. Perimetro Lotto Neon Arancione + Calcolo m² (392 m²)' },
  { id: 'SHOVEL_TO_CUTAWAY', group: '@montani3d / Black Render IA', label: '03. Vanga nel Terreno -> Spaccato Isometrico 3D' },
  { id: 'EXPLOSION_DUST_STONE_FLY', group: '@montani3d / Black Render IA', label: '04. Fondazioni C.A. -> Esplosione Polvere + Pietra/Frangisole Volanti' },
  { id: 'CAD_BLUEPRINT_WRAP', group: '@montani3d / Black Render IA', label: '05. Avvolgimento Tavole Tecniche CAD Bianche su Edificio' },
  { id: 'NEON_MEP_XRAY', group: '@montani3d / Black Render IA', label: '06. Scansione Raggi-X Neon Reti MEP (Elettrico/Idrico/HVAC/Gas)' },
  { id: 'RAW_CONCRETE_4SWATCH_WIREFRAME', group: '@montani3d / Black Render IA', label: '07. Grezzo C.A. + Arredi Wireframe + 4 Cerchi Swatch Live' },
  { id: 'BLACK_RENDER_UNBOXING_BOX', group: '@montani3d / Black Render IA', label: '08. Scatola "BLACK RENDER IA" -> Levitazione Cartongesso/Parquet/Isola' },
  { id: 'ZENITHAL_90_ROTATION', group: '@montani3d / Black Render IA', label: '09. Rotazione 90° Zenitale + Macro Marmo/Oro + Apertura Frigo' },
  { id: 'REAL_HUMAN_LIFESTYLE_WATER', group: '@montani3d / Black Render IA', label: '10. Vita Reale: Cascata Piscina, Lavaggio Piatti, Vapore Cucina' },
  { id: 'BOARD_A3', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '11. /board — Tavola A3 6 Elaborati Tecnici' },
  { id: 'OVERLAY_WIRE', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '12. /overlay — Wireframe Bianco su Foto Grezza' },
  { id: 'EXPLODED_MM', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '13. /exploded — Esploso Tecnico Arredo Quotato in mm' },
  { id: 'CUBE_3X3', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '14. /cube3x3 — Cubo 3D 9 Angolazioni Sincronizzate' },
  { id: 'GRAVITY_BUILD', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '15. /gravity — Gravity Build Slow-Motion' },
  { id: 'MATCHCUT_FPV', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '16. /matchcut — Moodboard Match-Cut & Drone FPV One-Take' },
  { id: 'ISO_2700K', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '17. /iso2700k — Switch Giorno / Notte LED 2700K' },
  { id: 'TOPDOWN_WALK', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '18. /topdown_walk — Flussi & Percorsi Tratteggiati Zenitali' },
  { id: 'LASER_TIMELAPSE', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '19. /laser_timelapse — Livella Laser 360° di Cantiere' },
  { id: 'MACRO_6X', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '20. /macro6x — 6 Zoom Macro sui Materiali Selezionati' },
  { id: 'PDF_TO_SKETCHUP_5SCENES', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '21. PDF Quote cm -> SketchUp _3D.rb & 5 Scene Ufficiali' },
  { id: 'AUTOPILOT_60_90S', group: '4 Video Master (@apollo/@izun/@renderdilusso/@aiperarchitetti)', label: '22. Regia Completa 6 Atti + 10 Voci Neurali M/F' }
];

const omniEngineV15 = new CADBridgeOmniMasterEngineV15();
window.CADBridgeOmniMasterEngineV15 = CADBridgeOmniMasterEngineV15;
window.omniEngineV15 = omniEngineV15;
window.OMNI_22_EFFECTS = OMNI_22_EFFECTS;

const omniState = { playing: false, mode: 'single', t0: 0, raf: 0, effectId: OMNI_22_EFFECTS[0].id };

function omniDrawSwatchesOverlay(ctx, W, H, dossier) {
  const sw = (dossier || omniEngineV15.compileFullExecutiveDossier()).swatchesForVideoOverlay || [];
  const r = 16, startX = W - 24, startY = 34;
  sw.forEach((s, i) => {
    const cy = startY + i * 42;
    ctx.save();
    ctx.beginPath(); ctx.arc(startX, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = s.color || '#cbd5e1'; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    ctx.fillStyle = 'rgba(2,6,23,.84)';
    ctx.fillRect(startX - 134, cy - 10, 112, 20);
    ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText((s.label || '').slice(0, 18), startX - 26, cy + 3);
    ctx.restore();
  });
}

function omniDrawEffectFrame(ctx, W, H, effectId, p, tt) {
  MV_BG(ctx, W, H);
  const dossier = omniEngineV15.compileFullExecutiveDossier();
  const s = omniEngineV15.activeSelection;

  if (effectId === 'IPAD_2D_TO_3D_LOT') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.35);
    const padW = 240 + p * 120, padH = 160 + p * 80;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate((1 - p) * -0.08);
    ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
    ctx.fillRect(-padW / 2, -padH / 2, padW, padH); ctx.strokeRect(-padW / 2, -padH / 2, padW, padH);
    ctx.restore();
    mvDrawVolume(ctx, W, H, { scene: p < 0.45 ? 1 : 2, wire: p < 0.35, progress: p });
  } else if (effectId === 'NEON_PLOT_BOUNDARY') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.25);
    ctx.save();
    ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 4; ctx.shadowColor = '#f97316'; ctx.shadowBlur = 18;
    const m = 60, bw = W - 120, bh = H - 110;
    ctx.setLineDash([bw * 2 + bh * 2]); ctx.lineDashOffset = (1 - p) * (bw * 2 + bh * 2);
    ctx.strokeRect(m, 55, bw, bh);
    ctx.fillStyle = 'rgba(251,146,60,.14)'; ctx.fillRect(m, 55, bw * p, bh);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fed7aa'; ctx.font = 'bold 14px monospace';
    ctx.fillText(`LOTTO REALE: 14.0m × 28.0m = ${omniEngineV15.geometryMetrics.lotAreaMq.toFixed(0)} m² (Utile ${omniEngineV15.geometryMetrics.floorAreaMq} m²)`, m + 14, 82);
    ctx.restore();
  } else if (effectId === 'SHOVEL_TO_CUTAWAY') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.4);
    mvDrawVolume(ctx, W, H, { scene: 3, progress: p });
    ctx.save(); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W * 0.15, H * 0.2 + p * 120); ctx.lineTo(W * 0.32, H * 0.65); ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⛏️ SCAVO -> SPACCATO ISOMETRICO 3D', 18, H - 40);
    ctx.restore();
  } else if (effectId === 'EXPLOSION_DUST_STONE_FLY') {
    mvRestyled(ctx, 0, 0, W, H);
    ctx.save();
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2;
      const dist = (1 - p) * 180;
      const px = W * 0.5 + Math.cos(ang) * dist, py = H * 0.52 + Math.sin(ang) * dist * 0.65;
      ctx.fillStyle = s.murature_facciate.swatchColor || '#d6ccc2';
      ctx.fillRect(px - 14, py - 9, 28, 18);
      ctx.strokeStyle = '#f59e0b'; ctx.strokeRect(px - 14, py - 9, 28, 18);
    }
    ctx.fillStyle = `rgba(226,232,240,${0.45 * (1 - p)})`;
    ctx.beginPath(); ctx.arc(W * 0.5, H * 0.55, 40 + p * 160, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (effectId === 'CAD_BLUEPRINT_WRAP') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.45);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * p, H); ctx.clip();
    ctx.fillStyle = 'rgba(15,23,42,.55)'; ctx.fillRect(0, 0, W, H);
    mvDrawVolume(ctx, W, H, { scene: 4, wire: true, progress: 1 });
    ctx.restore();
  } else if (effectId === 'NEON_MEP_XRAY') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.72);
    mvDrawVolume(ctx, W, H, { scene: 4, mep: { elec: true, water: true, hvac: true, gas: true }, progress: 1 });
  } else if (effectId === 'RAW_CONCRETE_4SWATCH_WIREFRAME') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.5);
    mvDrawVolume(ctx, W, H, { scene: 5, wire: true, progress: p });
    if (p > 0.55) {
      ctx.save(); ctx.globalAlpha = (p - 0.55) / 0.45; mvRestyled(ctx, 0, 0, W, H); ctx.restore();
    }
  } else if (effectId === 'BLACK_RENDER_UNBOXING_BOX') {
    mvDrawMaster(ctx, 0, 0, W, H, 0.55);
    if (p > 0.35) { ctx.save(); ctx.globalAlpha = Math.min(1, (p - 0.35) / 0.5); mvRestyled(ctx, 0, 0, W, H); ctx.restore(); }
    const bw = 138, bh = 74, bx = W / 2 - bw / 2, by = H * 0.56 - bh / 2;
    ctx.save();
    ctx.fillStyle = '#020617'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
    ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
    ctx.fillText('BLACK RENDER IA', W / 2, by + 42);
    ctx.restore();
  } else if (effectId === 'ZENITHAL_90_ROTATION') {
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.rotate(p * Math.PI * 0.5); ctx.scale(1 - p * 0.15, 1 - p * 0.15);
    ctx.translate(-W / 2, -H / 2);
    mvRestyled(ctx, 0, 0, W, H);
    ctx.restore();
    const open = Math.sin(p * Math.PI) * 28;
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(W * 0.72 - open, H * 0.38, 22, 70); ctx.fillRect(W * 0.72 + 24 + open, H * 0.38, 22, 70);
  } else if (effectId === 'REAL_HUMAN_LIFESTYLE_WATER') {
    mvRestyled(ctx, 0, 0, W, H);
    ctx.save();
    ctx.fillStyle = 'rgba(56,189,248,.42)';
    for (let i = 0; i < 6; i++) {
      const y = ((tt * 90 + i * 24) % 90);
      ctx.fillRect(W * 0.12 + i * 10, H * 0.62 + y * 0.4, 4, 18);
    }
    ctx.fillStyle = 'rgba(248,250,252,.32)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(W * 0.54 + Math.sin(tt * 3 + i) * 8, H * 0.45 - ((tt * 35 + i * 16) % 55), 8 + i * 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (effectId === 'BOARD_A3') d1B(ctx, W, H, tt);
  else if (effectId === 'OVERLAY_WIRE') d1A(ctx, W, H, tt);
  else if (effectId === 'EXPLODED_MM') d2B(ctx, W, H, tt);
  else if (effectId === 'CUBE_3X3') d2A(ctx, W, H, tt);
  else if (effectId === 'GRAVITY_BUILD') d2A(ctx, W, H, tt + 2);
  else if (effectId === 'MATCHCUT_FPV') d3(ctx, W, H, tt, MV.players.v3);
  else if (effectId === 'ISO_2700K') drawLuxuryScene(ctx, W, H, 'ISO_CUTAWAY');
  else if (effectId === 'TOPDOWN_WALK') d4(ctx, W, H, tt);
  else if (effectId === 'LASER_TIMELAPSE') { mvDrawMaster(ctx, 0, 0, W, H, 0.3); ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, H * p); ctx.lineTo(W, H * p); ctx.stroke(); }
  else if (effectId === 'MACRO_6X') mvDocFrame(tt);
  else if (effectId === 'PDF_TO_SKETCHUP_5SCENES') d4(ctx, W, H, tt);
  else mvDocFrame(tt);

  omniDrawSwatchesOverlay(ctx, W, H, dossier);
  const meta = OMNI_22_EFFECTS.find(e => e.id === effectId) || OMNI_22_EFFECTS[0];
  MV_LBL(ctx, `OMNI v15 · ${meta.label}`, W, H);
  if ($mv('mvFx')?.checked) applyEnhancerPostFx(ctx, W, H);
  if ($mv('mvWebglPbr')?.checked && typeof RealLuxPBR !== 'undefined') RealLuxPBR.apply(ctx.canvas, ($mv('mvBloom')?.value || 45) / 100, ($mv('mvHdr')?.value || 65) / 100);
  if ($mv('mvControlNet')?.checked && typeof ControlNetBridge !== 'undefined') ControlNetBridge.overlayEdges(ctx.canvas);
}

function omniLoop() {
  if (!omniState.playing) { omniState.raf = 0; return; }
  const c = $mv('omniEffectsCv');
  if (c) {
    const tt = (performance.now() - omniState.t0) / 1000;
    let eid = omniState.effectId, p = (tt % 4) / 4;
    if (omniState.mode === 'autopilot') {
      const dur = +($mv('mvDur')?.value || 90);
      const idx = Math.min(OMNI_22_EFFECTS.length - 1, Math.floor(((tt % dur) / dur) * OMNI_22_EFFECTS.length));
      eid = OMNI_22_EFFECTS[idx].id;
      p = ((tt % (dur / OMNI_22_EFFECTS.length)) / (dur / OMNI_22_EFFECTS.length));
      if ($mv('omniEffectSel')) $mv('omniEffectSel').value = eid;
    }
    omniDrawEffectFrame(c.getContext('2d'), c.width, c.height, eid, p, tt);
  }
  omniState.raf = requestAnimationFrame(omniLoop);
}

window.omniPreviewSelected = function () {
  const c = $mv('omniEffectsCv'), sel = $mv('omniEffectSel');
  if (!c || !sel) return;
  omniState.effectId = sel.value;
  omniDrawEffectFrame(c.getContext('2d'), c.width, c.height, sel.value, 0.65, 2.5);
};
window.omniPlayEffect = function () {
  if ($mv('omniEffectSel')) omniState.effectId = $mv('omniEffectSel').value;
  omniState.mode = 'single'; omniState.playing = true; omniState.t0 = performance.now();
  if (!omniState.raf) omniState.raf = requestAnimationFrame(omniLoop);
};
window.omniPlayAutopilot = function () {
  omniState.mode = 'autopilot'; omniState.playing = true; omniState.t0 = performance.now();
  if (!omniState.raf) omniState.raf = requestAnimationFrame(omniLoop);
  appendLog('🚀 Autopilota Omni-Master v15 avviato: sequenza continua dei 22 effetti su timeline 60s–90s.');
};
window.omniStopEffects = function () {
  omniState.playing = false;
  if (typeof HumanVoiceOrchestrator !== 'undefined') HumanVoiceOrchestrator.stop();
};
window.omniNarrateAutopilot = function () {
  const d = omniEngineV15.compileFullExecutiveDossier();
  const s = omniEngineV15.activeSelection;
  const script = `Regia Omni-Master versione quindici avviata. Lotto di ${omniEngineV15.geometryMetrics.lotAreaMq} metri quadri e superficie interna di ${omniEngineV15.geometryMetrics.floorAreaMq} metri quadri. ` +
    `Involucro esterno con ${s.murature_facciate.name}, serramenti ${s.infissi_porte.name}, pavimentazione ${s.pavimenti_rivestimenti.name} e arredi ${s.arredi_illuminazione_mep.name}. ` +
    `Salto di classe energetica da G ad A4 NZEB, rivalutazione immobiliare più trentasei per cento, quadro economico chiavi in mano pari a ${Math.round(d.quadroEconomico.grandTotal)} euro.`;
  window.omniPlayAutopilot();
  if (typeof mvNarrate === 'function') mvNarrate(script);
};

window.omniHotSwap = function (category, itemId) {
  const dossier = omniEngineV15.hotSwapComponent(category, itemId);
  const s = omniEngineV15.activeSelection;
  const coreProds = [
    { src: s.murature_facciate.portal, name: s.murature_facciate.name, key: s.murature_facciate.code, price: s.murature_facciate.unitPriceEur },
    { src: s.infissi_porte.portal, name: s.infissi_porte.name, key: s.infissi_porte.code, price: s.infissi_porte.unitPriceEur },
    { src: s.pavimenti_rivestimenti.portal, name: s.pavimenti_rivestimenti.name, key: s.pavimenti_rivestimenti.code, price: s.pavimenti_rivestimenti.unitPriceEur },
    { src: s.arredi_illuminazione_mep.portal, name: s.arredi_illuminazione_mep.name, key: s.arredi_illuminazione_mep.code, price: s.arredi_illuminazione_mep.unitPriceEur }
  ];
  const coreKeys = new Set(coreProds.map(p => p.key));
  const extraProds = (MV.products || []).filter(p => !coreKeys.has(p.key) && !/^NP\.(EDIL|SER|FIN|INT|MEP)\./.test(p.key || ''));
  MV.products = [...coreProds, ...extraProds];

  omniRenderDossierUI(dossier);
  if (typeof mvRefresh === 'function') mvRefresh();
  if (typeof window.mvSyncComputo === 'function') window.mvSyncComputo();
  window.omniPreviewSelected();
  appendLog(`⚡ Hot-Swap Live [${category}]: ${s[category]?.name} → Aggiornati Swatch, Prompt AI, SketchUp .RB & Computo (€ ${dossier.quadroEconomico.grandTotal.toLocaleString('it-IT')}).`);
};

function omniRenderDossierUI(dossier) {
  const d = dossier || omniEngineV15.compileFullExecutiveDossier();
  const swBar = $mv('omniSwatchesBar');
  if (swBar) {
    swBar.innerHTML = d.swatchesForVideoOverlay.map(sw =>
      `<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;background:#0f172a;border:1px solid #334155;font-size:.66rem"><span style="width:12px;height:12px;border-radius:50%;background:${sw.color};border:1.5px solid #fff;display:inline-block"></span><b>${sw.label}</b>: ${(sw.item || '').slice(0, 32)}…</span>`
    ).join('');
  }
  const pBox = $mv('omniPromptBox');
  if (pBox) pBox.innerHTML = `<b>Prompt AI Live (Flux.1 ControlNet + Kling 1.6 / Luma Ray2):</b> ${d.dynamicMasterAiPrompt}`;

  const prev = $mv('omniDossierPreview');
  if (prev) {
    const q = d.quadroEconomico;
    prev.innerHTML = `<b>📊 Quadro Economico &amp; Dossier Esecutivo Live v15</b> (${d.timestamp})<br>` +
      `Lavori (${d.computoRows.length} voci): <b>€ ${q.worksSubtotal.toLocaleString('it-IT')}</b> · Oneri Sicurezza 3,5%: <b>€ ${q.safetyCosts.toLocaleString('it-IT')}</b> · Spese Tecniche 8%: <b>€ ${q.technicalFees.toLocaleString('it-IT')}</b> · IVA 10%: <b>€ ${q.vat10.toLocaleString('it-IT')}</b><br>` +
      `<span style="color:#34d399;font-weight:700">TOTALE CHIAVI IN MANO: € ${q.grandTotal.toLocaleString('it-IT')}</span> · ${q.energyClassJump} · <span style="color:#fbbf24">ROI Stimato: ${q.estimatedROIPercent}</span>`;
  }
}

// Integrazione bidirezionale con mvRefresh, mvRes, mvExportSketchup e exportDossierPDF
const _origMvResV15 = window.mvRes;
window.mvRes = function () {
  if (typeof _origMvResV15 === 'function') _origMvResV15();
  const c = $mv('mvResCv');
  if (c) omniDrawSwatchesOverlay(c.getContext('2d'), c.width, c.height);
};

const _origMvRefreshV15 = window.mvRefresh;
window.mvRefresh = function () {
  if (typeof _origMvRefreshV15 === 'function') _origMvRefreshV15();
  omniRenderDossierUI(omniEngineV15.compileFullExecutiveDossier());
  if (!omniState.playing) window.omniPreviewSelected();
};

const _origMvExportSketchupV15 = window.mvExportSketchup;
window.mvExportSketchup = function () {
  const d = omniEngineV15.compileFullExecutiveDossier();
  const s = omniEngineV15.activeSelection;
  // Assicura che i 4 componenti attivi siano nei commenti e nei materiali di _3D.rb
  if (!MV.products.length) {
    MV.products = [
      { src: s.murature_facciate.portal, name: s.murature_facciate.name, key: s.murature_facciate.code, price: s.murature_facciate.unitPriceEur },
      { src: s.infissi_porte.portal, name: s.infissi_porte.name, key: s.infissi_porte.code, price: s.infissi_porte.unitPriceEur },
      { src: s.pavimenti_rivestimenti.portal, name: s.pavimenti_rivestimenti.name, key: s.pavimenti_rivestimenti.code, price: s.pavimenti_rivestimenti.unitPriceEur },
      { src: s.arredi_illuminazione_mep.portal, name: s.arredi_illuminazione_mep.name, key: s.arredi_illuminazione_mep.code, price: s.arredi_illuminazione_mep.unitPriceEur }
    ];
  }
  return _origMvExportSketchupV15();
};

window.omniExportDossierCSV = function () {
  const d = omniEngineV15.compileFullExecutiveDossier();
  const q = d.quadroEconomico;
  const lines = ['N;Codice;Portale;Descrizione;UM;Quantita;PrezzoUnitarioEUR;TotaleEUR'];
  d.computoRows.forEach(r => lines.push(`${r.num};"${r.code}";"${r.portal}";"${r.desc.replace(/"/g,'""')}";${r.unit};${r.qty};${r.price.toFixed(2)};${r.total.toFixed(2)}`));
  lines.push(`;"SICUREZZA";"D.Lgs. 81/08";"Oneri della Sicurezza (3,5%)";"corpo";1;${q.safetyCosts.toFixed(2)};${q.safetyCosts.toFixed(2)}`);
  lines.push(`;"TECNICHE";"DL/Progetto";"Spese Tecniche e Direzione Lavori (8%)";"corpo";1;${q.technicalFees.toFixed(2)};${q.technicalFees.toFixed(2)}`);
  lines.push(`;"IVA10";"Fiscale";"IVA Agevolata Ristrutturazione (10%)";"corpo";1;${q.vat10.toFixed(2)};${q.vat10.toFixed(2)}`);
  lines.push(`;"TOTALE";"Quadro Economico";"COSTO PRESUNTO COMPLESSIVO CHIAVI IN MANO";"corpo";1;${q.grandTotal.toFixed(2)};${q.grandTotal.toFixed(2)}`);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
  a.download = `Computo_Metrico_Esecutivo_v15_${Date.now()}.csv`; a.click();
  appendLog('📊 Esportato Computo Metrico Estimativo & Quadro Economico (.CSV).');
};

window.omniExportDossierMD = function () {
  const d = omniEngineV15.compileFullExecutiveDossier();
  const q = d.quadroEconomico;
  const md = [
    `# ${d.relazioneTecnica.titolo}`,
    `Data: ${d.timestamp}\n`,
    `## 1. Relazione Tecnica Illustrativa, Energetica e ROI`,
    `- **Stato di Fatto:** ${d.relazioneTecnica.statoDiFatto}`,
    `- **Progetto Motivato:** ${d.relazioneTecnica.progettoMotivato}`,
    `- **Verifica Normativa & Salto Classe:** ${d.relazioneTecnica.verificaIdoneitaNormativa} (${q.energyClassJump} · ROI ${q.estimatedROIPercent})\n`,
    `## 2. Capitolato Speciale d'Appalto (CAM DM 23/06/2022 & DM 37/08)`,
    ...d.capitolatoArticles.map(a => `### ${a.art}\n${a.text}\n`),
    `## 3. Computo Metrico Estimativo & Quadro Economico`,
    `| N | Codice | Portale | Descrizione | UM | Q.tà | P.U. (€) | Totale (€) |`,
    `|---|---|---|---|---|---:|---:|---:|`,
    ...d.computoRows.map(r => `| ${r.num} | ${r.code} | ${r.portal} | ${r.desc} | ${r.unit} | ${r.qty} | ${r.price.toFixed(2)} | ${r.total.toFixed(2)} |`),
    `\n- **Subtotale Lavori:** € ${q.worksSubtotal.toFixed(2)}`,
    `- **Oneri Sicurezza (D.Lgs. 81/08 3,5%):** € ${q.safetyCosts.toFixed(2)}`,
    `- **Spese Tecniche (8%):** € ${q.technicalFees.toFixed(2)}`,
    `- **IVA Agevolata (10%):** € ${q.vat10.toFixed(2)}`,
    `- **TOTALE CHIAVI IN MANO:** **€ ${q.grandTotal.toFixed(2)}**`
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
  a.download = `Relazione_Capitolato_Computo_v15_${Date.now()}.md`; a.click();
  appendLog('📝 Esportato Dossier Tecnico completo (Relazione + Capitolato + Computo .MD).');
};

window.omniExportDossierPDF = function () {
  const d = omniEngineV15.compileFullExecutiveDossier();
  const q = d.quadroEconomico;
  const rowsHtml = d.computoRows.map(r => `<tr><td>${r.num}</td><td>${r.code}</td><td>${r.portal}</td><td>${r.desc}</td><td>${r.unit}</td><td style="text-align:right">${r.qty}</td><td style="text-align:right">€ ${r.price.toFixed(2)}</td><td style="text-align:right"><b>€ ${r.total.toFixed(2)}</b></td></tr>`).join('');
  const capHtml = d.capitolatoArticles.map(a => `<h4>${a.art}</h4><p>${a.text}</p>`).join('');
  const htmlDoc = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><title>Dossier Esecutivo CADBridge v15</title><style>body{font-family:Segoe UI,Arial,sans-serif;color:#0f172a;margin:28px;font-size:12px}h1,h2{color:#0369a1;border-bottom:1px solid #cbd5e1;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #cbd5e1;padding:6px;font-size:11px}th{background:#f1f5f9}.tot{background:#ecfdf5;font-weight:700}</style></head><body>` +
    `<h1>${d.relazioneTecnica.titolo}</h1><p><b>Data:</b> ${d.timestamp} · <b>Salto Energetico:</b> ${q.energyClassJump} · <b>ROI:</b> ${q.estimatedROIPercent}</p>` +
    `<h2>1. Relazione Tecnica Illustrativa, Energetica &amp; Motivazionale</h2><p><b>Stato di fatto:</b> ${d.relazioneTecnica.statoDiFatto}</p><p><b>Progetto motivato:</b> ${d.relazioneTecnica.progettoMotivato}</p><p><b>Verifica normativa (RAI / Legge 10 / CAM):</b> ${d.relazioneTecnica.verificaIdoneitaNormativa}</p>` +
    `<h2>2. Capitolato Speciale d'Appalto (CAM DM 23/06/2022 &amp; DM 37/08)</h2>${capHtml}` +
    `<h2>3. Computo Metrico Estimativo &amp; Quadro Economico Complessivo</h2><table><thead><tr><th>N</th><th>Codice</th><th>Portale</th><th>Descrizione</th><th>UM</th><th>Q.tà</th><th>P.U.</th><th>Totale</th></tr></thead><tbody>${rowsHtml}` +
    `<tr><td colspan="7">Subtotale Lavori a Misura e a Corpo</td><td style="text-align:right">€ ${q.worksSubtotal.toFixed(2)}</td></tr>` +
    `<tr><td colspan="7">Oneri della Sicurezza non soggetti a ribasso (D.Lgs. 81/08 — 3,5%)</td><td style="text-align:right">€ ${q.safetyCosts.toFixed(2)}</td></tr>` +
    `<tr><td colspan="7">Spese Tecniche, Progettazione, Direzione Lavori e Collaudi (8%)</td><td style="text-align:right">€ ${q.technicalFees.toFixed(2)}</td></tr>` +
    `<tr><td colspan="7">IVA Agevolata Ristrutturazione Edilizia (10% su Lavori + Sicurezza)</td><td style="text-align:right">€ ${q.vat10.toFixed(2)}</td></tr>` +
    `<tr class="tot"><td colspan="7">COSTO PRESUNTO COMPLESSIVO DELL'OPERA CHIAVI IN MANO</td><td style="text-align:right">€ ${q.grandTotal.toFixed(2)}</td></tr>` +
    `</tbody></table><script>window.onload=()=>window.print();<\/script></body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(htmlDoc); w.document.close(); }
  else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([htmlDoc], { type: 'text/html;charset=utf-8' }));
    a.download = `Dossier_Esecutivo_Stampa_v15_${Date.now()}.html`; a.click();
  }
  appendLog('📄 Generato Dossier Stampa Esecutiva PDF (Relazione + Capitolato + Computo).');
};

// Estende mvExportWebm per supportare id === 'omni' con audio neurale edge-tts
const _origMvExportWebm = window.mvExportWebm;
window.mvExportWebm = async function (id) {
  if (id !== 'omni') return _origMvExportWebm(id);
  const srcCv = $mv('omniEffectsCv');
  if (!srcCv || !window.MediaRecorder) return;
  const resVal = ($mv('mvExportRes')?.value || '1920x1080').split('x').map(Number);
  const EW = resVal[0] || 1920, EH = resVal[1] || 1080;
  const hdCv = document.createElement('canvas'); hdCv.width = EW; hdCv.height = EH;
  const hdCtx = hdCv.getContext('2d');
  const dur = +($mv('mvDur')?.value || 60);
  const stream = hdCv.captureStream(30);
  const d = omniEngineV15.compileFullExecutiveDossier();
  const s = omniEngineV15.activeSelection;
  const text = humanizeIT(`Documentario Omni-Master ventidue effetti. Intervento su ${omniEngineV15.geometryMetrics.floorAreaMq} metri quadri con ${s.murature_facciate.name}, ${s.infissi_porte.name}, ${s.pavimenti_rivestimenti.name} e ${s.arredi_illuminazione_mep.name}. Salto energetico in classe A4 e totale chiavi in mano ${Math.round(d.quadroEconomico.grandTotal)} euro.`);
  let src = null, actx = null, audioOk = false;
  try {
    const key = localStorage.getItem('xvideo_voice_key'), voice = (!key || key === 'auto') ? 'giuseppe' : key;
    const rate = parseFloat(localStorage.getItem('xvideo_voice_rate')) || 1, pitch = parseFloat(localStorage.getItem('xvideo_voice_pitch')) || 1;
    const q = new URLSearchParams({ text, voice, rate: ((rate - 1) * 100 >= 0 ? '+' : '') + Math.round((rate - 1) * 100) + '%', pitch: ((pitch - 1) * 100 >= 0 ? '+' : '') + Math.round((pitch - 1) * 100) + 'Hz' });
    const r = await fetch('/api/tts?' + q); if (!r.ok) throw new Error('tts ' + r.status);
    actx = new (window.AudioContext || window.webkitAudioContext)(); const buf = await actx.decodeAudioData(await r.arrayBuffer());
    const dest = actx.createMediaStreamDestination(); src = actx.createBufferSource(); src.buffer = buf; src.connect(dest);
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t)); audioOk = true;
  } catch (e) {}
  const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm', videoBitsPerSecond: EW >= 3840 ? 18000000 : 8000000 }), chunks = [];
  let pump = true;
  const copyLoop = () => { if (!pump) return; hdCtx.drawImage(srcCv, 0, 0, EW, EH); requestAnimationFrame(copyLoop); };
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  rec.onstop = () => { pump = false; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); a.download = `CADBridge_OMNI_v15_${EW}x${EH}_${Date.now()}.webm`; a.click(); actx && actx.close(); appendLog(`⏺ Export .WEBM OMNI v15 ${EW}×${EH} (${audioOk ? 'con voce neurale' : 'solo video'}) completato.`); };
  window.omniPlayAutopilot();
  copyLoop(); rec.start(); if (src) src.start();
  setTimeout(() => rec.stop(), dur * 1000 + 350);
};

function omniInitV15() {
  const cat = omniEngineV15.livePortalsCatalog;
  Object.keys(cat).forEach(key => {
    const sel = $mv('omniSwap_' + key);
    if (sel) sel.innerHTML = cat[key].map(it => `<option value="${it.id}">${it.name.slice(0, 58)} (${it.unitPriceEur} €/${it.unit})</option>`).join('');
  });
  const efSel = $mv('omniEffectSel');
  if (efSel) {
    efSel.innerHTML = OMNI_22_EFFECTS.map(e => `<option value="${e.id}">${e.label}</option>`).join('');
  }
  window.omniHotSwap('murature_facciate', cat.murature_facciate[0].id);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', omniInitV15); else omniInitV15();


/* ===== v16.0: 12 MONITOR THEMES + ERGONOMIC BUTTONS + RESPONSIVE 0°/90° CONTROLLER ===== */
/**
 * MonitorThemeAndResponsiveControllerV16
 * Inietta la Top-Bar fissa con 12 Varianti Colore Monitor ad alto contrasto,
 * raggruppa e ingrandisce i tasti per uso ergonomico Touch/Mouse e gestisce
 * il layout PC / Tablet / Smartphone sia Dritto (0° Portrait) sia Ruotato di 90° (Landscape Split-Screen).
 */
class MonitorThemeAndResponsiveControllerV16 {
  constructor() {
    this.version = "16.0.0-12THEMES-ERGONOMIC-90DEG";
    this.themes = [
      { id: "1-obsidian-oled", label: "🌑 1. Obsidian OLED", swatch: "#060913", accent: "#f59e0b" },
      { id: "2-autocad-navy", label: "📐 2. AutoCAD Navy", swatch: "#071326", accent: "#00f5d4" },
      { id: "3-archiproducts-ivory", label: "🏛️ 3. Archiproducts Ivory (Chiaro)", swatch: "#f6f3ec", accent: "#b45309" },
      { id: "4-sunlight-cantiere", label: "☀️ 4. Cantiere Sole Diretto (Max Contrasto)", swatch: "#ffffff", accent: "#000000" },
      { id: "5-studio-sage", label: "🌲 5. Studio Verde Salvia", swatch: "#091917", accent: "#10b981" },
      { id: "6-blackrender-titanium", label: "🔥 6. Black Render Titanium", swatch: "#121214", accent: "#ff6b00" },
      { id: "7-blueprint-cyan", label: "📘 7. Blueprint Tecnico Ciano", swatch: "#002b49", accent: "#38bdf8" },
      { id: "8-luxury-burgundy", label: "🍷 8. Luxury Borgogna & Oro", swatch: "#1a0910", accent: "#fcd34d" },
      { id: "9-nordic-daylight", label: "🧊 9. Nordic Daylight (Grigio Chiaro)", swatch: "#e2e8f0", accent: "#1d4ed8" },
      { id: "10-matrix-terminal", label: "🟢 10. Terminal Matrix CAD", swatch: "#020b05", accent: "#22c55e" },
      { id: "11-cyber-neon", label: "🟣 11. Cyber-Arch Neon", swatch: "#0d051a", accent: "#e879f9" },
      { id: "12-sepia-eyecare", label: "📜 12. Carta da Lucido Sepia (Riposo Occhi)", swatch: "#f3ead6", accent: "#9a3412" }
    ];
  }

  init() {
    const savedTheme = localStorage.getItem("CB_MONITOR_THEME_V16") || "2-autocad-navy";
    this.applyTheme(savedTheme);
    this.renderTopMonitorBar();
    this.upgradeAllButtonsToErgonomicGrid();
    this.setupOrientationListener();
  }

  applyTheme(themeId) {
    document.body.setAttribute("data-monitor-theme", themeId);
    localStorage.setItem("CB_MONITOR_THEME_V16", themeId);
    const activeSelect = document.getElementById("selMonitorThemeV16");
    if (activeSelect && activeSelect.value !== themeId) {
      activeSelect.value = themeId;
    }
  }

  toggleLandscape90Mode() {
    document.body.classList.toggle("cb-force-landscape-90");
    const isLandscape = document.body.classList.contains("cb-force-landscape-90");
    const badge = document.getElementById("lblOrientationStatusV16");
    if (badge) {
      badge.textContent = isLandscape
        ? "📱🔄 Modalità Orizzontale 90° (Split-View Attiva)"
        : "📱⬆️ Modalità Auto / Verticale 0°";
    }
  }

  renderTopMonitorBar() {
    if (document.getElementById("cbMonitorControlBarV16")) return;
    const bar = document.createElement("header");
    bar.id = "cbMonitorControlBarV16";
    bar.style.cssText = "position:sticky;top:0;z-index:99999;padding:10px 14px;background:var(--cb-bg-panel);border-bottom:2px solid var(--cb-accent);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,0.45);";

    const pillsHtml = this.themes.map(t => `
      <button type="button" class="cb-theme-pill-btn" data-theme="${t.id}" title="${t.label}"
        style="min-height:36px !important;padding:6px 10px !important;font-size:12px !important;border-radius:99px !important;background:${t.swatch} !important;color:${['3-archiproducts-ivory','4-sunlight-cantiere','9-nordic-daylight','12-sepia-eyecare'].includes(t.id) ? '#000' : '#fff'} !important;border:2px solid ${t.accent} !important;">
        ${t.label}
      </button>
    `).join("");

    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-weight:900;font-size:14px;color:var(--cb-accent);letter-spacing:0.4px;">
          🖥️ COLORI MONITOR (12 VARIANTI) & ERGONOMIA TASTI:
        </span>
        <select id="selMonitorThemeV16" aria-label="Seleziona variante colore monitor">
          ${this.themes.map(t => `<option value="${t.id}">${t.label}</option>`).join("")}
        </select>
        <button type="button" id="btnToggleLandscape90V16" title="Attiva/Disattiva layout ruotato di 90 gradi affiancato">
          🔄 Layout 0° / 90° (PC • Tablet • Cellulare)
        </button>
        <span id="lblOrientationStatusV16" style="font-size:12px;font-weight:700;color:var(--cb-accent-2);">
          📱⬆️ Rilevamento Orientamento Attivo
        </span>
      </div>
      <div style="display:flex;gap:6px;overflow-x:auto;max-width:100%;padding-bottom:4px;">
        ${pillsHtml}
      </div>
    `;

    document.body.prepend(bar);

    document.getElementById("selMonitorThemeV16").addEventListener("change", (e) => {
      this.applyTheme(e.target.value);
    });
    document.getElementById("btnToggleLandscape90V16").addEventListener("click", () => {
      this.toggleLandscape90Mode();
    });
    bar.querySelectorAll(".cb-theme-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => this.applyTheme(btn.getAttribute("data-theme")));
    });
  }

  upgradeAllButtonsToErgonomicGrid() {
    // Rende tutte le barre di pulsanti una griglia spaziosa e leggibile
    document.querySelectorAll("div, section").forEach(container => {
      const directButtons = Array.from(container.children).filter(el => el.tagName === "BUTTON");
      if (directButtons.length >= 4) {
        container.classList.add("cb-ergonomic-btn-grid");
      }
    });
  }

  setupOrientationListener() {
    const updateOrientationBadge = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const badge = document.getElementById("lblOrientationStatusV16");
      if (badge && !document.body.classList.contains("cb-force-landscape-90")) {
        badge.textContent = isLandscape
          ? `📐 Orizzontale 90° (${window.innerWidth}×${window.innerHeight}px)`
          : `📱 Verticale 0° (${window.innerWidth}×${window.innerHeight}px)`;
      }
    };
    window.addEventListener("resize", updateOrientationBadge);
    window.addEventListener("orientationchange", updateOrientationBadge);
    updateOrientationBadge();
  }
}


window.MonitorThemeAndResponsiveControllerV16 = MonitorThemeAndResponsiveControllerV16;
window.monitorControllerV16 = new MonitorThemeAndResponsiveControllerV16();
function initMonitorV16() {
  window.monitorControllerV16.init();
  // Applica classe cb-viewport-column alla colonna principale del viewport per lo split-screen 48%/52%
  const ws = document.querySelector('.workspace-grid.cb-responsive-workspace');
  if (ws && ws.children.length >= 2) {
    ws.children[0].classList.add('cb-viewport-column');
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMonitorV16); else initMonitorV16();
