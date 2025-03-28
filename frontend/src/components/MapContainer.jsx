import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Box, Typography, CircularProgress, IconButton, TextField, InputAdornment, Snackbar, Alert, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
};

const defaultCenter = {
  lat: 28.9691566,
  lng: 77.7358971
};

const mapOptions = {
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  zoomControl: true,
  mapTypeId: 'hybrid',
  styles: [
    {
      featureType: 'poi.school',
      elementType: 'geometry',
      stylers: [{ color: '#c5e8ff' }]
    },
    {
      featureType: 'poi.school',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

function MapContainer({ onMapClick, issues = [] }) {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempMarker, setTempMarker] = useState(null);
  const placesService = useRef(null);
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const clearTempMarker = useCallback(() => {
    if (tempMarker) {
      tempMarker.setMap(null);
      setTempMarker(null);
    }
  }, [tempMarker]);

  const handleMapClick = useCallback((e) => {
    if (!onMapClick) {
      setShowLoginPrompt(true);
      return;
    }
    
    clearTempMarker();
    
    const newMarker = new window.google.maps.Marker({
      position: e.latLng,
      map: map,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'
        ),
        scaledSize: new window.google.maps.Size(40, 40)
      },
      animation: window.google.maps.Animation.DROP
    });
    
    setTempMarker(newMarker);
    onMapClick(e.latLng);
  }, [map, clearTempMarker, onMapClick]);

  const handleSearch = useCallback(() => {
    if (!map || !searchQuery.trim() || !placesService.current) return;

    const request = {
      query: searchQuery,
      fields: ['name', 'geometry']
    };

    placesService.current.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const place = results[0];
        const location = place.geometry.location;

        map.setCenter(location);
        map.setZoom(16);
        clearTempMarker();
      }
    });
  }, [map, searchQuery, clearTempMarker]);

  const centerOnUserLocation = useCallback(() => {
    if (!map || !userLocation) return;
    map.setCenter(userLocation);
    map.setZoom(16);
  }, [map, userLocation]);

  const onLoad = useCallback((map) => {
    setMap(map);
    placesService.current = new window.google.maps.places.PlacesService(map);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(location);
              
          const distance = getDistance(location, defaultCenter);
          if (distance < 10) {
            map.setCenter(location);
          }
            },
            () => {
          console.error('Error getting location');
        }
      );
    }
  }, []);

  const getDistance = (p1, p2) => {
    const R = 6371;
    const dLat = deg2rad(p2.lat - p1.lat);
    const dLon = deg2rad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  if (loadError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Error loading maps. Please check your internet connection.
        </Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box sx={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 1,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <TextField
          size="small"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={16}
        options={mapOptions}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4285f4" stroke="#ffffff" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg>'
              ),
              scaledSize: new window.google.maps.Size(24, 24)
            }}
            title="Your Location"
          />
        )}
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={{ lat: issue.lat, lng: issue.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: issue.severity === 'high' ? '#f44336' : 
                        issue.severity === 'medium' ? '#ff9800' : '#4caf50',
              fillOpacity: 0.6,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 10
            }}
            title={issue.description}
          />
        ))}
      </GoogleMap>
      
      <Box sx={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        zIndex: 1
      }}>
        <IconButton
          onClick={centerOnUserLocation}
          sx={{
            backgroundColor: 'white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'white',
            }
          }}
        >
          <LocationOnIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          p: '0.5rem 1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="body2">
          Click on the map to report an issue
        </Typography>
      </Box>

      <Snackbar
        open={showLoginPrompt}
        autoHideDuration={6000}
        onClose={() => setShowLoginPrompt(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="info" 
          onClose={() => setShowLoginPrompt(false)}
          action={
            <Button color="inherit" size="small" onClick={handleLoginClick}>
              Login
            </Button>
          }
        >
          Please login to report an issue
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MapContainer;