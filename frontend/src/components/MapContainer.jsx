import { useState, useEffect, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
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

L.Marker.prototype.options.icon = icon;

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function MapContainer({ onMapClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mapType, setMapType] = useState('streets');
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(13);
  const mapRef = useRef(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a fallback location
          setCenter([40.7128, -74.0060]); // New York City
        }
      );
    }

    // Fetch issues
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
    onMapClick(e.latlng);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'streets' ? 'satellite' : 'streets');
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(15);
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
      }}
    >
      <LeafletMap
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
        ref={mapRef}
      >
        <MapController center={center} zoom={zoom} />
        
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
          >
            <Popup>
              <div>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
                {marker.image && (
                  <img
                    src={marker.image}
                    alt={marker.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>

      <Box
        sx={{
          position: 'absolute',
          top: 16,
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
              '&:hover': {
                bgcolor: 'background.paper',
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
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <LocationOnIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}

export default MapContainer;