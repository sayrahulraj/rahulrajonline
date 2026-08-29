import {
  Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Chip, Stack, Button, Skeleton, Box,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SectionHeading from '../components/common/SectionHeading';
import { useGetProjectsQuery } from '../features/api/apiSlice';

export default function Projects() {
  const { data, isLoading } = useGetProjectsQuery();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading eyebrow="selected work" title="Projects" subtitle="A few builds worth showing the code for." />

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={320} />
              </Grid>
            ))
          : data?.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: 'secondary.main' },
                  }}
                >
                  {p.photo_url ? (
                    <CardMedia component="img" image={p.photo_url} alt={p.name} sx={{ height: 180, objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ height: 180, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>no preview</Typography>
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {p.description}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.75}>
                      {p.tech_stack?.map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<GitHubIcon />}
                      component="a"
                      href={p.code_url || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      disabled={!p.code_url}
                    >
                      View code
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
      </Grid>

      {!isLoading && !data?.length && (
        <Typography color="text.secondary">Projects will appear here once added from the admin dashboard.</Typography>
      )}
    </Container>
  );
}
