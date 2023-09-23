import { Sedra, HDate } from '@hebcal/core';

const parshiyotArr = [
  'Bereshit',
  'Noach',
  'Lech-Lecha',
  'Vayera',
  'Chayei Sara',
  'Toldot',
  'Vayetzei',
  'Vayishlach',
  'Vayeshev',
  'Miketz',
  'Vayigash',
  'Vayechi',
  'Shemot',
  'Vaera',
  'Bo',
  'Beshalach',
  'Yitro',
  'Mishpatim',
  'Terumah',
  'Tetzaveh',
  'Ki Tisa',
  'Vayakhel',
  'Pekudei',
  'Vayikra',
  'Tzav',
  'Shmini',
  'Tazria',
  'Metzora',
  'Achrei Mot',
  'Kedoshim',
  'Emor',
  'Behar',
  'Bechukotai',
  'Bamidbar',
  'Nasso',
  'Beha\'alotcha',
  'Sh\'lach',
  'Korach',
  'Chukat',
  'Balak',
  'Pinchas',
  'Matot',
  'Masei',
  'Devarim',
  'Vaetchanan',
  'Eikev',
  'Re\'eh',
  'Shoftim',
  'Ki Teitzei',
  'Ki Tavo',
  'Nitzavim',
  'Vayeilech',
  'Ha\'Azinu',
];

const parshiyotHebrew = {
  Bereshit: 'בראשית', Noach: 'נח', 'Lech-Lecha': 'לך לך', Vayera: 'וירא', 'Chayei Sara': 'חיי שרה', Toldot: 'תולדות', Vayetzei: 'ויצא', Vayishlach: 'וישלח', Vayeshev: 'וישב', Miketz: 'מקץ',
  Vayigash: 'ויגש', Vayechi: 'ויחי', Shemot: 'שמות', Vaera: 'וארא', Bo: 'בא', Beshalach: 'בשלח', Yitro: 'יתרו', Mishpatim: 'משפטים', Terumah: 'תרומה', Tetzaveh: 'תצוה',
  'Ki Tisa': 'כי תשא', Vayakhel: 'ויקהל', Pekudei: 'פקודי', Vayikra: 'ויקרא', Tzav: 'צו', Shmini: 'שמיני', Tazria: 'תזריע', Metzora: 'מצורע', 'Achrei Mot': 'אחרי מות', Kedoshim: 'קדושים', Emor: 'אמור',
  Behar: 'בהר', Bechukotai: 'בחוקותי', Bamidbar: 'במדבר', Nasso: 'נשא', 'Beha\'alotcha': 'בהעלותך', 'Sh\'lach': 'שלח', Korach: 'קורח', Chukat: 'חוקת', Balak: 'בלק', Pinchas: 'פנחס', Matot: 'מטות', Masei: 'מסעי',
  Devarim: 'דברים', Vaetchanan: 'ואתחנן', Eikev: 'עקב', "Re'eh": 'ראה', Shoftim: 'שופטים', 'Ki Teitzei': 'כי תצא', 'Ki Tavo': 'כי תבוא', Nitzavim: 'נצבים', Vayeilech: 'וילך', 'Ha\'Azinu': 'האזינו', 'vezot habrcha': 'וזאת הברכה'
};

export const getParshiyotList = () => {
  const parshiyotNumbers = new Sedra(new HDate().getFullYear(), true).theSedraArray.filter((p) => typeof p === 'number').sort((a, b) => Math.abs(a) - Math.abs(b))
  const list = [];
  parshiyotNumbers.forEach(n => {
    if (n >= 0) {
      list.push(parshiyotHebrew[parshiyotArr[n]]);
    } else {
      n = Math.abs(n);
      const parasha = `${parshiyotHebrew[parshiyotArr[n]]}-${parshiyotHebrew[parshiyotArr[n + 1]]}`;
      list.push(parasha);
    }
  });
  list.push('וזאת הברכה')
  return list;
}

export const trnslateParshiyot = (arr) => {
  if (arr[0] === 'Shmini Atzeret') {
    return 'וזאת הברכה'
  }
  return arr.length === 1 ? parshiyotHebrew[arr[0]] : `${parshiyotHebrew[arr[0]]}-${parshiyotHebrew[arr[1]]}`

}


