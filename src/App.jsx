// 1. Imports de Estilo e Utilitários
import './styles/cursor.css'; // Garante que o CSS do cursor carregue
import CustomCursor from './components/CustomCursor';

// 2. Imports dos Componentes (Na ordem de aparição na tela)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MusicSection from './components/MusicSection';
import GallerySection from './components/GallerySection'; // Novo
import AboutSection from './components/AboutSection';
import TourSection from './components/TourSection';
import StoreSection from './components/StoreSection';
import NewsletterSection from './components/NewsletterSection'; // Novo
import Footer from './components/Footer';

function App() {
  return (
    <>
      <CustomCursor />
      <div className="noise-overlay"></div>
      
      <Navbar />

      <main>
        <Hero />
        <MusicSection />
        <GallerySection />
        <AboutSection />
        <TourSection />
        <StoreSection />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  )
}

export default App;