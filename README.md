# AVL Tree Visualization 🌳

A beautiful, interactive visualization tool for understanding AVL tree operations and balancing algorithms. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Interactive Tree Visualization**: Real-time visualization of AVL tree structure
- **Node Operations**: 
  - Insert new nodes
  - Delete existing nodes
- **Balance Factor Display**: Shows balance factor for each node
- **Auto-Balancing**: Visualizes tree balancing operations
- **Educational Content**: Includes theoretical concepts and explanations
- **Dark Theme**: Easy on the eyes with a beautiful dark mode interface

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aarontoms/AVL-Tree-Balancing.git
```

2. Navigate to the project directory:
```bash
cd avl-tree-balancing
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```
5. Open your browser and visit `http://localhost:5173`

## 🎮 Usage Guide 💡

### Inserting Nodes
1. Enter a number in the input field
2. Click the "Insert" button or press Enter
3. Watch as the tree automatically rebalances if needed

### Deleting Nodes
1. Enter the number you want to delete
2. Click the "Delete" button
3. Observe the tree restructuring and rebalancing

### Understanding Balance Factors
- Each node displays its balance factor (BF) above it
- BF = height(left subtree) - height(right subtree)
- When |BF| > 1, the tree performs rotations to restore balance

### 🔄 AVL Tree Balancing

The visualization demonstrates four types of rotations:

1. **Left Rotation**: When right subtree becomes higher
2. **Right Rotation**: When left subtree becomes higher
3. **Left-Right Rotation**: For complex left-side imbalances
4. **Right-Left Rotation**: For complex right-side imbalances

Balance Factor = Height of Left Subtree - Height of Right Subtree

## 🛠️ Technical Details

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Build Tool**: Vite

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/featurnew`)
3. Commit your changes (`git commit -m 'Add some featurenew'`)
4. Push to the branch (`git push origin feature/featurenew`)
5. Open a Pull Request
