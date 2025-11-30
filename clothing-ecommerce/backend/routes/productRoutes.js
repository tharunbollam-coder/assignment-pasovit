const express = require('express');
const { getProducts, getProductById, getCategories, getSizes } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/sizes', getSizes);
router.get('/:id', getProductById);

module.exports = router;
