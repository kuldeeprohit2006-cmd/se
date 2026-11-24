const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo-text">🛡️ Medi<span className="accent">Guard</span></div>
          <p>Student Health & Emergency Assistance Network powered by MERN Stack & JWT Auth.</p>
        </div>
        <div className="footer-links-group">
          <h4>Emergency Hotlines</h4>
          <ul>
            <li><a href="tel:108">Medical Ambulance: 108</a></li>
            <li><a href="tel:112">National Helpline: 112</a></li>
            <li><a href="tel:18001801104">Poison Control: 1800-180-1104</a></li>
          </ul>
        </div>
        <div className="footer-disclaimer">
          <h4>Medical Disclaimer</h4>
          <p>MediGuard provides emergency guidance and reference contacts. In life-threatening emergencies, always dial 108/112 or visit the nearest emergency trauma room immediately.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MediGuard. Designed for Student Campus Health & Safety.</p>
      </div>
    </footer>
  );
};

export default Footer;
