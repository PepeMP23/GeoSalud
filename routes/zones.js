const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const zoneService = require('../services/zone');

router.get('/', async (req, res) => {
  try {
    const zones = await zoneService.getAll(req.query.name);
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const zone = await zoneService.create(req.body);
    res.status(201).json(zone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const updated = await Zone.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Zona no encontrada' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await zoneService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Zona no encontrada' });
    res.json({ message: 'Zona eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
