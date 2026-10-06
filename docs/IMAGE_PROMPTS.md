# Prompts de IA para las imágenes de la web

Este documento lista **cada imagen que falta** en el sitio (hoy son bloques de degradado de color como placeholder), con:

1. Dónde se usa (archivo/línea + tamaño de render)
2. Dónde subir el archivo final (`public/...`)
3. Un prompt listo para pegar en una herramienta de IA (Midjourney, DALL·E/ChatGPT, Adobe Firefly, Leonardo.ai)

Los prompts están en **inglés** porque casi todas las herramientas de generación de imágenes dan mejores resultados en ese idioma.

> ⚠️ **Antes de leer los prompts, lee la sección "Fotos reales vs. IA" más abajo** — para el retrato de Andrea y el estudio real, generar con IA no es lo recomendable.

---

## Estilo base (pégalo al final de cualquier prompt para mantener consistencia)

```
warm soft natural lighting, muted beige/taupe/ivory color palette
(#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), minimal modern beauty-spa
aesthetic, soft shadows, shallow depth of field, realistic skin texture,
no over-retouching, editorial beauty photography style, high resolution,
natural color grading, no text, no logos, no watermarks
```

**Negative prompt** (si la herramienta lo admite):
```
text, watermark, logo, oversaturated colors, cold blue tones,
harsh studio flash, plastic over-smoothed skin, visible product brand names
```

---

## ⚠️ Fotos reales vs. IA — léelo antes de generar nada

Este es un negocio real con una profesional real (Andrea Teles) y un estudio físico real en Visp. Para dos imágenes en particular, **no recomiendo usar IA**:

- **El retrato de Andrea** (página "Über Andrea"): una IA no puede generar una foto de la persona real — generaría una cara inventada que **no es ella**. Publicar eso como si fuera su foto sería engañoso para las clientas. Lo correcto es una foto profesional real (puede ser un smartphone con buena luz natural, no hace falta un estudio caro).
- **El interior real del estudio** (hero de home): ídem — lo ideal es una foto real del lugar donde las clientas van a llegar, para generar confianza y coincidir con lo que verán en persona.

Para ambas te dejo más abajo un prompt "genérico" que sirve **solo como placeholder temporal** mientras consigues la foto real — nunca para publicar en el sitio final.

Para el resto de las imágenes (cerca de manos, texturas, tratamientos genéricos, flatlay de diplomas) sí es seguro y razonable usar IA, porque no representan a una persona específica identificable.

---

## Convención de carpetas

Sube los archivos con estos nombres exactos dentro de `public/images/` (crea las carpetas si no existen):

```
public/images/home/hero.jpg
public/images/home/highlight.jpg
public/images/home/services/gesichtsbehandlung.jpg
public/images/home/services/haarentfernung-laser.jpg
public/images/home/services/augenbrauen-wimpern.jpg
public/images/home/services/manikuere-pedikuere.jpg
public/images/home/services/massage-koerperpflege.jpg
public/images/home/services/presotherapie-arosha-body.jpg
public/images/about/andrea-portrait.jpg
```

Formato recomendado: JPG o WEBP, sRGB, idealmente < 800 KB cada uno (Next.js los optimiza más al servirlos, pero conviene no partir de archivos gigantes).

Una vez subidas con esos nombres exactos, dime y las conecto en el código (hoy esos espacios son `<div>` con degradado, faltaría cambiarlos por `<Image>` de Next.js apuntando a estos paths).

---

## 1. Hero — Home

