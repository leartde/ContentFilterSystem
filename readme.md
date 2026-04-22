

## Project Overview

  Backend: ASP.NET Core (.NET 10) + Microsoft SQL Server
  Frontend: React + TypeScript + Tailwind CSS


## Instructions on how to run the project WITH Docker

### Prerequisites: Docker Desktop installed and running

1. Clone the repository:
     ```git clone https://github.com/leartde/ContentFilterSystem```\
     ```cd ContentFilterSystem```
2. Build and start containers:
    ``` docker compose up -d --build ```.\
    Note: This might take a while if you don't have SQL Server 2022 image already pulled in your machine.

3. Open the app at http://localhost:4173.

 ### Stop containers

  ```docker compose down```



## Instructions on how to run the project WITHOUT Docker
 ### Prerequisites
  - .NET 10 SDK
  - Node.js + npm
  - SQL Server running locally

1. Clone the repository:\
     ```git clone https://github.com/leartde/ContentFilterSystem``` \
     ```cd ContentFilterSystem```
2. Start the API:
    ```cd api```\
    ```dotnet restore```
    ```dotnet run --launch-profile http```\
    The database is created automatically with this connection string:
     "DefaultConnection": "Server=.;Database=ContentFilter;Integrated Security=true;TrustServerCertificate=true;"
3. Start the frontend:
    ```cd ../client```\
    ```npm install```\
    ```npm run dev```
4. Open the app: http://localhost:4173.




#### Project side notes
- If multiple rules match the same input, priority is based on specificity: `exact` > `startsWith` >
  `contains`.
- Tagged words display their tag in two places:
  - as a tooltip on hover (via the `title` attribute)
  - as a visible label next to the word
- The backend prevents duplicate rules with the same `keyword` and `matchType`.