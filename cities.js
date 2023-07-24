const form = document.querySelector(".guess input");
const input = document.querySelector(".guess input");
const guesses = [];




const myMap = L.map('map').setView([52, 19.25], 6);


/*const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);*/

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

CartoDB_PositronNoLabels.addTo(myMap)







async function getBeta(){
  

try {
  const url = `https://query.wikidata.org/sparql?query=SELECT%20?dob%20WHERE%20{wd:Q42%20wdt:P569%20?dob.}`;
  
  const res = await fetch(url);
  const data = await res.text();
  
  console.log(data);
} catch (error) {
  console.error('Error executing SPARQL query:', error);
}
};

//getBeta();

async function getPoland() {

  const SPARQL = `SELECT ?instanceof ?instanceofLabel WHERE {
    wd:Q36 wdt:P1082 ?instanceof.
    SERVICE wikibase:label {
     bd:serviceParam wikibase:language 'en' .
    }
  }`;
  try {
    
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=Q36&formatversion=2&origin=*`;
    //const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=Q36&props=references&formatversion=2&origin=*`;
    //const url = `https://query.wikidata.org/sparql?query=${SPARQL}`;
    const res = await fetch(url)
    const data = await res.json();
    console.log(data)
    //console.log(data.entities.Q36.claims.P1082);
    //console.log(data.entities.Q36.claims.P625);
    //console.log(data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.latitude);
    //marker = new L.marker([data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.latitude, data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.longitude]);
    //marker.addTo(myMap);
    //const populations = data.entities.Q36.claims.P1082;
    //for (let i = 0; i < populations.length; i++){
      //if (populations[i].rank=='preferred') {
        //console.log(populations[i].mainsnak.datavalue.value.amount);
      //}
    //}
  } catch(e) {
    console.log(e, e.response);
  }
}

//getPoland();





form.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
  event.preventDefault();
  var guessValue = input.value;
  
    
    async function getName() {

      try {
        const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=pl&search=${ guessValue }&origin=*`;
        const res = await fetch(url)
        const data = await res.json();
        console.log(res)
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
        const object = data.entities[ID].claims.P1082;
        const entityType = data.entities[ID].claims.P31;
        const entityCountry = data.entities[ID].claims.P17;
        var Type = 0;
        for (let i = 0; i < object.length; i++) {
          if (object[i].rank === 'preferred') {
            var population = object[i].mainsnak.datavalue.value.amount;
            console.log(population);
          }
          else if (object.length = 1) {
            var population = object[i].mainsnak.datavalue.value.amount;
          }
        }
          
        for (let i = 0; i < entityType.length; i++) {
          if (entityType[i].mainsnak.datavalue.value.id === 'Q515' || entityType[i].mainsnak.datavalue.value.id === 'Q3558970' || entityType[i].mainsnak.datavalue.value.id === 'Q2616791' || entityType[i].mainsnak.datavalue.value.id === 'Q925381' ) {
            console.log(entityType[i].mainsnak.datavalue.value.id);
            Type = 1;
            console.log(Type);
            break;
          }
        }
        for (let i = 0; i < entityCountry.length; i++) {
          if ((entityCountry[i].rank === 'preferred' && entityCountry[i].mainsnak.datavalue.value.id === 'Q36' && Type == 1) || (Type == 1 &&  entityCountry[i].mainsnak.datavalue.value.id === 'Q36'))   {
            marker2 = new L.marker([data.entities[ID].claims.P625[0].mainsnak.datavalue.value.latitude, data.entities[ID].claims.P625[0].mainsnak.datavalue.value.longitude]);
            marker2.addTo(myMap);
            const guess = {
              Population: population
            };
            guesses.push(guess);
            console.log(guesses);
            break;
          }
        }

      } catch(e) {
        console.log(e, e.response)
      }
    }
    
    async function getCity() {
      try {
        const data = await getName();
        await getData(data);
      } catch (error) {
        console.error(error);
      }
      
    }
  
  getCity();
  }
});