<script setup lang="ts">
/**
 * ContactForm — POST a /api/contact (handler con Resend).
 * Validación nativa + mensaje de estado. Sin librerías de form.
 */
import { ref } from 'vue';

const form = ref({ name: '', email: '', message: '' });
const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle');
const errorMsg = ref('');

async function submit(e: Event) {
  e.preventDefault();
  status.value = 'sending';
  errorMsg.value = '';
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Error');
    status.value = 'ok';
    form.value = { name: '', email: '', message: '' };
  } catch (err: any) {
    status.value = 'error';
    errorMsg.value = err?.message ?? 'No se pudo enviar';
  }
}
</script>

<template>
  <form @submit="submit" class="grid gap-4" novalidate>
    <label class="grid gap-1">
      <span class="font-body text-eyebrow uppercase text-brand-muted">Nombre</span>
      <input v-model="form.name" required type="text"
        class="border-b border-brand-line bg-transparent py-2 text-brand-fg outline-none focus:border-brand-accent" />
    </label>

    <label class="grid gap-1">
      <span class="font-body text-eyebrow uppercase text-brand-muted">Email</span>
      <input v-model="form.email" required type="email"
        class="border-b border-brand-line bg-transparent py-2 text-brand-fg outline-none focus:border-brand-accent" />
    </label>

    <label class="grid gap-1">
      <span class="font-body text-eyebrow uppercase text-brand-muted">Mensaje</span>
      <textarea v-model="form.message" required rows="4"
        class="border-b border-brand-line bg-transparent py-2 text-brand-fg outline-none focus:border-brand-accent resize-none" />
    </label>

    <button type="submit" :disabled="status === 'sending'"
      class="mt-2 inline-flex items-center justify-center rounded-pill border border-brand-fg px-6 py-3
             font-body text-sm uppercase tracking-[var(--ls-eyebrow)] text-brand-fg
             transition-colors hover:bg-brand-fg hover:text-brand-bg disabled:opacity-50">
      {{ status === 'sending' ? 'Enviando…' : 'Enviar' }}
    </button>

    <p v-if="status === 'ok'" class="text-sm text-brand-accent">¡Gracias! Te respondemos a la brevedad.</p>
    <p v-if="status === 'error'" class="text-sm text-red-700">{{ errorMsg }}</p>
  </form>
</template>
