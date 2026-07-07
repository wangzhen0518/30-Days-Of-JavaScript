import dayjs from "dayjs";

class Player {
  firstName: string;
  lastName: string;
  country: string;
  score: number;
  date: dayjs.Dayjs;
  id: string;

  constructor(
    firstName: string,
    lastName: string,
    country: string,
    score: number,
    date: dayjs.Dayjs = dayjs(),
    id: string = crypto.randomUUID(),
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.score = score;
    this.date = date;
    this.id = id;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromStr(s: string): null | Player {
    let obj;
    try {
      obj = JSON.parse(s);
    } catch {
      return null;
    }

    if (["firstName", "lastName", "country", "score", "date", "id"].some((key) => !(key in obj))) {
      return null;
    }

    const score = Number(obj.score),
      date = dayjs(obj.date);
    if (isNaN(score) || !date.isValid()) {
      return null;
    }

    return new Player(obj.firstName, obj.lastName, obj.country, score, date, obj.id);
  }

  toHTML() {
    return `      
    <div class="player" id="${this.id}">
      <div class="col">
        <div class="name">${this.firstName} ${this.lastName}</div>
        <div class="date">${this.date.format("MMM D, YYYY HH:mm")}</div>
      </div>
      <div class="col country">${this.country}</div>
      <div class="col score">${this.score}</div>
      <div class="col buttons">
        <button class="editBtn delete">
          <img src="./images/delete.svg" alt="delete" />
        </button>
        <button class="editBtn add5Score">+5</button>
        <button class="editBtn reduce5Score">-5</button>
      </div>
    </div>`;
  }
}

function loadPlayers(): Map<string, Player> {
  const players = new Map();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const value = localStorage.getItem(key);
    if (!value) continue;

    const player = Player.fromStr(value);
    if (!player) continue;

    players.set(player.id, player);
  }
  return players;
}

function showPlayers(players: Map<string, Player>, leaderBoard: HTMLDivElement) {
  let html = "";
  for (const player of players.values()) {
    html += player.toHTML();
  }
  leaderBoard.innerHTML = html;
}

function init(leaderBoard: HTMLDivElement): Map<string, Player> {
  const players = loadPlayers();
  showPlayers(players, leaderBoard);
  return players;
}

function buildPlayer(
  inputFirstName: HTMLInputElement,
  inputLastName: HTMLInputElement,
  inputCountry: HTMLInputElement,
  inputPlayerScore: HTMLInputElement,
  errorInfo: HTMLDivElement,
): null | Player {
  const firstName = inputFirstName.value,
    lastName = inputLastName.value,
    country = inputCountry.value,
    scoreStr = inputPlayerScore.value;

  if (!firstName || !lastName || !country || !scoreStr) {
    errorInfo.innerText = "All fields are required";
    return null;
  }

  const score = Number(scoreStr);
  if (isNaN(score)) {
    errorInfo.innerText = "Player Score must be a number";
    return null;
  }

  errorInfo.innerText = "";
  return new Player(firstName, lastName, country, score);
}

function addPlayer(
  inputFirstName: HTMLInputElement,
  inputLastName: HTMLInputElement,
  inputCountry: HTMLInputElement,
  inputPlayerScore: HTMLInputElement,
  errorInfo: HTMLDivElement,
  leaderBoard: HTMLDivElement,
  players: Map<string, Player>,
): null | Player {
  const player = buildPlayer(inputFirstName, inputLastName, inputCountry, inputPlayerScore, errorInfo);
  if (!player) return null;

  leaderBoard.innerHTML += player.toHTML();

  localStorage.setItem(player.id, player.toJson());
  players.set(player.id, player);

  return player;
}

const infoForm = document.getElementById("info") as HTMLFormElement;
const inputFirstName = document.getElementById("inputFirstName") as HTMLInputElement;
const inputLastName = document.getElementById("inputLastName") as HTMLInputElement;
const inputCountry = document.getElementById("inputCountry") as HTMLInputElement;
const inputPlayerScore = document.getElementById("inputPlayerScore") as HTMLInputElement;
const errorInfo = document.getElementById("errorInfo") as HTMLDivElement;
const leaderBoard = document.getElementById("leaderBoard") as HTMLDivElement;

const players = init(leaderBoard);

document.addEventListener("submit", (event) => {
  if (event.target === infoForm) {
    event.preventDefault();
    addPlayer(inputFirstName, inputLastName, inputCountry, inputPlayerScore, errorInfo, leaderBoard, players);
  }
});

document.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest("button");
  if (!button || !button.classList.contains("editBtn")) return;

  const playerCard = button.closest(".player");
  if (!playerCard) return;

  const player = players.get(playerCard.id);
  const scoreDiv = playerCard.querySelector(".score");
  if (!player || !scoreDiv) return;

  if (button.classList.contains("delete")) {
    playerCard.parentElement?.removeChild(playerCard);
    players.delete(playerCard.id);
    localStorage.removeItem(playerCard.id);
  } else if (button.classList.contains("add5Score")) {
    player.score += 5;
    scoreDiv.innerHTML = player.score.toString();
    localStorage.setItem(player.id, player.toJson());
  } else if (button.classList.contains("reduce5Score")) {
    player.score = Math.max(player.score - 5, 0);
    scoreDiv.innerHTML = player.score.toString();
    localStorage.setItem(player.id, player.toJson());
  }
});
