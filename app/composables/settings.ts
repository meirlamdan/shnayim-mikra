type Settings = {
  order: 'pasuk' | 'parasha' | 'aliya'
  showRashi: boolean
  location: 'israel' | 'chul'
  fontSize: number
  aliyaByDay: boolean
  fontRashi: boolean,
  disableMeforshim: boolean
  navigateToParsha: boolean | null
}

const defaultSettings = {
  order: 'pasuk',
  showRashi: false,
  location: 'israel',
  fontSize: 20,
  aliyaByDay: false,
  fontRashi: true,
  disableMeforshim: false,
  navigateToParsha: null,
} as Settings
export const useSettings = () => {
  const settings = useCookie<Settings>('settings', { default: () => defaultSettings, maxAge: 315360000 })
  return { settings }
}



