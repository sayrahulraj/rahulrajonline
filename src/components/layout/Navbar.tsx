import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItemButton,
  ListItemText, Typography, useScrollTrigger, Slide, Tooltip, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TerminalIcon from '@mui/icons-material/Terminal';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleMode } from '../../features/ui/uiSlice';
import { signOut } from '../../features/auth/authSlice';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Experience', to: '/experience' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificate', to: '/certifications' },
  { label: 'Contact', to: '/contact' },
];

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mode = useAppSelector((s) => s.ui.mode);
  const { token, username } = useAppSelector((s) => s.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSignOut = () => {
    setAnchorEl(null);
    dispatch(signOut());
    navigate('/');
  };

  return (
    <>
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(11,14,20,0.82)' : 'rgba(244,246,249,0.85)'),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%', gap: 1 }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <TerminalIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                rahul<Box component="span" sx={{ color: 'secondary.main' }}>.raj</Box>
              </Typography>
            </Box>
          </NavLink>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.to === '/'}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9rem',
                  '&.active': { color: 'primary.main' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton onClick={() => dispatch(toggleMode())} color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {token ? (
              <>
                <Tooltip title={username || 'Admin'}>
                  <Avatar
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: '#0B0E14', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    {username?.[0]?.toUpperCase() || 'A'}
                  </Avatar>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }}>Admin dashboard</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={NavLink} to="/signin" variant="outlined" color="secondary" size="small">
                Sign in
              </Button>
            )}

            <Button component={NavLink} to="/contact" variant="contained" color="primary" size="small">
              Let&apos;s Talk
            </Button>
          </Box>

          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }} onClick={() => setDrawerOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </HideOnScroll>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation">
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.to} component={NavLink} to={link.to} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => { dispatch(toggleMode()); }}>
              <ListItemText primary={mode === 'dark' ? 'Light mode' : 'Dark mode'} />
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </ListItemButton>
            {token ? (
              <>
                <ListItemButton component={NavLink} to="/admin" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Admin dashboard" />
                </ListItemButton>
                <ListItemButton onClick={() => { setDrawerOpen(false); handleSignOut(); }}>
                  <ListItemText primary="Sign out" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton component={NavLink} to="/signin" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Sign in" />
              </ListItemButton>
            )}
            <Box sx={{ p: 2 }}>
              <Button fullWidth component={NavLink} to="/contact" variant="contained" onClick={() => setDrawerOpen(false)}>
                Let&apos;s Talk
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
