<script setup>
const { settings } = useSettings()
const { parshiyotList, weeklyParshaObject } = await useParsha()
const navigateToParsha = ref(settings.value.navigateToParsha ?? true)

const moveToParasha = () => {
  settings.value.navigateToParsha = navigateToParsha.value
  navigateTo(weeklyParshaObject.route)
}

useSeoMeta({
  title: 'שניים מקרא ואחד תרגום | כל הפרשות',
  description: 'קריאת שניים מקרא ואחד תרגום אונקלוס אונליין. בחרו פרשה וקראו בצורה נוחה עם תרגום, רש"י ומפרשים נוספים. מותאם לנייד.',
  ogTitle: 'שניים מקרא ואחד תרגום | כל הפרשות',
  ogDescription: 'קריאת שניים מקרא ואחד תרגום אונקלוס אונליין. בחרו פרשה וקראו בצורה נוחה עם תרגום, רש"י ומפרשים נוספים. מותאם לנייד.',
  ogImage: 'https://shnayim-mikra.netlify.app/logo.png',
  ogUrl: 'https://shnayim-mikra.netlify.app/',
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: 'שניים מקרא ואחד תרגום | כל הפרשות',
  twitterDescription: 'קריאת שניים מקרא ואחד תרגום אונקלוס אונליין. בחרו פרשה וקראו בצורה נוחה עם תרגום, רש"י ומפרשים נוספים.',
  twitterImage: 'https://shnayim-mikra.netlify.app/logo.png',
})
</script>

<template>
  <UContainer>
    <div class="h-[70vh]">
      <h1 class="mt-10 text-center text-2xl font-semibold print:text-xl">קריאת שניים מקרא ואחד תרגום. האתר יציג לכם
        בצורה נוחה ובהתאמה אישית את הקריאה של הפסוקים ואת התרגום ורש"י ומפרשים נוספים </h1>
      <UButton class="mt-5" @click="moveToParasha" variant="solid" color="neutral" size="xl" block>לפרשת השבוע</UButton>
      <UCheckbox class="justify-center mt-0.5" label="הצג תמיד את פרשת השבוע" v-model="navigateToParsha" />
      <div class="mt-8 flex gap-3 flex-wrap justify-center">
        <ULink v-for="parsha in parshiyotList" :key="parsha.route" :to="parsha.route"> {{ parsha.he }}
        </ULink>
      </div>
    </div>
  </UContainer>
</template>