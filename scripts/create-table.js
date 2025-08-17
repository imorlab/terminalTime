#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔑 Configurando Supabase...')
console.log('🌐 URL:', supabaseUrl)
console.log('🔐 Key disponible:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTable() {
  try {
    console.log('\n📋 Creando tabla ephemerides...')
    
    // Leer el schema SQL
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Ejecutar el schema completo
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: schema
    })
    
    if (error) {
      console.error('❌ Error creando tabla:', error.message)
      console.log('\n📄 SQL a ejecutar manualmente en Supabase Dashboard:')
      console.log('👉 Ve a https://supabase.com/dashboard → SQL Editor')
      console.log('\n```sql')
      console.log(schema)
      console.log('```')
      return false
    } else {
      console.log('✅ Tabla creada exitosamente')
      return true
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

async function verifyTable() {
  try {
    console.log('\n🔍 Verificando tabla...')
    
    const { data, error } = await supabase
      .from('ephemerides')
      .select('count', { count: 'exact' })
    
    if (error) {
      console.error('❌ Error verificando tabla:', error.message)
      return false
    } else {
      console.log('✅ Tabla verificada - Registros:', data?.length || 0)
      return true
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Configurando tabla ephemerides...\n')
  
  const created = await createTable()
  
  if (created) {
    const verified = await verifyTable()
    if (verified) {
      console.log('\n🎉 ¡Base de datos configurada correctamente!')
    }
  } else {
    console.log('\n⚠️  Necesitas crear la tabla manualmente')
    console.log('🌐 Ve a: https://supabase.com/dashboard')
    console.log('📝 Ejecuta el contenido de database/schema.sql en SQL Editor')
  }
}

main().catch(console.error)
