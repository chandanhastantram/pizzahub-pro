import React from 'react'
import Button from '../../ui/Button'
import { useDispatch } from 'react-redux'
import { increaseitemquantity, decreaseitemquantity } from './cartSlice';
export default function Updatequantity({id,currentquantity}) {
    const dispatch=useDispatch();
  return (
    <div className="flex gap-1 items-center gap-2 md:gap-3">
      <Button type="round" onClick={()=>dispatch(decreaseitemquantity(id))}>-</Button><span className="font-bold">{currentquantity}</span>
      <Button type="round" onClick={()=>dispatch(increaseitemquantity(id))}>+</Button>
    </div>
  )
}
