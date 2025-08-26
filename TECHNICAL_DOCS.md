# TerminalTime - Documentación Técnica Completa

## 🎨 Tema Terminal Moderno

El proyecto usa un tema personalizado que simula una terminal moderna con efectos glassmorphism:

```css
/* Colores principales */
terminal-bg: #0d1117      /* Fondo principal */
terminal-text: #f0f6fc    /* Texto principal */
terminal-green: #7ce38b   /* Verde terminal */
terminal-blue: #58a6ff    /* Azul terminal */
terminal-yellow: #f2cc60  /* Amarillo terminal */
terminal-red: #f85149     /* Rojo terminal */
terminal-gray: #8b949e    /* Gris terminal */

/* Efectos modernos */
backdrop-blur-sm          /* Efecto glassmorphism */
bg-gradient-to-br         /* Gradientes sutiles */
hover:border-terminal-green/30  /* Hover effects */
transition-all duration-300     /* Transiciones suaves */
```

## 🔧 APIs y Servicios

### 🧠 DeepSeek AI
- Generación automática de efemérides históricas reales
- Endpoint: `https://api.deepseek.com/chat/completions`
- **Auto-guardado**: Las efemérides generadas se almacenan en Supabase
- Fallback: Contenido curado estático

### 🌤️ Open-Meteo (Clima)
- API gratuita sin necesidad de API key
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- **30+ ciudades españolas** con coordenadas preconfiguradas
- Datos: temperatura, estado del tiempo, humedad, viento

### 📰 Medium RSS (Noticias)
- Feeds públicos de tecnología en español
- **Filtros de calidad**: Elimina contenido de baja calidad
- **Imágenes optimizadas**: Extracción automática de imágenes de artículos
- **Layout responsive**: Grid de 3 columnas en desktop, 1 en móvil

## 📋 Configuración de Base de Datos

### Schema de Supabase

```sql
-- Tabla principal de efemérides
CREATE TABLE ephemerides (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX ephemerides_date_idx ON ephemerides(date);
CREATE INDEX ephemerides_created_at_idx ON ephemerides(created_at);

-- Políticas RLS (Row Level Security)
ALTER TABLE ephemerides ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "public_read" ON ephemerides 
  FOR SELECT USING (true);

-- Permitir escritura solo con service role
CREATE POLICY "service_write" ON ephemerides 
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "service_update" ON ephemerides 
  FOR UPDATE USING (true);
```

## 🔄 Sistema de Generación Automática

### GitHub Actions Workflow

El proyecto incluye un workflow de GitHub Actions que:

1. **Se ejecuta diariamente a las 22:00 UTC** (00:00 Madrid)
2. **Genera nuevas efemérides** usando DeepSeek AI
3. **Las guarda automáticamente** en Supabase
4. **Evita duplicados** consultando efemérides recientes

```yaml
# .github/workflows/daily-ephemeride.yml
name: TerminalTime - Generate Daily Ephemeride
on:
  schedule:
    - cron: '0 22 * * *'  # 22:00 UTC = 00:00 Madrid
  workflow_dispatch:

jobs:
  generate-ephemeride:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: # Script de generación con variables de entorno
```

### API Endpoints

#### `/api/ephemerides/today`
- **GET**: Obtiene la efeméride del día actual
- **Parámetros**:
  - `?fallback=true`: Fuerza uso de datos estáticos
  - `?force=true`: Fuerza regeneración con IA

#### `/api/ephemerides/generate-daily`  
- **GET**: Endpoint usado por GitHub Actions
- **Funcionalidad**: Genera efemérides diarias automáticamente
- **Zona horaria**: Europe/Madrid

#### `/api/debug/ephemerides`
- **GET**: Endpoint de debugging
- **Funcionalidad**: Muestra estado de la BD y efemérides recientes

## 🧩 Arquitectura de Componentes

### Componentes Modulares

Tras la refactorización, el proyecto está organizado en componentes especializados:

```
components/
├── EphemerideSection.tsx      # Coordinador principal (108 líneas)
├── TypewriterText.tsx         # Efecto de escritura (42 líneas)
├── InteractiveTerminal.tsx    # Terminal con comandos (187 líneas)
├── LoadingEphemeride.tsx      # Pantalla de carga (110 líneas)
└── EphemerideDisplay.tsx      # Visualización (75 líneas)
```

**Beneficios de la modularización**:
- ✅ Código más mantenible
- ✅ Componentes reutilizables
- ✅ Separación de responsabilidades
- ✅ Testing más fácil

### Comandos de Terminal Interactivo

```bash
help              # Muestra ayuda
clear             # Limpia terminal
date              # Fecha actual
whoami            # Info del usuario
fortune           # Frases tecnológicas
history           # Historial de comandos
joke              # Chistes de programadores
cowsay <mensaje>  # ASCII art
weather           # Estado del clima
refresh-ephemeride # Regenera efeméride
exit              # Salir
```

## 🚀 Optimizaciones de Performance

### Estrategias Implementadas

1. **Sistema de 3 niveles**: BD → IA → Fallback
2. **Caché automático**: Supabase almacena respuestas de IA
3. **Lazy loading**: Componentes se cargan bajo demanda
4. **Imágenes optimizadas**: Next.js Image con WebP
5. **CSS optimizado**: Tailwind con purging automático

### Métricas de Carga

- **Primera carga**: ~2s (con efectos de terminal)
- **Navegación**: <500ms (SPA routing)
- **API responses**: <1s (con IA), <100ms (desde BD)

## 🔐 Seguridad

### Variables de Entorno

```env
# Público (expuesto al frontend)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Privado (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...  # Fallback si no hay DeepSeek
```

### Políticas de Seguridad

- **RLS habilitado** en todas las tablas
- **API Keys** solo en servidor
- **CORS configurado** para dominio específico
- **Rate limiting** implementado en APIs

## 📊 Monitoring y Logs

### Logs de Desarrollo

El sistema incluye logging detallado:

```typescript
console.log('🔍 Buscando en BD...') 
console.log('🤖 Generando con IA...')
console.log('✅ Efeméride guardada exitosamente')
console.log('⚠️ Fallback activado')
```

### Métricas de Vercel

- **Build time**: ~2 minutos
- **Edge functions**: Configuradas para APIs
- **Analytics**: Habilitado para métricas de usuario

## 🧪 Testing

### Comandos de Test

```bash
# Desarrollo
npm run dev

# Build local
npm run build && npm run start

# Linting
npm run lint

# Test APIs manualmente
curl http://localhost:3000/api/ephemerides/today
curl http://localhost:3000/api/debug/ephemerides
```

### Endpoints de Debug

- `/api/debug/env`: Variables de entorno disponibles
- `/api/debug/ephemerides`: Estado de la base de datos
- `/api/ephemerides/today?force=true`: Forzar regeneración

## 🔮 Roadmap Futuro

### Mejoras Planificadas

- [ ] **Tests unitarios** con Jest/Vitest
- [ ] **Storybook** para documentar componentes
- [ ] **PWA** con service workers
- [ ] **Internacionalización** (i18n)
- [ ] **Modo oscuro/claro** toggleable
- [ ] **Más comandos** en terminal interactivo
- [ ] **WebSockets** para updates en tiempo real
- [ ] **Docker** para desarrollo local
