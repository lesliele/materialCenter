const mongoose = require('mongoose');
const schema = require('../schemas/cat');
module.exports = mongoose.model('Cat', schema);