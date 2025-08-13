# Guía para configurar variables de entorno en Vercel

## Variables de entorno necesarias en Vercel:

1. **DEEPSEEK_API_KEY** (obligatorio para efemérides personalizadas)
   - Valor: Tu API key de DeepSeek
   - Ejemplo: sk-9685e5e24526418095ff0de70d6eb1e3

2. **NEXT_PUBLIC_SUPABASE_URL** (opcional)
   - Solo si quieres persistir efemérides en base de datos

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** (opcional)
   - Solo si usas Supabase

4. **SUPABASE_SERVICE_ROLE_KEY** (opcional)
   - Solo si usas Supabase

## Cómo agregar en Vercel Dashboard:

1. Ve a tu proyecto en vercel.com
2. Settings > Environment Variables
3. Agrega: DEEPSEEK_API_KEY = tu_api_key_real
4. Save

## Nota importante:
- Sin DEEPSEEK_API_KEY las efemérides usarán contenido de ejemplo
- Las noticias y clima funcionan sin API keys adicionales
