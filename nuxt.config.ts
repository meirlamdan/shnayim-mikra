// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', 'nuxt-gtag'],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-03-10',
  app: {
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'he',
      },
      link: [
        { rel: 'icon', type: "image/svg+xml", href: "logo.svg" },
        { rel: 'manifest', href: '/manifest.json' }
      ],
    },
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-VHF5M16TPC'
  }
})

