import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator for high-quality pedagogical reinforcement questions
function generateFallbackQuestions(weakSubject: string, weakTopic: string) {
  const subjectTopics: Record<string, Array<{ stem: string; options: string[]; correctIndex: number; concept: string; steps: string[]; distractorWhy: string[] }>> = {
    matematicas: [
      {
        stem: 'Si f(x) = 2x² - 4x + 5, ¿cuál es el valor mínimo que alcanza la función y en qué valor de x se produce?',
        options: [
          'El valor mínimo es 3 y se produce en x = 1.',
          'El valor mínimo es 5 y se produce en x = 0.',
          'El valor mínimo es -1 y se produce en x = 2.',
          'El valor mínimo es 1 y se produce en x = 3.'
        ],
        correctIndex: 0,
        concept: 'Vértice de una parábola f(x) = ax² + bx + c con a > 0.',
        steps: [
          'La abscisa del vértice se calcula mediante x_v = -b / (2a). En este caso: a = 2, b = -4.',
          'x_v = -(-4) / (2 · 2) = 4 / 4 = 1.',
          'Para encontrar el valor mínimo, evaluamos f(1): f(1) = 2(1)² - 4(1) + 5 = 2 - 4 + 5 = 3.',
          'Conclusión: El mínimo es 3 cuando x = 1.'
        ],
        distractorWhy: [
          'Correcta: Cálculo riguroso del vértice.',
          'Error común: Confundir el término independiente (c = 5) con el valor mínimo sin verificar el vértice.',
          'Error de signo: Calcular erróneamente la coordenada o restar invertido.',
          'Sustitución incorrecta de la abscisa.'
        ]
      },
      {
        stem: 'Un tanque de agua se vacía a razón constante. Si a las 2 horas contiene 480 litros y a las 5 horas contiene 300 litros, ¿cuántos litros contenía inicialmente el tanque (t = 0)?',
        options: [
          '600 litros',
          '540 litros',
          '720 litros',
          '660 litros'
        ],
        correctIndex: 0,
        concept: 'Modelado lineal y pendiente constante (razón de cambio).',
        steps: [
          'Calculamos la tasa de vaciado (pendiente m): m = (300 - 480) / (5 - 2) = -180 / 3 = -60 litros/hora.',
          'El tanque pierde 60 litros por cada hora transcurrida.',
          'A las 2 horas le quedan 480 litros. Por lo tanto, el volumen inicial en t = 0 es: V(0) = 480 + (2 horas · 60 L/h) = 480 + 120 = 600 litros.',
          'Verificación: En t = 5: 600 - (5 · 60) = 300 litros. Concurre perfectamente.'
        ],
        distractorWhy: [
          'Correcta: Modelado de función afín V(t) = 600 - 60t.',
          'Distractor: Sumar solo 60 L al valor de t = 2 (olvidando que pasaron 2 horas completas).',
          'Distractor: Asumir proporción inversa errónea.',
          'Distractor: Error aritmético sumando 180 litros directos a 480.'
        ]
      },
      {
        stem: 'En una bolsa hay 4 bolas rojas, 6 bolas verdes y 5 bolas azules. Si se extraen dos bolas consecutivamente sin reposición, ¿cuál es la probabilidad de que ambas sean rojas?',
        options: [
          '2 / 35',
          '4 / 15',
          '16 / 225',
          '1 / 10'
        ],
        correctIndex: 0,
        concept: 'Probabilidad compuesta de sucesos dependientes (sin reposición).',
        steps: [
          'Total de bolas inicial: 4 + 6 + 5 = 15 bolas.',
          'Probabilidad de que la primera bola sea roja: P(R1) = 4 / 15.',
          'Al no haber reposición, quedan 14 bolas en total y 3 bolas rojas.',
          'Probabilidad de que la segunda bola sea roja: P(R2 | R1) = 3 / 14.',
          'Probabilidad conjunta: P(R1 y R2) = (4 / 15) · (3 / 14) = 12 / 210. Simplificando entre 6: 12÷6 / 210÷6 = 2 / 35.'
        ],
        distractorWhy: [
          'Correcta: Multiplicación de probabilidades condicionadas (4/15) * (3/14) = 2/35.',
          'Distractor: Considerar solo la primera extracción (4/15).',
          'Error frecuente: Asumir con reposición (4/15)² = 16/225.',
          'Distractor: Sumar las probabilidades en lugar de multiplicarlas.'
        ]
      }
    ],
    lenguaje: [
      {
        stem: 'Lea el siguiente fragmento: "Aunque la inteligencia artificial procesa millones de datos en milisegundos, carece de la conciencia reflexiva indispensable para formular juicios éticos contextuales". ¿Cuál es la idea principal defendida por el autor?',
        options: [
          'La limitación fundamental de la IA reside en su incapacidad para emitir juicios éticos debido a su falta de conciencia reflexiva.',
          'La inteligencia artificial superará a la mente humana debido a su velocidad de procesamiento de datos.',
          'La ética es un concepto irrelevante para los algoritmos modernos de cómputo.',
          'Los datos en milisegundos garantizan una toma de decisiones objetiva sin necesidad de conciencia.'
        ],
        correctIndex: 0,
        concept: 'Identificación de tesis central e inferencia textual crítica.',
        steps: [
          'Identificamos el conector concesivo "Aunque...", que introduce una concesión subordinada (la velocidad de cálculo).',
          'La cláusula principal y núcleo argumentativo es "carece de la conciencia reflexiva indispensable para formular juicios éticos contextuales".',
          'Por ende, la tesis es la delimitación ética y reflexiva frente a la mera capacidad técnica de cálculo.'
        ],
        distractorWhy: [
          'Correcta: Sintetiza fielmente el argumento nuclear del fragmento.',
          'Distractor: Se enfoca en la concesión inicial y extrapola una conclusión opuesta a la intención del autor.',
          'Distractor: Postura extrema y no sustentada en el texto.',
          'Distractor: Confunde velocidad con idoneidad ética.'
        ]
      },
      {
        stem: 'En el enunciado: "El comité desestimó la propuesta, no por falta de viabilidad técnica, sino porque carecía de un plan de sostenibilidad financiera a largo plazo", el conector "sino" cumple la función de:',
        options: [
          'Contraponer un motivo excluyente y verdadero frente a un motivo previamente negado.',
          'Agregar un nuevo argumento complementario que refuerza la premisa inicial.',
          'Indicar una relación de consecuencia temporal entre dos eventos administrativos.',
          'Introducir una hipótesis condicional subordinada.'
        ],
        correctIndex: 0,
        concept: 'Uso y valor semántico de los marcadores discursivos adversativos exclusivos.',
        steps: [
          'Estructura: "no... sino...".',
          'El primer elemento niega una causa ("no por falta de viabilidad").',
          '"Sino" introduce la causa real y afirmativa ("porque carecía de un plan..."), operando como adversativa exclusiva rectificativa.'
        ],
        distractorWhy: [
          'Correcta: Define con precisión el carácter adversativo restrictivo/excluyente de "sino".',
          'Distractor: Confunde adversación con adición (función de conectores como "además", "asimismo").',
          'Distractor: Confunde con ilativos o conectores temporales.',
          'Distractor: Confunde con prótasis condicionales ("si", "siempre que").'
        ]
      },
      {
        stem: '¿Qué figura retórica se aprecia en la expresión: "El silencio de la noche gritaba su soledad en cada rincón del aula vacía"?',
        options: [
          'Personificación (Prosopopeya) y Oxímoron.',
          'Hipérbaton puro y Epíteto.',
          'Metonimia cuantitativa y Pleonasmo.',
          'Anáfora y Sinestesia táctil.'
        ],
        correctIndex: 0,
        concept: 'Recursos estilísticos y figuras retóricas aplicadas a la comprensión.',
        steps: [
          'Se atribuye una acción humana ("gritaba") a una entidad inanimada ("el silencio"), configurando una personificación o prosopopeya.',
          'A la vez, juntar términos aparentemente contradictorios ("silencio" que "gritaba") constituye un oxímoron o paradoja estética.'
        ],
        distractorWhy: [
          'Correcta: Identifica la humanización del silencio y la contradicción semántica intencional.',
          'Distractor: No hay alteración sintáctica del orden de palabras (hipérbaton).',
          'Distractor: No hay redundancia innecesaria (pleonasmo).',
          'Distractor: No hay repetición al inicio de versos ni cruce sensorial estricto.'
        ]
      }
    ],
    ciencias: [
      {
        stem: 'Un automóvil de 1200 kg viaja en línea recta a 20 m/s. El conductor frena uniformemente hasta detenerse por completo en una distancia de 40 metros. ¿Cuál es la magnitud de la fuerza neta de frenado ejercida sobre el vehículo?',
        options: [
          '6000 N',
          '12000 N',
          '24000 N',
          '3000 N'
        ],
        correctIndex: 0,
        concept: 'Segunda Ley de Newton (F = m·a) combinada con Cinemática rectilínea uniformemente variada (MRUV) o Teorema del Trabajo y la Energía.',
        steps: [
          'Método por Cinemática: v_f² = v_0² + 2·a·d.',
          '0² = (20)² + 2·a·(40) => 0 = 400 + 80a => a = -400 / 80 = -5 m/s².',
          'Por Segunda Ley de Newton: |F| = m · |a| = 1200 kg · 5 m/s² = 6000 N.',
          'Método por Trabajo y Energía (alternativo): W_neto = ΔEc => F · d = ½ · m · v_0² => F · 40 = ½ · 1200 · 400 => F · 40 = 240000 => F = 6000 N.'
        ],
        distractorWhy: [
          'Correcta: Aplicación rigurosa de las leyes de Newton y cinemática.',
          'Distractor: Olvidar el factor ½ al calcular la energía cinética o duplicar la aceleración.',
          'Distractor: No dividir entre la distancia correcta.',
          'Distractor: Usar tiempo de 10 segundos inexistente.'
        ]
      },
      {
        stem: 'En el cruce genético entre dos plantas heterocigotas para la altura del tallo (Tt × Tt), donde el alelo alto (T) es dominante sobre el alelo enano (t), ¿cuál es la probabilidad fenotípica de obtener una planta de tallo alto?',
        options: [
          '75% (3 de 4)',
          '50% (2 de 4)',
          '25% (1 de 4)',
          '100% (4 de 4)'
        ],
        correctIndex: 0,
        concept: 'Primera y Segunda Ley de Mendel (Segregación independiente y cuadros de Punnett).',
        steps: [
          'Alelos parentales: T (dominante, tallo alto) y t (recesivo, tallo enano).',
          'Cuadro de Punnett para Tt × Tt: genotipos resultantes son 1 TT, 2 Tt, 1 tt (proporción genotípica 1:2:1).',
          'Los genotipos TT y Tt expresan el fenotipo dominante (tallo alto): 1 + 2 = 3.',
          'Porcentaje fenotípico: 3 / 4 = 75% tallo alto, 1 / 4 = 25% tallo enano.'
        ],
        distractorWhy: [
          'Correcta: Fenotipo dominante 3/4 o 75%.',
          'Distractor común: Confundir probabilidad fenotípica con la proporción de heterocigotos (Tt = 50%).',
          'Distractor: Probabilidad del fenotipo recesivo (tt = 25%).',
          'Distractor: Asumir dominancia incompleta o cruce monohíbrido homocigoto.'
        ]
      },
      {
        stem: 'De acuerdo con la teoría ácido-base de Brønsted-Lowry, en la reacción reversible NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, el agua (H₂O) actúa como:',
        options: [
          'Un ácido, porque dona un protón (H⁺) al amoníaco.',
          'Una base, porque acepta electrones del nitrógeno.',
          'Una sustancia neutra que solo actúa como catalizador inerte.',
          'Un ácido de Lewis exclusivamente porque forma un enlace covalente dativo.'
        ],
        correctIndex: 0,
        concept: 'Definición de pares ácido-base conjugados según Brønsted-Lowry.',
        steps: [
          'Según Brønsted-Lowry: un ácido es una especie capaz de donar un protón (H⁺), y una base es una especie capaz de aceptarlo.',
          'El agua (H₂O) cede un ion H⁺ al NH₃ para formar NH₄⁺, transformándose ella misma en el ion hidróxido (OH⁻).',
          'Por lo tanto, en este equilibrio químico particular, el agua actúa como ácido de Brønsted-Lowry.'
        ],
        distractorWhy: [
          'Correcta: H₂O cede un protón al amoníaco, convirtiéndose en su base conjugada OH⁻.',
          'Distractor: Confunde la definición de base con la teoría electrónica de Lewis.',
          'Distractor: Asumir que por ser agua pura siempre es neutra en todo equilibrio químico.',
          'Distractor: Reducción inexacta que ignora la transferencia protónica.'
        ]
      }
    ],
    historia: [
      {
        stem: '¿Cuál de los siguientes principios políticos fue introducido de manera fundamental por la Ilustración e influyó directamente en las constituciones republicanas del siglo XIX?',
        options: [
          'La división e independencia de los poderes del Estado (Ejecutivo, Legislativo y Judicial).',
          'El derecho divino de los reyes y la concentración absoluta de facultades gubernamentales.',
          'La autarquía económica mercantilista impuesta por la corona.',
          'La abolición inmediata y universal de todo tipo de propiedad privada.'
        ],
        correctIndex: 0,
        concept: 'Pensamiento ilustrado (Montesquieu, Locke, Rousseau) y republicanismo moderno.',
        steps: [
          'Montesquieu formuló en "El espíritu de las leyes" la separación de los poderes del Estado para evitar la tiranía y asegurar los frenos y contrapesos.',
          'Este principio fue piedra angular de la Declaración de los Derechos del Hombre y del Ciudadano y de las constituciones liberales de América y Europa.'
        ],
        distractorWhy: [
          'Correcta: Pilar central del constitucionalismo democrático moderno.',
          'Distractor: Corresponde al Absolutismo monárquico combatido por los ilustrados.',
          'Distractor: Modelo económico feudal o monárquico del siglo XVII-XVIII.',
          'Distractor: Confusión anacrónica con corrientes socialistas posteriores del siglo XIX y XX.'
        ]
      },
      {
        stem: 'Durante la Revolución Industrial, el proceso de urbanización acelerada trajo consigo profundas transformaciones sociales, entre las que destacó principalmente:',
        options: [
          'El surgimiento del proletariado industrial y la formación de barrios obreros con precarias condiciones sanitarias.',
          'El retorno masivo de la población hacia labores agrícolas de subsistencia comunitaria.',
          'La erradicación definitiva de las diferencias socioeconómicas mediante el control gremial feudal.',
          'El cese del comercio internacional debido a la autosuficiencia de las fábricas.'
        ],
        correctIndex: 0,
        concept: 'Consecuencias sociales y demográficas de la Revolución Industrial.',
        steps: [
          'La mecanización de la producción y la máquina de vapor provocaron un éxodo rural masivo hacia los centros urbanos fabriles.',
          'Nació la clase obrera fabril (proletariado), la cual habitó conventillos y barrios marginales con jornadas extenuantes y hacinamiento, dando origen a la "Cuestión Social".'
        ],
        distractorWhy: [
          'Correcta: Describe la emergencia del proletariado y la problemática urbana-laboral de la época.',
          'Distractor: Ocurrió lo opuesto: éxodo del campo a la ciudad.',
          'Distractor: Los gremios medievales perdieron vigencia y las desigualdades se profundizaron.',
          'Distractor: El comercio exterior experimentó una expansión global sin precedentes.'
        ]
      },
      {
        stem: 'En el contexto de la Guerra Fría, la doctrina de la "Contención" formulada por Estados Unidos tuvo como propósito fundamental:',
        options: [
          'Frenar la expansión territorial e ideológica del comunismo soviético a nivel global.',
          'Promover la firma inmediata de tratados de desarme nuclear total entre las superpotencias.',
          'Facilitar la integración comercial y monetaria de Europa Oriental bajo la influencia soviética.',
          'Desmantelar los pactos militares occidentales como la OTAN.'
        ],
        correctIndex: 0,
        concept: 'Geopolítica de la Guerra Fría y Doctrina Truman.',
        steps: [
          'Formulada principalmente por George F. Kennan y formalizada en la Doctrina Truman (1947).',
          'Buscaba impedir el avance de regímenes comunistas afines a la Unión Soviética mediante asistencia económica (Plan Marshall) y alianzas militares (OTAN).'
        ],
        distractorWhy: [
          'Correcta: Objetivo explícito de la política exterior estadounidense durante el inicio de la Guerra Fría.',
          'Distractor: Durante esta fase inicial predominó la carrera armamentista, no el desarme.',
          'Distractor: Corresponde a la esfera soviética antagónica (Consejo de Ayuda Mutua Económica / COMECON).',
          'Distractor: La OTAN fue creada precisamente como instrumento de dicha doctrina.'
        ]
      }
    ]
  };

  const key = weakSubject.toLowerCase();
  const list = subjectTopics[key] || subjectTopics.matematicas;

  return list.slice(0, 3).map((item, idx) => ({
    id: `ai-gen-${Date.now()}-${idx + 1}`,
    topic: weakTopic || 'Refuerzo Conceptual Clave',
    stem: item.stem,
    options: item.options.map((opt, oIdx) => ({
      id: String.fromCharCode(65 + oIdx),
      text: opt
    })),
    correctOptionId: String.fromCharCode(65 + item.correctIndex),
    pedagogicalExplanation: {
      stepByStep: item.steps,
      keyConcept: item.concept,
      distractorAnalysis: {
        A: item.distractorWhy[0] || 'Análisis de opción A.',
        B: item.distractorWhy[1] || 'Análisis de opción B.',
        C: item.distractorWhy[2] || 'Análisis de opción C.',
        D: item.distractorWhy[3] || 'Análisis de opción D.'
      }
    }
  }));
}

