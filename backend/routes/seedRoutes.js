import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany(); // ✅ Clear existing entries
  await Product.deleteOne({});
  const createdProducts = await Product.insertMany(data.products);

  await User.deleteMany(); // ✅ Clear existing entries
  await User.deleteOne({});
  const createdUsers = await User.insertMany(data.users);

  res.send({ createdProducts, createdUsers });
});
export default seedRouter;
