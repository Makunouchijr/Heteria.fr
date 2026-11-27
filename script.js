/* =====================================================
   Nos 2 ans ❤️ — livre d'amour 3D interactif
   ===================================================== */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = t => t * t * (3 - 2 * t);

const STORE = 'nos2ans-livre-v1';
const SOUND_KEY = 'nos2ans-son';
const ZS = 0.9;            // épaisseur (px) entre deux feuillets dans l'empilement 3D

/* ---------------------------------------------------
   CONTENU (tout est modifiable depuis le mode ✎)
   --------------------------------------------------- */
const DEFAULTS = {
  'cover.title': 'Nos 2 ans',
  'cover.sub': 'Notre petit livre d’amour',
  'endA.text': 'Pour toi,\nmon amour ♡',
  'endB.text': 'À suivre…\ntoujours ensemble ♡'
};

const PAGES = [
  { kind: 'pink', title: 'Je t’aime tellement ♡',
    body: 'Joyeux anniversaire à nous, mon amour ! J’ai encore du mal à croire que ça fait déjà 2 ans. Quand je repense à tout ce chemin parcouru ensemble, je souris sans pouvoir m’arrêter. Depuis que je te connais, tu fais partie de ma vie et tu l’as rendue meilleure. Merci d’être là, tout simplement.' },
  { kind: 'white', title: 'Ce que tu es pour moi',
    body: 'Tu es ma moitié, ma personne préférée, mon endroit sûr. Avec toi tout est plus doux, plus drôle, plus simple. Je n’ai pas besoin de faire semblant : je peux être moi, entièrement. Tu m’as appris ce que veut dire aimer pour de vrai, et je ne le savais pas avant toi.' },
  { kind: 'pink', title: 'Ton sourire',
    body: 'Voir ton sourire, c’est ma chose préférée au monde. Il est si lumineux qu’il éclaire toutes mes journées. Et ton rire… il est tellement contagieux que dès que tu ris, je ris aussi, même sans savoir pourquoi ! C’est mon son préféré.' },
  { kind: 'white', title: 'Notre rencontre',
    body: 'Le jour où on s’est rencontrés, je ne savais pas que ma vie allait changer. Un regard, quelques mots… et puis tout s’est enchaîné. Si c’était à refaire, je choisirais exactement le même chemin pour arriver jusqu’à toi.\n\n(Raconte ici votre vraie histoire !)' },
  { kind: 'pink', title: 'Nos premiers souvenirs',
    body: 'Notre premier rendez-vous, nos premiers fous rires, nos premiers « je t’aime »… Je garde tout précieusement dans mon cœur, comme un trésor.\n\n(Écris ici ton plus beau souvenir !)' },
  { kind: 'white', title: 'Mes raisons de t’aimer (1/3)',
    body: '1. Je me sens en sécurité près de toi\n2. Je me sens chez moi dans tes bras\n3. Tu me fais toujours rire\n4. Tu sais quoi dire quand ça ne va pas\n5. On se réconcilie toujours\n6. Tu es là dans mes pires moments\n7. Tu me donnes confiance en moi\n8. Tes petites attentions me touchent' },
  { kind: 'pink', title: 'Mes raisons de t’aimer (2/3)',
    body: '9. Tu écoutes vraiment quand je parle\n10. Ta façon de me regarder\n11. Tu me comprends sans mots\n12. Tu rends même les jours gris jolis\n13. Ta voix quand tu me dis bonne nuit\n14. Tu crois en moi\n15. Nos fous rires pour rien\n16. Tu es simplement toi' },
  { kind: 'white', title: 'Mes raisons de t’aimer (3/3)',
    body: '17. Tes câlins qui réparent tout\n18. Tes messages qui me font sourire\n19. Tu me fais devenir meilleur\n20. Tu as toujours le bon mot\n21. Tu me donnes envie de rêver grand\n22. Je peux tout te dire\n23. Tu es mon meilleur ami\n24. Parce que c’est toi, et personne d’autre' },
  { kind: 'pink', title: 'Nos fous rires',
    body: 'Il y a ces moments où on rit tellement qu’on n’arrive plus à respirer, et qu’on ne sait même plus pourquoi. Ce sont ceux que je préfère. Avec toi, je pourrais rire toute ma vie.\n\n(Ajoute ici votre meilleur fou rire !)' },
  { kind: 'white', title: 'Même quand c’est dur',
    body: 'On n’est pas parfaits et on a eu nos petites disputes. Mais on a toujours su en parler, s’excuser et se retrouver. C’est ça qui me rend le plus fier de nous : on ne lâche jamais, et on en ressort plus forts.' },
  { kind: 'pink', title: 'Nos petites habitudes',
    body: 'Nos messages du matin, nos blagues que personne d’autre ne comprend, nos surnoms ridicules, nos films vus et revus… Ces petits riens, c’est ce qui fait que « nous » est unique.\n\n(Complète avec vos habitudes à vous.)' },
  { kind: 'white', title: 'Mes promesses',
    body: 'Je te promets de te faire rire, même les jours difficiles. De t’écouter, vraiment. De te soutenir dans tes projets, de te serrer fort quand il le faudra, et de te choisir, encore et encore, chaque jour.' },
  { kind: 'pink', title: 'Notre futur',
    body: 'J’ai hâte de tout ce qui nous attend : les voyages, les aventures, les souvenirs qu’on va créer, et peut-être un jour notre premier chez-nous à décorer ensemble. Je veux tout ça avec toi.\n\n(Écris ici vos rêves à deux.)' },
  { kind: 'white', title: 'Merci',
    body: 'Merci d’être patient avec moi. Merci d’être toi. Merci pour chaque message, chaque câlin, chaque sourire. Merci d’avoir fait de ces deux années les plus belles de ma vie.' },
  { kind: 'pink', title: 'Si c’était à refaire',
    body: 'Si je devais tout recommencer, je referais exactement la même chose. Chaque détour, chaque hasard, chaque coup de chance m’a mené à toi, et c’est le plus beau cadeau que la vie m’ait fait.' },
  { kind: 'white', title: 'Pour les 2 ans à venir',
    body: 'Que les prochaines années soient remplies de rires, de tendresse et de nouveautés. Qu’on continue à grandir ensemble, à se surprendre, à s’aimer un peu plus chaque jour. Je serai là, toujours.' },
  { kind: 'pink', title: 'Mon plus beau souhait',
    body: 'Mon plus beau souhait, c’est que ce livre ne soit que le premier chapitre. Qu’on en remplisse plein d’autres ensemble, page après page, année après année.\n\n(Tu peux écrire ici ton vœu pour nous.)' },
  { kind: 'white', title: 'Je t’aime',
    body: 'Je t’aime plus que les mots ne peuvent le dire. Joyeux 2 ans, mon amour. Cette page est la dernière du livre, mais pas de notre histoire : elle ne fait que commencer.\n\nPour toujours,\ntoi ♡' }
];
const N_PAGES = PAGES.length;               // 18
PAGES.forEach((p, i) => {
  DEFAULTS[`p${i + 1}.title`] = p.title;
  DEFAULTS[`p${i + 1}.body`] = p.body;
});

