export interface IStaff {
  _id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department?: string;
  joinedDate?: string;
  resignedDate?: string;
  status: string;
  note?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
