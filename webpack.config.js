const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  entry: {
    app: ["./server.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "server.bundle.js"
  },
  externals: [nodeExternals()],
};