import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  // Check if category with same name already exists for this user
  const existingCategory = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    owner: req.user._id
  });
  
  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }

  const category = await Category.create({
    name,
    description,
    owner: req.user._id,
  });

  const categoryResponse = category.toObject();
  categoryResponse.productCount = 0;

  return res
    .status(201)
    .json(
      new ApiResponse(201, categoryResponse, "Category created successfully")
    );
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();

  const categoryIds = categories.map((category) => category._id);
  let productCounts = [];

  if (categoryIds.length > 0) {
    productCounts = await Product.aggregate([
      { $match: { category: { $in: categoryIds }, owner: req.user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
  }

  const countMap = productCounts.reduce((acc, item) => {
    acc[item._id.toString()] = item.count;
    return acc;
  }, {});

  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    productCount: countMap[category._id.toString()] || 0,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categoriesWithCounts,
        "Categories fetched successfully"
      )
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, owner: req.user._id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findOne({ _id: id, owner: req.user._id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if new name conflicts with existing category
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id },
      owner: req.user._id
    });
    
    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }

  if (name) category.name = name;
  if (description !== undefined) category.description = description;

  await category.save();

  const productCount = await Product.countDocuments({ category: category._id, owner: req.user._id });

  const categoryResponse = category.toObject();
  categoryResponse.productCount = productCount;

  return res
    .status(200)
    .json(
      new ApiResponse(200, categoryResponse, "Category updated successfully")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id, owner: req.user._id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if any products are using this category
  const productsCount = await Product.countDocuments({ category: id, owner: req.user._id });

  if (productsCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete category. ${productsCount} product(s) are using this category`
    );
  }

  await category.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export { 
  createCategory, 
  getCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
};
