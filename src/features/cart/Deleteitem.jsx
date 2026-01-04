import React from 'react'
import Button from '../../ui/Button'
import { useDispatch } from 'react-redux'
import { decreaseitemquantity, removeitem } from './cartSlice';
export default function Deleteitem({id}) {
const dispatch=useDispatch();
  return (
    <div><Button type="small" onClick={()=>dispatch(removeitem(id))}>Delete</Button></div>
  )
}
