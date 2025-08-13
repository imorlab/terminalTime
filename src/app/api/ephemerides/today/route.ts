import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    // Intentar obtener efeméride del día actual
    let { data: ephemeride, error } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('date', todayString)
      .single()
    
    if (error || !ephemeride) {
      // Si no hay efeméride para hoy, generar una nueva
      const generatedEphemeride = await generateTodayEphemeride()
      
      if (generatedEphemeride) {
        // Guardar en la base de datos
        const { data: newEphemeride, error: insertError } = await supabase
          .from('ephemerides')
          .insert([generatedEphemeride])
          .select()
          .single()
        
        if (!insertError && newEphemeride) {
          ephemeride = newEphemeride
        } else {
          // Si falla guardar, devolver la generada
          ephemeride = generatedEphemeride
        }
      } else {
        // Fallback: devolver una efeméride de ejemplo
        ephemeride = {
          id: 'example-1',
          date: todayString,
          title: 'Nacimiento de Ada Lovelace',
          description: 'En 1815 nació Augusta Ada King, condesa de Lovelace, considerada la primera programadora de la historia. Escribió el primer algoritmo destinado a ser procesado por una máquina, específicamente la Máquina Analítica de Charles Babbage.',
          year: 1815,
          category: 'Historia de la Programación',
          created_at: new Date().toISOString()
        }
      }
    }
    
    return NextResponse.json(ephemeride)
  } catch (error) {
    console.error('Error al obtener efeméride:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function generateTodayEphemeride() {
  if (!process.env.OPENAI_API_KEY) {
    return null
  }
  
  try {
    const today = new Date()
    const month = today.toLocaleDateString('es-ES', { month: 'long' })
    const day = today.getDate()
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en historia de la programación y tecnología. Genera efemérides interesantes y precisas.'
          },
          {
            role: 'user',
            content: `Genera una efeméride para el día ${day} de ${month} relacionada con programación, tecnología, informática o desarrollo de software. Debe ser un evento real e histórico. Responde SOLO con un JSON válido con estos campos:
            {
              "title": "Título del evento",
              "description": "Descripción detallada del evento (mínimo 100 palabras)",
              "year": año_del_evento,
              "category": "Categoría del evento"
            }`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      throw new Error('Error en la API de OpenAI')
    }
    
    const data = await response.json()
    const content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No se recibió contenido de OpenAI')
    }
    
    const ephemeride = JSON.parse(content)
    
    return {
      id: `generated-${Date.now()}`,
      date: today.toISOString().split('T')[0],
      title: ephemeride.title,
      description: ephemeride.description,
      year: ephemeride.year,
      category: ephemeride.category,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generando efeméride:', error)
    return null
  }
}
