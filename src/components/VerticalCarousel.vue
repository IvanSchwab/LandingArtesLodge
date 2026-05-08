<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string;
  description?: string;
  slides: { src: string; alt: string; name: string; description?: string }[];
}>();

const track = ref<HTMLElement | null>(null);
function scrollByCard(dir: 1 | -1) {
  const t = track.value;
  if (!t) return;
  const card = t.querySelector<HTMLElement>('[data-card]');
  const w = card ? card.offsetWidth + 16 : t.clientWidth * 0.9;
  t.scrollBy({ left: dir * w, behavior: 'smooth' });
}
</script>

<template>
  <section class="vc-section">
    <!-- Encabezado centrado -->
    <header class="vc-header">
      <h2 v-if="title" class="vc-title">{{ title }}</h2>
      <p v-if="description" class="vc-description">{{ description }}</p>
    </header>

    <!-- Card contenedora del carrusel -->
    <div class="vc-card-wrap">
      <div class="vc-card">
        <div
          ref="track"
          class="vc-track"
        >
          <article
            v-for="s in slides"
            :key="s.src"
            data-card
            class="vc-item"
          >
            <div class="vc-img-wrap">
              <img :src="s.src" :alt="s.alt" class="vc-img" loading="lazy" />
            </div>
          </article>
        </div>
      </div>

      <!-- Flechas fuera del card -->
      <div class="vc-controls">
        <button type="button" aria-label="Anterior" class="vc-btn" @click="scrollByCard(-1)">
          <img src="@/assets/icons/icono1.svg" alt="" class="h-5 w-5" />
        </button>
        <button type="button" aria-label="Siguiente" class="vc-btn" @click="scrollByCard(1)">
          <img src="@/assets/icons/icono2.svg" alt="" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Sección ── */
.vc-section {
  background-color: #f0e6d5;
  padding: clamp(2.875rem, 7vw, 5.25rem) 0;
}

/* ── Encabezado ── */
.vc-header {
  text-align: center;
  padding-inline: var(--gutter, clamp(1rem, 4vw, 2rem));
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.vc-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.15rem);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6D7436;
  margin: 0 0 1.25rem;
  line-height: 1.1;
}

.vc-description {
  font-family: var(--font-body);
  font-size: clamp(1.15rem, 1.75vw, 1.32rem);
  line-height: 1.65;
  color: #6D7436;
  max-width: 60ch;
  margin: 0 auto;
  opacity: 0.85;
}

/* ── Card contenedora ── */
.vc-card-wrap {
  position: relative;
  max-width: 1350px;
  margin-inline: auto;
  /* padding lateral = espacio para las flechas */
  padding-inline: clamp(4rem, 8vw, 5.75rem);
}

.vc-card {
  background-color: rgba(109, 116, 54, 0.27);
  border-radius: 20px;
  padding: clamp(1.15rem, 2.3vw, 1.75rem);
  overflow: hidden;
}

/* ── Track ── */
.vc-track {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.vc-track::-webkit-scrollbar { display: none; }

/* ── Cards individuales ── */
.vc-item {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: calc(33.333% - 0.9rem);
}

@media (max-width: 900px) {
  .vc-item { width: calc(50% - 0.625rem); }
}

@media (max-width: 560px) {
  .vc-item { width: 72%; }
}

.vc-img-wrap {
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border-radius: 12px;
}

.vc-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Flechas — centradas verticalmente al lado del card ── */
.vc-controls {
  display: none;
  position: absolute;
  inset: 0;
  pointer-events: none;
  align-items: center;
  justify-content: space-between;
  padding-inline: 0.5rem;
}

@media (min-width: 768px) {
  .vc-controls { display: flex; }
}

.vc-btn {
  pointer-events: auto;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  background-color: rgba(109, 116, 54, 0.27);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease;
}

.vc-btn:hover { background-color: rgba(109, 116, 54, 0.45); }
</style>
