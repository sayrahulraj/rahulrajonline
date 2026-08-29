import {
  Container, Box, Typography, Paper, Chip, Stack, Skeleton, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import SectionHeading from '../components/common/SectionHeading';
import { useGetExperienceQuery } from '../features/api/apiSlice';
import { formatDateRange, toBulletList } from '../utils/date';

export default function Experience() {
  const { data, isLoading } = useGetExperienceQuery();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading eyebrow="career path" title="Experience" subtitle="Where the systems got bigger and the stakes got real." />

      {isLoading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((n) => <Skeleton key={n} variant="rounded" height={160} />)}
        </Stack>
      ) : (
        <Box sx={{ position: 'relative', pl: { xs: 3, md: 5 } }}>
          <Box sx={{ position: 'absolute', left: { xs: 7, md: 11 }, top: 8, bottom: 8, width: '2px', bgcolor: 'divider' }} />

          {data?.map((exp, idx) => (
            <Box key={exp.id} sx={{ position: 'relative', mb: 6 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: -25, md: -41 },
                  top: 6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'background.default',
                  border: '3px solid',
                  borderColor: idx === 0 ? 'secondary.main' : 'primary.main',
                }}
              />

              <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1} sx={{ mb: 1 }}>
                  <Typography variant="h5">{exp.company_name}</Typography>
                  <Chip
                    label={formatDateRange(exp.start_date, exp.end_date)}
                    size="small"
                    color={exp.end_date ? 'default' : 'success'}
                    variant={exp.end_date ? 'outlined' : 'filled'}
                    sx={{ fontFamily: 'monospace' }}
                  />
                </Stack>
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {exp.role}
                </Typography>
                {exp.domain && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    domain: {exp.domain}
                  </Typography>
                )}
                {exp.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {exp.description}
                  </Typography>
                )}

                {!!exp.projects?.length && (
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    {exp.projects.map((proj) => (
                      <Paper key={proj.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {proj.project_name}
                        </Typography>

                        {!!toBulletList(proj.responsibilities).length && (
                          <List dense disablePadding sx={{ mb: 1 }}>
                            {toBulletList(proj.responsibilities).map((line, i) => (
                              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <CheckCircleOutlineIcon fontSize="small" color="secondary" />
                                </ListItemIcon>
                                <ListItemText primary={line} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                              </ListItem>
                            ))}
                          </List>
                        )}

                        {!!toBulletList(proj.achievements).length && (
                          <List dense disablePadding sx={{ mb: 1 }}>
                            {toBulletList(proj.achievements).map((line, i) => (
                              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <EmojiEventsOutlinedIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={line} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                              </ListItem>
                            ))}
                          </List>
                        )}

                        {!!proj.tech_stack?.length && (
                          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
                            {proj.tech_stack.map((t) => (
                              <Chip key={t} label={t} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Box>
          ))}

          {!data?.length && (
            <Typography color="text.secondary">Experience entries will appear here once added from the admin dashboard.</Typography>
          )}
        </Box>
      )}
    </Container>
  );
}
