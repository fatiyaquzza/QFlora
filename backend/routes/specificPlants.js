const express = require('express');
const router = express.Router();
const specificPlantController = require('../controllers/specificPlantController');

router.get('/', specificPlantController.getAll);
router.get('/:id', specificPlantController.getById);
router.delete('/:id', specificPlantController.remove);
router.post('/', specificPlantController.create);
router.put('/:id', specificPlantController.update);


module.exports = router;
