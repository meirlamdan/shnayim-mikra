<script setup lang="ts">
import { HDate } from '@hebcal/core';
const { weeklyParshaObject, parshiyotList } = await useParsha()

const value = computed({
  get() {
    return useRoute().params.parasha as string || weeklyParshaObject?.route
  },
  set(value) {
    value
  }
})

const prevParsha = computed(() => {
  const index = parshiyotList.findIndex(({ route }) => route === value.value)
  return parshiyotList[index - 1] || parshiyotList[parshiyotList.length - 1]
})

const nextParsha = computed(() => {
  const index = parshiyotList.findIndex(({ route }) => route === value.value)
  return parshiyotList[index + 1] || parshiyotList[0]
})

const parashaHe = computed(() => {
  return parshiyotList.find(({ route }) => route === value.value)?.he
})

const printParsha = () => {
  window?.print()
}

const location = ref()
onMounted(() => {
  location.value = window.location
})
useHead({
  title: () => `שניים מקרא ואחד תרגום - פרשת ${value.value ? parashaHe.value : 'השבוע'}`,
  link: [
    { rel: 'canonical', href: `https://shnayim-mikra.netlify.app${value.value ? `/${value.value}` : ''}` },
  ]
})

</script>
<template>
  <UApp>
    <div class="bg-[#f1f3f6] dark:bg-gray-900 dark:text-white transition-colors duration-300 font-heebo">
      <div class="max-w-4xl mx-auto">
        <div class="px-2 pt-6 pb-2">
          <h1 class="text-center text-2xl font-semibold print:text-xl">שניים מקרא ואחד תרגום</h1>
          <div class="hidden print:block text-center text-xl print:text-lg font-semibold mb-7">פרשת <span>
              {{ parashaHe }}</span>
          </div>
          <div class="flex items-center justify-between my-10 print:hidden">
            <div>{{ new HDate().renderGematriya(true) }} פרשת {{ weeklyParshaObject?.he }}</div>
            <div class="flex gap-4">
              <UButton icon="ph:printer-light" @click="printParsha" size="sm" variant="subtle" color="neutral" />
              <Slideover />
            </div>
          </div>
          <div class="flex justify-center items-center gap-x-10 print:hidden">
            <UTooltip :text="prevParsha?.he" :content="{ side: 'right' }">
              <ULink :to="prevParsha?.route" class="flex">
                <UIcon name="i-carbon:chevron-right" class="w-6 h-6" />
              </ULink>
            </UTooltip>
            <USelectMenu v-model="value" value-key="route" label-key="he" :items="parshiyotList" :search-input="{
              placeholder: 'פרשה...',
            }" class="w-48" dir="rtl">
              <template #item="{ item }">
                <ULink :to="`/${item.route}`" class="w-full text-start">
                  {{ item.he }}
                </ULink>
              </template>
            </USelectMenu>
            <UTooltip :text="nextParsha?.he" :content="{ side: 'left' }">
              <ULink :to="nextParsha?.route" class="flex">
                <UIcon name="i-carbon:chevron-left" class="w-6 h-6" />
              </ULink>
            </UTooltip>
          </div>
        </div>
        <NuxtPage />
        <div class="hidden print:block text-center mt-5">
          <a :href="location?.href">הודפס מאתר <span class="text-blue-950 underline">{{
            location?.host
          }}</span>
          </a>
        </div>
      </div>
    </div>
  </UApp>
</template>
