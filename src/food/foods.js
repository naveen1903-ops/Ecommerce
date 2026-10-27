export const FOOD_ITEMS = Object.freeze([
  Object.freeze({ id: 1, name: 'Margherita Pizza', category: 'Pizza', description: 'Classic tomato, mozzarella, and basil.', price: 12.5, image: '/images/margherita-pizza.svg' }),
  Object.freeze({ id: 2, name: 'Pepperoni Pizza', category: 'Pizza', description: 'Pizza topped with pepperoni and melted cheese.', price: 14, image: '/images/pepperoni-pizza.svg' }),
  Object.freeze({ id: 3, name: 'Veggie Burger', category: 'Burger', description: 'Plant-based patty with crisp fresh vegetables.', price: 9.25, image: '/images/veggie-burger.svg' }),
  Object.freeze({ id: 4, name: 'French Fries', category: 'Sides', description: 'Crispy golden potatoes with a light seasoning.', price: 4.5, image: '/images/french-fries.svg' }),
]);

export function findFoodById(id) {
  return FOOD_ITEMS.find((food) => String(food.id) === String(id)) || null;
}
