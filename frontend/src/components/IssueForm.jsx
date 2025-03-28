import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

const categories = [
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'safety', label: 'Safety' },
];

function IssueForm({ isOpen, onClose, onSubmit, location }) {
  const [formData, setFormData] = useState({
    description: '',
    category: 'infrastructure',
    severity: 'low',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lat: location?.lat(),
      lng: location?.lng(),
      timestamp: new Date().toISOString(),
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      description: '',
      category: 'infrastructure',
      severity: 'low',
      image: null,
    });
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" component="div">
          Report an Issue
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
            />

            <FormControl fullWidth>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Severity</FormLabel>
              <RadioGroup
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                row
              >
                <FormControlLabel 
                  value="low" 
                  control={<Radio />} 
                  label="Low" 
                />
                <FormControlLabel 
                  value="medium" 
                  control={<Radio />} 
                  label="Medium" 
                />
                <FormControlLabel 
                  value="high" 
                  control={<Radio />} 
                  label="High" 
                />
              </RadioGroup>
            </FormControl>

            <Box>
              <input
                accept="image/*"
                id="issue-image"
                type="file"
                hidden
                onChange={handleImageChange}
              />
              <label htmlFor="issue-image">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<ImageIcon />}
                >
                  Add Image
                </Button>
              </label>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                  }}
                />
              </Box>
            )}

            {location && (
              <Typography variant="body2" color="textSecondary">
                Location: {location.lat().toFixed(6)}, {location.lng().toFixed(6)}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!formData.description || !location}
          >
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default IssueForm;