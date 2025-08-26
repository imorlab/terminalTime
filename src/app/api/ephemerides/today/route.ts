import { NextRequest, NextResponse } from 'next/server'
import { getTodayEphemeride } from '@/data/ephemerides'

// Solo crear cliente de Supabase si las variables están disponibles Y son válidas
let supabase: any = null
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verificación más estricta para Supabase
const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseKey !== 'your_supabase_service_role_key_here' &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl.includes('supabase') &&
  supabaseKey.startsWith('eyJ')
)

if (isSupabaseConfigured) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.log('❌ Error creando cliente Supabase:', error)
    supabase = null
  }
} else {
  console.log('⚠️ Supabase no configurado - funcionando en modo IA + fallback solamente')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const useFallback = searchParams.get('fallback') === 'true'
    const forceGenerate = searchParams.get('force') === 'true'
    
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    
    // Si se solicita fallback, ir directamente a datos estáticos
    if (useFallback) {
      const fallbackEphemeride = getTodayEphemeride()
      return NextResponse.json(fallbackEphemeride)
    }
    
    let ephemeride = null

    // PASO 1: Verificar base de datos primero (más rápido) - excepto si se fuerza generación
    if (supabase && !forceGenerate) {
      try {
        const { data, error } = await supabase
          .from('ephemerides')
          .select('*')
          .eq('date', todayString)
          .single()
        
        if (!error && data) {
          ephemeride = data
          return NextResponse.json(ephemeride) // Retorno inmediato si existe en BD
        }
      } catch (dbError) {
        console.log('❌ Error BD, continuando con generación:', dbError)
      }
    }
    
    // PASO 2: Si no existe en BD, generar nueva
    if (!ephemeride) {
      // Obtener efemérides recientes para evitar duplicados
      let recentEphemerides: any[] = []
      if (supabase) {
        try {
          const lastWeek = new Date()
          lastWeek.setDate(lastWeek.getDate() - 7)
          const { data: recent } = await supabase
            .from('ephemerides')
            .select('title, description, year, category')
            .gte('date', lastWeek.toISOString().split('T')[0])
            .order('date', { ascending: false })
          
          recentEphemerides = recent || []
        } catch (err) {
          // Silenciar error de efemérides recientes
        }
      }
      
      const generatedEphemeride = await generateTodayEphemeride(recentEphemerides)
      
      if (generatedEphemeride) {
        ephemeride = generatedEphemeride
        
        // PASO 3: Guardar en BD de forma asíncrona (no bloquear respuesta)
        if (supabase) {
          // Guardar en background sin esperar
          setImmediate(async () => {
            try {
              const { data: newEphemeride, error: insertError } = await supabase
                .from('ephemerides')
                .upsert([generatedEphemeride], { 
                  onConflict: 'date',
                  ignoreDuplicates: false 
                })
                .select()
                .single()
              
              if (insertError) {
                console.log('❌ Error guardando en BD:', insertError)
              }
            } catch (saveError) {
              console.log('❌ Error salvando en BD:', saveError)
            }
          })
        }
      } else {
        ephemeride = getTodayEphemeride()
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

async function generateTodayEphemeride(recentEphemerides: any[] = []) {
  // Priorizar DeepSeek sobre OpenAI
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const apiUrl = process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'
  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4'
  
  if (!apiKey) {
    return null
  }
  
  try {
    const today = new Date()
    const month = today.toLocaleDateString('es-ES', { month: 'long' })
    const day = today.getDate()
    
    // Crear lista de temas/eventos a evitar basado en efemérides recientes
    const recentTopics = recentEphemerides.map(e => `${e.title} (${e.year})`).join(', ')
    const avoidanceText = recentEphemerides.length > 0 
      ? `\n\nIMPORTANTE: NO generes contenido sobre estos temas ya cubiertos recientemente: ${recentTopics}. Busca eventos DIFERENTES y únicos.`
      : ''
    
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
            content: `Genera una efeméride para el día ${day} de ${month} relacionada con programación, tecnología, informática o desarrollo de software. Debe ser un evento real e histórico.${avoidanceText}

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
- Incluye detalles relevantes del evento histórico
- DEBE ser un evento DIFERENTE a los mencionados arriba`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error en la API de ${process.env.DEEPSEEK_API_KEY ? 'DeepSeek' : 'OpenAI'}: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    let content = data.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No se recibió contenido de la API')
    }
    
    // Limpiar markdown de la respuesta si existe
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim()
    
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
