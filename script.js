/* ============================================
   PROJECT IT - JavaScript
   Interacciones, animaciones y funcionalidad
   ============================================ */

'use strict';

// ==========================================
// ANTI-COPY & ANTI-INSPECT PROTECTION
// ==========================================

// Disable keyboard shortcuts for inspect/copy
function disableShortcuts(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S, Ctrl+P
    const blockedKeys = [
        123, // F12
    ];
    
    const blockedCombos = [
        { ctrl: true, shift: true, key: 73 },  // Ctrl+Shift+I (Inspect)
        { ctrl: true, shift: true, key: 74 },  // Ctrl+Shift+J (Console)
        { ctrl: true, key: 85 },               // Ctrl+U (View Source)
        { ctrl: true, key: 67 },               // Ctrl+C (Copy)
        { ctrl: true, key: 86 },               // Ctrl+V (Paste)
        { ctrl: true, key: 88 },               // Ctrl+X (Cut)
        { ctrl: true, key: 83 },               // Ctrl+S (Save)
        { ctrl: true, key: 80 },               // Ctrl+P (Print)
        { ctrl: true, shift: true, key: 67 },  // Ctrl+Shift+C
    ];

    // Check single keys (F12)
    if (blockedKeys.includes(e.keyCode || e.which)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // Check key combinations
    for (const combo of blockedCombos) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = combo.shift ? e.shiftKey : true;
        const keyMatch = (e.keyCode || e.which) === combo.key;

        if (ctrlMatch && shiftMatch && keyMatch) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    return true;
}

// Disable drag events
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

// Disable copy/paste/cut via mouse
document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
});

// Disable context menu via mouse (right click)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Global keydown listener
document.addEventListener('keydown', (e) => {
    return disableShortcuts(e);
});

// Disable developer tools detection (console.log override)
Object.defineProperty(window, 'console', {
    value: console,
    writable: false,
    configurable: false
});

// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. HERO BACKGROUND SLIDER
    // ==========================================
    (function initHeroSlider() {
        const slides = document.querySelectorAll('.hero__slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        const intervalTime = 8000; // 8 seconds

        function goToSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }

        // Start the slider
        let slideInterval = setInterval(nextSlide, intervalTime);

        // Pause on hover (opcional, mejora UX)
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            hero.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, intervalTime);
            });
        }
    })();

    // ==========================================
    // 1. NAVBAR - SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // 2. MOBILE MENU (HAMBURGER)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // 3. ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS
    // ==========================================
    function createScrollReveal() {
        const elements = document.querySelectorAll('.service-card, .about__card, .contact__info-card');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            revealObserver.observe(el);
        });
    }

    createScrollReveal();

    // ==========================================
    // 5. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#FF6B6B';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                showNotification('Por favor completa todos los campos requeridos.', 'error');
                return;
            }

            // Simulate sending
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensaje enviado';
                submitBtn.style.background = 'linear-gradient(135deg, #00D9A6, #6C63FF)';
                
                showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });

        // Reset border color on input
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });
    }

    // ==========================================
    // 6. NOTIFICATION SYSTEM
    // ==========================================
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close" aria-label="Cerrar">&times;</button>
        `;

        document.body.appendChild(notification);

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '12px',
            background: type === 'success' 
                ? 'linear-gradient(135deg, #00D9A6, #6C63FF)' 
                : 'linear-gradient(135deg, #FF6B6B, #FF4757)',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transform: 'translateX(120%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '400px',
        });

        const content = notification.querySelector('.notification__content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.gap = '10px';

        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#fff';
        closeBtn.style.fontSize = '1.5rem';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0 0 0 12px';
        closeBtn.style.opacity = '0.8';

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }

    // ==========================================
    // 7. PARALLAX EFFECT ON HERO
    // ==========================================
    const heroBg = document.querySelector('.hero__bg');
    
    if (heroBg) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            heroBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ==========================================
    // 8. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 9. NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.querySelector('.footer__form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            
            if (input.value.trim()) {
                showNotification('¡Gracias por suscribirte! Recibirás nuestras novedades.', 'success');
                input.value = '';
            } else {
                showNotification('Por favor ingresa un correo válido.', 'error');
            }
        });
    }

    console.log('%c Project IT %c Talento TI que Transforma ',
        'background: #6C63FF; color: #fff; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
        'background: #00D9A6; color: #0B0D1A; padding: 4px 8px; border-radius: 0 4px 4px 0; font-weight: bold;'
    );

});
