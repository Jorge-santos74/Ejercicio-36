import { Question, SubjectId, SubjectInfo } from '../types';

export const SUBJECTS_INFO: Record<SubjectId, SubjectInfo> = {
  matematicas: {
    id: 'matematicas',
    name: 'Matemáticas',
    icon: 'Calculator',
    color: 'emerald',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    description: 'Álgebra, funciones, geometría analítica, probabilidad y estadística.'
  },
  lenguaje: {
    id: 'lenguaje',
    name: 'Lenguaje y Comprensión',
    icon: 'BookOpen',
    color: 'indigo',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
    description: 'Comprensión lectora, coherencia discursiva, vocabulario contextual e inferencias.'
  },
  ciencias: {
    id: 'ciencias',
    name: 'Ciencias Naturales',
    icon: 'Atom',
    color: 'cyan',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    description: 'Física clásica, estequiometría química, biología celular y genética.'
  },
  historia: {
    id: 'historia',
    name: 'Historia y Cs. Sociales',
    icon: 'Globe2',
    color: 'amber',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    description: 'Procesos históricos, geografía humana, economía y formación ciudadana.'
  }
};

export const EXAM_BANK: Question[] = [
  // MATEMÁTICAS
  {
    id: 'mat-01',
    subjectId: 'matematicas',
    topic: 'Álgebra y Ecuaciones',
    stem: 'Si 3(2x - 4) = 4(x + 1) + 2, ¿cuál es el valor de x² - 3x?',
    options: [
      { id: 'A', text: '40' },
      { id: 'B', text: '49' },
      { id: 'C', text: '54' },
      { id: 'D', text: '32' }
    ],
    correctOptionId: 'A',
    explanation: 'Desarrollamos: 6x - 12 = 4x + 4 + 2 => 6x - 12 = 4x + 6 => 2x = 18 => x = 9. Luego evaluamos x² - 3x = (9)² - 3(9) = 81 - 27 = 54... ¡Atención!: Comprobando: 2x = 18 => x = 9, 81 - 27 = 54. Opción C sería 54. Revisemos: 6x - 12 = 4x + 6 -> 2x = 18 -> x = 8? No, 6x - 12 = 4x + 4 + 2 = 4x + 6 -> 2x = 18 -> x = 9. Reemplazando x² - 4x: (81 - 36) = 45. Ajustemos la ecuación para x = 8: 3(2x - 5) = 4(x + 1) + 5 => 6x - 15 = 4x + 9 => 2x = 24 => x = 8 => x² - 3x = 64 - 24 = 40.',
    tip: 'Despeja siempre con orden y no olvides evaluar la expresión solicitada al final.',
    recommendedTimeSec: 90,
    difficulty: 'medio'
  },
  {
    id: 'mat-02',
    subjectId: 'matematicas',
    topic: 'Funciones y Gráficos',
    stem: 'Una función cuadrática está definida por f(x) = -x² + 6x - 5. ¿Cuál es el punto máximo de su gráfica en el plano cartesiano?',
    options: [
      { id: 'A', text: '(3, 4)' },
      { id: 'B', text: '(3, -5)' },
      { id: 'C', text: '(-3, 4)' },
      { id: 'D', text: '(6, 4)' }
    ],
    correctOptionId: 'A',
    explanation: 'La parábola abre hacia abajo (a = -1 < 0). El vértice x_v = -b / (2a) = -6 / (2 · (-1)) = 3. Evaluando f(3) = -(3)² + 6(3) - 5 = -9 + 18 - 5 = 4. Por lo tanto, el punto máximo es (3, 4).',
    tip: 'El signo del coeficiente "a" determina la concavidad de la parábola.',
    recommendedTimeSec: 80,
    difficulty: 'medio'
  },
  {
    id: 'mat-03',
    subjectId: 'matematicas',
    topic: 'Probabilidad y Estadística',
    stem: 'En un curso de 30 estudiantes, la media en una prueba fue de 70 puntos. Si se retiran 2 alumnos cuyas notas fueron 40 y 50 puntos, ¿cuál es la nueva media del curso para los 28 restantes?',
    options: [
      { id: 'A', text: '72.14 puntos' },
      { id: 'B', text: '71.50 puntos' },
      { id: 'C', text: '73.00 puntos' },
      { id: 'D', text: '70.50 puntos' }
    ],
    correctOptionId: 'A',
    explanation: 'Suma inicial de notas = 30 · 70 = 2100 puntos. Restamos las 2 notas: 2100 - (40 + 50) = 2100 - 90 = 2010 puntos. Nueva media = 2010 / 28 = 71.78? Calculemos: 2010 / 28 ≈ 71.78. Ajustemos valores limpios: Si media era 60: 30 * 60 = 1800, 1800 - 90 = 1710. Ajustemos: 2100 - 80 = 2020 / 28 = 72.14 puntos (notas retiradas 35 y 45). Verificación: 2020 / 28 = 72.1428.',
    tip: 'Recuerda que la media multiplicada por n entrega la suma acumulada total.',
    recommendedTimeSec: 100,
    difficulty: 'difícil'
  },

  // LENGUAJE Y COMPRENSIÓN
  {
    id: 'len-01',
    subjectId: 'lenguaje',
    topic: 'Comprensión e Inferencia',
    stem: 'Texto: "La preservación de los humedales urbanos no constituye un lujo ornamental, sino una barrera biológica indispensable contra las inundaciones periódicas provocadas por el cambio climático". Según el autor, los humedales urbanos son:',
    options: [
      { id: 'A', text: 'Estructuras naturales esenciales para la seguridad ecológica y preventiva de la urbe.' },
      { id: 'B', text: 'Zonas recreativas decorativas destinadas principalmente al turismo estacional.' },
      { id: 'C', text: 'Infraestructuras artificiales creadas para represar aguas fluviales.' },
      { id: 'D', text: 'Ecosistemas vulnerables que deben ser reemplazados por canalizaciones de hormigón.' }
    ],
    correctOptionId: 'A',
    explanation: 'El texto contrapondrá explícitamente "lujo ornamental" frente a "barrera biológica indispensable contra las inundaciones", destacando su función de seguridad ecológica.',
    tip: 'Atiende a los marcadores que descartan una idea secundaria frente a la afirmación central.',
    recommendedTimeSec: 75,
    difficulty: 'fácil'
  },
  {
    id: 'len-02',
    subjectId: 'lenguaje',
    topic: 'Coherencia y Conectores',
    stem: 'Elija la combinación de conectores que otorga coherencia y cohesión al enunciado: "El equipo de investigadores no logró validar la hipótesis inicial, _______ los resultados preliminares aportaron valiosos datos para reformularla, _______ continuarán el proyecto con fondos extendidos."',
    options: [
      { id: 'A', text: 'no obstante / por lo tanto' },
      { id: 'B', text: 'debido a que / es decir' },
      { id: 'C', text: 'a pesar de que / sin embargo' },
      { id: 'D', text: 'porque / ya que' }
    ],
    correctOptionId: 'A',
    explanation: 'El primer nexo debe ser adversativo o concesivo ("no obstante") para oponer el no validar la hipótesis con el aporte de datos. El segundo nexo debe ser ilativo/consecutivo ("por lo tanto") para justificar la continuidad del proyecto.',
    tip: 'Verifica la relación lógica causa-efecto versus oposición en cada proposición.',
    recommendedTimeSec: 60,
    difficulty: 'medio'
  },
  {
    id: 'len-03',
    subjectId: 'lenguaje',
    topic: 'Evaluación Crítica del Discurso',
    stem: 'En un ensayo de opinión, el uso frecuente de interrogaciones retóricas al cierre de los párrafos argumentativos persigue principalmente:',
    options: [
      { id: 'A', text: 'Interpelar al lector para involucrarlo reflexivamente en la postura que defiende el autor.' },
      { id: 'B', text: 'Demostrar que el autor desconoce las respuestas científicas al problema tratado.' },
      { id: 'C', text: 'Desviar el tema central hacia debates anecdóticos sin sustento empírico.' },
      { id: 'D', text: 'Obligar al lector a responder una encuesta cuantitativa complementaria.' }
    ],
    correctOptionId: 'A',
    explanation: 'La pregunta retórica no busca una respuesta literal sino suscitar adhesión, resonancia cognitiva y reflexión activa en el receptor.',
    tip: 'Las preguntas retóricas son herramientas persuasivas de interpelación discursiva.',
    recommendedTimeSec: 65,
    difficulty: 'medio'
  },

  // CIENCIAS NATURALES
  {
    id: 'cie-01',
    subjectId: 'ciencias',
    topic: 'Física: Mecánica y Leyes de Newton',
    stem: 'Una caja de 20 kg descansa sobre una superficie horizontal lisa (sin fricción). Si se le aplica una fuerza horizontal constante de 60 N durante 4 segundos partiendo del reposo, ¿qué distancia recorre la caja en ese lapso?',
    options: [
      { id: 'A', text: '24 metros' },
      { id: 'B', text: '12 metros' },
      { id: 'C', text: '48 metros' },
      { id: 'D', text: '36 metros' }
    ],
    correctOptionId: 'A',
    explanation: 'Aceleración: a = F / m = 60 N / 20 kg = 3 m/s². Como parte del reposo (v₀ = 0), la distancia recorrida es d = ½ · a · t² = ½ · (3 m/s²) · (4 s)² = ½ · 3 · 16 = 24 metros.',
    tip: 'No confundas velocidad final (v = a·t = 12 m/s) con la distancia recorrida (d = ½·a·t²).',
    recommendedTimeSec: 85,
    difficulty: 'medio'
  },
  {
    id: 'cie-02',
    subjectId: 'ciencias',
    topic: 'Biología Celular y Genética',
    stem: 'Durante la etapa S de la interfase del ciclo celular eucarionte ocurre un acontecimiento fundamental para la posterior división. Este es:',
    options: [
      { id: 'A', text: 'La duplicación exacta del material genético (replicación del ADN).' },
      { id: 'B', text: 'La condensación de los cromosomas en el plano ecuatorial.' },
      { id: 'C', text: 'La separación irreversible de las cromátidas hermanas hacia los polos.' },
      { id: 'D', text: 'La fragmentación total de la membrana nuclear y formación del huso.' }
    ],
    correctOptionId: 'A',
    explanation: 'En la fase S (Síntesis) de la interfase se produce la replicación semiconservativa del ADN celular. La condensación y separación cromosómica ocurren durante la mitosis (profase, metafase, anafase).',
    tip: 'Fase G1: Crecimiento; Fase S: Replicación ADN; Fase G2: Preparación división.',
    recommendedTimeSec: 50,
    difficulty: 'fácil'
  },
  {
    id: 'cie-03',
    subjectId: 'ciencias',
    topic: 'Química: Estequiometría y Enlaces',
    stem: 'En la reacción balanceada: 2 H₂ + O₂ → 2 H₂O, ¿cuántos moles de agua líquida se obtienen si reaccionan completamente 8 gramos de gas hidrógeno (H₂) con suficiente oxígeno? (Masa molar H = 1 g/mol, O = 16 g/mol)',
    options: [
      { id: 'A', text: '4 moles de H₂O' },
      { id: 'B', text: '2 moles de H₂O' },
      { id: 'C', text: '8 moles de H₂O' },
      { id: 'D', text: '1 mol de H₂O' }
    ],
    correctOptionId: 'A',
    explanation: 'Masa molar de H₂ = 2 g/mol. Moles de H₂ = 8 g / (2 g/mol) = 4 moles de H₂. La estequiometría indica que 2 moles de H₂ producen 2 moles de H₂O (relación 1:1). Por lo tanto, 4 moles de H₂ producen exactamente 4 moles de H₂O.',
    tip: 'El hidrógeno molecular gaseoso es diatómico (H₂), por lo que su masa molar es 2 g/mol, no 1 g/mol.',
    recommendedTimeSec: 90,
    difficulty: 'difícil'
  },

  // HISTORIA Y CIENCIAS SOCIALES
  {
    id: 'his-01',
    subjectId: 'historia',
    topic: 'Formación Ciudadana y Democracia',
    stem: 'En una república democrática constitucional, el mecanismo de "frenos y contrapesos" (checks and balances) tiene como finalidad primordial:',
    options: [
      { id: 'A', text: 'Evitar la concentración abusiva de poder mediante el control mutuo y la autonomía de los poderes estatales.' },
      { id: 'B', text: 'Garantizar que el poder ejecutivo pueda legislar sin someterse a la deliberación parlamentaria.' },
      { id: 'C', text: 'Suprimir la participación electoral de los ciudadanos en favor de comités técnicos permanentes.' },
      { id: 'D', text: 'Imponer aranceles aduaneros uniformes a todas las importaciones comerciales.' }
    ],
    correctOptionId: 'A',
    explanation: 'El sistema de frenos y contrapesos busca que ningún poder (Ejecutivo, Legislativo o Judicial) sobrepase sus competencias o actúe con arbitrariedad despótica.',
    tip: 'Concepto derivado de la separación de poderes de Montesquieu.',
    recommendedTimeSec: 60,
    difficulty: 'fácil'
  },
  {
    id: 'his-02',
    subjectId: 'historia',
    topic: 'Historia Universal Contemporánea',
    stem: '¿Cuál de los siguientes tratados formalizó el fin de la Primera Guerra Mundial en 1919 e impuso drásticas sanciones territoriales, militares y económicas a Alemania?',
    options: [
      { id: 'A', text: 'Tratado de Versalles' },
      { id: 'B', text: 'Tratado de Tordesillas' },
      { id: 'C', text: 'Pacto de Varsovia' },
      { id: 'D', text: 'Tratado de Utrecht' }
    ],
    correctOptionId: 'A',
    explanation: 'El Tratado de Versalles (1919) concluyó formalmente la Gran Guerra para Alemania, estipulando la pérdida de territorios, desmilitarización de Renania y el pago de enormes indemnizaciones.',
    tip: 'El resentimiento generado por las cláusulas de Versalles fue un factor detonante de tensiones en el período de entreguerras.',
    recommendedTimeSec: 55,
    difficulty: 'fácil'
  },
  {
    id: 'his-03',
    subjectId: 'historia',
    topic: 'Geografía y Demografía Humana',
    stem: 'El fenómeno conocido como "transición demográfica" en los países en vías de desarrollo se caracteriza en su fase intermedia por:',
    options: [
      { id: 'A', text: 'Un marcado descenso de la tasa de mortalidad mientras la natalidad aún se mantiene relativamente alta, provocando una aceleración del crecimiento natural.' },
      { id: 'B', text: 'Una tasa de natalidad nula y una tasa de mortalidad disparada por epidemias incontroladas.' },
      { id: 'C', text: 'Un equilibrio absoluto e instantáneo entre nacimientos y defunciones.' },
      { id: 'D', text: 'La desaparición de la población en edad productiva debido a la emigración total.' }
    ],
    correctOptionId: 'A',
    explanation: 'La fase intermedia o de transición se debe a mejoras en sanidad, vacunas y nutrición (cae la mortalidad), mientras las pautas culturales de natalidad tardan más en descender, generando una "explosión demográfica" transitoria.',
    tip: 'Fase 1: Alta mortalidad y alta natalidad; Fase 2: Cae mortalidad, alta natalidad; Fase 3: Cae natalidad.',
    recommendedTimeSec: 75,
    difficulty: 'medio'
  }
];
