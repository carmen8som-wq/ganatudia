export async function analyzeTask(input) {
  const text = input.trim();
  const lower = text.toLowerCase();

  let xp = 10;

  if (text.length > 25) xp = 15;
  if (text.length > 40) xp = 20;

  if (lower.includes("limpiar") || lower.includes("ordenar")) xp = 20;
  if (lower.includes("lavar")) xp = 15;
  if (lower.includes("ejercicio") || lower.includes("entrenar")) xp = 35;
  if (lower.includes("estudiar") || lower.includes("leer")) xp = 25;
  if (lower.includes("trabajo") || lower.includes("proyecto")) xp = 40;
  if (lower.includes("reunión") || lower.includes("reunion")) xp = 25;

  return {
    task: text,
    description: "Misión aceptada en tu aventura diaria ⚔️",
    xp,
  };
}

export const TASK_EMOJIS = ["⚔️", "🛡️", "🏹", "🔥", "💎", "🌿", "🧪", "🗡️", "🏺", "📜"];

export function randomEmoji() {
  return TASK_EMOJIS[Math.floor(Math.random() * TASK_EMOJIS.length)];
}
