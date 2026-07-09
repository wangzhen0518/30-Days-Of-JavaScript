import { countries, Country } from "../data/countries_data";

type CountriesSortFn = (countries: Country[], isAscend: boolean) => void;

class State {
  countries: Country[];
  totalPopulation: number;
  currentDisplayCountries: Country[];
  isAscend: boolean;
  sortFn: CountriesSortFn;
  isStatByPopulation: boolean;
  activeSortBtn: HTMLButtonElement;
  activeStatType: HTMLButtonElement;
  countriesNeedResort: boolean;

  constructor(
    countries: Country[],
    totalPopulation: number,
    currentDisplayCountries: Country[],
    isAscend: boolean,
    sortFn: CountriesSortFn,
    isStatByPopulation: boolean,
    activeSortBtn: HTMLButtonElement,
    activeStatType: HTMLButtonElement,
    countriesNeedResort: boolean = false,
  ) {
    this.countries = countries;
    this.totalPopulation = totalPopulation;
    this.currentDisplayCountries = currentDisplayCountries;
    this.isAscend = isAscend;
    this.sortFn = sortFn;
    this.isStatByPopulation = isStatByPopulation;
    this.activeSortBtn = activeSortBtn;
    this.activeStatType = activeStatType;
    this.countriesNeedResort = countriesNeedResort;
  }
}

class StatItem {
  key: string;
  val: number;

  constructor(key: string, val: number) {
    this.key = key;
    this.val = val;
  }
}

function countriesSortByName(countries: Country[], isAscend: boolean) {
  if (isAscend) {
    countries.sort((c1, c2) => c1.name.localeCompare(c2.name));
  } else {
    countries.sort((c1, c2) => c2.name.localeCompare(c1.name));
  }
}

function countriesSortByCapital(countries: Country[], isAscend: boolean) {
  if (isAscend) {
    countries.sort((c1, c2) => {
      if (!c1.capital) {
        return 1;
      } else if (!c2.capital) {
        return -1;
      } else {
        return c1.capital.localeCompare(c2.capital);
      }
    });
  } else {
    countries.sort((c1, c2) => {
      if (!c1.capital) {
        return -1;
      } else if (!c2.capital) {
        return 1;
      } else {
        return c2.capital.localeCompare(c1.capital);
      }
    });
  }
}

function countriesSortByPopulation(countries: Country[], isAscend: boolean) {
  if (isAscend) {
    countries.sort((c1, c2) => c1.population - c2.population);
  } else {
    countries.sort((c1, c2) => c2.population - c1.population);
  }
}

function showBigNumber(n: number) {
  if (n > 999) {
    const arr: string[] = [];
    while (n > 0) {
      arr.push((n % 1000).toString().padStart(3, "0"));
      n = Math.floor(n / 1000);
    }
    return arr.reverse().join(",").replace(/^0*/, "");
  } else {
    return n.toString();
  }
}

function displayOneCountry(country: Country): string {
  const langDesc = country.languages.length > 1 ? "Languages" : "Language";
  return `
  <div class="country-card">
    <img class="country-flag" src="${country.flag}" alt="flag" />
    <div class="coutry-name">${country.name}</div>
    <div class="coutry-capital">Capital: ${country.capital || "null"}</div>
    <div class="coutry-languages">${langDesc}: ${country.languages.join(", ")}</div>
    <div class="coutry-population">Population: ${showBigNumber(country.population)}</div>
  </div>`;
}

function displayCountries(countries: Country[], countriesDisplay: HTMLDivElement) {
  let html = "";
  for (const country of countries.slice(0, 10)) {
    html += displayOneCountry(country);
  }
  countriesDisplay.innerHTML = html;
}

function extractStatInfo(
  countries: Country[],
  topK: number,
  isStatByPopulation: boolean,
  totalPopulation: number,
): [StatItem[], number] {
  if (isStatByPopulation) {
    const c = [...countries];
    countriesSortByPopulation(c, false);
    const topKCountries = c.slice(0, topK);
    return [
      [new StatItem("World", totalPopulation), ...topKCountries.map((country) => new StatItem(country.name, country.population))],
      totalPopulation,
    ];
  } else {
    const langStat = new Map<string, number>(); //TODO: 添加到 cache 中
    for (const country of countries) {
      for (const lang of country.languages) {
        const num = langStat.get(lang) || 0;
        langStat.set(lang, num + 1);
      }
    }
    const langArr = [...langStat.entries()].sort((l1, l2) => l2[1] - l1[1]);
    const topKLang = langArr.slice(0, topK);
    return [topKLang.map((l) => new StatItem(l[0], l[1])), countries.length];
  }
}

