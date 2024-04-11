# How to create a simple CRUD server with NodeJS + Express + SQL_Server (with Swagger OpenAPI docs)

## 1. How to run the SQL Server Docker container

First of all, do not forget to run **Docker Desktop** before pulling and running the MondoDb Docker container

```
docker run ^
More?   -e "ACCEPT_EULA=Y" ^
More?   -e "MSSQL_SA_PASSWORD=Luiscoco123456" ^
More?   -p 1433:1433 ^
More?   -d mcr.microsoft.com/mssql/server:2022-latest
```

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/bf2585d0-4ac9-4359-a022-4e543b0a5d41)

We can see the SQL Server Docker image in Docker Desktop

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/ff7e71e0-4966-4d2f-b1ec-91b2e27c232a)

Also we can see the SQL Server Docker container running in Docker Desktop

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/29ff44ba-cbbb-425e-b22d-ada3de0050e3)

We connect with the SQL Server with SSMS (SQL Server Management Studio)

password:**Luiscoco123456**

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/ff1a970e-6d1d-41ec-b9a9-a869f3902ee6)

We create a new database **tutor** and a new table **Notes** for this example

```sql
CREATE DATABASE tutor
GO

CREATE TABLE Notes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255),
    Content NVARCHAR(MAX)
);
```

See the new database and table in SSMS

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/9c07b37e-e6d5-471d-825a-2d29cd941d09)

## 2. Project folders and files structure

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/8dc7c19b-3e47-4c00-8d8a-6a8cf0f9ad9e)

## 3. Project dependencies/libraries

**package.json**

```json
{
    "name": "sql-server-notes-api",
    "version": "1.0.0",
    "description": "A simple API to manage notes using SQL Server",
    "main": "app.js",
    "scripts": {
      "start": "node app.js",
      "dev": "nodemon app.js"
    },
    "keywords": ["express", "sql-server", "api", "notes"],
    "author": "Your Name",
    "license": "ISC",
    "dependencies": {
      "express": "^4.17.1",
      "mssql": "^7.1.3",
      "swagger-jsdoc": "^6.0.0",
      "swagger-ui-express": "^4.1.6"
    },
    "devDependencies": {
      "nodemon": "^2.0.7"
    }
  }
```

## 4. Source code explained

This code is a **Node.js** application using **Express**, **SQLServer**, and **Swagger** for creating a simple REST API to manage notes

Here's a breakdown of its main components and functionalities:

### 4.1. Setting Up Dependencies

The code begins by importing necessary libraries:

-**express** for the web server framework

-**mssql** to interact with SQL Server database

-**swagger-ui-express** and **swagger-jsdoc** for documenting the API using Swagger


