-- JuegosLiterarios.com - Database Schema
-- Compatible with PostgreSQL (Supabase) and SQLite

-- =====================================================
-- 1. PLAYERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    total_games INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    average_score DECIMAL(10,2) DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played TIMESTAMP WITH TIME ZONE,
    country VARCHAR(100),
    language VARCHAR(10) DEFAULT 'es'
);

CREATE INDEX idx_players_best_score ON players(best_score DESC);
CREATE INDEX idx_players_total_games ON players(total_games DESC);

-- =====================================================
-- 2. GAMES TABLE (Individual game sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('facil', 'medio', 'dificil')),
    score INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 10,
    accuracy_rate DECIMAL(5,2) DEFAULT 0,
    total_time DECIMAL(10,2) DEFAULT 0,
    average_time DECIMAL(10,2) DEFAULT 0,
    streak INTEGER DEFAULT 0,
    power_ups_used INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_games_player ON games(player_id);
CREATE INDEX idx_games_score ON games(score DESC);
CREATE INDEX idx_games_created ON games(created_at DESC);

-- =====================================================
-- 3. GAME_ANSWERS TABLE (Individual question responses)
-- =====================================================
CREATE TABLE IF NOT EXISTS game_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    selected_answer INTEGER,
    correct_answer INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken DECIMAL(10,2) DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    power_up_used VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_answers_game ON game_answers(game_id);

-- =====================================================
-- 4. QUESTIONS TABLE (Master question bank)
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    paragraph TEXT NOT NULL,
    option_1 VARCHAR(255) NOT NULL,
    option_2 VARCHAR(255) NOT NULL,
    option_3 VARCHAR(255) NOT NULL,
    option_4 VARCHAR(255) NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('facil', 'medio', 'dificil')),
    author VARCHAR(255) NOT NULL,
    year INTEGER,
    genre VARCHAR(100),
    language VARCHAR(50),
    country VARCHAR(100),
    source_book VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    times_used INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_genre ON questions(genre);
CREATE INDEX idx_questions_active ON questions(is_active);

-- =====================================================
-- 5. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    condition_value INTEGER NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('comun', 'raro', 'epico', 'legendario')),
    points_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. PLAYER_ACHIEVEMENTS TABLE (Unlocked achievements)
-- =====================================================
CREATE TABLE IF NOT EXISTS player_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, achievement_id)
);

CREATE INDEX idx_player_achievements ON player_achievements(player_id);

-- =====================================================
-- 7. LEADERBOARD VIEW (Weekly/Monthly/Daily)
-- =====================================================
CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT 
    p.id,
    p.name,
    p.avatar_url,
    COUNT(g.id) as games_played,
    MAX(g.score) as best_score,
    AVG(g.score) as average_score,
    SUM(g.correct_answers) as total_correct,
    SUM(g.total_questions) as total_questions,
    ROUND(AVG(g.accuracy_rate), 2) as accuracy_rate
FROM players p
LEFT JOIN games g ON p.id = g.player_id
WHERE g.created_at >= NOW() - INTERVAL '7 days'
GROUP BY p.id, p.name, p.avatar_url
ORDER BY best_score DESC;

CREATE OR REPLACE VIEW leaderboard_monthly AS
SELECT 
    p.id,
    p.name,
    p.avatar_url,
    COUNT(g.id) as games_played,
    MAX(g.score) as best_score,
    AVG(g.score) as average_score,
    SUM(g.correct_answers) as total_correct,
    SUM(g.total_questions) as total_questions,
    ROUND(AVG(g.accuracy_rate), 2) as accuracy_rate
FROM players p
LEFT JOIN games g ON p.id = g.player_id
WHERE g.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.name, p.avatar_url
ORDER BY best_score DESC;

CREATE OR REPLACE VIEW leaderboard_all_time AS
SELECT 
    p.id,
    p.name,
    p.avatar_url,
    p.total_games,
    p.best_score,
    p.average_score,
    p.total_correct,
    p.total_questions,
    p.accuracy_rate
FROM players p
ORDER BY p.best_score DESC;

