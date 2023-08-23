# GuessPolishCities

Geographical quiz game created with Leaflet.js and MediaWiki Action Ap.

## Technology

*HTML
*Webpack
*JavaScript
*CSS

## `guessFunction()`

Main function responsible for handling all the procesess needed to fetch the data, evaluate the guess and display statistics.

## Overview of the major functions

- `getData(ID)` : a function that fetches the data about the city using ID retrieved from the search in API (see `getId(guessValue)` function in modules) and then evaluated the guess, segregates the data and places it in the adequate variables.
- `getCity` : is a function that calls the `getId(guessValue)` functions and retrieves the ID of an element guessed by the user. Then it calls the function `getData()` passing to it the variable ID and retrieves the variables containing more data about the guessed city.
- `plopCity()` : it calls the function `getCity()`, retrieves the data and uses it to plop the markers onto a map, display core statistics on them and then creates new `guess` object containing those core statistics and pushes it into the array `guesses` containing all the previous guesses made by the user.
- `writeStats()` : this function calls the `plopCity()` function and uses the returned `guess` object and `guesses` array to create new divs on the html page which display more statistics about the guessed cities.

## Overview of the modules

### `data-processing-functions.js`

- `getNumber(string)`: it is a function that takes a string, removes the first character (in the case of this project it is a "+" sign) and converts it into a number.
- `getPercentage(population, poland, guessPop, stats)` : it takes in the data about the population of the guessed city and the population of all previously guessed cities and sums it up, then it divides it by the population of Poland and gives you the percentage. Lastly, it displays this information below the map.

### `getid.js`

- `getId(guesssValue)` : it takes in the guess mmade by the user and uses it in the flexible search in the wikibase database. Then it returns the ID of the first entity that comes up in the search.

### `getpoland.js`

- `getPoland()` : it fetches the current population of Poland and returns it as a number.

### `guess-evaluate-functions.js`

- `checkGuess(name, guesses)` : checks if the entity guessed by the user was guessed before and if it were, it returns false.
- `getType(entityType, data, ID)` : checks the type of the entity (is i a village, a city etc.) and returns it.
- `getCountry(entityCountry)` : checks if the entity is currently part of Poland.
- `getPopulation(entityPop)` : checks the current population of the guessed entity and returns it.

### `sorting-functions.js`

- `sortBiggest(arr)` : sorts the array from biggest to smallest in terms of population.
- `sortSmallest(arr)` : sorts the array from smallest to biggest in terms of population.

## Project Scripts

### **_Install dependencies by `npm i webpack` and `npm i webpack-CLI`_**

### Production Build - `npm run build`

## Copyright and licensing

- Data from Wikidata is licensed under a Creative Commons CC0
- Maps from OpenStreetMap are available under the Open Data Commons Open Database License
- The Map pin icon.svg is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License
