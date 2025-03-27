import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // useTheme,
  // useMediaQuery,
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
import { auth } from './services/api';
import spotFixLogo from './assets/spot-fix.png';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await auth.getProfile();
          setUser(response.data);
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
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            overflow: 'hidden'
          }}
        >
          <Header 
            user={user}
            onProfileClick={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />
          
          <Box 
            component="main" 
            className="main-content"
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Routes>
              <Route path="/login" element={
                <Box className="container-full-height">
                  {!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                </Box>
              } />
              <Route path="/register" element={
                <Box className="container-full-height">
                  {!user ? <Register /> : <Navigate to="/" />}
                </Box>
              } />
              <Route path="/about" element={
                <Box className="container-full-height">
                  <About />
                </Box>
              } />
              <Route path="/contact" element={
                <Box className="container-full-height">
                  <Contact />
                </Box>
              } />
              <Route path="/" element={
                <Box className="container-full-height" sx={{ py: 4 }}>
                  <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <section className="intro">
                      <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 2 }}
                      >
                        Report Issues
                      </Typography>
                      <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                      >
                        Help improve your surroundings and earn Fix Points!
                      </Typography>
                    </section>

                    <MapContainer onMapClick={() => setIsFormOpen(true)} />
                    <IssueList />
                    
                    <Box sx={{ textAlign: 'center', my: 4 }}>
                      <img
                        style={{
                          width: '150px',
                          margin: '10px 0px',
                          maxWidth: '90%',
                          borderRadius: '10px'
                        }}
                        src={spotFixLogo}
                        alt="SpotFix Logo"
                      />
                    </Box>

                    <Gallery />
                  </Container>
                </Box>
              } />
            </Routes>
          </Box>

          <ProfilePanel 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)}
            user={user}
          />

          <IssueForm 
            isOpen={isFormOpen} 
            onClose={() => setIsFormOpen(false)}
            user={user}
          />

          <div id="toast-container"></div>

          <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
              
              <iframe
                style={{ maxWidth: '90%' }}
                width="693"
                height="391"
                src="https://www.youtube.com/embed/uPWF7atLQ-g"
                title="SpotFix - Report Issues, Earn Rewards, Improve Your Community 😎"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </Container>
          </Box>

          <Description />

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
