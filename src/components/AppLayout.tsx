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
  Divider,
  Select,
  FormControl,
  type SelectChangeEvent,
  useMediaQuery,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DisciplinaModal from './DisciplinaModal';
import { useAuth } from '../hooks/useAuth';
import { useDisciplinas } from '../hooks/useDisciplinas';
import * as firestoreService from '../services/firestoreService';
import type { DisciplinaUsuarioData } from '../services/firestoreService';
import { downloadJson } from '../utils/dataUtils';
import { useCourse } from '../hooks/useCourse';
import type { DisciplinaUsuario } from '../types/types';

// --- FUNÇÕES DE CONVERSÃO DE DADOS ---

// Pega o ano e quadrimestre de uma string "AAAA.Q"
function parsePeriodo(period: string): { ano: number; quadrimestre: 1 | 2 | 3 } {
  const [anoStr, quadStr] = period.split('.');
  const ano = parseInt(anoStr, 10);
  const quadrimestre = parseInt(quadStr, 10) as 1 | 2 | 3;
  return { ano, quadrimestre };
}

// Converte a sigla da categoria para o nome usado no app
function convertTipo(category: string): DisciplinaUsuario['tipo'] {
  switch (category) {
    case 'OBR': return 'obrigatoria';
    case 'OL': return 'limitada';
    case 'LIV': return 'livre';
    default: return 'livre';
  }
}

// Converte a sigla do status para o nome usado no app
function convertStatus(status: string): DisciplinaUsuario['status'] | null {
  switch (status) {
    case 'APR': case 'DISP': return 'concluida';
    case 'MATR': return 'planejada';
    default: return null;
  }
}

// Converte o histórico acadêmico para o formato interno do app
function converterHistoricoParaApp(data: any[]): DisciplinaUsuarioData[] {
  const disciplinasConvertidas: DisciplinaUsuarioData[] = [];
  for (const item of data) {
    const novoStatus = convertStatus(item.status);
    if (novoStatus) {
      const { ano, quadrimestre } = parsePeriodo(item.period);
      disciplinasConvertidas.push({
        codigo: item.code,
        nome: item.name,
        creditos: item.credits,
        ano: ano,
        quadrimestre: quadrimestre,
        tipo: convertTipo(item.category),
        status: novoStatus,
        nota: item.grade || undefined,
      });
    }
  }

  // Remove duplicatas, priorizando 'concluida'
  const disciplinasUnicas = new Map<string, DisciplinaUsuarioData>();
  for (const disc of disciplinasConvertidas) {
    const existente = disciplinasUnicas.get(disc.codigo);
    // Adiciona se não existir, ou se o novo for 'concluida' e o existente não for
    if (!existente || (disc.status === 'concluida' && existente.status !== 'concluida')) {
      disciplinasUnicas.set(disc.codigo, disc);
    } else if (existente.status === 'concluida' && disc.status === 'planejada') {
      // Já foi concluída, ignora o status 'planejada'
    } else {
      disciplinasUnicas.set(disc.codigo, disc);
    }
  }
  return Array.from(disciplinasUnicas.values());
}


