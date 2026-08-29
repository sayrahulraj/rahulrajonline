import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, CircularProgress,
} from '@mui/material';

export type FieldType = 'text' | 'number' | 'date' | 'multiline' | 'tags';

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  helperText?: string;
}

interface Props {
  open: boolean;
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => void;
}

/** Converts stored values (arrays, numbers) into editable strings for text inputs. */
function toEditable(fields: FieldConfig[], values: Record<string, any>) {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === 'tags') out[f.name] = Array.isArray(v) ? v.join(', ') : (v || '');
    else out[f.name] = v === null || v === undefined ? '' : String(v);
  }
  return out;
}

export default function EntityDialog({ open, title, fields, initialValues, submitting, onClose, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) setValues(toEditable(fields, initialValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
  };

  const handleSubmit = () => {
    const payload: Record<string, any> = {};
    for (const f of fields) {
      const raw = values[f.name] ?? '';
      if (f.type === 'tags') {
        payload[f.name] = raw.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (f.type === 'number') {
        payload[f.name] = raw === '' ? null : Number(raw);
      } else {
        payload[f.name] = raw === '' ? null : raw;
      }
    }
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
              value={values[f.name] ?? ''}
              onChange={handleChange(f.name)}
              required={f.required}
              multiline={f.type === 'multiline'}
              minRows={f.type === 'multiline' ? 4 : undefined}
              helperText={f.helperText}
              fullWidth
              InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
