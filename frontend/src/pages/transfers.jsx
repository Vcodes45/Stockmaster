import React, { useState } from 'react';
import { ArrowRightLeft, MapPin, CheckCircle, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Transfers = () => {
  const [transfers, setTransfers] = useState([
    { id: 'WH/INT/001', from: 'Main Store', to: 'Production Line', product: 'Steel Rods', qty: 20, status: 'Done' },
  ]);

  const [formData, setFormData] = useState({ from: '', to: '', product: '', qty: '' });

  const locations = ['Main Store', 'Production Line', 'Scrap Zone', 'Rack A', 'Rack B'];

  const handleTransfer = (e) => {
    e.preventDefault();
    const newTransfer = {
      id: `WH/INT/00${transfers.length + 1}`,
      ...formData,
      status: 'Done'
    };
    setTransfers([newTransfer, ...transfers]);
    setFormData({ from: '', to: '', product: '', qty: '' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
          <ArrowRightLeft size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Internal Transfers</h1>
          <p className="text-slate-500 dark:text-slate-400">Move stock between warehouse locations.</p>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Plus size={20} className="text-blue-500" /> New Transfer
        </h2>
        <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          
          {/* Source Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">From Location</label>
            <div className="relative">
              <select required className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none dark:text-white"
                value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})}>
                <option value="">Source...</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <MapPin className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Destination Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">To Location</label>
            <div className="relative">
              <select required className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none dark:text-white"
                value={formData.to} onChange={(e) => setFormData({...formData, to: e.target.value})}>
                <option value="">Destination...</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <MapPin className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Product & Qty (Simplified for UI) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Product</label>
            <input type="text" required placeholder="e.g. Steel Rods" className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Quantity</label>
            <input type="number" required placeholder="0" className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
              value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-medium shadow-lg shadow-blue-200 dark:shadow-none">
            Move Stock
          </button>
        </form>
      </div>

      {/* Transfers List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-5">Reference</th>
              <th className="p-5">From</th>
              <th className="p-5">To</th>
              <th className="p-5">Product</th>
              <th className="p-5">Qty</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {transfers.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="p-5 font-bold text-slate-700 dark:text-slate-200">{t.id}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{t.from}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{t.to}</td>
                <td className="p-5 text-slate-600 dark:text-slate-300">{t.product}</td>
                <td className="p-5 font-bold text-blue-600 dark:text-blue-400">{t.qty}</td>
                <td className="p-5"><span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full"><CheckCircle size={12}/> {t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Transfers;