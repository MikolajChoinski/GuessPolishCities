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

form.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
  event.preventDefault();
  var guessValue = input.value;
  
    
  async function getID(guessValue) {
    try {
      const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=pl&search=${ guessValue }&origin=*`;
      const res = await fetch(url)
      const data = await res.json();
      console.log(data);
      console.log(data.search[0].id)
      const ID = data.search[0].id;
      return ID;
    } catch(e) {
      console.log(e, e.response)
    }
  }

  async function getData(ID) {
    try {
      const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${ID}&origin=*`; //use later wbgetclaims
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      var entityType = data.entities[ID].claims.P31;
      var entityPop = data.entities[ID].claims.P1082;
      var entityCountry = data.entities[ID].claims.P17;
      var entityCoordinates = data.entities[ID].claims.P625;
      
      function getType(entityType) {
        var typeOfSettlement;
        var typeTrue;
        for (let i = 0; i < entityType.length; i++) {
          var entityTypeId = data.entities[ID].claims.P31[i].mainsnak.datavalue.value.id;
          console.log(entityTypeId);
          if (entityTypeId === "Q515" || entityTypeId === "Q3558970" || entityTypeId === "Q2616791" || entityTypeId === "Q925381" ) {
            if (entityTypeId === "Q515" || entityTypeId === "Q2616791" || entityTypeId === "Q925381" ) {
              typeOfSettlement = "city";
              console.log(typeOfSettlement);
              typeTrue = true;
              //return [typeOfSettlement, typeTrue];
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
      var [typeOfSettlement, typeTrue] = getType(entityType);
      console.log(typeTrue);
      if (typeTrue === true) {
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
        var countryTrue = getCountry(entityCountry);
      }
      else {
        return false;
      }
      console.log(countryTrue)  
      if (countryTrue === true) {
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
        var population = getPopulation(entityPop);
      }
      else {
        return false;
      }

      console.log(population);
      var name = guessValue;
      console.log(guessValue);
      return [entityCoordinates, typeOfSettlement, population, name]
    } catch(e) {
      console.log(e, e.response)
    }
  }

      async function getCity() {
        try {
          const ID = await getID(guessValue);
          var data = await getData(ID);
          console.log(data);
          return data;
        } catch (error) {
          console.error(error);
        }
      }
      var newData = getCity();
      console.log(newData);
  }
});