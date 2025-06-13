export default defineNuxtRouteMiddleware(async (to) => {
  const { settings } = useSettings()
  const { weeklyParshaObject } = await useParsha()
  if (to.path === '/' && (settings.value.navigateToParsha === true || settings.value.navigateToParsha === undefined)) {
    return navigateTo(`/${weeklyParshaObject?.route || 'bereshit'}`)
  }
})