<script setup>
const { parshiyotList, weeklyParshaObject } = await useParsha()
</script>

<template>
  <div class="max-w-4xl mx-auto h-[70vh]">
    <h1 class="mt-10 text-center text-2xl font-semibold print:text-xl">קריאת שניים מקרא ואחד תרגום. האתר יציג לכם
      בצורה נוחה ובהתאמה אישית את הקריאה של הפסוקים ואת התרגום ורש"י </h1>
    <UButton class="mt-5" :to="weeklyParshaObject.route" variant="solid" color="neutral" block>לפרשת השבוע</UButton>
    <div class="mt-8 flex gap-3 flex-wrap justify-center">
      <ULink v-for="parsha in parshiyotList" :key="parsha.route" :to="parsha.route"> {{ parsha.he }}
      </ULink>
    </div>
  </div>
</template>