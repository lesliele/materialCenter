const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    id: Number,
    type: String,
    remark: String,
    mime: String,
    createdAt: Date,
    size: Number,
    src: String,
    catId: Number
});