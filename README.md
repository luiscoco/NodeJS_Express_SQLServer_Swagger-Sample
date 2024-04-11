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



