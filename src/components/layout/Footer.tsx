import { Box, Container, Grid, Typography, Link as MLink, Stack, Divider, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link as RouterLink } from 'react-router-dom';
import { useGetHomeQuery } from '../../features/api/apiSlice';
import { useGetContactInfoQuery } from '../../features/api/apiSlice';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certification', to: '/certifications' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const { data: home } = useGetHomeQuery();
  const { data: contact } = useGetContactInfoQuery();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', mt: 10 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
              {home?.full_name || 'Rahul Raj'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 320 }}>
              {home?.role_title || 'Enterprise Java Developer & AI-Augmented Engineering Enthusiast'}
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="overline" color="secondary.main">Quick links</Typography>
            <Stack sx={{ mt: 1.5 }} spacing={0.75}>
              {QUICK_LINKS.map((l) => (
                <MLink key={l.to} component={RouterLink} to={l.to} underline="hover" color="text.secondary" variant="body2">
                  {l.label}
                </MLink>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="overline" color="secondary.main">Get in touch</Typography>
            <Stack sx={{ mt: 1.5 }} spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" color="action" />
                <MLink href={`mailto:${contact?.email || home?.email || ''}`} underline="hover" color="text.secondary" variant="body2">
                  {contact?.email || home?.email || 'you@example.com'}
                </MLink>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">{contact?.phone || '+91 90000 00000'}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">{contact?.location || 'Hyderabad, India'}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {home?.full_name || 'Rahul Raj'}. All rights reserved.
          </Typography>
          <Button
            size="small"
            endIcon={<KeyboardArrowUpIcon />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
