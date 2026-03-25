import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SplitHero from '../components/SplitHero';

const Contact = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const contactData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                newsletter: formData.get('newsletter') === 'on'
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Submit contact form
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if(typeof showNotification === 'function'){
                        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                    }else{
                        alert('Thank you! Your message has been sent successfully.');
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                if(typeof showNotification === 'function'){
                    showNotification('Failed to send message. Please try again or contact us directly.', 'error');
                }else{
                    alert('Failed to send message. Please try again.');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Start chat functionality
    const startChatBtn = document.getElementById('startChat');
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            // Simulate chat widget opening
            showNotification('Chat feature coming soon! Please use our contact form or call us directly.', 'info');
        });
    }
});

// Get directions function
function getDirections() {
    const address = "123 Garden Lane, Green Valley, CA 90210";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

    */
  }, []);

  return (
    <>
      <SplitHero
    title="Let's Talk Plants"
    description="Have a question about a recent order, need specific care advice, or want to inquire about bulk gifting? We're here to help."
    ctaLabel="Email Support"
    ctaHref="#contactForm"
    imageSrc="/images/DemoPotPlant.jpg"
    imageAlt="A welcoming nursery expert holding a healthy potted plant"
/>

<section className="contact-main">
    <div className="container">
        <div className="contact-grid">
            {/*  Contact Form  */}
            <div className="contact-form-section glass-morphism animate fade-up delay-1">
                <h2 className="gradient-text">Send Us a Message</h2>
                <p>Have a question about plant care, need help choosing the right plants, or want to schedule a service? We'd love to hear from you!</p>
                
                <form id="contactForm" className="contact-form">
                    <div className="form-row">
                        <div className="form-group animate slide-in delay-2">
                            <label htmlFor="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required="" />
                        </div>
                        <div className="form-group animate slide-in delay-3">
                            <label htmlFor="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required="" />
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group animate slide-in delay-4">
                            <label htmlFor="contactEmail">Email Address *</label>
                            <input type="email" id="contactEmail" name="email" required="" />
                        </div>
                        <div className="form-group animate slide-in delay-5">
                            <label htmlFor="contactPhone">Phone Number</label>
                            <input type="tel" id="contactPhone" name="phone" />
                        </div>
                    </div>
                    
                    <div className="form-group animate slide-in delay-6">
                        <label htmlFor="contactSubject">Subject *</label>
                        <select id="contactSubject" name="subject" required="">
                            <option value="">Select a topic</option>
                            <option value="plant-care">Plant Care Advice</option>
                            <option value="product-inquiry">Product Inquiry</option>
                            <option value="service-booking">Service Booking</option>
                            <option value="shipping">Shipping &amp; Delivery</option>
                            <option value="return-exchange">Returns &amp; Exchanges</option>
                            <option value="wholesale">Wholesale Inquiry</option>
                            <option value="partnership">Partnership Opportunity</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className="form-group animate slide-in delay-7">
                        <label htmlFor="contactMessage">Message *</label>
                        <textarea id="contactMessage" name="message" rows="6" placeholder="Please describe your question or how we can help you..." required=""></textarea>
                    </div>
                    
                    <div className="form-group animate slide-in delay-8">
                        <label className="checkbox-label">
                            <input type="checkbox" id="newsletter" name="newsletter" />
                            <span className="checkmark"></span>
                            Subscribe to our newsletter for plant care tips and special offers
                        </label>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-large glow-button animate pulse-glow delay-9">Send Message</button>
                </form>
            </div>
            
            {/*  Contact Information  */}
            <div className="contact-info-section animate fade-up delay-2">
                <h2 className="gradient-text">Get in Touch</h2>
                
                <div className="contact-methods">
                    <div className="contact-method glass-morphism animate fade-up delay-3">
                        <div className="contact-icon gradient-icon">
                            <i className="fas fa-phone"></i>
                        </div>
                        <div className="contact-details">
                            <h4 className="gradient-text">Phone Support</h4>
                            <p>+1 (555) 123-4567</p>
                            <p className="contact-hours">Mon-Fri: 8AM-7PM EST<br />Sat-Sun: 9AM-5PM EST</p>
                        </div>
                    </div>
                    
                    <div className="contact-method glass-morphism animate fade-up delay-4">
                        <div className="contact-icon gradient-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-details">
                            <h4 className="gradient-text">Email Support</h4>
                            <p>info@plantnursery.com</p>
                            <p className="contact-hours">Response within 24 hours</p>
                        </div>
                    </div>
                    
                    <div className="contact-method glass-morphism animate fade-up delay-5">
                        <div className="contact-icon gradient-icon">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="contact-details">
                            <h4 className="gradient-text">Visit Our Nursery</h4>
                            <p>123 Garden Lane<br />Green Valley, CA 90210</p>
                            <p className="contact-hours">Open 7 days a week<br />8AM-6PM</p>
                        </div>
                    </div>
                    
                    <div className="contact-method glass-morphism animate fade-up delay-6">
                        <div className="contact-icon gradient-icon">
                            <i className="fas fa-comments"></i>
                        </div>
                        <div className="contact-details">
                            <h4 className="gradient-text">Live Chat</h4>
                            <p>Chat with our plant experts</p>
                            <button className="btn btn-secondary btn-small glow-button" id="startChat">Start Chat</button>
                        </div>
                    </div>
                </div>
                
                {/*  Emergency Contact  */}
                <div className="emergency-contact glass-morphism animate fade-up delay-7">
                    <h3 className="gradient-text">Emergency Plant Care</h3>
                    <p>For urgent plant care questions outside business hours:</p>
                    <p className="emergency-number glowing-text">📞 +1 (555) 911-PLANT</p>
                </div>
            </div>
        </div>
    </div>
</section>

{/*  FAQ Section  */}
<section className="contact-faq">
    <div className="container">
        <h2 className="gradient-text animate fade-up">Frequently Asked Questions</h2>
        <div className="faq-grid">
            <div className="faq-item glass-morphism animate fade-up delay-1">
                <button className="faq-question" type="button">
                    <span>How do I care for my new plants?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>Each plant comes with detailed care instructions. Generally, check soil moisture regularly, provide appropriate light, and avoid overwatering. Our plant care guides and support team are always here to help!</p>
                </div>
            </div>
            
            <div className="faq-item glass-morphism animate fade-up delay-2">
                <button className="faq-question" type="button">
                    <span>What's your return policy?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>We offer a 30-day health guarantee on all plants. If your plant isn't thriving despite proper care, we'll replace it or provide a full refund. Contact us with photos and we'll help diagnose any issues.</p>
                </div>
            </div>
            
            <div className="faq-item glass-morphism animate fade-up delay-3">
                <button className="faq-question" type="button">
                    <span>Do you offer delivery services?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>Yes! We offer local delivery within 50 miles of our nursery, as well as nationwide shipping. Local delivery includes professional setup, while shipped plants come with detailed unpacking and care instructions.</p>
                </div>
            </div>
            
            <div className="faq-item glass-morphism animate fade-up delay-4">
                <button className="faq-question" type="button">
                    <span>Can you help me choose the right plants?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>Absolutely! Our plant consultation service helps you choose perfect plants for your space, lighting conditions, and experience level. Book a consultation or contact us with details about your space.</p>
                </div>
            </div>
            
            <div className="faq-item glass-morphism animate fade-up delay-5">
                <button className="faq-question" type="button">
                    <span>Do you offer wholesale pricing?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>Yes, we offer wholesale pricing for qualifying businesses, landscapers, and large orders. Contact us with details about your business and quantity requirements for a custom quote.</p>
                </div>
            </div>
            
            <div className="faq-item glass-morphism animate fade-up delay-6">
                <button className="faq-question" type="button">
                    <span>What payment methods do you accept?</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                    <p>We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and cash for in-person purchases at our nursery.</p>
                </div>
            </div>
        </div>
    </div>
</section>

{/*  Map Section  */}
<section className="contact-map">
    <div className="container">
        <h2 className="gradient-text animate fade-up">Visit Our Nursery</h2>
        <div className="map-container animate fade-up delay-1">
            <div className="map-placeholder glass-morphism">
                <i className="fas fa-map-marker-alt"></i>
                <h3 className="gradient-text">PlantNursery Location</h3>
                <p>123 Garden Lane<br />Green Valley, CA 90210</p>
                <button className="btn btn-primary glow-button" onclick="getDirections()">Get Directions</button>
            </div>
        </div>
        
        <div className="location-details">
            <div className="location-info glass-morphism animate fade-up delay-2">
                <h3 className="gradient-text">Hours of Operation</h3>
                <div className="hours-grid">
                    <div className="hours-day animate slide-in delay-3">
                        <span>Monday - Friday</span>
                        <span>8:00 AM - 7:00 PM</span>
                    </div>
                    <div className="hours-day animate slide-in delay-4">
                        <span>Saturday</span>
                        <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="hours-day animate slide-in delay-5">
                        <span>Sunday</span>
                        <span>9:00 AM - 5:00 PM</span>
                    </div>
                </div>
            </div>
            
            <div className="location-info glass-morphism animate fade-up delay-3">
                <h3 className="gradient-text">What to Expect</h3>
                <ul className="location-features">
                    <li className="animate slide-in delay-4"><i className="fas fa-check"></i> Over 500 plant varieties</li>
                    <li className="animate slide-in delay-5"><i className="fas fa-check"></i> Expert staff on-site</li>
                    <li className="animate slide-in delay-6"><i className="fas fa-check"></i> Free plant health checkups</li>
                    <li className="animate slide-in delay-7"><i className="fas fa-check"></i> Ample parking available</li>
                    <li className="animate slide-in delay-8"><i className="fas fa-check"></i> Pet-friendly environment</li>
                </ul>
            </div>
        </div>
    </div>
</section>




    </>
  );
};

export default Contact;

