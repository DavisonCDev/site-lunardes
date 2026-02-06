// 1. Esses dados virão do Java/MySQL no futuro.
// Por enquanto, deixei fixo aqui (Mock).
const products = [
  {
    id: 1,
    name: 'T-Shirt "É Tudo Mentira"',
    type: 'Vestuário',
    price: 89.90,
    image: '/imagens/camiseta1.png',
    badge: 'NOVO DROP',
    available: true // Estoque > 0
  },
  {
    id: 2,
    name: 'Vinil Deluxe LP',
    type: 'Música',
    price: 150.00,
    image: '/imagens/vinil.jpg',
    badge: null,
    available: true
  },
  {
    id: 3,
    name: 'Ecobag Logo',
    type: 'Acessórios',
    price: 40.00,
    image: '/imagens/ecobag.jpg',
    badge: 'ESGOTADO',
    available: false // Estoque zerado
  },
  {
    id: 4,
    name: 'Sticker Pack',
    type: 'Diversos',
    price: 15.90,
    image: '/imagens/stickpack.jpg',
    badge: null,
    available: true
  },
  {
    id: 5,
    name: 'Caneca',
    type: 'Acessórios',
    price: 30.00,
    image: '/imagens/caneca.jpg',
    badge: null,
    available: true
  },
  {
    id: 6,
    name: 'Kit Completo',
    type: 'Diversos',
    price: 299.00,
    image: '/imagens/kitlunardes.jpg',
    badge: null,
    available: true
  }
];

function StoreSection() {
  return (
    <section id="loja" className="store-section">
      <h2 className="outline-title">Loja Oficial</h2>
      
      <div className="store-grid">
        {/* Mapa de cada produto para um Card */}
        {products.map((product) => (
          <div key={product.id} className={`product-card ${!product.available ? 'esgotado' : ''}`}>
            
            <div className="product-image">
              {/* Só mostra a etiqueta se ela existir (badge != null) */}
              {product.badge && (
                <span className={`badge ${product.available ? 'new' : 'sold-out'}`}>
                  {product.badge}
                </span>
              )}
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
              <span className="product-type">{product.type}</span>
              <h3>{product.name}</h3>
              
              <div className="price-row">
                <span className="price">
                  {/* Formatação automática de moeda R$ */}
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                
                {product.available ? (
                  <a href="#" className="btn-buy">Comprar</a>
                ) : (
                  <span className="btn-buy">Sem Estoque</span>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default StoreSection;