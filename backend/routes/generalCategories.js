const express = require('express');
const router = express.Router();
const generalCategoryController = require('../controllers/generalCategoryController');

router.get('/', generalCategoryController.getAll);
router.get('/:id', generalCategoryController.getById);
router.post('/', generalCategoryController.create);
router.delete('/:id', generalCategoryController.remove);
router.put('/:id', generalCategoryController.update);

module.exports = router;
