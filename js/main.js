document.addEventListener('DOMContentLoaded', function() {
    // ===== HEADER SCROLL EFFECT =====
    const siteHeader = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    // Initialize header state
    function updateHeader() {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }

    // Initial header state
    updateHeader();
    window.addEventListener('scroll', updateHeader);

    // ===== MOBILE MENU TOGGLE =====
    if (menuToggle && mobileMenu) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);
        
        // Set initial state
        const iconOpen = menuToggle.querySelector('.icon-open');
        const iconClose = menuToggle.querySelector('.icon-close');
        if (iconOpen && iconClose) {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
        
        // Close mobile menu function
        function closeMobileMenu() {
            body.classList.remove('mobile-menu-active');
            mobileMenu.classList.remove('active');
            overlay.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
            
            if (iconOpen && iconClose) {
                iconOpen.style.display = 'block';
                iconClose.style.display = 'none';
            }
            
            // Re-enable body scroll
            body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        }
        
        // Handle escape key
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        }
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', function(e) {
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
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a nav link
        const navLinks = mobileMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when window is resized to desktop
        function handleResize() {
            if (window.innerWidth > 992) {
                closeMobileMenu();
            }
        }
        
        window.addEventListener('resize', handleResize);
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetId === '#') return;

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== GALLERY FILTERING =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 10);
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
    }

    // ===== LIGHTBOX =====
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
                    openLightbox(index);
                });
            }
        });
    }

    function openLightbox(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        
        currentImageIndex = index;
        const image = images[currentImageIndex];
        
        lightbox.querySelector('img').src = image.src;
        lightbox.querySelector('img').alt = image.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Lightbox event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openLightbox(currentImageIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => openLightbox(currentImageIndex + 1));
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
        });

    // ===== DONATION FORM =====
    const donationAmounts = document.querySelectorAll('.donation-amount');
    const customAmountInput = document.querySelector('.custom-amount input');
    
    donationAmounts.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            donationAmounts.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Clear custom amount
            customAmountInput.value = '';
        });
    });
    
    customAmountInput.addEventListener('focus', () => {
        donationAmounts.forEach(btn => btn.classList.remove('active'));
    });
    
    customAmountInput.addEventListener('input', (e) => {
        // Ensure only numbers and decimal points are entered
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    });
    
    // Handle donation button click
    const donateButton = document.querySelector('.btn-donate');
    if (donateButton) {
        donateButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            let amount = '';
            const activeAmount = document.querySelector('.donation-amount.active');
            
            if (activeAmount) {
                amount = activeAmount.getAttribute('data-amount');
            } else if (customAmountInput.value) {
                amount = parseFloat(customAmountInput.value).toFixed(2);
                if (isNaN(amount) || amount <= 0) {
                    alert('Please enter a valid donation amount');
                    return;
                }
            } else {
                alert('Please select or enter a donation amount');
                return;
            }
            
            // Here you would typically integrate with a payment processor
            console.log(`Processing donation of $${amount}`);
            alert(`Thank you for your donation of $${amount}!`);
        });
    }
    
    // ===== CONTACT FORM =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                alert('Please fill in all required fields');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                submitButton.textContent = 'Message Sent!';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 3000);
                
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
            }, 1500);
        });
    }
    
    // Email validation helper function
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

});
