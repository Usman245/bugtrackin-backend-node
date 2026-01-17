const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        await client.connect();
        console.log('Connected to database:', process.env.DB_NAME);

        const migrationsDir = path.join(__dirname, 'src', 'migrations');

        const migrationFiles = fs
            .readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // 👈 CRITICAL

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            console.log(`Running migration: ${file}`);

            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');

            console.log(`✓ ${file} completed`);
        }

    } catch (error) {
        console.error('❌ Migration failed');
        console.error('Message:', error.message);
        console.error('Detail:', error.detail);
        console.error('Hint:', error.hint);
        console.error('Position:', error.position);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();
