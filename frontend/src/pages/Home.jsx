import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SplitHero from '../components/SplitHero';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [careLevels, setCareLevels] = useState([]);
  const [size, setSize] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200);
  const [sort, setSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [view, setView] = useState('grid');
  const [error, setError] = useState('');
  const limit = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.append('limit', '100');
        params.append('sort', sort);
        params.append('maxPrice', String(maxPrice));

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data && data.data.products) {
          let fetchedProducts = data.data.products;
          const plantCategories = ['indoor', 'outdoor', 'flowering', 'succulent'];
          fetchedProducts = fetchedProducts.filter((product) => plantCategories.includes(product.category?.toLowerCase()));

          window.allProductsData = fetchedProducts;

          if (categories.length > 0) {
            fetchedProducts = fetchedProducts.filter((product) => categories.includes(product.category?.toLowerCase()));
          }
          if (careLevels.length > 0) {
            fetchedProducts = fetchedProducts.filter((product) => careLevels.includes(product.care?.toLowerCase()));
          }
          if (size !== 'all') {
            fetchedProducts = fetchedProducts.filter((product) => product.size?.toLowerCase() === size);
          }
          fetchedProducts = fetchedProducts.filter((product) => Number(product.price) <= maxPrice);

          if (sort === 'price-low') fetchedProducts.sort((a, b) => Number(a.price) - Number(b.price));
          if (sort === 'price-high') fetchedProducts.sort((a, b) => Number(b.price) - Number(a.price));
          if (sort === 'rating') fetchedProducts.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
          if (sort === 'name') fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
          if (sort === 'featured') {
            fetchedProducts.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
          }

          setTotalProducts(fetchedProducts.length);
          setTotalPages(Math.ceil(fetchedProducts.length / limit));

          const start = (currentPage - 1) * limit;
          setProducts(fetchedProducts.slice(start, start + limit));
        } else {
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(1);
        }
      } catch (fetchError) {
        console.error('Error fetching products', fetchError);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setError('Unable to load products right now. Please try again.');
      }

      setLoading(false);
    };

    fetchProducts();
  }, [categories, careLevels, size, maxPrice, sort, currentPage]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategories((previous) => (event.target.checked ? [...previous, value] : previous.filter((item) => item !== value)));
    setCurrentPage(1);
  };

  const handleCareChange = (event) => {
    const value = event.target.value;
    setCareLevels((previous) => (event.target.checked ? [...previous, value] : previous.filter((item) => item !== value)));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategories([]);
    setCareLevels([]);
    setSize('all');
    setMaxPrice(200);
    setCurrentPage(1);
  };

  return (
    <>
      <SplitHero
        title="Bring Nature Indoors"
        description="Discover our curated collection of vibrant indoor plants, designer pottery, and premium care tools to transform your space."
        ctaLabel="Shop the Collection"
        ctaHref="#products-section"
        imageSrc="/images/hero-bg.jpg"
        imageAlt="Indoor plants arranged in a calm living room"
      />

      <main className="main-content">
        <div className="content-container">
          <aside className="sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-group">
                {['indoor', 'outdoor', 'flowering', 'succulent'].map((category) => (
                  <label className="filter-item" key={category}>
                    <input type="checkbox" name="category" value={category} checked={categories.includes(category)} onChange={handleCategoryChange} />
                    <span className="checkmark"></span>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Plants
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-filter">
                <input type="range" min="0" max="200" value={maxPrice} onChange={(event) => { setMaxPrice(Number(event.target.value)); setCurrentPage(1); }} />
                <div className="price-labels">
                  <span>Rs 0</span>
                  <span>Rs {maxPrice}</span>
                  <span>Rs 200</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Size</h3>
              <div className="filter-group">
                <label className="filter-item">
                  <input type="radio" name="size" checked={size === 'small'} onChange={() => { setSize('small'); setCurrentPage(1); }} />
                  <span className="radiomark"></span>
                  Small (0-1 ft)
                </label>
                <label className="filter-item">
                  <input type="radio" name="size" checked={size === 'medium'} onChange={() => { setSize('medium'); setCurrentPage(1); }} />
                  <span className="radiomark"></span>
                  Medium (1-3 ft)
                </label>
                <label className="filter-item">
                  <input type="radio" name="size" checked={size === 'large'} onChange={() => { setSize('large'); setCurrentPage(1); }} />
                  <span className="radiomark"></span>
                  Large (3+ ft)
                </label>
                <label className="filter-item">
                  <input type="radio" name="size" checked={size === 'all'} onChange={() => { setSize('all'); setCurrentPage(1); }} />
                  <span className="radiomark"></span>
                  All Sizes
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3>Care Level</h3>
              <div className="filter-group">
                {['easy', 'moderate', 'expert'].map((care) => (
                  <label className="filter-item" key={care}>
                    <input type="checkbox" name="care" value={care} checked={careLevels.includes(care)} onChange={handleCareChange} />
                    <span className="checkmark"></span>
                    {care.charAt(0).toUpperCase() + care.slice(1)} Care
                  </label>
                ))}
              </div>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
          </aside>

          <section className="products-section" id="products-section">
            <div className="products-header">
              <div className="results-info">
                <p className="eyebrow">Plant discovery</p>
                <h2>Browse the nursery</h2>
                <span className="results-count">
                  Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
                </span>
              </div>

              <div className="sort-options">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" value={sort} onChange={(event) => { setSort(event.target.value); setCurrentPage(1); }}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

              <div className="view-toggle">
                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
                  <i className="fas fa-th"></i>
                </button>
                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner" style={{ display: 'flex', margin: 'auto' }}><div className="spinner"></div></div>
            ) : error ? (
              <div className="empty-state">
                <i className="fas fa-triangle-exclamation"></i>
                <h2>Unable to Load Products</h2>
                <p>{error}</p>
              </div>
            ) : products.length > 0 ? (
              <div className={`products-grid ${view}-view`}>
                {products.map((item, index) => (
                  <ProductCard key={item.id} product={item} index={index} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <h2>No Items Found</h2>
                <p>We could not find any plants matching those filters.</p>
                <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}>
                  <i className="fas fa-chevron-left"></i>
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`page-num ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

    </>
  );
};

export default Home;
