import { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography, Stack, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signOut } from '../../features/auth/authSlice';
import AdminHomeTab from './AdminHomeTab';
import AdminAboutTab from './AdminAboutTab';
import AdminSkillsTab from './AdminSkillsTab';
import AdminExperienceTab from './AdminExperienceTab';
import AdminProjectsTab from './AdminProjectsTab';
import AdminCertificationsTab from './AdminCertificationsTab';
import AdminContactTab from './AdminContactTab';

const TABS = [
  { label: 'Home', component: AdminHomeTab },
  { label: 'About', component: AdminAboutTab },
  { label: 'Skills', component: AdminSkillsTab },
  { label: 'Experience', component: AdminExperienceTab },
  { label: 'Projects', component: AdminProjectsTab },
  { label: 'Certifications', component: AdminCertificationsTab },
  { label: 'Contact', component: AdminContactTab },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useAppSelector((s) => s.auth.username);
  const ActiveTab = TABS[tab].component;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Admin dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Signed in as {username}</Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={() => { dispatch(signOut()); navigate('/'); }}
        >
          Sign out
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 1 }}
        >
          {TABS.map((t) => <Tab key={t.label} label={t.label} />)}
        </Tabs>
        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          <ActiveTab />
        </Box>
      </Paper>
    </Container>
  );
}
