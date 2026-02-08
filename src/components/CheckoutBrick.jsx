import React, { useState } from 'react';
import { Payment } from '@mercadopago/sdk-react'; // MUDANÇA: Usamos 'Payment' agora
import StatusModal from './StatusModal';
import '../styles/checkout.css';

const CheckoutBrick = ({ product, onBack, onSuccess }) => {
  const [modalData, setModalData] = useState(null);

  const initialization = {
    amount: product.price,
    preferenceId: "<PREFERENCE_ID>", // Opcional para brick simples, mas recomendado se tiver
  };

  const customization = {
    paymentMethods: {
      ticket: "all",         // Boleto (opcional)
      bankTransfer: "all",   // PIX (O mais importante!)
      creditCard: "all",     // Cartão de Crédito
      debitCard: "all",      // Cartão de Débito
      mercadoPago: "all",    // Carteira do Mercado Pago
    },
    visual: {
      style: {
        theme: 'dark', // Mantém o tema dark da banda
      }
    },
  };

  const onSubmit = async ({ formData }) => {
    // Essa função precisa retornar uma Promise para o Brick funcionar direito
    return new Promise((resolve, reject) => {
      
      const paymentData = {
        title: product.name,
        price: product.price,
        quantity: 1,
        token: formData.token,            // Só existe se for cartão
        email: formData.payer.email,
        paymentMethodId: formData.payment_method_id,
        issuerId: formData.issuer_id,     // Só existe se for cartão
      };

      fetch('http://localhost:8080/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Retorno MP:", data);

        // --- TRATAMENTO INTELIGENTE ---
        
        // 1. Se for Aprovado (Cartão passou na hora) -> Vai para página de Sucesso
        if (data.status === "approved") {
          resolve(); // Avisa o Brick que deu certo
          onSuccess(); // Navega para /success
        } 
        
        // 2. Se for Pendente e for PIX -> Deixa o Brick mostrar o QR Code
        else if (data.status === "pending" && formData.payment_method_id === "pix") {
          resolve(); // O Brick vai entender e mostrar a tela verde com o QR Code
        }
        
        // 3. Se for Erro -> Mostra o nosso Modal Estiloso
        else {
          resolve(); // Resolve para não travar o brick
          setModalData({
            status: data.status,
            detail: data.status_detail || "error"
          });
        }
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
    });
  };

  return (
    <div className="checkout-container">
      
      {/* Modal de Erro customizado (se precisar) */}
      {modalData && (
        <StatusModal 
          status={modalData.status} 
          detail={modalData.detail} 
          onClose={() => setModalData(null)} 
        />
      )}

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

      {/* O Componente Completo (Cartão + Pix + Wallet) */}
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CheckoutBrick;