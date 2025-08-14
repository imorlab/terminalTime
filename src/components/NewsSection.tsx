'use client'

import { useState, useEffect } from 'react'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTechNews()
  }, [])

  const fetchTechNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/news/tech')
      
      if (!response.ok) {
        throw new Error('API de noticias no disponible')
      }
      
      const data = await response.json()
      setNews(data.articles || [])
    } catch (err) {
      console.log('Error API noticias:', err)
      setError('API no disponible')
      // Mostrar datos de ejemplo
      setNews([
        {
          title: 'Nueva versión de TypeScript 5.5 disponible',
          description: 'Microsoft lanza TypeScript 5.5 con mejoras en el sistema de tipos y nuevas características para desarrolladores.',
          url: '#',
          publishedAt: new Date().toISOString(),
          source: 'TechCrunch'
        },
        {
          title: 'OpenAI presenta nuevas capacidades de IA',
          description: 'La compañía anuncia avances significativos en modelos de lenguaje y herramientas para desarrolladores.',
          url: '#',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: 'Wired'
        },
        {
          title: 'React 19 en desarrollo',
          description: 'El equipo de React trabaja en la próxima versión mayor con mejoras en rendimiento y nuevas APIs.',
          url: '#',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: 'Dev.to'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace menos de 1h'
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    return `Hace ${Math.floor(diffInHours / 24)}d`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Título arriba */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Newspaper className="h-6 w-6 text-terminal-blue" />
            <h2 className="text-xl font-light text-terminal-green font-mono">tech.query</h2>
          </div>
          <div className="text-terminal-gray text-sm">Cargando últimas noticias...</div>
        </div>

        {/* Grid de 3 columnas - Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-terminal-gray/20 rounded w-3/4"></div>
                <div className="h-3 bg-terminal-gray/20 rounded w-full"></div>
                <div className="h-3 bg-terminal-gray/20 rounded w-2/3"></div>
                <div className="h-3 bg-terminal-gray/20 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Título arriba */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Newspaper className="h-6 w-6 text-terminal-blue" />
          <h2 className="text-xl font-light text-terminal-green font-mono">tech.news</h2>
        </div>
        <div className="text-terminal-gray text-sm">Últimas noticias de tecnología</div>
      </div>

      {/* Grid de 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((article, index) => (
          <div key={index} className="group bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4 hover:border-terminal-green/30 transition-all duration-300 hover:bg-terminal-gray/10">
            <div className="space-y-3">
              {/* Título del artículo */}
              <h3 className="text-sm font-medium text-terminal-yellow leading-tight group-hover:text-terminal-green transition-colors">
                {article.title}
              </h3>
              
              {/* Descripción */}
              <p className="text-xs text-terminal-gray leading-relaxed">
                {article.description.length > 120 
                  ? `${article.description.slice(0, 120)}...` 
                  : article.description
                }
              </p>
              
              {/* Footer con tiempo y fuente */}
              <div className="flex items-center justify-between text-xs border-t border-terminal-gray/10 pt-3">
                <div className="flex items-center gap-2 text-terminal-gray">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
                <div className="text-terminal-blue text-xs font-mono">
                  {article.source}
                </div>
              </div>
              
              {/* Link para leer */}
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
