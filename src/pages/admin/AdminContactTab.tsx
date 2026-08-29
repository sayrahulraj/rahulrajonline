import { useEffect, useState } from 'react';
import {
  Box, Grid, TextField, Button, Stack, Alert, CircularProgress, Typography, Divider, Paper,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useGetContactInfoQuery, useUpdateContactInfoMutation, useGetContactMessagesQuery } from '../../features/api/apiSlice';
import { formatFullDate } from '../../utils/date';

export default function AdminContactTab() {
  const { data: contact } = useGetContactInfoQuery();
  const [updateContactInfo, { isLoading: saving }] = useUpdateContactInfoMutation();
  const { data: messages } = useGetContactMessagesQuery();

  const [form, setForm] = useState({
    email: '', phone: '', location: '', map_lat: '', map_lng: '', github_url: '', linkedin_url: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
        map_lat: contact.map_lat?.toString() || '',
        map_lng: contact.map_lng?.toString() || '',
        github_url: contact.github_url || '',
        linkedin_url: contact.linkedin_url || '',
      });
    }
  }, [contact]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      await updateContactInfo({
        ...form,
        map_lat: form.map_lat ? Number(form.map_lat) : null,
        map_lng: form.map_lng ? Number(form.map_lng) : null,
      }).unwrap();
      setStatus({ type: 'success', text: 'Contact info updated.' });
    } catch {
      setStatus({ type: 'error', text: 'Could not save. Please try again.' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Contact details</Typography>
      {status && <Alert severity={status.type} sx={{ mb: 2 }} onClose={() => setStatus(null)}>{status.text}</Alert>}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}><TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth /></Grid>
        <Grid item xs={12}><TextField label="Location" value={form.location} onChange={handleChange('location')} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Map latitude" value={form.map_lat} onChange={handleChange('map_lat')} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="Map longitude" value={form.map_lng} onChange={handleChange('map_lng')} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="GitHub URL" value={form.github_url} onChange={handleChange('github_url')} fullWidth /></Grid>
        <Grid item xs={12} sm={6}><TextField label="LinkedIn URL" value={form.linkedin_url} onChange={handleChange('linkedin_url')} fullWidth /></Grid>
      </Grid>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
        onClick={handleSave}
        disabled={saving}
      >
        Save changes
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>Messages received</Typography>
      <Stack spacing={2}>
        {messages?.map((m) => (
          <Paper key={m.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
              <Typography variant="subtitle2">{m.name} · {m.email}</Typography>
              <Typography variant="caption" color="text.secondary">{formatFullDate(m.created_at)}</Typography>
            </Stack>
            <Typography variant="body2" color="secondary.main" sx={{ mt: 0.5, mb: 1 }}>{m.subject}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{m.message}</Typography>
          </Paper>
        ))}
        {!messages?.length && <Typography color="text.secondary">No messages yet.</Typography>}
      </Stack>
    </Box>
  );
}