let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { saved = {}; }
const T = key => (key in saved ? saved[key] : DEFAULTS[key]) ?? '';
let saveTimer = 0;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE, JSON.stringify(saved)); toast('Enregistré ✓'); }
    catch (e) { toast('Impossible d’enregistrer'); }
  }, 450);
}

/* ---------------------------------------------------
   TEXTURES GÉNÉRÉES (papier, cuir, baisers rouge à lèvres)
   --------------------------------------------------- */
function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function makeGrain() {
  const c = canvas(256, 256), x = c.getContext('2d'), r = rng(7);
  const img = x.createImageData(256, 256), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const light = r() > .5; const v = light ? 255 : 40;
    d[i] = v; d[i + 1] = light ? 250 : 28; d[i + 2] = light ? 240 : 18; d[i + 3] = r() * (light ? 20 : 24);
  }
  x.putImageData(img, 0, 0);
  x.lineCap = 'round';
  for (let i = 0; i < 160; i++) {          // petites fibres de papier
    x.strokeStyle = `rgba(${r() > .5 ? '110,85,60' : '255,255,250'},${.05 + r() * .06})`;
    x.lineWidth = .5 + r() * .5;
    const px = r() * 256, py = r() * 256, a = r() * 6.28, l = 3 + r() * 9;
    x.beginPath(); x.moveTo(px, py);
    x.quadraticCurveTo(px + Math.cos(a) * l * .5 + r() * 3, py + Math.sin(a) * l * .5 + r() * 3, px + Math.cos(a) * l, py + Math.sin(a) * l);
    x.stroke();
  }
  return c.toDataURL('image/png');
}

function makeLeather() {
  const c = canvas(256, 256), x = c.getContext('2d'), r = rng(21);
  for (let i = 0; i < 1500; i++) {           // grain de cuir façon galets
    const px = r() * 256, py = r() * 256, rad = 1.3 + r() * 2.2;
    for (const ox of [0, -256, 256]) for (const oy of [0, -256, 256]) {
      const X = px + ox, Y = py + oy;
      if (X < -4 || X > 260 || Y < -4 || Y > 260) continue;
      x.fillStyle = 'rgba(255,255,255,.075)'; x.beginPath(); x.arc(X - .6, Y - .6, rad, 0, 6.3); x.fill();
      x.fillStyle = 'rgba(0,0,0,.2)'; x.beginPath(); x.arc(X + .7, Y + .7, rad, 0, 6.3); x.fill();
      x.fillStyle = 'rgba(120,40,60,.12)'; x.beginPath(); x.arc(X, Y, rad * .78, 0, 6.3); x.fill();
    }
  }
  return c.toDataURL('image/png');
}

