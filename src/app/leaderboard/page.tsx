'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Crown, Medal, ArrowLeft, Filter } from 'lucide-react';
import { LeaderboardEntry } from '@/types/game';
import { loadFromLocalStorage } from '@/lib/utils';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'facil' | 'medio' | 'dificil'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'today'>('all');

  useEffect(() => {
    const saved = loadFromLocalStorage<LeaderboardEntry[]>('jl_leaderboard', []);
    setLeaderboard(saved);
  }, []);

  const filteredLeaderboard = leaderboard.filter(entry => {
    if (filter !== 'all' && entry.dificultad !== filter) return false;
    if (timeFilter === 'today') {
      const entryDate = new Date(entry.fecha).toDateString();
      const today = new Date().toDateString();
      return entryDate === today;
    }
    if (timeFilter === 'week') {
      const entryDate = new Date(entry.fecha);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }
    return true;
  }).sort((a, b) => b.puntuacion - a.puntuacion).slice(0, 50);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-gold-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-orange-400" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-ink-400">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-gold-50 to-amber-50 border-gold-200';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
    return 'bg-white border-ink-100';
  };

  return (
    <div className="min-h-screen bg-parchment-50">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
          </Link>
          <Link 
            href="/jugar"
            className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al juego
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-ink-900 mb-2">Ranking Global</h1>
            <p className="text-ink-500">Los mejores lectores de todos los tiempos</p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-3 mb-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-ink-100">
              {(['all', 'facil', 'medio', 'dificil'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-ink-900 text-white' 
                      : 'text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-ink-100">
              {(['all', 'week', 'today'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === t 
                      ? 'bg-ink-900 text-white' 
                      : 'text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {t === 'all' ? 'Siempre' : t === 'week' ? 'Esta semana' : 'Hoy'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl p-4 border border-ink-100 text-center">
              <div className="text-2xl font-bold text-ink-900">{leaderboard.length}</div>
              <div className="text-xs text-ink-500">Jugadores</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-ink-100 text-center">
              <div className="text-2xl font-bold text-ink-900">
                {leaderboard.length > 0 ? Math.max(...leaderboard.map(l => l.puntuacion)) : 0}
              </div>
              <div className="text-xs text-ink-500">Mejor puntaje</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-ink-100 text-center">
              <div className="text-2xl font-bold text-ink-900">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((a, b) => a + b.puntuacion, 0) / leaderboard.length) 
                  : 0}
              </div>
              <div className="text-xs text-ink-500">Promedio</div>
            </div>
          </motion.div>

          {/* Leaderboard List */}
          {filteredLeaderboard.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-white rounded-2xl border border-ink-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy className="w-12 h-12 text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500 font-medium">No hay entradas para este filtro</p>
              <p className="text-sm text-ink-400 mt-1">¡Juega una partida para aparecer aquí!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${getRankBg(i)}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(i)}
                  </div>

                  <img 
                    src={entry.avatar} 
                    alt={entry.nombre} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 truncate">{entry.nombre}</div>
                    <div className="text-xs text-ink-400 flex items-center gap-2">
                      <span>{entry.aciertos}/10 aciertos</span>
                      <span>•</span>
                      <span className="capitalize">{entry.dificultad}</span>
                      <span>•</span>
                      <span>{new Date(entry.fecha).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xl text-ink-900">{entry.puntuacion}</div>
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