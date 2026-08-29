import { useState } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetCertificationsQuery, useAddCertificationMutation, useUpdateCertificationMutation, useDeleteCertificationMutation,
} from '../../features/api/apiSlice';
import EntityDialog, { type FieldConfig } from '../../components/admin/EntityDialog';
import AdminListRow from '../../components/admin/AdminListRow';
import { formatFullDate } from '../../utils/date';

const CERT_FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Certificate name', required: true },
  { name: 'issuer', label: 'Issuer', required: true },
  { name: 'image_url', label: 'Certificate image URL (Cloudflare)' },
  { name: 'completion_date', label: 'Completion date', type: 'date', required: true },
  { name: 'expiry_date', label: 'Expiry date (leave blank if none)', type: 'date' },
  { name: 'certificate_url', label: 'Certificate URL' },
  { name: 'sort_order', label: 'Sort order', type: 'number' },
];

export default function AdminCertificationsTab() {
  const { data } = useGetCertificationsQuery();
  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();
  const [deleteCertification] = useDeleteCertificationMutation();
  const [dialog, setDialog] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Certifications</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setDialog({ open: true, editing: null })}>
          Add certification
        </Button>
      </Stack>

      <Stack spacing={2}>
        {data?.map((c) => (
          <AdminListRow
            key={c.id}
            title={c.name}
            subtitle={c.issuer}
            meta={c.expiry_date ? `Completed ${formatFullDate(c.completion_date)} — Expires ${formatFullDate(c.expiry_date)}` : `Completed ${formatFullDate(c.completion_date)}`}
            onEdit={() => setDialog({ open: true, editing: c })}
            onDelete={() => deleteCertification(c.id)}
          />
        ))}
        {!data?.length && <Typography color="text.secondary">No certifications yet.</Typography>}
      </Stack>

      <EntityDialog
        open={dialog.open}
        title={dialog.editing ? 'Edit certification' : 'Add certification'}
        fields={CERT_FIELDS}
        initialValues={dialog.editing || {}}
        onClose={() => setDialog({ open: false, editing: null })}
        onSubmit={async (values) => {
          if (dialog.editing) await updateCertification({ id: dialog.editing.id, ...values });
          else await addCertification(values as any);
          setDialog({ open: false, editing: null });
        }}
      />
    </Box>
  );
}
