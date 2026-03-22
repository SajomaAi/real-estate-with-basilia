/* ═══════════════════════════════════════════════════════════════
   BASILIA AZCONA — LUXURY REAL ESTATE
   Main JavaScript: Animations · Chatbot · Bilingual · Parallax
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── CONSTANTS ──────────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xreyvyvk';

/* ── STATE ──────────────────────────────────────────────────── */
let currentLang = 'en';
let chatLang = 'en';
let currentSlide = 0;
const totalSlides = 5;
const visibleSlides = window.innerWidth > 900 ? 3 : 1;

/* ── DOM READY ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParallax();
  initRevealAnimations();
  initTestimonialsSlider();
  initLanguageToggle();
  initChatbot();
  initContactForm();
  initCursorGlow();
  initMobileMenu();
  initHeroAnimations();
});

/* ═══════════════════════════════════════════
   NAVBAR — scroll behavior
═══════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
}

/* ═══════════════════════════════════════════
   PARALLAX EFFECT
═══════════════════════════════════════════ */
function initParallax() {
  const heroParallax = document.getElementById('heroParallax');
  const interludeParallax = document.getElementById('interludeParallax');

  function updateParallax() {
    const scrollY = window.scrollY;

    if (heroParallax) {
      const heroSection = document.getElementById('hero');
      const heroHeight = heroSection.offsetHeight;
      if (scrollY < heroHeight * 1.5) {
        const offset = scrollY * 0.35;
        heroParallax.style.transform = `translateY(${offset}px)`;
      }
    }

    if (interludeParallax) {
      const interlude = interludeParallax.closest('.interlude');
      const rect = interlude.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * 80;
        interludeParallax.style.transform = `translateY(${offset}px)`;
      }
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

/* ═══════════════════════════════════════════
   REVEAL ANIMATIONS — Intersection Observer
═══════════════════════════════════════════ */
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════
   HERO ENTRANCE ANIMATION
═══════════════════════════════════════════ */
function initHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 150);
  });
}

/* ═══════════════════════════════════════════
   TESTIMONIALS SLIDER
═══════════════════════════════════════════ */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  let slidesVisible = window.innerWidth > 900 ? 3 : 1;
  let maxSlide = totalSlides - slidesVisible;
  currentSlide = 0;

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateTrack() {
    slidesVisible = window.innerWidth > 900 ? 3 : 1;
    maxSlide = totalSlides - slidesVisible;

    const cardWidth = track.children[0].offsetWidth;
    const gap = 20;
    const offset = currentSlide * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    slidesVisible = window.innerWidth > 900 ? 3 : 1;
    maxSlide = totalSlides - slidesVisible;
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    updateTrack();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  let autoSlide = setInterval(() => {
    slidesVisible = window.innerWidth > 900 ? 3 : 1;
    maxSlide = totalSlides - slidesVisible;
    if (currentSlide >= maxSlide) goToSlide(0);
    else goToSlide(currentSlide + 1);
  }, 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      slidesVisible = window.innerWidth > 900 ? 3 : 1;
      maxSlide = totalSlides - slidesVisible;
      if (currentSlide >= maxSlide) goToSlide(0);
      else goToSlide(currentSlide + 1);
    }, 5000);
  });

  createDots();
  updateTrack();

  window.addEventListener('resize', () => {
    slidesVisible = window.innerWidth > 900 ? 3 : 1;
    maxSlide = totalSlides - slidesVisible;
    currentSlide = Math.min(currentSlide, maxSlide);
    createDots();
    updateTrack();
  });
}

/* ═══════════════════════════════════════════
   LANGUAGE TOGGLE — EN / ES
═══════════════════════════════════════════ */
function initLanguageToggle() {
  const toggles = [
    document.getElementById('langToggle'),
    document.getElementById('langToggleMobile')
  ].filter(Boolean);

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      applyLanguage(currentLang);
      chatLang = currentLang;
      updateChatbotLang();
    });
  });
}

function applyLanguage(lang) {
  currentLang = lang;

  const allEls = document.querySelectorAll('[data-en]');
  allEls.forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  const placeholderEls = document.querySelectorAll('[data-placeholder-en]');
  placeholderEls.forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  const selectOptions = document.querySelectorAll('select option[data-en]');
  selectOptions.forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  const enSpans = document.querySelectorAll('.lang-en');
  const esSpans = document.querySelectorAll('.lang-es');
  enSpans.forEach(s => s.classList.toggle('active', lang === 'en'));
  esSpans.forEach(s => s.classList.toggle('active', lang === 'es'));

  updateSuggestionButtons(lang);

  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
}

