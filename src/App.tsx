import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// AVL Tree Node class
class AVLNode {
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  balanceFactor: number;

  constructor(value: number) {
    this.value = value;
    this.height = 1;
    this.left = null;
    this.right = null;
    this.balanceFactor = 0;
  }
}

// AVL Tree implementation
class AVLTree {
  root: AVLNode | null = null;

  height(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  updateBalanceFactors(node: AVLNode | null): void {
    if (!node) return;
    node.balanceFactor = this.height(node.left) - this.height(node.right);
    this.updateBalanceFactors(node.left);
    this.updateBalanceFactors(node.right);
  }

  balanceFactor(node: AVLNode): number {
    return this.height(node.left) - this.height(node.right);
  }

  updateHeight(node: AVLNode): void {
    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  rotateRight(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  rotateLeft(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  insert(value: number): void {
    this.root = this._insert(this.root, value);
    this.updateBalanceFactors(this.root);
  }

  _insert(node: AVLNode | null, value: number): AVLNode {
    if (!node) return new AVLNode(value);

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node;
    }

    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    // Left Left Case
    if (balance > 1 && value < node.left!.value) {
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right!.value) {
      return this.rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left!.value) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right!.value) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  delete(value: number): void {
    this.root = this._delete(this.root, value);
    this.updateBalanceFactors(this.root);
  }

  _delete(node: AVLNode | null, value: number): AVLNode | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        if (!temp) {
          return null;
        } else {
          return temp;
        }
      } else {
        let temp = this.findMin(node.right);
        node.value = temp.value;
        node.right = this._delete(node.right, temp.value);
      }
    }

    if (!node) return null;

    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    // Left Left Case
    if (balance > 1 && this.balanceFactor(node.left!) >= 0) {
      return this.rotateRight(node);
    }

    // Left Right Case
    if (balance > 1 && this.balanceFactor(node.left!) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this.balanceFactor(node.right!) <= 0) {
      return this.rotateLeft(node);
    }

    // Right Left Case
    if (balance < -1 && this.balanceFactor(node.right!) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  findMin(node: AVLNode): AVLNode {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }
}

function App() {
  const [tree] = useState(() => new AVLTree());
  const [value, setValue] = useState('');
  const [nodes, setNodes] = useState<{ x: number; y: number; value: number; balanceFactor: number }[]>([]);
  const [edges, setEdges] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);

  const drawTree = () => {
    const newNodes: { x: number; y: number; value: number; balanceFactor: number }[] = [];
    const newEdges: { x1: number; y1: number; x2: number; y2: number }[] = [];

    function calculatePositions(node: AVLNode | null, x: number, y: number, level: number) {
      if (!node) return;

      const spacing = 300 / Math.pow(2, level + 1);

      newNodes.push({ x, y, value: node.value, balanceFactor: node.balanceFactor });

      if (node.left) {
        const childX = x - spacing;
        const childY = y + 80;
        newEdges.push({ x1: x, y1: y, x2: childX, y2: childY });
        calculatePositions(node.left, childX, childY, level + 1);
      }

      if (node.right) {
        const childX = x + spacing;
        const childY = y + 80;
        newEdges.push({ x1: x, y1: y, x2: childX, y2: childY });
        calculatePositions(node.right, childX, childY, level + 1);
      }
    }

    calculatePositions(tree.root, 330, 60, 0);
    setNodes(newNodes);
    setEdges(newEdges);
  };

  useEffect(() => {
    drawTree();
  }, [tree.root, highlightedNode]);

  const handleInsert = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setHighlightedNode(num);
      tree.insert(num);
      setValue('');
      setTimeout(() => setHighlightedNode(null), 1000);
    }
  };

  const handleDelete = () => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setHighlightedNode(num);
      tree.delete(num);
      setValue('');
      setTimeout(() => setHighlightedNode(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AVL Tree Visualization</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg relative h-[500px]">
              <svg width="800" height="500" className="w-full h-full">
                <AnimatePresence>
                  {edges.map((edge, i) => (
                    <motion.line
                      key={`edge-${i}`}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke="#6366f1"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ pathLength: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {nodes.map((node) => (
                    <motion.g
                      key={`node-${node.value}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, x: node.x, y: node.y }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.text
                        x={0}
                        y={-25}
                        fill="#9333ea"
                        fontSize="14"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        BF: {node.balanceFactor}
                      </motion.text>
                      <motion.circle
                        r={20}
                        fill={node.value === highlightedNode ? '#4f46e5' : '#1f2937'}
                        stroke="#6366f1"
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                      />
                      <motion.text
                        y={5}
                        fill="#ffffff"
                        fontSize="14"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {node.value}
                      </motion.text>
                    </motion.g>
                  ))}
                </AnimatePresence>
              </svg>
            </div>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Controls</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter a number"
                  onKeyDown={(e) => { if (e.key == 'Enter') { handleInsert() } }}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleInsert}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                  >
                    Insert
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold">How it Works</h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <p>
                  An AVL tree is a self-balancing binary search tree where the height difference
                  between left and right subtrees (balance factor) cannot exceed 1.
                </p>
                <p>
                  The balance factor (BF) shown above each node is calculated as:
                  <code className="block bg-gray-700 p-2 rounded mt-2 font-mono">
                    BF = height(left subtree) - height(right subtree)
                  </code>
                </p>
                <p>
                  When |BF| {'>'} 1, the tree performs rotations to restore balance:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Left-Left Case (BF {'>'} 1): Right rotation</li>
                  <li>Right-Right Case (BF {'<'} -1): Left rotation</li>
                  <li>Left-Right Case: Left rotation + Right rotation</li>
                  <li>Right-Left Case: Right rotation + Left rotation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;