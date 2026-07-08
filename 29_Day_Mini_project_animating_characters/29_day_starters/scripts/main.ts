const text = "30 days of javascript challenge 2020 asabeneh yetayeh";
const title = document.getElementById("title");

if (!title) {
  throw new Error("Missing title element");
}

const colorPalettes = [
  ["#d6ce73", "#4d3fb9", "#db4b80", "#2b4f92", "#e49a63", "#bc5d51", "#7b56d0", "#3fba7b", "#d9d4a6", "#c74b4f"],
  ["#7488d2", "#6fda64", "#cf5bcf", "#f18f55", "#3f3f8f", "#ed5454", "#99d86f", "#e3d04f", "#62c7da", "#f09e7f"],
  ["#4d3fb9", "#d15f44", "#6fda64", "#d850a8", "#2f68c9", "#f1cb4c", "#8b5cf6", "#3cc6a4", "#ef6c6c", "#b8d956"],
  ["#c74b4f", "#5b76d1", "#6fbf4b", "#b15fd2", "#efc24d", "#3cb6f0", "#ec7f5f", "#4d3fb9", "#f0e28a", "#7dd67d"],
];

const backgrounds = ["#5f9341", "#5b708a", "#b89962", "#a8b9d8", "#8d97c8", "#96b7d7"];
const words = text.split(" ");

function buildLine(word: string) {
  const wordSpan = document.createElement("span");
  wordSpan.className = "word";

  for (const char of word) {
    const charSpan = document.createElement("span");
    charSpan.className = "char";
    charSpan.textContent = char === " " ? "\u00A0" : char.toUpperCase();
    wordSpan.append(charSpan);
  }

  return wordSpan;
}

function buildTitle() {
  title.innerHTML = "";

  const layout = [
    words.slice(0, 4).join(" "),
    words.slice(4, 6).join(" "),
    words.slice(6).join(" "),
  ];

  layout.forEach((lineText) => {
    const line = document.createElement("span");
    line.className = "line";
    const lineWords = lineText.split(" ");
    lineWords.forEach((word, index) => {
      line.append(buildLine(word));
      if (index < lineWords.length - 1) {
        const spacer = document.createElement("span");
        spacer.className = "word";
        spacer.textContent = "\u00A0";
        line.append(spacer);
      }
    });
    title.append(line);
  });
}

buildTitle();

const chars = Array.from(title.querySelectorAll<HTMLElement>(".char"));
const scene = document.querySelector<HTMLElement>(".scene");

if (!scene) {
  throw new Error("Missing scene element");
}

let tick = 0;

function applyFrame() {
  const palette = colorPalettes[tick % colorPalettes.length];
  const bg = backgrounds[tick % backgrounds.length];
  scene.style.backgroundColor = bg;
  document.body.style.backgroundColor = bg;

  chars.forEach((char, index) => {
    const color = palette[(index + tick) % palette.length];
    char.style.color = color;
    char.classList.toggle("dim", (index + tick) % 6 === 0);
  });

  tick += 1;
}

applyFrame();
setInterval(applyFrame, 360);
