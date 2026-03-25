import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

async function parseApiResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ loading: true, user: null });

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/check-session', {
          credentials: 'include',
        });
        const data = await parseApiResponse(response);

        if (!ignore) {
          setAuthState({
            loading: false,
            user: data?.authenticated ? data.user : null,
          });
        }
      } catch (error) {
        if (!ignore) {
          setAuthState({ loading: false, user: null });
        }
      }
    };

    loadSession();

    const handleAuthRefresh = () => {
      loadSession();
    };

    window.addEventListener('auth-state-changed', handleAuthRefresh);

    return () => {
      ignore = true;
      window.removeEventListener('auth-state-changed', handleAuthRefresh);
    };
  }, [location.pathname]);

  useEffect(() => {
    const initializeCartUi = () => {
      window.cartFunctions?.initializeCart?.();
      window.cartFunctions?.setupCartModal?.();
    };

    const timer = window.setTimeout(initializeCartUi, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Clear local auth state even if the session request fails.
    } finally {
      window.JWTAuth?.removeToken?.();
      window.JWTAuth?.updateUI?.();
      setAuthState({ loading: false, user: null });
      window.dispatchEvent(new Event('auth-state-changed'));
      navigate('/');
    }
  };

  return (
    <>
      <div id="loading-spinner" className="loading-spinner">
        <div className="spinner"></div>
      </div>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" className="brand-mark" aria-label="GreenLeaf home">
                <i className="fas fa-leaf"></i>
              <span className="brand-copy">
                <strong>GreenLeaf</strong>
              </span>
            </Link>
          </div>

          <div className="nav-search">
            <input type="text" id="search-input" placeholder="Search plants, pots, tools" />
            <button id="search-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="nav-menu" id="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/pots" className="nav-link">Pots</Link>
            <Link to="/tools" className="nav-link">Tools</Link>
            <Link to="/care" className="nav-link">Care</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          <div className="nav-icons">
            <div className="cart-icon" id="cartToggle">
              <i className="fas fa-shopping-bag"></i>
              <span className="cart-count" id="cart-count">0</span>
            </div>
            <div className="nav-user-container" id="navUserContainer">
              {authState.user ? (
                <div className="nav-profile-menu">
                  <button
                    type="button"
                    className="nav-profile-link"
                    id="profileLink"
                    title={authState.user.name || authState.user.email}
                  >
                    <span className="profile-avatar">
                      <i className="fas fa-user"></i>
                    </span>
                    <span className="profile-name">{authState.user.name || 'Profile'}</span>
                    <i className="fas fa-chevron-down profile-caret"></i>
                  </button>
                  <div className="profile-dropdown" aria-label="Profile menu">
                    <Link to="/orders" className="profile-dropdown-item">
                      <i className="fas fa-receipt"></i>
                      <span>Orders</span>
                    </Link>
                    <button
                      type="button"
                      className="profile-dropdown-item profile-dropdown-action"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/auth-login" className="nav-link nav-auth-link" id="loginLink" data-login-button="true">
                  {authState.loading ? '...' : 'Login'}
                </Link>
              )}
            </div>
            <div className="hamburger" id="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <div className="cart-modal" id="cart-modal">
        <div className="cart-modal-content">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="close-cart" id="close-cart">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="cart-items" id="cart-items"></div>

          <div className="cart-footer">
            <div className="cart-total">
              <strong>Total: Rs <span id="cart-total">0.00</span></strong>
            </div>
            <div className="cart-actions">
              <button className="continue-shopping">Continue Shopping</button>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-view-modal" id="quick-view-modal">
        <div className="quick-view-content">
          <button className="close-quick-view" id="close-quick-view">
            <i className="fas fa-times"></i>
          </button>

          <div className="quick-view-body">
            <div className="quick-view-image">
              <img id="quick-view-img" src="" alt="" />
            </div>

            <div className="quick-view-details">
              <h2 id="quick-view-title"></h2>
              <div className="quick-view-rating">
                <div className="stars" id="quick-view-stars"></div>
                <span id="quick-view-reviews"></span>
              </div>
              <p className="quick-view-price" id="quick-view-price"></p>
              <p className="quick-view-description" id="quick-view-description"></p>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button className="qty-btn minus">-</button>
                  <input type="number" className="qty-input" defaultValue="1" min="1" />
                  <button className="qty-btn plus">+</button>
                </div>
              </div>

              <button className="add-to-cart-btn quick-view-add">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section footer-intro">
            <div className="footer-logo">
              <i className="fas fa-leaf"></i>
              <span>GreenLeaf Nursery</span>
            </div>
            <p>
              A calmer way to shop plants, pottery, and care essentials for modern homes.
            </p>
            <div className="social-links">
              <a href="/" onClick={(e) => e.preventDefault()}><i className="fab fa-facebook-f"></i></a>
              <a href="/" onClick={(e) => e.preventDefault()}><i className="fab fa-instagram"></i></a>
              <a href="/" onClick={(e) => e.preventDefault()}><i className="fab fa-pinterest-p"></i></a>
              <a href="/" onClick={(e) => e.preventDefault()}><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Browse</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/pots">Designer Pots</Link></li>
              <li><Link to="/tools">Care Tools</Link></li>
              <li><Link to="/gifting">Gifting</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/care">Plant Care Guides</Link></li>
              <li><Link to="/services">Nursery Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/orders">Track Orders</Link></li>
              <li><Link to="/auth-register">Create Account</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Stay Connected</h3>
            <div className="contact-info">
              <p><i className="fas fa-location-dot"></i> 123 Garden Street, Plant City</p>
              <p><i className="fas fa-phone"></i> +91 98765 43210</p>
              <p><i className="fas fa-envelope"></i> hello@greenleafnursery.com</p>
            </div>

            <div className="newsletter">
              <h4>Nursery Notes</h4>
              <form id="newsletterForm" className="newsletter-form">
                <input type="email" id="newsletterEmail" name="email" placeholder="Enter your email" required />
                <button type="submit" id="newsletterSubscribe">Subscribe</button>
              </form>
              <div id="newsletter-message" className="newsletter-message" style={{ display: 'none', marginTop: '0.5rem', fontSize: '0.9rem' }}></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright 2026 GreenLeaf Nursery. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
