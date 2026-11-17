import { describe, it, expect, beforeEach } from 'vitest';
import { initStorage, getCourses, setOnlineMode } from '../src/js/storage.js';
import { downloadCourseModule, openCourseContent } from '../src/js/courses.js';

describe('Pruebas Unitarias y Funcionales - Catálogo, Descarga y Lector Offline (HU-03, HU-04, HU-05)', () => {
  beforeEach(() => {
    localStorage.clear();
    initStorage();
    setOnlineMode(true);
  });

  it('HU-03 Escenario 1: debe cargar el catálogo de cursos matriculados del estudiante', () => {
    const courses = getCourses();
    expect(courses.length).toBeGreaterThanOrEqual(2);
    expect(courses[0].title).toBeDefined();
  });

  it('HU-04 Escenario 1: debe descargar un módulo estando online y marcarlo como Disponible Offline', () => {
    const res = downloadCourseModule('mod-1');
    expect(res.ok).toBe(true);
    expect(res.message).toContain('Disponible Offline');

    const updated = getCourses().find((c) => c.id === 'mod-1');
    expect(updated.downloaded).toBe(true);
  });

  it('HU-04: debe impedir la descarga si el dispositivo está sin conexión', () => {
    setOnlineMode(false);
    const res = downloadCourseModule('mod-1');
    expect(res.ok).toBe(false);
  });

  it('HU-05 Escenario 1: debe permitir leer un módulo previamente descargado estando offline', () => {
    downloadCourseModule('mod-1');
    setOnlineMode(false);

    const openRes = openCourseContent('mod-1');
    expect(openRes.ok).toBe(true);
    expect(openRes.course.content).toContain('Lectura Offline');
  });

  it('HU-05 Escenario 2: debe mostrar mensaje de error al abrir un módulo NO descargado estando offline', () => {
    setOnlineMode(false);

    const openRes = openCourseContent('mod-2');
    expect(openRes.ok).toBe(false);
    expect(openRes.message).toBe('Contenido no disponible. Descárgalo cuando tengas red');
  });
});