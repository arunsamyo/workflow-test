const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  nodes: {
    type: Array,  // Array of nodes (steps)
    required: true,
  },
  edges: {
    type: Array,  // Array of connections (edges)
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Workflow', workflowSchema);
