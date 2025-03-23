<script setup>
const { parasha } = useRoute().params
const { settings } = useSettings()

const { parshiyotList, weeklyParshaObject } = await useParsha()
const showRashi = computed(() => settings.value.showRashi)
const { data, pending, error, refresh } = await useFetch(`/api/data/${parasha}`, {
  query: { showRashi }
})

const orderedData = computed(() => {
  const arr = [[]]
  if (!data.value) return
  if (settings.value.order === 'parasha') {
    data.value.forEach((item) => {
      arr.at(-1).push(item)
      if (item.torah.endsWith('(פ)') || item.torah.endsWith('(ס)')) {
        arr.push([])
      }
    })
  }
  if (settings.value.order === 'aliya') {
    data.value.forEach((item) => {
      if (item.aliya) {
        arr.push([item])
      } else {
        arr.at(-1).push(item)
      }
    })
  }
  return arr
})

const aliyot = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי']
const scrollToAliya = (aliya, behavior = 'smooth') => {
  if (aliya === 0) {
    window.document.body.scrollIntoView({ behavior, block: 'start' })
  } else {
    window.document.getElementById(`aliya-${aliya}`)?.scrollIntoView({ behavior, block: 'start' })
  }
}

const parashaHe = computed(() => {
  return parshiyotList.find(({ route }) => route === parasha)?.he
})

const aliyotRefs = useTemplateRef('aliya')

const currentAliya = ref(0)
const fontSizeContainer = useTemplateRef('fontSizeContainer')
onMounted(() => {
  window.document.addEventListener('scroll', (e) => {
    currentAliya.value = [0, 1, 2, 3, 4, 5].find(n => aliyotRefs.value[n]?.getBoundingClientRect().top - 80 <= 0 && (n === 5 || aliyotRefs.value[n + 1]?.getBoundingClientRect().top - 80 > 0)) + 1 || 0
  })
  if (settings.value.aliyaByDay && parasha === weeklyParshaObject.route) {
    scrollToAliya(new Date().getDay(), 'instant')
  }
  window.addEventListener('beforeprint', () => {
    fontSizeContainer.value.style.fontSize = '16px'
  })
  window.addEventListener('afterprint', () => {
    fontSizeContainer.value.style.fontSize = settings.value.fontSize + 'px'
  })
})
</script>

<template>
  <div class="sticky top-0 p-2 bg-gray-100 dark:bg-gray-900 print:hidden">
    <div class="font-medium text-xl mb-1">פרשת <span>{{ parashaHe }}</span> </div>
    <div class="flex gap-2">
      <UButton v-for="(aliya, i) in aliyot" :key="aliya" @click="scrollToAliya(i)" :label="aliya" size="sm"
        variant="outline" color="neutral" :active="i === currentAliya" active-variant="subtle"
        active-class="font-semibold" />
    </div>
  </div>
  <div :style="{ 'font-size': `${settings?.fontSize}px` }" :ref="fontSizeContainer"
    class="text-justify bg-white dark:bg-gray-800 py-3 px-5 shadow rounded print:shadow-none print:rounded-none">
    <div v-if="settings.order === 'pasuk'">
      <div v-for="(item, i) in data" :key="i" class="mb-3">
        <div class="font-sbl">
          <span v-if="item.aliya"
            class="bg-gray-300 dark:bg-gray-600 leading-[1.2] inline-block -mt-1.5 ml-2 scroll-mt-[75px] px-1 rounded text-[1em]"
            :id="`aliya-${aliyot.indexOf(item.aliya)}`" ref="aliya">{{ item.aliya }}</span>
          <span class="ml-2 font-semibold text-[0.9em]" v-if="item.perek">{{ item.perek }}</span>
          <span class="ml-2 font-semibold text-[0.8em]">{{ item.pasuk }}</span>
          <span class="text-[1.2em]">{{ item.torah }}</span>
        </div>
        <div class="text-[1.2em] font-sbl">{{ item.torah }}</div>
        <div class="text-[1.1em] font-sbl text-[#555] dark:text-gray-300 targum" v-html="item.targum"></div>
        <div v-if="item.rashi" class="mt-1 text-[0.7em]" :class="{ 'font-rashi': settings.fontRashi }"
          v-html="settings.rashiNikud ? item.rashi.join('  ') : item.rashi.join('  ').replace(/[\u0591-\u05C7]/g, '')">
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="(item, i) in orderedData" :key="i" class="mb-10">
        <div class="font-sbl">
          <span v-for="({ torah, pasuk, perek, aliya }, j) in item" :key="j" class="me-2">
            <span v-if="aliya"
              class="bg-gray-300  dark:bg-gray-600 leading-[1.2] inline-block -mt-1.5 ml-2 scroll-mt-[75px] px-1 rounded text-[1em]"
              :id="`aliya-${aliyot.indexOf(aliya)}`" ref="aliya">{{ aliya }}</span>
            <span class="ml-2 font-semibold text-[0.9em]" v-if="perek">{{ perek }}</span>
            <span class="ml-2 font-semibold text-[0.8em]">{{ pasuk }}</span>
            <span class="text-[1.2em]">{{ torah }}</span>
          </span>
        </div>
        <div class="font-sbl">
          <span v-for="({ targum, pasuk, perek }, i) in item" :key="i" class="me-2  text-[#555] dark:text-gray-300">
            <span class="ml-2 font-semibold text-[0.8em]" v-if="perek">{{ perek }}</span>
            <span class="ml-2 font-semibold text-[0.7em]">{{ pasuk }}</span>
            <span class="text-[1.1em] targum" v-html="targum"></span>
          </span>
        </div>
        <div v-if="item.some((i) => i.rashi?.length)" :class="{ 'font-rashi': settings.fontRashi }"
          class="leading-none">
          <span v-for="({ rashi, pasuk, perek }, i) in item" :key="i" class="text-[0.7em]">
            <span v-if="rashi?.length" class="me-2">
              <span class="ml-2 font-semibold text-[0.9em]" v-if="perek">{{ perek }}</span>
              <span class="ml-2 font-semibold text-[0.8em]">{{ pasuk }}</span>
              <span
                v-html="settings.rashiNikud ? rashi.join('  ') : rashi.join('  ').replace(/[\u0591-\u05C7]/g, '')"></span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.targum b {
  font-weight: unset;
}
</style>