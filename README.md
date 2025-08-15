# TerminalTime ⏰

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimorlab%2FterminalTime)

Historia de la programación en tu terminal. Una aplicación web que muestra efemérides de programación, noticias tech y información del clima en una interfaz terminal minimalista.

## 🌐 **APLICACIÓN LIVE**

🚀 **URL Principal**: https://terminal-time.vercel.app

📱 **URLs Importantes**:
- **🌍 Aplicación**: https://terminal-time.vercel.app
- **🔍 Dashboard**: https://vercel.com/imorlabs-projects/terminal-time/wn5hCN32omHP8jZSrW2D9drLepkA
- **⚙️ Settings**: https://vercel.com/imorlabs-projects/terminal-time/settings
- **📊 Analytics**: https://vercel.com/imorlabs-projects/terminal-time/analytics

## ✨ Características

- **🗓️ Historia Diaria**: Efemérides de programación y tecnología para cada día con aspecto de terminal integrado
- **🌤️ Clima Inteligente**: Selector de 30 ciudades españolas con datos meteorológicos en tiempo real (columna lateral)
- **📰 Noticias Tech**: Agregador de Medium RSS con filtros de calidad avanzados e imágenes optimizadas
- **💻 Interfaz Terminal Moderna**: Layout 10/2 columnas - terminal principal (83%) y clima lateral (17%)
- **🤖 IA con DeepSeek**: Generación automática de efemérides personalizadas con parsing JSON mejorado
- **📱 Diseño Responsivo**: Layout adaptativo - terminal ocupa 10 cols, clima 2 cols en desktop
- **🎨 Efectos Visuales**: Hover effects, transiciones suaves y micro-animaciones estilo terminal
- **🔄 Auto-refresh**: Las efemérides se actualizan automáticamente cada día
- **🏙️ Selector de Ciudades**: Dropdown elegante con 30 ciudades principales de España
- **⚡ Mock Data**: Funcionalidad completa incluso sin APIs configuradas

## 🎯 Tagline
> "Historia de la programación en tu terminal"

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS con tema terminal personalizado + efectos glassmorphism
- **Base de datos**: Supabase (PostgreSQL) - Opcional
- **APIs**: DeepSeek AI, Medium RSS (noticias tech), Open-Meteo (clima)
- **Iconos**: Lucide React con animaciones
- **Despliegue**: Vercel
- **CI/CD**: GitHub Actions

## 🚀 Despliegue Rápido

### ⚡ Deploy en 1 click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimorlab%2FterminalTime)

### 🌍 **O visita la aplicación live:**
**https://terminal-time.vercel.app**

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
   # IA para generación de efemérides (recomendado)
   DEEPSEEK_API_KEY=tu_deepseek_api_key_aqui
   
   # Base de datos (opcional - funciona con mock data)
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
   
   # Clima (opcional - tiene fallback)
   OPENWEATHER_API_KEY=tu_openweather_api_key
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
│   ├── WeatherSection.tsx      # Sección del clima con selector de ciudades
│   ├── NewsSection.tsx         # Grid de noticias en 3 columnas
│   ├── LoadingSpinner.tsx      # Spinner de carga
│   └── Footer.tsx              # Footer de la aplicación
```

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

### 🎭 Componentes Estilizados

- **WeatherSection**: Glassmorphism con animaciones de hover
- **NewsSection**: Grid responsivo con cards individuales
- **EphemerideSection**: Layout integrado con mejor tipografía
- **Dropdowns**: Efectos de hover y transiciones elegantes

## 🔧 APIs y Servicios

### 🧠 DeepSeek AI
- Generación automática de efemérides personalizadas
- Endpoint: `https://api.deepseek.com/chat/completions`
- Fallback: Contenido curado estático

### 🌤️ Open-Meteo (Clima)
- Datos meteorológicos gratuitos y precisos
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Soporte para 30 ciudades españolas

### 📰 Medium RSS (Noticias)
- Feeds RSS de Medium por categorías técnicas
- Endpoints: `https://medium.com/feed/topic/{categoria}`
- Filtros de calidad: solo contenido técnico en inglés
- Detección automática de spam y números de teléfono
- Extracción e integración de imágenes optimizadas
- Categorías: AI, Programming, JavaScript, Software Engineering, Data Science, Laravel

### 🏙️ Ciudades Soportadas

El selector de clima incluye estas ciudades españolas:

