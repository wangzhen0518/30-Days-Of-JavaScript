import { countries } from "../data/countries";

type SearchFn = (searchCtx: string, name: string) => boolean;

function searchByStart(searchCtx: string, name: string): boolean {
  return name.startsWith(searchCtx);
}

function searchByContain(searchCtx: string, name: string): boolean {
  return name.includes(searchCtx);
}

function updateSearchResult(
  searchCtx: string,
  countries: string[],
  searchFn: SearchFn,
  searchResMsg: HTMLElement,
  countriesList: HTMLUListElement,
): string[] {
  if (searchCtx.length !== 0) {
    const upperSearchCtx = searchCtx.toUpperCase();

    let results = [];
    for (const country of countries) {
      if (searchFn(upperSearchCtx, country)) {
        results.push(country);
      }
    }

    if (searchFn === searchByStart) {
      searchResMsg.innerHTML = `Countries start with <span class="searchResCtx">${searchCtx}</span> are <span class="searchResNum">${results.length}.</span>`;
    } else {
      searchResMsg.innerHTML = `Countries containing <span class="searchResCtx">${searchCtx}</span> are <span class="searchResNum">${results.length}.</span>`;
    }

    showCountries(results, countriesList);
    return results;
  } else {
    searchResMsg.innerHTML = "";
    showCountries(countries, countriesList);
    return countries;
  }
}

function updateCountriesSequence(countries: string[], countriesList: HTMLUListElement): string[] {
  countries.reverse();
  showCountries(countries, countriesList);
  return countries;
}

function showCountries(countriesToShow: string[], countriesList: HTMLUListElement) {
  let html = "";
  for (const country of countriesToShow) {
    html += `<div class="country">${country}</div>`;
  }
  countriesList.innerHTML = html;
}

function init(
  countries: string[],
  subtitle: HTMLElement,
  startWordBtn: HTMLButtonElement,
  searchAnyWordBtn: HTMLButtonElement,
  sortIcon: HTMLImageElement,
  countryList: HTMLUListElement,
): [SearchFn, boolean, string[]] {
  subtitle.innerText = `Total Number of countries: ${countries.length}`;

  const searchFn = searchByStart;
  startWordBtn.classList.add("is-active");
  searchAnyWordBtn.classList.remove("is-active");

  const isAscend = true;
  sortIcon.src = "./images/ascend.svg";
  for (let i = 0; i < countries.length; i++) {
    const name = countries[i];
    countries[i] = name.toUpperCase();
  }
  countries.sort();

  showCountries(countries, countryList);

  return [searchFn, isAscend, countries];
}

const subtitle = document.getElementById("subtitle") as HTMLElement;
const searchResMsg = document.getElementById("searchResMsg") as HTMLParagraphElement;
const startWordBtn = document.getElementById("startWordBtn") as HTMLButtonElement;
const searchAnyWordBtn = document.getElementById("searchAnyWordBtn") as HTMLButtonElement;
const sortBtn = document.getElementById("sortBtn") as HTMLButtonElement;
const sortIcon = document.getElementById("sortIcon") as HTMLImageElement;
const searchCtx = document.getElementById("searchCtx") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const countriesList = document.getElementById("countries") as HTMLUListElement;

let [searchFn, isAscend, lastResult] = init(countries, subtitle, startWordBtn, searchAnyWordBtn, sortIcon, countriesList);

document.getElementById("header")?.addEventListener("click", (event) => {
  let updateNeeded = false;

  if (event.target === startWordBtn) {
    updateNeeded = true;
    searchFn = searchByStart;
    startWordBtn.classList.add("is-active");
    searchAnyWordBtn.classList.remove("is-active");
  } else if (event.target === searchAnyWordBtn) {
    updateNeeded = true;
    searchFn = searchByContain;
    startWordBtn.classList.remove("is-active");
    searchAnyWordBtn.classList.add("is-active");
  } else if (event.target === sortBtn || event.target == sortIcon) {
    updateNeeded = true;
    isAscend = !isAscend;
    if (isAscend) {
      sortIcon.src = "./images/ascend.svg";
    } else {
      sortIcon.src = "./images/descend.svg";
    }
    if (lastResult !== countries) {
      countries.reverse();
    }
    lastResult = updateCountriesSequence(lastResult, countriesList);
  } else if (event.target === searchBtn) {
    updateNeeded = true;
    searchCtx.focus();
  }

  if (updateNeeded) {
    lastResult = updateSearchResult(searchCtx.value, countries, searchFn, searchResMsg, countriesList);
  }
});

searchCtx.addEventListener("input", (event) => {
  const inputElement = event.target as HTMLInputElement;
  lastResult = updateSearchResult(inputElement.value, countries, searchFn, searchResMsg, countriesList);
});
