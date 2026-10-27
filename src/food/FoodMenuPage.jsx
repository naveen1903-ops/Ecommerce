import { useOutletContext } from 'react-router-dom';
import FoodList from './FoodList.jsx';

export default function FoodMenuPage() {
  const { foods, addToCart } = useOutletContext();
  return <FoodList foods={foods} onAddToCart={addToCart} />;
}
