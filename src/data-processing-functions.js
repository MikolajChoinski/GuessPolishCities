export function getNumber(string) {
  var stringSlice = string.slice(1);
  var sliceNumber = parseInt(stringSlice);
  return sliceNumber;
}

export function getPercentage(population, poland, guessPop, stats) {
  console.log(guessPop);
  console.log(population);
  guessPop = guessPop + population;
  console.log(guessPop);
  var fraction = guessPop * 100 / poland;
  var percentage = fraction.toFixed(2);
  stats.textContent = "You guessed the population of " + guessPop + " out of " + poland + " people living in Poland   (" + percentage + "%) ";
  return guessPop;
}