import { useState } from 'react';
import { Box, Stack, Typography, Button, Chip, Paper, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetSkillsQuery, useAddSkillCategoryMutation, useUpdateSkillCategoryMutation, useDeleteSkillCategoryMutation,
  useAddSkillMutation, useUpdateSkillMutation, useDeleteSkillMutation,
} from '../../features/api/apiSlice';
import EntityDialog, { type FieldConfig } from '../../components/admin/EntityDialog';

const CATEGORY_FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Category name', required: true, helperText: 'e.g. Language & Framework' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

export default function AdminSkillsTab() {
  const { data } = useGetSkillsQuery();
  const [addCategory] = useAddSkillCategoryMutation();
  const [updateCategory] = useUpdateSkillCategoryMutation();
  const [deleteCategory] = useDeleteSkillCategoryMutation();
  const [addSkill] = useAddSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  const [categoryDialog, setCategoryDialog] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });
  const [skillDialog, setSkillDialog] = useState<{ open: boolean; categoryId: number | null; editing: any | null }>({
    open: false, categoryId: null, editing: null,
  });

  const SKILL_FIELDS: FieldConfig[] = [
    { name: 'name', label: 'Skill name', required: true },
    { name: 'proficiency', label: 'Proficiency (0-100)', type: 'number' },
    { name: 'sort_order', label: 'Sort order', type: 'number' },
  ]; // category_id is attached separately when submitting

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Skill categories</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setCategoryDialog({ open: true, editing: null })}>
          Add category
        </Button>
      </Stack>

      <Stack spacing={2.5}>
        {data?.map((cat) => (
          <Paper key={cat.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'monospace' }}>{cat.name}</Typography>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Add skill to this category">
                  <IconButton size="small" onClick={() => setSkillDialog({ open: true, categoryId: cat.id, editing: null })}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit category">
                  <IconButton size="small" onClick={() => setCategoryDialog({ open: true, editing: cat })}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete category">
                  <IconButton size="small" color="error" onClick={() => deleteCategory(cat.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {cat.skills.map((s) => (
                <Chip
                  key={s.id}
                  label={s.name}
                  variant="outlined"
                  onDelete={() => deleteSkill(s.id)}
                  onClick={() => setSkillDialog({ open: true, categoryId: cat.id, editing: s })}
                />
              ))}
              {!cat.skills.length && (
                <Typography variant="body2" color="text.secondary">No skills yet — use the + above to add one.</Typography>
              )}
            </Stack>
          </Paper>
        ))}
        {!data?.length && <Typography color="text.secondary">No categories yet.</Typography>}
      </Stack>

      <EntityDialog
        open={categoryDialog.open}
        title={categoryDialog.editing ? 'Edit category' : 'Add category'}
        fields={CATEGORY_FIELDS}
        initialValues={categoryDialog.editing || {}}
        onClose={() => setCategoryDialog({ open: false, editing: null })}
        onSubmit={async (values) => {
          if (categoryDialog.editing) await updateCategory({ id: categoryDialog.editing.id, ...values });
          else await addCategory(values as any);
          setCategoryDialog({ open: false, editing: null });
        }}
      />

      <EntityDialog
        open={skillDialog.open}
        title={skillDialog.editing ? 'Edit skill' : 'Add skill'}
        fields={SKILL_FIELDS}
        initialValues={skillDialog.editing || { proficiency: 80 }}
        onClose={() => setSkillDialog({ open: false, categoryId: null, editing: null })}
        onSubmit={async (values) => {
          if (skillDialog.editing) {
            await updateSkill({ id: skillDialog.editing.id, ...values });
          } else if (skillDialog.categoryId) {
            await addSkill({ category_id: skillDialog.categoryId, ...values } as any);
          }
          setSkillDialog({ open: false, categoryId: null, editing: null });
        }}
      />
    </Box>
  );
}
