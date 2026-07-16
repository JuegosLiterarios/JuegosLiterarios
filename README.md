# JuegosLiterarios.com - MVP Completo

## 🎮 ¿Qué es esto?

Un juego de trivia literaria competitivo donde lees primeros párrafos de obras icónicas y adivinas de qué libro se trata. Con sistema de puntuación, power-ups, logros, ranking global y 50+ preguntas.

## 📁 Estructura del Proyecto

```
juegosliterarios-mvp/
├── package.json              # Dependencias
├── tsconfig.json             # Config TypeScript
├── next.config.mjs           # Config Next.js (static export)
├── tailwind.config.ts        # Config Tailwind CSS
├── postcss.config.mjs        # Config PostCSS
├── next-env.d.ts             # Types Next.js
├── sql/
│   └── schema.sql            # Esquema PostgreSQL/Supabase
├── public/
│   └── sounds/               # Carpeta para efectos de sonido
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout raíz con fuentes
│   │   ├── page.tsx          # Landing page (Home)
│   │   ├── globals.css       # Estilos globales + Tailwind
│   │   ├── jugar/
│   │   │   └── page.tsx      # Juego completo
│   │   └── leaderboard/
│   │       └── page.tsx      # Ranking global
│   ├── components/           # Componentes reutilizables
│   ├── data/
│   │   └── preguntas.ts      # 50+ preguntas organizadas
│   ├── lib/
│   │   ├── utils.ts          # Utilidades (puntuación, formateo)
│   │   └── logros.ts         # Sistema de logros
│   └── types/
│       └── game.ts           # Tipos TypeScript
```

## 🚀 Instalación y Despliegue

### Paso 1: Instalar dependencias
```bash
cd juegosliterarios-mvp
npm install
```

### Paso 2: Desarrollo local
```bash
npm run dev
```
Abre http://localhost:3000

### Paso 3: Build para producción (Static Export)
```bash
npm run build
```
Esto genera una carpeta `dist/` con archivos estáticos listos para cualquier hosting.

### Paso 4: Desplegar en Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login (primera vez)
vercel login

# Desplegar
vercel --prod
```

### Alternativa: Desplegar en Netlify
```bash
# Build primero
npm run build

# Luego subir la carpeta dist/ a Netlify manualmente
# o usar Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Alternativa: Desplegar en GitHub Pages
```bash
# Build
npm run build

# Copiar dist/ a docs/ (para GitHub Pages)
cp -r dist docs

# Commit y push
git add docs
git commit -m "Deploy to GitHub Pages"
git push
```

## 🎨 Características Implementadas

### Landing Page (Home)
- ✅ Diseño atractivo con animaciones Framer Motion
- ✅ Estadísticas visuales (50+ obras, 3 niveles, 12 logros)
- ✅ Preview interactivo del juego
- ✅ Grid de características (6 cards)
- ✅ Testimonios ficticios
- ✅ CTA final con gradiente
- ✅ Navegación sticky con scroll

### Juego (jugar/page.tsx)
- ✅ **3 niveles de dificultad**: Fácil, Medio, Difícil
- ✅ **50+ preguntas** organizadas por género, autor, país, idioma
- ✅ **Sistema de vidas**: 3 corazones, pierdes uno por error
- ✅ **Temporizador**: 30 segundos por pregunta con barra visual
- ✅ **Bonus por velocidad**: Más rápido = más puntos
- ✅ **Sistema de rachas**: Multiplicadores por aciertos consecutivos
- ✅ **3 Power-ups**:
  - 50/50: Elimina 2 opciones incorrectas (2 usos)
  - +15 segundos: Añade tiempo extra (1 uso)
  - Saltar: Pasa a la siguiente pregunta (1 uso)
- ✅ **Pantalla de resultados** con:
  - Puntuación total
  - Título de rango (Novato → Maestro Literario)
  - Estadísticas detalladas (aciertos, precisión, promedio)
  - Revisión de respuestas
  - Botón para compartir en redes
  - Botón para jugar otra vez
- ✅ **Sistema de logros**: 12 logros desbloqueables
- ✅ **Leaderboard local**: Guardado en localStorage
- ✅ **Animaciones**: Transiciones entre preguntas, feedback visual

