import { Link } from 'react-router-dom';
import '../AuthScreen.css';

function LoginScreen() {
  return (
    <div className="auth-container">
      <main className="form-main">
        <h2 className="form-title">Login</h2>
        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-submit">
            Login
          </button>
        </form>
        <p className="redirect-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} ShopFusion. All rights reserved.
      </footer>
    </div>
  );
}

export default LoginScreen;
