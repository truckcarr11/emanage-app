# eManage

An app perfect for managing employees and positions in your company.

### Build with

1. React
2. Material UI
3. React Redux
4. GO
5. PostgreSQL

The root of the project consists of some GO files used to run the back end. The front end is in the "client" folder which houses the React application.

### Steps to run

1. Add an env variable pointing to a PostgreSQL db using powershell
   a. $env:DATABASE_URL = ""
2. Build the back end with go build
3. Run the back end with .\emanage.exe
4. Navigate to the client folder in the CMD
5. Run npm install
6. Run npm start

Navigate to localhost:3000/signin or localhost:3000/signup to check it out.
