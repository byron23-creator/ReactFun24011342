// src/components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const ordersRef = collection(db, 'ordenes');
      const q = query(ordersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const userOrders = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Parsear los productos y calcular el total de la orden
        const products = JSON.parse(data.products);
        const total = products.reduce((sum, item) => sum + item.precio * item.quantity, 0);
        return { id: doc.id, ...data, products, total };
      });
      setOrders(userOrders);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Mis Órdenes</h2>
      {orders.length === 0 ? <p>No has realizado ninguna orden.</p> : (
        orders.map(order => (
          <div key={order.id} className="order-item">
            <h4>Orden ID: {order.id}</h4>
            {order.products.map(product => (
              <div key={product.id} className="order-product">
                <img src={product.imagen} alt={product.nombre} width="50" />
                <p>{product.nombre} - ${product.precio} x {product.quantity}</p>
              </div>
            ))}
            <strong>Total de la Orden: ${order.total.toFixed(2)}</strong>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;