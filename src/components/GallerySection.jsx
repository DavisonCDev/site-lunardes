const photos = [
  { id: 1, src: '/imagens/lunardes-show.jpeg', caption: 'SÃO PAULO, 2025', span: '' },
  { id: 2, src: '/imagens/lunardesbastidores.jpeg', caption: 'BACKSTAGE', span: 'wide' }, // wide = ocupa 2 colunas
  { id: 3, src: '/imagens/davisonwesley.jpeg', caption: 'ENSAIO', span: 'tall' }, // tall = ocupa 2 linhas
  { id: 4, src: '/imagens/davisonbruna.jpeg', caption: 'ENSAIO', span: '' },
  { id: 5, src: '/imagens/karina.jpeg', caption: 'ENSAIO', span: '' },
  { id: 6, src: '/imagens/thaisbruna.jpeg', caption: 'ENSAIO', span: '' },
];

function GallerySection() {
  return (
    <section id="galeria" className="gallery-section">
      <h2 className="outline-title">Galeria</h2>
      
      <div className="gallery-grid">
        {photos.map((photo) => (
          <div key={photo.id} className={`gallery-item ${photo.span}`}>
            <img src={photo.src} alt={photo.caption} />
            <div className="gallery-overlay">
              <p>{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GallerySection;