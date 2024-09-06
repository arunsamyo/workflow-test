import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './RunWorkFlow.css'; // Create this CSS file for custom styling
import { IconButton } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios'; 
import { postApi } from './service/api';

const RunWorkflow = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [workflowId, setWorkflowId] = useState('66dacd3223c2401a3dc43fa2');
  const [isLoading, setIsLoading] = useState(false);

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
      formData.append('workflowId', workflowId);
      formData.append('csvFile', selectedFile);

      try {
        // Send a POST request to the backend
        const response = await postApi('executeworkflow', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Workflow execution response:', response.data);
        alert('Workflow executed successfully');
      } catch (error) {
        console.error('Error executing workflow:', error);
        alert('Failed to execute workflow. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please upload a file and select a workflow.');
    }
  };

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
          </div>
        </div>
      </div>

      <div className="workflow-selection">
        <label htmlFor="workflow-select">Select Workflow Id</label>
        <select id="workflow-select" value={workflowId} onChange={handleWorkflowChange}>
          <option value="66dacd3223c2401a3dc43fa2">87aGywgfD</option>
          {/* Add more workflow options dynamically if needed */}
        </select>
      </div>

      <button onClick={handleSubmit} className="run-workflow-button" disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Workflow'}
      </button>
    </div>
  );
};

export default RunWorkflow;
