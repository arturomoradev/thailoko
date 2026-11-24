# ThaiLoko S.L. · Web de empleo (simulación académica)

Sitio web **estático** (HTML + CSS + JavaScript puro) que simula el sistema de reclutamiento online de **ThaiLoko S.L.**, una empresa **ficticia** creada para el proyecto final del ciclo de FP Superior en Administración y Finanzas. **Ninguna oferta es real y no se envía ni se guarda ningún dato**: el formulario solo valida y muestra una pantalla de confirmación.

## Estructura

```
index.html                  Inicio
trabaja-con-nosotros.html   Ofertas, filtros, detalle y formulario de candidatura
privacidad.html             Protección de datos e igualdad de oportunidades
css/styles.css              Estilos (paleta en :root)
js/app.js                   Lógica (filtros, modal, validación)
data/jobs.js                Ofertas y correo de contacto (aquí se edita el contenido)
img/                        Imágenes optimizadas de la web original de ThaiLoko
.nojekyll                   Desactiva Jekyll en GitHub Pages
```

## Cómo editar

- **Ofertas**: abre `data/jobs.js` y modifica el array `TL_JOBS`. No hay que tocar la lógica.
- **Correo de contacto**: cambia `TL_CONFIG.email` en `data/jobs.js`. Se actualiza en todas las páginas.
- **Colores**: variables CSS al principio de `css/styles.css` (`--wine`, `--navy`, `--leaf`, `--cream`…).

## Cómo probarlo en local

Haz doble clic en `index.html`. No necesita servidor ni instalación. (Opcional: `python3 -m http.server` y abre `http://localhost:8000`.)

## Publicar en GitHub Pages (paso a paso)

1. Entra en <https://github.com> e inicia sesión (o crea una cuenta gratuita).
2. Pulsa **+ → New repository**. Ponle un nombre (por ejemplo `thailoko-empleo`), márcalo como **Public** y pulsa **Create repository**.
3. En el repositorio nuevo pulsa **uploading an existing file**. Arrastra **todo el contenido** de esta carpeta (incluidas las carpetas `css`, `js`, `data`, `img` y el archivo `.nojekyll`). Si tu navegador no deja subir `.nojekyll`, puedes omitirlo: el sitio funciona igual.
4. Baja y pulsa **Commit changes**.
   - Alternativa con git: `git init`, `git add .`, `git commit -m "Web de empleo ThaiLoko"`, `git branch -M main`, `git remote add origin https://github.com/<usuario>/<repo>.git`, `git push -u origin main`.
5. Ve a **Settings → Pages**. En **Build and deployment → Source** elige **Deploy from a branch**. En **Branch** elige `main` y la carpeta `/ (root)`, y pulsa **Save**.
6. Espera uno o dos minutos y recarga la página de Pages. Aparecerá la dirección del sitio con la forma `https://<usuario>.github.io/<repo>/`.
7. Comprueba que funciona: abre la dirección, entra en "Trabaja con nosotros", abre una oferta, prueba el formulario y revisa que se vean las imágenes y los estilos.

## Notas

- Todas las páginas llevan `noindex, nofollow` para que buscadores no indexen la empresa ficticia.
- Sin cookies, sin analítica y sin servicios externos, salvo la fuente Poppins de Google Fonts (opcional; si no carga, se usa una fuente del sistema).
- Las fotos y el logotipo proceden de la web original del restaurante del autor y se han reducido de tamaño.
