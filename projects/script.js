/**
 * ==========================================================
 * PROJECTS PAGE — SELF-CONTAINED JAVASCRIPT
 * Module: /projects/
 * ==========================================================
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

document.addEventListener('DOMContentLoaded', () => {
    const pageTransition = document.getElementById('page-transition');
    const transitionText = document.getElementById('transition-text');

    // Fade out the black screen on load
    if (pageTransition && transitionText) {
        setTimeout(() => {
            transitionText.classList.remove('show');
            pageTransition.classList.add('fade-out');
        }, 600);
    }

    // Projects Page Elements Fade-In
    setTimeout(() => {
        ['back-btn-container', 'header-container', 'tabs-container', 'projects-container'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.opacity = '1';
                el.classList.remove('-translate-x-4', 'translate-y-4');
            }
        });
    }, 100);

    // Page Transition Intercept for internal links
    document.body.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        if (anchor && pageTransition && transitionText) {
            const href = anchor.getAttribute('href');
            const target = anchor.getAttribute('target');
            // Only intercept same-site links (absolute paths or .html files), not anchors or external
            if (href && !href.startsWith('#') && !href.startsWith('http') && target !== '_blank') {
                e.preventDefault();
                pageTransition.classList.remove('fade-out');
                pageTransition.classList.add('fade-in');
                setTimeout(() => transitionText.classList.add('show'), 150);
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

// Projects Page Tab Switcher
function switchProjectTab(tabId) {
    const tabsContainer = document.getElementById('tabs-container');
    const projectsContainer = document.getElementById('projects-container');
    if (!tabsContainer || !projectsContainer) return;
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    projectsContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`btn-${tabId}`).classList.add('active');
    document.getElementById(`content-${tabId}`).classList.add('active');
}
