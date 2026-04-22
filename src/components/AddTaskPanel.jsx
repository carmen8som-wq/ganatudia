import { useRef, useState } from "react";

export default function AddTaskPanel({ addTask, loading, showToast }) {
  const [manualInput, setManualInput] = useState("");
  const fileRef = useRef();

  const submitTask = () => {
    if (!manualInput.trim()) return;
    addTask(manualInput);
    setManualInput("");
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      showToast("Tu navegador no soporta voz 😢", "#ef4444");
      return;
    }

    const recognition = new SR();
    recognition.lang = "es-CL";

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      showToast(`🎤 Escuché: "${text}"`);
      addTask(text);
    };

    recognition.onerror = () => {
      showToast("Error de micrófono", "#ef4444");
    };

    recognition.start();
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addTask(`Revisar imagen: ${file.name}`);
    e.target.value = "";
  };

  return (
    <div>
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: "0 0 16px", color: "#a78bfa" }}>🎤 Por Voz</h3>
        <button
          onClick={startVoice}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          🎙️ Hablar misión
        </button>
        <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 8 }}>
          Ejemplo: lavar la loza, estudiar, ordenar la pieza
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: "0 0 16px", color: "#a78bfa" }}>📸 Por Imagen</h3>
        <button
          onClick={() => fileRef.current.click()}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #0369a1, #0ea5e9)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          📷 Subir foto
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImage}
        />
        <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 8 }}>
          Por ahora crea una misión simple con el nombre de la imagen
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h3 style={{ margin: "0 0 16px", color: "#a78bfa" }}>⌨️ Por Texto</h3>

        <input
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Escribe tu tarea..."
          onKeyDown={(e) => {
            if (e.key === "Enter") submitTask();
          }}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid rgba(167,139,250,0.4)",
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={submitTask}
          disabled={loading || !manualInput.trim()}
          style={{
            marginTop: 10,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #7c3aed, #f472b6)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {loading ? "⏳ Creando misión..." : "➕ Crear Misión"}
        </button>
      </div>
    </div>
  );
}
