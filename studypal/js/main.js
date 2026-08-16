document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');

        const spans = mobileMenuBtn.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }

        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) toggleMenu();
        });
    });

    // --- Theme toggle (mirrors the app's light/dark switch) ---
    const themeToggles = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')].filter(Boolean);
    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('studypal-theme', theme); } catch (e) {}
    }
    themeToggles.forEach((btn) => {
        btn.addEventListener('click', () => {
            setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
        });
    });

    // --- Lenis smooth scroll ---
    let lenis = null;
    if (!prefersReducedMotion && window.Lenis) {
        lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        if (window.gsap && window.ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    // --- Nav progress bar + scroll state ---
    const navProgress = document.getElementById('nav-progress');
    function updateNavProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (navProgress) navProgress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateNavProgress, { passive: true });
    updateNavProgress();

    // --- Scroll reveals ---
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.reveal, .reveal-line, .reveal-scale').forEach((el, i) => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.delayedCall((i % 4) * 0.06, () => el.classList.add('is-visible'));
                }
            });
        });

        gsap.utils.toArray('.workflow-item').forEach((el, i) => {
            gsap.set(el, { opacity: 0, y: 20 });
            ScrollTrigger.create({
                trigger: el,
                start: 'top 90%',
                once: true,
                onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: (i % 2) * 0.08, ease: 'power3.out' })
            });
        });
    } else {
        document.querySelectorAll('.reveal, .reveal-line, .reveal-scale, .workflow-item').forEach(el => {
            el.classList.add('is-visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // --- Rotating hero word ---
    const rotator = document.getElementById('rotator');
    if (rotator && !prefersReducedMotion) {
        const words = ['advantage.', 'GPA.', 'edge.', 'grade.'];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % words.length;
            if (window.gsap) {
                gsap.to(rotator, {
                    opacity: 0, y: -8, duration: 0.25, ease: 'power2.in', onComplete: () => {
                        rotator.textContent = words[idx];
                        gsap.fromTo(rotator, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
                    }
                });
            } else {
                rotator.textContent = words[idx];
            }
        }, 2600);
    }

    // --- Magnetic buttons (desktop only) ---
    if (isFinePointer && !prefersReducedMotion && window.gsap) {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
            const strength = 0.3;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * strength;
                const y = (e.clientY - rect.top - rect.height / 2) * strength;
                gsap.to(btn, { x, y, duration: 0.4, ease: 'power3.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // --- AI Tutor chat demo: type -> send -> answer -> loop ---
    (function runTutorDemo() {
        const messages = document.getElementById('tutor-messages');
        const inputText = document.getElementById('chat-input-text');
        const sendBtn = document.getElementById('chat-send');
        if (!messages || !inputText || !sendBtn) return;

        const question = 'Can you explain how mitochondria produce energy?';
        const answer = "Sure — they convert glucose and oxygen into ATP through cellular respiration, which powers nearly everything your cells do.";

        if (prefersReducedMotion) {
            const userBubble = document.createElement('div');
            userBubble.className = 'chat-bubble user';
            userBubble.textContent = question;
            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble bot';
            botBubble.textContent = answer;
            messages.append(userBubble, botBubble);
            document.querySelector('.chat-input-row').style.display = 'none';
            return;
        }

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        // Symmetric ease-in-out, not the Material "standard" curve (0.4,0,0.2,1) — that one
        // front-loads most of the motion into the first ~60% of the duration then crawls the
        // rest, which is exactly the "grows to ~75%, slows down, then finishes" look reported.
        const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';
        const DUR = 420;

        // The fake input has no real width constraint, so a 48-character question
        // would otherwise get silently clipped by overflow:hidden with no way to read
        // the tail of it — keep the caret end in view as it types, like a real input.
        async function typeText(el, text) {
            const host = el.parentElement;
            for (let i = 0; i < text.length; i++) {
                el.textContent += text[i];
                host.scrollLeft = host.scrollWidth;
                await wait(14 + Math.random() * 20);
            }
        }

        async function fadeOut(...els) {
            els.forEach((el) => {
                // Clear the entrance keyframe first — with animation-fill-mode: forwards
                // it would otherwise keep pinning opacity/transform and block this transition.
                el.style.animation = 'none';
                el.style.transition = `opacity ${DUR}ms ${ease}, transform ${DUR}ms ${ease}`;
                el.style.transform = 'translateY(-6px)';
                el.style.opacity = '0';
            });
            await wait(DUR);
        }

        function spawnSendRipple() {
            const ripple = document.createElement('span');
            ripple.className = 'chat-send-ripple';
            sendBtn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        }

        async function loop() {
            while (true) {
                messages.innerHTML = '';
                inputText.textContent = '';
                inputText.parentElement.scrollLeft = 0;

                await typeText(inputText, question);
                await wait(350);

                sendBtn.classList.add('pressed');
                spawnSendRipple();
                await wait(130);
                sendBtn.classList.remove('pressed');
                inputText.textContent = '';
                inputText.parentElement.scrollLeft = 0;

                const userBubble = document.createElement('div');
                userBubble.className = 'chat-bubble user';
                userBubble.textContent = question;

                const botBubble = document.createElement('div');
                botBubble.className = 'chat-bubble bot typing';
                botBubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
                // Reserve the loading card's real space from the very start, invisibly, so
                // the student bubble is already sitting in its true final position the moment
                // it fades in — there's nothing left to insert underneath it later, so its
                // own intro can't cause any further movement. Revealing the loading card
                // afterward is then a pure opacity change in an already-sized slot.
                botBubble.style.animation = 'none';
                botBubble.style.opacity = '0';
                messages.append(userBubble, botBubble);
                await wait(DUR + 80);

                void botBubble.offsetWidth;
                botBubble.style.transition = `opacity ${DUR}ms ${ease}`;
                botBubble.style.opacity = '1';
                await wait(DUR);
                botBubble.style.transition = '';
                botBubble.style.animation = 'shimmerBorder 2.6s linear infinite';
                await wait(550);

                // Cross-fade the typing dots into the answer instead of a hard swap.
                botBubble.style.animation = 'none';
                botBubble.style.transition = `opacity ${DUR / 2}ms ${ease}`;
                botBubble.style.opacity = '0';
                await wait(DUR / 2);

                // The answer wraps to more lines than the dots bubble, which grows the
                // bubble's height. Lock it at its current height before swapping content,
                // then animate the height change instead of letting layout snap instantly
                // and shove the user's bubble above it upward in a single frame. Measured
                // with getBoundingClientRect (fractional) rather than offsetHeight/scrollHeight
                // (integer-rounded) — the rounding gap between a rounded transition target and
                // the true fractional auto height is exactly what shows up as a small snap the
                // instant the height is released back to 'auto' at the end.
                const startHeight = botBubble.getBoundingClientRect().height;
                botBubble.style.height = startHeight + 'px';
                botBubble.style.overflow = 'hidden';
                botBubble.style.transition = 'none';

                botBubble.classList.remove('typing');
                botBubble.innerHTML = '';
                botBubble.textContent = answer;

                botBubble.style.height = 'auto';
                const targetHeight = botBubble.getBoundingClientRect().height;
                botBubble.style.height = startHeight + 'px';
                void botBubble.offsetWidth; // force reflow before animating from the locked height

                botBubble.style.transition = `height ${DUR}ms ${ease}, opacity ${DUR}ms ${ease}`;
                botBubble.style.height = targetHeight + 'px';
                botBubble.style.opacity = '1';
                await wait(DUR);

                // Release the fixed height once settled so text reflows naturally again.
                botBubble.style.height = 'auto';
                botBubble.style.overflow = '';

                await wait(1700);

                await fadeOut(userBubble, botBubble);
            }
        }

        loop();
    })();

    // --- Custom cursor dot (desktop only) ---
    const cursorDot = document.getElementById('cursor-dot');
    if (isFinePointer && !prefersReducedMotion && cursorDot) {
        let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        window.addEventListener('mousemove', (e) => {
            cx = e.clientX; cy = e.clientY;
            cursorDot.style.left = cx + 'px';
            cursorDot.style.top = cy + 'px';
        });
        document.querySelectorAll('a, button').forEach((el) => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('expand'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('expand'));
        });
    } else if (cursorDot) {
        cursorDot.style.display = 'none';
    }

    // --- Dynamic Pricing Sync with App DB / API Endpoint ---
    (async function syncLivePricing() {
        const endpoint = 'https://studypal.watulab.com/api/pricing';
        try {
            const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
            if (!res.ok) return;
            const data = await res.json();

            if (data && typeof data === 'object') {
                ['free', 'pro', 'pro_max'].forEach((planKey) => {
                    const card = document.querySelector(`[data-plan="${planKey}"]`);
                    if (!card) return;
                    const priceEl = card.querySelector('[data-price-val]');
                    const planData = data[planKey];
                    if (priceEl && planData && planData.price) {
                        const period = planData.period || '';
                        priceEl.innerHTML = `${planData.price}${period ? `<span>${period}</span>` : ''}`;
                    }
                });
            }
        } catch (e) {
            // Strict fallback policy: Maintain neutral placeholder if fetch fails to avoid displaying outdated prices
        }
    })();
});
