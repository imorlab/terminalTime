import { NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  author?: string
  imageUrl?: string
}

interface MediumTopic {
  name: string
  slug: string
  enabled: boolean
}

// Configuración de topics de Medium que se pueden activar/desactivar
const MEDIUM_TOPICS: MediumTopic[] = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence', enabled: true },
  { name: 'Programming', slug: 'programming', enabled: true },
  { name: 'JavaScript', slug: 'javascript', enabled: true }, // Cambiado de programming-languages
  { name: 'Software Engineering', slug: 'software-engineering', enabled: true }, // Cambiado de devops
  { name: 'Data Science', slug: 'data-science', enabled: true },
  { name: 'Laravel', slug: 'laravel', enabled: true }, // Nuevo topic añadido
  { name: 'Philosophy', slug: 'philosophy', enabled: false }, // Desactivado por defecto
  { name: 'Economics', slug: 'economics', enabled: false },   // Desactivado por defecto
  { name: 'Spirituality', slug: 'spirituality', enabled: false } // Desactivado por defecto
]

export async function GET(request: Request) {
  try {
    // Obtener categorías desde URL params o usar las por defecto
    const { searchParams } = new URL(request.url)
    const categoriesParam = searchParams.get('categories')
    
    let enabledTopics
    if (categoriesParam) {
      // Filtrar por categorías específicas enviadas desde el frontend
      const requestedCategories = categoriesParam.split(',')
      enabledTopics = MEDIUM_TOPICS.filter(topic => 
        requestedCategories.includes(topic.slug)
      )
    } else {
      // Usar configuración por defecto
      enabledTopics = MEDIUM_TOPICS.filter(topic => topic.enabled)
    }
    
    // Obtener artículos de todos los topics habilitados en paralelo
    const articlePromises = enabledTopics.map(topic => fetchMediumRSS(topic.slug, topic.name))
    const results = await Promise.allSettled(articlePromises)
    
    const allArticles: NewsItem[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ ${enabledTopics[index].name}: ${result.value.length} artículos obtenidos`)
        allArticles.push(...result.value)
      } else {
        console.error(`❌ Error en ${enabledTopics[index].name}:`, result.reason)
      }
    })
    
    if (allArticles.length === 0) {
      const curatedNews = getCuratedTechNews()
      return NextResponse.json({ articles: curatedNews })
    }
    
    // Mezclar artículos y limitar a 12
    const shuffledArticles = shuffleArray(allArticles)
    const finalArticles = shuffledArticles.slice(0, 12)
    
    return NextResponse.json({ articles: finalArticles })
    
  } catch (error) {
    console.error('❌ Error en API de noticias Medium:', error)
    
    // Fallback con noticias curadas
    const fallbackNews = getCuratedTechNews()
    return NextResponse.json({ articles: fallbackNews })
  }
}

// Función para detectar si el texto está en inglés
function isEnglishContent(text: string): boolean {
  // Palabras comunes en inglés técnico
  const englishTechWords = [
    'the', 'and', 'or', 'for', 'with', 'you', 'your', 'how', 'what', 'this', 'that',
    'development', 'programming', 'code', 'software', 'application', 'framework',
    'javascript', 'python', 'react', 'vue', 'angular', 'node', 'api', 'database',
    'web', 'mobile', 'app', 'technology', 'tech', 'digital', 'data', 'machine',
    'learning', 'artificial', 'intelligence', 'algorithm', 'function', 'method',
    'class', 'object', 'variable', 'array', 'string', 'number', 'boolean',
    'to', 'in', 'on', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'use', 'using', 'used', 'make', 'making', 'made', 'get', 'getting', 'got'
  ]
  
  // Palabras que indican otros idiomas
  const nonEnglishIndicators = [
    'dan', 'untuk', 'yang', 'adalah', 'dengan', // Indonesio
    'de', 'la', 'el', 'en', 'y', 'que', 'es', 'una', 'por', // Español
    'et', 'le', 'de', 'un', 'une', 'dans', 'sur', 'avec', // Francés
    'und', 'der', 'die', 'das', 'ist', 'zu', 'in', 'mit', // Alemán
    'الى', 'من', 'في', 'على', 'هذا', 'هذه', // Árabe
  ]
  
  // Convertir a minúsculas y obtener palabras
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const totalWords = words.length
  
  if (totalWords < 10) return false // Muy corto para determinar
  
  // Verificar si contiene indicadores de otros idiomas
  const hasNonEnglishWords = words.some(word => nonEnglishIndicators.includes(word))
  if (hasNonEnglishWords) return false
  
  // Contar coincidencias con palabras en inglés
  const englishMatches = words.filter(word => englishTechWords.includes(word)).length
  const englishRatio = englishMatches / totalWords
  
  // También verificar caracteres no latinos (árabe, chino, etc.)
  const nonLatinRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/
  const hasNonLatinChars = nonLatinRegex.test(text)
  
  return englishRatio > 0.15 && !hasNonLatinChars
}

// Función para filtrar contenido de calidad técnica
function isTechnicalContent(title: string, description: string): boolean {
  const content = `${title} ${description}`.toLowerCase()
  
  // Palabras clave técnicas requeridas
  const technicalKeywords = [
    'programming', 'coding', 'development', 'software', 'code', 'framework',
    'javascript', 'python', 'java', 'react', 'vue', 'angular', 'node',
    'api', 'database', 'web', 'app', 'technology', 'tech', 'algorithm',
    'data', 'machine learning', 'ai', 'artificial intelligence', 'devops',
    'laravel', 'php', 'css', 'html', 'typescript', 'sql', 'mongodb',
    'docker', 'kubernetes', 'aws', 'cloud', 'backend', 'frontend',
    'fullstack', 'mobile', 'ios', 'android', 'flutter', 'swift'
  ]
  
  // Palabras a evitar (spam, contenido personal, etc.)
  const blacklistedWords = [
    'phone', 'telegram', 'whatsapp', 'contact', 'call me', 'dm me',
    'business', 'money', 'earn', 'income', 'profit', 'investment',
    'crypto', 'bitcoin', 'trading', 'forex', 'casino', 'betting',
    'dating', 'relationship', 'marriage', 'love', 'romance',
    'weight loss', 'diet', 'health', 'medical', 'cure', 'treatment',
    'loan', 'credit', 'helpline', 'customer care', 'care number',
    'support number', 'service number', 'toll free', 'customer service'
  ]
  
  // Verificar si contiene palabras técnicas
  const hasTechnicalContent = technicalKeywords.some(keyword => 
    content.includes(keyword)
  )
  
  // Verificar si contiene palabras problemáticas
  const hasBlacklistedContent = blacklistedWords.some(word => 
    content.includes(word)
  )
  
  return hasTechnicalContent && !hasBlacklistedContent
}

// Función para detectar spam con números de teléfono
function hasPhoneNumberSpam(content: string): boolean {
  // Patrones de números de teléfono comunes en spam
  const phonePatterns = [
    /\b\d{10}\b/g,           // 10 dígitos seguidos
    /\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, // formato XXX-XXX-XXXX
    /\+\d{1,3}[-\s]?\d{3,14}\b/g,       // formato internacional
    /\b\d{7,15}\b/g          // Entre 7 y 15 dígitos (números de teléfono típicos)
  ]
  
  // Buscar múltiples números en el mismo contenido (indicativo de spam)
  let phoneCount = 0
  phonePatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) phoneCount += matches.length
  })
  
  return phoneCount >= 2 // Si hay 2 o más números, probablemente es spam
}

// Función para filtrar artículos de calidad
function filterQualityArticles(articles: NewsItem[]): NewsItem[] {
  return articles.filter(article => {
    // Filtro 1: Solo contenido en inglés
    const titleInEnglish = isEnglishContent(article.title)
    const descriptionInEnglish = isEnglishContent(article.description)
    
    // Filtro 2: Contenido técnico relevante
    const isTechnical = isTechnicalContent(article.title, article.description)
    
    // Filtro 3: Verificar longitud mínima del título
    const hasValidTitle = article.title.length > 10 && article.title.length < 150
    
    // Filtro 4: Verificar que no sea contenido spam
    const notSpam = !article.title.toLowerCase().includes('click here') &&
                   !article.description.toLowerCase().includes('subscribe now') &&
                   !article.author?.toLowerCase().includes('telegram') &&
                   !hasPhoneNumberSpam(`${article.title} ${article.description}`)
    
    return (titleInEnglish || descriptionInEnglish) && isTechnical && hasValidTitle && notSpam
  })
}

async function fetchMediumRSS(topicSlug: string, topicName: string): Promise<NewsItem[]> {
  try {
    // Laravel usa /feed/tag/, otros topics usan /feed/topic/
    const baseUrl = topicSlug === 'laravel' 
      ? `https://medium.com/feed/tag/${topicSlug}`
      : `https://medium.com/feed/topic/${topicSlug}`
    
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'TerminalTime-MediumBot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      next: { revalidate: 300 } // Cache por 5 minutos
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const xmlData = await response.text()
    const parsedData = await parseStringPromise(xmlData)
    
    if (!parsedData?.rss?.channel?.[0]?.item) {
      console.warn(`⚠️ No se encontraron artículos para ${topicName}`)
      return []
    }
    
    const items = parsedData.rss.channel[0].item.slice(0, 10) // Obtener más artículos para filtrar
    
    const articles: NewsItem[] = items.map((item: any) => {
      // Limpiar el título removiendo CDATA
      let title = item.title?.[0] || 'Sin título'
      if (typeof title === 'object' && title._) {
        title = title._
      }
      if (title.includes('<![CDATA[')) {
        title = title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      }
      
      // Limpiar descripción removiendo HTML y CDATA
      let description = item.description?.[0] || title
      if (typeof description === 'object' && description._) {
        description = description._
      }
      if (description.includes('<![CDATA[')) {
        description = description.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      }
      // Remover HTML tags y obtener solo texto
      description = description.replace(/<[^>]*>/g, '').trim()
      if (description.length > 200) {
        description = description.substring(0, 200) + '...'
      }
      
      // Obtener autor
      let author = item['dc:creator']?.[0] || 'Medium Author'
      if (typeof author === 'object' && author._) {
        author = author._
      }
      if (author.includes('<![CDATA[')) {
        author = author.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      }
      
      // Extraer imagen de la descripción HTML
      let imageUrl = ''
      const originalDescription = item.description?.[0] || ''
      if (typeof originalDescription === 'string') {
        // Buscar la primera imagen en el contenido HTML
        const imgMatch = originalDescription.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1]
          // Verificar que sea una URL válida de imagen
          if (imageUrl.includes('medium.com') || imageUrl.includes('cdn-images')) {
            // Limpiar parámetros innecesarios y optimizar para web
            imageUrl = imageUrl.replace(/\?.*$/, '') // Remover query params
            if (imageUrl.includes('cdn-images-1.medium.com')) {
              // Usar tamaño optimizado para cards
              imageUrl = imageUrl.replace(/\/max\/\d+\//, '/max/800/')
            }
          } else {
            imageUrl = '' // No usar imágenes externas por seguridad
          }
        }
      }
      
      return {
        title: title.trim(),
        description: description || title,
        url: item.link?.[0] || '#',
        publishedAt: item.pubDate?.[0] || new Date().toISOString(),
        source: `Medium - ${topicName}`,
        author: author.trim(),
        imageUrl: imageUrl || undefined
      }
    })
    
    // Aplicar filtros de calidad antes de retornar
    const filteredArticles = filterQualityArticles(articles)
    
    // Tomar solo los mejores 3 artículos filtrados
    return filteredArticles.slice(0, 3)
    
  } catch (error) {
    console.error(`❌ Error obteniendo RSS de ${topicName}:`, error)
    return []
  }
}

