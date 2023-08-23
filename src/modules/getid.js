export default async function getId(guessValue) {
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