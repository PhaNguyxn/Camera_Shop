var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    { 
        category: String,
    }
);

var Categories = mongoose.model('Categories', schema, 'categories');

module.exports = Categories;