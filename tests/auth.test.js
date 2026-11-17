import { describe, it, expect, beforeEach } from 'vitest';
import { initStorage } from '../src/js/storage.js';
import { loginUser, logoutUser } from '../src/js/auth.js';

describe('Pruebas Unitarias - Autenticación Online y Offline (HU-01 y HU-02)', () => {
  beforeEach(() => {
    localStorage.clear();
    initStorage();
  });

  it('HU-01 Escenario 1: debe permitir login online con credenciales válidas y cachear sesión', () => {
    const res = loginUser('daniela@cecar.edu.co', '123', true);
    expect(res.ok).toBe(true);
    expect(res.session.mode).toBe('online');
  });

  it('HU-01 Escenario 2: debe denegar acceso online con contraseña incorrecta', () => {
    const res = loginUser('daniela@cecar.edu.co', 'clave-mala', true);
    expect(res.ok).toBe(false);
    expect(res.message).toBe('Usuario o contraseña incorrectos');
  });

  it('HU-02 Escenario 2: debe rechazar login offline si no existe caché previa', () => {
    const res = loginUser('daniela@cecar.edu.co', '123', false);
    expect(res.ok).toBe(false);
    expect(res.message).toBe('Se requiere conexión a internet para el primer inicio de sesión');
  });

  it('HU-02 Escenario 1: debe permitir login offline tras haber iniciado sesión online previamente', () => {
    loginUser('daniela@cecar.edu.co', '123', true);
    logoutUser();

    const offlineRes = loginUser('daniela@cecar.edu.co', '123', false);
    expect(offlineRes.ok).toBe(true);
    expect(offlineRes.session.mode).toBe('offline');
  });
});