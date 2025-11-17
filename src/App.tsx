import { Routes, Route } from 'react-router-dom';
import { DisciplinasProvider } from './context/DisciplinasContext';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Historico from './pages/Historico';
import Planejador from './pages/Planejador';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return null; // O spinner do AuthProvider está cuidando disso
  }

  // Se NÃO houver usuário, mostre APENAS a página de login
  if (!user) {
    return <Login />;
  }

  return (
    
    <DisciplinasProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="historico" element={<Historico />} />
          <Route path="planejador" element={<Planejador />} />
        </Route>
      </Routes>
    </DisciplinasProvider>
  );
}

export default App;