function updateSuggestionButtons(lang) {
  const suggestions = document.querySelectorAll('.suggestion-btn');
  suggestions.forEach(btn => {
    const text = btn.getAttribute(`data-${lang}`);
    if (text) btn.textContent = text;
  });
}

/* ═══════════════════════════════════════════
   CONTACT FORM — Formspree
═══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  // Ensure the action points to the correct endpoint
  form.action = FORMSPREE_ENDPOINT;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 6000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      btn.textContent = currentLang === 'es' ? 'Error. Intente de nuevo.' : 'Error. Please try again.';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3000);
      return;
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}

/* ═══════════════════════════════════════════
   CHATBOT — Self-contained Real Estate AI
   Floating fixed widget · Inline appt form
═══════════════════════════════════════════ */

const chatbotKnowledge = {
  en: {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    buying: ['buy', 'buying', 'purchase', 'home buyer', 'first time', 'mortgage', 'pre-approval', 'offer', 'closing'],
    selling: ['sell', 'selling', 'list', 'listing', 'market', 'asking price', 'staging', 'open house'],
    rental: ['rent', 'rental', 'lease', 'apartment', 'luxury rental', 'relocating'],
    investment: ['invest', 'investment', 'roi', 'portfolio', 'income property', 'multi-family', 'cap rate', 'cash flow'],
    areas: ['area', 'location', 'where', 'mercer', 'princeton', 'hamilton', 'trenton', 'new jersey', 'nj', 'serve'],
    contact: ['contact', 'reach', 'call', 'email', 'phone', 'appointment', 'meeting', 'schedule', 'book', 'consult', 'more info', 'information'],
    bilingual: ['spanish', 'español', 'habla', 'bilingue', 'bilingual', 'language'],
    process: ['process', 'steps', 'how long', 'timeline', 'how does it work'],
    cost: ['cost', 'fee', 'commission', 'price', 'how much', 'charge'],
  },
  es: {
    greetings: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
    buying: ['comprar', 'compra', 'comprador', 'primera vez', 'hipoteca', 'oferta', 'cierre', 'preaprobación'],
    selling: ['vender', 'venta', 'listar', 'precio', 'mercado', 'staging', 'casa abierta'],
    rental: ['alquilar', 'alquiler', 'renta', 'arrendar', 'apartamento', 'mudarse'],
    investment: ['invertir', 'inversión', 'roi', 'portafolio', 'propiedad de inversión', 'flujo de caja'],
    areas: ['área', 'ubicación', 'dónde', 'mercer', 'princeton', 'hamilton', 'trenton', 'nueva jersey', 'nj'],
    contact: ['contactar', 'llamar', 'correo', 'teléfono', 'cita', 'reunión', 'agendar', 'consulta', 'más información', 'información'],
    bilingual: ['español', 'inglés', 'bilingüe', 'idioma', 'habla español'],
    process: ['proceso', 'pasos', 'cuánto tiempo', 'cronograma', 'cómo funciona'],
    cost: ['costo', 'precio', 'comisión', 'honorarios', 'cuánto cobra'],
  }
};

