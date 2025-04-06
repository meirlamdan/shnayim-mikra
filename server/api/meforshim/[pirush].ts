import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import parshiyot from '~~/server/parshiyot'

type Parasha = keyof typeof parshiyot

export default defineCachedEventHandler(async (event) => {
  const pirush = getRouterParam(event, 'pirush')
  const parasha = getQuery(event).parasha

  let { chumash, start: [perekStart, pasukStart], end: [perekEnd, pasukEnd] } = parshiyot[parasha as Parasha];

  // async function getParesFile(fileName: string) {
  //   const filePath = join(process.cwd(), `server/data/${fileName}.json`)
  //   const fileContent = await readFile(filePath, 'utf8')
  //   return JSON.parse(fileContent)
  // }
  
// temporary
  async function getParesFile(fileName: string) {
    const filePath = `https://shnayim-mikra.netlify.app/data/${fileName}.json`
    const fileContent = await $fetch(filePath)
    return fileContent
  }

  const file = await getParesFile(`meforshim/${pirush}/${chumash}`);

  function getText(start: number[], end: number[], data: any[]) {
    let [currentPerek, currentPasuk] = start;
    data.push(file.text[currentPerek][currentPasuk]);
    if (currentPerek === end[0] && currentPasuk === end[1]) {
      return data;
    }

    const perekLength = file.text[currentPerek].length;

    if (currentPasuk === perekLength - 1) {
      currentPasuk = 0;
      currentPerek++;
    } else {
      currentPasuk++;
    }

    return getText([currentPerek, currentPasuk], end, data);
  }

  const data = getText([perekStart, pasukStart], [perekEnd, pasukEnd], []);
  return data
}, {
  maxAge: 60 * 60 * 24 * 365 // 1 year
})