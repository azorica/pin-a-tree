import { ref } from 'vue';
import exifr from 'exifr';

export function useFileUpload() {
  const file = ref(null);
  const preview = ref('');
  const loading = ref(false);
  const error = ref(null);
  const gpsData = ref(null);

  const handleFileUpload = async (uploadedFile) => {
    loading.value = true;
    error.value = null;

    try {
      // Validate file type
      if (!uploadedFile.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Create preview URL
      file.value = uploadedFile;
      preview.value = URL.createObjectURL(uploadedFile);

      // Extract GPS data
      const exif = await exifr.gps(uploadedFile);
      if (exif?.latitude && exif?.longitude) {
        gpsData.value = {
          lat: exif.latitude,
          lng: exif.longitude
        };
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error processing file:', err);
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    if (preview.value) {
      URL.revokeObjectURL(preview.value);
    }
    file.value = null;
    preview.value = '';
    loading.value = false;
    error.value = null;
    gpsData.value = null;
  };

  return {
    file,
    preview,
    loading,
    error,
    gpsData,
    handleFileUpload,
    reset
  };
} 