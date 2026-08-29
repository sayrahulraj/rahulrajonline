import { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, Alert, CircularProgress, Typography, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import {
  useGetHomeQuery, useUpdateHomeMutation, useGetSettingsQuery, useUpdateSettingsMutation,
} from '../../features/api/apiSlice';

export default function AdminHomeTab() {
  const { data: home } = useGetHomeQuery();
  const { data: settings } = useGetSettingsQuery();
  const [updateHome, { isLoading: savingHome }] = useUpdateHomeMutation();
  const [updateSettings, { isLoading: savingSettings }] = useUpdateSettingsMutation();

  const [form, setForm] = useState({
    greeting: '', full_name: '', role_title: '', interest_line: '', summary: '',
    resume_url: '', github_url: '', linkedin_url: '', email: '', rotating_skills: '',
  });
  const [resumePdfUrl, setResumePdfUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (home) {
      setForm({
        greeting: home.greeting || '',
        full_name: home.full_name || '',
        role_title: home.role_title || '',
        interest_line: home.interest_line || '',
        summary: home.summary || '',
        resume_url: home.resume_url || '',
        github_url: home.github_url || '',
        linkedin_url: home.linkedin_url || '',
        email: home.email || '',
        rotating_skills: (home.rotating_skills || []).join(', '),
      });
    }
  }, [home]);

  useEffect(() => {
    setResumePdfUrl(settings?.resume_pdf_url || '');
  }, [settings]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      await updateHome({
        ...form,
        rotating_skills: form.rotating_skills.split(',').map((s) => s.trim()).filter(Boolean),
      }).unwrap();
      await updateSettings({ resume_pdf_url: resumePdfUrl }).unwrap();
      setStatus({ type: 'success', text: 'Home page updated.' });
    } catch {
      setStatus({ type: 'error', text: 'Could not save changes. Check your connection and try again.' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Hero introduction</Typography>
      {status && <Alert severity={status.type} sx={{ mb: 2 }} onClose={() => setStatus(null)}>{status.text}</Alert>}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField label="Greeting (e.g. Hi, I'm)" value={form.greeting} onChange={handleChange('greeting')} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Full name" value={form.full_name} onChange={handleChange('full_name')} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Role / title" value={form.role_title} onChange={handleChange('role_title')} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Interest line" value={form.interest_line} onChange={handleChange('interest_line')} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Short summary" value={form.summary} onChange={handleChange('summary')} fullWidth multiline minRows={3} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rotating skills (comma separated)"
            value={form.rotating_skills}
            onChange={handleChange('rotating_skills')}
            helperText="Shown cycling in the animated hero window, e.g. Java 21, Spring Boot, Kafka"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="GitHub URL" value={form.github_url} onChange={handleChange('github_url')} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="LinkedIn URL" value={form.linkedin_url} onChange={handleChange('linkedin_url')} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Resume URL (fallback)" value={form.resume_url} onChange={handleChange('resume_url')} fullWidth />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Resume PDF</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your resume PDF to Cloudflare (R2 or Pages) and paste the public URL here — it powers the
        "Download Resume" button on the home page.
      </Typography>
      <TextField
        label="Resume PDF URL (Cloudflare)"
        value={resumePdfUrl}
        onChange={(e) => setResumePdfUrl(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        startIcon={savingHome || savingSettings ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
        onClick={handleSave}
        disabled={savingHome || savingSettings}
      >
        Save changes
      </Button>
    </Box>
  );
}
