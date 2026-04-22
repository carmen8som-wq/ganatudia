export const LEVELS = [
  { name: "Aldeano", min: 0, icon: "🧑‍🌾" },
  { name: "Aprendiz", min: 50, icon: "📚" },
  { name: "Guerrero", min: 150, icon: "⚔️" },
  { name: "Caballero", min: 350, icon: "🛡️" },
  { name: "Campeón", min: 700, icon: "🏅" },
  { name: "Leyenda", min: 1200, icon: "👑" },
  { name: "Héroe Eterno", min: 2000, icon: "🌟" },
];

export function getLevel(xp) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.min) current = level;
  }
  return current;
}

export function getNextLevel(xp) {
  for (const level of LEVELS) {
    if (xp < level.min) return level;
  }
  return null;
}

export function xpProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);

  if (!next) return 100;

  return Math.round(((xp - current.min) / (next.min - current.min)) * 100);
}
