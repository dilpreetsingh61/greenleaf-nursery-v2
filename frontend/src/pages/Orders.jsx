import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

  // Load user orders
  async function loadOrders() {
    try {
      const response = await fetch('/api/orders/my-orders');
      const data = await response.json();
      
      const ordersList = document.getElementById('orders-list');
      
      if (!data.success || data.orders.length === 0) {
        ordersList.innerHTML = `
          <div class="no-orders">
            <i class="fas fa-box-open"></i>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link to="/" className="btn btn-primary">
              <i class="fas fa-shopping-cart"></i> Start Shopping
            </a>
          </div>
        `;
        return;
      }
      
      ordersList.innerHTML = data.orders.map(order => {
        // Parse the timestamp and add IST offset (5 hours 30 minutes)
        const utcDate = new Date(order.created_at);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        const orderDate = new Date(utcDate.getTime() + istOffset);
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        const shippingInfo = typeof order.shipping_info === 'string' ? JSON.parse(order.shipping_info) : order.shipping_info;
        
        return `
          <div class="order-card">
            <div class="order-header">
              <div>
                <div class="order-id">Order #${order.transaction_id || order.id}</div>
                <div class="order-date">${orderDate.toLocaleString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}</div>
              </div>
              <span class="order-status status-${order.payment_status}">${order.payment_status.toUpperCase()}</span>
            </div>
            
            <div class="order-items">
              ${items.map(item => `
                <div class="order-item">
                  <img src="${item.image || '/images/DemoPotPlant.jpg'}" alt="${item.name}" class="item-image">
                  <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            
            ${shippingInfo ? `
              <div class="shipping-info">
                <h4><i class="fas fa-shipping-fast"></i> Shipping Address</h4>
                <p><strong>${shippingInfo.firstName} ${shippingInfo.lastName}</strong></p>
                <p>${shippingInfo.address}</p>
                <p>${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.zipCode}</p>
                <p><i class="fas fa-phone"></i> ${shippingInfo.phone}</p>
                <p><i class="fas fa-envelope"></i> ${shippingInfo.email}</p>
              </div>
            ` : ''}
            
            <div class="order-footer">
              <div>
                <strong>Payment Method:</strong> ${order.payment_method ? order.payment_method.toUpperCase() : 'N/A'}
              </div>
              <div class="order-total">
                Total: ₹${parseFloat(order.total_amount).toFixed(2)}
              </div>
            </div>
          </div>
        `;
      }).join('');
      
    } catch (error) {
      console.error('Error loading orders:', error);
      document.getElementById('orders-list').innerHTML = `
        <div class="no-orders">
          <i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>
          <h2>Error Loading Orders</h2>
          <p>Sorry, we couldn't load your orders. Please try again later.</p>
        </div>
      `;
    }
  }
  
  // Load orders when page loads
  document.addEventListener('DOMContentLoaded', loadOrders);

    */
  }, []);

  return (
    <>
      <div className="orders-container">
  <div className="orders-header">
    <h1><i className="fas fa-shopping-bag"></i> My Orders</h1>
    <p>View all your past orders and track their status</p>
  </div>
  
  <div id="orders-list">
    <div className="loading" style={{ textAlign: 'center', padding: '3rem' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-green)' }}></i>
      <p>Loading your orders...</p>
    </div>
  </div>
</div>



    </>
  );
};

export default Orders;