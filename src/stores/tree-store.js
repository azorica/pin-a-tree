import { defineStore } from 'pinia';
import treesData from '@/mocks/trees.json';

export const useTreeStore = defineStore('tree', {
  state: () => ({
    trees: [],
    loading: false,
    error: null
  }),

  getters: {
    sortedTrees: (state) => {
      return [...state.trees].sort((a, b) => {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
    },
    getTreeById: (state) => (id) => {
      return state.trees.find(tree => tree.id === id);
    }
  },

  actions: {
    async fetchTrees() {
      this.loading = true;
      this.error = null;
      try {
        // For MVP, we're using mock data
        // In the future, this will be an API call
        const response = treesData;
        this.trees = response.trees || [];
      } catch (error) {
        console.error('Error fetching trees:', error);
        this.error = 'Failed to fetch trees';
        this.trees = [];
      } finally {
        this.loading = false;
      }
    },

    async addTree(treeData) {
      this.loading = true;
      this.error = null;
      try {
        // For MVP, we're just adding to local state
        // In the future, this will be an API call
        const photoUrl = treeData.photo instanceof File 
          ? URL.createObjectURL(treeData.photo)  // Create URL for File objects
          : treeData.photo;  // Use existing URL for string URLs

        const newTree = {
          id: String(Date.now()), // Simple ID generation for MVP
          ...treeData,
          photo: photoUrl,
          dateAdded: new Date().toISOString()
        };

        this.trees.push(newTree);
        return newTree;
      } catch (error) {
        console.error('Error adding tree:', error);
        this.error = 'Failed to add tree';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clean up object URLs when they're no longer needed
    cleanupPhotoUrl(tree) {
      if (tree && tree.photo && tree.photo.startsWith('blob:')) {
        URL.revokeObjectURL(tree.photo);
      }
    }
  }
}); 