/**
 * ==========================================================
 * PIXTREND PAGE — SELF-CONTAINED JAVASCRIPT
 * Module: /pixtrend/
 * Handles: page transitions, before/after sliders,
 *          animated counters, scroll reveal, smooth scroll.
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const pt = document.getElementById('page-transition');
    const tt = document.getElementById('transition-text');

    // Fade out loading screen
    if (pt && tt) {
        setTimeout(() => {
            tt.classList.remove('show');
            pt.classList.add('fade-out');
        }, 600);
    }

    // Internal link transitions (non-anchor, non-external)
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor && pt && tt) {
            const href = anchor.getAttribute('href');
            const target = anchor.getAttribute('target');
            if (href && !href.startsWith('#') && !href.startsWith('http') && target !== '_blank') {
                e.preventDefault();
                pt.classList.remove('fade-out');
                pt.classList.add('fade-in');
                setTimeout(() => tt.classList.add('show'), 150);
                setTimeout(() => window.location.href = href, 800);
            }
        }
    });
});

// Safari back-button cache fix
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const pt = document.getElementById('page-transition');
        const tt = document.getElementById('transition-text');
        if (pt) { pt.classList.remove('fade-in'); pt.classList.add('fade-out'); }
        if (tt) tt.classList.remove('show');
    }
});

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── ANIMATED COUNTERS ──
const animatedSet = new Set();
function runCounter(el) {
    if (animatedSet.has(el)) return;
    animatedSet.add(el);
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const isCompact = el.dataset.compact === 'true';
    const suffix = el.dataset.suffix || '';
    const dur = 2400;
    const t0 = performance.now();
    (function tick(now) {
        if (!animatedSet.has(el)) return;
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        const cur = target * ease;
        let display;
        if (isCompact && cur >= 1000) {
            display = (cur / 1000).toFixed(cur < 10000 ? 1 : 0) + 'K';
        } else if (isDecimal) {
            display = cur.toFixed(2);
        } else {
            display = Math.round(cur).toLocaleString();
        }
        el.textContent = display + suffix;
        if (p < 1) requestAnimationFrame(tick);
    })(t0);
}
function resetCounter(el) {
    animatedSet.delete(el);
    el.textContent = '0' + (el.dataset.suffix || '');
}
const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) runCounter(entry.target);
        else resetCounter(entry.target);
    });
}, { threshold: 0.1 });
document.querySelectorAll('.counter-val').forEach(el => cntObs.observe(el));

// ── MAIN BEFORE/AFTER SLIDER ──
const baSlider = document.getElementById('baSlider');
const baClip   = document.getElementById('baClipLayer');
const baHandle = document.getElementById('baHandle');
const baDiv    = document.getElementById('baDivider');
if (baSlider && baClip) {
    const upMain = (v) => {
        baClip.style.clipPath = `inset(0 0 0 ${v}%)`;
        if (baHandle) baHandle.style.left = v + '%';
        if (baDiv)    baDiv.style.left    = v + '%';
    };
    baSlider.addEventListener('input',     e => upMain(+e.target.value));
    baSlider.addEventListener('touchmove', e => upMain(+e.target.value));
    upMain(50);
}

// ── MINI BEFORE/AFTER SLIDERS ──
document.querySelectorAll('.mini-ba').forEach(w => {
    const clip   = w.querySelector('.mini-ba-clip');
    const slider = w.querySelector('.mini-ba-slider');
    const handle = w.querySelector('.mini-ba-handle');
    const div    = w.querySelector('.mini-ba-div');
    const up = (v) => {
        clip.style.clipPath = `inset(0 0 0 ${v}%)`;
        if (handle) handle.style.left = v + '%';
        if (div)    div.style.left    = v + '%';
    };
    slider.addEventListener('input',     e => up(+e.target.value));
    slider.addEventListener('touchmove', e => up(+e.target.value));
    up(50);
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});
