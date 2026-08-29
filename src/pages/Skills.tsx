import { Container, Grid, Paper, Typography, Chip, Stack, Box, Skeleton } from '@mui/material';
import SectionHeading from '../components/common/SectionHeading';
import { useGetSkillsQuery } from '../features/api/apiSlice';

export default function Skills() {
  const { data, isLoading } = useGetSkillsQuery();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading
        eyebrow="tech stack"
        title="Skills & Technologies"
        subtitle="The stack behind 5.5+ years of enterprise Java delivery, now extending into AI-augmented engineering."
      />

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={160} />
              </Grid>
            ))
          : data?.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)', borderColor: 'secondary.main' },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: 'monospace', color: 'secondary.main', mb: 2 }}
                  >
                    // {cat.name}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {cat.skills.map((s) => (
                      <Chip key={s.id} label={s.name} size="small" variant="outlined" />
                    ))}
                    {!cat.skills.length && (
                      <Typography variant="body2" color="text.secondary">No skills added yet.</Typography>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            ))}
      </Grid>

      {!isLoading && !data?.length && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Skills will appear here once added from the admin dashboard.</Typography>
        </Box>
      )}
    </Container>
  );
}
