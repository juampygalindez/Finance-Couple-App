# Agent Notes: Finance-Couple-App

## Project Type
App nativa híbrida. Stack: React 18 + Vite + Capacitor (Android + iOS), con persistencia local SQLite.

> **Nota histórica:** El repositorio fue inicializado con expectativas de Android nativo (Gradle/Firebase), migró a PWA con React + Vite, y ahora usa Capacitor para envolver la webview como app nativa.

## Current State
- **MVP funcional offline:** existe `package.json`, código fuente en `src/`, y plataformas nativas (`android/`, `ios/`).
- Se migró desde un prototipo HTML puro.
- Persistencia: SQLite vía `@capacitor-community/sqlite`.
- No backend ni auth (aún).

## Stack Actual
- **Build tool:** Vite
  - `npm run dev` — servidor de desarrollo
  - `npm run build` — build de producción
- **Wrapper nativo:** Capacitor
  - `npx cap sync` — copia assets y plugins a plataformas nativas
  - `npx cap open android` — abre Android Studio
  - `npx cap open ios` — abre Xcode
- **Frontend:** React 18 (JSX, no TypeScript por ahora)
- **Estilos:** CSS variables + inline styles (basado en prototipo)
- **Persistencia:** SQLite local (`src/utils/database.js`)
  - Tablas: `transactions`, `goals`
  - Seed automático con datos mock si las tablas están vacías
- **Entry point:** `src/main.jsx` → `src/App.jsx`

## Convenciones de Código
- Componentes en `src/components/`
- Datos mock y tokens en `src/data/`
- Utilidades en `src/utils/`
- Capa de base de datos en `src/utils/database.js`

## Pre-Commit Checks
1. `npm run build` debe pasar sin errores.
2. `npx cap sync` debe ejecutarse tras el build para actualizar plataformas nativas.
3. (Opcional) ESLint si se agrega después.

## Gotchas
- `google-services.json` y keystore files (`*.jks`, `*.keystore`) **nunca deben ser commiteados**.
- `local.properties` contiene paths del SDK y es específico del entorno.
- `node_modules/`, `dist/`, `android/app/build/`, `ios/App/build/`, `ios/App/Pods/` deben permanecer en `.gitignore`.
- No modificar código dentro de `android/app/src/main/assets/public/` ni `ios/App/App/public/` directamente; esos archivos se regeneran con `npx cap sync`.
