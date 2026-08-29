import { useMemo, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Stack, TextField, Button, Box, Alert, Snackbar,
  CircularProgress, Link as MLink,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';
import SectionHeading from '../components/common/SectionHeading';
import { useGetContactInfoQuery, useSendContactMessageMutation } from '../features/api/apiSlice';
import { sendViaEmailJs } from '../utils/emailjs';

const MIN_WORDS = 200;

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { data: contact } = useGetContactInfoQuery();
  const [logMessage] = useSendContactMessageMutation();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; severity: 'success' | 'error'; text: string }>({
    open: false, severity: 'success', text: '',
  });

  const wordCount = useMemo(
    () => form.message.trim().split(/\s+/).filter(Boolean).length,
    [form.message],
  );

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.subject.trim().length < 3) next.subject = 'Subject should be at least 3 characters.';
    if (wordCount < MIN_WORDS) next.message = `Message must be at least ${MIN_WORDS} words (currently ${wordCount}).`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await sendViaEmailJs(form);
      // best-effort durable log; don't block the success message on this
      logMessage(form).catch(() => undefined);
      setSnackbar({ open: true, severity: 'success', text: 'Message sent! I\'ll get back to you soon.' });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setSnackbar({
        open: true,
        severity: 'error',
        text: err instanceof Error ? err.message : 'Could not send the message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mapSrc = contact?.map_lat && contact?.map_lng
    ? `https://maps.google.com/maps?q=${contact.map_lat},${contact.map_lng}&z=13&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(contact?.location || 'Hyderabad, India')}&z=11&output=embed`;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <SectionHeading eyebrow="get in touch" title="Contact" subtitle="Have a role, a project, or just want to talk systems? Reach out." />

      <Grid container spacing={5}>
        <Grid item xs={12} md={5}>
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EmailIcon color="secondary" />
              <MLink href={`mailto:${contact?.email || ''}`} underline="hover" color="text.primary">
                {contact?.email || 'you@example.com'}
              </MLink>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PhoneIcon color="secondary" />
              <Typography>{contact?.phone || '+91 90000 00000'}</Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LocationOnIcon color="secondary" />
              <Typography>{contact?.location || 'Hyderabad, India'}</Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <GitHubIcon color="secondary" />
              <MLink href={contact?.github_url || undefined} target="_blank" rel="noopener noreferrer" underline="hover" color="text.primary">
                GitHub profile
              </MLink>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LinkedInIcon color="secondary" />
              <MLink href={contact?.linkedin_url || undefined} target="_blank" rel="noopener noreferrer" underline="hover" color="text.primary">
                LinkedIn profile
              </MLink>
            </Stack>
          </Stack>

          <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', height: 260 }}>
            <iframe
              title="location map"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                />
                <TextField
                  label="Subject"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  fullWidth
                  required
                />
                <TextField
                  label="Message"
                  value={form.message}
                  onChange={handleChange('message')}
                  error={!!errors.message}
                  helperText={errors.message || `${wordCount} / ${MIN_WORDS} words minimum`}
                  fullWidth
                  required
                  multiline
                  minRows={8}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                  disabled={submitting}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}
