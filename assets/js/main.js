// main.js - Scripts principais da aplicação

// Configurações globais
const CONFIG = {
  animationDuration: 300,
  scrollOffset: 0
};

// Função para scroll suave
function smoothScroll(target) {
  let element = document.querySelector(target);
  if (element) {
    // Se houver um h2 dentro da seção, rola até ele
    const h2 = element.querySelector('h2');
    if (h2) element = h2;
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Função para animar elementos quando entram na viewport
function animateOnScroll() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    observer.observe(element);
  });
}

// Função para manipular formulários
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  console.log('Formulário submetido:', form.id || form.className);
  
  // Verificar se é o formulário de contato
  if (form.id === 'contato-form') {
    console.log('Processando formulário de contato...');
    await handleContactFormSubmit(form);
  } else {
    // Comportamento padrão para outros formulários
    const formData = new FormData(form);
    console.log('Formulário enviado:', Object.fromEntries(formData));
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simular envio
    setTimeout(() => {
      submitButton.textContent = 'Enviado!';
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.reset();
      }, 2000);
    }, 1000);
  }
}

// Função para enviar email via EmailJS
async function handleContactFormSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const messageDiv = document.getElementById('form-message');
  
  if (!submitButton) {
    console.error('Botão de submit não encontrado');
    return;
  }
  
  const originalText = submitButton.textContent;
  
  // Verificar se EmailJS está carregado
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS não está carregado');
    showMessage(messageDiv, '❌ Erro: EmailJS não está carregado. Recarregue a página.', 'error');
    return;
  }
  
  // Validar campos obrigatórios
  const nome = document.getElementById('nome')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const telefone = document.getElementById('telefone')?.value.trim() || '';
  const mensagem = document.getElementById('mensagem')?.value.trim() || '';
  
  if (!nome || !email || !mensagem) {
    showMessage(messageDiv, 'Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  // Validar email
  if (!isValidEmail(email)) {
    showMessage(messageDiv, 'Por favor, insira um e-mail válido.', 'error');
    return;
  }
  
  // Preparar dados para enviar
  const templateParams = {
    from_name: nome,
    from_email: email,
    phone: telefone || 'Não informado',
    message: mensagem,
    to_email: 'denes_11@hotmail.com'
  };
  
  submitButton.textContent = 'Enviando...';
  submitButton.disabled = true;
  if (messageDiv) {
    messageDiv.style.display = 'none';
  }
  
  try {
    // Enviar email via EmailJS
    const response = await emailjs.send(
      'service_jx6aned',
      'template_jcygbvs',
      templateParams
    );
    
    console.log('Email enviado com sucesso:', response);
    showMessage(messageDiv, '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    submitButton.textContent = 'Enviado!';
    form.reset();
    
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    let errorMessage = '❌ Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.';
    
    // Mensagens de erro mais específicas
    if (error.text) {
      console.error('Detalhes do erro:', error.text);
      if (error.text.includes('Invalid service ID') || error.text.includes('Invalid template ID')) {
        errorMessage = '❌ Erro de configuração. Verifique as credenciais do EmailJS.';
      }
    }
    
    showMessage(messageDiv, errorMessage, 'error');
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

// Função para mostrar mensagens de feedback
function showMessage(element, message, type) {
  // Verificar se o elemento existe
  if (!element) {
    console.error('Elemento de mensagem não encontrado');
    // Tentar encontrar novamente
    element = document.getElementById('form-message');
    if (!element) {
      console.error('Não foi possível encontrar o elemento #form-message');
      // Criar elemento se não existir
      const form = document.getElementById('contato-form');
      if (form) {
        element = document.createElement('div');
        element.id = 'form-message';
        element.style.marginTop = '10px';
        form.appendChild(element);
      } else {
        alert(message); // Fallback: usar alert se não conseguir criar elemento
        return;
      }
    }
  }
  
  element.textContent = message;
  element.style.display = 'block';
  element.style.padding = '10px';
  element.style.borderRadius = '6px';
  element.style.marginTop = '10px';
  
  if (type === 'success') {
    element.style.backgroundColor = '#d4edda';
    element.style.color = '#155724';
    element.style.border = '1px solid #c3e6cb';
  } else {
    element.style.backgroundColor = '#f8d7da';
    element.style.color = '#721c24';
    element.style.border = '1px solid #f5c6cb';
  }
  
  // Scroll suave até a mensagem
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para adicionar efeitos visuais
function addVisualEffects() {
  // Adicionar classes CSS para animações
  const cards = document.querySelectorAll('.card, .service-item');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Função para controlar o menu mobile (se necessário)
function toggleMobileMenu() {
  const nav = document.querySelector('nav');
  const burger = document.querySelector('.burger-menu');

  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      burger.classList.toggle('active');
    });
  }
}

// Função para controlar o menu lateral (sidebar)
function toggleSidebar() {
  const sidebar = document.querySelector('header .sidebar');
  const sidebarButton = document.getElementById('botao-sidebar');
  if (sidebar && sidebarButton) {
    sidebarButton.addEventListener('click', (e) => {
      sidebar.classList.toggle('aberta');
      document.body.classList.toggle('sidebar-aberta', sidebar.classList.contains('aberta'));
      document.getElementById('header').classList.toggle('sidebar-aberta', sidebar.classList.contains('aberta'));
      e.stopPropagation();
    });
    // Fecha a sidebar ao clicar fora
    document.addEventListener('click', (e) => {
      if (
        sidebar.classList.contains('aberta') &&
        !sidebar.contains(e.target) &&
        e.target !== sidebarButton
      ) {
        sidebar.classList.remove('aberta');
        document.body.classList.remove('sidebar-aberta');
        document.getElementById('header').classList.remove('sidebar-aberta');
      }
    });
    // Fecha a sidebar ao clicar em qualquer link da sidebar
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const isAnchor = href && href.startsWith('#');
        if (isAnchor) {
          e.preventDefault();
          history.replaceState(null, '', href); // Atualiza o hash sem scroll automático do navegador
        }
        sidebar.classList.remove('aberta');
        document.body.classList.remove('sidebar-aberta');
        document.getElementById('header').classList.remove('sidebar-aberta');
        // Força o navegador a processar o fechamento antes do scroll
        void sidebar.offsetWidth;
        if (isAnchor) {
          smoothScroll(href);
        }
      });
    });
  }
}

