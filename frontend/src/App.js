// // eslint-disable
import React, { useCallback, useState, useEffect } from "react";
import { postApi } from "./service/api";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import debounce from "lodash.debounce"; // Import debounce from lodash
import "reactflow/dist/style.css";
import "./App.css";
import { useNavigate } from "react-router";

const saveWorkflow = async (nodes, edges, workflowName) => {
  try {
    const response = await postApi("addWorkflow", {
      name: workflowName,
      nodes: nodes,
      edges: edges,
    });
    console.log("Workflow saved:", response.data);
  } catch (error) {
    console.error("Error saving workflow:", error);
  }
};

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "Filter Data" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "default",
    data: { label: "Wait" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "default",
    data: { label: "Convert to JSON" },
    position: { x: 100, y: 200 },
  },
  {
    id: "5",
    type: "default",
    data: { label: "Send POST Request" },
    position: { x: 400, y: 200 },
  },
  {
    id: "6",
    type: "output",
    data: { label: "End" },
    position: { x: 250, y: 350 },
  },
];
const nodeTypes = {
  // Define any custom node types here if needed
};
function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const navigate = useNavigate();
  const handleResize = debounce(() => {
    console.log("Resizing elements...");
  }, 100); // Adjust the delay as needed

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const isValidNode = (node) =>
    node && node.position && typeof node.position.x === "number";
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onDragStart = useCallback((event, nodeType) => {
    event?.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = document
        .getElementById("react-flow-wrapper")
        .getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      if (nodeType && position.x !== undefined && position.y !== undefined) {
        const newNode = {
          id: `${nodeType}-${+new Date()}`,
          type: "default",
          position,
          data: { label: nodeType },
        };
        if (isValidNode(newNode)) {
          setNodes((nds) => nds.concat(newNode));
        }
      }
    },
    [setNodes]
  );

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      return changes.reduce((acc, change) => {
        const node = nds.find((n) => n.id === change.id);
        if (node) {
          return acc.map((n) => (n.id === node.id ? { ...n, ...change } : n));
        }
        return acc;
      }, nds);
    });
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      return changes.reduce((acc, change) => {
        const edge = eds.find((e) => e.id === change.id);
        if (edge) {
          return acc.map((e) => (e.id === edge.id ? { ...e, ...change } : e));
        }
        return acc;
      }, eds);
    });
  }, []);

  const handleNextPage = () => {
    navigate("/runWorkflow");
  };

  useEffect(() => {
    const resizeObserverErrSilencer = () => {
      const resizeObserverErr = window.console.error;
      window.console.error = (...args) => {
        if (
          args[0] &&
          typeof args[0] === "string" &&
          args[0].includes(
            "ResizeObserver loop completed with undelivered notifications."
          )
        ) {
          return;
        }
        resizeObserverErr(...args);
      };
    };
    resizeObserverErrSilencer();
  }, []);
  return (
    <div className="app">
      <div className="sidebar">
        <div
          className="node"
          onDragStart={(event) => onDragStart(event, "Filter Data")}
          draggable
        >
          Filter Data
        </div>
        <div
          className="node"
          onDragStart={(event) => onDragStart(event, "Wait")}
          draggable
        >
          Wait
        </div>
        <div
          className="node"
          onDragStart={(event) => onDragStart(event, "Convert Format")}
          draggable
        >
          Convert Format
        </div>
        <div
          className="node"
          onDragStart={(event) => onDragStart(event, "Send POST Request")}
          draggable
        >
          Send POST Request
        </div>
        <button onClick={handleNextPage} className="next-page-button">
          Next Page
        </button>
      </div>
      <div className="content">
        <div className="top-bar">
          <h3>Workflow Builder Screen</h3>
          <div className="workflow-info">
            <span>Workflow ID: Auto-Generated</span>
            <button
              className="save-button"
              onClick={() => saveWorkflow(nodes, edges, "My First Workflow")}
            >
              Save Workflow
            </button>
          </div>
        </div>
        <div
          id="react-flow-wrapper"
          className="workflow-canvas"
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);
