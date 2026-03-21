/* ═══════════════════════════════════════════════════════════════
   BASILIA AZCONA — LUXURY REAL ESTATE
   Main JavaScript: Animations · Chatbot · Bilingual · Parallax
═══════════════════════════════════════════════════════════════ */

'use strict';

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

  // Determine how many slides are visible
  let slidesVisible = window.innerWidth > 900 ? 3 : 1;
  let maxSlide = totalSlides - slidesVisible;
  currentSlide = 0;

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotCount = maxSlide + 1;
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

    // Update dots
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

  // Touch/swipe support
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

  // Auto-advance
  let autoSlide = setInterval(() => {
    slidesVisible = window.innerWidth > 900 ? 3 : 1;
    maxSlide = totalSlides - slidesVisible;
    if (currentSlide >= maxSlide) goToSlide(0);
    else goToSlide(currentSlide + 1);
  }, 5000);

  // Pause on hover
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
      // Sync chatbot lang
      chatLang = currentLang;
      updateChatbotLang();
    });
  });
}

function applyLanguage(lang) {
  currentLang = lang;

  // Update all data-en / data-es elements
  const allEls = document.querySelectorAll('[data-en]');
  allEls.forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Don't overwrite elements that are containers (have children)
      if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  // Update placeholders
  const placeholderEls = document.querySelectorAll('[data-placeholder-en]');
  placeholderEls.forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.setAttribute('placeholder', ph);
  });

  // Update select options
  const selectOptions = document.querySelectorAll('select option[data-en]');
  selectOptions.forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Update lang toggle buttons
  const enSpans = document.querySelectorAll('.lang-en');
  const esSpans = document.querySelectorAll('.lang-es');
  enSpans.forEach(s => s.classList.toggle('active', lang === 'en'));
  esSpans.forEach(s => s.classList.toggle('active', lang === 'es'));

  // Update chatbot suggestions
  updateSuggestionButtons(lang);

  // Update html lang attribute
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
   CONTACT FORM
═══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
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
═══════════════════════════════════════════ */

const chatbotKnowledge = {
  en: {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    buying: ['buy', 'buying', 'purchase', 'home buyer', 'first time', 'mortgage', 'pre-approval', 'offer', 'closing'],
    selling: ['sell', 'selling', 'list', 'listing', 'market', 'asking price', 'staging', 'open house'],
    rental: ['rent', 'rental', 'lease', 'apartment', 'luxury rental', 'relocating'],
    investment: ['invest', 'investment', 'roi', 'portfolio', 'income property', 'multi-family', 'cap rate', 'cash flow'],
    areas: ['area', 'location', 'where', 'mercer', 'princeton', 'hamilton', 'trenton', 'new jersey', 'nj', 'serve'],
    contact: ['contact', 'reach', 'call', 'email', 'phone', 'appointment', 'meeting', 'schedule'],
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
    contact: ['contactar', 'llamar', 'correo', 'teléfono', 'cita', 'reunión', 'agendar'],
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
    contact: "You can reach Basilia directly:\n\n📞 609-638-2850\n✉️ basilia@realestatewithbasilia.com\n🌐 realestatewithbasilia.com\n\nOr use the contact form on this page to send a message. She responds within 24 hours!",
    bilingual: "¡Sí! Basilia is fully bilingual in English and Spanish. She provides complete real estate services in both languages, ensuring every client feels completely comfortable and understood throughout the entire process. ¡Estamos aquí para ayudarle!",
    process: "The real estate process with Basilia is designed to be smooth and stress-free:\n\n🏠 Buying: Consultation → Pre-approval → Search → Offer → Closing (typically 30-60 days)\n\n🏡 Selling: Consultation → Pricing → Prep & Staging → List → Negotiate → Close (typically 30-90 days)\n\nBasilia handles every detail so you can focus on what matters most.",
    cost: "Basilia's services are commission-based, which means:\n\n✦ Buyers: Typically no out-of-pocket cost to you\n✦ Sellers: Standard commission applies (competitive rates)\n✦ Rentals: Varies by arrangement\n\nFor a transparent conversation about costs, schedule a free consultation with Basilia — no obligation!",
    default: "That's a great question! For the most accurate and personalized answer, I'd recommend speaking directly with Basilia. She can be reached at 609-638-2850 or via the contact form on this page. Is there anything else I can help you with?"
  },
  es: {
    greeting: "¡Hola! Soy el asistente virtual de Basilia. Puedo ayudarle con preguntas sobre comprar, vender, alquilar o invertir en bienes raíces en el Centro de Nueva Jersey. ¿En qué le puedo ayudar?",
    buying: "¡Comprar una casa es uno de los viajes más emocionantes! Así es como Basilia le guía:\n\n✦ Paso 1: Consulta gratuita para entender sus metas\n✦ Paso 2: Conexión con prestamistas de confianza para preaprobación\n✦ Paso 3: Tours de propiedades seleccionadas en el Condado de Mercer\n✦ Paso 4: Negociación estratégica de ofertas\n✦ Paso 5: Apoyo completo en el cierre\n\n¿Le gustaría programar una consulta con Basilia?",
    selling: "Vender su casa con Basilia significa máxima exposición y el mejor precio. Su enfoque incluye:\n\n✦ Análisis comparativo de mercado para un precio perfecto\n✦ Consulta profesional de staging\n✦ Fotografía de alta calidad y tours virtuales\n✦ Campaña de marketing en múltiples plataformas\n✦ Negociación experta en su nombre\n\n¿Está listo/a para comenzar?",
    rental: "Basilia tiene acceso a las mejores propiedades de alquiler de lujo en el Centro de Nueva Jersey. Ya sea que se esté mudando por trabajo o buscando un estilo de vida elevado, ella le encontrará el espacio perfecto.\n\n¿Le conecto directamente con Basilia?",
    investment: "La inversión inteligente en bienes raíces comienza con el asesor correcto. Basilia se especializa en:\n\n✦ Identificar oportunidades de alto rendimiento en el Condado de Mercer\n✦ Analizar tasas de capitalización y proyecciones de flujo de caja\n✦ Propiedades multifamiliares y generadoras de ingresos\n✦ Estrategias de crecimiento de portafolio\n\n¿Listo/a para construir riqueza duradera?",
    areas: "Basilia sirve todo el Centro de Nueva Jersey con especialidad en el Condado de Mercer, incluyendo:\n\n✦ Princeton y Princeton Junction\n✦ Hamilton Township\n✦ Trenton\n✦ Lawrence Township\n✦ Ewing Township\n✦ West Windsor\n✦ Robbinsville\n\n¿Hay alguna área específica que le interese?",
    contact: "Puede comunicarse con Basilia directamente:\n\n📞 609-638-2850\n✉️ basilia@realestatewithbasilia.com\n🌐 realestatewithbasilia.com\n\nO use el formulario de contacto en esta página. ¡Ella responde en 24 horas!",
    bilingual: "¡Por supuesto! Basilia es completamente bilingüe en inglés y español. Ofrece todos sus servicios de bienes raíces en ambos idiomas, asegurando que cada cliente se sienta completamente cómodo y comprendido durante todo el proceso.",
    process: "El proceso de bienes raíces con Basilia está diseñado para ser fluido y sin estrés:\n\n🏠 Compra: Consulta → Preaprobación → Búsqueda → Oferta → Cierre (típicamente 30-60 días)\n\n🏡 Venta: Consulta → Precio → Preparación → Listar → Negociar → Cerrar (típicamente 30-90 días)\n\nBasilia maneja cada detalle para que usted pueda enfocarse en lo que más importa.",
    cost: "Los servicios de Basilia son basados en comisión, lo que significa:\n\n✦ Compradores: Típicamente sin costo de bolsillo para usted\n✦ Vendedores: Comisión estándar (tarifas competitivas)\n✦ Alquileres: Varía según el acuerdo\n\n¡Para una conversación transparente sobre costos, programe una consulta gratuita con Basilia!",
    default: "¡Excelente pregunta! Para la respuesta más precisa y personalizada, le recomiendo hablar directamente con Basilia. Puede contactarla al 609-638-2850 o a través del formulario de contacto en esta página. ¿Hay algo más en que pueda ayudarle?"
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
  return responses[intent] || responses.default;
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
    const response = getBotResponse(text);
    addMessage(response, false);
  }, 800 + Math.random() * 600);
}

