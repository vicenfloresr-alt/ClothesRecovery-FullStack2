-- ==================================================
-- MODELO RELACIONAL ACTUALIZADO: CLOTHES RECOVERY
-- Tienda de Ropa Avant-Garde & Opium Style - Oracle Database
-- ==================================================

-- ==================================================
-- 0. LIMPIEZA DE TABLAS EXISTENTES (DROP CON CONSTRAINTS)
-- ==================================================
DROP TABLE HISTORIAL_ESTADO_PEDIDO CASCADE CONSTRAINTS;
DROP TABLE ENVIO CASCADE CONSTRAINTS;
DROP TABLE PAGO CASCADE CONSTRAINTS;
DROP TABLE DETALLE_PEDIDO CASCADE CONSTRAINTS;
DROP TABLE PEDIDO CASCADE CONSTRAINTS;
DROP TABLE CARRITO_ITEM CASCADE CONSTRAINTS;
DROP TABLE CARRITO_COMPRA CASCADE CONSTRAINTS;
DROP TABLE INVENTARIO CASCADE CONSTRAINTS;
DROP TABLE PRODUCTO CASCADE CONSTRAINTS;
DROP TABLE PROVEEDOR CASCADE CONSTRAINTS;
DROP TABLE CATEGORIA CASCADE CONSTRAINTS;
DROP TABLE DIRECCION_USUARIO CASCADE CONSTRAINTS;
DROP TABLE USUARIO CASCADE CONSTRAINTS;
DROP TABLE ROL_USUARIO CASCADE CONSTRAINTS;

-- ==================================================
-- 1. CREACIÓN DE TABLAS PRINCIPALES
-- ==================================================

-- Tabla: ROL_USUARIO
CREATE TABLE ROL_USUARIO (
    id_rol NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol VARCHAR2(50) NOT NULL UNIQUE,
    descripcion VARCHAR2(200),
    permisos CLOB,
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: USUARIO
CREATE TABLE USUARIO (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    apellido VARCHAR2(100) NOT NULL,
    telefono VARCHAR2(20),
    fecha_nacimiento DATE,
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    email_verificado CHAR(1) DEFAULT 'N' CHECK (email_verificado IN ('S', 'N')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    id_rol NUMBER NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES ROL_USUARIO(id_rol)
);

-- Tabla: DIRECCION_USUARIO (Ajustada por defecto a Chile)
CREATE TABLE DIRECCION_USUARIO (
    id_direccion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    alias VARCHAR2(50) DEFAULT 'Principal',
    calle VARCHAR2(200) NOT NULL,
    numero_exterior VARCHAR2(20) NOT NULL,
    numero_interior VARCHAR2(20),
    colonia VARCHAR2(100) NOT NULL, -- Usado conceptualmente como Comuna
    ciudad VARCHAR2(100) NOT NULL,
    estado VARCHAR2(100) NOT NULL,  -- Usado conceptualmente como Región
    codigo_postal VARCHAR2(10) NOT NULL,
    pais VARCHAR2(50) DEFAULT 'Chile',
    referencias VARCHAR2(300),
    es_principal CHAR(1) DEFAULT 'N' CHECK (es_principal IN ('S', 'N')),
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_direccion_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- Tabla: CATEGORIA
CREATE TABLE CATEGORIA (
    id_categoria NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_categoria VARCHAR2(100) NOT NULL UNIQUE,
    descripcion VARCHAR2(500),
    imagen_url VARCHAR2(500),
    id_categoria_padre NUMBER,
    nivel NUMBER DEFAULT 1 CHECK (nivel BETWEEN 1 AND 5),
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categoria_padre FOREIGN KEY (id_categoria_padre) REFERENCES CATEGORIA(id_categoria)
);

-- Tabla: PROVEEDOR
CREATE TABLE PROVEEDOR (
    id_proveedor NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_empresa VARCHAR2(150) NOT NULL,
    contacto_nombre VARCHAR2(100),
    email VARCHAR2(100),
    telefono VARCHAR2(20),
    direccion VARCHAR2(300),
    rfc VARCHAR2(15) UNIQUE, -- Equivalente conceptual a RUT/RUT Empresa en Chile
    calificacion NUMBER(2,1) CHECK (calificacion BETWEEN 0 AND 5),
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas CLOB
);

-- Tabla: PRODUCTO
CREATE TABLE PRODUCTO (
    id_producto NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku VARCHAR2(50) NOT NULL UNIQUE,
    nombre_producto VARCHAR2(200) NOT NULL,
    descripcion CLOB,
    descripcion_corta VARCHAR2(500),
    precio NUMBER(10,2) NOT NULL CHECK (precio >= 0),
    costo NUMBER(10,2) CHECK (costo >= 0),
    id_categoria NUMBER NOT NULL,
    id_proveedor NUMBER,
    imagen_principal VARCHAR2(500),
    imagenes_adicionales CLOB,
    tallas_disponibles VARCHAR2(100),
    colores_disponibles VARCHAR2(200),
    material VARCHAR2(100),
    peso_kg NUMBER(8,3),
    activo CHAR(1) DEFAULT 'S' CHECK (activo IN ('S', 'N')),
    destacado CHAR(1) DEFAULT 'N' CHECK (destacado IN ('S', 'N')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria),
    CONSTRAINT fk_producto_proveedor FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor)
);

-- Tabla: INVENTARIO
CREATE TABLE INVENTARIO (
    id_inventario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto NUMBER NOT NULL UNIQUE,
    stock_total NUMBER DEFAULT 0 CHECK (stock_total >= 0),
    stock_minimo NUMBER DEFAULT 5 CHECK (stock_minimo >= 0),
    stock_reservado NUMBER DEFAULT 0 CHECK (stock_reservado >= 0),
    stock_disponible NUMBER GENERATED ALWAYS AS (stock_total - stock_reservado) VIRTUAL,
    ubicacion_almacen VARCHAR2(50),
    ultima_entrada TIMESTAMP,
    ultima_salida TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventario_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto) ON DELETE CASCADE
);

-- Tabla: CARRITO_COMPRA
CREATE TABLE CARRITO_COMPRA (
    id_carrito NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMBER(12,2) DEFAULT 0,
    descuento_total NUMBER(12,2) DEFAULT 0,
    total NUMBER(12,2) DEFAULT 0,
    estado VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'ABANDONADO', 'CONVERTIDO')),
    CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- Tabla: CARRITO_ITEM
