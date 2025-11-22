import React, { useState } from 'react';
import { Package, Send, CheckCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Deliveries = () => {
  const products = [
    { id: 1, name: 'Steel Rods', sku: 'SR-001', stock: 150 },
    { id: 2, name: 'Wooden Frames', sku: 'WF-102', stock: 45 },
  ];

  const [deliveries, setDeliveries] = useState([
    { id: 'WH/OUT/001', customer: 'BuildIt Construction', product: 'Steel Rods', qty: 10, status: 'Done' },
    { id: 'WH/OUT/002', customer: 'HomeDepot Local', product: 'Wooden Frames', qty: 5, status: 'Waiting' },
  ]);

  const [formData, setFormData] = useState({ customer: '', product: '', qty: '' });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const newDelivery = {
      id: `WH/OUT/00${deliveries.length + 1}`,
      customer: formData.customer,
      product: formData.product,
      qty: formData.qty,
      status: 'Waiting'
    };
    setDeliveries([newDelivery, ...deliveries]);
    setFormData({ customer: '', product: '', qty: '' });
  };

  const markAsDone = (id) => {
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...d, status: 'Done' } : d
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl shadow-sm">
          <Send size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deliveries</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage outgoing orders to customers.</p>
        </div>
      </div>

      {/* Action Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Package size={20} className="text-orange-500" /> Create Delivery Order
        </h2>
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Customer</label>
            <input 
              type="text" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="e.g. John Doe"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Product</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none transition-all text-slate-900 dark:text-white cursor-pointer"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                <option value="" className="dark:bg-slate-800">Select Product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.name} className="dark:bg-slate-800">{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</label>
            <input 
              type="number" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="0"
              value={formData.qty}
              onChange={(e) => setFormData({...formData, qty: e.target.value})}
            />
          </div>

          <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-200 dark:shadow-none flex justify-center items-center">
            Create Order
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-5 font-semibold">Reference</th>
              <th className="p-5 font-semibold">Customer</th>
              <th className="p-5 font-semibold">Product</th>
              <th className="p-5 font-semibold">Quantity</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {deliveries.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-5 font-bold text-slate-700 dark:text-slate-200">{d.id}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{d.customer}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{d.product}</td>
                <td className="p-5 text-red-500 dark:text-red-400 font-bold">-{d.qty}</td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    d.status === 'Done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-5">
                  {d.status !== 'Done' && (
                    <button 
                      onClick={() => markAsDone(d.id)}
                      className="text-xs bg-slate-900 dark:bg-slate-600 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"
                    >
                      Validate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Deliveries;