export function renderCoursesSection(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="card">
      <h3>Catálogo de Cursos (Módulo pendiente de integración - Sprint 1/2)</h3>
      <p>Aquí se cargarán los cursos matriculados y la descarga offline.</p>
    </section>
  `;
}