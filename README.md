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

## Estructura de la rama del proyecto

### Ramas principales
**main**: Rama estable lista para producción.
- **Descripción:** Esta es la rama estable y lista para producción. Contiene código probado y validado.
- **Uso:**
  - Implementación de versiones estables.
  - Integración de cambios que han pasado por revisiones y pruebas.

**dev**: Rama de desarrollo para integrar nuevas funcionalidades.
- **Descripción:** Esta rama se utiliza para integrar nuevas funcionalidades y cambios. Es donde se realizan las pruebas antes de la fusión con la rama principal.
- **Uso:**
  - Desarrollo de nuevas funcionalidades.
  - Pruebas de integración de diferentes funcionalidades.
  - Preparación de la próxima versión estable.

### Ramas de características
**feature/feature-name**: Ramas para el desarrollo de nuevas funcionalidades.
- **Descripción:** Estas ramas se crean para desarrollar nuevas funcionalidades específicas. Cada funcionalidad debe tener su propia rama. 
- **Uso:**
  - Desarrollar y probar nuevas funcionalidades de forma aislada.
  - Facilitar revisiones de código específicas para cada característica.

### Ramas de corrección de errores
**bugfix/bug-name**: Ramas para corregir errores.
- **Descripción:** Se utilizan para corregir errores encontrados en la rama de desarrollo o en la rama principal.
- **Uso:**
  - Abordar problemas críticos detectados en producción o durante las pruebas.
  - Aplicar correcciones rápidamente y volver a integrar con los entornos de desarrollo y principal según sea necesario.

### Ramas de lanzamiento
**release/version-name**: Ramas para preparar nuevas versiones.

- **Descripción:** Estas ramas se crean para preparar una nueva versión para producción. Se utilizan para pruebas finales, pulido y correcciones menores.
- **Uso:**
  - Estabilización del código antes de fusionarlo con la rama principal.
  - Elaboración de notas de lanzamiento y control de calidad final.

###  Tecnologías utilizadas

| Categoría | Tecnología | Objetivo |
|------------|-------------|-----------|
| Servidor | **Node.js + Express** | API REST y servidor HTTP |
| Base de datos | **MongoDB Atlas (Mongoose)** | Persistencia de los registros médicos |
| Comunicación en tiempo real | **Socket.IO** | Telemedicina y actualizaciones de emergencia |
| Autenticación | **JWT (jsonwebtoken)** | Acceso seguro para médicos |
| Configuración del entorno | **dotenv** | Gestión de variables ambientales |
| Utilidades | **uuid, bcryptjs** | Identificadores únicos y seguridad |
| Despliegue | **PM2 / GitHub Actions** | Automatización y monitoreo en producción |
