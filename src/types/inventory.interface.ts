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
