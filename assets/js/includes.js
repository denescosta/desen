// includes.js - Sistema de carregamento de componentes e seções

class ComponentLoader {
  static async load(containerId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = content;
        // console.log(`✅ Carregado: ${componentPath}`);
      } else {
        // console.warn(`⚠️ Container '${containerId}' não encontrado`);
      }
    } catch (error) {
      // console.error(`❌ Erro ao carregar ${componentPath}:`, error);
    }
  }

  static async loadMultiple(components) {
    const promises = components.map(({ id, path }) =>
      this.load(id, path)
    );
    await Promise.all(promises);
  }
}

// Configuração global de componentes
const COMPONENTS = {
  header: '../components/header.html',
  footer: '../components/footer.html'
};

// Configuração específica para cada página
const PAGE_CONFIGS = {
  'index.html': [
    { id: 'hero', path: '../sections/hero.html' },
    { id: 'about', path: '../sections/about.html' },
    { id: 'tours', path: '../sections/tours.html' },
    { id: 'testimonials', path: '../sections/testimonials.html' }
    // { id: 'faq', path: '../sections/faq.html' },
    // { id: 'blog', path: '../sections/blog.html' },
    // { id: 'contact', path: '../sections/contact.html' }
  ],
  'conheca.html': [
    { id: 'conheca-page', path: '../sections/conheca.html' }
  ],
  'sobre.html': [
    { id: 'about-detailed', path: '../sections/about.html' }
  ],
  'contato.html': [
    { id: 'contact-form', path: '../sections/contact.html' }
  ]
};

// Função para detectar página atual
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page === '' ? 'index.html' : page;
}

// Função para destacar link ativo no menu
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Auto-carregamento quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
  // console.log('🚀 Iniciando carregamento de componentes...');

  // Carregar componentes comuns (header, footer)
  await ComponentLoader.loadMultiple([
    { id: 'header', path: COMPONENTS.header },
    { id: 'footer', path: COMPONENTS.footer }
  ]);

  // Destacar link ativo após carregar header
  setTimeout(setActiveNavLink, 100);

  // Carregar seções específicas da página
  const currentPage = getCurrentPage();
  const pageConfig = PAGE_CONFIGS[currentPage];

  if (pageConfig) {
    // console.log(`📄 Carregando seções para: ${currentPage}`);
    await ComponentLoader.loadMultiple(pageConfig);
  }

  // console.log('✨ Carregamento completo!');
});

// Função utilitária para carregar componente individual
window.loadComponent = ComponentLoader.load;
window.loadMultipleComponents = ComponentLoader.loadMultiple;