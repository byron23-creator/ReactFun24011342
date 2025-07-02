import React from 'react';

const Cart = ({ cartItems, handlePlaceOrder }) => {
  const calculateSubtotal = (item) => item.precio * item.quantity;
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id}>
              <span>{item.nombre} - ${item.precio} x {item.quantity} = </span>
              <strong>Subtotal: ${calculateSubtotal(item).toFixed(2)}</strong>
            </div>
          ))}
          <hr />
          <h3>Total General: ${calculateTotal().toFixed(2)}</h3>
          <button onClick={handlePlaceOrder}>Ingresar Orden</button>
        </>
      )}
    </div>
  );
};

export default Cart;