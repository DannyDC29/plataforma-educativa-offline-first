import { describe, it, expect } from 'vitest';

describe('Verificación inicial del entorno PWA', () => {
  it('debe confirmar que el entorno de pruebas funciona correctamente', () => {
    const appName = 'EduOffline Sincelejo';
    expect(appName).toContain('Offline');
  });
});