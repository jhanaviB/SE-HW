import {ArrayStats} from '../src/AverageStandardDev.js';

let myArray=0;
let average = 0;
beforeAll(() => {
    myArray = new ArrayStats(7, 11, 5, 14); 
    average = myArray.average();
  });

/* Test to check if average works correctly */
describe('average', () => {
    
    it('Returns true when average is correct', () => {
        expect(average).toBe(9.25);
    });
    it('Returns false when average is not correct', () => {
        expect(average).not.toEqual(9.3);
      });
    
  });
/*Test to check if standard deviation works correctly*/
describe('standard deviation', () => {
    
    it('Returns true when standard deviation is correct', () => {
        var stddev = myArray.stdev(average);
        expect(Number(stddev.toFixed(4))).toBe(3.4911);
    });
      
    it('Returns false when standard deviation is not correct', () => {
        var stddev = myArray.stdev(average);
        expect(Number(stddev.toFixed(4))).not.toEqual(3.4910);
      });
    
  });

