import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const updateCartCount = () => {
    const storedUser = localStorage.getItem('userInfo');
    const user = storedUser ? JSON.parse(storedUser) : null;
    setUserInfo(user);

    if (user) {
      const cartKey = `cartItems_${user.email}`;
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || {};
      const count = Object.values(storedCart).reduce((sum, item) => {
        if (typeof item === 'number') return sum + item;
        if (typeof item === 'object' && item.quantity)
          return sum + item.quantity;
        return sum;
      }, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🛍️ ShopFusion
        </Link>
        <nav className="nav">
          {userInfo ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart{' '}
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>

              <div className="user-dropdown">
                <button className="nav-btn" onClick={toggleDropdown}>
                  {userInfo.isAdmin
                    ? `👑 Admin: ${userInfo.name}`
                    : `👋 ${userInfo.name}`}{' '}
                  ▾
                </button>

                {showDropdown && (
                  <ul className="dropdown-menu">
                    {userInfo.isAdmin ? (
                      <>
                        <li onClick={() => navigate('/admin/dashboard')}>
                          🧾 Admin Dashboard
                        </li>
                        <li onClick={() => navigate('/admin/products')}>
                          📦 Manage Products
                        </li>
                        <li onClick={() => navigate('/admin/reports')}>
                          📊 Reports
                        </li>
                      </>
                    ) : (
                      <>
                        <li onClick={() => navigate('/orders')}>
                          📜 My Orders
                        </li>
                        <li onClick={() => navigate('/profile')}>
                          ⚙️ Profile Settings
                        </li>
                      </>
                    )}
                    <li onClick={logoutHandler}>🚪 Logout</li>
                  </ul>
                )}
              </div>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Header;