// Função para adicionar funcionalidades específicas da página
function initPageSpecificFeatures() {
  // Múltiplas formas de detectar a página atual
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Se estiver vazio ou for apenas '/', verificar o href completo
  if (!currentPage || currentPage === '') {
    currentPage = window.location.href.split('/').pop() || 'index.html';
  }
  
  // Remover query strings e hash
  currentPage = currentPage.split('?')[0].split('#')[0];
  
  // Verificar também pelo título da página como fallback
  const pageTitle = document.title.toLowerCase();
  if (pageTitle.includes('contato') && !currentPage.includes('contato')) {
    currentPage = 'contato.html';
  }
  
  console.log('📄 Página detectada:', currentPage);
  console.log('📍 Pathname completo:', window.location.pathname);
  console.log('🔗 URL completa:', window.location.href);

  switch (currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'sobre.html':
      initAboutPage();
      break;
    case 'contato.html':
      initContactPage();
      break;
    default:
      // Se não detectar, verificar se existe formulário de contato na página
      const contatoForm = document.getElementById('contato-form');
      if (contatoForm) {
        console.log('✅ Formulário de contato encontrado, inicializando...');
        initContactPage();
      }
  }
}

// Inicialização da página inicial
function initHomePage() {
  // console.log('🏠 Inicializando página inicial...');

  // Adicionar listeners para botões CTA e navegação âncora
  const anchorButtons = document.querySelectorAll('.btn, .cta-button, .tour-btn, .secondary-button, .hero-btn, nav a');
  anchorButtons.forEach(btn => {
    if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('#')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const href = btn.getAttribute('href');
        history.replaceState(null, '', href); // Atualiza o hash sem scroll automático do navegador
        smoothScroll(href);
      });
    }
  });
}

// Inicialização da página sobre
function initAboutPage() {
  // console.log('👤 Inicializando página sobre...');

  // Adicionar efeitos específicos da página sobre
  const skills = document.querySelectorAll('.skill');
  skills.forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
  });
}