CREATE TABLE CARRITO_ITEM (
    id_item NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_carrito NUMBER NOT NULL,
    id_producto NUMBER NOT NULL,
    cantidad NUMBER NOT NULL CHECK (cantidad > 0),
    talla_seleccionada VARCHAR2(10),
    color_seleccionado VARCHAR2(50),
    precio_unitario NUMBER(10,2) NOT NULL,
    subtotal NUMBER(12,2) GENERATED ALWAYS AS (cantidad * precio_unitario) VIRTUAL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_carrito FOREIGN KEY (id_carrito) REFERENCES CARRITO_COMPRA(id_carrito) ON DELETE CASCADE,
    CONSTRAINT fk_item_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    CONSTRAINT uk_carrito_producto UNIQUE (id_carrito, id_producto, talla_seleccionada, color_seleccionado)
);

-- Tabla: PEDIDO
CREATE TABLE PEDIDO (
    id_pedido NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero_pedido VARCHAR2(20) NOT NULL UNIQUE,
    id_usuario NUMBER NOT NULL,
    id_direccion_envio NUMBER NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_estimada DATE,
    subtotal NUMBER(12,2) NOT NULL CHECK (subtotal >= 0),
    descuento NUMBER(12,2) DEFAULT 0 CHECK (descuento >= 0),
    impuestos NUMBER(12,2) DEFAULT 0 CHECK (impuestos >= 0),
    costo_envio NUMBER(10,2) DEFAULT 0 CHECK (costo_envio >= 0),
    total NUMBER(12,2) NOT NULL CHECK (total >= 0),
    estado VARCHAR2(30) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO', 'DEVUELTO')),
    metodo_pago VARCHAR2(50),
    notas_cliente VARCHAR2(500),
    ip_address VARCHAR2(45),
    user_agent VARCHAR2(500),
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    CONSTRAINT fk_pedido_direccion FOREIGN KEY (id_direccion_envio) REFERENCES DIRECCION_USUARIO(id_direccion)
);

