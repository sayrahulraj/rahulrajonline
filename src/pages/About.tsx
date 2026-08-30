import { Box, Container, Grid, Typography, Paper, Stack, Skeleton } from '@mui/material';
import { useGetAboutQuery, useGetProjectsQuery, useGetCertificationsQuery } from '../features/api/apiSlice';

function StatTile({ value, label, color }: { value: string; label: string; color: 'primary.main' | 'secondary.main' }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
}

export default function About() {
  const { data, isLoading } = useGetAboutQuery();
  const { data: projects } = useGetProjectsQuery();
  const { data: certifications } = useGetCertificationsQuery();

  const stats: Array<{ value: string; label: string; color: 'primary.main' | 'secondary.main' }> = [
    { value: data?.about?.years_experience || '—', label: 'Years of Experience', color: 'secondary.main' },
    { value: projects ? String(projects.length) : '—', label: 'Personal Projects Completed', color: 'primary.main' },
    { value: certifications ? String(certifications.length) : '—', label: 'Certifications', color: 'primary.main' },
    { value: data?.about?.technologies_count || '—', label: 'Technologies', color: 'primary.main' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
        <Typography variant="overline" color="secondary.main" sx={{ display: 'block', mb: 1 }}>
          // about me
        </Typography>
        <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
          Passion for{' '}
          <Box component="span" sx={{ color: 'secondary.main' }}>software</Box>
          <br />
          <Box component="span" sx={{ color: 'primary.main' }}>engineering</Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 560, mx: 'auto' }}>
          A quick look at who I am and the journey that shaped my craft.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 6, md: 8 }}>
        <Grid item xs={12} md={6}>
          {isLoading ? (
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Skeleton height={22} />
              <Skeleton height={22} />
              <Skeleton height={22} width="80%" />
              <Skeleton height={22} />
              <Skeleton height={22} width="60%" />
            </Stack>
          ) : (
            <>
              {data?.about?.passion_text && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.9 }}>
                  {data.about.passion_text}
                </Typography>
              )}
              {data?.about?.journey_text && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, whiteSpace: 'pre-line', lineHeight: 1.9 }}>
                  {data.about.journey_text}
                </Typography>
              )}
            </>
          )}

          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid item xs={6} key={s.label}>
                {isLoading ? (
                  <Skeleton variant="rounded" height={104} />
                ) : (
                  <StatTile {...s} />
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          {isLoading ? (
            <Stack spacing={4}>
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} variant="rounded" height={90} />
              ))}
            </Stack>
          ) : !data?.achievements?.length ? null : (
            <Box sx={{ position: 'relative', pl: 4 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 7,
                  top: 6,
                  bottom: 6,
                  width: '2px',
                  bgcolor: 'divider',
                }}
              />
              <Stack spacing={4}>
                {data.achievements.map((a) => {
                  const isCurrent = a.year?.toLowerCase().includes('present') ?? false;
                  return (
                    <Box key={a.id} sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: -32,
                          top: 4,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: 'background.default',
                          border: '2px solid',
                          borderColor: isCurrent ? 'secondary.main' : 'primary.main',
                        }}
                      />
                      {a.year && (
                        <Typography
                          variant="overline"
                          sx={{ display: 'block', fontWeight: 700, color: isCurrent ? 'secondary.main' : 'primary.main' }}
                        >
                          {a.year}
                        </Typography>
                      )}
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {a.title}
                      </Typography>
                      {a.description && (
                        <Typography variant="body2" color="text.secondary">
                          {a.description}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