const LIPS_UPPER = new Path2D('M0 30 C12 18 28 4 42 8 C46 9 48 13 50 13 C52 13 54 9 58 8 C72 4 88 18 100 30 C88 34 70 36 50 36 C30 36 12 34 0 30Z');
const LIPS_LOWER = new Path2D('M4 33 C25 40 75 40 96 33 C90 48 72 58 50 58 C28 58 10 48 4 33Z');
function makeKisses(seed) {
  const W = 540, H = 770, r = rng(seed);
  const base = canvas(W, H), bx = base.getContext('2d');
  const g = bx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#f8c6d2'); g.addColorStop(.5, '#f4b3c3'); g.addColorStop(1, '#f6bccb');
  bx.fillStyle = g; bx.fillRect(0, 0, W, H);
  const layer = canvas(W, H), lx = layer.getContext('2d');
  const cols = ['#d3234c', '#e04466', '#c01c44', '#e8587c', '#cf2b56'];
  const pts = [];
  let tries = 0;
  while (pts.length < 34 && tries++ < 400) {   // répartition sans trop de chevauchement
    const p = { x: r() * W, y: r() * H, s: .55 + r() * .6 };
    if (pts.every(q => Math.hypot(q.x - p.x, q.y - p.y) > 70 * (p.s + q.s) * .6)) pts.push(p);
  }
  for (const p of pts) {
    lx.save();
    lx.translate(p.x, p.y); lx.rotate((r() - .5) * 2.2); lx.scale(p.s * 1.15, p.s * 1.15); lx.translate(-50, -29);
    lx.globalAlpha = .5 + r() * .3; lx.fillStyle = cols[(r() * cols.length) | 0];
    lx.fill(LIPS_UPPER); lx.fill(LIPS_LOWER);
    lx.globalAlpha = .55; lx.strokeStyle = '#8e1534'; lx.lineWidth = 1.4; lx.lineCap = 'round';
    lx.beginPath(); lx.moveTo(3, 32); lx.bezierCurveTo(25, 39, 75, 39, 97, 32); lx.stroke();
    lx.restore();
  }
  lx.globalCompositeOperation = 'destination-out';   // texture "rouge à lèvres"
  for (let i = 0; i < 9000; i++) {
    lx.globalAlpha = .2 + r() * .45; lx.beginPath(); lx.arc(r() * W, r() * H, .4 + r() * 1.5, 0, 6.3); lx.fill();
  }
  lx.globalCompositeOperation = 'source-over';
  bx.drawImage(layer, 0, 0);
  return base.toDataURL('image/jpeg', .9);
}

function initTextures() {
  const s = document.documentElement.style;
  const grain = makeGrain();
  const defs = document.querySelector('svg defs');
  defs.insertAdjacentHTML('beforeend', `<pattern id="pGrain" width="60" height="60" patternUnits="userSpaceOnUse"><image href="${grain}" width="60" height="60"/></pattern>`);
  s.setProperty('--grain', `url(${grain})`);
  s.setProperty('--leather', `url(${makeLeather()})`);
  s.setProperty('--kiss1', `url(${makeKisses(11)})`);
  s.setProperty('--kiss2', `url(${makeKisses(97)})`);
}

/* ---------------------------------------------------
   SON DES PAGES (synthétisé, aucun fichier)
   --------------------------------------------------- */
let actx = null, soundOn = localStorage.getItem(SOUND_KEY) !== '0';
function swish(vol = 1, speed = 1) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const dur = .5 / speed, n = Math.floor(actx.sampleRate * dur);
    const buf = actx.createBuffer(1, n, actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
      const t = i / n, env = Math.pow(Math.sin(Math.PI * Math.pow(t, .7)), 2.2);
      d[i] = (Math.random() * 2 - 1) * env * (.7 + .3 * Math.sin(i * .02));
    }
    const src = actx.createBufferSource(); src.buffer = buf;
    const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .8;
    bp.frequency.setValueAtTime(900, actx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(3800, actx.currentTime + dur * .55);
    bp.frequency.exponentialRampToValueAtTime(1500, actx.currentTime + dur);
    const gn = actx.createGain(); gn.gain.value = .22 * vol;
    src.connect(bp); bp.connect(gn); gn.connect(actx.destination); src.start();
  } catch (e) { /* audio indisponible : tant pis */ }
}

/* ---------------------------------------------------
   CONSTRUCTION DU DOM
   --------------------------------------------------- */
const el = {
  stage: $('#stage'), scene: $('#scene'), tilt: $('#tilt'), book: $('#book'), floor: $('#floor'),
  hint: $('#hint'), toast: $('#toast'), controls: $('#controls'), editBar: $('#editBar'),
  prev: $('#btnPrev'), next: $('#btnNext'), counter: $('#counter'),
  edit: $('#btnEdit'), sound: $('#btnSound'), toggle: $('#btnToggle'), toggleLabel: $('#toggleLabel'), reset: $('#btnReset')
};

