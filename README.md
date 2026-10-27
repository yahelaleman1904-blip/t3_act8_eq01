# Pronostika - Sistema de Predicciones Deportivas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=for-the-badge&logo=DigitalOcean&logoColor=white)

Pronostika es una plataforma web interactiva diseñada para la gestión, análisis y registro de pronósticos deportivos. Construida como una Single Page Application (SPA) moderna, simula un entorno completo de autenticación y operaciones CRUD reales consumiendo APIs externas.

---

## Enlaces del Proyecto

- * Sistema Desplegado (VPS DigitalOcean):** [http://67.205.143.251/t3_act8_eq01/](http://67.205.143.251/t3_act8_eq01/)

---

## Equipo 01 (Desarrolladores)

- **Carlos Yahel Alemán Cruz** 
- **Mario Eduardo Grajales Ramírez** 

*Proyecto desarrollado para la Actividad 8 - Desarrollo de Mini Sistema Web.*

---

## Características Implementadas (Rúbrica)

1. ** Autenticación (Fase 1):** 
   - Login funcional con validación de formularios y manejo de errores.
   - Consumo de API real para autenticación (`POST`).
   - Opción de registro de nuevos usuarios y login social simulado.
2. ** Interfaz y Navegación (Fase 2):** 
   - Diseño moderno UI/UX basado en Figma (Pantalla dividida).
   - Sidebar interactivo y Navbar dinámico que refleja los datos del usuario logueado.
   - Rutas protegidas (No se puede acceder al sistema sin iniciar sesión).
3. ** Gestión de Datos CRUD (Fase 3):** 
   - **Tabla Interactiva:** Buscador por texto y filtro por categorías.
   - **Paginación URL Sync:** Paginación dinámica (10, 20, 40, 50 registros) sincronizada bidireccionalmente con los parámetros de la URL (`?page=1&limit=10`).
   - **Operaciones CRUD:** Creación (`POST`), Edición (`PUT`) con confirmación, y Eliminación (`DELETE`) con modal de advertencia, reflejando los cambios inmediatamente en el estado global.
4. ** Despliegue en VPS (Fase 4):**
   - Aplicación compilada optimizada para producción (`dist`).
   - Servidor web Nginx configurado en Ubuntu 24.04 (DigitalOcean).
   - Soporte para subrutas (`/t3_act8_eq01/`).

---

##  API Utilizada

Para cumplir con los requerimientos de la tabla interactiva y las peticiones de escritura (`POST`, `PUT`, `DELETE`), se utilizó **DummyJSON**. 
Los datos genéricos fueron mapeados, transformados y adaptados lógicamente en el Frontend (`services/api.js`) para encajar en el contexto deportivo de Pronostika:
- **Autenticación:** `https://dummyjson.com/auth/login` y `https://dummyjson.com/users/add`
- **Productos (Adaptados a Partidos):** `https://dummyjson.com/products`

---

##  Instalación y Uso Local

Si deseas correr este proyecto en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/yahelaleman1904-blip/t3_act8_eq01.git](https://github.com/yahelaleman1904-blip/t3_act8_eq01.git)
