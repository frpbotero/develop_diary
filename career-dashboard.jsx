import { useState, useEffect, useCallback } from "react";

// ── Global styles ──────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .cd-root { font-family: 'Inter', sans-serif; }
    .cd-root ::-webkit-scrollbar { width: 4px; height: 4px; }
    .cd-root ::-webkit-scrollbar-track { background: transparent; }
    .cd-root ::-webkit-scrollbar-thumb { background: #1A2F52; border-radius: 4px; }
    @keyframes rail-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(76,135,242,0.55); }
      50% { box-shadow: 0 0 0 6px rgba(76,135,242,0); }
    }
    .rail-active { animation: rail-pulse 2.2s ease infinite; }
    @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fade-up 0.22s ease forwards; }
    .cd-root button:focus-visible { outline: 2px solid #4C87F2; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .rail-active, .fade-up { animation: none !important; } }
  `}</style>
);

// ── Design tokens ──────────────────────────────────────────────────────────────
const D = {
  bg:'#07101F', surf:'#0C1929', card:'#0F1E35', bd:'#1A2F52', muted:'#3A567A',
  blue:'#4C87F2', amber:'#F0A500', green:'#2DD4A0', purple:'#9D7FEA', pink:'#E86FA8', sky:'#56B4F7',
  tx:'#D8E4F5', mid:'#8BA4C5',
};

// ── Data ────────────────────────────────────────────────────────────────────────
export const MONTHS = [
  { n:7, s:'JUL', nm:'Julho', ic:'🚀', c:D.blue,
    mt:'Assumir a nova função com método',
    ob:'Entrar como Analista de Projetos Pleno com postura estruturada, sem perder a identidade técnica.',
    fo:['Entender expectativas do cargo','Mapear responsabilidades e fluxo de demandas','Conhecer os stakeholders chave','Criar modelo pessoal de análise técnica','Atualizar LinkedIn com nova posição'],
    es:['Requisitos funcionais e não funcionais','Discovery técnico','User stories e critérios de aceite','C4 Model básico'],
    ev:'Template de Análise Técnica Inicial (16 seções)',
    ta:'Desenhar diagrama de contexto de um projeto real: integrações e riscos principais.',
    ig:'Se apresentar, explicar função, rotina e transição de carreira',
    fr:['I work as a Project Analyst with a technical background in software engineering.','I help translate business needs into technical requirements.','My goal is to become a Solution Architect.','I have experience with APIs, data pipelines, AI and backend development.'],
    po:'Nova fase como Analista de Projetos Pleno: tecnologia, requisitos e soluções digitais.' },
  { n:8, s:'AGO', nm:'Agosto', ic:'📋', c:D.sky,
    mt:'Dominar requisitos, POC e comunicação',
    ob:'Ficar bom em transformar conversa solta em documento claro.',
    fo:['Conduzir reuniões de entendimento','Fazer boas perguntas técnicas','Separar problema de solução','Registrar e comunicar riscos','Validar entendimento com stakeholders'],
    es:['POC vs MVP','Matriz de risco técnico','Priorização e impacto','Documentação executiva'],
    ev:'Template de POC + Template de Matriz de Risco Técnico',
    ta:'Mini-estudo: Quando usar API síncrona vs fila vs processamento assíncrono?',
    ig:'Fazer perguntas, pedir repetição, explicar problemas',
    fr:["Could you repeat that, please?","Let me explain the context.","The main problem is...","We need to validate this assumption first."],
    po:'POC não é mini-produto. POC é redução de incerteza.' },
  { n:9, s:'SET', nm:'Setembro', ic:'🌍', c:D.green,
    mt:'Intercâmbio + inglês real + networking',
    ob:'Usar o intercâmbio como laboratório de comunicação, confiança e networking internacional.',
    fo:['Pitch pessoal em inglês automático','Small talk e networking ativo','Vocabulário técnico aplicado','Amizades internacionais','Apresentar projeto em inglês'],
    es:['10 frases novas por dia','1 conversa em inglês por dia','Diário semanal em inglês','2 vídeos de arquitetura/AWS por semana'],
    ev:'Pitch profissional em inglês treinado e automático (gravação)',
    ta:'Registrar aprendizados diários, praticar speaking, assistir vídeos técnicos em inglês.',
    ig:'Comunicação real: apresentação, small talk, networking e amizades',
    fr:["Hi, I'm Felipe. I'm from Brazil.","I'm improving my English to grow toward a Solution Architect role.","What kind of technology do you work with?","Would you like to grab a coffee after class?"],
    po:'O que estudar inglês tem me ensinado sobre comunicação técnica.' },
  { n:10, s:'OUT', nm:'Outubro', ic:'☁️', c:D.amber,
    mt:'AWS Cloud Practitioner + arquitetura cloud',
    ob:'Começar formalmente a trilha AWS com foco em fundamentos e arquitetura.',
    fo:['AWS global infrastructure','EC2, S3, RDS, Lambda','IAM, VPC, CloudWatch','SQS, SNS e mensageria','Well-Architected Framework (5 pilares)','Pricing e shared responsibility model'],
    es:['AWS Cloud Practitioner Essentials (oficial)','Well-Architected Framework','Serviços fundamentais AWS','Modelo de responsabilidade compartilhada'],
    ev:'Desenho de arquitetura AWS: API + banco + storage + fila + logs',
    ta:'Criar no portfólio: AWS Basic Architecture Study (objetivo, componentes, fluxo, NFRs, riscos e custos).',
    ig:'Consumir conteúdo AWS em inglês, entender vídeos técnicos',
    fr:["I am studying for the AWS Cloud Practitioner certification.","The Well-Architected Framework has five pillars.","S3 provides durable and scalable object storage."],
    po:'Começando a estudar AWS com foco em arquitetura de soluções.' },
  { n:11, s:'NOV', nm:'Novembro', ic:'🏗️', c:D.purple,
    mt:'C4 Model, arc42, ADR e integração',
    ob:'Fazer o que arquitetos fazem: desenhar, explicar e justificar decisões técnicas.',
    fo:['C4 Model (contexto, containers, componentes)','arc42 como template de documentação','ADR para registrar decisões','OpenAPI e API Gateway','Mensageria e integração assíncrona','Observabilidade'],
    es:['c4model.com (site oficial)','arc42.org/overview','Formato ADR','Integração síncrona vs assíncrona','OAuth2, JWT, circuit breaker, DLQ'],
    ev:'Diagrama C4 de Contexto + Diagrama C4 de Containers + ADR 001',
    ta:'Modelar com C4: upload de docs com IA (S3 → evento → worker → embeddings → banco vetorial → API → LLM).',
    ig:'Explicar decisões de arquitetura e trade-offs em inglês',
    fr:["The decision was to use an event-driven architecture.","We documented this as an Architecture Decision Record.","The C4 model helps communicate architecture to different audiences."],
    po:'Uma decisão técnica não documentada vira dívida de contexto.' },
  { n:12, s:'DEZ', nm:'Dezembro', ic:'🏆', c:D.pink,
    mt:'Portfólio público e consolidação',
    ob:'Fechar o ciclo com evidência pública do que foi construído em 6 meses.',
    fo:['Consolidar repositório de portfólio','Publicar 3 case studies','Revisar evolução dos 6 meses','LinkedIn reposicionado como futuro arquiteto','Planejar próxima fase'],
    es:['Revisão e refinamento de todos os artefatos','Preparação de 3 case studies detalhados'],
    ev:'Repositório solution-architecture-portfolio: /docs + /diagrams + /case-studies',
    ta:'Publicar 3 case studies: RAG Document Processing, API-First Integration, AWS Basic Architecture.',
    ig:'Apresentar portfólio em inglês, revisar pitch completo',
    fr:["Over the past six months, I built a portfolio in solution architecture.","My differentiator is the combination of data, AI, APIs and cloud.","I am ready for the next step toward becoming a Solution Architect."],
    po:'6 meses construindo minha base para arquitetura de soluções.' },
];

export const ROUTINE = [
  { day:0, nm:'Domingo', th:'Revisão Leve', ic:'🔍', d:'20 min', c:D.purple,
    tk:['Revisar progresso da semana','Planejar foco da próxima semana','Atualizar checklist mensal'] },
  { day:1, nm:'Segunda', th:'Projetos', ic:'📋', d:'40 min', c:D.blue,
    tk:['Estudar requisitos e gestão de projetos','Praticar escrita de POC ou documentação','Revisar riscos e critérios de aceite'] },
  { day:2, nm:'Terça', th:'Arquitetura', ic:'🏗️', d:'40 min', c:D.amber,
    tk:['C4 Model, arc42 ou ADR','Integração de sistemas e APIs','Cloud e requisitos não funcionais'] },
  { day:3, nm:'Quarta', th:'Inglês', ic:'🌍', d:'40 min', c:D.green,
    tk:['5 min: vocabulário ou Anki','5 min: shadowing de frase técnica','Simular apresentação de projeto','Gravar, ouvir e corrigir'] },
  { day:4, nm:'Quinta', th:'Técnica Viva', ic:'💻', d:'40 min', c:D.sky,
    tk:['Python / FastAPI / NestJS','Docker, testes ou CI/CD','RAG, banco vetorial ou pipeline de dados'] },
  { day:5, nm:'Sexta', th:'LinkedIn & Network', ic:'🔗', d:'50 min', c:D.pink,
    tk:['Comentar 3 posts de arquitetos ou AWS','Escrever rascunho do post do mês','Conectar com pessoas relevantes'] },
  { day:6, nm:'Sábado', th:'Bloco Profundo', ic:'⚡', d:'2h', c:D.purple,
    tk:['Construir artefato do mês','Estudo aprofundado sem interrupções','Projeto pessoal ou portfólio'] },
];

export const SKILLS = [
  { t:'Agora', s:'Prioridade alta', c:D.blue,
    it:['Requisitos funcionais e NF','Discovery técnico','Escrita de demandas','POC e MVP','Comunicação com stakeholders','C4 Model','AWS básico','APIs REST','Integração de sistemas','Inglês funcional'] },
  { t:'Próximo nível', s:'Trilha de arquitetura', c:D.amber,
    it:['OpenAPI / Swagger','Mensageria (SQS, Kafka)','Observabilidade','ADR','arc42','Requisitos NF avançados','Segurança e LGPD','AWS Solutions Architect'] },
  { t:'Diferencial', s:'Especialidade Felipe', c:D.purple,
    it:['RAG','IA aplicada a negócio','Bancos vetoriais','Pipelines ETL/ELT','LLMOps','Governança de dados','Automação inteligente','FastAPI + NestJS + Angular'] },
];

export const ARTEFATOS = [
  { id:'a01', m:'JUL', lb:'Template de Análise Técnica Inicial (16 seções)' },
  { id:'a02', m:'JUL', lb:'Diagrama de contexto de um projeto real' },
  { id:'a03', m:'AGO', lb:'Template de POC' },
  { id:'a04', m:'AGO', lb:'Template de Matriz de Risco Técnico' },
  { id:'a05', m:'AGO', lb:'Mini-estudo: API síncrona vs fila vs assíncrono' },
  { id:'a06', m:'SET', lb:'Pitch profissional em inglês (gravação)' },
  { id:'a07', m:'OUT', lb:'Desenho de arquitetura AWS básica' },
  { id:'a08', m:'OUT', lb:'AWS Basic Architecture Study (portfólio)' },
  { id:'a09', m:'OUT', lb:'🏅 Certificação AWS Cloud Practitioner' },
  { id:'a10', m:'NOV', lb:'Diagrama C4 — System Context' },
  { id:'a11', m:'NOV', lb:'Diagrama C4 — Containers' },
  { id:'a12', m:'NOV', lb:'ADR 001 — Primeira decisão documentada' },
  { id:'a13', m:'DEZ', lb:'Repositório solution-architecture-portfolio' },
  { id:'a14', m:'DEZ', lb:'Case Study: RAG Document Processing' },
  { id:'a15', m:'DEZ', lb:'Case Study: API-First Integration' },
  { id:'a16', m:'DEZ', lb:'Case Study: AWS Basic Architecture' },
];

export const TEMPLATES = [
  { id:'ta', ic:'🔍', t:'Análise Técnica Inicial', c:D.blue,
    sb:'Use no início de qualquer nova demanda ou projeto',
    sc:['1. Contexto — Por que essa demanda existe?','2. Problema — O que causa dor ou risco?','3. Objetivo — Qual o resultado esperado?','4. Stakeholders — Quem pede, usa e aprova?','5. Fluxo atual — Como funciona hoje?','6. Fluxo proposto — Como vai funcionar?','7. Sistemas envolvidos — O que será afetado?','8. Dados envolvidos — Entradas, saídas, storage?','9. Requisitos funcionais — O que o sistema faz?','10. Requisitos não funcionais — Desempenho, disponibilidade, segurança?','11. Integrações — Com quais APIs conversa?','12. Riscos — O que pode dar errado?','13. Premissas — O que estamos assumindo?','14. Alternativas de solução — Quais opções consideramos?','15. POC sugerida — Como validar com baixo risco?','16. Critérios de sucesso — Como medimos que funcionou?'] },
  { id:'tp', ic:'🔬', t:'Plano de POC', c:D.amber,
    sb:'Antes de começar qualquer prova de conceito',
    sc:['Hipótese a validar — O que queremos provar?','Escopo incluído — O que entra na POC?','Escopo fora — O que NÃO entra?','Dados necessários — Quais dados usar?','Sistemas envolvidos — Com o que integra?','Critérios de sucesso — Como saber se deu certo?','Riscos da POC — O que pode invalidar?','Duração estimada — Tempo para ter resposta?','Resultado esperado — O que aprenderemos?','Decisão após POC — O que faremos depois?'] },
  { id:'td', ic:'📝', t:'ADR — Decisão de Arquitetura', c:D.purple,
    sb:'Para documentar qualquer decisão técnica importante',
    sc:['Título: ADR XXX — [Decisão tomada]','Status: Proposto / Aceito / Substituído','Contexto: Qual problema resolvemos?','Decisão: Qual decisão foi tomada?','Consequências positivas: O que ganhamos?','Consequências negativas: O que aceitamos?','Alternativas consideradas: Quais opções avaliamos?','Referências: Links e ADRs relacionados'] },
  { id:'ts', ic:'📊', t:'Status Report Semanal', c:D.green,
    sb:'Para comunicar progresso ao time e stakeholders',
    sc:['Entregas realizadas esta semana','Entregas em andamento','Bloqueios (responsável + prazo)','Riscos identificados','Decisões que precisam ser tomadas','Próximos passos (semana seguinte)'] },
  { id:'tr', ic:'⚠️', t:'Matriz de Risco Técnico', c:D.pink,
    sb:'Para identificar e classificar riscos antes de implementar',
    sc:['Risco — O que pode dar errado?','Probabilidade — Alta / Média / Baixa','Impacto — Alto / Médio / Baixo','Severidade — Probabilidade × Impacto','Mitigação — Como reduzir?','Contingência — O que fazer se acontecer?','Responsável — Quem monitora?','Status — Aberto / Mitigado / Aceito / Encerrado'] },
  { id:'tc', ic:'🎯', t:'Apresentação para Cliente', c:D.sky,
    sb:'Estrutura para apresentar solução técnica a um cliente ou stakeholder',
    sc:['1. Problema — Qual dor o cliente tem?','2. Impacto — Quanto custa em tempo, dinheiro ou risco?','3. Solução proposta — O que vamos entregar?','4. Fluxo da solução — Como funciona do início ao fim?','5. Arquitetura inicial — Quais componentes existem?','6. Dados envolvidos — Entradas, saídas e armazenamentos?','7. Integrações — Com quais sistemas conversa?','8. Segurança — Como protegemos dados e acessos?','9. MVP/POC — Como validar com baixo risco?','10. Cronograma — Quais fases?','11. Esforço ou investimento — Quanto custa ou demanda?','12. Próximos passos — O que precisa ser decidido agora?'] },
];

// ── Helpers ─────────────────────────────────────────────────────────────────────
const mono = (color, size) => ({ fontFamily:"'JetBrains Mono',monospace", color: color||D.mid, fontSize: size||'10px', letterSpacing:'0.08em' });

function Label({ children, color }) {
  return <div style={{ ...mono(color||D.blue,'10px'), letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'8px' }}>{children}</div>;
}
function Card({ children, style }) {
  return <div style={{ background:D.card, border:`1px solid ${D.bd}`, borderRadius:'10px', padding:'14px', ...style }}>{children}</div>;
}
function Badge({ children, color }) {
  return <span style={{ display:'inline-block', ...mono(color,'11px'), background:`${color}18`, border:`1px solid ${color}35`, borderRadius:'4px', padding:'3px 8px', marginRight:'6px', marginBottom:'6px' }}>{children}</span>;
}

// ── Current-month resolver ───────────────────────────────────────────────────────
function getCurrentIdx(months = MONTHS) {
  if (!months.length) return -1;
  const t = new Date();
  const withYears = months.every((m) => Number.isInteger(m.y) && Number.isInteger(m.n));

  if (withYears) {
    const currentValue = t.getFullYear() * 12 + t.getMonth() + 1;
    const values = months.map((m) => m.y * 12 + m.n);
    if (currentValue < values[0]) return -1;
    if (currentValue > values[values.length - 1]) return months.length;
    return values.findIndex((value) => value === currentValue);
  }

  if (t.getFullYear() < 2026) return -1;
  if (t.getFullYear() > 2026) return months.length;
  const m = t.getMonth();
  if (m < 6) return -1;
  if (m > 11) return months.length;
  return m - 6;
}

// ── Month Rail (signature element) ───────────────────────────────────────────────
function MonthRail({ ci, months = MONTHS }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'4px 0 2px' }}>
      {months.map((m, i) => (
        <div key={`${m.s}-${m.y || i}`} style={{ display:'flex', alignItems:'center', flex:1 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
            {i < ci
              ? <div style={{ width:'11px', height:'11px', borderRadius:'50%', background:D.green, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:'7px', color:'#05100E', fontWeight:800 }}>✓</span></div>
              : i === ci
              ? <div className="rail-active" style={{ width:'11px', height:'11px', borderRadius:'50%', background:m.c }} />
              : <div style={{ width:'11px', height:'11px', borderRadius:'50%', border:`2px solid ${D.muted}` }} />}
            <span style={{ ...mono(i===ci?m.c:i<ci?D.green:D.muted,'9px'), marginTop:'3px' }}>{m.s}</span>
          </div>
          {i < months.length - 1 && <div style={{ height:'1px', background:i<ci?D.green:D.bd, flex:2, marginBottom:'12px' }} />}
        </div>
      ))}
    </div>
  );
}

// ── HOJE ──────────────────────────────────────────────────────────────────────────
function TodayTab({ ci, months = MONTHS, routine = ROUTINE }) {
  const today = new Date();
  const dayIdx = today.getDay();
  const r = routine[dayIdx] || ROUTINE[dayIdx];
  const cm = ci >= 0 && ci < months.length ? months[ci] : null;
  const DAY=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const MON=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const firstMonth = months[0];
  const startDate = firstMonth?.y && firstMonth?.n ? new Date(firstMonth.y, firstMonth.n - 1, 1) : null;
  const daysToStart = (ci === -1 && startDate && today < startDate) ? Math.ceil((startDate - today)/86400000) : 0;

  return (
    <div className="fade-up">
      <div style={{ marginBottom:'14px' }}>
        <span style={mono(D.muted,'11px')}>{DAY[dayIdx]}, {today.getDate()} de {MON[today.getMonth()]} de {today.getFullYear()}</span>
      </div>

      {daysToStart > 0 && (
        <div style={{ background:`${D.blue}12`, border:`1px solid ${D.blue}35`, borderRadius:'10px', padding:'14px', marginBottom:'14px' }}>
          <Label>Contagem regressiva</Label>
          <div style={{ ...mono(D.blue,'28px'), fontWeight:700 }}>{daysToStart} dias</div>
          <div style={{ fontSize:'12px', color:D.mid, marginTop:'4px' }}>O plano começa em 1º de {firstMonth.nm} de {firstMonth.y}.</div>
        </div>
      )}

      <div style={{ background:`${r.c}0D`, border:`1px solid ${r.c}35`, borderRadius:'10px', padding:'14px', marginBottom:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
          <div style={{ fontSize:'26px', lineHeight:1 }}>{r.ic}</div>
          <div>
            <span style={mono(r.c,'10px')}>HOJE · {r.d} DE FOCO</span>
            <div style={{ fontSize:'16px', fontWeight:700, color:D.tx, lineHeight:1.2 }}>{r.th}</div>
          </div>
        </div>
        {r.tk.map((task, i) => (
          <div key={i} style={{ display:'flex', gap:'8px', alignItems:'flex-start', marginBottom:i<r.tk.length-1?'8px':0 }}>
            <div style={{ width:'15px', height:'15px', borderRadius:'3px', border:`1.5px solid ${r.c}`, flexShrink:0, marginTop:'2px' }} />
            <span style={{ fontSize:'13px', color:D.tx, lineHeight:1.5 }}>{task}</span>
          </div>
        ))}
      </div>

      {cm ? (
        <Card style={{ marginBottom:'14px' }}>
          <Label color={cm.c}>FOCO DO MÊS — {cm.nm.toUpperCase()}</Label>
          <div style={{ fontSize:'14px', fontWeight:700, color:D.tx, marginBottom:'6px' }}>{cm.mt || 'Foco do mês ainda não definido'}</div>
          <div style={{ fontSize:'12px', color:D.mid, lineHeight:1.7, marginBottom:'12px' }}>{cm.ob || 'Use este mês para detalhar o próximo avanço do objetivo.'}</div>
          <div style={{ background:`${cm.c}12`, border:`1px solid ${cm.c}30`, borderRadius:'7px', padding:'11px' }}>
            <Label color={cm.c}>Entregável do mês</Label>
            <div style={{ fontSize:'12px', fontWeight:600, color:D.tx }}>{cm.ev || 'Nenhum entregável definido ainda.'}</div>
          </div>
        </Card>
      ) : daysToStart ? null : (
        <Card style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'13px', color:D.mid, textAlign:'center', padding:'8px 0', lineHeight:1.6 }}>
            {ci===months.length ? '🏆 Ciclo concluído. Hora de planejar a próxima fase.' : 'Este objetivo ainda não começou.'}
          </div>
        </Card>
      )}

      {cm && (
        <Card style={{ marginBottom:'14px' }}>
          <Label color={D.green}>INGLÊS DO MÊS — {cm.ig || 'prática livre'}</Label>
          {cm.fr.map((f, i) => (
            <div key={i} style={{ fontSize:'12px', color:D.mid, fontStyle:'italic', padding:'6px 0', borderBottom:i<cm.fr.length-1?`1px solid ${D.bd}`:'none', lineHeight:1.6 }}>"{f}"</div>
          ))}
        </Card>
      )}

      <div style={{ padding:'12px 14px', borderLeft:`3px solid ${D.blue}`, background:`${D.blue}07`, borderRadius:'0 6px 6px 0' }}>
        <div style={{ fontSize:'12px', color:D.mid, fontStyle:'italic', lineHeight:1.8 }}>
          "Eu não estou deixando de ser técnico. Estou ampliando minha atuação para transformar conhecimento técnico em solução, decisão e valor."
        </div>
      </div>
    </div>
  );
}

// ── ROTEIRO ─────────────────────────────────────────────────────────────────────
function RoteiroTab({ ci, months = MONTHS }) {
  const [exp, setExp] = useState(ci>=0 && ci<months.length ? ci : 0);
  return (
    <div className="fade-up">
      <div style={{ fontSize:'12px', color:D.mid, marginBottom:'14px', lineHeight:1.6 }}>Toque em um mês para ver plano, entregável, inglês e o post de LinkedIn.</div>
      {months.map((m, i) => {
        const isOpen = exp===i, isPast = i<ci, isCurr = i===ci;
        return (
          <div key={`${m.s}-${m.y || i}`} style={{ marginBottom:'8px' }}>
            <button onClick={() => setExp(isOpen?-1:i)} style={{ width:'100%', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'12px',
              background:isCurr?`${m.c}10`:isPast?`${D.green}07`:D.card, border:`1px solid ${isCurr?m.c+'55':isPast?D.green+'30':D.bd}`,
              borderRadius:isOpen?'10px 10px 0 0':'10px', padding:'12px 14px' }}>
              <span style={{ fontSize:'18px', lineHeight:1 }}>{isPast?'✅':m.ic}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:'7px', alignItems:'center', marginBottom:'2px' }}>
                  <span style={mono(isCurr?m.c:isPast?D.green:D.muted,'10px')}>{m.s}</span>
                  {isCurr && <span style={{ ...mono('#07101F','9px'), background:m.c, borderRadius:'3px', padding:'1px 5px', fontWeight:700 }}>ATUAL</span>}
                </div>
                <div style={{ fontSize:'13px', fontWeight:600, color:D.tx }}>{m.mt || `Mês ${i + 1}`}</div>
              </div>
              <span style={{ color:D.muted, fontSize:'10px' }}>{isOpen?'▲':'▼'}</span>
            </button>
            {isOpen && (
              <div style={{ background:D.surf, border:`1px solid ${D.bd}`, borderTop:'none', borderRadius:'0 0 10px 10px', padding:'14px' }}>
                <div style={{ fontSize:'12px', color:D.mid, lineHeight:1.7, marginBottom:'14px' }}>{m.ob || 'Foco ainda não definido para este mês.'}</div>
                <div style={{ marginBottom:'12px' }}>
                  <Label>Foco do mês</Label>
                  {m.fo.map((f,j) => <div key={j} style={{ fontSize:'12px', color:D.tx, padding:'4px 0 4px 10px', borderLeft:`2px solid ${m.c}`, marginBottom:'3px', lineHeight:1.5 }}>{f}</div>)}
                </div>
                <div style={{ marginBottom:'12px' }}>
                  <Label>Estudos</Label>
                  {m.es.map((e,j) => <div key={j} style={{ fontSize:'12px', color:D.mid, padding:'2px 0' }}>• {e}</div>)}
                </div>
                <div style={{ background:`${m.c}12`, border:`1px solid ${m.c}35`, borderRadius:'8px', padding:'11px', marginBottom:'12px' }}>
                  <Label color={m.c}>Entregável</Label>
                  <div style={{ fontSize:'13px', fontWeight:600, color:D.tx }}>{m.ev}</div>
                </div>
                <div style={{ marginBottom:'12px' }}>
                  <Label color={D.amber}>Tarefa técnica</Label>
                  <div style={{ fontSize:'12px', color:D.mid, lineHeight:1.7 }}>{m.ta}</div>
                </div>
                <div style={{ marginBottom:'12px' }}>
                  <Label color={D.green}>Inglês — {m.ig}</Label>
                  {m.fr.map((f,j) => <div key={j} style={{ fontSize:'11px', color:D.mid, fontStyle:'italic', padding:'3px 0', borderBottom:j<m.fr.length-1?`1px solid ${D.bd}`:'none', lineHeight:1.5 }}>"{f}"</div>)}
                </div>
                <div style={{ background:D.card, borderRadius:'7px', padding:'10px' }}>
                  <Label color={D.pink}>Post LinkedIn</Label>
                  <div style={{ fontSize:'12px', color:D.mid, fontStyle:'italic' }}>"{m.po}"</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── BÚSSOLA (skills + meta) ──────────────────────────────────────────────────────
function SkillsTab({ routine = ROUTINE, skills = SKILLS }) {
  return (
    <div className="fade-up">
      <Card style={{ marginBottom:'16px', background:'linear-gradient(135deg, rgba(76,135,242,0.10), rgba(157,127,234,0.10))', borderColor:'rgba(76,135,242,0.35)' }}>
        <Label>Onde quero chegar — 6 meses</Label>
        <div style={{ fontSize:'13px', color:D.tx, lineHeight:1.8 }}>
          Ser reconhecido como <strong style={{ color:D.blue }}>Analista de Projetos Pleno com raciocínio de arquitetura</strong>: levantar requisitos, analisar viabilidade técnica, desenhar soluções iniciais, documentar decisões, conduzir POCs e conversar com times técnicos e áreas de negócio.
        </div>
        <div style={{ marginTop:'10px', ...mono(D.purple,'11px') }}>→ Próxima fase: Arquiteto de Soluções</div>
      </Card>

      <Card style={{ marginBottom:'16px' }}>
        <Label>Cadeia de tradução do analista</Label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', alignItems:'center' }}>
          {['Negócio','Requisito','Fluxo','Solução','Risco','Decisão','Documentação'].map((item, i, arr) => (
            <div key={item} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ ...mono(D.tx,'11px'), background:D.surf, border:`1px solid ${D.bd}`, borderRadius:'4px', padding:'3px 7px' }}>{item}</span>
              {i<arr.length-1 && <span style={{ color:D.blue, fontSize:'12px', fontWeight:700 }}>→</span>}
            </div>
          ))}
        </div>
      </Card>

      {skills.map(sk => (
        <div key={sk.t} style={{ marginBottom:'14px' }}>
          <div style={{ display:'flex', gap:'8px', alignItems:'baseline', marginBottom:'8px' }}>
            <span style={mono(sk.c,'11px')}>{sk.t.toUpperCase()}</span>
            <span style={{ fontSize:'11px', color:D.muted }}>{sk.s}</span>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap' }}>{sk.it.map(item => <Badge key={item} color={sk.c}>{item}</Badge>)}</div>
        </div>
      ))}

      <Card style={{ marginTop:'4px' }}>
        <Label>Rotina semanal — 5 a 6h por semana</Label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          {routine.map(r => (
            <div key={r.day} style={{ background:D.surf, borderRadius:'7px', padding:'9px 10px', borderLeft:`3px solid ${r.c}` }}>
              <div style={{ fontSize:'12px', fontWeight:600, color:D.tx, marginBottom:'1px' }}>{r.ic} {r.nm}</div>
              <span style={mono(r.c,'10px')}>{r.th}</span>
              <div style={{ fontSize:'10px', color:D.muted, marginTop:'1px' }}>{r.d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'10px', textAlign:'center' }}>
          <span style={mono(D.green,'11px')}>5–6h/semana × 26 semanas = mudança de nível</span>
        </div>
      </Card>

      {/* Study sources */}
      <Card style={{ marginTop:'14px' }}>
        <Label color={D.amber}>Fontes de estudo</Label>
        {[
          { cat:'Arquitetura & Engenharia', c:D.blue, items:[
            { lb:'Full Cycle (YouTube)', det:'Arquitetura de software, microsserviços, DDD, Docker, Kubernetes, observabilidade.' },
            { lb:'Código Fonte TV (YouTube)', det:'Base conceitual, fundamentos, visão geral de tecnologias.' },
            { lb:'InfoQ', det:'Conteúdo sênior: arquitetura, platform engineering, case studies, IA aplicada.' },
          ]},
          { cat:'Cloud AWS', c:D.amber, items:[
            { lb:'AWS Cloud Practitioner Essentials', det:'Curso oficial: conceitos, serviços, segurança, preços e Well-Architected Framework.' },
            { lb:'AWS Architecture Center', det:'Arquiteturas de referência, diagramas e boas práticas.' },
            { lb:'AWS re:Invent (YouTube)', det:'Palestras técnicas de soluções reais em produção.' },
          ]},
          { cat:'Padrões e Referências', c:D.purple, items:[
            { lb:'martinfowler.com', det:'Microservices, trade-offs, padrões — base sólida para raciocínio de arquitetura.' },
            { lb:'c4model.com', det:'Site oficial do C4 Model de Simon Brown — aprenda os 4 diagramas.' },
            { lb:'arc42.org', det:'Template oficial de documentação arquitetural — independente de tecnologia.' },
          ]},
        ].map(group => (
          <div key={group.cat} style={{ marginBottom:'14px' }}>
            <div style={{ ...mono(group.c,'10px'), marginBottom:'6px' }}>{group.cat.toUpperCase()}</div>
            {group.items.map((item, j) => (
              <div key={j} style={{ marginBottom:'6px', paddingLeft:'8px', borderLeft:`2px solid ${group.c}40` }}>
                <div style={{ fontSize:'12px', fontWeight:600, color:D.tx }}>{item.lb}</div>
                <div style={{ fontSize:'11px', color:D.mid, marginTop:'2px', lineHeight:1.5 }}>{item.det}</div>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── ENTREGAS ─────────────────────────────────────────────────────────────────────
function EntregasTab({ checked, toggle, months = MONTHS, artifacts = ARTEFATOS }) {
  const total = artifacts.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;
  const ORDER = months.map(m => m.s);
  const byM = {}; artifacts.forEach(a => { (byM[a.m] = byM[a.m]||[]).push(a); });

  return (
    <div className="fade-up">
      <Card style={{ marginBottom:'18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
          <Label>Artefatos produzidos</Label>
          <span style={mono(D.green,'14px')}>{done}/{total}</span>
        </div>
        <div style={{ height:'5px', background:D.bd, borderRadius:'3px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${D.blue}, ${D.green})`, borderRadius:'3px', transition:'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize:'11px', color:D.muted, marginTop:'5px' }}>{pct}% concluído · "Todo estudo precisa virar artefato"</div>
      </Card>

      {ORDER.map(mk => {
        if (!byM[mk]) return null;
        const md = months.find(m => m.s===mk);
        return (
          <div key={mk} style={{ marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
              <span style={{ fontSize:'14px' }}>{md.ic}</span>
              <span style={mono(md.c,'10px')}>{mk}</span>
            </div>
            {byM[mk].map(a => {
              const on = !!checked[a.id];
              return (
                <button key={a.id} onClick={() => toggle(a.id)} style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%',
                  background:on?`${D.green}08`:D.card, border:`1px solid ${on?D.green+'35':D.bd}`, borderRadius:'8px', padding:'10px 12px', cursor:'pointer', textAlign:'left', marginBottom:'6px' }}>
                  <div style={{ width:'17px', height:'17px', borderRadius:'4px', flexShrink:0, background:on?D.green:'transparent', border:`2px solid ${on?D.green:md.c}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                    {on && <span style={{ color:'#05100E', fontSize:'10px', fontWeight:800 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:'13px', color:on?D.muted:D.tx, textDecoration:on?'line-through':'none', lineHeight:1.4 }}>{a.lb}</span>
                </button>
              );
            })}
          </div>
        );
      })}

      <Card>
        <Label color={D.amber}>Checklist de fim de mês</Label>
        {['Qual problema técnico entendi melhor?','Qual artefato produzi?','Qual decisão técnica documentei?','Qual conteúdo publiquei no LinkedIn?','Qual conversa profissional importante tive?','O que consegui explicar em inglês?','O que aprendi de AWS?','O que mantive vivo da base técnica?','Que feedback recebi?','Qual será meu foco do próximo mês?'].map((q, i) => (
          <div key={i} style={{ display:'flex', gap:'10px', padding:'7px 0', borderBottom:i<9?`1px solid ${D.bd}`:'none', alignItems:'flex-start' }}>
            <span style={mono(D.amber,'10px')}>{String(i+1).padStart(2,'0')}</span>
            <span style={{ fontSize:'12px', color:D.mid, lineHeight:1.5 }}>{q}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── TEMPLATES ────────────────────────────────────────────────────────────────────
function TemplatesTab({ templates = TEMPLATES }) {
  const [open, setOpen] = useState(templates[0]?.id || '');
  return (
    <div className="fade-up">
      <div style={{ fontSize:'12px', color:D.mid, marginBottom:'14px', lineHeight:1.6 }}>
        Estruturas prontas para usar quando começar um projeto novo. Toque para abrir e seguir cada seção como roteiro.
      </div>
      {templates.map(tp => {
        const isOpen = open===tp.id;
        return (
          <div key={tp.id} style={{ marginBottom:'8px' }}>
            <button onClick={() => setOpen(isOpen?'':tp.id)} style={{ width:'100%', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'12px',
              background:isOpen?`${tp.c}10`:D.card, border:`1px solid ${isOpen?tp.c+'45':D.bd}`, borderRadius:isOpen?'10px 10px 0 0':'10px', padding:'12px 14px' }}>
              <span style={{ fontSize:'18px' }}>{tp.ic}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:D.tx }}>{tp.t}</div>
                <div style={{ fontSize:'11px', color:D.muted, marginTop:'1px' }}>{tp.sb}</div>
              </div>
              <span style={{ color:D.muted, fontSize:'10px' }}>{isOpen?'▲':'▼'}</span>
            </button>
            {isOpen && (
              <div style={{ background:D.surf, border:`1px solid ${D.bd}`, borderTop:'none', borderRadius:'0 0 10px 10px', padding:'8px 14px 14px' }}>
                {tp.sc.map((s, i) => (
                  <div key={i} style={{ display:'flex', gap:'9px', padding:'7px 0', borderBottom:i<tp.sc.length-1?`1px solid ${D.bd}`:'none' }}>
                    <span style={{ ...mono(tp.c,'10px'), flexShrink:0, marginTop:'2px' }}>{String(i+1).padStart(2,'0')}</span>
                    <span style={{ fontSize:'12px', color:D.tx, lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Card style={{ marginTop:'8px' }}>
        <Label color={D.sky}>Pitch profissional em inglês</Label>
        <div style={{ fontSize:'12px', color:D.mid, fontStyle:'italic', lineHeight:1.9 }}>
          "Hi, I'm Felipe. I'm a Project Analyst from Brazil with a background in software engineering, data science and economics. I work with requirements, technical analysis, documentation and digital solutions. I have experience with APIs, data pipelines, AI, RAG systems and backend development. My goal is to become a Solution Architect, connecting business problems with technical solutions."
        </div>
      </Card>
    </div>
  );
}

// ── Storage helpers ──────────────────────────────────────────────────────────────
const hasStore = () => typeof window !== 'undefined' && window.storage;
async function storeGet(key) {
  if (!hasStore()) return null;
  try { const r = await window.storage.get(key, false); return r ? r.value : null; }
  catch { return null; }
}
async function storeSet(key, value) {
  if (!hasStore()) return false;
  try { const r = await window.storage.set(key, value, false); return !!r; }
  catch { return false; }
}
async function storeList(prefix) {
  if (!hasStore()) return [];
  try { const r = await window.storage.list(prefix, false); return r ? r.keys : []; }
  catch { return []; }
}
async function storeDel(key) {
  if (!hasStore()) return;
  try { await window.storage.delete(key, false); } catch {}
}
function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function prettyDate(iso) {
  const [y,m,d] = iso.split('-').map(Number);
  const MON = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const DAY = ['dom','seg','ter','qua','qui','sex','sáb'];
  const dt = new Date(y, m-1, d);
  return `${DAY[dt.getDay()]}, ${d} ${MON[m-1]} ${y}`;
}

// ── DIÁRIO ───────────────────────────────────────────────────────────────────────
function DiarioTab({ routine = ROUTINE }) {
  const [sel, setSel] = useState(() => isoDate(new Date()));
  const [text, setText] = useState('');
  const [entries, setEntries] = useState({});   // iso -> {text, updatedAt}
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle'); // idle | saving | saved
  const dayTheme = routine[new Date(sel + 'T00:00:00').getDay()] || ROUTINE[new Date(sel + 'T00:00:00').getDay()];
  const todayIso = isoDate(new Date());

  // Load all entries on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      const keys = await storeList('journal:');
      const map = {};
      for (const k of keys) {
        const v = await storeGet(k);
        if (v) { try { map[k.replace('journal:', '')] = JSON.parse(v); } catch {} }
      }
      if (alive) { setEntries(map); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  // When selected date changes, load its text into the editor
  useEffect(() => { setText(entries[sel]?.text || ''); setStatus('idle'); }, [sel, entries]);

  const save = useCallback(async () => {
    setStatus('saving');
    if (!text.trim()) {
      // Empty → delete the entry entirely
      await storeDel(`journal:${sel}`);
      setEntries(p => { const n = {...p}; delete n[sel]; return n; });
      setStatus('idle');
      return;
    }
    const payload = { text, updatedAt: new Date().toISOString() };
    const ok = await storeSet(`journal:${sel}`, JSON.stringify(payload));
    if (ok || !hasStore()) {
      setEntries(p => ({ ...p, [sel]: payload }));
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1800);
    } else {
      setStatus('idle');
    }
  }, [text, sel]);

  const shiftDay = (delta) => {
    const dt = new Date(sel + 'T00:00:00');
    dt.setDate(dt.getDate() + delta);
    if (dt > new Date()) return; // no future
    setSel(isoDate(dt));
  };

  const pastList = Object.keys(entries).sort().reverse();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="fade-up">
      {!hasStore() && (
        <div style={{ background:`${D.amber}12`, border:`1px solid ${D.amber}35`, borderRadius:'8px', padding:'10px 12px', marginBottom:'14px' }}>
          <span style={{ fontSize:'11px', color:D.amber }}>⚠ Armazenamento indisponível neste preview — as anotações não vão persistir aqui.</span>
        </div>
      )}

      {/* Date nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <button onClick={() => shiftDay(-1)} aria-label="Dia anterior" style={{ cursor:'pointer', background:D.card, border:`1px solid ${D.bd}`, borderRadius:'8px', color:D.mid, width:'34px', height:'34px', fontSize:'14px' }}>‹</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'14px', fontWeight:700, color:D.tx }}>{prettyDate(sel)}{sel===todayIso && <span style={{ ...mono(D.green,'10px'), marginLeft:'7px' }}>HOJE</span>}</div>
          <span style={mono(dayTheme.c,'10px')}>{dayTheme.ic} {dayTheme.th}</span>
        </div>
        <button onClick={() => shiftDay(1)} disabled={sel===todayIso} aria-label="Próximo dia" style={{ cursor:sel===todayIso?'default':'pointer', background:D.card, border:`1px solid ${D.bd}`, borderRadius:'8px', color:sel===todayIso?D.muted:D.mid, width:'34px', height:'34px', fontSize:'14px', opacity:sel===todayIso?0.4:1 }}>›</button>
      </div>

      {/* Editor */}
      <Card style={{ marginBottom:'14px', padding:'0', overflow:'hidden' }}>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setStatus('idle'); }}
          placeholder={`O que avancei hoje? O que estudei, qual artefato evoluiu, qual o próximo passo?\n\nDica do dia (${dayTheme.th}): ${dayTheme.tk[0]}.`}
          style={{ width:'100%', minHeight:'150px', resize:'vertical', background:'transparent', border:'none', outline:'none', color:D.tx, fontSize:'13px', lineHeight:1.7, fontFamily:"'Inter',sans-serif", padding:'14px' }}
        />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderTop:`1px solid ${D.bd}`, background:D.surf }}>
          <span style={mono(D.muted,'10px')}>{wordCount} palavra{wordCount===1?'':'s'}{status==='saved' && <span style={{ color:D.green, marginLeft:'8px' }}>✓ salvo</span>}</span>
          <button onClick={save} disabled={status==='saving'} style={{ cursor:'pointer', background:status==='saving'?D.muted:D.blue, border:'none', borderRadius:'7px', color:'#fff', padding:'7px 16px', fontSize:'12px', fontWeight:600, fontFamily:"'Inter',sans-serif" }}>
            {status==='saving'?'Salvando…':'Salvar'}
          </button>
        </div>
      </Card>

      {/* Past entries */}
      <Label color={D.purple}>Anotações anteriores {pastList.length>0 && `(${pastList.length})`}</Label>
      {loading ? (
        <div style={{ fontSize:'12px', color:D.muted, padding:'10px 0' }}>Carregando…</div>
      ) : pastList.length === 0 ? (
        <div style={{ fontSize:'12px', color:D.muted, padding:'10px 0', lineHeight:1.6 }}>Nenhuma anotação ainda. Escreva a primeira acima — duas linhas já valem.</div>
      ) : (
        pastList.map(iso => (
          <button key={iso} onClick={() => setSel(iso)} style={{ display:'block', width:'100%', textAlign:'left', cursor:'pointer',
            background:iso===sel?`${D.purple}10`:D.card, border:`1px solid ${iso===sel?D.purple+'45':D.bd}`, borderRadius:'8px', padding:'10px 12px', marginBottom:'6px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'3px' }}>
              <span style={mono(D.purple,'10px')}>{prettyDate(iso)}</span>
              {iso===todayIso && <span style={mono(D.green,'9px')}>HOJE</span>}
            </div>
            <div style={{ fontSize:'12px', color:D.mid, lineHeight:1.5, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
              {entries[iso]?.text}
            </div>
          </button>
        ))
      )}
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────────────────
export default function CareerDashboard({ goal }) {
  const data = goal ? goalToDashboardData(goal) : null;

  if (!data || data.months.length === 0) {
    return <EmptyGoalDashboard goal={goal} />;
  }

  return <CareerDashboardContent goal={goal} data={data} />;
}

function CareerDashboardContent({ goal, data }) {
  const { months, routine, skills, artifacts, templates } = data;
  const ci = getCurrentIdx(months);
  const [tab, setTab] = useState('hoje');
  const [checked, setChecked] = useState({});
  const [loadedChecks, setLoadedChecks] = useState(false);
  const checkedKey = `artefatos-checked:${goal._id || goal.id || goal.title}`;

  // Load persisted checkboxes
  useEffect(() => {
    (async () => {
      const v = await storeGet(checkedKey);
      if (v) { try { setChecked(JSON.parse(v)); } catch {} }
      setLoadedChecks(true);
    })();
  }, [checkedKey]);

  // Persist checkboxes whenever they change (after initial load)
  useEffect(() => {
    if (loadedChecks) storeSet(checkedKey, JSON.stringify(checked));
  }, [checked, loadedChecks, checkedKey]);

  const toggle = (id) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const TABS = [
    { id:'hoje', lb:'Hoje', ic:'◉' },
    { id:'roteiro', lb:'Roteiro', ic:'▤' },
    { id:'bussola', lb:'Bússola', ic:'✦' },
    { id:'entregas', lb:'Entregas', ic:'✓' },
    { id:'diario', lb:'Diário', ic:'✎' },
    { id:'templates', lb:'Templates', ic:'⌘' },
  ];

  return (
    <div className="cd-root" style={{ background:D.bg, minHeight:'100vh', color:D.tx }}>
      <Styles />
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'18px 16px 90px' }}>

        {/* Header */}
        <div style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:D.green }} />
            <span style={mono(D.green,'10px')}>MISSION CONTROL</span>
          </div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:D.tx, lineHeight:1.15, letterSpacing:'-0.01em' }}>
            {goal.title}
          </h1>
          <div style={{ fontSize:'12px', color:D.mid, marginTop:'3px' }}>{goal.description || 'Objetivo ativo'}</div>
        </div>

        {/* Month rail */}
        <Card style={{ marginBottom:'18px', padding:'12px 14px' }}>
          <MonthRail ci={ci} months={months} />
        </Card>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:'4px', marginBottom:'18px', background:D.surf, padding:'4px', borderRadius:'10px', border:`1px solid ${D.bd}` }}>
          {TABS.map(t => {
            const on = tab===t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, cursor:'pointer', border:'none', borderRadius:'7px',
                background:on?D.blue:'transparent', padding:'8px 2px', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px', transition:'background 0.15s' }}>
                <span style={{ fontSize:'13px', color:on?'#fff':D.mid }}>{t.ic}</span>
                <span style={{ ...mono(on?'#fff':D.mid,'9px'), fontWeight:on?700:400 }}>{t.lb}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {tab==='hoje' && <TodayTab ci={ci} months={months} routine={routine} />}
        {tab==='roteiro' && <RoteiroTab ci={ci} months={months} />}
        {tab==='bussola' && <SkillsTab routine={routine} skills={skills} />}
        {tab==='entregas' && <EntregasTab checked={checked} toggle={toggle} months={months} artifacts={artifacts} />}
        {tab==='diario' && <DiarioTab routine={routine} />}
        {tab==='templates' && <TemplatesTab templates={templates} />}

      </div>
    </div>
  );
}

function goalToDashboardData(goal) {
  const months = (goal.months || []).map((m, index) => ({
    n: m.n ?? m.month,
    y: m.y ?? m.year,
    s: m.s ?? m.shortName,
    nm: m.nm ?? m.name,
    ic: m.ic ?? m.icon ?? '🎯',
    c: m.c ?? m.color ?? D.blue,
    mt: m.mt ?? m.theme ?? `Mês ${index + 1}`,
    ob: m.ob ?? m.objective ?? '',
    fo: m.fo ?? m.focus ?? [],
    es: m.es ?? m.studies ?? [],
    ev: m.ev ?? m.deliverable ?? '',
    ta: m.ta ?? m.technicalTask ?? '',
    ig: m.ig ?? m.englishGoal ?? '',
    fr: m.fr ?? m.phrases ?? [],
    po: m.po ?? m.postIdea ?? '',
  }));

  return {
    months,
    routine: goal.routines?.length ? goal.routines : ROUTINE,
    skills: goal.skills?.length ? goal.skills : SKILLS,
    artifacts: goal.artifacts?.length ? goal.artifacts : [],
    templates: goal.templates?.length ? goal.templates : TEMPLATES,
  };
}

function EmptyGoalDashboard({ goal }) {
  return (
    <div className="cd-root" style={{ background:D.bg, minHeight:'100vh', color:D.tx }}>
      <Styles />
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'42px 16px 90px' }}>
        <Card>
          <Label color={D.green}>{goal ? 'Objetivo sem roteiro' : 'Nenhum objetivo selecionado'}</Label>
          <div style={{ fontSize:'18px', fontWeight:700, marginBottom:'8px' }}>{goal?.title || 'Cadastre ou importe um objetivo para começar.'}</div>
          <div style={{ fontSize:'13px', color:D.mid, lineHeight:1.7 }}>
            {goal
              ? 'Este objetivo ja esta cadastrado, mas ainda nao tem roteiro, entregas e templates preenchidos.'
              : 'O diario usa a mesma estrutura de trilha, entregas, rotina e templates para qualquer pessoa. O conteudo aparece aqui somente depois de virar objetivo cadastrado.'}
          </div>
        </Card>
      </div>
    </div>
  );
}
