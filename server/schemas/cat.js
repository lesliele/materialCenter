const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    id: Number,
    type: String,
    name: String,
    createdAt: Date
});