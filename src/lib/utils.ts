export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateBonus = (tiempoRespuesta: number, dificultad: 'facil' | 'medio' | 'dificil'): number => {
  const baseBonus = {
    facil: 30,
    medio: 50,
    dificil: 80,
  };

  const maxTime = {
    facil: 15,
    medio: 20,
    dificil: 30,
  };

  const tiempoRestante = Math.max(0, maxTime[dificultad] - tiempoRespuesta);
  const porcentaje = tiempoRestante / maxTime[dificultad];
  return Math.round(baseBonus[dificultad] * porcentaje);
};

export const getDifficultyColor = (dificultad: 'facil' | 'medio' | 'dificil'): string => {
  switch (dificultad) {
    case 'facil': return 'text-green-600 bg-green-100';
    case 'medio': return 'text-amber-600 bg-amber-100';
    case 'dificil': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getDifficultyLabel = (dificultad: 'facil' | 'medio' | 'dificil'): string => {
  switch (dificultad) {
    case 'facil': return 'Fácil';
    case 'medio': return 'Medio';
    case 'dificil': return 'Difícil';
    default: return dificultad;
  }
};

export const getRankTitle = (puntuacion: number): { title: string; emoji: string; color: string } => {
  if (puntuacion >= 1500) return { title: 'Maestro Literario', emoji: '👑', color: 'text-purple-600' };
  if (puntuacion >= 1200) return { title: 'Erudito', emoji: '🎓', color: 'text-blue-600' };
  if (puntuacion >= 900) return { title: 'Lector Experto', emoji: '📚', color: 'text-amber-600' };
  if (puntuacion >= 600) return { title: 'Aficionado', emoji: '📖', color: 'text-green-600' };
  if (puntuacion >= 300) return { title: 'Principiante', emoji: '🌱', color: 'text-teal-600' };
  return { title: 'Novato', emoji: '🐣', color: 'text-gray-600' };
};

export const generateAvatar = (nombre: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const firstChar = nombre.charAt(0).toUpperCase();
  const colorIndex = nombre.length % colors.length;
  return `https://ui-avatars.com/api/?name=${firstChar}&background=${colors[colorIndex].replace('#', '')}&color=fff&size=128`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const saveToLocalStorage = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

export const getStreakBonus = (streak: number): number => {
  if (streak >= 10) return 100;
  if (streak >= 7) return 70;
  if (streak >= 5) return 50;
  if (streak >= 3) return 30;
  if (streak >= 2) return 15;
  return 0;
};

export const getStreakMessage = (streak: number): string => {
  if (streak >= 10) return '🔥 ¡Racha INCREÍBLE! 🔥';
  if (streak >= 7) return '⚡ ¡Racha ÉPICA! ⚡';
  if (streak >= 5) return '🔥 ¡Racha IMPRESIONANTE! 🔥';
  if (streak >= 3) return '✨ ¡Buena racha! ✨';
  if (streak >= 2) return '👏 ¡Seguidilla! 👏';
  return '';
};