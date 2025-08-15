'use client'

import { useState, useEffect, useCallback } from 'react'
import { Newspaper, ExternalLink, Clock, RefreshCw, Settings, Check } from 'lucide-react'
import Image from 'next/image'

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  author?: string
  imageUrl?: string
}

interface NewsSource {
  id: string
  name: string
  description: string
  enabled: boolean
}

// Categorías de Medium disponibles - mismas que en la API
const AVAILABLE_SOURCES: NewsSource[] = [
  { id: 'artificial-intelligence', name: 'Artificial Intelligence', description: 'IA y Machine Learning', enabled: true },
  { id: 'programming', name: 'Programming', description: 'Programación general', enabled: true },
  { id: 'javascript', name: 'JavaScript', description: 'JS y desarrollo frontend', enabled: true },
  { id: 'software-engineering', name: 'Software Engineering', description: 'Ingeniería de software', enabled: true },
  { id: 'data-science', name: 'Data Science', description: 'Ciencia de datos', enabled: true },
  { id: 'laravel', name: 'Laravel', description: 'Framework PHP Laravel', enabled: true },
  { id: 'philosophy', name: 'Philosophy', description: 'Filosofía', enabled: false },
  { id: 'economics', name: 'Economics', description: 'Economía', enabled: false },
  { id: 'spirituality', name: 'Spirituality', description: 'Espiritualidad', enabled: false }
]

