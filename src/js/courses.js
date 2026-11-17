import { getCourses, saveCourses, isOnlineMode } from './storage.js';

export function downloadCourseModule(courseId) {
  if (!isOnlineMode()) {
    return {
      ok: false,
      message: 'Se requiere conexión a internet para descargar este módulo.'
    };
  }

  const courses = getCourses();
  const index = courses.findIndex((c) => c.id === courseId);

  if (index === -1) {
    return {
      ok: false,
      message: 'Módulo no encontrado.'
    };
  }

  courses[index].downloaded = true;
  saveCourses(courses);
  window.dispatchEvent(new Event('coursesUpdated'));

  return {
    ok: true,
    message: `Módulo "${courses[index].title}" descargado. Estado: Disponible Offline.`
  };
}

export function openCourseContent(courseId) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return {
      ok: false,
      message: 'Módulo no encontrado.'
    };
  }

  // HU-05 Escenario 2: Sin conexión y material NO descargado
  if (!course.downloaded && !isOnlineMode()) {
    return {
      ok: false,
      message: 'Contenido no disponible. Descárgalo cuando tengas red'
    };
  }

  // HU-05 Escenario 1: Reproducción/lectura fluida desde almacenamiento local o con red
  return {
    ok: true,
    course
  };
}

export function renderCoursesSection(container) {
  if (!container) return;

  const courses = getCourses();

  if (!courses.length) {
    container.innerHTML = `
      <section class="card">
        <h3>Mis Cursos</h3>
        <p>Aún no tienes cursos asignados. Contacta a tu docente.</p>
      </section>
    `;
    return;
  }

  const cardsHtml = courses
    .map(
      (course) => `
      <article style="border:1px solid #cbd5e1; border-radius:8px; padding:1rem; margin-bottom:0.75rem; background:#f8fafc;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <h4 style="margin:0;">${course.title}</h4>
          <span class="badge ${course.downloaded ? 'online' : 'offline'}">
            ${course.downloaded ? 'Disponible Offline' : 'No descargado'}
          </span>
        </div>
        <p style="margin:0.5rem 0; color:#475569;">${course.description}</p>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button
            type="button"
            class="btn-download-course"
            data-id="${course.id}"
            ${course.downloaded ? 'disabled' : ''}
          >
            ${course.downloaded ? 'Descargado en dispositivo' : 'Descargar módulo'}
          </button>
          <button
            type="button"
            class="btn-open-course"
            data-id="${course.id}"
            style="background:#0f766e;"
          >
            Abrir material
          </button>
        </div>
      </article>
    `
    )
    .join('');

  container.innerHTML = `
    <section class="card">
      <h3 style="margin-top:0;">Mis Cursos Matriculados (HU-03, HU-04 y HU-05)</h3>
      <p id="courses-feedback" style="font-weight:600; margin:0.5rem 0;"></p>
      <div>${cardsHtml}</div>
      <div id="course-reader" style="display:none; margin-top:1rem; padding:1rem; border-left:4px solid #005a8d; background:#eff6ff; border-radius:6px;">
        <h4 id="reader-title" style="margin-top:0;"></h4>
        <p id="reader-body"></p>
        <button type="button" id="close-reader-btn" style="background:#475569;">Cerrar lectura</button>
      </div>
    </section>
  `;

  const feedbackEl = container.querySelector('#courses-feedback');
  const readerBox = container.querySelector('#course-reader');
  const readerTitle = container.querySelector('#reader-title');
  const readerBody = container.querySelector('#reader-body');
  const closeReaderBtn = container.querySelector('#close-reader-btn');

  container.querySelectorAll('.btn-download-course').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const res = downloadCourseModule(id);
      renderCoursesSection(container);
      const updatedFeedback = container.querySelector('#courses-feedback');
      if (updatedFeedback) {
        updatedFeedback.textContent = res.message;
        updatedFeedback.style.color = res.ok ? '#16a34a' : '#dc2626';
      }
    });
  });

  container.querySelectorAll('.btn-open-course').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const res = openCourseContent(id);
      if (!res.ok) {
        feedbackEl.textContent = res.message;
        feedbackEl.style.color = '#dc2626';
        readerBox.style.display = 'none';
        return;
      }

      feedbackEl.textContent = '';
      readerTitle.textContent = res.course.title;
      readerBody.textContent = res.course.content;
      readerBox.style.display = 'block';
    });
  });

  closeReaderBtn?.addEventListener('click', () => {
    readerBox.style.display = 'none';
  });
}