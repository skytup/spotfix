import { Box, Container, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

function Description() {
  const features = [
    {
      icon: <LocationOnIcon fontSize="large" color="primary" />,
      title: "Easy Issue Reporting",
      description: "Report local issues with just a few clicks. Mark locations, add descriptions, and upload photos easily."
    },
    {
      icon: <EmojiEventsIcon fontSize="large" color="primary" />,
      title: "Earn Rewards",
      description: "Get Fix Points for every verified report. Climb the leaderboard and earn special badges."
    },
    {
      icon: <TrackChangesIcon fontSize="large" color="primary" />,
      title: "Track Progress",
      description: "Monitor the status of reported issues and see the impact you're making in your community."
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3
            }}
          >
            Make Your Community Better
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 4 
            }}
          >
            Join thousands of active citizens in making our neighborhoods cleaner, safer, and more vibrant.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* About Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            mb: 8
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            About SpotFix
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 3 }}>
            SpotFix is more than just a platform; it's a movement to empower individuals like you to take charge of your surroundings. Whether it's a pothole on your street, an overflowing garbage bin, or a safety concern in your neighborhood, SpotFix ensures your voice is not only heard but also rewarded.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
            By reporting issues, you become an active participant in creating a cleaner, safer, and more vibrant community. Your contributions matter, and with every report, you earn Fix Points as a token of appreciation for your efforts.
          </Typography>
        </Paper>

        {/* Benefits Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Why Choose SpotFix?
          </Typography>
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <List>
              {[
                'Easy-to-use interface for reporting issues',
                'Real-time tracking of issue status',
                'Earn Fix Points for every verified report',
                'Join a community of active citizens',
                'Make a real difference in your neighborhood'
              ].map((text, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    py: 2,
                    borderBottom: index !== 4 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={text}
                    primaryTypographyProps={{
                      sx: { fontSize: '1.1rem' }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

      </Container>
    </Box>
  );
}

export default Description;