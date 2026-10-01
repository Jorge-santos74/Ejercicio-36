import React, { useState } from 'react';
import { 
  FileCode2, 
  MapPin, 
  Database, 
  Terminal, 
  Layout, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Cpu,
  KeyRound,
  Download
} from 'lucide-react';
import { 
  USER_JOURNEY_STEPS, 
  DATABASE_ENTITIES, 
  SYSTEM_PROMPT_TEMPLATE, 
  WIREFRAME_SECTIONS 
} from '../data/architectSpecData';

export const TechnicalSpecView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'journey' | 'database' | 'prompt' | 'wireframes'>('journey');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(SYSTEM_PROMPT_TEMPLATE.systemInstructionText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const generateFullSQLDDL = () => {
    return `-- ====================================================================
-- ESPECIFICACIÓN TÉCNICA DDL: PROYECTO 36 - ENSAYO DE ADMISIÓN
-- Base de Datos Relacional: PostgreSQL 15+ / Cloud SQL
-- ====================================================================

-- 1. Tabla de Usuarios / Estudiantes Postulantes
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    grade_level VARCHAR(50) DEFAULT '3_secundaria',
    target_career VARCHAR(100),
    target_score INTEGER DEFAULT 800,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Taxonomía Curricular y Áreas de Conocimiento
CREATE TABLE IF NOT EXISTS subjects_and_topics (
    id VARCHAR(50) PRIMARY KEY, -- 'matematicas', 'lenguaje', 'ciencias', 'historia'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    topics_json JSONB NOT NULL DEFAULT '[]'
);

-- 3. Banco de Preguntas Calibradas
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50) REFERENCES subjects_and_topics(id),
    topic VARCHAR(120) NOT NULL,
    stem TEXT NOT NULL,
    options JSONB NOT NULL, -- [{"id": "A", "text": "..."}, ...]
    correct_option_id VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('fácil', 'medio', 'difícil')),
    recommended_time_sec INTEGER DEFAULT 90,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registro de Intentos de Simulacro (M2)
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_title VARCHAR(150) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    time_limit_sec INTEGER NOT NULL,
    total_time_spent_sec INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers_count INTEGER NOT NULL,
    incorrect_answers_count INTEGER NOT NULL,
    unanswered_count INTEGER NOT NULL,
    standardized_score INTEGER NOT NULL, -- 100 - 1000
    accuracy_percentage NUMERIC(5,2) NOT NULL,
    area_breakdown_json JSONB NOT NULL,
    weakest_subject_id VARCHAR(50) NOT NULL,
    weakest_topic VARCHAR(120) NOT NULL,
    reinforcement_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Detalle de Respuestas del Usuario (M2: respuestas y tiempo de resolución)
CREATE TABLE IF NOT EXISTS user_exam_answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(50) REFERENCES questions(id),
    selected_option_id VARCHAR(5), -- NULL si no respondió
    is_correct BOOLEAN NOT NULL,
    time_spent_sec INTEGER NOT NULL,
    marked_for_review BOOLEAN DEFAULT FALSE,
    change_count INTEGER DEFAULT 0
);

-- 6. Sesión de Refuerzo con IA (Sello M5: 3 preguntas adaptativas generadas)
CREATE TABLE IF NOT EXISTS ai_reinforcement_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    target_subject_id VARCHAR(50) NOT NULL,
    target_topic VARCHAR(120) NOT NULL,
    ai_model_used VARCHAR(50) DEFAULT 'gemini-3.8-flash',
    prompt_tokens INTEGER,
    questions_json JSONB NOT NULL, -- Array de 3 preguntas con explicaciones socráticas
    user_answers_json JSONB DEFAULT '{}',
    completed_count INTEGER DEFAULT 0 CHECK (completed_count BETWEEN 0 AND 3),
    is_mastered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de Alto Rendimiento para Latencia < 50ms
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_date ON exam_attempts(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_answers_attempt ON user_exam_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_ai_reinforce_attempt ON ai_reinforcement_sessions(attempt_id);
`;
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generateFullSQLDDL());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Document Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Documento de Especificación Técnico-Funcional</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Proyecto 36: Ensayo de Admisión • EdTech & IA</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Arquitectura del Sistema & Especificación de Producto (PO)
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Especificación integral diseñada para resolver el problema de postulantes a la universidad sin experiencia en condiciones reales. 
          Incluye el <strong>User Journey</strong>, la <strong>Estructura de Base de Datos relacional/documental</strong>, el <strong>Prompt de Sistema para la IA de refuerzo</strong> y las <strong>Pautas de Wireframe e Interfaz</strong>.
        </p>

        {/* Section Navigation Tabs */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('journey')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSection === 'journey'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>1. User Journey / Flujo</span>
          </button>

          <button
            onClick={() => setActiveSection('database')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSection === 'database'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>2. Estructura de BD</span>
          </button>

          <button
            onClick={() => setActiveSection('prompt')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSection === 'prompt'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>3. Prompt Interno IA</span>
          </button>

          <button
            onClick={() => setActiveSection('wireframes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSection === 'wireframes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layout className="w-4 h-4 text-purple-400" />
            <span>4. Wireframes & UI/UX</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: USER JOURNEY */}
      {activeSection === 'journey' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>1. User Journey / Flujo de Usuario Paso a Paso</span>
              </h2>
              <p className="text-xs text-slate-400">
                Mapeo de la experiencia de punta a punta del estudiante de 3° de secundaria hasta el refuerzo con IA.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {USER_JOURNEY_STEPS.map((step) => {
              let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
              if (step.emotionalState === 'concentrado') badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
              if (step.emotionalState === 'receptivo') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
              if (step.emotionalState === 'motivado') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

              return (
                <div
                  key={step.stepNumber}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <h3 className="text-base font-bold text-white">{step.phase}</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                      Estado emocional: {step.emotionalState}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-300">
                    <strong className="text-white">Objetivo del estudiante:</strong> {step.userGoal}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="font-bold text-cyan-400 uppercase tracking-wider block">
                        Acciones del Estudiante:
                      </span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                        {step.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                        Respuesta del Sistema / Backend:
                      </span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                        {step.systemResponse.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800/80">
                    <div className="text-slate-400">
                      <strong className="text-slate-300">Dolor que resuelve:</strong> {step.painPointsResolved}
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <strong className="text-indigo-400">KPIs de éxito:</strong>
                      <span>{step.kpis.join(' • ')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: DATABASE ARCHITECTURE */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>2. Estructura de Base de Datos y Modelo de Persistencia</span>
              </h2>
              <p className="text-xs text-slate-400">
                Esquema de entidades para almacenar usuarios, ensayos, preguntas, respuestas y sesiones de refuerzo IA.
              </p>
            </div>

            <button
              onClick={handleCopySQL}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-2 cursor-pointer transition-colors"
            >
              {copiedSQL ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSQL ? 'DDL Copiado al portapapeles' : 'Copiar DDL SQL'}</span>
            </button>
          </div>

          {/* Architecture Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Motor Primario Recomendado</span>
              <p className="text-white font-bold text-sm">PostgreSQL 15+ / Cloud SQL</p>
              <p className="text-slate-400 text-[11px]">Soporte híbrido de tipos relacionales estrictos y JSONB de alta performance para desgloses y telemetría.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Estrategia de Telemetría (M2)</span>
              <p className="text-white font-bold text-sm">user_exam_answers</p>
              <p className="text-slate-400 text-[11px]">Persistencia granular de tiempo en segundos por pregunta, cambios de opción y banderas de duda para alimentar al LLM.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase">Persistencia de Refuerzo IA (M5)</span>
              <p className="text-white font-bold text-sm">ai_reinforcement_sessions</p>
              <p className="text-slate-400 text-[11px]">Control de las 3 preguntas completadas, estado de maestría (is_mastered) y prompts utilizados para auditoría de tokens.</p>
            </div>
          </div>

          {/* Database Entities Tables */}
          <div className="space-y-6">
            {DATABASE_ENTITIES.map((entity) => (
              <div
                key={entity.tableName}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{entity.name}</h3>
                      <code className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {entity.tableName}
                      </code>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{entity.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase bg-slate-800 text-slate-300">
                    Módulo: {entity.category}
                  </span>
                </div>

                {/* Table of fields */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Campo</th>
                        <th className="py-2.5 px-4 font-semibold">Tipo</th>
                        <th className="py-2.5 px-4 font-semibold">Restricciones</th>
                        <th className="py-2.5 px-4 font-semibold">Descripción del Dato</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {entity.fields.map((f) => (
                        <tr key={f.name} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-white">{f.name}</td>
                          <td className="py-2.5 px-4 font-mono text-cyan-400">{f.type}</td>
                          <td className="py-2.5 px-4 font-mono text-amber-400 text-[11px]">{f.constraints}</td>
                          <td className="py-2.5 px-4 text-slate-300">{f.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notes and Indexes */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300 block">Reglas de Negocio / Índices:</span>
                  <div className="font-mono text-[11px] text-indigo-300">
                    {entity.indexes.join(' ')}
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    {entity.businessLogicNotes.join(' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: SYSTEM PROMPT SPECIFICATION */}
      {activeSection === 'prompt' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>3. Prompt Interno del Sistema para la Inteligencia Artificial</span>
              </h2>
              <p className="text-xs text-slate-400">
                Directiva maestra enviada al LLM (Gemini 3.8 Flash) para generar las 3 preguntas adaptativas y explicaciones socráticas.
              </p>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center space-x-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
            >
              {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPrompt ? 'Prompt Copiado' : 'Copiar System Prompt'}</span>
            </button>
          </div>

          {/* Master Prompt Code Block */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4" />
                <span>System Instruction (Gemini API Server-Side)</span>
              </span>
              <span className="text-xs font-mono text-slate-500">model: gemini-3.8-flash • responseMimeType: application/json</span>
            </div>

            <pre className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {SYSTEM_PROMPT_TEMPLATE.systemInstructionText}
            </pre>
          </div>

          {/* Variables of the Prompt */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Variables de Entrada Inyectadas en Tiempo Real</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SYSTEM_PROMPT_TEMPLATE.inputVariables.map((v) => (
                <div key={v.name} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-bold font-mono text-indigo-400">{`{{${v.name}}}`}</code>
                    <span className="text-[10px] text-slate-500 uppercase">{v.type}</span>
                  </div>
                  <p className="text-slate-300">{v.description}</p>
                  <div className="text-[11px] text-amber-300 font-mono pt-1">
                    Ejemplo: "{v.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structured JSON Output Schema */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Esquema JSON Obligatorio de Salida (Strict responseSchema)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Garantiza que la respuesta nunca rompa el frontend y provea la estructura exacta de 3 preguntas con análisis de distractores.
            </p>

            <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
              {SYSTEM_PROMPT_TEMPLATE.expectedOutputSchema}
            </pre>
          </div>

          {/* Few-Shot Example */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ejemplo Calibrado (Few-Shot Prompting)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap">
                <span className="font-bold text-amber-400 block mb-1">Entrada del Estudiante:</span>
                {SYSTEM_PROMPT_TEMPLATE.fewShotExample.input}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 whitespace-pre-wrap">
                <span className="font-bold text-emerald-400 block mb-1">Respuesta Estructurada de Gemini:</span>
                {SYSTEM_PROMPT_TEMPLATE.fewShotExample.output}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: WIREFRAMES & UI/UX SPEC */}
      {activeSection === 'wireframes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Layout className="w-5 h-5 text-purple-400" />
                <span>4. Sugerencias de Wireframe y Jerarquía Visual UI/UX</span>
              </h2>
              <p className="text-xs text-slate-400">
                Arquitectura de información para presentar el desglose por áreas y el módulo de refuerzo con IA.
              </p>
            </div>
          </div>

          {/* Design System & Psychology Rules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block">Psicología Anti-Ansiedad</span>
              <p className="text-slate-300 leading-relaxed">
                El cronómetro no es rojo estridente salvo en los últimos 2 minutos. Las áreas débiles no se marcan con colores de "fracaso" sino con tonalidades ámbar formativas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold uppercase tracking-wider block">Jerarquía en F-Pattern</span>
              <p className="text-slate-300 leading-relaxed">
                En la pantalla de resultados, la vista se ancla primero en el puntaje total, luego en el Call-To-Action del refuerzo con IA, y finalmente en el desglose de materias.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block">Micro-Mastery Cycle (M5)</span>
              <p className="text-slate-300 leading-relaxed">
                El módulo de refuerzo con IA exige completar exactamente 3 preguntas generadas, con feedback socrático instantáneo y animación de logro final.
              </p>
            </div>
          </div>

          {/* Wireframes Breakdown */}
          <div className="space-y-6">
            {WIREFRAME_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{section.title}</h3>
                    <code className="text-xs font-mono text-indigo-400">{section.viewName}</code>
                  </div>
                  <span className="text-xs text-slate-400 italic">
                    Objetivo: {section.userObjective}
                  </span>
                </div>

                {/* Visual Layout Mockup / Blueprint representation */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 space-y-3">
                  <span className="text-amber-400 font-bold block uppercase text-[11px]">
                    Blueprint Esquemático de la Interfaz:
                  </span>
                  
                  {section.id === 'wf-exam-running' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px]">
                      <div className="border border-indigo-500/40 p-2 rounded text-center text-indigo-300 font-bold">
                        [ HEADER FIJO: Temporizador 12:45 | Pregunta 4/12 | Barra Progreso | Botón "Entregar" ]
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 border border-slate-700 p-3 rounded space-y-2">
                          <div className="text-cyan-300 font-bold">[ MATERIA • DIFICULTAD • BANDERA DUDA ]</div>
                          <div className="text-white">[ ENUNCIADO DEL REACTIVO ]</div>
                          <div className="space-y-1">
                            <div className="p-1 border border-slate-800 rounded">[A] Alternativa 1</div>
                            <div className="p-1 border border-indigo-500 bg-indigo-950/40 rounded">[B] Alternativa 2 (Seleccionada)</div>
                            <div className="p-1 border border-slate-800 rounded">[C] Alternativa 3</div>
                            <div className="p-1 border border-slate-800 rounded">[D] Alternativa 4</div>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span>[ Anterior ]</span>
                            <span>[ Siguiente ]</span>
                          </div>
                        </div>
                        <div className="col-span-1 border border-slate-700 p-3 rounded space-y-2">
                          <div className="text-amber-400 font-bold">[ PALETA NUMÉRICA ]</div>
                          <div className="grid grid-cols-4 gap-1 text-center">
                            <div className="bg-indigo-600 text-white rounded p-1">1</div>
                            <div className="bg-indigo-600 text-white rounded p-1">2</div>
                            <div className="bg-amber-500/40 text-amber-200 rounded p-1">3★</div>
                            <div className="border border-cyan-400 rounded p-1">4</div>
                            <div className="bg-slate-800 rounded p-1">5</div>
                            <div className="bg-slate-800 rounded p-1">6</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'wf-results-breakdown' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px]">
                      <div className="border border-indigo-500/40 p-3 rounded flex justify-between items-center bg-indigo-950/20">
                        <div>
                          <div className="text-xs text-slate-400">PUNTAJE ESTANDARIZADO</div>
                          <div className="text-xl font-bold text-white">780 / 1000 pts (83% acierto)</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">GESTIÓN DE TIEMPO</div>
                          <div className="text-base text-cyan-300">68s prom/pregunta</div>
                        </div>
                      </div>

                      <div className="border border-amber-500/50 p-3 rounded bg-amber-950/20 flex justify-between items-center">
                        <div>
                          <span className="text-amber-400 font-bold">⚠️ ÁREA CRÍTICA DETECTADA: Matemáticas (Álgebra)</span>
                          <p className="text-[10px] text-slate-300">Falencia: Confusión en vértice de parábola y signos de factorización.</p>
                        </div>
                        <span className="bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs">[ ⚡ ACTIVAR REFUERZO IA ]</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-slate-700 p-2 rounded">Matemáticas: 40% [===       ] (Falencia crítica)</div>
                        <div className="border border-slate-700 p-2 rounded">Lenguaje: 100% [==========] (Excelente)</div>
                        <div className="border border-slate-700 p-2 rounded">Ciencias: 75% [=======   ] (Bueno)</div>
                        <div className="border border-slate-700 p-2 rounded">Historia: 80% [========  ] (Sólido)</div>
                      </div>
                    </div>
                  )}

                  {section.id === 'wf-ai-reinforcement' && (
                    <div className="space-y-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px]">
                      <div className="border border-indigo-500/40 p-2 rounded flex justify-between items-center">
                        <span className="text-white font-bold">TUTOR IA ADAPTATIVO: Refuerzo en Matemáticas</span>
                        <span className="text-emerald-400">Paso [1] [2] [3/3] ✓</span>
                      </div>

                      <div className="border border-slate-700 p-3 rounded space-y-2">
                        <div className="text-cyan-300 font-semibold">[ Enunciado de refuerzo generado por Gemini ]</div>
                        <div className="space-y-1">
                          <div className="p-1 border border-emerald-500 bg-emerald-950/40 rounded">[A] Opción Correcta (Explicada) ✓</div>
                          <div className="p-1 border border-slate-800 rounded">[B] Distractor (Explicado por qué falla)</div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded border border-indigo-500/30 space-y-1">
                          <span className="text-cyan-400 font-bold">💡 Concepto Clave:</span>
                          <p className="text-slate-300">El vértice de la parábola f(x) = ax² + bx + c se halla con x = -b/(2a)...</p>
                          <span className="text-amber-400 font-bold block pt-1">🔍 Análisis de Trampas de Distractores:</span>
                          <p className="text-slate-400">Opción B confunde el término independiente con el valor extremo...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Hierarchy list */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-white uppercase tracking-wider block">
                    Jerarquía Visual de Elementos:
                  </span>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                    {section.visualHierarchy.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* UX Design Rules */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                    Reglas de Diseño y Usabilidad UX:
                  </span>
                  <ul className="space-y-1 list-disc pl-4 text-slate-400">
                    {section.uxDesignRules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
