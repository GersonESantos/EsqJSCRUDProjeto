const fs = require('fs');
const path = require('path');
const db = require('./server/db');

async function setup() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'server', 'schema.sql'), 'utf8');
        // Split by semicolon to get individual statements, primitive but works for simple schema
        const statements = schema.split(';').filter(stmt => stmt.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }
        console.log('✅ Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

setup();