const chatbotResponses = {
  en: {
    greeting: "Hi there! I'm Basilia's virtual assistant. I can help you with questions about buying, selling, renting, or investing in Central New Jersey real estate. What would you like to know?",
    buying: "Buying a home is one of the most exciting journeys! Here's how Basilia guides you:\n\n✦ Step 1: Free consultation to understand your goals\n✦ Step 2: Connect you with trusted lenders for pre-approval\n✦ Step 3: Curated property tours in Mercer County\n✦ Step 4: Strategic offer negotiation\n✦ Step 5: Seamless closing support\n\nWould you like to schedule a consultation with Basilia?",
    selling: "Selling your home with Basilia means maximum exposure and top dollar. Her approach includes:\n\n✦ Comparative market analysis to price perfectly\n✦ Professional staging consultation\n✦ High-quality photography & virtual tours\n✦ Multi-platform marketing campaign\n✦ Expert negotiation on your behalf\n\nHomes listed with Basilia sell faster and for more. Ready to get started?",
    rental: "Basilia has access to Central New Jersey's finest luxury rental properties. Whether you're relocating for work or seeking an elevated lifestyle, she'll match you with the perfect space.\n\nAreas served include Princeton, Hamilton, Trenton, and surrounding Mercer County communities. Shall I connect you with Basilia directly?",
    investment: "Smart real estate investment starts with the right advisor. Basilia specializes in:\n\n✦ Identifying high-yield opportunities in Mercer County\n✦ Analyzing cap rates and cash flow projections\n✦ Multi-family and income-producing properties\n✦ Portfolio growth strategies\n\nReady to build lasting wealth through real estate? Let's talk.",
    areas: "Basilia serves all of Central New Jersey with a specialty in Mercer County, including:\n\n✦ Princeton & Princeton Junction\n✦ Hamilton Township\n✦ Trenton\n✦ Lawrence Township\n✦ Ewing Township\n✦ West Windsor\n✦ Robbinsville\n\nAnd surrounding communities. Is there a specific area you're interested in?",
    contact: "I'd love to connect you with Basilia! Please fill out the quick form below and she'll be in touch within 24 hours.",
    bilingual: "¡Sí! Basilia is fully bilingual in English and Spanish. She provides complete real estate services in both languages, ensuring every client feels completely comfortable and understood throughout the entire process. ¡Estamos aquí para ayudarle!",
    process: "The real estate process with Basilia is designed to be smooth and stress-free:\n\n🏠 Buying: Consultation → Pre-approval → Search → Offer → Closing (typically 30-60 days)\n\n🏡 Selling: Consultation → Pricing → Prep & Staging → List → Negotiate → Close (typically 30-90 days)\n\nBasilia handles every detail so you can focus on what matters most.",
    cost: "Basilia's services are commission-based, which means:\n\n✦ Buyers: Typically no out-of-pocket cost to you\n✦ Sellers: Standard commission applies (competitive rates)\n✦ Rentals: Varies by arrangement\n\nFor a transparent conversation about costs, schedule a free consultation with Basilia — no obligation!",
    default: "That's a great question! For the most accurate and personalized answer, I'd recommend speaking directly with Basilia. Would you like to leave your contact info and she'll reach out within 24 hours?"
  },
  es: {
    greeting: "¡Hola! Soy el asistente virtual de Basilia. Puedo ayudarle con preguntas sobre comprar, vender, alquilar o invertir en bienes raíces en el Centro de Nueva Jersey. ¿En qué le puedo ayudar?",
    buying: "¡Comprar una casa es uno de los viajes más emocionantes! Así es como Basilia le guía:\n\n✦ Paso 1: Consulta gratuita para entender sus metas\n✦ Paso 2: Conexión con prestamistas de confianza para preaprobación\n✦ Paso 3: Tours de propiedades seleccionadas en el Condado de Mercer\n✦ Paso 4: Negociación estratégica de ofertas\n✦ Paso 5: Apoyo completo en el cierre\n\n¿Le gustaría programar una consulta con Basilia?",
    selling: "Vender su casa con Basilia significa máxima exposición y el mejor precio. Su enfoque incluye:\n\n✦ Análisis comparativo de mercado para un precio perfecto\n✦ Consulta profesional de staging\n✦ Fotografía de alta calidad y tours virtuales\n✦ Campaña de marketing en múltiples plataformas\n✦ Negociación experta en su nombre\n\n¿Está listo/a para comenzar?",
    rental: "Basilia tiene acceso a las mejores propiedades de alquiler de lujo en el Centro de Nueva Jersey. Ya sea que se esté mudando por trabajo o buscando un estilo de vida elevado, ella le encontrará el espacio perfecto.\n\n¿Le conecto directamente con Basilia?",
    investment: "La inversión inteligente en bienes raíces comienza con el asesor correcto. Basilia se especializa en:\n\n✦ Identificar oportunidades de alto rendimiento en el Condado de Mercer\n✦ Analizar tasas de capitalización y proyecciones de flujo de caja\n✦ Propiedades multifamiliares y generadoras de ingresos\n✦ Estrategias de crecimiento de portafolio\n\n¿Listo/a para construir riqueza duradera?",
    areas: "Basilia sirve todo el Centro de Nueva Jersey con especialidad en el Condado de Mercer, incluyendo:\n\n✦ Princeton y Princeton Junction\n✦ Hamilton Township\n✦ Trenton\n✦ Lawrence Township\n✦ Ewing Township\n✦ West Windsor\n✦ Robbinsville\n\n¿Hay alguna área específica que le interese?",
    contact: "¡Me encantaría conectarle con Basilia! Por favor complete el formulario rápido a continuación y ella se comunicará en 24 horas.",
    bilingual: "¡Por supuesto! Basilia es completamente bilingüe en inglés y español. Ofrece todos sus servicios de bienes raíces en ambos idiomas, asegurando que cada cliente se sienta completamente cómodo y comprendido durante todo el proceso.",
    process: "El proceso de bienes raíces con Basilia está diseñado para ser fluido y sin estrés:\n\n🏠 Compra: Consulta → Preaprobación → Búsqueda → Oferta → Cierre (típicamente 30-60 días)\n\n🏡 Venta: Consulta → Precio → Preparación → Listar → Negociar → Cerrar (típicamente 30-90 días)\n\nBasilia maneja cada detalle para que usted pueda enfocarse en lo que más importa.",
    cost: "Los servicios de Basilia son basados en comisión, lo que significa:\n\n✦ Compradores: Típicamente sin costo de bolsillo para usted\n✦ Vendedores: Comisión estándar (tarifas competitivas)\n✦ Alquileres: Varía según el acuerdo\n\n¡Para una conversación transparente sobre costos, programe una consulta gratuita con Basilia!",
    default: "¡Excelente pregunta! Para la respuesta más precisa y personalizada, le recomiendo hablar directamente con Basilia. ¿Le gustaría dejar su información de contacto para que ella se comunique en 24 horas?"
  }
};

