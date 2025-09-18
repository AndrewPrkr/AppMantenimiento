const Truck = require('../models/truck.model');
const Remolque = require('../models/remolque.model');

const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      where: { status: 'Disponible' },
      order: [['truck_number', 'ASC']]
    });
    
    console.log('Found trucks:', trucks.length); // Debug log
    res.status(200).json(trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

const getRemolques = async (req, res) => {
  try {
    const remolques = await Remolque.findAll({
      where: { status: 'Disponible' },
      order: [['remolque_number', 'ASC']]
    });
    
    console.log('Found remolques:', remolques.length); // Debug log
    res.status(200).json(remolques);
  } catch (error) {
    console.error('Error fetching remolques:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrucks,
  getRemolques
};
