import { UserJourneyStep, DatabaseEntity, SystemPromptTemplate, WireframeSection } from '../types';

export const USER_JOURNEY_STEPS: UserJourneyStep[] = [
  {
    stepNumber: 1,
    phase: 'Fase 1: Onboarding y Calibración del Ensayo',
    userGoal: 'Comprender las reglas del simulacro, seleccionar el tipo de ensayo y entrar en estado de concentración.',
    actions: [
      'El estudiante ingresa a la aplicación y observa su historial y nivel general.',
      'Selecciona el formato de simulación: "Simulacro General Cronometrado" o "Ensayo Específico por Materia".',
      'Configura o confirma las condiciones reales: tiempo límite estricto (ej. 12 minutos modo rápido o 65 minutos modo oficial), sin pausas arbitrarias.',
      'Presiona "Comenzar Examen en Condiciones Reales".'
    ],
    systemResponse: [
      'El sistema bloquea distracciones visuales e inicia el cronómetro regresivo sincronizado a nivel de milisegundos.',
      'Sortea y baraja las preguntas asegurando cobertura equitativa por área de conocimiento (Matemáticas, Lenguaje, Ciencias, Historia).',
      'Inicializa el registro del intento en base de datos (`exam_attempts`) en estado `IN_PROGRESS` con timestamp de inicio.'
    ],
    emotionalState: 'ansioso',
    kpis: ['Tasa de inicio de simulacro (> 85%)', 'Tiempo de lectura de instrucciones (< 45s)'],
    painPointsResolved: 'Elimina la incertidumbre sobre cómo es la estructura y el ritmo temporal de la prueba real.'
  },
  {
    stepNumber: 2,
    phase: 'Fase 2: Ejecución Inmersiva del Simulacro',
    userGoal: 'Responder las preguntas bajo presión temporal, gestionando el tiempo y marcando dudas estratégicamente.',
    actions: [
      'Lee los enunciados y selecciona alternativas (A, B, C, D).',
      'Utiliza la paleta de navegación para saltar entre preguntas o marcar ítems para revisión posterior ("Flag for review").',
      'Supervisa el cronómetro con avisos no invasivos (cambio a ámbar al quedar 20% del tiempo).',
      'Presiona "Finalizar Ensayo" o el sistema auto-entrega al expirar el tiempo.'
    ],
    systemResponse: [
      'Almacena en tiempo real cada interacción: respuesta elegida, cambios de opción y tiempo exacto invertido por pregunta (`time_spent_seconds`).',
      'Ejecuta validación previa al envío: alerta de preguntas en blanco antes de la confirmación final.',
      'Cierra la sesión de examen y calcula inmediatamente puntaje total, precisión y métricas desagregadas por área.'
    ],
    emotionalState: 'concentrado',
    kpis: ['Tasa de finalización (> 92%)', 'Promedio de tiempo por pregunta (60s - 90s)'],
    painPointsResolved: 'Resuelve el problema de llegar al examen sin entrenamiento de ritmo (pacing) y gestión de estrés.'
  },
  {
    stepNumber: 3,
    phase: 'Fase 3: Diagnóstico y Desglose Analítico',
    userGoal: 'Entender objetivamente su desempeño, identificar brechas de conocimiento y reconocer su área más débil.',
    actions: [
      'Revisa la pantalla de resultados: puntaje estandarizado (escala 100-1000) y porcentaje de aciertos.',
      'Examina la matriz de rendimiento por área de conocimiento (Matemáticas, Lenguaje, Ciencias, Historia) con barras de dominio y colores semafóricos.',
      'Observa la tarjeta de "Detección de Área Crítica": el algoritmo señala con precisión la materia y tema donde cometió más errores conceptuales.',
      'Inspecciona el desglose de preguntas erradas vs correctas con el tiempo invertido en cada una.'
    ],
    systemResponse: [
      'Calcula el porcentaje de dominio por materia y la falencia cognitiva predominante (ej. "Álgebra y Ecuaciones: errores por despeje y operaciones de signos").',
      'Persiste el intento en el historial del alumno con sus estadísticas finales.',
      'Presenta un Call-To-Action destacado: "⚡ Iniciar Refuerzo Inteligente con IA para [Área Débil]".'
    ],
    emotionalState: 'evaluativo',
    kpis: ['Tasa de clics al módulo de refuerzo con IA (> 75%)', 'Tiempo de lectura del diagnóstico (> 90s)'],
    painPointsResolved: 'Sustituye la frustración de solo ver un "número de nota" por un diagnóstico accionable y pedagógico.'
  },
  {
    stepNumber: 4,
    phase: 'Fase 4: Activación del Bucle de Refuerzo con IA (Sello M5)',
    userGoal: 'Recibir preguntas personalizadas que atacan directamente su punto ciego y comprender el error de raíz.',
    actions: [
      'El estudiante hace clic en "Iniciar Refuerzo Inteligente".',
      'Visualiza un estado de carga inteligente donde la IA analiza sus fallas del simulacro.',
      'Recibe 3 preguntas generadas a medida para su área débil.',
      'Responde la Pregunta 1/3 y presiona "Verificar Respuesta".'
    ],
    systemResponse: [
      'El backend invoca a Gemini (vía `@google/genai` con modelo `gemini-3.8-flash` y Structured Output) pasando como contexto el área débil, el tema crítico y las falencias observadas.',
      'La IA genera 3 preguntas nuevas con 4 alternativas y una explicación pedagógica profunda de cada una.',
      'Al responder cada pregunta, el sistema despliega retroalimentación socrática inmediata: por qué la respuesta correcta es válida y qué trampa tenía cada distractor.'
    ],
    emotionalState: 'receptivo',
    kpis: ['Tasa de compleción de las 3 preguntas de refuerzo (> 80%)', 'Tasa de satisfacción del feedback explicativo (> 4.8/5)'],
    painPointsResolved: 'Convierte el error en aprendizaje inmediato, cerrando la brecha antes de que se arraigue el malentendido conceptual.'
  },
  {
    stepNumber: 5,
    phase: 'Fase 5: Consolidación, Sello de Maestría y Persistencia',
    userGoal: 'Completar las 3 preguntas de refuerzo, verificar su evolución y registrar su avance en el historial.',
    actions: [
      'Completa secuencialmente las preguntas 2/3 y 3/3, leyendo detenidamente las explicaciones y tips.',
      'Alcanza la meta: el sistema otorga la insignia "Área Crítica Reforzada".',
      'Revisa su historial actualizado para comparar su progreso respecto a simulacros anteriores.',
      'Decide agendar o iniciar un nuevo ensayo para medir su curva de mejora.'
    ],
    systemResponse: [
      'Registra en la base de datos el progreso del refuerzo (`ai_reinforcement_sessions`) con estado `MASTERED`.',
      'Dispara microinteracción de recompensa (animación de confeti / medalla de maestría).',
      'Actualiza el gráfico de evolución histórica del estudiante.'
    ],
    emotionalState: 'motivado',
    kpis: ['Retención semanal de estudiantes (> 60%)', 'Mejora de puntaje en el siguiente simulacro (+12% promedio)'],
    painPointsResolved: 'Genera autoconfianza y motivación intrínseca mediante progreso medible y mastery learning.'
  }
];

