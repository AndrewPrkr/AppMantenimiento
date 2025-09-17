// migrate-passwords.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'transport_db'
};

async function migratePasswords() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get all users with plain text passwords
    const [users] = await connection.execute('SELECT id, password FROM users');
    
    for (const user of users) {
      // Hash the plain text password
      const hashedPassword = bcrypt.hashSync(user.password, 8);
      
      // Update the user's password
      await connection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, user.id]
      );
      
      console.log(`Updated password for user ID: ${user.id}`);
    }
    
    await connection.end();
    console.log('Password migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migratePasswords();
