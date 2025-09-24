/* Oak Tree - Main JavaScript */

// Elementi DOM principali
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const html = document.documentElement;

/**
 * Animazione contatori numerici nelle statistiche
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const isYear = target === 2012;
        const isTime = target === 10;
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (isYear) {
                counter.textContent = Math.floor(current);
            } else if (isTime) {
                counter.textContent = Math.floor(current) + ' min';
            } else {
                counter.textContent = Math.floor(current).toLocaleString() + '+';
            }
        }, 20);
    });
}

/**
 * Intersection Observer per attivare animazioni quando visibili
 */
function initIntersectionObserver() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Osserva le statistiche per l'animazione
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

/**
 * Gestione navbar scroll effects
 */
function handleNavbarScroll() {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        
        // Back to top button
        const backTop = document.getElementById('backTop');
        if (backTop) {
            if (window.scrollY > 300) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        }
    });
}

/**
 * Gestione menu mobile con body-scroll lock
 */
function initMobileMenu() {
    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : !mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        html.style.overflow = isOpen ? 'hidden' : '';
    }
    
    mobileMenuBtn.addEventListener('click', () => toggleMenu());
    
    // Chiudi menu quando si clicca su un link
    mobileMenu.querySelectorAll('a').forEach(a => 
        a.addEventListener('click', () => toggleMenu(false))
    );
    
    // Chiudi menu con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuBtn.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}

/**
 * Smooth scroll per anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Gestione stato apertura/chiusura negozi
 */
function updateStoreHours() {
    const now = new Date();
    
    // Fuso orario Europa/Roma
    const fmt = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const timeParts = fmt.formatToParts(now);
    const hh = +timeParts.find(p => p.type === 'hour').value;
    const mm = +timeParts.find(p => p.type === 'minute').value;
    const currentMinutes = hh * 60 + mm;

    document.querySelectorAll('.open-badge[data-hours]').forEach(el => {
        const range = el.dataset.hours.split('-');
        const [ah, am] = range[0].split(':').map(Number);
        const [bh, bm] = range[1].split(':').map(Number);
        const openMinutes = ah * 60 + am;
        const closeMinutes = bh * 60 + bm;
        
        const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
        el.textContent = isOpen ? 'Aperto ora' : 'Chiuso';
        el.classList.toggle('closed', !isOpen);
    });
}

/**
 * Inizializzazione al caricamento della pagina
 */
function init() {
    // Verifica supporto IntersectionObserver
    if ('IntersectionObserver' in window) {
        initIntersectionObserver();
    } else {
        // Fallback per browser più vecchi
        setTimeout(animateCounters, 1000);
    }
    
    handleNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    updateStoreHours();
    
    // Log per debug
    console.log('🌳 Oak Tree - Website initialized');
}

/**
 * Performance optimization: defer non-critical tasks
 */
function initDeferredTasks() {
    // Aggiorna orari negozi ogni 5 minuti
    setInterval(updateStoreHours, 5 * 60 * 1000);
}

// Inizializzazione immediata
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Task differiti dopo il caricamento completo
window.addEventListener('load', initDeferredTasks);

// Gestione errori JavaScript
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error:', e.error);
});

// Export per eventuale uso in altri moduli
window.OakTreeApp = {
    animateCounters,
    updateStoreHours
};
