import { createTheme } from '@mui/material/styles';
import { green, yellow } from '@mui/material/colors';

// Tema customizado com verde e amarelo
export const appTheme = createTheme({
  palette: {
    primary: {
      main: green[600], // Verde
    },
    secondary: {
      main: yellow[700], // Amarelo
    },
    background: {
      default: '#f4f4f4' // Um cinza claro para o fundo
    }
  },
  components: {
    // Garante que o AppBar tenha um fundo branco
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000'
        }
      }
    }
  }
});