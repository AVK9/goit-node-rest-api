const express = require('express');
const ctrl = require('../controllers/contactsControllers.js');
const validateBody = require('../helpers/validateBody');
const schemas = require('../schemas');
const { isValId, authenticate } = require('../middlewares');

const contactsRouter = express.Router();

contactsRouter.get('/', authenticate, ctrl.getAllContacts);
contactsRouter.get('/:id', authenticate, isValId, ctrl.getOneContact);
contactsRouter.delete('/:id', authenticate, isValId, ctrl.deleteContact);

contactsRouter.post(
  '/',
  validateBody(schemas.createContactSchema),
  authenticate,
  ctrl.createContact
);

contactsRouter.put(
  '/:id',
  validateBody(schemas.updateContactSchema),
  authenticate,
  isValId,
  ctrl.updateContact
);
contactsRouter.patch(
  '/:id/favorite',
  validateBody(schemas.updateFavoriteSchema),
  authenticate,
  isValId,
  ctrl.updateFavorite
);

module.exports = contactsRouter;
