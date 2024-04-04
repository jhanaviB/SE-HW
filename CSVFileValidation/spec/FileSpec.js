/*import { csvFileEmpty,columnWidth,printFormat } from "../src/File2.js"*/

import { csvFileEmpty, noRows, columnWidth, printFormat,formatWrong } from '../src/CSV.js';
let courierStyle;
let resetStyle;

beforeAll(() => {
  courierStyle = '\x1b[0;30;36m'; 
  resetStyle = '\x1b[0m'; 
});

  /*Checking to see if file is empty*/
  describe('csvFileEmpty', () => {
    
    it('Returns true when rows are not empty', () => {
      const rows = ['Row 1', 'Row 2', 'Row 3'];
      const result = csvFileEmpty(rows);
      expect(result).toBe(true);
    });
    it('Returns false when rows are empty', () => {
        const rows = [];
        const result = csvFileEmpty(rows);
        expect(result).toBe(false);
      });
    
  });

  /*Program to check if all data rows are not empty*/
    describe('noRows', () => {
    it('should return true when there are non-empty rows', () => {
      const rows = ['Row 1', 'Row 2', 'Row 3'];
      const result = noRows(rows);
      expect(result).toBe(true);
    });  
    it('should return false when all rows are empty', () => {
      const rows = ['', '', ''];
      const result = noRows(rows);
      expect(result).toBe(false);  
    });
  
    it('should return true when there are mixed empty and non-empty rows', () => {
      const rows = ['', 'Row 1', '', 'Row 2'];
      const result = noRows(rows);
      expect(result).toBe(true);
    });
  });
  
  //Should give maximum column width for each row correctly
  describe('columnWidth', () => {
    it('should calculate column widths correctly', () => {
      const headers = ['Header1', 'Header2', 'Header3'];
      const rows = ['First,Second,Third','FirstFirstFirst,SecondSecondSecond,ThirdThird','third,third,third'];
  
      const result = columnWidth(headers, rows);
      expect(result).toEqual([15, 18, 10]); 
    });
  });

  //Should format correctly

  describe('printFormat', () => {
    it('should format rows and columns correctly', () => {
      const rows = [
        'First,Second,Second',
        'First,Second,Second',
        'First,Second,Second'
      ];
      const colWidth = [5,6,6];
  
      const result = printFormat(rows, colWidth);
      const expectedOutput =
        `${courierStyle}First  Second  Second${resetStyle}\n` +
        `${courierStyle}First  Second  Second${resetStyle}\n`+
        `${courierStyle}First  Second  Second${resetStyle}\n`;
  
      expect(result).toEqual(expectedOutput);    
    });
  });

  describe('formatWrong',() => {
    it('if column width smaller than 100 formatting will not be wrong', () => {
      const headers = [
        'First,Second,Second'];
        const rows = [
          'First,Second,Second',
          'First,Second,Second',
          'First,Second,Second'
        ]; 
      let val=true;
      const result = [5,6,6];
      val = formatWrong(result);
      expect(val).toEqual(true);
      });

      it('if column width greater than 100 formatting will be wrong', () => {
        const headers = [
         '','',''];
          const rows = [
            'a'.repeat(100),'','',
            'First,Second,Second',      
            'First,Second,Second'
          ]; 
        let val=true;
        const result = [100,6,6]
        val = formatWrong(result);
      expect(val).toEqual(true);
      });

  });
  

          