import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./RunWorkFlow.css"; // Create this CSS file for custom styling
import { IconButton } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { postApi, getApi } from "./service/api";

const RunWorkflow = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workflowId, setWorkflowId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workflowData, setWorkflowData] = useState([]);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleWorkflowChange = (e) => {
    setWorkflowId(e.target.value);
  };

  const handleSubmit = async () => {
    if (selectedFile && workflowId) {
      setIsLoading(true);
      console.log("Running Workflow ID: ", workflowId);
      console.log("File Uploaded: ", selectedFile);

      // Create a FormData object to send the CSV file and workflow ID
      const formData = new FormData();
      formData.append("workflowId", workflowId);
      formData.append("csvFile", selectedFile);

      try {
        // Send a POST request to the backend
        const response = await postApi("uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Workflow execution response:", response.data);
        alert("Workflow executed successfully");
      } catch (error) {
        console.error("Error executing workflow:", error);
        alert("Failed to execute workflow. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please upload a file and select a workflow.");
    }
  };

  const getWorkFlowLists = async () => {
    const response = await getApi(`workflowList`);
    if (response && response.status === 200) {
      setWorkflowData(response?.data);
    }
  };

  useEffect(() => {
    getWorkFlowLists();
  }, []);

  return (
    <div className="run-workflow-container">
      <h2>Run Workflow Screen</h2>

      <div className="upload-container">
        <div
          {...getRootProps({ className: "dropzone" })}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div>
            <IconButton>
              <CloudUpload fontSize="large" color="primary" />
            </IconButton>
            <input {...getInputProps()} />
          </div>
          <div>
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                Drag and drop Files Here to Upload <br /> Or Select Files to
                Upload
              </p>
            )}

            {selectedFile?.name ? `File Name :- ${selectedFile?.name}` : ""}
          </div>
        </div>
      </div>

      <div className="workflow-selection">
        <label htmlFor="workflow-select">Select Workflow Id</label>
        <select
          id="workflow-select"
          value={workflowId}
          onChange={handleWorkflowChange}
        >
          {workflowData?.map((item) => {
            return <option value={item?.uniqueId}>{item?.uniqueId}</option>;
          })}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="run-workflow-button"
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Workflow"}
      </button>
    </div>
  );
};

export default RunWorkflow;
