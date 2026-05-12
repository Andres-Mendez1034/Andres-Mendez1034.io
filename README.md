# Brand Connect Frontend

Interfaz web del sistema SaaS Brand Connect, construida con React + Vite. Este frontend gestiona la experiencia de usuario para un marketplace de creadores, integrando autenticación, marketplace, chatbot, pagos y panel de usuario.

---

## Descripción

Este frontend permite a los usuarios:

- Registrarse e iniciar sesión
- Autenticarse con JWT y MFA
- Explorar el marketplace de servicios
- Crear y gestionar perfiles de usuario o creador
- Realizar pagos mediante Stripe
- Usar un chatbot integrado
- Acceder a dashboards personalizados
- Gestionar carrito y compras

Está diseñado como una SPA (Single Page Application) modular y escalable.

---

## Estado del proyecto (estimación real)

### Frontend general: 75%

- Arquitectura modular completa
- Separación por features (pages, components, hooks, services)
- Sistema de rutas implementado
- Context de autenticación funcional
- Integración con backend estable

Falta:
- optimización de rendimiento
- mejoras en UX/UI
- manejo avanzado de estados globales
- refactor parcial de componentes grandes

---

## Estructura Completa

```text
src/
│
├── assets/
│   ├── Imágenes estáticas del proyecto (logos, iconos, ilustraciones)
│   ├── Recursos multimedia reutilizables
│   └── Archivos base del UI (svg, png, etc.)
│
├── components/
│   ├── Componentes reutilizables de la interfaz
│   ├── Organizados por dominio (auth, chatbot, marketplace, payments, etc.)
│   ├── Componentes pequeños (botones, inputs, cards, modals)
│   └── Sin lógica de negocio compleja (solo presentación)
│
├── context/
│   ├── Estado global de la aplicación
│   ├── AuthContext (autenticación y sesión)
│   ├── Providers globales
│   └── Evita prop drilling
│
├── hooks/
│   ├── Hooks personalizados reutilizables
│   ├── useAuth, useFetch, useMarketplace, useChatbot
│   ├── Encapsulan lógica de negocio
│   └── Reutilización entre componentes
│
├── layout/
│   ├── Estructura general de la aplicación
│   ├── Navbar, Footer, Layout principal
│   ├── Wrappers de páginas
│   └── Control de estructura visual global
│
├── pages/
│   ├── Vistas principales de la aplicación
│   ├── Cada carpeta representa una ruta
│   ├── Ejemplos:
│   │   ├── Home
│   │   ├── Login
│   │   ├── Register
│   │   ├── Marketplace
│   │   ├── Dashboard
│   │   ├── Profile
│   │   ├── Billing
│   │   └── Payments
│   └── Composición de componentes
│
├── routes/
│   ├── Configuración de rutas
│   ├── React Router setup
│   ├── Rutas públicas y privadas
│   └── Protección de rutas (auth guards)
│
├── services/
│   ├── Comunicación con backend (API layer)
│   ├── auth.service (login, register, MFA)
│   ├── marketplace.service (servicios)
│   ├── payment.service (Stripe)
│   └── Axios / fetch centralizado
│
├── styles/
│   ├── Estilos globales
│   ├── Variables CSS (colores, tipografía, spacing)
│   ├── Reset CSS
│   └── Estilos compartidos
│
└── utils/
    ├── Funciones auxiliares
    ├── Formateadores (fechas, moneda, texto)
    ├── Validadores de formularios
    ├── Helpers puros sin React
    └── Utilidades generales

---

---

## Principios de arquitectura

- Separación clara entre UI, lógica y servicios
- Componentes reutilizables y desacoplados
- Estado global controlado con Context API
- Lógica de negocio fuera de los componentes
- Escalabilidad tipo SaaS
- Preparado para migrar a Redux o arquitecturas más avanzadas

---

## Objetivo

Mantener el frontend:

- Escalable
- Mantenible
- Modular
- Preparado para crecimiento de equipo y producto

## Módulos principales

### Autenticación
- Login y registro
- MFA setup y verificación
- Persistencia de sesión
- Protección de rutas

Estado: 85%

---

### Marketplace
- Listado de servicios
- Visualización de ofertas
- Interacción con servicios
- Integración con backend

Estado: 80%

---

### Dashboard
- Panel de usuario
- Vista de actividad
- Acceso a funcionalidades principales

Estado: 70%

---

### Chatbot
- Interfaz de conversación
- Integración con backend
- Soporte básico automatizado

Estado: 70%

---

### Pagos (Stripe)
- Checkout flow
- Botón de pago
- Estado de transacciones

Estado: 90%

---

### Perfil de usuario / creador
- Edición de datos
- Subida de imagen
- Redes sociales
- Configuración básica

Estado: 80%

---

### Carrito
- Agregar servicios
- Visualización de items
- Integración con checkout

Estado: 75%

---

## Arquitectura

### Componentes

- UI reutilizable por dominio (auth, marketplace, payments)
- Componentes desacoplados por feature
- CSS modular por componente

---

### Estado global

- Context API para autenticación
- Hooks personalizados para lógica de negocio
- Servicios separados para API calls

---

### Routing

- React Router DOM
- Rutas públicas y privadas
- Protección por autenticación

---

## Flujo de la aplicación

1. Usuario accede a la plataforma
2. Se registra o inicia sesión
3. AuthContext guarda sesión (JWT)
4. Usuario navega al marketplace
5. Selecciona servicios
6. Agrega al carrito
7. Realiza checkout con Stripe
8. Estado de pago se actualiza
9. Chatbot ofrece soporte

---

## Tecnologías usadas

- React
- Vite
- React Router
- Context API
- Axios
- CSS modular

---

## Servicios

Frontend consume API del backend mediante:

- auth.service.js
- influencer.service.js
- payment.service.js

---

## Estado de calidad del código

- Estructura: 85%
- Reutilización de componentes: 80%
- Separación de lógica: 85%
- Manejo de estado: 75%
- UI/UX: 70%

---

## Problemas actuales conocidos

- Algunos componentes demasiado grandes
- Falta de lazy loading en rutas
- Optimización de renders pendiente
- UI inconsistente en algunas páginas
- Falta de testing frontend

---

## Roadmap del frontend

### Corto plazo
- Mejorar UI/UX
- Optimizar rutas con lazy loading
- Refactor de componentes pesados

### Medio plazo
- Implementar Redux o Zustand (opcional)
- Mejorar chatbot UI
- Mejorar dashboard analytics

### Largo plazo
- PWA support
- Mejor rendimiento en mobile
- Animaciones avanzadas

---

## Objetivo

Crear una experiencia de usuario fluida para un marketplace SaaS completo, optimizado para conversión y escalabilidad.

---

## Autor

Frontend desarrollado como parte del sistema Brand Connect SaaS.