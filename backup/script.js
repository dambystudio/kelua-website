// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Active navigation link highlight
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Navbar background change on scroll with enhanced effects
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 6px 40px rgba(212, 175, 55, 0.4)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(212, 175, 55, 0.3)';
    }
});

// Enhanced Intersection Observer for professional animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about-card')) {
                entry.target.style.animation = 'slideInLeft 0.8s ease forwards';
            } else if (entry.target.classList.contains('service-item')) {
                entry.target.style.animation = 'scaleIn 0.8s ease forwards';
            } else if (entry.target.classList.contains('contact-card')) {
                entry.target.style.animation = 'slideInRight 0.8s ease forwards';
            } else {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.about-card, .service-item, .contact-card, .fashion-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Add professional hover effects to buttons with golden glow
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.6)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        if (this.classList.contains('btn-primary')) {
            this.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        } else {
            this.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)';
        }
    });
});

// Enhanced contact card hover effects with golden theme
document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(15px) scale(1.03)';
        this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5)';
        this.style.borderColor = '#d4af37';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        this.style.borderColor = 'rgba(212, 175, 55, 0.2)';
    });
});

// Enhanced service item hover effects
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-20px) scale(1.05)';
        this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
        this.style.borderColor = '#d4af37';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        this.style.borderColor = 'rgba(212, 175, 55, 0.2)';
    });
});

// Enhanced fashion card animations with golden theme
document.querySelectorAll('.fashion-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-20px) rotate(3deg) scale(1.05)';
        this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
        this.style.borderColor = '#d4af37';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
        this.style.borderColor = 'rgba(212, 175, 55, 0.2)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Year badge animation in about section
const yearBadge = document.querySelector('.year-badge');
if (yearBadge) {
    const observerYear = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                yearBadge.style.animation = 'pulse 2s infinite';
            }
        });
    }, { threshold: 0.5 });
    
    observerYear.observe(yearBadge);
}

// Add pulse animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// La funzione typing effect per hero-title è stata rimossa perché l'elemento non esiste più
document.addEventListener('DOMContentLoaded', () => {
    // Codice rimosso - hero-title non esiste più nel DOM
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Add click effect to logo
document.querySelector('.logo').addEventListener('click', () => {
    document.querySelector('.logo').style.animation = 'spin 0.5s ease';
    setTimeout(() => {
        document.querySelector('.logo').style.animation = '';
    }, 500);
});

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// Advanced particle system for professional look
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, rgba(212, 175, 55, 0.2) 100%);
            border-radius: 50%;
            left: ${left}%;
            top: 100%;
            animation: float-up ${duration}s ${delay}s infinite linear;
            box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.5);
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Enhanced parallax effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero, .about-section, .contact-section');
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Parallax for fashion cards
        const fashionCards = document.querySelectorAll('.fashion-card');
        fashionCards.forEach((card, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            card.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Professional loading sequence
function initLoadingSequence() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        transition: opacity 0.8s ease;
    `;
    
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            width: 80px;
            height: 80px;
            border: 3px solid rgba(212, 175, 55, 0.3);
            border-top: 3px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        "></div>
        <div style="
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #d4af37;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            animation: pulse 2s ease-in-out infinite;
        ">Kelua</div>
    `;
    
    loadingOverlay.appendChild(loader);
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loadingOverlay);
        }, 800);
    }, 2000);
}

// Professional cursor trail effect
function initCursorTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
                dot.style.opacity = (trailLength - index) / trailLength;
                dot.style.transform = `scale(${(trailLength - index) / trailLength})`;
            }, index * 30);
        });
    });
}

// Professional scroll indicator
function initScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #d4af37 0%, #b8960a 100%);
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
        indicator.style.width = scrollPercent + '%';
    });
}

// Initialize all professional effects
document.addEventListener('DOMContentLoaded', () => {
    initLoadingSequence();
    createParticles();
    initParallax();
    initCursorTrail();
    initScrollIndicator();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% { 
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
});

// Form di contatto
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Raccolta dati form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                requestType: document.getElementById('request-type').value,
                message: document.getElementById('message').value
            };
            
            // Qui in un'implementazione reale invieresti i dati a un server
            // Per ora creiamo solo un feedback visivo
            
            // Nascondi il form
            contactForm.style.opacity = '0.5';
            contactForm.style.pointerEvents = 'none';
            
            // Mostra messaggio di successo
            const formContainer = document.querySelector('.contact-form-container');
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Grazie ${formData.name}!</h3>
                <p>Abbiamo ricevuto il tuo messaggio e ti contatteremo presto.</p>
                <button class="btn btn-secondary reset-form">Invia un altro messaggio</button>
            `;
            
            formContainer.appendChild(successMessage);
            
            // Aggiungi listener per resettare il form
            const resetButton = document.querySelector('.reset-form');
            if (resetButton) {
                resetButton.addEventListener('click', function() {
                    // Rimuovi messaggio di successo
                    successMessage.remove();
                    
                    // Resetta e mostra il form
                    contactForm.reset();
                    contactForm.style.opacity = '1';
                    contactForm.style.pointerEvents = 'auto';
                });
            }
        });
    }
});

// Risoluzione problemi di overflow e animazioni tagliate
document.addEventListener('DOMContentLoaded', function() {
    // Aggiungiamo un piccolo ritardo per assicurarci che gli elementi siano caricati
    setTimeout(() => {
        // Aggiungiamo margine in basso agli elementi con animazioni
        const animatedElements = document.querySelectorAll('[class*="fadeIn"], [class*="slideIn"]');
        animatedElements.forEach(el => {
            // Assicuriamoci che gli elementi abbiano spazio per le loro animazioni
            el.style.marginBottom = '10px';
        });
        
        // Fix per overflow nelle sezioni
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.overflow = 'visible';
        });
    }, 100);
});

// Animazione numerica per le statistiche
document.addEventListener('DOMContentLoaded', function() {
    const animateNumbers = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = target.textContent;
                    let currentNumber = 0;
                    
                    // Estrai il numero dalla stringa (rimuovi + e %)
                    const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
                    const suffix = finalNumber.replace(/[\d]/g, '');
                    
                    const increment = numericValue / 50; // Anima in 50 step
                    
                    const timer = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= numericValue) {
                            target.textContent = finalNumber;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentNumber) + suffix;
                        }
                    }, 30);
                    
                    observer.unobserve(target);
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    };
    
    // Avvia l'animazione
    animateNumbers();
    
    // Parallasse leggero per la gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        galleryItems.forEach((item, index) => {
            const yPos = -(scrolled * (0.1 + index * 0.02));
            item.style.transform = `translateY(${yPos}px)`;
        });
    });
});

// Fix per problemi di layout e overflow
document.addEventListener('DOMContentLoaded', function() {
    // Fix per elementi che escono dal viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = 'visible';
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Osserva tutti gli elementi animati
    const animatedElements = document.querySelectorAll(
        '[class*="fadeIn"], [class*="slideIn"], .service-item, .gallery-item, .contact-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Fix per scroll smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 120; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fix per viewport height su mobile
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
});
