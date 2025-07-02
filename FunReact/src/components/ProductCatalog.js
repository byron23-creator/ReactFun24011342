import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const ProductCatalog = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'productos');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      const initialQuantities = productList.reduce((acc, product) => {
        acc[product.id] = 1;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prev => ({ ...prev, [productId]: parseInt(quantity) }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > 0) {
      addToCart(product, quantity);
      alert(`${product.nombre} agregado al carrito!`);
    }
  };

  return (
    <div>
      <h2>Catálogo de Productos</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <img src={product.imagen} alt={product.nombre} width="150" />
            <h3>{product.nombre}</h3>
            <p>Precio: ${product.precio}</p>
            <input
              type="number"
              min="1"
              value={quantities[product.id] || 1}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            />
            <button onClick={() => handleAddToCart(product)}>Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;