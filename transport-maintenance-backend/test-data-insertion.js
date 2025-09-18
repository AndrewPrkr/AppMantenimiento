const sequelize = require('./config/database');
const Truck = require('./models/truck.model');
const Remolque = require('./models/remolque.model');

async function insertTestData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Insert trucks
    const trucks = await Truck.bulkCreate([
      { truck_number: 'TRC-001', brand: 'Freightliner', model: 'Cascadia', year: 2020, plate: 'ABC-123', status: 'Disponible' },
      { truck_number: 'TRC-002', brand: 'Volvo', model: 'VNL', year: 2019, plate: 'DEF-456', status: 'Disponible' },
      { truck_number: 'TRC-003', brand: 'Peterbilt', model: '579', year: 2021, plate: 'GHI-789', status: 'Disponible' }
    ]);

    // Insert remolques
    const remolques = await Remolque.bulkCreate([
      { remolque_number: 'REM-001', type: 'PIPA', brand: 'Great Dane', model: 'Champion', year: 2021, plate: 'PIP-001', status: 'Disponible' },
      { remolque_number: 'REM-002', type: 'VOLTEO', brand: 'Trail King', model: 'TK110', year: 2020, plate: 'VOL-002', status: 'Disponible' },
      { remolque_number: 'REM-003', type: 'PLATAFORMA', brand: 'Fontaine', model: 'Revolution', year: 2019, plate: 'PLA-003', status: 'Disponible' }
    ]);

    console.log(`Inserted ${trucks.length} trucks and ${remolques.length} remolques`);
    process.exit(0);
  } catch (error) {
    console.error('Error inserting test data:', error);
    process.exit(1);
  }
}

insertTestData();