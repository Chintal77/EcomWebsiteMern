import { Link } from 'react-router-dom';
import data from '../data';

function HomeScreen() {
  return (
    <div>
      <h1>Featured products</h1>
      <div className="products">
        {data.products.map((product) => {
          const discountPercentage = 20;
          const discountAmount = Math.round(
            (product.price * discountPercentage) / 100
          );
          const finalPrice = product.price - discountAmount;

          return (
            <div className="product" key={product.slug}>
              <span className="badge">20% OFF</span>

              <img src={product.image} alt={product.name} />

              <div className="product-info">
                <h3 className="product-name">
                  <Link to={`/products/${product.slug}`}>{product.name}</Link>
                </h3>

                <p className="product-price">
                  <span className="original-price">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>{' '}
                  <span className="final-price">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                </p>

                <p className="product-discount">
                  You save ₹{discountAmount.toLocaleString('en-IN')}
                </p>

                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomeScreen;
