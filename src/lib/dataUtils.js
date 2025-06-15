import storesData from '../assets/storesvisible.csv?raw';
import productsData from '../assets/zueggproducts.csv?raw';

// CSV parser that handles both stores and products data correctly
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  
  // Parse headers - they are quoted, so remove quotes
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.replace(/^"|"$/g, ''));
  
  return lines.slice(1).map(line => {
    const obj = {};
    
    // Check if this is a stores CSV (has complex JSON) or products CSV (simple format)
    if (headers.includes('address')) {
      // This is stores CSV - use regex parsing for complex JSON field
      const match = line.match(/^(\d+),(".*?"),([^,]+),([^,]+),(\{[^}]+\}),([^,]+),([^,]+),([^,]+),(.+)$/);
      
      if (match) {
        obj[headers[0]] = parseInt(match[1]); // store_id
        
        // Parse the JSON address field
        let addressJson = match[2];
        if (addressJson.startsWith('"') && addressJson.endsWith('"')) {
          addressJson = addressJson.slice(1, -1); // Remove outer quotes
        }
        
        try {
          // Fix the double quotes in JSON
          const fixedJson = addressJson.replace(/""/g, '"');
          obj[headers[1]] = JSON.parse(fixedJson);
        } catch (e) {
          console.error('Failed to parse address JSON:', addressJson, e);
          obj[headers[1]] = { city: 'Unknown', street: 'Unknown', province: 'Unknown' };
        }
        
        obj[headers[2]] = parseFloat(match[3]); // latitude
        obj[headers[3]] = parseFloat(match[4]); // longitude
        obj[headers[4]] = match[5]; // services
        obj[headers[5]] = match[6]; // centrale
        obj[headers[6]] = match[7]; // gruppo
        obj[headers[7]] = match[8]; // orgcedi
        obj[headers[8]] = match[9]; // insegna
      } else {
        console.error('Failed to parse stores line:', line);
        // Fallback: create empty object with default values
        headers.forEach(header => {
          if (header === 'address') {
            obj[header] = { city: 'Unknown', street: 'Unknown', province: 'Unknown' };
          } else if (header === 'latitude' || header === 'longitude') {
            obj[header] = 0;
          } else if (header === 'store_id') {
            obj[header] = 0;
          } else {
            obj[header] = 'Unknown';
          }
        });
      }
    } else {
      // This is products CSV - use simple parsing approach
      // Pattern: store_id,base_price,promo_price,name,brand
      const parts = line.split(',');
      
      if (parts.length >= 5) {
        obj.store_id = parseInt(parts[0]);
        obj.base_price = parts[1] ? parseInt(parts[1]) : null;
        obj.promo_price = parts[2] ? parseInt(parts[2]) : null;
        
        // Name and brand might contain commas, so join the remaining parts
        const remaining = parts.slice(3);
        let name = '';
        let brand = '';
        
        // Find where the name ends and brand begins
        // Look for the last comma that separates name from brand
        if (remaining.length >= 2) {
          brand = remaining[remaining.length - 1];
          name = remaining.slice(0, -1).join(',');
        } else if (remaining.length === 1) {
          name = remaining[0];
        }
        
        // Clean quotes
        obj.name = name.replace(/^"|"$/g, '');
        obj.brand = brand.replace(/^"|"$/g, '');
      } else {
        console.error('Failed to parse products line:', line);
        // Fallback
        obj.store_id = null;
        obj.base_price = null;
        obj.promo_price = null;
        obj.name = '';
        obj.brand = '';
      }
    }
    
    return obj;
  });
};

// Process stores data
export const processStores = () => {
  const stores = parseCSV(storesData);
  // Filter out stores without valid coordinates
  return stores.filter(store => 
    store.latitude && 
    store.longitude && 
    !isNaN(store.latitude) && 
    !isNaN(store.longitude) &&
    store.latitude !== 0 &&
    store.longitude !== 0
  );
};

// Process products data
export const processProducts = () => {
  return parseCSV(productsData);
};

// Get stores grouped by insegna
export const getStoresByInsegna = (stores) => {
  const grouped = stores.reduce((acc, store) => {
    const insegna = store.insegna || 'Unknown';
    acc[insegna] = (acc[insegna] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([name, count]) => ({ name, count }));
};

// Get stores grouped by gruppo
export const getStoresByGruppo = (stores) => {
  const grouped = stores.reduce((acc, store) => {
    const gruppo = store.gruppo || 'Unknown';
    acc[gruppo] = (acc[gruppo] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([name, count]) => ({ name, count }));
};

// Get unique products for search
export const getUniqueProducts = (products) => {
  const unique = new Map();
  products.forEach(product => {
    if (product.name && !unique.has(product.name)) {
      unique.set(product.name, product);
    }
  });
  return Array.from(unique.values());
};

// Get stores that sell a specific product
export const getStoresForProduct = (stores, products, productName) => {
  const productStoreIds = products
    .filter(p => p.name === productName)
    .map(p => p.store_id);
  
  return stores.filter(store => productStoreIds.includes(store.store_id));
};

// Get price statistics for a product
export const getPriceStats = (products, productName) => {
  const productPrices = products
    .filter(p => p.name === productName && p.base_price)
    .map(p => p.base_price);
  
  if (productPrices.length === 0) return { min: 0, max: 0 };
  
  return {
    min: Math.min(...productPrices),
    max: Math.max(...productPrices)
  };
};

// Generate color based on price (green to red gradient)
export const getPriceColor = (price, minPrice, maxPrice) => {
  if (minPrice === maxPrice) return '#52c41a'; // Green if all same price
  
  const ratio = (price - minPrice) / (maxPrice - minPrice);
  const red = Math.round(255 * ratio);
  const green = Math.round(255 * (1 - ratio));
  
  return `rgb(${red}, ${green}, 0)`;
};

// Format price from cents to euros
export const formatPrice = (priceInCents) => {
  if (!priceInCents) return 'N/A';
  return `€${(priceInCents / 100).toFixed(2)}`;
};

