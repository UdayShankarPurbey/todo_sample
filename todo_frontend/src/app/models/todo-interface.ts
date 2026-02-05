export interface TodoInterface {
  _id: string | number;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoPayload {
  title?: string;
  description?: string;
  completed: boolean;
}

export interface TodoFormInterface {
  _id?: string | number;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
