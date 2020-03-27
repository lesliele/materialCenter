const mongoose = require('mongoose');
const schema = require('../schemas/material');
module.exports = mongoose.model('Material', schema);