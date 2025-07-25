<script setup>
/**
 * UploadView Component
 *
 * Form for uploading new tree photos and information.
 *
 * Features:
 * - Photo upload with preview
 * - EXIF data extraction
 * - Manual location selection
 * - Tree details form
 */

// Vue imports
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Upload } from 'lucide-vue-next';

// Store imports
import { useTreeStore } from '@/stores/tree-store';

// Component imports
import TreePhotoUpload from '@/components/TreePhotoUpload.vue';
import TreeLocationPicker from '@/components/TreeLocationPicker.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const router = useRouter();
const treeStore = useTreeStore();

const formData = ref({
  name: '',
  species: '',
  description: '',
  location: {
    lat: null,
    lng: null,
    address: ''
  },
  photo: null
});

const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.species &&
    formData.value.location.lat &&
    formData.value.location.lng &&
    formData.value.photo
  );
});

// Debounce function to prevent rapid updates
function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

const handlePhotoUpdate = (file) => {
  formData.value.photo = file;
};

const handleLocationUpdate = debounce((location) => {
  if (location && typeof location.lat === 'number' && typeof location.lng === 'number') {
    formData.value.location = {
      ...formData.value.location,
      lat: location.lat,
      lng: location.lng
    };
  }
}, 100);

const handleAddressUpdate = debounce((address) => {
  if (address) {
    formData.value.location.address = address;
  }
}, 100);

const handleSubmit = async () => {
  try {
    const newTree = await treeStore.addTree({
      name: formData.value.name,
      species: formData.value.species,
      description: formData.value.description,
      location: formData.value.location,
      photo: formData.value.photo
    });
    
    router.push(`/tree/${newTree.id}`);
  } catch (error) {
    console.error('Error adding tree:', error);
  }
};
</script>

<template>
  <div class="upload-view">
    <div class="upload-view__container container">
      <h1>Upload a Tree</h1>
      <form @submit.prevent="handleSubmit" class="upload-view__form">
        <TreePhotoUpload
          @update:photo="handlePhotoUpdate"
          @update:location="handleLocationUpdate"
        />
        
        <BaseInput
          v-model="formData.name"
          label="Tree Name"
          required
        />
        
        <BaseInput
          v-model="formData.species"
          label="Species"
          required
        />
        
        <BaseTextarea
          v-model="formData.description"
          label="Description"
        />
        
        <TreeLocationPicker
          :location="formData.location"
          @update:location="handleLocationUpdate"
          @update:address="handleAddressUpdate"
        />
        
        <BaseButton
          type="submit"
          :disabled="!isFormValid"
          full-width
        >
          <template #icon-left>
            <Upload />
          </template>
          Pin this Tree
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-view {
  padding: $spacing-4 0;

  &__container {
    max-width: 60rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-3;
    margin-top: $spacing-3;
  }

  h1 {
    color: $primary-green;
    text-align: center;
  }
}
</style> 