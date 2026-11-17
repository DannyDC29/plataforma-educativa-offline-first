import {
  getUsers,
  getCachedCredentials,
  saveCachedCredentials,
  saveActiveSession,
  clearActiveSession
} from './storage.js';

export function loginUser(email, password, isOnline) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return {
      ok: false,
      message: 'Por favor ingresa tu correo y contraseña.'
    };
  }

  // HU-01: Inicio de sesión con conexión a internet
  if (isOnline) {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (!found) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos'
      };
    }

    const session = {
      email: found.email,
      name: found.name,
      token: `token-online-${Date.now()}`,
      mode: 'online'
    };

    // Guarda credenciales en caché local para futuros ingresos offline
    saveCachedCredentials({
      email: found.email,
      password: found.password,
      name: found.name
    });
    saveActiveSession(session);

    return {
      ok: true,
      session,
      message: `Bienvenido, ${found.name} (Sesión Online y caché actualizada)`
    };
  }

  // HU-02: Inicio de sesión en modo Offline
  const cached = getCachedCredentials();
  if (!cached) {
    return {
      ok: false,
      message: 'Se requiere conexión a internet para el primer inicio de sesión'
    };
  }

  if (cached.email.toLowerCase() === cleanEmail && cached.password === cleanPass) {
    const session = {
      email: cached.email,
      name: cached.name,
      token: 'token-offline-local',
      mode: 'offline'
    };
    saveActiveSession(session);

    return {
      ok: true,
      session,
      message: `Bienvenido, ${cached.name} (Modo Offline verificado desde caché)`
    };
  }

  return {
    ok: false,
    message: 'Usuario o contraseña incorrectos'
  };
}

export function logoutUser() {
  clearActiveSession();
}