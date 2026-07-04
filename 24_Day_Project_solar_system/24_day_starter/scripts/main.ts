// console.log(countries)
// alert('Open the console and check if the countries has been loaded')

interface Planet {
  name: string;
  image: string;
  gravity: number;
}

const planetInfos: [string, number][] = [
  ["earth", 9.8],
  ["jupiter", 24.79],
  ["mars", 3.71],
  ["mercury", 3.7],
  ["moon", 1.62],
  ["neptune", 11.15],
  ["pluto", 0.62],
  ["saturn", 10.44],
  ["uranus", 8.87],
  ["venus", 8.87],
];
let planetMap: Map<string, Planet> = new Map();

function initPlanetInfo() {
  for (const [name, gravity] of planetInfos) {
    planetMap.set(name, {
      name: name.toUpperCase(),
      image: `./images/${name}.png`,
      gravity: gravity,
    });
  }
}
initPlanetInfo();

function insertPlanetOption() {
  let html = "";
  for (const [name, _] of planetInfos) {
    html += `<option value="${name}">${name.toUpperCase()}</option>\n`;
  }
  (document.getElementById("planet") as HTMLElement).innerHTML += html;
}
insertPlanetOption();

document.getElementById("calBtn")?.addEventListener("click", () => {
  const planetImage = document.getElementById("flex-item-image") as HTMLImageElement;
  const planetDesc = document.getElementById("flex-item-desc") as HTMLDivElement;
  const planetDescMsg = document.getElementById("flex-item-desc-msg") as HTMLDivElement;
  const planetDescGravity = document.getElementById("flex-item-desc-gravity") as HTMLDivElement;

  planetDesc.style.display = "flex";

  const mText = (document.getElementById("mass") as HTMLInputElement).value;
  if (!mText) {
    planetImage.style.display = "none";
    planetDescMsg.innerText = "Mass is required";
    return;
  }

  const m = Number(mText);
  if (isNaN(m)) {
    planetImage.style.display = "none";
    planetDescMsg.innerText = "Please input a number as mass.";
    return;
  }

  const planetOption = document.getElementById("planet") as HTMLSelectElement;
  if (planetOption.selectedIndex == 0) {
    planetImage.style.display = "none";
    planetDescMsg.innerText = "You did not choose a planet yet";
    return;
  }

  const planetInfo = planetMap.get(planetOption.value) as Planet;
  const gravity = m * planetInfo.gravity;
  planetImage.style.display = "flex";
  planetImage.src = planetInfo.image;
  planetDescMsg.innerHTML = `The weight of the object on <strong>${planetInfo.name}</strong>`;
  planetDescGravity.innerHTML = `<strong>${gravity.toFixed(2)} N</strong>`;
});

// function initTest() {
//   (document.getElementById("mass") as HTMLInputElement).value = "10";
//   (document.getElementById("planet") as HTMLSelectElement).selectedIndex = 1;
//   (document.getElementById("calBtn") as HTMLButtonElement).click();
// }
// initTest();
