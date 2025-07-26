import './App.css';
import data from './data';

function App() {
  return (
    <div>
      <header>
        <a href=" ">ShopFusion</a>
      </header>

      <main>
        <h1>Featured products</h1>
        <div className="products">
          {data.products.map((product) => (
            <div className="product" key={product.slug}>
              <span className="badge">20% OFF</span>
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
