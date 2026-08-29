import { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Alert, Stack, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { signIn } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/api/apiSlice';

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login({ username, password }).unwrap();
      dispatch(signIn(result));
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.data?.error || 'Invalid username or password.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
            <LockOutlinedIcon color="secondary" />
          </Box>
          <Typography variant="h5">Admin Sign In</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Sign in to add, edit, or remove content on the site.
          </Typography>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
