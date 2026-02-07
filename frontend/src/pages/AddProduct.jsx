import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Package, Layers, Box, Loader2, List } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { locationService } from '../services/location.service';
import Loading from '../components/Loading';

const AddProduct = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'UNITS',
    minStockLevel: 10,
    initialStock: 0,
    initialLocation: ''
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  // Fetch internal locations
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations-internal'],
    queryFn: locationService.getInternal,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product created successfully!');
      // Reset form
      setFormData({
        name: '',
        sku: '',
        category: '',
        unit: 'UNITS',
        minStockLevel: 10,
        initialStock: 0,
        initialLocation: ''
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for backend
    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      unitOfMeasure: formData.unit,
      minStockLevel: Number(formData.minStockLevel),
      initialStock: Number(formData.initialStock),
      initialStockLocationId: formData.initialLocation || undefined
    };

    createMutation.mutate(productData);
  };

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  if (categoriesLoading || locationsLoading) {
    return <Loading fullScreen />;
  }

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
                type="text"
                value={formData.name}
                required
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
              type="text"
              value={formData.sku}
              required
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="e.g. SR-001"
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Category *</label>
            <div className="relative">
              <select 
                value={formData.category}
                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Layers className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />
            </div>
            {categories.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                No categories found. Create categories first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Unit of Measure *</label>
            <select 
              value={formData.unit}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              required
            >
              <option value="UNITS">Units</option>
              <option value="KG">Kilograms (kg)</option>
              <option value="LITER">Liters (L)</option>
              <option value="METER">Meters (m)</option>
              <option value="BOX">Boxes</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Minimum Stock Level *</label>
            <input 
              type="number" 
              value={formData.minStockLevel}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="10"
              onChange={(e) => setFormData({...formData, minStockLevel: e.target.value})}
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Initial Stock Quantity</label>
            <input 
              type="number" 
              value={formData.initialStock}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="0"
              onChange={(e) => setFormData({...formData, initialStock: e.target.value})}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Initial Stock Location {formData.initialStock > 0 && '*'}
            </label>
            <select 
              value={formData.initialLocation}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setFormData({...formData, initialLocation: e.target.value})}
              required={formData.initialStock > 0}
            >
              <option value="">Select Location...</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {formData.initialStock > 0 && !formData.initialLocation && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Location required when initial stock &gt; 0
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-100 dark:border-slate-700 pt-6">
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={20} /> Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProduct;