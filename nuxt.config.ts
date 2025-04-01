// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', 'nuxt-gtag', '@nuxtjs/sitemap'],
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
        { rel: 'manifest', href: '/manifest.json' },
      ],
      meta: [
        { name: 'description', content: "קריאת שניים מקרא ואחד תרגום אונליין. האתר יציג לכם בצורה נוחה ובהתאמה אישית את הקריאה של הפסוקים ואת התרגום, תצוגה רספונסיבית, מותאמת לשימוש בנייד." },
      ]
    },
  },
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-VHF5M16TPC'
  },
  site: {
    url: 'https://shnayim-mikra.netlify.app',
  },
  sitemap: {
    urls: () => {
      const parshiyot = ["bereshit", "noach", "lech-lecha", "vayera", "chayei-sara", "toldot", "vayetzei", "vayishlach", "vayeshev", "miketz", "vayigash", "vayechi", "shemot", "vaera", "bo", "beshalach", "yitro", "mishpatim", "terumah",
        "tetzaveh", "ki-tisa", "vayakhel", "pekudei", "vayakhel-pekudei", "vayikra", "tzav", "shmini", "tazria", "metzora", "tazria-metzora", "achrei-mot", "kedoshim", "emor", "achrei-mot-kedoshim", "behar", "bechukotai", "behar-bechukotai", "bamidbar", "nasso", "behaalotcha",
        "shlach", "korach", "chukat", "balak", "chukat-balak", "pinchas", "matot", "masei", "matot-masei", "devarim", "vaetchanan", "eikev", "reeh", "shoftim", "ki-teitzei", "ki-tavo", "nitzavim", "vayeilech", "nitzavim-vayeilech", "haazinu", "vzot-haberachah"
      ]
      return parshiyot.map(parasha => ({
        loc: `https://shnayim-mikra.netlify.app/${parasha}`,
        lastmod: new Date().toISOString(),
      }))
    },
  }
})