// Función para mezclar array (shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getCuratedTechNews(): NewsItem[] {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
  
  return [
    {
      title: 'AI in Software Development: Transforming How We Code',
      description: 'Artificial Intelligence is revolutionizing software development with tools like GitHub Copilot, making developers more productive than ever.',
      url: 'https://medium.com/@dev/ai-software-development',
      publishedAt: today.toISOString(),
      source: 'Medium - AI',
      author: 'Tech Writer'
    },
    {
      title: 'Modern JavaScript: ES2024 Features That Will Change Your Code',
      description: 'Explore the latest JavaScript features including new array methods, temporal API, and improved error handling.',
      url: 'https://medium.com/@js/modern-javascript-2024',
      publishedAt: yesterday.toISOString(),
      source: 'Medium - Programming',
      author: 'JavaScript Expert'
    },
    {
      title: 'DevOps Best Practices: Building Resilient CI/CD Pipelines',
      description: 'Learn how to create robust deployment pipelines with proper testing, monitoring, and rollback strategies.',
      url: 'https://medium.com/@devops/cicd-pipelines',
      publishedAt: yesterday.toISOString(),
      source: 'Medium - DevOps',
      author: 'DevOps Engineer'
    },
    {
      title: 'Data Science with Python: Advanced Pandas Techniques',
      description: 'Master advanced data manipulation techniques with pandas for more efficient data analysis workflows.',
      url: 'https://medium.com/@datascience/pandas-advanced',
      publishedAt: twoDaysAgo.toISOString(),
      source: 'Medium - Data Science',
      author: 'Data Scientist'
    },
    {
      title: 'Functional Programming Concepts Every Developer Should Know',
      description: 'Understanding functional programming principles can make you a better programmer regardless of the language you use.',
      url: 'https://medium.com/@programming/functional-concepts',
      publishedAt: twoDaysAgo.toISOString(),
      source: 'Medium - Programming Languages',
      author: 'Programming Expert'
    },
    {
      title: 'The Future of Machine Learning: Trends to Watch in 2025',
      description: 'From edge computing to automated ML, discover the trends that will shape machine learning in the coming year.',
      url: 'https://medium.com/@ai/ml-trends-2025',
      publishedAt: threeDaysAgo.toISOString(),
      source: 'Medium - AI',
      author: 'ML Researcher'
    },
    {
      title: 'Microservices Architecture: Lessons from Production',
      description: 'Real-world insights on implementing microservices, including common pitfalls and how to avoid them.',
      url: 'https://medium.com/@architecture/microservices-production',
      publishedAt: threeDaysAgo.toISOString(),
      source: 'Medium - Programming',
      author: 'Software Architect'
    },
    {
      title: 'Container Security: Protecting Your Docker Deployments',
      description: 'Essential security practices for containerized applications, from image scanning to runtime protection.',
      url: 'https://medium.com/@security/container-security',
      publishedAt: threeDaysAgo.toISOString(),
      source: 'Medium - DevOps',
      author: 'Security Engineer'
    }
  ]
}
