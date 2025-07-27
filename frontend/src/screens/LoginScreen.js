import { Link } from 'react-router-dom';
import '../AuthScreen.css';

function LoginScreen() {
  return (
    <div className="auth-container">
      <main className="form-main">
        <h2 className="form-title">🔐 Welcome Back</h2>
        <p className="form-subtitle">Login to your ShopFusion account</p>
        <form className="auth-form">
          <input type="email" placeholder="📧 Email" required />
          <input type="password" placeholder="🔑 Password" required />
          <button type="submit" className="btn-submit">
            🚀 Login
          </button>
        </form>
        <p className="redirect-text">
          👤 Don't have an account?{' '}
          <Link to="/signup" className="form-link">
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}

export default LoginScreen;
