const Workflow = require("../model/workflowModel");
const csvUtils = require("../utils/csvUtils");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const csvParser = require("csv-parser");
const commonUtils = require("../utils/constant");
const generateUniqueId = require("../utils/generateUniqueId");

exports.saveWorkflow = async (req, res) => {
  const { nodes, edges, name } = req.body;

  try {
    const uniqueId = generateUniqueId(9);
    const newWorkflow = new Workflow({
      nodes,
      edges,
      name,
      uniqueId,
    });

    await newWorkflow.save();
    res.status(201).json(newWorkflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkflow = async (req, res) => {
  try {
    const workflows = await Workflow.find();

    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.executeWorkflow = async (req, res) => {
  const { workflowId } = req.body;
  console.log("req.body", req.body);
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const workflow = await Workflow.findOne({ uniqueId: workflowId });
    console.log("workflow", workflow);
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const filePath = file.path;
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        console.log("CSV Data parsed:", data);

        let processedData = data;

        for (const node of workflow.nodes) {
          switch (node.data.label) {
            case "Filter Data":
              processedData = csvUtils.filterDataToLower(
                processedData,
                commonUtils.name
              );
              console.log("Filtered Data:", processedData);
              break;

            case "Wait":
              await new Promise((resolve) => setTimeout(resolve, 60000));
              break;

            case "Convert to JSON":
              processedData = csvUtils.convertToJson(processedData);
              console.log("Converted Data (JSON):", processedData);
              break;

            case "Send POST Request":
              await axios.post("https://requestcatcher.com/", processedData);
              console.log("POST request sent");
              break;

            default:
              console.log(`Unknown step: ${node.data.label}`);
          }
        }

        fs.unlinkSync(filePath);

        res.json({
          message: "Workflow executed successfully",
          data: processedData,
        });
      });
  } catch (error) {
    console.error("Error executing workflow:", error);
    res.status(500).json({ message: error.message });
  }
};
