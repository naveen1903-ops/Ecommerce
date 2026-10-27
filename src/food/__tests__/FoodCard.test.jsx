import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodCard from '../FoodCard.jsx';
import { MemoryRouter } from 'react-router-dom';

const food = {
  id: 1,
  name: 'Margherita Pizza',
  category: 'Pizza',
  description: 'Tomato, mozzarella, and basil.',
  price: 12.5,
};

describe('FoodCard', () => {
  test('renders food information and formatted price correctly', () => {
    render(<MemoryRouter><FoodCard food={food} onAddToCart={jest.fn()} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Margherita Pizza' })).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Tomato, mozzarella, and basil.')).toBeInTheDocument();
    expect(screen.getByText('$12.50')).toBeInTheDocument();
  });

  test('calls the add-to-cart callback with the selected food', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    render(<MemoryRouter><FoodCard food={food} onAddToCart={onAddToCart} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Add Margherita Pizza to cart' }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(food);
  });
});
