import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const DEFAULT_CENTER = [51.5074, -0.1278]; // London
const DEFAULT_ZOOM = 13;

export function useLeafletMap(options = {}) {
  const mapContainer = ref(null);
  const map = ref(null);
  const markers = ref(new Map()); // Using Map to store markers by id
  const loading = ref(false);
  const error = ref(null);

  const defaultOptions = {
    center: options.center || DEFAULT_CENTER,
    zoom: options.zoom || DEFAULT_ZOOM,
    clickable: options.clickable || false,
    draggableMarker: options.draggableMarker || false,
    centerOnMarker: options.centerOnMarker || false,
  };

  const initMap = () => {
    if (!mapContainer.value) return;

    loading.value = true;
    error.value = null;

    try {
      // Initialize the map
      map.value = L.map(mapContainer.value).setView(defaultOptions.center, defaultOptions.zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value);

      // Add click handler if clickable
      if (defaultOptions.clickable) {
        map.value.on('click', (e) => {
          const location = [e.latlng.lat, e.latlng.lng];
          if (options.onClick) {
            options.onClick(location);
          }
        });
      }

      if (options.onMapLoad) {
        options.onMapLoad(map.value);
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      error.value = 'Failed to initialize map';
    } finally {
      loading.value = false;
    }
  };

  const createCustomIcon = (color = '#2E7D32') => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  const addMarker = (location, options = {}) => {
    if (!map.value || !location) return null;

    try {
      const marker = L.marker(location, {
        icon: createCustomIcon(options.color),
        draggable: defaultOptions.draggableMarker
      }).addTo(map.value);

      if (options.popup) {
        marker.bindPopup(options.popup);
      }

      if (defaultOptions.draggableMarker && options.onDragEnd) {
        marker.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          options.onDragEnd([pos.lat, pos.lng]);
        });
      }

      if (options.onClick) {
        marker.on('click', () => options.onClick(location));
      }

      if (options.id) {
        markers.value.set(options.id, marker);
      }

      if (defaultOptions.centerOnMarker) {
        map.value.setView(location);
      }

      return marker;
    } catch (err) {
      console.error('Error adding marker:', err);
      error.value = 'Failed to add marker';
      return null;
    }
  };

  const removeMarker = (id) => {
    const marker = markers.value.get(id);
    if (marker) {
      marker.remove();
      markers.value.delete(id);
    }
  };

  const clearMarkers = () => {
    markers.value.forEach(marker => marker.remove());
    markers.value.clear();
  };

  const panTo = (location) => {
    if (map.value && location) {
      map.value.panTo(location);
    }
  };

  onMounted(() => {
    initMap();
  });

  onUnmounted(() => {
    if (map.value) {
      clearMarkers();
      map.value.remove();
      map.value = null;
    }
  });

  return {
    mapContainer,
    map,
    loading,
    error,
    addMarker,
    removeMarker,
    clearMarkers,
    panTo,
  };
} 