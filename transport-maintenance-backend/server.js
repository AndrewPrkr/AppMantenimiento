const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models to ensure they are loaded
const User = require('./models/user.model');
const Truck = require('./models/truck.model');
const Remolque = require('./models/remolque.model');
const Report = require('./models/report.model');
const ReportFailure = require('./models/reportFailure.model');

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Sync database (set to false to avoid dropping tables)
sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('✅ Database synced');
  })
  .catch(err => {
    console.error('❌ Database sync failed:', err);
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
    
    // Test each table
    const trucksCount = await Truck.count();
    const remolquesCount = await Remolque.count();
    const usersCount = await User.count();
    
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      tables: {
        trucks: trucksCount,
        remolques: remolquesCount,
        users: usersCount
      },
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
  console.log(`🚀 Server is running on port ${PORT}.`);
});
