const { User } = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const {
  ctrlWrapper,
  HttpError,
  userNameHandler,
  sendEmail,
} = require('../helpers');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
// const { updateSearchIndex } = require('../models/contact.js');
let pasPas = '';
const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, '..', 'public', 'avatars');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  pasPas = password;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    name: userNameHandler(name),
    password: hashPassword,
    avatarURL,
    verificationCode,
  });
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<p>Якщо ви бажаєте підтвердити реєстрацію клікайте за посиланням - <a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click verify email</a></p>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(401, 'Email not found');
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: '',
  });
  const verifySuccsess = {
    to: user.email,
    subject: 'Email verify succsess',
    html: `<p>Вітаємо, ${user.name}! <br>
     Ви успішно підтвердили реєстрацію. <br>
     Ваші реестраційній дані:  <br>
     email: ${user.email},  <br>
     пароль: ${pasPas}</p>`,
  };

  await sendEmail(verifySuccsess);

  res.json({ message: 'Email verify succsess' });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(401, 'Email already verify');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<p>Якщо ви бажаєте підтвердити реєстрацію клікайте за посиланням - <a target="_blank" href="${BASE_URL}/users/verify/${user.verificationCode}">Click verify email</a></p>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email send success',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: email,
      subscription: user.subscription,
    },
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email: email,
    subscription: subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).json();
};

const subscription = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const avatars = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarUrlPart = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarUrlPart });
  const avatarURL = path.join(__dirname, '..', 'public', 'avatars', filename);

  Jimp.read(avatarURL, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).quality(60).write(avatarURL);
  });

  res.json({
    avatarURL,
  });
};

module.exports = {
  verifyEmail: ctrlWrapper(verifyEmail),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  avatars: ctrlWrapper(avatars),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
