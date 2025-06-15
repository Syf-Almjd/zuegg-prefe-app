import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoComplete, Input } from 'antd';
import { Search, Package, TrendingUp, MapPin, Euro } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getUniqueProducts, getStoresForProduct, getPriceStats, formatPrice } from '../lib/dataUtils';

const ProductSearch = () => {
  const { stores, products, selectedProduct, setSelectedProduct } = useAppContext();
  const [searchValue, setSearchValue] = useState('');

  const uniqueProducts = useMemo(() => {
    return getUniqueProducts(products);
  }, [products]);

  const searchOptions = useMemo(() => {
    if (!searchValue) return [];
    
    return uniqueProducts
      .filter(product => 
        product.name && product.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, 10)
      .map(product => ({
        value: product.name,
        label: (
          <div className="flex items-center justify-between py-1">
            <span className="font-medium">{product.name}</span>
            <span className="text-xs text-gray-500">
              {products.filter(p => p.name === product.name).length} stores
            </span>
          </div>
        ),
      }));
  }, [searchValue, uniqueProducts, products]);

  const productAnalysis = useMemo(() => {
    if (!selectedProduct) return null;

    const productStores = getStoresForProduct(stores, products, selectedProduct);
    const priceStats = getPriceStats(products, selectedProduct);
    const productPrices = products
      .filter(p => p.name === selectedProduct && p.base_price)
      .map(p => p.base_price);
    
    const avgPrice = productPrices.length > 0 
      ? productPrices.reduce((sum, price) => sum + price, 0) / productPrices.length 
      : 0;

    const promoCount = products.filter(p => 
      p.name === selectedProduct && p.promo_price
    ).length;

    return {
      storeCount: productStores.length,
      priceStats,
      avgPrice,
      promoCount,
      promoPercentage: productStores.length > 0 ? (promoCount / productStores.length) * 100 : 0
    };
  }, [selectedProduct, stores, products]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSelect = (value) => {
    setSelectedProduct(value);
    setSearchValue(value);
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setSearchValue('');
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary', delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 bg-${color === 'primary' ? 'primary' : color}/10 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color === 'primary' ? 'primary' : color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Search</h2>
        <p className="text-gray-600 mt-1">Find products and analyze pricing across stores</p>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Search Products</h3>
            <p className="text-sm text-gray-500">Search from {uniqueProducts.length} available products</p>
          </div>
        </div>

        <div className="space-y-4">
          <AutoComplete
            value={searchValue}
            options={searchOptions}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Type to search for products..."
            className="w-full"
            size="large"
            allowClear
            onClear={clearSelection}
          >
            <Input
              size="large"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              className="rounded-lg"
            />
          </AutoComplete>

          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-gray-900">Selected Product</p>
                  <p className="text-sm text-gray-600">{selectedProduct}</p>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Clear selection</span>
                ×
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {productAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={MapPin}
                title="Available Stores"
                value={productAnalysis.storeCount}
                subtitle="Stores selling this product"
                delay={0.2}
              />
              <StatCard
                icon={Euro}
                title="Average Price"
                value={formatPrice(Math.round(productAnalysis.avgPrice))}
                subtitle="Across all stores"
                color="green-600"
                delay={0.3}
              />
              <StatCard
                icon={TrendingUp}
                title="Price Range"
                value={`${formatPrice(productAnalysis.priceStats.min)} - ${formatPrice(productAnalysis.priceStats.max)}`}
                subtitle="Min to max pricing"
                color="blue-600"
                delay={0.4}
              />
              <StatCard
                icon={Package}
                title="Promotions"
                value={`${productAnalysis.promoCount} (${Math.round(productAnalysis.promoPercentage)}%)`}
                subtitle="Stores with promos"
                color="amber-600"
                delay={0.5}
              />
            </div>

            {/* Price Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(productAnalysis.priceStats.min)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Lowest Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(Math.round(productAnalysis.avgPrice))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Average Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(productAnalysis.priceStats.max)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Highest Price</div>
                </div>
              </div>
              
              {productAnalysis.promoCount > 0 && (
                <div className="mt-6 p-4 bg-white/60 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-amber-600">{productAnalysis.promoCount}</span> stores 
                    ({Math.round(productAnalysis.promoPercentage)}%) are currently offering promotional prices for this product.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Map Integration Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-medium text-gray-900">Map Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Switch to the Store Map view to see the geographic distribution of stores selling this product, 
                    with color-coded markers indicating price ranges.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for a Product</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Use the search box above to find products and analyze their pricing across different stores.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductSearch;

