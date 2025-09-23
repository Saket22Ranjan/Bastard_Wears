/*
 *
 * Sell
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import actions from '../../actions';

import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Sell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'about'
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    const { isLoading } = this.props;
    const { activeTab } = this.state;

    return (
      <div className='sell'>
        {isLoading && <LoadingIndicator />}
        
        {/* Navigation Tabs */}
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'about' })}
              onClick={() => { this.toggle('about'); }}
            >
              About Us
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'products' })}
              onClick={() => { this.toggle('products'); }}
            >
              Products/Services
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'terms' })}
              onClick={() => { this.toggle('terms'); }}
            >
              Terms & Conditions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'privacy' })}
              onClick={() => { this.toggle('privacy'); }}
            >
              Privacy Policy
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'refund' })}
              onClick={() => { this.toggle('refund'); }}
            >
              Refund Policy
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          {/* About Us Tab */}
          <TabPane tabId="about">
            <div className="policy-content">
              <h2>About bastard Store</h2>
              
              <div className="alert alert-info">
                <strong>Welcome to Bastard Store</strong> - Your trusted partner for innovative products and exceptional service.
              </div>
              
              <h3>Our Story</h3>
              <p>Established in 2020, Bastard Store has been at the forefront of delivering high-quality products to our valued customers. We are committed to excellence, innovation, and customer satisfaction in everything we do.</p>
              
              <h3>Our Mission</h3>

              <p>To provide exceptional products that exceed customer expectations while maintaining the highest standards of quality, integrity, and professionalism. We strive to build lasting relationships with our customers through trust, reliability, and continuous innovation.</p>
              
              <h3>Our Vision</h3>
              <p>To be the leading e-commerce platform in India, recognized for our commitment to quality, customer service, and innovative solutions. We aim to create value for our customers, sellers, and stakeholders while contributing positively to society.</p>
              
              <h3>Why Choose Bastard Store?</h3>
              <ul>
                <li><strong>Quality Assurance:</strong> We maintain strict quality control measures for all products.</li>
                <li><strong>Customer-Centric Approach:</strong> Our customers are at the heart of everything we do.</li>
                <li><strong>Secure Payments:</strong> Powered by Cashfree payment gateway for secure transactions.</li>
                <li><strong>Fast Delivery:</strong> Quick and reliable delivery across India.</li>
                <li><strong>24/7 Support:</strong> Round-the-clock customer support for all your queries.</li>
              </ul>
              
              <div className="contact-info bg-light p-3 rounded">
                <h4>Contact Information</h4>
                <p><strong>Name:</strong> Saket Ranjan</p>
                <p><strong>Address:</strong> [Your Complete Address], India</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p><strong>Email:</strong> support@mernstore.com</p>
                <p><strong>Business Hours:</strong> Monday to Sunday, 10:00 AM to 8:00 PM</p>
              </div>
            </div>
          </TabPane>

          {/* Products/Services Tab */}
          <TabPane tabId="products">
            <div className="policy-content">
              <h2>Products & Services</h2>
              
              <div className="alert alert-success">
                Discover our comprehensive range of high-quality products available on Bastard Store.
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-4">
                  
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Fashion & Clothing</h5>
                      <p className="card-text">Trendy clothing, footwear, and accessories for men, women, and kids.</p>
                      <div className="price-tag">Starting from ₹ 599 INR</div>
                      <ul className="list-unstyled">
                        <li>✓ Premium Quality</li>
                        <li>✓ Size Exchange</li>
                        <li>✓ Cash on Delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  
                </div>
              </div>
              
              <h3>Service Packages</h3>
              <p>All prices are in Indian Rupees (INR) and include applicable taxes as per Indian regulations.</p>
              
              {/* <div className="row">
                <div className="col-md-6">
                  <h4>Basic Seller Package - ₹ 2,999 INR/month</h4>
                  <ul>
                    <li>List up to 100 products</li>
                    <li>Basic analytics dashboard</li>
                    <li>Email support</li>
                    <li>5% commission on sales</li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h4>Premium Seller Package - ₹ 5,999 INR/month</h4>
                  <ul>
                    <li>Unlimited product listings</li>
                    <li>Advanced analytics</li>
                    <li>Priority support</li>
                    <li>3% commission on sales</li>
                    <li>Featured product placement</li>
                  </ul>
                </div>
              </div> */}
            </div>
          </TabPane>

          {/* Terms & Conditions Tab */}
          <TabPane tabId="terms">
            <div className="policy-content">
              <h2>Terms and Conditions</h2>
              <p><small>Last updated: {new Date().toLocaleDateString()}</small></p>
              
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing and using MERN Store website and services, you accept and agree to be bound by the terms and provisions of this agreement. These terms govern your use of our platform and services.</p>
              
              <h3>2. User Accounts</h3>
              <p>To access certain features, you must create an account. You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Updating your information when necessary</li>
              </ul>
              
              <h3>3. Payment Terms</h3>
              <p>All payments must be made in Indian Rupees (INR). We use Cashfree payment gateway for secure processing:</p>
              <ul>
                <li>All prices include applicable GST and taxes</li>
                <li>Payment confirmation is required before order processing</li>
                <li>Refunds are processed according to our refund policy</li>
                <li>We accept credit/debit cards, UPI, net banking, and wallets</li>
              </ul>
              
              <h3>4. Seller Responsibilities</h3>
              <p>If you are a seller on our platform, you agree to:</p>
              <ul>
                <li>Provide accurate product descriptions and images</li>
                <li>Maintain adequate inventory levels</li>
                <li>Process orders within specified timeframes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Handle customer queries professionally</li>
              </ul>
              
              <h3>5. Prohibited Activities</h3>
              <p>Users may not:</p>
              <ul>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Engage in fraudulent activities</li>
                <li>Upload malicious content or spam</li>
                <li>Manipulate reviews or ratings</li>
              </ul>
              
              <h3>6. Limitation of Liability</h3>
              <p>MERN Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, except as required by Indian law.</p>
              
              <h3>7. Governing Law</h3>
              <p>These terms are governed by the laws of India. Any disputes will be resolved in the courts of [Your City], India.</p>
              
              <h3>8. Contact Information</h3>
              <p>For questions about these terms, contact us at legal@mernstore.com or +91-XXXXXXXXXX.</p>
            </div>
          </TabPane>

          {/* Privacy Policy Tab */}
          <TabPane tabId="privacy">
            <div className="policy-content">
              <h2>Privacy Policy</h2>
              <p><small>Last updated: {new Date().toLocaleDateString()}</small></p>
              
              <h3>1. Information We Collect</h3>
              <p>We collect information when you:</p>
              <ul>
                <li>Create an account or make a purchase</li>
                <li>Contact customer support</li>
                <li>Subscribe to newsletters</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <p>This may include:</p>
              <ul>
                <li>Personal details (name, email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely via Cashfree)</li>
                <li>Device and usage information</li>
                <li>Location data (with your consent)</li>
              </ul>
              
              <h3>2. How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul>
                <li>Process orders and provide customer service</li>
                <li>Improve our products and services</li>
                <li>Send important updates and notifications</li>
                <li>Personalize your shopping experience</li>
                <li>Comply with legal requirements</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
              
              <h3>3. Information Sharing</h3>
              <p>We may share your information with:</p>
              <ul>
                <li>Service providers (payment processors, shipping companies)</li>
                <li>Business partners (with your consent)</li>
                <li>Legal authorities (when required by law)</li>
                <li>Potential buyers (in case of business sale)</li>
              </ul>
              
              <h3>4. Data Security</h3>
              <p>We implement robust security measures:</p>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing via Cashfree</li>
                <li>Regular security audits and updates</li>
                <li>Access controls for employee data access</li>
                <li>Secure data storage and backup systems</li>
              </ul>
              
              <h3>5. Your Rights</h3>
              <p>Under Indian data protection laws, you have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Port your data to another service</li>
              </ul>
              
              <h3>6. Cookies and Tracking</h3>
              <p>We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.</p>
              
              <h3>7. Data Retention</h3>
              <p>We retain your data for as long as necessary to provide services, comply with legal obligations, and resolve disputes.</p>
              
              <h3>8. Contact Us</h3>
              <p>For privacy-related queries, contact our Data Protection Officer at privacy@mernstore.com.</p>
            </div>
          </TabPane>

          {/* Refund Policy Tab */}
          <TabPane tabId="refund">
            <div className="policy-content">
              <h2>Refund and Cancellation Policy</h2>
              <p><small>Last updated: {new Date().toLocaleDateString()}</small></p>
              
              <div className="alert alert-warning">
                <strong>Important:</strong> We want you to be completely satisfied with your purchase. Please read our refund policy carefully.
              </div>
              
              <h3>1. Refund Eligibility</h3>
              <p>You may request a refund if:</p>
              <ul>
                <li>Item is damaged or defective upon delivery</li>
                <li>Wrong item was shipped</li>
                <li>Item doesn't match the description</li>
                <li>Request is made within 7 days of delivery</li>
                <li>Item is in original condition with tags intact</li>
              </ul>
              
              <h3>2. Non-Refundable Items</h3>
              <ul>
                <li>Perishable goods (food, flowers, etc.)</li>
                <li>Personal care items</li>
                <li>Customized or personalized products</li>
                <li>Digital products after download</li>
                <li>Items marked as "Final Sale"</li>
              </ul>
              
              <h3>3. Refund Process</h3>
              <ol>
                <li>Contact customer service within 7 days of delivery</li>
                <li>Provide order number and reason for return</li>
                <li>Receive return authorization and shipping label</li>
                <li>Pack item securely and ship using provided label</li>
                <li>Refund processed within 5-7 business days after inspection</li>
              </ol>
              
              <h3>4. Cancellation Policy</h3>
              
              <h4>Order Cancellation</h4>
              <p>You can cancel your order:</p>
              <ul>
                <li>Within 1 hour of placing the order</li>
                <li>Before the item has been shipped</li>
                <li>Free cancellation with full refund</li>
                <li>Contact us immediately at orders@mernstore.com</li>
              </ul>
              
              <h4>Partial Cancellation</h4>
              <p>For multi-item orders, you can cancel individual items before shipment.</p>
              
              <h3>5. Shipping and Return Costs</h3>
              <ul>
                <li><strong>Our Error:</strong> We cover return shipping costs</li>
                <li><strong>Customer Request:</strong> Customer pays return shipping</li>
                <li><strong>Free Returns:</strong> Available on orders above ₹1,999</li>
                <li><strong>Exchange:</strong> Free size/color exchange within 7 days</li>
              </ul>
              
              <h3>6. Refund Timeline</h3>
              <ul>
                <li><strong>UPI/Wallet:</strong> 1-2 business days</li>
                <li><strong>Credit Card:</strong> 3-5 business days</li>
                <li><strong>Debit Card:</strong> 5-7 business days</li>
                <li><strong>Net Banking:</strong> 3-5 business days</li>
              </ul>
              
              <h3>7. Exchange Policy</h3>
              <p>We offer exchanges for:</p>
              <ul>
                <li>Size or color variations</li>
                <li>Defective products</li>
                <li>Subject to availability</li>
                <li>Same or higher value items only</li>
              </ul>
              
              <h3>8. Special Categories</h3>
              
              <h4>Electronics</h4>
              <ul>
                <li>7-day replacement warranty</li>
                <li>Manufacturer warranty applies</li>
                <li>DOA (Dead on Arrival) replacement within 24 hours</li>
              </ul>
              
              <h4>Fashion Items</h4>
              <ul>
                <li>7-day return/exchange policy</li>
                <li>Must be unworn with original tags</li>
                <li>Hygienic items are non-returnable</li>
              </ul>
              
              <h3>9. Customer Support</h3>
              <div className="contact-info bg-light p-3 rounded">
                <p><strong>Email:</strong> bastardwears@gmail.com</p>
                <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                <p><strong>WhatsApp:</strong> +91-XXXXXXXXXX</p>
                <p><strong>Hours:</strong> Monday to Sunday, 9:00 AM to 9:00 PM</p>
              </div>
              
              <h3>10. Dispute Resolution</h3>
              <p>All disputes are subject to the jurisdiction of courts in [Your City], India. We strive to resolve all issues amicably and quickly.</p>
            </div>
          </TabPane>
        </TabContent>
        
        <style jsx>{`
          .policy-content {
            max-height: 600px;
            overflow-y: auto;
            padding-right: 15px;
          }
          
          .price-tag {
            font-size: 1.2rem;
            font-weight: bold;
            color: #e74c3c;
            margin: 10px 0;
          }
          
          .contact-info {
            margin: 20px 0;
          }
          
          .alert {
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
          }
          
          .alert-info {
            color: #31708f;
            background-color: #d9edf7;
            border-color: #bce8f1;
          }
          
          .alert-success {
            color: #3c763d;
            background-color: #dff0d8;
            border-color: #d6e9c6;
          }
          
          .alert-warning {
            color: #8a6d3b;
            background-color: #fcf8e3;
            border-color: #faebcc;
          }
          
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            transition: transform 0.2s;
          }
          
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .bg-light {
            background-color: #f8f9fa !important;
          }
          
          .p-3 {
            padding: 1rem !important;
          }
          
          .rounded {
            border-radius: 0.25rem !important;
          }
          
          .mb-4 {
            margin-bottom: 1.5rem !important;
          }
          
          .h-100 {
            height: 100% !important;
          }
          
          .list-unstyled {
            padding-left: 0;
            list-style: none;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.merchant.isLoading
  };
};

export default connect(mapStateToProps, actions)(Sell);