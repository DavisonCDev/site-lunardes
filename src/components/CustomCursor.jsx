import React, { useEffect, useRef } from 'react';
import '../styles/cursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    // Se não tiver cursor ou for touch (celular), aborta
    if (!cursor || window.matchMedia("(hover: none)").matches) return;

    // 1. Movimento: Segue o mouse
    const moveCursor = (e) => {
      // Torna visível assim que o mouse mexe pela primeira vez
      if (cursor.style.opacity === "0" || cursor.style.opacity === "") {
        cursor.style.opacity = "1";
      }
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    // 2. Detecção de Hover Inteligente (Funciona em Modais e Checkout)
    const handleMouseOver = (e) => {
      // Lista de tudo que deve ativar o efeito do cursor
      const clickableSelectors = `
        a, 
        button, 
        input, 
        textarea,
        select,
        label,
        .btn, 
        .btn-buy, 
        .btn-back, 
        .btn-modal, 
        .product-card, 
        .checkout-container,
        .success-card button,
        [role="button"]
      `;

      // Verifica se o elemento onde o mouse está (ou o pai dele) é clicável
      const target = e.target.closest(clickableSelectors);
      
      if (target) {
        cursor.classList.add('hovered');
      } else {
        cursor.classList.remove('hovered');
      }
    };

    // Adiciona ouvintes na JANELA inteira (Global)
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    // Limpeza ao sair
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
};

export default CustomCursor;