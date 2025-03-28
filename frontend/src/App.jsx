import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import IssueList from './components/IssueList';
import Gallery from './components/Gallery';
import ProfilePanel from './components/ProfilePanel';
import IssueForm from './components/IssueForm';
import Footer from './components/Footer';
import Description from './components/Description';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { auth } from './services/api';
import spotFixLogo from './assets/spot-fix.png';
import './styles/global.css';
import ProfileSettings from './components/ProfileSettings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00122e',
      dark: '#3367d6',
      light: '#5c90ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34a853',
      dark: '#2d8d47',
      light: '#5abe74',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ea4335',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRouteComponent = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = auth.getToken();
        if (token) {
          await auth.getProfile();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRouteComponent = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = auth.getToken();
        if (token) {
          await auth.getProfile();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showIssueForm, setShowIssueForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = auth.getToken();
        if (token) {
          const userData = await auth.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    const response = await auth.login(credentials);
    setUser(response.user);
    return response;
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
  };

  const handleMapClick = (location) => {
    if (!user) {
      return;
    }
    setSelectedLocation(location);
    setShowIssueForm(true);
  };

  const handleIssueFormClose = () => {
    setShowIssueForm(false);
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header 
            user={user}
            onProfileClick={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Box 
                    component="main" 
                    sx={{ 
                      flexGrow: 1,
                      py: { xs: 2, sm: 4 },
                      px: { xs: 1, sm: 2 },
                      width: '100%',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    <Container 
                      maxWidth={false}
                      sx={{ 
                        px: { xs: 1, sm: 2, md: 3 },
                        width: '100%'
                      }}
                    >
                      <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2,
                          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}
                      >
                        Report Issues
                      </Typography>
                      <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ 
                          mb: 4,
                          fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                      >
                        Help improve your surroundings and earn Fix Points!
                      </Typography>

                      <Box sx={{ 
                        width: '100%',
                        height: { xs: '400px', sm: '500px', md: '600px' },
                        mb: 4
                      }}>
                        <MapContainer onMapClick={handleMapClick} />
                      </Box>

        <IssueList />
        
                      <Box sx={{ 
                        textAlign: 'center', 
                        my: 4,
                        px: { xs: 1, sm: 2 }
                      }}>
          <img
            style={{
              width: '150px',
              margin: '10px 0px',
              maxWidth: '90%',
                            borderRadius: '10px',
                            height: 'auto'
            }}
                          src={spotFixLogo}
                          alt="SpotFix Logo"
          />
                      </Box>

        <Gallery />
                    </Container>
                  </Box>
                  <Description />
                  <Footer />
                </Box>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRouteComponent>
                  <Login onLogin={handleLogin} />
                </PublicRouteComponent>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRouteComponent>
                  <Register />
                </PublicRouteComponent>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRouteComponent>
                  <ResetPassword />
                </PublicRouteComponent>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRouteComponent>
                  <About />
                </ProtectedRouteComponent>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRouteComponent>
                  <Contact />
                </ProtectedRouteComponent>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <ProtectedRouteComponent>
                  <ProfileSettings />
                </ProtectedRouteComponent>
              }
            />
          </Routes>
        </Box>

        {user && (
          <>
      <ProfilePanel 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
              user={user}
      />
            {showIssueForm && selectedLocation && (
      <IssueForm 
                open={showIssueForm}
                onClose={handleIssueFormClose}
                location={selectedLocation}
              />
            )}
          </>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;
