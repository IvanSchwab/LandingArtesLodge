<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
  eyebrow?: string;
  title?: string;
  slides: { src: string; alt: string; caption?: string }[];
}>();

// 2 clones izq + reales + 2 clones der  →  n+4 cards, w-1/2, sin gap
//
// offsetLeft[k] = k × (W/2)   →   scrollWidth = (n+4) × W/2
// maxScrollLeft               = (n+2) × W/2  = scrollWidth − offsetWidth
//
// Targets de teletransporte (aritmética pura, sin comparar índices):
//   clones der: scrollLeft ≥ scrollWidth − offsetWidth − 5  →  target = offsetWidth        (= primer slide real)
//   clones izq: scrollLeft ≤ 5                              →  target = scrollWidth − 2×offsetWidth (= último par real)
const augmented = computed(() => {
  const s = props.slides;
  if (s.length < 2) return s;
  return [...s.slice(-2), ...s, ...s.slice(0, 2)];
});

const isInfinite = computed(() => props.slides.length >= 2);

const track = ref<HTMLElement | null>(null);
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

function checkScrollBounds() {
  if (isTeleporting) return;
  const t = track.value;
  if (!t || !isInfinite.value) return;

  const { scrollLeft, scrollWidth, offsetWidth } = t;

  if (scrollLeft >= scrollWidth - offsetWidth - 5) {
    // Zona de clones derecha → saltar al primer slide real
    teleport(offsetWidth);
  } else if (scrollLeft <= 5) {
    // Zona de clones izquierda → saltar al último par real
    teleport(scrollWidth - 2 * offsetWidth);
  }
}

// Avanza o retrocede al siguiente/anterior elemento DOM — el navegador aterriza en el snap point correcto
function navigate(dir: 1 | -1) {
  if (isTeleporting) return;
  const t = track.value;
  if (!t) return;

  const cards = Array.from(t.querySelectorAll<HTMLElement>('[data-card]'));
  if (!cards.length) return;

  // Encontrar la primera card visible (su borde izquierdo ≥ scrollLeft)
  const currentIdx = cards.findIndex(c => c.offsetLeft >= t.scrollLeft - 1);
  const base = currentIdx === -1 ? 0 : currentIdx;
  const target = cards[Math.min(Math.max(base + dir, 0), cards.length - 1)];

  target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
}

onMounted(() => {
  nextTick(() => {
    const t = track.value;
    if (!t) return;

    // Posicionar en el primer slide real (idx 2): offsetLeft = 2 × W/2 = W = offsetWidth
    if (isInfinite.value) {
      t.style.scrollBehavior = 'auto';
      t.scrollLeft = t.offsetWidth;
      requestAnimationFrame(() => requestAnimationFrame(() => { t.style.scrollBehavior = ''; }));
    }

    // Debounce en scroll (100 ms): más robusto que scrollend en snap CSS
    t.addEventListener('scroll', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkScrollBounds, 200);
    }, { passive: true });
  });
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
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
        class="flex flex-nowrap snap-x snap-mandatory overflow-x-auto
               [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <figure
          v-for="(s, i) in augmented"
          :key="i"
          data-card
          class="w-1/2 shrink-0 snap-start aspect-[3/2] overflow-hidden"
        >
          <img :src="s.src" :alt="s.alt" class="w-full h-full object-cover" loading="lazy" />
          <figcaption v-if="s.caption" class="sr-only">{{ s.caption }}</figcaption>
        </figure>
      </div>

      <!-- Controles desktop -->
      <div class="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-2">
        <button
          type="button"
          aria-label="Anterior"
          @click="navigate(-1)"
          class="pointer-events-auto h-12 w-12 rounded-pill bg-brand-bg/85 backdrop-blur shadow-card flex items-center justify-center"
        >
          <img src="@/assets/icons/icono1.svg" alt="" class="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          @click="navigate(1)"
          class="pointer-events-auto h-12 w-12 rounded-pill bg-brand-bg/85 backdrop-blur shadow-card flex items-center justify-center"
        >
          <img src="@/assets/icons/icono2.svg" alt="" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </section>
</template>
