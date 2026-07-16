export interface Pregunta {
  id: number;
  parrafo: string;
  opciones: string[];
  respuestaCorrecta: number;
  dificultad: 'facil' | 'medio' | 'dificil';
  autor: string;
  ano: number;
  genero: string;
  idioma: string;
  pais: string;
}

export interface GameState {
  preguntaActual: number;
  puntuacion: number;
  seleccion: number | null;
  mostrarResultado: boolean;
  juegoTerminado: boolean;
  tiempoInicio: number;
  rondaPreguntas: Pregunta[];
  respuestasUsuario: number[];
  tiemposRespuesta: number[];
  streak: number;
  maxStreak: number;
  vidas: number;
  powerUps: {
    fiftyFifty: number;
    extraTime: number;
    skip: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  nombre: string;
  puntuacion: number;
  fecha: string;
  aciertos: number;
  tiempoTotal: number;
  dificultad: string;
  avatar: string;
}

export interface UserStats {
  totalJugados: number;
  totalPuntuacion: number;
  mejorPuntuacion: number;
  promedioPuntuacion: number;
  librosAdivinados: number[];
  logros: string[];
  rachaDias: number;
  ultimaJugada: string;
}

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  condicion: string;
  desbloqueado: boolean;
  fecha?: string;
  rareza: 'comun' | 'raro' | 'epico' | 'legendario';
}