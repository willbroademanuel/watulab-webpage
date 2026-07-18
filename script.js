/**
 * ==========================================================
 * WATULAB MAIN JAVASCRIPT FILE
 * ==========================================================
 * This file contains all the interactive logic for the site.
 * It's structured for easy editing if you understand the basics.
 */

// Helper function to create simple programmable delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* =========================================================================
   2. INITIAL BOOT & SETUP
   ========================================================================= 
   This code runs immediately when any page finishes loading in the browser.
*/
document.addEventListener('DOMContentLoaded', () => {
    // 1. Grab main transition elements
    const pageTransition = document.getElementById('page-transition');
    const transitionText = document.getElementById('transition-text');

    // 2. Intro logic
    let savedIntroTime = null;
    
    try {
        savedIntroTime = localStorage.getItem('watu_intro_time');
    } catch (error) {
        console.warn('Local storage access denied or unavailable.', error);
    }

    // Configuration: How long before the language intro resets? 
    const threeHours = 3 * 60 * 60 * 1000;

    const currentPath = window.location.pathname;
    const isIndex = currentPath === '/' || currentPath.includes('index.html') || !currentPath.endsWith('.html');

    // -- HOME PAGE LOGIC --
    if (isIndex) {
        let shouldSkipIntro = false;
        // If they already visited recently, skip the intro screen
        if (savedIntroTime) {
            const timePassed = new Date().getTime() - parseInt(savedIntroTime, 10);
            if (timePassed < threeHours) {
                shouldSkipIntro = true;
            } else {
                try {
                    localStorage.removeItem('watu_intro_time');
                } catch (error) {
                    console.warn('Failed to remove from local storage.', error);
                }
            }
        }

        // Applying the skip
        if (shouldSkipIntro) {
            const introOverlay = document.getElementById('intro-overlay');
            if (introOverlay) introOverlay.style.display = 'none';
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.opacity = '1';
        } else {
            // Auto start the experience
            startExperience().catch(err => {
                console.error("Failed to start experience animation:", err);
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.style.opacity = '1';
                const introOverlay = document.getElementById('intro-overlay');
                if (introOverlay) introOverlay.style.display = 'none';
            });
        }
    }

    // Fade out the black screen after load
    if (pageTransition && transitionText) {
        setTimeout(() => {
            transitionText.classList.remove('show');
            pageTransition.classList.add('fade-out');
        }, 600); // 600ms delay before revealing the newly loaded page
    }

    // Projects Page Elements Fade-In
    if (currentPath.includes('/projects')) {
        setTimeout(() => {
            ['back-btn-container', 'header-container', 'tabs-container', 'projects-container'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.opacity = '1';
                    el.classList.remove('-translate-x-4', 'translate-y-4');
                }
            });
        }, 100);
    }

    // Privacy Page Elements Fade-In
    if (currentPath.includes('/privacy')) {
        setTimeout(() => {
            const policyContainer = document.getElementById('policy-container');
            if (policyContainer) policyContainer.style.opacity = '1';
        }, 100);
    }

    // ──────────────────────────────────────────────
    // CUSTOM PAGE TRANSITIONS (Clicking internal links)
    // ──────────────────────────────────────────────
    document.body.addEventListener('click', function (e) {
        // Find if a linked was clicked anywhere up the chain
        const anchor = e.target.closest('a');
        if (anchor && pageTransition && transitionText) {
            const targetUrl = anchor.getAttribute('href');
            const target = anchor.getAttribute('target');

            // If it's a link to another page on our site (not external and not anchor # scroll)
            if (targetUrl && !targetUrl.startsWith('#') && !targetUrl.startsWith('http') && target !== '_blank') {
                e.preventDefault(); // Stop instant jump

                // Show black transition screen
                pageTransition.classList.remove('fade-out');
                pageTransition.classList.add('fade-in');

                // Animate text, then physically load the new URL after giving it time
                setTimeout(() => transitionText.classList.add('show'), 150);
                setTimeout(() => window.location.href = targetUrl, 800); // 800ms wait
            }
        }
    });

    // Fire off specific Homepage features
    startAutoTabShift();
    if (document.getElementById('typewriter')) {
        setTimeout(type, 1000); // Wait 1 sec before hacking typing effect starts
    }
});

