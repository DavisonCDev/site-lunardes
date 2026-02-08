import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/success.css';

function Success() {
  const navigate = useNavigate();

  // 1. FORÇA A TELA A IR PARA O TOPO ASSIM QUE A PÁGINA CARREGA
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        
        {/* Animação do Check com a nova cor Verde Neon */}
        <svg className="checkmark-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>

        <h1 className="success-title">
          VALEU, LUNÁTICO!
        </h1>
        
        <p className="success-text">
          O seu pedido foi confirmado. O sistema já está processando tudo.<br/>
          Prepara o som que o seu kit em breve estará com você! 🤘
        </p>
        
        <button onClick={() => navigate('/')} className="btn-home">
          VOLTAR PARA A HOME
        </button>
      </div>
    </div>
  );
}

export default Success;