// Inicialização da página contato
function initContactPage() {
  console.log('📞 Inicializando página contato...');

  // Função para adicionar listeners ao formulário
  function attachFormListeners(form) {
    if (!form) return;
    
    // Verificar se já tem listener para evitar duplicação
    if (form.dataset.listenerAttached === 'true') {
      console.log('⚠️ Listeners já foram adicionados a este formulário');
      return;
    }
    
    console.log('🔗 Adicionando listener ao formulário:', form.id || form.className || 'sem ID/classe');
    
    // Adicionar listener de submit
    form.addEventListener('submit', handleFormSubmit);
    form.dataset.listenerAttached = 'true';
    console.log('✅ Listener de submit adicionado');

    // Adicionar validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      // Verificar se já tem listener
      if (!input.dataset.listenerAttached) {
        input.addEventListener('blur', validateField);
        input.dataset.listenerAttached = 'true';
      }
    });
    console.log(`✅ Listeners de validação adicionados a ${inputs.length} campos`);
  }

  // Tentar encontrar o formulário de contato
  let contatoForm = document.getElementById('contato-form');
  
  if (contatoForm) {
    console.log('✅ Formulário de contato encontrado pelo ID');
    attachFormListeners(contatoForm);
  } else {
    console.warn('⚠️ Formulário de contato não encontrado pelo ID, procurando por classe...');
    // Tentar encontrar por classe
    contatoForm = document.querySelector('.contato-form');
    if (contatoForm) {
      console.log('✅ Formulário encontrado pela classe');
      attachFormListeners(contatoForm);
    } else {
      // Tentar encontrar qualquer formulário na página
      const forms = document.querySelectorAll('form');
      console.log(`📋 Total de formulários encontrados: ${forms.length}`);
      
      if (forms.length > 0) {
        forms.forEach((form, index) => {
          console.log(`Formulário ${index + 1}:`, {
            id: form.id,
            className: form.className,
            action: form.action
          });
          attachFormListeners(form);
        });
      } else {
        console.warn('⚠️ Nenhum formulário encontrado. Tentando novamente em 500ms...');
        // Tentar novamente após um delay caso o includes.js ainda não tenha carregado
        setTimeout(() => {
          contatoForm = document.getElementById('contato-form') || document.querySelector('.contato-form');
          if (contatoForm) {
            console.log('✅ Formulário encontrado na segunda tentativa');
            attachFormListeners(contatoForm);
          } else {
            const formsRetry = document.querySelectorAll('form');
            if (formsRetry.length > 0) {
              formsRetry.forEach(form => attachFormListeners(form));
            } else {
              console.error('❌ Formulário não encontrado após múltiplas tentativas');
            }
          }
        }, 500);
      }
    }
  }
}

// Função para validar campos individuais
function validateField(event) {
  const field = event.target;
  const value = field.value.trim();

  // Remover mensagens de erro existentes
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Validação básica
  let isValid = true;
  let errorMessage = '';

  if (field.required && !value) {
    isValid = false;
    errorMessage = 'Este campo é obrigatório';
  } else if (field.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'E-mail inválido';
  }

  // Mostrar erro se necessário
  if (!isValid) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorMessage;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'red';
  } else {
    field.style.borderColor = '#ddd';
  }

  return isValid;
}

// Função para validar e-mail
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // console.log('🎯 Inicializando scripts principais...');

  // Inicializar EmailJS se estiver disponível
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init("EpBcizA3ThhOwWemI");
      console.log('EmailJS inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar EmailJS:', error);
    }
  } else {
    console.warn('EmailJS ainda não está carregado, tentando novamente...');
    // Tentar novamente após um delay
    setTimeout(() => {
      if (typeof emailjs !== 'undefined') {
        try {
          emailjs.init("EpBcizA3ThhOwWemI");
          console.log('EmailJS inicializado com sucesso (tentativa 2)');
        } catch (error) {
          console.error('Erro ao inicializar EmailJS:', error);
        }
      }
    }, 500);
  }

  // Aguardar carregamento dos componentes
  setTimeout(() => {
    animateOnScroll();
    addVisualEffects();
    toggleMobileMenu();
    toggleSidebar(); // <-- Adiciona inicialização do sidebar
    initPageSpecificFeatures();

    // Verificação final: se existe formulário de contato, garantir que está configurado
    setTimeout(() => {
      const contatoForm = document.getElementById('contato-form');
      if (contatoForm && contatoForm.dataset.listenerAttached !== 'true') {
        console.log('🔧 Verificação final: configurando formulário de contato...');
        initContactPage();
      }
    }, 300);

    // Scroll suave para hash na URL após carregamento
    if (window.location.hash) {
      setTimeout(() => {
        smoothScroll(window.location.hash);
      }, 200);
    }

    // console.log('✅ Scripts principais inicializados!');
  }, 200);
});

// Funcionalidades globais
window.smoothScroll = smoothScroll;
window.validateField = validateField;

// ==================== TOURS CAROUSEL ====================

