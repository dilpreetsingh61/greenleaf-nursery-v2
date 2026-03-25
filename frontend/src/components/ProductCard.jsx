import React from 'react';

const ProductCard = ({ product, index }) => {
  const handleAddToCart = (productId, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.addToCart) {
      window.addToCart(productId);
    }
  };

  const isPot = product.category === 'pots';
  const isTool = product.category === 'tools';
  const iconClass = isPot ? 'fa-box' : (isTool ? 'fa-tools' : 'fa-seedling');

  return (
    <div className="product-card" data-product-id={product.id} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={`product-image ${!product.inStock ? 'out-of-stock' : ''}`}>
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" />
        ) : (
          <div className="placeholder-image">
            <i className={`fas ${iconClass}`}></i>
          </div>
        )}
        {!product.inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        {product.size && <p className="product-size">Size: {product.size}</p>}
        <div className="product-price">
          <span className="current-price">Rs {Number(product.price).toFixed(0)}</span>
        </div>
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            data-react-add-to-cart="true"
            disabled={!product.inStock}
            onClick={(event) => handleAddToCart(product.id, event)}
          >
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
