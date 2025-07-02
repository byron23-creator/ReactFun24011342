// src/components/Login.js

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// 1. Acepta 'onLoginSuccess' como prop
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Redirige si el usuario ya está logueado
  useEffect(() => {
    if (localStorage.getItem('userId')) {
      navigate('/productos');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newUserRef = await addDoc(usuariosRef, { email });
        localStorage.setItem('userId', newUserRef.id);
      } else {
        const userId = querySnapshot.docs[0].id;
        localStorage.setItem('userId', userId);
      }
      
      // 2. Llama a la función para actualizar la UI
      onLoginSuccess();
      navigate('/productos');

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div>
      <h2>Ingresar a la Tienda</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;