// ============================================
// MINIMAL MARIMBA - Main JavaScript
// ============================================

(function() {
    'use strict';

    // ==========================================
    // HEADER - Scroll & Mobile Menu
    // ==========================================
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
    
    // Mobile menu toggle
    if (burger && mobileMenu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('header__burger--active');
            mobileMenu.classList.toggle('header__mobile-menu--active');
            document.body.style.overflow = mobileMenu.classList.contains('header__mobile-menu--active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = document.querySelectorAll('.header__mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('header__burger--active');
                mobileMenu.classList.remove('header__mobile-menu--active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // POPUP / MODAL
    // ==========================================
    const popup = document.getElementById('popup');
    const popupTriggers = document.querySelectorAll('[data-popup]');
    const popupCloseBtns = document.querySelectorAll('.popup__close, .popup__backdrop');
    
    if (popup) {
        // Open popup
        popupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                popup.classList.add('popup--active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Close popup
        popupCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                popup.classList.remove('popup--active');
                document.body.style.overflow = '';
            });
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.classList.contains('popup--active')) {
                popup.classList.remove('popup--active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================
    // ACCORDION
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion__item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        const body = item.querySelector('.accordion__body');
        
        if (header && body) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('accordion__item--active');
                
                // Close all other items (optional - comment out for multi-open)
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('accordion__item--active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('accordion__item--active');
                } else {
                    item.classList.add('accordion__item--active');
                }
            });
        }
    });

    // ==========================================
    // GALLERY + LIGHTBOX
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxBackdrop = document.querySelector('.lightbox__backdrop');
    const lightboxPrev = document.querySelector('.lightbox__nav--prev');
    const lightboxNext = document.querySelector('.lightbox__nav--next');
    
    let currentImageIndex = 0;
    const images = [];
    
    // Collect gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('div');
        const caption = item.querySelector('.gallery__caption');
        const description = item.querySelector('.gallery__description');
        
        if (img) {
            images.push({
                // For demo purposes, using gradient backgrounds
                // In production, would use actual image src
                src: window.getComputedStyle(img).background,
                caption: caption ? caption.textContent : '',
                description: description ? description.textContent : ''
            });
            
            item.addEventListener('click', function() {
                openLightbox(index);
            });
        }
    });
    
    function openLightbox(index) {
        if (!lightbox) return;
        
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('lightbox--active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }
    
    function updateLightboxImage() {
        if (!lightboxImage || !images[currentImageIndex]) return;
        
        const current = images[currentImageIndex];
        // For demo, we'll set a placeholder
        lightboxImage.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%230a0a0a"/%3E%3Ctext x="50%25" y="50%25" font-family="monospace" font-size="20" fill="%2300ff9d" text-anchor="middle" dominant-baseline="middle"%3E' + current.caption + '%3C/text%3E%3C/svg%3E';
        lightboxImage.alt = current.caption;
        
        if (lightboxCaption) {
            lightboxCaption.textContent = current.caption + (current.description ? ' - ' + current.description : '');
        }
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    // Lightbox event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('lightbox--active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    // ==========================================
    // FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Simulate form submission
            console.log('Form submitted:', data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'contact-form__success';
            successMessage.textContent = '¡Registro exitoso! Te enviaremos la confirmación por correo.';
            
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            
            // Reset form
            contactForm.reset();
            
            // Remove success message after 5 seconds
            setTimeout(function() {
                successMessage.remove();
            }, 5000);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.validity.valid) {
                    this.classList.add('form__input--error');
                } else {
                    this.classList.remove('form__input--error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.validity.valid) {
                    this.classList.remove('form__input--error');
                }
            });
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe gallery items
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    // ==========================================
    // ACTIVE LINK HIGHLIGHT
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = header.offsetHeight;
            
            if (window.pageYOffset >= sectionTop - headerHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('header__link--active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('header__link--active');
            }
        });
    });

    // ==========================================
    // INITIALIZE
    // ==========================================
    console.log('✨ Minimal Marimba - Resonancias Electrónicas 2026');
    console.log('🎵 Website initialized successfully');

})();
