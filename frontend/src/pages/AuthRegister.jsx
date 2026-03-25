import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

const AuthRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await parseApiResponse(res);
      
      if (!data.success) {
        throw new Error(data.message || data.error?.message || 'Registration failed');
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
      navigate('/');
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
              <i className="fas fa-leaf"></i>
              <h2>Join GreenLeaf</h2>
              <p>Create your account and start your plant journey.</p>
          </div>
          <form id="registerForm" className="auth-form" onSubmit={handleSubmit}>
              <h1>Create account</h1>

              {errorMsg && (
                <div className="auth-alert" style={{ display: 'flex', backgroundColor: '#ffebe9', color: '#da3633' }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{errorMsg}</span>
                </div>
              )}

              <div className="form-group">
                  <label htmlFor="name">Full name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Alex Green" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
              </div>
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
                    placeholder="At least 6 characters" 
                    minLength="6" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              <button type="submit" className="btn btn-primary btn-glow btn-large" disabled={loading}>
                 {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : 'Create account'}
              </button>
              <p className="auth-switch">Already have an account? <Link to="/auth-login">Sign in</Link></p>
          </form>
      </div>
    </section>
  );
};

export default AuthRegister;
