export default defineNuxtRouteMiddleware(async (to, from) => {
  const { weeklyParshaObject } = await useParsha()
  if (to.path === '/') {
    return navigateTo(`/${weeklyParshaObject?.route}`)
  }
})