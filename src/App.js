import React, { useState, useRef, useEffect } from "react";

// --- CONFIGURACIÓN RPG ---
const LEVELS = [
  { name: "Aldeano", min: 0, icon: "🧑‍🌾" },
  { name: "Aprendiz", min: 50, icon: "📚" },
  { name: "Guerrero", min: 150, icon: "⚔️" },
  { name: "Caballero", min: 350, icon: "🛡️" },
  { name: "Campeón", min: 700, icon: "🏅" },
  { name: "Leyenda", min: 1200, icon: "👑" },
  { name: "Héroe Eterno", min: 2000, icon: "🌟" },
];

const TASK_EMOJIS = ["⚔️","🛡️","🏹","🔥","💎","🌿","🧪","🗡️","🏺","📜"];

// --- LÓGICA DE APOYO ---
const getLevel = (xp) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) lvl = l; }
  return lvl;
};
const getNextLevel = (xp) => {
  for (const l of LEVELS) { if (xp < l.min) return l; }
  return null;
};
const xpProgress = (xp) => {
  const cur = getLevel(xp), next = getNextLevel(xp);
  if (!next) return 100;
  return Math.round(((xp - cur.min) / (next.min - cur.min)) * 100);
};

export default function TaskQuest() {
  // PERSISTENCIA: Cargar datos de LocalStorage
  const [xp, setXp] = useState(() => Number(localStorage.getItem("tq_xp")) || 0);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tq_tasks")) || []);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("tq_completed")) || []);
  
  const [tab, setTab] = useState("misiones");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [manualInput, setManualInput] = useState("");
  const fileRef = useRef();

  // Guardar automáticamente cada vez que algo cambie
  useEffect(() => {
    localStorage.setItem("tq_xp", xp);
    localStorage.setItem("tq_tasks", JSON.stringify(tasks));
    localStorage.setItem("tq_completed", JSON.stringify(completed));
  }, [xp, tasks, completed]);

  const showToast = (msg, color = "#7c3aed") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // LLAMADA A GEMINI
  const analyzeTaskWithGemini = async (input, isImage = false, imageData = null) => {
    const API_KEY = "TU_GEMINI_API_KEY"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const systemPrompt = `Eres el asistente de TaskQuest RPG. Analiza la tarea y responde SOLO JSON: {"task": "nombre corto", "description": "frase épica", "xp": número entre 5 y 100}`;

    let contents = [{ parts: [{ text: `${systemPrompt}. Tarea: ${input}` }] }];
    
    if (isImage && imageData) {
      contents = [{ parts: [
        { text: systemPrompt + " Analiza esta imagen y crea la misión." },
        { inline_data: { mime_type: imageData.type, data: imageData.data } }
      ]}];
    }

    try {
      const res = await fetch(url, { method: "POST", body: JSON.stringify({ contents }) });
      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      return JSON.parse(rawText.replace(/```json|```/g, ""));
    } catch { return null; }
  };

  const handleAddTask = async (val, isImg = false, imgData = null) => {
    setLoading(true);
    const result = await analyzeTaskWithGemini(val, isImg, imgData);
    if (result) {
      setTasks([...tasks, { id: Date.now(), ...result, emoji: TASK_EMOJIS[Math.floor(Math.random()*10)], done: false }]);
      showToast("Misión añadida al registro");
    } else {
      showToast("Error del oráculo", "#ef4444");
    }
    setLoading(false);
  };

  const finishTask = (id, taskXp) => {
    const task = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setCompleted([{ ...task, completedAt: new Date().toLocaleDateString() }, ...completed]);
    setXp(xp + taskXp);
    showToast(`¡Victoria! +${taskXp} XP`, "#10b981");
  };

  const curLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0c29", color: "#fff", fontFamily: "sans-serif", paddingBottom: "50px" }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, width: "90%", left: "5%", background: toast.color, padding: "15px", borderRadius: "10px", textAlign: "center", zIndex: 100 }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER RPG */}
      <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", textAlign: "center", borderBottom: "1px solid #302b63" }}>
        <h2 style={{ margin: 0, background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GanaTuDía</h2>
        <div style={{ fontSize: "40px", margin: "10px 0" }}>{curLevel.icon}</div>
        <div style={{ fontWeight: "bold" }}>{curLevel.name}</div>
        <div style={{ fontSize: "14px", color: "#aaa" }}>{xp} XP Totales</div>
        
        {/* PROGRESS BAR */}
        <div style={{ width: "80%", height: "10px", background: "#24243e", borderRadius: "10px", margin: "10px auto", overflow: "hidden" }}>
          <div style={{ width: `${xpProgress(xp)}%`, height: "100%", background: "#7c3aed", transition: "0.5s" }}></div>
        </div>
        <div style={{ fontSize: "11px" }}>Próximo nivel: {nextLevel?.name}</div>
      </div>

      {/* TABS NAVEGACIÓN */}
      <div style={{ display: "flex", justifyContent: "space-around", padding: "15px" }}>
        <button onClick={() => setTab("misiones")} style={{ background: tab==="misiones"?"#7c3aed":"transparent", color: "#fff", border: "1px solid #7c3aed", borderRadius: "20px", padding: "5px 15px" }}>Misiones</button>
        <button onClick={() => setTab("agregar")} style={{ background: tab==="agregar"?"#7c3aed":"transparent", color: "#fff", border: "1px solid #7c3aed", borderRadius: "20px", padding: "5px 15px" }}>+</button>
        <button onClick={() => setTab("logros")} style={{ background: tab==="logros"?"#7c3aed":"transparent", color: "#fff", border: "1px solid #7c3aed", borderRadius: "20px", padding: "5px 15px" }}>Logros</button>
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: "15px" }}>
        {tab === "misiones" && tasks.map(t => (
          <div key={t.id} style={{ background: "#1a1a3a", padding: "15px", borderRadius: "15px", marginBottom: "10px", border: "1px solid #302b63" }}>
            <div style={{ fontWeight: "bold" }}>{t.emoji} {t.task}</div>
            <div style={{ fontSize: "12px", color: "#aaa", margin: "5px 0" }}>{t.description}</div>
            <button onClick={() => finishTask(t.id, t.xp)} style={{ width: "100%", background: "#10b981", border: "none", color: "#fff", padding: "8px", borderRadius: "8px", fontWeight: "bold" }}>
              Completar (+{t.xp} XP)
            </button>
          </div>
        ))}

        {tab === "agregar" && (
          <div style={{ textAlign: "center" }}>
            <input 
              value={manualInput} 
              onChange={e => setManualInput(e.target.value)}
              placeholder="¿Qué aventura toca hoy?" 
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#1a1a3a", color: "#fff" }}
            />
            <button 
              onClick={() => { handleAddTask(manualInput); setManualInput(""); }}
              disabled={loading}
              style={{ width: "100%", marginTop: "10px", padding: "12px", borderRadius: "10px", background: "#7c3aed", color: "#fff", border: "none", fontWeight: "bold" }}
            >
              {loading ? "Invocando misión..." : "Crear Misión"}
            </button>
            <div style={{ margin: "20px 0", color: "#aaa" }}>ó</div>
            <button 
              onClick={() => fileRef.current.click()}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#0ea5e9", color: "#fff", border: "none", fontWeight: "bold" }}
            >
              📸 Usar Cámara (IA)
            </button>
            <input type="file" ref={fileRef} hidden onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onloadend = () => handleAddTask("", true, { type: file.type, data: reader.result.split(",")[1] });
              reader.readAsDataURL(file);
            }} />
          </div>
        )}

        {tab === "logros" && completed.map(t => (
          <div key={t.id} style={{ padding: "10px", borderBottom: "1px solid #333", opacity: 0.7 }}>
            <span>✅ {t.task}</span>
            <span style={{ float: "right", color: "#10b981" }}>+{t.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