function detectIntent(message, lang) {
  const lower = message.toLowerCase();
  const kb = chatbotKnowledge[lang] || chatbotKnowledge.en;

  if (kb.greetings.some(w => lower.includes(w))) return 'greeting';
  if (kb.buying.some(w => lower.includes(w))) return 'buying';
  if (kb.selling.some(w => lower.includes(w))) return 'selling';
  if (kb.rental.some(w => lower.includes(w))) return 'rental';
  if (kb.investment.some(w => lower.includes(w))) return 'investment';
  if (kb.areas.some(w => lower.includes(w))) return 'areas';
  if (kb.contact.some(w => lower.includes(w))) return 'contact';
  if (kb.bilingual.some(w => lower.includes(w))) return 'bilingual';
  if (kb.process.some(w => lower.includes(w))) return 'process';
  if (kb.cost.some(w => lower.includes(w))) return 'cost';
  return 'default';
}

function getBotResponse(message) {
  const intent = detectIntent(message, chatLang);
  const responses = chatbotResponses[chatLang] || chatbotResponses.en;
  return { text: responses[intent] || responses.default, intent };
}

function addMessage(text, isUser = false) {
  const messages = document.getElementById('chatbotMessages');
  const msg = document.createElement('div');
  msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msg.innerHTML = `
    <p class="msg-text">${text.replace(/\n/g, '<br>')}</p>
    <span class="msg-time">${timeStr}</span>
  `;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  return msg;
}

