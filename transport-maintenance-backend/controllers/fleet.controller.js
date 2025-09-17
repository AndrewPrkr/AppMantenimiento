const Truck = require('../models/truck.model');
const Remolque = require('../models/remolque.model');

const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      attributes: ['id', 'truck_number', 'status']
    });
    res.status(200).json(trucks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trucks', error: error.message });
  }
};

const getRemolques = async (req, res) => {
  try {
    const remolques = await Remolque.findAll({
      attributes: ['id', 'remolque_number', 'type', 'status']
    });
    res.status(200).json(remolques);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch remolques', error: error.message });
  }
};

module.exports = {
  getTrucks,
  getRemolques
};
