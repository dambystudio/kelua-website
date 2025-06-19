// Scroll Scrubbing Effects for Kelua Website

class ScrollScrubbing {
  constructor() {
    this.init();
  }

  init() {
    this.createScrollProgress();
    this.setupIntersectionObserver();
    this.setupParallaxEffect();
    this.setupScrollAnimations();
  }

  // Progress bar dello scroll
  createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // Intersection Observer per animazioni al scroll
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Osserva tutti gli elementi con classe scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
  }
  // Effetto parallax per l'immagine hero
  setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      const scrollProgress = Math.min(scrolled / heroHeight, 1);
      
      parallaxElements.forEach(element => {
        // Effetto parallax con zoom dinamico
        const rate = scrolled * -0.3;
        const scale = 1.1 + (scrollProgress * 0.1);
        const brightness = 0.7 + (scrollProgress * 0.2);
        
        element.style.transform = `translate3d(0, ${rate}px, 0) scale(${scale})`;
        element.style.filter = `brightness(${brightness}) contrast(1.1)`;
      });
    });
  }

  // Animazioni avanzate basate sullo scroll
  setupScrollAnimations() {
    // Navbar background transparency
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const opacity = Math.min(scrolled / 100, 0.95);
        navbar.style.background = `rgba(0, 0, 0, ${opacity})`;
      });
    }

    // Fade in/out elements based on scroll position
    const fadeElements = document.querySelectorAll('.scroll-fade');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Gallery items staggered animation
    this.setupGalleryAnimations();

    // Stats counter animation
    this.setupStatsAnimation();
  }

  // Animazioni per la galleria
  setupGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
          }, index * 100);
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    galleryItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px) scale(0.95)';
      item.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      galleryObserver.observe(item);
    });
  }

  // Animazione contatori nelle statistiche
  setupStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.textContent);
          this.animateCounter(entry.target, 0, target, 2000);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // Helper per animare i contatori
  animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      if (originalText.includes('+')) {
        element.textContent = current + '+';
      } else if (originalText.includes('%')) {
        element.textContent = current + '%';
      } else {
        element.textContent = current;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Smooth scroll per i link di navigazione
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80; // Offset per navbar fissa
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
  new ScrollScrubbing();
});

// Performance optimization: throttle scroll events
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}
