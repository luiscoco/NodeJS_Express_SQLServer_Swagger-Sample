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

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/2490a25d-b0d5-4a6f-a370-59329e9f25c0)

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

### 4.2. Express App Initialization

An Express application is created, and a port number is defined for the server to listen on

```javascript
const app = express();
```

### 4.3. SQLServer Connection

It establishes a connection to **SQLServer**

The database used is "tutor", and it operates on a collection named "notes"

```javascript
// SQL Server setup and connection
const config = {
    server: 'localhost', // You can use an IP address or a server name
    database: 'tutor',
    user: 'sa', // Add your SQL Server username here
    password: 'Luiscoco123456', // Add your SQL Server password here
    port: 1433, // Specify the port here
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // True if you're using self-signed certificates
    }
};

sql.connect(config).then(pool => {
    console.log('SQL Server connected successfully.');
    return pool;
}).catch(err => {
    console.error('Error connecting to SQL Server:', err);
});
```

We can verify the connection with SSMS

![image](https://github.com/luiscoco/NodeJS_Express_SQLServer_Swagger-Sample/assets/32194879/897cb497-bb2f-42ec-934f-4d28d983251a)

### 4.4. Middleware

The application uses **express.json()** middleware to parse JSON-formatted request bodies, making it easy to handle JSON data sent in requests

```javascript
// Middleware to parse JSON data in the request body
app.use(express.json());
```

### 4.5. Swagger Configuration

The Swagger documentation is set up using **swagger-jsdoc** and **swagger-ui-express**

The configuration specifies the API's information, such as its title, version, and description, and it also defines the schema for a Note object

The API's routes are included in the documentation using a relative path to the file (in this example, "./app.js"), which should be updated to match the actual filename

```javascript
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Notes API",
            version: "1.0.0",
            description: "A simple API to manage notes",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Development server",
            },
        ],
        components: {
            schemas: {
                Note: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                        },
                        content: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
    apis: ["./app.js"], // Replace "app.js" with the actual filename of your main Node.js file
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

4.6. API Endpoints
The application defines several routes for managing notes:

GET /notes: Retrieves all notes from the database. It queries the MongoDB collection and returns the results

POST /notes: Allows the creation of a new note by inserting the provided data into the MongoDB collection

DELETE /notes/:id: Deletes a note identified by its unique ID from the MongoDB collection

PUT /notes/:id: Updates an existing note identified by its unique ID with the provided data

Each of these routes includes Swagger annotations to document the endpoint, describing its purpose, request parameters, and the structure of request and response bodies

```javascript
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Retrieve all notes
 *     description: Get a list of all notes.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Note"
 */
app.get("/notes", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Notes');
        res.json(result.recordset);
    } catch (err) {
        console.error("Error retrieving notes:", err);
        res.status(500).send("An error occurred while retrieving notes.");
    }
});

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note with the given title and content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Note"
 *     responses:
 *       200:
 *         description: Successful operation
 */
app.post("/notes", async function(req, res) {
    try {
        const { title, content } = req.body;
        const pool = await sql.connect(config);
        await pool.request()
            .input('Title', sql.VarChar, title)
            .input('Content', sql.VarChar, content)
            .query('INSERT INTO Notes (Title, Content) VALUES (@Title, @Content)');
        res.send("Note added successfully.");
    } catch (err) {
        console.error("Error adding note:", err);
        res.status(500).send("An error occurred while adding a note.");
    }
});

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Deletes a note based on its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to be deleted.
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Note not found
 */
app.delete("/notes/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Notes WHERE Id = @Id');
        if (result.rowsAffected[0] > 0) {
            res.send({ ok: true });
        } else {
            res.status(404).send({ ok: false, message: "Note not found" });
        }
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).send("An error occurred while deleting the note.");
    }
});

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Update an existing note with the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Note"
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Note not found
 */
app.put("/notes/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .input('Title', sql.VarChar, title)
            .input('Content', sql.VarChar, content)
            .query('UPDATE Notes SET Title = @Title, Content = @Content WHERE Id = @Id');
        if (result.rowsAffected[0] > 0) {
            res.send("Note updated successfully.");
        } else {
            res.status(404).send("Note not found.");
        }
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).send("An error occurred while updating the note.");
    }
});
```

### 4.7. Error Handling

The application includes basic error handling for database operations, logging errors to the console and sending error responses to the client.

### 4.8. Starting the Server

Finally, the application listens on the defined port, and upon successful launch, logs a message indicating the server is running

This application serves as a basic backend for managing notes, with the added benefit of having its API documented and testable via Swagger UI

The Swagger documentation is accessible by navigating to /api-docs on the running server, providing an interactive interface for trying out the API endpoints

```javascript
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```


