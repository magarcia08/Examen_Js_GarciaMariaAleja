# 🏨 Hotel El Rincón del Carmen — Plataforma Web de Reservas

![Hotel](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop)

Usario admin: admin@aurum.com
Contra: admin
Usario cliente: maria@g.com
Contra: 123456

## 📖 Descripción General

**Hotel El Rincón del Carmen** es una plataforma web moderna, responsiva y dinámica que permite a los usuarios:

- Explorar habitaciones disponibles.  
- Consultar disponibilidad en tiempo real.  
- Realizar reservas en línea de forma fácil y rápida.  
- Consultar sus reservas activas desde un panel personal.  

Además, incluye un **Panel de Administración** para gestionar habitaciones y reservas, pensado para uso exclusivo de los administradores del hotel.

Este proyecto fue desarrollado con **HTML**, **CSS**, **Bootstrap**, **JavaScript Modular (ES Modules)** y almacenamiento en **LocalStorage**, buscando simular un entorno funcional similar a un sistema de reservas real.

---

## 🧭 Índice

- [📖 Descripción General](#-descripción-general)
- [🧭 Índice](#-índice)
- [✨ Características Principales](#-características-principales)
- [🧱 Estructura de Archivos](#-estructura-de-archivos)
- [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
- [🧑 Roles y Accesos](#-roles-y-accesos)
- [🖼️ Interfaz de Usuario](#️-interfaz-de-usuario)
- [🧭 Navegación](#-navegación)
- [🧰 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [🧠 Arquitectura y Lógica](#-arquitectura-y-lógica)
- [⚙️ Funcionalidades Clave](#️-funcionalidades-clave)
- [🔒 Seguridad y Validaciones](#-seguridad-y-validaciones)
- [📅 Estructura de Datos](#-estructura-de-datos)
- [🧪 Testing Manual](#-testing-manual)
- [🤝 Contribuciones](#-contribuciones)
- [📜 Licencia](#-licencia)

---

## ✨ Características Principales

- ✅ **Diseño Responsive** — Optimizado para dispositivos móviles, tablet y escritorio.  
- 🛏️ **Exploración de Habitaciones** — Galerías fotográficas, descripciones detalladas y precios.  
- 📅 **Búsqueda Dinámica** — Filtrado exacto por número de huéspedes y fechas.  
- 📲 **Reservas Simuladas en Línea** — Creación de reservas persistentes en LocalStorage.  
- 👤 **Login / Registro** — Módulo de autenticación básica para clientes y administradores.  
- 🧑‍💼 **Panel Administrativo** — Gestión completa de habitaciones y reservas.  
- 🌐 **Navegación Unificada** — Navbar y Footer reutilizables en todas las vistas.  
- 🧭 **Historial y Contacto** — Secciones informativas con galería, mapa y formulario.

---

## 🧱 Estructura de Archivos

```plaintext
/
├── index.html
├── booking.html
├── rooms.html
├── history.html
├── contact.html
├── mis-reservas.html
├── auth.html
├── admin/
│   └── dashboard.html
├── css/
│   ├── bootstrap/
│   │   └── bootstrap.css
│   └── styles.css
├── js/
│   ├── bootstrap/
│   │   └── bootstrap.bundle.js
│   ├── components/
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   ├── roomCard.js
│   │   ├── searchBar.js
│   │   └── reservationModal.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── roomService.js
│   │   └── reservationService.js
│   ├── storage/
│   │   └── storage.js
│   └── utils/
│       ├── date.js
│       └── ui.js
└── app.js
```

---

## 🚀 Instalación y Ejecución

Este proyecto **no requiere servidor backend**. Basta con abrirlo en un servidor local o entorno de desarrollo.

### 🔹 Requisitos Previos
- Navegador moderno compatible con **ES Modules** (Chrome, Edge, Firefox, Safari).
- Editor de código recomendado: [VS Code](https://code.visualstudio.com/).
- Extensión Live Server (opcional).

### 🛠️ Pasos de instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/tuusuario/hotel-rincon-carmen.git

# 2. Ingresar al proyecto
cd hotel-rincon-carmen

# 3. Ejecutar con Live Server (VS Code) o abrir index.html directamente
```

> 💡 Tip: Si usas VS Code, haz clic derecho en `index.html` → **“Open with Live Server”**.

---

## 🧑 Roles y Accesos

| Rol          | Acceso permitido                                                                 |
|--------------|-----------------------------------------------------------------------------------|
| 🧑 **Cliente** | Ver habitaciones, buscar, reservar, consultar sus reservas personales.            |
| 🧑‍💼 **Admin**   | Ver y editar habitaciones, cancelar reservas, acceso al panel de administración. |

**Usuarios de prueba iniciales (semilla):**
- Admin → correo: `admin@aurum.com` / clave: `admin`  
- Cliente → correo: `maria@mail.com` / clave: `123456`

---

## 🖼️ Interfaz de Usuario

- **Navbar fija** en color negro con enlaces dinámicos según rol (cliente o admin).  
- **Footer uniforme** con información básica del hotel.  
- **Carrusel** en la página de inicio para destacar habitaciones.  
- **Tarjetas interactivas** en habitaciones y reservas.  
- **Formularios con feedback visual** al enviar.

---

## 🧭 Navegación

| Página | Descripción |
|--------|-------------|
| `index.html` | Landing page principal con carrusel de habitaciones destacadas |
| `rooms.html` | Catálogo de habitaciones |
| `booking.html` | Búsqueda dinámica y reservas |
| `history.html` | Historia del hotel y galería |
| `contact.html` | Formulario de contacto + mapa |
| `mis-reservas.html` | Panel personal de reservas del cliente |
| `admin/dashboard.html` | Panel de administración (habitaciones y reservas) |
| `auth.html` | Inicio de sesión y registro |

---

## 🧰 Tecnologías Utilizadas

- 🧭 **HTML5** — Estructura semántica.
- 🎨 **CSS3 / Bootstrap 5** — Estilos responsivos y componentes.
- ⚡ **JavaScript (ES6+ Modules)** — Lógica funcional y modular.
- 💾 **LocalStorage API** — Persistencia de datos simulada.
- 🧩 **Web Components** — Reutilización de UI (navbar, footer, etc.).
- 🗓️ **Date Utilities Personalizados** — Manejo de rangos de fechas.

---

## 🧠 Arquitectura y Lógica

El proyecto sigue una arquitectura **modular organizada por responsabilidades**:

- `components/` → Elementos visuales reutilizables.  
- `services/` → Lógica de negocio (habitaciones, reservas, auth).  
- `storage/` → Inicialización, lectura y escritura de datos en localStorage.  
- `utils/` → Utilidades globales como fechas y alertas UI.  
- `app.js` → Inicializador global, controla interacciones principales.

Cada reserva es validada:
- Que la habitación esté disponible en las fechas seleccionadas.
- Que coincida el número exacto de huéspedes con la capacidad.
- Que no existan solapamientos de fechas.

---

## ⚙️ Funcionalidades Clave

### 🛏️ Gestión de Habitaciones (Admin)
- Crear nuevas habitaciones.
- Editar información existente.
- Eliminar habitaciones.
- Subir o modificar URL de imágenes.

### 📅 Sistema de Reservas (Cliente)
- Filtrar por número de huéspedes y fechas exactas.
- Ver total calculado automáticamente.
- Confirmar reserva y almacenarla en LocalStorage.

### 🧑 Panel de Cliente
- Consultar reservas activas.
- Ver detalles básicos.
- Contactar con admin para cambios.

### 🧑‍💼 Panel de Administración
- Ver todas las reservas del sistema.
- Cancelar reservas.
- Administrar habitaciones.

---

## 🔒 Seguridad y Validaciones

- Control de acceso básico mediante `currentUser` y roles.
- Los botones de administración **no aparecen para clientes**.
- Validación de formularios en login y reservas.
- Control de solapamiento de fechas para evitar duplicidad.

---

## 📅 Estructura de Datos

```json
{
  "users": [
    {"id": "u-1", "name": "Admin", "email": "admin@aurum.com", "password": "admin", "role": "admin"},
    {"id": "u-2", "name": "María", "email": "maria@mail.com", "password": "123456", "role": "user"}
  ],
  "rooms": [
    {"id": "r-01", "name": "Suite Imperial", "maxGuests": 2, "beds": 1, "price": 420000, "photos": ["https://..."], "desc": "Amplia suite con jacuzzi y vista."}
  ],
  "reservations": [
    {"id": "res-01", "roomId": "r-01", "userId": "u-2", "from": "2025-10-15", "to": "2025-10-17", "guests": 2, "total": 840000}
  ]
}
```

---

## 🧪 Testing Manual

- [x] Crear habitación como admin.  
- [x] Reservar habitación como cliente.  
- [x] Verificar filtro exacto de huéspedes.  
- [x] Cancelar reserva desde panel admin.  
- [x] Cerrar sesión y probar roles.  
- [x] Probar en móvil.

---

## 🤝 Contribuciones

1. Haz un fork del proyecto.  
2. Crea una nueva rama `feature/nueva-funcionalidad`.  
3. Realiza tus cambios y haz commit.  
4. Haz push a tu rama.  
5. Abre un Pull Request.

---

## 📜 Licencia

MIT License © 2025 — Hotel El Rincón del Carmen

---

## 📞 Información de Contacto

📍 Bucaramanga, Colombia  
📧 contacto@rincondelcarmen.com  
📱 +57 300 000 0000

✨ _“La hospitalidad no es un servicio, es un arte.”_
