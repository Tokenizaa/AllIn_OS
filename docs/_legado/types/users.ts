export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: 'admin' | 'user' | 'distributor';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFormData {
  email: string;
  fullName?: string;
  role?: 'admin' | 'user' | 'distributor';
  password?: string;
}
