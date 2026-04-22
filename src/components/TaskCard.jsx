export default function TaskCard({ task, onComplete, onDelete }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(167,139,250,0.3)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {task.emoji} {task.task}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            {task.description}
          </div>
        </div>

        <div style={{ marginLeft: 12, textAlign: "center" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #f472b6)",
              borderRadius: 99,
              padding: "4px 10px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            +{task.xp} XP
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onComplete(task.id)}
          style={{
            flex: 1,
            padding: 10,
            background: "linear-gradient(90deg, #059669, #10b981)",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ✅ Completar
        </button>

        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: "10px 14px",
            background: "rgba(239,68,68,0.2)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 10,
            color: "#f87171",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
