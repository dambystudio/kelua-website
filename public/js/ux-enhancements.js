// Kelua UX Enhancements - Professional User Experience
class KeluaUXEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.createScrollProgress();
    this.createToastSystem();
    this.createLoadingStates();
    this.enhanceFormExperience();
    this.addMicroFeedback();
    this.setupSmartNavigation();
    this.addAccessibilityEnhancements();
  }

  // Modern Scroll Progress Indicator
  createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-modern';
    progressBar.innerHTML = `
      <div class="scroll-progress-fill"></div>
      <div class="scroll-progress-glow"></div>
    `;
    document.body.appendChild(progressBar);

    const fill = progressBar.querySelector('.scroll-progress-fill');
    const glow = progressBar.querySelector('.scroll-progress-glow');

    let ticking = false;
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      
      fill.style.width = `${Math.min(scrolled, 100)}%`;
      glow.style.left = `${Math.min(scrolled, 100)}%`;
      
      // Add dynamic color based on scroll position
      const hue = Math.min(scrolled * 1.2, 120);
      fill.style.background = `linear-gradient(90deg, #ddbb76, hsl(${hue}, 70%, 50%))`;
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  // Toast Notification System
  createToastSystem() {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = (message, type = 'info', duration = 4000) => {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      `;
      
      toastContainer.appendChild(toast);
      
      // Auto remove
      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
      
      return toast;
    };
  }

  // Loading States for Interactive Elements
  createLoadingStates() {
    // Add loading capability to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      const originalContent = btn.innerHTML;
      
      btn.setLoading = (isLoading) => {
        if (isLoading) {
          btn.classList.add('loading');
          btn.disabled = true;
          btn.innerHTML = `
            <div class="btn-spinner"></div>
            <span>Caricamento...</span>
          `;
        } else {
          btn.classList.remove('loading');
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }
      };
    });
  }

  // Enhanced Form Experience
  enhanceFormExperience() {
    // Floating labels and validation
    document.querySelectorAll('input, textarea').forEach(input => {
      if (input.type === 'hidden') return;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'input-enhanced';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      
      // Add floating label if placeholder exists
      if (input.placeholder) {
        const label = document.createElement('label');
        label.className = 'floating-label';
        label.textContent = input.placeholder;
        label.setAttribute('for', input.id || `input-${Date.now()}`);
        if (!input.id) input.id = `input-${Date.now()}`;
        
        wrapper.appendChild(label);
        input.placeholder = '';
      }
      
      // Add validation feedback
      const feedback = document.createElement('div');
      feedback.className = 'input-feedback';
      wrapper.appendChild(feedback);
      
      // Input events
      input.addEventListener('focus', () => {
        wrapper.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        wrapper.classList.remove('focused');
        if (input.value.trim() !== '') {
          wrapper.classList.add('filled');
        } else {
          wrapper.classList.remove('filled');
        }
      });
      
      input.addEventListener('input', () => {
        this.validateInput(input, feedback);
      });
    });
  }

  validateInput(input, feedback) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';
    
    // Basic validation rules
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
      message = isValid ? 'Email valida ✓' : 'Formato email non valido';
    }
    
    if (input.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
      isValid = phoneRegex.test(value);
      message = isValid ? 'Numero valido ✓' : 'Formato numero non valido';
    }
    
    if (input.required && !value) {
      isValid = false;
      message = 'Campo obbligatorio';
    }
    
    // Update UI
    const wrapper = input.closest('.input-enhanced');
    wrapper.classList.toggle('valid', isValid && value);
    wrapper.classList.toggle('invalid', !isValid && value);
    
    feedback.textContent = message;
    feedback.className = `input-feedback ${isValid ? 'valid' : 'invalid'}`;
  }

  // Micro-feedback and Haptic-like Effects
  addMicroFeedback() {
    // Button click feedback
    document.querySelectorAll('.btn, .nav-link, .hero-card').forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRippleEffect(e, element);
        this.addClickFeedback(element);
      });
    });
    
    // Hover sound effect simulation
    document.querySelectorAll('a, button, .hover-lift').forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.filter = 'brightness(1.05)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.filter = 'brightness(1)';
      });
    });
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleExpand 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  addClickFeedback(element) {
    element.style.transform = 'scale(0.98)';
    element.style.filter = 'brightness(1.1)';
    
    setTimeout(() => {
      element.style.transform = '';
      element.style.filter = '';
    }, 150);
  }

  // Smart Navigation with breadcrumbs
  setupSmartNavigation() {
    // Add breadcrumb for non-homepage
    if (window.location.pathname !== '/') {
      this.createBreadcrumb();
    }
    
    // Smart back button
    this.createSmartBackButton();
  }

  createBreadcrumb() {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb-modern';
    breadcrumb.innerHTML = `
      <a href="/" class="breadcrumb-item">🏠 Home</a>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-current">Saldi</span>
    `;
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.after(breadcrumb);
    }
  }

  createSmartBackButton() {
    // Smart back button disabled per richiesta utente
    // if (document.referrer && document.referrer.includes(window.location.origin)) {
    //   const backBtn = document.createElement('button');
    //   backBtn.className = 'smart-back-btn';
    //   backBtn.innerHTML = '← Indietro';
    //   backBtn.onclick = () => window.history.back();
    //   
    //   document.body.appendChild(backBtn);
    // }
  }

  // Accessibility Enhancements
  addAccessibilityEnhancements() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Salta al contenuto principale';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const main = document.querySelector('main') || document.body;
    if (!main.id) main.id = 'main-content';
    
    // Keyboard navigation enhancements
    this.enhanceKeyboardNavigation();
    
    // Focus management
    this.manageFocus();
  }

  enhanceKeyboardNavigation() {
    let focusableElements = [];
    
    const updateFocusableElements = () => {
      focusableElements = Array.from(document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.disabled && !el.hidden);
    };
    
    updateFocusableElements();
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        updateFocusableElements();
      }
      
      // ESC to close modals/menus
      if (e.key === 'Escape') {
        const menu = document.querySelector('.nav-menu.active');
        if (menu) {
          menu.classList.remove('active');
          document.querySelector('.hamburger.active')?.classList.remove('active');
        }
      }
    });
  }

  manageFocus() {
    // Focus trap for mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
              const firstFocusable = navMenu.querySelector('a, button');
              firstFocusable?.focus();
            }
          }
        });
      });
      
      observer.observe(navMenu, { attributes: true });
    }
  }
}

// CSS Injection for UX Enhancements
const uxStyles = document.createElement('style');
uxStyles.textContent = `
  /* Scroll Progress */
  .scroll-progress-modern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10001;
    backdrop-filter: blur(10px);
  }

  .scroll-progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #ddbb76, #f1c40f);
    transition: width 0.1s ease;
    position: relative;
  }

  .scroll-progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.8), transparent);
    transform: translateX(-10px);
    transition: left 0.1s ease;
  }

  /* Toast System */
  .toast-container {
    position: fixed;
    top: 120px;
    right: 20px;
    z-index: 10002;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .toast {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 12px;
    padding: 16px;
    color: white;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    max-width: 400px;
    animation: toastSlideIn 0.3s ease-out;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .toast-success { border-color: #2ecc71; }
  .toast-error { border-color: #e74c3c; }
  .toast-warning { border-color: #f39c12; }
  .toast-info { border-color: #3498db; }

  .toast-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .toast-success .toast-icon { background: #2ecc71; color: white; }
  .toast-error .toast-icon { background: #e74c3c; color: white; }
  .toast-warning .toast-icon { background: #f39c12; color: white; }
  .toast-info .toast-icon { background: #3498db; color: white; }

  .toast-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  @keyframes toastSlideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes toastSlideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Enhanced Forms */
  .input-enhanced {
    position: relative;
    margin-bottom: 24px;
  }

  .input-enhanced input,
  .input-enhanced textarea {
    width: 100%;
    padding: 16px 12px 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 16px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .input-enhanced input:focus,
  .input-enhanced textarea:focus {
    outline: none;
    border-color: #ddbb76;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
  }

  .floating-label {
    position: absolute;
    left: 12px;
    top: 16px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    transition: all 0.3s ease;
    pointer-events: none;
    background: transparent;
    padding: 0 4px;
  }

  .input-enhanced.focused .floating-label,
  .input-enhanced.filled .floating-label {
    top: -8px;
    left: 8px;
    font-size: 12px;
    color: #ddbb76;
    background: rgba(0, 0, 0, 0.8);
  }

  .input-feedback {
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .input-feedback.valid {
    color: #2ecc71;
  }

  .input-feedback.invalid {
    color: #e74c3c;
  }

  /* Button Loading */
  .btn.loading {
    pointer-events: none;
    opacity: 0.8;
  }

  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Custom Cursor */
  .custom-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    pointer-events: none;
    z-index: 10003;
    border-radius: 50%;
    background: rgba(212, 175, 55, 0.2);
    border: 2px solid rgba(212, 175, 55, 0.5);
    transition: all 0.2s ease;
    backdrop-filter: blur(5px);
  }

  .custom-cursor.hover {
    transform: scale(1.5);
    background: rgba(212, 175, 55, 0.3);
    border-color: #ddbb76;
  }

  .cursor-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: #ddbb76;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  /* Skip Link */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #ddbb76;
    color: #1a1a1a;
    padding: 8px;
    z-index: 10004;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
    transition: top 0.3s ease;
  }

  .skip-link:focus {
    top: 6px;
  }

  /* Breadcrumb */
  .breadcrumb-modern {
    background: rgba(0, 0, 0, 0.8);
    padding: 12px 20px;
    margin-top: 100px;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    font-size: 14px;
  }

  .breadcrumb-item {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .breadcrumb-item:hover {
    color: #ddbb76;
  }

  .breadcrumb-separator {
    margin: 0 8px;
    color: rgba(255, 255, 255, 0.4);
  }

  .breadcrumb-current {
    color: #ddbb76;
    font-weight: 500;
  }

  /* Smart Back Button - Disabled */
  /* .smart-back-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border: 1px solid rgba(212, 175, 55, 0.3);
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 14px;
  }

  .smart-back-btn:hover {
    background: rgba(212, 175, 55, 0.2);
    border-color: #ddbb76;
  } */

  /* Ripple Effect */
  @keyframes rippleExpand {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .toast {
      min-width: calc(100vw - 40px);
      max-width: calc(100vw - 40px);
    }
    
    .custom-cursor {
      display: none;
    }
    
    /* .smart-back-btn {
      bottom: 80px;
    } */
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .scroll-progress-fill,
    .scroll-progress-glow,
    .toast,
    .floating-label,
    .custom-cursor {
      transition: none !important;
      animation: none !important;
    }
  }
`;

document.head.appendChild(uxStyles);

// Initialize UX Enhancements
document.addEventListener('DOMContentLoaded', () => {
  new KeluaUXEnhancements();
  
  // Toast notification removed per user request
  // setTimeout(() => {
  //   window.showToast?.('Benvenuto su Kelua! 🌟', 'success', 3000);
  // }, 1000);
}); 