import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

async function parseApiResponse(res) {
  const text = await res.text();

  if (!text) {
    throw new Error('The server returned an empty response. Please try again.');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('The server returned an invalid response. Please try again.');
  }
}

const AuthLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check query params for redirect alert
  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect');
  const alertText = redirectParam && redirectParam.includes('checkout') 
    ? 'Please log in to continue to checkout' 
    : 'Please log in to continue';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseApiResponse(res);
      
      if (!data.success) {
        throw new Error(data.message || data.error?.message || 'Login failed');
      }

      if (window.JWTAuth) {
        if (data.token) {
          window.JWTAuth.saveToken(data.token);
        }
        if (data.data) {
          window.JWTAuth.saveUser(data.data);
        }
        window.JWTAuth.updateUI?.();
      }
      window.dispatchEvent(new Event('auth-state-changed'));

      // If successful
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || redirectParam || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      
      // We should tell App that we are authenticated, ideally via Context. For now, we update window & reload or wait for Context.
      // To prevent full reload though, we just navigate. Ensure Auth Context handles it globally if available.
      navigate(redirectUrl);
      
    } catch (err) {
      setErrorMsg(err.message);
      if (window.showNotification) window.showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
          <div className="auth-illustration">
              <i className="fas fa-seedling"></i>
              <h2>Welcome back</h2>
              <p>Grow with us. Sign in to continue.</p>
          </div>
          <form id="loginForm" className="auth-form" onSubmit={handleSubmit}>
              <h1>Sign in</h1>
              
              {redirectParam && (
                <div id="authAlert" className="auth-alert" style={{ display: 'flex' }}>
                    <i className="fas fa-info-circle"></i>
                    <span>{alertText}</span>
                </div>
              )}

              {errorMsg && (
                <div className="auth-alert" style={{ display: 'flex', backgroundColor: '#ffebe9', color: '#da3633' }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{errorMsg}</span>
                </div>
              )}
              
              <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                     type="email" 
                     id="email" 
                     name="email" 
                     placeholder="you@example.com" 
                     required 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input 
                     type="password" 
                     id="password" 
                     name="password" 
                     placeholder="••••••••" 
                     required 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              <button type="submit" className="btn btn-primary btn-glow btn-large" disabled={loading}>
                 {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : 'Login'}
              </button>
              <p className="auth-switch">New here? <Link to="/auth-register">Create an account</Link></p>
          </form>
      </div>
    </section>
  );
};

export default AuthLogin;
