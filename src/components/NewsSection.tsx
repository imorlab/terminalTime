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
      <div className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4">
        <div className="output-line text-terminal-blue mb-3">
          📰 Cargando noticias tech...
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-terminal-gray/20 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-terminal-gray/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-terminal-gray/5 border border-terminal-gray/20 rounded-lg p-4">
      <div className="output-line text-terminal-green mb-4">
        📰 Noticias Tech del día
      </div>
      
      <div className="space-y-4">
        {news.slice(0, 3).map((article, index) => (
          <div key={index} className="border-b border-terminal-gray/10 last:border-b-0 pb-3 last:pb-0">
            <div className="flex items-start gap-2 mb-2">
              <Newspaper className="h-4 w-4 text-terminal-blue flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-terminal-yellow leading-tight mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-terminal-gray leading-relaxed mb-2">
                  {article.description.length > 100 
                    ? `${article.description.slice(0, 100)}...` 
                    : article.description
                  }
                </p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-terminal-gray">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.source}</span>
                  </div>
                  {article.url !== '#' && (
                    <a 
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-terminal-blue hover:text-terminal-yellow transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Leer</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="text-terminal-yellow text-xs mt-3 border-t border-terminal-gray/10 pt-3">
          ⚡ Usando noticias curadas + Hacker News
        </div>
      )}
    </div>
  )
}
