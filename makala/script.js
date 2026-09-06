/**
 * ==========================================================
 * MAKALA (BLOG) — SELF-CONTAINED JAVASCRIPT
 * ==========================================================
 * Shared by the listing page (/makala/) and every article
 * folder (/makala/<slug>/). Keep this file dependency-free:
 * the blog is 100% static and must work on GitHub Pages.
 * ==========================================================
 */

/* ── VIEW COUNTER CONFIG ──
   Set COUNTER_API to your Cloudflare Worker URL once deployed.
   Leave empty to disable view counts (eye icons stay, show "—").
   Example: 'https://counter.watulab.com' */
const COUNTER_API = '';

function formatViewCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
}

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. PAGE TRANSITION BOOT ──
       Fades out the black overlay so the page appears smoothly,
       matching the rest of watulab.com. */
    const pageTransition = document.getElementById('page-transition');
    const transitionText = document.getElementById('transition-text');
    if (pageTransition && transitionText) {
        setTimeout(() => {
            transitionText.classList.remove('show');
            pageTransition.classList.add('fade-out');
        }, 400);
    }

    /* ── 1b. THEME TOGGLE ── */
    initThemeToggle();

    /* ── 2. SMOOTH INTERNAL NAVIGATION ──
       Clicking a same-site link fades to black first, then navigates.
       Mirrors the behaviour of the homepage script.js. */
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor || !pageTransition || !transitionText) return;

        const targetUrl = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');
        if (!targetUrl || targetUrl.startsWith('#') || targetUrl.startsWith('http') ||
            targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:') || target === '_blank') return;

        e.preventDefault();
        pageTransition.classList.remove('fade-out');
        pageTransition.classList.add('fade-in');
        setTimeout(() => transitionText.classList.add('show'), 150);
        setTimeout(() => window.location.href = targetUrl, 800);
    });

    /* ── 3. SCROLL REVEAL ──
       Elements with .reveal fade in when they enter the viewport. */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ── 4. LISTING PAGE: SEARCH + CATEGORY FILTERS ──
       Both controls combine: the active chip narrows by category,
       the search box narrows by title + excerpt text. */
    const postGrid = document.getElementById('post-grid');
    if (postGrid) {
        const chips = document.querySelectorAll('.chip');
        const searchInput = document.getElementById('post-search');
        const emptyState = document.getElementById('empty-state');
        const cards = Array.from(postGrid.querySelectorAll('.post-card'));
        let activeCategory = 'all';

        function applyFilters() {
            const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach(card => {
                const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
                const haystack = card.dataset.searchtext || '';
                const matchesQuery = query === '' || haystack.includes(query);
                const show = matchesCategory && matchesQuery;

                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            if (emptyState) emptyState.classList.toggle('show', visibleCount === 0);
        }

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeCategory = chip.dataset.category;
                applyFilters();
            });
        });

        if (searchInput) searchInput.addEventListener('input', applyFilters);
    }

    /* ── 5. ARTICLE PAGES: READING PROGRESS BAR ── */
    const articleBody = document.getElementById('article-body');
    const progressBar = document.getElementById('reading-progress');
    if (articleBody && progressBar) {
        window.addEventListener('scroll', () => {
            const rect = articleBody.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
            const percent = total > 0 ? (scrolled / total) * 100 : 100;
            progressBar.style.width = percent + '%';
        }, { passive: true });
    }

    /* ── 6. ARTICLE PAGES: COPY LINK BUTTON ── */
    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const label = copyBtn.querySelector('.copy-label');
            try {
                await navigator.clipboard.writeText(window.location.href);
                if (label) {
                    const original = label.textContent;
                    label.textContent = 'Imenakiliwa!';
                    setTimeout(() => { label.textContent = original; }, 2000);
                }
            } catch (err) {
                /* Clipboard blocked — silently ignore, sharing still works via buttons */
            }
        });
    }

    /* ── 7. VIEW COUNTS ──
       Article pages: increment + display.
       Listing page: batch-fetch counts for all cards (read-only). */
    if (COUNTER_API) {
        if (articleBody) {
            var slug = window.location.pathname;
            fetch(COUNTER_API + '/hit?slug=' + encodeURIComponent(slug))
                .then(function(r) { return r.ok ? r.json() : null; })
                .then(function(data) {
                    if (!data) return;
                    document.querySelectorAll('[data-pageviews-count]').forEach(function(el) {
                        el.textContent = formatViewCount(data.count);
                    });
                })
                .catch(function() {});
        } else if (postGrid) {
            var cards = postGrid.querySelectorAll('.post-card');
            var slugs = Array.from(cards).map(function(c) {
                var href = c.getAttribute('href') || '';
                return href;
            }).filter(Boolean);
            if (slugs.length) {
                fetch(COUNTER_API + '/counts?slugs=' + encodeURIComponent(slugs.join(',')))
                    .then(function(r) { return r.ok ? r.json() : null; })
                    .then(function(data) {
                        if (!data) return;
                        cards.forEach(function(card) {
                            var s = card.getAttribute('href') || '';
                            var el = card.querySelector('[data-pageviews-count]');
                            if (el && data[s]) el.textContent = formatViewCount(data[s]);
                        });
                    })
                    .catch(function() {});
            }
        }
    }
});

/* Safari back-button cache fix (same as the homepage) */
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const pt = document.getElementById('page-transition');
        const tt = document.getElementById('transition-text');
        if (pt) { pt.classList.remove('fade-in'); pt.classList.add('fade-out'); }
        if (tt) tt.classList.remove('show');
    }
});

/* ==========================================================
   THEME TOGGLE LOGIC
   ========================================================== */
function initThemeToggle() {
    const root = document.documentElement;
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'light' ? '#f8f9fa' : '#050505');
        }
    }

    function getTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function toggleTheme() {
        const next = getTheme() === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try {
            localStorage.setItem('watulab-theme', next);
        } catch (e) {
            console.warn('Failed to save theme to localStorage.', e);
        }
    }

    // Bind click events on all theme toggles
    document.querySelectorAll('#themeToggle, #themeToggleMobile, .theme-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTheme();
        });
    });

    // Multi-tab synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === 'watulab-theme' && e.newValue) {
            applyTheme(e.newValue);
        }
    });
}
