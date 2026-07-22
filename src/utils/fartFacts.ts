// Náhodné (pseudo)fakty o prdech, které občas vyhrkne pirát po zaznamenání prdu.
export const FART_FACTS: string[] = [
  "Průměrný člověk prdne 14–23× za den. Ty jsi asi nadprůměr. 💨",
  "Prd může letět rychlostí až 11 km/h. Uteč, dokud můžeš!",
  "Prd je z 99 % bez zápachu. To poslední procento je ale pořádná pecka.",
  "Za smrad může hlavně sirovodík. Čím víc fazolí, tím veselejc.",
  "Hlasitost prdu závisí na napětí svěrače, ne na množství. Fakt.",
  "I mrtví lidé občas prdnou. Život je zkrátka plný překvapení.",
  "Ženy prdí úplně stejně jako muži. Věda nelže, kámo.",
  "Prd se skládá hlavně z polykaného vzduchu. Jez pomaleji, arr!",
  "Zadržet prd není nebezpečné, akorát to není žádná sranda.",
  "Termiti vyprodukují víc metanu než krávy. Hned po táboře.",
  "Prd dokáže v místnosti vydržet i pár minut. Klasický ninja.",
  "Nejsmradlavější prdy bývají ty tiché. Ticháček je zákeřný.",
  "Koně prdí až 15 litrů plynu za den. Respect, kamaráde!",
  "Kachny mají prdící duši. Takový vtip staví: bez duše by nebyl zvuk. 🦆",
  "Plynovody lidí obsahují hlavně dusík, kyslík a oxid uhličitý. Nudné, co?",
  "Písek se pod tlakem plyn může zapálit. Nikdy to tady nezkoušej.",
  "Prďící rybník by mohl explodovat. Věda je zábavná, ne?",
  "Papouščí prdy vůní po semínkách. Zvěř má vkus.",
  "Středověcí trubadúři dělali ze svých prdů hudbu. Pravý multitalent.",
  "Prd astronautů v kosmické lodi se chová jinak. Absence gravity je cool.",
  "V 18. století si aristocraté najímali lidi jen aby prdli. Profesionálové!",
  "Některé ryby prdí bublinkami jako signál. Samci a samičky se poznají.",
  "Bakterie v trávicím traktu jsou piráti — zabírají území a bojují.",
  "Když prdíš v bazénu, může to být zdravotní riziko. Drž se sucha!",
  "Prďící člověk by mohl uletět v beztíži. Reálný návod do kosmu? 🚀",
];


export function randomFartFact(): string {
  return FART_FACTS[Math.floor(Math.random() * FART_FACTS.length)];
}
