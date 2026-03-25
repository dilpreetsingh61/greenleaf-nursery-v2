import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SplitHero from '../components/SplitHero';

const Care = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

    */
  }, []);

  return (
    <>
      <SplitHero
    title="The Plant Care Library"
    description="Everything you need to know to keep your botanical companions thriving, from watering schedules to finding the perfect light."
    ctaLabel="Explore Care Guides"
    ctaHref="#care-guide-section"
    imageSrc="/images/products/plants/rubber-plant.jpg"
    imageAlt="A healthy indoor plant being gently cleaned and cared for"
/>

<section className="care-guide-section" id="care-guide-section">
    <div className="container">
        <div className="section-intro">
            <h2>Essential Care Tips</h2>
            <p>Understanding the fundamentals of plant care is key to growing healthy, vibrant plants. Follow these expert guidelines to create the perfect environment for your botanical companions.</p>
        </div>
        
        <div className="tips-grid">
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-tint"></i></div>
                <h3>Watering</h3>
                <p>Most plants prefer the soil to dry slightly between waterings. Water deeply until excess drains out, then wait until the top inch of soil is dry. Overwatering is the #1 cause of plant death!</p>
            </div>
            
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-sun"></i></div>
                <h3>Lighting</h3>
                <p>Bright, indirect light works for most houseplants. Avoid harsh midday sun through glass which can scorch leaves. Rotate plants weekly for even growth and consider grow lights for darker spaces.</p>
            </div>
            
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-leaf"></i></div>
                <h3>Soil &amp; Drainage</h3>
                <p>Use well-draining potting mix enriched with organic matter. Add perlite for aeration. Succulents and cacti need extra drainage with sand or pumice. Never use garden soil indoors!</p>
            </div>
            
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-thermometer-half"></i></div>
                <h3>Temperature</h3>
                <p>Keep temps between 18-24°C (65-75°F) for most houseplants. Avoid drafts, air conditioners, and heating vents. Tropical plants need warmer temps; succulents tolerate cooler conditions.</p>
            </div>
            
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-bug"></i></div>
                <h3>Pest Control</h3>
                <p>Check leaf undersides regularly for pests. Early detection is crucial! Treat with insecticidal soap or neem oil. Quarantine new plants for 2 weeks before adding to your collection.</p>
            </div>
            
            <div className="tip-card">
                <div className="tip-icon"><i className="fas fa-seedling"></i></div>
                <h3>Fertilizing</h3>
                <p>Feed plants during active growth (spring-summer) with diluted balanced fertilizer. Reduce or stop in fall and winter when growth slows. Over-fertilizing can damage roots and burn leaves.</p>
            </div>
        </div>
    </div>
</section>

{/*  Category-specific Care Cards  */}
<section className="care-categories-section">
    <div className="container">
        <div className="section-intro">
            <h2>Care by Plant Type</h2>
            <p>Different plants have different needs. Here's your quick reference guide for the most popular plant categories.</p>
        </div>
        
        <div className="care-category-grid">
            <div className="care-category-card">
                <div className="care-category-icon"><i className="fas fa-home"></i></div>
                <h3>Indoor Plants</h3>
                <ul className="care-list">
                    <li><i className="fas fa-tint"></i> <strong>Water:</strong> When top 2-3 cm soil is dry</li>
                    <li><i className="fas fa-sun"></i> <strong>Light:</strong> Bright, indirect light</li>
                    <li><i className="fas fa-seedling"></i> <strong>Soil:</strong> Well-draining mix with perlite</li>
                    <li><i className="fas fa-flask"></i> <strong>Fertilizer:</strong> Monthly in spring/summer</li>
                </ul>
                <button className="btn-category">View Indoor Plants</button>
            </div>
            
            <div className="care-category-card">
                <div className="care-category-icon"><i className="fas fa-tree"></i></div>
                <h3>Outdoor Plants</h3>
                <ul className="care-list">
                    <li><i className="fas fa-tint"></i> <strong>Water:</strong> 2-3×/week; daily in heat</li>
                    <li><i className="fas fa-sun"></i> <strong>Light:</strong> 4-6 hrs direct morning sun</li>
                    <li><i className="fas fa-seedling"></i> <strong>Soil:</strong> Rich loam with compost</li>
                    <li><i className="fas fa-flask"></i> <strong>Fertilizer:</strong> Balanced NPK every 4-6 weeks</li>
                </ul>
                <button className="btn-category">View Outdoor Plants</button>
            </div>
            
            <div className="care-category-card">
                <div className="care-category-icon"><i className="fas fa-cactus"></i></div>
                <h3>Succulents</h3>
                <ul className="care-list">
                    <li><i className="fas fa-tint"></i> <strong>Water:</strong> Every 2-3 weeks (dry out fully)</li>
                    <li><i className="fas fa-sun"></i> <strong>Light:</strong> Bright light, some direct OK</li>
                    <li><i className="fas fa-seedling"></i> <strong>Soil:</strong> Cactus mix with sand/perlite</li>
                    <li><i className="fas fa-flask"></i> <strong>Fertilizer:</strong> Half-strength, monthly in growth</li>
                </ul>
                <button className="btn-category">View Succulents</button>
            </div>
            
            <div className="care-category-card">
                <div className="care-category-icon"><i className="fas fa-spa"></i></div>
                <h3>Flowering Plants</h3>
                <ul className="care-list">
                    <li><i className="fas fa-tint"></i> <strong>Water:</strong> Keep evenly moist</li>
                    <li><i className="fas fa-sun"></i> <strong>Light:</strong> 4-6 hrs bright light</li>
                    <li><i className="fas fa-seedling"></i> <strong>Soil:</strong> Fertile, well-draining</li>
                    <li><i className="fas fa-flask"></i> <strong>Fertilizer:</strong> High-phosphorus during bloom</li>
                </ul>
                <button className="btn-category">View Flowering Plants</button>
            </div>
        </div>
    </div>
</section>




    </>
  );
};

export default Care;

