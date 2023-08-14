import parshiyot from './data/parshiyot.json' assert { type: 'json' };


const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<path d="M13.225 18.412a1.595 1.595 0 0 1 -1.225 .588c-.468 0 -.914 -.214 -1.225 -.588l-4.361 -5.248a1.844 1.844 0 0 1 0 -2.328l4.361 -5.248a1.595 1.595 0 0 1 1.225 -.588c.468 0 .914 .214 1.225 .588l4.361 5.248a1.844 1.844 0 0 1 0 2.328l-4.361 5.248z"></path>
</svg>`

export default async function getText(parashat, order = 'pasuk', showRashi = false) {
  let { chumash, start: [perekStart, pasukStart], end: [perekEnd, pasukEnd], aliyot } = parshiyot[parashat];
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
  while (perekEnd > perekStart || (pasukEnd >= pasukStart && perekEnd === perekStart)) {
    const torah = torahText[perekStart][pasukStart];
    const targum = targumText[perekStart][pasukStart];
    const rashi = rashiText?.[perekStart]?.[pasukStart];
    const [pasuk, perek] = getPasukAndPerekHe(pasukStart, perekStart);
    let aliya;
    const [perekAliya, pasukAliya] = aliyot[0] || [];
    if (perekStart === perekAliya && pasukStart === pasukAliya) {
      aliyot.shift();
      aliya = aliyotName.shift();
    }
    if (order === 'pasuk') {
      text += `<div>${aliya ? `<span class="aliya">${aliya}</span>` : ''} ${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> <span class="torah">${torah}
      ${torah}</span>
      <span class="targum">${targum}</span>${rashi && showRashi ? `
      <span class="rashi">${rashi}</span>` : ''}</div>`;
    } else {
      parasha += `${aliya ? `<span class="aliya">${aliya}</span>` : ''} ${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${torah} `;
      parasha2 += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${torah} `;
      parashaTrgum += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${targum} `;
      if (rashi?.length) {
        parashaRashi += `${perek ? `<span class="perek">${perek}</span>` : ''} <span class="pasuk">${pasuk}</span> ${rashi} `;
      }
      if (torah.endsWith('(ס)') || torah.endsWith('(פ)') || (pasukStart === pasukEnd && perekStart === perekEnd)) {
        text += `<div class="parasha">◈ <span class="torah">${parasha}</span>  <span class="torah">${parasha2}</span> <span class="targum">${parashaTrgum}</span>${parashaRashi && showRashi ? `<span class="rashi">${parashaRashi}</span>` : ''}</div>`;
        parasha = '';
        parasha2 = '';
        parashaTrgum = '';
        parashaRashi = '';
      }
    }
    if (torahText[perekStart].length - 1 > pasukStart) {
      pasukStart++;
    } else {
      pasukStart = 0;
      perekStart++;
    }
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

