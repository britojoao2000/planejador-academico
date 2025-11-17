import React from 'react';
import { Button, Container, Paper, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  // Pegamos as funções do nosso hook (que vamos atualizar no próximo passo)
  const { signInWithGoogle, signInAnonymously } = useAuth();

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Planejador Acadêmico
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Escolha como deseja acessar:
        </Typography>

        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{ mb: 2 }}
        >
          Entrar com Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<PersonIcon />}
          onClick={signInAnonymously}
        >
          Continuar como Visitante
        </Button>

        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3 }}>
          (Se você for visitante, poderá vincular sua conta Google depois para salvar seu progresso.)
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;