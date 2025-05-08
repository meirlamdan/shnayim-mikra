<script setup>
const { parasha } = useRoute().params
const { settings } = useSettings()

const { parshiyotList, weeklyParshaObject } = await useParsha()
const showRashi = computed(() => settings.value.showRashi)
const { data, pending, error, refresh } = await useFetch(`/api/data/${parasha}`, {
  query: { showRashi }
})

const showMeforshim = ref({})
const getPirush = async (pirush, index) => {
  if (showMeforshim.value[index]?.[pirush] === 'open') {
    showMeforshim.value[index][pirush] = 'close'
    return
  }

  if (data.value[index][pirush]) {
    showMeforshim.value[index] ||= {}
    showMeforshim.value[index][pirush] = 'open'
    return
  }
  showMeforshim.value[index] ||= {}
  showMeforshim.value[index][pirush] = 'loading'
  const meforesh = await $fetch(`/api/meforshim/${pirush}`, {
    query: { parasha }
  })
  meforesh.forEach((m, index) => {
    data.value[index][pirush] = m
  })
  showMeforshim.value[index][pirush] = 'open'
}

const meforshim = {
  'ramban': 'רמב"ן',
  'iben-ezra': 'אבן-עזרא',
  'rashbam': 'רשב"ם',
  'daat-zekenim': 'דעת זקנים',
  'chizkuni': 'חזקוני',
  'sforno': 'ספורנו',
  'or-hachaim': 'אור החיים'
}

const meforshimOrdered = (mf, isMultiple) => {
  if (isMultiple) {
    const arr = []
    mf.forEach(m => {
      arr.push(...m.meforshim)
    })
    mf = [...new Set(arr)]
  }
  const allMeforshim = Object.keys(meforshim)
  return allMeforshim.filter(m => mf.includes(m))
}

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
  arr.forEach((item, i) => {
    item.key = i
  })
  return arr
})

