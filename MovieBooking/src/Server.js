import http from 'http';
import querystring from 'querystring';
import xml2js from 'xml2js'; 
import url from 'url';
import mysql from 'mysql2';

const noResourceFound = new Error("No Resources found!")

const db = mysql.createConnection({
  host: 'localhost',
  user: 'jhanavi',
  password: 'createDB!',
  database: 'SE'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

function isValidJSON(jsonString) {
  try {
      JSON.parse(jsonString);
      return true;
  } catch (error) {
      return false;
  }
}

//Creating a record for a movie
function insertMovie(params, callback) {
   
  const expectedtableKeys = ['id', 'name', 'genre', 'director', 'release_date'];
  
  for (const key in params) {
    if (!expectedtableKeys.includes(key)) {
    //Trying to update resource based on parameters(s) that do not exist!
      return callback(451);
    }
  }
  const name = params.name,genre=params.genre,director=params.director,release_date=params.release_date;
  const query = `INSERT INTO movies (name, Genre, Director, Release_date) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, genre, director, release_date], (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results.insertId); 
  });
}


//Inserting multiple records into table
//Creating a record for a movie
function insertMovieMultiple(rows, callback) {
  for (let i=0;i<rows.length;i++)
  {insertMovie(rows[i],callback);
  }
}

/*Updating records
Takes conditionds on all parameters. New update values to be specified with new_name, new_genre, new_director,
new_release_date,new_id.
*/
function updateMovie(params, callback) {
  const expectedtableKeys = ['id', 'name', 'genre', 'director', 'release_date','new_id', 'new_name', 'new_genre', 'new_director', 'new_release_date'];
  
  for (const key in params) {
    if (!expectedtableKeys.includes(key)) {
    //Trying to update resource based on parameters(s) that do not exist!
      return callback(451);
    }
  }
  let query = 'UPDATE movies SET ';
  const { id,name,genre, director, release_date,new_id,new_name,new_genre,new_director,new_release_date } = params;
  
  //Update parameters 
  if (new_id||new_name||new_genre || new_director || new_release_date) {
    const parameters = [];

    if (new_genre!=undefined) {
      parameters.push(`Genre = "${new_genre}"`);
    }
    if (new_director!=undefined) {
      parameters.push(`Director = "${new_director}"`);
    }
    if (new_release_date!=undefined) {
      parameters.push(`Release_date = "${new_release_date}"`);
    }
    if (new_name!=undefined) {
      parameters.push(`name = "${new_name}"`);
    }
    if (new_id!=undefined) {
      parameters.push(`id = "${new_id}"`);
    }
    query += ` ${parameters.join(',')}`;
  }

  //Update conditions 
  if (id||name||genre || director || release_date) {
    query+=' WHERE '
    const conditions = [];

    if (genre!=undefined) {
      conditions.push(`Genre = "${genre}"`);
    }
    if (director!=undefined) {
      conditions.push(`Director = "${director}"`);
    }
    if (release_date!=undefined) {
      const parts = release_date.split('-');
      const sqlDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      conditions.push(`Release_date = "${sqlDate}"`);
    }
    if (name!=undefined) {
      conditions.push(`name = "${name}"`);
    }
    if (id!=undefined) {
      conditions.push(`id = "${id}"`);
    }
    query += ` ${conditions.join(' AND ')}`;
  }
  query+=';';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results);
  });
}

/*Deleting records
Takes conditionds on all parameters. 
*/
function deleteMovie(params, callback) {
  const expectedtableKeys = ['id', 'name', 'genre', 'director', 'release_date','new_id', 'new_name', 'new_genre', 'new_director', 'new_release_date'];
  
  for (const key in params) {
    if (!expectedtableKeys.includes(key)) {
      return callback(451);
      
    }
  }
  let query = 'DELETE from movies';
  const { id,name,genre, director, release_date} = params;

  //delete conditions 
  if (id||name||genre || director || release_date) {
    query+=' WHERE '
    const conditions = [];

    if (genre!=undefined) {
      conditions.push(`Genre = "${genre}"`);
    }
    if (director!=undefined) {
      conditions.push(`Director = "${director}"`);
    }
    if (release_date!=undefined) {
      const parts = release_date.split('-');
      const sqlDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
      conditions.push(`Release_date = "${sqlDate}"`);
    }
    if (name!=undefined) {
      conditions.push(`name = "${name}"`);
    }
    if (id!=undefined) {
      conditions.push(`id = "${id}"`);
    }
    query += ` ${conditions.join(' AND ')}`;
  }
  query+=';';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results);
  });
}

//Reading records from the table with optional parameters
function readMovies(params, callback) {
  const expectedtableKeys = ['id', 'name', 'genre', 'director', 'release_date','new_id', 'new_name', 'new_genre', 'new_director', 'new_release_date'];
  
  for (const key in params) {
    if (!expectedtableKeys.includes(key)) {
      return callback(451);

    }
  }
  let query = 'SELECT * FROM movies';
  const { id,name,genre, director, release_date } = params;

  if (id||name||genre || director || release_date) {
    query += ' WHERE';
    const conditions = [];

    if (genre!=undefined) {
      conditions.push(`Genre = "${genre}"`);
    }
    if (director!=undefined) {
      conditions.push(`Director = "${director}"`);
    }
    if (release_date!=undefined) {
      conditions.push(`Release_date = "${release_date}"`);
    }
    if (name!=undefined) {
      conditions.push(`name = "${name}"`);
    }
    if (id!=undefined) {
      conditions.push(`id = "${id}"`);
    }
    query += ` ${conditions.join(' AND ')}`;
  }
  query+=';';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results);
  });
}

//Adding seperate URL end points for safety.
          /*For reading url has /select. For update url has /update. For deleting url has /delete.
           For creating url has /insert
For create use GER and url http://localhost:2090/insert 
For delete use POST and url http://localhost:2090/delete 
For update use PUT and url http://localhost:2090/update 
For read use GET and url http://localhost:2090/select 


*/
const server = http.createServer((request, response) => {
  //For inserting records
  if (request.method === 'POST') {
    let content = '';
    
    request.on('data', (data) => {
        content += data;
    });

    request.on('end', () => {
      const contentType = request.headers['content-type'];
      const parsedUrl = url.parse(request.url);

      console.log(request)
      //Code to enter multiple rows at once in the table   
      if (contentType === 'application/json' && parsedUrl.pathname === '/insert') {
        content = JSON.parse(content);
        const extractedRows = []
        content.forEach((record) => {
          const id = record.id;
          const name = record.name;
          const genre = record.genre;
          const director = record.director;
          const release_date = record.release_date;  
        
          const row = { id, name, genre, director, release_date };
          extractedRows.push(row);
        });
          insertMovieMultiple(extractedRows, (err, insertId) => {
            if (err==451){
              response.statusCode = 451; //Attempting to modify non-existing resource custom code
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify("Attempting to insert values into column(s) that do not exist!"));
            }
            else if (err) {
              response.statusCode = 500;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ error: err.message }));
            }
            else if(response.statusCode==201){
              response.end(JSON.stringify({ message: 'Movies inserted successfully', insertId }));

            } else {
              response.statusCode = 201;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ message: 'Movie inserted successfully', insertId }));
            }
            
          });
      
      }
      else if (parsedUrl.pathname === '/insert') {   
        try {  
          const queryData = querystring.parse(parsedUrl.query);
          console.log('Received query data:', queryData); // Log the received JSON data
            insertMovie(queryData, (err, insertId) => {
              if (err==451){
                response.statusCode = 451; //Attempting to modify non-existing resource custom code
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify("Attempting to insert values into column(s) that do not exist!"));
                }
              else if (err) {
                response.statusCode = 500;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ error: err.message }));
              } else {
                response.statusCode = 201;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ message: 'Movie inserted successfully', insertId }));
              }
            });
          }
          catch (error) {
            response.statusCode = 400; //Bad Request Response
            response.setHeader('content-type', 'text/plain');
            response.end('Error: Invalid JSON format');
        }}
        else if (parsedUrl!=undefined && parsedUrl.length!=0){
          response.statusCode = 400; //Bad Request Response
          response.setHeader('content-type', 'text/plain');
          response.end('Error: Bad URL');
        }
      
      else if (contentType === 'application/json') {
        const formData = querystring.parse(content);
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify(formData));
      }
       else if (contentType === 'application/x-www-form-urlencoded') {
        const formData = querystring.parse(content);
        response.statusCode = 200;
        response.setHeader('content-type', 'application/x-www-form-urlencoded');
        response.end(JSON.stringify(formData));
      } 
      else if (contentType === 'application/xml') {
        // Parse XML content using xml2js
        const parser = new xml2js.Parser();

        // Parse XML content
        parser.parseString(content, (err, result) => {
          if (err) {
            response.statusCode = 400;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify({ error: 'Invalid XML' }));
          } else {
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(result));
          }
      });} 
      else if(contentType){
        response.statusCode = 415;  //Unsupported media client
        response.setHeader('content-type', 'text/plain');
        response.setHeader('Accept', 'application/json, application/xml, application/x-www-form-urlencoded');
        response.end('Error: Unsupported Content-Type');
      }
      else {
        response.statusCode = 400; //Bad Request Response URL doesn't exist
        response.setHeader('content-type', 'text/plain');
        response.end('Error: Invalid URL');
      }
    });
  } //For selecting records
  else if (request.method === 'GET') {
      let content = '';
      
      request.on('data', (data) => {
          content += data;
      });
  
      request.on('end', () => {
        const contentType = request.headers['content-type'];
        const parsedUrl = url.parse(request.url);
  
        console.log(request)
        if (parsedUrl.pathname === '/select') {   
          try {  
            const queryData = querystring.parse(parsedUrl.query);
            console.log('Received query data:', queryData); // Log the received JSON data
              readMovies(queryData, (err, result) => {
                if (err==451){
                  response.statusCode = 451; //Attempting to modify non-existing resource custom code
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify("Attempting to insert values into column(s) that do not exist!"));
                  }
                else if (err) {
                  response.statusCode = 500;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ error: err.message }));
                } 
                else if (result.length==0)
                { response.statusCode = 404;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'No movies found!' }));
                }
                else {
                  response.statusCode = 200;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'Movie records read successfully', result}));
                }
              });
            }
            catch (error) {
              response.statusCode = 400; //Bad Request Response
              response.setHeader('content-type', 'text/plain');
              response.end('Error: Invalid JSON format');
          }}
          
          else if (parsedUrl!=undefined && parsedUrl.length!=0){
            response.statusCode = 400; //Bad Request Response
            response.setHeader('content-type', 'text/plain');
            response.end('Error: Bad URL');
          }
          else if (contentType === 'application/json') {
            const formData = querystring.parse(content);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(formData));
          }
        else if (contentType === 'application/x-www-form-urlencoded') {
          const formData = querystring.parse(content);
          response.statusCode = 200;
          response.setHeader('content-type', 'application/x-www-form-urlencoded');
          response.end(JSON.stringify(formData));
        } 
        else if (contentType === 'application/xml') {
          // Parse XML content using xml2js
          const parser = new xml2js.Parser();
  
          // Parse XML content
          parser.parseString(content, (err, result) => {
            if (err) {
              response.statusCode = 400;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify({ error: 'Invalid XML' }));
            } else {
              response.statusCode = 200;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify(result));
            }
        });}    
        else if(contentType){
          response.statusCode = 415;  //Unsupported media client
          response.setHeader('content-type', 'text/plain');
          response.setHeader('Accept', 'application/json, application/xml, application/x-www-form-urlencoded');
          response.end('Error: Unsupported Content-Type');
        }
        else {
          response.statusCode = 400; //Bad Request Response URL doesn't exist
          response.setHeader('content-type', 'text/plain');
          response.end('Error: Invalid URL');
        }
      });
    } 
    
    //For updating records
    else if (request.method === 'PUT') {
      let content = '';
      
      request.on('data', (data) => {
          content += data;
      });
  
      request.on('end', () => {
        const contentType = request.headers['content-type'];
        const parsedUrl = url.parse(request.url);
  
        console.log(request)
        if (parsedUrl.pathname === '/update') {   
          try {  
            const queryData = querystring.parse(parsedUrl.query);
            console.log('Received query data:', queryData); // Log the received JSON data
              updateMovie(queryData, (err, result) => {
                if (err==451){
                  response.statusCode = 451; //Attempting to modify non-existing resource custom code
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify("Attempting to insert values into column(s) that do not exist!"));
                  }
                  else if (err) {
                  response.statusCode = 500;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ error: err.message }));
                } 
                else if (result.affectedRows==0)
                { response.statusCode = 404;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'No movie records affected!' }));
                }
                else {
                  response.statusCode = 200;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'Movie records updated successfully', result}));
                }
              });
            }
            catch (error) {
              response.statusCode = 400; //Bad Request Response
              response.setHeader('content-type', 'text/plain');
              response.end('Error: Invalid JSON format');
          }}
          else if (parsedUrl!=undefined && parsedUrl.length!=0){
            response.statusCode = 400; //Bad Request Response
            response.setHeader('content-type', 'text/plain');
            response.end('Error: Bad URL');
          }
          else if (contentType === 'application/json') {
            const formData = querystring.parse(content);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(formData));
          }
        else if (contentType === 'application/x-www-form-urlencoded') {
          const formData = querystring.parse(content);
          response.statusCode = 200;
          response.setHeader('content-type', 'application/x-www-form-urlencoded');
          response.end(JSON.stringify(formData));
        } 
        else if (contentType === 'application/xml') {
          // Parse XML content using xml2js
          const parser = new xml2js.Parser();
  
          // Parse XML content
          parser.parseString(content, (err, result) => {
            if (err) {
              response.statusCode = 400;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify({ error: 'Invalid XML' }));
            } else {
              response.statusCode = 200;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify(result));
            }
        });} 
        else {
          response.statusCode = 415;  //Unsupported media client
          response.setHeader('content-type', 'text/plain');
          response.setHeader('Accept', 'application/json, application/xml, application/x-www-form-urlencoded');
          response.end('Error: Unsupported Content-Type');
        }
      });
    } 
    //For updating records
    else if (request.method === 'DELETE') {
      let content = '';
      
      request.on('data', (data) => {
          content += data;
      });
  
      request.on('end', () => {
        const contentType = request.headers['content-type'];
        const parsedUrl = url.parse(request.url);
  
        console.log(request)
        if (parsedUrl.pathname === '/delete') {   
          try {  
            const queryData = querystring.parse(parsedUrl.query);
            console.log('Received query data:', queryData); // Log the received JSON data
             deleteMovie(queryData, (err, result) => {
              if (err==451){
                response.statusCode = 451; //Attempting to modify non-existing resource custom code
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify("Attempting to insert values into column(s) that do not exist!"));
                }
                else if (err) {
                  response.statusCode = 500;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ error: err.message }));
                } 
                else if (result.affectedRows==0)
                { response.statusCode = 404;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'No movie records affected!' }));
                }
                else {
                  response.statusCode = 200;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(JSON.stringify({ message: 'Movie records deleted successfully', result}));
                }
              });
            }
            catch (error) {
              response.statusCode = 400; //Bad Request Response
              response.setHeader('content-type', 'text/plain');
              response.end('Error: Invalid JSON format');
          }}
          else if (parsedUrl!=undefined && parsedUrl.length!=0){
            response.statusCode = 400; //Bad Request Response
            response.setHeader('content-type', 'text/plain');
            response.end('Error: Bad URL');
          }
          else if (contentType === 'application/json') {
            const formData = querystring.parse(content);
            response.statusCode = 200;
            response.setHeader('content-type', 'application/json');
            response.end(JSON.stringify(formData));
          }
        else if (contentType === 'application/x-www-form-urlencoded') {
          const formData = querystring.parse(content);
          response.statusCode = 200;
          response.setHeader('content-type', 'application/x-www-form-urlencoded');
          response.end(JSON.stringify(formData));
        } 
        else if (contentType === 'application/xml') {
          // Parse XML content using xml2js
          const parser = new xml2js.Parser();
  
          // Parse XML content
          parser.parseString(content, (err, result) => {
            if (err) {
              response.statusCode = 400;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify({ error: 'Invalid XML' }));
            } else {
              response.statusCode = 200;
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify(result));
            }
        });} 
        else {
          response.statusCode = 415;  //Unsupported media client
          response.setHeader('content-type', 'text/plain');
          response.setHeader('Accept', 'application/json, application/xml, application/x-www-form-urlencoded');
          response.end('Error: Unsupported Content-Type');
        }
      });
    } 
    else{ 
      response.statusCode = 405; 
      response.setHeader('Allow', 'POST');
      response.end('Error: Method Not Allowed');
    }
  });

const port = 2090;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;

