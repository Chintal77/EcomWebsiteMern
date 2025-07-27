import { Link } from 'react-router-dom';
import './Header.css';

function Header({ cartItems }) {
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          ShopFusion
        </Link>
        <Link to="/cart" className="cart-icon-link" aria-label="Go to cart">
          🛒
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
