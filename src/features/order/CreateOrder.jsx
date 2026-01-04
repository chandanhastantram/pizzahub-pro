import { useState } from 'react';
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { gettotalcartprice } from '../cart/cartSlice';
import { clearcart } from '../cart/cartSlice';
import {formatCurrency} from "../../utils/helpers"
import { fetchAddress } from '../user/userSlice';
// Phone number validation using regex
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const cart = useSelector((state) => state.cart.cart);
  const {username,status:addressStatus,position,address,error:erroraddress} = useSelector((state) => state.user);const isloadingAddress = addressStatus === 'loading';
  console.log(addressStatus,address,position);
  const formErrors = useActionData();

  const [withPriority, setWithPriority] = useState(false);
const cartprice=useSelector(gettotalcartprice);
const priorityprice=withPriority?cartprice*0.2:0;
const totalprice=cartprice+priorityprice;
const dispatch=useDispatch();
  // Correct logic to check if cart is empty
  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let's go!
      </h2>
      <Form method="POST" action="/order/new">
        {/* Customer Name */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            required
            defaultValue={username}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input w-full"
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
              disabled={isloadingAddress}
              defaultValue={address}
            />
            {addressStatus==='error' && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
There was a error grtting your address make sure you fill this field
              </p>
            )}
          </div>
          {!position.latitude&&!position.longitude&&<span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px] "><Button type="small"onClick={(e)=>{e.preventDefault();dispatch(fetchAddress());}}>getposition</Button></span>}
        </div>

        {/* Priority Checkbox */}
        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value="true"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        {/* Hidden Cart Field */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="position" value={position.longitude&&position.latitude&&`${position.latitude},${position.longitude}`} />
        {/* Submit Button */}
        <Button disabled={isSubmitting||isloadingAddress} type="primary">
          {isSubmitting ? 'Placing order...' : `Order now from ${formatCurrency(totalprice)}`}
        </Button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';
  }

  // If there are validation errors, return them to be shown in the UI
  if (Object.keys(errors).length > 0) return errors;

  // If valid, send order to API
  const newOrder = await createOrder(order);
store.dispatch(clearcart());
  // Redirect to the new order summary page
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
