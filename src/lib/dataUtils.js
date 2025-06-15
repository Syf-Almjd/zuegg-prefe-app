import Papa from 'papaparse';
import storesData from '../assets/storesvisible.csv?raw';
import productsData from '../assets/zueggproducts.csv?raw';

// General CSV parser
export const parseCSV = (csvText) => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  return result.data.map((row) => {
    const obj = {};

    for (const key in row) {
      let value = row[key];

      if (key === 'address') {
        try {
          // Handle case where address is already a parsed object
          if (typeof value === 'object' && value !== null) {
            obj[key] = value;
          } else if (typeof value === 'string') {
            const trimmed = value.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
            obj[key] = JSON.parse(trimmed);
          } else {
            throw new Error('Invalid address type');
          }

          // Check for empty address content
          const addr = obj[key];
          if (
            typeof addr !== 'object' ||
            Object.values(addr).every((v) => v === '' || v === null)
          ) {
            throw new Error('Address is empty');
          }
        } catch (e) {
          console.error('Failed to parse address JSON:', value);
          obj[key] = {
            city: 'Unknown',
            street: 'Unknown',
            province: 'Unknown',
            postalCode: 'Unknown',
          };
        }
      } else {
        obj[key] = value;
      }
    }

    return obj;
  });
};

// Process stores data
export const processStores = () => {
  const stores = parseCSV(storesData);
  const filtered = stores.filter(
    (store) =>
      store.latitude &&
      store.longitude &&
      !isNaN(store.latitude) &&
      !isNaN(store.longitude)
  );

  // Optional: remove duplicates by store_id
  const uniqueStores = Array.from(new Map(filtered.map((s) => [s.store_id, s])).values());

  return uniqueStores;
};

// Process products data
export const processProducts = () => parseCSV(productsData);

// Grouping helpers
export const getStoresByInsegna = (stores) => {
  const grouped = stores.reduce((acc, s) => {
    const key = s.insegna || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(grouped).map(([name, count]) => ({ name, count }));
};

export const getStoresByGruppo = (stores) => {
  const grouped = stores.reduce((acc, s) => {
    const key = s.gruppo || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(grouped).map(([name, count]) => ({ name, count }));
};

// Unique products
export const getUniqueProducts = (products) => {
  const seen = new Map();
  for (const p of products) {
    if (p.name && !seen.has(p.name)) {
      seen.set(p.name, p);
    }
  }
  return [...seen.values()];
};

// Filter stores that sell a product
export const getStoresForProduct = (stores, products, productName) => {
  const storeIds = products.filter((p) => p.name === productName).map((p) => p.store_id);
  return stores.filter((store) => storeIds.includes(store.store_id));
};

// Get price stats
export const getPriceStats = (products, productName) => {
  const prices = products
    .filter((p) => p.name === productName && typeof p.base_price === 'number')
    .map((p) => p.base_price);
  return prices.length
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : { min: 0, max: 0 };
};

// Price color utility
export const getPriceColor = (price, min, max) => {
  if (min === max) return '#52c41a'; // all same price
  const ratio = (price - min) / (max - min);
  const r = Math.round(255 * ratio);
  const g = Math.round(255 * (1 - ratio));
  return `rgb(${r}, ${g}, 0)`;
};

// Price formatter
export const formatPrice = (cents) =>
  cents ? `€${(cents / 100).toFixed(2)}` : 'N/A';
