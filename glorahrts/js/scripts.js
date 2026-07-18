// Mobile menu toggle
document.getElementById('mobileMenuButton').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
});

document.getElementById('closeMobileMenu').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('hidden');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking a link
const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('hidden');
        document.body.style.overflow = '';
    });
});

// Scroll animation
function checkVisibility() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('appear');
        }
    });
}

// Check visibility on scroll and load
window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);
