import { StrictMode } from 'react'

import { BrowserRouter as Router} from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './components/App/App'
import { AppContextProvider } from './components/AppContext'
import "./variables.css"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Router>
  </StrictMode>,
)
