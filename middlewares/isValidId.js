const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid Id`));
  }
  next();
};
module.exports = isValId;
