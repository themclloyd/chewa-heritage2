// Main application namespace
const ChewaHeritage = {
    // Initialize the application
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.setupServiceWorker();
        this.updateHeader();
    },
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            siteHeader: document.querySelector('.site-header'),
            menuToggle: document.querySelector('.menu-toggle'),
            mobileMenu: document.getElementById('mobile-menu'),
            body: document.body,
            scrollToTop: document.querySelector('.scroll-to-top')
        };
    },
    
    // Bind event listeners
    bindEvents() {
        // Header scroll effect
        window.addEventListener('scroll', () => this.updateHeader());
        
        // Mobile menu
        if (this.elements.menuToggle && this.elements.mobileMenu) {
            this.setupMobileMenu();
        }
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Gallery filtering
        this.setupGalleryFiltering();
        
        // Lazy loading images
        this.setupLazyLoading();
        
        // Lightbox functionality
        this.setupLightbox();
        
        // Form validation
        this.setupFormValidation();
        
        // Scroll to top button
        if (this.elements.scrollToTop) {
            this.elements.scrollToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },
    
    // Update header on scroll
    updateHeader() {
        if (window.scrollY > 50) {
            this.elements.siteHeader?.classList.add('scrolled');
            this.elements.scrollToTop?.classList.add('visible');
        } else {
            this.elements.siteHeader?.classList.remove('scrolled');
            this.elements.scrollToTop?.classList.remove('visible');
        }
    },
    
    // Setup mobile menu functionality
    setupMobileMenu() {
        const { menuToggle, mobileMenu, body } = this.elements;
        const iconOpen = menuToggle.querySelector('.icon-open');
        const iconClose = menuToggle.querySelector('.icon-close');
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        
        // Set initial state
        if (iconOpen && iconClose) {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
        
        // Close mobile menu function
        const closeMobileMenu = () => {
            body.classList.remove('mobile-menu-active');
            mobileMenu.classList.remove('active');
            overlay.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
            
            if (iconOpen && iconClose) {
                iconOpen.style.display = 'block';
                iconClose.style.display = 'none';
            }
            
            body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        };
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = !mobileMenu.classList.contains('active');
            
            // Toggle menu and overlay
            body.classList.toggle('mobile-menu-active', isActive);
            mobileMenu.classList.toggle('active', isActive);
            overlay.style.display = isActive ? 'block' : 'none';
            menuToggle.setAttribute('aria-expanded', isActive);
            
            // Toggle between menu and close icons
            if (iconOpen && iconClose) {
                iconOpen.style.display = isActive ? 'none' : 'block';
                iconClose.style.display = isActive ? 'block' : 'none';
            }
            
            // Prevent body scroll when menu is open
            body.style.overflow = isActive ? 'hidden' : '';
            
            // Close on escape key
            if (isActive) {
                document.addEventListener('keydown', handleEscape);
            } else {
                document.removeEventListener('keydown', handleEscape);
            }
        });
        
        // Close menu when clicking overlay or nav links
        overlay.addEventListener('click', closeMobileMenu);
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when window is resized to desktop
        const handleResize = () => {
            if (window.innerWidth > 992) closeMobileMenu();
        };
        
        window.addEventListener('resize', handleResize);
    },
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                }
            });
        });
    },
    
    // Setup gallery filtering
    setupGalleryFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (!filterButtons.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    const matches = filterValue === 'all' || 
                                  item.getAttribute('data-category') === filterValue;
                    
                    if (matches) {
                        item.style.display = 'block';
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        });
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    },
    
    // Setup lightbox for gallery images
    setupLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-content">
                <img src="" alt="">
            </div>
            <div class="lightbox-nav">
                <button class="lightbox-prev">❮</button>
                <button class="lightbox-next">❯</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        let currentImageIndex = 0;
        const images = [];
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        // Initialize lightbox with all gallery images
        if (galleryItems.length > 0) {
            galleryItems.forEach((item, index) => {
                const img = item.querySelector('img');
                if (img) {
                    images.push({
                        src: img.getAttribute('src'),
                        alt: img.getAttribute('alt'),
                        title: item.querySelector('h3')?.textContent || '',
                        description: item.querySelector('p')?.textContent || ''
                    });
                    
                    // Add click event to open lightbox
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.openLightbox(index, images, lightbox);
                    });
                }
            });
        }

        // Lightbox event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox(lightbox));
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.openLightbox(currentImageIndex - 1, images, lightbox));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.openLightbox(currentImageIndex + 1, images, lightbox));
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });
    },
    
    // Open lightbox with specific image
    openLightbox(index, images, lightbox) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        
        currentImageIndex = index;
        const image = images[index];
        
        lightbox.querySelector('img').src = image.src;
        lightbox.querySelector('img').alt = image.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // Close lightbox
    closeLightbox(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // Setup form validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    },
    
    // Validate form fields
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showError(field, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearError(field);
            }
        });
        
        return isValid;
    },
    
    // Show error message for form field
    showError(field, message) {
        let errorElement = field.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
        field.classList.add('error');
    },
    
    // Clear error message for form field
    clearError(field) {
        const errorElement = field.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    },
    
    // Validate email format
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
       
    // Setup lazy loading for images
    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        } else if ('IntersectionObserver' in window) {
            // Fallback to IntersectionObserver
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
    },
    
    // Setup Intersection Observer for animations
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    },
    
    // Register service worker for PWA capabilities
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
};

// Initialize the application when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ChewaHeritage.init());
} else {
    ChewaHeritage.init();
}