// Server API endpoint for AI Reinforcement (Gemini API)
app.post('/api/reinforce', async (req: Request, res: Response) => {
  try {
    const { weakSubject, weakTopic, failedQuestionsSummary, studentGrade } = req.body;

    const subjectStr = weakSubject || 'Matemáticas';
    const topicStr = weakTopic || 'Álgebra y Ecuaciones';

    if (!ai) {
      console.log('No GEMINI_API_KEY found, serving high-quality pedagogical fallback.');
      const fallbackItems = generateFallbackQuestions(subjectStr, topicStr);
      return res.json({
        success: true,
        source: 'pedagogical_engine_local',
        targetSubject: subjectStr,
        targetTopic: topicStr,
        questions: fallbackItems
      });
    }

    const systemPrompt = `Eres un Diseñador Curricular Senior y Tutor Pedagógico Especialista en Pruebas de Admisión Universitaria (tipo PAES, SAT, ICFES Saber 11, EXANI-II, UNAM).
Tu misión es diseñar un set de exactamente 3 preguntas de refuerzo formativo adaptativo de alta calidad para un estudiante de tercer año de bachillerato/secundaria que presentó debilidades críticas en una materia específica durante un simulacro cronometrado.

CRITERIOS PEDAGÓGICOS:
1. Rigor Curricular: Las preguntas deben evaluar el nivel exigido en exámenes reales de admisión universitaria.
2. Formato de 4 opciones: (A, B, C, D) con una sola opción inequívocamente correcta.
3. Distractores Creíbles y Diagnósticos: Cada alternativa errónea debe reflejar un error conceptual frecuente, no ser inverosímil.
4. Explicación Didáctica Paso a Paso: Para cada pregunta debes proveer el concepto nuclear, la demostración paso a paso y la justificación de por qué los distractores son erróneos.
5. Lenguaje claro, formal, empático y orientado a la construcción de confianza del postulante.`;

    const userPrompt = `El estudiante rindió un simulacro y su área más débil identificada es:
- Materia: "${subjectStr}"
- Tema Crítico / Falencia: "${topicStr}"
- Grado del estudiante: ${studentGrade || '3° o 4° medio / Bachillerato (Postulante Universitario)'}
- Resumen de fallos previos en el simulacro: ${failedQuestionsSummary || 'Cometió errores conceptuales y falta de tiempo al resolver planteamientos complejos en esta área.'}

Genera exactamente 3 preguntas de refuerzo específicas para diagnosticar, ejercitar y consolidar este contenido, con sus opciones (A, B, C, D), la alternativa correcta y la explicación pedagógica exhaustiva.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetSubject: { type: Type.STRING },
            targetTopic: { type: Type.STRING },
            pedagogicalDiagnostic: { type: Type.STRING, description: 'Breve explicación de la falencia cognitiva detectada.' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  stem: { type: Type.STRING, description: 'Enunciado claro y contextualizado de la pregunta.' },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: 'A, B, C o D' },
                        text: { type: Type.STRING, description: 'Texto de la opción' }
                      },
                      required: ['id', 'text']
                    }
                  },
                  correctOptionId: { type: Type.STRING, description: 'Identificador de la respuesta correcta (A, B, C o D)' },
                  pedagogicalExplanation: {
                    type: Type.OBJECT,
                    properties: {
                      keyConcept: { type: Type.STRING, description: 'Concepto clave evaluado.' },
                      stepByStep: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Pasos lógicos para llegar a la respuesta correcta.'
                      },
                      distractorAnalysis: {
                        type: Type.OBJECT,
                        properties: {
                          A: { type: Type.STRING },
                          B: { type: Type.STRING },
                          C: { type: Type.STRING },
                          D: { type: Type.STRING }
                        },
                        required: ['A', 'B', 'C', 'D']
                      }
                    },
                    required: ['keyConcept', 'stepByStep', 'distractorAnalysis']
                  }
                },
                required: ['id', 'topic', 'stem', 'options', 'correctOptionId', 'pedagogicalExplanation']
              }
            }
          },
          required: ['targetSubject', 'targetTopic', 'questions']
        }
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Respuesta vacía de la API de Gemini');
    }

    const parsedData = JSON.parse(rawText);
    return res.json({
      success: true,
      source: 'gemini_api',
      ...parsedData
    });

  } catch (err: any) {
    console.error('Error generating reinforcement with Gemini:', err);
    // Graceful fallback to guarantee student experience
    const fallbackSubject = req.body?.weakSubject || 'Matemáticas';
    const fallbackTopic = req.body?.weakTopic || 'Álgebra y Funciones';
    const fallbackQuestions = generateFallbackQuestions(fallbackSubject, fallbackTopic);

    return res.json({
      success: true,
      source: 'pedagogical_engine_fallback',
      targetSubject: fallbackSubject,
      targetTopic: fallbackTopic,
      questions: fallbackQuestions,
      notice: 'Preguntas servidas mediante motor de refuerzo curricular calibrado.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

// Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
