# Konoha Medical Corps — Repository & Execution Guide

## Repository
**Konoha-Medical-Corps**: Sistema médico shinobi que centraliza la gestión de pacientes, diagnósticos automáticos, monitoreo remoto, alertas de emergencia y farmacia digital.
- **URL del repositorio: **https://github.com/sara446/Konoha-Medical-Corps
- **Propósito:**  
  - Centralizar el código fuente y documentación.
  - Gestionar ramas de desarrollo y despliegue.
  - Automatizar pruebas y despliegues mediante CI/CD. 

## Instrucciones de configuración

**Paso 1. Clonar el repositorio**  
```bash
git clone https://github.com/sara446/Konoha-Medical-Corps.git
cd Konoha-Medical-Corps
```
- **Descripción:** Descarga el repositorio del proyecto y te posiciona dentro de la carpeta del proyecto.
- **Uso:**  
  - Acceda a todo el código fuente y los archivos del proyecto.
  - Prepárese para instalar y ejecutar el sistema localmente.

**Paso 2. Instalar dependencias**  
```bash
npm install
```
Además, instale Socket.IO (para comunicación en tiempo real a través de WebSockets):

```bash
npm install socket.io
```
- **Descripción:** Instala todas las dependencias del proyecto, incluidas:
  - expresar → Servidor HTTP.
  - conexión mangosta → MongoDB.
  - cors → Habilita solicitudes de origen cruzado.
  - dotenv → Administra las variables de entorno.
  - uuid → Genera identificadores únicos para los registros.
  - socket.io → Permite la comunicación en tiempo real (telemedicina, alertas).
- **Uso:**  
  - prepara el entorno backend completo para ejecutar las API y las funciones WebSocket. 

**Paso 3. Crear y configurar el .env archivo**  
```env
MONGODB_URI=mongodb+srv://<USUARIO>:<CONTRASEÑA>@cluster0.vnbiprd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```
- **Descripción:** Define las variables de entorno necesarias para la conexión a la base de datos (MongoDB Atlas) y la autenticación JWT.
- **Uso:**  
  - Reemplace <USUARIO>y <CONTRASEÑA>con sus credenciales de MongoDB Atlas.
  - Ensure no.env está comprometido con GitHub (debería estar listado en )..gitignore

**Paso 4. Ejecutar la aplicación**  
```bash
npm run dev
```
- **Resultado esperado:** 
```bash
🔥 Servidor Shinobi escuchando en el puerto 3000
✅ Conexión a MongoDB Atlas exitosa

```

**Paso 5. Pruebas automatizadas**
```bash
npm test
```
- **Descripción:** Ejecuta las pruebas definidas en el proyecto. Configuradas en CI/CD para ejecutarse en cada solicitud push o pull.
- **Uso:**
  - Valida el correcto funcionamiento del código.
  - Garantiza la estabilidad de la integración y la implementación. 

## Project Branch Structure

### Main Branches
**main**: Stable branch ready for production.  
- **Description:** This is the stable and production-ready branch. It contains code that has been tested and validated.  
- **Usage:**  
  - Deployment of stable releases.  
  - Integration of changes that have gone through reviews and testing.  

**dev**: Development branch for integrating new features.  
- **Description:** This branch is used to integrate new features and changes. It is where testing is done before merging into the main branch.  
- **Usage:**  
  - Development of new functionalities.  
  - Integration testing of different features.  
  - Preparation of the next stable release.  

### Feature Branches
**feature/feature-name**: Branches for developing new features.  
- **Description:** These branches are created to develop specific new features. Each feature should have its own branch.  
- **Usage:**  
  - Develop and test new functionalities in isolation.  
  - Facilitate specific code reviews for each feature.  

### Bugfix Branches
**bugfix/bug-name**: Branches for fixing bugs.  
- **Description:** These are used to fix bugs found in the development branch or the main branch.  
- **Usage:**  
  - Address critical issues detected in production or during testing.  
  - Apply fixes quickly and merge back to dev and main as required.  

### Release Branches
**release/version-name**: Branches for preparing new releases.  
- **Description:** These branches are created to prepare a new version for production. They are used for final testing, polishing, and minor fixes.  
- **Usage:**  
  - Stabilization of the code before merging into the main branch.  
  - Preparation of release notes and final QA.
  
🧩 Estructura de la sucursal
Rama	Objetivo
principal	Rama estable para producción.
desarrollador	Rama de desarrollo activo.
característica/	Desarrollo de nuevas funcionalidades (por ejemplo, feature/farmacia).
corrección de errores/	Corrección de errores identificados.
liberar/	Preparando nuevas versiones estables.