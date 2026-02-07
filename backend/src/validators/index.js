import { body, param } from "express-validator";

// ============================================
// USER VALIDATORS
// ============================================

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").trim().optional(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").trim().optional().isEmail().withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old password is required"),
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("New password is required"),
  ];
};

// ============================================
// PRODUCT VALIDATORS
// ============================================

const createProductValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("sku")
      .trim()
      .notEmpty()
      .withMessage("SKU is required")
      .isLength({ min: 2 })
      .withMessage("SKU must be at least 2 characters"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("Invalid category ID"),
    body("unitOfMeasure").optional().trim(),
    body("minStockLevel")
      .optional()
      .isNumeric()
      .withMessage("Must be a number"),
    body("costPrice").optional().isNumeric().withMessage("Must be a number"),
    body("salesPrice").optional().isNumeric().withMessage("Must be a number"),
    body("initialStock").optional().isNumeric().withMessage("Must be a number"),
    body("initialStockLocationId")
      .optional()
      .isMongoId()
      .withMessage("Invalid location ID"),
  ];
};

const productIdValidator = () => {
  return [param("id").isMongoId().withMessage("Invalid product ID")];
};

// ============================================
// CATEGORY VALIDATORS
// ============================================

const createCategoryValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required")
      .isLength({ min: 2 })
      .withMessage("Category name must be at least 2 characters"),
    body("description").optional().trim(),
  ];
};

const updateCategoryValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category name cannot be empty")
      .isLength({ min: 2 })
      .withMessage("Category name must be at least 2 characters"),
    body("description").optional().trim(),
  ];
};

const categoryIdValidator = () => {
  return [param("id").isMongoId().withMessage("Invalid category ID")];
};

// ============================================
// CONTACT VALIDATORS
// ============================================

const createContactValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Contact name is required"),
    body("type")
      .notEmpty()
      .withMessage("Contact type is required")
      .isIn(["VENDOR", "CUSTOMER"])
      .withMessage("Type must be either VENDOR or CUSTOMER"),
    body("email").optional().trim().isEmail().withMessage("Invalid email format"),
    body("phone").optional().trim(),
    body("address").optional().trim(),
  ];
};

// ============================================
// LOCATION VALIDATORS
// ============================================

const createLocationValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Location name is required"),
    body("type")
      .notEmpty()
      .withMessage("Location type is required")
      .isIn(["INTERNAL", "CUSTOMER", "VENDOR", "INVENTORY_LOSS", "VIEW"])
      .withMessage(
        "Type must be one of: INTERNAL, CUSTOMER, VENDOR, INVENTORY_LOSS, VIEW"
      ),
    body("address").optional().trim(),
  ];
};

// ============================================
// OPERATION VALIDATORS
// ============================================

const createOperationValidator = () => {
  return [
    body("reference")
      .trim()
      .notEmpty()
      .withMessage("Operation reference is required"),
    body("type")
      .notEmpty()
      .withMessage("Operation type is required")
      .isIn(["RECEIPT", "DELIVERY", "INTERNAL_TRANSFER", "ADJUSTMENT"])
      .withMessage(
        "Type must be one of: RECEIPT, DELIVERY, INTERNAL_TRANSFER, ADJUSTMENT"
      ),
    body("partner").optional().isMongoId().withMessage("Invalid partner ID"),
    body("sourceLocation")
      .notEmpty()
      .withMessage("Source location is required")
      .isMongoId()
      .withMessage("Invalid source location ID"),
    body("destinationLocation")
      .notEmpty()
      .withMessage("Destination location is required")
      .isMongoId()
      .withMessage("Invalid destination location ID"),
    body("scheduledDate").optional().isISO8601().withMessage("Invalid date format"),
    body("lines")
      .isArray({ min: 1 })
      .withMessage("At least one line item is required"),
    body("lines.*.product")
      .notEmpty()
      .withMessage("Product is required for each line")
      .isMongoId()
      .withMessage("Invalid product ID"),
    body("lines.*.demandQuantity")
      .notEmpty()
      .withMessage("Demand quantity is required")
      .isNumeric()
      .withMessage("Demand quantity must be a number")
      .custom((value) => value > 0)
      .withMessage("Demand quantity must be greater than 0"),
    body("lines.*.doneQuantity")
      .optional()
      .isNumeric()
      .withMessage("Done quantity must be a number")
      .custom((value) => value >= 0)
      .withMessage("Done quantity cannot be negative"),
  ];
};

const operationIdValidator = () => {
  return [param("id").isMongoId().withMessage("Invalid operation ID")];
};

// ============================================
// EXPORTS
// ============================================

export {
  // User validators
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  // Product validators
  createProductValidator,
  productIdValidator,
  // Category validators
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
  // Contact validators
  createContactValidator,
  // Location validators
  createLocationValidator,
  // Operation validators
  createOperationValidator,
  operationIdValidator,
};
