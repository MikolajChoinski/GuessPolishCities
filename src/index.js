// By Mono - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=30407917


const form = document.querySelector(".guess input");
const input = document.querySelector(".guess input");
const guesses = [];
const stats = document.getElementById("entities-pop");
const submitButton = document.getElementById("submit");
let poland = null;
var vilCount = 0;
var citCount = 0;
var entityCount = 0;


const myMap = L.map('map').setView([52, 19.25], 6);

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

CartoDB_PositronNoLabels.addTo(myMap)

//Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getNumber(string) {
  try {
    var stringSlice = string.slice(1);
    var sliceNumber = parseInt(stringSlice);
    return sliceNumber;
  } catch (e) {
    console.log(e);
  }
}

function checkGuess(name, guesses) {
  var guessTrue;
  console.log(name);
  console.log(guesses);
  if (guesses.length > 0) {
    for (let i = 0; i < guesses.length; i++) {
      if (name === guesses[i].Name) {
        guessTrue = false;
        break;
      }
      else {
        guessTrue = true;
      }
    }
  } else {
    guessTrue = true;
  }
  console.log(guessTrue);
  return guessTrue;
}

async function getPoland() {
  try {
    
    const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=Q36&props=references&formatversion=2&origin=*`
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    const populations = data.claims.P1082;
    for (let i = 0; i < populations.length; i++){
      if (populations[i].rank ==='preferred') {
        var polandString = populations[i].mainsnak.datavalue.value.amount;
        var poland = getNumber(polandString);
        console.log(poland);
      }
    }
    return poland;
    
  } catch(e) {
    console.log(e);
  }
  
}
/* async function getId(guessValue) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=pl&search=${ guessValue }&origin=*`;
    const res = await fetch(url)
    const data = await res.json();
    //console.log(data);
    //console.log(data.search[0].id)
    var ID = data.search[0].id;
    var name = data.search[0].label
    return [ID, name];
  } catch(e) {
    console.log(e, e.response)
  }
} */

