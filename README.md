#  Pronostika - Sistema de Predicciones Deportivas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=for-the-badge&logo=DigitalOcean&logoColor=white)
![ESPN API](https://img.shields.io/badge/ESPN_Live_API-CC0000?style=for-the-badge&logo=espn&logoColor=white)

Pronostika es una plataforma web interactiva diseñada para la gestión, análisis y registro de pronósticos deportivos. Construida como una Single Page Application (SPA) moderna, simula un entorno completo de autenticación y operaciones CRUD reales consumiendo datos deportivos en vivo y APIs externas.

---

##  Enlaces del Proyecto

- ** Sistema Desplegado (VPS DigitalOcean):** [http://67.205.143.251/t3_act8_eq01/](http://67.205.143.251/t3_act8_eq01/)

---

##  Equipo 01 (Desarrolladores)

- **Carlos Yahel Alemán Cruz** 
- **Mario Eduardo Grajales Ramírez** 

*Proyecto desarrollado para la Actividad 8 - Desarrollo de Mini Sistema Web.*

---

##  Características Implementadas (Rúbrica)

1. ** Autenticación (Fase 1):** 
   - Login funcional con validación de formularios y manejo de errores.
   - Consumo de API para autenticación (`POST`) y registro de usuarios nuevos.
   - Modal interactivo para simulación de Login Social (Google / GitHub).
2. ** Interfaz y Navegación (Fase 2):** 
   - Diseño UI/UX profesional (Dark Mode, Pantalla dividida, Componentización).
   - Sidebar interactivo y Navbar dinámico que refleja los datos del usuario logueado.
   - Rutas protegidas mediante validación de estado.
3. ** Arquitectura Híbrida de Datos y CRUD (Fase 3):** 
   - **Lectura en Vivo (GET):** Integración con la API oficial de ESPN para mostrar partidos reales, horarios, ligas y escudos oficiales de la jornada actual.
   - **Tabla Interactiva:** Buscador por texto, filtro por categorías y tarjetas dinámicas.
   - **Paginación URL Sync:** Paginación (10, 20, 40, 50 registros) sincronizada bidireccionalmente con la URL (`?page=1&limit=10`).
   - **Operaciones CRUD:** Para cumplir con la rúbrica de escritura, al Crear (`POST`), Editar (`PUT`) o Eliminar (`DELETE`) un pronóstico de la cartelera, el sistema dispara peticiones HTTP reales hacia la API de DummyJSON, reflejando inmediatamente el estado local.
4. ** Despliegue en VPS (Fase 4):**
   - Aplicación compilada optimizada para producción (`dist`).
   - Servidor web Nginx configurado en Ubuntu 24.04 (DigitalOcean).
   - Soporte para subrutas y recargas nativas (`/t3_act8_eq01/`).

---

##  APIs Utilizadas

Si deseas correr este proyecto en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/yahelaleman1904-blip/t3_act8_eq01.git](https://github.com/yahelaleman1904-blip/t3_act8_eq01.git)
