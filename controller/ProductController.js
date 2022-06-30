const mongoose = require("mongoose");

const Products = require("../models/ProductModels.js");


exports.createProduct = async (req, res) => {
  // console.log("this is calling");
  // console.log(req.body);

  const product = req.body;
  // console.log(product);
  const newProduct = new Products(product);

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(409).json("Some thing went wrong in creating new Products");
  }
};

exports.fetchProducts = async (req, res) => {
  const category = await Products.find();
  try {
    res.status(200).send(category);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Categories");
  }
};

exports.getProducts = async (req, res) => {
  const category = await Products.find()
    .sort({ name: 1 })
    .skip(Math.ceil(Math.random() * 10))
    .limit(4);
  try {
    res.status(200).send(category);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Categories");
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateProduct = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    await Products.findByIdAndUpdate(id, updateProduct, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send("Some thing went wrong in updating post");
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await Products.findByIdAndRemove(id);
    res.send("Product Deleted Successfully");
  } catch (error) {
    console.log(error);
  }
};

exports.fetchSingleProduct = async (req, res) => {
  const post = req.params.id;
  const getPost = await Products.findById(post);

  try {
    res.status(200).send(getPost);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Product");
  }
};

exports.searchByCategory = async (req, res) => {
  const post = req.query.name;
  const getPost = await Products.find({ category: post });

  try {
    res.status(200).send(getPost);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Product");
  }
};

exports.searchByDisplay = async (req, res) => {
  const post = req.query.name;
  const getPost = await Products.find({ displayIn: post });

  try {
    res.status(200).send(getPost);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Product");
  }
};

exports.cartItems = async (req, res) => {
  // const post = req.query.name;
  const getPost = await Products.find({
    _id: {
      $in: [
        ObjectId("55880c251df42d0466919268"),
        ObjectId("55bf528e69b70ae79be35006"),
      ],
    },
  });

  try {
    res.status(200).send(getPost);
  } catch (error) {
    console.log(error);
    res.status(409).send("Some thing went wrong in fetching Product");
  }
};
