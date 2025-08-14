import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
    keyLength: process.env.DEEPSEEK_API_KEY?.length || 0,
    keyPreview: process.env.DEEPSEEK_API_KEY?.substring(0, 10) + '...' || 'no key',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}
