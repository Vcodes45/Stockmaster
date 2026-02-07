import { Contact } from "../models/contact.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, type, email, phone, address } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required");
  }

  if (!['VENDOR', 'CUSTOMER'].includes(type)) {
    throw new ApiError(400, "Type must be either VENDOR or CUSTOMER");
  }

  const contact = await Contact.create({
    name,
    type,
    email,
    phone,
    address,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Contact created successfully"));
});

const getContacts = asyncHandler(async (req, res) => {
  const { type } = req.query; // 'VENDOR' or 'CUSTOMER'
  
  const query = {};
  if (type) {
    if (!['VENDOR', 'CUSTOMER'].includes(type)) {
      throw new ApiError(400, "Type must be either VENDOR or CUSTOMER");
    }
    query.type = type;
  }

  const contacts = await Contact.find(query).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});

export { createContact, getContacts };
