export default async function getPoland(getNumber) {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=Q36&props=references&formatversion=2&origin=*`
    const res = await fetch(url);
    const data = await res.json();
    const populations = data.claims.P1082;
    for (let i = 0; i < populations.length; i++){
      if (populations[i].rank ==='preferred') {
        var polandString = populations[i].mainsnak.datavalue.value.amount;
        var poland = getNumber(polandString);
      }
    }
    return poland;
    
  } catch(e) {
    console.log(e);
  }
}