const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    // Connect to PostgreSQL server (not to a specific database)
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres', // Connect to default postgres database
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL server');

        // Check if database exists
        const checkDb = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (checkDb.rows.length > 0) {
            console.log(`Database "${process.env.DB_NAME}" already exists`);
        } else {
            // Create the database
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database "${process.env.DB_NAME}" created successfully!`);
        }
    } catch (error) {
        console.error('Error creating database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
