const express = require('express');
const validateBody = require('../helpers/validateBody');
const schemas = require('../models/user');
const ctrl = require('../controllers/authControllers');
const { authenticate, upload } = require('../middlewares');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(schemas.registerSchema),
  ctrl.register
);
authRouter.post('/login', validateBody(schemas.loginSchema), ctrl.login);
authRouter.get('/current', authenticate, ctrl.getCurrent);
authRouter.post('/logout', authenticate, ctrl.logout);
authRouter.patch(
  '/',
  authenticate,
  validateBody(schemas.subscriptionSchema),
  ctrl.subscription
);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  // upload.array("avatar", 9)
  // upload.fields([{name: "avatar", maxCount: 1}], [{name: "addavatar", maxCount: 2}])
  ctrl.avatars
);

module.exports = authRouter;
