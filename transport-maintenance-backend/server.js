const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Import models to ensure associations are loaded
require('./models/user.model');
require('./models/truck.model');
require('./models/remolque.model');
require('./models/report.model');
require('./models/reportFailure.model');
require('./models/mechanicStatus.model');

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200",
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
app.use('/api/fleet', require('./routes/fleet.routes'));
app.use('/api/reports', require('./routes/reports.routes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Transport Maintenance API is running!" });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});