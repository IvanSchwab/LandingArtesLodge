# Artes Lodge — Landing Page

Stack: **Vue 3 + TypeScript + Vite + Tailwind CSS**, contact form vía **Resend**, mapa con **Leaflet + OpenStreetMap**.

---

## 1. Setup

```bash
pnpm install
cp .env.example .env   # cargar RESEND_API_KEY y CONTACT_TO_EMAIL
pnpm dev
```

## 2. Estructura

```
src/
  assets/
    icons/                 # icono1.svg, icono2.svg, ... (placeholders)
    images/                # imágenes provistas por la diseñadora
  components/
    HeroCrossfade.vue      # slideshow opacidad/crossfade
    HorizontalCarousel.vue # "Entorno y Naturaleza" — apaisado, swipe
    VerticalCarousel.vue   # "Nuestras Unidades" — retrato, swipe
    LocationMap.vue        # Leaflet + OSM
    ContactForm.vue        # form a /api/contact
    SiteFooter.vue         # form + imagen decorativa
  composables/
    useSwipe.ts            # gesto táctil reutilizable
  styles/
    tokens.css             # variables CSS (colores, tipografía, espaciado)
    base.css               # reset + base
  views/
    HomeView.vue           # composición de secciones
server/
  api/
    contact.ts             # endpoint Resend
public/
  fonts/                   # webfonts si aplica
tailwind.config.ts
.env.example
```

## 3. Design tokens

Los tokens están en `src/styles/tokens.css` y mapeados en `tailwind.config.ts` para usar utilidades como `bg-brand-bg`, `text-brand-fg`, `font-display`, `font-body`, etc.

> **Nota para Claude Code:** los valores de color y tipografía deben confirmarse abriendo el PDF original `WEBAL2.pdf` (incluido en `/design/`). Los placeholders en `tokens.css` están marcados con `/* TODO: confirmar con PDF */`. Reemplazar por los hex y familias exactas que use la diseñadora antes de mergear.

## 4. Secciones del landing

Orden vertical en `HomeView.vue`:

1. **Hero crossfade** — `<HeroCrossfade :images="..." :interval="6000" />`
2. **Entorno y Naturaleza** — `<HorizontalCarousel :slides="..." />`
3. **Piscina** — bloque editorial (imagen + texto)
4. **Nuestras Unidades** — `<VerticalCarousel :slides="..." />`
5. **Mapa** — `<LocationMap :lat="..." :lng="..." />`
6. **Footer** — `<SiteFooter />` (form + imagen decorativa)

## 5. Iconos / SVGs

Todos los íconos se referencian como placeholders en `src/assets/icons/`:
`icono1.svg`, `icono2.svg`, ...
La diseñadora los reemplazará con los archivos finales conservando el mismo nombre.

## 6. Responsive

Breakpoint único: `md: 768px`.
- < 768px → stack vertical, carruseles 100% ancho con swipe táctil, formulario full width, mapa 100%.
- ≥ 768px → layout original del PDF.

Detalles en `HANDOFF.html` (sección Responsive).

## 7. Email (Resend)

Endpoint serverless en `server/api/contact.ts`. Variables:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` (destino)
- `CONTACT_FROM_EMAIL` (remitente verificado en Resend)

## 8. Mapa (Leaflet)

Sin API key. Tiles:
`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
Atribución obligatoria: `© OpenStreetMap contributors`.

Coordenadas en `src/config/site.ts` → `LODGE_COORDS`.
