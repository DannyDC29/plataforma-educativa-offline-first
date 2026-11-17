export function renderSyncSection(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="card">
      <h3>Evaluaciones Offline y Calificaciones (Módulo pendiente de integración - Sprint 2/3)</h3>
      <p>Aquí se cargarán los cuestionarios locales y la sincronización automática.</p>
    </section>
  `;
}

export function triggerAutoSync() {
  return { syncedCount: 0 };
}