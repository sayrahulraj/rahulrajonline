import { useState } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGetProjectsQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from '../../features/api/apiSlice';
import EntityDialog, { type FieldConfig } from '../../components/admin/EntityDialog';
import AdminListRow from '../../components/admin/AdminListRow';

const PROJECT_FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Project name', required: true },
  { name: 'photo_url', label: 'Photo URL (Cloudflare)', helperText: 'Upload a screenshot to Cloudflare and paste the public URL' },
  { name: 'description', label: 'Description', type: 'multiline' },
  { name: 'tech_stack', label: 'Tech stack (comma separated)', type: 'tags' },
  { name: 'code_url', label: 'GitHub code URL' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

export default function AdminProjectsTab() {
  const { data } = useGetProjectsQuery();
  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [dialog, setDialog] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Projects</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setDialog({ open: true, editing: null })}>
          Add project
        </Button>
      </Stack>

      <Stack spacing={2}>
        {data?.map((p) => (
          <AdminListRow
            key={p.id}
            title={p.name}
            subtitle={p.description || undefined}
            tags={p.tech_stack}
            onEdit={() => setDialog({ open: true, editing: p })}
            onDelete={() => deleteProject(p.id)}
          />
        ))}
        {!data?.length && <Typography color="text.secondary">No projects yet.</Typography>}
      </Stack>

      <EntityDialog
        open={dialog.open}
        title={dialog.editing ? 'Edit project' : 'Add project'}
        fields={PROJECT_FIELDS}
        initialValues={dialog.editing || {}}
        onClose={() => setDialog({ open: false, editing: null })}
        onSubmit={async (values) => {
          if (dialog.editing) await updateProject({ id: dialog.editing.id, ...values });
          else await addProject(values as any);
          setDialog({ open: false, editing: null });
        }}
      />
    </Box>
  );
}
