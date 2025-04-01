import { Sedra, HDate, parshaYear } from '@hebcal/core';
export const useParsha = async () => {
  const { settings } = useSettings()
  const parshiyotOfYear = parshaYear(new HDate().getFullYear(), settings.value.location === 'israel').map((p: any) => p.parsha.join(' '))
  const parshiyotList = [
    { he: 'בראשית', hebcal: "Bereshit", route: "bereshit" },
    { he: "נח", hebcal: "Noach", route: "noach" },
    { he: "לך לך", hebcal: "Lech-Lecha", route: "lech-lecha" },
    { he: "וירא", hebcal: "Vayera", route: "vayera" },
    { he: "חיי שרה", hebcal: "Chayei Sara", route: "chayei-sara" },
    { he: "תולדות", hebcal: "Toldot", route: "toldot" },
    { he: "ויצא", hebcal: "Vayetzei", route: "vayetzei" },
    { he: "וישלח", hebcal: "Vayishlach", route: "vayishlach" },
    { he: "וישב", hebcal: "Vayeshev", route: "vayeshev" },
    { he: "מקץ", hebcal: "Miketz", route: "miketz" },
    { he: "ויגש", hebcal: "Vayigash", route: "vayigash" },
    { he: "ויחי", hebcal: "Vayechi", route: "vayechi" },
    { he: "שמות", hebcal: "Shemot", route: "shemot" },
    { he: "וארא", hebcal: "Vaera", route: "vaera" },
    { he: "בא", hebcal: "Bo", route: "bo" },
    { he: "בשלח", hebcal: "Beshalach", route: "beshalach" },
    { he: "יתרו", hebcal: "Yitro", route: "yitro" },
    { he: "משפטים", hebcal: "Mishpatim", route: "mishpatim" },
    { he: "תרומה", hebcal: "Terumah", route: "terumah" },
    { he: "תצוה", hebcal: "Tetzaveh", route: "tetzaveh" },
    { he: "כי תשא", hebcal: "Ki Tisa", route: "ki-tisa" },
    { he: "ויקהל", hebcal: "Vayakhel", route: "vayakhel" },
    { he: "פקודי", hebcal: "Pekudei", route: "pekudei" },
    { he: "ויקהל-פקודי", hebcal: "Vayakhel Pekudei", route: "vayakhel-pekudei" },
    { he: "ויקרא", hebcal: "Vayikra", route: "vayikra" },
    { he: "צו", hebcal: "Tzav", route: "tzav" },
    { he: "שמיני", hebcal: "Shmini", route: "shmini" },
    { he: "תזריע", hebcal: "Tazria", route: "tazria" },
    { he: "מצורע", hebcal: "Metzora", route: "metzora" },
    { he: "תזריע-מצורע", hebcal: "Tazria Metzora", route: "tazria-metzora" },
    { he: "אחרי מות", hebcal: "Achrei Mot", route: "achrei-mot" },
    { he: "קדושים", hebcal: "Kedoshim", route: "kedoshim" },
    { he: "אמור", hebcal: "Emor", route: "emor" },
    { he: "אחרי מות-קדושים", hebcal: "Achrei Mot Kedoshim", route: "achrei-mot-kedoshim" },
    { he: "בהר", hebcal: "Behar", route: "behar" },
    { he: "בחוקותי", hebcal: "Bechukotai", route: "bechukotai" },
    { he: "בהר-בחוקותי", hebcal: "Behar Bechukotai", route: "behar-bechukotai" },
    { he: "במדבר", hebcal: "Bamidbar", route: "bamidbar" },
    { he: "נשא", hebcal: "Nasso", route: "nasso" },
    { he: "בהעלותך", hebcal: "Beha'alotcha", route: "behaalotcha" },
    { he: "שלח", hebcal: "Sh'lach", route: "shlach" },
    { he: "קורח", hebcal: "Korach", route: "korach" },
    { he: "חקת", hebcal: "Chukat", route: "chukat" },
    { he: "בלק", hebcal: "Balak", route: "balak" },
    { he: "חקת-בלק", hebcal: "Chukat Balak", route: "chukat-balak" },
    { he: "פנחס", hebcal: "Pinchas", route: "pinchas" },
    { he: "מטות", hebcal: "Matot", route: "matot" },
    { he: "מסעי", hebcal: "Masei", route: "masei" },
    { he: "מטות-מסעי", hebcal: "Matot Masei", route: "matot-masei" },
    { he: "דברים", hebcal: "Devarim", route: "devarim" },
    { he: "ואתחנן", hebcal: "Vaetchanan", route: "vaetchanan" },
    { he: "עקב", hebcal: "Eikev", route: "eikev" },
    { he: "ראה", hebcal: "Re'eh", route: "reeh" },
    { he: "שופטים", hebcal: "Shoftim", route: "shoftim" },
    { he: "כי תצא", hebcal: "Ki Teitzei", route: "ki-teitzei" },
    { he: "כי תבוא", hebcal: "Ki Tavo", route: "ki-tavo" },
    { he: "נצבים", hebcal: "Nitzavim", route: "nitzavim" },
    { he: "וילך", hebcal: "Vayeilech", route: "vayeilech" },
    { he: "נצבים-וילך", hebcal: "Nitzavim Vayeilech", route: "nitzavim-vayeilech" },
    { he: "האזינו", hebcal: "Ha'Azinu", route: "haazinu" },
    { he: "וזאת הברכה", hebcal: "V'Zot HaBerachah", route: "vzot-haberachah" }
  ].filter(({ hebcal }) => parshiyotOfYear.includes(hebcal) || hebcal === "V'Zot HaBerachah")

  const weeklyParsha = new Sedra(new HDate().getFullYear(), settings.value.location === 'israel').lookup(new HDate()).parsha
  return {
    weeklyParsha,
    weeklyParshaObject: parshiyotList.find(({ hebcal }) => hebcal === weeklyParsha.join(' ')),
    parshiyotList,
  }
}