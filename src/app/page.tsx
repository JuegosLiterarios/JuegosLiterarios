'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Sparkles, 
  Zap, 
  Users, 
  Target,
  ChevronRight,
  Star,
  Flame,
  Clock,
  Globe,
  ArrowRight,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const floatingBooks = [
  { emoji: '📚', x: 10, y: 20, delay: 0 },
  { emoji: '📖', x: 85, y: 15, delay: 1.5 },
  { emoji: '✨', x: 75, y: 60, delay: 3 },
  { emoji: '🎯', x: 15, y: 70, delay: 2 },
  { emoji: '🏆', x: 90, y: 80, delay: 4 },
  { emoji: '💡', x: 50, y: 10, delay: 2.5 },
];

const stats = [
  { number: '50+', label: 'Obras literarias', icon: BookOpen },
  { number: '3', label: 'Niveles de dificultad', icon: Target },
  { number: '12', label: 'Logros por desbloquear', icon: Trophy },
  { number: '∞', label: 'Partidas ilimitadas', icon: InfinityIcon },
];

const features = [
  {
    icon: Brain,
    title: 'Modo Desafío',
    description: 'Puntuación con bonus por velocidad. ¿Qué tan rápido puedes identificar un clásico?',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Trophy,
    title: 'Ranking Global',
    description: 'Compite con lectores de todo el mundo. Tu nombre en la tabla de honor literario.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Flame,
    title: 'Rachas y Power-ups',
    description: 'Mantén tu racha de aciertos para multiplicadores de puntos. Usa comodines estratégicos.',
    color: 'from-red-500 to-rose-600',
  },
  {
    icon: Star,
    title: 'Sistema de Logros',
    description: 'Desbloquea 12 logros únicos. Desde "Primer Paso" hasta "Maestro Literario".',
    color: 'from-purple-500 to-violet-600',
  },
  {
    icon: Globe,
    title: 'Literatura Mundial',
    description: 'Desde Cervantes hasta Borges, pasando por Kafka y García Márquez. Todos los géneros.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'Partidas Rápidas',
    description: '10 preguntas, 5 minutos. Perfecto para el descanso del café o el viaje en metro.',
    color: 'from-yellow-500 to-amber-600',
  },
];