async function getId(guessValue) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=query&list=search&srsearch=${guessValue} haswbstatement:P31=Q515|P31=Q3558970|P31=Q2616791|P31=Q925381|P31=Q15334 haswbstatement:P17=Q36&format=json&language=pl&origin=*`;
    const res = await fetch(url)
    const data = await res.json();
    console.log(data);
    //console.log(data.search[0].id)
    var ID = data.query.search[0].title;
    console.log(ID);
    return ID;
  } catch(e) {
    console.log(e, e.response)
  }
}
function getType(entityType, data, ID) {
  var typeOfSettlement;
  var typeTrue;
  for (let i = 0; i < entityType.length; i++) {
    var entityTypeId = data.entities[ID].claims.P31[i].mainsnak.datavalue.value.id;
    //console.log(entityTypeId);
    
    if (entityTypeId === "Q515" || entityTypeId === "Q2616791" || entityTypeId === "Q925381" || entityTypeId === "Q15334" ) {
      typeOfSettlement = "city";
      //console.log(typeOfSettlement);
      typeTrue = true;
      break;
    }
    else if (entityTypeId === "Q3558970") {
      typeOfSettlement = "village";
      typeTrue = true;
      break;
    }
    else {
      typeTrue = false;
    }
  }
  return [typeOfSettlement, typeTrue];
  } 

  function getCountry(entityCountry) {
    var countryTrue;
    for (let i = 0; i < entityCountry.length; i++) {
      const entityCountryId = entityCountry[i].mainsnak.datavalue.value.id;
      const entityCountryRank = entityCountry[i].rank;
      if ((entityCountryRank === "preferred" && entityCountryId === "Q36") || (entityCountry.length == 1 && entityCountryId === "Q36")) {
        countryTrue = true;
        console.log(entityCountryId);
        break;
      }
      else {
        countryTrue = false;
      }
    }
    return countryTrue;
  }

  function getPopulation(entityPop) {
    for (let i = 0; i < entityPop.length; i++) {
      console.log(entityPop.length);
      if (entityPop[i].rank === "preferred") {
        var population = entityPop[i].mainsnak.datavalue.value.amount;
        console.log("preferred");
        break;
      }
      else if (entityPop.length === 1) {
        var population = entityPop[i].mainsnak.datavalue.value.amount;
        console.log("notpreferred");
        break;
      } else if (entityPop.length > 1 && !entityPop.includes(entityPop.rank=== "preferred")) {
        var population = entityPop[0].mainsnak.datavalue.value.amount;
        console.log("weird");
        break;
      }
    }
    return population;
  }

  function getPercentage(population, poland) {
    guessPop = guessPop + population;
    console.log(guessPop);
    var fraction = guessPop * 100 / poland;
    var percentage = fraction.toFixed(2);
    console.log(guesses.length);
    stats.textContent = "You guessed the population of " + guessPop + " out of " + poland + " people living in Poland   (" + percentage + "%) ";
  }

  function sortBiggest(arr) {
    const sortedArray = arr.slice(); // Create a copy of the input array
    for (let i = 1; i < sortedArray.length; i++) {
        const currentElement = sortedArray[i];
        let j = i - 1;
        
        while (j >= 0 && sortedArray[j].Population < currentElement.Population) {
            sortedArray[j + 1] = sortedArray[j];
            j--;
        }
        sortedArray[j + 1] = currentElement;
    }
    return sortedArray;
}

function sortBiggest(arr) {
  const sortedArray = arr.slice(); // Create a copy of the input array
  for (let i = 1; i < sortedArray.length; i++) {
      const currentElement = sortedArray[i];
      let j = i - 1;
      
      while (j >= 0 && sortedArray[j].Population < currentElement.Population) {
          sortedArray[j + 1] = sortedArray[j];
          j--;
      }
      sortedArray[j + 1] = currentElement;
  }
  return sortedArray;
}
  
function sortSmallest(arr) {
  const sortedArray = arr.slice(); // Create a copy of the input array
  for (let i = 1; i < sortedArray.length; i++) {
      const currentElement = sortedArray[i];
      let j = i - 1;

      while (j >= 0 && sortedArray[j].Population > currentElement.Population) {
          sortedArray[j + 1] = sortedArray[j];
          j--;
      }
      sortedArray[j + 1] = currentElement;
  }
  return sortedArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var guessPop = 0;
document.addEventListener('DOMContentLoaded', async () => {
  poland = await getPoland();
});
const typesTitle = document.createElement("div");
const typesTotal = document.createElement("div");
const typesVillages = document.createElement("div");
const typesCities = document.createElement("div");
function guessFunction() {
  var guessValue = input.value;
  const startTime = performance.now();
  
  async function getData(ID) {
    try {
      console.log(ID);  
      const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels|claims&format=json&ids=${ID}&origin=*&languages=en`; //use later wbgetclaims
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      var entityType = data.entities[ID].claims.P31;
      var entityPop = data.entities[ID].claims.P1082;
      var entityCountry = data.entities[ID].claims.P17;
      var entityCoordinates = data.entities[ID].claims.P625[0];
      var name = data.entities[ID].labels.en.value;
      console.log(name);
      var guessTrue = checkGuess(name, guesses);

      if (guessTrue === true) {
        var [typeOfSettlement, typeTrue] = getType(entityType, data, ID);
      }
      else {
        return false;
      }

      if (typeTrue === true) {
        var countryTrue = getCountry(entityCountry);
      }
      else {
        return false;
      } 
      
      if (countryTrue === true) {
        var population = getPopulation(entityPop);
        population = getNumber(population);
      }
      else {
        return false;
      }
      
      return [entityCoordinates, typeOfSettlement, population, name]; 
    } catch(e) {
      console.log(e, e.response)
    }
  }

  async function getCity() {
    try {
      var ID = await getId(guessValue);
      var data = await getData(ID);
      console.log(data);
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
      var [data] = await getCity();
      if (data === false) {
        console.log("BAD GUESS");
        return false;
      }
      else {
        var [entityCoordinates, typeOfSettlement, population, name] = data;
        console.log(entityCoordinates);
        var guess = {
          "Name": name,
          "Population": population,
          "TypeOfSettlement": typeOfSettlement,
          "Latitude": entityCoordinates.mainsnak.datavalue.value.latitude,
          "Longitude": entityCoordinates.mainsnak.datavalue.value.longitude
        }
        var myIcon = L.icon({
          iconUrl: 'Map_pin_icon.svg',
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -30]
        });
        marker = new L.marker([entityCoordinates.mainsnak.datavalue.value.latitude, entityCoordinates.mainsnak.datavalue.value.longitude], {icon: myIcon});
        marker.bindPopup(`Name : ${guess.Name}<br>Population : ${guess.Population}<br>Type of settlement : ${guess.TypeOfSettlement}<br>Latitude : ${guess.Latitude}<br>Longitude : ${guess.Longitude}`).openPopup();
        marker.addTo(myMap);
        guesses.push(guess);
        return guess;
        //console.log(guesses);  
    }
    }
    catch (error) {
      console.error(error);
    }
  }

  
  
  async function writeStats() {
    try {
      var guess = await plopCity();
      entityCount++;
      console.log(guess);
      if (guess === false) {
        return false;
      }
      var population = guess.Population;
      getPercentage(population, poland);
      
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
      var biggestGuess = sortBiggest(guesses);
      entitiesBiggest.innerHTML = "Your biggest entities : ";
      for (let i = 0; i < biggestGuess.length; i++) {
        const entityBiggest = document.createElement("div");
        entityBiggest.textContent = (i + 1) + " - " + biggestGuess[i].Name + " : " + biggestGuess[i].Population;  
        entitiesBiggest.appendChild(entityBiggest);
      }
      var smallestGuess = sortSmallest(guesses);
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
        typesTitle.textContent = `Types of guessed entities :`
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
console.log(poland);

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