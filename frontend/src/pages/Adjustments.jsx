import React, { useState } from 'react';
import { Search, Scan, CheckCircle, AlertTriangle } from 'lucide-react';

const Adjustments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [adjustmentMode, setAdjustmentMode] = useState('manual'); // 'manual' or 'scanning'

  // Sample inventory data
  const [inventory, setInventory] = useState([
    {
      id: 'P001',
      name: 'iPhone 13',
      category: 'Electronics',
      systemStock: 25,
      physicalCount: 23,
      lastCounted: '2024-01-15',
      status: 'shortage'
    },
    {
      id: 'P002', 
      name: 'MacBook Pro',
      category: 'Electronics',
      systemStock: 10,
      physicalCount: 12,
      lastCounted: '2024-01-14',
      status: 'overage'
    },
    {
      id: 'P003',
      name: 'Apple Watch',
      category: 'Accessories',
      systemStock: 30,
      physicalCount: 30,
      lastCounted: '2024-01-16',
      status: 'accurate'
    },
    {
      id: 'P004',
      name: 'AirPods Pro',
      category: 'Accessories',
      systemStock: 50,
      physicalCount: 48,
      lastCounted: '2024-01-13',
      status: 'shortage'
    }
  ]);

  const filteredItems = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhysicalCountUpdate = (id, newCount) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, physicalCount: parseInt(newCount) || 0 };
        // Update status based on comparison
        if (updated.physicalCount === updated.systemStock) {
          updated.status = 'accurate';
        } else if (updated.physicalCount > updated.systemStock) {
          updated.status = 'overage';
        } else {
          updated.status = 'shortage';
        }
        return updated;
      }
      return item;
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accurate':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shortage':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'overage':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accurate':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'shortage':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'overage':
        return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Adjustments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and adjust inventory counts based on physical audits
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setAdjustmentMode('manual')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              adjustmentMode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Manual Count
          </button>
          <button
            onClick={() => setAdjustmentMode('scanning')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              adjustmentMode === 'scanning'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <Scan className="w-4 h-4" />
            Scan Mode
          </button>
        </div>
      </div>

      {/* Adjustment Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  System Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Physical Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Counted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => {
                const difference = item.physicalCount - item.systemStock;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.id} • {item.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.systemStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.physicalCount}
                        onChange={(e) => handlePhysicalCountUpdate(item.id, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        difference > 0 ? 'text-green-600 dark:text-green-400' :
                        difference < 0 ? 'text-red-600 dark:text-red-400' :
                        'text-gray-900 dark:text-white'
                      }`}>
                        {difference > 0 ? `+${difference}` : difference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.lastCounted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Accurate</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {inventory.filter(item => item.status === 'accurate').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <div className="text-sm font-medium text-red-800 dark:text-red-200">Shortages</div>
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {inventory.filter(item => item.status === 'shortage').length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Overages</div>
              <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {inventory.filter(item => item.status === 'overage').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adjustments;