const FX = '<i class="fx gutter"></i><i class="fx shade"></i><i class="fx cast"></i>';
const HEART_PATH = 'M50 88 C20 66 4 48 4 28 C4 12 16 3 29 3 C39 3 46 9 50 17 C54 9 61 3 71 3 C84 3 96 12 96 28 C96 48 80 66 50 88Z';
const heartSVG = fill => `<svg viewBox="0 0 100 92" preserveAspectRatio="none"><path d="${HEART_PATH}" fill="url(#${fill})" stroke="rgba(255,225,225,.45)" stroke-width="1.1" stroke-linejoin="round"/><path d="${HEART_PATH}" fill="url(#pGrain)"/><path class="hshade" d="${HEART_PATH}" fill="#2a0006"/></svg>`;

function endpaperHTML(which) {
  return `<div class="endpaper">
    <div class="window"></div>
    <i class="tape tp-top"></i><i class="tape tp-bot"></i><i class="thread"></i>
    <div class="hshadow"><svg viewBox="0 0 100 92" preserveAspectRatio="none"><path d="${HEART_PATH}"/></svg></div>
    <div class="heart3d"><div class="heart-rot">
      <div class="half l">${heartSVG('gHeartL')}</div>
      <div class="half r">${heartSVG('gHeartR')}</div>
    </div></div>
    <div class="endnote editable gold-none" data-key="end${which}.text" data-ph="Un petit mot…"></div>
  </div>`;
}

function coverFrontHTML() {
  const corner = '<path d="M2 28 C2 12 12 2 28 2"/><circle cx="6" cy="6" r="1.6"/><path d="M10 14 C10 11 11 10 14 10"/>';
  return `<div class="cover-front">
    <div class="cover-spine"></div>
    <i class="foil f1"></i><i class="foil f2"></i>
    <svg class="corner tl" viewBox="0 0 30 30">${corner}</svg>
    <svg class="corner tr" viewBox="0 0 30 30">${corner}</svg>
    <svg class="corner bl" viewBox="0 0 30 30">${corner}</svg>
    <svg class="corner br" viewBox="0 0 30 30">${corner}</svg>
    <div class="cover-center">
      <div class="cover-title gold-text editable" data-key="cover.title" data-ph="Titre"></div>
      <span class="cover-heart" aria-label="cœur">❤️</span>
      <svg class="flourish" viewBox="0 0 200 30"><path d="M4 15 H78 M122 15 H196"/><path d="M78 15 C86 4 94 4 100 15 C106 26 114 26 122 15"/><circle cx="100" cy="15" r="2.4"/></svg>
      <div class="cover-sub gold-text editable" data-key="cover.sub" data-ph="Sous-titre"></div>
    </div>
    <div class="cover-shine"></div>
  </div>`;
}

function pageHTML(n, side) {
  const p = PAGES[n - 1], k = `p${n}`;
  if (p.kind === 'pink') {
    const rot = (((n * 37) % 7) - 3) * .22;
    return `<div class="page pink k${n % 2 ? 1 : 2}">
      <div class="title editable" data-key="${k}.title" data-ph="Titre"></div>
      <div class="sheet" style="--rot:${rot}deg"><i class="tape t1"></i><i class="tape t2"></i>
        <div class="body editable" data-key="${k}.body" data-ph="Écris ici ton message…"></div></div>
      <span class="pno">${n}</span></div>`;
  }
  return `<div class="page white ${side === 'left' ? 'left' : ''}">
    <div class="sheet">
      <div class="title editable" data-key="${k}.title" data-ph="Titre"></div>
      <div class="body editable" data-key="${k}.body" data-ph="Écris ici ton message…"></div></div>
    <span class="pno">${n}</span></div>`;
}

/* ---------------------------------------------------
   ÉTAT
   --------------------------------------------------- */
let mode = '';               // 'spread' (double page) | 'single' (une page, mobile portrait)
let pw = 360, ph = 514;
let leaves = [];             // { el, front, back, p, tw, c:{...} }
let pos = 0;                 // nombre de feuillets tournés (0 = fermé)
let maxPos = 0;
let editing = false;
let blockR, blockL, backboard;
let blockCache = '';
let par = { x: 0, y: 0, tx: 0, ty: 0 };   // parallaxe souris
let raf = 0;

function makeLeaf(frontHTML, backHTML, isCover) {
  const d = document.createElement('div');
  d.className = 'leaf' + (isCover ? ' cover' : '');
  d.innerHTML = `<div class="face front">${frontHTML}${FX}</div><div class="face back">${backHTML}${FX}</div>`;
  el.book.appendChild(d);
  const f = d.querySelector('.front'), b = d.querySelector('.back');
  leaves.push({
    el: d, p: 0, tw: null, c: {},
    fShade: f.querySelector('.shade'), bShade: b.querySelector('.shade'),
    fCast: f.querySelector('.cast'), bCast: b.querySelector('.cast')
  });
}

