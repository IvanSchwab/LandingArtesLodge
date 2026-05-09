<script setup lang="ts">
/**
 * HeroCrossfade — slideshow con transición de opacidad.
 * - Apila N <img> absolutos.
 * - Cambia el índice cada `interval` ms; el activo va a opacity 1, los demás a 0.
 * - `transition-opacity duration-[var(--t-slow)]` da el difuminado.
 * - Pausa al perder visibilidad (IntersectionObserver) para no consumir batería.
 * - prefers-reduced-motion → no rota, queda fija en la primera.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import logoUrl from '@/assets/icons/AL.svg';

const props = withDefaults(defineProps<{
  images: { src: string; alt: string }[];
  interval?: number;
  fadeMs?: number;
}>(), {
  interval: 6000,
  fadeMs: 1200,
});

const active = ref(0);
let timer: number | undefined;
let visible = true;

function tick() {
  if (!visible) return;
  active.value = (active.value + 1) % props.images.length;
}

function start() {
  stop();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || props.images.length < 2) return;
  timer = window.setInterval(tick, props.interval);
}
function stop() { if (timer) { clearInterval(timer); timer = undefined; } }

const root = ref<HTMLElement | null>(null);
let io: IntersectionObserver | undefined;

onMounted(() => {
  start();
  if (root.value) {
    io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? start() : stop();
    }, { threshold: 0.1 });
    io.observe(root.value);
  }
});
onBeforeUnmount(() => { stop(); io?.disconnect(); });
</script>

<template>
  <section ref="root" class="hero relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-brand-fg">
    <!-- Stack de imágenes -->
    <div class="absolute inset-0">
      <img
        v-for="(img, i) in images"
        :key="img.src"
        :src="img.src"
        :alt="img.alt"
        class="absolute inset-0 h-full w-full object-cover transition-opacity"
        :style="{ transitionDuration: fadeMs + 'ms', objectPosition: i === 0 ? 'center 90%' : 'center center' }"
        :class="i === active ? 'opacity-100' : 'opacity-0'"
        :aria-hidden="i !== active"
        :loading="i === 0 ? 'eager' : 'lazy'"
        decoding="async"
      />
    </div>

    <!-- Overlay para legibilidad -->
    <div class="pointer-events-none absolute inset-0 bg-[var(--c-overlay)]" />

    <!-- Logo centrado -->
    <div class="relative z-10 flex h-full items-center justify-center px-gutter">
      <img :src="logoUrl" alt="Artes Lodge" class="hero-logo" />
    </div>
  </section>
</template>

<style scoped>
.hero-logo {
  height: clamp(280px, 42vw, 520px);
  width: auto;
  object-fit: contain;
}
</style>
