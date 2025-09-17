const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200", // Angular dev server
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Sync database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
  });

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Transport Maintenance API is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})



////
app.get('/test-users', async (req, res) => {
  try {
    const User = require('./models/user.model');
    const users = await User.findAll({
      attributes: ['id', 'employee_number', 'full_name', 'role', 'is_active']
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


;