export default function NewsSection() {
  const [allNews, setAllNews] = useState<NewsArticle[]>([])
  const [displayedNews, setDisplayedNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sources, setSources] = useState<NewsSource[]>(AVAILABLE_SOURCES)
  const [tempSources, setTempSources] = useState<NewsSource[]>(AVAILABLE_SOURCES) // Estado temporal para cambios pendientes
  const [showSourceSelector, setShowSourceSelector] = useState(false)
  const [newsOffset, setNewsOffset] = useState(0)

  const updateDisplayedNews = useCallback(() => {
    const startIndex = newsOffset
    const endIndex = startIndex + 3
    setDisplayedNews(allNews.slice(startIndex, endIndex))
  }, [allNews, newsOffset])

  const fetchTechNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener categorías habilitadas
      const enabledCategories = sources.filter(s => s.enabled).map(s => s.id)
      const categoriesParam = enabledCategories.length > 0 ? `?categories=${enabledCategories.join(',')}` : ''
      
      // La API ahora recibe las categorías como parámetro
      const response = await fetch(`/api/news/tech${categoriesParam}`)
      
      if (!response.ok) {
        throw new Error('API de noticias no disponible')
      }
      
      const data = await response.json()
      
      // Usar noticias de la API o fallback
      const newsData = data.articles && data.articles.length > 0 ? data.articles : [
        {
          title: 'Nueva versión de React 19 disponible',
          description: 'El equipo de React anuncia nuevas características incluyendo mejor manejo de estado y Server Components mejorados.',
          url: '#',
          publishedAt: '2025-08-15T10:00:00Z',
          source: 'Medium - Programming',
          author: 'React Team',
          imageUrl: 'https://cdn-images-1.medium.com/max/800/1*4qLN_FJzBbLgj4qmGMWgJA.png'
        },
        {
          title: 'Laravel 11: Nuevas características',
          description: 'Laravel 11 introduce mejoras significativas en rendimiento, nuevas APIs y mejor integración con tecnologías modernas.',
          url: '#',
          publishedAt: '2025-08-15T09:00:00Z',
          source: 'Medium - Laravel',
          author: 'Laravel Team',
          imageUrl: 'https://cdn-images-1.medium.com/max/800/1*wJEF3WgjdQzGbLgRz8FgpQ.png'
        },
        {
          title: 'Avances en Inteligencia Artificial',
          description: 'Los últimos desarrollos en IA están revolucionando la forma en que desarrollamos software y resolvemos problemas complejos.',
          url: '#',
          publishedAt: '2025-08-15T08:00:00Z',
          source: 'Medium - Artificial Intelligence',
          author: 'AI Research',
          imageUrl: 'https://cdn-images-1.medium.com/max/800/1*yBdOZIIIhLglnWYhqq2QhA.png'
        }
      ]

      setAllNews(newsData)
      setNewsOffset(0)
    } catch (err) {
      console.log('Error API noticias:', err)
      setError('API no disponible')
      // En caso de error total, usar datos de ejemplo mínimos
      setAllNews([
        {
          title: 'Error: Datos de ejemplo',
          description: 'No se pudieron cargar noticias reales. Mostrando datos de ejemplo.',
          url: '#',
          publishedAt: '2025-08-15T12:00:00Z',
          source: 'Sistema',
          author: 'Sistema'
        }
      ])
      setNewsOffset(0)
    } finally {
      setLoading(false)
    }
  }, [sources])

  useEffect(() => {
    fetchTechNews()
  }, [fetchTechNews])

  useEffect(() => {
    updateDisplayedNews()
  }, [updateDisplayedNews])

  // Sincronizar estado temporal cuando se abre el selector
  useEffect(() => {
    if (showSourceSelector) {
      setTempSources(sources)
    }
  }, [showSourceSelector, sources])

  const refreshNews = () => {
    setRefreshing(true)
    
    if (newsOffset + 3 < allNews.length) {
      setNewsOffset(prev => prev + 3)
    } else {
      setNewsOffset(0)
    }
    
    setTimeout(() => setRefreshing(false), 500)
  }

  const toggleSource = (sourceId: string) => {
    setTempSources(prev => 
      prev.map(source => 
        source.id === sourceId 
          ? { ...source, enabled: !source.enabled }
          : source
      )
    )
  }

  const applySourceChanges = () => {
    // Aplicar cambios del estado temporal al estado real
    setSources(tempSources)
    setShowSourceSelector(false)
    // fetchTechNews se ejecutará automáticamente debido a la dependencia [sources]
  }

  const cancelSourceChanges = () => {
    // Restaurar estado temporal al estado actual
    setTempSources(sources)
    setShowSourceSelector(false)
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Reciente'
      }
      
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Hace menos de 1h'
      if (diffInHours < 24) return `Hace ${diffInHours}h`
      return `Hace ${Math.floor(diffInHours / 24)}d`
    } catch {
      return 'Reciente'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Newspaper className="h-6 w-6 text-terminal-blue" />
            <h2 className="text-xl font-light text-terminal-green font-mono">tech.news</h2>
          </div>
          <div className="text-terminal-gray text-sm">Cargando últimas noticias...</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg overflow-hidden">
              <div className="h-48 bg-terminal-gray/10 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-terminal-gray/20 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-terminal-gray/20 rounded w-full animate-pulse" />
                <div className="h-3 bg-terminal-gray/20 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Newspaper className="h-6 w-6 text-terminal-blue" />
          <h2 className="text-xl font-light text-terminal-green font-mono">tech.news</h2>
        </div>
        <div className="text-terminal-gray text-sm mb-4">Últimas noticias de ciencia y tecnología</div>
        
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={refreshNews}
            disabled={refreshing || displayedNews.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-terminal-blue/10 hover:bg-terminal-blue/20 border border-terminal-blue/20 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-terminal-blue ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-terminal-blue">
              {refreshing ? 'Actualizando...' : 'Más noticias'}
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowSourceSelector(!showSourceSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-terminal-gray/10 hover:bg-terminal-gray/20 border border-terminal-gray/20 rounded-lg transition-colors text-sm"
            >
              <Settings className="h-4 w-4 text-terminal-yellow" />
              <span className="text-terminal-text">Categorías</span>
            </button>
            
            {showSourceSelector && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-terminal-bg border border-terminal-gray/20 rounded-lg shadow-lg z-20 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-terminal-yellow mb-2">Categorías de Medium</h3>
                  <div className="space-y-2">
                    {tempSources.map((source) => (
                      <label
                        key={source.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-terminal-gray/10 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={source.enabled}
                            onChange={() => toggleSource(source.id)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border transition-colors ${
                            source.enabled 
                              ? 'bg-terminal-green border-terminal-green' 
                              : 'border-terminal-gray'
                          }`}>
                            {source.enabled && (
                              <Check className="h-3 w-3 text-terminal-bg m-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-terminal-text">{source.name}</div>
                          <div className="text-xs text-terminal-gray">{source.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-terminal-gray/20">
                  <button
                    onClick={cancelSourceChanges}
                    className="px-3 py-1 text-sm text-terminal-gray hover:text-terminal-text transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={applySourceChanges}
                    className="px-3 py-1 bg-terminal-green/20 text-terminal-green rounded text-sm hover:bg-terminal-green/30 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedNews.map((article, index) => (
          <div key={`${article.url}-${index}`} className="group bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg overflow-hidden hover:border-terminal-green/30 transition-all duration-300 hover:bg-terminal-gray/10">
            {/* Imagen del artículo */}
            {article.imageUrl ? (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Si la imagen falla, ocultar el contenedor
                    e.currentTarget.parentElement!.style.display = 'none'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg/60 to-transparent" />
              </div>
            ) : (
              <div className="h-32 bg-terminal-gray/10 flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-terminal-gray/50" />
              </div>
            )}
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-terminal-yellow font-mono bg-terminal-bg/70 px-2 py-1 rounded">
                  {article.source}
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-terminal-yellow leading-tight group-hover:text-terminal-green transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              <p className="text-xs text-terminal-gray leading-relaxed line-clamp-3">
                {article.description}
              </p>
              
              <div className="flex items-center justify-between text-xs border-t border-terminal-gray/10 pt-3">
                <div className="flex items-center gap-2 text-terminal-gray">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
                {article.author && (
                  <div className="text-terminal-blue text-xs font-mono truncate max-w-[100px]">
                    {article.author}
                  </div>
                )}
              </div>
              
              {article.url !== '#' && (
                <div className="pt-2">
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-terminal-blue hover:text-terminal-yellow transition-colors text-xs font-mono group-hover:translate-x-1 transform transition-transform duration-200"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>read_more</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-yellow/10 border border-terminal-yellow/20 rounded-lg text-terminal-yellow text-xs font-mono">
            <span>⚡</span>
            <span>mock_data.enabled = true</span>
          </div>
        </div>
      )}
    </div>
  )
}
