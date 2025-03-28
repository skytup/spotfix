import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  color: theme.palette.text.primary,
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

function Header({ user, onProfileClick, onLogout }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
        >
          SpotFix
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => {
                    handleClose();
                    navigate(item.path);
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              {user ? (
                <>
                  <MenuItem onClick={() => {
                    handleClose();
                    onProfileClick();
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/login');
                  }}>
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate('/register');
                  }}>
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <NavButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  padding: { xs: '4px 8px', sm: '6px 12px' },
                }}
              >
                {item.label}
              </NavButton>
            ))}
            {user ? (
              <>
                <IconButton
                  onClick={onProfileClick}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <AccountCircle />
                </IconButton>
                <NavButton
                  onClick={handleLogout}
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    padding: { xs: '4px 8px', sm: '6px 12px' },
                  }}
                >
                  Logout
                </NavButton>
              </>
          ) : (
            <>
                <NavButton
                  component={RouterLink}
                  to="/login"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    padding: { xs: '4px 8px', sm: '6px 12px' },
                  }}
                >
                  Login
                </NavButton>
                <NavButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    padding: { xs: '4px 8px', sm: '6px 12px' },
                  }}
                >
                  Sign Up
                </NavButton>
            </>
          )}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;