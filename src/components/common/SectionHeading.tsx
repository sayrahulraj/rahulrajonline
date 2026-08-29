import { Box, Typography } from '@mui/material';

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: Props) {
  return (
    <Box sx={{ mb: 6, textAlign: align }}>
      <Typography
        variant="overline"
        color="secondary.main"
        sx={{ display: 'block', mb: 1 }}
      >
        // {eyebrow}
      </Typography>
      <Typography variant="h3" sx={{ mb: subtitle ? 1.5 : 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: align === 'center' ? 'auto' : 0 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
