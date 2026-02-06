import { useState } from 'react';

function Navbar() {
  // Estado para controlar o menu mobile (aberto/fechado)
  const [menuAtivo, setMenuAtivo] = useState(false);

  // Função para abrir/fechar o menu
  const toggleMenu = () => {
    setMenuAtivo(!menuAtivo);
  };

  // Função para fechar o menu quando clicar num link
  const fecharMenu = () => {
    setMenuAtivo(false);
  };

  return (
    <nav>
      <div className="logo">
        {/* O caminho começa com /imagens (pasta public) */}
        <img src="/imagens/Logo Final Branco-p.png" alt="Logo Lunardes" />
      </div>

      {/* Botão Hambúrguer (Mobile) */}
      <div className={`menu-toggle ${menuAtivo ? 'active' : ''}`} onClick={toggleMenu}>
        <i className={`fas ${menuAtivo ? 'fa-times' : 'fa-bars'}`}></i>
      </div>

      {/* Links de Navegação */}
      {/* Se menuAtivo for true, adiciona a classe 'active' do seu CSS */}
      <ul className={`nav-links ${menuAtivo ? 'active' : ''}`}>
        <li><a href="#home" onClick={fecharMenu}>Home</a></li>
        <li><a href="#musica" onClick={fecharMenu}>Música</a></li>
        <li><a href="#galeria" onClick={fecharMenu}>Fotos</a></li>
        <li><a href="#sobre" onClick={fecharMenu}>Bio</a></li>      
        <li><a href="#tour" onClick={fecharMenu}>Tour</a></li>
        <li><a href="#loja" onClick={fecharMenu}>Loja</a></li>
        <li><a href="#contato" onClick={fecharMenu}>Contato</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;