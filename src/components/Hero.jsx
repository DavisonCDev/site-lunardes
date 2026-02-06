function Hero() {
  return (
    <>
      <header id="home" className="hero">
        <div className="hero-content">
          <p>INDIE | ALTERNATIVE</p>
          <div className="scroll-indicator">
            <div className="line"></div>
          </div>
        </div>
        
        <div className="hero-img-container">
          <picture>
            {/* React usa srcSet com 'S' maiúsculo */}
            <source media="(max-width: 768px)" srcSet="/imagens/lunardes-hero-mobile.jpg" />
            <img src="/imagens/lunardes-hero2.jpg" alt="Lunardes Banda" />
          </picture>
        </div>
      </header>

      {/* Faixa de texto correndo */}
      <div className="marquee-container">
        <div className="marquee-content">
          NOVO ÁLBUM "VOE" EM BREVE — EM TODAS AS PLATAFORMAS — NOVO ÁLBUM "VOE" EM BREVE — EM TODAS AS PLATAFORMAS — NOVO ÁLBUM "VOE" EM BREVE — EM TODAS AS PLATAFORMAS
        </div>
      </div>
    </>
  );
}

export default Hero;