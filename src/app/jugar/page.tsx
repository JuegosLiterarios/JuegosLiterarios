'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  Timer,
  Trophy,
  ArrowRight,
  RotateCcw,
  Heart,
  Zap,
  SkipForward,
  Scissors,
  Flame,
  Star,
  Home,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
  Target,
  Crown,
  Medal,
  Share2,
  X
} from 'lucide-react';
import { preguntas, getPreguntasAleatorias } from '@/data/preguntas';
import { Pregunta, GameState, LeaderboardEntry } from '@/types/game';
import { 
  formatTime, 
  calculateBonus, 
  getDifficultyColor, 
  getDifficultyLabel,
  getRankTitle,
  generateAvatar,
  saveToLocalStorage,
  loadFromLocalStorage,
  getStreakBonus,
  getStreakMessage
} from '@/lib/utils';
import { checkLogros, logros } from '@/lib/logros';

type GamePhase = 'menu' | 'playing' | 'result' | 'leaderboard' | 'achievements';

const MAX_TIME = 30;
const LIVES = 3;

export default function JugarPage() {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'facil' | 'medio' | 'dificil'>('medio');
  const [playerName, setPlayerName] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [unlockedLogros, setUnlockedLogros] = useState<string[]>([]);
  const [showLogroNotification, setShowLogroNotification] = useState<string | null>(null);
  const [timer, setTimer] = useState(MAX_TIME);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showPowerUpModal, setShowPowerUpModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = loadFromLocalStorage<LeaderboardEntry[]>('jl_leaderboard', []);
    setLeaderboard(saved);

    const savedName = loadFromLocalStorage<string>('jl_player_name', '');
    if (savedName) setPlayerName(savedName);

    const savedSound = loadFromLocalStorage<boolean>('jl_sound', true);
    setSoundEnabled(savedSound);
  }, []);

  // Timer effect
  useEffect(() => {
    if (phase === 'playing' && gameState && !gameState.mostrarResultado && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Time's up - auto fail
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, gameState?.mostrarResultado]);

  const handleTimeUp = () => {
    if (!gameState || gameState.mostrarResultado) return;

    const tiempoRespuesta = (Date.now() - gameState.tiempoInicio) / 1000;
    const newState = {
      ...gameState,
      seleccion: -1,
      mostrarResultado: true,
      tiemposRespuesta: [...gameState.tiemposRespuesta, tiempoRespuesta],
      respuestasUsuario: [...gameState.respuestasUsuario, -1],
      streak: 0,
      vidas: gameState.vidas - 1,
    };
    setGameState(newState);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startGame = (difficulty: 'facil' | 'medio' | 'dificil') => {
    const selectedPreguntas = getPreguntasAleatorias(10, difficulty);

    const newState: GameState = {
      preguntaActual: 0,
      puntuacion: 0,
      seleccion: null,
      mostrarResultado: false,
      juegoTerminado: false,
      tiempoInicio: Date.now(),
      rondaPreguntas: selectedPreguntas,
      respuestasUsuario: [],
      tiemposRespuesta: [],
      streak: 0,
      maxStreak: 0,
      vidas: LIVES,
      powerUps: {
        fiftyFifty: 2,
        extraTime: 1,
        skip: 1,
      },
    };

    setGameState(newState);
    setSelectedDifficulty(difficulty);
    setPhase('playing');
    setTimer(MAX_TIME);
    setEliminatedOptions([]);
  };

  const handleSeleccion = (index: number) => {
    if (!gameState || gameState.seleccion !== null || gameState.mostrarResultado) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const tiempoRespuesta = (Date.now() - gameState.tiempoInicio) / 1000;
    const pregunta = gameState.rondaPreguntas[gameState.preguntaActual];
    const esCorrecta = index === pregunta.respuestaCorrecta;

    const bonusVelocidad = esCorrecta ? calculateBonus(tiempoRespuesta, pregunta.dificultad) : 0;
    const basePuntos = esCorrecta ? 100 : 0;
    const newStreak = esCorrecta ? gameState.streak + 1 : 0;
    const streakBonus = esCorrecta ? getStreakBonus(newStreak) : 0;
    const puntos = basePuntos + bonusVelocidad + streakBonus;

    const newState = {
      ...gameState,
      seleccion: index,
      mostrarResultado: true,
      puntuacion: gameState.puntuacion + puntos,
      tiemposRespuesta: [...gameState.tiemposRespuesta, tiempoRespuesta],
      respuestasUsuario: [...gameState.respuestasUsuario, index],
      streak: newStreak,
      maxStreak: Math.max(gameState.maxStreak, newStreak),
      vidas: esCorrecta ? gameState.vidas : gameState.vidas - 1,
    };

    setGameState(newState);
  };

  const siguientePregunta = () => {
    if (!gameState) return;

    if (gameState.preguntaActual < 9 && gameState.vidas > 0) {
      setGameState({
        ...gameState,
        preguntaActual: gameState.preguntaActual + 1,
        seleccion: null,
        mostrarResultado: false,
        tiempoInicio: Date.now(),
      });
      setTimer(MAX_TIME);
      setEliminatedOptions([]);
    } else {
      // Game over
      const finalState = { ...gameState, juegoTerminado: true };
      setGameState(finalState);
      setPhase('result');

      // Check achievements
      const aciertos = finalState.respuestasUsuario.filter(
        (r, i) => r === finalState.rondaPreguntas[i].respuestaCorrecta
      ).length;

      const autoresUnicos = new Set(finalState.rondaPreguntas.map(p => p.autor)).size;
      const clasicos = finalState.rondaPreguntas.filter(p => p.genero.includes('Clásico')).length;
      const hora = new Date().getHours();
      const partidas = loadFromLocalStorage<number>('jl_partidas', 0) + 1;
      saveToLocalStorage('jl_partidas', partidas);

      const checkedLogros = checkLogros({
        aciertos,
        streak: finalState.maxStreak,
        puntuacion: finalState.puntuacion,
        tiempo: Math.min(...finalState.tiemposRespuesta.filter(t => t > 0)),
        dificultad: selectedDifficulty,
        autoresUnicos,
        partidas,
        hora,
        clasicos,
      });

      const newUnlocked = checkedLogros.filter(l => l.desbloqueado && !unlockedLogros.includes(l.id)).map(l => l.id);
      if (newUnlocked.length > 0) {
        setUnlockedLogros(prev => [...prev, ...newUnlocked]);
        const firstLogro = checkedLogros.find(l => l.id === newUnlocked[0]);
        if (firstLogro) {
          setShowLogroNotification(firstLogro.titulo);
          setTimeout(() => setShowLogroNotification(null), 4000);
        }
      }

      // Save to leaderboard
      if (playerName) {
        const entry: LeaderboardEntry = {
          id: Date.now().toString(),
          nombre: playerName,
          puntuacion: finalState.puntuacion,
          fecha: new Date().toISOString(),
          aciertos,
          tiempoTotal: finalState.tiemposRespuesta.reduce((a, b) => a + b, 0),
          dificultad: selectedDifficulty,
          avatar: generateAvatar(playerName),
        };

        const newLeaderboard = [...leaderboard, entry]
          .sort((a, b) => b.puntuacion - a.puntuacion)
          .slice(0, 50);

        setLeaderboard(newLeaderboard);
        saveToLocalStorage('jl_leaderboard', newLeaderboard);
      }
    }
  };

  const usePowerUp = (type: string) => {
    if (!gameState || gameState.mostrarResultado) return;

    const pregunta = gameState.rondaPreguntas[gameState.preguntaActual];

    switch (type) {
      case 'fiftyFifty':
        if (gameState.powerUps.fiftyFifty > 0) {
          const wrongOptions = pregunta.opciones
            .map((_, i) => i)
            .filter(i => i !== pregunta.respuestaCorrecta);
          const toEliminate = shuffleArray(wrongOptions).slice(0, 2);
          setEliminatedOptions(toEliminate);
          setGameState({
            ...gameState,
            powerUps: { ...gameState.powerUps, fiftyFifty: gameState.powerUps.fiftyFifty - 1 },
          });
        }
        break;
      case 'extraTime':
        if (gameState.powerUps.extraTime > 0) {
          setTimer(prev => prev + 15);
          setGameState({
            ...gameState,
            powerUps: { ...gameState.powerUps, extraTime: gameState.powerUps.extraTime - 1 },
          });
        }
        break;
      case 'skip':
        if (gameState.powerUps.skip > 0) {
          siguientePregunta();
          setGameState({
            ...gameState,
            powerUps: { ...gameState.powerUps, skip: gameState.powerUps.skip - 1 },
          });
        }
        break;
    }
    setShowPowerUpModal(false);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shareResult = () => {
    if (!gameState) return;
    const rank = getRankTitle(gameState.puntuacion);
    const text = `¡Obtuve ${gameState.puntuacion} puntos en JuegosLiterarios.com y me convertí en ${rank.title}! ¿Puedes superarme? 📚✨`;

    if (navigator.share) {
      navigator.share({
        title: 'JuegosLiterarios.com',
        text,
        url: 'https://juegosliterarios.com',
      });
    } else {
      navigator.clipboard.writeText(text);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 3000);
    }
  };

  const getProgressBarColor = () => {
    const percentage = (timer / MAX_TIME) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Render Menu
  if (phase === 'menu') {
    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-ink-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  saveToLocalStorage('jl_sound', !soundEnabled);
                }}
                className="p-2 rounded-lg hover:bg-ink-100 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-ink-600" /> : <VolumeX className="w-5 h-5 text-ink-400" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            className="max-w-lg w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">¿Listo para jugar?</h1>
              <p className="text-ink-500">Elige tu dificultad y demuestra tu conocimiento literario</p>
            </div>

            {/* Player Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-ink-700 mb-2">Tu nombre (para el ranking)</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  saveToLocalStorage('jl_player_name', e.target.value);
                }}
                placeholder="Ej: Don Quijote"
                className="input-book"
                maxLength={20}
              />
            </div>

            {/* Difficulty Selection */}
            <div className="grid gap-3 mb-8">
              {[
                { id: 'facil' as const, label: 'Fácil', desc: 'Clásicos conocidos y obras populares', color: 'border-green-400 hover:border-green-500', bg: 'hover:bg-green-50', icon: '🌱' },
                { id: 'medio' as const, label: 'Medio', desc: 'Mezcla de clásicos y contemporáneos', color: 'border-amber-400 hover:border-amber-500', bg: 'hover:bg-amber-50', icon: '📚' },
                { id: 'dificil' as const, label: 'Difícil', desc: 'Obras exigentes y experimental', color: 'border-red-400 hover:border-red-500', bg: 'hover:bg-red-50', icon: '🔥' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedDifficulty === diff.id 
                      ? `${diff.color} ${diff.bg} bg-opacity-50 ring-2 ring-offset-2 ring-${diff.id === 'facil' ? 'green' : diff.id === 'medio' ? 'amber' : 'red'}-400` 
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  <span className="text-2xl">{diff.icon}</span>
                  <div>
                    <div className="font-semibold text-ink-900">{diff.label}</div>
                    <div className="text-sm text-ink-500">{diff.desc}</div>
                  </div>
                  {selectedDifficulty === diff.id && (
                    <motion.div
                      className="ml-auto w-6 h-6 rounded-full bg-ink-900 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => startGame(selectedDifficulty)}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-3"
            >
              <Target className="w-5 h-5" />
              Comenzar Partida
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-ink-400">
              <button onClick={() => setPhase('leaderboard')} className="hover:text-ink-600 transition-colors flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                Ver Ranking
              </button>
              <span>•</span>
              <button onClick={() => setPhase('achievements')} className="hover:text-ink-600 transition-colors flex items-center gap-1">
                <Star className="w-4 h-4" />
                Logros
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Render Playing
  if (phase === 'playing' && gameState) {
    const pregunta = gameState.rondaPreguntas[gameState.preguntaActual];
    const progress = ((gameState.preguntaActual + 1) / 10) * 100;
    const timerPercentage = (timer / MAX_TIME) * 100;

    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-ink-100 px-4 md:px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <BookOpen className="w-5 h-5 text-ink-700" />
                  <span className="font-serif font-semibold text-ink-900 hidden sm:inline">JuegosLiterarios</span>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(LIVES)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-5 h-5 transition-all ${i < gameState.vidas ? 'text-red-500 fill-red-500' : 'text-ink-200'}`}
                    />
                  ))}
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {gameState.puntuacion} pts
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-500 whitespace-nowrap">{gameState.preguntaActual + 1}/10</span>
              <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {gameState.streak > 1 && (
                <motion.span 
                  className="text-xs font-bold text-orange-600 flex items-center gap-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Flame className="w-3 h-3" />
                  {gameState.streak}
                </motion.span>
              )}
            </div>
          </div>
        </header>

        {/* Timer */}
        {!gameState.mostrarResultado && (
          <div className="max-w-2xl mx-auto w-full px-4 md:px-6 mt-3">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${timer <= 10 ? 'text-red-500' : 'text-ink-400'}`} />
              <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${getProgressBarColor()}`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
              <span className={`text-sm font-mono font-bold ${timer <= 10 ? 'text-red-500' : 'text-ink-500'}`}>
                {timer}s
              </span>
            </div>
          </div>
        )}

        {/* Game Content */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.preguntaActual}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-ink-100 shadow-lg p-6 md:p-8"
              >
                {/* Question Meta */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`badge ${getDifficultyColor(pregunta.dificultad)}`}>
                    {getDifficultyLabel(pregunta.dificultad)}
                  </span>
                  <span className="text-xs text-ink-400">{pregunta.genero}</span>
                </div>

                {/* Paragraph */}
                <div className="bg-parchment-100 rounded-xl p-6 mb-6 border-l-4 border-gold-400">
                  <p className="text-lg md:text-xl font-serif italic text-ink-800 leading-relaxed">
                    "{pregunta.parrafo}"
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {pregunta.opciones.map((opcion, index) => {
                    let buttonClass = 'option-btn ';

                    if (eliminatedOptions.includes(index)) {
                      buttonClass += 'opacity-25 pointer-events-none ';
                    } else if (gameState.seleccion === null) {
                      buttonClass += 'cursor-pointer hover:shadow-md ';
                    } else if (index === pregunta.respuestaCorrecta) {
                      buttonClass += 'correct border-green-500 shadow-green-100 ';
                    } else if (index === gameState.seleccion && index !== pregunta.respuestaCorrecta) {
                      buttonClass += 'wrong shake ';
                    } else {
                      buttonClass += 'opacity-40 ';
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleSeleccion(index)}
                        disabled={gameState.seleccion !== null || eliminatedOptions.includes(index)}
                        className={buttonClass}
                        whileHover={gameState.seleccion === null && !eliminatedOptions.includes(index) ? { scale: 1.02 } : {}}
                        whileTap={gameState.seleccion === null && !eliminatedOptions.includes(index) ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center text-sm font-bold text-ink-600 flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="font-medium">{opcion}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {gameState.mostrarResultado && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-ink-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          gameState.seleccion === pregunta.respuestaCorrecta 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        }`}>
                          {gameState.seleccion === pregunta.respuestaCorrecta ? (
                            <Sparkles className="w-6 h-6 text-green-600" />
                          ) : (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${
                            gameState.seleccion === pregunta.respuestaCorrecta 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {gameState.seleccion === pregunta.respuestaCorrecta 
                              ? '¡Correcto!' 
                              : gameState.seleccion === -1 
                                ? '¡Se acabó el tiempo!' 
                                : '¡Incorrecto!'}
                          </p>
                          <p className="text-sm text-ink-500 mt-1">
                            {pregunta.autor}, {pregunta.ano} • {pregunta.pais}
                          </p>
                          {gameState.seleccion === pregunta.respuestaCorrecta && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                +{calculateBonus(gameState.tiemposRespuesta[gameState.tiemposRespuesta.length - 1], pregunta.dificultad)} bonus velocidad
                              </span>
                              {gameState.streak > 1 && (
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                  +{getStreakBonus(gameState.streak)} racha x{gameState.streak}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={siguientePregunta}
                        className="w-full mt-4 btn-primary flex items-center justify-center gap-2"
                      >
                        {gameState.preguntaActual < 9 && gameState.vidas > 0 ? (
                          <>
                            Siguiente pregunta
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Ver resultado final
                            <Trophy className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Power-ups */}
                {!gameState.mostrarResultado && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setShowPowerUpModal(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-100 hover:bg-ink-200 transition-colors text-sm text-ink-700"
                    >
                      <Zap className="w-4 h-4" />
                      Power-ups
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Power-up Modal */}
        <AnimatePresence>
          {showPowerUpModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPowerUpModal(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-serif font-bold text-xl text-ink-900 mb-4">Power-ups</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => usePowerUp('fiftyFifty')}
                    disabled={gameState.powerUps.fiftyFifty === 0}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-ink-200 hover:border-ink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">50/50</div>
                      <div className="text-xs text-ink-500">Elimina 2 opciones incorrectas</div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">x{gameState.powerUps.fiftyFifty}</span>
                  </button>

                  <button
                    onClick={() => usePowerUp('extraTime')}
                    disabled={gameState.powerUps.extraTime === 0}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-ink-200 hover:border-ink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Timer className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">+15 segundos</div>
                      <div className="text-xs text-ink-500">Añade tiempo extra</div>
                    </div>
                    <span className="text-sm font-bold text-green-600">x{gameState.powerUps.extraTime}</span>
                  </button>

                  <button
                    onClick={() => usePowerUp('skip')}
                    disabled={gameState.powerUps.skip === 0}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-ink-200 hover:border-ink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <SkipForward className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">Saltar</div>
                      <div className="text-xs text-ink-500">Pasa a la siguiente pregunta</div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">x{gameState.powerUps.skip}</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowPowerUpModal(false)}
                  className="w-full mt-4 btn-secondary"
                >
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render Results
  if (phase === 'result' && gameState) {
    const aciertos = gameState.respuestasUsuario.filter(
      (r, i) => r === gameState.rondaPreguntas[i].respuestaCorrecta
    ).length;
    const rank = getRankTitle(gameState.puntuacion);
    const accuracy = Math.round((aciertos / 10) * 100);
    const avgTime = gameState.tiemposRespuesta.length > 0 
      ? (gameState.tiemposRespuesta.reduce((a, b) => a + b, 0) / gameState.tiemposRespuesta.length).toFixed(1)
      : '0';

    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col">
        <header className="bg-white border-b border-ink-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BookOpen className="w-5 h-5 text-ink-700" />
              <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            className="max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            {/* Achievement Notification */}
            <AnimatePresence>
              {showLogroNotification && (
                <motion.div
                  className="mb-4 bg-gradient-to-r from-gold-400 to-gold-500 text-white p-4 rounded-xl flex items-center gap-3 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-bold">¡Logro desbloqueado!</div>
                    <div className="text-sm">{showLogroNotification}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-3xl border border-ink-100 shadow-xl p-8 text-center">
              {/* Rank Badge */}
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gold-300 to-gold-500 rounded-full flex items-center justify-center shadow-lg mb-3">
                  <span className="text-5xl">{rank.emoji}</span>
                </div>
                <h2 className={`text-2xl font-serif font-bold ${rank.color}`}>{rank.title}</h2>
              </motion.div>

              {/* Score */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-6xl font-bold text-ink-900 mb-1">{gameState.puntuacion}</div>
                <div className="text-ink-500">puntos totales</div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-parchment-100 rounded-xl p-3">
                  <div className="text-2xl font-bold text-ink-900">{aciertos}/10</div>
                  <div className="text-xs text-ink-500">Aciertos</div>
                </div>
                <div className="bg-parchment-100 rounded-xl p-3">
                  <div className="text-2xl font-bold text-ink-900">{accuracy}%</div>
                  <div className="text-xs text-ink-500">Precisión</div>
                </div>
                <div className="bg-parchment-100 rounded-xl p-3">
                  <div className="text-2xl font-bold text-ink-900">{avgTime}s</div>
                  <div className="text-xs text-ink-500">Promedio</div>
                </div>
              </motion.div>

              {/* Additional Stats */}
              <motion.div
                className="bg-ink-50 rounded-xl p-4 mb-6 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-ink-600">Mejor racha: <span className="font-bold">{gameState.maxStreak}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-ink-600">Vidas restantes: <span className="font-bold">{gameState.vidas}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-ink-600">Dificultad: <span className="font-bold capitalize">{selectedDifficulty}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-ink-600">Power-ups usados: <span className="font-bold">{(2-gameState.powerUps.fiftyFifty)+(1-gameState.powerUps.extraTime)+(1-gameState.powerUps.skip)}</span></span>
                  </div>
                </div>
              </motion.div>

              {/* Question Review */}
              <motion.div
                className="mb-6 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h3 className="font-semibold text-ink-900 mb-3">Revisión de respuestas</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scroll-hide">
                  {gameState.rondaPreguntas.map((pregunta, i) => {
                    const userAnswer = gameState.respuestasUsuario[i];
                    const isCorrect = userAnswer === pregunta.respuestaCorrecta;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                        isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{pregunta.opciones[pregunta.respuestaCorrecta]}</div>
                          <div className="text-xs text-ink-400">{pregunta.autor}</div>
                        </div>
                        <span className="text-xs text-ink-400">{gameState.tiemposRespuesta[i]?.toFixed(1) || '0'}s</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPhase('menu');
                    setGameState(null);
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Jugar otra vez
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={shareResult}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </button>
                  <button
                    onClick={() => setPhase('leaderboard')}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Ranking
                  </button>
                </div>

                <Link href="/" className="block text-center text-sm text-ink-400 hover:text-ink-600 transition-colors">
                  <Home className="w-4 h-4 inline mr-1" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-ink-900 mb-2">¡Resultado copiado!</h3>
                <p className="text-sm text-ink-500 mb-4">Pega el mensaje en tus redes sociales para retar a tus amigos.</p>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="btn-primary w-full"
                >
                  Entendido
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render Leaderboard
  if (phase === 'leaderboard') {
    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col">
        <header className="bg-white border-b border-ink-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BookOpen className="w-5 h-5 text-ink-700" />
              <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
            </Link>
            <button onClick={() => setPhase('menu')} className="text-sm text-ink-600 hover:text-ink-900">
              Volver
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-gold-500 mx-auto mb-3" />
              <h1 className="text-3xl font-serif font-bold text-ink-900">Ranking Global</h1>
              <p className="text-ink-500 mt-2">Los mejores lectores de la historia</p>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-ink-100">
                <Medal className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                <p className="text-ink-500">Aún no hay jugadores en el ranking</p>
                <p className="text-sm text-ink-400 mt-1">¡Sé el primero en jugar!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      i === 0 ? 'bg-gradient-to-r from-gold-50 to-amber-50 border-gold-200' :
                      i === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                      i === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                      'bg-white border-ink-100'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      i === 0 ? 'bg-gold-500 text-white' :
                      i === 1 ? 'bg-gray-400 text-white' :
                      i === 2 ? 'bg-orange-400 text-white' :
                      'bg-ink-100 text-ink-600'
                    }`}>
                      {i === 0 ? <Crown className="w-5 h-5" /> : i + 1}
                    </div>
                    <img src={entry.avatar} alt={entry.nombre} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="font-semibold text-ink-900">{entry.nombre}</div>
                      <div className="text-xs text-ink-400">
                        {entry.aciertos}/10 aciertos • {getDifficultyLabel(entry.dificultad as any)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-ink-900">{entry.puntuacion}</div>
                      <div className="text-xs text-ink-400">pts</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Render Achievements
  if (phase === 'achievements') {
    const allLogros = logros.map(l => ({
      ...l,
      desbloqueado: unlockedLogros.includes(l.id)
    }));

    return (
      <div className="min-h-screen bg-parchment-50 flex flex-col">
        <header className="bg-white border-b border-ink-100 px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BookOpen className="w-5 h-5 text-ink-700" />
              <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
            </Link>
            <button onClick={() => setPhase('menu')} className="text-sm text-ink-600 hover:text-ink-900">
              Volver
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Star className="w-12 h-12 text-gold-500 mx-auto mb-3" />
              <h1 className="text-3xl font-serif font-bold text-ink-900">Logros</h1>
              <p className="text-ink-500 mt-2">
                {unlockedLogros.length} de {logros.length} desbloqueados
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allLogros.map((logro, i) => (
                <motion.div
                  key={logro.id}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    logro.desbloqueado 
                      ? 'bg-white border-gold-200 shadow-sm' 
                      : 'bg-ink-50 border-ink-100 opacity-60'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={`text-4xl mb-2 ${logro.desbloqueado ? '' : 'grayscale'}`}>
                    {logro.icono}
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${logro.desbloqueado ? 'text-ink-900' : 'text-ink-400'}`}>
                    {logro.titulo}
                  </h3>
                  <p className="text-xs text-ink-500">{logro.descripcion}</p>
                  <div className={`mt-2 text-xs font-medium ${
                    logro.rareza === 'legendario' ? 'text-purple-600' :
                    logro.rareza === 'epico' ? 'text-blue-600' :
                    logro.rareza === 'raro' ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {logro.rareza.charAt(0).toUpperCase() + logro.rareza.slice(1)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}