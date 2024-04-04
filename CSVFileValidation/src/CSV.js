import { promises as fs } from 'fs';
import { createInterface } from 'readline';

const courierStyle = '\x1b[0;30;36m';
const resetStyle = '\x1b[0m';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Asking for user input for file name

//Function to check if csv file is empty.
export function  csvFileEmpty(rows){
if (rows.length === 0) {
  //console.log(courierStyle + 'The CSV file is empty' + resetStyle);
  return false;
}
else
  return true;
}

export function columnHeaders(headers){
  if (headers.length === 0) {
    console.log(courierStyle+'No column headers!'+resetStyle);
    rl.close();
    return false;
  }
  else
  return true;
}

//No rows only column headers
export function noRows(rows){
  let count = 0
  const filteredArray = rows.filter(item => item !== '');
  for (let j=0;j<filteredArray.length;j++)
   {
    
    if (filteredArray[j].length ==0)
     count+=1   
   }
   if (count==filteredArray.length)
   {
    return false;
   }
   else 
   return true;
}

// Function for finding width of each column
export function columnWidth(headers,rows){
  const colWidth = new Array(headers.length).fill(0);
    //Putting initial values of column as header length
    for (let i = 0; i < headers.length; i++) {
      colWidth[i] = headers[i].length;
    }

    //Changing col width by iterating through loop again
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j].trim().split(',');
      if (row == '') {
        continue;
      }
      for (let k = 0; k < row.length; k++) {
        if (row[k].length > colWidth[k]) {
          colWidth[k] = row[k].length;
        }
      }
    }
  return colWidth;
}

export function formatWrong(result){
  const col_width = result;
  let val=true
      for (let j=0;j<result.length;j++) {
        if (result[j]>100)
          {return false;
         }
        }
        return true;

  }

export function printFormat(rows,colWidth){
  let formattedOutput=''
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim().split(',');

    if (row=='') {
      formattedOutput +=`${courierStyle}Row ${i} is empty${resetStyle}\n`;
      continue;
    }

    const rowData = row.map((cell, index) => {
      return cell.padEnd(colWidth[index],' ');
    });

    formattedOutput +=`${courierStyle}${rowData.join('  ')}${resetStyle}\n`;
  }
  return formattedOutput;
}

async function readFileName(file_path) {
  try {
    const data = await fs.readFile(file_path, 'utf8');
    return data; // Return the file contents if successful
  } catch (err) {
    console.error('Error reading the file:', err + resetStyle);
    return null; // Return null if file reading failed
  }
}
rl.question('Please enter the filename: ', async (user_file_path) => {
  const data = await readFileName(user_file_path);
    if (data !== null) {
      const rows = data.trim().split('\n');
      let val = csvFileEmpty(rows)
      if (val) {
      const headers = rows[0].trim().split(',');
      let val1 = columnHeaders(headers);
      if (val1) {
        let colWidth = columnWidth(headers,rows);
        const formattedoutput = printFormat(rows,colWidth);
        console.log(formattedoutput);
        let val1 = formatWrong(colWidth)
        if (!val1)
        {
          console.log("Formatting not proper")
        }
      }}}
        rl.close();
      });


/*
2. csv file is empty
3. Error reading the file
4. Column header is present but data is empty
5. Column data is too long and going outside page
*/