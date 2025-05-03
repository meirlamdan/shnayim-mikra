<script setup>

const { settings } = useSettings()

const orderOptions = [{
  label: 'פסוק',
  value: 'pasuk'
}, {
  label: 'פרשה (פ/ס)',
  value: 'parasha'
}, {
  label: 'עלייה',
  value: 'aliya'
}]
const locationOptions = [{
  label: 'א"י',
  value: 'israel'
}, {
  label: 'חו"ל',
  value: 'chul'
}]

const colorMode = useColorMode()

const isDarkMode = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

// const isDarkMode = ref(false)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}
</script>

<template>
  <USlideover title="הגדרות" :ui="{
    footer: 'bg-gray-100 dark:bg-gray-800'
  }">
    <UButton icon="i-carbon:settings-adjust" size="sm" variant="subtle" color="neutral" />
    <template #body>
      <div class="mt-5">
        <UButton :icon="isDarkMode ? 'i-carbon:sun' : 'i-carbon:moon'" variant="subtle" color="neutral"
          @click="toggleDarkMode" />
      </div>


      <URadioGroup class="mt-6" dir="rtl" legend="חלוקה לפי:" v-model="settings.order" :items="orderOptions"
        orientation="horizontal" />


      <URadioGroup class="mt-5" dir="rtl" legend="פרשת השבוע:" v-model="settings.location" :items="locationOptions"
        orientation="horizontal" />
      <UCheckbox v-if="settings.navigateToParsha || settings.navigateToParsha === false"
        v-model="settings.navigateToParsha" class="mt-6" label="הצג את פרשת השבוע" />
      <UCheckbox class="mt-6" label=" גלול אוטומטית לעלייה של היום הנוכחי (לדוגמה ביום שני - לעלייה של שני)"
        v-model="settings.aliyaByDay" />
      <UCheckbox class="mt-6" label=' הצג רש"י (והצעות לפירושים נוספים)' v-model="settings.showRashi" />

      <div v-if="settings.showRashi" class="flex gap-3 mt-3">
        <UCheckbox size="sm" label='כתב רש"י' v-model="settings.fontRashi" />
        <UCheckbox size="sm" label='הסתר הצעות לפירושים נוספים' v-model="settings.disableMeforshim" />
      </div>
      <div class="mt-6">
        <div> <label for="fontSize">גודל טקסט</label>
        </div>
        <input type="range" id="fontSize" name="cowbell" min="14" max="28" v-model="settings.fontSize" step="2" />
      </div>
    </template>
    <template #footer>
      <div class="w-full">
        <div class="text-center text-sm">
          צור קשר: <a href="mailto:meir3252@gmail.com">meir3252@gmail.com</a>
        </div>
        <div class="flex items-center justify-center gap-2 mt-2">
          <a href="https://github.com/meirlamdan/shnayim-mikra">
            <UIcon name="simple-icons:github" class="hover:text-gray-500" size="22" />
          </a>
          <a href="https://www.buymeacoffee.com/meirl" title="Buy Me a Coffee">
            <UIcon name="simple-icons:buymeacoffee" class="hover:text-amber-600" size="22" />
          </a>
        </div>
      </div>

    </template>
  </USlideover>
</template>