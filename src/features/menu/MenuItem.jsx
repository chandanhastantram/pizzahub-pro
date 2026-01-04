import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { additem, } from '../cart/cartSlice';
import { getcount } from '../cart/cartSlice';
import Deleteitem from '../cart/Deleteitem';
import Updatequantity from '../cart/Updatequantity';
function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentquantity=useSelector(getcount(id));
  const dispatch=useDispatch();
function handleaddtocart(){
  const newItem={
    pizzaId: id,
    name: name,
    quantity: 1,
    unitPrice: unitPrice,
    totalPrice: unitPrice*1
  };
dispatch(additem(newItem));
}
  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(', ')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}
          {currentquantity>0&&<div className="flex items-center gap-3 sm:gap-8"><Updatequantity id={id} currentquantity={currentquantity}/><Deleteitem id={id}/></div>}
          {!soldOut&&currentquantity===0&&<Button type="small" onClick={handleaddtocart}>Add to cart</Button>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
