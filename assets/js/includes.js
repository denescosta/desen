class ComponentLoader {
  static async load(containerId, componentPath) {
    try {
      const response = await fetch(componentPath);
      const content = await response.text();
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = content;
      }
    } catch (error) {
      console.error(`Erro ao carregar ${componentPath}:`, error);
    }
  }

  static async loadMultiple(components) {
    const promises = components.map(({ id, path }) =>
      this.load(id, path)
    );
    await Promise.all(promises);
  }
}

// Configuração global
const COMPONENTS = {
  header: 'components/header.html',
  footer: 'components/footer.html',
  navigation: 'components/navigation.html'
};

// Auto-load de componentes comuns
document.addEventListener('DOMContentLoaded', async () => {
  await ComponentLoader.loadMultiple([
    { id: 'header', path: COMPONENTS.header },
    { id: 'footer', path: COMPONENTS.footer }
  ]);
});