

import { Link } from 'react-router-dom';
// import { Container } from 'reactstrap';


const Footer = () => {
  const infoLinks = [
    { id: 0, name: 'Contact Us', to: '/contact' },
    { id: 1, name: 'Terms & Condition', to: '/terms&contidions' }
    
  ];

  const footerBusinessLinks = (
    <ul className='support-links'>
      <li className='footer-link'>
        <Link to='/profile'>Account Details</Link>
      </li>
      
    </ul>
  );

  const footerLinks = infoLinks.map(item => (
    <li key={item.id} className='footer-link'>
      <Link key={item.id} to={item.to}>
        {item.name}
      </Link>
    </li>
  ));

  return (
    <footer className='footer'>
      
        <div className='footer-content'>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>Customer Service</h3>
            </div>
            <div className='block-content'>
              <ul>{footerLinks}</ul>
            </div>
          </div>
          <div className='footer-block'>
            <div className='block-title'>
              <h3 className='text-uppercase'>Links</h3>
            </div>
            <div className='block-content'>
              <ul>{footerLinks}</ul>
            </div>
          </div>

        </div>
        <div className='footer-copyright'>
          <span>© {new Date().getFullYear()} bastard_wears</span>
        </div>
        <ul className='footer-social-item'>
          <li>

          </li>
          <li>
            <a
              href="https://www.instagram.com/bastard_wears/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="instagram-icon" />
            </a>

          </li>
          <li>
            <a href='/#pinterest' rel='noreferrer noopener' target='_blank'>
              <span className='pinterest-icon' />
            </a>
          </li>
          <li>
            <a href='/#twitter' rel='noreferrer noopener' target='_blank'>
              <span className='twitter-icon' />
            </a>
          </li>
        </ul>
      
    </footer>
  );
};

export default Footer;
