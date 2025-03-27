import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { format } from 'date-fns';

const severityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

const categoryIcons = {
  infrastructure: '🏗️',
  environment: '🌱',
  safety: '🚨',
  cleanliness: '🧹',
  other: '📝',
};

function IssuesList({ issues = [] }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Issues
        </Typography>
      </Box>
      
      <List sx={{ p: 0, overflow: 'auto', flexGrow: 1 }}>
        {issues.map((issue, index) => (
          <Box key={issue._id || index}>
            <ListItem
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {categoryIcons[issue.category] || '📝'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {issue.title}
                    </Typography>
                    <Chip
                      label={issue.severity || 'Medium'}
                      size="small"
                      color={severityColors[issue.severity?.toLowerCase()] || 'default'}
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {issue.location || 'Location not specified'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {issue.createdAt ? format(new Date(issue.createdAt), 'MMM d, yyyy') : ''}
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                <IconButton size="small" sx={{ color: 'primary.main' }}>
                  <ThumbUpIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary">
                  {issue.votes || 0}
                </Typography>
              </Box>
            </ListItem>
            {index < issues.length - 1 && <Divider />}
          </Box>
        ))}
        
        {issues.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No issues reported yet
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
}

export default IssuesList; 