import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    if (!process.env.NEWS_API_KEY) {
      return NextResponse.json(
        { error: 'API key de News no configurada' },
        { status: 500 }
      )
    }
    
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=technology OR programming OR software OR AI OR javascript OR react&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    )
    
    if (!newsResponse.ok) {
      throw new Error('Error al obtener noticias')
    }
    
    const newsData = await newsResponse.json()
    
    // Filtrar y formatear las noticias
    const formattedArticles = newsData.articles
      .filter((article: any) => 
        article.title && 
        article.description && 
        article.url &&
        !article.title.includes('[Removed]')
      )
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name
      }))
      .slice(0, 5) // Limitar a 5 artículos
    
    return NextResponse.json({ articles: formattedArticles })
  } catch (error) {
    console.error('Error en API de noticias:', error)
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 }
    )
  }
}
