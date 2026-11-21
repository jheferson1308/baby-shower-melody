# Invitación digital — Baby Shower sirenita

Página estática, mobile-first, pensada para compartir por WhatsApp. No requiere backend ni instalación: abre `index.html` en el navegador y funciona.

## Estructura

```
index.html
css/styles.css
js/main.js
assets/        (PNG recortados, MP3 y originales en assets/originales/)
README.md
```

## 1. Editar los datos desde `CONFIG`

Toda la información configurable está al inicio de `js/main.js`, en el objeto `CONFIG`. No hace falta tocar el HTML.

| Campo | Qué cambiar |
| --- | --- |
| `nombreBebe` | Nombre que aparece en el listón lila (`MELODY AITHANA`). |
| `nombrePadres` | Texto bajo “Con mucho amor”: solo el nombre de la mamá, sin “&”. |
| `fecha`, `diaSemana`, `numeroDia`, `mes`, `anio`, `hora` | Texto de la fecha y de la hora. |
| `fechaISO` | Fecha y hora reales para la cuenta regresiva, en formato `AAAA-MM-DDTHH:mm:ss`. |
| `contadorActivo` | `true` muestra la cuenta regresiva; `false` la oculta. |
| `mostrarScuttle` | `true` muestra la gaviota Scuttle en el cierre; `false` la oculta. |
| `direccion` | Texto de la sección Dirección. |
| `urlUbicacion` | Link corto de Google Maps que abre el botón “Ver ubicación”. Si lo dejas vacío (`""`), se genera desde `direccion`. |
| `urlMapaEmbed` | URL larga `.../maps?q=...&output=embed` usada por el iframe. Se resolvió desde el link corto. |
| `whatsappReservas` | Único número de reservas, con código de país y solo dígitos. |
| `mensajeConMama` / `mensajeConPapa` | Texto prellenado de cada botón. Ambos envían al mismo número; cambia solo el mensaje según con quién viene el invitado. |
| `rutaMusica` | Ruta del MP3 usado como música de fondo (`assets/musica.mp3`). |
| `volumenMusica` | Volumen de 0 a 1; ahora está en `0.6`. |
| `imagenes` | Rutas de las tres fotos usadas: `arielPortada`, `arielConcha` y `scuttle`. El resto de la decoración es SVG/CSS inline. |
| `compartir` | Título, descripción e imagen de las etiquetas Open Graph / WhatsApp. |
| `creditos` | Línea del pie: `✦ Fabricado por Colerson ✦`. |

El título del navegador, la descripción y las meta etiquetas de WhatsApp se actualizan solos al cargar la página.

## 2. Imágenes y decoración

Solo se muestran tres fotos recortadas. El resto de la decoración —corales, algas, estrellas, conchas, perlas, caballito, peces, burbujas, rayos y olas— es SVG/CSS inline, así que no quedan huecos ni recuadros vacíos.

| Archivo usado por la página | Dónde aparece | Medidas verificadas |
| --- | --- | --- |
| `assets/ariel-portada.png` | Portada y cierre “¡Te esperamos!” | 1482 × 980 px, transparente |
| `assets/ariel-concha.png` | Inicio, dentro de la concha | 806 × 852 px, transparente |
| `assets/scuttle.png` | Detalle opcional arriba a la derecha del cierre | 1112 × 1420 px, transparente |

Las fotos se procesaron con `rembg` (modelo `isnet-general-use`), se recortaron con erosión/blur de alfa y se escalaron con Pillow LANCZOS + `UnsharpMask` porque Real-ESRGAN y OpenCV `dnn_superres` no están instalados. Los originales siguen intactos en la raíz y en `assets/originales/`; `assets/originales/scuttle-limpio.png` es la copia previa al último escalado. Las esquinas tienen canal alfa `0`, no se usa `mix-blend-mode` y las imágenes flotan con `drop-shadow` suave sin bordes ni fondos.

