import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/vue';
import { afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
}); 