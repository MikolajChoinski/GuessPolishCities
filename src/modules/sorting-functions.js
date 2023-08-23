export function sortBiggest(arr) {
  const sortedArray = arr.slice(); // Create a copy of the input array
  for (let i = 1; i < sortedArray.length; i++) {
      const currentElement = sortedArray[i];
      let j = i - 1;
      
      while (j >= 0 && sortedArray[j].Population < currentElement.Population) {
          sortedArray[j + 1] = sortedArray[j];
          j--;
      }
      sortedArray[j + 1] = currentElement;
  }
  return sortedArray;
}
  
export function sortSmallest(arr) {
  const sortedArray = arr.slice(); // Create a copy of the input array
  for (let i = 1; i < sortedArray.length; i++) {
      const currentElement = sortedArray[i];
      let j = i - 1;

      while (j >= 0 && sortedArray[j].Population > currentElement.Population) {
          sortedArray[j + 1] = sortedArray[j];
          j--;
      }
      sortedArray[j + 1] = currentElement;
  }
  return sortedArray;
}