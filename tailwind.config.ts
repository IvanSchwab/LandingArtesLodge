import type { Config } from 'tailwindcss';

/**
 * Tailwind se usa como capa utilitaria sobre los tokens en
 * src/styles/tokens.css. No definimos colores hardcodeados aquí:
 * mapeamos a las CSS vars para que cualquier ajuste de paleta
 * que haga la diseñadora se aplique sin tocar componentes.
 */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      'var(--c-bg)',
          'bg-alt':'var(--c-bg-alt)',
          fg:      'var(--c-fg)',
          muted:   'var(--c-fg-muted)',
          accent:  'var(--c-accent)',
          'accent-soft': 'var(--c-accent-soft)',
          line:    'var(--c-line)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        body:    'var(--font-body)',
      },
      fontSize: {
        display:  ['var(--fs-display)', { lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--ls-display)' }],
        h2:       ['var(--fs-h2)',      { lineHeight: 'var(--lh-snug)' }],
        h3:       ['var(--fs-h3)',      { lineHeight: 'var(--lh-snug)' }],
        eyebrow:  ['var(--fs-eyebrow)', { lineHeight: '1', letterSpacing: 'var(--ls-eyebrow)' }],
      },
      spacing: {
        section: 'var(--space-section)',
        gutter:  'var(--gutter)',
      },
      borderRadius: {
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card:    'var(--shadow-card)',
        overlay: 'var(--shadow-overlay)',
      },
      maxWidth: {
        content: 'var(--maxw-content)',
        prose:   'var(--maxw-prose)',
      },
      transitionDuration: {
        slow: '1200ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