// Função para inicializar o carrossel de tours
function initToursCarousel() {
  const carouselWrapper = document.querySelector('.tours-carousel-wrapper');
  if (!carouselWrapper) return;

  const carousel = carouselWrapper.querySelector('.tours-carousel');
  const toursList = carouselWrapper.querySelector('.tours-list');
  const tourCards = toursList ? toursList.querySelectorAll('.tour-card') : [];
  const prevBtn = carouselWrapper.querySelector('.carousel-btn-prev');
  const nextBtn = carouselWrapper.querySelector('.carousel-btn-next');
  
  // Tentar encontrar o container de indicadores de várias formas
  let indicatorsContainer = carouselWrapper.querySelector('.carousel-indicators');
  
  // Se não encontrou, tentar encontrar na seção tours
  if (!indicatorsContainer) {
    const toursSection = document.getElementById('tours');
    if (toursSection) {
      indicatorsContainer = toursSection.querySelector('.carousel-indicators');
    }
  }
  
  // Se ainda não encontrou, criar o container após o botão next
  if (!indicatorsContainer) {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    // Inserir após o botão next ou no final do wrapper
    if (nextBtn && nextBtn.nextSibling) {
      carouselWrapper.insertBefore(indicatorsContainer, nextBtn.nextSibling);
    } else {
      carouselWrapper.appendChild(indicatorsContainer);
    }
  }

  if (!carousel || !toursList || tourCards.length === 0) {
    return;
  }

  let currentIndex = 0;
  let cardsPerView = 3;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Calcular quantos cards mostrar baseado no tamanho da tela
  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 768) {
      cardsPerView = 1;
    } else if (width <= 1024) {
      cardsPerView = 2;
    } else {
      cardsPerView = 3;
    }
    updateCarousel();
  }

  // Atualizar posição do carrossel
  function updateCarousel() {
    if (tourCards.length === 0) return;
    
    const cardWidth = tourCards[0].offsetWidth;
    const gap = 32; // gap do CSS
    const cardWidthWithGap = cardWidth + gap;
    const maxIndex = Math.max(0, tourCards.length - cardsPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    
    const translateX = -currentIndex * cardWidthWithGap;
    toursList.style.transform = `translateX(${translateX}px)`;
    
    prevTranslate = translateX;
    currentTranslate = translateX;
    
    updateIndicators();
    updateButtons();
  }

  // Atualizar indicadores
  function updateIndicators() {
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    // Calcular quantos slides/páginas existem
    const maxIndex = Math.max(0, tourCards.length - cardsPerView);
    const totalSlides = maxIndex + 1; // +1 porque começamos do índice 0
    
    // Se houver apenas 1 slide, não mostrar indicadores
    if (totalSlides <= 1) {
      indicatorsContainer.style.display = 'none';
      return;
    }
    
    indicatorsContainer.style.display = 'flex';
    
    // Criar um indicador para cada posição possível do carrossel
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      indicator.setAttribute('type', 'button');
      
      // O indicador está ativo se currentIndex corresponde a este índice
      if (i === currentIndex) {
        indicator.classList.add('active');
      }
      
      indicator.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      
      indicatorsContainer.appendChild(indicator);
    }
  }

  // Atualizar estado dos botões
  function updateButtons() {
    const maxIndex = Math.max(0, tourCards.length - cardsPerView);
    
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
      nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
  }

  // Navegar para o próximo slide
  function nextSlide() {
    const maxIndex = Math.max(0, tourCards.length - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  }

  // Navegar para o slide anterior
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }

  // Event listeners para botões
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // ========== SWIPE TOUCH ==========
  
  function getPositionX(event) {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  }

  function setSliderPosition() {
    toursList.style.transform = `translateX(${currentTranslate}px)`;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function onTouchStart(event) {
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    toursList.style.cursor = 'grabbing';
    toursList.style.transition = 'none';
  }

  function onTouchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    if (tourCards.length === 0) return;
    
    const cardWidth = tourCards[0].offsetWidth;
    const gap = 32;
    const cardWidthWithGap = cardWidth + gap;
    const movedBy = currentTranslate - prevTranslate;
    
    // Se moveu mais de 50px, mudar de slide
    if (Math.abs(movedBy) > 50) {
      if (movedBy > 0 && currentIndex > 0) {
        currentIndex--;
      } else if (movedBy < 0) {
        const maxIndex = Math.max(0, tourCards.length - cardsPerView);
        if (currentIndex < maxIndex) {
          currentIndex++;
        }
      }
    }
    
    prevTranslate = -currentIndex * cardWidthWithGap;
    currentTranslate = prevTranslate;
    toursList.style.cursor = 'grab';
    toursList.style.transition = 'transform 0.4s ease-in-out';
    updateCarousel();
  }

  // Adicionar event listeners para touch
  toursList.addEventListener('touchstart', onTouchStart, { passive: true });
  toursList.addEventListener('touchmove', onTouchMove, { passive: true });
  toursList.addEventListener('touchend', onTouchEnd);
  toursList.style.cursor = 'grab';

  // Adicionar event listeners para mouse (opcional, para desktop com drag)
  let mouseDown = false;
  toursList.addEventListener('mousedown', (e) => {
    if (window.innerWidth <= 768) {
      mouseDown = true;
      onTouchStart(e);
    }
  });
  
  toursList.addEventListener('mousemove', (e) => {
    if (mouseDown && window.innerWidth <= 768) {
      onTouchMove(e);
    }
  });
  
  toursList.addEventListener('mouseup', () => {
    if (mouseDown) {
      mouseDown = false;
      onTouchEnd();
    }
  });
  
  toursList.addEventListener('mouseleave', () => {
    if (mouseDown) {
      mouseDown = false;
      onTouchEnd();
    }
  });

  // Inicializar
  updateCardsPerView();
  updateCarousel();

  // Atualizar ao redimensionar a janela
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCardsPerView();
    }, 250);
  });

}

