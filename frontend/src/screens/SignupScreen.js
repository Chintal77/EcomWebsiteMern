import { Link } from 'react-router-dom';
import '../AuthScreen.css';

function SignupScreen() {
  return (
    <div className="auth-container">
      <main className="auth-card">
        <h2 className="form-title">Create Your ShopFusion Account</h2>
        <form className="auth-form">
          <input type="text" placeholder="Full Name" required />
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Phone Number" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <select required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="date" required />
          <label className="terms-label">
            <input type="checkbox" required /> I agree to the terms & conditions
          </label>

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
