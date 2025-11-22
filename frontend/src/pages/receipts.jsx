import React, { useState } from 'react';
import { Truck, Plus, CheckCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Receipts = () => {
  const products = [
    { id: 1, name: 'Steel Rods', sku: 'SR-001' },
    { id: 2, name: 'Wooden Frames', sku: 'WF-102' },
    { id: 3, name: 'Bolts (Pack of 100)', sku: 'BL-500' },
  ];

  const [receipts, setReceipts] = useState([
    { id: 'WH/IN/001', supplier: 'Steel Co. Ltd', product: 'Steel Rods', qty: 50, status: 'Done' },
    { id: 'WH/IN/002', supplier: 'WoodWorks', product: 'Wooden Frames', qty: 20, status: 'Done' },
  ]);

  const [formData, setFormData] = useState({ supplier: '', product: '', qty: '' });

  const handleValidate = (e) => {
    e.preventDefault();
    const newReceipt = {
      id: `WH/IN/00${receipts.length + 1}`,
      supplier: formData.supplier,
      product: formData.product,
      qty: formData.qty,
      status: 'Done'
    };
    setReceipts([newReceipt, ...receipts]);
    setFormData({ supplier: '', product: '', qty: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm">
          <Truck size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Receipts</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage incoming goods from vendors.</p>
        </div>
      </div>

      {/* Action Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Plus size={20} className="text-indigo-500" /> Create New Receipt
        </h2>
        <form onSubmit={handleValidate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Supplier</label>
            <input 
              type="text" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="e.g. Acme Corp"
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Product</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all text-slate-900 dark:text-white cursor-pointer"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                <option value="" className="dark:bg-slate-800">Select Product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.name} className="dark:bg-slate-800">{p.name} ({p.sku})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</label>
            <input 
              type="number" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              placeholder="0"
              value={formData.qty}
              onChange={(e) => setFormData({...formData, qty: e.target.value})}
            />
          </div>

          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex justify-center items-center">
            Validate Receipt
          </button>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-5 font-semibold">Reference</th>
              <th className="p-5 font-semibold">Supplier</th>
              <th className="p-5 font-semibold">Product</th>
              <th className="p-5 font-semibold">Quantity</th>
              <th className="p-5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {receipts.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-5 font-bold text-slate-700 dark:text-slate-200">{r.id}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{r.supplier}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{r.product}</td>
                <td className="p-5 text-emerald-600 dark:text-emerald-400 font-bold">+{r.qty}</td>
                <td className="p-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle size={14} /> {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Receipts;