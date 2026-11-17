const STORAGE_KEYS = {
  USERS: 'eduoffline_users',
  CACHED_AUTH: 'eduoffline_cached_auth',
  SESSION: 'eduoffline_session',
  COURSES: 'eduoffline_courses',
  ATTEMPTS: 'eduoffline_quiz_attempts',
  NETWORK: 'eduoffline_network_online'
};

const DEFAULT_USERS = [
  {
    email: 'daniela@cecar.edu.co',
    password: '123',
    name: 'Daniela Díaz Caro'
  },
  {
    email: 'estudiante@cecar.edu.co',
    password: '123',
    name: 'Estudiante Rural Sincelejo'
  }
];

const DEFAULT_COURSES = [
  {
    id: 'mod-1',
    title: 'Fundamentos de Redes y Conectividad',
    description: 'Conceptos básicos de redes locales, latencia y acceso en zonas rurales.',
    downloaded: false,
    content: 'Lectura Offline: Una red tolerante a fallos almacena paquetes localmente hasta recuperar enlace con el nodo central.',
    quiz: {
      question: '¿Qué principio permite estudiar sin internet en esta plataforma?',
      options: ['Arquitectura Offline-First', 'Streaming continuo', 'Solo nube'],
      correctIndex: 0
    }
  },
  {
    id: 'mod-2',
    title: 'Ingeniería de Software Ágil',
    description: 'Marco Scrum, Historias de Usuario, TDD e Integración Continua.',
    downloaded: false,
    content: 'Lectura Offline: Scrum organiza el trabajo en Sprints cortos con entregas incrementales verificadas por pruebas automatizadas.',
    quiz: {
      question: '¿Qué significa la sigla TDD en pruebas ágiles?',
      options: ['Total Data Design', 'Test-Driven Development', 'Technical Deploy Document'],
      correctIndex: 1
    }
  }
];

export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
  }
  if (localStorage.getItem(STORAGE_KEYS.NETWORK) === null) {
    localStorage.setItem(STORAGE_KEYS.NETWORK, 'true');
  }
}

export function isOnlineMode() {
  const saved = localStorage.getItem(STORAGE_KEYS.NETWORK);
  return saved === null ? true : saved === 'true';
}

export function setOnlineMode(status) {
  localStorage.setItem(STORAGE_KEYS.NETWORK, String(Boolean(status)));
}

export function getUsers() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

export function getCachedCredentials() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CACHED_AUTH) || 'null');
}

export function saveCachedCredentials(user) {
  localStorage.setItem(STORAGE_KEYS.CACHED_AUTH, JSON.stringify(user));
}

export function getActiveSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
}

export function saveActiveSession(sessionData) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
}

export function clearActiveSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getCourses() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
}

export function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
}

export function getQuizAttempts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '[]');
}

export function saveQuizAttempts(attempts) {
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
}