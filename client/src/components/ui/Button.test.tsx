import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary-600');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });
});