-- =====================================================
-- 8. INSERT DEFAULT ACHIEVEMENTS
-- =====================================================
INSERT INTO achievements (id, title, description, icon, condition_type, condition_value, rarity, points_reward) VALUES
('primer_acierto', 'Primer Paso', 'Acierta tu primera pregunta', '🎯', 'correct_answers', 1, 'comun', 10),
('racha_5', 'En Racha', 'Acierta 5 preguntas seguidas', '🔥', 'streak', 5, 'raro', 50),
('racha_10', 'Imparable', 'Acierta 10 preguntas seguidas', '⚡', 'streak', 10, 'epico', 100),
('maestro', 'Maestro Literario', 'Obtén 1500+ puntos en una partida', '👑', 'score', 1500, 'legendario', 200),
('velocidad', 'Velocista', 'Responde correctamente en menos de 3 segundos', '💨', 'fast_answer', 3, 'raro', 30),
('perfecto', 'Partida Perfecta', 'Acierta todas las preguntas de una partida', '💎', 'perfect_game', 10, 'legendario', 300),
('experto', 'Experto', 'Juega en modo difícil', '🧠', 'difficulty_hard', 1, 'raro', 50),
('coleccionista', 'Coleccionista', 'Acierta preguntas de 10 autores diferentes', '📚', 'unique_authors', 10, 'epico', 100),
('veterano', 'Veterano', 'Juega 10 partidas', '🏆', 'total_games', 10, 'epico', 150),
('nocturno', 'Lector Nocturno', 'Juega después de las 10 PM', '🌙', 'hour_night', 22, 'comun', 10),
('madrugador', 'Madrugador', 'Juega antes de las 7 AM', '🌅', 'hour_morning', 7, 'comun', 10),
('clasico', 'Clásico', 'Acierta 5 preguntas de clásicos españoles', '🏛️', 'classics', 5, 'raro', 40);

-- =====================================================
-- 9. FUNCTIONS
-- =====================================================

-- Function to update player stats after a game
CREATE OR REPLACE FUNCTION update_player_stats(p_player_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE players
    SET 
        total_games = (SELECT COUNT(*) FROM games WHERE player_id = p_player_id),
        total_score = (SELECT COALESCE(SUM(score), 0) FROM games WHERE player_id = p_player_id),
        best_score = (SELECT COALESCE(MAX(score), 0) FROM games WHERE player_id = p_player_id),
        average_score = (SELECT COALESCE(AVG(score), 0) FROM games WHERE player_id = p_player_id),
        total_correct = (SELECT COALESCE(SUM(correct_answers), 0) FROM games WHERE player_id = p_player_id),
        total_questions = (SELECT COALESCE(SUM(total_questions), 0) FROM games WHERE player_id = p_player_id),
        accuracy_rate = (SELECT COALESCE(AVG(accuracy_rate), 0) FROM games WHERE player_id = p_player_id),
        best_streak = (SELECT COALESCE(MAX(streak), 0) FROM games WHERE player_id = p_player_id),
        last_played = NOW()
    WHERE id = p_player_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get player rank
CREATE OR REPLACE FUNCTION get_player_rank(p_player_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_rank INTEGER;
BEGIN
    SELECT rank INTO v_rank
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY best_score DESC) as rank
        FROM players
    ) ranked
    WHERE id = p_player_id;

    RETURN COALESCE(v_rank, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment to insert sample questions:
/*
INSERT INTO questions (paragraph, option_1, option_2, option_3, option_4, correct_answer, difficulty, author, year, genre, language, country, source_book) VALUES
('En un lugar de la Mancha...', 'Don Quijote', 'Lazarillo', 'Celestina', 'Conde Lucanor', 0, 'facil', 'Cervantes', 1605, 'Clásico español', 'Español', 'España', 'Don Quijote de la Mancha');
*/

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) - For Supabase
-- =====================================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own data" ON players
    FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Players can update own data" ON players
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Games are readable by all" ON games
    FOR SELECT USING (true);

CREATE POLICY "Players can insert own games" ON games
    FOR INSERT WITH CHECK (auth.uid() = player_id OR auth.uid() IS NULL);

CREATE POLICY "Answers are readable by all" ON game_answers
    FOR SELECT USING (true);

CREATE POLICY "Players can insert own answers" ON game_answers
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM games WHERE games.id = game_answers.game_id AND (games.player_id = auth.uid() OR auth.uid() IS NULL)));
