const fs = require('fs');
const CliTable = require('cli-table3');

const supportedExcelFileExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb', 'xltx', 'xltm', 'csv', 'xml', 'ods'];

class BuilderExcel {
  constructor() {
    this.workbook = new Map();
    this.formulaMap = new Map([
      ['SUM', this.calculateSum.bind(this)],
      ['AVERAGE', this.calculateAverage.bind(this)],
      ['STDEV', this.calculateStandardDeviation.bind(this)],
      ['COUNT', this.calculateCount.bind(this)],
      ['MIN', this.calculateMinimum.bind(this)],
      ['MAX', this.calculateMaximum.bind(this)],
    ]);
  }

  getFileExtension(filePath) {
    return filePath.slice(((filePath.lastIndexOf(".") - 1) >>> 0) + 2);
  }

  getWorkSheet() {
    return [...this.workbook.entries()];
  }

  setCellValue(cellKey, value) {
    this.workbook.set(cellKey, value);
  }

  getCellValue(cellKey) {
    return this.workbook.get(cellKey);
  }

  parseRowWithQuotes(row) {
    const columns = [];
    let currentCell = '';
    let withinQuotes = false;

    for (const char of row) {
      if (char === ',' && !withinQuotes) {
        columns.push(currentCell.trim());
        currentCell = '';
      } else if (char === '"') {
        withinQuotes = !withinQuotes;
      } else {
        currentCell += char;
      }
    }

    columns.push(currentCell.trim());
    return columns;
  }

  parseCSVData(data) {
    const rows = data.split('\n');
    const parsedRows = rows.map(row => {
      if (row.includes('"')) {
        return this.parseRowWithQuotes(row);
      } else {
        return row.split(',').map(cellValue => cellValue.trim());
      }
    });

    return parsedRows;
  }

  readExcelFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return 'File does not exist.';
    }

    const fileExtension = this.getFileExtension(filePath);

    if (!supportedExcelFileExtensions.includes(fileExtension)) {
      return 'File type not supported in excel';
    }

    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const rows = this.parseCSVData(data);

      rows.forEach((row, rowIndex) => {
        row.forEach((cellValue, columnIndex) => {
          const columnLabel = this.columnEncoding(columnIndex);
          const cellKey = columnLabel + (rowIndex + 1);
          this.setCellValue(cellKey, cellValue.trim());
        });
      });

      return 'File read';
    } catch (err) {
      console.error('Error reading the file:', err.message);
      return 'Error reading the file';
    }
  }

  isExcelFile(filePath) {
    return supportedExcelFileExtensions.includes(this.getFileExtension(filePath));
  }

  result() {
    const table = new CliTable({
      head: ['Cell Key', 'Cell Value'],
      chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '', 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '', 'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '', 'right': '', 'right-mid': '', 'middle': '' },
    });

    const rows = this.getWorkSheet();
    table.push(...rows);

    console.log('\x1b[36m', 'Processed Data:');
    console.log(table.toString());
  }

  formulaBuild() {
    this.workbook.forEach((cellValue, cellKey) => {
      if (cellValue.startsWith('=')) {
        const formulaBuilder = new BuilderExcel.CustomBuilder(this, cellValue);
        const result = formulaBuilder.build();
        this.setCellValue(cellKey, result);
      }
    });
  }

  calculateSum(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let sum = 0;
    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        const numericValue = parseFloat(cellValue);

        if (!isNaN(numericValue)) {
          sum += numericValue;
        }
      }
    }
    return sum;
  }

  calculateAverage(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let sum = 0;
    let count = 0;

    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        const numericValue = parseFloat(cellValue);

        if (!isNaN(numericValue)) {
          sum += numericValue;
          count += 1;
        }
      }
    }

    if (count === 0) {
      return 0;
    }

    return sum / count;
  }

  calculateStandardDeviation(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let values = [];

    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        const numericValue = parseFloat(cellValue);

        if (!isNaN(numericValue)) {
          values.push(numericValue);
        }
      }
    }

    if (values.length <= 1) {
      return 0;
    }

    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / (values.length - 1);
    const standardDeviation = Math.sqrt(variance);

    return standardDeviation;
  }

  calculateCount(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let count = 0;

    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        count += 1;
      }
    }
    return count;
  }

  columnDecoding(columnLabel) {
    let columnNumber = 0;
    for (let i = 0; i < columnLabel.length; i++) {
      const char = columnLabel.charAt(i);
      const positionValue = char.charCodeAt(0) - 65;
      columnNumber = columnNumber * 26 + (positionValue + 1);
    }

    return columnNumber - 1;
  }

  checkRange(range) {
    let [startCellKey, endCellKey] = range;
    const startColumnIndex = this.columnDecoding(startCellKey.slice(0, -1));
    const endColumnIndex = this.columnDecoding(endCellKey.slice(0, -1));
    const startRowIndex = parseInt(startCellKey.slice(-1));
    const endRowIndex = parseInt(endCellKey.slice(-1));
    return [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex];
  }

  callFunction(calc, range) {
    const formulaFunction = this.formulaMap.get(calc);

    if (formulaFunction) {
      return formulaFunction(range);
    } else {
      return 'Unsupported function';
    }
  }

  getParams(formula) {
    let calc, range = [];
    if (formula.startsWith('=')) {
      if (formula.split('=')[1].split(' ')[0] === 'IF') {
        let condition = formula.split('(')[1].split(')')[0];
        return this.getIFCondition(condition);
      }
      calc = formula.split('=').pop().split('(')[0];
      range = formula.split('(')[1].split(')')[0].split(':');

      if (calc === 'IF') {
        return this.getIFCondition(range);
      } else {
        return this.callFunction(calc, range);
      }
    } else {
      return 'Formulas should start with "=".';
    }
  }
 
  columnEncoding(columnNumber) {
    let columnLabel = '';
    while (columnNumber >= 0) {
      columnLabel = String.fromCharCode(65 + (columnNumber % 26)) + columnLabel;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    }
    return columnLabel;
  }

  calculateMinimum(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let minValue = Number.MAX_VALUE;

    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        const numericValue = parseFloat(cellValue);

        if (!isNaN(numericValue)) {
          minValue = Math.min(minValue, numericValue);
        }
      }
    }
    if (minValue == Number.MAX_VALUE) {
      return 0;
    }
    return minValue;
  }

  calculateMaximum(range) {
    let [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex] = this.checkRange(range);
    let maxValue = Number.MIN_VALUE;

    for (let j = startColumnIndex; j <= endColumnIndex; j++) {
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cellKey = this.columnEncoding(j) + i;
        const cellValue = this.getCellValue(cellKey);
        const numericValue = parseFloat(cellValue);

        if (!isNaN(numericValue)) {
          maxValue = Math.max(maxValue, numericValue);
        }
      }
    }
    if (maxValue == Number.MIN_VALUE) {
      return 0;
    }
    return maxValue;
  }

  getIFCondition(range) {

  const [condition, trueValue, falseValue] = range[0].split(',').map(item => item.trim().replace(/^"(.*)"$/, '$1'));
  
    if (this.getCondition(condition)) {
      return trueValue;
    } else {
      return falseValue;
    }
  }

  getCondition(condition) {
    const [leftOperand, operator, rightOperand] = condition.split(/([=<>]+)/).map(item => item.trim());

    const leftValue = this.getCellValue(leftOperand);
    const rightValue = this.getCellValue(rightOperand);

    if (leftValue === undefined || rightValue === undefined) {
      return false;
    }

    switch (operator) {
      case '=':
        return leftValue === rightValue;
      case '>':
        return leftValue > rightValue;
      case '<':
        return leftValue < rightValue;
      default:
        return false;
    }
  }


  static CustomBuilder = class FormulaBuilder {
    constructor(excelInstance, formulaName) {
      this.excelInstance = excelInstance;
      this.formulaName = formulaName;
      this.parameters = [];
    }

    addParameter(parameter) {
      const newInstance = new BuilderExcel.CustomBuilder(this.excelInstance, this.formulaName);
      newInstance.parameters = [...this.parameters, parameter];
      return newInstance;
    }

    

    build() {
      const formula = `${this.formulaName}(${this.parameters.join(',')})`;
      return this.excelInstance.getParams(formula);
    }
  };
}

const builder = new BuilderExcel();
const filePath = './Orders.csv';

const customExcelFileExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb', 'xltx', 'xltm', 'csv'];

if (fs.existsSync(filePath) && customExcelFileExtensions.includes(builder.getFileExtension(filePath))) {
  builder.readExcelFile(filePath);
  builder.formulaBuild();
  builder.result();
} else {
  console.log('Unsupported file type!');
}


module.exports = BuilderExcel;
