import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BarChart3, Search, Menu, X } from 'lucide-react';
import StoreMap from '../map/StoreMap';
import StoreCountCharts from '../charts/StoreCountCharts';
import ProductSearch from '../search/ProductSearch';
import { useAppContext } from '../../contexts/AppContext';
import LogoImage from '../../assets/zuegg_logo.png'; // Using Zuegg logo

const Dashboard = () => {
  const [selectedKey, setSelectedKey] = useState('search');
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
    <div 
      className="dashboard-layout" 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
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
                <img
                    src={LogoImage}
                    alt="Zuegg Logo"
                    className="h-10 w-auto object-contain"
                />
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


      {/* Layout Container */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden', }}>
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                background: 'rgba(0,0,0,0.5)'
              }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar - Only show on mobile when open */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : '-100%'
          }}
          className="dashboard-sider lg:hidden"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            zIndex: 50,
            width: '256px',
            background: '#f0f2f5',
            borderRight: '1px solid #d9d9d9',
            height: 'calc(100vh - 64px)',
            display: sidebarOpen ? 'flex' : 'none',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 0' }}>
            <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setSelectedKey(item.key);
                      setSidebarOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      background: selectedKey === item.key ? '#1890ff' : 'transparent',
                      color: selectedKey === item.key ? 'white' : '#262626',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedKey !== item.key) {
                        e.target.style.background = '#e6f7ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedKey !== item.key) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    <Icon 
                      size={20} 
                      style={{
                        transition: 'transform 0.2s',
                        transform: selectedKey === item.key ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{item.label}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: selectedKey === item.key ? 'rgba(255,255,255,0.8)' : '#8c8c8c'
                      }}>
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
        <main 
          className="dashboard-content"
          style={{
            flex: 1,
            padding: '46px',
            // background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
            overflow: 'auto',
            height: '100%',
            width: '100%'
          }}
        >
          <div style={{ height: '100%', width: '100%' }}>
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