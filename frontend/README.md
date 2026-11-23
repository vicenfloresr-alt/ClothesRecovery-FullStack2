# ClothesRecovery — Frontend (React)

Tienda online de ropa streetwear de segunda vida. Evaluación Parcial 2 de DSY1104 (Desarrollo Fullstack II).
Hecho con React (Create React App), React Router y Bootstrap. No tiene backend: los datos son archivos JavaScript
con funciones CRUD (`src/data/`) y el carrito y los pedidos se guardan en `localStorage`.

## Cómo ejecutarlo

Requisitos: Node.js y npm.

```
npm install
npm start          # abre http://localhost:3000
npm run build      # genera la carpeta build
npm run test:karma # pruebas unitarias con Jasmine + Karma (necesita Google Chrome)
```

Usuario de prueba: `pixu@clothesrecovery.cl` / `12345`.

## Estructura

- `src/pages/` — una vista por ruta (Home, Productos, Carrito, Comprar, etc.)
- `src/components/` — piezas reutilizables (Navbar, Footer, ProductoCard, ...)
- `src/context/CarritoContext.jsx` — carrito compartido con Context
- `src/data/` — base de datos simulada y funciones CRUD
- `*.spec.js` / `*.spec.jsx` — pruebas con Jasmine
- `karma.conf.js` — configuración de Karma

Nota: las pruebas están escritas con Jasmine y se corren con `npm run test:karma`. El comando `npm test` es el de Jest que trae Create React App y no es compatible con estas pruebas (usan funciones propias de Jasmine).
