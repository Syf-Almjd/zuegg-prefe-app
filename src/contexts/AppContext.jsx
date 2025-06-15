import React, { createContext, useContext, useState, useEffect } from 'react';
import { processStores, processProducts, getUniqueProducts } from '../lib/dataUtils';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW state: track whether user entered the app (e.g., after WelcomePage)
  const [hasEntered, setHasEntered] = useState(false);
  const enterApp = () => setHasEntered(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storesData = processStores();
        const productsData = processProducts();
        const uniqueProductsData = getUniqueProducts(productsData);

        setStores(storesData);
        setProducts(productsData);
        setUniqueProducts(uniqueProductsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const value = {
    stores,
    products,
    uniqueProducts,
    selectedProduct,
    setSelectedProduct,
    loading,
    hasEntered,       // exposed to consumer
    enterApp          // function to set hasEntered true
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