export const DATABASE_ENTITIES: DatabaseEntity[] = [
  {
    name: 'Usuario / Estudiante',
    tableName: 'users',
    description: 'Almacena la identidad del postulante, su grado escolar, meta universitaria y carrera de preferencia.',
    category: 'core',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Identificador único del usuario.' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NOT NULL', description: 'Correo electrónico institucional o personal.' },
      { name: 'full_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nombre y apellido del postulante.' },
      { name: 'grade_level', type: 'VARCHAR(50)', constraints: 'DEFAULT "3_secundaria"', description: 'Nivel escolar (3° de secundaria / bachillerato).' },
      { name: 'target_career', type: 'VARCHAR(100)', constraints: 'NULL', description: 'Carrera a la que postula (ej. Medicina, Ingeniería).' },
      { name: 'target_score', type: 'INTEGER', constraints: 'DEFAULT 800', description: 'Puntaje objetivo de admisión (100 - 1000).' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Fecha y hora de registro en la plataforma.' }
    ],
    indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email);'],
    businessLogicNotes: [
      'Permite segmentar los prompts de IA según la carrera meta y nivel escolar del postulante.'
    ]
  },
  {
    name: 'Materias y Áreas de Conocimiento',
    tableName: 'subjects_and_topics',
    description: 'Taxonomía curricular estandarizada de las pruebas de admisión (Matemáticas, Lenguaje, Ciencias, Historia) y sus subtemas.',
    category: 'core',
    fields: [
      { name: 'id', type: 'VARCHAR(50)', constraints: 'PRIMARY KEY', description: 'Identificador semántico (ej. matematicas, lenguaje).' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Nombre formal del área curricular.' },
      { name: 'description', type: 'TEXT', constraints: 'NULL', description: 'Alcance pedagógico y competencias evaluadas.' },
      { name: 'topics_json', type: 'JSONB', constraints: 'NOT NULL DEFAULT "[]"', description: 'Lista de ejes temáticos y contenidos prioritarios.' }
    ],
    indexes: ['CREATE INDEX idx_subjects_id ON subjects_and_topics(id);'],
    businessLogicNotes: [
      'Garantiza que la IA y el motor de diagnóstico clasifiquen los fallos bajo la misma taxonomía.'
    ]
  },
  {
    name: 'Banco de Preguntas',
    tableName: 'questions',
    description: 'Repositorio oficial de preguntas de simulacro con sus alternativas, clave correcta y tiempos recomendados.',
    category: 'exam',
    fields: [
      { name: 'id', type: 'VARCHAR(50)', constraints: 'PRIMARY KEY', description: 'Código del ítem (ej. mat-01, cie-02).' },
      { name: 'subject_id', type: 'VARCHAR(50)', constraints: 'REFERENCES subjects_and_topics(id)', description: 'Materia a la que pertenece.' },
      { name: 'topic', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Subtema específico (ej. Álgebra y Ecuaciones).' },
      { name: 'stem', type: 'TEXT', constraints: 'NOT NULL', description: 'Enunciado del problema o texto de comprensión.' },
      { name: 'options', type: 'JSONB', constraints: 'NOT NULL', description: 'Arreglo con id y texto de opciones [{id: "A", text: "..."}].' },
      { name: 'correct_option_id', type: 'VARCHAR(5)', constraints: 'NOT NULL', description: 'Letra de la opción válida (A, B, C, D).' },
      { name: 'explanation', type: 'TEXT', constraints: 'NOT NULL', description: 'Solución justificada del reactivo.' },
      { name: 'difficulty', type: 'VARCHAR(20)', constraints: 'CHECK IN ("fácil", "medio", "difícil")', description: 'Nivel psicométrico estimado.' },
      { name: 'recommended_time_sec', type: 'INTEGER', constraints: 'DEFAULT 90', description: 'Tiempo sugerido para responder en examen real.' }
    ],
    indexes: [
      'CREATE INDEX idx_questions_subject ON questions(subject_id);',
      'CREATE INDEX idx_questions_topic ON questions(topic);'
    ],
    businessLogicNotes: [
      'Los distractores deben contener alternativas con errores habituales para posibilitar el diagnóstico fino.'
    ]
  },
  {
    name: 'Intento de Simulacro (Ensayo Guardado)',
    tableName: 'exam_attempts',
    description: 'Entidad central de persistencia del intento del estudiante: almacena tiempo total, puntaje global y desglose por área.',
    category: 'exam',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Identificador único del intento.' },
      { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id) ON DELETE CASCADE', description: 'Estudiante que rindió el ensayo.' },
      { name: 'exam_title', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nombre descriptivo (ej. Simulacro General Cronometrado #1).' },
      { name: 'started_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Timestamp exacto de inicio.' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', constraints: 'NULL', description: 'Timestamp de entrega o finalización por tiempo.' },
      { name: 'time_limit_sec', type: 'INTEGER', constraints: 'NOT NULL', description: 'Límite de tiempo asignado al examen.' },
      { name: 'total_time_spent_sec', type: 'INTEGER', constraints: 'NOT NULL', description: 'Segundos reales utilizados por el alumno.' },
      { name: 'total_questions', type: 'INTEGER', constraints: 'NOT NULL', description: 'Cantidad total de preguntas del ensayo.' },
      { name: 'correct_answers_count', type: 'INTEGER', constraints: 'NOT NULL', description: 'Número de aciertos.' },
      { name: 'incorrect_answers_count', type: 'INTEGER', constraints: 'NOT NULL', description: 'Número de errores.' },
      { name: 'unanswered_count', type: 'INTEGER', constraints: 'NOT NULL', description: 'Número de preguntas omitidas o no contestadas.' },
      { name: 'standardized_score', type: 'INTEGER', constraints: 'NOT NULL', description: 'Puntaje en escala estandarizada de admisión (100 - 1000).' },
      { name: 'accuracy_percentage', type: 'NUMERIC(5,2)', constraints: 'NOT NULL', description: 'Porcentaje de efectividad (0.00% - 100.00%).' },
      { name: 'area_breakdown_json', type: 'JSONB', constraints: 'NOT NULL', description: 'Desglose analítico de puntajes, tiempos y fallas por materia.' },
      { name: 'weakest_subject_id', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Materia identificada con menor desempeño para refuerzo.' },
      { name: 'weakest_topic', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Eje temático más vulnerable del estudiante.' },
      { name: 'reinforcement_completed', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Bandera que indica si el estudiante completó las 3 preguntas IA.' }
    ],
    indexes: [
      'CREATE INDEX idx_exam_attempts_user_id ON exam_attempts(user_id);',
      'CREATE INDEX idx_exam_attempts_timestamp ON exam_attempts(started_at DESC);'
    ],
    businessLogicNotes: [
      'Almacena snapshot denormalizado de los resultados para consultas ultrarrápidas del historial sin recalcular métricas pasadas.'
    ]
  },
  {
    name: 'Detalle de Respuestas del Usuario (M2)',
    tableName: 'user_exam_answers',
    description: 'Registra la respuesta individual de cada pregunta del ensayo, tiempo de resolución y si fue marcada para revisión.',
    category: 'exam',
    fields: [
      { name: 'id', type: 'BIGSERIAL', constraints: 'PRIMARY KEY', description: 'Identificador único del registro de respuesta.' },
      { name: 'attempt_id', type: 'UUID', constraints: 'REFERENCES exam_attempts(id) ON DELETE CASCADE', description: 'Intento al que corresponde.' },
      { name: 'question_id', type: 'VARCHAR(50)', constraints: 'REFERENCES questions(id)', description: 'Pregunta respondida.' },
      { name: 'selected_option_id', type: 'VARCHAR(5)', constraints: 'NULL', description: 'Opción elegida por el alumno (A, B, C, D o NULL).' },
      { name: 'is_correct', type: 'BOOLEAN', constraints: 'NOT NULL', description: 'Resultado de la corrección automática.' },
      { name: 'time_spent_sec', type: 'INTEGER', constraints: 'NOT NULL', description: 'Tiempo en segundos dedicado a este ítem específico.' },
      { name: 'marked_for_review', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Si el estudiante colocó bandera de duda durante el examen.' },
      { name: 'change_count', type: 'INTEGER', constraints: 'DEFAULT 0', description: 'Número de veces que el estudiante cambió de alternativa antes de enviar.' }
    ],
    indexes: [
      'CREATE INDEX idx_user_answers_attempt ON user_exam_answers(attempt_id);',
      'CREATE INDEX idx_user_answers_question ON user_exam_answers(question_id);'
    ],
    businessLogicNotes: [
      'Los campos `time_spent_sec` y `change_count` alimentan la detección de vacilación cognitiva y falsos positivos.'
    ]
  },
  {
    name: 'Sesión de Refuerzo con IA (Sello M5)',
    tableName: 'ai_reinforcement_sessions',
    description: 'Gestiona el ciclo de las 3 preguntas personalizadas generadas por la IA para subsanar el área más débil.',
    category: 'ai',
    fields: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY, DEFAULT gen_random_uuid()', description: 'Identificador único de la sesión de refuerzo.' },
      { name: 'attempt_id', type: 'UUID', constraints: 'REFERENCES exam_attempts(id) ON DELETE CASCADE', description: 'Intento de examen que originó la debilidad.' },
      { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id)', description: 'Estudiante destinatario.' },
      { name: 'target_subject_id', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Materia focalizada en el refuerzo.' },
      { name: 'target_topic', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Concepto clave a reforzar.' },
      { name: 'ai_model_used', type: 'VARCHAR(50)', constraints: 'DEFAULT "gemini-3.8-flash"', description: 'Modelo LLM utilizado para la generación.' },
      { name: 'prompt_tokens', type: 'INTEGER', constraints: 'NULL', description: 'Métricas de consumo y costos.' },
      { name: 'questions_json', type: 'JSONB', constraints: 'NOT NULL', description: 'Las 3 preguntas completas con opciones y explicaciones pedagógicas.' },
      { name: 'user_answers_json', type: 'JSONB', constraints: 'DEFAULT "{}"', description: 'Registro de respuestas del alumno en las preguntas de refuerzo.' },
      { name: 'completed_count', type: 'INTEGER', constraints: 'DEFAULT 0', description: 'Cantidad de preguntas verificadas (0 a 3).' },
      { name: 'is_mastered', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Indica si completó exitosamente las 3 preguntas.' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Fecha y hora de generación del refuerzo.' }
    ],
    indexes: [
      'CREATE INDEX idx_ai_reinforce_attempt ON ai_reinforcement_sessions(attempt_id);',
      'CREATE INDEX idx_ai_reinforce_user ON ai_reinforcement_sessions(user_id);'
    ],
    businessLogicNotes: [
      'Regla de negocio: El estudiante debe verificar secuencialmente 3 de estas preguntas generadas para considerar remediada el área.'
    ]
  }
];

export const SYSTEM_PROMPT_TEMPLATE: SystemPromptTemplate = {
  name: 'Tutor Pedagógico Adaptativo - Generador de Refuerzo de Admisión',
  role: 'Especialista en Evaluación Educativa (Psicometría y EdTech) y Tutor Pedagógico de Admisión Universitaria',
  description: 'Prompt de sistema maestro para el backend que recibe el informe de debilidades de un simulacro y genera exactamente 3 preguntas adaptativas con explicaciones socráticas paso a paso.',
  systemInstructionText: `Eres un Diseñador Curricular Senior y Tutor Pedagógico Especialista en Pruebas Estandarizadas de Admisión Universitaria (PAES, SAT, ICFES Saber 11, EXANI-II, UNAM).

Tu misión es recibir el diagnóstico del área más débil de un estudiante de secundaria/bachillerato que rindió un simulacro cronometrado, y generar un set quirúrgico de EXACTAMENTE TRES (3) preguntas de refuerzo formativo de alta calidad con sus respectivas explicaciones pedagógicas detalladas.

PRINCIPIOS PEDAGÓGICOS OBLIGATORIOS:
1. Rigor y Calibración Real: Las preguntas deben coincidir fielmente con el nivel taxonómico de las pruebas oficiales (Comprensión, Aplicación, Análisis y Resolución de Problemas). No formular preguntas triviales de memorización simple.
2. Formato Estándar de 4 Opciones: Cada pregunta debe tener exactamente 4 opciones etiquetadas como A, B, C y D, donde solo una sea inequívocamente la correcta.
3. Distractores Diagnósticos: Los distractores (opciones incorrectas) NO deben ser opciones absurdas ni descartables a primera vista. Deben incorporar errores de procedimiento típicos, confusiones de fórmulas, falacias lógicas o lecturas superficiales del enunciado.
4. Explicación Didáctica Paso a Paso:
   - "keyConcept": Enunciar la regla matemática, principio científico o regla discursiva fundamental que resuelve el problema.
   - "stepByStep": Lista de pasos claros, lógicos y auto-contenidos para llegar a la solución correcta desde cero.
   - "distractorAnalysis": Diccionario con claves A, B, C, D explicando exactamente qué razonamiento erróneo lleva a elegir cada distractor y por qué es falso.
5. Tono y Lenguaje: Español neutro, académico pero accesible, motivador, empático con el estrés del postulante y libre de tecnicismos innecesarios.

DEBES RESPONDER EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO QUE CUMPLA EL SCHEMA DEFINIDO. NO AGREGUES TEXTO ADICIONAL ANTES O DESPUÉS DEL JSON.`,
  inputVariables: [
    {
      name: 'weakSubject',
      type: 'String',
      example: 'Matemáticas',
      description: 'Materia con el porcentaje de aciertos más bajo o puntaje crítico en el simulacro.'
    },
    {
      name: 'weakTopic',
      type: 'String',
      example: 'Álgebra y Funciones: Ecuaciones Cuadráticas y Vértice',
      description: 'Eje temático específico donde se concentraron los errores del estudiante.'
    },
    {
      name: 'studentGrade',
      type: 'String',
      example: '3° año de secundaria / 11° grado bachillerato',
      description: 'Nivel escolar actual del postulante para calibrar la profundidad conceptual.'
    },
    {
      name: 'failedQuestionsSummary',
      type: 'String',
      example: 'El estudiante falló 2 preguntas sobre punto máximo de una parábola y demoró 140 segundos por ítem.',
      description: 'Resumen cualitativo de las preguntas erradas y del comportamiento de tiempo.'
    }
  ],
  expectedOutputSchema: `{
  "targetSubject": "string",
  "targetTopic": "string",
  "pedagogicalDiagnostic": "string",
  "questions": [
    {
      "id": "string",
      "topic": "string",
      "stem": "string",
      "options": [
        { "id": "A", "text": "string" },
        { "id": "B", "text": "string" },
        { "id": "C", "text": "string" },
        { "id": "D", "text": "string" }
      ],
      "correctOptionId": "A | B | C | D",
      "pedagogicalExplanation": {
        "keyConcept": "string",
        "stepByStep": ["string", "string", ...],
        "distractorAnalysis": {
          "A": "string",
          "B": "string",
          "C": "string",
          "D": "string"
        }
      }
    }
  ]
}`,
  fewShotExample: {
    input: `weakSubject: "Matemáticas"
weakTopic: "Función Cuadrática y Optimización"
studentGrade: "3° de bachillerato"
failedQuestionsSummary: "Confunde el valor del vértice f(x_v) con el coeficiente 'c' y tiene dificultades al despejar x_v = -b/(2a)."`,
    output: `{
  "targetSubject": "Matemáticas",
  "targetTopic": "Función Cuadrática y Optimización",
  "pedagogicalDiagnostic": "El postulante confunde la intersección con el eje Y (coeficiente c) con el valor extremo de la función, omitiendo el cálculo de la abscisa del vértice.",
  "questions": [
    {
      "id": "reinf-mat-01",
      "topic": "Cálculo del vértice y valores extremos",
      "stem": "Un proyectil describe una trayectoria dada por la altura h(t) = -5t² + 20t + 2 (con h en metros y t en segundos). ¿Cuál es la altura máxima alcanzada por el proyectil?",
      "options": [
        { "id": "A", "text": "22 metros" },
        { "id": "B", "text": "20 metros" },
        { "id": "C", "text": "2 metros" },
        { "id": "D", "text": "42 metros" }
      ],
      "correctOptionId": "A",
      "pedagogicalExplanation": {
        "keyConcept": "Para una función cuadrática h(t) = at² + bt + c con a < 0, el valor máximo ocurre en el vértice: t_v = -b / (2a).",
        "stepByStep": [
          "Identificamos los coeficientes: a = -5, b = 20, c = 2.",
          "Calculamos el tiempo en que se alcanza el máximo: t_v = -20 / (2 · (-5)) = -20 / -10 = 2 segundos.",
          "Evaluamos la función en t = 2 para hallar la altura máxima: h(2) = -5(2)² + 20(2) + 2.",
          "h(2) = -5(4) + 40 + 2 = -20 + 40 + 2 = 22 metros."
        ],
        "distractorAnalysis": {
          "A": "Correcta. Cálculo riguroso de t_v = 2s y posterior evaluación en la función de altura.",
          "B": "Distractor común: Tomar directamente el coeficiente lineal 'b = 20' creyendo que es la altura máxima.",
          "C": "Distractor de punto ciego: Tomar el término libre 'c = 2', que corresponde a la altura inicial en t = 0, no a la máxima.",
          "D": "Distractor aritmético: Sumar todos los coeficientes (-5 + 20 + 2 = 17) o elevar al cuadrado erróneamente."
        }
      }
    }
  ]
}`
  }
};

export const WIREFRAME_SECTIONS: WireframeSection[] = [
  {
    id: 'wf-exam-running',
    title: 'Pantalla de Simulacro en Condiciones Reales',
    viewName: 'ActiveExamView (Modo Examen)',
    userObjective: 'Resolver el test sin distracciones, controlando el cronómetro y navegando ágilmente.',
    visualHierarchy: [
      '1. Barra Superior Fija: Temporizador regresivo prominente con badge de estado, barra de progreso lineal (ej. 7 de 12 respondidas) y botón "Entregar Examen".',
      '2. Columna Izquierda / Panel Central (65% del ancho): Enunciado con tipografía legible de alto contraste, área temático, y tarjetas interactivas de alternativas A, B, C, D con radio button táctil grande.',
      '3. Barra de Utilidades: Botón para "Marcar para revisión" (bandera amarilla), botón "Pregunta Anterior" y "Pregunta Siguiente".',
      '4. Columna Derecha / Drawer Móvil (35% del ancho): Paleta de navegación numérica de preguntas con tres estados visuales: Pendiente (gris), Respondida (azul sólido) y Marcada con duda (ámbar).'
    ],
    uxDesignRules: [
      'Prohibido el auto-avance sorpresivo: el estudiante debe confirmar o hacer clic en siguiente voluntariamente.',
      'El cronómetro emite sutil animación al faltar menos del 20% del tiempo sin bloquear la pantalla con alertas modales molestas.',
      'Prevención de pérdida de datos: cada clic guarda de inmediato en estado local.'
    ],
    layoutDescription: 'Diseño de dos columnas en escritorio (enunciado + matriz de navegación) y diseño apilado en móvil con navegación inferior fijada.'
  },
  {
    id: 'wf-results-breakdown',
    title: 'Pantalla de Desglose de Resultados por Área de Conocimiento',
    viewName: 'ExamResultsView (Diagnóstico M2)',
    userObjective: 'Comprender el puntaje global y descubrir inmediatamente cuál fue el área más débil.',
    visualHierarchy: [
      '1. Hero de Desempeño: Tarjeta principal con Puntaje Estandarizado (100 - 1000 pts), porcentaje de aciertos, tiempo total invertido y percentil estimado.',
      '2. Call-To-Action Destacado de Refuerzo IA: Banner de alta visibilidad con gradiente que identifica el "Área Crítica Detectada" (ej. Matemáticas: Álgebra) y el botón directo "⚡ Activar Refuerzo Inteligente con IA".',
      '3. Matriz de Desglose por Área de Conocimiento: Grid de 4 tarjetas (Matemáticas, Lenguaje, Ciencias, Historia) con barra de progreso, aciertos/errores, tiempo promedio por pregunta y diagnóstico conceptual.',
      '4. Acordeón de Revisión Pregunta por Pregunta: Permite expandir cada reactivo para ver qué contestó el estudiante, cuál era la correcta y la justificación.'
    ],
    uxDesignRules: [
      'Uso de psicología del color empática: la debilidad se resalta en tonalidades ámbar/cálidas orientadas a la oportunidad de mejora, nunca en rojo punitivo desmotivador.',
      'El desglose por materia prioriza el orden de criticidad: el área más débil aparece en primer lugar.'
    ],
    layoutDescription: 'Hero banner superior -> Banner de Refuerzo IA -> Grid 2x2 de materias -> Listado expandible de auditoría de preguntas.'
  },
  {
    id: 'wf-ai-reinforcement',
    title: 'Módulo de Refuerzo Adaptativo con IA (Sello M5)',
    viewName: 'AIReinforcementView (3 Preguntas Clave)',
    userObjective: 'Resolver las 3 preguntas personalizadas generadas por la IA y leer la explicación profunda.',
    visualHierarchy: [
      '1. Cabecera del Módulo IA: Indicador de paso (Paso 1 de 3, 2 de 3, 3 de 3) y badge con el área temática focalizada.',
      '2. Tarjeta de Pregunta Generada: Enunciado redactado por Gemini y alternativas interactivas A, B, C, D.',
      '3. Botón de Acción: "Comprobar Respuesta con Tutor IA".',
      '4. Panel Desplegable de Explicación Pedagógica (post-verificación):',
      '   - Badge de resultado: "¡Respuesta Correcta!" (Verde) o "Respuesta Incorrecta - Oportunidad de Aprendizaje" (Ámbar).',
      '   - Caja de "Concepto Clave": Regla teórica esencial a memorizar.',
      '   - Desglose "Paso a Paso": Demostración lógica numerada.',
      '   - Sección "¿Por qué fallan los distractores?": Análisis de trampas conceptuales de las otras opciones.',
      '5. Barra de Progreso de Maestría: Contador que se ilumina al completar cada una de las 3 preguntas hasta otorgar el Sello de Habilidad Desbloqueada.'
    ],
    uxDesignRules: [
      'Feedback interactivo instantáneo: el estudiante no tiene que esperar al final del set de 3 preguntas para recibir la explicación de la primera.',
      'Al completar la tercera pregunta, celebración visual (confetti) y botón "Registrar en Historial y Finalizar".'
    ],
    layoutDescription: 'Contenedor centrado y enfocado (max-w-3xl) tipo "Modo Estudio Zen", eliminando distracciones laterales para máxima retención cognitiva.'
  }
];
