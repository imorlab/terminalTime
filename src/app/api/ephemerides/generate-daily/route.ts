import { NextRequest, NextResponse } from 'next/server'

// Solo crear cliente de Supabase si las variables están disponibles Y son válidas
let supabase: any = null
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (supabaseUrl && supabaseKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseKey !== 'your_supabase_service_role_key_here' &&
    supabaseUrl.startsWith('http')) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase client creado para generación diaria')
  } catch (error) {
    console.log('❌ Error creando cliente Supabase:', error)
    supabase = null
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🕐 CRON JOB: Generación diaria iniciada a las', new Date().toISOString())
    
    // Usar zona horaria de Madrid para determinar la fecha
    const madridDate = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" })
    const todayString = madridDate // Formato YYYY-MM-DD confiable
    
    console.log('🌍 Fecha UTC:', new Date().toISOString().split('T')[0])
    console.log('🇪🇸 Fecha Madrid:', todayString)
    
    // Verificar si ya existe una efeméride para hoy
    if (supabase) {
      try {
        const { data: existing } = await supabase
          .from('ephemerides')
          .select('id')
          .eq('date', todayString)
          .single()
        
        if (existing) {
          console.log('✅ Ya existe efeméride para hoy:', todayString)
          return NextResponse.json({ 
            success: true, 
            message: 'Efeméride ya existe para hoy',
            date: todayString,
            timezone: 'Europe/Madrid'
          })
        }
      } catch (error) {
        console.log('🔍 No existe efeméride para hoy, generando...')
      }
    }
    
    // Generar nueva efeméride
    const generatedEphemeride = await generateTodayEphemeride()
    
    if (!generatedEphemeride) {
      console.log('❌ No se pudo generar efeméride')
      return NextResponse.json({ 
        success: false, 
        error: 'No se pudo generar efeméride' 
      }, { status: 500 })
    }
    
    // Guardar en base de datos
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('ephemerides')
          .upsert([generatedEphemeride], { 
            onConflict: 'date',
            ignoreDuplicates: false 
          })
          .select()
          .single()
        
        if (error) {
          console.log('❌ Error guardando efeméride:', error)
          return NextResponse.json({ 
            success: false, 
            error: 'Error guardando en BD' 
          }, { status: 500 })
        }
        
        console.log('✅ Efeméride generada y guardada exitosamente para:', todayString)
        return NextResponse.json({ 
          success: true, 
          message: 'Efeméride generada exitosamente',
          ephemeride: data 
        })
        
      } catch (saveError) {
        console.log('❌ Error salvando:', saveError)
        return NextResponse.json({ 
          success: false, 
          error: 'Error en base de datos' 
        }, { status: 500 })
      }
    } else {
      console.log('⚠️ Supabase no configurado para cron job')
      return NextResponse.json({ 
        success: false, 
        error: 'Base de datos no configurada' 
      }, { status: 503 })
    }
    
  } catch (error) {
    console.error('❌ Error en cron job diario:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}

async function generateTodayEphemeride() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const apiUrl = process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'
  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4'
  
  console.log('🔑 CRON: API Key disponible:', !!apiKey)
  console.log('🌐 CRON: Using API:', process.env.DEEPSEEK_API_KEY ? 'DeepSeek' : 'OpenAI')
  
  if (!apiKey) {
    console.log('❌ CRON: No API key disponible')
    return null
  }
  
  try {
    // Usar fecha de Madrid para consistencia
    const todayString = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" })
    const madridDate = new Date().toLocaleDateString("es-ES", { 
      timeZone: "Europe/Madrid",
      day: 'numeric',
      month: 'long'
    })
    const [day, month] = madridDate.split(' de ')
    
    console.log('🇪🇸 CRON: Generando para fecha Madrid:', todayString, `(${day} de ${month})`)
    
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
            content: `Genera una efeméride para el día ${day} de ${month} relacionada con programación, tecnología, informática o desarrollo de software. Debe ser un evento real e histórico. 

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin bloques de código, sin texto adicional. Solo el JSON:

{
  "title": "Título del evento (máximo 80 caracteres)",
  "description": "Descripción detallada del evento (EXACTAMENTE entre 400-500 caracteres, completa y bien redactada)",
  "year": año_del_evento,
  "category": "Categoría del evento"
}

REQUISITOS ESPECÍFICOS:
- La descripción debe tener entre 400-500 caracteres
- Debe ser informativa y completa en ese espacio
- No uses puntos suspensivos ni cortes abruptos
- Incluye detalles relevantes del evento histórico`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ CRON: Error en API response:', response.status, response.statusText)
      throw new Error(`Error en la API: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    let content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No se recibió contenido de la API')
    }
    
    // Limpiar markdown de la respuesta si existe
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim()
    console.log('🧹 CRON: Contenido limpiado:', content.substring(0, 100) + '...')
    
    const ephemeride = JSON.parse(content)
    
    return {
      id: `daily-${Date.now()}`,
      date: todayString,
      title: ephemeride.title,
      description: ephemeride.description,
      year: ephemeride.year,
      category: ephemeride.category,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ CRON: Error generando efeméride:', error)
    return null
  }
}
