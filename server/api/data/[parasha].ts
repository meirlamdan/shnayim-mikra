import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import parshiyot from '~~/server/parshiyot'

type Parasha = keyof typeof parshiyot
type Psuk = {
  torah: string,
  targum: string,
  rashi?: string,
  meforshim?: string[],
  perek?: string
  pasuk: string
  aliya?: string | null
}
export default defineCachedEventHandler(async (event) => {
  let parasha = getRouterParam(event, 'parasha')
  const { showRashi } = getQuery(event)
  const withRashi = showRashi === 'true'
  if (!parshiyot[parasha as Parasha]) {
    parasha = 'bereshit'
  }
  let { chumash, start: [perekStart, pasukStart], end: [perekEnd, pasukEnd], aliyot } = parshiyot[parasha as Parasha];
  // async function getParesFile(fileName: string) {
  //   const file = await readFile(join(process.cwd(), `server/assets/${fileName}.json`), 'utf-8')
  //   return JSON.parse(file)
  // }
  // const st = await getParesFile(`meforshim-index/bereishit`)
  // const text = await getParesFile(`meforshim/rashbam/bereishit`)
  // text.text.forEach((p: any, i: number) => {
  //   p.forEach((t: any, j: number) => {
  //     if (t.length) {
  //       st[i][j].push('rashbam')
  //     }
  //   })
  // })

  // await writeFile(join(process.cwd(), `server/assets/meforshim-index/bereishit.json`), JSON.stringify(st, null, 2))
  // return

  const promises = [useStorage('assets:server/torah').getItem(`${chumash}.json`), useStorage('assets:server/targum').getItem(`${chumash}.json`)];
  if (withRashi) {
    promises.push(useStorage('assets:server/rashi').getItem(`${chumash}.json`), useStorage('assets:server/meforshim-index').getItem(`${chumash}.json`));
  }
  const [torahText = {} as { text: any }, targumText = {} as { text: any }, rashiText = {} as { text: any }, meforshimIndex = []] = await Promise.all(promises) as any

  function orderText(currentIndex: number[], end: number[], aliyot: number[][], data: any[]): Psuk[] {
    let [currentPerek, currentPasuk] = currentIndex;
    const obj: Psuk = {
      torah: torahText?.text[currentPerek][currentPasuk] as string,
      targum: targumText?.text[currentPerek][currentPasuk] as string,
      pasuk: toHebrew(currentPasuk),
    };
    if (withRashi) {
      obj.rashi = rashiText?.text[currentPerek][currentPasuk];
      obj.meforshim = meforshimIndex[currentPerek][currentPasuk];
    }
    if (currentPasuk === 0) {
      obj.perek = toHebrew(currentPerek);
    }
    if (aliyot.find(([perek, pasuk]) => perek === currentPerek && pasuk === currentPasuk)) {
      const aliyotName = ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'מפטיר'];
      obj.aliya = aliyotName[aliyot.findIndex(([perek, pasuk]) => perek === currentPerek && pasuk === currentPasuk)];
    }
    data.push(obj);

    if (currentPerek === end[0] && currentPasuk === end[1]) {
      return data;
    }
    const pereklength = torahText?.text[currentPerek].length;
    if (currentPasuk === pereklength - 1) {
      currentPasuk = 0;
      currentPerek++;
    } else {
      currentPasuk++;
    }
    return orderText([currentPerek, currentPasuk], end, aliyot, data);
  }
  return orderText([perekStart, pasukStart], [perekEnd, pasukEnd], aliyot, []);
}, {
  maxAge: 60 * 60 * 24 * 365 // 1 year
})

function toHebrew(number: number) {
  const hebrewLetters = [
    "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא",
    "יב", "יג", "יד", "טו", "טז", "יז", "יח", "יט", "כ", "כא",
    "כב", "כג", "כד", "כה", "כו", "כז", "כח", "כט", "ל", "לא",
    "לב", "לג", "לד", "לה", "לו", "לז", "לח", "לט", "מ", "מא",
    "מב", "מג", "מד", "מה", "מו", "מז", "מח", "מט", "נ", "נא",
    "נב", "נג", "נד", "נה", "נו", "נז", "נח", "נט", "ס", "סא",
    "סב", "סג", "סד", "סה", "סו", "סז", "סח", "סט", "ע", "עא",
    "עב", "עג", "עד", "עה", "עו", "עז", "עח", "עט", "פ", "פא",
    "פב", "פג", "פד", "פה", "פו", "פז", "פח", "פט", "צ", "צא",
    "צב", "צג", "צד", "צה", "צו", "צז", "צח", "צט", "ק",
  ];

  return hebrewLetters[number];
}



