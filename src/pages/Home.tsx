import { Box, Container, Grid, Typography, Button, Stack, IconButton, Tooltip, Skeleton, Chip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ForumIcon from '@mui/icons-material/Forum';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';
import { useGetHomeQuery, useGetSettingsQuery } from '../features/api/apiSlice';
import TerminalSkillRotator from '../components/home/TerminalSkillRotator';

export default function Home() {
  const { data: home, isLoading } = useGetHomeQuery();
  const { data: settings } = useGetSettingsQuery();

  const resumeUrl = settings?.resume_pdf_url || home?.resume_url || '';

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: (t) => `radial-gradient(circle, ${t.palette.secondary.main}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            {isLoading ? (
              <Stack spacing={2}>
                <Skeleton width={140} height={28} />
                <Skeleton width="80%" height={64} />
                <Skeleton width="60%" height={32} />
                <Skeleton width="100%" height={90} />
              </Stack>
            ) : (
              <>
                <Typography variant="overline" color="secondary.main">
                  {home?.greeting || 'Hi, I\'m'} 👋
                </Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, mb: 1.5 }}>
                  {home?.full_name || 'Rahul Raj'}
                </Typography>
                <Typography variant="h5" color="primary.main" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {home?.role_title || 'Enterprise Java Developer & AI-Augmented Engineering Enthusiast'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {home?.interest_line}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 560 }}>
                  {home?.summary}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={resumeUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!resumeUrl}
                  >
                    Download Resume
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    startIcon={<ForumIcon />}
                    component={RouterLink}
                    to="/contact"
                  >
                    Contact Me
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <Tooltip title="GitHub">
                    <IconButton
                      component="a"
                      href={home?.github_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="LinkedIn">
                    <IconButton
                      component="a"
                      href={home?.linkedin_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton
                      component="a"
                      href={home?.email ? `mailto:${home.email}` : undefined}
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TerminalSkillRotator skills={home?.rotating_skills || []} />
          </Grid>
        </Grid>

        {!isLoading && !!home?.rotating_skills?.length && (
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 8 }}>
            {home.rotating_skills.map((s) => (
              <Chip key={s} label={s} variant="outlined" size="small" />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
