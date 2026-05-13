# Pareja$ — Finance Couple App

Aplicación de finanzas personales diseñada para parejas jóvenes que buscan gestionar sus gastos compartidos de forma simple y transparente.

## Stack Tecnológico

- **Frontend:** React 18 (JSX)
- **Build Tool:** Vite
- **Wrapper nativo:** Capacitor (Android + iOS)
- **Persistencia local:** SQLite (`@capacitor-community/sqlite`)
- **Estilos:** CSS variables + inline styles (heredados del prototipo HTML)

## Cómo Correr Localmente (Web)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Cómo Correr en Simulador / Dispositivo

### 1. Build y sincronizar

```bash
npm run build
npx cap sync
```

### 2. Android

```bash
npx cap open android
```

Luego presiona **Run** en Android Studio con un emulador o dispositivo conectado.

### 3. iOS

```bash
npx cap open ios
```

Luego presiona **Run** en Xcode con un simulador o dispositivo conectado.

> Requiere macOS + Xcode para compilar iOS.

## Sobre este MVP

Este es el primer **MVP** creado a partir del prototipo HTML del directorio de documentación. Los datos se persisten localmente en SQLite, por lo que funcionan offline y sobreviven reinicios de la app.

## Roadmap

1. ✅ **Capacitor + SQLite** — app nativa offline-first.
2. **Backend + Auth** — sincronización en la nube y autenticación de usuarios/parejas.
3. **IA (voz/foto)** — escanear tickets y registrar gastos por voz.
4. **Push notifications** — recordatorios y alertas de presupuesto.
