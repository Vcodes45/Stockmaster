import React, { useState } from 'react';
import { Save, Package, Layers, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'Units',
    initialStock: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Product:", formData);
    alert("Product Saved!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
          <Package size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Add new items to your master inventory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Product Name</label>
            <div className="relative">
              <input 
                type="text" required
                className="w-full pl-12 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white font-medium text-lg"
                placeholder="e.g. Industrial Steel Rods"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Box className="absolute left-4 top-4.5 text-slate-400" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">SKU / Reference</label>
            <input 
              type="text" required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="e.g. SR-001"
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</label>
            <div className="relative">
              <select 
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category...</option>
                <option value="raw">Raw Materials</option>
                <option value="finished">Finished Goods</option>
                <option value="spares">Spare Parts</option>
              </select>
              <Layers className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Unit of Measure</label>
            <select 
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            >
              <option value="units">Units</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="m">Meters (m)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Initial Stock</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="0"
              onChange={(e) => setFormData({...formData, initialStock: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-100 dark:border-slate-700 pt-6">
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 dark:shadow-none">
            <Save size={20} /> Save Product
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProduct;