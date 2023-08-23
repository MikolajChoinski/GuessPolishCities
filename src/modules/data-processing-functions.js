export function getNumber(string) {
  let stringSlice = string.slice(1);
  let sliceNumber = parseInt(stringSlice);
  return sliceNumber;
}

export function getPercentage(population, poland, guessPop, stats) {
  guessPop = guessPop + population;
  let fraction = guessPop * 100 / poland;
  let percentage = fraction.toFixed(2);
  stats.textContent = "You guessed the population of " + guessPop + " out of " + poland + " people living in Poland   (" + percentage + "%) ";
  return guessPop;
}