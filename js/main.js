// Main JavaScript per Oak Tree - Ottimizzato per Performance
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementi DOM
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const backTop = document.getElementById('backTop');
    const html = document.documentElement;
    
    // Inizializzazioni
    initCookieBanner();
    initEventListeners();
    initCounterAnimation();
    updateStoreHours();
    
    // Event Listeners
    function initEventListeners() {
        // Scroll ottimizzato con throttling
        let scrollTimer = null;
        window.addEventListener('scroll', function() {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(handleScroll, 10);
        }, { passive: true });
        
        // Mobile menu
        mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
        
        // Smooth scroll per anchor links
        initSmoothScroll();
        
        // Chiusura menu mobile su click link
        mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Back to top
        backTop?.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Cookie Banner GDPR
    function initCookieBanner() {
        const cookieKey = "oaktree_consent_2025";
        const banner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('acceptCookies');
        
        if (!localStorage.getItem(cookieKey) && banner) {
            banner.style.display = 'flex';
            
            acceptBtn?.addEventListener('click', function() {
                try {
                    localStorage.setItem(cookieKey, "1");
                    banner.style.display = 'none';
                    
                    // Fade out animation
                    banner.style.transition = 'opacity 0.3s ease';
                    banner.style.opacity = '0';
                    setTimeout(() => banner.remove(), 300);
                } catch(e) {
                    // Fallback se localStorage non disponibile
                    banner.remove();
                }
            });
        }
    }
    
    // Scroll Handler ottimizzato
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar effect
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        
        // Back to top button
        if (backTop) {
            backTop.classList.toggle('show', scrollY > 300);
        }
    }
    
    // Mobile Menu Toggle
    function toggleMobileMenu() {
        const isOpen = mobileMenuBtn.classList.contains('active');
        const newState = !isOpen;
        
        // Aggiorna stati
        mobileMenuBtn.classList.toggle('active', newState);
        mobileMenu.classList.toggle('active', newState);
        mobileMenuBtn.setAttribute('aria-expanded', newState);
        
        // Body scroll lock
        html.style.overflow = newState ? 'hidden' : '';
        
        // Focus management per accessibilità
        if (newState) {
            mobileMenu.focus();
        } else {
            mobileMenuBtn.focus();
        }
    }
    
    // Smooth Scroll per anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Animazione Contatori Numerici
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;
        
        let hasAnimated = false;
        
        const animateCounters = () => {
            if (hasAnimated) return;
            hasAnimated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const isYear = target === 2012;
                const isTime = target === 10;
                
                let current = 0;
                const increment = target / 60; // 60 steps per animazione più fluida
                
                const timer = setInterval(() => {
                    current += increment;
                    
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // Formattazione basata sul tipo
                    if (isYear) {
                        counter.textContent = Math.floor(current).toString();
                    } else if (isTime) {
                        counter.textContent = Math.floor(current) + ' min';
                    } else {
                        // Formato numero con separatori migliaia
                        counter.textContent = Math.floor(current).toLocaleString('it-IT') + '+';
                    }
                }, 25); // 25ms per animazione fluida
            });
        };
        
        // Intersection Observer per trigger animazione
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '-50px'
        });
        
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }
    
    // Store Hours - Orari Negozi
    function updateStoreHours() {
        try {
            const now = new Date();
            
            // Fuso orario Italia
            const timeFormatter = new Intl.DateTimeFormat('it-IT', {
                timeZone: 'Europe/Rome',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            const timeParts = timeFormatter.formatToParts(now);
            const hour = parseInt(timeParts.find(p => p.type === 'hour')?.value || '0');
            const minute = parseInt(timeParts.find(p => p.type === 'minute')?.value || '0');
            const currentTime = hour * 60 + minute;
            const dayOfWeek = now.getDay(); // 0=Sunday, 6=Saturday
            
            document.querySelectorAll('.open-badge[data-hours]').forEach(badge => {
                const hoursRange = badge.dataset.hours;
                if (!hoursRange) return;
                
                const hours = hoursRange.split('-');
                if (hours.length !== 2) return;
                
                const [openHour, openMinute] = hours[0].split(':').map(Number);
                const [closeHour, closeMinute] = hours[1].split(':').map(Number);
                
                const openTime = openHour * 60 + openMinute;
                const closeTime = closeHour * 60 + closeMinute;
                
                // Controlla se è giorno lavorativo (Lun-Sab = 1-6)
                const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 6;
                const isOpen = isWorkingDay && currentTime >= openTime && currentTime <= closeTime;
                
                badge.textContent = isOpen ? 'Aperto ora' : 'Chiuso';
                badge.classList.toggle('closed', !isOpen);
            });
        } catch(e) {
            console.warn('Errore nell\'aggiornamento degli orari negozi:', e);
        }
    }
    
    // Gestione errori JavaScript
    window.addEventListener('error', function(e) {
        console.warn('Errore JavaScript catturato:', e.error);
        // In produzione potresti inviare gli errori a un servizio di monitoring
    });
    
    // Performance observer per Core Web Vitals (opzionale)
    if ('PerformanceObserver' in window) {
        try {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('LCP:', entry.startTime);
                }
            });
            lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
            
            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            });
            fidObserver.observe({entryTypes: ['first-input']});
            
        } catch(e) {
            // Silently fail se PerformanceObserver non è supportato
        }
    }
    
    // Utility: Debounce function per ottimizzazione
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
    
    // Utility: Throttle function per scroll events
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
    
    // Lazy loading delle immagini (se presenti)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Worker Registration (per PWA future)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Analytics placeholder (Google Analytics 4)
    function initAnalytics() {
        // Placeholder per Google Analytics
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'GA_MEASUREMENT_ID');
    }
    
    // Gestione focus per accessibilità
    function handleFocusVisibility() {
        let hadKeyboardEvent = true;
        const keyboardThrottledFunction = throttle(() => {
            hadKeyboardEvent = true;
        }, 100);
        
        document.addEventListener('keydown', keyboardThrottledFunction);
        document.addEventListener('mousedown', () => {
            hadKeyboardEvent = false;
        });
        
        document.addEventListener('focusin', (e) => {
            if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                e.target.classList.add('focus-visible');
            }
        });
        
        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }
    
    // Inizializza focus management
    handleFocusVisibility();
    
    // Gestione tasto ESC per chiudere menu mobile
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Preload delle risorse critiche
    function preloadCriticalResources() {
        const criticalResources = [
            '/css/style.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
        ];
        
        criticalResources.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // Inizializza preload (con delay per non interferire con FCP)
    setTimeout(preloadCriticalResources, 2000);
    
    console.log('🌳 Oak Tree - Sito caricato correttamente!');
});