-- Tabla: DETALLE_PEDIDO
CREATE TABLE DETALLE_PEDIDO (
    id_detalle NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido NUMBER NOT NULL,
    id_producto NUMBER NOT NULL,
    cantidad NUMBER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMBER(10,2) NOT NULL CHECK (precio_unitario >= 0),
    descuento_unitario NUMBER(10,2) DEFAULT 0,
    subtotal NUMBER(12,2) NOT NULL,
    talla VARCHAR2(10),
    color VARCHAR2(50),
    personalizacion VARCHAR2(300),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
);

-- Tabla: PAGO
CREATE TABLE PAGO (
    id_pago NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido NUMBER NOT NULL UNIQUE,
    monto NUMBER(12,2) NOT NULL CHECK (monto > 0),
    metodo_pago VARCHAR2(50) NOT NULL CHECK (metodo_pago IN ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'PAYPAL', 'EFECTIVO', 'OXXO', 'DEPOSITO')),
    estado_pago VARCHAR2(30) DEFAULT 'PENDIENTE' CHECK (estado_pago IN ('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'RECHAZADO', 'REEMBOLSADO')),
    referencia_pago VARCHAR2(100),
    id_transaccion_externa VARCHAR2(100),
    fecha_pago TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_pago_encriptados CLOB,
    comprobante_url VARCHAR2(500),
    CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido)
);

-- Tabla: ENVIO
CREATE TABLE ENVIO (
    id_envio NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido NUMBER NOT NULL UNIQUE,
    id_direccion_destino NUMBER NOT NULL,
    transportista VARCHAR2(100),
    metodo_envio VARCHAR2(50) CHECK (metodo_envio IN ('ESTANDAR', 'EXPRESS', 'OVERNIGHT', 'RECOGER_TIENDA')),
    numero_guia VARCHAR2(50),
    url_rastreo VARCHAR2(500),
    costo_envio NUMBER(10,2) DEFAULT 0,
    estado_envio VARCHAR2(30) DEFAULT 'PENDIENTE' CHECK (estado_envio IN ('PENDIENTE', 'PREPARANDO', 'EN_TRANSITO', 'EN_REPARTO', 'ENTREGADO', 'DEVUELTO')),
    fecha_envio TIMESTAMP,
    fecha_entrega_estimada DATE,
    fecha_entrega_real TIMESTAMP,
    receptor_nombre VARCHAR2(100),
    receptor_relacion VARCHAR2(50),
    firma_entrega_url VARCHAR2(500),
    notas_entrega VARCHAR2(500),
    CONSTRAINT fk_envio_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido),
    CONSTRAINT fk_envio_direccion FOREIGN KEY (id_direccion_destino) REFERENCES DIRECCION_USUARIO(id_direccion)
);

-- Tabla: HISTORIAL_ESTADO_PEDIDO
CREATE TABLE HISTORIAL_ESTADO_PEDIDO (
    id_historial NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido NUMBER NOT NULL,
    estado_anterior VARCHAR2(30),
    estado_nuevo VARCHAR2(30) NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario_modifico NUMBER,
    motivo_cambio VARCHAR2(300),
    ip_address VARCHAR2(45),
    CONSTRAINT fk_hist_pedido FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_hist_usuario FOREIGN KEY (id_usuario_modifico) REFERENCES USUARIO(id_usuario)
);

-- ==================================================
-- 2. CREACIÓN DE ÍNDICES
-- ==================================================
CREATE INDEX idx_usuario_email ON USUARIO(email);
CREATE INDEX idx_usuario_rol ON USUARIO(id_rol);
CREATE INDEX idx_usuario_fecha ON USUARIO(fecha_registro);
CREATE INDEX idx_direccion_usuario ON DIRECCION_USUARIO(id_usuario);
CREATE INDEX idx_direccion_principal ON DIRECCION_USUARIO(id_usuario, es_principal);
CREATE INDEX idx_producto_categoria ON PRODUCTO(id_categoria);
CREATE INDEX idx_producto_proveedor ON PRODUCTO(id_proveedor);
CREATE INDEX idx_producto_sku ON PRODUCTO(sku);
CREATE INDEX idx_producto_activo ON PRODUCTO(activo);
CREATE INDEX idx_pedido_usuario ON PEDIDO(id_usuario);
CREATE INDEX idx_pedido_estado ON PEDIDO(estado);
CREATE INDEX idx_pedido_fecha ON PEDIDO(fecha_pedido);
CREATE INDEX idx_detalle_pedido ON DETALLE_PEDIDO(id_pedido);
CREATE INDEX idx_pago_pedido ON PAGO(id_pedido);
CREATE INDEX idx_envio_pedido ON ENVIO(id_pedido);

