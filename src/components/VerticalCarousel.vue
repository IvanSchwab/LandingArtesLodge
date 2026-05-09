<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
  title?: string;
  description?: string;
  slides: { src: string; alt: string; name: string; description?: string }[];
}>();

// 3 clones en cada extremo (una página de 3 columnas de ancho)
// Estructura: [clone_n-3, clone_n-2, clone_n-1, real_0 … real_n-1, clone_0, clone_1, clone_2]
const CLONES = 3;

const augmented = computed(() => {
  const s = props.slides;
  if (s.length < 2) return s;
  return [...s.slice(-CLONES), ...s, ...s.slice(0, CLONES)];
});

const isInfinite = computed(() => props.slides.length >= 2);

const track = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
let isTeleporting = false;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function teleport(targetLeft: number) {
  const t = track.value;
  if (!t) return;
  isTeleporting = true;
  t.style.scrollBehavior = 'auto';
  t.scrollLeft = targetLeft;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      t.style.scrollBehavior = '';
      isTeleporting = false;
    })
  );
}

function updateCurrentIndex() {
  if (isTeleporting) return;
  const t = track.value;
  if (!t) return;
  const cards = Array.from(t.querySelectorAll<HTMLElement>('[data-card]'));
  if (!cards.length) return;

  let closest = 0;
  let minDist = Infinity;
  cards.forEach((card, i) => {
    const dist = Math.abs(card.offsetLeft - t.scrollLeft);
    if (dist < minDist) { minDist = dist; closest = i; }
  });

  const realIdx = ((closest - CLONES) % props.slides.length + props.slides.length) % props.slides.length;
  currentIndex.value = realIdx;
}

function checkScrollBounds() {
  if (isTeleporting) return;
  const t = track.value;
  if (!t || !isInfinite.value) return;

  const cards = Array.from(t.querySelectorAll<HTMLElement>('[data-card]'));
  if (!cards.length) return;

  const { scrollLeft, scrollWidth, offsetWidth } = t;

  if (scrollLeft >= scrollWidth - offsetWidth - 5) {
    teleport(cards[CLONES].offsetLeft);
  } else if (scrollLeft <= 5) {
    teleport(cards[props.slides.length].offsetLeft);
  }
}

function navigate(dir: 1 | -1) {
  if (isTeleporting) return;
  const t = track.value;
  if (!t) return;

  const cards = Array.from(t.querySelectorAll<HTMLElement>('[data-card]'));
  if (!cards.length) return;

  const currentIdx = cards.findIndex(c => c.offsetLeft >= t.scrollLeft - 1);
  const base = currentIdx === -1 ? 0 : currentIdx;
  const target = cards[Math.min(Math.max(base + dir, 0), cards.length - 1)];

  target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

onMounted(() => {
  nextTick(() => {
    const t = track.value;
    if (!t || !isInfinite.value) return;

    const cards = Array.from(t.querySelectorAll<HTMLElement>('[data-card]'));
    if (cards.length > CLONES) {
      t.style.scrollBehavior = 'auto';
      t.scrollLeft = cards[CLONES].offsetLeft;
      requestAnimationFrame(() => requestAnimationFrame(() => { t.style.scrollBehavior = ''; }));
    }

    updateCurrentIndex();

    t.addEventListener('scroll', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        checkScrollBounds();
        updateCurrentIndex();
      }, 200);
    }, { passive: true });
  });
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
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
            v-for="(s, i) in augmented"
            :key="i"
            data-card
            class="vc-item"
          >
            <div class="vc-img-wrap">
              <img :src="s.src" :alt="s.alt" class="vc-img" loading="lazy" />
            </div>
          </article>
        </div>
      </div>

      <!-- Dots — solo mobile -->
      <div class="vc-dots" aria-hidden="true">
        <span
          v-for="(_, i) in slides"
          :key="i"
          class="vc-dot"
          :class="{ 'vc-dot--active': i === currentIndex }"
        />
      </div>

      <!-- Flechas fuera del card -->
      <div class="vc-controls">
        <button type="button" aria-label="Anterior" class="vc-btn" @click="navigate(-1)">
          <img src="@/assets/icons/icono1.svg" alt="" class="h-5 w-5" />
        </button>
        <button type="button" aria-label="Siguiente" class="vc-btn" @click="navigate(1)">
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
  .vc-card-wrap {
    padding-inline: 0.75rem;
  }

  .vc-item {
    width: 100%;
  }

  .vc-img-wrap {
    aspect-ratio: 3 / 5;
  }
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

/* ── Dots — solo mobile ── */
.vc-dots {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

@media (max-width: 560px) {
  .vc-dots { display: flex; }
}

.vc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: rgba(109, 116, 54, 0.3);
  transition: background-color 220ms ease, transform 220ms ease;
  flex-shrink: 0;
}

.vc-dot--active {
  background-color: #6D7436;
  transform: scale(1.35);
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
