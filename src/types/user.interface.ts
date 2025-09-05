import type { IStaff, IUserRole } from "./index";

export interface IUser {
  _id?: string;
  staff?: IStaff | string;
  username: string;
  password?: string;
  role: IUserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
