  function getSearchInput() {
    return document.getElementById('searchInput');
  }

  // Smooth scroll
  function scrollTo(id, el) {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  // Search/filter
  function filterCards(query) {
    const q = String(query || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.cmd-card');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cmd = (card.dataset.cmd || '').toLowerCase();
      card.classList.toggle('hidden', q && !text.includes(q) && !cmd.includes(q));
    });

    const meta = document.getElementById('searchMeta');
    if (!meta) return;

    if (!q) {
      meta.textContent = '';
      return;
    }

    const hidden = document.querySelectorAll('.cmd-card.hidden').length;
    meta.textContent = `${cards.length - hidden}/${cards.length} টি কমান্ড দেখা যাচ্ছে`;
  }

  // Nav highlight on scroll
  const sections = ['intro', 'flow', 'init', 'basic', 'branch', 'remote', 'undo', 'advanced', 'cheat', 'tips'];
  const navBtns = document.querySelectorAll('.nav-btn');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section && window.scrollY >= section.offsetTop - 120) current = id;
    });

    navBtns.forEach((btn, i) => {
      btn.classList.toggle('active', sections[i] === current);
    });

    if (backToTopBtn) backToTopBtn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  // Stagger animation for cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      entry.target.style.animationDelay = `${i * 0.05}s`;
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cmd-card, .cheat-item, .tip-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // Keyboard shortcuts:
  // - "/" focuses search (like many docs sites)
  // - "Escape" clears search
  window.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);

    if (e.key === '/') {
      if (isTyping) return;
      const input = getSearchInput();
      if (!input) return;
      e.preventDefault();
      input.focus();
      return;
    }

    if (e.key === 'Escape') {
      const input = getSearchInput();
      if (!input || !input.value) return;
      input.value = '';
      filterCards('');
      input.focus();
    }
  });