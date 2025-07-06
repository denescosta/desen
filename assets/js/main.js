// Carregamento específico para cada página
const currentPage = window.location.pathname.split('/').pop();

const pageConfigs = {
  'index.html': [
    { id: 'hero', path: 'sections/hero.html' },
    { id: 'about', path: 'sections/about.html' },
    { id: 'services', path: 'sections/services.html' },
    { id: 'portfolio', path: 'sections/portfolio.html' },
    { id: 'contact', path: 'sections/contact-form.html' }
  ],
  'sobre.html': [
    { id: 'about-detailed', path: 'sections/about-detailed.html' }
  ],
  'contato.html': [
    { id: 'contact-form', path: 'sections/contact-form.html' }
  ]
};

// Carregar seções específicas da página
document.addEventListener('DOMContentLoaded', async () => {
  const config = pageConfigs[currentPage] || pageConfigs['index.html'];
  await ComponentLoader.loadMultiple(config);
});