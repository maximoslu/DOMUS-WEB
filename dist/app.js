const views = [...document.querySelectorAll('.view')];
const navItems = [...document.querySelectorAll('.nav-item')];
const titles = { inicio: 'Panel de inicio', proyectos: 'Proyectos', documentos: 'Documentos', contabilidad: 'Contabilidad', equipo: 'Equipo' };
const modules = [
  { id: 'proyectos', label: 'Proyectos', keywords: 'obras planificación seguimiento hitos' },
  { id: 'documentos', label: 'Documentos', keywords: 'archivo contratos presupuestos planos' },
  { id: 'contabilidad', label: 'Contabilidad', keywords: 'facturas pagos cobros administración' },
  { id: 'equipo', label: 'Equipo', keywords: 'contactos personas responsables directorio' }
];

function showView(id, updateHash = true) {
  const target = document.getElementById(id) ? id : 'inicio';
  views.forEach((view) => view.classList.toggle('active', view.id === target));
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.view === target));
  document.getElementById('pageTitle').textContent = titles[target];
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('menuButton').setAttribute('aria-expanded', 'false');
  if (updateHash) history.replaceState(null, '', `#${target}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach((item) => item.addEventListener('click', (event) => { event.preventDefault(); showView(item.dataset.view); }));
document.querySelectorAll('[data-target]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.target)));
showView(location.hash.slice(1) || 'inicio', false);

const now = new Date();
document.getElementById('currentDay').textContent = String(now.getDate()).padStart(2, '0');
document.getElementById('currentMonth').textContent = now.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
const hour = now.getHours();
document.getElementById('welcomeTitle').textContent = `${hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'}, equipo.`;

const menuButton = document.getElementById('menuButton');
menuButton.addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
});

const storageKey = 'domus-monge-tasks';
let tasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
const taskList = document.getElementById('taskList');
function saveTasks() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
function renderTasks() {
  const pending = tasks.filter((task) => !task.done).length;
  document.getElementById('taskCount').textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  taskList.innerHTML = '';
  if (!tasks.length) {
    const empty = document.createElement('li'); empty.className = 'empty-task'; empty.textContent = 'No hay tareas. Añade la primera para empezar.'; taskList.appendChild(empty); return;
  }
  tasks.forEach((task) => {
    const li = document.createElement('li'); li.className = task.done ? 'done' : '';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done; check.setAttribute('aria-label', `Marcar ${task.text}`);
    check.addEventListener('change', () => { task.done = check.checked; saveTasks(); renderTasks(); });
    const text = document.createElement('span'); text.textContent = task.text;
    const remove = document.createElement('button'); remove.className = 'delete-task'; remove.innerHTML = '&times;'; remove.setAttribute('aria-label', `Eliminar ${task.text}`);
    remove.addEventListener('click', () => { tasks = tasks.filter((item) => item.id !== task.id); saveTasks(); renderTasks(); });
    li.append(check, text, remove); taskList.appendChild(li);
  });
}
document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault(); const input = document.getElementById('taskInput'); const text = input.value.trim(); if (!text) return;
  tasks.unshift({ id: Date.now(), text, done: false }); saveTasks(); renderTasks(); input.value = ''; input.focus();
});
renderTasks();

const overlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('globalSearch');
function openSearch() { overlay.hidden = false; setTimeout(() => searchInput.focus(), 0); }
function closeSearch() { overlay.hidden = true; searchInput.value = ''; document.getElementById('searchResults').innerHTML = '<p>Empieza a escribir para encontrar un área.</p>'; }
document.getElementById('searchButton').addEventListener('click', openSearch);
document.getElementById('closeSearch').addEventListener('click', closeSearch);
overlay.addEventListener('click', (event) => { if (event.target === overlay) closeSearch(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !overlay.hidden) closeSearch(); if ((event.ctrlKey || event.metaKey) && event.key === 'k') { event.preventDefault(); openSearch(); } });
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase(); const container = document.getElementById('searchResults'); container.innerHTML = '';
  if (!query) { container.innerHTML = '<p>Empieza a escribir para encontrar un área.</p>'; return; }
  const matches = modules.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query));
  if (!matches.length) { container.innerHTML = '<p>No se han encontrado resultados.</p>'; return; }
  matches.forEach((item) => { const button = document.createElement('button'); button.className = 'search-result'; button.innerHTML = `<strong>${item.label}</strong><span>Ir →</span>`; button.addEventListener('click', () => { closeSearch(); showView(item.id); }); container.appendChild(button); });
});

const toast = document.getElementById('toast'); let toastTimer;
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => {
  toast.textContent = button.dataset.toast; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}));
