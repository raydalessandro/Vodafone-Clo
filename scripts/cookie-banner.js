/**
 * Cookie Banner GDPR Compliant
 * Oak Tree - Rivenditore Autorizzato Vodafone
 * 
 * Gestisce consenso cookie secondo normativa GDPR/Cookie Law italiana
 * Supporta categorizzazione cookie e analytics
 */

class CookieBanner {
  constructor(options = {}) {
    // Configurazione default
    this.config = {
      cookieName: 'oak_tree_cookie_consent',
      cookieExpiry: 365, // giorni
      showDelay: 1000, // millisecondi
      autoShow: true,
      categories: {
        necessary: true, // sempre abilitati
        analytics: false,
        marketing: false,
        preferences: false
      },
      ...options
    };

    // Elementi DOM
    this.banner = null;
    this.overlay = null;
    this.detailsModal = null;

    // Stato
    this.isVisible = false;
    this.consent = this.getStoredConsent();

    // Bind methods
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.acceptAll = this.acceptAll.bind(this);
    this.acceptSelected = this.acceptSelected.bind(this);
    this.rejectAll = this.rejectAll.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);

    // Inizializza
    this.init();
  }

  /**
   * Inizializza il cookie banner
   */
  init() {
    // Crea elementi DOM
    this.createBanner();
    this.createDetailsModal();
    
    // Event listeners
    this.attachEventListeners();
    
    // Mostra banner se necessario
    if (this.config.autoShow && this.shouldShowBanner()) {
      setTimeout(this.show, this.config.showDelay);
    }

    // Applica consensi esistenti
    this.applyConsent();

    console.log('Cookie Banner initialized');
  }

  /**
   * Verifica se il banner deve essere mostrato
   */
  shouldShowBanner() {
    return !this.consent || !this.consent.timestamp || this.isConsentExpired();
  }

  /**
   * Verifica se il consenso è scaduto
   */
  isConsentExpired() {
    if (!this.consent?.timestamp) return true;
    
    const now = new Date().getTime();
    const consentDate = new Date(this.consent.timestamp).getTime();
    const expiry = this.config.cookieExpiry * 24 * 60 * 60 * 1000; // in millisecondi
    
    return (now - consentDate) > expiry;
  }

  /**
   * Crea il banner principale
   */
  createBanner() {
    this.banner = document.createElement('div');
    this.banner.id = 'cookie-banner';
    this.banner.className = 'cookie-banner';
    this.banner.setAttribute('role', 'dialog');
    this.banner.setAttribute('aria-label', 'Consenso Cookie');
    this.banner.setAttribute('aria-live', 'polite');

    this.banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3>🍪 Cookie e Privacy</h3>
          <p>
            Utilizziamo cookie tecnici per il funzionamento del sito e cookie di analisi per migliorare la tua esperienza. 
            Puoi accettare tutti i cookie o gestire le tue preferenze.
            <a href="/privacy" class="cookie-link">Informativa Privacy</a>
          </p>
        </div>
        
        <div class="cookie-banner-actions">
          <button type="button" class="btn-cookie btn-details" id="cookie-details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9,9h0a3,3,0,0,1,6,0c0,2-3,3-3,3"/>
              <path d="M12,17h0"/>
            </svg>
            Gestisci
          </button>
          
          <button type="button" class="btn-cookie btn-reject" id="cookie-reject">
            Solo Necessari
          </button>
          
          <button type="button" class="btn-cookie btn-accept" id="cookie-accept">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Accetta Tutti
          </button>
        </div>
      </div>
    `;

    // Aggiungi al DOM
    document.body.appendChild(this.banner);
  }

  /**
   * Crea il modal dei dettagli
   */
  createDetailsModal() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'cookie-overlay';
    
    this.detailsModal = document.createElement('div');
    this.detailsModal.className = 'cookie-details-modal';
    this.detailsModal.setAttribute('role', 'dialog');
    this.detailsModal.setAttribute('aria-labelledby', 'cookie-modal-title');
    this.detailsModal.setAttribute('aria-modal', 'true');

    this.detailsModal.innerHTML = `
      <div class="cookie-modal-header">
        <h2 id="cookie-modal-title">Gestione Cookie</h2>
        <button type="button" class="cookie-close" id="cookie-modal-close" aria-label="Chiudi">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="cookie-modal-body">
        <p class="cookie-modal-intro">
          Puoi scegliere quali categorie di cookie autorizzare. I cookie necessari sono sempre attivi per garantire il funzionamento del sito.
        </p>

        <div class="cookie-categories">
          <!-- Cookie Necessari -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookie Necessari</h3>
                <p>Essenziali per il funzionamento del sito web</p>
              </div>
              <div class="cookie-toggle">
                <input type="checkbox" id="cat-necessary" checked disabled>
                <label for="cat-necessary" class="toggle-label">
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-details">
              <ul>
                <li><strong>oak_tree_cookie_consent:</strong> Memorizza le tue preferenze sui cookie</li>
                <li><strong>PHPSESSID:</strong> Mantiene la sessione utente</li>
                <li><strong>csrf_token:</strong> Protegge da attacchi CSRF</li>
              </ul>
            </div>
          </div>

          <!-- Cookie di Analisi -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookie di Analisi</h3>
                <p>Aiutano a capire come i visitatori interagiscono con il sito</p>
              </div>
              <div class="cookie-toggle">
                <input type="checkbox" id="cat-analytics">
                <label for="cat-analytics" class="toggle-label">
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-details">
              <ul>
                <li><strong>_ga:</strong> Google Analytics - Distingue gli utenti (2 anni)</li>
                <li><strong>_ga_*:</strong> Google Analytics - Mantiene stato sessione (2 anni)</li>
                <li><strong>_gid:</strong> Google Analytics - Distingue gli utenti (24 ore)</li>
              </ul>
            </div>
          </div>

          <!-- Cookie di Preferenze -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookie di Preferenze</h3>
                <p>Ricordano le tue scelte per personalizzare l'esperienza</p>
              </div>
              <div class="cookie-toggle">
                <input type="checkbox" id="cat-preferences">
                <label for="cat-preferences" class="toggle-label">
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-details">
              <ul>
                <li><strong>theme_preference:</strong> Ricorda tema scuro/chiaro</li>
                <li><strong>language_pref:</strong> Lingua preferita del sito</li>
                <li><strong>location_pref:</strong> Negozio preferito</li>
              </ul>
            </div>
          </div>

          <!-- Cookie di Marketing -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookie di Marketing</h3>
                <p>Utilizzati per tracciare i visitatori sui siti web per pubblicità personalizzata</p>
              </div>
              <div class="cookie-toggle">
                <input type="checkbox" id="cat-marketing">
                <label for="cat-marketing" class="toggle-label">
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-details">
              <ul>
                <li><strong>_fbp:</strong> Facebook Pixel - Tracciamento conversioni (3 mesi)</li>
                <li><strong>ads_preference:</strong> Preferenze pubblicitarie (1 anno)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="cookie-modal-footer">
        <button type="button" class="btn-cookie btn-reject" id="modal-reject">
          Solo Necessari
        </button>
        <button type="button" class="btn-cookie btn-accept" id="modal-accept">
          Salva Preferenze
        </button>
      </div>
    `;

    this.overlay.appendChild(this.detailsModal);
    document.body.appendChild(this.overlay);
  }

  /**
   * Collega event listeners
   */
  attachEventListeners() {
    // Banner principale
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const detailsBtn = document.getElementById('cookie-details');

    acceptBtn?.addEventListener('click', this.acceptAll);
    rejectBtn?.addEventListener('click', this.rejectAll);
    detailsBtn?.addEventListener('click', this.showDetails);

    // Modal dettagli
    const modalClose = document.getElementById('cookie-modal-close');
    const modalAccept = document.getElementById('modal-accept');
    const modalReject = document.getElementById('modal-reject');

    modalClose?.addEventListener('click', this.hideDetails);
    modalAccept?.addEventListener('click', this.acceptSelected);
    modalReject?.addEventListener('click', this.rejectAll);

    // Chiudi modal cliccando overlay
    this.overlay?.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hideDetails();
      }
    });

    // ESC per chiudere modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.detailsModal?.style.display !== 'none') {
        this.hideDetails();
      }
    });
  }

  /**
   * Mostra il banner
   */
  show() {
    if (this.banner && !this.isVisible) {
      this.banner.style.display = 'block';
      // Force reflow per animazione
      this.banner.offsetHeight;
      this.banner.classList.add('cookie-banner-show');
      this.isVisible = true;

      // Accessibilità
      this.banner.focus();
    }
  }

  /**
   * Nasconde il banner
   */
  hide() {
    if (this.banner && this.isVisible) {
      this.banner.classList.remove('cookie-banner-show');
      this.banner.classList.add('cookie-banner-hide');
      
      setTimeout(() => {
        this.banner.style.display = 'none';
        this.banner.classList.remove('cookie-banner-hide');
        this.isVisible = false;
      }, 300);
    }
  }

  /**
   * Mostra dettagli cookie
   */
  showDetails() {
    if (this.overlay) {
      // Carica preferenze esistenti
      this.loadCurrentPreferences();
      
      this.overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Focus per accessibilità
      const closeBtn = document.getElementById('cookie-modal-close');
      closeBtn?.focus();
    }
  }

  /**
   * Nasconde dettagli cookie
   */
  hideDetails() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /**
   * Carica preferenze correnti nel modal
   */
  loadCurrentPreferences() {
    const categories = this.consent?.categories || this.config.categories;
    
    Object.keys(categories).forEach(category => {
      const checkbox = document.getElementById(`cat-${category}`);
      if (checkbox) {
        checkbox.checked = categories[category];
      }
    });
  }

  /**
   * Accetta tutti i cookie
   */
  acceptAll() {
    const consent = {
      categories: {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true
      },
      timestamp: new Date().toISOString()
    };

    this.saveConsent(consent);
    this.hide();
    this.hideDetails();
  }

  /**
   * Rifiuta cookie non necessari
   */
  rejectAll() {
    const consent = {
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
      },
      timestamp: new Date().toISOString()
    };

    this.saveConsent(consent);
    this.hide();
    this.hideDetails();
  }

  /**
   * Accetta solo cookie selezionati
   */
  acceptSelected() {
    const categories = {};
    
    Object.keys(this.config.categories).forEach(category => {
      const checkbox = document.getElementById(`cat-${category}`);
      categories[category] = checkbox ? checkbox.checked : this.config.categories[category];
    });

    const consent = {
      categories,
      timestamp: new Date().toISOString()
    };

    this.saveConsent(consent);
    this.hide();
    this.hideDetails();
  }

  /**
   * Salva consenso
   */
  saveConsent(consent) {
    this.consent = consent;
    
    // Salva in localStorage
    localStorage.setItem(this.config.cookieName, JSON.stringify(consent));
    
    // Salva anche cookie per compatibilità server-side
    this.setCookie(this.config.cookieName, JSON.stringify(consent), this.config.cookieExpiry);
    
    // Applica consenso
    this.applyConsent();
    
    // Evento personalizzato
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: consent 
    }));
    
    console.log('Cookie consent saved:', consent);
  }

  /**
   * Recupera consenso salvato
   */
  getStoredConsent() {
    try {
      // Prova localStorage prima
      const stored = localStorage.getItem(this.config.cookieName);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Fallback su cookie
      const cookieValue = this.getCookie(this.config.cookieName);
      if (cookieValue) {
        return JSON.parse(cookieValue);
      }
    } catch (e) {
      console.warn('Error parsing cookie consent:', e);
    }
    
    return null;
  }

  /**
   * Applica consenso (carica/rimuove script)
   */
  applyConsent() {
    if (!this.consent) return;

    const { categories } = this.consent;

    // Google Analytics
    if (categories.analytics) {
      this.loadGoogleAnalytics();
    } else {
      this.removeGoogleAnalytics();
    }

    // Facebook Pixel
    if (categories.marketing) {
      this.loadFacebookPixel();
    } else {
      this.removeFacebookPixel();
    }

    // Cookie di preferenze
    if (categories.preferences) {
      this.enablePreferences();
    }
  }

  /**
   * Carica Google Analytics
   */
  loadGoogleAnalytics() {
    if (window.gtag) return; // Già caricato

    // Sostituisci con il tuo GA4 ID
    const GA_ID = 'G-XXXXXXXXXX';
    
    // Script GA
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Configurazione
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', GA_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
      
      console.log('Google Analytics loaded');
    };
  }

  /**
   * Rimuove Google Analytics
   */
  removeGoogleAnalytics() {
    // Rimuove script
    document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(script => {
      script.remove();
    });

    // Pulisce variabili globali
    delete window.gtag;
    delete window.dataLayer;

    // Rimuove cookie GA
    this.deleteCookie('_ga');
    this.deleteCookie('_gid');
    this.deleteCookie('_gat');
  }

  /**
   * Carica Facebook Pixel
   */
  loadFacebookPixel() {
    if (window.fbq) return; // Già caricato

    // Sostituisci con il tuo Pixel ID
    const PIXEL_ID = 'XXXXXXXXXX';

    (function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');

    console.log('Facebook Pixel loaded');
  }

  /**
   * Rimuove Facebook Pixel
   */
  removeFacebookPixel() {
    delete window.fbq;
    document.querySelectorAll('script[src*="fbevents.js"]').forEach(script => {
      script.remove();
    });

    this.deleteCookie('_fbp');
    this.deleteCookie('_fbc');
  }

  /**
   * Abilita cookie di preferenze
   */
  enablePreferences() {
    // Carica preferenze salvate
    const theme = localStorage.getItem('theme_preference');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /**
   * Utility: Set Cookie
   */
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  /**
   * Utility: Get Cookie
   */
  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * Utility: Delete Cookie
   */
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  /**
   * API pubblica: Revoca consenso (mostra banner)
   */
  revoke() {
    localStorage.removeItem(this.config.cookieName);
    this.deleteCookie(this.config.cookieName);
    this.consent = null;
    this.show();
  }

  /**
   * API pubblica: Ottieni stato consenso
   */
  getConsent() {
    return this.consent;
  }

  /**
   * API pubblica: Verifica consenso per categoria
   */
  hasConsent(category) {
    return this.consent?.categories?.[category] || false;
  }
}

// ===== INIZIALIZZAZIONE =====
let cookieBanner;

// Inizializza quando DOM è pronto
function initCookieBanner() {
  cookieBanner = new CookieBanner({
    showDelay: 500,
    cookieExpiry: 365
  });

  // API globale
  window.CookieBanner = cookieBanner;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
} else {
  initCookieBanner();
}

// Export per moduli
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CookieBanner;
}
