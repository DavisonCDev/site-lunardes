// 1. Imports de Roteamento (NOVO)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

// Componente para a Home para o App.jsx não ficar gigante
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
    <Router> {/* NOVO: Envolve tudo com o Router */}
      <CustomCursor />
      <div className="noise-overlay"></div>
      
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* O '/*' no final diz: "Se começar com /success, não importa o que venha depois, mostre o componente Success" */}
          <Route path="/success/*" element={<Success />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  )
}

export default App;