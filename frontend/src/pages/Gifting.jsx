import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Gifting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

    */
  }, []);

  return (
    <>
      <div className="gifting-hero">
    <div className="container">
        <h1>🎁 Plant Gifting</h1>
        <p>Give the gift of green - thoughtful, sustainable, and memorable gifts for every occasion</p>
    </div>
</div>

<section className="gifting-intro">
    <div className="container">
        <div className="intro-card">
            <h2>Why Gift Plants?</h2>
            <p>Plants are living, growing reminders of your care and thoughtfulness. They purify air, boost mood, and bring nature indoors. Perfect for birthdays, anniversaries, housewarmings, corporate gifting, and every special moment in between.</p>
        </div>
    </div>
</section>

<section className="gifting-options">
    <div className="container">
        <h2 className="section-title">Gifting Options</h2>
        <div className="gifting-grid">
            <div className="gift-card">
                <div className="gift-icon"><i className="fas fa-seedling"></i></div>
                <h3>Curated Plant Sets</h3>
                <p>Beautifully paired plants and planters, professionally packaged and ready to gift. Each set includes care instructions and a handwritten note card.</p>
                <a href="/gifting" className="btn btn-primary">Explore Gift Sets</a>
            </div>
            
            <div className="gift-card">
                <div className="gift-icon"><i className="fas fa-envelope-open-text"></i></div>
                <h3>Personalized Messages</h3>
                <p>Add your heartfelt message and we'll include a premium note card with elegant calligraphy inside every gift box.</p>
                <button className="btn btn-secondary" onclick="alert('Add a note at checkout!')">Add Personalization</button>
            </div>
            
            <div className="gift-card">
                <div className="gift-icon"><i className="fas fa-truck"></i></div>
                <h3>Nationwide Delivery</h3>
                <p>Timely, careful delivery with detailed unboxing and care instructions for the recipient. Track your gift every step of the way.</p>
                <a href="/contact" className="btn btn-primary">See Delivery Options</a>
            </div>
        </div>
    </div>
</section>

<section className="gifting-cta">
    <div className="container">
        <div className="cta-card">
            <h2>Corporate &amp; Bulk Gifting</h2>
            <p>Surprise teams, clients, and partners with sustainable, memorable gifts that grow. Custom branding, bulk pricing, and white-glove service available for corporate orders.</p>
            <div className="cta-buttons">
                <a href="/contact" className="btn btn-outline btn-large">Contact Sales</a>
                <a href="/tools" className="btn btn-primary btn-large">Shop All Gifts</a>
            </div>
        </div>
    </div>
</section>

    </>
  );
};

export default Gifting;
