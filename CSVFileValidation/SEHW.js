const numbers = [1, 2, 3, 4, 5];
let runningTotal = 0;

const cumulativeSumArray = numbers.map((value) => {
  runningTotal += value;
  return runningTotal;
});

console.log(cumulativeSumArray); 