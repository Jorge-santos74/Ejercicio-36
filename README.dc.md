# Proyecto 36: Ensayo de Admisión — Plataforma EdTech con Inteligencia Artificial

Plataforma educativa diseñada para estudiantes de tercer año de secundaria y bachillerato que van a postular a la universidad. Resuelve el problema crítico de enfrentarse por primera vez a un examen estandarizado bajo presión temporal real mediante simulacros cronometrados, diagnóstico analítico por áreas de conocimiento y un motor de refuerzo adaptativo con Inteligencia Artificial.

---

## 📋 Tabla de Contenidos
1. [Descripción General y Problema a Resolver](#-descripción-general-y-problema-a-resolver)
2. [Funcionalidades Principales](#-funcionalidades-principales)
3. [Cumplimiento de la Rúbrica de Mejoras (M1 a M5)](#-cumplimiento-de-la-rúbrica-de-mejoras-m1-a-m5)
4. [Tabla de Pruebas de Estrés y Manejo de Errores (M4)](#-tabla-de-pruebas-de-estrés-y-manejo-de-errores-m4)
5. [Arquitectura Técnica y Sello de IA (M5)](#-arquitectura-técnica-y-sello-de-ia-m5)
6. [Persistencia y Respaldo de Datos (M2)](#-persistencia-y-respaldo-de-datos-m2)
7. [Manual de Uso Rápido (Paso a Paso)](#-manual-de-uso-rápido-paso-a-paso)
8. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
9. [Historial de Commits del Proyecto](#-historial-de-commits-del-proyecto)

---

## 🎯 Descripción General y Problema a Resolver

* **Población Objetivo:** Estudiantes de 3° de secundaria / bachillerato (postulantes universitarios).
* **Problema:** Los alumnos llegan a la prueba oficial de admisión universitaria sin haber experimentado nunca las condiciones reales de evaluación (manejo estricto del tiempo, fatiga cognitiva, alternancia de materias y gestión del estrés).
* **Solución:** Un entorno inmersivo que reproduce el cronómetro y la escala de puntajes reales (100 a 1000 pts), identifica con precisión psicométrica la materia y tema más vulnerable del estudiante, y despliega un bucle de refuerzo adaptativo con un tutor de IA que explica socráticamente el porqué de cada acierto y error.

---

## 🚀 Funcionalidades Principales

1. **Simulacro Cronometrado en Condiciones Reales (M1):**
   - Modalidades configurables: *Diagnóstico Rápido (8 min)*, *Simulacro Extendido (15 min)* y *Ensayo Especializado por Materia*.
   - Reloj regresivo visible con alerta visual de baja ansiedad en los últimos 2 minutos.
   - Paleta de navegación rápida por reactivos y sistema de marcado de dudas (*"Flag for review"*).
   - Cálculo automático de puntaje estandarizado (100–1000 pts) y efectividad global (%).

2. **Desglose Analítico por Área de Conocimiento (M1):**
   - Análisis detallado en 4 asignaturas: **Matemáticas, Lenguaje y Comprensión, Ciencias Naturales e Historia**.
   - Detección algorítmica de la materia crítica y diagnóstico de la falencia cognitiva predominante.
   - Auditoría interactiva pregunta por pregunta con justificaciones paso a paso.

3. **Banco de Preguntas Explorable y Práctica Libre (M1):**
   - Filtrado dinámico por asignatura y dificultad (*fácil, medio, difícil*).
   - Búsqueda en tiempo real por palabras clave o temas curriculares.
   - Modo práctica individual con comprobación instantánea y botón de *"Preguntar a Tutor IA"*.

4. **Centro de Tutoría IA & Refuerzo Adaptativo (M5):**
   - Radar de maestría acumulada por asignatura en base al historial de ensayos.
   - Generador a la carta de 3 preguntas de refuerzo sobre cualquier tema ingresado por el alumno.
   - Consultor conceptual socrático para resolver dudas de fórmulas o definiciones en segundos.

5. **Historial Persistido & Respaldo JSON (M2):**
   - Registro permanente de todos los intentos, tiempos y estados de refuerzo en `localStorage`.
   - Exportación e importación en archivo `.json` para asegurar que los datos nunca se pierdan si se borra la caché del navegador o se cambia de dispositivo.

---

## 🏆 Cumplimiento de la Rúbrica de Mejoras (M1 a M5)

### M1: Que sirva (Funciones Mínimas Completas)
* **Criterio de Aceptación:** Las tres funciones mínimas del ejercicio funcionan en vivo y no son una maqueta.
* **Estado:** 100% Funcional.
  - Función 1: Banco de preguntas organizado por materias curriculares.
  - Función 2: Simulacro cronometrado con temporizador estricto y puntaje final.
  - Función 3: Desglose de resultados por área de conocimiento identificando la debilidad.
* **Commit:** `git commit -m "M1: funcion simulacro cronometrado y desglose de conocimiento"`

### M2: Que recuerde (Persistencia de Datos)
* **Criterio de Aceptación:** Cierro la app por completo, la vuelvo a abrir y los datos siguen ahí.
* **Dónde se guarda:** En el `localStorage` del navegador bajo la clave `'ensayo_admision_attempts_v1'`.
* **Qué pasa si se borra la caché:** Los datos locales del navegador se eliminan. Por esta razón, el sistema incluye de forma nativa los botones **«Exportar JSON»** (para respaldar en un archivo local) y **«Restaurar Copia»** (para subir y recuperar el historial en cualquier momento).
* **Commit:** `git commit -m "M2: persistencia de datos"`

### M3: Que se entienda (Experiencia Móvil y Ergonomía)
* **Criterio de Aceptación:** Una persona ajena abre la app en un teléfono de 320 px y entiende qué hacer sin explicaciones.
* **Implementación:**
  - Diseño *mobile-first* operable a una sola mano a partir de 320 px de ancho.
  - Textos legibles de 16 px o superior con contraste accesible WCAG AA sobre paleta oscura anti-fatiga.
  - Un solo botón principal destacado por pantalla (*"Comenzar"*, *"Siguiente"*, *"Resolver Refuerzo IA"*).
  - Estado vacío descriptivo en el historial con mensaje empático y botón de acción directa.
* **Commit:** `git commit -m "M3: experiencia de uso en celular"`

### M4: Que no se rompa (Validaciones y Resiliencia)
* **Criterio de Aceptación:** Ninguna entrada inválida deja la app en blanco ni escribe errores no controlados en consola.
* **Implementación:** Doble clic bloqueado tras el primer envío, validación de preguntas sin responder mediante modal de confirmación, auto-entrega al llegar a 00:00 y fallback de red.
* **Commit:** `git commit -m "M4: validaciones y manejo de errores"`

### M5: Que piense (Sello de Inteligencia Artificial con Salida Estructurada)
* **Criterio de Aceptación:** La IA analiza el área más débil, formula 3 preguntas nuevas personalizadas y explica la correcta y los distractores con salida JSON estructurada y plan de contingencia.
* **Implementación:**
  - Modelo: `gemini-3.8-flash` en el servidor con `@google/genai`.
  - Salida Estructurada: `responseSchema` estricto garantizando que la respuesta sea consumida como objeto de datos, no texto libre.
  - Seguridad: `GEMINI_API_KEY` gestionada en variables de entorno del servidor.
  - Plan de contingencia (Plan B): Si la API falla, no responde o no tiene clave configurada, conmuta de inmediato al motor pedagógico local calibrado sin congelar la app.
* **Commit:** `git commit -m "M5: inteligencia con salida estructurada"`

---

## 🧪 Tabla de Pruebas de Estrés y Manejo de Errores (M4)

Esta tabla resume los 10 casos de prueba ejecutados para garantizar que la aplicación no se rompa ante comportamientos imprevistos del usuario:

| # | Intento de Rotura / Caso de Prueba | ¿Qué pasaba antes? | ¿Qué pasa ahora? (Solución implementada) | Resultado |
| :-: | :--- | :--- | :--- | :-: |
| **1** | **Entregar examen con 100% de preguntas en blanco** | Posible división por cero al promediar o valores `NaN`. | Modal alerta las omisiones, calcula puntaje base (150 pts), efectividad 0% y clasifica el área crítica sin fallar. | **PASADO** |
| **2** | **Doble clic frenético en "Confirmar Entrega"** | Se guardaban intentos duplicados en `localStorage` con el mismo timestamp. | El botón se desactiva instantáneamente (`disabled`) tras el primer clic. | **PASADO** |
| **3** | **Agotamiento total del temporizador a 00:00** | El temporizador quedaba en números negativos (-00:01) o se congelaba. | Auto-entrega segura inmediata, compilando las respuestas marcadas hasta ese segundo. | **PASADO** |
| **4** | **Pérdida de conexión o API key ausente en IA** | Spinner de carga infinito sin mensaje de error. | Fallback automático al motor pedagógico curricular calibrado con notificación transparente. | **PASADO** |
| **5** | **Recargar la página (F5) con historial vacío** | Error de parseo JSON `Unexpected token` o pantalla en blanco. | Renderizado del Estado Vacío con mensaje motivacional y botón para rendir el primer simulacro. | **PASADO** |
| **6** | **Subir archivo JSON corrupto o inválido en "Restaurar Copia"** | `JSON.parse` arrojaba error no controlado y dejaba la pantalla blanca. | Bloque `try/catch` con validación de estructura y mensaje de error amigable en español. | **PASADO** |
| **7** | **Cambiar de alternativa 20 veces seguidas en una misma pregunta** | Lag visual y desincronización de estado. | Actualización atómica en React sin renderizados duplicados ni pérdida de foco. | **PASADO** |
| **8** | **Pantalla ultra estrecha de 320 px de ancho (móvil)** | Desbordamiento horizontal con scroll lateral roto. | Totalmente responsive, tipografía mínima de 16 px y botones con área táctil mínima de 44 px. | **PASADO** |
| **9** | **Cierre abrupto de la pestaña y reapertura** | Se perdían las notas y el diagnóstico. | Los datos sobreviven al 100% en `localStorage` y se visualizan en el Historial con sus 4 materias. | **PASADO** |
| **10** | **Intentar saltar a la pregunta 3 de refuerzo IA sin responder la 1 y 2** | El alumno podía saltearse el feedback socrático. | Flujo secuencial guiado estricto: requiere verificar la respuesta para habilitar el avance a la siguiente. | **PASADO** |

---

## 🧠 Arquitectura Técnica y Sello de IA (M5)

### Esquema del Prompt del Sistema (System Instruction)
El backend utiliza la siguiente directiva maestra con `gemini-3.8-flash`:

```text
Eres un Diseñador Curricular Senior y Tutor Pedagógico Especialista en Pruebas de Admisión Universitaria.
Tu misión es recibir el diagnóstico del área más débil de un estudiante y generar exactamente TRES (3) preguntas de refuerzo formativo de alta calidad con sus respectivas explicaciones pedagógicas detalladas.

Criterios Obligatorios:
1. Rigor Curricular de Admisión (Comprensión, Aplicación y Análisis).
2. Formato de 4 opciones (A, B, C, D) con una sola opción correcta.
3. Distractores diagnósticos basados en errores y confusiones conceptuales típicas.
4. Explicación didáctica: keyConcept (concepto clave), stepByStep (paso a paso) y distractorAnalysis (por qué falla cada alternativa incorrecta).
```

### Salida JSON Estructurada (`responseSchema`)
```json
{
  "type": "OBJECT",
  "properties": {
    "targetSubject": { "type": "STRING" },
    "targetTopic": { "type": "STRING" },
    "pedagogicalDiagnostic": { "type": "STRING" },
    "questions": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "id": { "type": "STRING" },
          "topic": { "type": "STRING" },
          "stem": { "type": "STRING" },
          "options": {
            "type": "ARRAY",
            "items": {
              "type": "OBJECT",
              "properties": {
                "id": { "type": "STRING" },
                "text": { "type": "STRING" }
              },
              "required": ["id", "text"]
            }
          },
          "correctOptionId": { "type": "STRING" },
          "pedagogicalExplanation": {
            "type": "OBJECT",
            "properties": {
              "keyConcept": { "type": "STRING" },
              "stepByStep": { "type": "ARRAY", "items": { "type": "STRING" } },
              "distractorAnalysis": {
                "type": "OBJECT",
                "properties": {
                  "A": { "type": "STRING" },
                  "B": { "type": "STRING" },
                  "C": { "type": "STRING" },
                  "D": { "type": "STRING" }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 💾 Persistencia y Respaldo de Datos (M2)

* **Almacenamiento Local:** `localStorage.getItem('ensayo_admision_attempts_v1')`.
* **Exportación:** Genera un archivo descargable con formato:
  `ensayo_admision_respaldo_AAAA-MM-DD.json`.
* **Importación:** Carga un archivo `.json` y valida automáticamente que contenga la estructura esperada (`standardizedScore`, `areaResults`, etc.) antes de actualizar el estado.
* **Carga de Prueba Inmediata:** Si el evaluador no dispone de tiempo para rendir un simulacro completo, el botón **«Cargar datos de ejemplo»** en la pestaña Historial puebla al instante dos simulacros históricos con estadísticas representativas.

---

## 📖 Manual de Uso Rápido (Paso a Paso)

1. **Rendir un Simulacro:**
   - Ve a la pestaña **«Simulador»**.
   - Selecciona la modalidad deseada (*Diagnóstico Rápido*, *Extendido* o *Focalizado en una materia*).
   - Presiona **«Comenzar Simulacro»**.
   - Responde las preguntas en pantalla. Puedes navegar con los botones o la paleta numérica y marcar dudas con la bandera.
   - Presiona **«Finalizar Ensayo»** y confirma en el modal.

2. **Revisar el Diagnóstico:**
   - Observa tu puntaje oficial sobre 1000 pts y efectividad global.
   - Revisa el desglose de las 4 materias. La tarjeta ámbar destacará tu **Área Crítica**.
   - Haz clic en **«Resolver 3 Preguntas de Refuerzo IA»**.

3. **Completar el Refuerzo con IA (Sello M5):**
   - Responde secuencialmente cada una de las 3 preguntas adaptativas generadas por la IA.
   - Presiona **«Verificar Respuesta»** para desbloquear la explicación socrática, el concepto clave y el análisis de trampas en los distractores.
   - Al terminar la pregunta 3, recibirás el sello de maestría consolidada.

4. **Explorar el Banco de Preguntas y Preguntar a la IA:**
   - Ve a la pestaña **«Banco»**.
   - Filtra preguntas por materia o dificultad, practica individualmente o haz clic en **«Preguntar a Tutor IA»** para resolver cualquier duda conceptual sobre un reactivo.

5. **Gestionar Respaldos en el Historial:**
   - Ve a la pestaña **«Historial»**.
   - Utiliza **«Exportar JSON»** para respaldar tu progreso o **«Restaurar Copia»** para recuperarlo.

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
* Node.js v18 o superior.
* npm o yarn.

### Pasos
1. Clonar el repositorio o descargar el proyecto:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ensayo-admision
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` basado en `.env.example`:
   ```bash
   GEMINI_API_KEY="tu_clave_de_gemini_api_aqui"
   PORT=3000
   ```
   *(Nota: Si no configuras la API key, la aplicación funcionará de todas formas utilizando el motor pedagógico local de contingencia).*

4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir en el navegador:
   `http://localhost:3000`

---

## 📌 Historial de Commits del Proyecto

Para mantener la trazabilidad exigida por la rúbrica de evaluación:

```bash
git commit -m "M1: funcion simulacro cronometrado y desglose de conocimiento"
git commit -m "M2: persistencia de datos"
git commit -m "M3: experiencia de uso en celular"
git commit -m "M4: validaciones y manejo de errores"
git commit -m "M5: inteligencia con salida estructurada"
```
