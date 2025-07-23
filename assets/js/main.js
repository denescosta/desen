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
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Aqui você pode adicionar lógica para enviar os dados
  // console.log('Formulário enviado:', Object.fromEntries(formData));

  // Exemplo de feedback visual
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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch (currentPage) {
    case 'index.html':
      initHomePage();
      break;
    case 'sobre.html':
      initAboutPage();
      break;
    case 'contato.html':
      initContactPage();
      break;
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
  // console.log('📞 Inicializando página contato...');

  // Adicionar validação e handlers para formulários
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);

    // Adicionar validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
    });
  });
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

  // Aguardar carregamento dos componentes
  setTimeout(() => {
    animateOnScroll();
    addVisualEffects();
    toggleMobileMenu();
    toggleSidebar(); // <-- Adiciona inicialização do sidebar
    initPageSpecificFeatures();

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