- **Dónde se usa:** [src/app/page.tsx:55](../src/app/page.tsx#L55) — columna derecha del hero, junto al titular "Verfeinerte Schönheit. Expertenpräzision."
- **Tamaño renderizado:** ~545×560px en escritorio (casi cuadrado, ligeramente vertical), ancho completo en móvil (440px alto)
- **Exportar a:** 1200×1300px
- **Subir a:** `public/images/home/hero.jpg`
- **Recomendación:** foto real del estudio o de un tratamiento en curso (ver advertencia arriba). Usa el prompt de abajo solo como placeholder temporal.

```
Close-up spa beauty treatment moment: a woman's hand gently applying
cream to another woman's cheek, eyes closed, serene expression,
warm soft natural lighting, muted beige/taupe/ivory color palette
(#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), minimal modern beauty-spa
aesthetic, soft shadows, shallow depth of field, realistic skin texture,
no over-retouching, editorial beauty photography style, high resolution,
natural color grading, no text, no logos, no watermarks.
Portrait orientation, soft window light from the side, minimal beige
backdrop, cropped composition focusing on hands and face.
--ar 4:5
```

---

## 2. Highlight / "Zertifizierte Kosmetikerin" — Home

- **Dónde se usa:** [src/app/page.tsx:92](../src/app/page.tsx#L92) — columna izquierda de la sección "Die perfekte Balance zwischen klinischer Expertise und verfeinerte Schönheit"
- **Tamaño renderizado:** `aspect-[4/5]`, mitad izquierda de un contenedor `max-w-6xl`
- **Exportar a:** 1200×1500px
- **Subir a:** `public/images/home/highlight.jpg`
- **Idealmente:** foto real de los diplomas/certificados reales de Andrea colgados en el estudio. Si no está disponible aún, el prompt genérico de abajo es seguro para usar (no representa a una persona específica).

```
Elegant flatlay of framed diploma certificates and beauty tools
(small glass skincare bottles, a jar of cream, a dried eucalyptus sprig)
arranged on a warm beige linen surface, warm soft natural lighting,
muted beige/taupe/ivory color palette (#DDD4C7, #BDA08A, #F1E3D3,
#58463D accents), minimal modern beauty-spa aesthetic, soft shadows,
editorial beauty photography style, high resolution, natural color
grading, no text, no logos, no watermarks.
Soft top-down natural light, minimal composition.
--ar 4:5
```

---

## 3–8. Tarjetas de leistungen — Home

- **Dónde se usa:** [src/app/page.tsx:145](../src/app/page.tsx#L145) — grid de 6 tarjetas de servicios (`c.services.map`)
- **Tamaño renderizado:** `aspect-[3/4]` cada una, en grid de 1/2/3 columnas según el ancho de pantalla
- **Exportar a:** 900×1200px cada una
- **Estas 6 sí son totalmente seguras para IA** — son fotos genéricas de tratamientos, sin identidad específica.

### 3. Gesichtsbehandlung
**Subir a:** `public/images/home/services/gesichtsbehandlung.jpg`
```
Close-up of an esthetician's gloved hands performing a facial treatment
on a woman's cheek and jawline, gentle massage motion, eyes closed,
relaxed expression, warm soft natural lighting, muted beige/taupe/ivory
color palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), minimal
modern beauty-spa aesthetic, shallow depth of field, realistic skin
texture, no over-retouching, editorial beauty photography style,
no text, no logos, no watermarks.
--ar 3:4
```

### 4. Haarentfernung & Laser
**Subir a:** `public/images/home/services/haarentfernung-laser.jpg`
```
Close-up of a modern laser hair removal device gently gliding over
smooth skin on a woman's leg, clinical yet warm atmosphere, soft beige
towel draped nearby, warm soft natural lighting, muted beige/taupe/ivory
color palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), minimal
modern beauty-spa aesthetic, shallow depth of field, realistic skin
texture, editorial beauty photography style, no text, no logos,
no watermarks.
--ar 3:4
```

### 5. Augenbrauen & Wimpern
**Subir a:** `public/images/home/services/augenbrauen-wimpern.jpg`
```
Extreme close-up of a woman's eye area during an eyebrow shaping
treatment, tweezers held by an esthetician's hand near perfectly
groomed eyebrows, soft natural skin texture, warm soft natural lighting,
muted beige/taupe/ivory color palette (#DDD4C7, #BDA08A, #F1E3D3,
#58463D accents), minimal modern beauty-spa aesthetic, shallow depth
of field, editorial beauty photography style, no text, no logos,
no watermarks.
--ar 3:4
```

### 6. Maniküre & Pediküre
**Subir a:** `public/images/home/services/manikuere-pedikuere.jpg`
```
Close-up of a manicurist's hands applying nude beige nail polish to a
client's fingernails, elegant hand positioning resting on a beige
towel, small nail tools nearby, warm soft natural lighting, muted
beige/taupe/ivory color palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D
accents), minimal modern beauty-spa aesthetic, shallow depth of field,
editorial beauty photography style, no text, no logos, no watermarks.
--ar 3:4
```

### 7. Massage & Körperpflege
**Subir a:** `public/images/home/services/massage-koerperpflege.jpg`
```
Close-up of hands performing a relaxing back massage on a woman lying
on a spa table, warm oil sheen on skin, soft beige linens, calm serene
mood, warm soft natural lighting, muted beige/taupe/ivory color
palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), minimal modern
beauty-spa aesthetic, shallow depth of field, editorial beauty
photography style, no text, no logos, no watermarks.
--ar 3:4
```

### 8. Presotherapie · Arosha Body
**Subir a:** `public/images/home/services/presotherapie-arosha-body.jpg`
```
Close-up of modern presotherapy compression boots wrapped around a
woman's legs on a spa treatment bed, clean minimal beauty-tech
aesthetic, warm beige linens, warm soft natural lighting, muted
beige/taupe/ivory color palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D
accents), shallow depth of field, editorial beauty photography style,
no text, no logos, no watermarks.
--ar 3:4
```

---

## 9. Retrato — Página "Über Andrea"

- **Dónde se usa:** [src/app/ueber-andrea/page.tsx:28](../src/app/ueber-andrea/page.tsx#L28) — hero de la página, junto al nombre "Andrea Teles"
- **Tamaño renderizado:** `aspect-[4/5]`, mitad izquierda del hero
- **Exportar a:** 1200×1500px
- **Subir a:** `public/images/about/andrea-portrait.jpg`

**Recomendación fuerte: usa una foto real de Andrea.** No hay forma de que una IA genere "una foto de Andrea Teles" — generaría una persona inventada que no es ella, y presentarla como su retrato en la web sería engañoso para las clientas que luego la conocerán en persona.

Si necesitas **solo un placeholder temporal** para maquetar mientras consigues la foto real, este prompt genérico (que no pretende ser nadie en particular) sirve de relleno — pero **debe reemplazarse antes de publicar el sitio**:

```
PLACEHOLDER ONLY — generic anonymous portrait, does not represent a
real specific person:
Professional portrait of a friendly beauty therapist in a white or
beige uniform, warm genuine smile, standing in a softly lit modern
beauty studio, warm soft natural lighting, muted beige/taupe/ivory
color palette (#DDD4C7, #BDA08A, #F1E3D3, #58463D accents), editorial
beauty photography style, no text, no logos, no watermarks.
--ar 4:5
```

---

## 10. Logo

El logo real de Beauty Palast ya existe (visto en `docs/BeautyPalastMarca.pdf`, páginas 3 y 5–6) — es un diseño con caligrafía y ornamentos ya definido, no algo que deba re-generarse con IA. Recomiendo:

1. Pedir al diseñador/estudio que hizo el manual de marca el archivo original en vector (SVG/AI/EPS) o al menos un PNG con fondo transparente en alta resolución.
2. Si no es posible conseguirlo, puedo extraerlo directamente del PDF (recorte del área del logo en la página 5 o 6) como solución temporal — pero no será tan nítido como un vector original.

No generes el logo con IA: el resultado no coincidiría con la identidad de marca ya definida (tipografía Tan Variety + ornamentos específicos).

---

## Qué hacer después de generar las imágenes

1. Genera cada imagen con la herramienta que prefieras (Midjourney, DALL·E/ChatGPT, Firefly, Leonardo.ai).
2. Ajusta/recorta al aspect ratio indicado si la herramienta no lo respeta exacto.
3. Guarda cada archivo con el nombre exacto de la tabla de convención de carpetas.
4. Súbelos a las rutas indicadas dentro de `public/images/`.
5. Avísame — reemplazo los `<div>` con degradado por `<Image>` de Next.js apuntando a cada archivo.
