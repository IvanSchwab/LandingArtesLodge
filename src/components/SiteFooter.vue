<script setup lang="ts">
import ContactForm from './ContactForm.vue';
import { CONTACT } from '@/config/site';
import logoSrc from '@/assets/icons/AL.svg';

defineProps<{
  decorativeImage: { src: string; alt: string };
}>();
</script>

<template>
  <footer class="bg-brand-fg text-brand-bg">
    <div class="mx-auto grid max-w-content gap-section px-gutter py-section md:grid-cols-2">
      <!-- Col izquierda: contacto -->
      <div>
        <!-- Logo -->
        <img :src="logoSrc" alt="Artes Lodge" class="mb-8 h-24 w-auto" />

        <p class="font-body text-eyebrow uppercase text-brand-bg/70">Contacto</p>
        <h2 class="mt-2 font-display text-h2">Escribinos</h2>
        <p class="mt-3 max-w-prose font-body text-brand-bg/80">
          Consultas, reservas y disponibilidad. Te respondemos a la brevedad.
        </p>

        <!-- Datos de contacto directos -->
        <div class="mt-5 flex flex-col gap-2">
          <a :href="CONTACT.phoneHref"
             class="inline-flex items-center gap-2 font-body text-sm text-brand-bg/80 transition-colors hover:text-brand-bg">
            {{ CONTACT.phone }}
          </a>
          <a :href="CONTACT.emailHref"
             class="inline-flex items-center gap-2 font-body text-sm text-brand-bg/80 transition-colors hover:text-brand-bg">
            {{ CONTACT.email }}
          </a>
        </div>

        <div class="mt-8 [&_input]:text-brand-bg [&_textarea]:text-brand-bg
                       [&_label_span]:text-brand-bg/70 [&_input]:border-brand-bg/30
                       [&_textarea]:border-brand-bg/30
                       [&_button]:border-brand-bg [&_button]:text-brand-bg
                       hover:[&_button]:bg-brand-bg hover:[&_button]:text-brand-fg">
          <ContactForm />
        </div>
      </div>

      <!-- Col derecha: imagen decorativa -->
      <div class="hidden md:block">
        <div class="aspect-[3/4] h-full w-full overflow-hidden rounded-lg">
          <img :src="decorativeImage.src" :alt="decorativeImage.alt"
               class="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>

    <div class="border-t border-brand-bg/10">
      <div class="mx-auto flex max-w-content flex-col gap-2 px-gutter py-6 text-sm text-brand-bg/60 md:flex-row md:items-center md:justify-between">
        <p>© {{ new Date().getFullYear() }} Artes Lodge</p>
        <p>Diseño: <span class="opacity-80">Serena Carrera</span></p>
      </div>
    </div>
  </footer>
</template>
