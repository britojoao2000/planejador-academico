import React, { useState, useRef } from 'react';
import { 
  AppBar, Box, Container, Fab, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, Tooltip, Typography 
} from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DisciplinaModal from './DisciplinaModal';
import { useAuth } from '../hooks/useAuth';
import { useDisciplinas } from '../hooks/useDisciplinas';
import * as firestoreService from '../services/firestoreService';
import { downloadJson } from '../utils/dataUtils';

const AppLayout: React.FC = () => {
  // Estado do Modal
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estado do Menu de Configurações (Recurso 7)
  const { user } = useAuth();
  const { disciplinas } = useDisciplinas();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navegação por Abas
  const location = useLocation();
  const currentTab = location.pathname;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- Funções de Import/Export (Recurso 7) ---

  const handleExport = async () => {
    if (!user) return;
    try {
      const data = await firestoreService.exportDisciplinas(user.uid);
      downloadJson(data, 'planejador-academico-backup.json');
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar dados.");
    }
    handleMenuClose();
  };

  const handleImportClick = () => {
    // Aciona o input de arquivo escondido
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (file.type !== "application/json") {
      alert("Por favor, selecione um arquivo JSON válido.");
      return;
    }

    if (!window.confirm("Isso irá adicionar as disciplinas do arquivo. Deseja continuar?")) {
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text) as firestoreService.DisciplinaUsuarioData[];
      await firestoreService.importDisciplinas(user.uid, data);
      alert("Dados importados com sucesso!");
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar dados. Verifique o formato do arquivo.");
    }
    // Reseta o input para permitir o upload do mesmo arquivo novamente
    event.target.value = '';
  };

  // --- Fim Import/Export ---

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
              Planejador Acadêmico
            </Typography>

            {/* Navegação por Abas (Recurso 2) */}
            <Tabs 
              value={currentTab} 
              textColor="primary" 
              indicatorColor="primary"
            >
              <Tab label="Dashboard" value="/" to="/" component={Link} />
              <Tab label="Histórico" value="/historico" to="/historico" component={Link} />
              <Tab label="Planejador" value="/planejador" to="/planejador" component={Link} />
            </Tabs>
            
            {/* Menu de Configurações (Recurso 7) */}
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Configurações e Backup">
                <IconButton onClick={handleMenuOpen} color="primary">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleExport}>Exportar Dados (JSON)</MenuItem>
                <MenuItem onClick={handleImportClick}>Importar Dados (JSON)</MenuItem>
              </Menu>
              {/* Input de arquivo escondido para importação */}
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileImport}
              />
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Conteúdo da Página (das rotas) */}
      <Container maxWidth="lg" component="main" sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>

      {/* FAB (Recurso 5) */}
      <Tooltip title="Adicionar Disciplina">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => setModalOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Modal de Adição/Edição (Recurso 5) */}
      <DisciplinaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default AppLayout;