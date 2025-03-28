import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { auth } from '../services/api';

function ProfilePanel({ isOpen, onClose, user }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
    bio: user?.bio || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await auth.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setIsChangePasswordOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: <AccountCircleIcon />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            fullWidth
            label="Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Email"
            value={profileData.email}
            disabled
            margin="normal"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={profileData.dateOfBirth}
              onChange={(date) => setProfileData({ ...profileData, dateOfBirth: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            label="Bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            multiline
            rows={3}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Address"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleProfileUpdate}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: <SecurityIcon />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsChangePasswordOpen(true)}
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </Box>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <NotificationsIcon />,
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          {/* Add notification settings here */}
        </Box>
      ),
    },
  ];

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Profile Settings</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Avatar
              sx={{ width: 64, height: 64, mr: 2 }}
              src={user?.avatar}
            />
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <List sx={{ width: 200, borderRight: 1, borderColor: 'divider' }}>
              {sections.map((section) => (
                <ListItem
                  key={section.id}
                  button
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {sections.find(s => s.id === activeSection)?.content}
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Dialog open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChangePasswordOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProfilePanel;
