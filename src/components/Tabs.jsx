const tabItems = [
  ["misiones", "⚔️ Misiones"],
  ["agregar", "➕ Nueva"],
  ["completadas", "✅ Logros"],
  ["canjear", "💰 Canjear"],
];

export default function Tabs({ tab, setTab }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "12px 0", overflowX: "auto" }}>
      {tabItems.map(([id, label]) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          style={{
            padding: "8px 16px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            whiteSpace: "nowrap",
            background: tab === id
              ? "linear-gradient(90deg, #7c3aed, #f472b6)"
              : "rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
