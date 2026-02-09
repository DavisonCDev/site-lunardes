import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isBackstage = location.pathname === '/backstage';

  // Se estiver no Backstage, renderiza o rodapé minimalista
  if (isBackstage) {
    return (
      <footer className="backstage-footer">
        <p>LUNARDES // FEITO EM OZ (OSASCO)</p>
        <p>© 2026 ADMIN CONSOLE</p>
      </footer>
    );
  }

  // Se não, renderiza o rodapé normal da banda
  return (
    <section id="contato" className="footer-section">
      <div className="social-big">
        <a href="https://www.instagram.com/lunardes/" target="_blank" rel="noreferrer">INSTAGRAM</a>
        <a href="https://www.facebook.com/bandalunardes/" target="_blank" rel="noreferrer">FACEBOOK</a>
        <a href="https://www.youtube.com/@lunardesOficial" target="_blank" rel="noreferrer">YOUTUBE</a>
      </div>
      <footer>
        <div className="footer-links" style={{ marginBottom: '20px' }}>
          <a href="#" className="press-link">PRESS KIT / EPK</a>
        </div>
        <p>© 2026 LUNARDES. FEITO EM OZ (OSASCO).</p>
      </footer>
    </section>
  );
}

export default Footer;