export class ArrayStats extends Array {     
 average() {  
let total = 0;
total = this.map(a=> total+=a);
const averageValue = total[this.length-1]/this.length;

Object.defineProperty(this, "avgVal", { 
    value: averageValue, // add new property of the array
    writable: true // set avgVal as immutable
    }); 

return averageValue; 
} 

stdev() { 
let stdev = 0;

if(this.avgVal===undefined)
myArray.average();
     
function mapperVariance(a) { 
stdev+= Math.pow((this.avgVal-a),2); 
return stdev;
}

const varianceVal = this.map( mapperVariance,this); 
const stdevValue = Math.sqrt( varianceVal[this.length-1]/ (this.length) ); 

return stdevValue; 
}}  


let myArray = new ArrayStats(7,11,18,3); 
console.log("The average is"+myArray.average())
console.log("The standard deviation is"+myArray.stdev()); 