function displayOneStatItem(item: StatItem, maxValue: number): string {
  return `
  <div class="stat-item">
    <span class="stat-item-name">${item.key}</span>
    <span class="stat-item-ratio" style="width: ${(item.val / maxValue) * 100}%"></span>
    <span class="stat-item-number">${showBigNumber(item.val)}</span>
  </div>`;
}

function displayStatInfo(stats: StatItem[], maxValue: number, statInfo: HTMLDivElement) {
  let html = "";
  for (const item of stats) {
    html += displayOneStatItem(item, maxValue);
  }
  statInfo.innerHTML = html;
}

function updateStats(
  countries: Country[],
  topK: number,
  isStatByPopulation: boolean,
  totalPopulation: number,
  statInfo: HTMLDivElement,
) {
  const [stats, maxValue] = extractStatInfo(countries, topK, isStatByPopulation, totalPopulation);
  displayStatInfo(stats, maxValue, statInfo);
}

function init(
  countries: Country[],
  topK: number,

  subtitle: HTMLParagraphElement,

  countriesSortByNameBtn: HTMLButtonElement,
  countriesSortByCapitalBtn: HTMLButtonElement,
  countriesSortByPopulationBtn: HTMLButtonElement,

  countriesDisplay: HTMLDivElement,

  statMsg: HTMLDivElement,

  statByPopulation: HTMLButtonElement,
  statByLanguages: HTMLButtonElement,

  statInfo: HTMLDivElement,
): null | State {
  subtitle.innerText = `Currently, we have ${countries.length} countries`;

  // countries part
  const currentDisplayCountries = countries;

  const isAscend = true;
  const ascendIcon = countriesSortByNameBtn.querySelector(".ascend");
  if (!ascendIcon) return null;
  ascendIcon.classList.toggle("is-active");

  const sortFn = countriesSortByName;
  sortFn(currentDisplayCountries, isAscend);

  displayCountries(currentDisplayCountries, countriesDisplay);

  // statistics part
  const isStatByPopulation = true;
  const totalPopulation = countries.reduce((acc, country) => acc + country.population, 0);
  const [stats, maxValue] = extractStatInfo(countries, topK, isStatByPopulation, totalPopulation);

  statMsg.innerText = `${topK} Most populated countries in the world`; // TODO 搜索筛选后不是这句

  displayStatInfo(stats, maxValue, statInfo);

  return new State(
    countries,
    totalPopulation,
    currentDisplayCountries,
    isAscend,
    sortFn,
    isStatByPopulation,
    countriesSortByNameBtn,
    statByPopulation,
  );
}

function searchCountries(query: string, countries: Country[]): Country[] {
  query = query.toLocaleLowerCase();

  const results = [];
  for (const country of countries) {
    if (
      // TODO: 每次都 toLowerCase 性能可能较差，考虑如何优化，是否提前全部 toLowerCase
      country.name.toLocaleLowerCase().includes(query) ||
      country.capital?.toLocaleLowerCase().includes(query) ||
      country.languages.some((lang) => lang.toLocaleLowerCase().includes(query))
    ) {
      results.push(country);
    }
  }
  return results;
}

function updateCountries(query: string, countries: Country[], state: State, countriesDisplay: HTMLDivElement) {
  if (state.countriesNeedResort) {
    state.sortFn(countries, state.isAscend);
  }

  state.currentDisplayCountries = searchCountries(query, countries);
  displayCountries(state.currentDisplayCountries, countriesDisplay);
}

function updateSearch(
  query: string,
  countries: Country[],
  state: State,
  topK: number,
  countriesDisplay: HTMLDivElement,
  statInfo: HTMLDivElement,
) {
  updateCountries(query, countries, state, countriesDisplay);
  updateStats(state.currentDisplayCountries, topK, state.isStatByPopulation, state.totalPopulation, statInfo);
}

