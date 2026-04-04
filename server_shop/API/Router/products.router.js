var express = require('express')

var router = express.Router()

const Products = require('../Controller/products.controller')

router.get('/', Products.index)

router.get('/category', Products.category)

router.get('/category/list', Products.categories);

router.post('/category/create', Products.createCategory);

router.put('/category/update/:id', Products.updateCategory);

router.delete('/category/delete/:id', Products.deleteCategory);

router.get('/category/detail/:id', Products.detailCategory);

router.post('/create', Products.createProduct);

router.put('/update/:id', Products.updateProduct);

router.get('/pagination', Products.pagination)

router.delete('/:id', Products.deleteProduct);

router.get('/:id', Products.detail);


module.exports = router