-- ==================================================
-- 3. POBLADO DE TABLAS NUEVO Y OPTIMIZADO (ESTILO OPIUM & CHILE)
-- ==================================================

-- Catálogo de Roles
INSERT INTO ROL_USUARIO (nombre_rol, descripcion, permisos) VALUES ('ADMINISTRADOR', 'Acceso maestro al ecosistema', 'ALL');
INSERT INTO ROL_USUARIO (nombre_rol, descripcion, permisos) VALUES ('CLIENTE', 'Comprador de piezas avant-garde', 'READ_PRODUCTOS,COMPRAR,VER_PEDIDOS');
INSERT INTO ROL_USUARIO (nombre_rol, descripcion, permisos) VALUES ('EMPLEADO', 'Soporte y logística de inventario', 'READ_PRODUCTOS,READ_PEDIDOS,UPDATE_INVENTARIO');
INSERT INTO ROL_USUARIO (nombre_rol, descripcion, permisos) VALUES ('GERENTE', 'Dirección de tienda y reportes comerciales', 'READ_PRODUCTOS,READ_PEDIDOS,UPDATE_INVENTARIO,REPORTES');

-- Usuarios (Password default: 'opium2026' en BCrypt)
-- Gerente: Matias Obreque | Admin: Gabriel Gemini | Empleado: Diego Carrasco
INSERT INTO USUARIO (email, password_hash, nombre, apellido, telefono, id_rol, email_verificado, activo) VALUES 
('gabriel.gemini@clothesrecovery.cl', '$2a$10$eD7pXwG8CqZqK7vS4pRtXOxA9j13VmWpI6p8gLwO4vK1uY3a2B7e6', 'Gabriel', 'Gemini', '+56911112222', 1, 'S', 'S');
INSERT INTO USUARIO (email, password_hash, nombre, apellido, telefono, id_rol, email_verificado, activo) VALUES 
('catalina.tapia@gmail.com', '$2a$10$eD7pXwG8CqZqK7vS4pRtXOxA9j13VmWpI6p8gLwO4vK1uY3a2B7e6', 'Catalina', 'Tapia', '+56933334444', 2, 'S', 'S');
INSERT INTO USUARIO (email, password_hash, nombre, apellido, telefono, id_rol, email_verificado, activo) VALUES 
('benjamin.silva@outlook.cl', '$2a$10$eD7pXwG8CqZqK7vS4pRtXOxA9j13VmWpI6p8gLwO4vK1uY3a2B7e6', 'Benjamín', 'Silva', '+56955556666', 2, 'S', 'S');
INSERT INTO USUARIO (email, password_hash, nombre, apellido, telefono, id_rol, email_verificado, activo) VALUES 
('diego.carrasco@clothesrecovery.cl', '$2a$10$eD7pXwG8CqZqK7vS4pRtXOxA9j13VmWpI6p8gLwO4vK1uY3a2B7e6', 'Diego', 'Carrasco', '+56977778888', 3, 'S', 'S');
INSERT INTO USUARIO (email, password_hash, nombre, apellido, telefono, id_rol, email_verificado, activo) VALUES 
('matias.obreque@clothesrecovery.cl', '$2a$10$eD7pXwG8CqZqK7vS4pRtXOxA9j13VmWpI6p8gLwO4vK1uY3a2B7e6', 'Matías', 'Obreque', '+56999990000', 4, 'S', 'S');

-- Direcciones (Distribuidas por Chile, usando terminologías de Comuna y Región de forma consistente)
INSERT INTO DIRECCION_USUARIO (id_usuario, alias, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, es_principal, activo) VALUES 
(2, 'Casa Stgo', 'Av. Apoquindo', '4500', 'Las Condes', 'Santiago', 'Región Metropolitana', '7550000', 'S', 'S');
INSERT INTO DIRECCION_USUARIO (id_usuario, alias, calle, numero_exterior, numero_interior, colonia, ciudad, estado, codigo_postal, es_principal, activo) VALUES 
(2, 'Depto Viña', 'Calle Valparaíso', '321', 'Depto 402', 'Viña del Mar', 'Valparaíso', 'Región de Valparaíso', '2520000', 'N', 'S');
INSERT INTO DIRECCION_USUARIO (id_usuario, alias, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, es_principal, activo) VALUES 
(3, 'Casa Conce', 'Av. O Higgins', '1020', 'Concepción', 'Concepción', 'Región del Biobío', '4030000', 'S', 'S');
INSERT INTO DIRECCION_USUARIO (id_usuario, alias, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, es_principal, activo) VALUES 
(4, 'Trabajo', 'Pasaje Los Alerces', '145', 'Temuco', 'Temuco', 'Región de La Araucanía', '4780000', 'S', 'S');
INSERT INTO DIRECCION_USUARIO (id_usuario, alias, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, es_principal, activo) VALUES 
(5, 'Oficina Gerencia', 'Av. El Golf', '99', 'Las Condes', 'Santiago', 'Región Metropolitana', '7550100', 'S', 'S');

