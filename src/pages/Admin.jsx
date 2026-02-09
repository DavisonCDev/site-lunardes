import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import '../styles/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // 1. Segurança e Monitoramento de Sessão
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
          alert("Acesso restrito! Redirecionando... 🎸");
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

  // 2. Busca inicial de pedidos
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
        
        // ORDENAÇÃO: Mais recentes no topo (createdAt)
        const sortedOrders = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de pedidos:", error);
    } finally {
      // Delay suave para a animação do ícone
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // 3. Cálculos de Faturamento
  const totalFaturamento = orders.reduce((acc, order) => acc + parseFloat(order.amount || 0), 0);
  const totalPedidos = orders.length;
  const ticketMedio = totalPedidos > 0 ? (totalFaturamento / totalPedidos) : 0;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-container" style={{textAlign: 'center', marginTop: '100px'}}>
        <h2 className="loading-text">Sintonizando frequências... 🎸</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-container">
        <div className="login-box">
          <h2>BACKSTAGE ACCESS</h2>
          <p>Área restrita: Banda e Suporte</p>
          <button className="btn-buy" onClick={() => signInWithPopup(auth, googleProvider)}>
            ENTRAR COM GOOGLE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="dashboard-header">
        <div className="user-info">
            <img src={user.photoURL} alt="Admin" className="user-avatar"/>
            <h1>Olá, {user.displayName?.split(' ')[0]} 🤘</h1>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchOrders} disabled={isRefreshing}>
            ATUALIZAR 
            <FiRefreshCw className={isRefreshing ? 'spin-icon spinning' : 'spin-icon'} />
          </button>
          <button className="btn-back" onClick={handleLogout}>
            SAIR
          </button> 
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Faturamento Total</h3>
          <p className="stat-value">R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h3>Vendas</h3>
          <p className="stat-value">{totalPedidos}</p>
        </div>
        <div className="stat-card">
          <h3>Ticket Médio</h3>
          <p className="stat-value">R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: "center"}}>Nenhum pedido processado.</td></tr>
              ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      {/* Correção da Data: Usando createdAt e formato pt-BR */}
                      <td>
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) 
                          : '---'}
                      </td>
                      <td>{order.email}</td>
                      <td>{order.product}</td>
                      <td>R$ {parseFloat(order.amount).toFixed(2)}</td>
                      <td>
                        {/* Classe de status dinâmica para o CSS */}
                        <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}; 

export default Admin;