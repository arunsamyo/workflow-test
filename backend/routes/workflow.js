const express = require('express');
const {
  saveWorkflow,
  executeWorkflow,
} = require('../controller/workflow');
const upload = require('../utils/multer');

const router = express.Router();

router.post('/saveworkflow', saveWorkflow);   
router.post('/executeworkflow', upload.single('csvFile'), executeWorkflow);


module.exports = router;
