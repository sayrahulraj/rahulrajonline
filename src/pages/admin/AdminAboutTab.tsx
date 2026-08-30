import { useEffect, useState } from 'react';
import { Box, TextField, Button, Stack, Alert, CircularProgress, Typography, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetAboutQuery, useUpdateAboutMutation,
  useAddAchievementMutation, useUpdateAchievementMutation, useDeleteAchievementMutation,
} from '../../features/api/apiSlice';
import EntityDialog, { type FieldConfig } from '../../components/admin/EntityDialog';
import AdminListRow from '../../components/admin/AdminListRow';

const ACHIEVEMENT_FIELDS: FieldConfig[] = [
  { name: 'title', label: 'Title', required: true },
  { name: 'year', label: 'Year (e.g. 2023)' },
  { name: 'description', label: 'Description', type: 'multiline' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

export default function AdminAboutTab() {
  const { data } = useGetAboutQuery();
  const [updateAbout, { isLoading: saving }] = useUpdateAboutMutation();
  const [addAchievement] = useAddAchievementMutation();
  const [updateAchievement] = useUpdateAchievementMutation();
  const [deleteAchievement] = useDeleteAchievementMutation();

  const [form, setForm] = useState({ passion_title: '', passion_text: '', journey_text: '', years_experience: '', technologies_count: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });

  useEffect(() => {
    if (data?.about) {
      setForm({
        passion_title: data.about.passion_title || '',
        passion_text: data.about.passion_text || '',
        journey_text: data.about.journey_text || '',
        years_experience: data.about.years_experience || '',
        technologies_count: data.about.technologies_count || '',
      });
    }
  }, [data]);

  const handleSaveAbout = async () => {
    setStatus(null);
    try {
      await updateAbout(form).unwrap();
      setStatus({ type: 'success', text: 'About page updated.' });
    } catch {
      setStatus({ type: 'error', text: 'Could not save. Please try again.' });
    }
  };

  const handleDialogSubmit = async (values: Record<string, any>) => {
    if (dialog.editing) {
      await updateAchievement({ id: dialog.editing.id, ...values });
    } else {
      await addAchievement(values);
    }
    setDialog({ open: false, editing: null });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Passion & journey</Typography>
      {status && <Alert severity={status.type} sx={{ mb: 2 }} onClose={() => setStatus(null)}>{status.text}</Alert>}
      <Stack spacing={2.5} sx={{ mb: 3 }}>
        <TextField
          label="Passion title"
          value={form.passion_title}
          onChange={(e) => setForm((f) => ({ ...f, passion_title: e.target.value }))}
          fullWidth
        />
        <TextField
          label="Passion text"
          value={form.passion_text}
          onChange={(e) => setForm((f) => ({ ...f, passion_text: e.target.value }))}
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="Professional journey"
          value={form.journey_text}
          onChange={(e) => setForm((f) => ({ ...f, journey_text: e.target.value }))}
          fullWidth
          multiline
          minRows={6}
          helperText="Use line breaks freely — they're preserved on the About page."
        />
        <Stack direction="row" spacing={2.5}>
          <TextField
            label="Years of experience"
            value={form.years_experience}
            onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
            helperText='Shown as a stat tile, e.g. "5+"'
            fullWidth
          />
          <TextField
            label="Technologies"
            value={form.technologies_count}
            onChange={(e) => setForm((f) => ({ ...f, technologies_count: e.target.value }))}
            helperText='Shown as a stat tile, e.g. "3+"'
            fullWidth
          />
        </Stack>
      </Stack>
      <Button
        variant="contained"
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
        onClick={handleSaveAbout}
        disabled={saving}
      >
        Save changes
      </Button>

      <Divider sx={{ my: 4 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Achievements</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setDialog({ open: true, editing: null })}>
          Add achievement
        </Button>
      </Stack>

      <Stack spacing={2}>
        {data?.achievements.map((a) => (
          <AdminListRow
            key={a.id}
            title={a.title}
            subtitle={a.description || undefined}
            meta={a.year || undefined}
            onEdit={() => setDialog({ open: true, editing: a })}
            onDelete={() => deleteAchievement(a.id)}
          />
        ))}
        {!data?.achievements.length && (
          <Typography color="text.secondary">No achievements added yet.</Typography>
        )}
      </Stack>

      <EntityDialog
        open={dialog.open}
        title={dialog.editing ? 'Edit achievement' : 'Add achievement'}
        fields={ACHIEVEMENT_FIELDS}
        initialValues={dialog.editing || {}}
        onClose={() => setDialog({ open: false, editing: null })}
        onSubmit={handleDialogSubmit}
      />
    </Box>
  );
}
