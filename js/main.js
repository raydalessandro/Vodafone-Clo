// JavaScript consolidato per GitHub
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const html = document.documentElement;

// Cookie banner GDPR
(function(){
    const k = "cookieConsent2025";
    if(!localStorage.getItem(k)){
        const b = document.getElementById('cookie');
        b.style.display = 'block';
        document.getElementById('okCookie').onclick = function(){
            localStorage.setItem(k,"1");
            b.remove();
        }
    }
})();

// Navbar scroll
window.addEventListener('scroll', function(){
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    
    // Back to top button
    const backTop = document.getElementById('backTop');
    if(backTop){
        if(window.scrollY > 300){
            backTop.classList.add('show');
        } else {
            backTop.classList.remove('show');
        }
    }
});

// Mobile menu con scroll ottimizzato
function toggleMenu(open){
    const isOpen = open !== undefined ? open : !mobileMenuBtn.classList.contains('active');
    mobileMenuBtn.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('active', isOpen);
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    
    // Gestione scroll semplificata
    if(isOpen) {
        // Blocca solo il body scroll, permetti menu scroll
        document.body.style.overflow = 'hidden';
    } else {
        // Ripristina body scroll
        document.body.style.overflow = '';
    }
}

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function(){
        toggleMenu();
    });
}

if(mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
            // Chiudi il menu per tutti i link
            toggleMenu(false);
        });
    });
}

// Smooth scroll solo per link interni (che iniziano con #)
document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({behavior:'smooth', block:'start'});
        }
    });
});

// Store open/closed status
(function(){
    const now = new Date();
    // Fuso orario Europa/Roma
    const fmt = new Intl.DateTimeFormat('it-IT', {
        timeZone:'Europe/Rome',
        hour:'2-digit',
        minute:'2-digit',
        hour12:false
    });
    const timeParts = fmt.formatToParts(now);
    const hh = parseInt(timeParts.find(function(p){ return p.type === 'hour'; }).value);
    const mm = parseInt(timeParts.find(function(p){ return p.type === 'minute'; }).value);
    const cur = hh * 60 + mm;

    document.querySelectorAll('.open-badge[data-hours]').forEach(function(el){
        const range = el.dataset.hours.split('-');
        const openParts = range[0].split(':');
        const closeParts = range[1].split(':');
        const ah = parseInt(openParts[0]);
        const am = parseInt(openParts[1]);
        const bh = parseInt(closeParts[0]);
        const bm = parseInt(closeParts[1]);
        const open = (cur >= (ah * 60 + am) && cur <= (bh * 60 + bm));
        el.textContent = open ? 'Aperto ora' : 'Chiuso';
        el.classList.toggle('closed', !open);
    });
})();

// Phone tilt parallax - disabilita su touch
const mock = document.querySelector('.mock');
if (matchMedia('(pointer:fine)').matches && mock){
    mock.addEventListener('mousemove', function(e){
        const r = mock.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        mock.style.transform = 'perspective(1200px) rotateY(' + (-10 + x*10) + 'deg) rotateX(' + (4 - y*6) + 'deg) translateY(' + (y*-6) + 'px)';
    });
    mock.addEventListener('mouseleave', function(){
        mock.style.transform = 'perspective(1200px) rotateY(-10deg) rotateX(4deg)';
    });
}