function buildBook(keepPos) {
  const single = mode === 'single';
  el.book.innerHTML = '';
  leaves = []; blockCache = '';
  el.book.insertAdjacentHTML('beforeend',
    `<div class="backboard">${single ? '' : endpaperHTML('B')}</div><div class="block r"></div><div class="block l"></div>`);
  blockR = $('.block.r', el.book); blockL = $('.block.l', el.book); backboard = $('.backboard', el.book);

  const board = `<div class="board-in"><div class="cover-spine"></div>${single ? '' : endpaperHTML('A')}</div>`;
  makeLeaf(coverFrontHTML(), board, true);

  if (single) {
    const list = [endpaperHTML('A'), ...PAGES.map((_, i) => pageHTML(i + 1, 'right')), endpaperHTML('B')];
    list.forEach(h => makeLeaf(h, '<div class="blank"></div>'));
    maxPos = leaves.length - 1;
  } else {
    for (let j = 1; j <= N_PAGES / 2; j++) makeLeaf(pageHTML(2 * j - 1, 'right'), pageHTML(2 * j, 'left'));
    maxPos = leaves.length;
  }
  pos = clamp(keepPos ?? 0, 0, maxPos);
  leaves.forEach((L, i) => { L.p = i < pos ? 1 : 0; });
  fillTexts();
  updateTop();
  renderAll(true);
  updateUI();
}

function fillTexts(root = el.book) {
  root.querySelectorAll('[data-key]').forEach(n => { n.textContent = T(n.dataset.key); });
}

/* ---------------------------------------------------
   MISE EN PAGE RESPONSIVE
   --------------------------------------------------- */
function computeMode(vw, vh) { return (vw < 700 || vw / vh < 1) ? 'single' : 'spread'; }

function layout(force) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const ctl = el.controls.offsetHeight || 86;
  const availH = Math.max(160, vh - ctl - (vh < 520 ? 28 : 100));
  const newMode = computeMode(vw, vh);
  const RATIO = 1.43;                         // hauteur / largeur d'une page
  let w = newMode === 'spread' ? Math.min(vw * .455, availH / RATIO) : Math.min(vw * .9, availH / RATIO);
  pw = Math.floor(w);
  ph = newMode === 'spread' ? Math.round(pw * RATIO) : Math.round(Math.max(pw * RATIO, Math.min(availH, pw * 1.7)));
  const root = document.documentElement.style;
  root.setProperty('--pw', pw + 'px');
  root.setProperty('--ph', ph + 'px');
  root.setProperty('--ov', Math.max(4, Math.round(pw * .02)) + 'px');
  if (newMode !== mode || force) {
    let keep = 0;
    if (mode && pos > 0) {                    // conserve la page affichée en changeant de mode
      if (mode === 'spread' && newMode === 'single') keep = Math.min(2 * pos, leaves.length - 1 + 0);
      else if (mode === 'single' && newMode === 'spread') keep = pos === 1 ? 1 : Math.floor((pos - 1) / 2) + 1;
      else keep = pos;
    }
    mode = newMode;
    buildBook(keep);
  } else {
    renderAll(true);
  }
}

/* ---------------------------------------------------
   MOTEUR D'ANIMATION
   --------------------------------------------------- */
function startLoop() { if (!raf) raf = requestAnimationFrame(frame); }

function tween(L, to, dur, delay = 0) {
  L.tw = { from: L.p, to, t0: performance.now() + delay, dur };
  startLoop();
}

function frame(now) {
  raf = 0;
  let active = false;
  for (const L of leaves) {
    if (!L.tw) continue;
    const t = (now - L.tw.t0) / L.tw.dur;
    if (t < 0) { active = true; continue; }
    if (t >= 1) { L.p = L.tw.to; L.tw = null; }
    else { L.p = lerp(L.tw.from, L.tw.to, ease(t)); active = true; }
  }
  // parallaxe souris (douce)
  par.x += (par.tx - par.x) * .08; par.y += (par.ty - par.y) * .08;
  if (Math.abs(par.tx - par.x) > .002 || Math.abs(par.ty - par.y) > .002) active = true;
  renderAll();
  if (active) raf = requestAnimationFrame(frame);
  else onSettled();
}

function onSettled() {
  updateTop();
  if (editing) refreshEditable();
}

function setOp(node, key, L, v) {
  const q = Math.round(v * 100) / 100;
  if (L.c[key] !== q) { L.c[key] = q; node.style.opacity = q; }
}

