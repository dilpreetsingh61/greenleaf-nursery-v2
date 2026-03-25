import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

// ============================================================
// CHECKOUT PAGE - COMPLETE WORKING VERSION
// ============================================================

let currentStep = 1;
let cartData = null;
let shippingCost = 99;
let taxRate = 0.08;

// ============================================================
// INITIALIZATION
// ============================================================

function initializeCheckout() {
  console.log('🚀 Initializing checkout...');
  
  // Make sure only step 1 is visible
  document.getElementById('step-1').style.display = 'block';
  document.getElementById('step-2').style.display = 'none';
  document.getElementById('step-3').style.display = 'none';
  
  // Load cart data first, then update display
  loadCartData();
  setupEventListeners();
  
  console.log('✅ Checkout ready - Step 1 visible');
}

function loadCartData() {
  try {
    const savedCart = localStorage.getItem('plant-nursery-cart');
    console.log('📦 Raw cart data from localStorage:', savedCart);
    
    if (savedCart) {
      const items = JSON.parse(savedCart);
      console.log('📦 Parsed cart items:', items);
      
      if (!Array.isArray(items) || items.length === 0) {
        console.log('⚠️ Cart is empty or invalid');
        cartData = { items: [], isEmpty: true, totalItems: 0, totalAmount: 0 };
        showEmptyCartMessage();
        return;
      }
      
      cartData = {
        items: items,
        isEmpty: false,
        totalItems: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
        totalAmount: items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
      };
      console.log('✅ Cart loaded successfully:', cartData);
      
      // Update display after loading
      updateOrderSummary();
    } else {
      console.log('⚠️ No cart data found in localStorage');
      cartData = { items: [], isEmpty: true, totalItems: 0, totalAmount: 0 };
      showEmptyCartMessage();
    }
  } catch (error) {
    console.error('❌ Error loading cart:', error);
    cartData = { items: [], isEmpty: true, totalItems: 0, totalAmount: 0 };
    showEmptyCartMessage();
  }
}

function showEmptyCartMessage() {
  const checkoutItems = document.getElementById('checkout-items');
  if (checkoutItems) {
    checkoutItems.innerHTML = `
      <div style="text-align:center;padding:3rem;background:#f8f9fa;border-radius:8px;">
        <i class="fas fa-shopping-cart" style="font-size:3rem;color:#ccc;margin-bottom:1rem;"></i>
        <h3 style="color:#666;margin-bottom:0.5rem;">Your cart is empty</h3>
        <p style="color:#999;margin-bottom:1.5rem;">Add some items to your cart to proceed with checkout.</p>
        <Link to="/" className="btn btn-primary">
          <i class="fas fa-arrow-left"></i> Continue Shopping
        </a>
      </div>
    `;
  }
  
  // Update summary to show zeros
  const summaryItems = document.getElementById('summary-items');
  if (summaryItems) {
    summaryItems.innerHTML = '<p style="color:#999;text-align:center;">No items in cart</p>';
  }
  
  document.getElementById('subtotal-amount').textContent = '₹0';
  document.getElementById('tax-amount').textContent = '₹0';
  document.getElementById('final-total').textContent = '₹0';
}

