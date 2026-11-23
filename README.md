# ClothesRecovery — Fullstack II (DSY1104)

Tienda online de ropa streetwear de segunda vida. Evaluación Parcial 3: frontend en React integrado con un
backend de microservicios en Spring Boot, autenticación JWT por roles y documentación con Swagger.

## Estructura

| Carpeta | Contenido |
|---|---|
| `frontend/` | Tienda en React + Bootstrap. Consume la API con `fetch`. Pruebas con Jasmine y Karma. |
| `backend/` | 10 microservicios Spring Boot + API Gateway, cada uno con su base de datos MySQL. |
| `docs/` | ERS y documento de cobertura de pruebas. |

## Cómo ejecutarlo (Windows)

1. **MySQL:** en XAMPP, encender MySQL (puerto 3306, usuario `root` sin contraseña). Las bases de datos se crean solas.
2. **Backend:** doble clic en `backend/iniciar-backend.bat`. Abre una ventana por microservicio; esperar
   `Started ...Application` en cada una y no cerrarlas.
3. **Frontend:**
   ```
   cd frontend
   npm install
   npm start
   ```
   Se abre en `http://localhost:3000`.

## Puertos

| Servicio | Puerto | | Servicio | Puerto |
|---|---|---|---|---|
| apigateway | 9090 | | usuarios (auth) | 8086 |
| cliente | 8081 | | inventario | 8087 |
| catalogo | 8082 | | devoluciones | 8088 |
| pedido | 8083 | | resenas | 8089 |
| pago | 8084 | | notificaciones | 8090 |
| envio | 8085 | | frontend | 3000 |

El frontend solo habla con el API Gateway: `http://localhost:9090/api/v1`.
Cada microservicio documenta sus endpoints en `http://localhost:<puerto>/swagger-ui.html`.

## Usuarios y roles

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | admin@clothesrecovery.cl | admin123 | Todo: productos, pedidos y clientes |
| Vendedor | vendedor@clothesrecovery.cl | vendedor123 | Ver lista y detalle de productos y pedidos |
| Cliente | se crea en "Crear cuenta" | — | Solo la tienda: comprar, reseñas, devoluciones |

El detalle de los endpoints que usa cada pantalla está en `frontend/README.md`.
