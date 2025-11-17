import { Routes, Route } from 'react-router-dom';
import { DisciplinasProvider } from './context/DisciplinasContext';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Historico from './pages/Historico';
import Planejador from './pages/Planejador';

function App() {
  return (
    // O DisciplinasProvider precisa estar DENTRO do AppLayout
    // pois o AppLayout usa o hook useDisciplinas (para import/export).
    // O AppLayout precisa estar DENTRO das Routes para que 
    // o <Outlet> funcione.
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