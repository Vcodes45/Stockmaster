const mongoose = require("mongoose");
import Operation from "../models/Operation.js";
import StockQuant from "../models/StockQuant.js";
import StockLedger from "../models/StockLedger.js";

exports.createOperation = async (req, res) => {
  try {
    // status defaults to DRAFT
    const operation = await Operation.create(req.body);
    res.status(201).json(operation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOperations = async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const operations = await Operation.find(query)
      .populate("sourceLocation")
      .populate("destinationLocation")
      .populate("lines.product");

    res.status(200).json(operations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// THE MOST IMPORTANT FUNCTION IN THE SYSTEM
exports.validateOperation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const operation = await Operation.findById(id).session(session);

    if (!operation) throw new Error("Operation not found");
    if (operation.status === "DONE")
      throw new Error("Operation already validated");

    // Process each line item in the operation
    for (const line of operation.lines) {
      const qty =
        line.doneQuantity > 0 ? line.doneQuantity : line.demandQuantity;

      // 1. Decrement Source Location (if not a vendor/virtual infinite source)
      // We use upsert to create the record if it doesn't exist (e.g. negative stock allowed settings)
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
    res
      .status(200)
      .json({ message: "Operation validated and stock updated", operation });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};
