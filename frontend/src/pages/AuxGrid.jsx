import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SplitHero from '../components/SplitHero';

const AuxGrid = ({ category }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const heroContent = category === 'pots'
    ? {
        title: 'Designer Pots & Planters',
        description: 'Elevate your greenery with our collection of handcrafted ceramic, textured terracotta, and modern minimalist planters.',
        ctaLabel: 'Browse All Pots',
        imageSrc: '/images/products/pots/terracotta-pot-collection.jpg',
        imageAlt: 'A styled collection of designer pots and planters',
      }
    : {
        title: 'Essential Plant Care Tools',
        description: 'Find reliable watering cans, pruning kits, soil tools, and everyday care essentials built to keep your plants thriving.',
        ctaLabel: 'Shop All Tools',
        imageSrc: '/images/products/tools/tool-kit.jpg',
        imageAlt: 'Plant care tools arranged neatly on a work surface',
      };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/products?category=${category}&limit=100`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data && data.data.products) {
          setItems(data.data.products);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('Error fetching products', e);
        setItems([]);
        setError('Unable to load products right now. Please try again.');
      }
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  return (
    <>
      <SplitHero
        title={heroContent.title}
        description={heroContent.description}
        ctaLabel={heroContent.ctaLabel}
        ctaHref="#products-grid-section"
        imageSrc={heroContent.imageSrc}
        imageAlt={heroContent.imageAlt}
      />

      <section className="products-section" id="products-grid-section">
        <div className="container">
          {loading ? (
             <div className="loading-spinner"><div className="spinner"></div></div>
          ) : error ? (
            <div className="empty-state">
              <i className="fas fa-triangle-exclamation"></i>
              <h2>Unable to Load Items</h2>
              <p>{error}</p>
            </div>
          ) : items.length > 0 ? (
            <div className="products-grid">
              {items.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h2>No Items Found</h2>
              <p>We're currently updating our collection. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AuxGrid;