-- Categorías (Orientadas a la Estética Opium / Darkwear)
INSERT INTO CATEGORIA (nombre_categoria, descripcion, nivel, activo) VALUES 
('Opium Aesthetics', 'Prendas oscuras de cortes experimentales y siluetas dramáticas', 1, 'S');

-- Subcategorías (id_categoria_padre = 1)
INSERT INTO CATEGORIA (nombre_categoria, descripcion, id_categoria_padre, nivel, activo) VALUES 
('Partes Superiores', 'Polerones boxy heavy-weight, poleras distressed y chalecos mohair calados', 1, 2, 'S');
INSERT INTO CATEGORIA (nombre_categoria, descripcion, id_categoria_padre, nivel, activo) VALUES 
('Partes Inferiores', 'Waxed denim jeans, cargo pants multibolsillos y pantalones stacked', 1, 2, 'S');
INSERT INTO CATEGORIA (nombre_categoria, descripcion, id_categoria_padre, nivel, activo) VALUES 
('Calzado Avant-Garde', 'Botas de cuero con plataformas masivas y zapatillas high-top minimalistas', 1, 2, 'S');
INSERT INTO CATEGORIA (nombre_categoria, descripcion, id_categoria_padre, nivel, activo) VALUES 
('Accesorios Dark', 'Lentes de sol cyber-punk, cadenas pesadas de acero y arneses de cuero', 1, 2, 'S');

-- Proveedores (Especializados en moda gótica, industrial y minimalista)
INSERT INTO PROVEEDOR (nombre_empresa, contacto_nombre, email, telefono, direccion, rfc, calificacion, activo) VALUES 
('Darkwear Factory Co.', 'Xavier Vance', 'production@darkwearco.com', '+12025550143', 'Los Angeles, USA', 'EXT-9910293', 4.9, 'S');
INSERT INTO PROVEEDOR (nombre_empresa, contacto_nombre, email, telefono, direccion, rfc, calificacion, activo) VALUES 
('Avant-Garde Imports Chile', 'Arnaldo Rossi', 'arossi@avantgarde.cl', '+56228884422', 'Quilicura, Santiago', '76.432.110-K', 4.5, 'S');
INSERT INTO PROVEEDOR (nombre_empresa, contacto_nombre, email, telefono, direccion, rfc, calificacion, activo) VALUES 
('Tokyo Cyber-Gothic Supplies', 'Kenji Sato', 'sato@cybergoth.jp', '+81355550192', 'Shibuya, Tokyo', 'EXT-8839201', 5.0, 'S');