La decoración y las tarjetas usan transparencias, `backdrop-filter` y separadores de ola. Las animaciones son de `transform`/`opacity`, con parallax suave, lluvia de burbujas y estrellas al abrir, y un estallido final al llegar al cierre. Todo se desactiva con `prefers-reduced-motion`.

Si reemplazas una foto, conserva transparencia y proporciones parecidas; las rutas están centralizadas en `CONFIG.imagenes`. La imagen de WhatsApp (`compartir.imagen`) apunta a `assets/ariel-portada.png`. Para una vista previa ideal, sube una versión PNG/JPG de **1200 × 630 px** al mismo servidor y cambia solo `compartir.imagen`. Los links de WhatsApp necesitan una URL pública (no `file://`) para mostrarla.

## 3. Cambiar la música

La música configurada es `assets/musica.mp3`, copia del MP3 que pusiste en la raíz (`La Sirenita - Bajo El Mar (Latino) (Letra).mp3`). El original se conservó tal cual; dentro de `assets/` se renombró a `musica.mp3`.

1. El elemento `<audio id="audio-fondo" preload="auto" loop>` precarga el archivo y lo repite en bucle.
2. En `CONFIG`, `rutaMusica: "assets/musica.mp3"` y `volumenMusica: 0.6`.
3. La música se inicia al tocar el sobre o el botón flotante, porque los navegadores móviles bloquean el audio hasta que haya una interacción del usuario.
4. Si el navegador bloquea la reproducción o el usuario oculta la pestaña, no se muestra ningún error: el botón vuelve a su estado de “Reproducir”.

El archivo pesa 5,466,416 bytes (aprox. 5.47 MB). Funciona, pero para invitaciones por WhatsApp conviene comprimirlo a 1–3 MB o usar un loop instrumental más corto.

## 4. Mapa incrustado

El link corto `https://maps.app.goo.gl/Ebk99xYZZWMm1LKt8` se resolvió con `curl -sL -o /dev/null -w "%{url_effective}"` a coordenadas `-14.056126,-75.728339`. No se usó el respaldo por texto.

- `CONFIG.urlUbicacion`: link corto original, usado por el botón “Ver ubicación”.
- `CONFIG.urlMapaEmbed`: `https://www.google.com/maps?q=-14.056126,-75.728339&z=17&output=embed`, sin API key.
- El iframe mide 240 px de alto en celular y 280 px en pantallas anchas, con borde lila, radio de 20 px y sombra suave.
- Una capa transparente bloquea el scroll táctil del mapa; al tocarla el mapa queda activo y se desactiva al tocar fuera.
- Si el iframe no carga en 8 segundos, aparece “No se pudo cargar el mapa, toca el botón Ver ubicación”.
- El mapa hereda el fade-in de la sección “Dirección” porque está dentro del bloque `.reveal`.

## 5. Publicar gratis

### GitHub Pages

1. Crea un repositorio y sube todos los archivos.
2. En el repo: **Settings → Pages → Build and deployment**, elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. Guarda. La URL será `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

### Netlify

1. Entra a Netlify → **Add new site → Deploy manually** y arrastra la carpeta completa del proyecto.
2. No hay comandos de build: es un sitio estático.
3. Opcional: en **Site settings → Change site name** pon un nombre amigable antes de compartirlo.

Después de publicar, prueba el link en WhatsApp para verificar la imagen y el texto de la vista previa.

## 6. Detalles técnicos

- Sin frameworks, sin dependencias y sin backend.
- Ancho máximo de 480 px, centrado en escritorio como un celular.
- Animaciones suaves con `IntersectionObserver`, parallax y celebración de apertura; se desactivan con `prefers-reduced-motion`.
- Botones con `aria-label`, imágenes con `alt` y enlaces externos con `rel="noopener noreferrer"`.
- “Términos y ayuda” y “Política de privacidad” son enlaces decorativos (`href="#"`).
- El pie incluye `✦ Fabricado por Colerson ✦` desde `CONFIG.creditos`, en Cormorant Garamond de 12 px, sin enlace y con padding inferior seguro para el navegador.
