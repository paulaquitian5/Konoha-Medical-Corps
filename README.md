# 🏥 Konoha Medical Corps — Repository & Execution Guide

## Repository
**Konoha-Medical-Corps**: Sistema médico shinobi que centraliza la gestión de pacientes, diagnósticos automáticos, monitoreo remoto, alertas de emergencia y farmacia digital.  

- **URL del repositorio:**  

  - [https://github.com/sara446/Konoha-Medical-Corps](https://github.com/sara446/Konoha-Medical-Corps)

- **Propósito:**  

  - Centralizar el código fuente y documentación.  
  - Gestionar ramas de desarrollo y despliegue.  
  - Automatizar pruebas y despliegues mediante CI/CD.  

---

## ⚙️ Configuración y ejecución local

### Requisitos previos
- **Node.js v18+**  
- **npm** (gestor de paquetes de Node.js)  
- **Cuenta activa y acceso a MongoDB Atlas**

---

### Paso 1. Clonar el repositorio
```bash
git clone https://github.com/sara446/Konoha-Medical-Corps.git
cd Konoha-Medical-Corps
```
- **Descripción:** Descarga el repositorio del proyecto y permite acceder a todo el código fuente.  
- **Uso:** Preparar el entorno local para instalar y ejecutar el sistema.

---

### Paso 2. Instalar dependencias
```bash
npm install
```
**Además, instale Socket.IO (para comunicación en tiempo real):**  
```bash
npm install socket.io
```
- **Dependencias principales:**  
  - **express** → Servidor HTTP.  
  - **mongoose** → Conexión con MongoDB.  
  - **cors** → Permite solicitudes entre orígenes distintos.  
  - **dotenv** → Manejo de variables de entorno.  
  - **uuid** → Generación de identificadores únicos.  
  - **socket.io** → Comunicación en tiempo real (telemedicina y alertas).  

---

### Paso 3. Crear y configurar el archivo `.env`
```env
MONGODB_URI=mongodb+srv://<USUARIO>:<CONTRASEÑA>@cluster0.vnbiprd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
```
- **Uso:**  
  - Reemplace `<USUARIO>` y `<CONTRASEÑA>` con sus credenciales de MongoDB Atlas.  
  - No suba este archivo al repositorio (debe estar incluido en `.gitignore`).  

---

### Paso 4. Ejecutar la aplicación localmente
```bash
npm run dev
```
- **Resultado esperado:**  
```bash
🔥 Servidor Shinobi escuchando en el puerto 3000  
✅ Conexión a MongoDB Atlas exitosa
```

- **La aplicacion estara activa en:**

  - [http://localhost:3000](http://localhost:3000)

---

### Paso 5. Pruebas automatizadas
```bash
npm test
```
- **Descripción:** Ejecuta las pruebas definidas en el proyecto.  
- **Uso:** Garantiza la estabilidad del código antes del despliegue.

---

## 🚀 Despliegue (Render)

El sistema se encuentra desplegado de forma estable en **Render**, tanto el backend como el frontend, comunicándose mediante las URLs públicas del servicio.

El **frontend** realiza peticiones al backend usando la variable de entorno `VITE_API_URL`, apuntando al servidor backend.

---

## ⚙️ Estructura del proyecto

- **Backend:** Node.js + Express + MongoDB  
- **Frontend:** Vite + React  
- **Despliegue:** Render (ambos servicios desde la rama `dev`)   

---

## 🌐 URLs activas

- **Backend (API REST):**  
  [https://konoha-medical-corps.onrender.com](https://konoha-medical-corps.onrender.com)  
  > Esta dirección corresponde al servidor del sistema, por lo que no muestra una interfaz visual. 

  > Es completamente normal que aparezca el mensaje **“Cannot GET /”**, ya que el backend únicamente responde a solicitudes de la API mediante rutas como `/api/pacientes` o `/api/emergencia`.

- **Frontend (Interfaz de usuario):**  
  [https://konoha-medical-corps-frontend.onrender.com](https://konoha-medical-corps-frontend.onrender.com)  
  > Esta es la interfaz visible para los usuarios finales, encargada de consumir los servicios del backend.


**Estado actual:** ✅ Ambos entornos desplegados y comunicándose correctamente mediante peticiones HTTP.

---

## 🔀 Estructura de ramas del proyecto

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

---

### Ramas de características
**feature/feature-name**: Ramas para el desarrollo de nuevas funcionalidades.
- **Descripción:** Estas ramas se utilizan para desarrollar nuevas funcionalidades específicas. Cada funcionalidad debe tener su propia rama. 
- **Uso:**
  - Desarrollar y probar nuevas funcionalidades de forma aislada.
  - Facilitar revisiones de código específicas para cada característica.

---

### Ramas de corrección de errores
**bugfix/bug-name**: Ramas para corregir errores.
- **Descripción:** Se utilizan para corregir errores encontrados en la rama de desarrollo o en la rama principal.
- **Uso:**
  - Abordar problemas críticos detectados en producción o durante las pruebas.
  - Aplicar correcciones rápidamente y volver a integrar con los entornos de desarrollo y principal según sea necesario.

---

### Ramas de lanzamiento
**release/version-name**: Ramas para preparar nuevas versiones.

- **Descripción:** Estas ramas se utilizan para preparar una nueva versión para producción. Se utilizan para pruebas finales, pulido y correcciones menores.
- **Uso:**
  - Estabilización del código antes de fusionarlo con la rama principal.
  - Elaboración de notas de lanzamiento y control de calidad final.

---

### 🔁 Cambio entre ramas del proyecto

- **Para moverse entre las ramas disponibles:**
```bash
git checkout <nombre-de-la-rama>
```

- **Ejemplos:**
```bash
git checkout dev       # Rama principal de desarrollo (backend y frontend)
git checkout main      # Rama estable con documentación
git checkout feature/login-system   # Rama con nueva funcionalidad
```

- **Para verificar la rama actual:**
```bash
git branch
```

- **El asterisco (*) indica la rama activa.**

---

## 💻 Tecnologías utilizadas

| Categoría | Tecnología | Objetivo |
|------------|-------------|-----------|
| **Servidor** | Node.js + Express | API REST y servidor HTTP |
| **Base de datos** | MongoDB Atlas (Mongoose) | Persistencia de registros médicos |
| **Comunicación en tiempo real** | Socket.IO | Telemedicina y alertas de emergencia |
| **Autenticación** | JWT (jsonwebtoken) | Acceso seguro para médicos y pacientes |
| **Configuración del entorno** | dotenv | Manejo de variables ambientales |
| **Utilidades** | uuid, bcryptjs | Identificadores únicos y seguridad |
| **Despliegue** | Render | Alojamiento y ejecución en producción |