// Safari Cache fix (Ensures animations aren't broken when pressing 'Back' button on iPhones/Macs)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const pageTransition = document.getElementById('page-transition');
        const transitionText = document.getElementById('transition-text');
        if (pageTransition) {
            pageTransition.classList.remove('fade-in');
            pageTransition.classList.add('fade-out');
        }
        if (transitionText) transitionText.classList.remove('show');
    }
});


/* =========================================================================
   3. ANIMATION LOGIC
   ========================================================================= 
   This handles the "Karibu -> Watu Lab -> Upo mahali sahihi" text
*/
async function startExperience() {
    // Save intro timestamp to browser storage safely
    try {
        localStorage.setItem('watu_intro_time', new Date().getTime().toString());
    } catch (error) {
        console.warn('Local storage write failed.', error);
    }

    const introContainer = document.getElementById('intro-sequence');
    const textElement = document.getElementById('sequence-text');

    // --- INTRO SEQUENCE TIMINGS ---  
    try {
        if (introContainer && textElement) {
            introContainer.classList.remove('hidden');

            // Frame 1
            textElement.textContent = "Karibu";
            textElement.classList.add('visible');
            await sleep(1500); // Length text is shown
            textElement.classList.remove('visible');
            await sleep(600); // Blank space duration

            // Frame 2
            textElement.textContent = "Watu Lab";
            textElement.classList.add('visible');
            await sleep(1500);
            textElement.classList.remove('visible');
            await sleep(600);

            // Frame 3
            textElement.textContent = "Upo mahali sahihi";
            textElement.classList.add('animate-glow');
            textElement.classList.add('visible');
            await sleep(2500);
            textElement.classList.remove('visible');
            textElement.classList.remove('animate-glow');
            await sleep(800);
        }
    } catch (err) {
        console.error("Error during intro sequence:", err);
    } finally {
        // Dissolve intro layer and show home page (guaranteed to run)
        const overlay = document.getElementById('intro-overlay');
        if (overlay) overlay.classList.add('hidden-screen');

        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.opacity = '1';
    }
}


/* =========================================================================
   4. NAVIGATION MENU LOGIC
   ========================================================================= */

/* Hamburger icon logic to toggle phone drop down menu  */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    if (!menu) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        // Cascading fade-in animation
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('opacity-0', '-translate-y-4');
                item.classList.add('opacity-100', 'translate-y-0');
            }, 100 * (index + 1));
        });
    } else {
        closeMobileMenu();
    }
}

/* Closes mobile menu forcefully */
function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuItems = document.querySelectorAll('.mobile-menu-item');
    if (!menu) return;

    menuItems.forEach((item) => {
        item.classList.add('opacity-0', '-translate-y-4');
        item.classList.remove('opacity-100', 'translate-y-0');
    });
    menu.classList.add('hidden');
}

/* Auto-close dropdown when a link is pressed inside it */
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

/* Click off menu logic */
document.addEventListener('click', (event) => {
    const menu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('button[onclick="toggleMobileMenu()"]');
    if (menu && menuBtn && !menu.classList.contains('hidden') && !menu.contains(event.target) && !menuBtn.contains(event.target)) {
        closeMobileMenu();
    }
});


/* =========================================================================
   5. TAB COMPONENTS 
   ========================================================================= */

// --- Homepage 'About Us' Auto-Switching Tabs ---
const tabIds = ['mission', 'vision', 'why'];
let currentTabIndex = 0;
let tabAutoShiftInterval;
let tabManualTimeout;

function startAutoTabShift() {
    if (!document.getElementById('btn-mission')) return;
    clearInterval(tabAutoShiftInterval);

    // Config: Tab switch speed -> 4000 = 4 seconds
    tabAutoShiftInterval = setInterval(() => {
        currentTabIndex = (currentTabIndex + 1) % tabIds.length;
        switchTab(tabIds[currentTabIndex], true);
    }, 4000);
}

function switchTab(tabId, isAuto = false) {
    if (!document.getElementById(`btn-${tabId}`)) return;

    // Wipe clean any active states
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Re-apply states purely to target
    document.getElementById(`btn-${tabId}`).classList.add('active');
    document.getElementById(`content-${tabId}`).classList.add('active');
    currentTabIndex = tabIds.indexOf(tabId);

    // If User clicked manually, pause automatic flow
    if (!isAuto) {
        clearInterval(tabAutoShiftInterval);
        clearTimeout(tabManualTimeout);
        // Wait 14s before resuming automatic cycling after a user interaction
        tabManualTimeout = setTimeout(startAutoTabShift, 14000);
    }
}

