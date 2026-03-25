import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SplitHero from '../components/SplitHero';

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extracted scripts
    /* 

// Service booking functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    const serviceModal = document.getElementById('serviceModal');
    const closeModalBtn = document.getElementById('closeServiceModal');
    const cancelBtn = document.getElementById('cancelBooking');
    const serviceForm = document.getElementById('serviceBookingForm');
    const modalTitle = document.getElementById('modalServiceTitle');
    const serviceTypeInput = document.getElementById('serviceType');
    
    // Service data mapping
    const serviceData = {
        consultation: 'Plant Consultation',
        delivery: 'Delivery & Setup',
        maintenance: 'Plant Care & Maintenance',
        diagnosis: 'Plant Health Diagnosis',
        design: 'Garden Design',
        workshop: 'Plant Care Workshop',
        sitting: 'Plant Sitting',
        repotting: 'Repotting Service'
    };
    
    // Open service booking modal
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceName = serviceData[serviceType];
            
            modalTitle.textContent = `Book ${serviceName}`;
            serviceTypeInput.value = serviceName;
            serviceModal.classList.add('active');
            
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('preferredDate').min = today;
        });
    });
    
    // Close modal functions
    function closeModal() {
        serviceModal.classList.remove('active');
        serviceForm.reset();
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    serviceModal.addEventListener('click', function(e) {
        if (e.target === serviceModal) {
            closeModal();
        }
    });
    
    // Handle form submission
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(serviceForm);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = document.getElementById('confirmBooking');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;
        
        // Simulate API call
        fetch('/api/services/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success notification
                showNotification('Service booked successfully! We will contact you soon to confirm the details.', 'success');
                closeModal();
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        })
        .catch(error => {
            console.error('Booking error:', error);
            showNotification('Failed to book service. Please try again or contact us directly.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
});

    */
  }, []);

  return (
    <>
      <SplitHero
    title="Expert Nursery Services"
    description="From in-home repotting to complete indoor landscaping and commercial plant installations, our experts are here to help."
    ctaLabel="Book a Consultation"
    ctaHref="#services-grid-section"
    imageSrc="/images/hero-bg.jpg"
    imageAlt="A bright nursery-inspired interior filled with healthy plants"
/>

<section className="services-overview">
    <div className="container">
        <div className="services-intro glass-morphism animate fade-up delay-3">
            <h2 className="gradient-text">Professional Plant Services</h2>
            <p>At PlantNursery, we offer comprehensive services to ensure your plants thrive at every stage of their journey. From consultation to ongoing care, our expert team is here to support your gardening success.</p>
        </div>
    </div>
</section>

<section className="services-grid-section" id="services-grid-section">
    <div className="container">
        <div className="services-grid">
            {/*  Plant Consultation  */}
            <div className="service-card glass-morphism animate fade-up delay-1">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-user-tie"></i>
                </div>
                <h3 className="gradient-text">Plant Consultation</h3>
                <p className="service-price glowing-text">Starting at ₹499</p>
                <p>Get personalized advice from our plant experts. We'll help you choose the perfect plants for your space, lighting conditions, and lifestyle.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-2"><i className="fas fa-check"></i> One-on-one consultation</li>
                    <li className="animate slide-in delay-3"><i className="fas fa-check"></i> Personalized plant recommendations</li>
                    <li className="animate slide-in delay-4"><i className="fas fa-check"></i> Care instructions and tips</li>
                    <li className="animate slide-in delay-5"><i className="fas fa-check"></i> Space planning advice</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="consultation">Book Consultation</button>
            </div>

            {/*  Plant Delivery & Setup  */}
            <div className="service-card featured glass-morphism animate fade-up delay-2">
                <div className="service-badge gradient-badge">Most Popular</div>
                <div className="service-icon gradient-icon">
                    <i className="fas fa-truck"></i>
                </div>
                <h3 className="gradient-text">Delivery &amp; Setup</h3>
                <p className="service-price glowing-text">Starting at ₹299</p>
                <p>Professional delivery and setup service. We'll bring your plants directly to your door and help set them up in their perfect spots.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-3"><i className="fas fa-check"></i> Same-day delivery available</li>
                    <li className="animate slide-in delay-4"><i className="fas fa-check"></i> Professional plant placement</li>
                    <li className="animate slide-in delay-5"><i className="fas fa-check"></i> Initial care instructions</li>
                    <li className="animate slide-in delay-6"><i className="fas fa-check"></i> Pot and soil setup included</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="delivery">Schedule Delivery</button>
            </div>

            {/*  Plant Care & Maintenance  */}
            <div className="service-card glass-morphism animate fade-up delay-3">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-leaf"></i>
                </div>
                <h3 className="gradient-text">Plant Care &amp; Maintenance</h3>
                <p className="service-price glowing-text">Starting at ₹399/visit</p>
                <p>Regular maintenance visits to keep your plants healthy and thriving. Perfect for busy professionals or plant enthusiasts who want expert care.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-4"><i className="fas fa-check"></i> Regular watering and feeding</li>
                    <li className="animate slide-in delay-5"><i className="fas fa-check"></i> Pruning and trimming</li>
                    <li className="animate slide-in delay-6"><i className="fas fa-check"></i> Pest and disease monitoring</li>
                    <li className="animate slide-in delay-7"><i className="fas fa-check"></i> Flexible scheduling</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="maintenance">Book Maintenance</button>
            </div>

            {/*  Plant Health Diagnosis  */}
            <div className="service-card glass-morphism animate fade-up delay-4">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-stethoscope"></i>
                </div>
                <h3 className="gradient-text">Plant Health Diagnosis</h3>
                <p className="service-price glowing-text">Starting at ₹249</p>
                <p>Having trouble with a sick plant? Our experts will diagnose the problem and provide treatment recommendations to get your plant back to health.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-5"><i className="fas fa-check"></i> Professional plant diagnosis</li>
                    <li className="animate slide-in delay-6"><i className="fas fa-check"></i> Treatment recommendations</li>
                    <li className="animate slide-in delay-7"><i className="fas fa-check"></i> Follow-up support</li>
                    <li className="animate slide-in delay-8"><i className="fas fa-check"></i> Emergency consultations available</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="diagnosis">Get Diagnosis</button>
            </div>

            {/*  Garden Design  */}
            <div className="service-card glass-morphism animate fade-up delay-5">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-pencil-ruler"></i>
                </div>
                <h3 className="gradient-text">Garden Design</h3>
                <p className="service-price glowing-text">Starting at ₹1999</p>
                <p>Transform your space with professional garden design. We'll create a custom plan that suits your style, budget, and maintenance preferences.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-6"><i className="fas fa-check"></i> Custom design consultation</li>
                    <li className="animate slide-in delay-7"><i className="fas fa-check"></i> 3D visualization</li>
                    <li className="animate slide-in delay-8"><i className="fas fa-check"></i> Plant selection and layout</li>
                    <li className="animate slide-in delay-9"><i className="fas fa-check"></i> Implementation support</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="design">Start Design</button>
            </div>

            {/*  Plant Workshops  */}
            <div className="service-card glass-morphism animate fade-up delay-6">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h3 className="gradient-text">Plant Care Workshops</h3>
                <p className="service-price glowing-text">₹349/person</p>
                <p>Join our hands-on workshops to learn essential plant care skills. Perfect for beginners and anyone looking to expand their plant knowledge.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-7"><i className="fas fa-check"></i> Interactive learning sessions</li>
                    <li className="animate slide-in delay-8"><i className="fas fa-check"></i> Take-home plant included</li>
                    <li className="animate slide-in delay-9"><i className="fas fa-check"></i> Expert-led instruction</li>
                    <li className="animate slide-in delay-10"><i className="fas fa-check"></i> Small group settings</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="workshop">Join Workshop</button>
            </div>

            {/*  Plant Sitting  */}
            <div className="service-card glass-morphism animate fade-up delay-7">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-home"></i>
                </div>
                <h3 className="gradient-text">Plant Sitting</h3>
                <p className="service-price glowing-text">Starting at ₹149/day</p>
                <p>Going on vacation? We'll take care of your plants while you're away. Our plant sitting service ensures your green friends stay healthy in your absence.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-8"><i className="fas fa-check"></i> Daily plant care</li>
                    <li className="animate slide-in delay-9"><i className="fas fa-check"></i> Progress photos and updates</li>
                    <li className="animate slide-in delay-10"><i className="fas fa-check"></i> Emergency care available</li>
                    <li className="animate slide-in delay-11"><i className="fas fa-check"></i> Flexible duration</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="sitting">Book Plant Sitting</button>
            </div>

            {/*  Repotting Service  */}
            <div className="service-card glass-morphism animate fade-up delay-8">
                <div className="service-icon gradient-icon">
                    <i className="fas fa-seedling"></i>
                </div>
                <h3 className="gradient-text">Repotting Service</h3>
                <p className="service-price glowing-text">Starting at ₹199</p>
                <p>Professional repotting service for plants that have outgrown their containers. We'll handle everything from pot selection to soil preparation.</p>
                <ul className="service-features">
                    <li className="animate slide-in delay-9"><i className="fas fa-check"></i> Professional repotting</li>
                    <li className="animate slide-in delay-10"><i className="fas fa-check"></i> Quality soil and pots</li>
                    <li className="animate slide-in delay-11"><i className="fas fa-check"></i> Root health assessment</li>
                    <li className="animate slide-in delay-12"><i className="fas fa-check"></i> Post-repotting care guide</li>
                </ul>
                <button className="btn btn-primary service-btn glow-button animate pulse-glow" data-service="repotting">Schedule Repotting</button>
            </div>
        </div>
    </div>
</section>

{/*  Service Booking Modal  */}
<div className="service-modal" id="serviceModal">
    <div className="service-modal-content">
        <div className="service-modal-header">
            <h2 id="modalServiceTitle">Book Service</h2>
            <button className="close-modal" id="closeServiceModal" aria-label="Close modal">
                <i className="fas fa-times"></i>
            </button>
        </div>
        
        <div className="service-modal-body">
            <form id="serviceBookingForm">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="customerName">Full Name *</label>
                        <input type="text" id="customerName" name="customerName" required="" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="customerEmail">Email Address *</label>
                        <input type="email" id="customerEmail" name="customerEmail" required="" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="customerPhone">Phone Number *</label>
                        <input type="tel" id="customerPhone" name="customerPhone" required="" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="preferredDate">Preferred Date *</label>
                        <input type="date" id="preferredDate" name="preferredDate" required="" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="preferredTime">Preferred Time *</label>
                        <select id="preferredTime" name="preferredTime" required="">
                            <option value="">Select a time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="serviceType">Service Type</label>
                        <input type="text" id="serviceType" name="serviceType" readOnly="" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="serviceAddress">Service Address *</label>
                    <textarea id="serviceAddress" name="serviceAddress" rows="3" placeholder="Please provide your full address where the service will be performed" required=""></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor="serviceNotes">Additional Notes</label>
                    <textarea id="serviceNotes" name="serviceNotes" rows="4" placeholder="Any specific requirements or details about your plants/space..."></textarea>
                </div>
                
                <div className="service-modal-actions">
                    <button type="button" className="btn btn-secondary" id="cancelBooking">Cancel</button>
                    <button type="submit" className="btn btn-primary" id="confirmBooking">Book Service</button>
                </div>
            </form>
        </div>
    </div>
</div>

<section className="service-guarantee">
    <div className="container">
        <h2 className="gradient-text animate fade-up">Our Service Guarantee</h2>
        <div className="guarantee-grid">
            <div className="guarantee-item glass-morphism animate fade-up delay-1">
                <div className="guarantee-icon gradient-icon">
                    <i className="fas fa-certificate"></i>
                </div>
                <h4 className="gradient-text">100% Satisfaction</h4>
                <p>We guarantee your satisfaction with all our services. If you're not happy, we'll make it right.</p>
            </div>
            
            <div className="guarantee-item glass-morphism animate fade-up delay-2">
                <div className="guarantee-icon gradient-icon">
                    <i className="fas fa-clock"></i>
                </div>
                <h4 className="gradient-text">Punctual Service</h4>
                <p>We respect your time. Our team arrives on schedule and completes services efficiently.</p>
            </div>
            
            <div className="guarantee-item glass-morphism animate fade-up delay-3">
                <div className="guarantee-icon gradient-icon">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <h4 className="gradient-text">Insured &amp; Licensed</h4>
                <p>All our services are fully insured and our team members are certified plant care professionals.</p>
            </div>
        </div>
    </div>
</section>




    </>
  );
};

export default Services;

