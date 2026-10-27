import { memo, useMemo, useState } from 'react';
import FoodCard from './FoodCard.jsx';
import { normalizeUserText } from '../utils/safeInput.js';

const EMPTY_FOODS = Object.freeze([]);
const NOOP = () => {};

/** Displays food cards with bounded search input and memoized filtering. */
function FoodList({ foods = EMPTY_FOODS, onAddToCart = NOOP }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');

  const categories = useMemo(
    () => [...new Set(foods.map((food) => food.category).filter(Boolean))].sort(),
    [foods],
  );
  const normalizedSearch = normalizeUserText(search, 100).toLowerCase();
  const filteredFoods = useMemo(() => foods.filter((food) => {
    const text = `${food.name} ${food.description ?? ''} ${food.category ?? ''}`.toLowerCase();
    const matchesSearch = !normalizedSearch || text.includes(normalizedSearch);
    const matchesCategory = category === 'All Categories' || food.category === category;
    return matchesSearch && matchesCategory;
  }), [foods, normalizedSearch, category]);

  return (
    <section className="food-list" aria-label="Food menu">
      <div className="food-filters">
        <label htmlFor="food-search">
          Search food
          <input
            id="food-search"
            name="food-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(normalizeUserText(event.target.value, 100))}
            placeholder="Search by name or description"
            maxLength={100}
            autoComplete="off"
          />
        </label>
        <label htmlFor="food-category">
          Filter by category
          <select id="food-category" name="food-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All Categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {filteredFoods.length ? (
        <div className="food-grid" aria-label="Matching food items">
          {filteredFoods.map((food) => <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />)}
        </div>
      ) : (
        <p role="status" aria-live="polite" className="food-empty-state">No food items found.</p>
      )}
    </section>
  );
}

export default memo(FoodList);
