import Link from 'next/link';
import React from 'react';

export default function Productitem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`product/${product.slug}`}>
        <p>
          <img
            src={product.image}
            className="rounded shadow"
            alt={product.name}
          />
        </p>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`product/${product.slug}`}>
          <h1 className="text-lg">{product.name}</h1>
          <p>{product.brand}</p>
          <p>${product.price}</p>
        </Link>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
