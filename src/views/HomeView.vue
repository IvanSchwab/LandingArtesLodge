<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import HeroCrossfade from '@/components/HeroCrossfade.vue';
import HorizontalCarousel from '@/components/HorizontalCarousel.vue';
import VerticalCarousel from '@/components/VerticalCarousel.vue';
import LocationMap from '@/components/LocationMap.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import { LODGE_COORDS, HERO_IMAGES, NATURE_SLIDES, UNIT_SLIDES, PISCINA_IMAGE, LODGE_IMAGES, FOOTER_IMAGE } from '@/config/site';

const lodgeActive = ref(0);
const lodgeRef = ref<HTMLElement | null>(null);
let lodgeTimer: number | undefined;
let lodgeVisible = true;

function lodgeTick() {
  if (lodgeVisible) lodgeActive.value = (lodgeActive.value + 1) % LODGE_IMAGES.length;
}
function lodgeStart() {
  lodgeStop();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || LODGE_IMAGES.length < 2) return;
  lodgeTimer = window.setInterval(lodgeTick, 2000);
}
function lodgeStop() { if (lodgeTimer) { clearInterval(lodgeTimer); lodgeTimer = undefined; } }

let lodgeIO: IntersectionObserver | undefined;
onMounted(() => {
  lodgeStart();
  if (lodgeRef.value) {
    lodgeIO = new IntersectionObserver(([e]) => {
      lodgeVisible = e.isIntersecting;
      lodgeVisible ? lodgeStart() : lodgeStop();
    }, { threshold: 0.1 });
    lodgeIO.observe(lodgeRef.value);
  }
});
onBeforeUnmount(() => { lodgeStop(); lodgeIO?.disconnect(); });

import iconPiscina from '@/assets/icons/piscina.svg';
import iconArbolesLight from '@/assets/icons/arboles-light.svg';
import iconHornitoLight from '@/assets/icons/hornito-light.svg';
import iconWifiDark from '@/assets/icons/wifi-dark.svg';
import iconTVDark from '@/assets/icons/TV-dark.svg';
import iconAire from '@/assets/icons/aire.svg';
</script>

<template>
  <main class="bg-brand-bg text-brand-fg">
    <section id="home">
      <HeroCrossfade
        :images="HERO_IMAGES"
        :interval="6000"
        :fade-ms="1200"
      />
    </section>

    <!-- Separador 1: Bienvenidos -->
    <section class="separator" style="background-color: #6D7436; color: #f0e6d5;">
      <div class="separator-inner">
        <h2 class="separator-title">Bienvenidos</h2>
        <p class="separator-body">Un refugio exclusivo para dos personas en el corazón de Mina Clavero. Contamos con cabañas rodeadas de verde y silencio, a solo unos pasos del centro del pueblo. Elegí entre la vista a la pileta o la serenidad de nuestro patio arbolado.</p>
      </div>
    </section>

    <!-- Separador 2: Entorno y Naturaleza -->
    <section class="separator" style="background-color: #f0e6d5; color: #6D7436;">
      <div class="separator-inner">
        <h2 class="separator-title">Entorno y Naturaleza</h2>
        <p class="separator-body">Entorno verde y silencioso a pasos del centro. Un espacio de calma con piscina y jardín autóctono para el descanso.</p>
      </div>
    </section>

    <section id="about">
      <HorizontalCarousel :slides="NATURE_SLIDES" />
    </section>

    <!-- Separador iconos: piscina · naturaleza · parrilla -->
    <section class="icon-strip icon-strip--tall">
      <div class="icon-strip__item">
        <img :src="iconPiscina" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">Piscina</span>
      </div>
      <div class="icon-strip__item">
        <img :src="iconArbolesLight" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">Naturaleza</span>
      </div>
      <div class="icon-strip__item">
        <img :src="iconHornitoLight" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">Parrilla</span>
      </div>
    </section>

    <!-- Lodge — imagen full-bleed con overlay de texto -->
    <section id="patio" class="lodge-hero" ref="lodgeRef">
      <img
        v-for="(img, i) in LODGE_IMAGES"
        :key="img.src"
        :src="img.src"
        :alt="img.alt"
        class="lodge-hero__img"
        :class="i === lodgeActive ? 'lodge-hero__img--active' : 'lodge-hero__img--hidden'"
        :loading="i === 0 ? 'eager' : 'lazy'"
        decoding="async"
        :aria-hidden="i !== lodgeActive"
      />
      <div class="lodge-hero__overlay" />
      <div class="lodge-hero__content">
        <p class="lodge-hero__eyebrow">Lodge · Departamento</p>
        <h2 class="lodge-hero__title">Espacios para el descanso</h2>
        <p class="lodge-hero__body">Cada cabaña fue diseñada para dos personas, con ambientes cálidos, luz natural y acceso directo al jardín. Un lugar donde el tiempo pasa diferente.</p>
      </div>
    </section>

    <section id="lodge">
      <VerticalCarousel
        title="Nuestras Unidades"
        description="Cabañas equipadas para dos personas. Espacios cálidos e íntimos con vista exclusiva al patio o la piscina."
        :slides="UNIT_SLIDES"
      />
    </section>

    <!-- Separador iconos: aire · wifi · tv -->
    <section class="icon-strip icon-strip--inverted">
      <div class="icon-strip__item">
        <img :src="iconAire" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">A/C</span>
      </div>
      <div class="icon-strip__item">
        <img :src="iconWifiDark" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">Wifi</span>
      </div>
      <div class="icon-strip__item">
        <img :src="iconTVDark" alt="" class="icon-strip__icon" />
        <span class="icon-strip__label">Smart TV</span>
      </div>
    </section>

    <div class="w-full py-5 bg-[#6D7436]" aria-hidden="true" />

    <LocationMap :lat="LODGE_COORDS.lat" :lng="LODGE_COORDS.lng" />

    <section id="contact">
      <SiteFooter :decorative-image="FOOTER_IMAGE" />
    </section>
  </main>
