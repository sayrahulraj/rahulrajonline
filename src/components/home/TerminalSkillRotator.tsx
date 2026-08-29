import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { keyframes } from '@mui/system';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const progressLoop = keyframes`
  0% { width: 6%; }
  40% { width: 78%; }
  70% { width: 46%; }
  100% { width: 96%; }
`;

const fadeSlide = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  10% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-6px); }
`;

interface Props {
  skills: string[];
}

const DEFAULT_SKILLS = ['Java 21', 'Spring Boot', 'Microservices', 'Kafka', 'LLM Orchestration', 'System Design'];

export default function TerminalSkillRotator({ skills }: Props) {
  const list = skills?.length ? skills : DEFAULT_SKILLS;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), 2600);
    return () => clearInterval(id);
  }, [list.length]);

  const current = list[index];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: (t) => (t.palette.mode === 'dark' ? '0 20px 60px rgba(0,0,0,0.45)' : '0 20px 60px rgba(16,19,26,0.12)'),
        width: '100%',
        maxWidth: 480,
      }}
    >
      {/* title bar */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 1.25, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E5626B' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#E3A857' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4FD1C5' }} />
        <Typography variant="caption" sx={{ fontFamily: 'monospace', ml: 1.5, color: 'text.secondary' }}>
          SkillSet.java
        </Typography>
      </Stack>

      {/* code body */}
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', p: 3, minHeight: 190, position: 'relative' }}>
        <Stack spacing={0.6}>
          <Typography component="div" sx={{ fontFamily: 'inherit', color: 'text.secondary' }}>
            <Box component="span" sx={{ color: 'secondary.main' }}>@Engineer</Box>(experience = <Box component="span" sx={{ color: 'primary.main' }}>"5.5+ years"</Box>)
          </Typography>
          <Typography component="div" sx={{ fontFamily: 'inherit' }}>
            <Box component="span" sx={{ color: '#c586c0' }}>public class</Box> RahulRaj {'{'}
          </Typography>
          <Box sx={{ pl: 3, position: 'relative', height: 28 }}>
            <Typography
              key={index}
              component="div"
              sx={{
                fontFamily: 'inherit',
                position: 'absolute',
                animation: `${fadeSlide} 2.6s ease-in-out`,
                whiteSpace: 'nowrap',
              }}
            >
              <Box component="span" sx={{ color: '#c586c0' }}>currentFocus</Box> ={' '}
              <Box component="span" sx={{ color: 'primary.main' }}>&quot;{current}&quot;</Box>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  bgcolor: 'secondary.main',
                  ml: '2px',
                  verticalAlign: 'text-bottom',
                  animation: `${blink} 1s step-end infinite`,
                }}
              />
            </Typography>
          </Box>
          <Typography component="div" sx={{ fontFamily: 'inherit' }}>{'}'}</Typography>
        </Stack>
      </Box>

      {/* status bar */}
      <Stack sx={{ px: 2, py: 1.25, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }} spacing={0.75}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'success.main' }}>
            ● compiling skills…
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
            build: stable
          </Typography>
        </Stack>
        <Box sx={{ height: 3, borderRadius: 2, bgcolor: 'divider', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              bgcolor: 'secondary.main',
              animation: `${progressLoop} 2.6s ease-in-out infinite`,
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}
