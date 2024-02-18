const express = require('express');
const validateBody = require('../helpers/validateBody');
const schemas = require('../models/user');
// const register = require('../controllers/authControllers');
const ctrl = require('../controllers/authControllers');
const { authenticate } = require('../middlewares');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.register
);
authRouter.post('/login', validateBody(schemas.loginSchema), ctrl.login);
authRouter.get('/current', authenticate, ctrl.getCurrent);
authRouter.post('/logout', authenticate, ctrl.logout);

module.exports = authRouter;
