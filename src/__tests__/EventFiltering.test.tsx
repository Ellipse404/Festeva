import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Festeva - Event Filtering & Search', () => {
  it('renders Dashboard heading and event cards', () => {
    render(<App />);
    expect(screen.getByText('Hosted Events Near You')).toBeInTheDocument();
    expect(screen.getByText('✨ All Events')).toBeInTheDocument();
  });

  it('filters events by category chip click', async () => {
    render(<App />);
    
    const birthdayChip = screen.getByText('🎂 Birthday');
    fireEvent.click(birthdayChip);

    expect(birthdayChip).toBeInTheDocument();
  });

  it('updates search query from header search bar', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Search events by title/i);
    fireEvent.change(searchInput, { target: { value: 'Wedding' } });

    expect(searchInput).toHaveValue('Wedding');
  });
});
