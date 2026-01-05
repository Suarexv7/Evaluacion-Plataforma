Plataforma de Postulación a Vacantes de Empleabilidad - Riwi
Desarrollador: [Tu Nombre Completo Aquí]
Descripción
API REST desarrollada con Node.js y NestJS para gestionar vacantes de empleabilidad y postulaciones de coders. Permite a los gestores publicar vacantes y a los coders postularse de manera autónoma con control de acceso por roles.
🚀 Tecnologías Utilizadas

Backend Framework: NestJS
Base de Datos: PostgreSQL
ORM: TypeORM
Autenticación: JWT + API Key
Documentación: Swagger
Testing: Jest
Frontend: HTML, CSS (Tailwind CSS), JavaScript Vanilla
Containerización: Docker & Docker Compose

📋 Características Principales
Autenticación y Autorización

Sistema de registro e inicio de sesión con JWT
Protección de endpoints con API Key
Control de acceso basado en roles (Admin, Manager, Coder)
Guards personalizados para manejo de permisos

Gestión de Vacantes

Creación y administración de vacantes (Admin/Manager)
Listado de vacantes con filtros por tecnología y seniority
Control de cupos máximos de aspirantes
Activación/desactivación de vacantes

Sistema de Postulaciones

Postulación autónoma de coders
Validación de cupos disponibles
Límite de 3 postulaciones activas por coder
Prevención de postulaciones duplicadas

Reglas de Negocio
✅ Un coder no puede postularse dos veces a la misma vacante
✅ No se permiten postulaciones cuando el cupo está completo
✅ Un coder no puede tener más de 3 postulaciones activas
✅ Solo Admin/Manager pueden crear y modificar vacantes
📦 Instalación
Prerequisitos

Node.js v18 o superior
PostgreSQL 15
npm o yarn

Pasos de Instalación

Clonar el repositorio

📄 Licencia
Este proyecto es parte del programa Riwi y está desarrollado con fines educativos.

Desarrollado por: Victor Eduardo Suarez Rosales.
Clan: NodeJs + NestJs