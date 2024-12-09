CREATE TABLE ucom_users (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'coprador',
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE ucom_productos (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_user INT(100) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    imagen VARCHAR(200) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_carrito (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_producto INT(100) NOT NULL,
    id_user INT(100) NOT NULL,
    cantidad INT(50) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES ucom_productos (id),
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_compras (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_user INT(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    metodo_pago ENUM(
        'efectivo',
        'transferencia',
        'tarjeta',
        'paypal'
    ) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_compras_detalles (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_compra INT(100) NOT NULL,
    id_producto INT(100) NOT NULL,
    cantidad INT(50) NOT NULL,
    precio DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES ucom_compras (id),
    FOREIGN KEY (id_producto) REFERENCES ucom_productos (id)
);

CREATE TABLE ucom_me_gusta (
    id int(100) AUTO_INCREMENT PRIMARY KEY,
    id_producto int(100) NOT NULL,
    id_user int(100) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES ucom_productos (id),
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_categorias (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(255) NOT NULL,
    img varchar(255) DEFAULT NULL
);

CREATE TABLE ucom_ubicaciones (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    id_user INT(100) NOT NULL,
    latitud VARCHAR(100) DEFAULT NULL,
    longitud VARCHAR(100) DEFAULT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_codigos (
    id int(11) AUTO_INCREMENT PRIMARY KEY,
    codigo varchar(255) NOT NULL,
    correo VARCHAR(200) NOT NULL
);


CREATE TABLE ucom_pedidos (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_user INT(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dia VARCHAR(50) NOT NULL,
    hora VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    pago VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES ucom_users (id)
);

CREATE TABLE ucom_pedidos_detalles (
    id INT(100) AUTO_INCREMENT PRIMARY KEY,
    id_compra INT(100) NOT NULL,
    id_producto INT(100) NOT NULL,
    cantidad INT(50) NOT NULL,
    precio DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES ucom_pedidos (id),
    FOREIGN KEY (id_producto) REFERENCES ucom_productos (id)
);