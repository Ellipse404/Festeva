import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Festeva - Ticket Purchase & Navigation', () => {
  it('switches navigation to Attend Event / My Tickets', () => {
    render(<App />);

    const attendBtns = screen.getAllByText('Attend Event');
    fireEvent.click(attendBtns[0]);

    expect(screen.getByText('My Attending Events & Tickets')).toBeInTheDocument();
  });

  it('switches navigation to Host Event', () => {
    render(<App />);

    const hostBtns = screen.getAllByText('Host Event');
    fireEvent.click(hostBtns[0]);

    expect(screen.getByText('Host Your Event on Festeva')).toBeInTheDocument();
  });
});
