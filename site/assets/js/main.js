(() => {
  const header = document.querySelector('#site-header');
  const menu = document.querySelector('#mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const body = document.body;
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 45);
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive: true});
  const setMenu = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu?.setAttribute('aria-hidden', String(!open));
    menu?.classList.toggle('open', open);
    header?.classList.toggle('menu-active', open);
    body.classList.toggle('body-lock', open);
    if (open) menu?.querySelector('a')?.focus(); else toggle?.focus();
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.classList.contains('open')) setMenu(false);
    if (e.key === 'Tab' && menu?.classList.contains('open')) {
      const links=[...menu.querySelectorAll('a')]; const first=links[0],last=links[links.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
      if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
})();
