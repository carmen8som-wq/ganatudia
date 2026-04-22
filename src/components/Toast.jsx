export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: toast.color,
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 12,
        zIndex: 999,
        fontWeight: 600,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        maxWidth: "90vw",
        textAlign: "center",
      }}
    >
      {toast.msg}
    </div>
  );
}
