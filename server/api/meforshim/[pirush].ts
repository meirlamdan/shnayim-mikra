import parshiyot from '~~/server/parshiyot'

type Parasha = keyof typeof parshiyot

export default defineCachedEventHandler(async (event) => {
  const pirush = getRouterParam(event, 'pirush')
  const parasha = getQuery(event).parasha

  let { chumash, start: [perekStart, pasukStart], end: [perekEnd, pasukEnd] } = parshiyot[parasha as Parasha];

  const file = await useStorage(`assets:server/meforshim/${pirush}`).getItem(`${chumash}.json`) as any
  //this nide because length of the pirush sometimes is finish on teh last pirush on the perek even though there are more pasukim in the perek
  const st = await useStorage(`assets:server/meforshim-index`).getItem(`${chumash}.json`) as any
  function getText(start: number[], end: number[], data: any[]) {

    let [currentPerek, currentPasuk] = start;
    data.push(file.text[currentPerek]?.[currentPasuk] || []);
    if (currentPerek === end[0] && currentPasuk === end[1]) {
      return data;
    }

    const perekLength = st[currentPerek].length;

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