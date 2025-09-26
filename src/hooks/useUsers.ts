import { UserService } from "@/services/user.services";
import { User, UserRole } from "@/types/user";

export interface CreateUserRequest {
  companyName: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface CreateUserResponse {
  user: User;
  errorMessage: string;
}

export const useUsers = () => {
  const userService = new UserService();

  const createUser = async (data: CreateUserRequest) => {
    return await userService.create(data);
  };

  return {
    createUser,
  };
};
