import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { FiRefreshCw, FiTruck, FiXCircle } from 'react-icons/fi'; // Ícones de ação
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // 1. Monitoramento de Sessão
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const authorizedEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (currentUser) {
        if (currentUser.email === authorizedEmail) {
          setUser(currentUser);
          setLoading(false);
        } else {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          alert("Acesso restrito! 🎸");
          navigate('/');
        }
      } else {
        setUser(null);
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Busca de Pedidos
  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

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
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // 3. FUNÇÃO PARA ATUALIZAR STATUS (AÇÃO)
  const updateOrderStatus = async (orderId, newStatus) => {
    const confirmMsg = newStatus === 'enviado' 
      ? "Confirmar envio do produto?" 
      : "Deseja realmente cancelar este pedido?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`http://localhost:8080/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders(); // Recarrega a lista para mostrar a mudança
      } else {
        alert("Erro ao atualizar no servidor.");
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
    }
  };

  // Cálculos
  const totalFaturamento = orders.reduce((acc, order) => acc + parseFloat(order.amount || 0), 0);
  const totalPedidos = orders.length;
  const ticketMedio = totalPedidos > 0 ? (totalFaturamento / totalPedidos) : 0;

  if (loading) return <div className="admin-container loading-text"><h2>Sintonizando frequências... 🎸</h2></div>;

  if (!user) return (
    <div className="admin-container">
      <div className="login-box">
        <h2>BACKSTAGE ACCESS</h2>
        <button className="btn-buy" onClick={() => signInWithPopup(auth, googleProvider)}>ENTRAR COM GOOGLE</button>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <div className="user-info">
            <img src={user.photoURL} alt="Admin" className="user-avatar"/>
            <h1>Olá, {user.displayName?.split(' ')[0]} 🤘</h1>
        </div>
        <div className="header-actions">
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

      <div className="table-responsive">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th> {/* Nova Coluna */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'}</td>
                  <td>{order.email}</td>
                  <td>{order.product}</td>
                  <td>R$ {parseFloat(order.amount).toFixed(2)}</td>
                  <td><span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  
                  {/* CÉLULA DE AÇÕES */}
                  <td className="actions-cell">
                    <button 
                      className="btn-action ship" 
                      title="Marcar como Enviado"
                      onClick={() => updateOrderStatus(order.id, 'enviado')}
                      disabled={order.status === 'enviado'}
                    >
                      <FiTruck />
                    </button>
                    <button 
                      className="btn-action cancel" 
                      title="Cancelar Pedido"
                      onClick={() => updateOrderStatus(order.id, 'cancelado')}
                      disabled={order.status === 'cancelado'}
                    >
                      <FiXCircle />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}; 

export default Admin;