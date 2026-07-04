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

function renderStatRows(rows: Array<{ label: string; value: number }>, title: string, maxValue: number) {
  const titleEl = document.getElementById("graph-title") as HTMLHeadingElement;
  titleEl.innerText = title;

  const html = rows
    .map(
      (row) => `
        <li class="stat-item">
          <span class="stat-item__label">${row.label}</span>
          <span class="stat-item__bar" style="width: ${(row.value / maxValue) * 100}%"></span>
          <span class="stat-item__value">${showBigNumber(row.value)}</span>
        </li>`,
    )
    .join("\n");

  (document.getElementById("stat") as HTMLDivElement).innerHTML = `<ul class="stat-list">${html}</ul>`;
}

function showTopKCountries(countryRank: Country[], totalPopulation: number, k: number) {
  const topCountries = countryRank.slice(0, k);
  renderStatRows(
    [
      { label: "World", value: totalPopulation },
      ...topCountries.map((country) => ({ label: country.name, value: country.population })),
    ],
    "10 Most Populated countries in the world",
    totalPopulation,
  );
}

function showTopKLanguages(languageRank: LanguageStatRecord[], totalCountries: number, k: number) {
  const topLanguages = languageRank.slice(0, k);
  renderStatRows(
    topLanguages.map((langStat) => ({ label: langStat.language, value: langStat.num })),
    "10 Most Spoken languages in the world",
    totalCountries,
  );
}

const countryRank = sortByPopulation(countries);
const totalCountries = countryRank.length;
const totalPopulation = countryRank.reduce((acc, country) => acc + country.population, 0);
const languageStat = initLanguageStat(countryRank);
const languageRank = sortByLanguage(languageStat);

const K = 10;
const populationButton = document.getElementById("population") as HTMLButtonElement;
const languageButton = document.getElementById("languages") as HTMLButtonElement;

function setActiveButton(active: HTMLButtonElement) {
  for (const button of [populationButton, languageButton]) {
    button.classList.toggle("is-active", button === active);
  }
}

populationButton.addEventListener("click", () => {
  setActiveButton(populationButton);
  showTopKCountries(countryRank, totalPopulation, K);
});

languageButton.addEventListener("click", () => {
  setActiveButton(languageButton);
  showTopKLanguages(languageRank, totalCountries, K);
});

initSubtitle(totalCountries);
setActiveButton(populationButton);
showTopKCountries(countryRank, totalPopulation, K);
