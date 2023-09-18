import getPoland from "./modules/getpoland.js";
import getId from "./modules/getid.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { checkGuess, getType, getCountry, getPopulation } from "./modules/guess-evaluate-functions.js";
import { sortBiggest, sortSmallest } from "./modules/sorting-functions.js";
import { getNumber, getPercentage } from "./modules/data-processing-functions.js";

const form = document.querySelector(".guess input");
const input = document.querySelector(".guess input");
const guesses = [];
const stats = document.getElementById("entities-pop");
const submitButton = document.getElementById("submit");
let poland = null;
let vilCount = 0;
let citCount = 0;
let entityCount = 0;


const myMap = L.map("map").setView([52, 19.25], 6);

let CartoDB_PositronNoLabels = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd"
});

CartoDB_PositronNoLabels.addTo(myMap);

let guessPop = 0;
document.addEventListener("DOMContentLoaded", async () => {
  poland = await getPoland(getNumber);
});
const typesTitle = document.createElement("div");
const typesTotal = document.createElement("div");
const typesVillages = document.createElement("div");
const typesCities = document.createElement("div");

function guessFunction() {
  let guessValue = input.value;
  const startTime = performance.now();
  async function getData(ID) {
    try {
      const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels|claims&format=json&ids=${ID}&origin=*&languages=en`;
      const res = await fetch(url);
      const data = await res.json();
      let entityType = data.entities[ID].claims.P31;
      let entityPop = data.entities[ID].claims.P1082;
      let entityCountry = data.entities[ID].claims.P17;
      let entityCoordinates = data.entities[ID].claims.P625[0];
      let name = data.entities[ID].labels.en.value;
      let guessTrue = checkGuess(name, guesses);
      let typeOfSettlement;
      let typeTrue;
      let countryTrue;
      let population;

      if (guessTrue === true) {
        [typeOfSettlement, typeTrue] = getType(entityType, data, ID);
      }
      else {
        return false;
      }

      if (typeTrue === true) {
        countryTrue = getCountry(entityCountry);
      }
      else {
        return false;
      }
      if (countryTrue === true) {
        population = getPopulation(entityPop);
        population = getNumber(population);
      }
      else {
        return false;
      }
      return [entityCoordinates, typeOfSettlement, population, name];
    } catch(e) {
      console.log(e, e.response);
    }
  }

  async function getCity() {
    try {
      let ID = await getId(guessValue);
      let data = await getData(ID);
      if (data === false) {
        return [false];
      }
      return [data];
    } catch (error) {
      console.error(error);
    }
  }  
  async function plopCity() {
    try {
      let [data] = await getCity();
      if (data === false) {
        console.log("BAD GUESS");
        return false;
      }
      else {
        let [entityCoordinates, typeOfSettlement, population, name] = data;
        let guess = {
          "Name": name,
          "Population": population,
          "TypeOfSettlement": typeOfSettlement,
          "Latitude": entityCoordinates.mainsnak.datavalue.value.latitude,
          "Longitude": entityCoordinates.mainsnak.datavalue.value.longitude
        };
        let myIcon = L.icon({
          iconAnchor: [15, 42],
          iconSize: [30, 42],
          iconUrl: "../Map_pin_icon.svg",
          popupAnchor: [0, -30]
        });
        let marker = new L.marker([entityCoordinates.mainsnak.datavalue.value.latitude, entityCoordinates.mainsnak.datavalue.value.longitude], {icon: myIcon});
        marker.bindPopup(`Name : ${guess.Name}<br>Population : ${guess.Population}<br>Type of settlement : ${guess.TypeOfSettlement}<br>Latitude : ${guess.Latitude}<br>Longitude : ${guess.Longitude}`).openPopup();
        marker.addTo(myMap);
        guesses.push(guess);
        return guess;
    }
    }
    catch (error) {
      console.error(error);
    }
  }
  async function writeStats() {
    try {
      let guess = await plopCity();
      entityCount++;
      if (guess === false) {
        return false;
      }
      let population = guess.Population;
      guessPop = getPercentage(population, poland, guessPop, stats);
      const entityName = document.createElement("div");
      entityName.textContent = entityCount + " - " + guess.Name;
      const entitiesNames = document.getElementById("entities-names");
      const entitiesBiggest = document.getElementById("entities-biggest");
      const entitiesSmallest = document.getElementById("entities-smallest");
      const entitiesTypes = document.getElementById("entities-types");
      if (guesses.length === 1) {
        entitiesNames.className = "stats-box";
        entitiesBiggest.className = "stats-box";
        entitiesSmallest.className = "stats-box";
        entitiesTypes.className = "stats-box";
      }
      if (guesses.length === 1) {
        const namesTitle = document.createTextNode("Guessed entities : ");
        entitiesNames.appendChild(namesTitle);
      }
      entitiesNames.appendChild(entityName);
      let biggestGuess = sortBiggest(guesses);
      entitiesBiggest.innerHTML = "Your biggest entities : ";
      for (let i = 0; i < biggestGuess.length; i++) {
        const entityBiggest = document.createElement("div");
        entityBiggest.textContent = (i + 1) + " - " + biggestGuess[i].Name + " : " + biggestGuess[i].Population;
        entitiesBiggest.appendChild(entityBiggest);
      }
      let smallestGuess = sortSmallest(guesses);
      entitiesSmallest.innerHTML = "Your smallest entities : ";
      for (let i = 0; i < smallestGuess.length; i++) {
        const entitySmallest = document.createElement("div");
        entitySmallest.textContent = (i + 1) + " - " + smallestGuess[i].Name + " : " + smallestGuess[i].Population;
        entitiesSmallest.appendChild(entitySmallest);
      }

      if (guess.TypeOfSettlement === "village") {
        vilCount++;
      } else if (guess.TypeOfSettlement === "city") {
        citCount++;
      }
      if (guesses.length === 1) {
        typesTitle.textContent = "Types of guessed entities :"
        typesTotal.textContent = `Total: ${guesses.length}`;
        typesVillages.textContent = `Villages: ${vilCount}`;
        typesCities.textContent = `Cities: ${citCount}`;
        entitiesTypes.appendChild(typesTitle);
        entitiesTypes.appendChild(typesTotal);
        entitiesTypes.appendChild(typesVillages);
        entitiesTypes.appendChild(typesCities);
      } else {
        typesTotal.textContent = `Total: ${guesses.length}`;
        typesVillages.textContent = `Villages: ${vilCount}`;
        typesCities.textContent = `Cities: ${citCount}`;
      }
    } catch (error) {
      console.error(error);
    }
  }

  writeStats();
  document.getElementById("form").reset();
  const endTime = performance.now();
      const executionTime = endTime - startTime;
      console.log(`Execution time: ${executionTime} milliseconds`);
}

form.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
  event.preventDefault();
  guessFunction();
  }
});

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  guessFunction();
});