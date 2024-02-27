const Contact = require('../models/contact');
const { ctrlWrapper } = require('../helpers');
exports.home = (req, res) => {
  res.status(200).render('home', {
    title: 'Contacts Home',
    active: 'home',
  });
};

exports.contacts = ctrlWrapper(async (req, res) => {
  const results = await Contact.find().populate();
  res.status(200).render('contacts', {
    title: 'Contacts List',
    active: 'contacts',
    results,
  });
});