// --- Projects Page Dedicated Tabs ---
function switchProjectTab(tabId) {
    const tabsContainer = document.getElementById('tabs-container');
    const projectsContainer = document.getElementById('projects-container');
    if (!tabsContainer || !projectsContainer) return;

    // Reset bounds isolated securely within containers
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    projectsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    document.getElementById(`btn-${tabId}`).classList.add('active');
    document.getElementById(`content-${tabId}`).classList.add('active');
}


/* =========================================================================
   6. VISUAL EFFECTS (SCROLL OBSERVING & MOUSE)
   ========================================================================= */

// SCROLL OBSERVER - Watches items on screen to trigger animations (.reveal)
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // triggers CSS keyframe
        } else {
            entry.target.classList.remove('active'); // Allows effect to replay going upwards
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-bounce').forEach(el => observer.observe(el));


// BACKGROUND MOUSE FOLLOWER - The blurry blob tracking your pointer
const mouseBlob = document.getElementById('mouse-blob');
if (mouseBlob) {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            // Centers it beneath the pointer
            mouseBlob.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
        });
    });
}


/* =========================================================================
   7. TECH STACK MARQUEE SYSTEM
   ========================================================================= 
   Handles infinite scrolling and touch-dragging on the tool icons banner.
*/
const marquee = document.getElementById('tech-marquee');
if (marquee) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isHovered = false;
    let autoScrollSpeed = 1; // Tweak speed of continuous auto-scroll here

    function marqueeStep() {
        if (!isDown && !isHovered) marquee.scrollLeft += autoScrollSpeed;

        // Infinite recursion wrapper
        if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
            marquee.scrollLeft -= marquee.scrollWidth / 2;
        } else if (marquee.scrollLeft <= 0) {
            marquee.scrollLeft += marquee.scrollWidth / 2;
        }
        requestAnimationFrame(marqueeStep);
    }
    requestAnimationFrame(marqueeStep);

    // Mouse Controls
    marquee.addEventListener('mouseenter', () => isHovered = true);
    marquee.addEventListener('mouseleave', () => {
        isHovered = false;
        isDown = false;
        marquee.style.cursor = 'grab';
    });
    marquee.addEventListener('mousedown', (e) => {
        isDown = true;
        marquee.style.cursor = 'grabbing';
        startX = e.pageX - marquee.offsetLeft;
        scrollLeft = marquee.scrollLeft;
    });
    marquee.addEventListener('mouseup', () => {
        isDown = false;
        marquee.style.cursor = 'grab';
    });

    // Drag Logic
    marquee.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const walk = ((e.pageX - marquee.offsetLeft) - startX) * 2; // Sensitivity multiplier
        marquee.scrollLeft = scrollLeft - walk;
        if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
            marquee.scrollLeft -= marquee.scrollWidth / 2;
            scrollLeft -= marquee.scrollWidth / 2;
        } else if (marquee.scrollLeft <= 0) {
            marquee.scrollLeft += marquee.scrollWidth / 2;
            scrollLeft += marquee.scrollWidth / 2;
        }
    });

    // Touch Support for mobile dragging
    marquee.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - marquee.offsetLeft;
        scrollLeft = marquee.scrollLeft;
    });
    marquee.addEventListener('touchend', () => isDown = false);
    marquee.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const walk = ((e.touches[0].pageX - marquee.offsetLeft) - startX) * 2;
        marquee.scrollLeft = scrollLeft - walk;

        // Wrap logic
        if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
            marquee.scrollLeft -= marquee.scrollWidth / 2;
            scrollLeft -= marquee.scrollWidth / 2;
        } else if (marquee.scrollLeft <= 0) {
            marquee.scrollLeft += marquee.scrollWidth / 2;
            scrollLeft += marquee.scrollWidth / 2;
        }
    });
}


/* =========================================================================
   8. TYPEWRITER EFFECT
   ========================================================================= 
   Handles the typing logic above the "Let's Work Together" block.
*/
// Config: To change the words shown, edit this bracketed array.
const words = ['designed', 'built', 'optimized', 'refined'];
let wIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;
    const currentWord = words[wIndex];

    if (isDeleting) {
        // Delete a character
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add a character
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Config: Typing speed (ms)
    let typeSpeed = 100;

    // Delete speed (twice as fast as typing)
    if (isDeleting) typeSpeed /= 2;

    // Complete Word Behavior - pause before deleting
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Waittime before deleting begins (2s)
        isDeleting = true;
    }
    // Emptied Word Behavior - jump to next word
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wIndex = (wIndex + 1) % words.length;
        typeSpeed = 500; // Brief pause before typing next word (0.5s)
    }

    setTimeout(type, typeSpeed);
}


