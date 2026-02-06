import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// IMPORTANDO OS ESTILOS
import './styles/variables.css'
import './styles/extras.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/marquee.css'
import './styles/music.css'
import './styles/gallery.css'
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