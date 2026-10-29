import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntakeForm } from '@/components/IntakeForm';

describe('IntakeForm Component', () => {
  it('renders all required form controls and visible labels', () => {
    render(<IntakeForm onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByRole('heading', { name: /event vision & specifications/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guest count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location \/ city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/theme or aesthetic vibe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /craft complete event plan/i })).toBeInTheDocument();
  });

  it('displays field validation errors when submitting with empty required fields', async () => {
    const handleSubmit = vi.fn();
    render(<IntakeForm onSubmit={handleSubmit} isLoading={false} />);

    const submitBtn = screen.getByRole('button', { name: /craft complete event plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/event title must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid date/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with validated data when fields are filled correctly', async () => {
    const handleSubmit = vi.fn();
    render(<IntakeForm onSubmit={handleSubmit} isLoading={false} />);

    fireEvent.change(screen.getByLabelText(/event title/i), {
      target: { value: 'Alex & Jordan Sunset Wedding' },
    });
    fireEvent.change(screen.getByLabelText(/target event date/i), {
      target: { value: '2027-08-15' },
    });
    fireEvent.change(screen.getByLabelText(/guest count/i), {
      target: { value: '120' },
    });
    fireEvent.change(screen.getByLabelText(/total budget/i), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/location \/ city/i), {
      target: { value: 'Sedona, AZ' },
    });
    fireEvent.change(screen.getByLabelText(/theme or aesthetic vibe/i), {
      target: { value: 'Red Rock Bohemian' },
    });

    const submitBtn = screen.getByRole('button', { name: /craft complete event plan/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      const passedData = handleSubmit.mock.calls[0][0];
      expect(passedData.eventTitle).toBe('Alex & Jordan Sunset Wedding');
      expect(passedData.guestCount).toBe(120);
      expect(passedData.totalBudget).toBe(25000);
    });
  });

  it('renders loading state when isLoading is true', () => {
    render(<IntakeForm onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByRole('button', { name: /generating bespoke plan/i })).toBeDisabled();
  });
});
