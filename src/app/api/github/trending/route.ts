import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // GitHub API pública (sin necesidad de token para requests básicos)
    const response = await fetch(
      'https://api.github.com/search/repositories?q=created:>2024-08-01+language:typescript+language:javascript&sort=stars&order=desc&per_page=5',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TerminalTime-App'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('GitHub API error')
    }
    
    const data = await response.json()
    
    const projects = data.items.map((repo: any) => ({
      title: repo.full_name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at
    }))
    
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching GitHub trending:', error)
    
    // Fallback data
    const fallbackProjects = [
      {
        title: 'microsoft/TypeScript',
        description: 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
        url: 'https://github.com/microsoft/TypeScript',
        stars: 95000,
        language: 'TypeScript',
        updatedAt: new Date().toISOString()
      },
      {
        title: 'vercel/next.js',
        description: 'The React Framework for the Web',
        url: 'https://github.com/vercel/next.js',
        stars: 120000,
        language: 'JavaScript',
        updatedAt: new Date().toISOString()
      }
    ]
    
    return NextResponse.json({ projects: fallbackProjects })
  }
}
