export default function Header({ curLevel, nextLevel, xp, progress }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 20px",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                background: "linear-gradient(90deg, #a78bfa, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🏆 GanaTuDía
            </h1>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Tu aventura de productividad
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28 }}>{curLevel.icon}</div>
            <div style={{ fontWeight: 700, color: "#a78bfa", fontSize: 13 }}>
              {curLevel.name}
            </div>
            <div style={{ fontSize: 13, color: "#f472b6", fontWeight: 700 }}>
              {xp} XP
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#94a3b8",
              marginBottom: 4,
            }}
          >
            <span>{curLevel.name}</span>
            <span>{nextLevel ? `${nextLevel.name} (${nextLevel.min} XP)` : "¡Máximo nivel!"}</span>
          </div>

          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8 }}>
            <div
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #f472b6)",
                borderRadius: 99,
                height: "100%",
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