function updateChatbotLang() {
  const chatbotLangBtn = document.getElementById('chatbotLang');
  if (chatbotLangBtn) {
    chatbotLangBtn.textContent = chatLang === 'en' ? 'ES' : 'EN';
  }

  // Update suggestion buttons
  updateSuggestionButtons(chatLang);

  // Update chatbot status
  const statusEl = document.querySelector('.chatbot-status');
  if (statusEl) {
    const text = statusEl.getAttribute(`data-${chatLang}`);
    if (text) statusEl.textContent = text;
  }

  // Update input placeholder
  const input = document.getElementById('chatbotInput');
  if (input) {
    const ph = input.getAttribute(`data-placeholder-${chatLang}`);
    if (ph) input.placeholder = ph;
  }
}

function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const window_ = document.getElementById('chatbotWindow');
  const badge = document.getElementById('chatbotBadge');
  const openIcon = toggle.querySelector('.chat-icon-open');
  const closeIcon = toggle.querySelector('.chat-icon-close');
  const input = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const langBtn = document.getElementById('chatbotLang');
  const suggestions = document.getElementById('chatbotSuggestions');

  let isOpen = false;

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    window_.classList.toggle('hidden', !isOpen);
    openIcon.classList.toggle('hidden', isOpen);
    closeIcon.classList.toggle('hidden', !isOpen);
    badge.classList.add('hidden');

    if (isOpen) {
      input.focus();
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

  // Suggestion buttons
  suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
      const text = e.target.textContent;
      handleChatInput(text);
    }
  });

  // Chatbot language toggle (independent from main toggle)
  langBtn.addEventListener('click', () => {
    chatLang = chatLang === 'en' ? 'es' : 'en';
    langBtn.textContent = chatLang === 'en' ? 'ES' : 'EN';
    updateSuggestionButtons(chatLang);

    // Add language switch message
    const switchMsg = chatLang === 'es'
      ? '¡Hola! Ahora estoy respondiendo en español. ¿En qué le puedo ayudar?'
      : 'Hello! Now responding in English. How can I help you?';
    addMessage(switchMsg, false);

    // Update input placeholder
    const ph = input.getAttribute(`data-placeholder-${chatLang}`);
    if (ph) input.placeholder = ph;
  });
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

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statNumbers = statsSection.querySelectorAll('.stat-number');
  let animated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      // Stats are in hero, animate on load
    }
  });

  statsObserver.observe(statsSection);
}

/* ═══════════════════════════════════════════
   INITIAL LANGUAGE SETUP
═══════════════════════════════════════════ */
// Apply default EN language on load
applyLanguage('en');
