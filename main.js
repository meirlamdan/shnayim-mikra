import { Sedra, HDate } from '@hebcal/core';
import Alpine from 'alpinejs'

import getText from './text';
import { getParshiyotList, trnslateParshiyot } from './parshiyot';
import './style.css';


window.Alpine = Alpine

Alpine.data('app', () => ({
  async init() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'))
    }
    this.parshiyotList = getParshiyotList()
    // this.$watch('selectParasha', () => {
    //   window.document.title = `${this.selectParasha} | שניים מקרא ואחד תרגום`;
    // })
    this.selectParasha = trnslateParshiyot(new Sedra(new HDate().getFullYear(), this.settings.location === 'israel').get(new HDate())) || trnslateParshiyot(new Sedra(new HDate().getFullYear(), this.settings.location === 'israel').get(new HDate().add(1, 'w')))
    this.parashatHashavua = this.selectParasha
    await this.getText()
    window.addEventListener('scroll', (e) => {
      this.currentAliya = [1, 2, 3, 4, 5, 6].find(n => window.document.getElementById(`aliya-${n}`).getBoundingClientRect().top - 80 <= 0 && (n === 6 || window.document.getElementById(`aliya-${n + 1}`).getBoundingClientRect().top - 80 > 0)) || 0
    })
  },
  parshiyotList: null,
  parashatHashavua: null,
  text: null,
  selectParasha: null,
  slideOverOpen: false,
  currentAliya: 0,
  settings: {
    order: 'pasuk',
    showRasi: false,
    preLine: true,
    location: navigator.language.startsWith('he') ? 'israel' : 'chul',
    fontSize: 20,
    aliyaByDay: false
  },
  heDateAndParasha() { return `${new HDate().renderGematriya(true)} פרשת ${this.parashatHashavua}` },
  async getText() {
    this.text = await getText(this.selectParasha || this.parashatHashavua(), this.settings.order, this.settings.showRasi)
    if (new Date().getDay() && this.settings.aliyaByDay && this.parashatHashavua === this.selectParasha) {
      setTimeout(() => {
        this.scrollToAliya(new Date().getDay(), 'instant')
      }, 1000);
    }
  },
  toggleSettings() {
    this.slideOverOpen = !this.slideOverOpen;
  },
  async onSettingsChangeHandler() {
    localStorage.setItem('settings', JSON.stringify(this.settings))
    await this.getText()
  },
  async moveParasha(isBackward = false) {
    let index = this.parshiyotList.findIndex(key => key === this.selectParasha)
    if (isBackward) {
      index--
    } else {
      index++
    }
    this.selectParasha = this.parshiyotList[index]
    await this.getText()
  },
  scrollToAliya(aliya, behavior = 'smooth') {
    if (aliya === 0) {
      window.document.body.scrollIntoView({ behavior, block: 'start' })
    } else {
      window.document.getElementById(`aliya-${aliya}`)?.scrollIntoView({ behavior, block: 'start' })
    }
  }
}))

Alpine.start()