-- Productos (Piezas auténticas del estilo Opium)
-- Precios expresados de forma compatible con la moneda y formato del sistema (CLP nominales ingresados en el campo NUMBER)
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-HD-001', 'Polerón Boxy Heavyweight "Mutilation"', 'Polerón de 500 GSM con lavado ácido gris oscuro, hombros caídos y capucha masiva sin cordón. Bordes deshilachados de forma artesanal.', 'Polerón boxy pesado color negro desgastado.', 65000.00, 25000.00, 2, 1, 'S,M,L,XL', 'Pitch Black, Acid Wash Grey', 'Algodón Premium', 1.200, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-DN-002', 'Pantalón Waxed Denim Stacked', 'Jeans de mezclilla con recubrimiento de cera brillante negra, corte slim que se acumula dramáticamente en los tobillos (stacked effect).', 'Jeans resinados negros con efecto stacked.', 85000.00, 32000.00, 3, 2, '28,30,32,34,36', 'Glossy Black', 'Mezclilla Resinada', 0.850, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-JK-003', 'Chaqueta Leather Bomber "Vamp"', 'Chaqueta estilo bomber corta hecha de cuero sintético mate grueso. Cierres metálicos expuestos e interior acolchado.', 'Chaqueta bomber crop de cuero oscuro.', 140000.00, 60000.00, 2, 1, 'M,L,XL', 'Matte Black', 'Cuero PU Premium', 1.600, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-TS-004', 'Polera Mesh Destructed "Narcissist"', 'Polera de punto abierto transparente con rasgaduras localizadas. Silueta alargada y fluida perfecta para capas superiores.', 'Polera translúcida distressed estilo grunge.', 35000.00, 11000.00, 2, 2, 'S,M,L', 'Obsidian Black', 'Punto de Poliéster', 0.180, 'S', 'N');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-BT-005', 'Botas Plataforma Cuero "Raven-X"', 'Botas de cuero bovino con caña alta, cierre lateral metálico y una imponente plataforma monolítica de 10 cm.', 'Botas de cuero con mega plataforma de 10cm.', 185000.00, 80000.00, 4, 3, '39,40,41,42,43,44', 'Black Noir', 'Cuero Natural / Goma', 2.400, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-CG-006', 'Jeans Cargo Multi-Zip "Cyber-Goth"', 'Pantalón cargo de mezclilla negra con 6 bolsillos utilitarios y un entramado de cierres decorativos plateados a lo largo de las piernas.', 'Pantalón cargo con múltiples cierres plateados.', 95000.00, 38000.00, 3, 2, '30,32,34,36', 'Shadow Black', 'Algodón / Spandex', 0.950, 'S', 'N');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-SW-007', 'Suéter Mohair Calado "Void"', 'Suéter tejido holgado con hilos de mohair de alta calidad. Acabado calado con transparencias y mangas extra largas.', 'Suéter mohair desgastado y holgado.', 72000.00, 26000.00, 2, 3, 'S,M,L', 'Black / Charcoal', 'Mezcla de Mohair', 0.450, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-SG-008', 'Lentes de Sol Envolventes "Alien Cyber"', 'Lentes de sol con montura de acetato envolvente fluida y micas oscuras con protección UV400 completa.', 'Lentes futuristas envolventes negros.', 32000.00, 8000.00, 5, 2, 'Única', 'Chrome Black', 'Acetato / Policarbonato', 0.050, 'S', 'S');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-AR-009', 'Arnés Táctico de Cuero "Kravitz"', 'Arnés pectoral ajustable mediante hebillas plateadas, confeccionado con correas de cuero genuino pulido.', 'Arnés de cuero con hebillas metálicas.', 48000.00, 18000.00, 5, 1, 'Ajustable', 'Midnight Black', 'Cuero Legítimo', 0.320, 'S', 'N');
INSERT INTO PRODUCTO (sku, nombre_producto, descripcion, descripcion_corta, precio, costo, id_categoria, id_proveedor, tallas_disponibles, colores_disponibles, material, peso_kg, activo, destacado) VALUES 
('OPM-SN-010', 'Zapatillas Canvas High-Top "Avant"', 'Zapatillas de lona gruesa de caña extremadamente alta, cordones extra largos para doble vuelta y suela de goma asimétrica.', 'Zapatillas minimalistas de caña alta.', 11000.00, 4500.00, 4, 3, '38,39,40,41,42,43', 'Chalk White, Dark Black', 'Lona / Goma Vulcanizada', 1.100, 'S', 'N');

-- Inventario correspondiente
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (1, 50, 10, 0, 'SECTOR-A01');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (2, 40, 8, 0, 'SECTOR-A02');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (3, 15, 3, 0, 'SECTOR-B01');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (4, 60, 15, 0, 'SECTOR-B02');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (5, 12, 2, 0, 'SECTOR-C01');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (6, 30, 6, 0, 'SECTOR-C02');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (7, 22, 5, 0, 'SECTOR-A03');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (8, 100, 20, 0, 'SECTOR-D01');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (9, 25, 5, 0, 'SECTOR-D02');
INSERT INTO INVENTARIO (id_producto, stock_total, stock_minimo, stock_reservado, ubicacion_almacen) VALUES (10, 35, 8, 0, 'SECTOR-C03');

