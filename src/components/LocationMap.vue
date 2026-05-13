<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css';
import { CONTACT } from '@/config/site';

const props = withDefaults(defineProps<{
  lat: number;
  lng: number;
  zoom?: number;
}>(), {
  zoom: 14,
});

const el = ref<HTMLElement | null>(null);
let map: any;

const googleMapsUrl = `https://www.google.com/maps?q=${props.lat},${props.lng}`;

onMounted(async () => {
  const L = await import('leaflet');
  if (!el.value) return;

  map = L.map(el.value, {
    scrollWheelZoom: false,
    zoomControl: false,
  }).setView([props.lat, props.lng], props.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(109,116,54,0.22);animation:map-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="width:26px;height:26px;background:#6D7436;border-radius:50%;border:4px solid #f0e6d5;box-shadow:0 4px 16px -4px rgba(20,16,12,.4);display:flex;align-items:center;justify-content:center;">
          <div style="width:6px;height:6px;background:#f0e6d5;border-radius:50%;"></div>
        </div>
      </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -28],
  });

  L.marker([props.lat, props.lng], { icon }).addTo(map).bindPopup('Las Artes Lodge').openPopup();
  L.control.zoom({ position: 'bottomright' }).addTo(map);
});

onBeforeUnmount(() => { map?.remove(); });
</script>

<template>
  <section class="map-section py-section">
    <div class="mx-auto max-w-content px-gutter">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">

        <!-- Columna de texto -->
        <div class="lg:col-span-1 flex flex-col gap-8">
          <div>
            <p class="font-body text-eyebrow uppercase map-eyebrow">Dónde estamos</p>
            <h2 class="mt-3 font-display text-h2 map-title leading-tight">Encontrá tu lugar</h2>
            <p class="mt-4 font-body text-body map-body leading-relaxed">
              Estamos en Mina Clavero, en el corazón de las Sierras de Córdoba, rodeados de naturaleza y con acceso directo al río.
            </p>
          </div>

          <div class="flex flex-col gap-5">
            <div class="contact-row">
              <div class="icon-ring">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Dirección</p>
                <p class="contact-value">Mina Clavero, Córdoba, Argentina</p>
              </div>
            </div>

            <a :href="CONTACT.emailHref" class="contact-row contact-link">
              <div class="icon-ring">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Email</p>
                <p class="contact-value">{{ CONTACT.email }}</p>
              </div>
            </a>

            <a :href="CONTACT.phoneHref" class="contact-row contact-link">
              <div class="icon-ring">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.62 4.37 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Teléfono</p>
                <p class="contact-value">{{ CONTACT.phone }}</p>
              </div>
            </a>
          </div>

          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="map-cta self-start inline-flex items-center gap-2 font-body font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
          >
            Ver en Google Maps
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>

        <!-- Columna del mapa -->
        <div class="lg:col-span-2 relative">
          <div class="map-deco absolute -inset-3 rounded-[2rem]" aria-hidden="true"></div>
          <div class="relative h-[420px] md:h-[520px] w-full rounded-[1.25rem] overflow-hidden shadow-overlay map-frame">
            <div ref="el" class="w-full h-full map-filter" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Section ─────────────────────────────────────────────────── */
.map-section {
  position: relative;
  isolation: isolate;
  background-color: var(--color-brand-bg, #f0e6d5);
}

/* ─── Text column ─────────────────────────────────────────────── */
.map-eyebrow { color: #6D7436; opacity: 0.7; }
.map-title   { color: #6D7436; }
.map-body    { color: #6D7436; opacity: 0.75; }

/* ─── Contact rows ────────────────────────────────────────────── */
.contact-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.contact-link { text-decoration: none; }
.contact-link:hover .icon-ring {
  background: #6D7436;
  color: #f0e6d5;
}
.icon-ring {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 1px solid rgba(109, 116, 54, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6D7436;
  transition: background 0.25s, color 0.25s;
}
.contact-label { font-weight: 600; font-size: 0.8125rem; color: #6D7436; }
.contact-value { font-size: 0.8125rem; color: #6D7436; opacity: 0.7; }

/* ─── CTA button ──────────────────────────────────────────────── */
.map-cta {
  background: #6D7436;
  color: #f0e6d5;
  padding: 0.875rem 2rem;
  border-radius: 999px;
}
.map-cta:hover { box-shadow: 0 8px 24px -8px rgba(109, 116, 54, 0.5); }

/* ─── Map column ──────────────────────────────────────────────── */
.map-deco {
  border: 1px solid rgba(109, 116, 54, 0.12);
  pointer-events: none;
}
.map-frame {
  border: 6px solid rgba(255, 255, 255, 0.6);
}
.map-filter {
  filter: brightness(0.97) saturate(0.9);
}

/* ─── Marker ping animation ───────────────────────────────────── */
@keyframes map-ping {
  0%   { transform: scale(1); opacity: 0.6; }
  75%  { transform: scale(2); opacity: 0; }
  100% { transform: scale(2); opacity: 0; }
}

/* ─── Leaflet overrides ───────────────────────────────────────── */
:deep(.leaflet-popup-content-wrapper) {
  background: #f0e6d5;
  border: none;
  border-radius: 6px;
  box-shadow: 0 6px 24px -8px rgba(20, 16, 12, 0.25);
}
:deep(.leaflet-popup-tip)             { background: #f0e6d5; }
:deep(.leaflet-popup-content) {
  color: #6D7436;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 10px 14px;
}
:deep(.leaflet-popup-close-button)    { color: #6D7436 !important; }

:deep(.leaflet-control-zoom a) {
  background: #f0e6d5;
  color: #6D7436;
  border-color: rgba(109, 116, 54, 0.25);
}
:deep(.leaflet-control-zoom a:hover) {
  background: #6D7436;
  color: #f0e6d5;
}
:deep(.leaflet-control-attribution) {
  font-size: 0.625rem;
  opacity: 0.6;
}
</style>
