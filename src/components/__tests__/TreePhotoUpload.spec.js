import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import TreePhotoUpload from '../TreePhotoUpload.vue';

// Mock file data
const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const mockGPSFile = new File(['test'], 'gps.jpg', { type: 'image/jpeg' });

// Mock exifr
vi.mock('exifr', () => ({
  default: {
    gps: vi.fn().mockImplementation((file) => {
      if (file === mockGPSFile) {
        return Promise.resolve({
          latitude: 51.5074,
          longitude: -0.1278
        });
      }
      return Promise.resolve(null);
    })
  }
}));

describe('TreePhotoUpload', () => {
  beforeEach(() => {
    // Create a new URL for each test
    URL.createObjectURL = vi.fn(() => 'blob:test-url');
    URL.revokeObjectURL = vi.fn();
  });

  it('renders upload placeholder when no photo is selected', () => {
    const { getByText } = render(TreePhotoUpload);

    expect(getByText('Drop your photo here or click to upload')).toBeInTheDocument();
    expect(getByText('Supports: JPG, PNG (max 10MB)')).toBeInTheDocument();
  });

  it('handles file upload through input', async () => {
    const { getByLabelText, emitted } = render(TreePhotoUpload);
    const input = getByLabelText('', { selector: 'input' });

    // Trigger file upload
    await fireEvent.update(input, mockFile);

    // Check if preview URL was created
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);

    // Check if events were emitted
    expect(emitted()['update:photo'][0]).toEqual([mockFile]);
  });

  it('handles file upload with GPS data', async () => {
    const { getByLabelText, emitted } = render(TreePhotoUpload);
    const input = getByLabelText('', { selector: 'input' });

    // Trigger file upload with GPS data
    await fireEvent.update(input, mockGPSFile);

    // Check if events were emitted
    expect(emitted()['update:photo'][0]).toEqual([mockGPSFile]);
    expect(emitted()['update:location'][0]).toEqual([{
      lat: 51.5074,
      lng: -0.1278
    }]);
  });

  it('handles drag and drop', async () => {
    const { container, emitted } = render(TreePhotoUpload);
    const dropzone = container.firstChild;

    // Create drag event
    const dropEvent = new Event('drop');
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [mockFile]
      }
    });

    // Prevent default is required for drop events
    dropEvent.preventDefault = vi.fn();

    // Trigger drop event
    await fireEvent(dropzone, dropEvent);

    // Check if events were emitted
    expect(emitted()['update:photo'][0]).toEqual([mockFile]);
  });

  it('displays error message when provided', () => {
    const error = 'Invalid file type';
    const { getByText } = render(TreePhotoUpload, {
      props: {
        error
      }
    });

    expect(getByText(error)).toBeInTheDocument();
  });

  it('shows loading state during file processing', async () => {
    const { getByLabelText, getByRole } = render(TreePhotoUpload);
    const input = getByLabelText('', { selector: 'input' });

    // Create a delayed file upload
    const delayedFile = new File(['test'], 'delayed.jpg', { type: 'image/jpeg' });
    vi.mock('exifr', () => ({
      default: {
        gps: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      }
    }));

    // Trigger file upload
    await fireEvent.update(input, delayedFile);

    // Check if loading state is shown
    expect(getByRole('status')).toBeInTheDocument();
    expect(getByRole('status')).toHaveTextContent('Processing...');
  });

  it('allows removing uploaded photo', async () => {
    const { getByLabelText, getByText, emitted } = render(TreePhotoUpload);
    const input = getByLabelText('', { selector: 'input' });

    // Upload a file first
    await fireEvent.update(input, mockFile);

    // Click remove button
    const removeButton = getByText('Remove photo');
    await fireEvent.click(removeButton);

    // Check if events were emitted with null values
    expect(emitted()['update:photo'][1]).toEqual([null]);
    expect(emitted()['update:location'][0]).toEqual([null]);

    // Check if URL was revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });
}); 