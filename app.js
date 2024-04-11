const express = require("express");
const sql = require("mssql");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
const port = 3000; // Replace this with your desired port number

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

// Middleware to parse JSON data in the request body
app.use(express.json());

// Swagger configuration
// (Same as your original setup, no changes needed here)

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example endpoint to retrieve all notes
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


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
