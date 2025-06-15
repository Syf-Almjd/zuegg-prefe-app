import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Modal, Typography } from 'antd';
import { MapPin, Info, Navigation } from 'lucide-react';
import L from 'leaflet';
import { useAppContext } from '../../contexts/AppContext';
import { getStoresForProduct, getPriceStats, getPriceColor, formatPrice } from '../../lib/dataUtils';

// default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const { Title, Text } = Typography;

const StoreMap = () => {
  const { stores, products, selectedProduct } = useAppContext();
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { displayStores, priceStats } = useMemo(() => {
    if (!selectedProduct) {
      return { displayStores: stores, priceStats: null };
    }

    const filteredStores = getStoresForProduct(stores, products, selectedProduct);
    const stats = getPriceStats(products, selectedProduct);
    
    return { displayStores: filteredStores, priceStats: stats };
  }, [stores, products, selectedProduct]);

  const getMarkerIcon = (store) => {
    if (!selectedProduct || !priceStats) {
      return new L.Icon.Default();
    }

    const storeProduct = products.find(p => 
      p.store_id === store.store_id && p.name === selectedProduct
    );
    
    if (!storeProduct || !storeProduct.base_price) {
      return new L.Icon.Default();
    }

    const color = getPriceColor(storeProduct.base_price, priceStats.min, priceStats.max);
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transform: scale(1); transition: transform 0.2s ease;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getPopupContent = (store) => {
    const address = store.address || {};
    let content = `
      <div class="p-2">
        <div class="font-semibold text-gray-900 mb-1">${address.street || 'Unknown Street'}</div>
        <div class="text-sm text-gray-600 mb-2">${address.city || 'Unknown City'}, ${address.province || 'Unknown Province'}</div>
        <div class="text-xs text-gray-500 mb-2">${store.insegna || 'Unknown'} • ${store.gruppo || 'Unknown'}</div>
    `;

    if (selectedProduct) {
      const storeProduct = products.find(p => 
        p.store_id === store.store_id && p.name === selectedProduct
      );
      
      if (storeProduct) {
        content += `
          <div class="border-t pt-2 mt-2">
            <div class="text-sm font-medium text-gray-900">Price: ${formatPrice(storeProduct.base_price)}</div>`;
        if (storeProduct.promo_price) {
          content += `<div class="text-sm text-green-600">Promo: ${formatPrice(storeProduct.promo_price)}</div>`;
        }
        content += `</div>`;
      }
    }

    content += '</div>';
    return content;
  };

  const handleMarkerClick = (store) => {
    setSelectedStore(store);
    setModalVisible(true);
  };

  const modalContent = selectedStore && (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Store #{selectedStore.store_id}</h3>
          <p className="text-sm text-gray-500">{selectedStore.insegna} • {selectedStore.gruppo}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Navigation className="w-4 h-4 mr-2" />
            Address
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{selectedStore.address?.street || 'N/A'}</p>
            <p>{selectedStore.address?.city || 'N/A'}, {selectedStore.address?.province || 'N/A'}</p>
            <p>{selectedStore.address?.postalCode || 'N/A'}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Store Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Insegna:</span>
              <span className="ml-2 text-gray-900">{selectedStore.insegna || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Gruppo:</span>
              <span className="ml-2 text-gray-900">{selectedStore.gruppo || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Centrale:</span>
              <span className="ml-2 text-gray-900">{selectedStore.centrale || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Services:</span>
              <span className="ml-2 text-gray-900">{selectedStore.services || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!stores.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-96"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </motion.div>
    );
  }

  // Calculate center of all stores
  const center = [
    stores.reduce((sum, store) => sum + store.latitude, 0) / stores.length,
    stores.reduce((sum, store) => sum + store.longitude, 0) / stores.length
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Locations</h2>
          {selectedProduct && (
            <p className="text-gray-600 mt-1">Showing stores for: <span className="font-medium">{selectedProduct}</span></p>
          )}
        </div>
        
        {selectedProduct && priceStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 shadow-sm border"
          >
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Price Range</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-16 h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{formatPrice(priceStats.min)}</span>
                  <span>{formatPrice(priceStats.max)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="h-[600px] rounded-xl overflow-hidden shadow-lg border bg-white"
      >
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {displayStores.map((store, index) => (
            <Marker
              key={store.store_id}
              position={[store.latitude, store.longitude]}
              icon={getMarkerIcon(store)}
              eventHandlers={{
                click: () => handleMarkerClick(store),
              }}
            >
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: getPopupContent(store) }} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      {/* Store Details Modal */}
      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className="modern-modal"
      >
        {modalContent}
      </Modal>
    </motion.div>
  );
};

export default StoreMap;

