import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { issues } from '../services/api';

const ITEMS_PER_PAGE = 10;

function IssueList() {
  const [issuesList, setIssuesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [page]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issues.getAll(page, ITEMS_PER_PAGE);
      setIssuesList(response.data.issues || []);
      setTotalPages(Math.ceil((response.data.total || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Failed to load issues');
      console.error('Error fetching issues:', err);
      setIssuesList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleIssueClick = async (issue) => {
    setSelectedIssue(issue);
    setLoadingComments(true);
    try {
      const response = await issues.getComments(issue.id);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async (issueId, voteType) => {
    try {
      await issues.vote(issueId, voteType);
      // Refresh the issues list after voting
      fetchIssues();
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return 'default';
    
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchIssues} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (!issuesList || issuesList.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No issues found. Be the first to report one!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ mt: 4, mb: 2 }}>
        <List>
          {issuesList.map((issue) => (
            <ListItem
              key={issue.id || issue._id}
              alignItems="flex-start"
              divider
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => handleIssueClick(issue)}
            >
              <ListItemAvatar>
                <Avatar src={issue.image} alt={issue.title}>
                  <LocationIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {issue.title}
                    </Typography>
                    <Chip
                      label={issue.severity}
                      size="small"
                      color={getSeverityColor(issue.severity)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {issue.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                          {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CommentIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="caption">
                          {issue.commentsCount || 0} comments
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(issue.id || issue._id, 'up');
                  }}
                  color={issue.userVote === 'up' ? 'primary' : 'default'}
                >
                  <ThumbUpIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  {issue.votes || 0}
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(issue.id || issue._id, 'down');
                  }}
                  color={issue.userVote === 'down' ? 'primary' : 'default'}
                >
                  <ThumbDownIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedIssue && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{selectedIssue.title}</Typography>
                <Chip
                  label={selectedIssue.severity}
                  size="small"
                  color={getSeverityColor(selectedIssue.severity)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{selectedIssue.description}</Typography>
                {selectedIssue.image && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={selectedIssue.image}
                      alt={selectedIssue.title}
                      style={{ maxWidth: '100%', borderRadius: 8 }}
                    />
                  </Box>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              {loadingComments ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {comments.map((comment) => (
                    <ListItem key={comment.id || comment._id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={comment.user?.avatar}>
                          {comment.user?.name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2">
                              {comment.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                        }
                        secondary={comment.text}
                      />
                    </ListItem>
                  ))}
                  {comments.length === 0 && (
                    <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      No comments yet
                    </Typography>
                  )}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedIssue(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

export default IssueList;
