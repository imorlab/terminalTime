# TerminalTime ⏰

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimorlab%2FterminalTime)

Historia de la programación en tu terminal. Una aplicación web que muestra efemérides de programación, noticias tech y información del clima en una interfaz terminal minimalista.

## ✨ Características

- **🗓️ Historia Diaria**: Efemérides de programación y tecnología para cada día
- **🌤️ Información del Clima**: Datos meteorológicos en tiempo real con geolocalización  
- **📰 Noticias Tech en Español**: Últimas noticias de tecnología con RSS y contenido curado
- **💻 Interfaz Terminal**: UI minimalista que simula una terminal de comandos
- **🤖 IA con DeepSeek**: Generación automática de efemérides personalizadas
- **📱 Responsive**: Diseño adaptativo para todos los dispositivos
- **🔄 Auto-refresh**: Las efemérides se actualizan automáticamente cada día

## 🎯 Tagline
> "Historia de la programación en tu terminal"

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS con tema terminal personalizado
- **Base de datos**: Supabase (PostgreSQL) - Opcional
- **APIs**: DeepSeek AI, Open-Meteo (clima), Menéame RSS (noticias)
- **Iconos**: Lucide React
- **Despliegue**: Vercel
- **CI/CD**: GitHub Actions

## 🚀 Despliegue Rápido

### ⚡ Deploy en 1 click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimorlab%2FterminalTime)

### 🔑 Variables de entorno necesarias

Solo necesitas **una variable** para funcionalidad completa:

```bash
DEEPSEEK_API_KEY=tu_deepseek_api_key_aqui
```

**¿Sin API key?** ¡No problem! La app funciona con contenido de ejemplo.

## 🏃‍♂️ Desarrollo Local

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- API Key de DeepSeek (opcional)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/imorlab/terminalTime.git
   cd terminalTime
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
   OPENAI_API_KEY=tu_openai_api_key
   OPENWEATHER_API_KEY=tu_openweather_api_key
   NEWS_API_KEY=tu_news_api_key
   ```

4. **Configura la base de datos**
   
   Crea la tabla en Supabase:
   ```sql
   CREATE TABLE ephemerides (
     id TEXT PRIMARY KEY,
     date DATE NOT NULL,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     year INTEGER NOT NULL,
     category TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── ephemerides/
│   │   │   └── today/
│   │   ├── weather/
│   │   └── news/
│   │       └── tech/
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página principal
├── components/                 # Componentes React
│   ├── TerminalHeader.tsx      # Header de la terminal
│   ├── CommandLine.tsx         # Línea de comandos
│   ├── EphemerideSection.tsx   # Sección de efemérides
│   ├── WeatherSection.tsx      # Sección del clima
│   ├── NewsSection.tsx         # Sección de noticias
│   └── LoadingSpinner.tsx      # Spinner de carga
```

## 🎨 Tema Terminal

El proyecto usa un tema personalizado que simula una terminal:

```css
terminal-bg: #0d1117      /* Fondo principal */
terminal-text: #f0f6fc    /* Texto principal */
terminal-green: #7ce38b   /* Verde terminal */
terminal-blue: #58a6ff    /* Azul terminal */
terminal-yellow: #f2cc60  /* Amarillo terminal */
terminal-red: #f85149     /* Rojo terminal */
terminal-gray: #8b949e    /* Gris terminal */
```

## 🔧 APIs Utilizadas

### OpenAI
- Generación automática de efemérides
- Endpoint: `https://api.openai.com/v1/chat/completions`

### OpenWeatherMap
- Datos meteorológicos en tiempo real
- Endpoint: `https://api.openweathermap.org/data/2.5/weather`

### NewsAPI
- Noticias de tecnología
- Endpoint: `https://newsapi.org/v2/everything`

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno en Vercel**
3. **Despliega automáticamente**

### GitHub Actions

El proyecto incluye un workflow para automatización:

```yaml
# .github/workflows/daily-ephemeride.yml
name: Generate Daily Ephemeride
on:
  schedule:
    - cron: '0 6 * * *'  # Diario a las 6:00 AM UTC
```

## 📊 Características Técnicas

- **SSR y SSG**: Optimizado para SEO
- **API Routes**: Backend integrado con Next.js
- **TypeScript**: Tipado fuerte en todo el proyecto
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Funciona sin JavaScript
- **Error Handling**: Manejo robusto de errores
- **Loading States**: Estados de carga elegantes

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

Creado con ❤️ para la comunidad dev

---

⭐ ¡Dale una estrella si te gustó TerminalTime!
