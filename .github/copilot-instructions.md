# Copilot Instructions para TerminalTime

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexto del Proyecto

TerminalTime es una aplicación web que muestra efemérides de programación, noticias tech y información del clima en una interfaz que simula una terminal. La tagline es "Historia de la programación en tu terminal".

## Stack Tecnológico

- **Frontend**: Next.js 15 con App Router, React 18, TypeScript
- **Estilos**: Tailwind CSS con tema terminal personalizado
- **Base de datos**: Supabase (PostgreSQL)
- **APIs externas**: OpenAI, OpenWeatherMap, NewsAPI
- **Despliegue**: Vercel
- **CI/CD**: GitHub Actions

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/               # API routes
│   │   ├── ephemerides/
│   │   ├── weather/
│   │   └── news/
│   ├── globals.css        # Estilos globales con tema terminal
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
└── components/            # Componentes React
    ├── TerminalHeader.tsx
    ├── CommandLine.tsx
    ├── EphemerideSection.tsx
    ├── WeatherSection.tsx
    ├── NewsSection.tsx
    └── LoadingSpinner.tsx
```

## Estilo de Código

### Componentes React
- Usar TypeScript con tipos explícitos
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Exportar como default al final del archivo

### Estilos
- Usar clases de Tailwind CSS
- Seguir el tema terminal personalizado:
  - `terminal-bg`: Fondo principal (#0d1117)
  - `terminal-text`: Texto principal (#f0f6fc)
  - `terminal-green`: Verde terminal (#7ce38b)
  - `terminal-blue`: Azul terminal (#58a6ff)
  - `terminal-yellow`: Amarillo terminal (#f2cc60)
  - `terminal-red`: Rojo terminal (#f85149)
  - `terminal-gray`: Gris terminal (#8b949e)

### APIs
- Usar App Router de Next.js 13+
- Manejar errores apropiadamente
- Validar parámetros de entrada
- Retornar JSON consistente

### Base de Datos
- Tabla `ephemerides` con campos:
  - `id`: string (PK)
  - `date`: date
  - `title`: string
  - `description`: text
  - `year`: integer
  - `category`: string
  - `created_at`: timestamp

## Patrones de Diseño

### Estados de Carga
- Mostrar spinners o skeleton loaders
- Usar datos de ejemplo como fallback
- Manejar errores graciosamente

### Terminal UI
- Simular líneas de comando con prompts
- Usar iconos ASCII y emojis
- Animaciones de cursor parpadeante
- Colores temáticos de terminal

### Responsividad
- Mobile-first approach
- Grid layouts para desktop
- Stack layouts para móvil

## Reglas de Desarrollo

1. **Siempre tipea las props y estados**
2. **Usa nombres descriptivos para variables y funciones**
3. **Mantén componentes pequeños y focalizados**
4. **Maneja todos los estados: loading, error, success**
5. **Usa el tema terminal consistentemente**
6. **Implementa Progressive Enhancement**
7. **Optimiza para SEO con metadata apropiada**

## Comandos Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENWEATHER_API_KEY=
NEWS_API_KEY=
```
