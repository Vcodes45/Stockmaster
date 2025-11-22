import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { operationService } from "../services/operation.service";
import { productService } from "../services/product.service";
import { contactService } from "../services/contact.service";
import { locationService } from "../services/location.service";
import Loading from "../components/Loading";

export default function Receipts() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    contact: "",
    sourceLocation: "",
    destinationLocation: "",
    products: [{ product: "", quantity: "" }],
  });

  // Queries
  const { data: receipts, isLoading: loadingReceipts } = useQuery({
    queryKey: ["receipts"],
    queryFn: operationService.getReceipts,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: contactService.getVendors,
  });

  const { data: internalLocations } = useQuery({
    queryKey: ["internal-locations"],
    queryFn: locationService.getInternal,
  });

  const { data: vendorLocations } = useQuery({
    queryKey: ["vendor-locations"],
    queryFn: () => locationService.getAll({ type: "VENDOR" }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: operationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt created successfully");
      setIsAdding(false);
      setFormData({
        contact: "",
        sourceLocation: "",
        destinationLocation: "",
        products: [{ product: "", quantity: "" }],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create receipt");
    },
  });

  const validateMutation = useMutation({
    mutationFn: operationService.validate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt validated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to validate receipt"
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: operationService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      toast.success("Receipt cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel receipt");
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
    if (!formData.contact) {
      toast.error("Please select a vendor");
      return;
    }
    if (!formData.sourceLocation) {
      toast.error("Please select a source location");
      return;
    }
    if (!formData.destinationLocation) {
      toast.error("Please select a destination location");
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
        formData.products[i].quantity <= 0
      ) {
        toast.error(`Please enter a valid quantity for line ${i + 1}`);
        return;
      }
    }

    const payload = {
      reference: `REC/${Date.now()}`,
      type: "RECEIPT",
      partner: formData.contact,
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
        "Are you sure you want to validate this receipt? This will move stock."
      )
    ) {
      validateMutation.mutate(id);
    }
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this receipt?")) {
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

  if (loadingReceipts) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Receipts</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Receipt
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Receipt</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors?.data?.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sourceLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, sourceLocation: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Source</option>
                  {vendorLocations?.data?.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.destinationLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      destinationLocation: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Destination</option>
                  {internalLocations?.data?.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
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
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
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
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? "Creating..." : "Create Receipt"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setFormData({
                    contact: "",
                    sourceLocation: "",
                    destinationLocation: "",
                    products: [{ product: "", quantity: "" }],
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receipts?.data?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No receipts found
                </td>
              </tr>
            ) : (
              receipts?.data?.map((receipt) => (
                <tr key={receipt._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(receipt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receipt.partner?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {receipt.lines?.map((line, i) => (
                      <div key={i}>
                        {line.product?.name} ({line.demandQuantity})
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(receipt.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {receipt.status === "DRAFT" && (
                      <>
                        <button
                          onClick={() => handleValidate(receipt._id)}
                          disabled={validateMutation.isPending}
                          className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                        >
                          Validate
                        </button>
                        <button
                          onClick={() => handleCancel(receipt._id)}
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
