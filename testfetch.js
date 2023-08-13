async function getId() {
  try {
    const url = `https://www.wikidata.org/w/api.php?action=query&prop=label&list=search&srsearch=Zielona Góra haswbstatement:P31=Q515|P31=Q3558970|P31=Q2616791|P31=Q925381|P31=Q15334&format=json&prop=pageterms&wbptterms=label|alias&wbptlanguage=en&origin=*`;
    const res = await fetch(url)
    const data = await res.json();
    console.log(data);
    //console.log(data.search[0].id)
    console.log(data.query.search[0].title);
  } catch(e) {
    console.log(e, e.response)
  }
}
getId();


/* SpeechRecognitionAlternativen
WebGLContextEventnn

PerformanceNavigationTiming */