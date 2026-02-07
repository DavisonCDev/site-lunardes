import React from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import '../styles/checkout.css';

const CheckoutBrick = ({ product, onBack, onSuccess }) => {
  
  const onSubmit = async (formData) => {
    try {
      const paymentData = {
        title: product.name,
        price: product.price,
        quantity: 1,
        token: formData.token,
        email: formData.payer.email,
        paymentMethodId: formData.payment_method_id,
      };

      const response = await fetch('http://localhost:8080/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const status = await response.text();
      
      if (status === "approved") {
        onSuccess();
      } else {
        // Exibe o status direto no alert para facilitar o debug
        alert("Pagamento não aprovado. Status: " + status);
      }
    } catch (error) {
      console.error("Erro no processamento:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
// Dentro do return do seu CheckoutBrick.jsx
<div className="checkout-container">
    <button className="btn-back" onClick={onBack}>
        ← Voltar
    </button>
    
    <div className="checkout-header">
        <h3>Pack selecionado:</h3>
        <p className="product-display-name">{product.name}</p>
        <span className="product-display-price">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
    </div>

    <CardPayment
      initialization={{ amount: product.price }}
      onSubmit={onSubmit}
      customization={{
        visual: {
          style: { theme: 'dark' }
        }
      }}
    />
</div>
  );
};

export default CheckoutBrick;