const header = document.getElementById("countries") as HTMLHeadingElement;
const subtitle = document.getElementById("subtitle") as HTMLParagraphElement;

const searchForm = document.getElementById("search-form") as HTMLFormElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-button") as HTMLButtonElement;
const countriesSortByNameBtn = document.getElementById("countries-sort-button-name") as HTMLButtonElement;
const countriesSortByCapitalBtn = document.getElementById("countries-sort-button-capital") as HTMLButtonElement;
const countriesSortByPopulationBtn = document.getElementById("countries-sort-button-population") as HTMLButtonElement;
const jumpStatIcon = document.getElementById("jump-stat-icon") as HTMLButtonElement;

const countriesDisplay = document.getElementById("countries-display") as HTMLDivElement;

const statPart = document.getElementById("stat-part") as HTMLDivElement;
const statMsg = document.getElementById("stat-msg") as HTMLDivElement;

const statByPopulation = document.getElementById("stat-type-population") as HTMLButtonElement;
const statByLanguages = document.getElementById("stat-type-languages") as HTMLButtonElement;

const statInfo = document.getElementById("stat-info") as HTMLDivElement;

const backToTop = document.getElementById("back-to-top") as HTMLButtonElement;

const btn2sortFn = new Map([
  [countriesSortByNameBtn, countriesSortByName],
  [countriesSortByCapitalBtn, countriesSortByCapital],
  [countriesSortByPopulationBtn, countriesSortByPopulation],
]);

const topK = 10;

const state = init(
  countries,
  topK,
  subtitle,
  countriesSortByNameBtn,
  countriesSortByCapitalBtn,
  countriesSortByPopulationBtn,
  countriesDisplay,
  statMsg,
  statByPopulation,
  statByLanguages,
  statInfo,
);
if (!state) throw new Error("Init failed");

searchForm.addEventListener("submit", () => {
  const query = searchInput.value;
  if (!query) return;

  updateSearch(query, countries, state, topK, countriesDisplay, statInfo);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (!query) return;

  updateSearch(query, countries, state, topK, countriesDisplay, statInfo);
});

document.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest("button");
  if (!button) return;

  if (button === jumpStatIcon) {
    statPart.scrollIntoView({ behavior: "smooth" });
  } else if (button === backToTop) {
    header.scrollIntoView({ behavior: "smooth" });
  } else if (button.classList.contains("countries-sort-button")) {
    if (button === state.activeSortBtn) {
      state.isAscend = !state.isAscend;
      button.querySelectorAll(".countries-sort-sequence").forEach((img) => img.classList.toggle("is-active"));
      state.currentDisplayCountries.reverse();
      if (state.currentDisplayCountries !== state.countries) {
        state.countries.reverse();
      }
    } else {
      // 更新 ascend / descend 图标
      state.activeSortBtn.querySelectorAll(".countries-sort-sequence").forEach((img) => img.classList.remove("is-active"));

      let imgToActive: Element | null;
      if (state.isAscend) {
        imgToActive = button.querySelector(".ascend");
      } else {
        imgToActive = button.querySelector(".descend");
      }
      if (!imgToActive) return;
      imgToActive.classList.add("is-active");

      state.activeSortBtn = button;

      // 更新国家展示顺序
      const sortFn = btn2sortFn.get(button);
      if (!sortFn) return;

      sortFn(state.currentDisplayCountries, state.isAscend);
      state.sortFn = sortFn;
      state.countriesNeedResort = state.currentDisplayCountries !== state.countries;
    }
    displayCountries(state.currentDisplayCountries, countriesDisplay);
  } else if (button.classList.contains("stat-type-button")) {
    if (button === statByPopulation && !state.isStatByPopulation) {
      state.isStatByPopulation = true;
      updateStats(state.currentDisplayCountries, topK, state.isStatByPopulation, state.totalPopulation, statInfo);
    } else if (button === statByLanguages && state.isStatByPopulation) {
      state.isStatByPopulation = false;
      updateStats(state.currentDisplayCountries, topK, state.isStatByPopulation, state.totalPopulation, statInfo);
    }
  }
});
