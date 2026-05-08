<script setup lang="ts">
/**
 * LocationMap — Leaflet + OpenStreetMap.
 * No requiere API key. Atribución obligatoria viene incluida por Leaflet.
 * Carga Leaflet de forma diferida (onMounted) para no inflar el bundle inicial.
 */
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'leaflet/dist/leaflet.css';

const props = withDefaults(defineProps<{
  lat: number;
  lng: number;
  zoom?: number;
  popup?: string;
}>(), {
  zoom: 14,
  popup: 'Las Artes Lodge',
});

const el = ref<HTMLElement | null>(null);
let map: any;

onMounted(async () => {
  const L = await import('leaflet');
  if (!el.value) return;
  map = L.map(el.value, { scrollWheelZoom: false }).setView([props.lat, props.lng], props.zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([props.lat, props.lng]).addTo(map).bindPopup(props.popup).openPopup();
});

onBeforeUnmount(() => { map?.remove(); });
</script>

<template>
  <section class="py-section" style="position: relative; isolation: isolate;">
    <div class="mx-auto max-w-content px-gutter">
      <h2 class="mb-6 font-display text-h2 text-brand-fg">Ubicación</h2>
      <div ref="el" class="h-[420px] w-full overflow-hidden rounded-lg shadow-card md:h-[520px]" />
    </div>
  </section>
</template>
