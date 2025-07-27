import data from './data.js';
import express from 'express';

const app = express();

// Route to get all products
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// Route to get a single product by slug
app.get('/api/products/:slug', (req, res) => {
  const product = data.products.find((p) => p.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

const port = process.env.PORT || 5040;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
