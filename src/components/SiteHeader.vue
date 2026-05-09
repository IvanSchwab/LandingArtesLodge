<script setup lang="ts">
import { ref } from 'vue';
import logoUrl from '@/assets/icons/AL.svg';

const mobileOpen = ref(false);

const links = [
  { label: 'Home',    href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Patio',   href: '#patio' },
  { label: 'Lodge',   href: '#lodge' },
  { label: 'Contact', href: '#contact' },
];
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <a href="#home" class="logo-link" aria-label="Artes Lodge — inicio">
        <img :src="logoUrl" alt="AL" class="logo" />
      </a>

      <nav class="nav-desktop" aria-label="Principal">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-link"
        >{{ link.label }}</a>
      </nav>

      <button
        class="hamburger"
        :aria-expanded="mobileOpen"
        aria-label="Abrir menú"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="bar" :class="{ open: mobileOpen }" />
        <span class="bar mid" :class="{ open: mobileOpen }" />
        <span class="bar" :class="{ open: mobileOpen }" />
      </button>
    </div>

    <Transition name="slide">
      <nav v-if="mobileOpen" class="nav-mobile" aria-label="Principal móvil">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-mobile-link"
          @click="mobileOpen = false"
        >{{ link.label }}</a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* ── Contenedor fijo ── */
.site-header {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 1000;
  background-color: rgba(109, 116, 54, 0.47);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Fila principal ── */
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h, 112px);
  padding-inline: 1.25rem clamp(1rem, 4vw, 2rem);
}

/* ── Logo ── */
.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo {
  height: 82px;
  width: auto;
  object-fit: contain;
}

/* ── Nav desktop ── */
.nav-desktop {
  display: none;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: #F4F1EC;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 180ms ease;
}

.nav-link:hover {
  opacity: 1;
}

/* ── Hamburger ── */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  flex-shrink: 0;
}

.bar {
  display: block;
  width: 22px;
  height: 1.5px;
  background-color: #F4F1EC;
  border-radius: 2px;
  transition: opacity 200ms ease, transform 200ms ease;
}

.bar.open:first-child  { transform: translateY(6.5px) rotate(45deg); }
.bar.mid.open          { opacity: 0; }
.bar.open:last-child   { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Nav móvil ── */
.nav-mobile {
  display: flex;
  flex-direction: column;
  padding: 0.75rem var(--gutter, 1rem) 1.25rem;
  background-color: transparent;
  gap: 0;
}

.nav-mobile-link {
  font-family: var(--font-body);
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  color: #F4F1EC;
  text-decoration: none;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(244, 241, 236, 0.12);
  opacity: 0.9;
}

.nav-mobile-link:last-child { border-bottom: none; }
.nav-mobile-link:hover       { opacity: 1; }

/* ── Transición slide ── */
.slide-enter-active,
.slide-leave-active { transition: max-height 240ms ease, opacity 200ms ease; overflow: hidden; }
.slide-enter-from,
.slide-leave-to     { max-height: 0; opacity: 0; }
.slide-enter-to,
.slide-leave-from   { max-height: 320px; opacity: 1; }

/* ── Breakpoint ── */
@media (min-width: 768px) {
  .nav-desktop  { display: flex; }
  .hamburger    { display: none; }
}
</style>
