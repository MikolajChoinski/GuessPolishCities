const form = document.querySelector(".guess input");
const input = document.querySelector(".guess input");
const guesses = [];

const myMap = L.map('map').setView([52, 19.25], 6);

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

CartoDB_PositronNoLabels.addTo(myMap)

//Functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkGuess(name, guesses) {
  var guessTrue
  if ( guesses.length > 0 && name === guesses[guesses.length - 1].Name) {
    guessTrue = false;
  }
  else {
    guessTrue = true;
  }
  return guessTrue;
}

async function getPoland() {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=Q36&props=references&formatversion=2&origin=*`
    const res = await fetch(url);
    const data = await res.json();
    const populations = data.entities.Q36.claims.P1082;
    for (let i = 0; i < populations.length; i++){
      if (populations[i].rank=='preferred') {
        var poland = populations[i].mainsnak.datavalue.value.amount;
      }
    }
    return poland;
  } catch(e) {
    console.log(e);
  }
}
 async function getId(guessValue) {
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
}

function getType(entityType, data, ID) {
  var typeOfSettlement;
  var typeTrue;
  for (let i = 0; i < entityType.length; i++) {
    var entityTypeId = data.entities[ID].claims.P31[i].mainsnak.datavalue.value.id;
    //console.log(entityTypeId);
    if (entityTypeId === "Q515" || entityTypeId === "Q3558970" || entityTypeId === "Q2616791" || entityTypeId === "Q925381" || entityTypeId === "Q15334") {
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
      if (entityPop[i].rank === "preferred") {
        var population = entityPop[i].mainsnak.datavalue.value.amount;
        break;
      }
      else if (entityPop.length = 1) {
        var population = entityPop[i].mainsnak.datavalue.value.amount;
        break;
      }
    }
    return population;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

form.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
  event.preventDefault();
  var guessValue = input.value;

  async function getData(ID, name) {
    try {
      const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${ID}&origin=*`; //use later wbgetclaims
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      var entityType = data.entities[ID].claims.P31;
      var entityPop = data.entities[ID].claims.P1082;
      var entityCountry = data.entities[ID].claims.P17;
      var entityCoordinates = data.entities[ID].claims.P625[0];
      
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
      }
      else {
        return false;
      }
      
      
      return [entityCoordinates, typeOfSettlement, population]; 
    } catch(e) {
      console.log(e, e.response)
    }
  }

  async function getCity() {
    try {
      var [ID, name] = await getId(guessValue);
      var data = await getData(ID, name);
      console.log(data);
      return [data, name];
    } catch (error) {
      console.error(error);
    }
  }
      
  async function plopCity() {
    try {
      var [data, name] = await getCity();
      if (data === false) {
        console.log("BAD GUESS");
        return false
      }
      else {
        var [entityCoordinates, typeOfSettlement, population] = data;
        console.log(entityCoordinates);
        var guess = {
          "Name": name,
          "Population": population,
          "TypeOfSettlement": typeOfSettlement,
          "Latitude": entityCoordinates.mainsnak.datavalue.value.latitude,
          "Longitude": entityCoordinates.mainsnak.datavalue.value.longitude
        }
        marker = new L.marker([entityCoordinates.mainsnak.datavalue.value.latitude, entityCoordinates.mainsnak.datavalue.value.longitude]);
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
      console.log(guess);
      const entityName = document.createElement("div");
      entityName.textContent = guess.Name;
      const entitiesNames = document.getElementById("entities-names");
      entitiesNames.appendChild(entityName);
    } catch (error) {
      console.error(error);
    }
  }

  writeStats();
  document.getElementById("form").reset();
  }
});