function MusicSection() {
  return (
    <section id="musica" className="section-dark">
      <h2 className="outline-title">Próximo Lançamento</h2>
      <div className="album-showcase">
        
        <div className="cover-art">
          {/* O CamelCase: autoPlay e playsInline */}
          <video id="video-lancamento" autoPlay playsInline muted loop controls>
            <source src="/videos/releasing.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
          <div className="glow"></div>
        </div>

        <div className="track-info">
          <h3>Voe</h3>
          <p>O novo álbum está a caminho. Em breve, em todas as plataformas.</p>
          <div className="buttons">
            <a href="https://spotify.com" className="btn-plataforma btn-spotify" target="_blank"><i className="fab fa-spotify"></i> Spotify</a>
            <a href="https://apple.com" className="btn-plataforma btn-apple" target="_blank"><i className="fab fa-apple"></i> Apple Music</a>
            <a href="https://deezer.com" className="btn-plataforma btn-deezer" target="_blank"><i className="fab fa-deezer"></i> Deezer</a>
            <a href="https://youtube.com" className="btn-plataforma btn-youtube" target="_blank"><i className="fab fa-youtube"></i> Ver Clipe</a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default MusicSection;