import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// IMPORTANDO OS ESTILOS
// Os nomes dos arquivos batem com o que está na pasta src/styles
import './styles/variables.css'
import './styles/extras.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/components.css'
import './styles/tour.css'
import './styles/store.css'
import './styles/footer.css'
import './styles/newsletter.css'
import './styles/cursor.css'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)