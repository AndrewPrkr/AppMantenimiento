const Truck = require('../models/truck.model');
const Remolque = require('../models/remolque.model');

const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      order: [['truck_number', 'ASC']]
    });
    res.status(200).send(trucks);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getRemolques = async (req, res) => {
  try {
    const remolques = await Remolque.findAll({
      order: [['remolque_number', 'ASC']]
    });
    res.status(200).send(remolques);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getTrucks,
  getRemolques
};