**Principales**: Madrid, Barcelona, Valencia, Sevilla, Zaragoza, Málaga
**Costa**: Alicante, Las Palmas, Palma, Santander, A Coruña
**Norte**: Bilbao, San Sebastián, Gijón, Vitoria, Pamplona
**Interior**: Toledo, Salamanca, León, Burgos, Logroño, Badajoz
**Sur**: Granada, Córdoba, Cádiz, Huelva, Murcia, Albacete

## 🚀 Despliegue

### ✨ Últimas Mejoras (v3.0)

**📰 Sistema de Noticias Completamente Renovado:**
- Migración de NewsAPI a Medium RSS feeds
- Filtros de calidad avanzados: solo contenido técnico en inglés
- Sistema anti-spam con detección de números de teléfono
- Extracción automática de imágenes de artículos
- Optimización con Next.js Image component
- Categorías especializadas: AI, Programming, JavaScript, Software Engineering, Data Science, Laravel

**🔒 Filtros de Calidad Robustos:**
- Detección automática de contenido spam
- Filtrado por idioma (solo inglés técnico)
- Validación de palabras clave técnicas
- Bloqueo de contenido comercial/personal
- Sistema de patrones regex para números de teléfono

**🖼️ Integración de Imágenes:**
- Extracción automática desde HTML de Medium
- CDN optimizado (cdn-images-1.medium.com)
- Fallback elegante sin imágenes
- Responsive design adaptativo

**🎨 UI/UX Modernizado:**
- Nuevo diseño glassmorphism en WeatherSection
- Grid responsivo de 3 columnas para noticias
- Efectos hover y micro-animaciones
- Selector de ciudades españolas con dropdown elegante

**📱 Responsividad Mejorada:**
- Layout optimizado para móvil, tablet y desktop
- NewsSection independiente con mejor distribución
- Grid adaptativo: 1 col → 2 cols → 3 cols

**🌍 Funcionalidades Nuevas:**
- 30 ciudades españolas con coordenadas precisas
- Mock data inteligente cuando APIs no disponibles
- Mejor integración de títulos y metadata
- Performance optimizada con useCallback

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

- **SSR y SSG**: Optimizado para SEO y performance
- **API Routes**: Backend integrado con Next.js
- **TypeScript**: Tipado fuerte en todo el proyecto
- **Responsive Design**: Mobile-first con breakpoints inteligentes
- **Progressive Enhancement**: Funciona completamente sin JavaScript
- **Error Handling**: Manejo robusto con fallbacks elegantes
- **Loading States**: Skeleton loaders y animaciones de carga
- **Glassmorphism UI**: Efectos visuales modernos con CSS
- **Grid Layouts**: Responsivo 1→2→3 columnas según dispositivo
- **Micro-interactions**: Hover effects y transiciones suaves
- **City Selector**: Dropdown con 30 ciudades españolas
- **Mock Data**: Funcionalidad completa sin dependencia de APIs externas

### 🎯 Optimizaciones de UX

- **Hover States**: Feedback visual en todos los elementos interactivos
- **Smooth Transitions**: Transiciones de 300ms para fluidez
- **Visual Hierarchy**: Tipografía y espaciado optimizado
- **Color Psychology**: Colores terminal que reducen fatiga visual
- **Accessibility**: Contrastes y tamaños de fuente accesibles

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

## 🔗 Links Importantes

### 🌐 **Aplicación Live**
- **Principal**: https://terminal-time-4lxsbsxsw-imorlabs-projects.vercel.app
- **Status**: ✅ Online y funcionando

### 🛠️ **Administración**
- **Dashboard Vercel**: https://vercel.com/imorlabs-projects/terminal-time/wn5hCN32omHP8jZSrW2D9drLepkA
- **Settings**: https://vercel.com/imorlabs-projects/terminal-time/settings
- **Analytics**: https://vercel.com/imorlabs-projects/terminal-time/analytics
- **Deployments**: https://vercel.com/imorlabs-projects/terminal-time/deployments

### 📚 **Desarrollo**
- **Repositorio**: https://github.com/imorlab/terminalTime
- **Issues**: https://github.com/imorlab/terminalTime/issues
- **Pull Requests**: https://github.com/imorlab/terminalTime/pulls

### 🔧 **APIs Utilizadas**
- **DeepSeek**: https://platform.deepseek.com/
- **Open-Meteo**: https://open-meteo.com/
- **Menéame RSS**: https://www.meneame.net/rss2.php

---

⭐ ¡Dale una estrella si te gustó TerminalTime!
