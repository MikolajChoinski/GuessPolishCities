// Functions needed to evaluate users guess in the getData function

export function checkGuess(name, guesses) {
  let guessTrue;
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

export function getType(entityType, data, ID) {
  let typeOfSettlement;
  let typeTrue;
  let entityTypeId;
  for (let i = 0; i < entityType.length; i++) {
    entityTypeId = data.entities[ID].claims.P31[i].mainsnak.datavalue.value.id;
    if (entityTypeId === "Q515" || entityTypeId === "Q2616791" || entityTypeId === "Q925381" || entityTypeId === "Q15334" ) {
      typeOfSettlement = "city";
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

export function getCountry(entityCountry) {
  let countryTrue;
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

export function getPopulation(entityPop) {
  let population;
  for (let i = 0; i < entityPop.length; i++) {
    console.log(entityPop.length);
    if (entityPop[i].rank === "preferred") {
      population = entityPop[i].mainsnak.datavalue.value.amount;
      break;
    }
    else if (entityPop.length === 1) {
      population = entityPop[i].mainsnak.datavalue.value.amount;
      break;
    } else if (entityPop.length > 1 && !entityPop.includes(entityPop.rank=== "preferred")) {
      population = entityPop[0].mainsnak.datavalue.value.amount;
      break;
    }
    
  }
  return population;
}
