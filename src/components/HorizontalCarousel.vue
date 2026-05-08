<script setup lang="ts">
/**
 * HorizontalCarousel — sección "Entorno y Naturaleza".
 * Imágenes apaisadas, scroll-snap horizontal, swipe táctil nativo.
 * Botones prev/next solo en md+.
 */
import { ref } from 'vue';

defineProps<{
  eyebrow?: string;        // "ENTORNO Y NATURALEZA"
  title?: string;
  slides: { src: string; alt: string; caption?: string }[];
}>();

const track = ref<HTMLElement | null>(null);

function scrollByCard(dir: 1 | -1) {
  const t = track.value;
  if (!t) return;
  const card = t.querySelector<HTMLElement>('[data-card]');
  const gap = 4;
  const w = card ? card.offsetWidth + gap : t.clientWidth * 0.5;
  t.scrollBy({ left: dir * w, behavior: 'smooth' });
}
</script>

<template>
  <section>
    <header v-if="eyebrow || title" class="mx-auto mb-8 max-w-content px-gutter">
      <p v-if="eyebrow" class="font-body text-eyebrow uppercase text-brand-muted">{{ eyebrow }}</p>
      <h2 v-if="title" class="mt-2 font-display text-h2 text-brand-fg">{{ title }}</h2>
    </header>

    <div class="relative">
      <div
        ref="track"
        class="flex snap-x snap-mandatory overflow-x-auto
               [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style="gap: 4px;"
      >
        <figure
          v-for="s in slides"
          :key="s.src"
          data-card
          class="snap-start shrink-0 aspect-[3/2] overflow-hidden"
          style="width: calc(50% - 2px);"
        >
          <img :src="s.src" :alt="s.alt" class="h-full w-full object-cover" loading="lazy" />
          <figcaption v-if="s.caption" class="sr-only">{{ s.caption }}</figcaption>
        </figure>
      </div>

      <!-- Controles desktop -->
      <div class="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-2">
        <button type="button" aria-label="Anterior" @click="scrollByCard(-1)"
          class="pointer-events-auto h-12 w-12 rounded-pill bg-brand-bg/85 backdrop-blur shadow-card flex items-center justify-center">
          <img src="@/assets/icons/icono1.svg" alt="" class="h-5 w-5" />
        </button>
        <button type="button" aria-label="Siguiente" @click="scrollByCard(1)"
          class="pointer-events-auto h-12 w-12 rounded-pill bg-brand-bg/85 backdrop-blur shadow-card flex items-center justify-center">
          <img src="@/assets/icons/icono2.svg" alt="" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </section>
</template>
