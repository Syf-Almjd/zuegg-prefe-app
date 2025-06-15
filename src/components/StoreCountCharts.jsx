import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Store, Users } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { getStoresByInsegna, getStoresByGruppo } from '../lib/dataUtils';

const StoreCountCharts = () => {
  const { stores } = useAppContext();

  const { insegnaData, gruppoData, totalStores } = useMemo(() => {
    if (!stores.length) return { insegnaData: [], gruppoData: [], totalStores: 0 };
    
    const insegna = getStoresByInsegna(stores);
    const gruppo = getStoresByGruppo(stores);
    
    return {
      insegnaData: insegna.sort((a, b) => b.count - a.count),
      gruppoData: gruppo.sort((a, b) => b.count - a.count),
      totalStores: stores.length
    };
  }, [stores]);

  const colors = ['#1a365d', '#059669', '#f59e0b', '#8b5cf6', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-primary">
            Stores: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, data, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
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
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Store Analytics</h2>
        <p className="text-gray-600 mt-1">Distribution and insights across store networks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Store}
          title="Total Stores"
          value={totalStores.toLocaleString()}
          subtitle="Across all networks"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          title="Unique Insegnas"
          value={insegnaData.length}
          subtitle="Different store brands"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          title="Unique Groups"
          value={gruppoData.length}
          subtitle="Parent companies"
          delay={0.3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartCard
          title="Stores by Insegna"
          data={insegnaData}
          delay={0.4}
        />
        <ChartCard
          title="Stores by Gruppo"
          data={gruppoData}
          delay={0.5}
        />
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Insegna</h4>
            <p className="text-gray-600">
              <span className="font-semibold text-primary">{insegnaData[0]?.name}</span> leads with{' '}
              <span className="font-semibold">{insegnaData[0]?.count}</span> stores
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Gruppo</h4>
            <p className="text-gray-600">
              <span className="font-semibold text-primary">{gruppoData[0]?.name}</span> operates{' '}
              <span className="font-semibold">{gruppoData[0]?.count}</span> stores
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoreCountCharts;