-- Carritos de Compra
INSERT INTO CARRITO_COMPRA (id_usuario, estado, subtotal, total) VALUES (2, 'ACTIVO', 0, 0);
INSERT INTO CARRITO_COMPRA (id_usuario, estado, subtotal, total) VALUES (3, 'ACTIVO', 0, 0);

-- Items de Carrito
INSERT INTO CARRITO_ITEM (id_carrito, id_producto, cantidad, talla_seleccionada, color_seleccionado, precio_unitario) VALUES (1, 1, 2, 'L', 'Pitch Black', 65000.00);
INSERT INTO CARRITO_ITEM (id_carrito, id_producto, cantidad, talla_seleccionada, color_seleccionado, precio_unitario) VALUES (1, 2, 1, '32', 'Glossy Black', 85000.00);
INSERT INTO CARRITO_ITEM (id_carrito, id_producto, cantidad, talla_seleccionada, color_seleccionado, precio_unitario) VALUES (2, 5, 1, '42', 'Black Noir', 185000.00);

-- Pedidos (Cálculos limpios, IVA chileno reflejado conceptualmente si aplica)
INSERT INTO PEDIDO (numero_pedido, id_usuario, id_direccion_envio, fecha_entrega_estimada, subtotal, descuento, impuestos, costo_envio, total, estado, metodo_pago) VALUES 
('CR-CL-2026-001', 2, 1, SYSDATE + 3, 215000.00, 0, 40850.00, 4990.00, 260840.00, 'ENTREGADO', 'TARJETA_CREDITO');
INSERT INTO PEDIDO (numero_pedido, id_usuario, id_direccion_envio, fecha_entrega_estimada, subtotal, descuento, impuestos, costo_envio, total, estado, metodo_pago) VALUES 
('CR-CL-2026-002', 3, 3, SYSDATE + 4, 140000.00, 15000.00, 23750.00, 4990.00, 153740.00, 'ENVIADO', 'PAYPAL');
INSERT INTO PEDIDO (numero_pedido, id_usuario, id_direccion_envio, fecha_entrega_estimada, subtotal, descuento, impuestos, costo_envio, total, estado, metodo_pago) VALUES 
('CR-CL-2026-003', 2, 2, SYSDATE + 5, 280000.00, 20000.00, 49400.00, 0, 309400.00, 'PAGADO', 'TARJETA_DEBITO');
INSERT INTO PEDIDO (numero_pedido, id_usuario, id_direccion_envio, fecha_entrega_estimada, subtotal, descuento, impuestos, costo_envio, total, estado, metodo_pago) VALUES 
('CR-CL-2026-004', 2, 1, SYSDATE + 3, 32000.00, 0, 6080.00, 3500.00, 41580.00, 'EN_PROCESO', 'TRANSFERENCIA');
INSERT INTO PEDIDO (numero_pedido, id_usuario, id_direccion_envio, fecha_entrega_estimada, subtotal, descuento, impuestos, costo_envio, total, estado, metodo_pago) VALUES 
('CR-CL-2026-005', 3, 3, SYSDATE + 2, 110000.00, 0, 20900.00, 4990.00, 135890.00, 'PENDIENTE', 'TARJETA_CREDITO');

-- Detalles de Pedido
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (1, 1, 2, 65000.00, 0, 130000.00, 'M', 'Pitch Black');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (1, 2, 1, 85000.00, 0, 85000.00, '32', 'Glossy Black');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (2, 3, 1, 140000.00, 15000.00, 125000.00, 'L', 'Matte Black');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (3, 5, 1, 185000.00, 0, 185000.00, '43', 'Black Noir');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (3, 6, 1, 95000.00, 20000.00, 75000.00, '34', 'Shadow Black');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (4, 8, 1, 32000.00, 0, 32000.00, 'Única', 'Chrome Black');
INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario, descuento_unitario, subtotal, talla, color) VALUES (5, 10, 1, 110000.00, 0, 110000.00, '41', 'Dark Black');

