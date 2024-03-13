# Steps to run this program

1. If Node.js is not installed in your system, please install it from the link  https://nodejs.org/.
2. On windows, go through with the installation steps and check if node and npm are installed with the below commands to check the version:
   npm -v 
   node -v

3. Install jasmine by running the command
    npm install -g jasmine

4. Then do npm install -y to create package.json

5. Then go to the directory where the project is and run 
    jasmine init

# My project's structure
The src folder contains the Income.csv file that will be displayed on the console and the CSV.js file which has the code for opening a csv file, reading from it and displaying it's contents on the terminal. 
    
The spec folder has the FileSpec.js file and a support folder which contains the jasmine.json file.

To run this please run the following commands on the cmd

cd src
node AverageStandardDev.js

For the jasmine tests please run the following commands:

cd ..
jasmine

