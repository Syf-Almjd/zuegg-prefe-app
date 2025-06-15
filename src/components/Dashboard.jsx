import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BarChart3, Search, Menu, X } from 'lucide-react';
import StoreMap from './StoreMap';
import StoreCountCharts from './StoreCountCharts';
import ProductSearch from './ProductSearch';
import { useAppContext } from '../contexts/AppContext';

const Dashboard = () => {
  const [selectedKey, setSelectedKey] = useState('map');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAppContext();

  const menuItems = [
    {
      key: 'map',
      icon: MapPin,
      label: 'Store Map',
      description: 'Explore store locations'
    },
    {
      key: 'charts',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Store insights & data'
    },
    {
      key: 'search',
      icon: Search,
      label: 'Product Search',
      description: 'Find products & prices'
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-96 space-y-4"
        >
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading store and product data...</p>
        </motion.div>
      );
    }

    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    switch (selectedKey) {
      case 'map':
        return (
          <motion.div
            key="map"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            <StoreMap />
          </motion.div>
        );
      case 'charts':
        return (
          <motion.div
            key="charts"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            <StoreCountCharts />
          </motion.div>
        );
      case 'search':
        return (
          <motion.div
            key="search"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            <ProductSearch />
          </motion.div>
        );
      default:
        return <StoreMap />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Prefe BI</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Zuegg - Prefe BI</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedKey(item.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedKey === item.key
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : '-100%'
          }}
          className={`lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:block ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col h-full pt-20 lg:pt-6">
            <div className="flex-1 px-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSelectedKey(item.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      selectedKey === item.key
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-transform duration-200 ${
                        selectedKey === item.key ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${
                        selectedKey === item.key ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

