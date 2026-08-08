import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Festeva - Host Event Form', () => {
  it('allows filling out the host event form fields', () => {
    render(<App />);

    const hostBtn = screen.getAllByText('Host Event')[0];
    fireEvent.click(hostBtn);

    const titleInput = screen.getByPlaceholderText(/e.g. Sanya's Grand 21st Birthday Bash/i);
    fireEvent.change(titleInput, { target: { value: 'Grand Summer Music Night' } });
    expect(titleInput).toHaveValue('Grand Summer Music Night');

    const addressInput = screen.getByPlaceholderText(/e.g. Royal Crystal Palace/i);
    fireEvent.change(addressInput, { target: { value: 'Downtown Concert Hall' } });
    expect(addressInput).toHaveValue('Downtown Concert Hall');
  });
});
