const contactsService = require('../services/contactsServices.js');
const HttpError = require('../helpers/HttpError.js');

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    message: 'Delete success',
  });
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateById(id, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

module.exports = {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};
