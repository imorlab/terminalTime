#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas')
  console.error('Asegúrate de que NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY estén en .env.local')
  process.exit(1)
}

console.log('🔑 Conectando a Supabase...')
console.log('🌐 URL:', supabaseUrl)
console.log('🔐 Key length:', supabaseKey.length)

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('\n📊 Verificando si la tabla ephemerides existe...')
    
    // Probar si la tabla existe intentando hacer una consulta
    const { data, error } = await supabase
      .from('ephemerides')
      .select('id')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "ephemerides" does not exist')) {
        console.log('📋 La tabla ephemerides no existe. Necesita ser creada manualmente en Supabase.')
        console.log('\n🛠️  Para crear la tabla:')
        console.log('1. Ve a https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0])
        console.log('2. Ve a SQL Editor')
        console.log('3. Ejecuta el contenido de database/schema.sql')
        console.log('\n📄 Contenido del schema:')
        
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
        const schema = fs.readFileSync(schemaPath, 'utf8')
        console.log('\n' + schema)
        
        return false
      } else {
        console.error('❌ Error al acceder a la tabla:', error.message)
        return false
      }
    } else {
      console.log('✅ La tabla ephemerides existe y es accesible')
      console.log('📊 Registros encontrados:', data?.length || 0)
      
      // Mostrar algunos datos de ejemplo
      if (data && data.length > 0) {
        const { data: sampleData } = await supabase
          .from('ephemerides')
          .select('*')
          .limit(3)
        
        console.log('\n📋 Datos de ejemplo:')
        sampleData?.forEach(item => {
          console.log(`- ${item.date}: ${item.title}`)
        })
      }
      
      return true
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión básica...')
    
    // Probar directamente intentando crear una consulta simple
    const { data, error } = await supabase
      .from('ephemerides')
      .select('id')
      .limit(1)
    
    if (error) {
      // Si la tabla no existe, la conexión está bien, solo falta la tabla
      if (error.message.includes('relation "ephemerides" does not exist')) {
        console.log('✅ Conexión exitosa - La tabla ephemerides no existe (se creará)')
        return true
      } else {
        console.error('❌ Error de conexión:', error.message)
        return false
      }
    } else {
      console.log('✅ Conexión exitosa - Tabla ephemerides accesible')
      return true
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Configurando base de datos TerminalTime...\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.error('\n❌ Error: No se pudo conectar a Supabase')
    console.error('Verifica las credenciales en .env.local')
    process.exit(1)
  }
  
  const tableExists = await setupDatabase()
  
  if (tableExists) {
    console.log('\n🎉 ¡Base de datos configurada correctamente!')
    console.log('💡 El sistema de efemérides usará la base de datos como fuente principal')
  } else {
    console.log('\n⚠️  La tabla debe crearse manualmente en Supabase')
    console.log('🔄 El sistema funcionará con IA + fallback mientras tanto')
  }
}

main().catch(console.error)
