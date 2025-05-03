export default defineNuxtRouteMiddleware(async (to, from) => {
  const { settings } = useSettings()
  const { weeklyParshaObject } = await useParsha()
  if (to.path === '/' && (settings.value.navigateToParsha === true || settings.value.navigateToParsha === undefined)) {
    return navigateTo(`/${weeklyParshaObject?.route || 'bereshit'}`)
  }
})