-- Registro de Pagos
INSERT INTO PAGO (id_pedido, monto, metodo_pago, estado_pago, referencia_pago, fecha_pago) VALUES (1, 260840.00, 'TARJETA_CREDITO', 'COMPLETADO', 'TRANS-9921-CHILE', SYSDATE - 4);
INSERT INTO PAGO (id_pedido, monto, metodo_pago, estado_pago, referencia_pago, fecha_pago) VALUES (2, 153740.00, 'PAYPAL', 'COMPLETADO', 'PP-OUT-77291', SYSDATE - 2);
INSERT INTO PAGO (id_pedido, monto, metodo_pago, estado_pago, referencia_pago, fecha_pago) VALUES (3, 309400.00, 'TARJETA_DEBITO', 'COMPLETADO', 'WEBPAY-883910', SYSDATE - 1);
INSERT INTO PAGO (id_pedido, monto, metodo_pago, estado_pago, referencia_pago) VALUES (4, 41580.00, 'TRANSFERENCIA', 'PROCESANDO', 'TEF-BANCOESTADO-01');
INSERT INTO PAGO (id_pedido, monto, metodo_pago, estado_pago, referencia_pago) VALUES (5, 135890.00, 'TARJETA_CREDITO', 'PENDIENTE', 'WEBPAY-PENDING-05');

-- Envíos (Utilizando transportistas que operan en Chile: Chilexpress, Starken, Blue Express)
INSERT INTO ENVIO (id_pedido, id_direccion_destino, transportista, metodo_envio, numero_guia, url_rastreo, costo_envio, estado_envio, fecha_envio, fecha_entrega_estimada, fecha_entrega_real, receptor_nombre) VALUES 
(1, 1, 'Chilexpress', 'EXPRESS', 'CHI99281023', 'https://www.chilexpress.cl/destino/CHI99281023', 4990.00, 'ENTREGADO', SYSDATE - 3, SYSDATE - 1, SYSDATE - 1, 'Catalina Tapia');
INSERT INTO ENVIO (id_pedido, id_direccion_destino, transportista, metodo_envio, numero_guia, url_rastreo, costo_envio, estado_envio, fecha_envio, fecha_entrega_estimada) VALUES 
(2, 3, 'Starken', 'ESTANDAR', 'STK8827101', 'https://www.starken.cl/seguimiento/STK8827101', 4990.00, 'EN_TRANSITO', SYSDATE - 1, SYSDATE + 3);
INSERT INTO ENVIO (id_pedido, id_direccion_destino, transportista, metodo_envio, costo_envio, estado_envio, fecha_entrega_estimada) VALUES 
(3, 2, 'Blue Express', 'ESTANDAR', 0, 'PREPARANDO', SYSDATE + 4);
INSERT INTO ENVIO (id_pedido, id_direccion_destino, transportista, metodo_envio, costo_envio, estado_envio, fecha_entrega_estimada) VALUES 
(4, 1, 'Chilexpress', 'ESTANDAR', 3500.00, 'PENDIENTE', SYSDATE + 3);
INSERT INTO ENVIO (id_pedido, id_direccion_destino, transportista, metodo_envio, costo_envio, estado_envio, fecha_entrega_estimada) VALUES 
(5, 3, 'Starken', 'OVERNIGHT', 4990.00, 'PENDIENTE', SYSDATE + 1);

-- Historial de Estado de Pedidos
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (1, NULL, 'PENDIENTE', 2, 'Orden iniciada por el cliente');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (1, 'PENDIENTE', 'PAGADO', 1, 'Transacción aprobada por pasarela Transbank');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (1, 'PAGADO', 'EN_PROCESO', 4, 'Pedido empaquetado por Diego Carrasco');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (1, 'EN_PROCESO', 'ENVIADO', 4, 'Despachado a centro de distribución Chilexpress');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (1, 'ENVIADO', 'ENTREGADO', 5, 'Entrega auditada por Matías Obreque');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (2, NULL, 'PENDIENTE', 3, 'Orden levantada');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (2, 'PENDIENTE', 'PAGADO', 1, 'Verificación PayPal exitosa');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (2, 'PAGADO', 'EN_PROCESO', 4, 'En preparación de despacho');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (2, 'EN_PROCESO', 'ENVIADO', 4, 'Entregado a Starken encurtido');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (3, NULL, 'PENDIENTE', 2, 'Orden del cliente');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (3, 'PENDIENTE', 'PAGADO', 1, 'Pago Webpay Plus confirmado');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (4, NULL, 'PENDIENTE', 2, 'Pendiente validación de transferencia');
INSERT INTO HISTORIAL_ESTADO_PEDIDO (id_pedido, estado_anterior, estado_nuevo, id_usuario_modifico, motivo_cambio) VALUES (5, NULL, 'PENDIENTE', 3, 'Intento de compra en revisión de pasarela');

COMMIT;