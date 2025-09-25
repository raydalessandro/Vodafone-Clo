/**
 * Oak Tree - Main JavaScript
 * Rivenditore Autorizzato Vodafone
 * Performance & SEO Optimized
 */

// ===== GLOBAL VARIABLES =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const html = document.documentElement;
const backTop = document.getElementById('backTop');

// ===== COUNTER ANIMATION =====
/**
 * Anima i contatori numerici nella sezione hero stats
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

// ===== INTERSECTION OBSERVER FOR STATS =====
/**
 * Osserva le statistiche per attivare l'animazione quando visibili
 */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.5,
  rootMargin: '0px 0px -50px 0px'
});

// Inizializza observer per hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

// ===== COOKIE BANNER GDPR =====
/**
 * Gestisce il banner dei cookie GDPR compliant
 */
function initCookieBanner() {
  const cookieKey = "cookieConsent2025";
  const cookieBanner = document.getElementById('cookie');
  const okButton = document.getElementById('okCookie');
  
  // Mostra banner solo se consenso non già dato
  if (!localStorage.getItem(cookieKey) && cookieBanner) {
    cookieBanner.style.display = 'block';
    
    // Gestisce click accettazione
    if (okButton) {
      okButton.onclick = function() {
        localStorage.setItem(cookieKey, "1");
        cookieBanner.remove();
      };
    }
  }
}

// ===== NAVBAR SCROLL EFFECTS =====
/**
 * Gestisce effetti navbar durante scroll
 */
function handleNavbarScroll() {
  const scrollY = window.scrollY;
  
  // Aggiunge classe scrolled per styling
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }
  
  // Mostra/nasconde back to top button
  if (backTop) {
    backTop.classList.toggle('show', scrollY > 300);
  }
}

// ===== MOBILE MENU =====
/**
 * Gestisce il menu mobile con body-scroll lock
 * @param {boolean} open - Stato del menu (aperto/chiuso)
 */
function toggleMenu(open) {
  const isOpen = open !== undefined ? open : !mobileMenuBtn?.classList.contains('active');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('active', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    
    // Previene scroll del body quando menu aperto
    html.style.overflow = isOpen ? 'hidden' : '';
  }
}

// ===== SMOOTH SCROLL =====
/**
 * Implementa smooth scroll per link anchor
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
        
        // Chiude menu mobile se aperto
        toggleMenu(false);
      }
    });
  });
}

// ===== STORE HOURS =====
/**
 * Calcola e mostra se i negozi sono aperti/chiusi
 * Utilizza timezone Europa/Roma
 */
function updateStoreHours() {
  const now = new Date();
  
  // Ottiene ora corrente in timezone Europa/Roma
  const formatter = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const timeParts = formatter.formatToParts(now);
  const hours = parseInt(timeParts.find(p => p.type === 'hour').value);
  const minutes = parseInt(timeParts.find(p => p.type === 'minute').value);
  const currentMinutes = hours * 60 + minutes;
  
  // Aggiorna status per ogni negozio
  document.querySelectorAll('.open-badge[data-hours]').forEach(badge => {
    const hours = badge.dataset.hours.split('-');
    const [openHour, openMin] = hours[0].split(':').map(Number);
    const [closeHour, closeMin] = hours[1].split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    
    badge.textContent = isOpen ? 'Aperto ora' : 'Chiuso';
    badge.classList.toggle('closed', !isOpen);
  });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
/**
 * Throttle function per limitare chiamate durante scroll
 * @param {Function} func - Funzione da chiamare
 * @param {number} limit - Limite in millisecondi
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function per limitare chiamate rapide
 * @param {Function} func - Funzione da chiamare  
 * @param {number} wait - Tempo di attesa in millisecondi
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== LAZY LOADING IMAGES =====
/**
 * Implementa lazy loading per immagini non critiche
 */
function initLazyLoading() {
  // Supporto nativo per loading="lazy"
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback con Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ===== ERROR HANDLING =====
/**
 * Gestisce errori JavaScript globali
 */
function initErrorHandling() {
  window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
    // In produzione, invia errori a servizio di monitoring
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection:', e.reason);
    e.preventDefault();
  });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
/**
 * Migliora l'accessibilità del sito
 */
function initAccessibility() {
  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Gestisce ESC per chiudere menu mobile
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      toggleMenu(false);
    }
  });
  
  // Migliora focus management per mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }
}

// ===== PERFORMANCE MONITORING =====
/**
 * Monitora le performance del sito
 */
function initPerformanceMonitoring() {
  // Web Vitals se supportate
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay  
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }
}

// ===== INITIALIZATION =====
/**
 * Inizializza tutte le funzionalità quando DOM è pronto
 */
function init() {
  // Funzioni base
  initCookieBanner();
  initSmoothScroll();
  initAccessibility();
  initLazyLoading();
  updateStoreHours();
  
  // Error handling (solo in development)
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    initErrorHandling();
    initPerformanceMonitoring();
  }
  
  // Event listeners ottimizzati
  window.addEventListener('scroll', throttle(handleNavbarScroll, 16)); // ~60fps
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => toggleMenu());
    
    // Chiude menu quando si clicca su un link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }
  
  // Aggiorna orari negozi ogni minuto
  setInterval(updateStoreHours, 60000);
  
  console.log('Oak Tree JS initialized successfully');
}

// ===== DOM READY =====
/**
 * Esegue inizializzazione quando DOM è completamente caricato
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM già caricato
  init();
}

// ===== SERVICE WORKER REGISTRATION =====
/**
 * Registra service worker per PWA (opzionale)
 */
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed:', registrationError);
      });
  });
}
