import {
  getCourses,
  getQuizAttempts,
  saveQuizAttempts,
  isOnlineMode
} from './storage.js';

function evaluateQuizAnswer(course, selectedIndex) {
  return Number(selectedIndex) === course.quiz.correctIndex ? 100 : 40;
}

function formatSyncLabel(status) {
  return status === 'sincronizado' ? 'Sincronizado' : 'Pendiente de enviar al servidor';
}

function renderGradeRow(grade) {
  const badgeClass = grade.status === 'sincronizado' ? 'online' : 'offline';
  return `
    <tr>
      <td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">${grade.courseTitle}</td>
      <td style="padding:0.5rem; border-bottom:1px solid #e2e8f0; font-weight:700;">${grade.score} / 100</td>
      <td style="padding:0.5rem; border-bottom:1px solid #e2e8f0;">
        <span class="badge ${badgeClass}">${grade.statusLabel}</span>
      </td>
    </tr>
  `;
}

export function submitOfflineQuiz(courseId, selectedIndex) {
  if (selectedIndex === null || selectedIndex === undefined || Number.isNaN(Number(selectedIndex))) {
    return {
      ok: false,
      message: 'Selecciona una respuesta antes de finalizar y guardar el cuestionario.'
    };
  }

  const course = getCourses().find((c) => c.id === courseId);
  if (!course || !course.quiz) {
    return { ok: false, message: 'Cuestionario no disponible.' };
  }

  if (!course.downloaded && !isOnlineMode()) {
    return { ok: false, message: 'Debes descargar el módulo antes de evaluarlo sin conexión.' };
  }

  const score = evaluateQuizAnswer(course, selectedIndex);
  const onlineNow = isOnlineMode();

  const attempt = {
    id: `att-${Date.now()}`,
    courseId: course.id,
    courseTitle: course.title,
    score,
    status: onlineNow ? 'sincronizado' : 'pendiente',
    updatedAt: new Date().toLocaleTimeString()
  };

  const updatedAttempts = [...getQuizAttempts().filter((a) => a.courseId !== course.id), attempt];
  saveQuizAttempts(updatedAttempts);

  return {
    ok: true,
    attempt,
    message: onlineNow
      ? `Cuestionario enviado y sincronizado. Calificación: ${score}/100.`
      : `Respuestas guardadas localmente (Pendiente de sincronización). Nota preliminar: ${score}/100.`
  };
}

export function triggerAutoSync(options = {}) {
  if (!isOnlineMode()) return { syncedCount: 0, error: false };
  if (options.simulateServerError) {
    return { syncedCount: 0, error: true, message: 'Error 500 del servidor: reintento programado.' };
  }

  let syncedCount = 0;
  const updated = getQuizAttempts().map((item) => {
    if (item.status !== 'pendiente') return item;
    syncedCount += 1;
    return { ...item, status: 'sincronizado', updatedAt: new Date().toLocaleTimeString() };
  });

  if (syncedCount > 0) saveQuizAttempts(updated);
  return { syncedCount, error: false };
}

export function getGradesSummary() {
  return getQuizAttempts().map((item) => ({
    ...item,
    statusLabel: formatSyncLabel(item.status)
  }));
}

export function renderSyncSection(container) {
  if (!container) return;

  const courses = getCourses();
  const grades = getGradesSummary();

  const optionsHtml = courses
    .map(
      (c) =>
        `<option value="${c.id}">${c.title} (${c.downloaded ? 'Disponible Offline' : 'Solo Online'})</option>`
    )
    .join('');

  const rowsHtml = grades.length
    ? grades.map(renderGradeRow).join('')
    : `<tr><td colspan="3" style="padding:0.6rem; color:#64748b;">Aún no has resuelto cuestionarios.</td></tr>`;

  container.innerHTML = `
    <section class="card" style="margin-bottom:1rem;">
      <h3 style="margin-top:0;">Evaluación Interactiva Local (HU-06)</h3>
      <label for="quiz-course-select">Selecciona un módulo:</label>
      <select id="quiz-course-select" style="width:100%; padding:0.55rem; border-radius:6px; border:1px solid #cbd5e1; margin-bottom:0.75rem;">
        ${optionsHtml}
      </select>
      <div id="quiz-question-box" style="background:#f8fafc; padding:0.9rem; border-radius:8px; border:1px solid #e2e8f0;"></div>
      <p id="quiz-feedback" style="font-weight:600; margin-top:0.6rem;"></p>
    </section>

    <section class="card">
      <h3 style="margin-top:0;">Panel de Calificaciones y Sincronización (HU-07 y HU-08)</h3>
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:0.5rem;">Módulo</th>
            <th style="padding:0.5rem;">Calificación</th>
            <th style="padding:0.5rem;">Estado de Sincronización</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </section>
  `;

  const selectEl = container.querySelector('#quiz-course-select');
  const questionBox = container.querySelector('#quiz-question-box');
  const feedbackEl = container.querySelector('#quiz-feedback');

  function paintQuestion() {
    const selectedCourse = courses.find((c) => c.id === selectEl.value) || courses[0];
    if (!selectedCourse) return;

    const opts = selectedCourse.quiz.options
      .map(
        (opt, idx) => `
        <label style="display:block; margin:0.35rem 0; cursor:pointer;">
          <input type="radio" name="quiz-opt" value="${idx}" style="width:auto; margin-right:0.4rem;" />
          ${opt}
        </label>
      `
      )
      .join('');

    questionBox.innerHTML = `
      <p style="margin-top:0; font-weight:600;">${selectedCourse.quiz.question}</p>
      ${opts}
      <button type="button" id="submit-quiz-btn" style="margin-top:0.5rem;">Finalizar y Guardar</button>
    `;

    questionBox.querySelector('#submit-quiz-btn')?.addEventListener('click', () => {
      const checked = questionBox.querySelector('input[name="quiz-opt"]:checked');
      const val = checked ? Number(checked.value) : null;
      const res = submitOfflineQuiz(selectedCourse.id, val);

      if (!res.ok) {
        feedbackEl.textContent = res.message;
        feedbackEl.style.color = '#dc2626';
        return;
      }

      renderSyncSection(container);
      const updatedFeedback = container.querySelector('#quiz-feedback');
      if (updatedFeedback) {
        updatedFeedback.textContent = res.message;
        updatedFeedback.style.color = '#16a34a';
      }
    });
  }

  selectEl?.addEventListener('change', paintQuestion);
  paintQuestion();
}

window.addEventListener('coursesUpdated', () => {
  const syncContainer = document.getElementById('sync-container');
  if (syncContainer) renderSyncSection(syncContainer);
});