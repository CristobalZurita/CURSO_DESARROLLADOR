// ===================================
// BIKEFIX WORKSHOP - MAIN JAVASCRIPT
// Interactive Features & Animations
// ===================================

// === SCROLL TOP BUTTON ===
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// === INTERACTIVE BIKE SVG ===
const bikeSvgContainer = document.getElementById('bikeSvg');
const bikeInfoContainer = document.getElementById('bikeInfo');

// Bike parts information
const bikePartsInfo = {
  frame: {
    title: 'Cuadro / Marco',
    description: 'La estructura principal que sostiene todos los componentes de la bicicleta.'
  },
  wheel: {
    title: 'Ruedas',
    description: 'Componente esencial para el movimiento. Incluye llanta, radios y neumático.'
  },
  handlebar: {
    title: 'Manubrio',
    description: 'Permite dirigir la bicicleta y controlar la dirección.'
  },
  saddle: {
    title: 'Asiento / Sillín',
    description: 'Proporciona comodidad al ciclista durante el recorrido.'
  },
  pedal: {
    title: 'Pedales',
    description: 'Transmiten la fuerza de las piernas a la cadena y las ruedas.'
  },
  chain: {
    title: 'Cadena',
    description: 'Conecta los pedales con la rueda trasera para impulsar la bicicleta.'
  },
  brake: {
    title: 'Frenos',
    description: 'Sistema de seguridad para reducir la velocidad y detener la bicicleta.'
  },
  gear: {
    title: 'Cambios / Piñones',
    description: 'Permiten ajustar la resistencia del pedaleo según el terreno.'
  }
};

// Load and setup interactive SVG
function setupBikeSVG() {
  // Create a simple interactive bike SVG inline
  const svgHTML = `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
      <!-- Rear Wheel -->
      <g class="bike-part" data-part="wheel">
        <circle cx="200" cy="280" r="80" fill="none" stroke="#333" stroke-width="4"/>
        <circle cx="200" cy="280" r="60" fill="none" stroke="#666" stroke-width="2"/>
        <circle cx="200" cy="280" r="15" fill="#333"/>
        <line x1="200" y1="200" x2="200" y2="360" stroke="#666" stroke-width="2"/>
        <line x1="120" y1="280" x2="280" y2="280" stroke="#666" stroke-width="2"/>
      </g>
      
      <!-- Front Wheel -->
      <g class="bike-part" data-part="wheel">
        <circle cx="600" cy="280" r="80" fill="none" stroke="#333" stroke-width="4"/>
        <circle cx="600" cy="280" r="60" fill="none" stroke="#666" stroke-width="2"/>
        <circle cx="600" cy="280" r="15" fill="#333"/>
        <line x1="600" y1="200" x2="600" y2="360" stroke="#666" stroke-width="2"/>
        <line x1="520" y1="280" x2="680" y2="280" stroke="#666" stroke-width="2"/>
      </g>
      
      <!-- Frame -->
      <g class="bike-part" data-part="frame">
        <line x1="200" y1="280" x2="350" y2="150" stroke="#ff6b35" stroke-width="8"/>
        <line x1="350" y1="150" x2="500" y2="200" stroke="#ff6b35" stroke-width="8"/>
        <line x1="500" y1="200" x2="350" y2="280" stroke="#ff6b35" stroke-width="8"/>
        <line x1="350" y1="280" x2="200" y2="280" stroke="#ff6b35" stroke-width="8"/>
        <line x1="500" y1="200" x2="600" y2="280" stroke="#ff6b35" stroke-width="8"/>
      </g>
      
      <!-- Saddle -->
      <g class="bike-part" data-part="saddle">
        <ellipse cx="320" cy="140" rx="40" ry="15" fill="#333"/>
        <line x1="320" y1="140" x2="350" y2="150" stroke="#666" stroke-width="4"/>
      </g>
      
      <!-- Handlebar -->
      <g class="bike-part" data-part="handlebar">
        <line x1="600" y1="280" x2="580" y2="180" stroke="#333" stroke-width="6"/>
        <line x1="550" y1="170" x2="610" y2="170" stroke="#333" stroke-width="8"/>
        <circle cx="550" cy="170" r="8" fill="#666"/>
        <circle cx="610" cy="170" r="8" fill="#666"/>
      </g>
      
      <!-- Pedals & Chain -->
      <g class="bike-part" data-part="pedal">
        <circle cx="350" cy="280" r="25" fill="none" stroke="#333" stroke-width="4"/>
        <circle cx="350" cy="280" r="10" fill="#666"/>
        <line x1="330" y1="300" x2="310" y2="310" stroke="#333" stroke-width="4"/>
        <rect x="305" y="305" width="30" height="10" rx="2" fill="#666"/>
      </g>
      
      <g class="bike-part" data-part="chain">
        <path d="M 350 305 Q 275 320, 200 305" fill="none" stroke="#888" stroke-width="3" stroke-dasharray="5,3"/>
      </g>
      
      <!-- Brakes -->
      <g class="bike-part" data-part="brake">
        <line x1="560" y1="175" x2="590" y2="240" stroke="#e63946" stroke-width="3"/>
        <rect x="585" y="235" width="20" height="8" rx="2" fill="#e63946"/>
        <line x1="175" y1="260" x2="185" y2="275" stroke="#e63946" stroke-width="3"/>
        <rect x="170" y="255" width="20" height="8" rx="2" fill="#e63946"/>
      </g>
      
      <!-- Gears -->
      <g class="bike-part" data-part="gear">
        <circle cx="200" cy="280" r="30" fill="none" stroke="#004e89" stroke-width="3"/>
        <circle cx="200" cy="280" r="20" fill="none" stroke="#004e89" stroke-width="2"/>
      </g>
    </svg>
  `;
  
  bikeSvgContainer.innerHTML = svgHTML;
  
  // Add hover events to bike parts
  const bikeParts = document.querySelectorAll('.bike-part');
  
  bikeParts.forEach(part => {
    part.addEventListener('mouseenter', (e) => {
      const partName = part.getAttribute('data-part');
      const partInfo = bikePartsInfo[partName];
      
      if (partInfo) {
        bikeInfoContainer.innerHTML = `
          <div class="bike-info" style="animation: fadeInUp 0.3s ease;">
            <h3 class="bike-info__title">${partInfo.title}</h3>
            <p class="bike-info__text">${partInfo.description}</p>
          </div>
        `;
      }
    });
    
    part.addEventListener('mouseleave', () => {
      bikeInfoContainer.innerHTML = `
        <div class="bike-info">
          <h3 class="bike-info__title">Explora las partes</h3>
          <p class="bike-info__text">Pasa el mouse sobre la imagen para conocer cada componente</p>
        </div>
      `;
    });
  });
}

