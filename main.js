import { Sedra, HDate } from '@hebcal/core';
import Alpine from 'alpinejs'

import getText from './text';
import './style.css';



window.Alpine = Alpine


const parshiyot = {
  Bereshit: 'בראשית', Noach: 'נח', 'Lech-Lech': 'לך לך', Vayera: 'וירא', 'Chayei Sara': 'חיי שרה', Toldot: 'תולדות', Vayetzei: 'ויצא', Vayishlach: 'וישלח', Vayeshev: 'וישב', Miketz: 'מקץ',
  Vayigash: 'ויגש', Vayechi: 'ויחי', Shemot: 'שמות', Vaera: 'וארא', Bo: 'בא', Beshalach: 'בשלח', Yitro: 'יתרו', Mishpatim: 'משפטים', Terumah: 'תרומה', Tetzaveh: 'תצוה',
  'Ki Tisa': 'כי תשא', Vayakhel: 'ויקהל', Pekudei: 'פקודי', Vayikra: 'ויקרא', Tzav: 'צו', Shmini: 'שמיני', Tazria: 'תזריע', Metzora: 'מצורע', 'Achrei Mot': 'אחרי מות', Kedoshim: 'קדושים', Emor: 'אמור',
  Behar: 'בהר', Bechukotai: 'בחוקותי', Bamidbar: 'במדבר', Nasso: 'נשא', 'Beha\'alotcha': 'בהעלותך', 'Sh\'lach': 'שלח', Korach: 'קורח', Chukat: 'חוקת',
  Devarim: 'דברים', Vaetchanan: 'ואתחנן', Eikev: 'עקב', "Re'eh": 'ראה', Shoftim: 'שופטים', 'Ki Teitzei': 'כי תצא', 'Ki Tavo': 'כי תבוא', Nitzavim: 'נצבים', Vayeilech: 'וילך', 'Ha\'Azinu': 'האזינו', 'vezot habrcha': 'וזאת הברכה'
};

Alpine.data('app', () => ({
  init() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'))
    }
    this.sedra = new Sedra(new HDate().getFullYear(), this.settings.location === 'israel').get(new HDate())
    this.selectParasha = this.parashatHasavua()
    this.getText()
  },
  sedra: null,
  text: null,
  parshiyot,
  selectParasha: 'Vaetchanan',
  slideOverOpen: false,
  settings: {
    order: 'pasuk',
    showRasi: false,
    preLine: false,
    location: navigator.language.startsWith('he') ? 'israel' : 'chul',
    fontSize: 18
  },
  heDateAndParasha() { return `${new HDate().renderGematriya(true)} פרשת ${this.parshiyot[this.parashatHasavua()]}` },
  getHDate() { return new HDate().renderGematriya(true) },
  getText() {
    this.text = getText(this.selectParasha || this.parashatHasavua(), this.settings.order, this.settings.showRasi)
  },
  parashatHasavua() {
    return this.sedra.length === 1 ? this.sedra[0] : `${this.sedra[0]}-${this.sedra[1]}`;
  },
  toggleSettings() {
    this.slideOverOpen = !this.slideOverOpen;
  },
  onSettingsChangeHandler() {
    localStorage.setItem('settings', JSON.stringify(this.settings))
    this.getText()
  }
}))

Alpine.start()

