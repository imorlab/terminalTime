# 🔑 Configuración de DeepSeek API

## Pasos para agregar tu API key de DeepSeek:

### 1. Obtener la API Key
1. Ve a [DeepSeek Platform](https://platform.deepseek.com/)
2. Regístrate o inicia sesión
3. Ve a la sección "API Keys"
4. Crea una nueva API key

### 2. Configurar en TerminalTime
1. Abre el archivo `.env.local` en tu editor
2. Reemplaza `tu_deepseek_api_key_aqui` con tu API key real:

```bash
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Reiniciar el servidor
```bash
npm run dev
```

## ✨ Beneficios de usar DeepSeek

- **Más económico** que OpenAI GPT-4
- **Excelente calidad** en español
- **Especializado** en código y tecnología
- **API compatible** con OpenAI (mismo formato)

## 📝 Notas importantes

- Solo necesitas **UNA** API key (DeepSeek O OpenAI, no ambas)
- Si tienes ambas configuradas, **DeepSeek tendrá prioridad**
- Las efemérides funcionan sin API key (usa contenido de ejemplo)
- Con API key obtienes **efemérides personalizadas cada día**

## 🔄 Fallbacks disponibles

1. **Con DeepSeek**: Efemérides personalizadas del día
2. **Sin API key**: Efemérides de ejemplo predefinidas
3. **Error de API**: Graceful fallback a contenido de ejemplo

¡Ya tienes todo configurado para usar DeepSeek! 🚀