// Initialize bike SVG on page load
setupBikeSVG();

// === GALLERY INTERACTIONS ===
const galleryItems = document.querySelectorAll('.gallery__item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const imgSrc = img.getAttribute('src');
    
    // Create simple lightbox
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.src = imgSrc;
    lightboxImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: scaleIn 0.3s ease;
    `;
    
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);
    
    // Close lightbox on click
    lightbox.addEventListener('click', () => {
      lightbox.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(lightbox);
      }, 300);
    });
  });
});

// === PRODUCT INTERACTIONS ===
const productButtons = document.querySelectorAll('.product__btn');

productButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const product = e.target.closest('.product');
    const productName = product.querySelector('.product__title').textContent;
    const productPrice = product.querySelector('.product__price').textContent;
    
    // WhatsApp message
    const message = `Hola! Estoy interesado en: ${productName} (${productPrice})`;
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  });
});

// === CONTACT FORM ===
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const mensaje = document.getElementById('mensaje').value;
  
  // Create WhatsApp message
  const whatsappMessage = `
*Nuevo mensaje de contacto*

*Nombre:* ${nombre}
*Email:* ${email}
*Mensaje:* ${mensaje}
  `.trim();
  
  const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Open WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Show success message
  const successMsg = document.createElement('div');
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2a9d8f;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    font-weight: 600;
  `;
  successMsg.textContent = '✓ Redirigiendo a WhatsApp...';
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 300);
  }, 3000);
  
  // Reset form
  contactForm.reset();
});

// === SCROLL ANIMATIONS ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease both';
    }
  });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// === SMOOTH NAVIGATION ===
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

// === ACTIVE NAV LINK ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

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
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary)';
    }
  });
});

// === PARALLAX EFFECT FOR HERO ===
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero__content');
  const heroBg = document.querySelector('.hero__bg');
  
  if (heroContent && scrolled < 800) {
    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    heroContent.style.opacity = 1 - (scrolled / 600);
  }
  
  if (heroBg && scrolled < 800) {
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// === PRODUCT HOVER EFFECTS ===
const products = document.querySelectorAll('.product');

products.forEach(product => {
  product.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  product.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// === LOG INITIALIZATION ===
console.log('%c🚴 BikeFix Workshop Loaded!', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
console.log('%cInteractive features ready:', 'color: #004e89; font-size: 14px;');
console.log('✓ SVG bike diagram with hover effects');
console.log('✓ Gallery lightbox');
console.log('✓ Product WhatsApp integration');
console.log('✓ Contact form');
console.log('✓ Smooth scroll & animations');
