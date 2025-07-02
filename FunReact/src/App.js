// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import { db } from './firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import './App.css';

const PrivateRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

function AppContent() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || cartItems.length === 0) {
      alert("No puedes realizar una orden sin iniciar sesión o si tu carrito está vacío.");
      return;
    }
    const order = {
      userId: userId,
      products: JSON.stringify(cartItems.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        quantity: item.quantity,
      }))),
      createdAt: new Date(),
    };
    try {
      await addDoc(collection(db, 'ordenes'), order);
      alert("¡Orden ingresada con éxito!");
      setCartItems([]);
    } catch (error) {
      console.error("Error al ingresar la orden:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); 
    setIsLoggedIn(false); 
    navigate('/'); 
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/productos">Catálogo</Link>
            <Link to="/ordenes">Mis Órdenes</Link>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </>
        ) : (
          <span>Bienvenido a la Tienda</span>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={onLoginSuccess} />} />
          <Route
            path="/productos"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ProductCatalog addToCart={addToCart} />
                <Cart cartItems={cartItems} handlePlaceOrder={handlePlaceOrder} />
              </PrivateRoute>
            }
          />
          <Route
            path="/ordenes"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <OrderHistory />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;