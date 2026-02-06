import { useEffect, useRef } from 'react';

function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    
    // Se for celular/tablet (touch), não faz nada e sai
    if (!cursor || window.matchMedia("(hover: none)").matches) return;

    // Função que move a bolinha
    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    // Funções para aumentar a bolinha (hover)
    const handleMouseEnter = () => cursor.classList.add('hovered');
    const handleMouseLeave = () => cursor.classList.remove('hovered');

    // Escuta o movimento do mouse na janela inteira
    window.addEventListener('mousemove', moveCursor);
    
    // Procura links e botões para adicionar o efeito de "aumentar"
    const links = document.querySelectorAll('a, button, .tour-item, input, .product-card');
    links.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Limpeza (quando sair da página)
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
}

export default CustomCursor;