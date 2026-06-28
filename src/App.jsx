import { useEffect, useMemo, useState } from "react";
import CareerDashboard, {
  ARTEFATOS,
  MONTHS,
  ROUTINE,
  SKILLS,
  TEMPLATES,
} from "../career-dashboard.jsx";
import { createApi } from "./api.js";

const savedSession = () => {
  try {
    return JSON.parse(localStorage.getItem("diario-session") || "null");
  } catch {
    return null;
  }
};

export default function App() {
  const [session, setSession] = useState(savedSession);
  const [activeGoal, setActiveGoal] = useState(null);
  const api = useMemo(() => createApi(session?.token), [session?.token]);
  const storageAdapter = useMemo(() => {
    if (!session?.token) return null;

    return {
      get: async (key) => {
        try {
          return await api.storageGet(key);
        } catch {
          return null;
        }
      },
      list: async (prefix) => {
        const items = await api.storageList(prefix);
        return { keys: items.map((item) => item.key) };
      },
      set: async (key, value) => {
        await api.storageSet(key, value);
        return true;
      },
      delete: async (key) => {
        await api.storageDelete(key);
        return true;
      },
    };
  }, [api, session?.token]);

  if (storageAdapter) {
    window.storage = storageAdapter;
  }

  useEffect(() => {
    return () => {
      if (!session?.token) delete window.storage;
    };
  }, [session?.token]);

  function handleSession(nextSession) {
    localStorage.setItem("diario-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function logout() {
    localStorage.removeItem("diario-session");
    delete window.storage;
    setActiveGoal(null);
    setSession(null);
  }

  if (!session?.token) {
    return <AuthScreen api={api} onSession={handleSession} />;
  }

  return (
    <div className="app-shell">
      <TopBar user={session.user} onLogout={logout} />
      <GoalManager api={api} activeGoal={activeGoal} onActiveGoalChange={setActiveGoal} />
      <CareerDashboard goal={activeGoal} />
    </div>
  );
}

function AuthScreen({ api, onSession }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const action = mode === "login" ? api.login : api.register;
      const session = await action(form);
      onSession(session);
    } catch (err) {
      setError(toAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setError("");
    setMode(mode === "login" ? "register" : "login");
  }

  return (
    <main className="auth-screen">
      <section className="auth-brand" aria-label="Resumo do app">
        <div className="auth-kicker">Diario Evolucao</div>
        <h1 className="auth-title">
          Objetivos vivos, <span>registrados todo dia.</span>
        </h1>
        <p className="auth-copy">
          Um painel pessoal para planejar ciclos de evolucao, acompanhar entregas e manter
          um diario de progresso que funciona bem no celular.
        </p>

        <div className="auth-rail" aria-hidden="true">
          <div className="auth-rail-item">
            <strong>01. Planeje</strong>
            <span>Cadastre objetivos e transforme cada ciclo em entregas concretas.</span>
          </div>
          <div className="auth-rail-item">
            <strong>02. Registre</strong>
            <span>Use o diario para guardar progresso, decisoes e proximos passos.</span>
          </div>
          <div className="auth-rail-item">
            <strong>03. Continue</strong>
            <span>Instale como PWA e volte para o plano direto da tela inicial.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label={mode === "login" ? "Entrar" : "Criar conta"}>
        <div className="auth-panel-header">
          <div className="auth-kicker">{mode === "login" ? "Sessao segura" : "Novo acesso"}</div>
          <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>
          <p>
            {mode === "login"
              ? "Entre para sincronizar diario, objetivos e checklist."
              : "Crie sua conta para salvar seus objetivos no MongoDB."}
          </p>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <Field
              label="Nome"
              value={form.name}
              onChange={(name) => setForm((prev) => ({ ...prev, name }))}
              autoComplete="name"
            />
          )}
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(email) => setForm((prev) => ({ ...prev, email }))}
            autoComplete="email"
          />
          <Field
            label="Senha"
            type="password"
            value={form.password}
            onChange={(password) => setForm((prev) => ({ ...prev, password }))}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && <div className="auth-alert">{error}</div>}

          <button disabled={loading} className="primary-button">
            {loading ? "Conectando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>

          <button type="button" onClick={switchMode} className="secondary-button">
            {mode === "login" ? "Criar uma conta" : "Ja tenho conta"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
      />
    </label>
  );
}

function TopBar({ user, onLogout }) {
  return (
    <div className="app-topbar">
      <div className="app-topbar-inner">
        <div className="app-user">
          <strong>{user?.name}</strong>
          <span>Workspace pessoal</span>
        </div>
        <button onClick={onLogout} className="logout-button" aria-label="Sair da conta">
          <span aria-hidden="true">↪</span>
          <strong>Sair</strong>
        </button>
      </div>
    </div>
  );
}