const aliyot = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי']
const scrollToAliya = (aliya, behavior = 'smooth') => {
  if (aliya === 0) {
    window.document.body.scrollIntoView({ behavior, block: 'start' })
  } else {
    aliyotRefs.value[aliya - 1].scrollIntoView({ behavior, block: 'start' })
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
  if (settings.value.aliyaByDay && parasha === weeklyParshaObject?.route) {
    setTimeout(() => {
      scrollToAliya(new Date().getDay(), 'instant')
    }, 100)
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
    <div class="flex items-center justify-between">
      <div class="font-medium text-lg sm:text-xl mb-1">פרשת <span>{{ parashaHe }}</span> </div>
      <UButton @click="printParsha" variant="link" :to="{ name: 'parasha', params: { parasha: weeklyParshaObject?.route } }" v-if="parasha !== weeklyParshaObject?.route">
        <span>לפרשת השבוע</span>
        <UIcon name="ph:arrow-left" />
      </UButton>
    </div>

    <div class="flex gap-1 md:gap-2">
      <UButton v-for="(aliya, i) in aliyot" :key="aliya" @click="scrollToAliya(i)" :label="aliya" size="sm"
        class="px-1.5 md:px-2.5" variant="outline" color="neutral" :active="i === currentAliya" active-variant="subtle"
        active-class="font-semibold" />
    </div>
  </div>
  <div :style="{ 'font-size': `${settings?.fontSize}px` }" :ref="fontSizeContainer"
    class="text-justify bg-white dark:bg-gray-800 py-3 px-5 shadow rounded print:shadow-none print:rounded-none">
    <div v-if="settings.order === 'pasuk'">
      <div v-for="item in data" :key="item.pasuk" class="mb-6">
        <div class="font-sbl">
          <span v-if="item.aliya"
            class="bg-gray-300 dark:bg-gray-600 leading-[1.2] inline-block -mt-1.5 ml-2 scroll-mt-[75px] px-1 rounded text-[1em]"
            :id="`aliya-${aliyot.indexOf(item.aliya)}`" ref="aliya">{{ item.aliya }}</span>
          <span class="ml-2 font-semibold text-[0.9em]" v-if="item.perek">{{ item.perek }}</span>
          <span class="ml-2 font-semibold text-[0.8em]">{{ item.pasuk }}</span>
          <span class="text-[1.2em]">{{ item.torah }}</span>
        </div>
        <div class="text-[1.2em] font-sbl">{{ item.torah }}</div>
        <div class="text-[1.1em] font-sbl text-gray-500 dark:text-gray-300 targum" v-html="item.targum"></div>
        <div v-if="item.rashi" class="mt-1 text-[0.7em]" :class="{ 'font-rashi': settings.fontRashi }"
          v-html="item.rashi.join('  ')">
        </div>
        <div v-if="item.meforshim?.length && !settings.disableMeforshim" class="mt-1">
          <div class="flex gap-2 flex-wrap print:hidden">
            <UBadge class="cursor-pointer text-[0.5em] py-[0.1em] px-[0.5em]" color="neutral"
              :variant="showMeforshim[i]?.[pirush] === 'open' ? 'outline' : 'soft'"
              :icon="showMeforshim[i]?.[pirush] === 'loading' ? 'svg-spinners:6-dots-rotate' : ''"
              @click="getPirush(pirush, i)" v-for="pirush in meforshimOrdered(item.meforshim)" :key="pirush">{{
                meforshim[pirush]
              }}</UBadge>
          </div>
          <div>
            <template v-for="pirush in meforshimOrdered(item.meforshim)" :key="pirush">
              <div v-if="showMeforshim[i]?.[pirush] === 'open'" class="text-[0.6em] mt-1">
                <div class="underline">{{ meforshim[pirush] }}</div>
                <span v-html="item[pirush].join('  ')"></span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="item in orderedData" :key="item.key" class="mb-10">
        <div class="font-sbl">
          <span v-for="({ torah, pasuk, perek, aliya }, j) in item" :key="j" class="me-2">
            <span v-if="aliya"
              class="bg-gray-300  dark:bg-gray-600 leading-[1.2] inline-block -mt-1.5 ml-2 scroll-mt-[75px] px-1 rounded text-[1em]"
              :id="`aliya-${aliyot.indexOf(aliya)}`" ref="aliya">{{ aliya }}</span>
            <span class="ml-2 font-semibold text-[0.9em]" v-if="perek">{{ perek }}</span>
            <span class="ml-2 font-semibold text-[0.8em]">{{ pasuk }}</span>
            <span class="text-[1.2em]">{{ torah }}</span>
          </span>
          <span v-for="({ torah, pasuk, perek }) in item" :key="pasuk" class="me-2">
            <span class="ml-2 font-semibold text-[0.9em]" v-if="perek">{{ perek }}</span>
            <span class="ml-2 font-semibold text-[0.8em]">{{ pasuk }}</span>
            <span class="text-[1.2em]">{{ torah }}</span>
          </span>
        </div>
        <div class="font-sbl">
        </div>
        <div class="font-sbl">
          <span v-for="({ targum, pasuk, perek }) in item" :key="pasuk" class="me-2  text-gray-500 dark:text-gray-300">
            <span class="ml-2 font-semibold text-[0.8em]" v-if="perek">{{ perek }}</span>
            <span class="ml-2 font-semibold text-[0.7em]">{{ pasuk }}</span>
            <span class="text-[1.1em] targum" v-html="targum"></span>
          </span>
        </div>
        <div v-if="item.some((i) => i.rashi?.length)" :class="{ 'font-rashi': settings.fontRashi }"
          class="leading-none">
          <span v-for="({ rashi, pasuk, perek }) in item" :key="pasuk" class="text-[0.7em]">
            <span v-if="rashi?.length" class="me-2">
              <span class="ml-2 font-semibold text-[0.9em]" v-if="perek">{{ perek }}</span>
              <span class="ml-2 font-semibold text-[0.8em]">{{ pasuk }}</span>
              <span v-html="rashi.join('  ')"></span>
            </span>
          </span>
        </div>
        <div v-if="item.some((i) => i.meforshim?.length) && !settings.disableMeforshim" class="mt-1">
          <div class="flex gap-2 flex-wrap">
            <UBadge class="cursor-pointer text-[0.5em] py-[0.1em] px-[0.5em]" color="neutral"
              :variant="showMeforshim[i]?.[pirush] === 'open' ? 'outline' : 'soft'"
              :icon="showMeforshim[i]?.[pirush] === 'loading' ? 'svg-spinners:6-dots-rotate' : ''"
              @click="getPirush(pirush, i)" v-for="pirush in meforshimOrdered(item, true)" :key="pirush">{{
                meforshim[pirush]
              }}</UBadge>
          </div>
          <div>
            <template v-for="pirush in meforshimOrdered(item, true)" :key="pirush">
              <div v-if="showMeforshim[i]?.[pirush] === 'open'" class="text-[0.6em] mt-1">
                <div class="underline">{{ meforshim[pirush] }}</div>
                <template v-for="(pasuk, j) in item" :key="j">
                  <span v-if="pasuk[pirush]?.length" class="me-2">
                    <span class="me-1 text-[0.8em] font-semibold" v-if="pasuk.perek">{{ pasuk.perek }}</span>
                    <span class="me-1 text-[0.8em] font-semibold">{{ pasuk.pasuk }}</span>
                    <span v-html="pasuk[pirush].join('  ')"></span>
                  </span>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <UButton v-if="currentAliya !== 0" @click="scrollToAliya(0)" icon="ph:arrow-up" size="lg"
      class="sticky bottom-2 left-4 rounded-full font-bold bg-black/60 dark:bg-white/70" />
  </div>
</template>

<style>
.targum b {
  font-weight: unset;
}
</style>