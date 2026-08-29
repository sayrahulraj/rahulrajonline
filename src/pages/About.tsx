import { Box, Container, Grid, Typography, Paper, Stack, Skeleton } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SectionHeading from '../components/common/SectionHeading';
import { useGetAboutQuery } from '../features/api/apiSlice';

export default function About() {
  const { data, isLoading } = useGetAboutQuery();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading eyebrow="about me" title="The craft, and what shaped it" />

      <Grid container spacing={5}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {isLoading ? <Skeleton width="70%" /> : data?.about?.passion_title || 'What shaped the craft'}
            </Typography>
            {isLoading ? (
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {data?.about?.passion_text}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="overline" color="secondary.main">professional journey</Typography>
          <Box sx={{ mt: 1.5 }}>
            {isLoading ? (
              <Stack spacing={1.5}>
                <Skeleton height={22} />
                <Skeleton height={22} />
                <Skeleton height={22} width="70%" />
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.9 }}>
                {data?.about?.journey_text}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {(isLoading || !!data?.achievements?.length) && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="overline" color="secondary.main">achievements</Typography>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {isLoading
              ? [1, 2, 3].map((n) => (
                  <Grid item xs={12} sm={6} md={4} key={n}>
                    <Skeleton variant="rounded" height={140} />
                  </Grid>
                ))
              : data?.achievements.map((a) => (
                  <Grid item xs={12} sm={6} md={4} key={a.id}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <EmojiEventsIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{a.title}</Typography>
                          {a.year && (
                            <Typography variant="caption" color="secondary.main" sx={{ fontFamily: 'monospace' }}>{a.year}</Typography>
                          )}
                          {a.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{a.description}</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
