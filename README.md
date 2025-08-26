# TerminalTime ⏰

> **Historia de la programación en tu terminal**

[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimorlab%2FterminalTime)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

🚀 **Demo**: https://terminal-time.vercel.app

## ✨ Características

- **🗓️ Efemérides Diarias**: Eventos históricos de programación generados con IA
- **🌤️ Clima**: Información meteorológica para 30+ ciudades españolas  
- **📰 Noticias Tech**: Agregador de contenido tecnológico de Medium
- **💻 Terminal Interactiva**: Interfaz que simula una terminal real con comandos
- **🤖 IA Integrada**: Generación automática con DeepSeek AI
- **📱 Responsivo**: Diseño adaptativo con tema terminal moderno

## 🚀 Desarrollo Local

```bash
# Clonar e instalar
git clone https://github.com/imorlab/terminalTime.git
cd terminalTime
npm install

# Configurar (opcional)
cp .env.example .env.local
# Añadir DEEPSEEK_API_KEY para IA

# Ejecutar
npm run dev
```

Abre http://localhost:3000

## 🛠️ Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), DeepSeek AI, Open-Meteo, Medium RSS
- **Deploy**: Vercel, GitHub Actions

## � Variables de Entorno

```env
# IA (opcional - funciona con fallback)
DEEPSEEK_API_KEY=tu_deepseek_api_key

# Base de datos (opcional - funciona con mock data)  
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Clima (opcional - tiene fallback)
OPENWEATHER_API_KEY=tu_openweather_key
```

## 🎯 Funcionalidades Clave

### Terminal Interactiva
- Comandos ejecutables: `help`, `date`, `weather`, `joke`, etc.
- Efectos de escritura y cursor parpadeante
- Comando `refresh-ephemeride` para regenerar contenido

### Sistema de Efemérides  
1. **Base de datos** → respuesta instantánea
2. **IA generación** → contenido único guardado automáticamente  
3. **Fallback** → datos curados de calidad

### Automatización
- **GitHub Actions**: Genera nuevas efemérides diariamente a las 00:00 Madrid
- **Prevención duplicados**: IA evita contenido repetido
- **Zona horaria**: Sistema corregido para horario español

## 📁 Estructura

```
src/
├── app/
│   ├── api/              # API Routes
│   └── page.tsx          # Página principal
├── components/           # Componentes React modulares
│   ├── EphemerideSection.tsx
│   ├── InteractiveTerminal.tsx
│   ├── TypewriterText.tsx
│   └── ...
└── data/                 # Datos de fallback
```

## 🔧 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción  
npm run start        # Servidor producción
npm run lint         # Linting
```

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE)

---

**Desarrollado por** [@imorlab](https://github.com/imorlab) | **Stack**: Next.js + TypeScript + Tailwind + AI
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
    - cron: '0 22 * * *'  # Diario a las 10:00 PM UTC
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

**imorlab**: [GitHub](https://github.com/imorlab)
**Israel Moreno**: [Linkedin](https://www.linkedin.com/in/israelmorenolabrador/)
Creado con 💜 desde Andalucía para el mundo

## 🔗 Links Importantes

### 📚 **Desarrollo**
- **Repositorio**: https://github.com/imorlab/terminalTime
- **Issues**: https://github.com/imorlab/terminalTime/issues
- **Pull Requests**: https://github.com/imorlab/terminalTime/pulls

### 🔧 **APIs Utilizadas**
- **DeepSeek**: https://platform.deepseek.com/
- **Open-Meteo**: https://open-meteo.com/
- **Medium RSS**: https://medium.com/feed/tag/tecnología

---

⭐ ¡Dale una estrella si te gustó TerminalTime!
