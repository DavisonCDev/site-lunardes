import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago } from '@mercadopago/sdk-react';
import CheckoutBrick from './CheckoutBrick'; 

// Inicializa com sua chave de teste
initMercadoPago('TEST-a7c6aadb-8aad-44e2-baf0-c15e7f1b6dcc');

function StoreSection() {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Busca os produtos do Backend
  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => response.json())
      .then(data => {
        const produtosFormatados = data.map(item => ({
          ...item,
          image: item.imageUrl, 
          type: item.category,
        }));
        setProducts(produtosFormatados);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
        setLoading(false);
      });
  }, []);

  // 2. NOVO: Monitora se um produto foi selecionado para rolar a tela
  useEffect(() => {
    if (selectedProduct) {
      const lojaSection = document.getElementById('loja');
      if (lojaSection) {
        // Rola suavemente até o início da seção da loja
        lojaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedProduct]); // Executa sempre que selectedProduct mudar

  const handleSuccess = () => {
    // Redireciona para a página de sucesso
    navigate('/success');
    setSelectedProduct(null);
  };

  if (loading) return <div className="loading">Carregando loja...</div>;

  return (
    <section id="loja" className="store-section">
      <h2 className="outline-title">Loja Oficial</h2>
      
      {selectedProduct ? (
        /* Se tem produto selecionado, mostra o Checkout */
        <CheckoutBrick 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          onSuccess={handleSuccess}
        />
      ) : (
        /* Se não, mostra a grade de produtos */
        <div className="store-grid">
          {products.map((product) => (
            <div key={product.id} className={`product-card ${!product.available ? 'esgotado' : ''}`}>
              <div className="product-image">
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
                    <button onClick={() => setSelectedProduct(product)} className="btn-buy" style={{cursor: 'pointer'}}>
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
      )}
    </section>
  );
}

export default StoreSection;