</template>

<style scoped>
.separator {
  padding: clamp(3.5rem, 8vw, 6rem) var(--gutter, clamp(1rem, 4vw, 2rem));
  text-align: center;
}

.separator-inner {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.separator-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  letter-spacing: 0.06em;
  line-height: 1.1;
  margin: 0;
  text-transform: uppercase;
}

.separator-body {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.7;
  margin: 0;
  opacity: 0.88;
}

/* ── Lodge hero overlay ── */
.lodge-hero {
  position: relative;
  height: 72vh;
  min-height: 480px;
  overflow: hidden;
}

.lodge-hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 80%;
  transition: opacity 700ms ease-in-out;
}

.lodge-hero__img--active  { opacity: 1; }
.lodge-hero__img--hidden  { opacity: 0; }

.lodge-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(20, 16, 12, 0.72) 0%,
    rgba(20, 16, 12, 0.18) 55%,
    transparent 100%
  );
}

.lodge-hero__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(2rem, 5vw, 3.5rem) var(--gutter, clamp(1rem, 4vw, 2rem));
  max-width: 680px;
}

.lodge-hero__eyebrow {
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f0e6d5;
  opacity: 0.75;
  margin: 0 0 0.75rem;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}

.lodge-hero__title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 3rem);
  line-height: 1.1;
  color: #f0e6d5;
  margin: 0 0 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.lodge-hero__body {
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 1.3vw, 1.05rem);
  line-height: 1.65;
  color: #f0e6d5;
  opacity: 0.85;
  margin: 0;
  max-width: 52ch;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

/* ── Separador de iconos ── */
.icon-strip {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(5rem, 16vw, 14rem);
  background-color: #6D7436;
  padding: clamp(2.5rem, 6vw, 4rem) var(--gutter, 2rem);
}

.icon-strip__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon-strip__icon {
  height: clamp(56px, 8vw, 90px);
  width: auto;
  object-fit: contain;
}

.icon-strip__label {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 1.2vw, 1rem);
  letter-spacing: 0.08em;
  color: #f0e6d5;
  text-transform: uppercase;
}

.icon-strip--tall {
  padding-top: clamp(4rem, 10vw, 5rem);
  padding-bottom: clamp(4rem, 10vw, 5rem);
}

.icon-strip--inverted {
  background-color: #f0e6d5;
}

.icon-strip--inverted .icon-strip__label {
  color: #6D7436;
}
</style>
