const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, },
  size:  [ ],
  price: { type: Number, },
  sex: { type: String, },
  color: { type: String, },
  poster: [ ],
  description: { type: String, },
  collections: { type: String, },
  productType: { type: String },
  key: { type: String, },
  NSX: { type: String, }
});
module.exports = mongoose.model('product', productSchema); 