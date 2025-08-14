import { NextRequest, NextResponse } from 'next/server'

// Solo crear cliente de Supabase si las variables están disponibles
let supabase: any = null
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  try {
    console.log('🔑 DEEPSEEK_API_KEY disponible:', !!process.env.DEEPSEEK_API_KEY)
    console.log('� DEEPSEEK_API_KEY length:', process.env.DEEPSEEK_API_KEY?.length || 0)
    console.log('�📅 Generando efeméride para:', new Date().toISOString().split('T')[0])
    
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    let ephemeride = null

    // Solo intentar base de datos si Supabase está configurado
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('ephemerides')
          .select('*')
          .eq('date', todayString)
          .single()
        
        if (!error && data) {
          ephemeride = data
        }
      } catch (dbError) {
        console.log('DB no disponible, usando generación:', dbError)
      }
    }
    
    if (!ephemeride) {
      // Si no hay efeméride en DB, generar una nueva
      console.log('💡 Intentando generar efeméride con IA...')
      const generatedEphemeride = await generateTodayEphemeride()
      
      if (generatedEphemeride) {
        console.log('✅ Efeméride generada con IA exitosamente')
        ephemeride = generatedEphemeride
        
        // Solo guardar en DB si Supabase está disponible
        if (supabase) {
          try {
            const { data: newEphemeride, error: insertError } = await supabase
              .from('ephemerides')
              .insert([generatedEphemeride])
              .select()
              .single()
            
            if (!insertError && newEphemeride) {
              ephemeride = newEphemeride
            }
          } catch (saveError) {
            console.log('No se pudo guardar en DB:', saveError)
          }
        }
      } else {
        console.log('⚠️ Usando fallback: No se pudo generar con IA')
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
  // Priorizar DeepSeek sobre OpenAI
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const apiUrl = process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'
  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4'
  
  console.log('🔑 API Key disponible:', !!apiKey)
  console.log('🔑 API Key length:', apiKey?.length || 0)
  console.log('🌐 Using API:', process.env.DEEPSEEK_API_KEY ? 'DeepSeek' : 'OpenAI')
  console.log('🤖 Model:', model)
  
  if (!apiKey) {
    console.log('❌ No API key disponible')
    return null
  }
  
  try {
    const today = new Date()
    const month = today.toLocaleDateString('es-ES', { month: 'long' })
    const day = today.getDate()
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
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
      const errorText = await response.text()
      console.log('❌ Error en API response:', response.status, response.statusText)
      console.log('❌ Error details:', errorText)
      throw new Error(`Error en la API de ${process.env.DEEPSEEK_API_KEY ? 'DeepSeek' : 'OpenAI'}: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ Respuesta de API recibida:', !!data.choices?.[0]?.message?.content)
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
