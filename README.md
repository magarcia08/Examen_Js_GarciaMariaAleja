# 🏨 Hotel El Rincón del Carmen — Plataforma Web de Reservas

![Hotel](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop)

# Enlace netlify: https://regal-frangollo-0f728a.netlify.app/

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
