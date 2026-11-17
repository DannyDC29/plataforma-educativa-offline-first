import { describe, it, expect, beforeEach } from 'vitest';
import { initStorage, setOnlineMode } from '../src/js/storage.js';
import { downloadCourseModule } from '../src/js/courses.js';
import {
  submitOfflineQuiz,
  triggerAutoSync,
  getGradesSummary
} from '../src/js/sync.js';

describe('Pruebas TDD - Evaluaciones Offline, Sincronización y Calificaciones (HU-06, HU-07, HU-08)', () => {
  beforeEach(() => {
    localStorage.clear();
    initStorage();
    setOnlineMode(true);
    downloadCourseModule('mod-1');
  });

  it('HU-06 Escenario 1: debe guardar localmente el cuestionario resuelto offline como pendiente de sincronización', () => {
    setOnlineMode(false);
    const res = submitOfflineQuiz('mod-1', 0);

    expect(res.ok).toBe(true);
    expect(res.attempt.status).toBe('pendiente');
    expect(res.attempt.score).toBe(100);
  });

  it('HU-06 Escenario 2: debe emitir alerta si el estudiante intenta guardar sin responder preguntas', () => {
    setOnlineMode(false);
    const res = submitOfflineQuiz('mod-1', null);

    expect(res.ok).toBe(false);
    expect(res.message).toContain('Selecciona una respuesta');
  });

  it('HU-07 Escenario 1: debe sincronizar automáticamente las respuestas pendientes cuando vuelve la red', () => {
    setOnlineMode(false);
    submitOfflineQuiz('mod-1', 0);

    setOnlineMode(true);
    const syncRes = triggerAutoSync();

    expect(syncRes.syncedCount).toBe(1);
    const grades = getGradesSummary();
    expect(grades[0].status).toBe('sincronizado');
  });

  it('HU-07 Escenario 2: debe mantener estado pendiente si ocurre un error del servidor (error 500)', () => {
    setOnlineMode(false);
    submitOfflineQuiz('mod-1', 0);

    setOnlineMode(true);
    const syncRes = triggerAutoSync({ simulateServerError: true });

    expect(syncRes.syncedCount).toBe(0);
    expect(syncRes.error).toBe(true);
    const grades = getGradesSummary();
    expect(grades[0].status).toBe('pendiente');
  });

  it('HU-08 Escenario 1 y 2: debe listar las calificaciones con etiqueta preliminar o consolidada según sincronización', () => {
    setOnlineMode(false);
    submitOfflineQuiz('mod-1', 0);

    const pendingGrades = getGradesSummary();
    expect(pendingGrades[0].statusLabel).toBe('Pendiente de enviar al servidor');

    setOnlineMode(true);
    triggerAutoSync();

    const syncedGrades = getGradesSummary();
    expect(syncedGrades[0].statusLabel).toBe('Sincronizado');
  });
});