/* =========================================================================
   9. INTELLIGENT SCROLL INDICATOR
   ========================================================================= */
const swipeIndicator = document.getElementById('swipe-indicator');
const sideIndicators = document.getElementById('side-scroll-indicators');

if (swipeIndicator || sideIndicators) {
    function checkMobile() {
        let isOverlapping = false;
        const heroContent = document.querySelector('#main-content section:first-of-type > div');

        // Calculates if the hero text is physically clipping the bottom zone
        if (heroContent) {
            const heroRect = heroContent.getBoundingClientRect();
            // Indicator sits around 80px from bottom. Added 150px safety buffer
            if (heroRect.bottom > window.innerHeight - 150) {
                isOverlapping = true; // Signals script to instantly hide arrow
            }
        }

        // Logic Check: Swipe indicator hides if overlapping with text
        if (window.innerWidth < 768 && !isOverlapping) {
            if (swipeIndicator) swipeIndicator.classList.remove('hidden');
        } else {
            if (swipeIndicator) swipeIndicator.classList.add('hidden');
        }

        // Side indicators show on ALL mobile screens regardless of overlap
        if (window.innerWidth < 768) {
            if (sideIndicators) sideIndicators.classList.remove('hidden');
        } else {
            if (sideIndicators) sideIndicators.classList.add('hidden');
        }
    }

    checkMobile(); // Check on setup
    window.addEventListener('resize', checkMobile); // Check if phone is rotated

    // As soon as person scrolls at all (> 100px), visually dissolve arrow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (swipeIndicator) swipeIndicator.classList.add('fade-out');
            if (sideIndicators) sideIndicators.classList.add('fade-out');
        } else {
            if (swipeIndicator) swipeIndicator.classList.remove('fade-out');
            if (sideIndicators) sideIndicators.classList.remove('fade-out');
        }
    });
}

/* =========================================================================
   10. 3D STACKING CARDS SCROLL (INDUSTRIES)
   ========================================================================= */
const scrollTrack = document.getElementById('industries-scroll-track');
if (scrollTrack) {
    const animCards = [
        document.getElementById('anim-card-1'),
        document.getElementById('anim-card-2'),
        document.getElementById('anim-card-3')
    ];

    function handleTrackScroll() {
        const trackRect = scrollTrack.getBoundingClientRect();
        const windowH = window.innerHeight;

        // Progress: 0 when top of track hits window top, 1 when bottom hits.
        const maxScroll = trackRect.height - windowH;
        let progress = -trackRect.top / maxScroll;
        progress = Math.max(0, Math.min(progress, 1));

        // The user requested: Finish animation by 0.7, leaving a 0.3 'Pause' phase
        const PHASE_LEN = 0.35;

        animCards.forEach((card, i) => {
            if (!card) return;

            // 1. ENTRANCE LOGIC (Slide up from bottom)
            let enterP = 1; // Card 1 is fully entered at 0
            if (i > 0) {
                enterP = (progress - (i - 1) * PHASE_LEN) / PHASE_LEN;
                enterP = Math.max(0, Math.min(enterP, 1));
            }

            // 2. SHRINK LOGIC (Being pushed back)
            let shrinkP = (progress - i * PHASE_LEN) / PHASE_LEN;
            shrinkP = Math.max(0, shrinkP); // Can exceed 1 for deeper stacking

            // 3. CALCULATE TRANSFORMS
            const tyEntrance = (1 - enterP) * 120; // 120% start -> 0%
            const tyShrink = shrinkP * -5;         // Pushes up 5% per phase
            const totalTy = tyEntrance + tyShrink;

            const scale = 1 - (shrinkP * 0.05);    // Shrinks 5% per phase
            const brightness = 1 - (shrinkP * 0.4); // Darkens 40% per phase

            card.style.transform = `translateY(${totalTy}%) scale(${scale})`;
            card.style.filter = `brightness(${brightness})`;

            // Only show if it's currently entering or entered
            card.style.opacity = enterP > 0 ? 1 : 0;
        });
    }

    window.addEventListener('scroll', handleTrackScroll);
    window.addEventListener('resize', handleTrackScroll);
    handleTrackScroll();
}

