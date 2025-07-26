import { Link } from 'react-router-dom';
//import data from '../data';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import logger from 'use-reducer-logger';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProduct(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Featured products</h1>
      <div className="products">
        {loading ? (
          <div>
            Products are Loading from backend please wait for a while !!!
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => {
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
          })
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
