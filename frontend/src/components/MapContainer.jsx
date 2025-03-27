import { useState, useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
} from '@mui/material';
import SatelliteIcon from '@mui/icons-material/Satellite';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { issues } from '../services/api';

// Fix for default marker icons in React-Leaflet
const icon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const issueIcon = new L.Icon({
  iconUrl: '/marker-icon-red.png',
  iconRetinaUrl: '/marker-icon-red-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = icon;

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function MapContainer() {
  const [mapType, setMapType] = useState('streets');
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(13);
  const [locationSearch, setLocationSearch] = useState('');
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tempMarker, setTempMarker] = useState(null);
  const [issueForm, setIssueForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 3,
    image: null,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCenter([40.7128, -74.0060]);
        }
      );
    }

    const fetchIssues = async () => {
      try {
        const response = await issues.getAll();
        setMarkers(response.data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  const handleMapClick = (e) => {
    const newLocation = e.latlng;
    setSelectedLocation(newLocation);
    setTempMarker(newLocation);
    setIsIssueFormOpen(true);
  };

  const handleIssueSubmit = async () => {
    try {
      const newIssue = {
        ...issueForm,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      };
      const response = await issues.create(newIssue);
      setMarkers([...markers, response.data]);
      setIsIssueFormOpen(false);
      setTempMarker(null);
      setIssueForm({
        title: '',
        description: '',
        category: '',
        priority: 3,
        image: null,
      });
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const handleLocationSearch = async (value) => {
    if (!value) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const location = data[0];
        setCenter([parseFloat(location.lat), parseFloat(location.lon)]);
        setZoom(16);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === 'streets' ? 'satellite' : 'streets');
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(16);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        height: { xs: '400px', sm: '500px', md: '600px' },
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search location..."
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch(locationSearch)}
          sx={{
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={() => handleLocationSearch(locationSearch)}
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Search
        </Button>
      </Box>

      <LeafletMap
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
        ref={mapRef}
        zoomControl={false}
        maxZoom={19}
      >
        <MapController center={center} zoom={zoom} />
        <ZoomControl position="bottomright" />
        
        {mapType === 'streets' ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        )}

        {markers.map((marker) => (
          <Marker
            key={marker._id}
            position={[marker.latitude, marker.longitude]}
            icon={issueIcon}
          >
            <Popup>
              <div>
                <Typography variant="h6">{marker.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {marker.description}
                </Typography>
                <Typography variant="body2">
                  Priority: {marker.priority}/5
                </Typography>
                <Typography variant="body2">
                  Category: {marker.category}
                </Typography>
                {marker.image && (
                  <img
                    src={marker.image}
                    alt={marker.title}
                    style={{ maxWidth: '100%', height: 'auto', marginTop: '8px' }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {tempMarker && (
          <Marker position={[tempMarker.lat, tempMarker.lng]} icon={icon}>
            <Popup>Click 'Report Issue' to report a problem at this location</Popup>
          </Marker>
        )}
      </LeafletMap>

      <Box
        sx={{
          position: 'absolute',
          top: 80,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1000,
        }}
      >
        <Tooltip title={mapType === 'streets' ? 'Switch to Satellite View' : 'Switch to Street View'}>
          <IconButton
            onClick={toggleMapType}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
                transform: 'scale(1.05)',
              },
            }}
          >
            {mapType === 'streets' ? <SatelliteIcon /> : <MapIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Locate Me">
          <IconButton
            onClick={handleLocateMe}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
                transform: 'scale(1.05)',
              },
            }}
          >
            <LocationOnIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog 
        open={isIssueFormOpen} 
        onClose={() => {
          setIsIssueFormOpen(false);
          setTempMarker(null);
        }}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Report New Issue</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={issueForm.title}
            onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
            sx={{ mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={issueForm.description}
            onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={issueForm.category}
              onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
            >
              <MenuItem value="infrastructure">Infrastructure</MenuItem>
              <MenuItem value="environment">Environment</MenuItem>
              <MenuItem value="safety">Safety</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Priority</Typography>
            <Rating
              value={issueForm.priority}
              onChange={(_, newValue) => setIssueForm({ ...issueForm, priority: newValue })}
              sx={{ color: 'primary.main' }}
            />
          </Box>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ 
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setIssueForm({ ...issueForm, image: e.target.files[0] })}
            />
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => {
              setIsIssueFormOpen(false);
              setTempMarker(null);
            }}
            sx={{ 
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleIssueSubmit} 
            variant="contained"
            sx={{ 
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default MapContainer;