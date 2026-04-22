export default function CompletedPanel({ completed }) {
  if (completed.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
        <div style={{ fontSize: 48 }}>📜</div>
        <div style={{ marginTop: 8 }}>
          Aún no has completado misiones.
          <br />
          ¡A la batalla!
        </div>
      </div>
    );
  }

  return (
    <div>
      {[...completed].reverse().map((task) => (
        <div
          key={`${task.id}-${task.completedAt}`}
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>
                {task.emoji} {task.task}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {task.completedAt}
              </div>
            </div>

            <div style={{ color: "#10b981", fontWeight: 700 }}>+{task.xp} XP</div>
          </div>
        </div>
      ))}
    </div>
  );
}