function renderAll(force) {
  const n = leaves.length;
  if (!n) return;
  for (let i = 0; i < n; i++) {
    const L = leaves[i], p = L.p;
    const s = Math.sin(p * Math.PI);
    const z = (1 - p) * (n - i) * ZS + p * i * ZS + s * 3;
    const tr = `translateZ(${z.toFixed(2)}px) rotateY(${(-180 * p).toFixed(2)}deg)`;
    if (L.c.tr !== tr) { L.c.tr = tr; L.el.style.transform = tr; }
    if (mode === 'single') {                 // les feuillets tournés sortent de l'écran : on les masque
      const hid = p > .999 ? 'hidden' : '';
      if (L.c.vis !== hid) { L.c.vis = hid; L.el.style.visibility = hid; }
    }

    // ombre & reflet sur la face qui se déplace
    const front = p < .5;
    setOp(L.fShade, 'fs', L, front ? s * .85 : 0);
    setOp(L.bShade, 'bs', L, front ? 0 : s * .85);
    const hl = front ? 88 - 70 * (p * 2) : 88 - 70 * ((1 - p) * 2);
    const hq = Math.round(hl);
    if (front && L.c.hf !== hq) { L.c.hf = hq; L.fShade.style.setProperty('--hl', hq + '%'); }
    if (!front && L.c.hb !== hq) { L.c.hb = hq; L.bShade.style.setProperty('--hl', hq + '%'); }

    // ombre portée du feuillet précédent sur la page de droite révélée
    const prev = leaves[i - 1], next = leaves[i + 1];
    let cr = 0, wr = 0;
    if (prev && p < .5) {
      const q = prev.p;
      if (q > 0 && q < 1) { cr = Math.min(1, q * 6) * Math.pow(1 - q, .7); wr = 100 * (1 - q) + 8; }
    }
    setOp(L.fCast, 'cr', L, cr * .8);
    const wrq = Math.round(wr); if (L.c.wr !== wrq) { L.c.wr = wrq; L.fCast.style.width = wrq + '%'; }
    // ombre portée du feuillet suivant qui vient se poser sur la page de gauche
    let cl = 0, wl = 0;
    if (next && p >= .5) {
      const q = next.p;
      if (q > 0 && q < 1) { cl = Math.min(1, (1 - q) * 6) * Math.pow(q, .7); wl = 100 * q + 8; }
    }
    setOp(L.bCast, 'cl', L, cl * .8);
    const wlq = Math.round(wl); if (L.c.wl !== wlq) { L.c.wl = wlq; L.bCast.style.width = wlq + '%'; }
  }

  // position / inclinaison du livre selon son ouverture
  const p0 = leaves[0].p;
  const shift = mode === 'spread' ? (pw / 2) * smooth(p0) : 0;
  const open = smooth(p0);
  const ax = editing ? 0 : par.x, ay = editing ? 0 : par.y;
  const rx = lerp(7, 3, open) - ay * 3.2;
  const ry = lerp(-12, 0, open) + ax * 4;
  el.tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateX(${shift.toFixed(1)}px)`;
  const fw = mode === 'spread' ? lerp(1.15, 2.2, open) : lerp(1.15, 1.3, open);
  el.floor.style.width = (pw * fw) + 'px';
  el.floor.style.transform = `translate(calc(-50% + ${(-shift * .0).toFixed(1)}px), ${(ph * .5 - ph * .02).toFixed(1)}px)`;

  updateBlocks();
}

function updateBlocks() {
  if (!blockR) return;
  const inner = leaves.slice(1);
  const nr = inner.filter(l => l.p < .5).length, nl = inner.filter(l => l.p >= .5).length;
  const key = nr + ':' + nl + ':' + mode;
  if (key === blockCache) return;
  blockCache = key;
  const mk = (cnt, dir) => Array.from({ length: Math.min(cnt, 16) }, (_, k) =>
    `${(dir * (k + 1) * .75).toFixed(2)}px ${((k + 1) * .6).toFixed(2)}px 0 0 ${k % 2 ? '#e4d9c3' : '#faf4e8'}`).join(',');
  blockR.style.boxShadow = mk(nr, 1) || 'none';
  blockL.style.boxShadow = mk(nl, -1) || 'none';
  blockR.style.display = nr ? '' : 'none';
  blockL.style.display = (mode === 'single' || !nl) ? 'none' : '';
}

/* ---------------------------------------------------
   NAVIGATION
   --------------------------------------------------- */
function goTo(target, opts = {}) {
  target = clamp(target, 0, maxPos);
  if (target === pos) return;
  if (document.activeElement && document.activeElement.isContentEditable) document.activeElement.blur();
  const count = Math.abs(target - pos);
  const dur = opts.dur ?? (count > 1 ? 780 : 1050);
  const gap = count > 1 ? clamp(1400 / count, 45, 130) : 0;
  if (target > pos) for (let k = pos; k < target; k++) tween(leaves[k], 1, dur, (k - pos) * gap);
  else for (let k = pos - 1; k >= target; k--) tween(leaves[k], 0, dur, (pos - 1 - k) * gap);
  const sounds = Math.min(count, 6);
  for (let s = 0; s < sounds; s++) setTimeout(() => swish(count > 1 ? .55 : 1, count > 1 ? 1.4 : 1), s * (count > 1 ? gap * (count / sounds) : 0) + 60);
  pos = target;
  updateTop(); updateUI();
}

function updateTop() {
  leaves.forEach((L, i) => {
    L.el.classList.toggle('top-r', i === pos);
    L.el.classList.toggle('top-l', i === pos - 1);
  });
  if (backboard) backboard.classList.toggle('top', pos === maxPos);
}

function updateUI() {
  const closed = pos === 0;
  el.book.classList.toggle('is-closed', closed);
  el.hint.classList.toggle('gone', !closed);
  el.prev.disabled = closed;
  el.next.disabled = pos >= maxPos;
  el.toggleLabel.textContent = closed ? 'Ouvrir' : 'Fermer';
  el.toggle.setAttribute('aria-label', closed ? 'Ouvrir le livre' : 'Fermer le livre');
  let label;
  if (closed) label = 'Couverture';
  else if (mode === 'single') label = pos === 1 ? 'Page de garde' : pos - 1 > N_PAGES ? 'Fin' : `${pos - 1} / ${N_PAGES}`;
  else {
    const L = 2 * pos - 2, R = 2 * pos - 1;
    if (L < 1) label = 'Page de garde';
    else if (R > N_PAGES) label = `${L} / ${N_PAGES}`;
    else label = `${L}–${R} / ${N_PAGES}`;
  }
  el.counter.textContent = label;
}

const next = () => { if (pos === 0 && editing) return; goTo(pos + 1); };
const prev = () => goTo(pos - 1);

/* ---------------------------------------------------
   INTERACTIONS : tap, glisser pour tourner, clavier
   --------------------------------------------------- */
let drag = null;

function dragRange() { return mode === 'spread' ? Math.min(pw * 1.5, window.innerWidth * .7) : Math.min(pw * .95, window.innerWidth * .8); }

el.scene.addEventListener('pointerdown', e => {
  if (e.button > 0 || editing) return;
  if (e.target.closest('.controls')) return;
  drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false, dir: 0, L: null, vx: 0, lx: e.clientX, lt: performance.now() };
  try { el.scene.setPointerCapture(e.pointerId); } catch (_) {}
});

el.scene.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') {
    par.tx = (e.clientX / window.innerWidth - .5) * 2;
    par.ty = (e.clientY / window.innerHeight - .5) * 2;
    startLoop();
  }
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
  if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * .8) {
    const dir = dx < 0 ? 1 : -1;
    if ((dir === 1 && pos < maxPos) || (dir === -1 && pos > 0)) {
      drag.moved = true; drag.dir = dir;
      drag.L = leaves[dir === 1 ? pos : pos - 1];
      drag.L.tw = null;
      if (document.activeElement && document.activeElement.isContentEditable) document.activeElement.blur();
    } else { drag.moved = true; drag.dir = 0; }
  }
  if (drag.moved && drag.dir) {
    const R = dragRange();
    drag.L.p = drag.dir === 1 ? clamp(-dx / R, 0, 1) : clamp(1 - dx / R, 0, 1);
    const now = performance.now(), dt = Math.max(1, now - drag.lt);
    drag.vx = .6 * drag.vx + .4 * ((e.clientX - drag.lx) / dt);
    drag.lx = e.clientX; drag.lt = now;
    startLoop();
  }
});

function endDrag(e, cancelled) {
  if (!drag || e.pointerId !== drag.id) return;
  const d = drag; drag = null;
  try { el.scene.releasePointerCapture(e.pointerId); } catch (_) {}
  if (d.moved && d.dir) {
    const L = d.L, p = L.p;
    const commit = d.dir === 1 ? (p > .38 || d.vx < -.55) : (p < .62 || d.vx > .55);
    const ok = cancelled ? false : commit;
    const to = d.dir === 1 ? (ok ? 1 : 0) : (ok ? 0 : 1);
    tween(L, to, 260 + 700 * Math.abs(to - p));
    if (ok) { pos += d.dir; swish(.9); }
    updateTop(); updateUI();
  } else if (!d.moved && !cancelled) {
    // simple tap
    if (pos === 0) { goTo(1); return; }
    const r = el.scene.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const right = mode === 'spread' ? e.clientX > cx : e.clientX > r.left + r.width * .38;
    right ? next() : prev();
  }
}
el.scene.addEventListener('pointerup', e => endDrag(e, false));
el.scene.addEventListener('pointercancel', e => endDrag(e, true));
el.scene.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { par.tx = 0; par.ty = 0; startLoop(); } });

window.addEventListener('keydown', e => {
  const t = e.target;
  if (t && (t.isContentEditable || /INPUT|TEXTAREA/.test(t.tagName))) {
    if (e.key === 'Escape') { t.blur(); }
    if (e.key === 'Enter' && t.classList.contains('title')) e.preventDefault();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); if (!editing || pos > 0) next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  else if (e.key === 'Home') goTo(0);
  else if (e.key === 'End') goTo(maxPos);
  else if (e.key === 'Escape' && editing) setEditing(false);
  else if (e.key === 'Enter' && document.activeElement === document.body && pos === 0) goTo(1);
});

el.prev.addEventListener('click', prev);
el.next.addEventListener('click', next);
el.toggle.addEventListener('click', () => (pos === 0 ? goTo(1) : goTo(0)));
el.sound.addEventListener('click', () => {
  soundOn = !soundOn;
  localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0');
  el.sound.setAttribute('aria-pressed', String(soundOn));
  if (soundOn) swish(.6);
});

/* ---------------------------------------------------
   ÉDITION DES TEXTES
   --------------------------------------------------- */
function refreshEditable() {
  document.querySelectorAll('.editable').forEach(n => {
    const leaf = n.closest('.leaf');
    let on = false;
    if (editing) {
      if (leaf) {
        const face = n.closest('.face');
        on = (face.classList.contains('front') && leaf.classList.contains('top-r')) ||
             (face.classList.contains('back') && leaf.classList.contains('top-l'));
      } else if (n.closest('.backboard')) on = pos === maxPos;
    }
    if (on) {
      if (!n.hasAttribute('contenteditable')) {
        n.setAttribute('contenteditable', 'plaintext-only');
        if (n.contentEditable !== 'plaintext-only') n.setAttribute('contenteditable', 'true');
        n.setAttribute('spellcheck', 'true');
        n.setAttribute('lang', 'fr');
      }
    } else n.removeAttribute('contenteditable');
  });
}

function setEditing(v) {
  editing = v;
  document.body.classList.toggle('editing', v);
  el.edit.setAttribute('aria-pressed', String(v));
  el.editBar.hidden = !v;
  if (v && pos === 0) goTo(1);
  refreshEditable();
  renderAll(true);
  if (!v && document.activeElement && document.activeElement.isContentEditable) document.activeElement.blur();
  toast(v ? 'Mode écriture activé ✎' : 'Mode lecture');
}
el.edit.addEventListener('click', () => setEditing(!editing));

el.book.addEventListener('input', e => {
  const n = e.target.closest('[data-key]');
  if (!n) return;
  let v = n.innerText.replace(/ /g, ' ');
  if (v.endsWith('\n')) v = v.slice(0, -1);
  saved[n.dataset.key] = v;
  // garde les autres exemplaires du même texte synchronisés (changement de mode)
  persist();
});
el.book.addEventListener('paste', e => {
  const n = e.target.closest && e.target.closest('[data-key]');
  if (!n) return;
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, n.classList.contains('title') ? text.replace(/\s*\n\s*/g, ' ') : text);
});
el.reset.addEventListener('click', () => {
  if (!confirm('Remettre tous les textes d’origine ? Tes modifications seront perdues.')) return;
  saved = {};
  try { localStorage.removeItem(STORE); } catch (_) {}
  fillTexts();
  toast('Textes réinitialisés');
});

let toastTimer = 0;
function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1500);
}

/* ---------------------------------------------------
   AMBIANCE : petits cœurs qui flottent
   --------------------------------------------------- */
function initHearts() {
  const box = $('#heartsBg'), r = rng(5), cnt = window.innerWidth < 700 ? 9 : 16;
  for (let i = 0; i < cnt; i++) {
    const s = document.createElement('span');
    s.textContent = r() > .3 ? '♥' : '♡';
    s.style.left = (r() * 100) + '%';
    s.style.fontSize = (10 + r() * 22) + 'px';
    s.style.animationDuration = (14 + r() * 16) + 's';
    s.style.animationDelay = (-r() * 28) + 's';
    s.style.setProperty('--dx', ((r() - .5) * 80) + 'px');
    box.appendChild(s);
  }
}

/* ---------------------------------------------------
   DÉMARRAGE
   --------------------------------------------------- */
el.sound.setAttribute('aria-pressed', String(soundOn));
initTextures();
initHearts();

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const a = document.activeElement;
    if (a && a.isContentEditable) return;      // clavier mobile ouvert : on ne touche à rien
    layout();
  }, 120);
});
window.addEventListener('orientationchange', () => setTimeout(() => layout(), 250));
window.addEventListener('focusout', () => setTimeout(() => { const a = document.activeElement; if (!(a && a.isContentEditable)) layout(); }, 300));

(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => layout());
layout();
window.__livre = { goTo, setEditing, get pos() { return pos; }, get mode() { return mode; } };
})();
