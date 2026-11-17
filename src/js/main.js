import { initStorage, isOnlineMode, setOnlineMode, getActiveSession } from './storage.js';
import { loginUser, logoutUser } from './auth.js';
import { renderCoursesSection } from './courses.js';
import { renderSyncSection, triggerAutoSync } from './sync.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

initStorage();

const networkBadge = document.getElementById('network-status');
const toggleNetworkBtn = document.getElementById('toggle-network-btn');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginFeedback = document.getElementById('login-feedback');
const studentWelcome = document.getElementById('student-welcome');
const sessionModeInfo = document.getElementById('session-mode-info');
const logoutBtn = document.getElementById('logout-btn');
const coursesContainer = document.getElementById('courses-container');
const syncContainer = document.getElementById('sync-container');

function updateNetworkUI() {
  const online = isOnlineMode();
  if (networkBadge) {
    networkBadge.textContent = online ? 'En línea' : 'Sin conexión (Offline)';
    networkBadge.className = online ? 'badge online' : 'badge offline';
  }
  if (toggleNetworkBtn) {
    toggleNetworkBtn.textContent = online ? 'Simular Sin Red' : 'Reconectar Red';
  }
  if (online) {
    triggerAutoSync();
  }
}

function renderApp() {
  updateNetworkUI();
  const session = getActiveSession();

  if (!session) {
    loginView.style.display = 'block';
    dashboardView.style.display = 'none';
    return;
  }

  loginView.style.display = 'none';
  dashboardView.style.display = 'block';
  studentWelcome.textContent = `Estudiante: ${session.name} (${session.email})`;
  sessionModeInfo.textContent = `Autenticado en modo: ${session.mode.toUpperCase()}`;

  renderCoursesSection(coursesContainer);
  renderSyncSection(syncContainer);
}

toggleNetworkBtn?.addEventListener('click', () => {
  setOnlineMode(!isOnlineMode());
  renderApp();
});

window.addEventListener('online', () => {
  setOnlineMode(true);
  renderApp();
});

window.addEventListener('offline', () => {
  setOnlineMode(false);
  renderApp();
});

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const result = loginUser(email, password, isOnlineMode());

  loginFeedback.textContent = result.message;
  loginFeedback.style.color = result.ok ? '#16a34a' : '#dc2626';

  if (result.ok) {
    renderApp();
  }
});

logoutBtn?.addEventListener('click', () => {
  logoutUser();
  loginFeedback.textContent = '';
  renderApp();
});

renderApp();