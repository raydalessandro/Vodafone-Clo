/* Oak Tree - Cookie Banner GDPR */

/**
 * Gestione Cookie Banner conforme GDPR
 */
(function() {
    'use strict';
    
    const CONSENT_KEY = 'cookieConsent2025';
    
    /**
     * Verifica se il consenso è già stato dato
     */
    function hasConsent() {
        return localStorage.getItem(CONSENT_KEY) === '1';
    }
    
    /**
     * Salva il consenso
     */
    function saveConsent() {
        try {
            localStorage.setItem(CONSENT_KEY, '1');
            return true;
        } catch (e) {
            console.warn('Cookie consent: localStorage not available');
            return false;
        }
    }
    
    /**
     * Mostra il banner dei cookie
     */
    function showCookieBanner() {
        const banner = document.getElementById('cookie');
        if (!banner) return;
        
        banner.style.display = 'flex';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-labelledby', 'cookie-title');
        banner.setAttribute('aria-describedby', 'cookie-desc');
        
        // Aggiunge titolo nascosto per screen reader
        if (!document.getElementById('cookie-title')) {
            const title = document.createElement('h2');
            title.id = 'cookie-title';
            title.className = 'sr-only';
            title.textContent = 'Consenso ai cookie';
            banner.insertBefore(title, banner.firstChild);
        }
        
        // Focus management per accessibilità
        const okButton = document.getElementById('okCookie');
        if (okButton) {
            setTimeout(() => okButton.focus(), 100);
        }
    }
    
    /**
     * Nasconde il banner dei cookie
     */
    function hideCookieBanner() {
        const banner = document.getElementById('cookie');
        if (banner) {
            banner.style.display = 'none';
            banner.remove();
        }
    }
    
    /**
     * Gestisce il click sul pulsante OK
     */
    function handleAcceptClick() {
        const success = saveConsent();
        if (success) {
            hideCookieBanner();
            
            // Triggera evento personalizzato per analytics
            window.dispatchEvent(new CustomEvent('cookieConsentGiven', {
                detail: { timestamp: new Date().toISOString() }
            }));
        } else {
            console.error('Impossibile salvare il consenso ai cookie');
        }
    }
    
    /**
     * Gestisce la navigazione da tastiera nel banner
     */
    function handleKeyDown(e) {
        const banner = document.getElementById('cookie');
        if (!banner || banner.style.display === 'none') return;
        
        // ESC chiude il banner (considerato come accettazione)
        if (e.key === 'Escape') {
            handleAcceptClick();
        }
        
        // TAB management per mantenere focus nel banner
        if (e.key === 'Tab') {
            const focusableElements = banner.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    /**
     * Inizializza il sistema di gestione cookie
     */
    function initCookieBanner() {
        // Se consenso già dato, non mostrare banner
        if (hasConsent()) {
            return;
        }
        
        // Mostra banner dopo un piccolo delay per UX migliore
        setTimeout(() => {
            showCookieBanner();
            
            // Event listeners
            const okButton = document.getElementById('okCookie');
            if (okButton) {
                okButton.addEventListener('click', handleAcceptClick);
            }
            
            document.addEventListener('keydown', handleKeyDown);
            
            // Auto-accept dopo 30 secondi di inattività (opzionale)
            setTimeout(() => {
                if (!hasConsent()) {
                    console.log('Auto-accepting cookies after timeout');
                    handleAcceptClick();
                }
            }, 30000);
            
        }, 1000);
    }
    
    /**
     * Utility per reset consenso (per testing)
     */
    function resetConsent() {
        localStorage.removeItem(CONSENT_KEY);
        location.reload();
    }
    
    // Inizializza quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        initCookieBanner();
    }
    
    // Espone utility per debug/testing
    window.CookieConsent = {
        hasConsent,
        resetConsent,
        show: showCookieBanner,
        hide: hideCookieBanner
    };
    
})();
