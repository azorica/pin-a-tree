import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import { createRouter, createWebHistory } from 'vue-router';
import TreeCard from '../TreeCard.vue';

// Mock tree data
const mockTree = {
  id: '1',
  name: 'Mighty Oak',
  species: 'Quercus robur',
  dateAdded: '2024-03-25T10:00:00Z',
  location: {
    lat: 51.5074,
    lng: -0.1278,
    address: 'Hyde Park, London'
  },
  photo: '/mock-images/oak.jpg',
  description: 'A beautiful oak tree planted in Hyde Park'
};

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/tree/:id',
      name: 'tree-details',
      component: { template: '<div>Tree Details</div>' }
    }
  ]
});

describe('TreeCard', () => {
  it('renders tree information correctly', () => {
    const { getByText, getByAltText } = render(TreeCard, {
      props: {
        tree: mockTree
      },
      global: {
        plugins: [router]
      }
    });

    // Check if tree name is rendered
    expect(getByText('Mighty Oak')).toBeInTheDocument();

    // Check if species is rendered
    expect(getByText('Quercus robur')).toBeInTheDocument();

    // Check if location is rendered
    expect(getByText('Hyde Park, London')).toBeInTheDocument();

    // Check if date is rendered
    expect(getByText('March 25, 2024')).toBeInTheDocument();

    // Check if description is rendered
    expect(getByText('A beautiful oak tree planted in Hyde Park')).toBeInTheDocument();

    // Check if image is rendered with correct alt text
    expect(getByAltText('Mighty Oak')).toHaveAttribute('src', '/mock-images/oak.jpg');
  });

  it('navigates to tree details when clicked', async () => {
    const { getByRole } = render(TreeCard, {
      props: {
        tree: mockTree
      },
      global: {
        plugins: [router]
      }
    });

    // Mock router push
    const routerPushSpy = vi.spyOn(router, 'push');

    // Click the card
    await fireEvent.click(getByRole('article'));

    // Check if router.push was called with correct path
    expect(routerPushSpy).toHaveBeenCalledWith('/tree/1');
  });

  it('validates tree prop', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Render with invalid tree data
    render(TreeCard, {
      props: {
        tree: {
          // Missing required properties
          id: '1',
          name: 'Test Tree'
        }
      },
      global: {
        plugins: [router]
      }
    });

    // Check if validation error was logged
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('handles missing optional properties gracefully', () => {
    const minimalTree = {
      id: '1',
      name: 'Minimal Tree',
      photo: '/mock-images/tree.jpg',
      location: {
        lat: 0,
        lng: 0,
        address: 'Test Location'
      }
    };

    const { queryByText } = render(TreeCard, {
      props: {
        tree: minimalTree
      },
      global: {
        plugins: [router]
      }
    });

    // Check that optional fields are not rendered
    expect(queryByText('Species:')).not.toBeInTheDocument();
    expect(queryByText('Description:')).not.toBeInTheDocument();
  });
}); 