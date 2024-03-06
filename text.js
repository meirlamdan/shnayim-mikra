import parshiyot from './data/parshiyot.json' assert { type: 'json' };

export default async function getText(parashat, order = 'pasuk', showRashi = false, rashiNikud) {
  let { chumash, start: [perekStart, pasukStart], end: [perekEnd, pasukEnd], aliyot } = structuredClone(parshiyot[parashat]);
  const torahText = (await import(`./data/torah/${chumash}.json`)).text;
  const targumText = (await import(`./data/targum/${chumash}.json`)).text;
  let rashiText = '';
  if (showRashi) {
    rashiText = (await import(`./data/rashi/${chumash}.json`)).text;
  }
  let text = '';
  let parasha = '';
  let parasha2 = '';
  let parashaTrgum = '';
  let parashaRashi = '';
  const aliyotName = ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'מפטיר'];
  let aliyaNumber = 0;
  while (perekEnd > perekStart || (pasukEnd >= pasukStart && perekEnd === perekStart)) {
    const torah = torahText[perekStart][pasukStart];
    const targum = targumText[perekStart][pasukStart];
    let rashi = rashiText?.[perekStart]?.[pasukStart]?.join(' ');
    if(rashi && !rashiNikud) {
      rashi = rashi.replace(/[\u0591-\u05C7]/g, '')
    }
    const [pasuk, perek] = getPasukAndPerekHe(pasukStart, perekStart);
    let aliya;
    const [perekAliya, pasukAliya] = aliyot[0] || [];
    let nextAliyaIsMaftir = aliyotName?.[0] === 'מפטיר';
    let nextPasuk;
    let nextPerek = perekStart;
    if (torahText[perekStart].length - 1 > pasukStart) {
      nextPasuk = pasukStart + 1;
    } else {
      nextPasuk = 0;
      nextPerek++;
    }
    if (perekStart === perekAliya && pasukStart === pasukAliya) {
      aliyot.shift();
      aliya = aliyotName.shift();
      aliyaNumber++;
    }
    if (order === 'pasuk') {
      text += `<div>${aliya ? `<span id="aliya-${aliyaNumber}">${aliya}</span>` : ''} ${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> <span class="torah">${torah}
      ${torah}</span>
      <span class="targum">${targum}</span>${rashi && showRashi ? `
      <span class="rashi">${rashi}</span>` : ''}</div>`;
    } else {
      parasha += `${aliya ? `<span id="aliya-${aliyaNumber}">${aliya}</span>` : ''} ${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${torah} `;
      parasha2 += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${torah} `;
      parashaTrgum += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${targum} `;
      if (rashi?.length) {
        parashaRashi += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${rashi} `;
      }
      if (order === 'parasha' && ((torah.endsWith('(ס)') || torah.endsWith('(פ)') || (pasukStart === pasukEnd && perekStart === perekEnd)))) {
        text += `<div class="parasha">◈ <span class="torah">${parasha}</span>  <span class="torah">${parasha2}</span><br><span class="targum">${parashaTrgum}</span>${parashaRashi && showRashi ? `<br><span class="rashi">${parashaRashi}</span>` : ''}</div>`;
        parasha = '';
        parasha2 = '';
        parashaTrgum = '';
        parashaRashi = '';
      }
      if (order === 'aliya' && ((perekAliya === nextPerek && pasukAliya === nextPasuk && !nextAliyaIsMaftir) || (pasukStart === pasukEnd && perekStart === perekEnd))) {
        text += `<div class="parasha"><span class="torah">${parasha}</span>  <span class="torah">${parasha2}</span> <br><span class="targum">${parashaTrgum}</span>${parashaRashi && showRashi ? `<br><span class="rashi">${parashaRashi}</span>` : ''}</div>`;
        parasha = '';
        parasha2 = '';
        parashaTrgum = '';
        parashaRashi = '';

      }
    }
    pasukStart = nextPasuk;
    perekStart = nextPerek;
  }
  return text;
}

function getPasukAndPerekHe(pasuk, perek) {
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
    "צב", "צג", "צד", "צה", "צו", "צז", "צח", "צט", "ק", "קא",
    "קב", "קג", "קד", "קה", "קו", "קז", "קח", "קט"
  ];
  return [hebrewLetters[pasuk], pasuk === 0 ? hebrewLetters[perek] : '']
}

