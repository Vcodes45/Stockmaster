import { Location } from "../models/location.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const createLocation = asyncHandler(async (req, res) => {
  const { name, type, address } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required");
  }

  const validTypes = ["INTERNAL", "CUSTOMER", "VENDOR", "INVENTORY_LOSS", "VIEW"];
  if (!validTypes.includes(type)) {
    throw new ApiError(400, `Type must be one of: ${validTypes.join(", ")}`);
  }

  const location = await Location.create({
    name,
    type,
    address,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, location, "Location created successfully"));
});

const getLocations = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const query = {};
  if (type) {
    const validTypes = ["INTERNAL", "CUSTOMER", "VENDOR", "INVENTORY_LOSS", "VIEW"];
    if (!validTypes.includes(type)) {
      throw new ApiError(400, `Type must be one of: ${validTypes.join(", ")}`);
    }
    query.type = type;
  }

  const locations = await Location.find(query).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, locations, "Locations fetched successfully"));
});

export { createLocation, getLocations };