// Inicializar carrossel quando o DOM estiver pronto
function initToursCarouselOnLoad() {
  // Tentar inicializar imediatamente
  initToursCarousel();
  
  // Tentar novamente após um delay (caso seja carregado dinamicamente)
  setTimeout(() => {
    initToursCarousel();
  }, 500);
  
  // Tentar após 1 segundo (para includes.js)
  setTimeout(() => {
    initToursCarousel();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', initToursCarouselOnLoad);

// Observar mudanças no DOM para detectar quando a seção é carregada
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      const hasToursCarousel = Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 && (
          node.classList?.contains('tours-carousel-wrapper') ||
          node.querySelector?.('.tours-carousel-wrapper')
        )
      );
      
      if (hasToursCarousel) {
        setTimeout(() => {
          initToursCarousel();
        }, 100);
      }
    }
  });
});

// Iniciar observação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const toursSection = document.getElementById('tours');
  if (toursSection) {
    observer.observe(toursSection, {
      childList: true,
      subtree: true
    });
  }
});

// ==================== TESTIMONIALS MARQUEE ====================
// Função para calcular e ajustar a animação do letreiro infinito
function initTestimonialsMarquee() {
  const testimonialsList = document.querySelector('.testimonials-list');
  if (!testimonialsList) return;

  // Calcular a largura total da primeira metade (cards originais)
  const cards = testimonialsList.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  // Contar apenas os cards originais (primeira metade)
  const originalCardsCount = cards.length / 2;
  
  // Detectar gap baseado no tamanho da tela
  const isMobile = window.innerWidth <= 768;
  const gap = isMobile ? 16 : 24;
  
  // Calcular a largura total incluindo gaps
  // Pegar o primeiro card original para medir
  const firstCard = cards[0];
  if (!firstCard) return;
  
  // Calcular usando getBoundingClientRect para precisão
  let totalWidth = 0;
  for (let i = 0; i < originalCardsCount; i++) {
    const card = cards[i];
    const rect = card.getBoundingClientRect();
    totalWidth += rect.width;
    if (i < originalCardsCount - 1) {
      totalWidth += gap; // Adicionar gap entre cards, mas não após o último
    }
  }

  // Ajustar a animação para usar a largura exata calculada
  const translateValue = -totalWidth;
  testimonialsList.style.setProperty('--translate-value', `${translateValue}px`);
  
  // Criar keyframes dinâmicos
  const style = document.createElement('style');
  style.id = 'testimonials-marquee-style';
  style.textContent = `
    @keyframes scrollTestimonials {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(var(--translate-value, -50%));
      }
    }
  `;
  
  // Remover estilo anterior se existir
  const oldStyle = document.getElementById('testimonials-marquee-style');
  if (oldStyle) oldStyle.remove();
  
  document.head.appendChild(style);
}

// Inicializar quando o DOM estiver pronto
function initTestimonialsMarqueeOnLoad() {
  initTestimonialsMarquee();
  
  // Tentar novamente após um delay (caso seja carregado dinamicamente)
  setTimeout(() => {
    initTestimonialsMarquee();
  }, 500);
  
  setTimeout(() => {
    initTestimonialsMarquee();
  }, 1000);
  
  // Recalcular ao redimensionar
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initTestimonialsMarquee();
    }, 250);
  });
}

document.addEventListener('DOMContentLoaded', initTestimonialsMarqueeOnLoad);

// Observar mudanças no DOM
const testimonialsMarqueeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      const hasTestimonials = Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 && (
          node.classList?.contains('testimonials-list') ||
          node.querySelector?.('.testimonials-list')
        )
      );
      
      if (hasTestimonials) {
        setTimeout(() => {
          initTestimonialsMarquee();
        }, 100);
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection) {
    testimonialsMarqueeObserver.observe(testimonialsSection, {
      childList: true,
      subtree: true
    });
  }
});