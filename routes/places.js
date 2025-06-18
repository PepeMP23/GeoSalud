const express = require('express');
const router = express.Router();
const placeService = require('../services/place');

router.get('/', async (req, res) => {
  try {
    const places = await placeService.getAll(req.query.name);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const place = await placeService.create(req.body);
    res.status(201).json(place);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await placeService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Lugar no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await placeService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Lugar no encontrado' });
    res.json({ message: 'Lugar eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
