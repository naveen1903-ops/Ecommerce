import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from '../Cart.jsx';

describe('Cart', () => {
  test('shows an empty-cart message when no items are present', () => {
    render(<Cart items={[]} onRemoveFromCart={jest.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Your cart is empty.');
  });

  test('renders cart items, quantities, and the total correctly', () => {
    const items = [
      { id: 1, name: 'Margherita Pizza', price: 12.5, quantity: 2 },
      { id: 2, name: 'French Fries', price: 4.5, quantity: 1 },
    ];
    render(<Cart items={items} onRemoveFromCart={jest.fn()} />);
    expect(screen.getByText('Margherita Pizza × 2')).toBeInTheDocument();
    expect(screen.getByText('French Fries × 1')).toBeInTheDocument();
    expect(screen.getByText('Total: $29.50')).toBeInTheDocument();
  });

  test('calls the remove callback with the selected item ID', async () => {
    const user = userEvent.setup();
    const onRemoveFromCart = jest.fn();
    const items = [{ id: 4, name: 'French Fries', price: 4.5, quantity: 1 }];
    render(<Cart items={items} onRemoveFromCart={onRemoveFromCart} />);
    await user.click(screen.getByRole('button', { name: 'Remove French Fries from cart' }));
    expect(onRemoveFromCart).toHaveBeenCalledTimes(1);
    expect(onRemoveFromCart).toHaveBeenCalledWith(4);
  });
});
