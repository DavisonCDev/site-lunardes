import React from 'react';

function Success() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0a0a0a', // Fundo dark da banda
      color: '#fff',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        border: '2px solid var(--primary-color)',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.2)'
      }}>
        <h1 className="outline-title" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>
          VALEU, LUNÁTICO!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '500px' }}>
          O seu pedido foi confirmado. Prepara o som que o seu kit já está entrando em produção! 🤘
        </p>
        <br />
        <a href="/" className="btn-buy" style={{ 
          textDecoration: 'none', 
          marginTop: '20px',
          display: 'inline-block' 
        }}>
          VOLTAR PARA A HOME
        </a>
      </div>
    </div>
  );
}

export default Success;