# 💰 Control de Deudas

App móvil para gestionar tus deudas personales. Construida con React + Vite.

## Funciones

- 📊 Dashboard con resumen de deudas
- 📋 Agregar, editar y eliminar deudas
- 📅 Historial de pagos
- 🧮 Calculadora de intereses con tabla de amortización
- 💾 Datos guardados en localStorage (persisten entre sesiones)

## Estructura del proyecto

```
src/
├── context/
│   └── AppContext.jsx       # Estado global y localStorage
├── components/
│   ├── UI.jsx               # Componentes reutilizables (Card, Modal, Badge...)
│   ├── UI.module.css
│   ├── DeudaCard.jsx        # Tarjeta de cada deuda
│   ├── DeudaCard.module.css
│   ├── ModalDeuda.jsx       # Modal para agregar/editar deuda
│   └── ModalPago.jsx        # Modal para registrar pago
├── screens/
│   ├── Dashboard.jsx        # Pantalla de inicio
│   ├── Dashboard.module.css
│   ├── Deudas.jsx           # Lista de deudas
│   ├── Deudas.module.css
│   ├── Pagos.jsx            # Historial de pagos
│   ├── Pagos.module.css
│   ├── Calculadora.jsx      # Calculadora de intereses
│   └── Calculadora.module.css
├── utils/
│   └── format.js            # Funciones de formato y utilidades
├── App.jsx                  # Layout principal + navegación
├── App.module.css
├── main.jsx                 # Entry point
└── index.css                # Variables CSS globales
```

## Instalación y uso local

```bash
npm install
npm run dev
```

Abre http://localhost:5173 en el navegador.

## Build para producción

```bash
npm run build
```

Los archivos quedan en la carpeta `dist/`.

## Subir a GitHub Pages

1. Haz build: `npm run build`
2. Crea un repositorio en GitHub
3. Sube la carpeta `dist/` como rama `gh-pages`:

```bash
npm install -g gh-pages
gh-pages -d dist
```

O manualmente: sube el contenido de `dist/` a tu repositorio y activa GitHub Pages en Settings → Pages.

## Tecnologías

- React 18
- Vite 5
- CSS Modules
- localStorage para persistencia
