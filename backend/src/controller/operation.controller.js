import mongoose from "mongoose";
import { Operation } from "../models/operation.model.js";
import { StockQuant } from "../models/stockQuant.model.js";
import { StockLedger } from "../models/stockLedger.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const createOperation = asyncHandler(async (req, res) => {
  const {
    reference,
    type,
    partner,
    sourceLocation,
    destinationLocation,
    scheduledDate,
    lines,
  } = req.body;

  if (!reference || !type || !sourceLocation || !destinationLocation) {
    throw new ApiError(
      400,
      "Reference, type, source location, and destination location are required"
    );
  }

  const validTypes = ["RECEIPT", "DELIVERY", "INTERNAL_TRANSFER", "ADJUSTMENT"];
  if (!validTypes.includes(type)) {
    throw new ApiError(400, `Type must be one of: ${validTypes.join(", ")}`);
  }

  if (!lines || lines.length === 0) {
    throw new ApiError(400, "At least one line item is required");
  }

  // Check for duplicate reference
  const existingOperation = await Operation.findOne({ reference });
  if (existingOperation) {
    throw new ApiError(409, "Operation with this reference already exists");
  }

  const operation = await Operation.create({
    reference,
    type,
    partner,
    sourceLocation,
    destinationLocation,
    scheduledDate,
    lines,
    status: "DRAFT",
  });

  const populatedOperation = await Operation.findById(operation._id)
    .populate("sourceLocation")
    .populate("destinationLocation")
    .populate("partner")
    .populate("lines.product");

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedOperation, "Operation created successfully")
    );
});

const getOperations = asyncHandler(async (req, res) => {
  const { type, status } = req.query;

  const query = {};
  if (type) {
    const validTypes = [
      "RECEIPT",
      "DELIVERY",
      "INTERNAL_TRANSFER",
      "ADJUSTMENT",
    ];
    if (!validTypes.includes(type)) {
      throw new ApiError(400, `Type must be one of: ${validTypes.join(", ")}`);
    }
    query.type = type;
  }

  if (status) {
    const validStatuses = ["DRAFT", "READY", "DONE", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Status must be one of: ${validStatuses.join(", ")}`
      );
    }
    query.status = status;
  }

  const operations = await Operation.find(query)
    .populate("sourceLocation")
    .populate("destinationLocation")
    .populate("partner")
    .populate("lines.product")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, operations, "Operations fetched successfully"));
});

// THE MOST IMPORTANT FUNCTION IN THE SYSTEM
const validateOperation = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const operation = await Operation.findById(id).session(session);

    if (!operation) {
      throw new ApiError(404, "Operation not found");
    }

    if (operation.status === "DONE") {
      throw new ApiError(400, "Operation already validated");
    }

    if (operation.status === "CANCELLED") {
      throw new ApiError(400, "Cannot validate a cancelled operation");
    }

    if (!operation.lines || operation.lines.length === 0) {
      throw new ApiError(400, "Operation has no line items to process");
    }

    // Process each line item in the operation
    for (const line of operation.lines) {
      const qty =
        line.doneQuantity > 0 ? line.doneQuantity : line.demandQuantity;

      if (qty <= 0) {
        throw new ApiError(
          400,
          "Quantity must be greater than 0 for all line items"
        );
      }

      // 1. Decrement Source Location
      await StockQuant.findOneAndUpdate(
        { product: line.product, location: operation.sourceLocation },
        { $inc: { quantity: -qty } },
        { upsert: true, new: true, session }
      );

      // 2. Increment Destination Location
      await StockQuant.findOneAndUpdate(
        { product: line.product, location: operation.destinationLocation },
        { $inc: { quantity: qty } },
        { upsert: true, new: true, session }
      );

      // 3. Create Ledger Entry (Audit Log)
      await StockLedger.create(
        [
          {
            product: line.product,
            quantity: qty,
            sourceLocation: operation.sourceLocation,
            destinationLocation: operation.destinationLocation,
            operationReference: operation.reference,
            date: new Date(),
          },
        ],
        { session }
      );
    }

    // 4. Update Operation Status
    operation.status = "DONE";
    await operation.save({ session });

    await session.commitTransaction();

    const updatedOperation = await Operation.findById(id)
      .populate("sourceLocation")
      .populate("destinationLocation")
      .populate("partner")
      .populate("lines.product");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedOperation,
          "Operation validated and stock updated successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const cancelOperation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const operation = await Operation.findById(id);

  if (!operation) {
    throw new ApiError(404, "Operation not found");
  }

  if (operation.status === "DONE") {
    throw new ApiError(400, "Cannot cancel a validated operation");
  }

  if (operation.status === "CANCELLED") {
    throw new ApiError(400, "Operation is already cancelled");
  }

  operation.status = "CANCELLED";
  await operation.save();

  const updatedOperation = await Operation.findById(id)
    .populate("sourceLocation")
    .populate("destinationLocation")
    .populate("partner")
    .populate("lines.product");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedOperation, "Operation cancelled successfully")
    );
});

export { createOperation, getOperations, validateOperation, cancelOperation };