import { countries, Country } from "../data/countries_data";

interface LanguageStatRecord {
  language: string;
  num: number;
}

function initLanguageStat(countries: Country[]) {
  const languageStat: Map<string, number> = new Map();
  for (const country of countries) {
    for (const lang of country.languages) {
      const num = languageStat.get(lang) || 0;
      languageStat.set(lang, num + 1);
    }
  }
  return languageStat;
}

function initSubtitle(totalCountries: number) {
  (document.getElementById("subtitle") as HTMLParagraphElement).innerText = `Currently, we have ${totalCountries} countries`;
}

function sortByLanguage(languageStat: Map<string, number>) {
  const arr: LanguageStatRecord[] = [];
  for (const [lang, num] of languageStat.entries()) {
    arr.push({ language: lang, num: num });
  }
  arr.sort((r1, r2) => r2.num - r1.num);
  return arr;
}

function sortByPopulation(countries: Country[]) {
  countries.sort((c1, c2) => c2.population - c1.population);
  return countries;
}

function showBigNumber(n: number) {
  const arr: string[] = [];
  while (n > 0) {
    arr.push((n % 1000).toString().padStart(3, "0"));
    n = Math.floor(n / 1000);
  }
  return arr.reverse().join(",").replace(/^0*/, "");
}

function showTopKCountries(countryRank: Country[], totalPopulation: number, k: number) {
  let html = `<li>World, ${showBigNumber(totalPopulation)}</li>\n`;
  for (const country of countryRank.slice(0, k)) {
    html += `<li>${country.name}, ${showBigNumber(country.population)}</li>\n`;
  }
  (document.getElementById("stat") as HTMLDivElement).innerHTML = `<ul>${html}</ul>`;
}

function showTopKLanguages(languageRank: LanguageStatRecord[], totalCountries: number, k: number) {
  let html = "";
  for (const langStat of languageRank.slice(0, k)) {
    html += `<li>${langStat.language}, ${showBigNumber(langStat.num)}</li>\n`;
  }
  (document.getElementById("stat") as HTMLDivElement).innerHTML = `<ul>${html}</ul>`;
}

const countryRank = sortByPopulation(countries);
const totalCountries = countryRank.length;
const totalPopulation = countryRank.reduce((acc, country) => acc + country.population, 0);
const languageStat = initLanguageStat(countryRank);
const languageRank = sortByLanguage(languageStat);

const K = 10;

document.getElementById("population")?.addEventListener("click", () => showTopKCountries(countryRank, totalPopulation, K));
document.getElementById("languages")?.addEventListener("click", () => showTopKLanguages(languageRank, totalCountries, K));

initSubtitle(totalCountries);
showTopKCountries(countryRank, totalPopulation, K);
