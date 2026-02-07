import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { operationService } from "../services/operation.service";
import { productService } from "../services/product.service";
import { locationService } from "../services/location.service";
import Loading from "../components/Loading";

export default function Adjustments() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    sourceLocation: "",
    destinationLocation: "",
    products: [{ product: "", quantity: "" }],
    notes: "",
  });

  // Queries
  const { data: adjustments, isLoading: loadingAdjustments } = useQuery({
    queryKey: ["adjustments"],
    queryFn: operationService.getAdjustments,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const { data: internalLocations } = useQuery({
    queryKey: ["internal-locations"],
    queryFn: locationService.getInternal,
  });

  const { data: inventoryLossLocations } = useQuery({
    queryKey: ["inventory-loss-locations"],
    queryFn: locationService.getInventoryLoss,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: operationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      toast.success("Adjustment created successfully");
      setIsAdding(false);
      setFormData({
        sourceLocation: "",
        destinationLocation: "",
        products: [{ product: "", quantity: "" }],
        notes: "",
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create adjustment"
      );
    },
  });

  const validateMutation = useMutation({
    mutationFn: operationService.validate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      toast.success("Adjustment validated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to validate adjustment"
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: operationService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      toast.success("Adjustment cancelled successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel adjustment"
      );
    },
  });

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: "", quantity: "" }],
    });
  };

  const handleRemoveProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.sourceLocation) {
      toast.error("Please select a source location");
      return;
    }
    if (!formData.destinationLocation) {
      toast.error("Please select a destination location (Inventory Loss)");
      return;
    }
    if (formData.products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }
    for (let i = 0; i < formData.products.length; i++) {
      if (!formData.products[i].product) {
        toast.error(`Please select a product for line ${i + 1}`);
        return;
      }
      if (
        !formData.products[i].quantity ||
        formData.products[i].quantity === 0
      ) {
        toast.error(`Please enter a valid quantity for line ${i + 1}`);
        return;
      }
    }

    const payload = {
      reference: `ADJ/${Date.now()}`,
      type: "ADJUSTMENT",
      sourceLocation: formData.sourceLocation,
      destinationLocation: formData.destinationLocation,
      lines: formData.products.map((p) => ({
        product: p.product,
        demandQuantity: parseFloat(p.quantity),
      })),
    };

    createMutation.mutate(payload);
  };

  const handleValidate = (id) => {
    if (
      window.confirm(
        "Are you sure you want to validate this adjustment? This will update stock levels."
      )
    ) {
      validateMutation.mutate(id);
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this adjustment?")) {
      cancelMutation.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      DRAFT: "bg-yellow-100 text-yellow-800",
      DONE: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loadingAdjustments) {
    return <Loading />;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Inventory Adjustments
        </h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Adjustment
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Adjustment</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sourceLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceLocation: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Source</option>
                  {internalLocations?.data?.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination (Inventory Loss){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.destinationLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationLocation: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Inventory Loss Location</option>
                  {inventoryLossLocations?.data?.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                rows="3"
                placeholder="Reason for adjustment (e.g., damaged goods, inventory count correction)"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Products <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Product
                </button>
              </div>

              {formData.products.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.product}
                    onChange={(e) =>
                      handleProductChange(index, "product", e.target.value)
                    }
                    className="flex-1 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Product</option>
                    {products?.data?.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity (+/-)"
                    value={item.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    className="w-40 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    step="1"
                    required
                  />
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="px-3 py-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Use positive numbers to increase stock, negative numbers to
                decrease stock
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? "Creating..." : "Create Adjustment"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    sourceLocation: "",
                    destinationLocation: "",
                    products: [{ product: "", quantity: "" }],
                    notes: "",
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {adjustments?.data?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No adjustments found
                </td>
              </tr>
            ) : (
              adjustments?.data?.map((adjustment) => (
                <tr key={adjustment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(adjustment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {adjustment.sourceLocation?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {adjustment.lines?.map((line, i) => (
                      <div key={i}>
                        {line.product?.name} ({line.demandQuantity > 0 ? "+" : ""}
                        {line.demandQuantity})
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {adjustment.notes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(adjustment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {adjustment.status === "DRAFT" && (
                      <>
                        <button
                          onClick={() => handleValidate(adjustment._id)}
                          disabled={validateMutation.isPending}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => handleCancel(adjustment._id)}
                          disabled={cancelMutation.isPending}
                          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
