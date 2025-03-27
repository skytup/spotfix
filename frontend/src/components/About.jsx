import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';

function About() {
  const features = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Location-Based',
      description: 'Report issues in your neighborhood and track their resolution status.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Response',
      description: 'Quick issue reporting and efficient resolution process.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Community Driven',
      description: 'Join a community of active citizens making their neighborhoods better.',
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 4,
              }}
            >
              About SpotFix
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              Empowering communities to report and resolve local issues efficiently.
              Join us in making your neighborhood a better place to live.
            </Typography>
          </Grid>

          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                mt: 6,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, mb: 4 }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
              >
                SpotFix aims to bridge the gap between citizens and local authorities
                by providing a seamless platform for reporting and tracking local issues.
                We believe that every community deserves to have its concerns heard and
                addressed promptly.
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
              >
                Through our platform, we're building a more connected and responsive
                community where everyone can contribute to making their neighborhood
                better. Join us in this journey of community improvement and civic
                engagement.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default About;