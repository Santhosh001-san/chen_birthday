/* =====================================================================
   script.js — Full Cinematic Birthday Card Engine
===================================================================== */

/* ─────────────────────────────────────────
   1. STAR FIELD + CANVAS
───────────────────────────────────────── */
const cvs = document.getElementById('stars');
const ctx = cvs.getContext('2d');
let W, H;
function resize() { W = cvs.width = innerWidth; H = cvs.height = innerHeight; }
resize(); addEventListener('resize', resize);

const stars = Array.from({ length: 200 }, () => ({
  x: Math.random(), y: Math.random(),
  r: .4 + Math.random() * 1.4,
  op: Math.random(), speed: .003 + Math.random() * .009,
  dir: Math.random() > .5 ? 1 : -1,
}));

const HEARTS = ['❤️','💕','🌸','✨','💫','🌟','💖','🎀','💝','🌹'];
class Heart {
  constructor(init) { this.reset(init); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 30;
    this.vy = -(0.2 + Math.random() * 0.6);
    this.vx = (Math.random() - .5) * .25;
    this.size = 10 + Math.random() * 12;
    this.op = 0; this.maxOp = .18 + Math.random() * .4;
    this.wobble = Math.random() * Math.PI * 2;
    this.em = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  }
  tick() {
    this.wobble += .014;
    this.x += this.vx + Math.sin(this.wobble) * .25;
    this.y += this.vy;
    this.op = Math.min(this.op + .008, this.maxOp);
    if (this.y < -30) this.reset();
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.op;
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(this.em, this.x, this.y);
    ctx.restore();
  }
}
const hearts = Array.from({ length: 28 }, (_, i) => new Heart(true));

