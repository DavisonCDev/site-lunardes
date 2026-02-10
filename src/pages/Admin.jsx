import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { FiRefreshCw, FiTruck, FiXCircle, FiCheckCircle, FiClock, FiPackage, FiSearch, FiDollarSign, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeTab, setActiveTab] = useState('abertos'); 
  
  const navigate = useNavigate();

  const statusMap = {
    'approved': 'Aprovado',
    'pending': 'Pendente',
    'in_process': 'Em Análise',
    'rejected': 'Recusado',
    'cancelled': 'Cancelado',
    'refunded': 'Reembolsado',
    'charged_back': 'Estornado',
    'enviado': 'Enviado',
    'reembolsado': 'Reembolsado',
    'entregue': 'Entregue'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        const authorizedEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (currentUser) {
            if (currentUser.email === authorizedEmail) { setUser(currentUser); setLoading(false); }
            else { await signOut(auth); setUser(null); setLoading(false); alert("Acesso restrito!"); navigate('/'); }
        } else { setUser(null); setOrders([]); setLoading(false); }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('http://localhost:8080/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      }
    } catch (error) { console.error("Erro:", error); } 
    finally { setTimeout(() => setIsRefreshing(false), 800); }
  };

  // --- FUNÇÃO DE EXPORTAÇÃO CSV ---
  const exportToCSV = () => {
    const headers = ["ID", "Data", "Cliente", "Produto", "Valor", "Status", "Rastreio"];
    
    // Mapeia os dados filtrados para o formato de colunas
    const rows = filteredOrders.map(order => [
      order.id,
      formatDate(order.createdAt),
      order.email,
      order.product,
      `R$ ${parseFloat(order.amount).toFixed(2)}`,
      statusMap[order.status] || order.status,
      order.trackingCode || 'N/A'
    ]);

    // Monta o conteúdo com ponto e vírgula (melhor para Excel em PT-BR)
    const csvContent = [headers, ...rows].map(e => e.join(";")).join("\n");
    
    // Adiciona o BOM (\ufeff) para garantir que acentos e R$ apareçam certo no Excel
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `vendas_lunardes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
     let confirmMsg = "";
     let trackingCodeInput = null;

     if (newStatus === 'enviado') {
         trackingCodeInput = window.prompt("🚀 Digite o CÓDIGO DE RASTREIO:");
         if (!trackingCodeInput || trackingCodeInput.trim() === "") {
             alert("Operação cancelada: Código obrigatório.");
             return;
         }
         confirmMsg = `Confirmar envio com rastreio: ${trackingCodeInput}?`;
     } 
     else if (newStatus === 'cancelado') confirmMsg = "Deseja cancelar o pedido?";
     else if (newStatus === 'reembolsado') confirmMsg = "Confirmar estorno realizado?";
     
     if (confirmMsg && !window.confirm(confirmMsg)) return;

     try {
       const token = await auth.currentUser.getIdToken();
       await fetch(`http://localhost:8080/admin/orders/${orderId}/status`, {
         method: 'PUT',
         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
         body: JSON.stringify({ status: newStatus, trackingCode: trackingCodeInput })
       });
       fetchOrders(); 
     } catch (e) { console.error(e); }
  };

  const toggleRow = (id) => {
    if (expandedOrderId === id) setExpandedOrderId(null);
    else setExpandedOrderId(id);
  };

  const formatDate = (dateString) => {
      if (!dateString) return null;
      return new Date(dateString).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
      });
  };

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const status = order.status?.toLowerCase();
    
    const matchesTab = () => {
        if (activeTab === 'todos') return true;
        if (activeTab === 'entregues') return status === 'entregue';
        if (activeTab === 'arquivados') return status === 'cancelado' || status === 'reembolsado';
        if (activeTab === 'abertos') return !['entregue', 'cancelado', 'reembolsado'].includes(status);
        return true;
    };

    if (!matchesTab()) return false;

    const translatedStatus = statusMap[order.status] || order.status;
    return (
        order.email?.toLowerCase().includes(search) ||
        order.id?.toString().includes(search) ||
        order.product?.toLowerCase().includes(search) ||
        translatedStatus?.toLowerCase().includes(search)
    );
  });

  const totalFaturamento = orders.reduce((acc, order) => acc + parseFloat(order.amount || 0), 0);
  const totalPedidos = orders.length;
  const ticketMedio = totalPedidos > 0 ? (totalFaturamento / totalPedidos) : 0;

  if (loading) return <div className="admin-container loading-text"><h2>Sintonizando... 🎸</h2></div>;
  if (!user) return <div className="admin-container"><button onClick={() => signInWithPopup(auth, googleProvider)}>LOGIN</button></div>;

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <div className="user-info">
             <img src={user.photoURL} alt="Admin" className="user-avatar"/>
             <h1>Olá, {user.displayName?.split(' ')[0]} 🤘</h1>
        </div>
        <div className="header-actions">
             {/* BOTÃO DE EXPORTAR LISTA */}
             <button className="btn-export" onClick={exportToCSV} title="Exportar visualização atual para Excel">
                <FiDownload /> EXPORTAR CSV
             </button>

             <button className="btn-refresh" onClick={fetchOrders} disabled={isRefreshing}>
                ATUALIZAR <FiRefreshCw className={isRefreshing ? 'spin-icon spinning' : 'spin-icon'} />
             </button>
             <button className="btn-back" onClick={async () => { await signOut(auth); navigate('/'); }}>SAIR</button> 
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><h3>Faturamento</h3><p className="stat-value">R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
        <div className="stat-card"><h3>Vendas</h3><p className="stat-value">{totalPedidos}</p></div>
        <div className="stat-card"><h3>Ticket Médio</h3><p className="stat-value">R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
      </div>

      <div className="tab-container">
          <button className={`tab-btn ${activeTab === 'abertos' ? 'active' : ''}`} onClick={() => setActiveTab('abertos')}>
            EM ABERTO <span className="tab-count">{orders.filter(o => !['entregue', 'cancelado', 'reembolsado'].includes(o.status)).length}</span>
          </button>
          <button className={`tab-btn ${activeTab === 'entregues' ? 'active entregue' : ''}`} onClick={() => setActiveTab('entregues')}>
            ENTREGUES <span className="tab-count">{orders.filter(o => o.status === 'entregue').length}</span>
          </button>
          <button className={`tab-btn ${activeTab === 'arquivados' ? 'active arquivado' : ''}`} onClick={() => setActiveTab('arquivados')}>
            ARQUIVADOS
          </button>
          <button className={`tab-btn ${activeTab === 'todos' ? 'active geral' : ''}`} onClick={() => setActiveTab('todos')}>
            GERAL
          </button>
      </div>

      <div className="search-container">
          <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input 
                  type="text" 
                  placeholder="Buscar por E-mail, ID, Status ou Produto..." 
                  className="cyber-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="result-count">{filteredOrders.length} registros encontrados</div>
      </div>

      <div className="table-responsive">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Detalhes</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '30px', color: '#666'}}>Nenhum pedido encontrado. 🕶️</td></tr>
              ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                        <tr style={{ cursor: 'pointer', background: expandedOrderId === order.id ? '#111' : 'transparent' }}>
                          <td onClick={() => toggleRow(order.id)}>
                              <button className="btn-expand">{expandedOrderId === order.id ? '-' : '+'}</button>
                          </td>
                          <td>{formatDate(order.createdAt)?.split(' ')[0]}</td> 
                          <td><a href={`mailto:${order.email}`} style={{color: '#fff', textDecoration: 'underline'}}>{order.email}</a></td>
                          <td>{order.product}</td>
                          <td>R$ {parseFloat(order.amount).toFixed(2)}</td>
                          <td>
                              <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                  {statusMap[order.status] || order.status}
                              </span>
                          </td>
                          <td className="actions-cell">
                            <button className="btn-action ship" title="Enviar" disabled={['enviado', 'entregue', 'cancelado', 'reembolsado'].includes(order.status)} onClick={() => updateOrderStatus(order.id, 'enviado')}><FiTruck /></button>
                            <button className="btn-action cancel" title="Cancelar" disabled={['cancelado', 'reembolsado', 'entregue'].includes(order.status)} onClick={() => updateOrderStatus(order.id, 'cancelado')}><FiXCircle /></button>
                            {order.status === 'cancelado' && (
                                <button className="btn-action refund" title="Reembolsar" onClick={() => updateOrderStatus(order.id, 'reembolsado')}><FiDollarSign /></button>
                            )}
                          </td>
                        </tr>

                        {expandedOrderId === order.id && (
                            <tr className="history-row">
                                <td colSpan="7">
                                    <div className="history-container">
                                        <h4>📜 Histórico do Pedido #{order.id}</h4>
                                        <div className="history-step"><FiClock className="step-icon"/><span>Pedido Realizado</span><span className="step-date">{formatDate(order.createdAt)}</span></div>
                                        {['approved', 'aprovado', 'enviado', 'entregue'].includes(order.status) && (
                                          <div className="history-step"><FiCheckCircle className="step-icon" style={{color: '#00FFD5'}}/><span>Pagamento Aprovado</span><span className="step-date">Automático</span></div>
                                        )}
                                        {order.shippedAt && (
                                            <div className="history-step">
                                                <FiPackage className="step-icon" style={{color: '#0099ff'}}/>
                                                <span>Enviado {order.trackingCode && `(${order.trackingCode})`}</span>
                                                <span className="step-date">{formatDate(order.shippedAt)}</span>
                                            </div>
                                        )}
                                        {order.status === 'entregue' && (
                                            <div className="history-step">
                                                <FiCheckCircle className="step-icon" style={{color: '#00FFD5'}}/>
                                                <span>Entregue</span>
                                                <span className="step-date">Confirmado via API</span>
                                            </div>
                                        )}
                                        {order.cancelledAt && (<div className="history-step"><FiXCircle className="step-icon" style={{color: '#ff0055'}}/><span>Cancelado</span><span className="step-date">{formatDate(order.cancelledAt)}</span></div>)}
                                        {order.refundedAt && (<div className="history-step"><FiDollarSign className="step-icon" style={{color: '#b400ff'}}/><span>Reembolsado</span><span className="step-date">{formatDate(order.refundedAt)}</span></div>)}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                  ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}; 

export default Admin;