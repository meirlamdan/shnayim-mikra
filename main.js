import { Sedra, HDate } from '@hebcal/core';
import Alpine from 'alpinejs'

import getText from './text';
import { getParshiyotList, trnslateParshiyot } from './parshiyot';
import './style.css';


window.Alpine = Alpine

Alpine.data('app', () => ({
  init() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'))
    }
    this.parshiyotList = getParshiyotList()
    this.selectParasha = trnslateParshiyot(new Sedra(new HDate().getFullYear(), this.settings.location === 'israel').get(new HDate()))
    this.parashatHashavua = this.selectParasha
    this.getText()
  },
  parshiyotList: null,
  parashatHashavua: null,
  text: null,
  selectParasha: null,
  slideOverOpen: false,
  settings: {
    order: 'pasuk',
    showRasi: false,
    preLine: false,
    location: navigator.language.startsWith('he') ? 'israel' : 'chul',
    fontSize: 18
  },
  heDateAndParasha() { return `${new HDate().renderGematriya(true)} פרשת ${this.parashatHashavua}` },
  getText() {
    this.text = getText(this.selectParasha || this.parashatHashavua(), this.settings.order, this.settings.showRasi)
  },
  toggleSettings() {
    this.slideOverOpen = !this.slideOverOpen;
  },
  onSettingsChangeHandler() {
    localStorage.setItem('settings', JSON.stringify(this.settings))
    this.getText()
  },
  moveParasha(isBackward = false) {
    let index = this.parshiyotList.findIndex(key => key === this.selectParasha)
    if (isBackward) {
      index--
    } else {
      index++
    }
    this.selectParasha = this.parshiyotList[index]
    this.getText()
  }
}))

Alpine.start()

