# SGCIVORP — Plataforma Web de Comercio Electrónico (Frontend)

**Universidad Tecnológica del Perú (UTP)**  
**Proyecto Integrador — Grupo 06**

---

## 1. Resumen Ejecutivo

Este componente constituye la plataforma de comercio electrónico de **SGCIVORP**, orientada a los clientes finales del establecimiento comercial. Su objetivo principal es permitir la exploración del catálogo en tiempo real, la gestión del carrito de compras, el registro de clientes y la emisión de órdenes de compra con reserva de inventario y pago digital para recojo presencial en tienda.

La aplicación está construida siguiendo la arquitectura de Aplicación de Página Única (SPA), sin intermediación de frameworks pesados, garantizando un rendimiento óptimo, bajo consumo de recursos y portabilidad total.

---

## 2. Stack Tecnológico

* **Presentación y Maquetación:** HTML5 semántico y CSS3 moderno con variables CSS, Grid y Flexbox. Totalmente adaptativo (responsive design) para dispositivos móviles, tabletas y ordenadores de escritorio.
* **Lógica del Cliente:** JavaScript con Módulos ES nativos (`type="module"`), prescindiendo de dependencias externas por CDN o empaquetadores complejos.
* **Optimización de Medios:** Fotografías oficiales de productos en formato WebP comprimidas sin pérdida perceptible de calidad, asociadas dinámicamente mediante el código comercial del catálogo.
* **Servidor Local de Entrega y Proxy:** Entorno en Node.js nativo (`server.mjs`) que expone los recursos estáticos en el puerto local `4200` y actúa como proxy inverso hacia la API del backend en el puerto `8080`, resolviendo políticas de origen cruzado (CORS).

---

## 3. Requisitos del Entorno

Para ejecutar la plataforma web, el entorno de trabajo debe disponer de:

* **Node.js (versión 18 LTS o superior):** Se utiliza únicamente para el servidor HTTP local integrado (`server.mjs`). No requiere la instalación de librerías mediante `npm install` al no emplear dependencias externas. Verifique su versión con:
  ```bash
  node -v
  ```
* **Navegador Web Moderno:** Google Chrome, Microsoft Edge, Mozilla Firefox o Safari con soporte para JavaScript ES6+.
* **Servidor Backend en Ejecución:** La API Spring Boot (`Grupo06`) debe encontrarse operativa en el puerto `8080` para que el catálogo de productos y el flujo de checkout respondan con datos reales.

---

## 4. Guía de Instalación y Puesta en Marcha

Para iniciar la tienda web de forma integrada con el sistema central, proceda con las siguientes indicaciones:

### Prerrequisito Fundamental
Antes de interactuar con la tienda web, **el servidor backend Spring Boot debe encontrarse en ejecución**. De lo contrario, la interfaz web no podrá obtener el catálogo de productos ni procesar órdenes de compra.

---

### Método 1: Ejecución desde Visual Studio Code (Recomendado)
El proyecto incluye la configuración preestablecida en `.vscode/launch.json`:

1. Abra la carpeta `Grupo06-Ecommerce` en **Visual Studio Code**.
2. Presione la tecla **F5** en su teclado.  
   *(O diríjase al panel lateral de **Ejecutar y depurar** y presione el botón **Iniciar Tienda Web (Puerto 4200)**)*.
3. Se iniciará el servidor en la terminal integrada mostrando el siguiente mensaje:
   ```text
   La Bodega (Vanilla JS) disponible en http://127.0.0.1:4200
   Proxy /api redirigiendo hacia http://127.0.0.1:8080
   ```
4. Acceda desde su navegador web a la dirección:  
   **http://127.0.0.1:4200**

---

### Método 2: Ejecución desde IntelliJ IDEA
1. Abra la carpeta `Grupo06-Ecommerce` en **IntelliJ IDEA**.
2. Localice el archivo `server.mjs` en el árbol de archivos lateral.
3. Haga clic derecho sobre `server.mjs` y seleccione la opción **Run 'server.mjs'**.
4. Acceda desde su navegador web a la dirección:  
   **http://127.0.0.1:4200**

---

### Método 3: Ejecución mediante Terminal / Línea de Comandos
Abra una consola de comandos en el directorio raíz de la tienda y ejecute:
```bash
npm start
# O mediante ejecución directa:
node server.mjs
```

---

## 5. Flujo Operativo de la Compra

1. **Navegación del Catálogo:** El cliente visualiza 51 productos con fotografías oficiales, marcas, categorías y precios unitarios.
2. **Construcción del Carrito:** Selección de cantidades con verificación de existencias y almacenamiento persistente en el navegador.
3. **Checkout y Reserva Temporal:** Al proceder al pago, el sistema reserva las unidades solicitadas durante **10 minutos**, bloqueando su venta simultánea en la tienda física.
4. **Carga del Comprobante de Pago:** El cliente realiza la transferencia mediante Yape al número oficial configurado y adjunta la captura del comprobante digital (PNG/JPEG) junto con el número de operación.
5. **Generación de Código QR y Código de Recojo:** Una vez registrado el pedido, la plataforma genera un identificador único (`NV-...`) y un código QR descargable para que el cliente lo presente en el establecimiento físico al retirar sus productos.

---

## 6. Estructura de Directorios

```text
Grupo06-Ecommerce/
├── index.html                  # Documento principal y contenedor SPA
├── package.json                # Definición de scripts de ejecución
├── server.mjs                  # Servidor HTTP local y proxy inverso a :8080
├── .vscode/
│   └── launch.json             # Configuración de depuración para VS Code (F5)
├── css/
│   ├── styles.css              # Variables globales, tipografía y resets
│   ├── layout.css              # Cabecera, contenedor principal y pie de página
│   ├── components.css          # Botones, formularios, modales y tarjetas
│   └── pages.css               # Estilos específicos de cada vista
├── js/
│   ├── app.js                  # Punto de entrada y ciclo de vida de la aplicación
│   ├── config.js               # Parámetros de red y rutas de la API REST
│   ├── router.js               # Enrutamiento de vistas sin recarga de página
│   ├── core/                   # Gestión reactiva de estado (catálogo, carrito, auth)
│   ├── pages/                  # Controladores de página (catálogo, carrito, checkout, órdenes)
│   └── shared/                 # Componentes compartidos, formateadores y utilidades
└── assets/
    ├── productos/              # 51 fotografías oficiales en formato WebP
    └── figma/                  # Gráficos vectoriales e iconografía SVG
```

---

## 7. Información Académica

* **Institución:** Universidad Tecnológica del Perú (UTP)
* **Carrera:** Ingeniería de Sistemas e Informática
* **Asignatura:** Proyecto Integrador
* **Equipo de Trabajo:** Grupo 06
