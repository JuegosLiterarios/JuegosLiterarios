import { Logro } from "@/types/game";

export const logros: Logro[] = [
  {
    id: 'primer_acierto',
    titulo: 'Primer Paso',
    descripcion: 'Acierta tu primera pregunta',
    icono: '🎯',
    condicion: 'aciertos >= 1',
    desbloqueado: false,
    rareza: 'comun'
  },
  {
    id: 'racha_5',
    titulo: 'En Racha',
    descripcion: 'Acierta 5 preguntas seguidas',
    icono: '🔥',
    condicion: 'streak >= 5',
    desbloqueado: false,
    rareza: 'raro'
  },
  {
    id: 'racha_10',
    titulo: 'Imparable',
    descripcion: 'Acierta 10 preguntas seguidas',
    icono: '⚡',
    condicion: 'streak >= 10',
    desbloqueado: false,
    rareza: 'epico'
  },
  {
    id: 'maestro',
    titulo: 'Maestro Literario',
    descripcion: 'Obtén 1500+ puntos en una partida',
    icono: '👑',
    condicion: 'puntuacion >= 1500',
    desbloqueado: false,
    rareza: 'legendario'
  },
  {
    id: 'velocidad',
    titulo: 'Velocista',
    descripcion: 'Responde correctamente en menos de 3 segundos',
    icono: '💨',
    condicion: 'tiempo < 3',
    desbloqueado: false,
    rareza: 'raro'
  },
  {
    id: 'perfecto',
    titulo: 'Partida Perfecta',
    descripcion: 'Acierta todas las preguntas de una partida',
    icono: '💎',
    condicion: 'aciertos == 10',
    desbloqueado: false,
    rareza: 'legendario'
  },
  {
    id: 'experto',
    titulo: 'Experto',
    descripcion: 'Juega en modo difícil',
    icono: '🧠',
    condicion: 'dificultad == dificil',
    desbloqueado: false,
    rareza: 'raro'
  },
  {
    id: 'coleccionista',
    titulo: 'Coleccionista',
    descripcion: 'Acierta preguntas de 10 autores diferentes',
    icono: '📚',
    condicion: 'autores_unicos >= 10',
    desbloqueado: false,
    rareza: 'epico'
  },
  {
    id: 'veterano',
    titulo: 'Veterano',
    descripcion: 'Juega 10 partidas',
    icono: '🏆',
    condicion: 'partidas >= 10',
    desbloqueado: false,
    rareza: 'epico'
  },
  {
    id: 'nocturno',
    titulo: 'Lector Nocturno',
    descripcion: 'Juega después de las 10 PM',
    icono: '🌙',
    condicion: 'hora >= 22',
    desbloqueado: false,
    rareza: 'comun'
  },
  {
    id: 'madrugador',
    titulo: 'Madrugador',
    descripcion: 'Juega antes de las 7 AM',
    icono: '🌅',
    condicion: 'hora <= 7',
    desbloqueado: false,
    rareza: 'comun'
  },
  {
    id: 'clasico',
    titulo: 'Clásico',
    descripcion: 'Acierta 5 preguntas de clásicos españoles',
    icono: '🏛️',
    condicion: 'clasicos >= 5',
    desbloqueado: false,
    rareza: 'raro'
  }
];

export const checkLogros = (stats: {
  aciertos: number;
  streak: number;
  puntuacion: number;
  tiempo: number;
  dificultad: string;
  autoresUnicos: number;
  partidas: number;
  hora: number;
  clasicos: number;
}): Logro[] => {
  return logros.map(logro => {
    let desbloqueado = false;

    switch (logro.id) {
      case 'primer_acierto':
        desbloqueado = stats.aciertos >= 1;
        break;
      case 'racha_5':
        desbloqueado = stats.streak >= 5;
        break;
      case 'racha_10':
        desbloqueado = stats.streak >= 10;
        break;
      case 'maestro':
        desbloqueado = stats.puntuacion >= 1500;
        break;
      case 'velocidad':
        desbloqueado = stats.tiempo < 3;
        break;
      case 'perfecto':
        desbloqueado = stats.aciertos === 10;
        break;
      case 'experto':
        desbloqueado = stats.dificultad === 'dificil';
        break;
      case 'coleccionista':
        desbloqueado = stats.autoresUnicos >= 10;
        break;
      case 'veterano':
        desbloqueado = stats.partidas >= 10;
        break;
      case 'nocturno':
        desbloqueado = stats.hora >= 22;
        break;
      case 'madrugador':
        desbloqueado = stats.hora <= 7;
        break;
      case 'clasico':
        desbloqueado = stats.clasicos >= 5;
        break;
    }

    return {
      ...logro,
      desbloqueado,
      fecha: desbloqueado ? new Date().toISOString() : undefined
    };
  });
};