const AppLayout: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, linkGoogleAccount, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Ref para acionar o input de arquivo (Importar)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cursosDisponiveis, selectedCourse, selectCourse } = useCourse();

  // Verifica se está em tela menor (mobile/tablet)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  // Pega a URL atual para marcar a aba ativa
  const location = useLocation();
  const currentTab = location.pathname;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleExport = async () => {
    if (!user) return;
    try {
      const data = await firestoreService.exportDisciplinas(user.uid);
      downloadJson(data, `planejador-${selectedCourse.id}-backup.json`);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar dados.");
    }
    handleMenuClose();
  };

  // Abre o diálogo de arquivo
  const handleImportClick = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  // Processa o arquivo JSON selecionado
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    if (file.type !== "application/json") {
      alert("Por favor, selecione um arquivo JSON válido.");
      return;
    }
    if (!window.confirm("Isso irá importar os dados do arquivo. Deseja continuar?")) return;

    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      let dataToImport: DisciplinaUsuarioData[];

      // Tenta detectar se o JSON é um histórico acadêmico (formato diferente)
      if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].period && rawData[0].category) {
        alert("Detectamos um formato de histórico acadêmico. Convertendo dados...");
        dataToImport = converterHistoricoParaApp(rawData);
      } else {
        dataToImport = rawData as DisciplinaUsuarioData[];
      }
      await firestoreService.importDisciplinas(user.uid, dataToImport);
      alert(`Dados importados com sucesso! ${dataToImport.length} disciplinas foram adicionadas.`);
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar dados.");
    }
    // Limpa o input para permitir importar o mesmo arquivo novamente
    event.target.value = '';
  };

  const handleLink = () => { handleMenuClose(); linkGoogleAccount(); };
  const handleLogout = () => { handleMenuClose(); logout(); };
  // Muda o curso selecionado
  const handleCourseChange = (event: SelectChangeEvent<string>) => selectCourse(event.target.value as string);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>

      {/* --- BARRA SUPERIOR (NAVBAR) --- */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>

            {/* Logo / Título */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 0,
                mr: 2,
                color: 'primary.main',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' } // Oculta em telas pequenas
              }}
            >
              Planejador
            </Typography>

            {/* Seletor de Curso */}
            <FormControl size="small" sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 250 }, mr: 'auto' }}>
              <Select
                value={selectedCourse.id}
                onChange={handleCourseChange}
                displayEmpty
                sx={{ borderRadius: 2, fontSize: '0.875rem' }}
              >
                {cursosDisponiveis.map(curso => (
                  <MenuItem key={curso.id} value={curso.id}>{curso.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Abas de Navegação (APENAS DESKTOP) */}
            {!isMobile && (
              <Tabs value={currentTab} textColor="primary" indicatorColor="primary" sx={{ ml: 2 }}>
                <Tab label="Dashboard" value="/" to="/" component={Link} />
                <Tab label="Histórico" value="/historico" to="/historico" component={Link} />
                <Tab label="Planejador" value="/planejador" to="/planejador" component={Link} />
              </Tabs>
            )}

            {/* Botão e Menu de Configurações */}
            <Box sx={{ ml: 1 }}>
              <IconButton onClick={handleMenuOpen} color="primary">
                <SettingsIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleExport}>Exportar Dados</MenuItem>
                <MenuItem onClick={handleImportClick}>Importar Dados</MenuItem>
                <Divider />
                {/* Mostra 'Vincular Google' apenas para usuário anônimo */}
                {user?.isAnonymous && <MenuItem onClick={handleLink}>Vincular Google</MenuItem>}
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
              {/* Input de arquivo invisível para a importação */}
              <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileImport} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <Container maxWidth="lg" component="main" sx={{ py: 3, flexGrow: 1, pb: { xs: 10, md: 3 } }}>
        <Outlet />
      </Container>

      {/* --- BOTÃO FLUTUANTE (FAB) para Adicionar Disciplina --- */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          // Sobe para não ficar atrás da barra de navegação no mobile
          bottom: { xs: 76, md: 32 },
          right: 24,
          zIndex: 2000
        }}
        onClick={() => setModalOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* --- BARRA DE NAVEGAÇÃO INFERIOR (APENAS MOBILE) --- */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentTab}
            onChange={(_, newValue) => {
              navigate(newValue);
            }}
          >
            <BottomNavigationAction label="Dashboard" value="/" icon={<DashboardIcon />} />
            <BottomNavigationAction label="Histórico" value="/historico" icon={<HistoryIcon />} />
            <BottomNavigationAction label="Planejador" value="/planejador" icon={<EventNoteIcon />} />
          </BottomNavigation>
        </Paper>
      )}

      {/* Modal de Adicionar/Editar Disciplina */}
      <DisciplinaModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default AppLayout;