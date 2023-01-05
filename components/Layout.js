import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import DropdownLink from './DropdownLink';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function Layout({ children, title }) {
  const { status, data: session } = useSession();

  const { state ,dispatch} = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setcartItemsCount] = useState(0);
  useEffect(() => {
    setcartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutHandler = ()=>{
    Cookies.remove('cart');
    dispatch({type:'CART_REST'})
    signOut({callbackUrl:'/login'})
  }
  return (
    <>
      <Head>
        <title>{title ? title + '-Amazon' : 'Amazon'}</title>
        <meta name="description" content="Ecommerce Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 items-center px-4  justify-between shadow-md fixed w-full bg-white">
            <Link href="/">
              <p className="text-lg font-bold">amazon</p>
            </Link>
            <div className="flex">
              <Link href="/cart">
                <p className="px-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </p>
              </Link>
              {status === 'loading' ? (
                '...Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <p className="dropdown-link" href="#" onClick={logoutHandler}>
                        Logout
                      </p>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <p className="px-2">login</p>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto  mt-14 px-4">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          Copyright @ majorine 2022 Amazon
        </footer>
      </div>
    </>
  );
}
