const { Router } = require('express');

const viewController = require('../controllers/viewController');

const router = Router();

router.get('/home', viewController.home);
router.get('/contacts', viewController.contacts);

module.exports = router;
