import { NextRequest, NextResponse } from 'next/server'

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
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Supabase no configurado',
        configured: isSupabaseConfigured,
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      })
    }

    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    // Buscar efemérides de los últimos 3 días
    const { data: recentData, error: recentError } = await supabase
      .from('ephemerides')
      .select('*')
      .gte('date', yesterdayString)
      .order('date', { ascending: false })
      .limit(10)

    // Buscar específicamente para hoy
    const { data: todayData, error: todayError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('date', todayString)
      .single()

    // Contar total de efemérides
    const { count, error: countError } = await supabase
      .from('ephemerides')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      status: 'ok',
      currentTime: {
        iso: today.toISOString(),
        local: today.toLocaleDateString('es-ES'),
        todayString,
        yesterdayString
      },
      database: {
        totalCount: count,
        todayExists: !todayError && !!todayData,
        todayData: todayData || null,
        todayError: todayError?.message || null,
        recentEphemerides: recentData || [],
        recentError: recentError?.message || null
      },
      supabaseConfig: {
        configured: isSupabaseConfigured,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0
      }
    })
  } catch (error) {
    console.error('Error en debug:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
