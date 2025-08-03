// Inventory Item Interface
export interface IInventory {
  _id: string;
  name: string;
  category: string;
  brand: string;
  model?: string;
  serialNumber: string;
  purchaseDate?: string;
  warrantExpiraryDate?: string;
  assignedTo: string;
  assignedDate?: string;
  status: string;
  note?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Item Category Interface
export interface IItemCategory {
  _id: string;
  categoryId: string;
  category: string;
  note?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
