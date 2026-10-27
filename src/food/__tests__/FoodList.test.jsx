import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodList from '../FoodList.jsx';
import { MemoryRouter } from 'react-router-dom';

const foods = [
  { id: 1, name: 'Margherita Pizza', category: 'Pizza', description: 'Tomato and basil', price: 12.5 },
  { id: 2, name: 'Pepperoni Pizza', category: 'Pizza', description: 'Pepperoni and cheese', price: 14 },
  { id: 3, name: 'Veggie Burger', category: 'Burger', description: 'Plant-based burger', price: 9.25 },
];

describe('FoodList', () => {
  test('renders all food cards by default', () => {
    render(<MemoryRouter><FoodList foods={foods} onAddToCart={jest.fn()} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Margherita Pizza' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pepperoni Pizza' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Veggie Burger' })).toBeInTheDocument();
  });

  test('filters food by case-insensitive search text', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><FoodList foods={foods} onAddToCart={jest.fn()} /></MemoryRouter>);
    await user.type(screen.getByRole('searchbox', { name: 'Search food' }), 'veggie');
    expect(screen.getByRole('heading', { name: 'Veggie Burger' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Margherita Pizza' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pepperoni Pizza' })).not.toBeInTheDocument();
  });

  test('filters food by category', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><FoodList foods={foods} onAddToCart={jest.fn()} /></MemoryRouter>);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by category' }), 'Pizza');
    const menu = screen.getByRole('region', { name: 'Food menu' });
    expect(within(menu).getByRole('heading', { name: 'Margherita Pizza' })).toBeInTheDocument();
    expect(within(menu).getByRole('heading', { name: 'Pepperoni Pizza' })).toBeInTheDocument();
    expect(within(menu).queryByRole('heading', { name: 'Veggie Burger' })).not.toBeInTheDocument();
  });

  test('shows an empty-state message when no food matches', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><FoodList foods={foods} onAddToCart={jest.fn()} /></MemoryRouter>);
    await user.type(screen.getByRole('searchbox', { name: 'Search food' }), 'sushi');
    expect(screen.getByRole('status')).toHaveTextContent('No food items found.');
  });
});
