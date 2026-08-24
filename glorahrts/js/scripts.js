const nav = document.getElementById('siteNav');
const mobileMenu = document.getElementById('mobileMenu');
const openBtn = document.getElementById('mobileMenuButton');
const closeBtn = document.getElementById('closeMobileMenu');

function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    openBtn.setAttribute('aria-expanded', String(open));
}

openBtn.addEventListener('click', () => setMenu(true));
closeBtn.addEventListener('click', () => setMenu(false));

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) setMenu(false);
});

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('appear'));
} else {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
}

document.getElementById('year').textContent = new Date().getFullYear();
