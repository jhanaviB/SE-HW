# Steps to run this program

1. If Node.js is not installed in your system, please install it from the link https://nodejs.org/.
2. On windows, go through with the installation steps and check if node and npm are installed with the below commands to check the version:
   npm -v
   node -v

3. Install jasmine by running the command  
   npm install -g jasmine

4. Then go to the directory where the project is and run
   jasmine init

# My project's structure

The folder contains the Orders.csv file that has the formulas. You can refer to that file and check if the formulas are being evaluated correctly.

The spec folder has the FileSpec.js file and a support folder which contains the jasmine.json file.

To run this please run the following command on the cmd
node CSVBuilder.js

For the jasmine tests please run the following commands:

cd .. (i.e make sure project is in the HW7 home directory)
jasmine
