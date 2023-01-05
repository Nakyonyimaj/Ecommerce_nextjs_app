import Link from 'next/link';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItem = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateCartHandler = async (item,qty)=>{
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry Product is out of stock');
      return
    }
    dispatch({type:"CART_ADD_ITEM",payload:{...item , quantity}});
    toast.success('Product updated successfully');


  }
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is Empty<Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-right">Quantity</th>
                  <th className=" text-right">Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b border-gray-500 ">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <p className="flex items-center px-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            width="50"
                            height="50"
                          />
                          &nbsp;
                          {item.name}
                        </p>
                      </Link>
                    </td>
                    <td className="text-right">
                      
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                          ))}
                        </select>
                      
                    </td>
                    <td className="text-right">{item.price}</td>
                    <td className="text-center">
                      <button onClick={() => removeItem(item)}>
                        <IoIosRemoveCircleOutline className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5 h-40 bg-white">
            <ul>
              <li>
                <div className="pb-3">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :$
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}
export default dynamic(()=>Promise.resolve(CartScreen),{ssr:false});
