# Steps to run this program

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

cd .. (i.e make sure project is in the SE_HW6 home directory)
jasmine

# Test Cases
I have introduced a delay of 300ms at the server side so the average round trip time is going to be greater than that atleast for all cases.
Aas jasmine was timing out, I have set the jasmine time out interval as 10 s.
