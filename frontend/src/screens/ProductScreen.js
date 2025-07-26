import { useParams } from 'react-router-dom';
import data from '../data';
import '../index.css';

function ProductScreen() {
  const { slug } = useParams();
  const product = data.products.find((p) => p.slug === slug);

  if (!product) {
    return <div className="not-found">Product not found.</div>;
  }

  // Discount logic
  const discountPercentage = 20;
  const discountAmount = Math.round((product.price * discountPercentage) / 100);
  const finalPrice = product.price - discountAmount;

  return (
    <section className="product-detail-container">
      <div className="product-detail-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-image"
        />
      </div>

      <div className="product-detail-info">
        <h1 className="product-detail-name">{product.name}</h1>

        <div className="product-pricing">
          <p className="product-original-price">
            MRP: <del>₹{product.price.toLocaleString('en-IN')}</del>
          </p>
          <p className="product-discount">
            You Save: ₹{discountAmount.toLocaleString('en-IN')} (
            {discountPercentage}% OFF)
          </p>
          <p className="product-final-price">
            Deal Price: <strong>₹{finalPrice.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <p className="product-detail-description">{product.description}</p>

        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </section>
  );
}

export default ProductScreen;