### Ranking (leaderboard/page.tsx)
- ✅ Filtros por dificultad (Todos, Fácil, Medio, Difícil)
- ✅ Filtros por tiempo (Siempre, Esta semana, Hoy)
- ✅ Estadísticas resumen (jugadores, mejor puntaje, promedio)
- ✅ Top 50 con avatares generados automáticamente
- ✅ Medallas para top 3 (oro, plata, bronce)

### Base de Datos (sql/schema.sql)
- ✅ Esquema completo PostgreSQL/Supabase
- ✅ Tablas: players, games, game_answers, questions, achievements, player_achievements
- ✅ Vistas: leaderboard_weekly, leaderboard_monthly, leaderboard_all_time
- ✅ Funciones: update_player_stats, get_player_rank
- ✅ Row Level Security (RLS) para Supabase
- ✅ 12 logros predefinidos

## 🎯 Preguntas Incluidas (50+)

Organizadas por categorías:
- **Clásicos españoles**: Cervantes, Quevedo, Calderón, Rojas
- **Realismo mágico**: García Márquez, Rulfo, Cortázar, Borges, Fuentes
- **Clásicos universales**: Orwell, Bradbury, Dostoyevski, Kafka, Wilde, Saint-Exupéry, Eco, Dante, Homero
- **Literatura moderna**: Du Maurier, Woolf, Nabokov, Sartre, Hemingway, Fitzgerald, Salinger, Walker
- **Literatura infantil/juvenil**: Carroll, Rowling, Tolkien, Lewis, Tolstói
- **Literatura chilena**: Donoso
- **Contemporánea**: Ruiz Zafón, Cabrera Infante
- **Filosofía**: Foucault, Rousseau

## 📊 Sistema de Puntuación

| Acción | Puntos |
|--------|--------|
| Respuesta correcta base | 100 pts |
| Bonus velocidad (Fácil) | Hasta 30 pts |
| Bonus velocidad (Medio) | Hasta 50 pts |
| Bonus velocidad (Difícil) | Hasta 80 pts |
| Racha x2 | +15 pts |
| Racha x3 | +30 pts |
| Racha x5 | +50 pts |
| Racha x7 | +70 pts |
| Racha x10 | +100 pts |

## 🏆 Rangos

| Puntos | Título | Emoji |
|--------|--------|-------|
| 1500+ | Maestro Literario | 👑 |
| 1200+ | Erudito | 🎓 |
| 900+ | Lector Experto | 📚 |
| 600+ | Aficionado | 📖 |
| 300+ | Principiante | 🌱 |
| <300 | Novato | 🐣 |

## 🔧 Stack Tecnológico

- **Next.js 14** (App Router, Static Export)
- **TypeScript** (tipado estricto)
- **Tailwind CSS** (diseño responsive)
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **localStorage** (persistencia local)
- **Supabase** (listo para backend futuro)

## 📝 Próximos Pasos (V1.1+)

1. **Backend Supabase**: Conectar la base de datos SQL incluida
2. **Autenticación**: Login con Google/GitHub/Email
3. **Más preguntas**: Expandir a 200+ obras
4. **Modos de juego**: Por género, por autor, modo contrarreloj
5. **Multiplayer**: Partidas en tiempo real
6. **API REST**: Endpoints para integraciones
7. **PWA**: Instalable como app móvil
8. **Sonidos**: Efectos de acierto/error (carpeta public/sounds/)

## 🎨 Personalización

### Colores (tailwind.config.ts)
- **Parchment**: Tonos crema/papel para fondo
- **Ink**: Tonos negro/gris para texto
- **Gold**: Tonos dorado para acentos

### Fuentes
- **Playfair Display**: Títulos y párrafos literarios
- **Inter**: UI y texto general
- **JetBrains Mono**: Datos numéricos

## 📱 Responsive

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons (min 44px)
- Optimizado para jugar en móvil

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "TypeScript errors"
```bash
npx tsc --noEmit
# Corregir errores mostrados
```

### Error: "Build fails"
```bash
# Verificar next.config.mjs tiene output: 'export'
# Verificar que no hay imports dinámicos problemáticos
npm run build 2>&1 | head -50
```

## 📄 Licencia

MIT - Libre para uso personal y comercial.

## 🤝 Créditos

Desarrollado para JuegosLiterarios.com
- 50+ obras literarias curadas
- Diseño competitivo y atractivo
- Listo para escalar a producción

---

**¿Preguntas?** Abre un issue o revisa la documentación de Next.js y Tailwind CSS.
