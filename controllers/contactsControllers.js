const contactsService = require('../services/contactsServices.js');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  // res.status(204).json({
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
  const contactEdit = await contactsService.getContactById(id);

  if (!Object.keys(req.body).length) {
    throw HttpError(400, 'Body must have at least one field');
  }

  if (contactEdit) {
    const updateData = await contactsService.updateById(id, req.body);
    const concate = Object.assign(contactEdit, updateData);
    const result = await contactsService.updateById(id, concate);
    res.status(201).json(result);
  } else {
    throw HttpError(404, 'Not found');
  }
};
module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
