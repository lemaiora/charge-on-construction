const mast = document.querySelector('.mast');
const menu = document.querySelector('#directory');
const toggle = document.querySelector('.dots');
toggle.addEventListener('click', () => {
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
});
menu.querySelector('.close').addEventListener('click', () => menu.close());
menu.addEventListener('click', event => {
  if (event.target === menu && event.clientX < menu.getBoundingClientRect().left) menu.close();
});
menu.addEventListener('close', () => {
  toggle.setAttribute('aria-expanded','false');
  toggle.focus({preventScroll:true});
});

const hero = document.querySelector('.hero');
let lastY = window.scrollY;
function updateHeader() {
  const y = Math.max(0, window.scrollY);
  const opening = hero && y < hero.offsetHeight - mast.offsetHeight;
  mast.classList.toggle('opening', Boolean(opening));
  mast.classList.toggle('solid', y > 65);
  const desktopOpening = opening && matchMedia('(min-width:1024px)').matches;
  mast.style.top = desktopOpening ? (hero.offsetHeight - mast.offsetHeight - y) + 'px' : '';
  if (Math.abs(y - lastY) > 3 || y === 0) {
    mast.classList.toggle('away', !opening && y > mast.offsetHeight && y > lastY && !mast.contains(document.activeElement));
    lastY = y;
  }
}
window.addEventListener('scroll', updateHeader, {passive:true});
window.addEventListener('resize', updateHeader);
mast.addEventListener('focusin', () => mast.classList.remove('away'));
updateHeader();

const markers = document.querySelector('.markers');
if (markers) {
  const panels = document.querySelectorAll('.ethos section');
  const mark = () => {
    const mid = window.innerHeight / 2;
    const active = [...panels].findIndex(p => {
      const r = p.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    });
    markers.style.display = active < 0 ? 'none' : '';
    [...markers.children].forEach((a,i) => a.classList.toggle('active', i === active));
  };
  window.addEventListener('scroll', mark, {passive:true});
  mark();
}

const inquiry = document.querySelector('#inquiry');
if (inquiry && new URL(inquiry.action).origin === location.origin) {
  const requestId = crypto.randomUUID();
  inquiry.addEventListener('submit', async event => {
    event.preventDefault();
    const button = inquiry.querySelector('button');
    const status = inquiry.querySelector('[role="status"]');
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const body = new URLSearchParams(new FormData(inquiry));
      body.set('request_id',requestId);
      const response = await fetch(inquiry.action,{method:'POST',headers:{Accept:'application/json'},body});
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      location.assign('../thank-you/');
    } catch (error) {
      status.textContent = error.message || 'Please try again or email the team directly.';
      button.disabled = false;
    }
  });
}
