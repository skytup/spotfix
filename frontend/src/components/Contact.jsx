import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Sending message...' });

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email',
      content: 'support@spotfix.com',
      link: 'mailto:support@spotfix.com',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Address',
      content: '123 Community Street, City, Country',
      link: 'https://maps.google.com',
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
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
            >
              Have questions or suggestions? We'd love to hear from you.
              Get in touch with our team through any of the following channels.
            </Typography>
          </Grid>

          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  {info.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {info.title}
                </Typography>
                <Button
                  component="a"
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {info.content}
                </Button>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
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
                Send us a Message
              </Typography>

              {status.message && (
                <Alert
                  severity={status.type}
                  sx={{ mb: 3 }}
                  onClose={() => setStatus({ type: '', message: '' })}
                >
                  {status.message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={status.type === 'info'}
                    >
                      {status.type === 'info' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Contact;