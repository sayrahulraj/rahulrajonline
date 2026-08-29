import { useState } from 'react';
import { Box, Stack, Typography, Button, Paper, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetExperienceQuery,
  useAddExperienceCompanyMutation, useUpdateExperienceCompanyMutation, useDeleteExperienceCompanyMutation,
  useAddExperienceProjectMutation, useUpdateExperienceProjectMutation, useDeleteExperienceProjectMutation,
} from '../../features/api/apiSlice';
import EntityDialog, { type FieldConfig } from '../../components/admin/EntityDialog';
import AdminListRow from '../../components/admin/AdminListRow';
import { formatDateRange } from '../../utils/date';

const COMPANY_FIELDS: FieldConfig[] = [
  { name: 'company_name', label: 'Company name', required: true },
  { name: 'role', label: 'Role', required: true },
  { name: 'start_date', label: 'Start date', type: 'date', required: true },
  { name: 'end_date', label: 'End date (leave blank if current)', type: 'date' },
  { name: 'domain', label: 'Domain (e.g. Banking / Payments)' },
  { name: 'description', label: 'Overall description', type: 'multiline' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

const PROJECT_FIELDS: FieldConfig[] = [
  { name: 'project_name', label: 'Project name', required: true },
  { name: 'responsibilities', label: 'Responsibilities (one per line)', type: 'multiline' },
  { name: 'achievements', label: 'Achievements (one per line)', type: 'multiline' },
  { name: 'tech_stack', label: 'Tech stack (comma separated)', type: 'tags' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

export default function AdminExperienceTab() {
  const { data } = useGetExperienceQuery();
  const [addCompany] = useAddExperienceCompanyMutation();
  const [updateCompany] = useUpdateExperienceCompanyMutation();
  const [deleteCompany] = useDeleteExperienceCompanyMutation();
  const [addProject] = useAddExperienceProjectMutation();
  const [updateProject] = useUpdateExperienceProjectMutation();
  const [deleteProject] = useDeleteExperienceProjectMutation();

  const [companyDialog, setCompanyDialog] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });
  const [projectDialog, setProjectDialog] = useState<{ open: boolean; experienceId: number | null; editing: any | null }>({
    open: false, experienceId: null, editing: null,
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Companies</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setCompanyDialog({ open: true, editing: null })}>
          Add company
        </Button>
      </Stack>

      <Stack spacing={3}>
        {data?.map((exp) => (
          <Paper key={exp.id} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <AdminListRow
              title={`${exp.company_name} — ${exp.role}`}
              subtitle={exp.domain || undefined}
              meta={formatDateRange(exp.start_date, exp.end_date)}
              onEdit={() => setCompanyDialog({ open: true, editing: exp })}
              onDelete={() => deleteCompany(exp.id)}
            />

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">Projects at {exp.company_name}</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setProjectDialog({ open: true, experienceId: exp.id, editing: null })}
              >
                Add project
              </Button>
            </Stack>

            <Stack spacing={1.5}>
              {exp.projects.map((proj) => (
                <AdminListRow
                  key={proj.id}
                  title={proj.project_name}
                  tags={proj.tech_stack}
                  onEdit={() => setProjectDialog({ open: true, experienceId: exp.id, editing: proj })}
                  onDelete={() => deleteProject(proj.id)}
                />
              ))}
              {!exp.projects.length && (
                <Typography variant="body2" color="text.secondary">No projects added for this company yet.</Typography>
              )}
            </Stack>
          </Paper>
        ))}
        {!data?.length && <Typography color="text.secondary">No experience entries yet.</Typography>}
      </Stack>

      <EntityDialog
        open={companyDialog.open}
        title={companyDialog.editing ? 'Edit company' : 'Add company'}
        fields={COMPANY_FIELDS}
        initialValues={companyDialog.editing || {}}
        onClose={() => setCompanyDialog({ open: false, editing: null })}
        onSubmit={async (values) => {
          if (companyDialog.editing) await updateCompany({ id: companyDialog.editing.id, ...values });
          else await addCompany(values as any);
          setCompanyDialog({ open: false, editing: null });
        }}
      />

      <EntityDialog
        open={projectDialog.open}
        title={projectDialog.editing ? 'Edit project' : 'Add project'}
        fields={PROJECT_FIELDS}
        initialValues={projectDialog.editing || {}}
        onClose={() => setProjectDialog({ open: false, experienceId: null, editing: null })}
        onSubmit={async (values) => {
          if (projectDialog.editing) {
            await updateProject({ id: projectDialog.editing.id, ...values });
          } else if (projectDialog.experienceId) {
            await addProject({ experience_id: projectDialog.experienceId, ...values } as any);
          }
          setProjectDialog({ open: false, experienceId: null, editing: null });
        }}
      />
    </Box>
  );
}
