# SGCIVORP — Tienda Web E-Commerce (Frontend)

Plataforma de comercio electrónico para clientes de **SGCIVORP (Bodega & Minimarket)**, desarrollada como parte del **Proyecto Integrador** en la **Universidad Tecnológica del Perú (UTP) - Grupo 06**.

Permite a los clientes explorar el catálogo de productos en tiempo real, armar su carrito de compras, registrarse, solicitar pedidos con reserva temporal de stock y pagar mediante Yape subiendo su comprobante digital para recojo presencial en tienda.

---

## 🌟 Características Principales

* 🛒 **Catálogo de Productos Online:**  
  Navegación por categorías (Lácteos, Abarrotes, Snacks, Limpieza, etc.) con buscador instantáneo, ordenamiento por precio y visualización de stock disponible en tiempo real.
* 📸 **Fotografías Oficiales en Formato WebP:**  
  51 imágenes de alta calidad optimizadas para carga ultrarrápida asociadas al código de producto.
* 🛍️ **Carrito de Compras Reactivo:**  
  Persistencia local en el navegador, control interactivo de cantidades y validación inmediata de existencias.
* ⏱️ **Reserva Temporal de Stock (10 minutos):**  
  Al iniciar el checkout, el sistema aparta automáticamente los productos solicitados para garantizar que ningún otro cliente en tienda física los compre mientras se realiza el pago.
* 📱 **Pasarela de Pago con Yape:**  
  Instrucciones claras de abono, número de teléfono de la bodega y subida segura del voucher de pago (PNG/JPEG) con registro del número de operación.
* 📍 **Ubicación y Horario de Recojo:**  
  Datos confirmados del local en Ate (La Planicie de la Era, ref. Pista nueva - Santa Clara) con enlace directo a **Google Maps** para facilitar la llegada del cliente.
* 🎫 **Seguimiento en Vivo con Código QR:**  
  Pantalla de estado del pedido (*Pendiente de verificación → Pagado → En preparación → Listo para recoger → Entregado*) que genera un código QR y código de recojo (`NV-...`) para validar la entrega en caja.

---

## 🚀 Tecnologías Utilizadas

* **Frontend:** HTML5 Semántico, CSS3 moderno con variables y diseño responsive (Desktop y Móvil).
* **JavaScript:** JavaScript nativo con Módulos ES (`type="module"`), sin frameworks pesados, sin librerías externas por CDN y sin necesidad de procesos de compilación o `node_modules` gigantes.
* **Servidor Local y Proxy:** Servidor HTTP local en **Node.js (`server.mjs`)** que sirve los archivos estáticos en el puerto `4200` y redirige de forma transparente las peticiones `/api/**` hacia el Backend Spring Boot en el puerto `8080`.

---

## 🛠️ Cómo Iniciar la Tienda Web

El proyecto está preparado para ejecutarse con **un solo clic** directamente desde tus herramientas de desarrollo:

### Opción 1: Desde Visual Studio Code (Recomendado)
1. Abre la carpeta `Grupo06-Ecommerce` en **Visual Studio Code**.
2. Presiona la tecla **`F5`** en tu teclado.  
   *(O ve a la pestaña izquierda de "Ejecutar y depurar" y haz clic en el botón verde ▶ **Iniciar Tienda Web**).*
3. Se abrirá la terminal integrada de VS Code indicando:
   ```text
   La Bodega (Vanilla JS) disponible en http://127.0.0.1:4200
   Proxy /api redirigiendo hacia http://127.0.0.1:8080
   ```
4. Abre tu navegador en: 👉 **`http://127.0.0.1:4200`**

### Opción 2: Desde IntelliJ IDEA
1. Abre la carpeta `Grupo06-Ecommerce` en **IntelliJ IDEA**.
2. Haz **clic derecho** sobre el archivo **`server.mjs`** y selecciona **Run 'server.mjs'**.
3. Abre tu navegador en: 👉 **`http://127.0.0.1:4200`**

### Opción 3: Por Terminal / Consola
En una terminal situada en la carpeta del proyecto:
```bash
npm start
# o directamente:
node server.mjs
```

---

## 📁 Estructura del Proyecto

```text
Grupo06-Ecommerce/
├── index.html                  # Estructura principal y plantilla SPA
├── package.json                # Configuración de ejecución para Node.js
├── server.mjs                  # Servidor HTTP local con proxy inverso a :8080
├── .vscode/
│    └── launch.json            # Configuración de inicio rápido para VS Code (F5)
├── css/
│    ├── styles.css             # Paleta de colores, tipografía y variables globales
│    ├── layout.css             # Estructura de cabecera, barra lateral y pie de página
│    ├── components.css         # Tarjetas de productos, botones y modales
│    └── pages.css              # Diseños específicos (catálogo, carrito, checkout)
├── js/
│    ├── app.js                 # Inicialización y ciclo de vida de la aplicación
│    ├── config.js              # Configuración de la API y constantes
│    ├── router.js              # Enrutador de vistas SPA sin recarga
│    ├── core/                  # Estado reactivo (carrito, catálogo, autenticación)
│    ├── pages/                 # Controladores de pantalla (home, catalog, checkout, etc.)
│    └── shared/                # Componentes comunes, utilidades y formato de moneda
└── assets/
     ├── productos/             # 51 fotografías oficiales en formato WebP
     └── figma/                 # Ilustraciones e íconos en formato SVG
```

---

## 🔗 Integración con el Backend

Para que la tienda web cargue los productos y procese pedidos, el **Backend Spring Boot (`Grupo06`)** debe estar ejecutándose en el puerto `8080`.  
Cualquier petición realizada a `/api/**` es interceptada y enviada automáticamente al servidor central.

---

## 👥 Equipo de Desarrollo

* **Universidad:** Universidad Tecnológica del Perú (UTP)
* **Curso:** Proyecto Integrador
* **Grupo:** Grupo 06
