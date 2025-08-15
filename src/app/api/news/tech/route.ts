import { NextResponse } from 'next/server'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  author?: string
}

export async function GET() {
  try {
    // Usar solo NewsAPI con múltiples consultas optimizadas
    const [techNewsResult, laravelNewsResult, frontendNewsResult] = await Promise.allSettled([
      fetchNewsAPI('technology'),    // Noticias generales de tech
      fetchNewsAPI('laravel'),       // Laravel específico
      fetchNewsAPI('frontend')       // Frontend/JavaScript
    ])
    
    const techNews = techNewsResult.status === 'fulfilled' ? techNewsResult.value : []
    const laravelNews = laravelNewsResult.status === 'fulfilled' ? laravelNewsResult.value : []
    const frontendNews = frontendNewsResult.status === 'fulfilled' ? frontendNewsResult.value : []
    
    // Mezclar noticias de forma intercalada para mejor variedad
    const combinedNews: NewsItem[] = []
    const allSources = [techNews, laravelNews, frontendNews]
    const maxLength = Math.max(...allSources.map(arr => arr.length))
    
    for (let i = 0; i < maxLength && combinedNews.length < 12; i++) {
      // Agregar de cada fuente de forma intercalada
      allSources.forEach(source => {
        if (i < source.length && combinedNews.length < 12) {
          combinedNews.push(source[i])
        }
      })
    }
    
    if (combinedNews.length > 0) {
      console.log(`✅ Devolviendo ${combinedNews.length} noticias de NewsAPI (${techNews.length} tech, ${laravelNews.length} Laravel, ${frontendNews.length} frontend)`)
      return NextResponse.json({ articles: combinedNews })
    }
    
    // Fallback a noticias curadas sin imágenes
    const curatedNews = getCuratedTechNews()
    console.log(`📰 Devolviendo ${curatedNews.length} noticias curadas`)
    return NextResponse.json({ articles: curatedNews })
    
  } catch (error) {
    console.error('Error en API de noticias:', error)
    
    // Fallback con noticias curadas
    const fallbackNews = getCuratedTechNews()
    console.log(`🔄 Fallback: Devolviendo ${fallbackNews.length} noticias curadas`)
    return NextResponse.json({ articles: fallbackNews })
  }
}