/* Confetti */
const COLS = ['#f43f5e','#ec4899','#8b5cf6','#fbbf24','#34d399','#38bdf8','#c084fc','#fb7185'];
class Conf {
  constructor(x, y) {
    const a = Math.random() * Math.PI * 2, s = 6 + Math.random() * 14;
    this.x = x; this.y = y;
    this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s - 10;
    this.w = 5 + Math.random() * 8; this.h = this.w * (.3 + Math.random() * .5);
    this.rot = Math.random() * Math.PI * 2; this.rotV = (Math.random() - .5) * .22;
    this.col = COLS[Math.floor(Math.random() * COLS.length)];
    this.g = .28 + Math.random() * .18; this.drag = .987; this.op = 1;
    this.shape = Math.random() > .45 ? 'rect' : 'circle';
  }
  tick() {
    this.vy += this.g; this.vx *= this.drag;
    this.x += this.vx; this.y += this.vy; this.rot += this.rotV;
    if (this.y > H + 20) this.op = 0;
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.op; ctx.fillStyle = this.col;
    ctx.translate(this.x, this.y); ctx.rotate(this.rot);
    if (this.shape === 'rect') ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    else { ctx.beginPath(); ctx.ellipse(0, 0, this.w/2, this.h/2, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
}
const confs = [];
function fireConf(x, y, n = 220) { for (let i = 0; i < n; i++) confs.push(new Conf(x, y)); }

/* Flower Particles Emitter (For Bottom and Top Left/Right Flower, Chocolate & Gift Canons) */
const FLOWERS = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🍫', '🍬', '🍭', '🎁', '💝', '🎈', '🧸', '💖'];
class FlowerParticle {
  constructor(x, y, isLeft, isTop) {
    this.x = x;
    this.y = y;
    
    // Symmetrical eject angles for all 4 corners
    let angle;
    if (isTop) {
      // Top corners shoot downwards: Left shoots down-right, Right shoots down-left
      angle = isLeft 
        ? (Math.random() * 0.22 + 0.04) * Math.PI // 7 to 45 deg down-right
        : (Math.random() * 0.22 + 0.74) * Math.PI; // 135 to 173 deg down-left
    } else {
      // Bottom corners shoot upwards: Left shoots up-right, Right shoots up-left
      angle = isLeft 
        ? (Math.random() * 0.18 + 1.72) * Math.PI // 310 to 342 deg up-right
        : (Math.random() * 0.18 + 1.10) * Math.PI; // 198 to 230 deg up-left
    }
    
    const speed = isTop 
      ? 14 + Math.random() * 18 
      : 18 + Math.random() * 12;
      
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = 18 + Math.random() * 24;
    this.op = 1;
    this.g = 0.22 + Math.random() * 0.14; // Soft organic gravity drop
    this.drag = 0.985;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.04;
    this.em = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
    this.rot = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.16; // Fluttering spin
  }
  tick() {
    this.vy += this.g;
    this.vx *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.5; // Fluttering sway
    if (this.y > H + 40 || this.x < -40 || this.x > W + 40) {
      this.op = 0;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.op;
    ctx.font = `${this.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillText(this.em, 0, 0);
    ctx.restore();
  }
}
const flowers = [];
function fireFlowerCanons() {
  for (let i = 0; i < 10; i++) {
    // Top corners
    flowers.push(new FlowerParticle(25, 25, true, true));
    flowers.push(new FlowerParticle(W - 25, 25, false, true));
    // Bottom corners
    flowers.push(new FlowerParticle(25, H - 25, true, false));
    flowers.push(new FlowerParticle(W - 25, H - 25, false, false));
  }
}
let flowerIntervalId = null;
function startFlowerShower() {
  if (flowerIntervalId) clearInterval(flowerIntervalId);
  fireFlowerCanons();
  let count = 0;
  flowerIntervalId = setInterval(() => {
    if (count > 45) { clearInterval(flowerIntervalId); return; } // extended count for 18 seconds
    // Top corners
    flowers.push(new FlowerParticle(25, 25, true, true));
    flowers.push(new FlowerParticle(W - 25, 25, false, true));
    // Bottom corners
    flowers.push(new FlowerParticle(25, H - 25, true, false));
    flowers.push(new FlowerParticle(W - 25, H - 25, false, false));
    count++;
  }, 350); // silky-smooth, zero scroll-lag!
}

(function loop() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => {
    s.op += s.speed * s.dir;
    if (s.op > 1 || s.op < 0) s.dir *= -1;
    ctx.save(); ctx.globalAlpha = s.op * .7;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  });
  hearts.forEach(h => { h.tick(); h.draw(); });
  for (let i = confs.length - 1; i >= 0; i--) {
    confs[i].tick(); confs[i].draw();
    if (confs[i].op <= 0) confs.splice(i, 1);
  }
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].tick(); flowers[i].draw();
    if (flowers[i].op <= 0) flowers.splice(i, 1);
  }
  requestAnimationFrame(loop);
})();


/* ─────────────────────────────────────────
   2. SPLIT TEXT  (letter-by-letter GSAP)
───────────────────────────────────────── */
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  return [...text].map(ch => {
    const sp = document.createElement('span');
    sp.textContent = ch === ' ' ? '\u00A0' : ch;
    sp.style.display = 'inline-block';
    el.appendChild(sp);
    return sp;
  });
}


/* ─────────────────────────────────────────
   3. SCENE MANAGER (with Animal Transition)
───────────────────────────────────────── */
let currentScene = null;
let animalToggle = 0; // 0 for Parrot, 1 for Cat (alternates perfectly!)

function playMeowSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // Soft, warm cat tone
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.45);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.warn("AudioContext meow sound failed/blocked:", e);
  }
}

function playSquawkSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth'; // Bird chirp/squawk tone
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.linearRampToValueAtTime(1450, now + 0.08);
    osc.frequency.linearRampToValueAtTime(650, now + 0.25);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn("AudioContext squawk failed:", e);
  }
}

function showScene(id) {
  const s = document.getElementById(id);
  s.classList.add('active');
  currentScene = id;
}

function runAnimalTransition(onCoverCallback, fromBtnOrCoords) {
  try {
    const overlay = document.getElementById('animal-transition-overlay');
    const trail = overlay.querySelector('.animal-trail');
    const char = document.getElementById('animal-character');
    const catSvg = document.getElementById('cat-svg');
    const parrotSvg = document.getElementById('parrot-svg');
    const bubble = document.getElementById('animal-bubble');
    const pawTrail = document.getElementById('animal-paw-trail');

    // Alternate animal perfectly using animalToggle!
    // animalToggle = 0 for Parrot, animalToggle = 1 for Cat
    const isCat = (animalToggle === 1);
    let animalText = '';
    
    if (isCat) {
      catSvg.style.display = 'block';
      parrotSvg.style.display = 'none';
      const catMsgs = ["Pouncing! 🐱", "Let me click that! 🐾", "Boop target locked! 🎯", "Cat power! ✨"];
      animalText = catMsgs[Math.floor(Math.random() * catMsgs.length)];
      bubble.textContent = animalText;
      pawTrail.innerHTML = '<span>🐾</span><span>🐾</span><span>🐾</span>';
    } else {
      parrotSvg.style.display = 'block';
      catSvg.style.display = 'none';
      const birdMsgs = ["Target locked! 🎯", "Squawk! Clicking! 🦜", "Flying to target! 🌟", "I got this! ⚡"];
      animalText = birdMsgs[Math.floor(Math.random() * birdMsgs.length)];
      bubble.textContent = animalText;
      pawTrail.innerHTML = '<span>✨</span><span>🌟</span><span>✨</span>';
    }

    // Toggle alternating index for next button click
    animalToggle = (animalToggle + 1) % 2;

    // Calculate coordinates of the clicked button
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let clickTargetEl = null;

    if (fromBtnOrCoords) {
      if (fromBtnOrCoords.nodeType) {
        // It's a DOM element
        clickTargetEl = fromBtnOrCoords;
        const rect = clickTargetEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      } else if (typeof fromBtnOrCoords.x === 'number' && typeof fromBtnOrCoords.y === 'number') {
        // It's pre-calculated coordinates
        targetX = fromBtnOrCoords.x;
        targetY = fromBtnOrCoords.y;
        if (fromBtnOrCoords.element) {
          clickTargetEl = fromBtnOrCoords.element;
        }
      }
    }

    // Setup initial positions (fade overlay in)
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    
    // Set start position off-screen left and reset transform states
    gsap.set(trail, { xPercent: -100 });
    gsap.set(char, { 
      x: -230, 
      y: targetY - 105, 
      scale: 1, 
      rotation: 0 
    });

    // Reset body parts to neutral state
    gsap.set(parrotSvg, { rotation: 0, y: 0 });
    gsap.set(catSvg, { rotation: 0, y: 0 });
    gsap.set('.paw-front-right', { scaleY: 1, y: 0, x: 0 });

    const tl = gsap.timeline({
      onComplete() {
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }
    });

    // Step 1: Run/Fly directly to the button center coordinates
    tl.to(char, {
      x: targetX - 105,
      y: targetY - 105,
      duration: 0.65,
      ease: 'power2.out'
    });

    // Simultaneous bobbing animation during translation (avoiding coordinate conflicts)
    if (isCat) {
      tl.fromTo(catSvg, 
        { y: -6 }, 
        { y: 6, duration: 0.12, repeat: 4, yoyo: true, ease: "sine.inOut" },
        0
      );
    } else {
      tl.fromTo(parrotSvg, 
        { y: -10 }, 
        { y: 10, duration: 0.15, repeat: 3, yoyo: true, ease: "sine.inOut" },
        0
      );
    }
    
    // Step 2: Play Sound, Peck/Slap, and Confetti blast ON ARRIVAL
    tl.call(() => {
      bubble.textContent = isCat ? "BOOP! 🐾" : "PECK! 💥";
      
      // Trigger Web Audio API synthesized sound and skeletal animations
      if (isCat) {
        playMeowSound();
        // Slap button with front-right paw
        gsap.to('.paw-front-right', {
          scaleY: 1.5,
          y: 16,
          x: 4,
          transformOrigin: 'center top',
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inInOut'
        });
      } else {
        playSquawkSound();
        // Peck button with body/beak pivot
        gsap.to(parrotSvg, {
          rotation: 25,
          transformOrigin: '35% 75%',
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        });
      }

      // Confetti blast from button center
      fireConf(targetX, targetY, 150);
      
      // Simulate physical click on the button
      if (clickTargetEl) {
        gsap.timeline()
          .to(clickTargetEl, { scale: 0.88, duration: 0.08, ease: 'power1.in' })
          .to(clickTargetEl, { scale: 1.0, duration: 0.25, ease: 'elastic.out(1, 0.3)' });
      }
    });

    // Cute brief pause at target to let the user admire the click action
    tl.to(char, {
      scale: 1.35,
      rotation: isCat ? 15 : -25,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: 'back.out(2)'
    });
    
    // Step 3: Run/Fly off-screen to the right and wipe the screen
    tl.call(() => {
      bubble.textContent = isCat ? "Follow me! 🎁" : "Follow me! 🌟";
    });

    tl.to(char, {
      x: window.innerWidth + 230,
      y: window.innerHeight / 2 - 105,
      duration: 0.75,
      ease: 'power2.in'
    }, '+=0.05');

    // Slide transition trail in to cover screen completely
    tl.to(trail, {
      xPercent: 0,
      duration: 0.45,
      ease: 'power2.in'
    }, '-=0.55');

    // Peak cover: execute scene/sheet change
    tl.call(() => {
      if (onCoverCallback) onCoverCallback();
    });

    // Slide transition trail out to the right
    tl.to(trail, {
      xPercent: 100,
      duration: 0.45,
      ease: 'power2.out'
    });
  } catch (err) {
    console.error("Transition failed, running fallback recovery:", err);
    if (onCoverCallback) onCoverCallback();
  }
}

function goScene(toId, fromBtn) {
  if (currentScene === toId) return;
  const leaving  = currentScene ? document.getElementById(currentScene) : null;
  const entering = document.getElementById(toId);

  runAnimalTransition(() => {
    if (leaving) leaving.classList.remove('active');
    entering.classList.add('active');
    
    // Animate child elements in the entering scene
    const kids = entering.querySelectorAll('.card-wrap > *, .bcard__ribbon, .bcard__cake-zone, .bcard__eyebrow, .bcard__title, .bcard__sub, .bcard__body, .bcard__highlight, .bcard__emoji-row, .gb-btn-wrap, .back-pill');
    gsap.fromTo(kids, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' });
  }, fromBtn);

  currentScene = toId;
}


/* ─────────────────────────────────────────
   4. HERO ENTRANCE
───────────────────────────────────────── */
showScene('s-hero');
gsap.set('#s-hero', { opacity: 1 });

const line1Chars = splitChars(document.getElementById('word-happy'));
const line2Chars = splitChars(document.getElementById('word-name'));

gsap.timeline({ delay: .3 })
  .from('#h-eyebrow', { opacity:0, y:18, duration:.6, ease:'power3.out' })
  .from(line1Chars,   { opacity:0, y:55, rotationX:-85, duration:.6, stagger:.038, ease:'back.out(1.8)' }, '-=.2')
  .from(line2Chars,   { 
    opacity: 0, 
    scale: 1.8, 
    filter: 'blur(15px)', 
    letterSpacing: '0.8em', 
    y: -20, 
    rotationY: 90, 
    duration: 0.95, 
    stagger: 0.085, 
    ease: 'power4.out' 
  }, '-=.15')
  .from('#h-sub',     { opacity:0, y:18, duration:.6, ease:'power3.out' }, '-=.35')
  .from('#h-btn',     { opacity:0, y:18, scale:.88, duration:.65, ease:'back.out(1.5)' }, '-=.3')
  .from('.floating-tags .ft', { opacity:0, scale:0, duration:.5, stagger:.1, ease:'back.out(2)' }, '-=.35')
  .call(() => {
    // Automatically transition to the birthday card scene 3.8 seconds after everything has been beautifully revealed
    setTimeout(() => {
      const btn = document.getElementById('h-btn').querySelector('button');
      revealCard(btn);
    }, 3800);
  });

/* Cake bob */
gsap.to('#cake-em', { y:-14, rotationZ:4, duration:1.5, ease:'sine.inOut', repeat:-1, yoyo:true });


/* ─────────────────────────────────────────
   5. GRADIENT BORDER BUTTON RIPPLE
───────────────────────────────────────── */
document.querySelectorAll('.gb-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    this.style.setProperty('--rx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    this.style.setProperty('--ry', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    this.classList.add('rippling');
    setTimeout(() => this.classList.remove('rippling'), 600);
  });
});


/* ─────────────────────────────────────────
   6. MAGNETIC BUTTONS
───────────────────────────────────────── */
document.querySelectorAll('.gb-btn, .heart-btn').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const r = this.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width/2)) * .26;
    const dy = (e.clientY - (r.top  + r.height/2)) * .26;
    gsap.to(this, { x:dx, y:dy, scale:1.04, duration:.3, ease:'power2.out' });
  });
  btn.addEventListener('mouseleave', function() {
    gsap.to(this, { x:0, y:0, scale:1, duration:.65, ease:'elastic.out(1,.55)' });
  });
});


/* ─────────────────────────────────────────
   7. REVEAL CARD  (hero CTA)
───────────────────────────────────────── */
function revealCard(btn) { goScene('s-card', btn); }


/* ─────────────────────────────────────────
   8. HEART REVEAL TRANSITION → open sheet
───────────────────────────────────────── */
function heartReveal(btn) {
  /* Burst confetti from the button */
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top  + r.height / 2;
  fireConf(cx, cy, 180);

  /* GSAP cinematic pull-in of button, then run animal transition to open sheet */
  gsap.timeline()
    .to(btn, { scale: 1.15, duration: .15, ease: 'power2.out' })
    .to(btn, { scale: 0, opacity: 0, duration: .35, ease: 'back.in(2)' })
    .call(() => {
      // Pass coordinates and the element reference so the timeline targets correctly
      runAnimalTransition(() => {
        openSheet('sh-compliments');
      }, { x: cx, y: cy, element: btn });
      
      /* restore button in background */
      setTimeout(() => gsap.set(btn, { scale: 1, opacity: 1 }), 1200);
    });
}


/* ─────────────────────────────────────────
   9. 3D IMAGE TILT
───────────────────────────────────────── */
function tilt3d(e, el) {
  const r = el.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width  - .5) * 22;
  const y = ((e.clientY - r.top)  / r.height - .5) * 18;
  gsap.to(el, { rotationY:x, rotationX:-y, scale:1.06, duration:.25, ease:'power2.out', transformPerspective:500 });
}
function untilt(el) {
  gsap.to(el, { rotationY:0, rotationX:0, scale:1, duration:.7, ease:'elastic.out(1,.55)', transformPerspective:500 });
}


/* ─────────────────────────────────────────
   10. SHEETS
───────────────────────────────────────── */
function openSheet(id) {
  const bg = document.getElementById(id);
  bg.classList.add('open');

  /* GSAP stagger for items inside the sheet */
  const items = bg.querySelectorAll('.sheet > *');
  gsap.from(items, { opacity:0, y:28, duration:.55, stagger:.06, delay:.28, ease:'power3.out',
    clearProps: 'opacity,transform'
  });

  /* For movie sheet: GSAP animate the mblocks in sequence */
  if (id === 'sh-movie') {
    const mblocks = bg.querySelectorAll('.mblock');
    gsap.from(mblocks, { opacity:0, x:-30, duration:.6, stagger:.15, delay:.5, ease:'power3.out',
      clearProps: 'opacity,transform'
    });
  }
}
function closeSheet(id) { document.getElementById(id).classList.remove('open'); }
function switchSheet(a, b) {
  runAnimalTransition(() => {
    closeSheet(a);
    openSheet(b);
  });
}
function openLetterSheet(btn) {
  runAnimalTransition(() => {
    openSheet('sh-letter');
  }, btn);
}
function bgClose(e, id) { if (e.target.id === id) closeSheet(id); }


/* ─────────────────────────────────────────
   11. POETRY MODAL
───────────────────────────────────────── */
const POEMS = [
  {
    icon: '✨',
    lines: [
      'Like moonlight breaking through the city haze,',
      'You fill each room with warmth no words can hold.',
      'A presence that the heart remembers always —',
      'A flame that makes the ordinary gold.'
    ]
  },
  {
    icon: '💛',
    lines: [
      'Your smile is a thousand suns at once,',
      'It turns the grey of morning into light.',
      'The kind of joy no season can diminish —',
      'A story worth retelling every night.'
    ]
  },
  {
    icon: '🌸',
    lines: [
      'Before you came, the flowers grew by chance.',
      'Since you arrived, they bloom with purpose now.',
      'The stars above rearranged their ancient dance,',
      'And softly whispered: "to her, we take our bow."'
    ]
  },
  {
    icon: '💋',
    lines: [
      'Without a word you change the way I see —',
      'You walk with grace that every poet chases.',
      'They write of muses draped in reverie,',
      'But none compare to all your quiet graces.'
    ]
  },
  {
    icon: '❤️',
    lines: [
      'Kindness in your hands feels like first rain,',
      'The kind that ends a long and weary drought.',
      'You hold the wounded world and ease its pain,',
      'And leave no heart in darkness or in doubt.'
    ]
  }
];

function openPoetry(n) {
  const poem = POEMS[n];
  const bg   = document.getElementById('poetry-bg');
  const icon = document.getElementById('poetry-icon');
  const lines= document.getElementById('poetry-lines');

  /* Build lines */
  icon.textContent = poem.icon;
  lines.innerHTML  = poem.lines.map(l => `<span class="pline">${l}</span>`).join('');

  /* Open */
  bg.classList.add('open');

  /* GSAP pulse on icon */
  gsap.from(icon, { scale: 0, rotation: -20, duration: .6, ease: 'back.out(2)', delay: .3 });
}
function closePoetry() {
  const bg = document.getElementById('poetry-bg');
  gsap.to('#poetry-card', {
    scale: .88, opacity: 0, y: 20, duration: .35, ease: 'power2.in',
    onComplete() {
      bg.classList.remove('open');
      gsap.set('#poetry-card', { scale:1, opacity:1, y:0 });
    }
  });
}


/* ─────────────────────────────────────────
   12. VIBE PLAY
───────────────────────────────────────── */
function playVibe(el, vid) {
  const r = el.getBoundingClientRect();
  fireConf(r.left + r.width/2, r.top + r.height/2, 90);
  gsap.to(el, {
    scale:.92, duration:.1, yoyo:true, repeat:1, ease:'power2.inOut',
    onComplete() { gsap.to(el, { scale:1, duration:.5, ease:'elastic.out(1,.5)' }); }
  });
  setTimeout(() => ytOpen(vid), 400);
}


/* ─────────────────────────────────────────
   13. YOUTUBE MODAL
───────────────────────────────────────── */
const ytModal = document.getElementById('yt-modal');
const ytFrame  = document.getElementById('yt-frame');

function ytOpen(vid) {
  ytFrame.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
  ytModal.classList.add('open');
}
function ytClose() {
  gsap.to('#yt-inner', { scale:.82, duration:.3, ease:'power2.in' });
  gsap.to(ytModal, { opacity:0, duration:.4, delay:.15, ease:'power2.in',
    onComplete() {
      ytModal.classList.remove('open');
      ytFrame.src = '';
      gsap.set('#yt-inner', { scale:1 });
      gsap.set(ytModal, { opacity:'' });
    }
  });
}
function ytBgClose(e) { if (e.target === ytModal) ytClose(); }

/* ─────────────────────────────────────────
   14. VALENTINE PROPOSAL LOGIC & AUDIO SYNTHESIS
───────────────────────────────────────── */
let noClicksCount = 0;

function openValentineSheet(btn) {
  noClicksCount = 0; // Reset click count
  runAnimalTransition(() => {
    // Reset teddy state
    const tears = document.getElementById('teddy-tears');
    const mouthNormal = document.getElementById('teddy-mouth');
    const mouthSad = document.getElementById('teddy-mouth-sad');
    const bubble = document.getElementById('teddy-bubble');
    const textLog = document.getElementById('teddy-text-log');
    
    if (tears) tears.style.display = 'none';
    if (mouthNormal) mouthNormal.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'none';
    if (bubble) bubble.style.display = 'none';
    if (textLog) textLog.textContent = "Please give me your answer... 🧸💖";
    
    gsap.set('#teddy-svg', { left: '38%', x: 0, scale: 1, rotation: 0, opacity: 1 });
    gsap.set(['#teddy-arm-l', '#teddy-arm-r'], { rotation: (i) => i === 0 ? 25 : -25, y: 0 });
    gsap.set(['#teddy-leg-l', '#teddy-leg-r'], { rotation: 0 });
    
    const girlTeddy = document.getElementById('teddy-girl-svg');
    if (girlTeddy) {
      girlTeddy.style.display = 'none';
      gsap.set(girlTeddy, { opacity: 0, left: '48%', scale: 1.0, x: 0, y: 0, rotation: 0 });
    }
    
    openSheet('sh-valentine');
  }, btn);
}

function playTeddyHappy() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    [520, 680, 850].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      const tStart = now + idx * 0.08;
      const tEnd = tStart + 0.1;
      
      osc.frequency.setValueAtTime(freq, tStart);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, tEnd);
      
      gain.gain.setValueAtTime(0, tStart);
      gain.gain.linearRampToValueAtTime(0.15, tStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, tEnd);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(tStart);
      osc.stop(tEnd);
    });
  } catch (e) {
    console.warn("AudioContext happy teddy failed:", e);
  }
}

function playTeddySad() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.55);
    
    const vibrato = ctx.createOscillator();
    const vibGain = ctx.createGain();
    vibrato.frequency.value = 9; 
    vibGain.gain.value = 12; 
    
    vibrato.connect(vibGain);
    vibGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    vibrato.start(now);
    osc.start(now);
    
    vibrato.stop(now + 0.55);
    osc.stop(now + 0.55);
  } catch (e) {
    console.warn("AudioContext sad teddy failed:", e);
  }
}

let isWalking = false;
function handleValentineResponse(isYes, btn) {
  if (isWalking) return;
  
  const teddy = document.getElementById('teddy-svg');
  const tears = document.getElementById('teddy-tears');
  const mouthNormal = document.getElementById('teddy-mouth');
  const mouthSad = document.getElementById('teddy-mouth-sad');
  const bubble = document.getElementById('teddy-bubble');
  const textLog = document.getElementById('teddy-text-log');
  
  const armL = document.getElementById('teddy-arm-l');
  const armR = document.getElementById('teddy-arm-r');
  const legL = document.getElementById('teddy-leg-l');
  const legR = document.getElementById('teddy-leg-r');
  
  // Confetti blast from button
  const r = btn.getBoundingClientRect();
  fireConf(r.left + r.width / 2, r.top + r.height / 2, 80);
  
  if (isYes) {
    isWalking = true;
    noClicksCount = 0; // Reset
    
    // Play happy audio + start the 35s looping romantic love theme melody!
    playTeddyHappy();
    setTimeout(() => playLoveMelody(), 600);
    
    // Set expressions
    if (tears) tears.style.display = 'none';
    if (mouthNormal) mouthNormal.style.display = 'block';
    if (mouthSad) mouthSad.style.display = 'none';
    
    // Fade in and show the pink Girly Teddy Bear!
    const girlTeddy = document.getElementById('teddy-girl-svg');
    if (girlTeddy) {
      girlTeddy.style.display = 'block';
      gsap.to(girlTeddy, { opacity: 1, duration: 0.5 });
    }
    
    // Position both teddies side-by-side in the center of container
    gsap.to(teddy, { left: '32%', scale: 1.0, x: 0, y: 0, duration: 0.5 });
    if (girlTeddy) {
      gsap.to(girlTeddy, { left: '48%', scale: 1.0, x: 0, y: 0, duration: 0.5 });
    }
    
    // Speech bubble
    if (bubble) {
      bubble.textContent = "We love each other! Let's dance! 💕";
      bubble.style.display = 'block';
    }
    
    // Typewriter log quote
    if (textLog) {
      textLog.innerHTML = `<span style="color: #fda4af; font-weight: bold;">"I love you too, my life! Please stay in my life forever. In our future, we will face both good and bad situations together, but you must stay with me forever. Be my nice girl forever..."</span> 🧸💖`;
    }
    
    // 35-second sweet hugging and dancing animation (Swaying & leg bobbing!)
    const danceTimeline = gsap.timeline({ repeat: 25, yoyo: true });
    danceTimeline
      .to(teddy, { rotation: 12, y: -6, duration: 0.7, ease: 'sine.inOut' }, 0)
      .to(girlTeddy, { rotation: -12, y: -6, duration: 0.7, ease: 'sine.inOut' }, 0)
      .to([armL, armR], { rotation: (i) => i === 0 ? 45 : -45, scale: 1.1, duration: 0.35 }, 0)
      .to(['#teddy-girl-arm-l', '#teddy-girl-arm-r'], { rotation: (i) => i === 0 ? 45 : -45, scale: 1.1, duration: 0.35 }, 0);
      
    const legsTimeline = gsap.timeline({ repeat: 50, yoyo: true });
    legsTimeline
      .to([legL, '#teddy-girl-leg-l'], { rotation: 15, transformOrigin: 'center top', duration: 0.35 }, 0)
      .to([legR, '#teddy-girl-leg-r'], { rotation: -15, transformOrigin: 'center top', duration: 0.35 }, 0);
         
    // Walk off-screen together after exactly 35 seconds
    setTimeout(() => {
      // Stop dancing sways
      danceTimeline.kill();
      legsTimeline.kill();
      
      if (bubble) {
        bubble.textContent = "Stay together forever! 💖";
      }
      
      // Animate feet walking quickly
      gsap.timeline()
        .to([legL, '#teddy-girl-leg-l'], { rotation: 22, transformOrigin: 'center top', duration: 0.12, repeat: 16, yoyo: true }, 0)
        .to([legR, '#teddy-girl-leg-r'], { rotation: -22, transformOrigin: 'center top', duration: 0.12, repeat: 16, yoyo: true }, 0);
        
      // Hold hands & walk off screen together to the right
      gsap.to([teddy, girlTeddy], {
        x: window.innerWidth + 250,
        duration: 2.5,
        ease: 'power2.in',
        onComplete() {
          closeSheet('sh-valentine');
          isWalking = false;
          // Hide and reset girl teddy
          if (girlTeddy) {
            girlTeddy.style.display = 'none';
            gsap.set(girlTeddy, { opacity: 0 });
          }
        }
      });
    }, 12000); // 12 seconds of romantic couple dancing!
    
  } else {
    noClicksCount++; // Increment count of NO clicks
    
    if (noClicksCount < 20) {
      // Play sad cry sound
      playTeddySad();
      
      // Set expressions
      if (tears) tears.style.display = 'block';
      if (mouthNormal) mouthNormal.style.display = 'none';
      if (mouthSad) mouthSad.style.display = 'block';
      
      // Grow the teddy bear progressively on every click!
      gsap.to(teddy, {
        scale: 1 + noClicksCount * 0.05,
        duration: 0.25,
        ease: 'power2.out'
      });
      
      // Progressive desperate speech messages!
      if (bubble) {
        if (noClicksCount <= 5) {
          bubble.textContent = "Don't touch this button! 🥺💔";
        } else if (noClicksCount <= 10) {
          bubble.textContent = "Please! Stop saying NO! 😭";
        } else if (noClicksCount <= 15) {
          bubble.textContent = "I'm getting sadder and bigger! 🧸💥";
        } else {
          bubble.textContent = "DON'T CLICK IT! 🥺💢";
        }
        bubble.style.display = 'block';
      }
      
      // Sad rejection warning text
      if (textLog) {
        if (noClicksCount <= 5) {
          textLog.innerHTML = `<span style="color: #fb7185; font-weight: bold;">"Oh no! Please don't reject me... 😭 Go back and click YES to love me! Please stay with my life! 🥺💔"</span>`;
        } else if (noClicksCount <= 10) {
          textLog.innerHTML = `<span style="color: #fb7185; font-weight: bold;">"Why are you doing this? 😭 My heart is breaking! Look at how big I am growing from sadness..."</span>`;
        } else if (noClicksCount <= 15) {
          textLog.innerHTML = `<span style="color: #fb7185; font-weight: bold;">"Warning: Teddy sadness overload! 🧸🚨 Please click YES, I don't want to get any bigger!"</span>`;
        } else {
          textLog.innerHTML = `<span style="color: #fb7185; font-weight: bold;">"This is your last warning! 🥺 I am massive now! Click YES to save me!"</span>`;
        }
      }
      
      // Crying shiver & arms covering face pose
      gsap.timeline()
        .to(armL, { rotation: 100, y: -8, transformOrigin: 'center top', duration: 0.3 }, 0)
        .to(armR, { rotation: -100, y: -8, transformOrigin: 'center top', duration: 0.3 }, 0)
        .to(teddy, { x: '+=2.5', y: '+=1.5', duration: 0.05, repeat: 18, yoyo: true, ease: 'power1.inOut' }, 0);
        
    } else {
      // The 20th and final click!
      isWalking = true;
      
      // Play sad sound
      playTeddySad();
      
      // Set speech bubble
      if (bubble) {
        bubble.textContent = "Touch YES! Don't say NO! 🧸😡💖";
        bubble.style.display = 'block';
      }
      
      if (textLog) {
        textLog.innerHTML = `<span style="color: #fda4af; font-weight: bold;">"Aww, you clicked NO 20 times! 😭 Touch YES, don't say NO to my life! I will go now..."</span>`;
      }
      
      // Animate legs walking slowly
      gsap.timeline()
        .to(legL, { rotation: 18, transformOrigin: 'center top', duration: 0.2, repeat: 18, yoyo: true }, 0)
        .to(legR, { rotation: -18, transformOrigin: 'center top', duration: 0.2, repeat: 18, yoyo: true }, 0);
        
      // Slowly walk away to the right and close sheet
      gsap.to(teddy, {
        x: window.innerWidth + 250,
        scale: 1.0, // Shrink back to normal to fit the screen as it exits
        duration: 3.5, // Slow walk away!
        ease: 'power1.inOut',
        onComplete() {
          closeSheet('sh-valentine');
          noClicksCount = 0; // Reset
          isWalking = false;
        }
      });
    }
  }
}

/* ─────────────────────────────────────────
   15. ROMANTIC LOVE THEME MELODY (AUDIO SYNTHESIS)
───────────────────────────────────────── */
function playLoveMelody() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [196.00, 246.94, 293.66, 392.00], // G Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23]  // F Major
    ];
    let noteIdx = 0;
    const interval = 0.22;
    const intervalId = setInterval(() => {
      if (ctx.state === 'closed') { clearInterval(intervalId); return; }
      const chordIdx = Math.floor(noteIdx / 4) % chords.length;
      const pitchIdx = noteIdx % 4;
      const baseFreq = chords[chordIdx][pitchIdx];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 4, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.7);
      noteIdx++;
    }, interval * 1000);
    setTimeout(() => { clearInterval(intervalId); ctx.close(); }, 12000);
  } catch (e) { console.warn("Love melody failed:", e); }
}

/* ─────────────────────────────────────────
   16. MOVIE CLICK ANIMATION, DETAILS POPUP & SOUND
───────────────────────────────────────── */
const MOVIE_DB = {
  karuppu: {
    title: "Karuppu", year: "2026", genre: "Action / Thriller", emoji: "🎬🔥",
    cast: "Suriya, Trisha Krishnan, RJ Balaji",
    outline: "A high-octane modern action thriller currently running in theatres. A mysterious protagonist fights against systemic corruption in a dark, atmospheric battle for justice.",
    poster: "https://images.weserv.nl/?url=https://upload.wikimedia.org/wikipedia/en/a/a0/Karuppu_film_poster.jpg"
  },
  leo: {
    title: "Leo", year: "2023", genre: "Action / Thriller", emoji: "⚔️💥",
    cast: "Vijay, Trisha Krishnan, Sanjay Dutt",
    outline: "A mild-mannered cafe owner becomes the target of a dangerous drug cartel that claims he is actually a legendary former gang leader, forcing him to unleash his hidden, lethal past.",
    poster: "Leo_(2023_Indian_film).jpg"
  },
  ponniyin_selvan: {
    title: "Ponniyin Selvan: I & II", year: "2022-2023", genre: "Historical Epic", emoji: "👑🛡️",
    cast: "Vikram, Aishwarya Rai, Jayam Ravi, Karthi, Trisha",
    outline: "A magnificent adaptation of the classic novel depicting the early life and political conspiracies surrounding Prince Arulmozhi Varman as he rises to become the great Chola Emperor.",
    poster: "ponniyin selvan 1&2.jpeg"
  },
  vikram: {
    title: "Vikram", year: "2022", genre: "Action / Thriller", emoji: "🦅🔫",
    cast: "Kamal Haasan, Vijay Sethupathi, Fahadh Faasil",
    outline: "A black-ops agent investigates a series of murders committed by masked vigilantes, only to discover a massive drug syndicate and a legendary retired commander seeking personal vengeance.",
    poster: "vikram.jpg"
  },
  jai_bhim: {
    title: "Jai Bhim", year: "2021", genre: "Legal / Social Drama", emoji: "⚖️✊",
    cast: "Suriya, Lijomol Jose, K. Manikandan",
    outline: "A courageous human rights lawyer fights a legal battle in the high court for a poor tribal woman whose husband went missing in police custody after being falsely accused of theft.",
    poster: "jai_bhim.jpg"
  },
  soorarai_pottru: {
    title: "Soorarai Pottru", year: "2020", genre: "Drama / Biography", emoji: "✈️🏆",
    cast: "Suriya, Aparna Balamurali, Urvashi",
    outline: "Inspired by true events, a visionary former air force captain overcomes massive bureaucratic obstacles and corporate sabotage to launch India's first low-cost commercial airline.",
    poster: "Soorarai Pottru.jpg"
  },
  asuran: {
    title: "Asuran", year: "2019", genre: "Action / Drama", emoji: "🌾💥",
    cast: "Dhanush, Manju Warrier, Ken Karunas",
    outline: "A peaceful father is forced to pick up weapons and run into the wilderness to shield his young son from a vengeful, wealthy landlord after a tragic family conflict erupts.",
    poster: "asuran.jpg"
  },
  movies_96: {
    title: "96", year: "2018", genre: "Romance / Nostalgia", emoji: "💛📸",
    cast: "Vijay Sethupathi, Trisha Krishnan",
    outline: "Two high school sweethearts meet after 22 years at a school reunion, spending a bittersweet night walking through the city recalling their pure, unresolved first love.",
    poster: "96.jpeg"
  },
  ratsasan: {
    title: "Ratchasan", year: "2018", genre: "Psychological Thriller", emoji: "🕵️🧸",
    cast: "Vishnu Vishal, Amala Paul, Saravanan",
    outline: "An aspiring filmmaker-turned-police officer utilizes his extensive research on serial killers to track down a mysterious psychopath targeting schoolgirls in a race against time.",
    poster: "ratsasan.jpg"
  },
  mersal: {
    title: "Mersal", year: "2017", genre: "Action / Social Masala", emoji: "🎩⚡",
    cast: "Vijay, S. J. Suryah, Samantha, Kajal Aggarwal, Nithya Menen",
    outline: "A skilled magician and a dedicated doctor—who are estranged twin brothers—join forces to expose corruption, medical malpractice, and extortion in the private healthcare sector.",
    poster: "Mersal.jpeg"
  },
  vikram_vedha: {
    title: "Vikram Vedha", year: "2017", genre: "Neo-Noir Thriller", emoji: "☯️⚔️",
    cast: "Madhavan, Vijay Sethupathi, Shraddha Srinath",
    outline: "An upright police officer engages in a tense mind game with a notorious gangster who surrenders voluntarily and narrates three stories that challenge the boundary of good and evil.",
    poster: "Vikram Vedha.jpeg"
  },
  theri: {
    title: "Theri", year: "2016", genre: "Action / Family Drama", emoji: "👮🏽💫",
    cast: "Vijay, Samantha Ruth Prabhu, Amy Jackson",
    outline: "An honest former police officer goes into hiding under a false identity to protect his beloved daughter from a corrupt politician who previously destroyed his entire family.",
    poster: "Theri.jpeg"
  },
  thani_oruvan: {
    title: "Thani Oruvan", year: "2015", genre: "Action / Mind Game Thriller", emoji: "🧠🚨",
    cast: "Jayam Ravi, Arvind Swamy, Nayanthara",
    outline: "An ambitious police officer decides to target a brilliant but ruthless corporate scientist who operates behind the scenes as the ultimate mastermind of pharmaceutical crime.",
    poster: "Thani Oruvan.jpeg"
  },
  kaththi: {
    title: "Kaththi", year: "2014", genre: "Action / Social Drama", emoji: "💡🌾",
    cast: "Vijay, Samantha Ruth Prabhu, Neil Nitin Mukesh",
    outline: "A clever fugitive thief gets mistaken for a noble social activist who is fighting to save his dry village lands from an aggressive multi-national corporation seeking groundwater.",
    poster: "Kaththi.jpeg"
  },
  soodhu_kavvum: {
    title: "Soodhu Kavvum", year: "2013", genre: "Black Comedy / Crime", emoji: "🍍💵",
    cast: "Vijay Sethupathi, Sanchita Shetty, Bobby Simha",
    outline: "A low-stakes kidnapper who operates with five strict safety rules gets entangled in a high-profile political abduction scheme that goes hilariously and chaoticly wrong.",
    poster: "Soothu Kavvum.jpeg"
  },
  thuppakki: {
    title: "Thuppakki", year: "2012", genre: "Action / Military Thriller", emoji: "🔫💣",
    cast: "Vijay, Kajal Aggarwal, Vidyut Jammwal",
    outline: "An intelligence officer from the Indian Army visits Mumbai on vacation, only to uncover and neutralize a network of sleeper cells planning multiple coordinated bomb blasts.",
    poster: "Thuppaki.jpeg"
  },
  "7_aum_arivu": {
    title: "7 Aum Arivu", year: "2011", genre: "Sci-Fi / Martial Arts", emoji: "🧬☯️",
    cast: "Suriya, Shruti Haasan, Johnny Tri Nguyen",
    outline: "A genetic engineering student tries to revive the extraordinary medical and martial arts skills of Bodhidharma through his modern-day descendant to save India from a bio-warfare threat.",
    poster: "7 Am Arivu.jpeg"
  },
  mankatha: {
    title: "Mankatha", year: "2011", genre: "Action / Heist Thriller", emoji: "💵🕶️",
    cast: "Ajith Kumar, Arjun Sarja, Trisha Krishnan",
    outline: "A suspended, corrupt police officer joins a gang of young thieves planning to hijack 500 million rupees of cricket gambling money, leading to backstabbings and chases.",
    poster: "Mankatha.jpeg"
  },
  aayirathil_oruvan: {
    title: "Aayirathil Oruvan", year: "2010", genre: "Adventure / Fantasy", emoji: "🏺👑",
    cast: "Karthi, Reemma Sen, Andrea Jeremiah",
    outline: "An archaeologist led by a government officer embarks on a dangerous expedition to find the lost Chola dynasty prince, uncovering ancient traps and tribal mysteries.",
    poster: "Aayirathil Oruvan.jpeg"
  },
  enthiran: {
    title: "Enthiran", year: "2010", genre: "Sci-Fi / Action", emoji: "🤖⚡",
    cast: "Rajinikanth, Aishwarya Rai Bachchan, Danny Denzongpa",
    outline: "A brilliant scientist creates a sophisticated humanoid robot that gets programmed with human emotions, falling in love with the creator's girlfriend and turning destructive.",
    poster: "Enthiran.jpeg"
  },
  vtv: {
    title: "Vinnaithaandi Varuvaayaa", year: "2010", genre: "Classic Romance", emoji: "💙🌧️",
    cast: "Silambarasan, Trisha Krishnan",
    outline: "An aspiring filmmaker falls deeply in love with a noble Christian girl from a traditional family, leading to an emotional and turbulent journey of love and self-realization.",
    poster: "Vinnaithaandi Varuvaaya.jpeg"
  },
  ayan: {
    title: "Ayan", year: "2009", genre: "Action / Adventure Thriller", emoji: "💎⚡",
    cast: "Suriya, Tamannaah Bhatia, Prabhu",
    outline: "A brilliant and daring customs smuggler battles an old rival while attempting to quit the trade and walk a clean path for the sake of his mother and beloved sister.",
    poster: "Ayan.jpeg"
  },
  sivaji: {
    title: "Sivaji: The Boss", year: "2007", genre: "Action / Social Masala", emoji: "🪙🦁",
    cast: "Rajinikanth, Shriya Saran, Suman",
    outline: "A wealthy software engineer returns to India to offer free education and healthcare, but when corrupt politicians bankrupt him, he fights back using black money.",
    poster: "Sivaji the boss.jpeg"
  },
  ghilli: {
    title: "Ghilli", year: "2004", genre: "Sports / Romance / Action", emoji: "🏆🏆",
    cast: "Vijay, Trisha Krishnan, Prakash Raj",
    outline: "A talented Kabaddi player travels to Madurai for a match but ends up rescuing a young girl from a ruthless local lord who is forcing her into a marriage.",
    poster: "Ghilli.jpg"
  },
  anniyan: {
    title: "Anniyan", year: "2005", genre: "Psychological Thriller / Action", emoji: "🎭⚡",
    cast: "Vikram, Sadha, Prakash Raj, Vivek",
    outline: "An honest consumer protection lawyer suffering from multiple personality disorder transforms into a stylish romantic fashion model and a lethal vigilante who punishes corrupt individuals based on the Garuda Puranam.",
    poster: "Anniyan.jpeg"
  },
  alaipayuthey: {
    title: "Alaipayuthey", year: "2000", genre: "Romantic / Family Drama", emoji: "💖🌸",
    cast: "Madhavan, Shalini, Swarnamalya",
    outline: "A young couple elopes and marries in secret against their families' wishes, only to find that the realities and pressures of marriage are far more difficult than courtship.",
    poster: "Alaipayuthey.jpeg"
  }
};

const MOVIE_POSTER_FALLBACKS = {
  leo: 'Leo_(2023_Indian_film).jpg',
  ponniyin_selvan: 'ponniyin selvan 1&2.jpeg',
  vikram: 'vikram.jpg',
  jai_bhim: 'jai_bhim.jpg',
  soorarai_pottru: 'Soorarai Pottru.jpg',
  asuran: 'asuran.jpg',
  movies_96: '96.jpeg',
  ratsasan: 'ratsasan.jpg',
  mersal: 'Mersal.jpeg',
  vikram_vedha: 'Vikram Vedha.jpeg',
  theri: 'Theri.jpeg',
  thani_oruvan: 'Thani Oruvan.jpeg',
  kaththi: 'Kaththi.jpeg',
  soodhu_kavvum: 'Soothu Kavvum.jpeg',
  thuppakki: 'Thuppaki.jpeg',
  ghilli: 'Ghilli.jpg',
  "7_aum_arivu": '7 Am Arivu.jpeg',
  mankatha: 'Mankatha.jpeg',
  aayirathil_oruvan: 'Aayirathil Oruvan.jpeg',
  enthiran: 'Enthiran.jpeg',
  vtv: 'Vinnaithaandi Varuvaaya.jpeg',
  ayan: 'Ayan.jpeg',
  sivaji: 'Sivaji the boss.jpeg',
  anniyan: 'Anniyan.jpeg',
  alaipayuthey: 'Alaipayuthey.jpeg'
};

function populateMovieCardPosters() {
  document.querySelectorAll('.movie-card').forEach(card => {
    const onclickAttr = card.getAttribute('onclick') || '';
    const match = onclickAttr.match(/playMovieAnimation\(['"](.+?)['"]\)/);
    if (!match) return;
    const key = match[1];
    const movie = MOVIE_DB[key];
    if (!movie?.poster) return;
    const thumb = document.createElement('img');
    thumb.className = 'movie-thumb';
    thumb.src = movie.poster;
    thumb.alt = `${movie.title} poster`;
    thumb.loading = 'lazy';
    thumb.dataset.fallbackTried = 'false';
    thumb.onerror = () => {
      if (thumb.dataset.fallbackTried === 'true') {
        thumb.style.display = 'none';
        return;
      }
      thumb.dataset.fallbackTried = 'true';
      const fallback = MOVIE_POSTER_FALLBACKS[key];
      if (fallback) {
        thumb.src = fallback;
      } else {
        thumb.style.display = 'none';
      }
    };
    card.insertAdjacentElement('afterbegin', thumb);
  });
}

window.addEventListener('DOMContentLoaded', populateMovieCardPosters);

function playClapSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    noise.connect(noiseGain);
    
    gain.connect(ctx.destination);
    noiseGain.connect(ctx.destination);
    
    osc.start(now);
    noise.start(now);
    
    osc.stop(now + 0.12);
    noise.stop(now + 0.12);
  } catch (e) {
    console.warn("Clap audio failed:", e);
  }
}

function playMovieAnimation(key) {
  try {
    const movie = MOVIE_DB[key];
    if (!movie) return;
    
    const overlay = document.getElementById('movie-anim-overlay');
    const wrap = document.getElementById('clapperboard-wrap');
    const cTop = document.getElementById('clapper-top');
    const dBox = document.getElementById('movie-detail-box');
    
    const tTitle = dBox.querySelector('#anim-movie-title');
    const tMeta = dBox.querySelector('#anim-movie-meta');
    const tPoster = dBox.querySelector('#detail-movie-poster');
    const tCast = dBox.querySelector('#anim-movie-cast');
    const tOutline = dBox.querySelector('#detail-movie-outline');
    
    tTitle.textContent = movie.title;
    tMeta.textContent = `${movie.year} • ${movie.genre.toUpperCase()} ${movie.emoji}`;
    tPoster.src = movie.poster;
    if (tCast) {
      tCast.textContent = movie.cast || "N/A";
    }
    tOutline.textContent = movie.outline;
    
    overlay.style.display = 'flex';
    overlay.style.pointerEvents = 'all';
    
    dBox.style.display = 'none';
    dBox.style.opacity = '0';
    dBox.style.transform = 'scale(0.85)';
    
    gsap.set(overlay, { opacity: 0 });
    gsap.set(wrap, { scale: 0.5, opacity: 0, y: 0, rotation: -15 });
    gsap.set(cTop, { rotation: -32 });
    
    const tl = gsap.timeline();
    
    tl.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0);
    tl.to(wrap, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.5)' }, 0.15);
    
    tl.to(cTop, {
      rotation: 0,
      duration: 0.08,
      ease: 'power2.in',
      onStart() {
        playClapSound();
      }
    }, 0.55);
    
    tl.call(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      fireConf(cx, cy, 70);
    }, null, 0.55);
    
    tl.call(() => {
      dBox.style.display = 'block';
      gsap.timeline()
        .to(wrap.querySelector('svg'), { scale: 0.65, duration: 0.4, ease: 'power2.inOut' })
        .to(dBox, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, 0.1);
    }, null, 0.7);
    
  } catch (err) {
    console.error("Movie animation failed:", err);
  }
}

function closeMovieAnimation() {
  try {
    const overlay = document.getElementById('movie-anim-overlay');
    const wrap = document.getElementById('clapperboard-wrap');
    
    gsap.timeline({
      onComplete() {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
      }
    })
      .to(wrap, { scale: 0.5, opacity: 0, y: 50, duration: 0.35, ease: 'power2.in' })
      .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
  } catch (err) {
    console.error("Close movie animation failed:", err);
  }
}

/* ─────────────────────────────────────────
   17. FULL SCREEN LIGHTBOX CONTROLS
   ───────────────────────────────────────── */
function openLightbox(src) {
  try {
    const lb = document.getElementById('poster-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.src = src;
    lb.style.display = 'flex';
    setTimeout(() => {
      lb.style.opacity = '1';
      lb.style.pointerEvents = 'all';
      img.style.transform = 'scale(1)';
    }, 15);
  } catch (e) {
    console.error("Failed to open lightbox:", e);
  }
}

function closeLightbox() {
  try {
    const lb = document.getElementById('poster-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lb || !img) return;
    img.style.transform = 'scale(0.9)';
    lb.style.opacity = '0';
    lb.style.pointerEvents = 'none';
    setTimeout(() => {
      lb.style.display = 'none';
    }, 400);
  } catch (e) {
    console.error("Failed to close lightbox:", e);
  }
}

let profileLightboxTimer = null;
let isBirthdayRevealed = false;

function openProfileLightbox() {
  try {
    const lb = document.getElementById('profile-lightbox');
    const img = document.getElementById('profile-lightbox-img');
    const txt = document.getElementById('lightbox-birthday-text');
    if (!lb || !img) return;
    
    // Bring canvas to the absolute front so flower/chocolate/gift particles render inside the lightbox!
    const canvas = document.getElementById('stars');
    if (canvas) canvas.style.zIndex = '31000';
    
    img.src = "chen_profile.jpg";
    
    isBirthdayRevealed = false;
    if (txt) {
      gsap.set(txt, { opacity: 0, y: 30, scale: 0.85 });
    }
    
    lb.style.display = 'flex';
    
    setTimeout(() => {
      lb.style.opacity = '1';
      lb.style.pointerEvents = 'all';
      img.parentNode.style.transform = 'scale(1)';
      
      // Automatically trigger the beautiful reveal and all 4-corner confetti canons immediately on open!
      triggerProfileBirthdayReveal();
    }, 150);
  } catch (e) {
    console.error("openProfileLightbox failed:", e);
  }
}

function triggerProfileBirthdayReveal(event) {
  if (event) event.stopPropagation();
  
  if (isBirthdayRevealed) return;
  isBirthdayRevealed = true;
  
  const txt = document.getElementById('lightbox-birthday-text');
  const img = document.getElementById('profile-lightbox-img');
  
  if (txt) {
    gsap.timeline()
      .to(txt, { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: 'back.out(1.7)' 
      })
      .to(txt, {
        textShadow: "0 0 35px rgba(244, 63, 94, 0.95), 0 0 15px rgba(192, 132, 252, 0.8)",
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }, "-=0.2");
  }
  
  if (img) {
    gsap.timeline()
      .to(img, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      .to(img, { scale: 1.0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      .to(img, {
        rotationZ: 1.2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }, "+=0.1");
  }
  
  startFlowerShower();
  
  if (profileLightboxTimer) clearTimeout(profileLightboxTimer);
  profileLightboxTimer = setTimeout(() => {
    closeProfileLightbox();
  }, 18000);
}

function closeProfileLightbox() {
  try {
    const lb = document.getElementById('profile-lightbox');
    const img = document.getElementById('profile-lightbox-img');
    const txt = document.getElementById('lightbox-birthday-text');
    if (!lb || !img) return;
    
    if (flowerIntervalId) clearInterval(flowerIntervalId);
    if (profileLightboxTimer) clearTimeout(profileLightboxTimer);
    
    // Reset stars canvas z-index back to standard background position
    const canvas = document.getElementById('stars');
    if (canvas) canvas.style.zIndex = '0';
    
    img.parentNode.style.transform = 'scale(0.9)';
    if (txt) {
      gsap.to(txt, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' });
    }
    
    lb.style.opacity = '0';
    lb.style.pointerEvents = 'none';
    
    setTimeout(() => {
      lb.style.display = 'none';
      gsap.set(img, { rotationZ: 0, scale: 1 });
    }, 500);
  } catch (e) {
    console.error("closeProfileLightbox failed:", e);
  }
}

