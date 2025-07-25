import BaseButton from '../components/base/BaseButton.vue';
import { Upload } from 'lucide-vue-next';

export default {
  title: 'Components/Base/Button',
  component: BaseButton,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary'] },
      description: 'The button style variant'
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width'
    },
    type: {
      control: { type: 'select', options: ['button', 'submit', 'reset'] },
      description: 'The HTML button type'
    },
    default: {
      control: 'text',
      description: 'Button content'
    }
  }
};

// Primary button
export const Primary = {
  args: {
    variant: 'primary',
    default: 'Primary Button'
  }
};

// Secondary button
export const Secondary = {
  args: {
    variant: 'secondary',
    default: 'Secondary Button'
  }
};

// Loading state
export const Loading = {
  args: {
    variant: 'primary',
    loading: true,
    default: 'Loading...'
  }
};

// Disabled state
export const Disabled = {
  args: {
    variant: 'primary',
    disabled: true,
    default: 'Disabled Button'
  }
};

// Full width
export const FullWidth = {
  args: {
    variant: 'primary',
    fullWidth: true,
    default: 'Full Width Button'
  }
};

// With left icon
export const WithLeftIcon = {
  render: (args) => ({
    components: { BaseButton, Upload },
    setup() {
      return { args };
    },
    template: `
      <BaseButton v-bind="args">
        <template #icon-left>
          <Upload />
        </template>
        {{ args.default }}
      </BaseButton>
    `
  }),
  args: {
    variant: 'primary',
    default: 'Upload'
  }
};

// With right icon
export const WithRightIcon = {
  render: (args) => ({
    components: { BaseButton, Upload },
    setup() {
      return { args };
    },
    template: `
      <BaseButton v-bind="args">
        {{ args.default }}
        <template #icon-right>
          <Upload />
        </template>
      </BaseButton>
    `
  }),
  args: {
    variant: 'primary',
    default: 'Upload'
  }
}; 