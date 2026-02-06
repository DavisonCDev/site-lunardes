function AboutSection() {
  return (
    <section id="sobre" className="about-section">
      <div className="about-text">
        <h2>Quem somos</h2>
        <p>Formada no caos urbano de <span className="highlight">Osasco</span>, a <span className="highlight">Lunardes</span> é uma banda de rock alternativo que está na estrada desde 2015.</p>
        <p>Nosso som é para quem sente tudo, o tempo todo.</p>
      </div>
      <div className="about-image-container">
        <div className="tape"></div>
        <img src="/imagens/fotobanda.jpeg" alt="Integrantes da Lunardes" className="about-photo" />
      </div>
    </section>
  );
}
export default AboutSection;