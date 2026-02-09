import React from 'react';
// 1. Adicionado o Navigate para o redirecionamento de segurança
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 2. Imports de Estilo e Utilitários
import './styles/cursor.css'; 
import CustomCursor from './components/CustomCursor';

// 3. Imports dos Componentes
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MusicSection from './components/MusicSection';
import GallerySection from './components/GallerySection'; 
import AboutSection from './components/AboutSection';
import TourSection from './components/TourSection';
import StoreSection from './components/StoreSection';
import NewsletterSection from './components/NewsletterSection'; 
import Footer from './components/Footer';
import Success from './pages/Success';
import Admin from './pages/Admin';

// Estrutura da Home
const Home = () => (
  <>
    <Hero />
    <MusicSection />
    <GallerySection />
    <AboutSection />
    <TourSection />
    <StoreSection />
    <NewsletterSection />
  </>
);

function App() {
  return (
    <Router>
      <CustomCursor />
      <div className="noise-overlay"></div>
      
      <Navbar />

      <main>
        <Routes>
          {/* ROTA PRINCIPAL */}
          <Route path="/" element={<Home />} />
          
          {/* A ISCA: Se alguém digitar /admin, ele é expulso para a Home */}
          <Route path="/admin" element={<Navigate to="/" replace />} />

          {/* O NOVO ACESSO OFICIAL */}
          <Route path="/backstage" element={<Admin />} />

          <Route path="/success/*" element={<Success />} />
          
          {/* REDIRECIONAMENTO GLOBAL: Se a rota não existir, vai para a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;