async function fetchNewsAPI(query: string): Promise<NewsItem[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      console.warn('⚠️ NEWS_API_KEY no configurada')
      return []
    }
    
    console.log(`🔄 Intentando obtener noticias de NewsAPI para: ${query}`)
    
    let url = ''
    if (query === 'technology') {
      // Noticias generales de tecnología
      url = `https://newsapi.org/v2/everything?q=(technology OR tech OR programming OR software) AND (news OR update OR release)&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    } else if (query === 'laravel') {
      // Búsqueda específica de Laravel y PHP
      url = `https://newsapi.org/v2/everything?q=(laravel OR php OR "php framework" OR composer OR artisan)&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    } else if (query === 'frontend') {
      // Frontend y JavaScript frameworks
      url = `https://newsapi.org/v2/everything?q=(javascript OR typescript OR react OR vue OR nextjs OR angular OR "web development")&language=en&sortBy=publishedAt&apiKey=${apiKey}`
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TerminalTime-NewsBot/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error fetching NewsAPI: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`)
    }
    
    console.log(`✅ NewsAPI ${query}: obtenidos ${data.articles?.length || 0} artículos`)
    
    const items: NewsItem[] = (data.articles || []).map((article: any) => ({
      title: article.title || 'Sin título',
      description: article.description || article.title || 'Sin descripción',
      url: article.url || '#',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'NewsAPI',
      // Sin imágenes para simplificar
      author: article.author || undefined
    }))
    
    // Limitar resultados para balance
    const limit = query === 'technology' ? 5 : query === 'laravel' ? 4 : 3
    return items.slice(0, limit)
    
  } catch (error) {
    console.error(`Error fetching NewsAPI (${query}):`, error)
    return []
  }
}

function getCuratedTechNews(): NewsItem[] {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
  const fourDaysAgo = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)
  const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
  
  // Pool más grande de noticias para permitir rotación
  const allNews = [
    {
      title: 'TypeScript 5.6 Beta: Nueva sintaxis y optimizaciones',
      description: 'Microsoft lanza TypeScript 5.6 beta con mejoras en el compilador, nuevas características de sintaxis y optimizaciones significativas.',
      url: 'https://devblogs.microsoft.com/typescript',
      publishedAt: today.toISOString(),
      source: 'Microsoft DevBlog',
      author: 'TypeScript Team'
    },
    {
      title: 'React 19 RC: Server Components y Compiler estables',
      description: 'React 19 Release Candidate está disponible con Server Components estables y el nuevo compilador experimental.',
      url: 'https://react.dev/blog',
      publishedAt: yesterday.toISOString(),
      source: 'React Team',
      author: 'Meta Engineers'
    },
    {
      title: 'Next.js 15: App Router mejorado y Turbopack estable',
      description: 'Vercel anuncia Next.js 15 con App Router completamente optimizado y Turbopack como bundler predeterminado.',
      url: 'https://nextjs.org/blog',
      publishedAt: yesterday.toISOString(),
      source: 'Vercel',
      author: 'Next.js Team'
    },
    {
      title: 'GitHub Copilot Chat: IA integrada en el editor',
      description: 'GitHub presenta Copilot Chat directamente en VS Code con capacidades mejoradas de generación de código.',
      url: 'https://github.blog',
      publishedAt: twoDaysAgo.toISOString(),
      source: 'GitHub',
      author: 'GitHub Team'
    },
    {
      title: 'Laravel 11.20: Nuevas características de Eloquent ORM',
      description: 'Laravel 11.20 introduce mejoras en Eloquent, nuevos helpers de validación y optimizaciones de performance.',
      url: 'https://laravel-news.com',
      publishedAt: today.toISOString(),
      source: 'Laravel News',
      author: 'Taylor Otwell'
    },
    {
      title: 'PHP 8.4 RC disponible con Property Hooks',
      description: 'PHP 8.4 Release Candidate introduce property hooks, asymmetric visibility y mejoras en el motor JIT.',
      url: 'https://www.php.net/releases',
      publishedAt: threeDaysAgo.toISOString(),
      source: 'PHP Foundation',
      author: 'PHP Core Team'
    },
    {
      title: 'Vue 3.4: Mejor performance y Developer Experience',
      description: 'Vue 3.4 "🏀 Slam Dunk" mejora significativamente el rendimiento del compilador y añade nuevas herramientas de desarrollo.',
      url: 'https://blog.vuejs.org',
      publishedAt: twoDaysAgo.toISOString(),
      source: 'Vue.js',
      author: 'Evan You'
    },
    {
      title: 'Bun 1.1: JavaScript runtime ultrarrápido alcanza estabilidad',
      description: 'Bun 1.1 se consolida como alternativa a Node.js con bundler, test runner y package manager integrados.',
      url: 'https://bun.sh/blog',
      publishedAt: fourDaysAgo.toISOString(),
      source: 'Oven',
      author: 'Jarred Sumner'
    },
    {
      title: 'Vite 5.0: Build tool de próxima generación',
      description: 'Vite 5.0 introduce soporte nativo para ES2022 y mejoras significativas en hot reload y dev server.',
      url: 'https://vitejs.dev/blog',
      publishedAt: fiveDaysAgo.toISOString(),
      source: 'Vite Team',
      author: 'Anthony Fu'
    },
    {
      title: 'Tailwind CSS 4.0 Alpha: Motor CSS reescrito',
      description: 'Tailwind CSS 4.0 alpha presenta un motor completamente reescrito con mejor performance y nuevas características.',
      url: 'https://tailwindcss.com/blog',
      publishedAt: fiveDaysAgo.toISOString(),
      source: 'Tailwind Labs',
      author: 'Adam Wathan'
    },
    {
      title: 'Deno 2.0: Compatibilidad total con npm y Node.js',
      description: 'Deno 2.0 alcanza compatibilidad completa con el ecosistema npm manteniendo su enfoque en seguridad.',
      url: 'https://deno.com/blog',
      publishedAt: today.toISOString(),
      source: 'Deno',
      author: 'Ryan Dahl'
    }
  ]
  
  return allNews
}
