import React, { useState, useRef } from 'react';
import { 
  AppBar, 
  Box, 
  Container, 
  Fab, 
  IconButton, 
  Menu, 
  MenuItem, 
  Tab, 
  Tabs, 
  Toolbar, 
  Tooltip, 
  Typography,
  Divider
} from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DisciplinaModal from './DisciplinaModal';
import { useAuth } from '../hooks/useAuth';
import * as firestoreService from '../services/firestoreService';
import { downloadJson } from '../utils/dataUtils';

const AppLayout: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const { user, linkGoogleAccount, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const currentTab = location.pathname;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    event.target.value = '';
  };
  const handleLink = () => {
    handleMenuClose();
    linkGoogleAccount();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}>
              Planejador Acadêmico
            </Typography>

            {/* Navegação por Abas */}
            <Tabs 
              value={currentTab} 
              textColor="primary" 
              indicatorColor="primary"
            >
              <Tab label="Dashboard" value="/" to="/" component={Link} />
              <Tab label="Histórico" value="/historico" to="/historico" component={Link} />
              <Tab label="Planejador" value="/planejador" to="/planejador" component={Link} />
            </Tabs>
            
            {/* Menu de Configurações */}
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
                
                <Divider />

                {/* Lógica para Vincular Conta (se anônimo) */}
                {user?.isAnonymous && (
                  <MenuItem onClick={handleLink}>
                    Vincular Conta Google
                  </MenuItem>
                )}

                {/* Botão de Sair */}
                <MenuItem onClick={handleLogout}>
                  Sair
                </MenuItem>
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

      {/* Conteúdo da Página */}
      <Container maxWidth="lg" component="main" sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>

      {/* FAB */}
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

      {/* Modal de Adição/Edição */}
      <DisciplinaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default AppLayout;