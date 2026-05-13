# Checkpoint Tecnológico — Finance Couple App MVP

## Estado del Repositorio (May 2026)
- El repositorio se encontraba vacío: sin `build.gradle`, manifests ni código fuente.
- La documentación original sugería Android nativo (Gradle) o multiplataforma (Flutter / React Native).
- Los prototipos existentes son archivos HTML autónomos con React 18 cargado vía CDN + Babel standalone.

## Decisión Tecnológica para el MVP

**Stack seleccionado: React 18 + Vite (PWA)**

### Justificación
1. **Rapidez de iteración**: Los prototipos HTML ya contienen JSX funcional. Migrar a un proyecto Vite nos permite reutilizar casi todo el código de UI sin reescribirlo.
2. **Sin dependencias de plataforma nativa**: No requiere Android Studio, SDK, Gradle, emulador ni `google-services.json` para funcionar.
3. **Base para el futuro**: Una PWA bien hecha puede envolverse después con Capacitor o Tauri para distribución en stores, o servir de base para una migración a React Native.
4. **Documentación de referencia**: La doc técnica mencionaba React Native como opción viable; una PWA con React comparte el mismo paradigma de componentes.

### Stack detallado
| Capa | Tecnología |
|------|------------|
| Framework UI | React 18 |
| Build tool | Vite 6 |
| Estilos | CSS Modules + variables (basado en tokens del prototipo) |
| Fuentes | DM Sans (Google Fonts) |
| Datos | Mock in-memory (sin backend por ahora) |
| PWA | `vite-plugin-pwa` (pendiente de activar en fase 2) |

### Próximos pasos post-MVP
1. Evaluar si se requiere backend real (NestJS / FastAPI) según roadmap.
2. Integrar autenticación y persistencia (Supabase/Firebase).
3. Agregar procesamiento de voz/imagen con APIs de IA (Whisper, GPT-4o-mini, Vision OCR).
4. Decidir si se envuelve la PWA en Capacitor para publicar en stores.
