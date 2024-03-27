const fs = require('fs');
const BuilderExcel = require('../../CSVBuilder.js');


describe('Builder functions', () => {
  let builder;

  beforeEach(() => {
   builder = new BuilderExcel();
  });

  it('Workbook should be empty at the beginning', () => {
    expect(builder.getWorkSheet()).toEqual([]);
  });

  it('Should create csv file if does not exist and add data', () => {
    const filePath = '../Test.csv'; 
    fs.writeFileSync(filePath, '11,14,33\n321,23,33');

    const result = builder.readExcelFile(filePath);
    expect(result).toEqual('File read');
    expect(builder.getWorkSheet()).toEqual([
      ['A1', '11'],
      ['B1', '14'],
      ['C1', '33'],
      ['A2', '321'],
      ['B2', '23'],
      ['C2', '33'],
    ]);

    fs.unlinkSync(filePath);
  });

  it('If file does not exist, should give error', () => {
    const result = builder.readExcelFile('Test2.xlsx');
    expect(result).toEqual('File does not exist.');
  });

  it('Should throw unsupported file error', () => {
    const filePath = '../../Read.txt';
    fs.writeFileSync(filePath, 'text content');

    const result = builder.readExcelFile(filePath);
    expect(result).toEqual('File type not supported in excel');

    fs.unlinkSync(filePath);
  });


  it('Check to see if cell values are read correctly', () => {
    builder.setCellValue('A1', '42');
    expect(builder.getCellValue('A1')).toEqual('42');
  });

  it('should correctly calculate SUM over column', () => {
    builder.setCellValue('A1', '3');
    builder.setCellValue('A2', '5');
    builder.setCellValue('A3', '=SUM(A1:A2)');

    builder.formulaBuild();
    expect(builder.getCellValue('A3')).toEqual(8);
  });

  it('should correctly calculate SUM over row', () => {
    builder.setCellValue('A1', '3');
    builder.setCellValue('B1', '5');
    builder.setCellValue('C1', '=SUM(A1:B1)');

    builder.formulaBuild();
    expect(builder.getCellValue('C1')).toEqual(8);
  });

  it('Check for evaluating IF condition properly', () => {
    builder.setCellValue('A1', '3');
    builder.setCellValue('A2', '2');
    builder.setCellValue('A3', '=IF(A1>A2, "Yes", "No")');

    spyOn(builder, 'getCondition').and.returnValue(true); 
    builder.formulaBuild();

    expect(builder.getCellValue('A3')).toEqual('Yes');
  });

  it('Should give error when invalid formula present', () => {
    builder.setCellValue('A1', '=SUMM(A1)');
    builder.formulaBuild();
    expect(builder.getCellValue('A1')).toEqual('Unsupported function');
  });

  it('should display the workbook', () => {
    builder.setCellValue('A1', '42');
    builder.setCellValue('B1', '=A1*2');

    spyOn(console, 'log');
    builder.result();
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle an empty CSV file', () => {
    const filePath = '../../empty.csv';
    fs.writeFileSync(filePath, '');

    const result = builder.readExcelFile(filePath);
    expect(result).toEqual('File read');
    fs.unlinkSync(filePath);
  });

  it('CSV file with only headers should not give error', () => {
    const filePath = '../../headers.csv';
    fs.writeFileSync(filePath, 'Name, Age, Country');

    const result = builder.readExcelFile(filePath);
    expect(result).toEqual('File read');
    expect(builder.getWorkSheet()).toEqual([
      ['A1', 'Name'],
      ['B1', 'Age'],
      ['C1', 'Country'],
    ]);

    fs.unlinkSync(filePath);
  });

  it('Testing SUM() function', () => {
    builder.setCellValue('A1', '-2');
    builder.setCellValue('A2', '5');
    builder.setCellValue('A3', '=SUM(A1:A2)');

    builder.formulaBuild();
    expect(builder.getCellValue('A3')).toEqual(3);
  });

  it('Test of SUM() with many rows and columns', () => {
    const numRows = 1000;
    const numColumns = 26;

    for (let i = 1; i <= numRows; i++) {
      for (let j = 1; j <= numColumns; j++) {
        builder.setCellValue(`${String.fromCharCode(64 + j)}${i}`, '1');
      }
    }

    builder.setCellValue('AA1', '=SUM(A1:Z1000)');

    builder.formulaBuild();
    expect(builder.getCellValue('AA1')).toEqual(0);
  });

  it('should handle zero numeric values in SUM calculation', () => {
    builder.setCellValue('A1', '0');
    builder.setCellValue('A2', '=SUM(A1:A1)');

    builder.formulaBuild();

    const result = builder.getCellValue('A2');
    expect(result).toEqual(0);
});

it('should handle empty cells in SUM calculation', () => {
  builder.setCellValue('A1', '');
  builder.setCellValue('A2', '=SUM(A1:A1)');

  builder.formulaBuild();
  expect(builder.getCellValue('A2')).toEqual(0);
});

it('should handle nested formulas', () => {
  builder.setCellValue('A1', '2');
  builder.setCellValue('A2', '3');
  builder.setCellValue('A3', '=SUM(A1:A2)');
  builder.setCellValue('A4', '=SUM(A2:A3)');

  builder.formulaBuild();
  expect(builder.getCellValue('A4')).toEqual(8);
});

});
