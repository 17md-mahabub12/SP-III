  // Smooth scroll
  function scrollTo(id, el) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
  }

  // Search/filter
  function filterCards(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.cmd-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      const cmd = (card.dataset.cmd || '').toLowerCase();
      card.classList.toggle('hidden', q && !text.includes(q) && !cmd.includes(q));
    });

    const total = document.querySelectorAll('.cmd-card').length;
    const hidden = document.querySelectorAll('.cmd-card.hidden').length;
    const el = document.getElementById('searchMeta');
    if (el) {
      if (!q) {
        el.textContent = '';
      } else {
        el.textContent = `${total - hidden}/${total} টি কমান্ড দেখা যাচ্ছে`;
      }
    }
  }

  // Nav highlight on scroll
  const sections = ['intro', 'flow', 'init', 'basic', 'branch', 'remote', 'undo', 'advanced', 'cheat', 'tips'];
  const navBtns = document.querySelectorAll('.nav-btn');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navBtns.forEach((btn, i) => {
      btn.classList.toggle('active', sections[i] === current);
    });

    const btt = document.getElementById('backToTop');
    if (btt) btt.classList.toggle('show', window.scrollY > 500);
  });

  // Stagger animation for cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.05}s`;
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cmd-card, .cheat-item, .tip-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // Keyboard shortcut: "/" focuses search (like many docs sites)
  window.addEventListener('keydown', (e) => {
    if (e.key !== '/') return;
    const active = document.activeElement;
    const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    if (isTyping) return;
    const input = document.getElementById('searchInput');
    if (!input) return;
    e.preventDefault();
    input.focus();
  });