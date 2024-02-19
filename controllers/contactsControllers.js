const Contact = require('../models/contact');
const { ctrlWrapper, HttpError } = require('../helpers');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'name email');
  if (favorite) {
    const favoriteFiltr = result.filter(contact => contact.favorite === true);
    return res.status(200).json(favoriteFiltr);
  }

  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json({
    message: 'Delete success',
  });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contactEdit = await Contact.findById(id);

  if (contactEdit) {
    const concate = Object.assign(contactEdit, req.body);
    const result = await Contact.findByIdAndUpdate(id, concate, { new: true });
    res.status(201).json(result);
  } else {
    throw HttpError(404, 'Not found');
  }
};
const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(201).json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
