import { Container, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 16, textAlign: 'center' }}>
      <Typography variant="overline" color="secondary.main">404</Typography>
      <Typography variant="h3" sx={{ mb: 2 }}>Page not found</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has moved.
      </Typography>
      <Stack direction="row" justifyContent="center">
        <Button component={RouterLink} to="/" variant="contained">Back to home</Button>
      </Stack>
    </Container>
  );
}