const testimonials = [
  {
    name: 'María G.',
    role: 'Profesora de Literatura',
    text: 'Mis estudiantes adoran este juego. Han mejorado notablemente su conocimiento de clásicos.',
    avatar: 'M',
  },
  {
    name: 'Carlos R.',
    role: 'Lector Ávido',
    text: 'Adictivo. No puedo parar de jugar. Cada partida me descubre un libro que quiero leer.',
    avatar: 'C',
  },
  {
    name: 'Ana L.',
    role: 'Estudiante de Filología',
    text: 'El modo difícil es un desafío real. Perfecto para poner a prueba mis conocimientos.',
    avatar: 'A',
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-parchment-50 overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingBooks.map((book, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ x: `${book.x}%`, y: `${book.y}%` }}
            animate={{
              y: [`${book.y}%`, `${book.y - 10}%`, `${book.y}%`],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: book.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {book.emoji}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-xl text-ink-900">JuegosLiterarios</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-ink-600 hover:text-ink-900 transition-colors text-sm font-medium">Características</a>
            <a href="#how-it-works" className="text-ink-600 hover:text-ink-900 transition-colors text-sm font-medium">Cómo funciona</a>
                        <a href="/juegos" className="text-ink-600 hover:text-ink-900 transition-colors text-sm font-medium">Juegos</a>
            <Link href="/leaderboard" className="text-ink-600 hover:text-ink-900 transition-colors text-sm font-medium">Ranking</Link>
          </div>
          <Link 
            href="/jugar"
            className="bg-ink-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-ink-800 transition-all hover:shadow-lg active:scale-95"
          >
            Jugar Ahora
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Beta abierta — ¡Gratis para siempre!
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-ink-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ¿Qué tan bien{' '}
            <span className="gold-gradient">conoces</span>
            <br />
            los libros?
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-ink-500 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Lee el primer párrafo de obras literarias icónicas y adivina de qué libro se trata. 
            Compite por el puntaje más alto y descubre tu rango literario.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/jugar"
              className="group bg-ink-900 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-ink-800 transition-all hover:shadow-xl hover:shadow-ink-900/20 active:scale-95 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              Empezar a Jugar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/leaderboard"
              className="bg-white border-2 border-ink-200 text-ink-800 px-8 py-4 rounded-2xl text-lg font-medium hover:border-ink-400 hover:bg-ink-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Ver Ranking
            </Link>
          </motion.div>

          <motion.p
            className="mt-4 text-sm text-ink-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Gratis • Sin registro • 10 preguntas por partida
          </motion.p>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="bg-white rounded-2xl p-6 text-center border border-ink-100 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <stat.icon className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink-900">{stat.number}</div>
                <div className="text-xs text-ink-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Preview Card */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 border border-ink-100 shadow-xl book-shadow"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ink-900 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif font-semibold text-ink-900">JuegosLiterarios</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <Clock className="w-4 h-4" />
                <span>Pregunta 1/10</span>
              </div>
            </div>

            <div className="bg-parchment-100 rounded-2xl p-6 mb-6">
              <p className="text-lg md:text-xl font-serif italic text-ink-800 leading-relaxed">
                "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo."
              </p>
            </div>

            <div className="space-y-3">
              {['Pedro Páramo', 'Cien años de soledad', 'La casa de los espíritus', 'Ficciones'].map((opcion, i) => (
                <button
                  key={opcion}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    i === 1 
                      ? 'border-green-500 bg-green-50 text-green-800' 
                      : 'border-ink-200 hover:border-ink-400'
                  }`}
                >
                  <span className="font-medium">{opcion}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-ink-500">
              <span>Puntuación: 150 pts</span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                Racha: 3
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink-900 mb-4">
              Diseñado para <span className="gold-gradient">lectores exigentes</span>
            </h2>
            <p className="text-lg text-ink-500 max-w-2xl mx-auto">
              Cada detalle está pensado para hacer de tu experiencia algo único, adictivo y educativo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 border border-ink-100 hover:border-ink-200 transition-all hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-ink-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-ink-900 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-ink-300 max-w-2xl mx-auto">
              Tres pasos simples para poner a prueba tu conocimiento literario.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Lee el párrafo',
                description: 'Te mostramos el primer párrafo de una obra literaria icónica. Sin contexto, sin pistas.',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Adivina la obra',
                description: 'Elige entre 4 opciones. ¿Reconoces el estilo? ¿Recuerdas la historia?',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Compite y mejora',
                description: 'Acumula puntos, desbloquea logros y sube en el ranking global de lectores.',
                icon: Trophy,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="text-6xl font-serif font-bold text-ink-700 mb-4">{item.step}</div>
                <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-ink-900" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                    <ChevronRight className="w-8 h-8 text-ink-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-ink-900 mb-4">
              Lo que dicen los <span className="gold-gradient">lectores</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-ink-100 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-sm">{t.name}</div>
                    <div className="text-xs text-ink-400">{t.role}</div>
                  </div>
                </div>
                <p className="text-ink-600 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
                ¿Listo para el desafío?
              </h2>
              <p className="text-lg text-ink-300 mb-8 max-w-xl mx-auto">
                Únete a miles de lectores que ya están poniendo a prueba su conocimiento. 
                Gratis, sin registro, al instante.
              </p>
              <Link 
                href="/jugar"
                className="inline-flex items-center gap-3 bg-gold-500 text-ink-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gold-400 transition-all hover:shadow-xl hover:shadow-gold-500/30 active:scale-95"
              >
                <Zap className="w-5 h-5" />
                Jugar Ahora — Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-ink-400">
                No necesitas cuenta. Solo tu amor por los libros.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-950 text-ink-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-ink-900" />
              </div>
              <span className="font-serif font-semibold text-ink-200">JuegosLiterarios.com</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/jugar" className="hover:text-white transition-colors">Jugar</Link>
              <Link href="/leaderboard" className="hover:text-white transition-colors">Ranking</Link>
              <span className="text-ink-600">© 2026 JuegosLiterarios</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
