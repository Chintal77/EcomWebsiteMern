import { Link } from 'react-router-dom';
import '../AuthScreen.css';

function SignupScreen() {
  return (
    <div className="auth-container">
      <main className="form-main">
        <h2 className="form-title">Create Account</h2>
        <form className="auth-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-submit">
            Sign Up
          </button>
        </form>
        <p className="redirect-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} ShopFusion. All rights reserved.
      </footer>
    </div>
  );
}

export default SignupScreen;
