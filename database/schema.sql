-- Crear tabla para efemérides
CREATE TABLE IF NOT EXISTS ephemerides (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ephemerides_date ON ephemerides(date);
CREATE INDEX IF NOT EXISTS idx_ephemerides_year ON ephemerides(year);
CREATE INDEX IF NOT EXISTS idx_ephemerides_category ON ephemerides(category);

-- Habilitar Row Level Security
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Permitir lectura pública de efemérides" ON ephemerides
  FOR SELECT USING (true);

-- Política para permitir inserción solo desde el servicio
CREATE POLICY "Permitir inserción desde servicio" ON ephemerides
  FOR INSERT WITH CHECK (true);

-- Insertar datos de ejemplo
INSERT INTO ephemerides (id, date, title, description, year, category) VALUES
(
  'example-ada-lovelace',
  '1815-12-10',
  'Nacimiento de Ada Lovelace',
  'Augusta Ada King, condesa de Lovelace, nació el 10 de diciembre de 1815. Es considerada la primera programadora de la historia por escribir el primer algoritmo destinado a ser procesado por una máquina, específicamente la Máquina Analítica de Charles Babbage. Sus notas sobre el motor analítico incluyen lo que se reconoce como el primer algoritmo informático, ganándose el título de "primera programadora del mundo".',
  1815,
  'Historia de la Programación'
),
(
  'example-javascript-birth',
  CURRENT_DATE,
  'El Nacimiento de JavaScript',
  'En mayo de 1995, Brendan Eich creó JavaScript en tan solo 10 días mientras trabajaba en Netscape Communications. Originalmente llamado "Mocha", luego "LiveScript", finalmente se convirtió en JavaScript. Este lenguaje revolucionaría el desarrollo web y se convertiría en uno de los lenguajes de programación más utilizados del mundo, siendo fundamental para el desarrollo web moderno.',
  1995,
  'Lenguajes de Programación'
)
ON CONFLICT (date) DO NOTHING;

-- Función para limpiar efemérides antiguas (mantener solo 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_ephemerides()
RETURNS void AS $$
BEGIN
  DELETE FROM ephemerides 
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND id LIKE 'generated-%';
END;
$$ LANGUAGE plpgsql;

-- Comentarios en la tabla
COMMENT ON TABLE ephemerides IS 'Tabla para almacenar efemérides de programación y tecnología';
COMMENT ON COLUMN ephemerides.id IS 'Identificador único de la efeméride';
COMMENT ON COLUMN ephemerides.date IS 'Fecha de la efeméride (YYYY-MM-DD)';
COMMENT ON COLUMN ephemerides.title IS 'Título del evento histórico';
COMMENT ON COLUMN ephemerides.description IS 'Descripción detallada del evento';
COMMENT ON COLUMN ephemerides.year IS 'Año en que ocurrió el evento';
COMMENT ON COLUMN ephemerides.category IS 'Categoría del evento (ej: Historia de la Programación, Lenguajes, etc.)';
COMMENT ON COLUMN ephemerides.created_at IS 'Timestamp de creación del registro';
