/* ============================================
   BLUE GRID - FRONTEND MAIN JAVASCRIPT
   ============================================ */

// ============================================
// DATA INITIALIZATION
// ============================================

const SERVICES = [
  { 
    icon: 'fa-store', 
    name: 'E-Commerce Store', 
    description: 'Full-featured online shops with secure checkout and inventory management.' 
  },
  { 
    icon: 'fa-building', 
    name: 'Business Landing Page', 
    description: 'Professional landing pages that convert visitors into customers.' 
  },
  { 
    icon: 'fa-briefcase', 
    name: 'Portfolio Site', 
    description: 'Showcase your work with elegant, customizable galleries.' 
  },
  { 
    icon: 'fa-pen-fancy', 
    name: 'Blog Platform', 
    description: 'Content-focused sites with powerful publishing tools.' 
  },
  { 
    icon: 'fa-calendar-check', 
    name: 'Booking Platform', 
    description: 'Appointment scheduling with automated reminders.' 
  },
  { 
    icon: 'fa-house-chimney', 
    name: 'Real Estate Site', 
    description: 'Property listings with advanced search and filtering.' 
  },
  { 
    icon: 'fa-utensils', 
    name: 'Restaurant Website', 
    description: 'Menu displays, reservations, and online ordering.' 
  },
  { 
    icon: 'fa-calendar-days', 
    name: 'Event Page', 
    description: 'Event promotion with registration and ticketing.' 
  }
];

// Theme configuration
const THEMES = ['dark', 'light', 'navy'];
const THEME_ICONS = {
  dark: 'fa-moon',
  light: 'fa-sun',
  navy: 'fa-grip'
};

// WhatsApp number
const WHATSAPP_NUMBER = '2348087202240';

// ============================================
// STORAGE HELPERS
// ============================================

function getFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Storage read error:', e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write error:', e);
    return false;
  }
}

// ============================================
// THEME MANAGEMENT
// ============================================

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('bluegrid_theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const icon = toggleBtn.querySelector('i');
  if (icon) {
    icon.className = `fa-solid ${THEME_ICONS[theme]} text-lg`;
  }
}

function cycleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') || 'dark';
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % THEMES.length;
  setTheme(THEMES[nextIndex]);
}

function initTheme() {
  const savedTheme = localStorage.getItem('bluegrid_theme');
  if (savedTheme && THEMES.includes(savedTheme)) {
    setTheme(savedTheme);
  } else {
    setTheme('dark');
  }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map((service, index) => `
    <div class="service-card card-base card-hover rounded-2xl p-6 md:p-8 reveal" style="transition-delay: ${index * 0.08}s;">
      <div class="service-icon w-14 h-14 rounded-xl flex items-center justify-center mb-5" style="background: rgba(26, 111, 232, 0.1);">
        <i class="fa-solid ${service.icon} text-2xl" style="color: var(--color-accent);"></i>
      </div>
      <h3 class="font-display text-lg font-semibold mb-2" style="color: var(--fg);">${service.name}</h3>
      <p class="text-sm leading-relaxed" style="color: var(--muted);">${service.description}</p>
    </div>
  `).join('');
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const emptyState = document.getElementById('portfolio-empty');
  
  if (!grid) return;

  const projects = getFromStorage('bluegrid_projects', []);

  if (projects.length === 0) {
    grid.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = projects.map((project, index) => `
    <div class="portfolio-card card-base card-hover rounded-2xl overflow-hidden reveal" style="transition-delay: ${index * 0.08}s;">
      <div class="relative overflow-hidden aspect-video">
        <img 
          src="${project.banner}" 
          alt="${project.name}" 
          class="portfolio-image w-full h-full object-cover"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop'"
        >
      </div>
      <div class="p-6">
        <h3 class="font-display text-lg font-semibold mb-2" style="color: var(--fg);">${project.name}</h3>
        <p class="font-mono text-xs mb-4 truncate" style="color: var(--muted);">${project.url}</p>
        <a 
          href="${project.url}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-accent-hover)]" 
          style="color: var(--color-accent);"
        >
          Visit Site
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>
  `).join('');
}

function renderLogo() {
  const container = document.getElementById('logo-container');
  if (!container) return;
  
  const logoUrl = localStorage.getItem('bluegrid_logo');
  
  if (logoUrl) {
    container.innerHTML = `<img src="${logoUrl}" alt="Blue Grid Logo" class="h-8 md:h-10 object-contain">`;
  } else {
    container.innerHTML = `<span id="logo-text" class="font-display text-xl md:text-2xl font-bold tracking-tight" style="color: var(--fg);">Blue Grid</span>`;
  }
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll effect
  let lastScrollY = 0;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Mobile menu open
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  // Mobile menu close
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = 'var(--muted)';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--color-accent)';
      }
    });
  }, { passive: true });
}

// ============================================
// SCROLL REVEAL
// ============================================

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.classList.add('visible'));
  }
}

// ============================================
// BOOKING FORM
// ============================================

function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const websiteType = document.getElementById('websiteType').value;
    const budget = document.getElementById('budget').value;
    const timeline = document.getElementById('timeline').value || 'Not specified';
    const description = document.getElementById('description').value.trim();

    // Validation
    let isValid = true;
    const requiredFields = ['fullName', 'email', 'phone', 'websiteType', 'budget', 'description'];
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && !field.value.trim()) {
        field.classList.add('input-error');
        isValid = false;
        setTimeout(() => field.classList.remove('input-error'), 500);
      }
    });

    if (!isValid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Build WhatsApp message
    const message = `Hello Blue Grid 👋

I'd like to book a consultation. Here are my details:

👤 Name: ${fullName}
📧 Email: ${email}
📞 Phone: ${phone}
🌐 Type of Website: ${websiteType}
💰 Budget Range: ${budget}
📅 Preferred Timeline: ${timeline}

📝 Project Description:
${description}

Looking forward to hearing from you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showToast('Redirecting to WhatsApp...', 'success');
  });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  
  if (!toast || !toastMessage || !toastIcon) return;

  toastMessage.textContent = message;
  
  if (type === 'error') {
    toastIcon.className = 'fa-solid fa-exclamation-circle text-xl';
    toastIcon.style.color = '#ef4444';
  } else {
    toastIcon.className = 'fa-solid fa-check-circle text-xl';
    toastIcon.style.color = '#22c55e';
  }

  toast.classList.add('toast-visible');
  
  setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, 3000);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', cycleTheme);
  }
  
  // Render components
  renderServices();
  renderPortfolio();
  renderLogo();
  
  // Initialize features
  initNavigation();
  initScrollReveal();
  initBookingForm();
});
