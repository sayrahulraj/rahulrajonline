import {
  Container, Grid, Card, CardContent, CardActions, Typography, Button, Skeleton, Box, Chip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import SectionHeading from '../components/common/SectionHeading';
import { useGetCertificationsQuery } from '../features/api/apiSlice';
import { formatFullDate } from '../utils/date';

export default function Certifications() {
  const { data, isLoading } = useGetCertificationsQuery();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading eyebrow="credentials" title="Certifications" subtitle="Industry certifications that back up the expertise." />

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={280} />
              </Grid>
            ))
          : data?.map((cert) => {
              const isExpired = cert.expiry_date ? new Date(cert.expiry_date) < new Date() : false;
              return (
                <Grid item xs={12} sm={6} md={4} key={cert.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
                    {cert.image_url ? (
  <Box
    sx={{
      height: 160,
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      overflow: 'hidden',
    }}
  >
    <Box
      component="img"
      src={cert.image_url}
      alt={cert.name}
      sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
    />
  </Box>
) : (
                      <Box sx={{ height: 160, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VerifiedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{cert.name}</Typography>
                      <Typography variant="body2" color="secondary.main" sx={{ mb: 1.5 }}>{cert.issuer}</Typography>
                      {cert.expiry_date ? (
                        <Chip
                          size="small"
                          label={isExpired ? `Expired ${formatFullDate(cert.expiry_date)}` : `Valid till ${formatFullDate(cert.expiry_date)}`}
                          color={isExpired ? 'default' : 'success'}
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          Completed {formatFullDate(cert.completion_date)}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        endIcon={<OpenInNewIcon />}
                        component="a"
                        href={cert.certificate_url || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!cert.certificate_url}
                      >
                        View certificate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {!isLoading && !data?.length && (
        <Typography color="text.secondary">Certifications will appear here once added from the admin dashboard.</Typography>
      )}
    </Container>
  );
}
