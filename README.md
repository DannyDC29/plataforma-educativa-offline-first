# 📚 Plataforma Educativa Offline First — EduOffline Sincelejo

![Estado CI](https://img.shields.io/badge/CI-GitHub%20Actions%20Passing-brightgreen)
![Arquitectura](https://img.shields.io/badge/Arquitectura-PWA%20Offline--First-0f766e)
![Runtime](https://img.shields.io/badge/Node.js-v20-339933)
![Bundler](https://img.shields.io/badge/Vite-v6.0.0-646CFF)
![Testing](https://img.shields.io/badge/Vitest-v2.1.0-729B1B)
![Metodología](https://img.shields.io/badge/Metodología-Scrum%20%2B%20TDD-d97706)

**Aplicación Web Progresiva (PWA)** con arquitectura tolerante a fallos de red diseñada para garantizar la continuidad educativa de estudiantes en zonas rurales y urbanas con conectividad intermitente o limitada en **Sincelejo, Sucre (Colombia)**.

Proyecto desarrollado en el marco de la asignatura **Electiva Profesional en Ingeniería del Software (IX)** — Corporación Universitaria del Caribe (**CECAR**), 2026.

---

## 🎯 Problema y Solución

En entornos con cobertura inestable de internet, las plataformas educativas tradicionales interrumpen el aprendizaje, provocan la pérdida de evaluaciones en curso y obligan a los estudiantes a asumir altos costos de datos móviles.

**EduOffline Sincelejo** invierte la dependencia de red mediante el patrón **Offline-First**:
* **Cache-First:** Prioriza la entrega inmediata de contenidos y activos desde el almacenamiento local del navegador (`localStorage` y `Service Worker`).
* **Persistencia Resiliente:** Guarda credenciales cifradas, módulos educativos y respuestas de evaluaciones localmente sin requerir conexión activa.
* **Sincronización Silenciosa:** Detecta automáticamente el retorno de la conectividad (`online` / `offline`) y sincroniza el progreso académico con el servidor en segundo plano.

---

## ✨ Características Principales del MVP

| ID | Requisito / Historia | Descripción Funcional |
| :--- | :--- | :--- |
| **RF-01** | **HU-01 / HU-02** | **Autenticación Dual (Online / Offline):** Inicio de sesión en línea con almacenamiento criptográfico local de credenciales para permitir futuros accesos completamente sin internet. |
| **RF-02** | **HU-03 / HU-04** | **Catálogo y Descarga Local:** Visualización de cursos matriculados y descarga de módulos completos (textos, metadatos y cuestionarios) con un clic. |
| **RF-02** | **HU-05** | **Consumo Desconectado:** Lectura fluida de módulos descargados sin red y bloqueo preventivo con alerta clara cuando un módulo no ha sido descargado previamente. |
| **RF-03** | **HU-06** | **Motor de Evaluación Offline:** Resolución y calificación local inmediata de cuestionarios sin conexión, marcando los resultados como *Pendientes de envío*. |
| **RF-04** | **HU-07 / HU-08** | **Sincronización Automática y Panel de Notas:** Envío automático de la cola de evaluaciones pendientes al reconectar la red y actualización visual del estado (`Pendiente` → `Sincronizado`). |

### Atributos de Calidad (RNF)
* **RNF-01 (Rendimiento):** Consumo optimizado en segundo plano ($\le 50\text{ MB}$ de RAM) apto para dispositivos móviles de gama de entrada.
* **RNF-02 (Usabilidad):** Acceso a la descarga de módulos en $\le 2$ clics desde el panel principal.
* **RNF-03 (Seguridad):** Almacenamiento seguro de credenciales y respuestas locales en equipos compartidos.

---

## 🗂️ Arquitectura y Estructura del Proyecto

El código fuente sigue una arquitectura modular desacoplada para facilitar el mantenimiento y las pruebas unitarias aisladas:

```text
plataforma-educativa-offline-first/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de Integración Continua (GitHub Actions)
├── public/
│   ├── manifest.json            # Manifiesto de instalación PWA
│   └── sw.js                    # Service Worker (estrategia Cache-First)
├── src/
│   ├── css/
│   │   └── styles.css           # Estilos responsivos (Mobile-First)
│   ├── js/
│   │   ├── app.js               # Orquestador principal de vistas y eventos DOM
│   │   ├── auth.js              # Lógica de autenticación online/offline (HU-01, HU-02)
│   │   ├── courses.js           # Catálogo, descarga local y lector offline (HU-03 a HU-05)
│   │   ├── storage.js           # Capa de persistencia en localStorage y estado de red
│   │   └── sync.js              # Evaluaciones locales, cola y Background Sync (HU-06 a HU-08)
│   └── index.html               # Punto de entrada de la interfaz PWA
├── tests/
│   ├── setup.js                 # Configuración global del entorno JSDOM y mocks
│   ├── base.test.js             # Validación base de arquitectura y storage (1 test)
│   ├── auth.test.js             # Pruebas unitarias de autenticación (4 tests)
│   ├── courses.test.js          # Pruebas unitarias de catálogo y descargas (5 tests)
│   └── sync.test.js             # Pruebas unitarias de evaluación y sync (5 tests)
├── package.json                 # Dependencias y scripts de construcción/pruebas
├── vite.config.js               # Configuración de Vite y entorno Vitest
└── README.md                    # Documentación técnica del proyecto
```

---

## 🛠️ Stack Tecnológico

* **Frontend & Lógica:** HTML5, CSS3, JavaScript Moderno (ES Modules).
* **Capacidades PWA:** Service Workers (`sw.js`), Web App Manifest (`manifest.json`), Web Storage API (`localStorage`) y Network Events (`online`/`offline`).
* **Empaquetador (Bundler):** Vite `v6.0.0`.
* **Framework de Pruebas (TDD):** Vitest `v2.1.0` + JSDOM `v25.0.0`.
* **Control de Versiones y CI:** Git, GitHub (Gitflow) y GitHub Actions (Ubuntu + Node.js `v20`).

---

## 💻 Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de contar con:

* **Node.js** `v20.x` o superior ([Descargar Node.js](https://nodejs.org/))
* **npm** `v10.x` o superior (incluido con Node.js)
* **Git** instalado y configurado en tu terminal

Verifica tus versiones ejecutando:
```bash
node -v
npm -v
git --version
```

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para clonar el repositorio y levantar el entorno de desarrollo en tu máquina:

### 1. Clonar el repositorio
```bash
git clone https://github.com/DannyDC29/plataforma-educativa-offline-first.git
```

### 2. Ingresar al directorio del proyecto
```bash
cd plataforma-educativa-offline-first
```

### 3. Instalar las dependencias
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Una vez iniciado, abre tu navegador en la URL local indicada por Vite (por defecto `http://localhost:5173`).

### 5. Generar compilación de producción (opcional)
Para verificar el empaquetado final optimizado en la carpeta `dist/`:
```bash
npm run build
```
Para previsualizar la versión compilada de producción:
```bash
npm run preview
```

---

## 🧪 Guía de Pruebas Automatizadas (TDD con Vitest)

El proyecto fue construido bajo la metodología **Test-Driven Development (TDD)** siguiendo el ciclo **Rojo → Verde → Refactorización**, alcanzando una cobertura de **4 archivos de prueba y 15 pruebas unitarias aprobadas**.

### 1. Ejecutar toda la suite de pruebas (modo normal / CI)
Ejecuta todas las pruebas una sola vez y muestra el reporte consolidado en consola (mismo comando utilizado por GitHub Actions):
```bash
npm test
```
*(Equivalente a `npx vitest run`)*

### 2. Ejecutar pruebas en modo observador (Watch Mode)
Ideal durante el desarrollo para que las pruebas se re-ejecuten automáticamente al guardar cambios:
```bash
npx vitest
```

### 3. Ejecutar un archivo de pruebas individual
Si deseas probar un módulo específico de forma aislada, pasa la ruta del archivo correspondiente:

* **Probar solo la configuración base y almacenamiento (`base.test.js`):**
  ```bash
  npx vitest run tests/base.test.js
  ```

* **Probar solo el módulo de autenticación online/offline (`auth.test.js`):**
  ```bash
  npx vitest run tests/auth.test.js
  ```

* **Probar solo el módulo de catálogo, descargas y lectura (`courses.test.js`):**
  ```bash
  npx vitest run tests/courses.test.js
  ```

* **Probar solo el motor de evaluaciones y sincronización (`sync.test.js`):**
  ```bash
  npx vitest run tests/sync.test.js
  ```

### 4. Ejecutar una prueba específica por su nombre
Para correr únicamente un caso de prueba (`it` / `test`) dentro de cualquier archivo:
```bash
npx vitest run -t "nombre o fragmento del test"
```
**Ejemplo:**
```bash
npx vitest run -t "offline"
```

---

## 📖 Cómo Funciona la Plataforma (Flujo de Uso)

La interfaz cuenta con un **simulador de estado de red integrado** en la barra superior (`En línea` / `Sin conexión` / `Reconectar Red`) que permite validar el comportamiento real del sistema sin necesidad de desconectar físicamente el Wi-Fi:

1. **Primer Acceso Online (HU-01):**
   * Ingresa con credenciales válidas (por ejemplo: `daniela@cecar.edu.co`) mientras el estado está **En línea**.
   * El sistema autentica al estudiante y guarda sus credenciales de forma segura en la caché local.
2. **Descarga de Contenidos (HU-03 y HU-04):**
   * En el panel **"Mis Cursos Matriculados"**, selecciona un curso (ej. *Fundamentos de Redes y Conectividad*) y haz clic en **"Descargar módulo completo"**.
   * El curso cambia su estado a una insignia verde: **`Disponible Offline`**.
3. **Navegación y Estudio Sin Internet (HU-02 y HU-05):**
   * Cambia el estado de red a **Sin conexión** (o cierra sesión y vuelve a ingresar sin red).
   * Podrás iniciar sesión gracias a la caché local, abrir y estudiar los módulos descargados sin cortes.
   * Si intentas abrir un curso que *no* fue descargado previamente, la plataforma bloquea el acceso de forma controlada mostrando: *"Contenido no disponible. Descárgalo cuando tengas red"*.
4. **Evaluación Offline y Cola de Sincronización (HU-06):**
   * Dentro del módulo descargado, resuelve el cuestionario interactivo estando **Sin conexión**.
   * El motor evalúa las respuestas localmente, muestra tu calificación inmediata y registra el intento en la tabla de notas con etiqueta naranja: **`Pendiente de enviar al servidor`**.
5. **Reconexión y Sincronización Automática (HU-07 y HU-08):**
   * Pulsa **"Reconectar Red"** (o restablece tu conexión a internet).
   * El listener de red detecta la conectividad automáticamente, vacía la cola de envío en segundo plano y actualiza el estado de la calificación a verde: **`Sincronizado`**.

---

## 🔄 Integración Continua (CI) y Flujo Gitflow

### Estrategia de Ramas
* `main`: Código estable y listo para producción.
* `develop`: Rama de integración donde convergen las funcionalidades probadas.
* `feature/*`: Ramas aisladas por módulo (`feature/autenticacion-offline`, `feature/catalogo-descargas`, `feature/evaluaciones-sync`).

### Pipeline Automatizado (`.github/workflows/ci.yml`)
Cada `push` o `pull_request` hacia `main`, `develop` o `feature/**` dispara automáticamente un flujo en **Ubuntu** con **Node.js 20** que ejecuta:
1. `actions/checkout@v4` — Descarga del código fuente.
2. `actions/setup-node@v4` — Configuración del entorno Node.js 20.
3. `npm install` — Instalación limpia de dependencias.
4. `npm test` — Ejecución obligatoria de las 15 pruebas unitarias en Vitest.
5. `npm run build` — Verificación de compilación con Vite.

---

## 👥 Equipo de Desarrollo

* **Daniela Díaz Caro** (`@DannyDC29`) — *Product Owner & Desarrolladora (Módulo Autenticación y Arquitectura Base)*
* **Juan Felipe Pérez Gómez** (`@JuanPerez0114`) — *Scrum Master & Desarrollador (Módulo Catálogo, Descargas y Lector Offline)*
* **Estefanía Villalba Paternina** (`@Niabonita`) — *Desarrolladora (Módulo Evaluaciones Offline, Sincronización y Calificaciones)*

**Docente Asesora:** Esp. Laudyt Maria Lambraño Pérez  
**Institución:** Corporación Universitaria del Caribe — CECAR (Sincelejo, Sucre, 2026)
