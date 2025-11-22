import Location from '../models/location.model.js';

exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const locations = await Location.find(query);
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
