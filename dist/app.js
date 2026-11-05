const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');
function closeMenu() { mainNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const isOpen = mainNav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(isOpen)); });
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 24), { passive: true });
const revealObserver = new IntersectionObserver((entries, observer) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('visible'); observer.unobserve(entry.target); }); }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.getElementById('currentYear').textContent = new Date().getFullYear();
