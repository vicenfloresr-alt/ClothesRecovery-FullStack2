# ClothesRecovery — Frontend (React)

Tienda online de ropa streetwear de segunda vida. Evaluación Parcial 3 de DSY1104 (Desarrollo Fullstack II).
Hecho con React (Create React App), React Router y Bootstrap. Se conecta por `fetch` al backend de microservicios
en Spring Boot a través del API Gateway (`http://localhost:9090/api/v1`), con autenticación JWT por roles.

## Cómo ejecutarlo

Requisitos: Node.js, npm y el backend encendido (MySQL en XAMPP + los microservicios + el API Gateway).

```
npm install
npm start          # abre http://localhost:3000
npm run build      # genera la carpeta build
npm run test:karma # pruebas unitarias con Jasmine + Karma (necesita Google Chrome)
```

## Usuarios de prueba

| Rol | Correo | Contraseña | Qué puede hacer |
|---|---|---|---|
| Administrador | admin@clothesrecovery.cl | admin123 | Todo: crear, editar y eliminar productos, ver pedidos y clientes |
| Vendedor | vendedor@clothesrecovery.cl | vendedor123 | Ver la lista y el detalle de productos y pedidos |
| Cliente | se crea desde "Crear cuenta" | — | Comprar en la tienda |

Los administradores y vendedores entran al panel en `/admin`. Los clientes solo acceden a la tienda.

## Endpoints que usa el frontend

| Pantalla | Método y ruta |
|---|---|
| Login | `POST /auth/login` |
| Registro | `POST /auth/registro` |
| Tienda, categorías, ofertas, detalle | `GET /productos` |
| Compra | `PUT /productos/{id}/descontar/{cantidad}` y `POST /pedidos` |
| Panel: productos | `GET /productos/{id}`, `POST /productos`, `PUT /productos/{id}`, `DELETE /productos/{id}` |
| Panel: pedidos | `GET /pedidos`, `GET /pedidos/{id}` |
| Panel: clientes (solo admin) | `GET /clientes` |

## Estructura

- `src/pages/` — una vista por ruta (Home, Productos, Carrito, Comprar, Admin, etc.)
- `src/components/` — piezas reutilizables (Navbar, ProductoCard, AdminProductos, AdminPedidos, AdminClientes, ...)
- `src/context/` — `SesionContext` (usuario, rol y token), `ProductosContext` (catálogo cargado desde el backend) y `CarritoContext`
- `src/data/api.js` — función `pedirApi` que hace los `fetch` al gateway y agrega el token JWT
- `src/data/` — funciones que llaman al backend (productos, usuarios, pedidos, clientes)
- `src/test-utils/` — datos de prueba y `fetch` simulado para las pruebas
- `*.spec.js` / `*.spec.jsx` — pruebas con Jasmine
- `karma.conf.js` — configuración de Karma

Nota: las pruebas están escritas con Jasmine y se corren con `npm run test:karma`. Simulan las respuestas del backend
con `spyOn(window, 'fetch')`, así que no necesitan el backend encendido. El comando `npm test` es el de Jest que trae
Create React App y no es compatible con estas pruebas.
