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




// Set up the API request


// Send the request
// Replace 'YOUR_USERNAME' with your GeoNames username




/* async function getCity() {
  
  const settings = {
    headers: {
    'Content-Type': 'application/json',
    'Authorization' : 'Bearer ',

  }
}

try {
  const response = 	await fetch(`https://wikidata.org/w/rest.php/wikibase/v0/entities/items/Q270`);
  const object = await response.json();
  console.log(object);
} catch (e) {
    return e;
}

};

getCity(); */

/* async function getCity() {

  const url = 'https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/Q270s' ;

  const response = await fetch(url, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer yJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJlMjQwN2FlZWE1MjRlY2ViZWJlM2MxMzkxNWVmZjY4YiIsImp0aSI6ImRkODVlZTg5Y2E2MWM2ZWM0OTI3NTIwYzhhYzU5OWY0YjAzOTIyZmI2MzhkNDVkZTMwYTAzYWUyNGQ2MjNlODZlNmNmYzFlMzRiNTA5M2NjIiwiaWF0IjoxNjg3OTUzMDAwLjA4NzIzNiwibmJmIjoxNjg3OTUzMDAwLjA4NzIzOSwiZXhwIjozMzI0NDg2MTgwMC4wODIzNiwic3ViIjoiNzMxODAzMTEiLCJpc3MiOiJodHRwczovL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.P14Im-w0lkv9N0YWkZUOpjhCE4hwVz71i3TkS7A-R2mE3UepDs9RU9ojBDEXd8jPwJdyCI056TNdcL2DJ1uORQMOSA0qiumn91ZXcPracB-cBEAFyNDikvqX_857JbBMX79j6W7z9vXhLB3k7mweEZTqUMmAa5Edsw--Gt8d-CTnKN-f7H9fFkpEOuTX3ymhwTViS6WV0hBbhjKaG8HjVJSLBYzUFHg3mpUK7WqxQEWUwH3IxOwwHO-nQTQorv7ofj2w2H4mN-iufEFmRfuXIjHFjTmK_l51PHPV5ask0oMDFEOggkaVFE2XR0tdM6Ly3qLeq2P4x5qaKndu1_byiPnNoEsffkzrMoaFFtmGAGWl5NchnT5MvvIkBkfRXFLtvsdQd1zs-GpwlxcvETt7ppfdCigeJvo-W2LX-KcGp7wj5fszlJuk7I91uj3zZxdez7alV1A2cXKTjF2jEiSRuyZFjNVy73MWWxUKNS73C3617JvCu-5q9dL3Tbbljkr3RdUXswwnvfp7bnd72dkRdJXhP9LgrwAbr3h2SYod-n-7Qxzt4vT_l8RG7t0iIVJzLAzkIXtOgARsYopviVkaiNIq-21BViEFOx-dFocC4-Y2i8aPKnxbjXg9eNE1yxHw75wBiQUjWNCKVV6DH3wjFdlw55TVtJ54LPQZI8_i1XM',
      },
  });

  const text = await response.text();

  console.log(text);

}

getCity()
 */


async function getPoland() {

  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=Q36&origin=*`;
    const res = await fetch(url)
    const data = await res.json();
    console.log(data)
    console.log(data.entities.Q36.claims.P1082);
    console.log(data.entities.Q36.claims.P625);
    console.log(data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.latitude);
    marker = new L.marker([data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.latitude, data.entities.Q36.claims.P625[0].mainsnak.datavalue.value.longitude]);
    marker.addTo(myMap);
    const populations = data.entities.Q36.claims.P1082;
    for (let i = 0; i < populations.length; i++){
      if (populations[i].rank=='preferred') {
        console.log(populations[i].mainsnak.datavalue.value.amount);
      }
    }
  } catch(e) {
    console.log(e, e.response)
  }
}

getPoland();





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
        const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${ID}&origin=*`;
        const res = await fetch(url);
        const data = await res.json();
        const object = data.entities[ID].claims.P1082;
        marker2 = new L.marker([data.entities[ID].claims.P625[0].mainsnak.datavalue.value.latitude, data.entities[ID].claims.P625[0].mainsnak.datavalue.value.longitude]);
        marker2.addTo(myMap);
        for (let i = 0; i < object.length; i++) {
          if (object[i].rank === 'preferred') {
            const population = object[i].mainsnak.datavalue.value.amount;
            console.log(population);
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