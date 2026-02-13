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
                    const conceptHeaderTarget = href === '#concepto'
                        ? target.querySelector('.section__container > .section__header')
                        : null;
                    const scrollTarget = conceptHeaderTarget || target;
                    const extraOffset = href === '#concepto' ? 12 : 0;
                    const targetPosition = scrollTarget.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================
    // FLOATING SCROLL TOP BUTTON
    // ==========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // POPUP / MODAL
    // ==========================================
    const popup = document.getElementById('popup');
    const popupTriggers = document.querySelectorAll('[data-popup="announcement"]');
    
    if (popup) {
        const popupCloseBtns = popup.querySelectorAll('.popup__close, .popup__backdrop');

        const closeAnnouncementPopup = function() {
            popup.classList.remove('popup--active');
            document.body.style.overflow = '';
        };

        popupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                popup.classList.add('popup--active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        popupCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeAnnouncementPopup();
            });
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.classList.contains('popup--active')) {
                closeAnnouncementPopup();
            }
        });
    }

    // ==========================================
    // POPUP TICKETS
    // ==========================================
    const ticketsPopup = document.getElementById('ticketsPopup');
    const ticketsTriggers = document.querySelectorAll('[data-popup="tickets"]');

    if (ticketsPopup) {
        const ticketsCloseBtns = ticketsPopup.querySelectorAll('.popup__close, .popup__backdrop');

        const closeTicketsPopup = function() {
            ticketsPopup.classList.remove('popup--active');
            document.body.style.overflow = '';
        };

        ticketsTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                ticketsPopup.classList.add('popup--active');
                document.body.style.overflow = 'hidden';
            });
        });

        ticketsCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeTicketsPopup();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && ticketsPopup.classList.contains('popup--active')) {
                closeTicketsPopup();
            }
        });
    }

    // ==========================================
    // POPUP REPERTORIO (ficha completa por obra)
    // ==========================================
    const repertoirePopup = document.getElementById('repertoirePopup');
    const repertoireCards = document.querySelectorAll('.card[data-work-id]');
    const repertoirePopupTitle = document.getElementById('repertoirePopupTitle');
    const repertoirePopupSubtitle = document.getElementById('repertoirePopupSubtitle');
    const repertoirePopupImage = document.getElementById('repertoirePopupImage');
    const repertoirePopupContent = document.getElementById('repertoirePopupContent');

    const repertoireData = {
        mitos: {
            title: 'Mitos Brasileños (Mitos Brasileiros), Op. 14',
            subtitle: 'Ney Rosauro (1952- ) · Cuarteto de Percusión',
            image: 'assets/images/MITOS.jpg',
            imageAlt: 'Mitos Brasileños de Ney Rosauro',
            bio: [
                'Ney Rosauro nació el 24 de octubre de 1952 en Río de Janeiro, Brasil. Comenzó con la guitarra y, antes de dedicarse por completo a la percusión, trabajó como músico en clubes de Brasilia.',
                'Estudió Composición y Dirección en la Universidad de Brasilia. En 1977 comenzó su formación especializada en percusión con Luiz Anunciação, y en 1980 recibió una beca para estudiar en la Hochschule für Musik de Würzburg con Siegfried Fink.',
                'Su Concierto No. 1 para Marimba (1986) es uno de los más interpretados del repertorio. Fue director de percusión en la Universidad Federal de Santa Maria y luego en la Universidad de Miami. En 2023 ingresó al Salón de la Fama de la Percussive Arts Society.'
            ],
            review: [
                'Compuesta en 1988 para el Percussion Art Quartet, es una de las obras de ensemble más representativas del lenguaje de Rosauro.',
                'La suite recorre cinco figuras míticas del folclore brasileño: Curupira, Iara, Saci Pererê, Uirapurú y Mula sin Cabeza.',
                'Combina ritmos brasileños, color orquestal y escritura idiomática para teclados de percusión, manteniendo un carácter narrativo, virtuoso y muy comunicativo con el público.'
            ]
        },
        toccata: {
            title: 'Toccata para Instrumentos de Percusión',
            subtitle: 'Carlos Chávez (1899-1978) · Ensemble de Percusión',
            image: 'assets/images/TOCCATA.jpg',
            imageAlt: 'Toccata para Instrumentos de Percusión de Carlos Chávez',
            bio: [
                'Carlos Chávez nació en Ciudad de México en 1899 y es una figura central de la música mexicana del siglo XX.',
                'Fundó y dirigió la Orquesta Sinfónica de México, y desarrolló un lenguaje que integra tradición mexicana y técnicas contemporáneas.',
                'Su catálogo incluye sinfonías, obras de cámara, ballet y música para piano. Su aporte a la percusión fue decisivo, tratándola como un medio expresivo autónomo.'
            ],
            review: [
                'La Toccata (1942) es una obra histórica del repertorio para ensemble de percusión. Fue escrita para seis intérpretes con una amplia batería de instrumentos.',
                'Se estructura en tres secciones continuas: rápido-lento-rápido. Los movimientos extremos exploran patrones rítmicos y redobles, mientras que la sección central enfatiza color tímbrico y articulación.',
                'Chávez la concibió como una obra de expresión musical formal, evitando el exotismo superficial. Es referencia obligada en la literatura de percusión del siglo XX.'
            ]
        },
        mudra: {
            title: 'Mudra',
            subtitle: 'Bob Becker (1947- ) · Quinteto de Percusión',
            image: 'assets/images/MUDRA.jpg',
            imageAlt: 'Mudra de Bob Becker',
            bio: [
                'Bob Becker nació en 1947 en Allentown, Pennsylvania. Se formó en Eastman School of Music y profundizó estudios en música del mundo en Wesleyan University.',
                'En 1971 cofundó NEXUS, uno de los ensembles de percusión más influyentes. También colaboró con Steve Reich and Musicians y con agrupaciones de primer nivel internacional.',
                'Su perfil artístico integra tradición rudimental estadounidense, tabla india, percusión africana y repertorio clásico occidental.'
            ],
            review: [
                'Mudra (1990, rev. 2003) nació como música para danza y luego se consolidó como suite de concierto independiente.',
                'La obra toma su nombre del sánscrito y se relaciona con gestos de la danza clásica india. Su material armónico se apoya en la raga Chandrakauns y su ritmo incorpora procedimientos de la tradición del tabla.',
                'Es una partitura sofisticada para quinteto de percusión, con alto nivel técnico, equilibrio tímbrico y una dramaturgia interna que conserva el impulso coreográfico original.'
            ]
        },
        gainsborough: {
            title: 'Gainsborough',
            subtitle: 'Thomas Gauger (1935- ) · Quinteto de Percusión',
            image: 'assets/images/GAUINSBORROUGH.png',
            imageAlt: 'Gainsborough de Thomas Gauger',
            bio: [
                'Thomas Gauger nació en 1935 en Wheaton, Illinois. Estudió en la Universidad de Illinois y desarrolló una extensa carrera orquestal en Estados Unidos.',
                'Fue percusionista de la Boston Symphony Orchestra durante décadas, trabajando con directores de referencia y participando en numerosas grabaciones y bandas sonoras.',
                'También se desempeñó como docente y fabricante de baquetas y accesorios, manteniendo una influencia práctica y pedagógica muy amplia en el mundo de la percusión.'
            ],
            review: [
                'Gainsborough es una obra para quinteto de percusión que destaca por su refinamiento tímbrico y su escritura de cámara.',
                'El título sugiere una estética de detalle, contraste de color y delicadeza en la articulación, en línea con una escucha atenta de texturas.',
                'La pieza combina precisión rítmica, equilibrio entre voces y diálogo íntimo entre intérpretes, dentro de la tradición del repertorio norteamericano para ensemble.'
            ]
        },
        brandenburg: {
            title: 'Concierto de Brandeburgo No. 3 en Sol Mayor, BWV 1048',
            subtitle: 'Johann Sebastian Bach (1685-1750) · Ensemble de Cuerdas',
            image: 'assets/images/BRANDENBURGO.png',
            imageAlt: 'Concierto de Brandeburgo No. 3 de Johann Sebastian Bach',
            bio: [
                'Johann Sebastian Bach nació en 1685 en Eisenach y es uno de los compositores fundamentales de la historia occidental.',
                'Su obra abarca casi todos los géneros de su época: música sacra, teclado, cámara y repertorio orquestal.',
                'Tras cargos en Weimar y Köthen, fue Cantor en Leipzig desde 1723 hasta su muerte. Su legado une maestría contrapuntística, profundidad expresiva y arquitectura formal excepcional.'
            ],
            review: [
                'El Tercer Brandeburgo integra la colección dedicada al Margrave Christian Ludwig en 1721.',
                'Su instrumentación 3+3+3 de cuerdas y continuo crea una red polifónica intensa, donde las voces alternan funciones solísticas y de acompañamiento.',
                'Los dos movimientos rápidos enmarcan un breve puente armónico central. Es una obra de energía continua y claridad contrapuntística, núcleo absoluto del barroco instrumental.'
            ]
        },
        spiritual: {
            title: 'Marimba Spiritual',
            subtitle: 'Minoru Miki (1930-2011) · Marimba Solista y Trío de Percusión',
            image: 'assets/images/SPIRITUAL.jpg',
            imageAlt: 'Marimba Spiritual de Minoru Miki',
            bio: [
                'Minoru Miki nació en Fukushima en 1930 y fue pionero en la integración de tradición japonesa e instrumentos occidentales contemporáneos.',
                'Fundó Pro Musica Nipponia en 1964, impulsando repertorio para instrumentos tradicionales japoneses y una importante producción de ópera, cámara y concierto.',
                'Su trabajo con Keiko Abe resultó decisivo para el desarrollo de la marimba moderna de cinco octavas y su consolidación como instrumento solista.'
            ],
            review: [
                'Marimba Spiritual (1983-84) fue escrita para Keiko Abe y estrenada en 1984 en el Concertgebouw de Ámsterdam.',
                'La obra responde a la tragedia de la hambruna en Etiopía y se divide en dos grandes secciones: Réquiem (meditativa) y Resurrección (vital y rítmicamente intensa).',
                'Exige control técnico completo de la marimba de cinco octavas, manejo expresivo del color y gran resistencia física en su tramo final.'
            ]
        }
    };

    function buildRepertoireContent(work) {
        const bioHtml = work.bio.map(paragraph => `<p>${paragraph}</p>`).join('');
        const reviewHtml = work.review.map(paragraph => `<p>${paragraph}</p>`).join('');
        return `<h4>Biografía del Compositor</h4>${bioHtml}<h4>Reseña de la Obra</h4>${reviewHtml}`;
    }

    if (repertoirePopup) {
        const repertoireCloseBtns = repertoirePopup.querySelectorAll('[data-repertoire-close]');

        const closeRepertoirePopup = function() {
            repertoirePopup.classList.remove('popup--active');
            repertoirePopup.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const openRepertoirePopup = function(workId) {
            const work = repertoireData[workId];
            if (!work) return;

            if (repertoirePopupTitle) repertoirePopupTitle.textContent = work.title;
            if (repertoirePopupSubtitle) repertoirePopupSubtitle.textContent = work.subtitle;
            if (repertoirePopupImage) {
                repertoirePopupImage.src = work.image;
                repertoirePopupImage.alt = work.imageAlt;
            }
            if (repertoirePopupContent) repertoirePopupContent.innerHTML = buildRepertoireContent(work);

            repertoirePopup.classList.add('popup--active');
            repertoirePopup.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        repertoireCards.forEach(card => {
            const workId = card.getAttribute('data-work-id');
            if (!workId) return;

            card.addEventListener('click', function() {
                openRepertoirePopup(workId);
            });

            card.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openRepertoirePopup(workId);
                }
            });
        });

        repertoireCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                closeRepertoirePopup();
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && repertoirePopup.classList.contains('popup--active')) {
                closeRepertoirePopup();
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
