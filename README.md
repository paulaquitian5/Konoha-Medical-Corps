# Estructura de Ramas del Proyecto

## Ramas Principales
**main**: Rama estable lista para producción.
-**Descripción:** Esta es la rama estable y lista para producción. Contiene el código que ha sido probado y validado.
**Uso:**
-Despliegue de versiones estables.
-Integración de cambios que han pasado por revisiones y pruebas.
**dev**: Rama de desarrollo para integrar nuevas características.
- **Descripción:** Esta rama se utiliza para integrar nuevas características y cambios. Es donde se realizan pruebas antes de fusionar en la rama principal.
**Uso:**
-Desarrollo de nuevas funcionalidades.
-Pruebas de integración de diferentes características.
-Preparación de la próxima versión estable.

## Ramas de Características

- **feature/nombre-caracteristica**: Ramas para el desarrollo de nuevas funcionalidades.
- **Descripción:** Estas ramas se crean para desarrollar nuevas características específicas. Cada característica debe tener su propia rama.
**Uso:**
- Desarrollar y probar nuevas funcionalidades de manera aislada.
- Facilitar revisiones de código específicas para cada característica.

## Ramas de Corrección de Errores

- **bugfix/nombre-error**: Ramas para corregir errores.
- **Descripción:** Se utilizan para corregir errores en la rama de desarrollo o en   la rama principal.
Uso:
  Abordar problemas críticos detectados en producción o en la fase de prueba.

## Ramas de Lanzamiento

- **release/nombre-version**: Ramas para preparar nuevas versiones.
- **Descripción:** Estas ramas se crean para preparar una nueva versión para producción. Se utilizan para realizar pruebas finales y correcciones.
**Uso:**
- Estabilización del código antes de fusionar en la rama principal.
- Documentación y preparación de notas de lanzamiento.
