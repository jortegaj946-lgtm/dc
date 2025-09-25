# Diseñador Visual — GitHub Pages Ready (MVP)

Este repositorio contiene un MVP de un editor de diseño visual (estático) listo para publicar en **GitHub Pages**.

## Estructura del proyecto
```
/ (root)
  index.html
  contact.html
  projects.html
  resume.html
  /css/styles.css
  /js/editor.js
  /js/heatmap-init.js
  /assets/logo.svg
  /assets/sample_template.svg
  README.md
  LICENSE
  .nojekyll
```

## Pasos para publicar en GitHub Pages (rápido)
1. Crea un repositorio nuevo en GitHub (por ejemplo `designer-mvp`) y sube **todos** los archivos a la rama `main` (asegúrate de que `index.html` quede en la raíz).
2. Ve a **Settings → Pages** en tu repo.
3. En "Source" elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. GitHub tardará unos segundos en generar la página. La URL será `https://<tu-usuario>.github.io/<tu-repo>/`.
5. Si algo no funciona, abre la consola del navegador (F12) y busca errores 404 (archivos no encontrados) o errores de carga de recursos (CSP).

## Nota importante
- El editor usa **Fabric.js** y **heatmap.js** mediante CDN. Si tu página no carga estas librerías (error 404 o CSP), la interfaz mostrará un banner con instrucciones.
- Para producción se recomienda:
  - Subir archivos locales de las librerías o usar un pipeline (npm) para incluir dependencias.
  - Añadir backend para guardar proyectos en la nube, control de usuarios y pagos.

## ¿No funciona después de esto?
Dime el enlace del repo o la URL de GitHub Pages y te reviso los errores concretos (te diré exactamente qué corregir). También puedo generar un README con comandos `git` para desplegar paso a paso.
