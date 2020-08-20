const mongoose = require("mongoose");
const newComment = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    start: { type: Number },
    timeComment: { type: String },
    user: [],
    id_product: { type: String, required: true }
})
module.exports = mongoose.model('Comment', newComment);