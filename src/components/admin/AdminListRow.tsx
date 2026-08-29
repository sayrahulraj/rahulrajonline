import { Paper, Stack, Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  title: string;
  subtitle?: string;
  meta?: string;
  tags?: string[];
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export default function AdminListRow({ title, subtitle, meta, tags, onEdit, onDelete, children }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          {meta && (
            <Typography variant="caption" color="secondary.main" sx={{ fontFamily: 'monospace', display: 'block', mt: 0.5 }}>
              {meta}
            </Typography>
          )}
          {!!tags?.length && (
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
              {tags.map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
            </Stack>
          )}
          {children}
        </Box>
        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit}><EditIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
