// Em src/components/AppLayout.tsx

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
import { useDisciplinas } from '../hooks/useDisciplinas';
import * as firestoreService from '../services/firestoreService';
import { type DisciplinaUsuarioData } from '../services/firestoreService';
import { downloadJson } from '../utils/dataUtils';
import type { DisciplinaUsuario } from '../types/types';

// ==================================================================
// 1. ADICIONAMOS FUNÇÕES DE CONVERSÃO
// ==================================================================

/** Converte o 'period' (ex: "2018.2") para o nosso formato */
function parsePeriodo(period: string): { ano: number; quadrimestre: 1 | 2 | 3 } {
  const [anoStr, quadStr] = period.split('.');
  const ano = parseInt(anoStr, 10);
  const quadrimestre = parseInt(quadStr, 10) as 1 | 2 | 3;
  return { ano, quadrimestre };
}

/** Converte a 'category' (ex: "OBR") para o nosso 'tipo' */
function convertTipo(category: string): DisciplinaUsuario['tipo'] {
  switch (category) {
    case 'OBR': return 'obrigatoria';
    case 'OL': return 'limitada';
    case 'LIV': return 'livre';
    default: return 'livre'; // Assume 'livre' como padrão
  }
}

/** * Converte o 'status' (ex: "APR") para o nosso 'status'.
 * Retorna `null` para disciplinas reprovadas, para não as importar.
 */
function convertStatus(status: string): DisciplinaUsuario['status'] | null {
  switch (status) {
    case 'APR': // Aprovado
    case 'DISP': // Dispensado
      return 'concluida';
    
    case 'MATR': // Matriculado
      return 'planejada'; // Trata como 'planejada' no nosso app
    
    case 'REP': // Reprovado
    case 'REPF': // Reprovado por falta
    case '0': // Reprovado (nota 0)
    default:
      return null; // Não importar disciplinas reprovadas
  }
}

/**
 * Função principal que converte o JSON do histórico para o formato do nosso app.
 */
function converterHistoricoParaApp(data: any[]): DisciplinaUsuarioData[] {
  const disciplinasConvertidas: DisciplinaUsuarioData[] = [];

  for (const item of data) {
    const novoStatus = convertStatus(item.status);
    
    // Só adiciona se não for reprovada (novoStatus não é null)
    if (novoStatus) {
      const { ano, quadrimestre } = parsePeriodo(item.period);
      
      disciplinasConvertidas.push({
        // Campos do nosso App <- Campos do JSON
        codigo: item.code,
        nome: item.name,
        creditos: item.credits,
        ano: ano,
        quadrimestre: quadrimestre,
        tipo: convertTipo(item.category),
        status: novoStatus,
        nota: item.grade || undefined, // Usa a 'grade' como 'nota'
      });
    }
  }
  
  // O seu histórico tem várias entradas para a mesma disciplina (reprovadas).
  // Vamos pegar apenas a última entrada de cada disciplina que foi APROVADA.
  const disciplinasUnicas = new Map<string, DisciplinaUsuarioData>();
  
  for (const disc of disciplinasConvertidas) {
    // Se já temos uma entrada e ela é 'concluida', não sobrescreva.
    // Se a nova é 'concluida', ela sobrescreve qualquer 'planejada'.
    const existente = disciplinasUnicas.get(disc.codigo);
    
    if (!existente || (disc.status === 'concluida' && existente.status !== 'concluida')) {
      disciplinasUnicas.set(disc.codigo, disc);
    } else if (existente.status === 'concluida' && disc.status === 'planejada') {
      // Já foi concluída, não faz nada
    } else {
      // Outros casos (ex: duas planejadas), mantém a mais recente (que já está)
      disciplinasUnicas.set(disc.codigo, disc);
    }
  }

  return Array.from(disciplinasUnicas.values());
}


// ==================================================================
// 2. O RESTANTE DO COMPONENTE
// ==================================================================

const AppLayout: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, linkGoogleAccount, logout } = useAuth(); 
  const { disciplinas } = useDisciplinas();
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


  // ==================================================================
  // 3. ATUALIZAMOS A FUNÇÃO DE IMPORTAÇÃO
  // ==================================================================
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (file.type !== "application/json") {
      alert("Por favor, selecione um arquivo JSON válido.");
      return;
    }

    if (!window.confirm("Isso irá importar os dados do arquivo. Disciplinas existentes podem ser sobrescritas se o arquivo for antigo. Deseja continuar?")) {
      return;
    }

    try {
      const text = await file.text();
      const rawData = JSON.parse(text);
      
      let dataToImport: DisciplinaUsuarioData[];

      // Verificamos se o JSON é do tipo 'histórico' (checa se o primeiro item tem 'period' e 'category')
      if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].period && rawData[0].category) {
        // Se for, nós o convertemos!
        alert("Detectamos um formato de histórico acadêmico. Convertendo dados e importando apenas disciplinas aprovadas/matriculadas...");
        dataToImport = converterHistoricoParaApp(rawData);
      } else {
        // Senão, assumimos que é um backup do nosso próprio app
        dataToImport = rawData as DisciplinaUsuarioData[];
      }

      await firestoreService.importDisciplinas(user.uid, dataToImport);
      alert(`Dados importados com sucesso! ${dataToImport.length} disciplinas foram adicionadas/atualizadas.`);

    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao importar dados. Verifique o formato do arquivo.");
    }
    
    event.target.value = '';
  };
  // ==================================================================


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

            <Tabs 
              value={currentTab} 
              textColor="primary" 
              indicatorColor="primary"
            >
              <Tab label="Dashboard" value="/" to="/" component={Link} />
              <Tab label="Histórico" value="/historico" to="/historico" component={Link} />
              <Tab label="Planejador" value="/planejador" to="/planejador" component={Link} />
            </Tabs>
            
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

                {user?.isAnonymous && (
                  <MenuItem onClick={handleLink}>
                    Vincular Conta Google
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>
                  Sair
                </MenuItem>
              </Menu>
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

      <Container maxWidth="lg" component="main" sx={{ py: 3, flexGrow: 1 }}>
        <Outlet />
      </Container>

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

      <DisciplinaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

export default AppLayout;