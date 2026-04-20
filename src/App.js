import React, { useState, useRef, useEffect } from "react";

const LEVELS = [
  { name: "Aldeano", min: 0, icon: "🧑‍🌾" },
  { name: "Aprendiz", min: 50, icon: "📚" },
  { name: "Guerrero", min: 150, icon: "⚔️" },
  { name: "Caballero", min: 350, icon: "🛡️" },
  { name: "Campeón", min: 700, icon: "🏅" },
  { name: "Leyenda", min: 1200, icon: "👑" },
  { name: "Héroe Eterno", min: 2000, icon: "🌟" },
];

const getLevel = (xp) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) lvl = l; }
  return lvl;
};

export default function TaskQuest() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem("tq_xp")) || 0);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tq_tasks")) || []);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("misiones");
  const fileRef = useRef();

  useEffect(() => {
    localStorage.setItem("tq_xp", xp);
    localStorage.setItem("tq_tasks", JSON.stringify(tasks));
  }, [xp, tasks]);

  const analyzeTaskWithGemini = async (input, isImage = false, imageData = null) => {
    const API_KEY = process.env.REACT_APP_GEMINI_KEY; 
    if (!API_KEY) {
       alert("Falta la API Key en Vercel");
       return null;
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const systemPrompt = `Eres el asistente de TaskQuest RPG. Analiza la tarea y responde SOLO JSON: {"task": "nombre", "description": "frase épica", "xp": número}`;
    
    let contents = [{ parts: [{ text: `${systemPrompt}. Tarea: ${input}` }] }];
    if (isImage && imageData) {
      contents = [{ parts: [{ text: systemPrompt }, { inline_data: { mime_type: imageData.type, data: imageData.data } }] }];
    }

    try {
      const res = await fetch(url, { method: "POST", body: JSON.stringify({ contents }) });
      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) { 
      console.error(err);
      return { task: input || "Misión Desconocida", description: "El oráculo está nublado, pero la misión sigue.", xp: 10 }; 
    }
  };

  const handleAddTask = async (val, isImg = false, imgData = null) => {
    setLoading(true);
    const result = await analyzeTaskWithGemini(val, isImg, imgData);
    if (result) {
      setTasks([...tasks, { id: Date.now(), ...result, done: false }]);
      if(tab !== "misiones") setTab("misiones");
    }
    setLoading(false);
  };

  const curLevel = getLevel(xp);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0c29", color: "#fff", fontFamily: "sans-serif", textAlign: 'center' }}>
      <header style={{ padding: "20px", borderBottom: "1px solid #302b63" }}>
        <h1 style={{ fontSize: "1.5rem" }}>{curLevel.icon} GanaTuDía</h1>
        <p style={{ color: "#888" }}>{curLevel.name} | <span style={{ color: "#ffd700" }}>{xp} XP</span></p>
      </header>

      <nav style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
        <button onClick={() => setTab("misiones")} style={{ padding: "10px 20px", borderRadius: "20px", border: tab === "misiones" ? "2px solid #ffd700" : "none" }}>Misiones</button>
        <button onClick={() => setTab("agregar")} style={{ padding: "10px 20px", borderRadius: "20px", border: tab === "agregar" ? "2px solid #ffd700" : "none" }}>+ Nueva</button>
      </nav>

      <main style={{ padding: "10px", maxWidth: "500px", margin: "0 auto" }}>
        {tab === "misiones" && (
          tasks.length > 0 ? (
            tasks.map(t => (
              <div key={t.id} style={{ background: "linear-gradient(145deg, #1a1a3a, #23234e)", margin: "10px 0", padding: "15px", borderRadius: "15px", borderLeft: "4px solid #ffd700" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{t.task}</h3>
                <p style={{ fontSize: "0.9rem", color: "#ccc" }}>{t.description}</p>
                <button 
                  onClick={() => { setXp(xp + t.xp); setTasks(tasks.filter(x => x.id !== t.id)); }}
                  style={{ marginTop: "10px", background: "#ffd700", color: "#000", border: "none", padding: "8px 15px", borderRadius: "10px", fontWeight: "bold" }}
                >
                  Completar (+{t.xp} XP)
                </button>
              </div>
            ))
          ) : <p>No hay misiones activas. ¡Descansa, guerrera!</p>
        )}

        {tab === "agregar" && (
          <div style={{ background: "#1a1a3a", padding: "20px", borderRadius: "15px" }}>
            <input id="taskInput" placeholder="¿Qué harás hoy?" style={{ padding: "12px", width: "100%", borderRadius: "10px", border: "none", marginBottom: "10px", boxSizing: "border-box" }} />
            <button onClick={() => {
              const val = document.getElementById('taskInput').value;
              if(val) handleAddTask(val);
            }} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#302b63", color: "#fff", border: "none", marginBottom: "20px" }}>Crear Misión</button>
            
            <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
              <button onClick={() => fileRef.current.click()} style={{ background: "none", color: "#ffd700", border: "1px solid #ffd700", padding: "10px", borderRadius: "10px", cursor: "pointer" }}>📸 Usar Visión IA</button>
              <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => handleAddTask("", true, { type: file.type, data: reader.result.split(",")[1] });
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
          </div>
        )}
      </main>
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <p>🔮 Invocando al oráculo Gemini...</p>
        </div>
      )}
    </div>
  );
}
