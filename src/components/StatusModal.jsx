import React from 'react';
import '../styles/statusModal.css';

const StatusModal = ({ status, detail, onClose }) => {
  
  // Mapeamento dos códigos de erro do Mercado Pago para mensagens amigáveis
  const messages = {
    // Casos de Rejeição (REJECTED)
    'cc_rejected_other_reason': { 
      title: 'Ops! Algo deu errado', 
      msg: 'Houve um erro geral no processamento. Tente usar outro cartão.',
      type: 'error'
    },
    'cc_rejected_call_for_authorize': { 
      title: 'Autorização Necessária', 
      msg: 'O banco bloqueou temporariamente. Ligue para o banco para autorizar a compra.', // CALL
      type: 'error'
    },
    'cc_rejected_insufficient_amount': { 
      title: 'Saldo Insuficiente', 
      msg: 'Seu cartão não tem limite disponível para levar esse kit da banda.', // FUND
      type: 'error'
    },
    'cc_rejected_bad_filled_security_code': { 
      title: 'Código Inválido', 
      msg: 'O CVV (código de segurança) está incorreto. Revise o verso do cartão.', // SECU
      type: 'error'
    },
    'cc_rejected_bad_filled_date': { 
      title: 'Cartão Vencido', 
      msg: 'A data de validade está incorreta ou o cartão já venceu.', // EXPI
      type: 'error'
    },
    'cc_rejected_bad_filled_other': { 
      title: 'Dados Incorretos', 
      msg: 'Erro no preenchimento do formulário. Revise seus dados.', // FORM
      type: 'error'
    },
    
    // Caso Pendente (CONT/PENDING)
    'in_process': { 
      title: 'Pagamento em Análise', 
      msg: 'Seu pagamento está sendo revisado. Não se preocupe, avisaremos por e-mail em breve!', // CONT
      type: 'pending'
    },
    'pending': { 
      title: 'Pagamento Pendente', 
      msg: 'Aguardando confirmação do banco. Segura a ansiedade!',
      type: 'pending'
    }
  };

  // Pega a mensagem certa ou usa uma padrão
  const content = messages[detail] || messages[status] || {
    title: 'Não foi possível processar',
    msg: 'Verifique os dados do cartão e tente novamente.',
    type: 'error'
  };

  return (
    <div className="modal-overlay">
      <div className={`status-card ${content.type}`}>
        
        {/* Ícone Dinâmico */}
        <div className="icon-circle">
          {content.type === 'error' ? (
            // X para Erro
            <svg className="icon-svg" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // Relógio para Pendente
            <svg className="icon-svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          )}
        </div>

        <h2>{content.title}</h2>
        <p>{content.msg}</p>

        <button onClick={onClose} className="btn-modal">
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default StatusModal;