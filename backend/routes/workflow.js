const express = require("express");
const {
  saveWorkflow,
  executeWorkflow,
  getWorkflow,
} = require("../controller/workflow");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/addWorkflow", saveWorkflow);
router.get("/workflowList", getWorkflow);
router.post("/uploadFile", upload.single("csvFile"), executeWorkflow);

module.exports = router;
