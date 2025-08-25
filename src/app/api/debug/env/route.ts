import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    // DeepSeek API
    hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
    deepSeekKeyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
    deepSeekKeyPreview: process.env.DEEPSEEK_API_KEY?.substring(0, 15) + '...' || 'no key',
    
    // Supabase
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...' || 'no url',
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseAnonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseServiceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    
    // Other APIs
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasWeatherKey: !!process.env.OPENWEATHER_API_KEY,
    hasNewsKey: !!process.env.NEWS_API_KEY,
    
    // Environment
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    
    // Database status
    supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           process.env.SUPABASE_SERVICE_ROLE_KEY &&
                           process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'))
  })
}
