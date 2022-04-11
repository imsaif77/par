const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');

router.get('/generatemnemonics', generateController.generatemnemonics);
router.get('/converthex', generateController.converthex);

module.exports = router;