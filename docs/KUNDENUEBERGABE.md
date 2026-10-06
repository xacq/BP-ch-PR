# Beauty Palast

**Fecha:** julio 2026  
**Dirección de vista previa:** [https://beautypalast.tiingenieria.com](https://beautypalast.tiingenieria.com)  
**Dirección final prevista:** [https://beauty-palast.ch](https://beauty-palast.ch)

---


en este documento encontrará un resumen de todo lo que hemos desarrollado para Beauty Palast: la web, el panel de administración para editar contenidos, las decisiones tomadas según su manual de marca, y lo que queda pendiente.

---

## Qué hemos construido

El sitio web consta de **tres páginas**, accesibles desde el mismo menú de navegación:

| Página | Dirección | Contenido |
|---|---|---|
| **Inicio** | `/` | Bienvenida, cifras y marcas, presentación, vista previa de servicios, proceso, testimonios, preguntas frecuentes, contacto |
| **Servicios y precios** | `/leistungen` | Introducción y todos los tratamientos con precios, organizados por categorías |
| **Sobre Andrea** | `/ueber-andrea` | Retrato, biografía, cita, diplomas, valores y testimonios |

Además hemos preparado:

- **Sección de contacto** con dirección, teléfono, horarios y enlace a Google Maps (visible en la página de inicio y en el pie de página)
- **Bases de posicionamiento en buscadores (SEO)** — para que Google y otros motores encuentren y entiendan bien su página (títulos, descripciones, imagen de vista previa al compartir en WhatsApp o Facebook)
- **Un panel de administración** — para que pueda cambiar textos, precios, imágenes y datos de contacto **por su cuenta**, sin tener que contactarnos cada vez

La vista previa está disponible en **https://beautypalast.tiingenieria.com**. Es su entorno de prueba antes de publicar la web en su dominio definitivo **beauty-palast.ch**.

---

## Cómo acceder al panel de administración

El panel de administración es el área donde se editan los contenidos. Está protegido con contraseña y no es visible para los visitantes de la web.

### Paso a paso

1. Abra en su navegador: **https://beautypalast.tiingenieria.com/admin**
2. Será redirigida automáticamente a la pantalla de inicio de sesión.
3. Introduzca la **contraseña**:

   ```
   beautypalast2026
   ```

4. Haga clic en **«Anmelden»** (Iniciar sesión).
5. Entrará al área de gestión, con un menú a la izquierda y los campos de edición a la derecha.

### Puntos importantes

- **Guardar cambios:** Arriba a la derecha verá el botón **«Speichern»** (Guardar). Solo se activa cuando ha modificado algo. No olvide guardar antes de salir.
- **Ver la web:** En el menú inferior izquierdo hay **«↗ Website ansehen»** (Ver web) — así puede comprobar al instante cómo se ven sus cambios en la vista previa.
- **Cerrar sesión:** Abajo a la izquierda, haga clic en **«Abmelden»** (Cerrar sesión) cuando termine — especialmente en dispositivos compartidos.
- **Idioma del panel:** Abajo a la izquierda puede alternar entre **DE** y **EN**. Esto solo afecta la interfaz del panel, no el texto de su web (que permanece en alemán).

> **Seguridad:** Esta contraseña es para la fase de vista previa. Antes de publicar la web en **beauty-palast.ch**, la sustituiremos por una contraseña nueva y segura, y se la comunicaremos.

---

## Qué encontrará en el panel de administración

El menú de la izquierda está organizado según las páginas de su web. Cada opción corresponde a un bloque visible en el sitio.

### Página de inicio

| Sección | Qué puede editar |
|---|---|
| **Hero** | Imagen principal superior, título, subtítulo, teléfono, botones, etiquetas y la tarjeta de estadísticas |
| **Statistik-Leiste** | La franja oscura con cifras (p. ej. «15+ Jahre Erfahrung») |
| **Marken** | Nombres de las marcas de productos que trabaja |
| **Über-uns-Block** | El bloque destacado «Die perfekte Balance …» con imagen, texto y características |
| **Leistungen** | Las seis tarjetas de tratamientos en la vista previa (título, descripción, imagen, marcar como «Beliebteste») |
| **Ablauf** | Los tres pasos del proceso de una cita |
| **Kundenstimmen** | Testimonios en la página de inicio |
| **Häufige Fragen** | Preguntas y respuestas desplegables |

### Servicios y precios

| Sección | Qué puede editar |
|---|---|
| **Einleitung** | Título y texto en la parte superior de la página de precios |
| **Preise** | Todas las categorías de tratamientos con sus posiciones y precios — puede añadir, editar o eliminar categorías |

### Sobre Andrea

| Sección | Qué puede editar |
|---|---|
| **Vorstellung** | Foto de retrato, nombre, cargo, biografía y cita |
| **Diplome** | Certificados y formaciones |
| **Werte** | Los tres valores principales |
| **Kundenstimmen** | Testimonios en la página Sobre Andrea |

### General

| Sección | Qué puede editar |
|---|---|
| **Kontakt & Zeiten** | Logo (claro y blanco para el pie de página), nombre del negocio, teléfono, dirección, enlace de Google Maps, horarios |
| **SEO & Marketing** | URL del sitio, títulos y descripciones para Google, imagen de vista previa al compartir, y opcionalmente Google Analytics, Facebook Pixel y Google Search Console |
| **Abschnitt-Titel** | Los pequeños títulos que aparecen sobre cada sección en todas las páginas |

### Cómo subir imágenes

En muchos apartados del panel hay un **campo de imagen** con un botón «+» o **«Bild hochladen»** (Subir imagen):

- Haga clic y elija un archivo de su ordenador (JPG, PNG o WebP, máximo 5 MB).
- La imagen aparecerá de inmediato en la vista previa del panel.
- Pulse **«Speichern»** (Guardar) para que se vea en la web.
- Con **«Bild entfernen»** (Quitar imagen) el bloque vuelve al fondo de color de marca.

---

## Decisiones sobre el manual de marca

Hemos tomado su manual de marca como base y aplicado estas decisiones:

### Colores

La paleta oficial (marrón oscuro, beige cálido, taupe, marfil) está **reproducida fielmente en la web**. Fondos, textos, botones y acentos siguen estos tonos cálidos — sin grises fríos ni azules.

### Tipografías

| Elemento | Manual de marca | Implementación en la web |
|---|---|---|
| Texto, navegación, botones | **Montserrat** | Montserrat — como en el manual |
| Títulos y palabras de acento (cursiva) | **Tan Variety** | Por ahora **Montserrat** también en los títulos |

**¿Por qué?** Tan Variety es la fuente de su logo, pero es una **fuente de pago** que no se puede descargar libremente. Hasta que adquiera la licencia, usamos Montserrat también en los títulos, para que la página se vea uniforme y legible. Playfair Display (una alternativa visualmente similar) está disponible si lo prefiere.

### Logo

- En el panel puede subir **dos variantes del logo**: una para la cabecera clara y una **versión blanca** para el pie de página oscuro.
- Si no hay logo subido, se muestra el nombre «Beauty Palast» como texto.
- **Punto pendiente:** El logo actual todavía no encaja del todo con el diseño de la nueva web. Lo revisaremos juntas — si hace falta un ajuste, una variante nueva o un rediseño ligero.

### Estilo fotográfico

Seguimos las directrices del manual: luz cálida, tonos de piel naturales, estética tranquila — sin ambiente clínico frío ni retoque excesivo.

### Plantilla de diseño (Framer)

Como referencia visual usamos la plantilla [Éclat Aesthetics](https://apparent-watching-815066.framer.app/). Lamentablemente **no se pudo descargar**, así que reconstruimos el diseño y la estructura **a mano**, adaptados a Beauty Palast y a su manual de marca.

---

## Imágenes: temporales con IA, después las suyas reales

En la web verá **imágenes temporales** generadas con inteligencia artificial. Sirven de marcador de posición para que el sitio se vea completo y profesional mientras prepara sus fotos reales.

### Qué conviene reemplazar primero

| Imagen | Por qué importa una foto real |
|---|---|
| **Su retrato** (página Sobre Andrea) | La IA no puede representarla — debe ser su rostro real |
| **Imagen principal** (página de inicio) | Lo ideal es una foto de su estudio real en Visp — así las clientas reconocen el lugar |

### Qué puede quedarse con IA de momento

Para primeros planos de tratamientos, manos, cremas y motivos similares sin una persona identificable, las imágenes de IA son un buen puente hasta que tenga fotos propias.

### Cómo cambiar las imágenes

1. Abra el panel y vaya a la sección correspondiente (p. ej. **Hero** o **Vorstellung**).
2. Haga clic en **«Bild hochladen»** y elija su archivo.
3. **«Speichern»** — listo. No hace falta ningún paso técnico adicional.

---

## Lo que queda pendiente

Estos puntos siguen abiertos a propósito y en parte requieren su colaboración:

### De su parte / en conjunto

| Tema | Detalle |
|---|---|
| **Fotos reales** | Prioridad: retrato de Andrea y foto del estudio. Después se pueden ir sustituyendo el resto de imágenes. |
| **Revisar el logo** | El logo actual no encaja del todo visualmente con la página — lo definiremos juntas. |
| **Fuente Tan Variety** | Si desea máxima fidelidad al logo: comprar la licencia (p. ej. en MyFonts). Hasta entonces, Montserrat en los títulos. |
| **Códigos de marketing** | En el panel, sección **SEO & Marketing**, puede introducir sus IDs de Google Analytics, Facebook Pixel y Google Search Console. Le ayudamos a configurarlos si lo necesita. |
| **Confirmar el dominio** | La dirección final **beauty-palast.ch** está preparada — confirme que sigue siendo la que desea. |
| **Google Search Console** | Cuando la web esté publicada: registrar el mapa del sitio en Google para que se indexe antes. |

### De nuestra parte (antes del lanzamiento)

| Tema | Detalle |
|---|---|
| **Renovar contraseñas** | Sustituiremos la contraseña del panel y los accesos internos por valores seguros antes del lanzamiento oficial. |
| **Traslado a beauty-palast.ch** | Publicar la web desde la dirección de vista previa al dominio definitivo. |
| **Indicaciones de cómo llegar** | Los tres pasos bajo «So finden Sie uns» (dirección / tren / coche) están fijos por ahora. Si desea editarlos usted misma desde el panel, podemos habilitarlo. |

---

## Lista de comprobación

- [ ] Revisar la web en [beautypalast.tiingenieria.com](https://beautypalast.tiingenieria.com) y enviar comentarios
- [ ] Probar el panel: iniciar sesión, cambiar un texto, guardar y comprobar en la web
- [ ] Preparar fotos reales (retrato y estudio primero)
- [ ] Revisar precios y textos en el panel y ajustar si hace falta
- [ ] Subir variantes del logo (claro y blanco), si aún no lo ha hecho
- [ ] Confirmar el dominio y donde estara alojada esta web (es necesario un server que pueda soportar base de datos)
---