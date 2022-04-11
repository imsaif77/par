const express = require('express');
const router = express.Router();
const securityUtils = require('../common/securityUtils')

router.post('/generateencryption',securityUtils.generateencryption);
router.get('/eccdecryption',securityUtils.eccdecryption);

module.exports = router;