function showTypingIndicator() {
  const messages = document.getElementById('chatbotMessages');
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

/* ── INLINE APPOINTMENT FORM inside chat ─────────────────── */
function showChatAppointmentForm() {
  const messages = document.getElementById('chatbotMessages');

  const isEs = chatLang === 'es';
  const formId = 'chatApptForm_' + Date.now();

  const formMsg = document.createElement('div');
  formMsg.className = 'chat-msg bot chat-form-msg';
  formMsg.innerHTML = `
    <form id="${formId}" class="chat-appt-form" novalidate>
      <div class="chat-form-field">
        <input type="text" name="name" placeholder="${isEs ? 'Su nombre completo' : 'Your full name'}" required />
      </div>
      <div class="chat-form-field">
        <input type="tel" name="phone" placeholder="${isEs ? 'Su teléfono' : 'Your phone number'}" required />
      </div>
      <div class="chat-form-field">
        <input type="email" name="email" placeholder="${isEs ? 'Su correo electrónico' : 'Your email address'}" required />
      </div>
      <div class="chat-form-field">
        <textarea name="message" rows="2" placeholder="${isEs ? 'Cuénteme sobre sus metas...' : 'Tell me about your goals...'}"></textarea>
      </div>
      <input type="hidden" name="_subject" value="Chat Appointment Request — realestatewithbasilia.com" />
      <input type="hidden" name="source" value="Chatbot Widget" />
      <button type="submit" class="chat-form-submit">
        ${isEs ? 'Enviar Solicitud' : 'Send Request'}
      </button>
      <p class="chat-form-note">${isEs ? '🔒 Su información es privada y segura.' : '🔒 Your info is private and secure.'}</p>
    </form>
  `;

  messages.appendChild(formMsg);
  messages.scrollTop = messages.scrollHeight;

  // Handle form submission
  const form = document.getElementById(formId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.chat-form-submit');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = isEs ? 'Enviando...' : 'Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Replace form with success message
        formMsg.innerHTML = `
          <div class="chat-form-success">
            <span class="chat-form-check">✓</span>
            <p>${isEs
              ? '¡Gracias! Basilia se comunicará con usted en las próximas 24 horas.'
              : 'Thank you! Basilia will be in touch within 24 hours.'
            }</p>
          </div>
        `;
        messages.scrollTop = messages.scrollHeight;
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = isEs ? 'Error. Intente de nuevo.' : 'Error. Try again.';
      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

function handleChatInput(input) {
  const text = input.trim();
  if (!text) return;

  addMessage(text, true);

  // Hide suggestions after first interaction
  const suggestions = document.getElementById('chatbotSuggestions');
  if (suggestions) suggestions.style.display = 'none';

  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    const { text: responseText, intent } = getBotResponse(text);
    addMessage(responseText, false);

    // If intent is contact or default, show the appointment form
    if (intent === 'contact' || intent === 'default') {
      setTimeout(() => {
        showChatAppointmentForm();
      }, 400);
    }
  }, 800 + Math.random() * 600);
}

function updateChatbotLang() {
  const chatbotLangBtn = document.getElementById('chatbotLang');
  if (chatbotLangBtn) {
    chatbotLangBtn.textContent = chatLang === 'en' ? 'ES' : 'EN';
  }

  updateSuggestionButtons(chatLang);

  const statusEl = document.querySelector('.chatbot-status');
  if (statusEl) {
    const text = statusEl.getAttribute(`data-${chatLang}`);
    if (text) statusEl.textContent = text;
  }

  const input = document.getElementById('chatbotInput');
  if (input) {
    const ph = input.getAttribute(`data-placeholder-${chatLang}`);
    if (ph) input.placeholder = ph;
  }
}

function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatbotWindow');
  const badge = document.getElementById('chatbotBadge');
  const openIcon = toggle.querySelector('.chat-icon-open');
  const closeIcon = toggle.querySelector('.chat-icon-close');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const langBtn = document.getElementById('chatbotLang');
  const suggestions = document.getElementById('chatbotSuggestions');

  let isOpen = false;

  // Ensure the chatbot container is always fixed to bottom-right
  const container = document.getElementById('chatbotContainer');
  if (container) {
    container.style.position = 'fixed';
    container.style.bottom = '32px';
    container.style.right = '32px';
    container.style.zIndex = '9999';
  }

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('hidden', !isOpen);
    openIcon.classList.toggle('hidden', isOpen);
    closeIcon.classList.toggle('hidden', !isOpen);
    badge.classList.add('hidden');

    if (isOpen) {
      setTimeout(() => input.focus(), 100);
    }
  });

  sendBtn.addEventListener('click', () => {
    handleChatInput(input.value);
    input.value = '';
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleChatInput(input.value);
      input.value = '';
    }
  });

  suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
      const text = e.target.textContent;
      handleChatInput(text);
    }
  });

  langBtn.addEventListener('click', () => {
    chatLang = chatLang === 'en' ? 'es' : 'en';
    langBtn.textContent = chatLang === 'en' ? 'ES' : 'EN';
    updateSuggestionButtons(chatLang);

    const switchMsg = chatLang === 'es'
      ? '¡Hola! Ahora estoy respondiendo en español. ¿En qué le puedo ayudar?'
      : 'Hello! Now responding in English. How can I help you?';
    addMessage(switchMsg, false);

    const ph = input.getAttribute(`data-placeholder-${chatLang}`);
    if (ph) input.placeholder = ph;
  });

  // Auto-open with a greeting after 8 seconds on first visit
  const hasVisited = sessionStorage.getItem('chatGreeted');
  if (!hasVisited) {
    setTimeout(() => {
      if (!isOpen) {
        badge.style.display = 'flex';
        badge.textContent = '1';
      }
    }, 8000);
    sessionStorage.setItem('chatGreeted', 'true');
  }
}

/* ═══════════════════════════════════════════
   CURSOR GLOW EFFECT (desktop)
═══════════════════════════════════════════ */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL for anchor links
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   SERVICE CARD HOVER — link to contact
═══════════════════════════════════════════ */
document.querySelectorAll('.service-link').forEach(link => {
  link.addEventListener('click', () => {
    const contact = document.getElementById('contact');
    if (contact) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPos = contact.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   COUNTER ANIMATION for stats
═══════════════════════════════════════════ */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 2000;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statNumbers = statsSection.querySelectorAll('.stat-number');
  let animated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
    }
  });

  statsObserver.observe(statsSection);
}

/* ═══════════════════════════════════════════
   INITIAL LANGUAGE SETUP
═══════════════════════════════════════════ */
applyLanguage('en');
