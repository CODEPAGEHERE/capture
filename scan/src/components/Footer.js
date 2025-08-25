import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p> Copyright &copy; {new Date().getFullYear()} Capture. All Rights Reserved | Happycode Technologies.</p>
        </div>
        <div className="footer-right">
          <p>
            A Part of <a href="https://myschoolproject-swart.vercel.app/" target="_blank" rel="noopener noreferrer">MySchoolProject</a> suite.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
