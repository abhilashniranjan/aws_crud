const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  name: { type: String },
  lname: { type: String},
  age: { type: String },
  dsc: { type: String }
});

const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;
