import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/vue';
import TreeLocationPicker from '../TreeLocationPicker.vue';

// Mock Google Maps
const mockMap = {
  setCenter: vi.fn(),
  addListener: vi.fn(),
  panTo: vi.fn()
};

const mockMarker = {
  setMap: vi.fn(),
  addListener: vi.fn(),
  getPosition: vi.fn()
};

const mockGeocoder = {
  geocode: vi.fn()
};

const mockGoogleMaps = {
  Map: vi.fn(() => mockMap),
  Marker: vi.fn(() => mockMarker),
  LatLngBounds: vi.fn(),
  Geocoder: vi.fn(() => mockGeocoder),
  SymbolPath: {
    CIRCLE: 'circle'
  }
};

// Mock Loader
vi.mock('@googlemaps/js-api-loader', () => ({
  Loader: class {
    load() {
      return Promise.resolve({
        maps: mockGoogleMaps
      });
    }
  }
}));

describe('TreeLocationPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and help text', () => {
    const { getByText } = render(TreeLocationPicker);

    expect(getByText('Select Location')).toBeInTheDocument();
    expect(getByText('Click on the map to place a marker, or drag the marker to adjust the location')).toBeInTheDocument();
  });

  it('shows loading state while map is initializing', () => {
    const { getByRole } = render(TreeLocationPicker);

    expect(getByRole('status')).toBeInTheDocument();
    expect(getByRole('status')).toHaveTextContent('Loading map...');
  });

  it('displays error message when provided', () => {
    const error = 'Failed to load map';
    const { getByText } = render(TreeLocationPicker, {
      props: {
        error
      }
    });

    expect(getByText(error)).toBeInTheDocument();
  });

  it('updates marker when location prop changes', async () => {
    const location = {
      lat: 51.5074,
      lng: -0.1278
    };

    const { rerender } = render(TreeLocationPicker, {
      props: {
        location: null
      }
    });

    // Update location prop
    await rerender({
      location
    });

    // Check if marker was updated
    expect(mockMarker.setMap).toHaveBeenCalled();
  });

  it('emits location and address when marker is updated', async () => {
    const location = {
      lat: 51.5074,
      lng: -0.1278
    };

    const address = 'Hyde Park, London';

    // Mock geocoder response
    mockGeocoder.geocode.mockResolvedValue({
      results: [{ formatted_address: address }]
    });

    const { emitted } = render(TreeLocationPicker);

    // Simulate marker update
    const markerUpdateCallback = mockMap.addListener.mock.calls.find(
      call => call[0] === 'click'
    )[1];

    await markerUpdateCallback({
      latLng: {
        lat: () => location.lat,
        lng: () => location.lng
      }
    });

    // Check if events were emitted
    expect(emitted()['update:location'][0]).toEqual([location]);
    expect(emitted()['update:address'][0]).toEqual([address]);
  });

  it('handles geocoding errors gracefully', async () => {
    // Mock geocoder error
    mockGeocoder.geocode.mockRejectedValue(new Error('Geocoding failed'));

    const { emitted } = render(TreeLocationPicker);

    // Simulate marker update
    const markerUpdateCallback = mockMap.addListener.mock.calls.find(
      call => call[0] === 'click'
    )[1];

    await markerUpdateCallback({
      latLng: {
        lat: () => 0,
        lng: () => 0
      }
    });

    // Check if location was emitted but not address
    expect(emitted()['update:location']).toBeTruthy();
    expect(emitted()['update:address']).toBeFalsy();
  });

  it('handles marker drag events', async () => {
    const location = {
      lat: 51.5074,
      lng: -0.1278
    };

    // Mock marker position
    mockMarker.getPosition.mockReturnValue({
      lat: () => location.lat,
      lng: () => location.lng
    });

    const { emitted } = render(TreeLocationPicker);

    // Simulate marker drag
    const dragEndCallback = mockMarker.addListener.mock.calls.find(
      call => call[0] === 'dragend'
    )[1];

    await dragEndCallback();

    // Check if location was emitted
    expect(emitted()['update:location'][0]).toEqual([location]);
  });
}); 