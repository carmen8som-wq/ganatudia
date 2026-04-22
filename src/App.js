import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import TaskCard from "./components/TaskCard";
import Toast from "./components/Toast";
import AddTaskPanel from "./components/AddTaskPanel";
import CompletedPanel from "./components/CompletedPanel";
import RedeemPanel from "./components/RedeemPanel";
import { getLevel, getNextLevel, xpProgress } from "./utils/levels";
import { loadData, saveData } from "./utils/storage";
import { analyzeTask, randomEmoji } from "./utils/taskAnalyzer";

export default function App() {
  const [xp, setXp] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [tab, setTab] = useState("misiones");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState(null);
  const [redeemAmt, setRedeemAmt] = useState(1);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const data = loadData();

    if (data) {
      setXp(data.xp ?? 0);
      setTasks(data.tasks ?? []);
      setCompleted(data.completed ?? []);
    }

    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!loadingData) {
      saveData({ xp, tasks, completed });
    }
  }, [xp, tasks, completed, loadingData]);

  const showToast = (msg, color = "#7c3aed") => {
    setToast({ msg, color });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addTask = async (input) => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const result = await analyzeTask(input);

      if (result) {
        setTasks((prev) => [
          ...prev,
          {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            ...result,
            emoji: randomEmoji(),
            done: false,
          },
        ]);

        showToast(`⚔️ Misión creada: ${result.task} (+${result.xp} XP al completar)`);
      } else {
        showToast("No pude entender la tarea, intenta de nuevo.", "#ef4444");
      }
    } catch {
      showToast("Ocurrió un error al crear la misión.", "#ef4444");
    }

    setLoading(false);
  };

  const completeTask = (id) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setTasks((prev) => prev.filter((item) => item.id !== id));
    setCompleted((prev) => [
      ...prev,
      {
        ...task,
        done: true,
        completedAt: new Date().toLocaleDateString("es-CL"),
      },
    ]);
    setXp((prev) => prev + task.xp);

    showToast(`✨ +${task.xp} XP ganados. ¡Misión completada!`, "#10b981");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
    showToast("🗑️ Misión eliminada", "#64748b");
  };

  const handleRedeem = (type) => {
    const amount = Math.floor(Number(redeemAmt));

    if (!amount || amount < 1) {
      showToast("Ingresa una cantidad válida.", "#ef4444");
      return;
    }

    if (xp < amount) {
      showToast(`No tienes suficiente XP. Tienes ${xp} XP.`, "#ef4444");
      return;
    }

    setXp((prev) => prev - amount);
    setRedeemAmt(1);

    const msg =
      type === "pesos"
        ? `💰 Canjeaste ${amount} XP por ${(amount * 100).toLocaleString("es-CL")}`
        : `⏱️ Canjeaste ${amount} XP por ${amount * 5} minutos de libertad`;

    showToast(msg, "#f59e0b");
  };

  const curLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const progress = xpProgress(xp);

  if (loadingData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#a78bfa",
          fontSize: 18,
          fontFamily: "sans-serif",
        }}
      >
        ⏳ Cargando tu aventura...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        color: "#e2e8f0",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <Toast toast={toast} />

      <Header
        curLevel={curLevel}
        nextLevel={nextLevel}
        xp={xp}
        progress={progress}
      />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
        <Tabs tab={tab} setTab={setTab} />

        {tab === "misiones" && (
          <div>
            {tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                <div style={{ fontSize: 48 }}>🏰</div>
                <div style={{ marginTop: 8 }}>
                  No hay misiones pendientes.
                  <br />
                  ¡Agrega una nueva aventura!
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        )}

        {tab === "agregar" && (
          <AddTaskPanel addTask={addTask} loading={loading} showToast={showToast} />
        )}

        {tab === "completadas" && <CompletedPanel completed={completed} />}

        {tab === "canjear" && (
          <RedeemPanel
            xp={xp}
            redeemAmt={redeemAmt}
            setRedeemAmt={setRedeemAmt}
            onRedeem={handleRedeem}
          />
        )}

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
