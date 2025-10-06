// In-memory data store
let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' }
];

let nextId = 4;

// Get all items
const getAllItems = () => {
  return items;
};

// Get item by ID
const getItemById = (id) => {
  return items.find(item => item.id === parseInt(id));
};

// Create new item
const createItem = (itemData) => {
  const newItem = {
    id: nextId++,
    name: itemData.name,
    description: itemData.description
  };
  items.push(newItem);
  return newItem;
};

// Update item
const updateItem = (id, itemData) => {
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    items[index] = {
      id: parseInt(id),
      name: itemData.name,
      description: itemData.description
    };
    return items[index];
  }
  return null;
};

// Delete item
const deleteItem = (id) => {
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    const deletedItem = items[index];
    items.splice(index, 1);
    return deletedItem;
  }
  return null;
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
