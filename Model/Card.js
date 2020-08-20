const mongoose = require("mongoose");
const CardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id_User: { type: String, required: true },
    address: { type: String, required: true },
    totalSum: { type: Number, required: true },
    timeCard:{ type: String, required: true},
    card: [],
});

module.exports = mongoose.model('Card', CardSchema);