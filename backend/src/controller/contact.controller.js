import Contact from "../model/contact.model.js";

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { type } = req.query; // 'VENDOR' or 'CUSTOMER'
    const query = type ? { type } : {};
    const contacts = await Contact.find(query);
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
