import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MapContainer from './MapContainer';
import IssuesList from './IssuesList';
import { issues as issuesApi } from '../services/api';

function Home() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await issuesApi.getAll();
        setIssues(response.data);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      }
    };
    fetchIssues();
  }, []);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const highlights = [
    {
      title: 'Report Any Issues',
      description: 'Easily report community issues with our user-friendly interface',
      image: '/images/report.jpg'
    },
    {
      title: 'Upvote the Work',
      description: 'Support important issues by upvoting them for priority attention',
      image: '/images/upvote.jpg'
    },
    {
      title: 'Suggest improvements',
      description: 'Contribute ideas to make your community better',
      image: '/images/suggest.jpg'
    },
    {
      title: 'Earn Points',
      description: 'Get rewarded for your active participation in community improvement',
      image: '/images/points.jpg'
    }
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} md={8} sx={{ height: isMobile ? '60vh' : '100%' }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <MapContainer
                issues={issues}
                selectedIssue={selectedIssue}
                onIssueSelect={setSelectedIssue}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ height: isMobile ? '40vh' : '100%' }}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <IssuesList
                issues={issues}
                onIssueClick={handleIssueClick}
              />
            </Paper>
          </Grid>

          {/* Highlights Section */}
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
              }}
            >
              Highlights
            </Typography>
            <Grid container spacing={3}>
              {highlights.map((highlight, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        pt: '60%',
                        position: 'relative',
                        backgroundImage: `url(${highlight.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Paper
                      elevation={0}
                      sx={{
                        flexGrow: 1,
                        p: 2,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 600 }}
                      >
                        {highlight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {highlight.description}
                      </Typography>
                    </Paper>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 