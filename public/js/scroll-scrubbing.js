// Modern Animation System for Kelua - Professional UX/UI
class KeluaAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollEffects();
    this.setupParallax();
    this.setupMicroInteractions();
    this.setupPerformanceOptimization();
  }

  // Advanced Intersection Observer with stagger animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          // Add stagger effect for multiple elements
          setTimeout(() => {
            element.classList.add('animate-in');
            this.triggerCustomAnimation(element);
          }, delay * 1000);
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el);
    });
  }

  // Custom animation triggers
  triggerCustomAnimation(element) {
    const animationType = element.dataset.animation;
    
    switch(animationType) {
      case 'fade-up':
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        break;
      case 'scale-in':
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        break;
      case 'slide-left':
        element.style.transform = 'translateX(0)';
        element.style.opacity = '1';
        break;
      case 'rotate-in':
        element.style.transform = 'rotate(0deg) scale(1)';
        element.style.opacity = '1';
        break;
      default:
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
    }
  }

  // Advanced parallax with performance optimization
  setupParallax() {
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Modern scroll effects with momentum
  setupScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Navbar hide/show with smooth animation
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      
      // Add scroll-based classes
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }

  // Premium micro-interactions
  setupMicroInteractions() {
    // Magnetic effect for buttons
    document.querySelectorAll('.btn, .nav-link, .hero-card').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });

    // Ripple effect for interactive elements
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Performance optimizations
  setupPerformanceOptimization() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }

    // Use GPU acceleration for smooth animations
    document.querySelectorAll('.scroll-animate, .parallax-element, .navbar').forEach(element => {
      element.style.willChange = 'transform, opacity';
      element.style.transform = 'translateZ(0)';
    });
  }
}

// CSS Custom Properties for dynamic theming
document.documentElement.style.setProperty('--scroll-progress', '0');

// Track scroll progress
window.addEventListener('scroll', () => {
  const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
}, { passive: true });

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new KeluaAnimations();
});

// Add CSS keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .scroll-animate.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  /* Advanced animations */
  .scroll-animate[data-animation="scale-in"] {
    transform: scale(0.9);
  }

  .scroll-animate[data-animation="slide-left"] {
    transform: translateX(-50px);
  }

  .scroll-animate[data-animation="rotate-in"] {
    transform: rotate(-5deg) scale(0.9);
  }
`;
document.head.appendChild(style);