function updateOrderSummary() {
  if (!cartData || cartData.isEmpty || !cartData.items || cartData.items.length === 0) {
    console.log('⚠️ Cannot update order summary - cart is empty');
    showEmptyCartMessage();
    return;
  }
  
  console.log('📊 Updating order summary with', cartData.items.length, 'items');
  
  // Update cart items display
  const checkoutItems = document.getElementById('checkout-items');
  if (checkoutItems) {
    checkoutItems.innerHTML = cartData.items.map(item => {
      const imageUrl = item.image || '/images/DemoPotPlant.jpg';
      const itemName = item.name || 'Unknown Product';
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      const itemTotal = itemPrice * itemQuantity;
      
      return `
        <div class="checkout-item" style="display:flex;gap:1rem;margin-bottom:1rem;padding:1rem;background:#f8f9fa;border-radius:8px;border:1px solid #e0e0e0;">
          <img src="${imageUrl}" alt="${itemName}" style="width:80px;height:80px;object-fit:cover;border-radius:4px;background:#fff;">
          <div style="flex:1;">
            <h4 style="margin:0 0 0.5rem 0;color:var(--primary-green);">${itemName}</h4>
            <p style="margin:0 0 0.5rem 0;color:#666;font-size:0.9rem;">Quantity: ${itemQuantity}</p>
            <p style="margin:0.5rem 0 0 0;font-weight:600;color:var(--primary-green);font-size:1.1rem;">₹${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Update summary sidebar
  const summaryItems = document.getElementById('summary-items');
  if (summaryItems) {
    summaryItems.innerHTML = cartData.items.map(item => {
      const itemName = item.name || 'Unknown Product';
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 1;
      const itemTotal = itemPrice * itemQuantity;
      
      return `
        <div style="display:flex;justify-content:space-between;margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid #eee;">
          <span style="color:#333;">${itemName} x${itemQuantity}</span>
          <span style="font-weight:600;color:var(--primary-green);">₹${itemTotal.toFixed(2)}</span>
        </div>
      `;
    }).join('');
  }
  
  // Calculate and update totals
  const subtotal = cartData.totalAmount || 0;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;
  
  const subtotalEl = document.getElementById('subtotal-amount');
  const taxEl = document.getElementById('tax-amount');
  const totalEl = document.getElementById('final-total');
  
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  
  console.log('✅ Order summary updated - Subtotal:', subtotal, 'Total:', total);
}

function setupEventListeners() {
  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      
      const selectedMethod = this.getAttribute('data-method');
      document.querySelectorAll('.payment-form').forEach(form => {
        if (form.classList.contains(`${selectedMethod}-payment`)) {
          form.style.display = 'block';
        } else {
          form.style.display = 'none';
        }
      });
    });
  });
  
  // Shipping method change
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const prices = { standard: 99, express: 199 };
      shippingCost = prices[this.value] || 99;
      document.getElementById('shipping-amount').textContent = `₹${shippingCost.toFixed(2)}`;
      updateOrderSummary();
    });
  });
}

// ============================================================
// GLOBAL FUNCTIONS (accessible from onclick)
// ============================================================

window.nextStep = function() {
  console.log('▶️▶️▶️ NEXTSTEP FUNCTION CALLED! ▶️▶️▶️');
  console.log('Current step:', currentStep);
  console.log('Step 1 element:', document.getElementById('step-1'));
  console.log('Step 2 element:', document.getElementById('step-2'));
  
  // For step 1, just move to step 2 (no validation)
  if (currentStep === 1) {
    console.log('✅ We are on step 1, moving to step 2...');
    
    // Hide step 1
    const step1 = document.getElementById('step-1');
    if (step1) {
      step1.style.display = 'none';
      console.log('✅ Step 1 hidden');
    } else {
      console.error('❌ Step 1 element not found!');
    }
    
    document.querySelectorAll('.step')[0].classList.remove('active');
    
    // Show step 2
    const step2 = document.getElementById('step-2');
    if (step2) {
      step2.style.display = 'block';
      console.log('✅ Step 2 shown');
    } else {
      console.error('❌ Step 2 element not found!');
    }
    
    document.querySelectorAll('.step')[1].classList.add('active');
    
    currentStep = 2;
    console.log('✅ Now on step 2');
    window.scrollTo(0, 0);
    return;
  }
  
  // For step 2, validate then move to step 3
  if (currentStep === 2) {
    const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    let valid = true;
    
    shippingFields.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        if (el) el.style.borderColor = 'red';
        valid = false;
      } else {
        if (el) el.style.borderColor = '';
      }
    });
    
    if (!valid) {
      alert('⚠️ Please fill all shipping fields');
      return;
    }
    
    // Hide step 2
    document.getElementById('step-2').style.display = 'none';
    document.querySelectorAll('.step')[1].classList.remove('active');
    
    // Show step 3
    document.getElementById('step-3').style.display = 'block';
    document.querySelectorAll('.step')[2].classList.add('active');
    
    currentStep = 3;
    console.log('✅ Now on step 3');
    window.scrollTo(0, 0);
  }
}

window.prevStep = function() {
  console.log('◀️ BACK BUTTON - Moving from step', currentStep);
  
  if (currentStep === 2) {
    // Hide step 2
    document.getElementById('step-2').style.display = 'none';
    document.querySelectorAll('.step')[1].classList.remove('active');
    
    // Show step 1
    document.getElementById('step-1').style.display = 'block';
    document.querySelectorAll('.step')[0].classList.add('active');
    
    currentStep = 1;
    console.log('✅ Back to step 1');
    window.scrollTo(0, 0);
  } else if (currentStep === 3) {
    // Hide step 3
    document.getElementById('step-3').style.display = 'none';
    document.querySelectorAll('.step')[2].classList.remove('active');
    
    // Show step 2
    document.getElementById('step-2').style.display = 'block';
    document.querySelectorAll('.step')[1].classList.add('active');
    
    currentStep = 2;
    console.log('✅ Back to step 2');
    window.scrollTo(0, 0);
  }
}

window.processPayment = function() {
  console.log('💳 Process payment clicked');
  
  if (!validateCurrentStep()) {
    console.log('❌ Payment validation failed');
    return;
  }
  
  // Show loading overlay
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'flex';
  
  // Get form data
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zipCode = document.getElementById('zipCode').value;
  
  // Calculate final total
  const total = parseFloat(document.getElementById('final-total').textContent.replace('₹', '').replace(',', ''));
  
  // Get payment method
  const paymentMethod = document.querySelector('.payment-method.active')?.getAttribute('data-method') || 'card';
  
  // Prepare shipping info
  const shippingInfo = {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zipCode
  };
  
  console.log('💰 Processing payment:', {
    name: `${firstName} ${lastName}`,
    email: email,
    amount: total,
    method: paymentMethod,
    cart: cartData.items,
    shippingInfo
  });
  
  // Send payment request
  fetch('/api/payment/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `${firstName} ${lastName}`,
      email: email,
      amount: total,
      method: paymentMethod,
      cart: cartData.items,
      shippingInfo: shippingInfo
    })
  })
  .then(response => response.json())
  .then(data => {
    if (overlay) overlay.style.display = 'none';
    
    if (data.success) {
      console.log('✅ Payment successful!', data);
      
      // Update success modal
      document.getElementById('order-number').textContent = data.transactionId;
      
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      document.getElementById('delivery-date').textContent = deliveryDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Show success modal
      document.getElementById('success-modal').style.display = 'flex';
      
      // Clear cart
      localStorage.removeItem('plant-nursery-cart');
      
      // Update cart count if function exists
      if (typeof updateCartCount === 'function') {
        updateCartCount();
      }
    } else {
      throw new Error(data.error || 'Payment failed');
    }
  })
  .catch(error => {
    console.error('❌ Payment error:', error);
    if (overlay) overlay.style.display = 'none';
    alert('❌ Payment failed: ' + error.message + '\n\nPlease try again.');
  });
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      // Order summary - no validation needed
      return true;
      
    case 2:
      // Shipping information validation
      const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      let allFilled = true;
      
      shippingFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (!element || !element.value.trim()) {
          if (element) element.style.borderColor = 'red';
          allFilled = false;
        } else {
          if (element) element.style.borderColor = '';
        }
      });
      
      if (!allFilled) {
        alert('⚠️ Please fill in all required shipping fields.');
        return false;
      }
      
      // Validate email format
      const email = document.getElementById('email').value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('⚠️ Please enter a valid email address.');
        document.getElementById('email').style.borderColor = 'red';
        return false;
      }
      
      return true;
      
    case 3:
      // Payment validation
      const activeMethod = document.querySelector('.payment-method.active')?.getAttribute('data-method');
      
      if (activeMethod === 'card') {
        const paymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        let allFilled = true;
        
        paymentFields.forEach(fieldId => {
          const element = document.getElementById(fieldId);
          if (!element || !element.value.trim()) {
            if (element) element.style.borderColor = 'red';
            allFilled = false;
          } else {
            if (element) element.style.borderColor = '';
          }
        });
        
        if (!allFilled) {
          alert('⚠️ Please fill in all payment card fields.');
          return false;
        }
      }
      
      return true;
      
    default:
      return true;
  }
}

// ============================================================
// INITIALIZE ON PAGE LOAD
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🌱 DOM loaded, initializing checkout...');
  initializeCheckout();
  
  // Test global functions
  console.log('🧪 Global functions check:');
  console.log('  nextStep:', typeof window.nextStep);
  console.log('  prevStep:', typeof window.prevStep);
  console.log('  processPayment:', typeof window.processPayment);
  
  // Fix all buttons with icons that prevent onclick from firing
  const buttonConfigs = [
    { id: 'continue-to-shipping-btn', action: () => window.nextStep(), name: 'Continue to Shipping' },
    { id: 'continue-to-payment-btn', action: () => window.nextStep(), name: 'Continue to Payment' },
    { id: 'back-to-order-btn', action: () => window.prevStep(), name: 'Back to Order' },
    { id: 'back-btn', action: () => window.prevStep(), name: 'Back' },
    { id: 'complete-order-btn', action: () => window.processPayment(), name: 'Complete Order' }
  ];
  
  buttonConfigs.forEach(config => {
    const btn = document.getElementById(config.id);
    if (btn) {
      console.log(`✅ Found ${config.name} button`);
      btn.addEventListener('click', function(e) {
        console.log(`🔘 ${config.name} clicked!`);
        e.preventDefault();
        e.stopPropagation();
        config.action();
      });
    } else {
      console.warn(`⚠️ ${config.name} button not found (ID: ${config.id})`);
    }
  });
  
  // Make nextStep available in console for testing
  window.testNextStep = function() {
    console.log('🧪 Manual test of nextStep...');
    window.nextStep();
  };
  
  console.log('💡 TIP: Type "testNextStep()" in console to test the function manually');
});

    */
  }, []);

  return (
    <>
      <div className="checkout-page">
  <div className="container">
    <div className="checkout-header">
      <h1><i className="fas fa-shopping-bag"></i> Secure Checkout</h1>
      <div className="checkout-steps">
        <div className="step active" data-step="1">
          <span className="step-number">1</span>
          <span className="step-title">Order Summary</span>
        </div>
        <div className="step" data-step="2">
          <span className="step-number">2</span>
          <span className="step-title">Shipping Info</span>
        </div>
        <div className="step" data-step="3">
          <span className="step-number">3</span>
          <span className="step-title">Payment</span>
        </div>
      </div>
    </div>

    <div className="checkout-content">
      <div className="checkout-main">
        {/*  Step 1  */}
        <div className="checkout-step active" id="step-1">
          <h2><i className="fas fa-list-ul"></i> Order Summary</h2>
          <div className="order-items" id="checkout-items"></div>

          <div className="step-actions">
            <Link to="/" className="btn btn-secondary"><i className="fas fa-arrow-left"></i> Continue Shopping</Link>
            <button type="button" className="btn btn-primary" id="continue-to-shipping-btn" onclick="console.log('🔘 onclick fired!'); nextStep();">Continue to Shipping <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>

        {/*  Step 2  */}
        <div className="checkout-step" id="step-2">
          <h2><i className="fas fa-shipping-fast"></i> Shipping Information</h2>
          <form className="shipping-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input type="text" id="firstName" required="" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input type="text" id="lastName" required="" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input type="email" id="email" required="" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" required="" />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input type="text" id="address" placeholder="Street address" required="" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input type="text" id="city" required="" />
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <select id="state" required="">
                  <option value="">Select State</option>
                  <option value="AN">Andaman and Nicobar Islands</option>
                  <option value="AP">Andhra Pradesh</option>
                  <option value="AR">Arunachal Pradesh</option>
                  <option value="AS">Assam</option>
                  <option value="BR">Bihar</option>
                  <option value="CH">Chandigarh</option>
                  <option value="CG">Chhattisgarh</option>
                  <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="DL">Delhi</option>
                  <option value="GA">Goa</option>
                  <option value="GJ">Gujarat</option>
                  <option value="HR">Haryana</option>
                  <option value="HP">Himachal Pradesh</option>
                  <option value="JK">Jammu and Kashmir</option>
                  <option value="JH">Jharkhand</option>
                  <option value="KA">Karnataka</option>
                  <option value="KL">Kerala</option>
                  <option value="LA">Ladakh</option>
                  <option value="LD">Lakshadweep</option>
                  <option value="MP">Madhya Pradesh</option>
                  <option value="MH">Maharashtra</option>
                  <option value="MN">Manipur</option>
                  <option value="ML">Meghalaya</option>
                  <option value="MZ">Mizoram</option>
                  <option value="NL">Nagaland</option>
                  <option value="OR">Odisha</option>
                  <option value="PY">Puducherry</option>
                  <option value="PB">Punjab</option>
                  <option value="RJ">Rajasthan</option>
                  <option value="SK">Sikkim</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="TS">Telangana</option>
                  <option value="TR">Tripura</option>
                  <option value="UP">Uttar Pradesh</option>
                  <option value="UK">Uttarakhand</option>
                  <option value="WB">West Bengal</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">PIN Code *</label>
                <input type="text" id="zipCode" placeholder="e.g. 110001" required="" />
              </div>
            </div>

            <div className="shipping-options">
              <h3>Shipping Method</h3>
              <div className="shipping-option">
                <input type="radio" id="standard" name="shipping" value="standard" checked="" />
                <label htmlFor="standard">
                  <span className="option-name">Standard (5–7 days)</span>
                  <span className="option-price">₹99</span>
                </label>
              </div>
              <div className="shipping-option">
                <input type="radio" id="express" name="shipping" value="express" />
                <label htmlFor="express">
                  <span className="option-name">Express (2–3 days)</span>
                  <span className="option-price">₹199</span>
                </label>
              </div>
            </div>
          </form>

          <div className="step-actions">
            <button type="button" className="btn btn-secondary" id="back-to-order-btn" onclick="prevStep()"><i className="fas fa-arrow-left"></i> Back to Order</button>
            <button type="button" className="btn btn-primary" id="continue-to-payment-btn" onclick="nextStep()">Continue to Payment <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>

        {/*  Step 3  */}
        <div className="checkout-step" id="step-3">
          <h2><i className="fas fa-credit-card"></i> Payment Information</h2>
          <div className="payment-methods">
            <div className="payment-method active" data-method="card">
              <i className="fas fa-credit-card"></i>
              <span>Credit/Debit Card</span>
            </div>
            <div className="payment-method" data-method="paypal">
              <i className="fab fa-paypal"></i>
              <span>PayPal</span>
            </div>
          </div>

          <div className="payment-form card-payment">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required="" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry *</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" required="" />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input type="text" id="cvv" placeholder="123" required="" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cardName">Name on Card *</label>
              <input type="text" id="cardName" required="" />
            </div>
          </div>

          <div className="step-actions">
            <button type="button" className="btn btn-secondary" id="back-btn" onclick="prevStep()"><i className="fas fa-arrow-left"></i> Back</button>
            <button type="button" className="btn btn-primary btn-lg" id="complete-order-btn" onclick="processPayment()">
              <i className="fas fa-lock"></i> Complete Order Securely
            </button>
          </div>
        </div>
      </div>

      <div className="checkout-sidebar">
        <div className="order-summary">
          <h3><i className="fas fa-receipt"></i> Order Summary</h3>
          <div className="summary-items" id="summary-items"></div>
          <div className="summary-totals">
            <div className="total-row"><span>Subtotal:</span><span id="subtotal-amount">₹0</span></div>
            <div className="total-row"><span>Shipping:</span><span id="shipping-amount">₹99</span></div>
            <div className="total-row"><span>Tax:</span><span id="tax-amount">₹0</span></div>
            <div className="total-row final-total"><span>Total:</span><span id="final-total">₹0</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/*  Success Modal  */}
<div className="modal success-modal" id="success-modal">
  <div className="modal-content">
    <div className="success-icon"><i className="fas fa-check-circle"></i></div>
    <h2>Order Confirmed!</h2>
    <p>Thank you for your purchase. Your order will be shipped soon.</p>
    <div className="order-details">
      <p><strong>Order #:</strong> <span id="order-number"></span></p>
      <p><strong>Est. Delivery:</strong> <span id="delivery-date"></span></p>
    </div>
    <div className="success-actions">
      <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
    </div>
  </div>
</div>

{/*  Loading Overlay  */}
<div id="loading-overlay">
  <div className="spinner"></div>
  <p>Processing Payment...</p>
</div>





    </>
  );
};

export default Checkout;