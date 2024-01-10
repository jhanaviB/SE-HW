# Installing MYSQL and 
1. Download the Mysql Community Edition from https://dev.mysql.com/downloads/mysql/
2. Once sucessfully installed a MYSQL Command Line Client will be added automatically.
3. On opening that you will be prompted to enter the root password.
4. Create a database using 'CREATE DATABASE databaase_name;' I created a database called 'SE'
5. For creating a database and inserting a record into it, I used.

# If there is an error for the following libraries, please download them
-> npm install xml2j
-> npm install mysql2
->npm install url

# Please run these steps before running the tests! #
-> USE database_name; (SE is my database name)
-> CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    GENRE VARCHAR(200),
    DIRECTOR VARCHAR(200),
    RELEASE_DATE DATE);
-> INSERT INTO movies (id, name, Genre, Director, Release_date) VALUES (1,'The Exorcist: Believer','Horror','David Gordon Green','2023-10-06'),(2,'Barbie','Comedy/Fantasy','Greta Gerwig','2023-07-21');

I have added seperate API end points for safety.
For create use POST, url http://localhost:2090/insert 
For delete use POST, url http://localhost:2090/delete 
For update use PUT, url http://localhost:2090/update 
For read use POST(since we need URL), url http://localhost:2090/select 

# Some URL's to test with: 
# INSERT
1. http://localhost:2090/insert?name=You've Got Mail&genre=Romance/Comedy&director=Nora Ephron&release_date=1998-12-18, Method: POST
2. http://localhost:2090/insert?name=Sleepless in Seattle&genre=Melodrama/Romance&director=Nora Ephron, Method: POST

To check multiple inserts there is a test case, it takes data in json format.
id value can be removed from key and params as it is auto incremented.

# SELECT
1. URL: http://localhost:2090/select?name=Jhanavi, Method: GET
Selects records with name = Jhanavi
2.  http://localhost:2090/select?director=Nora Ephron&genre=Horror, Method: GET

# UPDATE
1. URL: http://localhost:2090/update?name=Dummy movie&new_name='Jhanavi', Method: PUT
2. http://localhost:2090/update?id=13&new_name=Jhanavi

# DELETE
1. http://localhost:2090/delete?genre=Action
2. http://localhost:2090/delete?genre=Horror

PLEASE NOTE THAT I HAVE ADDED 404 ERROR IF SELECT, UPDATE, DELETE AFFECT 0 ROWS IN A TABLE THAT EXISTS I.E NO RESOURCE FOUND OTHERWISE WE WILL GET 500 ERROR.
Also some tests are based on the fact that rows corresponding to id 20,21 100 and 1000 do not exist in my given table.
Rows corresponding to 20 and 21 are added.
Column 'Actor' also does not't exist in my table.

1. If Node.js is not installed in your system, please install it from the link  https://nodejs.org/.
2. On windows, go through with the installation steps and check if node and npm are installed with the below commands to check the version:
   npm -v 
   node -v

3. Install jasmine by running the command     
    npm install -g jasmine

4. Then go to the directory where the project is and run 
    jasmine init

# My project's structure
The src folder contains the Server.js file which creates an HTTP server. 
    
The spec folder has the Test.js file and a support folder which contains the jasmine.json file.

To run this please run the following commands on the cmd

1. cd src
2. node Server.js

For the jasmine tests please run the following commands:

cd .. (i.e make sure project is in the SE_HW1 home directory)
jasmine

# Test Cases
I have the followinig test cases:
1. Test for Status code 200 on successful POST request.
2. Check for 400: Bad Request error for Invalid XML and JSON formats.
3.  Checking that valid formats give no error 
4. Test for 405: Method not allowed error when using GET and PUT methods.
5. 415: Unsupported media type error for plain/text.
