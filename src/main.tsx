import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { appTheme } from './theme/theme.ts';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

// Ajuste para o basename do GitHub Pages
const basename = import.meta.env.BASE_URL || '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BrowserRouter deve vir ANTES do AuthProvider se o AuthProvider 
      precisar navegar (não é o caso aqui, mas é boa prática) 
    */}
    <BrowserRouter basename={basename}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline /> {/* Normaliza o CSS */}
        <AuthProvider> {/* Fornece o contexto de autenticação */}
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)