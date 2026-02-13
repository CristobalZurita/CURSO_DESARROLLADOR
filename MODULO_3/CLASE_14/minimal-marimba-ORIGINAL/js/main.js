// ============================================
// MINIMAL MARIMBA - Main JavaScript
// ============================================

(function() {
    'use strict';

    console.log('✨ Minimal Marimba - Resonancias Electrónicas 2026');

    // ==========================================
    // HEADER - Scroll & Mobile Menu
    // ==========================================
    const header = document.getElementById('header');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');
    
    function updateHeaderScrolled() {
        if (window.scrollY > 50) {
            header?.classList.add('header--scrolled');
        } else {
            header?.classList.remove('header--scrolled');
        }
    }

    function updateActiveLink() {
        if (!sections.length || !navLinks.length) return;

        let current = '';
        const headerHeight = header?.offsetHeight || 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - headerHeight - 100) {
                current = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const isSectionLink = href.startsWith('#') && href.length > 1;
            link.classList.toggle('header__link--active', isSectionLink && href === `#${current}`);
        });
    }

    // Single throttled scroll handler for all navbar state
    let scrollThrottled = false;
    function onScroll() {
        if (scrollThrottled) return;

        scrollThrottled = true;
        requestAnimationFrame(() => {
            updateHeaderScrolled();
            updateActiveLink();
            scrollThrottled = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    // Mobile menu toggle
    if (burger && mobileMenu) {
        burger.addEventListener('click', function() {
            const isActive = burger.classList.toggle('header__burger--active');
            mobileMenu.classList.toggle('header__mobile-menu--active');
            mobileMenu.hidden = !isActive;
            burger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
        
        const mobileLinks = document.querySelectorAll('.header__mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('header__burger--active');
                mobileMenu.classList.remove('header__mobile-menu--active');
                mobileMenu.hidden = true;
                burger.setAttribute('aria-expanded', false);
                document.body.style.overflow = '';
            });
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
        popupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                popup.classList.add('popup--active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        popupCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                popup.classList.remove('popup--active');
                document.body.style.overflow = '';
            });
        });
        
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
    document.querySelectorAll('.accordion__item').forEach(item => {
        const header = item.querySelector('.accordion__header');
        if (header) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('accordion__item--active');
                
                // Close all others (optional)
                document.querySelectorAll('.accordion__item').forEach(other => {
                    if (other !== item) other.classList.remove('accordion__item--active');
                });
                
                item.classList.toggle('accordion__item--active', !isActive);
            });
        }
    });

    // ==========================================
    // GALLERY + LIGHTBOX
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    let currentImageIndex = 0;
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    function openLightbox(index) {
        if (!lightbox) return;
        currentImageIndex = index;
        
        const item = galleryItems[index];
        const img = item?.querySelector('img');
        const caption = item?.querySelector('.gallery__caption')?.textContent || '';
        
        if (lightboxImage && img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
        }
        
        lightbox.classList.add('lightbox--active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentImageIndex);
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox(currentImageIndex);
    }
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox__backdrop')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox__nav--prev')?.addEventListener('click', showPrevImage);
    document.querySelector('.lightbox__nav--next')?.addEventListener('click', showNextImage);
    
    document.addEventListener('keydown', function(e) {
        if (!lightbox?.classList.contains('lightbox--active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPrevImage();
        else if (e.key === 'ArrowRight') showNextImage();
    });

    // ==========================================
    // FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'contact-form__success';
            successMessage.textContent = '¡Registro exitoso! Te enviaremos la confirmación por correo.';
            
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            contactForm.reset();
            
            setTimeout(() => successMessage.remove(), 5000);
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    console.log('🎵 Website initialized successfully');

})();
