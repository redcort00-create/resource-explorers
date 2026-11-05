(() => {
  'use strict';
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.article-sidebar nav a')];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id));
    }, { rootMargin: '-8% 0px -62% 0px', threshold: 0 });
    document.querySelectorAll('.reading-section,#video').forEach(section => observer.observe(section));
  }
})();
