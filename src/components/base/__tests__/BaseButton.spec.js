import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
  it('renders with default props', () => {
    const { getByRole } = render(BaseButton, {
      slots: {
        default: 'Click me'
      }
    });

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('base-button');
    expect(button).toHaveClass('base-button--primary');
  });

  it('renders with secondary variant', () => {
    const { getByRole } = render(BaseButton, {
      props: {
        variant: 'secondary'
      },
      slots: {
        default: 'Click me'
      }
    });

    const button = getByRole('button');
    expect(button).toHaveClass('base-button--secondary');
  });

  it('renders in loading state', () => {
    const { getByRole } = render(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading...'
      }
    });

    const button = getByRole('button');
    expect(button).toHaveClass('base-button--loading');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders in disabled state', () => {
    const { getByRole } = render(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    });

    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders with full width', () => {
    const { getByRole } = render(BaseButton, {
      props: {
        fullWidth: true
      },
      slots: {
        default: 'Full width'
      }
    });

    const button = getByRole('button');
    expect(button).toHaveClass('base-button--full-width');
  });

  it('emits click event when clicked', async () => {
    const { getByRole, emitted } = render(BaseButton, {
      slots: {
        default: 'Click me'
      }
    });

    const button = getByRole('button');
    await fireEvent.click(button);

    expect(emitted()).toHaveProperty('click');
  });

  it('does not emit click event when disabled', async () => {
    const { getByRole, emitted } = render(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Click me'
      }
    });

    const button = getByRole('button');
    await fireEvent.click(button);

    expect(emitted()).not.toHaveProperty('click');
  });

  it('does not emit click event when loading', async () => {
    const { getByRole, emitted } = render(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Click me'
      }
    });

    const button = getByRole('button');
    await fireEvent.click(button);

    expect(emitted()).not.toHaveProperty('click');
  });

  it('renders with left icon', () => {
    const { container } = render(BaseButton, {
      slots: {
        default: 'With icon',
        'icon-left': '<span data-testid="left-icon">Icon</span>'
      }
    });

    expect(container.querySelector('[data-testid="left-icon"]')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const { container } = render(BaseButton, {
      slots: {
        default: 'With icon',
        'icon-right': '<span data-testid="right-icon">Icon</span>'
      }
    });

    expect(container.querySelector('[data-testid="right-icon"]')).toBeInTheDocument();
  });
}); 