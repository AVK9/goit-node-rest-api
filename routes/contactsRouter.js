const express = require('express');
const ctrl = require('../controllers/contactsControllers.js');
const validateBody = require('../helpers/validateBody');
const schemas = require('../schemas');
const { isValId } = require('../middlewares');

const contactsRouter = express.Router();

contactsRouter.get('/', ctrl.getAllContacts);
contactsRouter.get('/:id', isValId, ctrl.getOneContact);
contactsRouter.delete('/:id', ctrl.deleteContact);

contactsRouter.post(
  '/',
  validateBody(schemas.createContactSchema),
  ctrl.createContact
);

contactsRouter.put(
  '/:id',
  validateBody(schemas.updateContactSchema),
  isValId,
  ctrl.updateContact
);
contactsRouter.patch(
  '/:id/favorite',
  validateBody(schemas.updateFavoriteSchema),
  isValId,
  ctrl.updateFavorite
);

module.exports = contactsRouter;
