export interface IUser {
  _id?: string;
  staff: string;
  username: string;
  password?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
