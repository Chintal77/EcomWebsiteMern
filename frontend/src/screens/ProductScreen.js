import { useParams } from 'react-router-dom';
import data from '../data';
import '../index.css';
import { useState } from 'react';

function ProductScreen() {
  const { slug } = useParams();
  const product = data.products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="not-found">Product not found.</div>;
  }

  const discountPercentage = 20;
  const discountAmount = Math.round((product.price * discountPercentage) / 100);
  const finalPrice = product.price - discountAmount;

  return (
    <section className="product-detail-section">
      <div className="product-card-glass">
        <div className="product-left">
          <img
            src={product.image}
            alt={product.name}
            className="product-img-glass"
          />
        </div>

        <div className="product-right">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            ⭐ 4.3 <span>(112 reviews)</span>
          </div>

          <div className="price-block">
            <p className="price-original">
              MRP: <del>₹{product.price.toLocaleString()}</del>
            </p>
            <p className="price-discount">
              You Save: ₹{discountAmount.toLocaleString()} ({discountPercentage}
              %)
            </p>
            <p className="price-final">
              Deal Price: <strong>₹{finalPrice.toLocaleString()}</strong>
            </p>
          </div>

          <p className="description">{product.description}</p>

          <div className="extra-info">
            <p className="stock">✅ In Stock</p>
            <p>
              Sold by <strong>ShopFusion Retail</strong>
            </p>
            <p>
              Delivery by <strong>Monday, July 29</strong>
            </p>
            <p>🔁 7-Day Return Policy</p>
            <p>🔒 Secure Transaction</p>
          </div>

          <div className="quantity-select">
            <label htmlFor="quantity">Qty:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[...Array(10).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button className="btn-cart">🛒 Add to Cart</button>
            <button className="btn-buy">⚡ Buy Now</button>
          </div>

          <div className="payment-methods">
            <p>💳 Pay via: UPI | Cards | EMI | NetBanking</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductScreen;