function GoalManager({ api, activeGoal, onActiveGoalChange }) {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function loadGoals() {
    setLoading(true);
    setError("");
    try {
      const nextGoals = await api.listGoals();
      setGoals(nextGoals);
      onActiveGoalChange((current) => {
        if (current && nextGoals.some((goal) => goal._id === current._id)) return current;
        return nextGoals[0] || null;
      });
    } catch (err) {
      setError(toAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  async function createGoal(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      const goal = await api.createGoal(
        createBlankGoalPayload({ title, description, durationMonths })
      );
      setGoals((prev) => [goal, ...prev]);
      onActiveGoalChange(goal);
      setTitle("");
      setDescription("");
      setDurationMonths(12);
      setIsCreating(false);
    } catch (err) {
      setError(toAuthError(err));
    }
  }

  async function seedDefault() {
    setError("");
    try {
      const goal = await api.createGoal(createCareerGoalPayload());
      setGoals((prev) => [goal, ...prev]);
      onActiveGoalChange(goal);
      setIsCreating(false);
    } catch (err) {
      setError(toAuthError(err));
    }
  }

  return (
    <section className="goal-manager">
      <div className="goal-manager-inner">
        <div className="goal-toolbar">
          <div>
            <div className="app-kicker">Objetivos</div>
            <p>Escolha um foco ou cadastre um novo ciclo.</p>
          </div>
          <button type="button" onClick={() => setIsCreating(true)} className="add-goal-button">
            <span aria-hidden="true">+</span>
            <strong>Novo objetivo</strong>
          </button>
        </div>

        {error && <div className="auth-alert goal-error">{error}</div>}
        <div className="goal-list">
          {loading ? (
            <span className="goal-empty">Carregando objetivos...</span>
          ) : goals.length === 0 ? (
            <span className="goal-empty">Nenhum objetivo cadastrado ainda.</span>
          ) : (
            goals.map((goal) => (
              <button
                key={goal._id}
                type="button"
                onClick={() => onActiveGoalChange(goal)}
                className={`goal-pill ${activeGoal?._id === goal._id ? 'is-active' : ''}`}
              >
                {goal.title}
              </button>
            ))
          )}
        </div>
      </div>

      {isCreating && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsCreating(false)}>
          <form
            onSubmit={createGoal}
            className="goal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-goal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="goal-modal-header">
              <div>
                <div className="app-kicker">Novo objetivo</div>
                <h2 id="new-goal-title">Cadastrar ciclo</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="icon-button"
                aria-label="Fechar formulario"
              >
                ×
              </button>
            </div>

            <label className="field">
              <span>Titulo</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Aprender AWS"
                autoFocus
              />
            </label>
            <label className="field">
              <span>Descricao curta</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="O que esse objetivo precisa mover?"
              />
            </label>
            <label className="field">
              <span>Duração em meses</span>
              <input
                type="number"
                min="1"
                max="60"
                value={durationMonths}
                onChange={(event) => setDurationMonths(Number(event.target.value))}
              />
            </label>

            <div className="goal-modal-actions">
              <button type="button" onClick={seedDefault} className="secondary-button">
                Importar trilha atual
              </button>
              <button className="primary-button">Salvar objetivo</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function toAuthError(error) {
  if (error?.message === "Failed to fetch") {
    return "Nao consegui conectar na API. Verifique se o backend esta rodando e se VITE_API_URL aponta para a URL correta.";
  }

  return error?.message || "Nao foi possivel concluir a acao agora.";
}

function createBlankGoalPayload({ title, description, durationMonths }) {
  const months = createProjectedMonths(durationMonths);

  return {
    title,
    description,
    durationMonths: months.length,
    startDate: monthStartIso(months[0]),
    endDate: monthEndIso(months[months.length - 1]),
    status: "active",
    months,
    routines: [],
    skills: [],
    artifacts: [],
    templates: [],
  };
}

function createCareerGoalPayload() {
  return {
    title: "Da Analise a Arquitetura",
    description:
      "Trilha de 6 meses para evoluir como Analista de Projetos Pleno com raciocinio de arquitetura.",
    durationMonths: 6,
    startDate: "2026-07-01",
    endDate: "2026-12-31",
    status: "active",
    months: MONTHS.map((m) => ({
      month: m.n,
      year: 2026,
      shortName: m.s,
      name: m.nm,
      icon: m.ic,
      color: m.c,
      theme: m.mt,
      objective: m.ob,
      focus: m.fo,
      studies: m.es,
      deliverable: m.ev,
      technicalTask: m.ta,
      englishGoal: m.ig,
      phrases: m.fr,
      postIdea: m.po,
    })),
    routines: ROUTINE,
    skills: SKILLS,
    artifacts: ARTEFATOS,
    templates: TEMPLATES,
  };
}

function createProjectedMonths(durationMonths) {
  const amount = Math.min(Math.max(Number(durationMonths) || 12, 1), 60);
  const now = new Date();
  const colors = ["#4C87F2", "#56B4F7", "#2DD4A0", "#F0A500", "#9D7FEA", "#E86FA8"];

  return Array.from({ length: amount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
      month,
      year,
      shortName: shortMonthName(date),
      name: longMonthName(date),
      icon: "🎯",
      color: colors[index % colors.length],
      theme: `Mês ${index + 1}`,
      objective: "",
      focus: [],
      studies: [],
      deliverable: "",
      technicalTask: "",
      englishGoal: "",
      phrases: [],
      postIdea: "",
    };
  });
}

function shortMonthName(date) {
  return date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
}

function longMonthName(date) {
  const value = date.toLocaleDateString("pt-BR", { month: "long" });
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function monthStartIso(month) {
  return `${month.year}-${String(month.month).padStart(2, "0")}-01`;
}

function monthEndIso(month) {
  const date = new Date(month.year, month.month, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
