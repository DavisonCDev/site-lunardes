import React, { useState, useEffect } from 'react';

function StoreSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => response.json())
      .then(data => {
        // Agora pegamos o badge e o available DIRETO do Java
        const produtosFormatados = data.map(item => ({
          ...item,
          image: item.imageUrl, 
          type: item.category,
          // Removemos as linhas que forçavam badge: null e available: true
        }));
        
        setProducts(produtosFormatados);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
      });
  }, []);

  const handleBuy = async (product) => {
    try {
      const orderData = [{
        title: product.name,
        price: product.price,
        quantity: 1
      }];

      const response = await fetch('http://localhost:8080/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const linkPagamento = await response.text();
        window.open(linkPagamento, '_blank');
      } else {
        alert("Erro ao criar pagamento!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (loading) return <div className="loading">Carregando loja...</div>;

  return (
    <section id="loja" className="store-section">
      <h2 className="outline-title">Loja Oficial</h2>
      
      <div className="store-grid">
        {products.map((product) => (
          /* A classe 'esgotado' agora será aplicada baseada no banco de dados */
          <div key={product.id} className={`product-card ${!product.available ? 'esgotado' : ''}`}>
            
            <div className="product-image">
              {/* O badge agora mostra o texto real vindo do Java (ex: "NOVO DROP") */}
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
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                
                {product.available ? (
                  <button onClick={() => handleBuy(product)} className="btn-buy" style={{cursor: 'pointer'}}>
                    Comprar
                  </button>
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