export default function RedeemPanel({ xp, redeemAmt, setRedeemAmt, onRedeem }) {
  return (
    <div>
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(167,139,250,0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 36 }}>💎</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#f472b6" }}>{xp} XP</div>
        <div style={{ color: "#94a3b8", fontSize: 13 }}>disponibles para canjear</div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: "0 0 8px", color: "#f59e0b" }}>💰 Convertir en Pesos</h3>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
          1 XP = $100 pesos chilenos
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="number"
            min={1}
            max={xp}
            value={redeemAmt}
            onChange={(e) => setRedeemAmt(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(245,158,11,0.4)",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              fontSize: 15,
              textAlign: "center",
            }}
          />
          <span style={{ color: "#f59e0b", fontWeight: 700, whiteSpace: "nowrap" }}>
            = ${(Number(redeemAmt) * 100).toLocaleString("es-CL")}
          </span>
        </div>

        <button
          onClick={() => onRedeem("pesos")}
          disabled={xp < Number(redeemAmt)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #d97706, #f59e0b)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          💰 Canjear por Pesos
        </button>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h3 style={{ margin: "0 0 8px", color: "#818cf8" }}>⏱️ Convertir en Tiempo Libre</h3>
        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
          1 XP = 5 minutos de libertad
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            type="number"
            min={1}
            max={xp}
            value={redeemAmt}
            onChange={(e) => setRedeemAmt(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(99,102,241,0.4)",
              background: "rgba(0,0,0,0.3)",
              color: "#fff",
              fontSize: 15,
              textAlign: "center",
            }}
          />
          <span style={{ color: "#818cf8", fontWeight: 700, whiteSpace: "nowrap" }}>
            = {Number(redeemAmt) * 5} min
          </span>
        </div>

        <button
          onClick={() => onRedeem("tiempo")}
          disabled={xp < Number(redeemAmt)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(90deg, #4f46e5, #818cf8)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ⏱️ Canjear por Tiempo
        </button>
      </div>
    </div>
  );
}
